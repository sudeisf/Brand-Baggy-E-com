
from django.contrib import admin
from django.urls import include, path
from django.http import HttpResponse


def health_check(request):
    return HttpResponse("OK", status=200)

urlpatterns = [
    path('', health_check),
    path('admin/', admin.site.urls),
    path('accounts/', include('accounts.urls')),
    path('auth/', include('dj_rest_auth.urls')),
    path('product/' , include('product.urls')),
    path('cart/', include('cart.urls', namespace='cart')),
    path('payment/' , include('payment.urls')),
    path('orders/' , include('orders.urls')),
    path('silk/', include('silk.urls', namespace='silk')),
    path("notifications/", include("notifications.urls")),


]
