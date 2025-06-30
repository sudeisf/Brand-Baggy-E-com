from django.contrib import admin
from django.utils.html import format_html
from .models import Payment
import json

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        'get_order_id', 
        'method', 
        'transaction_id', 
        'amount', 
        'status',
        'formatted_provider_status',  # New field
        'created_at'
    )
    list_select_related = ('order',)
    search_fields = ('order__id', 'transaction_id', 'method', 'provider_status')
    list_filter = ('status', 'method', 'created_at')
    readonly_fields = (
        'created_at', 
        'updated_at', 
        'provider_response_prettified',  # New field
        'provider_status'
    )
    raw_id_fields = ('order',)
    date_hierarchy = 'created_at'

    def get_order_id(self, obj):
        return obj.order.id if obj.order else None
    get_order_id.short_description = 'Order ID'
    get_order_id.admin_order_field = 'order__order_id'

    def formatted_provider_status(self, obj):
        if not obj.provider_status:
            return "-"
        status = obj.provider_status.lower()
        color = {
            'success': 'green',
            'failed': 'red',
            'pending': 'orange',
            'declined': 'darkred',
        }.get(status, 'blue')
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color,
            obj.provider_status.upper()
        )
    formatted_provider_status.short_description = 'Provider Status'

    def provider_response_prettified(self, obj):
        if not obj.provider_response:
            return "-"
        return format_html(
            '<pre style="background: #f7f7f7; padding: 10px; border-radius: 5px; overflow-x: auto;">{}</pre>',
            json.dumps(obj.provider_response, indent=2)
        )
    provider_response_prettified.short_description = 'Provider Response (Detailed)'

    fieldsets = (
        (None, {
            'fields': ('order', 'method', 'status', 'amount')
        }),
        ('Transaction Details', {
            'fields': (
                'transaction_id', 
                'formatted_provider_status',  # Changed from provider_status
                'provider_response_prettified'
            ),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('wide',)
        })
    )

    # Add to top of admin
    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}
        extra_context['show_full_result_count'] = False  # Better performance
        return super().changelist_view(request, extra_context=extra_context)