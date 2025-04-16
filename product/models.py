from django.db import models
from cloudinary.models import CloudinaryField
from accounts.models import CustomUser



class Category(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200)
    description = models.TextField()

    def __str__(self):
        return self.name

# Create your models here.
class Product(models.Model):
    category  = models.ForeignKey(Category , on_delete=models.CASCADE , related_name='products')

    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    in_stock = models.BooleanField(default=True)
    main_image = CloudinaryField('image')

    size = models.CharField(max_length=200 , null=True , blank=True)
    color = models.CharField(max_length=200 , null=True , blank=True)
    material = models.CharField(max_length=200 , null=True , blank=True)
    brand = models.CharField(max_length=200 , null=True , blank=True)
    model_number = models.CharField(max_length=200 , null=True , blank=True)
    product_code = models.CharField(max_length=200 , null=True , blank=True)
    product_id = models.CharField(max_length=200 , null=True , blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = CloudinaryField('image')

    def __str__(self):
        return f"{self.product.name} - {self.image.url}"


class ProductReview(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    review = models.TextField()
    rating = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return f"{self.product.name} - {self.review}"


class FavoriteProduct(models.Model):
    product = models.OneToOneField(Product,unique=True,  on_delete=models.CASCADE, related_name='favorites')
    user = models.ForeignKey(CustomUser,on_delete=models.CASCADE, related_name='favorites')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.product.name}"

