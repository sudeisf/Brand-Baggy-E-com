from django.db import models
from cloudinary.models import CloudinaryField
from django.forms import ValidationError
from accounts.models import CustomUser



class Category(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200)
    description = models.TextField()

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']

    def __str__(self):
        return self.name


class Product(models.Model):
    category  = models.ForeignKey(Category , on_delete=models.CASCADE , related_name='products')
    name = models.CharField(max_length=200)
    description = models.TextField()
    in_stock = models.BooleanField(default=True)
    main_image = CloudinaryField('image')
    seller  = models.ForeignKey(CustomUser,on_delete=models.CASCADE, related_name='product_role' , limit_choices_to={'user_role': CustomUser.Role.SELLER} , null=True , blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    brand = models.CharField(max_length=200 , null=True , blank=True)
    model_number = models.CharField(max_length=200 , null=True , blank=True)
    product_code = models.CharField(max_length=200 , null=True , blank=True)
    quantity = models.PositiveBigIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['category']),
            models.Index(fields=['price']),
        ]

    def __str__(self):
        return self.name


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = CloudinaryField('image')

    def __str__(self):
        return f"{self.product.name} - {self.image.url}"


class ProductReview(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(CustomUser,on_delete=models.CASCADE,related_name="prodect_reviews" )
    review = models.TextField()
    rating = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
        if not 1 <= self.rating <= 5:
            raise ValidationError("Rating must be between 1 and 5.")


    class Meta:
        ordering = ['-created_at']
        unique_together = ('user', 'product') 

    def __str__(self):
        return f"{self.product.name} - {self.user.username}"




class ProductSize(models.Model):
    name = models.CharField(max_length=20)
    code = models.CharField(max_length=10)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f'{self.name} ({self.code})'
    
class ProductVariants(models.Model):
    product  = models.ForeignKey(Product,on_delete=models.CASCADE,related_name="variants")
    size = models.ForeignKey(ProductSize, on_delete=models.PROTECT)
    stock = models.PositiveIntegerField(default=0)
    sku = models.CharField(max_length=50, unique=True)

    class Meta:
        unique_together = ('product', 'size')
        ordering = ['product', 'size__name']

    def __str__(self):
        return f"{self.product.name} - {self.size.name}"
    
    def save(self, *args, **kwargs):
        if not self.sku:
            self.sku = f"{self.product.id}-{self.size.code}"  # Automatically generate SKU
        super().save(*args, **kwargs)


class FavoriteProduct(models.Model):
    product = models.ForeignKey(Product ,on_delete=models.CASCADE, related_name='favorites')
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'product')  
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} ❤ {self.product.name}"

from django.utils import timezone
class Discount(models.Model):
    class DiscountType(models.TextChoices):
          FIXED_AMOUNT = 'fixed_amount', 'Fixed Amount'
          PERCENTAGE = 'percentage', 'Percentage'
    
    name  = models.CharField(max_length=100);
    description = models.TextField(blank=True)
    discount_type = models.CharField(max_length=20, choices=DiscountType.choices, null=True, blank=True)
    value = models.DecimalField(max_digits=10, decimal_places=2)

    start_date = models.DateTimeField()
    end_date = models.DateTimeField()

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    usage_limit = models.IntegerField(null=True,blank=True)
    time_used = models.IntegerField(default=0)

    class Meta:
        ordering = ['-created_at']

    def is_valid(self):
        now = timezone.now()
        return(
            self.is_active and 
            self.created_at <= now < self.end_date and
            self.usage_limit is None and self.time_used < self.usage_limit
        )

    def calcualteDiscount(self, orignial_price):
        if not self.is_valid():
            return 0
        if self.discount_type == "percentage":
            discount_amount = (orignial_price * self.value)/ 100
        else:
            discount_amount = self.value
            
        return discount_amount
    
class ProductDiscount(models.Model):
    product = models.ForeignKey(Product ,on_delete=models.CASCADE, related_name='discount')
    discount = models.ForeignKey(Discount, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('product', 'discount')  
        ordering = ['-created_at']
