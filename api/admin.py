from django.contrib import admin
from .models import Item, Product
# Register your models here.
# admin.site.register(Item)
# admin.site.register(Product)

@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ['name', 'description']
    list_filter = ['name', 'description']
    search_fields = ['name']
    list_per_page = 10

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'price', 'quantity']
    list_filter = ['name', 'description', 'price', 'quantity']
    search_fields = ['name']
    list_per_page = 10

