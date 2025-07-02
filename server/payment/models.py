from django.db import models
from orders.models import Order

class Payment(models.Model):
    class Method(models.TextChoices):
        PAYPAL = 'paypal'
        STRIPE = 'stripe'
        COD = 'cod'

    class Status(models.TextChoices):
        PENDING = 'pending'
        COMPLETED = 'completed'
        FAILED = 'failed'
        REFUNDED = 'refunded'
        EXPIRED = 'expired'

    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='payment')
    method = models.CharField(max_length=50, choices=Method.choices)
    status = models.CharField(max_length=50, choices=Status.choices, null=True, blank=True)
    transaction_id = models.CharField(max_length=255, null=True, blank=True)
    provider_status = models.TextField(blank=True , null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    provider_response = models.JSONField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.order.id} - {self.method} - {self.status}"
