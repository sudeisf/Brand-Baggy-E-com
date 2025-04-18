from django.urls import path
from .views import (
    ProductListView , 
    ProductDetailView,
    ProductReviewListCreateView ,
    AddFavoriteProductView,
    RemoveFavouriteProductView
    )


urlpatterns =[
    path('product-list/', ProductListView.as_view() , name="products-list"),
    path('<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path('products/<int:product_id>/reviews/', ProductReviewListCreateView.as_view(), name='product-reviews'),
     path('favorites/add/<int:product_id>/', AddFavoriteProductView.as_view(), name='add-favorite'),
    path('favorites/remove/<int:product_id>/', RemoveFavouriteProductView.as_view(), name='remove-favorite'),

]   