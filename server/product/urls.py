from django.urls import path
from .views import (
    ProductListView , 
    ProductDetailView,
    ProductReviewListCreateView ,
    AddFavoriteProductView,
    RemoveFavouriteProductView,
    CreateProductView,
    SellerProductDashboardView,
    UpdateSellerProductAPIView,
    DeleteSellerProductAPIVIew
    )


urlpatterns =[
    path('product-list/', ProductListView.as_view() , name="products-list"),
    path('<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path('products/<int:product_id>/reviews/', ProductReviewListCreateView.as_view(), name='product-reviews'),
    path('favorites/add/<int:product_id>/', AddFavoriteProductView.as_view(), name='add-favorite'),
    path('favorites/remove/<int:product_id>/', RemoveFavouriteProductView.as_view(), name='remove-favorite'),

    #seller URL-PATTERNS
    path('seller/dashboard/',SellerProductDashboardView.as_view(),name="list-of-seller-products"),
    path('seller/<int:id>/update',UpdateSellerProductAPIView.as_view(), name="update-product"),
    path('seller/create-product/', CreateProductView.as_view(), name='create-product'),
    path('seller/<int:id>/delete/',DeleteSellerProductAPIVIew.as_view(),name="delete-product")

]   