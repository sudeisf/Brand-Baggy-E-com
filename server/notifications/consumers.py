from channels.generic.websocket import AsyncJsonWebsocketConsumer
from django.contrib.auth import get_user_model
from channels.db import database_sync_to_async
import logging

logger = logging.getLogger(__name__)


class SellerNotificationConsumer(AsyncJsonWebsocketConsumer):
      
      async def connect(self):
            from rest_framework_simplejwt.tokens import AccessToken

            try:
                  raw_query_string = self.scope["query_string"].decode()
                  logger.info(f"Query string: {raw_query_string}")
                  token = raw_query_string.split("token=")[-1]

                  access_token = AccessToken(token)
                  logger.info(f"Decoded token: {access_token}")

                  user = await self.get_user(access_token["user_id"])
                  logger.info(f"User fetched: {user}")

                  if user.user_role != "seller":
                        logger.warning("REJECTING - Not a seller")
                        await self.close()
                        return

                  self.scope["user"] = user
                  self.group_name = f"seller_{user.id}"

                  await self.channel_layer.group_add(self.group_name, self.channel_name)
                  await self.accept()
                  logger.info("WebSocket connection accepted.")

            except Exception as e:
                  logger.exception(f"Exception in WebSocket connect: {e}")
                  await self.close()


      @database_sync_to_async
      def get_user(self, user_id):
            User = get_user_model()
            try:
                  return User.objects.get(id=user_id)
            except User.DoesNotExist:
                  return None
      
      async def disconnect(self, close_code):
            if hasattr(self, 'group_name'):
                  await self.channel_layer.group_discard(self.group_name, self.channel_name)

      async def notify(self, event):
            logger.info(f"Sending notification: {event['notification']}")
            await self.send_json({
                  "type": "notification",
                  "data": event["notification"]
            })
                  
      