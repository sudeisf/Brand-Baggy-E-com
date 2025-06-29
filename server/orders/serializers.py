from rest_framework import serializers
from .models import Order , OrderItem ,ShippingInfo



class ShippingInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingInfo
        exclude = ['id', 'created_at']


from cloudinary import CloudinaryImage

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    varients = serializers.CharField(source='product.variants.size', read_only=True)
    main_image = serializers.SerializerMethodField()
    description = serializers.CharField(source="product.description",read_only=True)
    product_id = serializers.CharField(source="product.id",read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product_name',"product_id","varients", 'price', 'subtotal', 'quantity' ,"main_image", "description"]

    def get_main_image(self,obj):
        if obj.product.main_image:
            public_id = str(obj.product.main_image)
            return CloudinaryImage(public_id).build_url(secure=True)

class OrderSerializer(serializers.ModelSerializer):
    shipping_info = ShippingInfoSerializer()
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'cart', 'total_price', 'status', 'order_date', 'shipping_info', 'items']
        read_only_fields = ['status', 'order_date', 'items']

class OrderDetailSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)  
    class Meta:
        model = Order
        fields = ['id', "status" , "order_date" ,"items"]


class createOrderSerializer(serializers.Serializer):
    """create serializer"""
    shipping_address = serializers.CharField()
    shipping_city = serializers.CharField()
    shipping_state = serializers.CharField()
    shipping_zip_code = serializers.CharField()
    shipping_country = serializers.CharField()
    shipping_phone =serializers.CharField()
    shipping_email = serializers.EmailField()
    guest_email= serializers.CharField()
  


class GetOrderSerializer(serializers.Serializer):
    pass


class ListUserOrdersSerializer(serializers.Serializer):
    pass


class UpdateOrderSerializer(serializers.Serializer):
    pass


class CancelOrderSerializer(serializers.Serializer):
    pass 

class UpdateOrderItemStatusSerializer(serializers.Serializer):
    pass

class AdminOrderListViewSerializer(serializers.Serializer):
    pass