from celery import shared_task
from django.core.mail import send_mail
from django.template.loader import render_to_string
from .models import Order


@shared_task(bind=True, max_retries=3)
def send_order_confirmation(self,order_id):
      pass