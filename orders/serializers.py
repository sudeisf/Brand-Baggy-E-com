from rest_framework import serializers
from .models import Order , OrderItem




class OrderItemsSerializer(serializers.ModelSerializer):
    class Meta:
        model  = OrderItem
        field = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        field = '__all__'


class createOrderSerializer(serializers.Serializer):
    """create serializer"""
    shipping_address = serializers.CharField()
    shipping_city = serializers.CharField()
    shipping_state = serializers.CharField()
    shipping_zip_code = serializers.CharField()
    shipping_country = serializers.CharField()
    shipping_phone =serializers.CharField()
    shipping_email = serializers.EmailField()
    #guest email
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