from django.urls import path
from .views import CreateOrderAPIView

urlpatterns = [
    path('order/create/', CreateOrderAPIView.as_view(), name='create-order'),
]
