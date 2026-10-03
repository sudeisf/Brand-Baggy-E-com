from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from celery import shared_task
from django.template.loader import render_to_string
from .models import Payment
from orders.models import Order
import logging

logger = logging.getLogger(__name__)



@shared_task(bind=True,max_retries=3)
def send_payment_receipt_email(self, order_id, payment_id):
      logger.info(f"send_payment_receipt_email called with order_id={order_id}, payment_id={payment_id}")
      try: 
            order = Order.objects.get(id=order_id)
            payment = Payment.objects.get(id=payment_id)
            
            # Determine recipient info — support guest orders
            user = order.user
            if user:
                recipient_email = user.email
                user_name = user.get_full_name() or user.email.split('@')[0]
            elif order.guest_email:
                recipient_email = order.guest_email
                user_name = order.guest_full_name or recipient_email.split('@')[0]
            else:
                logger.warning(f"No email available for order {order_id}, skipping payment receipt.")
                return

            context = {
                  'payment_amount': payment.amount,
                  'user_name': user_name,
                  'payment_date': payment.created_at.strftime("%B %d, %Y"),
                  'payment_method': payment.get_method_display(),
                  'confirmation_code': payment.transaction_id,
                  'loan_id': payment.transaction_id[:8]
            }

            html_content = render_to_string('payment/emails/payment_receipt.html', context)
            text_content = f"""Payment Receipt\n---------------\nAmount: ${context['payment_amount']}\nDate: {context['payment_date']}"""

            email = EmailMultiAlternatives(
                  subject=f"Payment Confirmation #{order.id}",
                  body=text_content,
                  from_email=settings.DEFAULT_FROM_EMAIL,
                  to=[recipient_email],
                  reply_to=[settings.CONTACT_EMAIL],
            )
            email.attach_alternative(html_content, "text/html")
            email.send()
                  
      except Exception as e:
        self.retry(exc=e, countdown=60 * self.request.retries)