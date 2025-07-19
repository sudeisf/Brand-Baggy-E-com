import json
import logging
from datetime import datetime, timedelta
from decimal import Decimal
from django.utils import timezone
from channels.generic.websocket import AsyncWebsocketConsumer
from django.db.models import Sum, F, DecimalField
from django.db.models.functions import TruncDate
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from .models import Order, OrderItem
import asyncio

logger = logging.getLogger(__name__)

class SellerAnalyticsConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
            from rest_framework_simplejwt.tokens import AccessToken
            raw_query_string = self.scope["query_string"].decode()
            token = raw_query_string.split("token=")[-1]
            access_token = AccessToken(token)
            user = await self.get_user(access_token["user_id"])

            if user is None or user.user_role != "seller":
                await self.close()
                return

            self.scope["user"] = user
            self.seller = user
            self.group_name = f"seller_analytics_{user.id}"

            logger.info(f"Seller {user.id} connected to analytics websocket.")

            await self.channel_layer.group_add(self.group_name, self.channel_name)
            await self.accept()
            self.keep_sending = True
            asyncio.create_task(self.periodic_send())

        except Exception as e:
            logger.error(f"WebSocket connection error: {e}")
            await self.close()

    @database_sync_to_async
    def get_user(self, user_id):
        User = get_user_model()
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            logger.warning(f"User with ID {user_id} does not exist.")
            return None

    async def disconnect(self, close_code):
        self.keep_sending = False
        if hasattr(self, 'group_name'):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)
            logger.info(f"Seller {self.seller.id} disconnected.")

    async def send_metrics(self):
        today = timezone.now()
        start_this_week = today - timedelta(days=today.weekday())
        end_this_week = start_this_week + timedelta(days=6, hours=23, minutes=59, seconds=59)
        start_last_week = start_this_week - timedelta(days=7)
        end_last_week = start_this_week - timedelta(seconds=1)

        metrics = []

        # Total Expenses (lifetime)
        curr_exp = await database_sync_to_async(self.get_total_expenses)(self.seller)
        this_week_exp = await database_sync_to_async(self.get_expenses)(self.seller, start_this_week, end_this_week)
        prev_exp = await database_sync_to_async(self.get_expenses)(self.seller, start_last_week, end_last_week)
        chart_exp = await database_sync_to_async(self.get_daywise)(self.seller, start_this_week, end_this_week, metric="expenses")
        metrics.append(self.build_block("Total Expenses", curr_exp, prev_exp, chart_exp, percent_base=this_week_exp))

        # Total Income (lifetime)
        curr_inc = await database_sync_to_async(self.get_total_income)(self.seller)
        this_week_inc = await database_sync_to_async(self.get_income)(self.seller, start_this_week, end_this_week)
        prev_inc = await database_sync_to_async(self.get_income)(self.seller, start_last_week, end_last_week)
        chart_inc = await database_sync_to_async(self.get_daywise)(self.seller, start_this_week, end_this_week, metric="income")
        metrics.append(self.build_block("Total Income", curr_inc, prev_inc, chart_inc, percent_base=this_week_inc))
        # Total Orders (lifetime)
        curr_ord = await database_sync_to_async(self.get_total_orders_value)(self.seller)
        this_week_ord = await database_sync_to_async(self.get_orders_value)(self.seller, start_this_week, end_this_week)
        prev_ord = await database_sync_to_async(self.get_orders_value)(self.seller, start_last_week, end_last_week)
        chart_ord = await database_sync_to_async(self.get_daywise)(self.seller, start_this_week, end_this_week, metric="orders")
        metrics.append(self.build_block("Total Orders", curr_ord, prev_ord, chart_ord, percent_base=this_week_ord))

        await self.send(text_data=json.dumps(metrics))

    def get_expenses(self, seller, start, end):
        return OrderItem.objects.filter(
            product__seller=seller,
            order__created_at__range=(start, end)
        ).aggregate(
            total=Sum(F("product__cost_price") * F("quantity"), output_field=DecimalField())
        )["total"] or Decimal("0")

    def get_total_expenses(self, seller):
        return OrderItem.objects.filter(
            product__seller=seller
        ).aggregate(
            total=Sum(F("product__cost_price") * F("quantity"), output_field=DecimalField())
        )["total"] or Decimal("0")

    def get_income(self, seller, start, end):
        return Order.objects.filter(
            items__product__seller=seller,
            created_at__range=(start, end),
            payment__status='completed'
        ).distinct().aggregate(total=Sum("total_price"))["total"] or Decimal("0")

    def get_total_income(self, seller):
        return Order.objects.filter(
            items__product__seller=seller,
            payment__status='completed'
        ).distinct().aggregate(total=Sum("total_price"))["total"] or Decimal("0")

    def get_orders_value(self, seller, start, end):
        return Order.objects.filter(
            items__product__seller=seller,
            created_at__range=(start, end)
        ).distinct().aggregate(total=Sum("total_price"))["total"] or Decimal("0")

    def get_total_orders_value(self, seller):
        return Order.objects.filter(
            items__product__seller=seller
        ).distinct().aggregate(total=Sum("total_price"))["total"] or Decimal("0")

    def get_daywise(self, seller, start, end, metric):
        base = {day: 0 for day in ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]}

        if metric == "expenses":
            qs = OrderItem.objects.filter(
                product__seller=seller,
                order__created_at__range=(start, end)
            ).annotate(day=TruncDate("order__created_at")).values("day").annotate(
                total=Sum(F("product__cost_price") * F("quantity"), output_field=DecimalField())
            )
        elif metric == "income":
            qs = Order.objects.filter(
                items__product__seller=seller,
                created_at__range=(start, end),
                payment__status='completed'
            ).annotate(day=TruncDate("created_at")).values("day").annotate(
                total=Sum("total_price")
            )
        else:
            qs = Order.objects.filter(
                items__product__seller=seller,
                created_at__range=(start, end)
            ).annotate(day=TruncDate("created_at")).values("day").annotate(
                total=Sum("total_price")
            )

        for entry in qs:
            weekday = entry["day"].strftime("%A")
            base[weekday] = float(entry["total"])

        return [{"day": day, "value": base[day]} for day in base]

    def build_block(self, title, current, previous, chart, percent_base=None):
        percent, direction = self.calculate_percent(percent_base or current, previous)
        percent = min(percent, 100.0)  # Clamp percent to 100 max
        return {
            "header": title,
            "amount": float(current),
            "discription": "from last week",
            "percentile": f"{percent}%",
            "growthType": direction,
            "chartData": chart
        }

    def calculate_percent(self, current, previous):
        if previous == 0:
            return (100.0, "up") if current > 0 else (0.0, "no change")
        change = ((current - previous) / previous) * 100
        return round(abs(change), 2), "up" if change > 0 else "down" if change < 0 else "no change"

    async def periodic_send(self):
        while self.keep_sending:
            await self.send_metrics()
            await asyncio.sleep(10)  # send every 10 seconds