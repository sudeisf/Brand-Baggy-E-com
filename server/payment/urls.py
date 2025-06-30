from django.urls import path
from .views import (CODPaymentAPIView, 
                    PayPalPaymentAPIView,
                    PayPalCaptureAPIView,
                    StripeCreateOrderAPIView,
                    StripeCaptureAPIView,
                    StripePayAndCaptureAPIView
                    )
from .views import stripe_webhook_view

urlpatterns = [
    path('pay/cod/', CODPaymentAPIView.as_view()),
    path('paypal/create-order/', PayPalPaymentAPIView.as_view()),
    path('paypal/capture-order/', PayPalCaptureAPIView.as_view()),
    path('webhook', stripe_webhook_view, name='stripe-webhook'),
    path("stripe/create-order/", StripeCreateOrderAPIView.as_view()),
    path("stripe/capture-order/", StripeCaptureAPIView.as_view()),
    path("stripe/pay-and-capture/", StripePayAndCaptureAPIView.as_view()),
 

]

