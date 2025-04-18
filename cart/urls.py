from django.urls import path
from .views import (
    AddCartItemView,
    RemoveCartItemView,
    GetCartView,
    UpdateCartItemView,
    ClearCartItemView,
)

urlpatterns = [
    path('add/', AddCartItemView.as_view(), name='add-cart-item'),
    path('<int:pk>/remove/', RemoveCartItemView.as_view(), name='remove-cart-item'),
    path('get-cart/', GetCartView.as_view(), name='get-cart'),
    path('<int:pk>/update/', UpdateCartItemView.as_view(), name='update-cart-item'),
    path('clear/', ClearCartItemView.as_view(), name='clear-cart'),
]
