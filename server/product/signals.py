import bleach
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.db import models
from django.apps import apps

@receiver(pre_save)
def sanitize_text_fields(sender, instance, **kwargs):
    # Only run on models defined in our project (not Django built-in models if we want to avoid issues, 
    # but since XSS could be anywhere, we'll check if the model is from an app we care about).
    # To be safe and comprehensive, we can just sanitize all CharField and TextField on all models.
    
    # We will strip all HTML tags as per secure default.
    
    # Ensure it's a Django model instance
    if not isinstance(instance, models.Model):
        return

    for field in instance._meta.fields:
        if isinstance(field, (models.CharField, models.TextField)):
            value = getattr(instance, field.name, None)
            if value and isinstance(value, str):
                # Clean the value by stripping all HTML tags
                clean_value = bleach.clean(value, tags=[], attributes={}, strip=True)
                if value != clean_value:
                    setattr(instance, field.name, clean_value)
