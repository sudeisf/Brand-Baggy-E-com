from django.contrib import admin
from .models import Category, Product, ProductImage, ProductReview, FavoriteProduct , ProductVariants , ProductSize
from django.utils.html import format_html

# Register your models here.
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id' ,'name', 'in_stock', 'image_preview' ,)

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

@admin.register(ProductSize)
class ProductSizeAdmin(admin.ModelAdmin):
    list_display = ['name' , 'code']

@admin.register(ProductVariants)
class ProductVariantsAdmin(admin.ModelAdmin):
    list_display = ['product' , 'size' , 'stock']



