from django.db import models

# Create your models here.
class Item(models.Model):
    name = models.CharField(max_length=100)
    description  = models.TextField()


    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField()
    
    def __str__(self):
        return self.name

