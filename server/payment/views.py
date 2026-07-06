import requests
from rest_framework import status 
from rest_framework.views import APIView
from rest_framework.response import Response
from .serilizers import PaymentSerializer, PaymentRequestSerializer
from orders.models import Order
from .models import Payment
import stripe
from django.conf import settings
import paypalrestsdk
from django.http import HttpResponse
from rest_framework.permissions import IsAuthenticated

from rest_framework.decorators import api_view 

from django.views.decorators.csrf import csrf_exempt

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


class PayPalPaymentAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PaymentRequestSerializer(data=request.data)
        if serializer.is_valid():
            order_id = serializer.validated_data['order_id']
            try:
                order = Order.objects.get(id=order_id)

                try:
                    payment = Payment.objects.get(order=order)
                except Payment.DoesNotExist:
                    return Response({'error': 'Payment record missing for order.'}, status=404)

                if payment.method == Payment.Method.PAYPAL and payment.transaction_id:
                    return Response({'error': 'PayPal payment already initialized.'}, status=400)

                # Get PayPal access token
                auth_response = requests.post(
                    f"{settings.PAYPAL_API_BASE}/v1/oauth2/token",
                    auth=(settings.PAYPAL_CLIENT_ID, settings.PAYPAL_CLIENT_SECRET),
                    data={"grant_type": "client_credentials"},
                )
                access_token = auth_response.json().get("access_token")
                if not access_token:
                    return Response({'error': 'PayPal authentication failed'}, status=400)

                headers = {
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {access_token}",
                }

                # Create PayPal order
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
                    return Response({'error': 'Failed to create PayPal order'}, status=400)

                paypal_data = create_order_response.json()

                # Update existing payment record
                payment.method = Payment.Method.PAYPAL
                payment.transaction_id = paypal_data["id"]
                payment.provider_response = paypal_data
                payment.status = Payment.Status.PENDING
                payment.save()

                return Response({'paypal_order_id': paypal_data["id"]}, status=200)

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

class StripeCreateOrderAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PaymentRequestSerializer(data=request.data)
        if serializer.is_valid():
            order_id = serializer.validated_data['order_id']
            try:
                order = Order.objects.get(id=order_id)

                if hasattr(order, "payment"):
                    return Response({'error': 'Payment already exists'}, status=400)

                intent = stripe.PaymentIntent.create(
                    amount=int(order.total_price * 100),
                    currency='usd',
                    capture_method='manual',  # key part: authorize only
                    metadata={'order_id': str(order.id)}
                )

                Payment.objects.create(
                    order=order,
                    method=Payment.Method.STRIPE,
                    status=Payment.Status.PENDING,
                    amount=order.total_price,
                    transaction_id=intent.id,
                    provider_response=intent,
                )

                return Response({
                    'client_secret': intent.client_secret,
                    'payment_intent_id': intent.id
                }, status=200)

            except Order.DoesNotExist:
                return Response({'error': 'Order not found'}, status=404)
        return Response(serializer.errors, status=400)
    
    
class StripeCaptureAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        payment_intent_id = request.data.get("payment_intent_id")
        if not payment_intent_id:
            return Response({"error": "Missing Stripe payment intent ID"}, status=400)

        try:
            payment_intent = stripe.PaymentIntent.capture(payment_intent_id)

            try:
                db_payment = Payment.objects.get(transaction_id=payment_intent_id)
                db_payment.status = Payment.Status.COMPLETED
                db_payment.provider_status = payment_intent
                db_payment.save()

                order = db_payment.order
                order.status = Order.OrderStatus.PAID
                order.save()

                return Response({
                    "message": "Payment captured successfully",
                    "data": payment_intent
                }, status=200)
            except Payment.DoesNotExist:
                return Response({"error": "Payment not found"}, status=404)

        except stripe.error.InvalidRequestError as e:
            return Response({"error": str(e)}, status=400)
        except Exception as e:
            return Response({"error": str(e)}, status=500)


from .tasks import send_payment_receipt_email

class StripePayAndCaptureAPIView(APIView):
    def update_failed_payment(self, payment, status_code, error):
        """Update existing payment record with failed status."""
        if payment.status == Payment.Status.FAILED:
            print(f"[DEBUG] Payment already marked as failed for order {payment.order.id}")
            return

        print(f"[DEBUG] Updating failed payment for order {payment.order.id} | reason: {error}")
        payment.method = Payment.Method.STRIPE
        payment.status = Payment.Status.FAILED
        payment.provider_status = status_code
        payment.provider_response = {'error': str(error)}
        payment.save()

    def post(self, request):
        serializer = PaymentRequestSerializer(data=request.data)
        if not serializer.is_valid():
            print("[DEBUG] Invalid serializer:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        order_id = serializer.validated_data['order_id']
        print(f"[DEBUG] Processing payment for order ID: {order_id}")

        try:
            order = Order.objects.get(id=order_id)
            print(f"[DEBUG] Found order: {order.id}, total price: {order.total_price}")

            try:
                payment = Payment.objects.get(order=order)
            except Payment.DoesNotExist:
                print(f"[DEBUG] No payment record found for order {order.id}")
                return Response({'error': 'Payment record missing for order'}, status=status.HTTP_404_NOT_FOUND)

            if payment.method == Payment.Method.STRIPE and payment.transaction_id:
                print(f"[DEBUG] Stripe payment already initiated for order {order.id}")
                return Response({'error': 'Stripe payment already exists for this order'}, status=400)

            # ✅ Create Stripe PaymentIntent
            payment_intent = stripe.PaymentIntent.create(
                amount=int(order.total_price * 100),
                currency='usd',
                payment_method=request.data.get("payment_method_id"),
                confirm=True,
                automatic_payment_methods={
                    'enabled': True,
                    'allow_redirects': 'never',
                },
                metadata={'order_id': str(order.id)}
            )

            payment_status = payment_intent.status
            is_success = payment_status == 'succeeded'
            print(f"[DEBUG] Stripe status: {payment_status} | success: {is_success}")

            # ✅ Update existing payment
            payment.method = Payment.Method.STRIPE
            payment.transaction_id = payment_intent.id
            payment.provider_status = payment_status
            payment.provider_response = payment_intent
            payment.status = Payment.Status.COMPLETED if is_success else Payment.Status.FAILED
            payment.save()

            if is_success:
                order.status = Order.OrderStatus.PAID
                order.save()
                print(f"[DEBUG] Order {order.id} marked as PAID.")

                # ✅ Send email via Celery
                print(f"[DEBUG] Queuing payment receipt email for order {order.id}, payment {payment.id}")
                send_payment_receipt_email.delay(order.id, payment.id)

                return Response({
                    'message': 'Payment successful and order completed',
                    'payment_intent': payment_intent.id
                }, status=status.HTTP_200_OK)

            else:
                print(f"[DEBUG] Payment failed for order {order.id}, status: {payment_status}")
                return Response({
                    "error": "Payment not successful",
                    "status": payment_status
                }, status=status.HTTP_400_BAD_REQUEST)

        except Order.DoesNotExist:
            print(f"[DEBUG] Order with id {order_id} does not exist.")
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

        except stripe.error.CardError as e:
            print(f"[DEBUG] Stripe CardError: {e}")
            if 'payment' in locals():
                self.update_failed_payment(payment, getattr(e, 'code', 'card_error'), e)
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except stripe.error.StripeError as e:
            print(f"[DEBUG] Stripe error: {e}")
            if 'payment' in locals():
                self.update_failed_payment(payment, getattr(e, 'code', 'stripe_error'), e)
            return Response({'error': f'Stripe error: {e}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            print(f"[DEBUG] Unexpected error: {e}")
            if 'payment' in locals():
                self.update_failed_payment(payment, 'unexpected_error', e)
            return Response({'error': f'Unexpected error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
