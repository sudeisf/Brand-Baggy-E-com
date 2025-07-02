from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

def send_notifications(recipient_user,message,notification_type="SYSTEM"):
      from .models import Notification

      notification = Notification.objects.create(
            recipient = recipient_user,
            message = message,
            type = notification_type
      )

      channel_layer = get_channel_layer()
      group_name = f"seller_{recipient_user.id}"
      async_to_sync(channel_layer.group_send)(
            group_name,
            {
                  "type": "notify",
                  "notification": {
                  "id": notification.id,
                  "message": notification.message,
                  "type": notification.type,
                  "is_read": notification.is_read,
                  "created_at": notification.created_at.isoformat(),
            }
            }
                 
      )

      return notification