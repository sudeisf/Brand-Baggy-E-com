from django.urls import path
from .views import (
    ProductListView , 
    ProductDetailView,
    ProductReviewListCreateView ,
    AddFavoriteProductView,
    RemoveFavouriteProductView,
    ProductCreateAPIView,
    SellerProductDashboardView,
    UpdateSellerProductAPIView,
    DeleteSellerProductAPIVIew,
    ProductDetailSellerView,
    CategoryListView,
    CategorySubListView,
    ProductStockUpdateView
    ,MergeFavProductView,
    GetFavProductView,
    RemoveAllFavItems,
    SearchProductAPIView,
    CategoryFilterView,
    SellerProductList,
    ProductReviewAndRatingAPIView,
    CreateReviewAndRatingAPIView,
    ProductSuggestionAPIVIew
    )


urlpatterns =[
    path('product-list/', ProductListView.as_view() , name="products-list"),
    path('<int:pk>/detail/', ProductDetailView.as_view(), name='product-detail'),
    path('products/<int:product_id>/reviews/', ProductReviewListCreateView.as_view(), name='product-reviews'),
    path('favorites/add/<int:product_id>/', AddFavoriteProductView.as_view(), name='add-favorite'),
    path('favorites/remove/<int:product_id>/', RemoveFavouriteProductView.as_view(), name='remove-favorite'),

    #seller URL-PATTERNS
    path('seller/dashboard/',SellerProductDashboardView.as_view(),name="list-of-seller-products"),
    path('seller/<int:pk>/update/',UpdateSellerProductAPIView.as_view(), name="update-product"),
    path('seller/create-product/', ProductCreateAPIView.as_view(), name='create-product'),
    path('seller/<int:id>/delete/',DeleteSellerProductAPIVIew.as_view(),name="delete-product"),
    path('seller/<int:product_id>/detail/',ProductDetailSellerView.as_view(),name='product-detail'),
    path('seller/<int:pk>/update-stock/', ProductStockUpdateView.as_view(), name='update-stock'),
    path('catagory-list',CategoryListView.as_view(),name="catagory-list"),
    path('catagory-sub-list',CategorySubListView.as_view(),name="catagory-sub-list"),
    path('category-filter/', CategoryFilterView.as_view(), name='category-filter'),
    path('seller/product-select-list/', SellerProductList.as_view(), name='select-product'),
    path('product-rating-reviews/<int:product_id>/',ProductReviewAndRatingAPIView.as_view(), name="product-review-rating-summery"),
    path('reviews/<int:order_id>/', CreateReviewAndRatingAPIView.as_view(), name='create_review'),


    #fav product
    path("favorite-product/merged",MergeFavProductView.as_view(),name="merge-fav-product"),
    path("favorite-products/",GetFavProductView.as_view(),name="get-fav-product"),
    path("favorite-products/removeAll/",RemoveAllFavItems.as_view(),name="remove-all-fav"),
    path('search-product/', SearchProductAPIView.as_view(), name='product-search'),
    path('suggested-products/<int:product_id>/',ProductSuggestionAPIVIew.as_view(),name="suggested-product")
    

]   