from django.contrib import admin
from .models import Category, Product, ProductImage, ProductReview, FavoriteProduct
from django.utils.html import format_html

# Register your models here.
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'in_stock', 'image_preview' , 'size' , 'color', 'product_code')

    def image_preview(self, obj):
        if obj.main_image:
            return format_html('<img src="{}" width="100" height="100" style="object-fit: cover;" />', obj.main_image.url)
        return "No image"
    image_preview.short_description = 'Preview'


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ['product', 'image']


@admin.register(ProductReview)
class ProductReviewAdmin(admin.ModelAdmin):
    list_display = ['product', 'review', 'rating']


@admin.register(FavoriteProduct)                
class FavoriteProductAdmin(admin.ModelAdmin):
    list_display = ['product', 'user']  


