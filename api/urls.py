

import django.urls as urls
from .views import ItemList, Product , ProductDetail


urlpatterns = [
    urls.path('items/', ItemList.as_view(), name='item-list'),
    urls.path('products/', ProductDetail.as_view(), name='product-detail'),
    urls.path('products/<int:pk>/', ProductDetail.as_view(), name='product-detail'),
]