from django.urls import path
from .views import CreateOrderAPIView,UserOrderListAPIView,GetOrderItemAPIView,AdminOrderTableAPIView,PaymentAndOrderStatusUpdate

urlpatterns = [
    path('order/create/', CreateOrderAPIView.as_view(), name='create-order'),
    path("order/my-orders/", UserOrderListAPIView.as_view(), name="user-orders"),
    path("order/detail/", GetOrderItemAPIView.as_view(), name="get-order"),
    path("order/admin-table/", AdminOrderTableAPIView.as_view(), name="admin-order-table"),
    path("order/update-status/", PaymentAndOrderStatusUpdate.as_view(), name="update-status"),
]
