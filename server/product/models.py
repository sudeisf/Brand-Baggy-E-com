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

# Create your models here.
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
        unique_together = ('user', 'product')  # One review per user per product

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

