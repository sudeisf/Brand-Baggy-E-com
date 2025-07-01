from django.db import models
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _

User = get_user_model()

class Notification(models.Model):
    class NotificationType(models.TextChoices):
        ORDER = "ORDER", _("Order")
        MESSAGE = "MESSAGE", _("Message")
        PRODUCT = "PRODUCT", _("Product")
        SYSTEM = "SYSTEM", _("System")

    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    type = models.CharField(max_length=20, choices=NotificationType.choices, default=NotificationType.SYSTEM)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

#     # Optional: Related object IDs for linking
#     related_order = models.ForeignKey("orders.Order", null=True, blank=True, on_delete=models.SET_NULL)
#     related_product = models.ForeignKey("products.Product", null=True, blank=True, on_delete=models.SET_NULL)
    
    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.recipient.username} - {self.type} - {self.message[:40]}"
