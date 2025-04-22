import paypalrestsdk.exceptions
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
    def post(self, request):
        serializer = PaymentRequestSerializer(data=request.data)
        if serializer.is_valid():
            order_id = serializer.validated_data['order_id']
            try:
                order = Order.objects.get(id=order_id)

                if hasattr(order, 'payment'):
                    return Response({'error': 'Payment already exists'}, status=400)

                paypal_payment = paypalrestsdk.Payment({
                    "intent": "sale",
                    "payer": {"payment_method": "paypal"},
                    "redirect_urls": {
                        "return_url": "https://741f-102-208-97-146.ngrok-free.app/payment/success/",
                        "cancel_url": "https://741f-102-208-97-146.ngrok-free.app/payment/cancel/" },
                    "transactions": [{
                        "item_list": {
                            "items": [{
                                "name": f"Order #{order.id}",
                                "sku": "item",
                                "price": str(order.total_price),
                                "currency": "USD",
                                "quantity": 1
                            }]
                        },
                        "amount": {
                            "total": str(order.total_price),
                            "currency": "USD"
                        },
                        "description": "Payment for ecommerce order"
                    }]
                })

                if paypal_payment.create():
                    Payment.objects.create(
                        order=order,
                        method=Payment.Method.PAYPAL,
                        status=Payment.Status.PENDING,
                        amount=order.total_price,
                        transaction_id=paypal_payment.id,
                        provider_response=paypal_payment.to_dict()
                    )
                    approval_url = next(link.href for link in paypal_payment.links if link.rel == 'approval_url')
                    return Response({'approval_url': approval_url}, status=200)

                return Response({'error': 'PayPal payment failed'}, status=400)

            except Order.DoesNotExist:
                return Response({'error': 'Order not found'}, status=404)
        return Response(serializer.errors, status=400)
    
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


class PayPalWebhookAPIView(APIView):
    def post(request):
        webhook_event = request.data 

        transmission_id = request.headers.get('Paypal-Transmission-Id')
        timestamp = request.headers.get('Paypal-Transmission-Time')
        webhook_id = settings.PAYPAL_WEBHOOK_ID
        cert_url = request.headers.get('Paypal-Cert-Url')
        auth_algo = request.headers.get('Paypal-Auth-Algo')
        transmission_sig = request.headers.get('Paypal-Transmission-Sig')

        webhook_event_body = request.body.decode('utf-8')
        verify = paypalrestsdk.WebhookEvent.verify(
            transmission_id=transmission_id,
            timestamp=timestamp,
            webhook_id=webhook_id,
            event_body=webhook_event_body,
            cert_url=cert_url,
            auth_algo=auth_algo,
            transmission_sig=transmission_sig
        )

        if not verify:
            return Response({'error': 'Webhook verification failed'}, status=400)
        
        event_type = webhook_event.get('event_type')
        resource = webhook_event.get('resource')

        if event_type == 'PAYMENT.SALE.COMPLETED':
            transaction_id =  resource.get('parent_payment')
            try:
                payment = Payment.objects.get(transaction_id=transaction_id)
                if payment.status != Payment.Status.COMPLETED:
                    payment.status = Payment.Status.COMPLETED
                    payment.provider_response = resource
                    payment.save()
                    
                    # Update order status
                    order = payment.order
                    order.status = Order.status.PAID
                
                return Response({'status': 'Success'}, status=200)
            
            except Payment.DoesNotExist:
                return Response({'error': 'Payment not found'}, status=404)

        elif event_type == 'PAYMENT.SALE.REFUNDED':
            # Handle refund
            transaction_id = resource.get('parent_payment')
            try:
                payment = Payment.objects.get(transaction_id=transaction_id)
                payment.status = Payment.Status.REFUNDED
                payment.provider_response = resource
                payment.save()
                
                # Update order status
                order = payment.order
                order.status = Order.Status.REFUNDED
                order.save()
                
                return Response({'status': 'Success'}, status=200)
            
            except Payment.DoesNotExist:
                return Response({'error': 'Payment not found'}, status=404)

        return Response({'status': 'Ignored event'}, status=200)


class PayPalSuccessAPIView(APIView):
    def get(self , request):
        serializer = PayPalSuccessSerializer(data=request.GET)
        if not serializer.is_valid():
            return Response({'error': serializer.errors}, status=400)
        # Get validated data
        payment_id = serializer.validated_data['payment_id']
        payer_id = serializer.validated_data['payer_id']

        try: 
            payment = paypalrestsdk.Payment.find(payment_id)
            if payment.execute({"payer_id": payer_id}):
                try:
                    db_payment = Payment.objects.get(transaction_id = payment_id)
                    if db_payment.status != Payment.Status.COMPLETED:
                        db_payment.status = Payment.Status.COMPLETED
                        db_payment.provider_status = payment.to_dict()
                        db_payment.save()

                        order = db_payment.order
                        order.status = Order.OrderStatus.PAID
                        order.save()

                        return Response({'status': 'Payment completed', 'order_id': order.id}, status=200)
                    else:
                        return Response({
                            "status " : "Payment already have been completed."                        
                            } , status=200)
                except Payment.DoesNotExist:
                    return Response({
                            "status " : "Payment does not exist in the data base."                        
                            } , status=400)
            else:
                return Response({'error': 'Payment execution failed'}, status=400)
        except paypalrestsdk.exceptions.ResourceNotFound:
             return Response({'Resource is not found'})
        except Exception as e:
            return Response({
                'error' : f" the system found {e}"
            })

class PayPalCancelAPIView(APIView):
    def get(self, request):
        order_id  = request.GET.get('order_id')
        return Response({'status': 'Payment cancelled', 'order_id': order_id or None}, status=200)


