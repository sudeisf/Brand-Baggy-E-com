import paypalrestsdk.exceptions
import requests
from rest_framework import status 
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .serilizers import PaymentSerializer, PaymentRequestSerializer , PayPalSuccessSerializer
from orders.models import Order
from .models import Payment
import stripe
from django.conf import settings
import paypalrestsdk
from django.http import HttpResponse
import json
from rest_framework.permissions import IsAuthenticated

from rest_framework.decorators import api_view 

from django.views.decorators.csrf import csrf_exempt
from django.conf import Settings

paypalrestsdk.configure({
    "mode": "sandbox",
    "client_id": settings.PAYPAL_CLIENT_ID,
    "client_secret": settings.PAYPAL_CLIENT_SECRET
})

stripe.api_key = settings.STRIPE_SECRET_KEY

class CODPaymentAPIView(APIView):
    def post(self , request):
        serializer = PaymentRequestSerializer(data = request.data)
        if serializer.is_valid():
            order_id = serializer.validated_data['order_id']
            try:
                order = Order.objects.get(id=order_id)
                if hasattr(order ,'payment'):
                    return Response(
                        {
                            "error" : "payment already exists"
                        },
                        status=400
                    )
                payment  = Payment.objects.create(
                    order = order,
                    method=Payment.Method.COD,
                    status=Payment.Status.COMPLETED,
                    amount=order.total_price
                )
                return Response(PaymentSerializer(payment).data, status=201)
            
            except Order.DoesNotExist:
                return Response({'error' : "order not found"} , status=status.HTTP_404_NOT_FOUND)
            
        return Response(serializer.errors , status=400)


class StripePaymentIntentAPIView(APIView):
    def post(self, request):
        serializer = PaymentRequestSerializer(data=request.data)
        if serializer.is_valid():
            order_id = serializer.validated_data['order_id']
            try:
                order = Order.objects.get(id=order_id)

                if hasattr(order , "payment"):
                    return Response({'error' : 'payment already exists'} ,status=400) 
                
                intent = stripe.PaymentIntent.create(
                    amount=int(order.total_price * 100),
                    currency='usd',
                    metadata={'order_id': str(order.id)}
                )

                payment = Payment.objects.create(
                    order=order,
                    method=Payment.Method.STRIPE,
                    status=Payment.Status.PENDING,
                    amount=order.total_price,
                    transaction_id=intent.id,
                )
                return Response({'client_secret': intent.client_secret}, status=200)
            except Order.DoesNotExist:
                return Response({"error" : "order not found"} ,status=404)
        return Response(serializer.errors, status=400)
    





class PayPalPaymentAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        serializer = PaymentRequestSerializer(data=request.data)
        if serializer.is_valid():
            order_id = serializer.validated_data['order_id']
            try:
                order = Order.objects.get(id=order_id)

                if hasattr(order, 'payment'):
                    return Response({'error': 'Payment already exists'}, status=400)
                
                auth_response = requests.post(
                    f"{settings.PAYPAL_API_BASE}/v1/oauth2/token",
                    auth=(settings.PAYPAL_CLIENT_ID, settings.PAYPAL_CLIENT_SECRET),
                    data={"grant_type": "client_credentials"},
                )
                access_token = auth_response.json().get("access_token")

                headers = {
                        "Content-Type": "application/json",
                        "Authorization": f"Bearer {access_token}",
                    }
                
                body = {
                    "intent": "CAPTURE",
                    "purchase_units": [{
                        "amount": {
                            "currency_code": "USD",
                            "value": str(order.total_price)
                        }
                    }]
                }

                create_order_response = requests.post(
                    f"{settings.PAYPAL_API_BASE}/v2/checkout/orders",
                    json=body,
                    headers=headers
                )

                if create_order_response.status_code != 201:
                    return Response({'error': 'PayPal order creation failed'}, status=400)

                paypal_data = create_order_response.json()

                
                Payment.objects.create(
                        order=order,
                        method=Payment.Method.PAYPAL,
                        status=Payment.Status.PENDING,
                        amount=order.total_price,
                        transaction_id=paypal_data["id"],
                        provider_response=paypal_data
                    )
                return Response({
                        'paypal_order_id': paypal_data["id"]
                    }, status=200)
               
            except Order.DoesNotExist:
                return Response({'error': 'Order not found'}, status=404)
        return Response(serializer.errors, status=400)
    

class PayPalCaptureAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        paypal_payment_id = request.data.get("paypal_payment_id")
        if not paypal_payment_id:
            return Response({"error": "Missing PayPal payment ID"}, status=400)

        try:
            # Get access token
            auth_response = requests.post(
                f"{settings.PAYPAL_API_BASE}/v1/oauth2/token",
                auth=(settings.PAYPAL_CLIENT_ID, settings.PAYPAL_CLIENT_SECRET),
                data={"grant_type": "client_credentials"},
            )
            access_token = auth_response.json().get("access_token")
            if not access_token:
                return Response({"error": "Failed to authenticate with PayPal"}, status=400)

            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {access_token}",
            }

            capture_response = requests.post(
                f"{settings.PAYPAL_API_BASE}/v2/checkout/orders/{paypal_payment_id}/capture",
                headers=headers,
            )

            if capture_response.status_code in [200, 201]:
                capture_data = capture_response.json()

                try:
                    db_payment = Payment.objects.get(transaction_id=paypal_payment_id)
                    db_payment.status = Payment.Status.COMPLETED
                    db_payment.provider_status = capture_data
                    db_payment.save()

                    order = db_payment.order
                    order.status = Order.OrderStatus.PAID
                    order.save()

                    return Response({
                        "message": "Payment captured successfully",
                        "data": capture_data
                    }, status=200)
                except Payment.DoesNotExist:
                    return Response({"error": "Payment not found"}, status=404)

            # If capture failed
            return Response({
                "error": "Capture failed",
                "details": capture_response.json()
            }, status=400)

        except Exception as e:
            return Response({"error": str(e)}, status=500)

    
@csrf_exempt
@api_view(['POST'])
def stripe_webhook_view(request):
    payload = request.body
    sig_header = request.META.get("HTTP_STRIPE_SIGNATURE")
    webhook_secret = settings.STRIPE_WEBHOOK_SECRET

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, webhook_secret
        )
    except ValueError:
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError:
        return HttpResponse(status=400)

    if event["type"] == "payment_intent.succeeded":
        print(" Payment received!")

    return HttpResponse(status=200)

