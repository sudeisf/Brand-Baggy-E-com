from django.urls import path
from accounts.views import (
    Email_varify_OTP_generate_view,
    RegisterView,
    CustomTokenObtainPairView,
    ProtectedView,
    UserDetailView,
    UserUpdateView,
    LogOutView
)

urlpatterns = [
    # Registration
    path('register/', RegisterView.as_view(), name='register'),
    
    # Login (JWT token obtain)
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    
    # Protected endpoint example
    path('protected/', ProtectedView.as_view(), name='protected'),

    # User profile endpoints
    path('profile/', UserDetailView.as_view(), name='user-profile'),
    path('profile/update/', UserUpdateView.as_view(), name='user-profile-update'),
    path('logout/', LogOutView.as_view(), name='logout'),
    path('otp/generate/', Email_varify_OTP_generate_view.as_view(), name='otp-generate'),
]