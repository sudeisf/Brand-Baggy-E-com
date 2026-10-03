from .models import Payment
from rest_framework import serializers



class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'

class PaymentRequestSerializer(serializers.Serializer):
    order_id = serializers.IntegerField()

class PayPalSuccessSerializer(serializers.Serializer):
    payment_id = serializers.CharField(required=True, source='paymentId')
    payer_id = serializers.CharField(required=True, source='PayerID')