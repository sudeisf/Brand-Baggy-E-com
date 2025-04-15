# from celery import shared_task
# from django.utils import timezone
# from .models import OTP

# @shared_task
# def delete_expired_otps():
#     threshold = timezone.now() - timezone.timedelta(minutes=15)
#     OTP.objects.filter(created_at__lt=threshold, is_used=False).delete()
