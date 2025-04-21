from .models import Payment
from rest_framework import serializers



class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'

class PaymentRequestSerializer(serializers.Serializer):
    order_id = serializers.UUIDField()