from .models import Product ,ProductImage ,ProductReview , FavoriteProduct , Category
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
    catagory = CatagorySerializer(source='category', read_only=True)  # Note the 'catagory' field here
    # average_rating = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'brand', 'catagory', 'images', 'reviews', 
        ]

    def get_average_rating(self, obj):
        return obj.get_average_rating()
 
        
    

    
    
    
    




    