from django.urls import path
from .views import CODPaymentAPIView, StripePaymentIntentAPIView, PayPalPaymentAPIView ,PayPalWebhookAPIView
from .views import stripe_webhook_view

urlpatterns = [
    path('pay/cod/', CODPaymentAPIView.as_view()),
    path('pay/stripe/', StripePaymentIntentAPIView.as_view()),
    path('pay/paypal/', PayPalPaymentAPIView.as_view()),
    path('webhook', stripe_webhook_view, name='stripe-webhook'),
    path('webhooks/paypal/', PayPalWebhookAPIView.as_view(), name='paypal-webhook'),
]



