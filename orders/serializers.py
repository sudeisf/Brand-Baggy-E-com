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
    pass


class GetOrderSerializer(serializers.Serializer):
    pass


class ListUserOrdersSerializer :
    pass


class UpdateOrderSerializer(serializers.Serializer):
    pass


class CancelOrderSerializer(serializers.Serializer):
    pass 

class UpdateOrderItemStatusSerializer(serializers.Serializer):
    pass

class AdminOrderListViewSerializer(serializers.Serializer):
    pass