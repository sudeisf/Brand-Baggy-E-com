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
    logger.info(f"📩 send_review_rating_email triggered for order_id={order_id}")
    
    try:
        logger.info("Fetching order from database...")
        order = Order.objects.select_related("user").prefetch_related("items__product").get(id=order_id)
        user = order.user

        logger.info("Extracting product names from order items...")
        product_names = list(order.items.values_list("product__name", flat=True))

        logger.info("Building review link...")
        review_link = f"{FRONTEND_URL}/reviews/{order.id}/"
        logger.info(f"Review link: {review_link}")

        logger.info("Rendering email template...")
        html_content = render_to_string('deliverd/rating_review.html', {
            "user_name": user.username,
            "product_names": product_names,
            "review_link": review_link,
        })

        logger.info("Stripping HTML for plain text fallback...")
        text_content = strip_tags(html_content)

        subject = "Tell us what you think of your delivered product(s)"
        logger.info("Constructing email object...")
        email = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[user.email],
            reply_to=[settings.CONTACT_EMAIL],
        )
        email.attach_alternative(html_content, "text/html")

        logger.info("Sending email...")
        email.send()

        logger.info(f"✅ Review request email sent to {user.email} for order {order_id}")

    except Exception as e:
        logger.error(f"❌ Failed to send review request email for order {order_id}: {str(e)}", exc_info=True)
        self.retry(exc=e, countdown=60 * self.request.retries)