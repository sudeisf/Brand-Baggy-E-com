from django.utils.text import slugify

from .models import Category

CATEGORIES_DATA = {
    "Men": ["T-Shirts", "Jackets", "Jeans"],
    "Women": ["Dresses", "Tops", "Skirts"],
    "Kids": ["Shirts", "Shorts", "Accessories"],
}


def seed_categories():
    """Idempotently seed parent categories and their subcategories."""
    created_count = 0
    existing_count = 0

    for parent_name, subcategories in CATEGORIES_DATA.items():
        parent, created = Category.objects.get_or_create(
            name=parent_name,
            parent=None,
            defaults={
                "slug": slugify(parent_name),
                "description": f"{parent_name} clothing and accessories",
            },
        )
        if created:
            created_count += 1
        else:
            existing_count += 1

        for sub_name in subcategories:
            _, created = Category.objects.get_or_create(
                name=sub_name,
                parent=parent,
                defaults={
                    "slug": slugify(sub_name),
                    "description": f"{sub_name} for {parent_name.lower()}",
                },
            )
            if created:
                created_count += 1
            else:
                existing_count += 1

    return {"created": created_count, "existing": existing_count}
