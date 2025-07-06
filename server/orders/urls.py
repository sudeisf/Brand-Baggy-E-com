from django.urls import path
from .views import (
    CreateOrderAPIView,
    UserOrderListAPIView,
    GetOrderItemAPIView,
    AdminOrderTableAPIView,
    PaymentAndOrderStatusUpdate,
    SellerOrdersDashboard,
    SellerOrderDetailAPIView,
    GuestOrderCreateAPIView,
    CustomerListAPIView,
    CustomerDetailAPIView
    )

urlpatterns = [
    path('order/create/', CreateOrderAPIView.as_view(), name='create-order'),
    path("order/my-orders/", UserOrderListAPIView.as_view(), name="user-orders"),
    path("order/detail/", GetOrderItemAPIView.as_view(), name="get-order"),
    path("order/admin-table/", AdminOrderTableAPIView.as_view(), name="admin-order-table"),
    path("order/update-status/", PaymentAndOrderStatusUpdate.as_view(), name="update-status"),
    path("order-dashboard/",SellerOrdersDashboard.as_view(),name="order-dashboard"),
    path("seller/order/<int:order_id>/detail/",SellerOrderDetailAPIView.as_view(),name="order-detail-seller"),
    path("seller/create-order/",GuestOrderCreateAPIView.as_view(),name="custom-seller-order"),
    path('order/customers/', CustomerListAPIView.as_view(), name='customer-list'),
    path("customers/<str:email>/", CustomerDetailAPIView.as_view(), name="customer-detail")

]
