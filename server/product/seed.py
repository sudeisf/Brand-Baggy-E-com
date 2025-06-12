from .models import Category
from django.utils.text import slugify

def seed_categories():
    categories_data = {
        "Men": ["T-Shirts", "Jackets", "Jeans"],
        "Women": ["Dresses", "Tops", "Skirts"],
        "Kids": ["Shirts", "Shorts", "Accessories"]
    }

    for parent_name, subcategories in categories_data.items():
        parent, created = Category.objects.get_or_create(
            name=parent_name,
            parent=None,
            defaults={
                'slug': slugify(parent_name),
                'description': f"{parent_name} clothing and accessories"
            }
        )

        for sub_name in subcategories:
            Category.objects.get_or_create(
                name=sub_name,
                parent=parent,
                defaults={
                    'slug': slugify(sub_name),
                    'description': f"{sub_name} for {parent_name.lower()}"
                }
            )

if __name__ == "__main__":
    seed_categories()
