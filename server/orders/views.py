from django.shortcuts import render

from payment.models import Payment
from  . models import Order , OrderItem, ShippingInfo
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import createOrderSerializer
from rest_framework.permissions import IsAuthenticated , IsAuthenticatedOrReadOnly
from cart.models import Cart , CartItem
from django.db import transaction
from orders.serializers import (OrderSerializer ,PaymentAndOrderStatusSerializer, ShippingInfoSerializer,OrderDetailSerializer,OrderTableSerializer,
                                SellerOrderDetailsSerializer,UnifiedCustomerSerializer,SellerRecentOrderItemSerializer)
from decimal import Decimal
from notifications.utils import send_notifications
from product.models import Product, ProductVariants
from rest_framework.pagination import PageNumberPagination
from django.db.models import OuterRef, Subquery



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

    def get(self, request, order_id):
        user = request.user
        order = (
            Order.objects
            .filter(id=order_id, items__product__seller=user)
            .distinct()
            .first()
        )

        if not order:
            return Response({"error": "Order doesn't exist for this seller."}, status=status.HTTP_404_NOT_FOUND)

        serializer = SellerOrderDetailsSerializer(order, context={"seller": user})
        return Response(serializer.data, status=status.HTTP_200_OK)
        

class GuestOrderCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]  

    def post(self, request):
        data = request.data

        shipping_data = data["shipping_info"]
        shipping = ShippingInfo.objects.create(
            full_name=shipping_data["full_name"],
            address=shipping_data["address"],
            city=shipping_data["city"],
            state=shipping_data["state"],
            zip_code=shipping_data["zip_code"],
            country=shipping_data["country"],
            phone=shipping_data["phone"],
            email=shipping_data["email"],
        )

        guest_data = data["guest_user"]
        order = Order.objects.create(
            guest_full_name=guest_data["full_name"],
            guest_email=guest_data["email"],
            guest_phone=guest_data["phone"],
            total_price=data["total_price"],
            shipping_info=shipping
        )

        
        for item in data["items"]:
            product = Product.objects.get(id=item["product_id"])
            variant = None
            if item.get("variant_id"):
                variant = ProductVariants.objects.get(id=item["variant_id"])

            OrderItem.objects.create(
                order=order,
                product=product,
                variants=variant,
                price=item["price"],
                quantity=item["quantity"],
                subtotal=item["price"] * item["quantity"]
            )

        
        Payment.objects.create(
            order=order,
            method=data["payment_method"],
            status=Payment.Status.PENDING,
            amount=data["total_price"]
        )

        return Response({"order_id": order.id}, status=status.HTTP_201_CREATED)




from django.db.models import Count, Sum, Max, Value as V, BooleanField, F, OuterRef, Subquery
from django.db.models.functions import Coalesce
from itertools import chain
from rest_framework.authentication import get_user_model
from accounts.models import CustomUser
from django.db.models import Sum, Q, Count

class CustomerListAPIView(APIView):
    permission_classes = [IsAuthenticated]  # or IsAuthenticated

    def get(self, request):
        # Subquery for latest registered user's order
        latest_order = Order.objects.filter(user=OuterRef('pk')).order_by('-created_at')
        country_subquery = Order.objects.filter(user=OuterRef('pk')).order_by('-created_at').values('shipping_info__country')[:1]
        city_subquery = Order.objects.filter(user=OuterRef('pk')).order_by('-created_at').values('shipping_info__city')[:1]

        # Registered customers
        registered_customers = (
        CustomUser.objects
            .filter(orders__isnull=False)
            .annotate(
                name=Coalesce(F("first_name"), V("")),
                annotated_email=F("email"),
                is_registered=V(True, output_field=BooleanField()),
                order_count=Count("orders"),
                total_spent=Sum("orders__total_price"),
                last_order_date=Max("orders__created_at"),
                country=Subquery(country_subquery),
                city=Subquery(city_subquery),
                main_image=F("profile_url"),
            )
            .values("name", "annotated_email", "is_registered", "order_count", "total_spent", "last_order_date", "country", "city", "main_image")
        )
        # Guest customers (grouped by guest_email)
        guest_orders = (
            Order.objects
            .filter(user__isnull=True)
            .exclude(guest_email__isnull=True)
            .order_by('-created_at')
        )

        guest_data = {}
        for order in guest_orders:
            key = order.guest_email
            guest_data[key] = {
                "name": order.guest_full_name or "Guest",
                "annotated_email": key,
                "is_registered": False,
                "order_count": 0,
                "total_spent": 0,
                "last_order_date": None,
                "country": None,
                "city": None,
                "main_image": None,
            }
            guest_data[key]["order_count"] += 1
            guest_data[key]["total_spent"] += order.total_price
            if not guest_data[key]["last_order_date"] or order.created_at > guest_data[key]["last_order_date"]:
                guest_data[key]["last_order_date"] = order.created_at
                if order.shipping_info:
                    guest_data[key]["country"] = order.shipping_info.country
                    guest_data[key]["city"] = order.shipping_info.city

        guest_customers = list(guest_data.values())

        all_customers = list(chain(registered_customers, guest_customers))
        all_customers_sorted = sorted(all_customers, key=lambda x: x["last_order_date"] or "", reverse=True)

        paginator = PageNumberPagination()
        paginator.page_size = 10  # You can adjust or make this dynamic
        result_page = paginator.paginate_queryset(all_customers_sorted, request)
        serializer = UnifiedCustomerSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)

class CustomerDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]  # seller auth

    def get(self, request, email):
        seller = request.user

        # All orders placed by this customer containing this seller's products
        orders = Order.objects.filter(
            Q(user__email=email) | Q(guest_email=email),
            items__product__seller=seller
        ).distinct().prefetch_related("items__product", "shipping_info")

        if not orders.exists():
            return Response({"detail": "No such customer for this seller"}, status=404)

        first_order = orders.first()
        is_registered = bool(first_order.user)
        customer_name = first_order.user.get_full_name() if is_registered else first_order.guest_full_name
        customer_email = first_order.user.email if is_registered else first_order.guest_email
        customer_phone = first_order.user.phone_number if is_registered else first_order.guest_phone

        last_shipping = orders.order_by("-created_at").first().shipping_info
        country = last_shipping.country if last_shipping else None
        city = last_shipping.city if last_shipping else None

        total_cost = orders.aggregate(total=Sum("total_price"))["total"] or 0
        total_orders = orders.count()
        completed_orders = orders.filter(status="delivered").count()
        canceled_orders = orders.filter(status="cancelled").count()

        orders_list = []
        for order in orders:
            for item in order.items.all():
                if item.product.seller == seller:
                    orders_list.append({
                        "order_id": str(order.id),
                        "product_name": item.product.name,
                        "date": order.created_at,
                        "status": order.status,
                        "payment_method": order.payment.method if hasattr(order, "payment") else None,
                        "payment_status": order.payment.status if hasattr(order, "payment") else "pending",
                        "price": item.price,
                        "quantity": item.quantity,
                    })


        return Response({
            "customer_info": {
                "name": customer_name,
                "email": customer_email,
                "phone": customer_phone,
                "country": country,
                "city": city,
                "is_registered": is_registered
            },
            "summary": {
                "total_orders": total_orders,
                "completed_orders": completed_orders,
                "canceled_orders": canceled_orders,
                "total_spent": total_cost,
            },
            "orders": orders_list
        })

# Product name	p.status Order date	Customer	Price	Sold	Satus
class SellerRecentOrdersAPIView(APIView):
    permission_classes = [IsAuthenticated]  # The authenticated user must be the seller

    def get(self, request):
        seller = request.user

        # Get all order items where product.seller = seller
        order_items = OrderItem.objects.filter(product__seller=seller).select_related('product', 'order', 'order__payment')

        serializer = SellerRecentOrderItemSerializer(order_items, many=True)
        return Response(serializer.data)



import humanize
import pytz
from django.utils.timezone import now
class SellerRecentOrderActivityAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        seller = request.user

        # Fetch recent orders containing seller's products
        orders = Order.objects.filter(
            items__product__seller=seller
        ).distinct().order_by('-created_at')[:20]

        activity = []
        for order in orders:
            if order.user:
                customer_name = order.user.get_full_name()
            else:
                customer_name = order.guest_full_name or "Guest"

            localized_time = order.created_at.astimezone(pytz.timezone("Africa/Nairobi"))  # adjust as needed
            relative_time = humanize.naturaltime(now() - order.created_at)
            exact_time = localized_time.strftime("%A at %I:%M %p")

            activity.append({
                "order_id": str(order.id),
                "customer": customer_name,
                "status": order.status,
                "timestamp": relative_time,
                "exact_time": exact_time
            })

        return Response(activity)

from django.db.models import DecimalField, F, Sum
from datetime import datetime, timedelta
def calculate_percent_change(current, previous):
    if previous == 0:
        return None, None
    change = ((current - previous) / previous) * 100
    direction = "up" if change > 0 else "down" if change < 0 else "no change"
    return round(abs(change), 2), direction

class SellerAnalyticsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        seller = request.user
        
        # Define date ranges for this week and last week (Monday to Sunday)
        today = datetime.today()
        start_of_this_week = today - timedelta(days=today.weekday())
        end_of_this_week = start_of_this_week + timedelta(days=6, hours=23, minutes=59, seconds=59)

        start_of_last_week = start_of_this_week - timedelta(days=7)
        end_of_last_week = start_of_this_week - timedelta(seconds=1)

        def get_metrics(start_date, end_date):
            order_items = OrderItem.objects.filter(
                product__seller=seller,
                order__created_at__gte=start_date,
                order__created_at__lte=end_date,
            ).select_related('product', 'order')

            total_income = Order.objects.filter(
                items__product__seller=seller,
                created_at__gte=start_date,
                created_at__lte=end_date,
            ).distinct().aggregate(total_income=Sum('total_price'))['total_income'] or Decimal('0')

            total_expenses = order_items.aggregate(
                total_expenses=Sum(
                    F('product__cost_price') * F('quantity'),
                    output_field=DecimalField(max_digits=20, decimal_places=2)
                )
            )['total_expenses'] or Decimal('0')

            total_orders = Order.objects.filter(
                items__product__seller=seller,
                created_at__gte=start_date,
                created_at__lte=end_date,
            ).distinct().count()

            total_profit = total_income - total_expenses

            return {
                "income": total_income,
                "expenses": total_expenses,
                "profit": total_profit,
                "orders": total_orders,
            }

        def calculate_percent_change(current, previous):
            if previous == 0:
                # If no previous data, treat as 100% increase if current > 0 else no change
                if current > 0:
                    return 100.0, "up"
                else:
                    return 0.0, "no change"
            change = ((current - previous) / previous) * 100
            direction = "up" if change > 0 else ("down" if change < 0 else "no change")
            return round(abs(change), 2), direction

        this_week = get_metrics(start_of_this_week, end_of_this_week)
        last_week = get_metrics(start_of_last_week, end_of_last_week)

        percent_changes = {}
        for key in ['income', 'expenses', 'profit', 'orders']:
            pct, direction = calculate_percent_change(this_week[key], last_week[key])
            percent_changes[key] = {
                "percent": pct,
                "direction": direction
            }

        response_data = {
            "total_income": float(this_week["income"]),
            "total_expenses": float(this_week["expenses"]),
            "total_profit": float(this_week["profit"]),
            "total_orders": this_week["orders"],
            "percent_changes": percent_changes
        }

        return Response(response_data)
