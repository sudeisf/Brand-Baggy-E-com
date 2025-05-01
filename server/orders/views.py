from django.shortcuts import render
from  . models import Order , OrderItem
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import createOrderSerializer
from rest_framework.permissions import IsAuthenticated , IsAuthenticatedOrReadOnly
from cart.models import Cart , CartItems
from django.db import transaction
from orders.serializers import OrderSerializer


class CreateOrderView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def post(self , request):
        serializer = createOrderSerializer(request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer._validated_data

        cart_id = data['cart_id']
        try:
            cart  = Cart.objects.get(id=cart_id)
        except Cart.DoesNotExist:
            return Response({'detail' : "cart not found"})
        
        if not cart.items.exist():
            return Response({'detail' : "cart is empty"})
        
        total_price = sum([item.product.price * item.quantity for item in cart.items.all()])

        with transaction.atomic():
            order = Order.objects.create(
                user=request.user if request.user.is_authenticated else None,
                guest_email=data.get('guest_email'),
                cart=cart,
                total_price=total_price,
                status=Order.OrderStatus.PENDING,
                payment_status=Order.PaymentStatus.PENDING,  
                payment_method='not_selected',  
                transaction_id='',
                transaction_number=0, 
                shipping_address=data['shipping_address'],
                shipping_city=data['shipping_city'],
                shipping_state=data['shipping_state'],
                shipping_zip_code=data['shipping_zip_code'],
                shipping_country=data['shipping_country'],
                shipping_phone=data['shipping_phone'],
                shipping_email=data.get('shipping_email'),
            )

            for cart_item in cart.item.all():
                OrderItem.objects.create(
                    order=order,
                    product=cart_item.product,
                    variants=cart_item.variants,
                    price=cart_item.product.price,
                    subtotal=cart_item.product.price * cart_item.quantity,
                    quantity=cart_item.quantity,
                )

            cart.items.all().delete()
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
        
    



