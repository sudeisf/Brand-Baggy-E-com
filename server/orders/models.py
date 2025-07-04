from django.db import models
from accounts.models import CustomUser
from product.models import Product
from cart.models import Cart


class ShippingInfo(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='shipping_addresses', null=True, blank=True)
    full_name = models.CharField(max_length=200)
    address = models.TextField()
    city = models.CharField(max_length=200)
    state = models.CharField(max_length=200)
    zip_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    email = models.EmailField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.full_name}, {self.city}, {self.country}"

class Order(models.Model):
    class OrderStatus(models.TextChoices):
        PENDING = 'pending'
        PAID = 'paid'
        PROCESSING = 'processing'
        SHIPPED = 'shipped'
        DELIVERED = 'delivered'
        CANCELLED = 'cancelled'
        RETURNED = "returned"

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='orders', null=True, blank=True)
   
    cart = models.ForeignKey(
        Cart,
        on_delete=models.CASCADE,
        related_name='orders',
        null=True,
        blank=True  
    )
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=200, choices=OrderStatus.choices, default=OrderStatus.PENDING)
    order_date = models.DateTimeField(auto_now_add=True)
    shipping_info = models.ForeignKey(ShippingInfo, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    guest_full_name = models.CharField(max_length=100, blank=True, null=True)
    guest_email = models.EmailField(blank=True, null=True)
    guest_phone = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        user = self.user.username if self.user else "Guest"
        return f"Order {self.id} - {user}"
    
class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null= True, related_name='order_items')
    variants = models.ForeignKey('product.ProductVariants' ,on_delete=models.SET_NULL , null=True , blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    
    def __str__(self):
        return f"{self.order.user.username} - {self.product.name}"



