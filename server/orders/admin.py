from django.contrib import admin
from .models import Order, OrderItem, ShippingInfo

@admin.register(ShippingInfo)
class ShippingInfoAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'city', 'country', 'phone', 'user', 'created_at')
    search_fields = ('full_name', 'address', 'city', 'country', 'phone')
    list_filter = ('country', 'created_at')
    readonly_fields = ('created_at',)

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'total_price', 'status', 'order_date', 'created_at')
    list_filter = ('status', 'order_date', 'created_at')
    search_fields = ('user__username', 'user__email', 'id')
    readonly_fields = ('order_date', 'created_at', 'updated_at')
    list_editable = ('status',)

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'order', 'product', 'quantity', 'price', 'subtotal')
    list_filter = ('created_at',)
    search_fields = ('order__id', 'product__name')
    readonly_fields = ('created_at', 'updated_at')
