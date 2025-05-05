from django.urls import path
from accounts.views import (
    Email_varify_OTP_generate_view,
    OTP_verify_view,
    RegisterView,
    CustomTokenObtainPairView,
    ProtectedView,
    UserDetailView,
    UserUpdateView,
    LogOutView,
    reset_password_view
    ,CustomTokenRefreshView,GetMe,TokenTestView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('protected/', ProtectedView.as_view(), name='protected'),
    path('profile/', UserDetailView.as_view(), name='user-profile'),
    path('profile/update/', UserUpdateView.as_view(), name='user-profile-update'),
    path('logout/', LogOutView.as_view(), name='logout'),
    path('otp/generate/', Email_varify_OTP_generate_view.as_view(), name='otp-generate'),
    path('otp/verify/', OTP_verify_view.as_view(), name='otp-verify'),
    path('reset-password/', reset_password_view.as_view(), name='reset-password'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('me/' , GetMe.as_view() , name="get-me"),
    path('token/test/', TokenTestView.as_view(), name='token-test'),
    
]