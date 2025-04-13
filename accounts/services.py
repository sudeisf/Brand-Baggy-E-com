

from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth import get_user_model


User = get_user_model()


def sendEmail(subject , email , message):
    try:
        send_mail(
            subject,
            message,
            settings.EMAIL_HOST_USER,
            recipient_list=[email],
            fail_silently=False
        )
        return True
    except Exception as e:
        print(f'Error sending email: {e}')
        return False
    
     
