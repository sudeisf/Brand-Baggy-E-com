from django.core.management.base import BaseCommand

from product.seed import seed_categories


class Command(BaseCommand):
    help = "Seed Category model with parent and subcategory data."

    def handle(self, *args, **options):
        self.stdout.write("Seeding categories...")
        result = seed_categories()
        self.stdout.write(
            self.style.SUCCESS(
                f"Done. Created: {result['created']}, already existed: {result['existing']}"
            )
        )
