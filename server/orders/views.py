from django.shortcuts import render

from payment.models import Payment
from  . models import Order , OrderItem
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import createOrderSerializer
from rest_framework.permissions import IsAuthenticated , IsAuthenticatedOrReadOnly
from cart.models import Cart , CartItem
from django.db import transaction
from orders.serializers import OrderSerializer ,PaymentAndOrderStatusSerializer, ShippingInfoSerializer,OrderDetailSerializer,OrderTableSerializer,SellerOrderDetailsSerializer
from decimal import Decimal
from notifications.utils import send_notifications



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
        
        serializer = OrderSerializer(order)

        notified_sellers = set()
        for item in cart_items:
            seller_user = item.product.seller
            if seller_user.id not in notified_sellers:
                message = f"New order #{order.id} placed for ${total} by {user.get_full_name() or user.username}"
                send_notifications(seller_user, message, notification_type="ORDER")
                notified_sellers.add(seller_user.id)

        cart.items.all().delete()

        Payment.objects.create(
            order=order,
            amount=total,
            status=Payment.Status.PENDING
        )

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

        if not pk:
            return Response({"detail": "Order ID missing."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            order = Order.objects.get(id=pk, user=request.user)  
        except Order.DoesNotExist:
            return Response({"detail": "Order not found for this user."}, status=status.HTTP_404_NOT_FOUND)

        serializer = OrderDetailSerializer(order)
        return Response(serializer.data, status=status.HTTP_200_OK)

class AdminOrderTableAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        orders = Order.objects.select_related('user', 'cart').prefetch_related('cart__items').all()
        serializer = OrderTableSerializer(orders, many=True)
        return Response(serializer.data)


import logging

logger = logging.getLogger(__name__)

class PaymentAndOrderStatusUpdate(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        serializer = PaymentAndOrderStatusSerializer(data=request.data)
        if not serializer.is_valid():
            logger.error(f"Validation error: {serializer.errors}")
            return Response({"detail": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        order_id = serializer.validated_data.get("order_id")
        payment_status = serializer.validated_data.get("payment_status")
        order_status = serializer.validated_data.get("order_status")

        try:
            order = Order.objects.get(id=order_id)
            updates = {}

            with transaction.atomic():
                if payment_status:
                    payment = getattr(order, "payment", None)
                    if payment is None:
                        logger.error(f"No payment record found for order ID {order_id}")
                        return Response(
                            {"detail": "Payment record not found for this order"},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                    payment.status = payment_status
                    payment.save()
                    updates["payment_status"] = payment.status

                # Update order status
                if order_status:
                    order.status = order_status
                    order.save()
                    updates["order_status"] = order.status

            logger.info(f"Successfully updated order ID {order_id}: {updates}")
            return Response(
                {"message": "Update successful", "updates": updates},
                status=status.HTTP_200_OK
            )

        except Order.DoesNotExist:
            logger.error(f"Order with ID {order_id} not found")
            return Response(
                {"detail": f"Order with ID {order_id} not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.exception(f"Unexpected error updating order ID {order_id}: {str(e)}")
            return Response(
                {"detail": f"Unexpected error: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

from django.db.models import Avg   
class SellerOrdersDashboard(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user  = request.user
        try:
            number_of_orders = Order.objects.filter(items__product__seller = request.user).distinct().count()
            order_value = Order.objects.filter(items__product__seller = request.user).aggregate(avg = Avg("total_price"))["avg"] or 0
            pending_orders = Order.objects.filter(items__product__seller = request.user , status=Order.OrderStatus.PENDING).count()
            Deliverd_orders = Order.objects.filter(items__product__seller = request.user , status=Order.OrderStatus.DELIVERED).count()
            returned_orders = Order.objects.filter(items__product__seller = request.user, status=Order.OrderStatus.RETURNED).count()
            return_rate = (returned_orders / number_of_orders * 100) if number_of_orders > 0 else 0

            return Response({
                "total_orders" : number_of_orders,
                "avarge_orders" : order_value,
                'pending_orders': pending_orders,
                "return_rate": return_rate,
                "deliverd_orders" : Deliverd_orders
            })

        except Order.DoesNotExist:
            return Response({"error" : "Order does not exist for this seller"}, status=status.HTTP_200_OK)
        
class SellerOrderDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request,order_id):
        user = request.user
        try:
            order = Order.objects.get(items__product__seller = request.user , id = order_id)
            serializer = SellerOrderDetailsSerializer(order)
            return Response(serializer.data,status=status.HTTP_200_OK)
        except Order.DoesNotExist:
            return Response({"error" : "order doesn't exist"})