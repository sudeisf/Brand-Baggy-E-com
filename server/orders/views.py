from jsonschema import ValidationError

from payment.models import Payment
from  . models import Order , OrderItem, ShippingInfo
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from cart.models import Cart
from django.db import transaction
from orders.serializers import (OrderSerializer ,PaymentAndOrderStatusSerializer, ShippingInfoSerializer,OrderDetailSerializer,OrderTableSerializer,
                                SellerOrderDetailsSerializer,UnifiedCustomerSerializer,SellerRecentOrderItemSerializer)
from decimal import Decimal
from notifications.utils import send_notifications
from product.models import Product, ProductVariants
from rest_framework.pagination import PageNumberPagination
from django.db.models import OuterRef, Subquery
from .tasks import send_review_rating_email


class CreateOrderAPIView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        user = request.user

        # Validate shipping info
        shipping_serializer = ShippingInfoSerializer(data=request.data.get('shipping_info'))
        if not shipping_serializer.is_valid():
            return Response(shipping_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        shipping_info = shipping_serializer.save(user=user)

        try:
            cart = Cart.objects.get(user=user)
            cart_items = cart.items.select_related('product').all()
        except Cart.DoesNotExist:
            return Response({'detail': 'Cart not found.'}, status=status.HTTP_404_NOT_FOUND)

        if not cart_items:
            return Response({'detail': 'Cart is empty.'}, status=status.HTTP_400_BAD_REQUEST)

        # Calculate total and create order
        total = Decimal('0.00')
        order = Order.objects.create(
            user=user,
            cart=cart,
            total_price=total,  # Will be updated
            shipping_info=shipping_info,
            status=Order.OrderStatus.PENDING
        )

        # Create order items and calculate total
        for item in cart_items:
            product = item.product
            
            # Get variant if size is specified
            variant = None
            if item.size:
                try:
                    variant = ProductVariants.objects.get(product=product, size__name=item.size)
                    # Verify stock
                    if variant.stock < item.quantity:
                        raise ValidationError(
                            f"Not enough stock for {product.name} in size {item.size}. "
                            f"Available: {variant.stock}, Requested: {item.quantity}"
                        )
                    # Reduce stock
                    variant.stock -= item.quantity
                    variant.save()
                except ProductVariants.DoesNotExist:
                    pass

            # Calculate pricing
            base_price = product.price
            discount = product.active_discount
            discount_amount = discount.calcualteDiscount(base_price) if discount else Decimal("0.00")
            final_price = base_price - discount_amount
            subtotal = final_price * item.quantity
            
            # Create order item
            OrderItem.objects.create(
                order=order,
                product=product,
                variants=variant,  # Changed from item.variants to variant
                price=base_price,
                discount_amount=discount_amount,
                final_price=final_price,
                quantity=item.quantity,
                subtotal=subtotal
            )
            
            # Accumulate total
            total += subtotal

        # Update order total
        order.total_price = total
        order.save()

        serializer = OrderSerializer(order)

        # YOUR EXACT NOTIFICATION LOGIC PRESERVED
        notified_sellers = set()
        for item in cart_items:
            seller_user = item.product.seller
            if seller_user.id not in notified_sellers:
                message = f"New order #{order.id} placed for ${total} by {user.get_full_name() or user.username}"
                send_notifications(seller_user, message, notification_type="ORDER")
                notified_sellers.add(seller_user.id)

        # Clear cart
        cart.items.all().delete()

        # Create payment
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
        # Only allow sellers
        if not hasattr(request.user, "user_role") or request.user.user_role != "seller":
            return Response({"detail": "Forbidden"}, status=403)
        orders = Order.objects.filter(items__product__seller=request.user).distinct()
        serializer = OrderTableSerializer(orders, many=True)
        return Response(serializer.data)

class ExportSellerOrdersCSVAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        # Only allow sellers
        if not hasattr(request.user, "user_role") or request.user.user_role != "seller":
            return Response({"detail": "Forbidden"}, status=403)
        orders = Order.objects.filter(items__product__seller=request.user).distinct()
        try:
            import csv
            from django.http import HttpResponse
            response = HttpResponse(content_type='text/csv')
            response['Content-Disposition'] = 'attachment; filename="seller_orders.csv"'
            writer = csv.writer(response)
            writer.writerow(['order_id', 'date', 'customer', 'total', 'payment_status', 'items', 'status'])
            for order in orders:
                order_id = order.id
                date = order.order_date.strftime("%m/%d/%y") if order.order_date else ""
                if order.user:
                    customer = order.user.username
                elif order.guest_full_name:
                    customer = f"{order.guest_full_name} ({order.guest_email or 'No Email'})"
                else:
                    customer = "Guest"
                total = order.total_price
                payment_status = getattr(getattr(order, 'payment', None), 'status', 'no payment')
                items_count = order.items.count()
                status_val = order.status
                writer.writerow([
                    order_id,
                    date,
                    customer,
                    total,
                    payment_status,
                    items_count,
                    status_val,
                ])
            return response
        except Exception as e:
            print("CSV export error:", e)
            return Response({"detail": str(e)}, status=500)





class PaymentAndOrderStatusUpdate(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        serializer = PaymentAndOrderStatusSerializer(data=request.data)
        if not serializer.is_valid():
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

                    # Send review email if delivered
                    if order_status == Order.OrderStatus.DELIVERED:
                        send_review_rating_email.delay(order.id)

            return Response(
                {"message": "Update successful", "updates": updates},
                status=status.HTTP_200_OK
            )

        except Order.DoesNotExist:
            return Response(
                {"detail": f"Order with ID {order_id} not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
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


class SellerRecentOrdersAPIView(APIView):
    permission_classes = [IsAuthenticated]  # The authenticated user must be the seller

    def get(self, request):
        seller = request.user

        # Get all order items where product.seller = seller
        order_items = OrderItem.objects.filter(product__seller=seller).select_related('product', 'order', 'order__payment')

        paginator = PageNumberPagination()
        paginator.page_size = 10  # Default page size
        result_page = paginator.paginate_queryset(order_items, request)
        serializer = SellerRecentOrderItemSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)



import humanize
import pytz
from django.utils.timezone import now
class SellerRecentOrderActivityAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        seller = request.user
        orders = Order.objects.filter(
            items__product__seller=seller
        ).distinct().order_by('-created_at')[:20]

        activity = []
        for order in orders:
            if order.user:
                customer_name = order.user.get_full_name()
            else:
                customer_name = order.guest_full_name or "Guest"

            localized_time = order.created_at.astimezone(pytz.timezone("Africa/Nairobi")) 
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
class SellerAnalyticsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        seller = request.user
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
                items__pruoduct__seller=seller,
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

from django.db import models
from django.utils import timezone
from datetime import datetime, timedelta
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from orders.models import Order
from django.db.models.functions import TruncMonth, TruncDate
from django.db.models import Sum, F, ExpressionWrapper, DateTimeField
import pytz

class SellerRevenueAnalyticsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.user_role != 'seller':
            return Response({'detail': 'Forbidden'}, status=403)

        tz = pytz.timezone('Africa/Nairobi')
        now = timezone.now().astimezone(tz) 

    
        yearly_qs = (
            Order.objects.filter(
                items__product__seller=user,
                payment__status='completed'
            )
            .annotate(month=TruncMonth('created_at'))
            .values('month')
            .annotate(revenue=Sum('total_price'))
            .order_by('month')
        )


        month_names = [
            "January", "February", "March", "April", 
            "May", "June", "July", "August",
            "September", "October", "November", "December"
        ]

        yearly_data = [{'month': month, 'revenue': 0} for month in month_names]

        for item in yearly_qs:
            month_name = item['month'].strftime("%B")
           
            for month_data in yearly_data:
                if month_data['month'] == month_name:
                    month_data['revenue'] = float(item['revenue'] or 0)
                    break

        
        current_month_index = datetime.now().month - 1  # January is 0
        # 2. Get the last 6 months with wrap-around if needed
        last_six_months = []
        for i in range(6):
            index = (current_month_index - i) % 12
            last_six_months.append(yearly_data[index])
        # 3. Reverse to get chronological order
        yearly_data = list(reversed(last_six_months))

        
        start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        monthly_revenue = (
            Order.objects.filter(
                items__product__seller=user,
                created_at__gte=start_of_month,
                payment__status='completed'
            )
            .aggregate(revenue=Sum('total_price'))['revenue'] or 0
        )
        monthly_data = [{'month': now.strftime("%B"), 'revenue': float(monthly_revenue)}]

       
        start_of_week = now - timedelta(days=now.weekday())
        start_of_week = start_of_week.replace(hour=0, minute=0, second=0, microsecond=0)
        end_of_week = start_of_week + timedelta(days=6, hours=23, minutes=59, seconds=59)
        start_of_week_utc = start_of_week.astimezone(pytz.UTC)
        end_of_week_utc = end_of_week.astimezone(pytz.UTC)

        daily_qs = (
            Order.objects.filter(
                items__product__seller=user,
                created_at__range=(start_of_week_utc, end_of_week_utc),
                payment__status='completed'
            )
            .annotate(
                eat_time=ExpressionWrapper(
                    F('created_at') + timedelta(hours=3),  
                    output_field=DateTimeField()
                )
            )
            .annotate(day=TruncDate('eat_time'))
            .values('day')
            .annotate(revenue=Sum('total_price'))
            .order_by('day')
        )

        base = {day: 0 for day in ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]}
        for entry in daily_qs:
            if entry['day']:  # Ensure day exists
                weekday = entry['day'].strftime("%A")
                base[weekday] = float(entry['revenue'] or 0)

        daily_data = [{"day": day, "revenue": base[day]} for day in base]

        return Response({
            "yearly": yearly_data,
            "monthly": monthly_data,
            "daily": daily_data
        })
