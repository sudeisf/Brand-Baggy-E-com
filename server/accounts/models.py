from datetime import timedelta
from django.utils import timezone
from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.utils.translation import gettext_lazy as _
from cloudinary.models import CloudinaryField


class CustomUser(AbstractUser):

    class Role(models.TextChoices):
        SELLER = 'seller'
        BUYER = 'buyer'
        ADMIN = 'admin'
    
    class Gender(models.TextChoices):
       MALLE = 'male',
       FEMALE = "female"
    
    
    groups = models.ManyToManyField(
        Group, 
        related_name="customUsers_groups",
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name="customUsers_user_permissions",
        blank=True,
    )


    email = models.EmailField(unique=True)
    username = models.CharField(max_length=30 , unique=True)
    first_name = models.CharField(max_length=30 ,null=True , blank=True) 
    lastname_name = models.CharField(max_length=30 ,null=True , blank=True)
    user_role =  models.CharField(max_length=200, choices=Role.choices, default=Role.BUYER)
    birth_date = models.DateField(null=True,blank=True)
    gender = models.CharField(max_length=200, choices=Gender.choices,blank=True , null=True)
    phone_number = models.CharField(max_length=20,null=True,blank=True)
    profile_url =  CloudinaryField('image', null=True, blank=True)

    
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def is_seller(self):
        return self.user_role == self.Role.SELLER

    def is_buyer(self):
        return self.user_role == self.Role.BUYER

    def __str__(self):
        return self.username




class OTP(models.Model):
    email = models.EmailField()
    otp = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_expired = models.BooleanField(default=False)
    is_used = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.email} - {self.otp}"
    
    def save(self,*args,**kwargs):
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(minutes=15)
        super().save(*args,**kwargs)

    @property
    def is_valid(self):
        return not self.is_used and self.expires_at < timezone.now()





