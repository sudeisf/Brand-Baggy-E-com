from django.contrib import admin
from .models import CustomUser,OTP




@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_active')
    search_fields = ('username', 'email')
    ordering = ('username',)


from django.utils import timezone
from datetime import timedelta

# show otp in admin panel
@admin.register(OTP)
class OTPAdmin(admin.ModelAdmin):
    list_display = ('email', 'otp', 'created_at', 'expires_at', 'is_used' , 'is_expired')
    list_filter = ('is_used',)
    search_fields = ('email', 'otp')
    ordering = ('-created_at',)

    def get_queryset(self, request):
        # Delete only OTPs expired 15+ mins ago
        fifteen_min_ago = timezone.now() - timedelta(minutes=15)
        OTP.objects.filter(expires_at__lt=fifteen_min_ago).delete()
        return super().get_queryset(request)
    
    def is_expired(self, obj):
        return obj.expires_at < timezone.now()
    is_expired.boolean = True