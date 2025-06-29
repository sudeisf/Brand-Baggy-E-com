from django.shortcuts import render
from  . models import Order , OrderItem
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import createOrderSerializer
from rest_framework.permissions import IsAuthenticated , IsAuthenticatedOrReadOnly
from cart.models import Cart , CartItem
from django.db import transaction
from orders.serializers import OrderSerializer , ShippingInfoSerializer,OrderDetailSerializer
from decimal import Decimal


class CreateOrderAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        shipping_serializer = ShippingInfoSerializer(data=request.data.get('shipping_info'))
        if not shipping_serializer.is_valid():
            return Response(shipping_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        shipping_info = shipping_serializer.save(user=user)

        try:
            cart = Cart.objects.get(user=user)
            cart_items = cart.items.all()
        except Cart.DoesNotExist:
            return Response({'detail': 'Cart not found.'}, status=status.HTTP_404_NOT_FOUND)

        if not cart_items:
            return Response({'detail': 'Cart is empty.'}, status=status.HTTP_400_BAD_REQUEST)

       
        total = Decimal('0.00')
        for item in cart_items:
            total += item.product.price * item.quantity

        
        order = Order.objects.create(
            user=user,
            cart=cart,
            total_price=total,
            shipping_info=shipping_info,
            status=Order.OrderStatus.PENDING
        )

       
        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=item.product,
                price=item.product.price,
                quantity=item.quantity,
                subtotal=item.product.price * item.quantity
            )

        cart.items.all().delete()
        serializer = OrderSerializer(order)
        return Response({
            'id': order.id,
            'order': serializer.data
        }, status=status.HTTP_201_CREATED)
    


class UserOrderListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user).order_by('-created_at')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
     
class GetOrderItemAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        pk = request.query_params.get("order_id")
        print("User:", request.user)
        print("Order ID:", pk)

        if not pk:
            return Response({"detail": "Order ID missing."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            order = Order.objects.get(id=pk, user=request.user)  # ✅ Corrected
        except Order.DoesNotExist:
            return Response({"detail": "Order not found for this user."}, status=status.HTTP_404_NOT_FOUND)

        serializer = OrderDetailSerializer(order)
        return Response(serializer.data, status=status.HTTP_200_OK)





