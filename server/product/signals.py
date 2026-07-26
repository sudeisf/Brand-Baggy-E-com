import bleach
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.db import models
from django.apps import apps

# Only sanitize user-facing models from these apps
SANITIZE_APPS = {'product', 'accounts', 'orders', 'cart'}

@receiver(pre_save)
def sanitize_text_fields(sender, instance, **kwargs):
    # Skip models from apps that don't accept user text input
    # (Django internals like auth, sessions, admin, contenttypes, etc.)
    app_label = sender._meta.app_label
    if app_label not in SANITIZE_APPS:
        return

    for field in instance._meta.fields:
        if isinstance(field, (models.CharField, models.TextField)):
            value = getattr(instance, field.name, None)
            if value and isinstance(value, str):
                # Clean the value by stripping all HTML tags
                clean_value = bleach.clean(value, tags=[], attributes={}, strip=True)
                if value != clean_value:
                    setattr(instance, field.name, clean_value)

