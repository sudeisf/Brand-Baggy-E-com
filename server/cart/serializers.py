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
     discount_value = serializers.CharField(required=False, allow_blank=True)
     discount_type = serializers.CharField(required=False, allow_blank=True)
     discount_start_date = serializers.CharField(required=False, allow_blank=True)
     discount_end_date = serializers.CharField(required=False, allow_blank=True)
     discount_is_valid = serializers.BooleanField(required=False)
     discount_is_active = serializers.BooleanField(required=False)

     def validate_size(self, value):
         if not value or value.strip() == "":
             print("Validation error: Size is required.")
             raise serializers.ValidationError("Size is required.")
         return value

     def validate_product_id(self, value):
         try:
            product = Product.objects.get(id=value)
         except Product.DoesNotExist:
             raise serializers.ValidationError('product does not exist')
         return value
     
     def validate_quantity(self, value):
         product_id = self.initial_data.get('product_id')
         size = self.initial_data.get('size')
         
         if product_id and size:
             try:
                 product = Product.objects.get(id=product_id)
                 if not product.in_stock:
                     raise serializers.ValidationError("Product is out of stock")
                 
                 try:
                     variant = product.variants.get(size__name=size)
                     if value > variant.stock:
                         raise serializers.ValidationError(f"Only {variant.stock} items available in size {size}")
                 except product.variants.model.DoesNotExist:
                     raise serializers.ValidationError(f"Size {size} not available for this product")
             except Product.DoesNotExist:
                 pass
         
         return value
     
     def validate_discount_type(self, value):
         if value and value not in ['fixed_amount', 'percentage']:
             raise serializers.ValidationError("Discount type must be 'fixed_amount' or 'percentage'")
         return value
     
     def validate_discount_value(self, value):
         if value:
             try:
                 float(value)
             except ValueError:
                 raise serializers.ValidationError("Discount value must be a valid number")
         return value
     
     def validate_discount_start_date(self, value):
         if value:
             try:
                 from datetime import datetime
                 dt = datetime.fromisoformat(value.replace('Z', '+00:00'))
                 return dt.date()
             except ValueError:
                 raise serializers.ValidationError("Invalid date format. Use ISO datetime format")
         return None
     
     def validate_discount_end_date(self, value):
         if value:
             try:
                 from datetime import datetime
                 dt = datetime.fromisoformat(value.replace('Z', '+00:00'))
                 return dt.date()
             except ValueError:
                 raise serializers.ValidationError("Invalid date format. Use ISO datetime format")
         return None
     
     def validate(self, data):
         discount_start = data.get('discount_start_date')
         discount_end = data.get('discount_end_date')
         
         if discount_start and discount_end and discount_start > discount_end:
             raise serializers.ValidationError("Discount start date cannot be after end date")
         
         return data
     
     def create(self, validated_data):
         request = self.context['request']
         cart, _ = Cart.objects.get_or_create(user=request.user)
         product = Product.objects.get(id=validated_data['product_id'])
         size = validated_data['size']
         
         discount_data = {
             'discount_value': validated_data.get('discount_value'),
             'discount_type': validated_data.get('discount_type'),
             'discount_start_date': validated_data.get('discount_start_date'),
             'discount_end_date': validated_data.get('discount_end_date'),
             'discount_is_valid': validated_data.get('discount_is_valid'),
             'discount_is_active': validated_data.get('discount_is_active'),
         }
         
         cartItem, created = CartItem.objects.get_or_create(
             cart=cart,
             product=product,
             size=size,
             defaults={
                 'quantity': validated_data['quantity'],
                 **discount_data
             }
         )

         if not created:
             cartItem.quantity += validated_data['quantity']
             for key, value in discount_data.items():
                 if value is not None:
                     setattr(cartItem, key, value)
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


    

        
