import bleach
from django.db.models.signals import pre_save
from django.dispatch import receiver
from .models import Product, ProductReview

@receiver(pre_save, sender=Product)
def sanitize_product_fields(sender, instance, **kwargs):
    if instance.name:
        instance.name = bleach.clean(instance.name, tags=[], strip=True)
    if instance.description:
        instance.description = bleach.clean(instance.description, tags=[], strip=True)

@receiver(pre_save, sender=ProductReview)
def sanitize_review_fields(sender, instance, **kwargs):
    if instance.review:
        instance.review = bleach.clean(instance.review, tags=[], strip=True)

