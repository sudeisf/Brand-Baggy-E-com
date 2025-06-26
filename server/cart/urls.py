from django.urls import path
from .views import (
    AddCartItemView,
    RemoveCartItemView,
    GetCartView,
    UpdateCartItemView,
    ClearCartItemView,
    MergeCartItemsView    
)
app_name = 'cart'

urlpatterns = [
    path('add/', AddCartItemView.as_view(), name='add-cart-item'),
    path('remove/', RemoveCartItemView.as_view(), name='remove-cart-item'),
    path('get-cart/', GetCartView.as_view(), name='get-cart'),
    path('<int:pk>/update/', UpdateCartItemView.as_view(), name='update-cart-item'),
    path('clear/', ClearCartItemView.as_view(), name='clear-cart'),
    path('merge/', MergeCartItemsView.as_view(),name="merge-user-cart-with-db"),
]
