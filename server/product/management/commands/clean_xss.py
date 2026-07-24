import bleach
from django.core.management.base import BaseCommand
from django.apps import apps
from django.db import models
from django.db.transaction import atomic

class Command(BaseCommand):
    help = 'Cleans all CharField and TextField in the database by stripping HTML tags to fix XSS vulnerabilities.'

    def handle(self, *args, **options):
        self.stdout.write("Starting database XSS cleanup...")
        total_cleaned = 0

        # Loop through all models in all installed apps
        for app_config in apps.get_app_configs():
            # Skip built-in apps and third party apps to prevent breaking their data if any
            # Focus on our own apps
            if app_config.name not in ['accounts', 'cart', 'notifications', 'orders', 'payment', 'product']:
                continue

            for model in app_config.get_models():
                # Find all text-based fields
                text_fields = [f.name for f in model._meta.fields if isinstance(f, (models.CharField, models.TextField))]
                if not text_fields:
                    continue
                
                cleaned_in_model = 0
                try:
                    with atomic():
                        for instance in model.objects.iterator():
                            changed = False
                            for field_name in text_fields:
                                value = getattr(instance, field_name, None)
                                if value and isinstance(value, str):
                                    # Strip HTML
                                    clean_value = bleach.clean(value, tags=[], attributes={}, strip=True)
                                    if clean_value != value:
                                        setattr(instance, field_name, clean_value)
                                        changed = True
                            
                            if changed:
                                instance.save(update_fields=text_fields)
                                cleaned_in_model += 1
                                total_cleaned += 1
                                
                    if cleaned_in_model > 0:
                        self.stdout.write(self.style.SUCCESS(f"Cleaned {cleaned_in_model} records in model {model.__name__}"))
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f"Error cleaning {model.__name__}: {e}"))

        self.stdout.write(self.style.SUCCESS(f"Cleanup complete. Total records cleaned: {total_cleaned}"))
