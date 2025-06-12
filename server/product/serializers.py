import json
from .models import Product ,ProductImage ,ProductReview , FavoriteProduct , Category , ProductSize ,ProductVariants
from rest_framework import serializers
from django.contrib.auth import get_user_model
from cloudinary.models import CloudinaryField
from accounts.serializer import UserSerializer


User = get_user_model()

class ProductReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only = True)
    class Meta:
        model = ProductReview
        fields = '__all__'

class CatagorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    class Meta:
        model = ProductImage
        fields = ['image'] 

    def get_image(self, obj):
        return obj.image.url if obj.image else None

class FavoriteProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = FavoriteProduct
        fields = '__all__'

class ProductSizeSerializer(serializers.ModelSerializer):
    is_favourited  = serializers.SerializerMethodField()

    def get_is_favourited(self ,obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
             return FavoriteProduct.objects.filter(user=request.user, product=obj).exists()
        return False
    
    class Meta:
        model = ProductSize
        fields = ['id' , 'name' ,'code' , 'is_favourited']



class ProductVariantSerializer(serializers.ModelSerializer):
    size  = ProductSizeSerializer()
    class Meta:
        model = ProductVariants
        fields = ['id', 'stock', 'sku', 'size']

class ProductSerialier(serializers.ModelSerializer):
    variants = ProductVariantSerializer(many=True)
    class Meta:
        model = Product
        fields = '__all__'

    def create(self, validated_data):
        variants_data = validated_data.pop('variants')
        product = Product.objects.create(**validated_data)
        for variant in variants_data:
            ProductVariants.objects.create(product=product, **variant)
        return product
    
class ProductDetailSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    reviews = ProductReviewSerializer(many=True, read_only=True)
    category = CatagorySerializer( read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    main_image = serializers.SerializerMethodField()
    seller = UserSerializer(read_only=True)
    # average_rating = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'main_image', 'brand', 'category',
            'images', 'reviews', 'variants' , 'seller'
        ]

    def get_main_image(self, obj):
        return obj.main_image.url if obj.main_image else None


class CreateProductSerializer(serializers.Serializer):
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), required=True)
    name = serializers.CharField(max_length=200, required=True)
    description = serializers.CharField(required=True, allow_blank=True)
    in_stock = serializers.BooleanField(default=True)
    stcok = serializers.IntegerField(default = 0)
    main_image = serializers.ImageField(required=True)
    brand = serializers.CharField(max_length=200, required=False, allow_blank=True)
    model_number = serializers.CharField(max_length=200, required=False, allow_blank=True)
    product_code = serializers.CharField(max_length=200, required=False, allow_blank=True)
    price = serializers.DecimalField(max_digits=10, decimal_places=2)
    quantity = serializers.IntegerField(min_value=0, required=True)
    images = serializers.ListField(
        child=serializers.ImageField(allow_empty_file=False, use_url=False),
        required=False,
        allow_empty=True
    )
    variants = serializers.JSONField(required=False)

    def validate(self, data):
        variants = data.get('variants', [])
        quantity = data.get('quantity')

        if variants:
            total_stock = sum(variant.get('stock', 0) for variant in variants)
            if total_stock > quantity:
                raise serializers.ValidationError(
                    "Total stock of variants cannot exceed the product quantity."
                )

        return data
    
    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        variants_data = validated_data.pop('variants', [])
        request  = self.context.get('request')
        seller = request.user
    
        if isinstance(variants_data, str):
            try:
                variants_data = json.loads(variants_data)
            except json.JSONDecodeError:
                raise serializers.ValidationError("Invalid variants JSON format")

      
        product = Product.objects.create(seller= seller ,**validated_data)

        for image_data in images_data:
            ProductImage.objects.create(product=product, image=image_data)

        for variant_data in variants_data:
            size_data = variant_data.pop('size', {})
            stock = variant_data.pop('stock', 0)  
            
            if not size_data.get('name') or not size_data.get('code'):
                raise serializers.ValidationError("Size name and code are required")
            
            if stock < 1:
                raise serializers.ValidationError("Stock must be at least 1")
                
            size, _ = ProductSize.objects.get_or_create(**size_data)
            
            ProductVariants.objects.create(
                product=product,
                size=size,
                stock=stock,
                **variant_data  
            )
            
        return product
    
class SellerProductListSerializer(serializers.ModelSerializer):
    category = CatagorySerializer(read_only=True)
    main_image_url = serializers.SerializerMethodField()
    total_variants = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'price',
            'quantity',
            'in_stock',
            'category',
            'main_image_url',
            'created_at',
            'total_variants'
        ]
    
    def get_main_image_url(self, obj):
        return obj.main_image.url if obj.main_image else None
    
    def get_total_variants(self, obj):
        return obj.variants.count()
      

class UpdateProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        feilds = [
            'name',
            'description',
            'price',
            'quantity',
            'in_stock',
            'brand',
            'model_number',
            'product_code',
            'main_image'  # Only image field that can be updated
        ]
        extra_kwargs = {
            # All fields optional for partial updates
            'name': {'required': False},
            'description': {'required': False},
            'price': {'required': False, 'min_value': 0.01},
            'quantity': {'required': False, 'min_value': 0},
            'main_image': {
                'required': False,
                'write_only': True  # Never show in API responses
            },
            'in_stock' :{'required': False},
            'brand' : {'required': False},
            'model_number' : {'required': False},
            'product_code' : {'required': False}
        }

        def update(self, instance, validated_data):
            """Handle partial updates with image replacement"""
            new_image = validated_data.pop('main_image', None)
            
            # Update all other fields
            instance = super().update(instance, validated_data)
            
            # Handle image replacement if provided
            if new_image:
                if instance.main_image:  # Delete old image if exists
                    instance.main_image.delete()
                instance.main_image = new_image
                instance.save()
            
            return instance

    
    




    