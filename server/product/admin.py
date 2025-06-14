from django.contrib import admin
from .models import Category, Product, ProductImage, ProductReview, FavoriteProduct , ProductVariants , ProductSize , ProductDiscount , ProductLocation
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

@admin.register(ProductDiscount)
class ProductDiscountAdmin(admin.ModelAdmin):
    list_display = [
        'product',
        'get_discount_type',
        'get_discount_value',
        'get_discount_dates',
        'created_at'
    ]

    def get_discount_type(self, obj):
        return obj.discount.discount_type if obj.discount else '-'
    get_discount_type.short_description = 'Discount Type'

    def get_discount_value(self, obj):
        return obj.discount.value if obj.discount else '-'
    get_discount_value.short_description = 'Value'


    def get_discount_dates(self, obj):
        if obj.discount:
            return f"{obj.discount.start_date.date()} to {obj.discount.end_date.date()}"
        return '-'
    get_discount_dates.short_description = 'Valid Period'



