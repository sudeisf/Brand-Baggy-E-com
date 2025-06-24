
from django.contrib import admin
from django.urls import include, path


urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('accounts.urls')),
    path('auth/', include('dj_rest_auth.urls')),
    path('product/' , include('product.urls')),
    path('cart/', include('cart.urls', namespace='cart')),
    path('payment/' , include('payment.urls')),
    path('silk/', include('silk.urls', namespace='silk'))

]
