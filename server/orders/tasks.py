from celery import shared_task
from django.conf import settings
from django.template.loader import render_to_string
import logging
from .models import Order
import os
from dotenv import load_dotenv
from django.core.mail import EmailMultiAlternatives
from django.utils.html import strip_tags


FRONTEND_URL = os.getenv("FRONT_END_URL","http://localhost:3000")

logger = logging.getLogger(__name__)
@shared_task(bind=True, max_retries=3)
def send_review_rating_email(self, order_id):
    logger.info(f"send_review_rating_email triggered for order_id={order_id}")
    try:
        order = Order.objects.select_related("user").prefetch_related("items__product").get(id=order_id)
        user = order.user

        # Determine recipient info — support guest orders
        if user:
            recipient_email = user.email
            user_name = user.username
        elif order.guest_email:
            recipient_email = order.guest_email
            user_name = order.guest_full_name or recipient_email.split('@')[0]
        else:
            logger.warning(f"No email available for order {order_id}, skipping review email.")
            return

        product_names = list(order.items.values_list("product__name", flat=True))
        review_link = f"{FRONTEND_URL}/reviews/{order.id}/"

        html_content = render_to_string('deliverd/rating_review.html', {
            "user_name": user_name,
            "product_names": product_names,
            "review_link": review_link,
        })
        text_content = strip_tags(html_content)

        subject = "Tell us what you think of your delivered product(s)"
        email = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[recipient_email],
            reply_to=[settings.CONTACT_EMAIL],
        )
        email.attach_alternative(html_content, "text/html")

        email.send()
        logger.info(f"Review request email sent to {recipient_email} for order {order_id}")

    except Exception as e:
        logger.error(f"❌ Failed to send review request email for order {order_id}: {str(e)}", exc_info=True)
        self.retry(exc=e, countdown=60 * self.request.retries)