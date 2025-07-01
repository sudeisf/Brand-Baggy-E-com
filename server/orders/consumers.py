from channels.generic.websocket import AsyncJsonWebsocketConsumer
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth import get_user_model
from channels.db import database_sync_to_async


User = get_user_model()

class SellerNotificationConsumer(AsyncJsonWebsocketConsumer):
      async def connect(self):
            token = self.scope["query_string"].decode().split("token=")[-1]

            try :
                  access_token = AccessToken(token)
                  user = await self.get_user(access_token["user_id"])
            except Exception:
                  await self.close()
                  return
            
            if not user or not hasattr(user, "seller"):
                  await self.close()
                  return 
            self.scope["user"] = user
            self.seller_id = user.seller.id
            self.group_name = f"seller_{self.seller_id}"

            await self.channel_layer.group_add(self.group_name, self.channel_name)
            await self.accept()

            @database_sync_to_async
            def get_user(self, user_id):
                  try:
                        return User.objects.get(id=user_id)
                  except User.DoesNotExist:
                        return None
      
      async def disconnect(self, close_code):
            await self.channel_layer.group_discard("seller_notifications",self.channel_name)   

      async def send_order_notification(self,event):
             await self.send_json(event['message'])  
      