from django.db import models
from accounts.models import CustomUser
from product.models import Product , Discount
from django.utils import timezone
from decimal import Decimal

class Cart(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='carts' , null=True , blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        if self.user:
            return f"Cart of {self.user.username}"
    

class CartItem(models.Model):
    cart = models.ForeignKey(Cart ,on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    size = models.CharField(max_length=10 , null=True , blank=True)

    discount = models.ForeignKey(Discount, on_delete=models.SET_NULL, null=True, blank=True)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    final_price = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))

    def is_valid(self):
        if not self.product.in_stock:
            return False

        if self.size:
            try:
                variant = self.product.variants.get(size__name=self.size)
                if self.quantity > variant.stock:
                    return False
            except self.product.variants.model.DoesNotExist:
                return False
        else:
            if self.quantity > self.product.total_stock:
                return False

        if self.discount and not self.discount.is_valid():
            return False

        return True

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"

