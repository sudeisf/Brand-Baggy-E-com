from django.db import models
from accounts.models import CustomUser
from product.models import Product
from django.utils import timezone

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
    discount_value = models.IntegerField(null=True, blank=True)
    discount_type = models.CharField(null=True,blank=True)
    discount_start_date = models.DateField(null=True,blank=True)
    discount_end_date = models.DateField(null=True,blank=True)
    discount_is_valid = models.BooleanField(null=True,blank=True)
    discount_is_active = models.BooleanField(null=True,blank=True)

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
        
       
        if self.discount_value and self.discount_type:
          
            if not self.discount_is_active:
                return False

            current_date = timezone.now().date()
            if self.discount_start_date and current_date < self.discount_start_date:
                return False
            if self.discount_end_date and current_date > self.discount_end_date:
                return False
            
            if self.discount_is_valid is False:
                return False
        
        return True

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"

