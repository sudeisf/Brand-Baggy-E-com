from django.db import models
from cloudinary.models import CloudinaryField
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

   
    brand = models.CharField(max_length=200 , null=True , blank=True)
    model_number = models.CharField(max_length=200 , null=True , blank=True)
    product_code = models.CharField(max_length=200 , null=True , blank=True)
    product_id = models.CharField(max_length=200 , null=True , blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

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
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    sku = models.CharField(max_length=50, unique=True)


    class Meta:
        unique_together = ('product', 'size')
        ordering = ['product', 'size__name']

    def __str__(self):
        return f"{self.product.name} - {self.size.name}"


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

