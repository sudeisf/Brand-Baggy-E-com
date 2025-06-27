from .models import Cart , CartItem
from django.contrib.auth import get_user_model
from rest_framework import serializers
from product.models import Product
from .utils import get_or_create_cart
from cloudinary import CloudinaryImage

User = get_user_model()

class CartItemSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='product.name')
    price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2)
    main_image = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['id', 'name', 'price', 'main_image', 'quantity', 'size']

    def get_main_image(self, obj):
        if obj.product.main_image:
            public_id = str(obj.product.main_image)
            return CloudinaryImage(public_id).build_url(secure=True)
        return None

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'items']

class AddCartItemSerializer(serializers.Serializer):
     product_id = serializers.IntegerField()
     quantity = serializers.IntegerField(min_value=1)
     size = serializers.CharField()

     def validate_size(self, value):
      
         if not value or value.strip() == "":
             print("Validation error: Size is required.")
             raise serializers.ValidationError("Size is required.")
         return value

     def validate_product_id(self , value):
     
         try:
            product  = Product.objects.get(id=value)
        
         except Product.DoesNotExist:
             
             raise serializers.ValidationError('product does not exisit')
         return value
     
     def create(self, validated_data):
         request = self.context['request']
         cart, _ = Cart.objects.get_or_create(user=request.user)
         product = Product.objects.get(id=validated_data['product_id'])
         size = validated_data['size']
         cartItem, created = CartItem.objects.get_or_create(
             cart = cart,
             product = product,
             size = size,
             defaults={'quantity' : validated_data['quantity']}
         )

         if not created:
             cartItem.quantity += validated_data['quantity']
             cartItem.save()
             print(f"Updated CartItem quantity: {cartItem.quantity}")

         return cartItem

class RemoveCartItemSerializer(serializers.Serializer):
    cart_item_id = serializers.IntegerField()

    def validate_cartItemId(self,values):
         try:
             cartItem = CartItem.objects.get(id=values)
         except CartItem.DoesNotExist:
             raise serializers.ValidationError('cart item does not exist')
         return values
    
    def create(self, validated_data):
        cart_item_id = validated_data['cart_item_id']
        CartItem.objects.filter(cart_item_id).delete()
        return {'message' : 'item removed'}
    
class UpdateCartItemSerializer(serializers.ModelSerializer):
    quantity = serializers.IntegerField()
    class Meta:
        model = CartItem
        fields  = ['id' , 'quantity' , 'size']

    def validate(self, data):
        errors = {}
        if 'quantity' not in data or data['quantity'] is None:
            errors['quantity'] = "Quantity is required."
        elif data['quantity'] < 1:
            errors['quantity'] = "Quantity must be at least 1."
        if errors:
            raise serializers.ValidationError(errors)
        return data


    

        
