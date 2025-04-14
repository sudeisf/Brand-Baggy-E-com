from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password
from django.core import exceptions
from django.contrib.auth import authenticate
from django.core  import signing
import random 
from .models import OTP
from .services import sendEmail
from django.utils import timezone
from datetime import timedelta
from django.conf import settings

User = get_user_model()

class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = '__all__'

    def validate_password(self, password):  # Expecting string, not a dictionary
        try:
            validate_password(password)
        except exceptions.ValidationError as e:
            raise serializers.ValidationError(str(e))
        return password
    
    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
          # Corrected variable name
        validated_data.pop('confirm_password')

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']

        )
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # Extract email and password from request
        email = attrs.get('email')
        password = attrs.get('password')

        # Check if both fields are present
        if not email or not password:
            raise serializers.ValidationError("Both 'email' and 'password' are required.")

        # Authenticate using email and password
        user = authenticate(
            request=self.context.get('request'),
            email=email,
            password=password
        )

        if user is None:
            raise serializers.ValidationError("Invalid email or password.")

        # Map email-login to username since JWT expects `username`
        attrs['username'] = user.username

        # Call super to get token data
        data = super().validate(attrs)

        # Add custom claims (extra data to send with token response)
        data['email'] = user.email
        data['username'] = user.username
        # data['is_verified'] = user.is_verified  # Uncomment if needed

        return data



class OtpSerializer(serializers.Serializer):
    class Meta: 
        model = OTP



class Email_varify_OTP_generate_serializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, email):
        if not User.objects.filter(email=email).exists():
            raise serializers.ValidationError("Email not found")
        return email
    
    def create(self, validated_data):
        email = validated_data['email']
        otp_code = random.randint(100000, 999999)
        expires_at = timezone.now() + timedelta(minutes=15)
        # encode otp
        encoded_otp = signing.dumps(otp_code, key=settings.SECRET_KEY)
        
        otp = OTP.objects.create(
            email = email,
            otp=encoded_otp,
            expires_at=expires_at
        )

        emailEncoded = signing.dumps(email, key=settings.SECRET_KEY)
       
        # encode otp
        sendEmail(
            "OTP varification Code",
            email,
            f"Your OTP is: {otp_code}\nExpires in 15 minutes."
        )
        return {
            'email': email,
            'message': 'OTP sent to email',
            "expires_at": otp.expires_at,
            "emailEncoded": emailEncoded
        }
    
    
class OTP_verify_serializer(serializers.Serializer):
    token  = serializers.CharField()
    otp = serializers.CharField()
    is_validate_otp = serializers.BooleanField(read_only=True)

    def validate_token(self, token):
        try: 
            email = signing.loads(token , key=settings.SECRET_KEY)
            if not OTP.objects.filter(email=email).exists():
                raise serializers.ValidationError("Invalid token")
            return email
        except signing.BadSignature:
            raise serializers.ValidationError("Invalid token")
        
    def is_validate_otp(self, otp):
        try:
            otp_decode = signing.loads(otp, key=settings.SECRET_KEY)

            if not OTP.objects.filter(otp=otp_decode).exists():
                raise serializers.ValidationError("Invalid OTP")
            
            otp_obj = OTP.objects.get(otp=otp_decode)
            time_elapsed = timezone.now() - otp_obj.created_at
            expiration_time = timezone.timedelta(minutes=15)
        
            # Check if OTP is expired
            if time_elapsed > expiration_time:
                otp_obj.delete()  # Clean up expired OTP
                raise serializers.ValidationError("OTP expired")
            return True
        
        except signing.BadSignature:
            raise serializers.ValidationError("Invalid OTP")
        
    def create(self, validated_data):
            if self.validate_token(validated_data['token']):
                raise serializers.ValidationError("Invalid token")
            
            if self.is_validate_otp(validated_data['otp']):
                raise serializers.ValidationError("Invalid OTP")
            
            try:
                email = signing.loads(validated_data['token'], key=settings.SECRET_KEY)
                user = User.objects.get(email=email)
                user.is_verified = True
                user.save()
            except User.DoesNotExist:
                raise serializers.ValidationError("User not found")
            
            return {
                'message': 'OTP verified successfully',
                'is_validate_otp': True,
                'email': email,
                'success': True
            }
            

        



