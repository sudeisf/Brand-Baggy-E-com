from django.db import models
from accounts.models import CustomUser
from product.models import Product
from cart.models import Cart


# Create your models here.

class Order(models.Model):

    class OrderStatus(models.TextChoices):
        PENDING = 'pending'
        PROCESSING = 'processing'
        SHIPPED = 'shipped'
        DELIVERED = 'delivered'
        CANCELLED = 'cancelled'


    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='orders')
    guest_email = models.EmailField(null=True, blank=True)
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='orders')
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=200, choices=OrderStatus.choices , default=OrderStatus.PENDING)
    quantity = models.PositiveIntegerField()
    order_date = models.DateTimeField(auto_now_add=True)
    payment_method = models.CharField(max_length=200)
    payment_status = models.CharField(max_length=200)
    shipping_address = models.TextField()
    shipping_city = models.CharField(max_length=200)
    shipping_state = models.CharField(max_length=200)
    shipping_zip_code = models.CharField(max_length=200)
    shipping_country = models.CharField(max_length=200)
    shipping_phone = models.CharField(max_length=200)
    shipping_email = models.EmailField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.product.name}"
    
class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='order_items')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    # product_variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE, related_name='order_items')
    quantity = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.order.user.username} - {self.product.name}"


