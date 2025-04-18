from .models import Product ,ProductImage ,ProductReview , FavoriteProduct , Category , ProductSize ,ProductVariants
from rest_framework import serializers
from django.contrib.auth import get_user_model


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
    

# class ProductSizeSelectSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = ProductSize
#         Field = '__all__'
    
    
    
    




    