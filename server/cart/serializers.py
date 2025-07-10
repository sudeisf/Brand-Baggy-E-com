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
    discount_type = serializers.SerializerMethodField()
    discount_value = serializers.DecimalField(source='discount_amount', max_digits=10, decimal_places=2)
    final_price = serializers.DecimalField(max_digits=10, decimal_places=2)
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = [
            'id', 'name', 'price', 'main_image', 'quantity', 'size',
            'discount_type', 'discount_value', 'final_price', 'subtotal'
        ]

    def get_discount_type(self, obj):
        return obj.discount.discount_type if obj.discount else None

    def get_subtotal(self, obj):
        return obj.final_price * obj.quantity

    def get_main_image(self, obj):
        if obj.product.main_image:
            public_id = str(obj.product.main_image)
            return CloudinaryImage(public_id).build_url(secure=True)
        return None



class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total = serializers.SerializerMethodField()
    
    class Meta:
        model = Cart
        fields = ['id', 'items' ,'total']

    def get_total(self, obj):
        return sum(item.final_price * item.quantity for item in obj.items.all())



from decimal import Decimal
class AddCartItemSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)
    size = serializers.CharField()

    def validate_size(self, value):
        if not value.strip():
            raise serializers.ValidationError("Size is required.")
        return value

    def validate(self, data):
        product_id = data.get('product_id')
        size = data.get('size')
        quantity = data.get('quantity')

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            raise serializers.ValidationError("Product does not exist.")

        if not product.in_stock:
            raise serializers.ValidationError("Product is out of stock.")

        # Check variant stock
        try:
            variant = product.variants.get(size__name=size)
        except product.variants.model.DoesNotExist:
            raise serializers.ValidationError(f"Size '{size}' not available for this product.")

        if quantity > variant.stock:
            raise serializers.ValidationError(f"Only {variant.stock} items available in size '{size}'.")

        data['product'] = product 
        return data

    def create(self, validated_data):
        user = self.context['request'].user
        product = validated_data['product']
        size = validated_data['size']
        quantity = validated_data['quantity']

        cart, _ = Cart.objects.get_or_create(user=user)

        discount = product.active_discount
        discount_amount = discount.calcualteDiscount(product.price) if discount else Decimal("0.00")
        final_price = product.price - discount_amount

        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            size=size,
            defaults={
                'quantity': quantity,
                'discount': discount,
                'discount_amount': discount_amount,
                'final_price': final_price
            }
        )

        if not created:
            cart_item.quantity += quantity
            cart_item.discount = discount
            cart_item.discount_amount = discount_amount
            cart_item.final_price = final_price
            cart_item.save()

        return cart_item

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


    

        
