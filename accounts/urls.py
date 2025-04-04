from django.urls import path
from accounts.views import (
    RegisterView,
    CustomTokenObtainPairView,
    ProtectedView
)

urlpatterns = [
    # Registration
    path('register/', RegisterView.as_view(), name='register'),
    
    # Login (JWT token obtain)
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    
    # Protected endpoint example
    path('protected/', ProtectedView.as_view(), name='protected'),
]