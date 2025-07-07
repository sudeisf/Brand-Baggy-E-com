import os
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.core.asgi import get_asgi_application
import notifications.routing
import orders.routing

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "first_django_server.settings")

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            notifications.routing.websocket_urlpatterns,
            # orders.routing.websocket_urlpatterns
        )
    ),
})
