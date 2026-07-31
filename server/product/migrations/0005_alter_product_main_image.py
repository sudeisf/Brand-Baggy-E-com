import cloudinary.models
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0004_alter_productdiscount_product'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='main_image',
            field=cloudinary.models.CloudinaryField(
                blank=True,
                max_length=255,
                null=True,
                verbose_name='image',
            ),
        ),
    ]
