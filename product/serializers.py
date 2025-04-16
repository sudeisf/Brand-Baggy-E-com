from .models import Product ,ProductImage ,ProductReview , FavoriteProduct
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class ProductSerialier(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
    
class ProdcutImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = '__all__'

class ProductDetailSerializer(serializers.ModelSerializer):
     images = ProdcutImageSerializer(many = True , read_only = True)
     class Meta:
        model = Product
        fields= '__all__'
    
 
        
    

    
    
    
    




    