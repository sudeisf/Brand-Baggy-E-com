import json
from .models import Discount, Product, ProductDiscount ,ProductImage, ProductLocation ,ProductReview , FavoriteProduct , Category , ProductSize ,ProductVariants
from rest_framework import serializers
from django.contrib.auth import get_user_model
from cloudinary.models import CloudinaryField
from accounts.serializer import UserSerializer
from django.utils import timezone


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

class ProductDiscountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discount
        fields = [
            'discount_type',
            'value',
            'start_date',
            'end_date',
            'is_active',
            'usage_limit',
            'time_used'
        ]


class SellerProductDetailSerializer(serializers.ModelSerializer):
    product_size = ProductSizeSerializer(read_only=True)
    discount = serializers.SerializerMethodField()
    variants = ProductVariantSerializer(many=True, read_only=True)
    category = CatagorySerializer(read_only=True)

    class Meta:
        model = Product
        fields = [ 
            'id', 'name', 'description', 'main_image', 'brand', 'category',
            'product_size', 'discount', 'variants', 'seller'
        ]
    
    def get_discount(self, obj):
        latest_discount_link = obj.discount.order_by('-created_at').first()
        if latest_discount_link and latest_discount_link.discount:
            return ProductDiscountSerializer(latest_discount_link.discount).data
        return None
    
    


class CreateProductSerializer(serializers.ModelSerializer):
    name = serializers.CharField(max_length=20, required=True)
    description = serializers.CharField(max_length=255, required=True)
    price = serializers.DecimalField(max_digits=10, decimal_places=2)
    quantity = serializers.IntegerField(required = True)
    main_image = serializers.ImageField(required=True)
    gender = serializers.ChoiceField(choices=Product.Gender.choices, required=False)
    images = serializers.ListField(
        child=serializers.ImageField(),
        required=True
    )
    brand = serializers.CharField(max_length=200, required=False, allow_blank=True)
    model_number = serializers.CharField(max_length=200, required=False, allow_blank=True)
    product_code = serializers.CharField(max_length=200, required=False, allow_blank=True)
    variants = serializers.JSONField(required=False)
    discount_value = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    discount_type = serializers.ChoiceField(choices=Discount.DiscountType.choices, required=False)
    discount_start_date = serializers.DateTimeField(required=False)
    discount_end_date = serializers.DateTimeField(required=False)

    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), required=True)
    product_location = serializers.CharField(max_length=100, required=True)

    class Meta:
        model = Product
        fields = [
            'name', 'description', 'price', 'quantity', 'main_image', 'gender',
            'images', 'brand', 'model_number', 'product_code', 'variants',
            'discount_value', 'discount_type', 'discount_start_date', 'discount_end_date',
            'category', 'product_location'
        ]

    def validate_product_location(self, value):
        location, _ = ProductLocation.objects.get_or_create(name=value)
        return location
    def validate(self, data):
        variants = data.get('variants', [])
        quantity = data.get('quantity', 0)  
        if variants:
            total_stock = sum(variant.get('stock', 0) for variant in variants)
            print(total_stock)
            print(quantity)
            if total_stock > quantity:
                raise serializers.ValidationError(
                    "Total stock of variants cannot exceed the product stock quantity."
                )
        if data.get('discount_value') and (not data.get('discount_start_date') or not data.get('discount_end_date')):
            raise serializers.ValidationError("Discount start and end dates are required if discount value is provided.")
        return data

    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        variants_data = validated_data.pop('variants', [])
        discount_value = validated_data.pop('discount_value', None)
        discount_type = validated_data.pop('discount_type', None)
        discount_start_date = validated_data.pop('discount_start_date', None)
        discount_end_date = validated_data.pop('discount_end_date', None)
        request = self.context.get('request')
        seller = request.user

        if isinstance(variants_data, str):
            try:
                variants_data = json.loads(variants_data)
            except json.JSONDecodeError:
                raise serializers.ValidationError("Invalid variants JSON format")

        product = Product.objects.create(seller=seller, **validated_data)

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

        if discount_value and discount_type and discount_start_date and discount_end_date:
            discount = Discount.objects.create(
                name=f"Discount for {product.name}",
                description=f"Auto-generated discount for {product.name}",
                discount_type=discount_type,
                value=discount_value,
                start_date=discount_start_date,
                end_date=discount_end_date,
                is_active=True
            )
            ProductDiscount.objects.create(product=product, discount=discount)
        return product
# from cloudinary import CloudinaryImage
# class SellerProductListSerializer(serializers.ModelSerializer):
#     main_image = serializers.SerializerMethodField(read_only=True)
#     product_location = serializers.SerializerMethodField(read_only=True)
#     category = serializers.SerializerMethodField(read_only=True)
    
#     class Meta:
#         model = Product
#         fields = [
#             'id',
#             'name',
#             'price',
#             'quantity',
#             'in_stock',
#             'main_image',
#             'product_location',
#             'slug',
#             'category'
#         ]
        
#     def get_main_image(self, obj):
#         if obj.main_image:
#             return CloudinaryImage(obj.main_image).build_url(secure=True)
        
#     def get_category(self,obj):
#         if obj.category:
#             return {
#                 'id': obj.category.id,
#                 'name': obj.category.name,
#                 'parent': {
#                     'id': obj.category.parent.id,
#                     'name': obj.category.parent.name
#                 } if obj.category.parent else None
#             }
#         return None
    
#     def get_product_location(self,obj):
#         return obj.product_location.name if obj.product_location else None
      

class UpdateProductSerializer(serializers.ModelSerializer):
    discount_value = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    discount_type = serializers.ChoiceField(choices=Discount.DiscountType.choices, required=False)
    discount_start_date = serializers.DateTimeField(required=False)
    discount_end_date = serializers.DateTimeField(required=False)
    is_active = serializers.BooleanField(required=False)
    product_location = serializers.CharField(max_length=100, required=False)

    class Meta:
        model = Product
        fields = [
            'name',
            'description',
            'price',
            'quantity',
            'in_stock',
            'brand',
            'model_number',
            'product_code',
            'main_image',
            'gender',
            'product_location',
            'discount_value',
            'discount_type',
            'discount_start_date',
            'discount_end_date',
            'is_active'
        ]
        extra_kwargs = {
            'name': {'required': False},
            'description': {'required': False},
            'price': {'required': False, 'min_value': 0.01},
            'quantity': {'required': False, 'min_value': 0},
            'main_image': {
                'required': False,
                'write_only': True 
            },
            'in_stock': {'required': False},
            'brand': {'required': False},
            'model_number': {'required': False},
            'product_code': {'required': False},
            'gender': {'required': False}
        }

    def validate_product_location(self, value):
        location, _ = ProductLocation.objects.get_or_create(name=value)
        return location

    def update(self, instance, validated_data):
        """Handle partial updates with image replacement and discount management"""
        discount_value = validated_data.pop('discount_value', None)
        discount_type = validated_data.pop('discount_type', None)
        discount_start_date = validated_data.pop('discount_start_date', None)
        discount_end_date = validated_data.pop('discount_end_date', None)
        is_active = validated_data.pop('is_active', None)
        new_image = validated_data.pop('main_image', None)

        instance = super().update(instance, validated_data)
        if new_image:
            if instance.main_image: 
                instance.main_image.delete()
            instance.main_image = new_image
            instance.save()

        if any([discount_value, discount_type, discount_start_date, discount_end_date, is_active is not None]):
            latest_discount_link = instance.discount.order_by('-created_at').first()
            
            if latest_discount_link and latest_discount_link.discount:
                discount = latest_discount_link.discount
                if discount_value is not None:
                    discount.value = discount_value
                if discount_type is not None:
                    discount.discount_type = discount_type
                if discount_start_date is not None:
                    discount.start_date = discount_start_date
                if discount_end_date is not None:
                    discount.end_date = discount_end_date
                if is_active is not None:
                    discount.is_active = is_active
                discount.save()
            else:
                discount = Discount.objects.create(
                    name=f"Discount for {instance.name}",
                    description=f"Auto-generated discount for {instance.name}",
                    discount_type=discount_type or Discount.DiscountType.PERCENTAGE,
                    value=discount_value or 0,
                    start_date=discount_start_date,
                    end_date=discount_end_date,
                    is_active=is_active if is_active is not None else True
                )
                ProductDiscount.objects.create(product=instance, discount=discount)
        return instance
import json
from .models import Discount, Product, ProductDiscount ,ProductImage, ProductLocation ,ProductReview , FavoriteProduct , Category , ProductSize ,ProductVariants
from rest_framework import serializers
from django.contrib.auth import get_user_model
from cloudinary.models import CloudinaryField
from accounts.serializer import UserSerializer
from django.utils import timezone


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

class ProductPublicSerializer(serializers.ModelSerializer):
    main_image = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'description' , "main_image"]
    
    def get_main_image(self,obj):
        if obj.main_image:
            public_id = str(obj.main_image)
            return CloudinaryImage(public_id).build_url(secure=True)
        return None

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
    images = serializers.SerializerMethodField(read_only=True)
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
            'images', 'reviews', 'variants' , 'seller' ,'price'
        ]

    def get_main_image(self, obj):
        if obj.main_image:
            public_id = str(obj.main_image)
            return CloudinaryImage(public_id).build_url(secure=True)
        
    def get_images(self, obj):
        images = obj.images.all()
        return [self._build_cloudinary_url(image.image) for image in images]
    
    def _build_cloudinary_url(self, image_field):
        if image_field:
            public_id = str(image_field)
            return CloudinaryImage(public_id).build_url(secure=True)
        return None


class ProductDiscountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discount
        fields = [
            'discount_type',
            'value',
            'start_date',
            'end_date',
            'is_active',
            'usage_limit',
            'time_used'
        ]

class ProductLoactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductLocation
        fields = '__all__'

class SellerProductDetailSerializer(serializers.ModelSerializer):
    discount = serializers.SerializerMethodField()
    variants = ProductVariantSerializer(many=True, read_only=True)
    category = CatagorySerializer(read_only=True)
    product_location = ProductLoactionSerializer(read_only=True)

    class Meta:
        model = Product
        fields = [ 
            'id', 'name', 'description','model_number',"product_code" ,
            'main_image', 'brand',"" 'category','price','gender',
            'quantity','discount', 'variants', 'seller', "product_location"
        ]
    
    def get_discount(self, obj):
        latest_discount_link = obj.discount.order_by('-created_at').first()
        if latest_discount_link and latest_discount_link.discount:
            return ProductDiscountSerializer(latest_discount_link.discount).data
        return None
    
    


class CreateProductSerializer(serializers.ModelSerializer):
    name = serializers.CharField(max_length=20, required=True)
    description = serializers.CharField(max_length=255, required=True)
    price = serializers.DecimalField(max_digits=10, decimal_places=2)
    quantity = serializers.IntegerField(required = True)
    main_image = serializers.ImageField(required=True)
    gender = serializers.ChoiceField(choices=Product.Gender.choices, required=False)
    images = serializers.ListField(
        child=serializers.ImageField(),
        required=True
    )
    brand = serializers.CharField(max_length=200, required=False, allow_blank=True)
    model_number = serializers.CharField(max_length=200, required=False, allow_blank=True)
    product_code = serializers.CharField(max_length=200, required=False, allow_blank=True)
    variants = serializers.JSONField(required=False)
    discount_value = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    discount_type = serializers.ChoiceField(choices=Discount.DiscountType.choices, required=False)
    discount_start_date = serializers.DateTimeField(required=False)
    discount_end_date = serializers.DateTimeField(required=False)

    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), required=True)
    product_location = serializers.CharField(max_length=100, required=True)

    class Meta:
        model = Product
        fields = [
            'name', 'description', 'price', 'quantity', 'main_image', 'gender',
            'images', 'brand', 'model_number', 'product_code', 'variants',
            'discount_value', 'discount_type', 'discount_start_date', 'discount_end_date',
            'category', 'product_location'
        ]

    def validate_product_location(self, value):
        location, _ = ProductLocation.objects.get_or_create(name=value)
        return location
    def validate(self, data):
        variants = data.get('variants', [])
        quantity = data.get('quantity', 0)  
        if variants:
            total_stock = sum(variant.get('stock', 0) for variant in variants)
            print(total_stock)
            print(quantity)
            if total_stock > quantity:
                raise serializers.ValidationError(
                    "Total stock of variants cannot exceed the product stock quantity."
                )
        if data.get('discount_value') and (not data.get('discount_start_date') or not data.get('discount_end_date')):
            raise serializers.ValidationError("Discount start and end dates are required if discount value is provided.")
        return data

    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        variants_data = validated_data.pop('variants', [])
        discount_value = validated_data.pop('discount_value', None)
        discount_type = validated_data.pop('discount_type', None)
        discount_start_date = validated_data.pop('discount_start_date', None)
        discount_end_date = validated_data.pop('discount_end_date', None)
        request = self.context.get('request')
        seller = request.user

        if isinstance(variants_data, str):
            try:
                variants_data = json.loads(variants_data)
            except json.JSONDecodeError:
                raise serializers.ValidationError("Invalid variants JSON format")

        product = Product.objects.create(seller=seller, **validated_data)

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

        if discount_value and discount_type and discount_start_date and discount_end_date:
            discount = Discount.objects.create(
                name=f"Discount for {product.name}",
                description=f"Auto-generated discount for {product.name}",
                discount_type=discount_type,
                value=discount_value,
                start_date=discount_start_date,
                end_date=discount_end_date,
                is_active=True
            )
            ProductDiscount.objects.create(product=product, discount=discount)
        return product
    
from cloudinary import CloudinaryImage
class SellerProductListSerializer(serializers.ModelSerializer):
    main_image = serializers.SerializerMethodField(read_only=True)
    product_location = serializers.SerializerMethodField(read_only=True)
    category = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'price',
            'quantity',
            'in_stock',
            'main_image',
            'product_location',
            'slug',
            'category'
        ]
    def get_main_image(self, obj):
        if obj.main_image:
            public_id = str(obj.main_image)
            return CloudinaryImage(public_id).build_url(secure=True)
        return None
    def get_category(self,obj):
        if obj.category:
            return {
                'id': obj.category.id,
                'name': obj.category.name,
                'parent' : {
                    "id" : obj.category.parent.id,
                    "name" : obj.category.parent.name
                }
            } if obj.category.parent else None
        return None
    
    def get_product_location(self,obj):
        return obj.product_location.name if obj.product_location else None
      

class UpdateProductSerializer(serializers.ModelSerializer):
    discount_value = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    discount_type = serializers.ChoiceField(choices=Discount.DiscountType.choices, required=False)
    discount_start_date = serializers.DateTimeField(required=False)
    discount_end_date = serializers.DateTimeField(required=False)
    is_active = serializers.BooleanField(required=False)
    product_location = serializers.CharField(max_length=100, required=False)

    class Meta:
        model = Product
        fields = [
            'name',
            'description',
            'price',
            'quantity',
            'in_stock',
            'brand',
            'model_number',
            'product_code',
            'gender',
            'product_location',
            'discount_value',
            'discount_type',
            'discount_start_date',
            'discount_end_date',
            'is_active'
        ]
        extra_kwargs = {
            'name': {'required': False},
            'description': {'required': False},
            'price': {'required': False, 'min_value': 0.01},
            'quantity': {'required': False, 'min_value': 0},
            'in_stock': {'required': False},
            'brand': {'required': False},
            'model_number': {'required': False},
            'product_code': {'required': False},
            'gender': {'required': False}
        }

    def validate_product_location(self, value):
        location, _ = ProductLocation.objects.get_or_create(name=value)
        return location

    def update(self, instance, validated_data):
        """Handle partial updates with image replacement and discount management"""
        discount_value = validated_data.pop('discount_value', None)
        discount_type = validated_data.pop('discount_type', None)
        discount_start_date = validated_data.pop('discount_start_date', None)
        discount_end_date = validated_data.pop('discount_end_date', None)
        is_active = validated_data.pop('is_active', None)
        
        instance = super().update(instance, validated_data)

        if any([discount_value, discount_type, discount_start_date, discount_end_date, is_active is not None]):
            latest_discount_link = instance.discount.order_by('-created_at').first()
            
            if latest_discount_link and latest_discount_link.discount:
                discount = latest_discount_link.discount
                if discount_value is not None:
                    discount.value = discount_value
                if discount_type is not None:
                    discount.discount_type = discount_type
                if discount_start_date is not None:
                    discount.start_date = discount_start_date
                if discount_end_date is not None:
                    discount.end_date = discount_end_date
                if is_active is not None:
                    discount.is_active = is_active
                discount.save()
            else:
                discount = Discount.objects.create(
                    name=f"Discount for {instance.name}",
                    description=f"Auto-generated discount for {instance.name}",
                    discount_type=discount_type or Discount.DiscountType.PERCENTAGE,
                    value=discount_value or 0,
                    start_date=discount_start_date,
                    end_date=discount_end_date,
                    is_active=is_active if is_active is not None else True
                )
                ProductDiscount.objects.create(product=instance, discount=discount)
        return instance

    
    




    