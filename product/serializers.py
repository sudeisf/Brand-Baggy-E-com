from .models import Product ,ProductImage ,ProductReview , FavoriteProduct , Category , ProductSize ,ProductVariants
from rest_framework import serializers
from django.contrib.auth import get_user_model


User = get_user_model()

class ProductSerialier(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
    
class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = '__all__'


class FavoriteProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = FavoriteProduct
        fields = '__all__'

class ProductSizeSerializer(serializers.Serializer):
    is_favourited  = serializers.SerializerMethodField()

    def get_is_favourited(self ,obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
             return FavoriteProduct.objects.filter(user=request.user, product=obj).exists()
        return False
    
    class Meta:
        model = ProductSize
        fields = ['id' , 'name' ,'code']

class ProductVariantSerializer(serializers.Serializer):
    class Meta:
        model = ProductVariants
        fields = ['id' , 'price' , 'stock' , 'size' ]

class ProductReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only = True)
    class Meta:
        model = ProductReview
        fields = '__all__'

class CatagorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductDetailSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    reviews = ProductReviewSerializer(many=True, read_only=True)
    catagory = CatagorySerializer(source='category', read_only=True)  
    size  = ProductSizeSerializer(many=True ,read_only=True )

    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'size', 'brand', 'catagory', 'images', 'reviews', 
        ]

    def get_average_rating(self, obj):
        return obj.get_average_rating()
    
   
 
        
    

    
    
    
    




    