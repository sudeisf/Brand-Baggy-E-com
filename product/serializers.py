from .models import Product ,ProductImage ,ProductReview , FavoriteProduct , Category , ProductSize ,ProductVariants
from rest_framework import serializers
from django.contrib.auth import get_user_model
from cloudinary.models import CloudinaryField


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
    class Meta:
        model = ProductImage
        fields = '__all__'


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
        fields = ['id', 'stock', 'price', 'sku', 'size']

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
    catagory = CatagorySerializer(source='category', read_only=True)  
    size  = ProductSizeSerializer(read_only=True )
    variants  = ProductVariantSerializer(many = True , read_only= True)
    main_image = serializers.ImageField(read_only=True)

    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'main_image', 'size', 'brand', 'catagory', 'images', 'reviews', 'variants' , 
        ]

    def get_average_rating(self, obj):
        return obj.get_average_rating()
    

class CreateProductSerializer(serializers.Serializer):

    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), required=True)
    name = serializers.CharField(max_length=200, required=True)
    description = serializers.CharField(required=True, allow_blank=True)
    in_stock = serializers.BooleanField(default=True)
    main_image = serializers.ImageField(required = True)
    brand = serializers.CharField(max_length=200, required=False, allow_blank=True)
    model_number = serializers.CharField(max_length=200, required=False, allow_blank=True)
    product_code = serializers.CharField(max_length=200, required=False, allow_blank=True)
    
    quantity = serializers.IntegerField(min_value=0, required=True)
    images = ProductImageSerializer(many=True, required=False)
    variants = ProductVariantSerializer(many=True, required=False)


    def validate(self, data):
        variants = data.get('variants', [])
        quantity = data.get('quantity')
        product_id = data.get('product_id')

        if variants:
            total_stock = sum(variant['stock'] for variant in variants)
            if total_stock > quantity:
                raise serializers.ValidationError(
                    "Total stock of variants cannot exceed the product quantity."
                )

        return data
    
    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        variants_data = validated_data.pop('variants', [])
        product = Product.objects.create(**validated_data)

        for image_data in images_data:
            if not image_data.get('image'):
                raise serializers.ValidationError("Each image must have an image URL.")
            ProductImage.objects.create(product=product, **image_data)

        for variant_data in variants_data:
            size_data = variant_data.pop('size')
            stock_number = variant_data.get('stock')
            if not size_data.get('name') or not size_data.get('code'):
                raise serializers.ValidationError("Invalid size data.")
            if stock_number < 1:
                raise serializers.ValidationError('invliad number of stocks')
            size, _ = ProductSize.objects.get_or_create(**size_data)
            ProductVariants.objects.create(product=product, size=size,stock = stock_number, **variant_data)
        return product

class ListProductSerializer(serializers.Serializer):
    pass

class UpdateProductSerializer(serializers.Serializer):
    pass

class DeleteProdctSerilizer(serializers.Serializer):
    pass
    
    




    