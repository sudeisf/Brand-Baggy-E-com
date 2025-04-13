from django.contrib import admin
from .models import CustomUser,OTP




@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_active')
    search_fields = ('username', 'email')
    ordering = ('username',)


# show otp in admin panel
@admin.register(OTP)
class OTPAdmin(admin.ModelAdmin):
    list_display = ('email', 'otp', 'created_at', 'expires_at', 'is_used')
    list_filter = ('is_used',)
    search_fields = ('email', 'otp')
    ordering = ('-created_at',)
