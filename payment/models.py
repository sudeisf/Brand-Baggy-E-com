from django.db import models
from orders.models import Order

# Create your models here.
class Payment(models.Model):
    class Method(models.TextChoices):
        PAYPAL = 'paypal'
        STRIPE = 'stripe'
        COD = 'cod'

    class Status(models.TextChoices):
        PENDING = 'pending'
        PAID = 'paid'
        FAILED = 'failed'
        REFUNDED = 'refunded'

    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='payment')
    method = models.CharField(max_length=50, choices=Method.choices)
    status = models.CharField(max_length=50, choices=Status.choices, default=Status.PENDING)
    transaction_id = models.CharField(max_length=255, null=True, blank=True)
    paid_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
