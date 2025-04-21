from django.db import models
from accounts.models import CustomUser
from product.models import Product
from cart.models import Cart


class Order(models.Model):
    class OrderStatus(models.TextChoices):
        PENDING = 'pending'
        PAID = 'paid'
        PROCESSING = 'processing'
        SHIPPED = 'shipped'
        DELIVERED = 'delivered'
        CANCELLED = 'cancelled'

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='orders', null=True, blank=True)
    guest_email = models.EmailField(null=True, blank=True)
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='orders')
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=200, choices=OrderStatus.choices, default=OrderStatus.PENDING)
    order_date = models.DateTimeField(auto_now_add=True)

    shipping_address = models.TextField()
    shipping_city = models.CharField(max_length=200)
    shipping_state = models.CharField(max_length=200)
    shipping_zip_code = models.CharField(max_length=200)
    shipping_country = models.CharField(max_length=200)
    shipping_phone = models.CharField(max_length=200)
    shipping_email = models.EmailField(null=True, blank=True)  

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username if self.user else self.guest_email} - Order #{self.pk}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null= True, related_name='order_items')
    variants = models.ForeignKey('product.ProductVariants' ,on_delete=models.SET_NULL , null=True , blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.order.user.username} - {self.product.name}"

