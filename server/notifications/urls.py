from django.urls import path
from .views import NotificationListAPIView, MarkAsReadAPIView

urlpatterns = [
    path("", NotificationListAPIView.as_view(), name="notification-list"),
    path("<int:pk>/mark-read/", MarkAsReadAPIView.as_view(), name="notification-mark-read"),
    path("mark-all-read/", MarkAsReadAPIView.as_view(), name="notification-mark-read")
]
