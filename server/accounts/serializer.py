from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer , TokenRefreshSerializer
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.tokens import RefreshToken
from django.core import exceptions
from django.contrib.auth import authenticate
from django.core  import signing
import random 
from .models import OTP , CustomUser
from .services import sendEmail
from django.utils import timezone
from datetime import timedelta
from django.conf import settings

User = get_user_model()
class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=User.Role.choices)  # enum-like roles

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'confirm_password', 'role']

    # ✅ Field-level validation
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError({
                "message": "A user with this username already exists.",
                "code": "username_exists"
            })
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError({
                "message": "A user with this email already exists.",
                "code": "email_exists"
            })
        return value

    def validate_password(self, value):
        try:
            validate_password(value)
        except exceptions.ValidationError as e:
            raise serializers.ValidationError({
                "message": list(e.messages),
                "code": "invalid_password"
            })
        return value

    # ✅ Object-level validation
    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({
                "password": {
                    "message": "Password and confirm password do not match.",
                    "code": "password_mismatch"
                }
            })
        return attrs

    # ✅ Create method
    def create(self, validated_data):
        validated_data.pop('confirm_password')

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            user_role=validated_data['role']
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if not email or not password:
            raise serializers.ValidationError("Both 'email' and 'password' are required.")

        user = authenticate(
            request=self.context.get('request'),
            email=email,
            password=password
        )

        if user is None:
            raise serializers.ValidationError("Invalid email or password.")

        attrs['username'] = user.username
        data = super().validate(attrs)

        # Add custom claims
        data['id'] = str(user.id)
        data['email'] = user.email
        data['username'] = user.username
        data['role'] = user.user_role  # Use the correct field (user_role)

        return data

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims to the token
        token['username'] = user.username
        token['email'] = user.email
        token['role'] = user.user_role  # Add role to the token

        return token



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
        
        OTP.objects.filter(email=email).delete()
        otp = OTP.objects.create(
            email = email,
            otp=otp_code,
            expires_at=expires_at
        )
        sendEmail(
            "OTP varification Code",
            email,
            f"Your OTP is: {otp_code}\nExpires in 15 minutes."
        )
        return {
            'email': email,
            'message': 'OTP sent to email',
            "expires_at": otp.expires_at,
            "emailEncoded": email
        }
    
    
class OTP_verify_serializer(serializers.Serializer):

    email= serializers.EmailField()
    otp = serializers.CharField()

    def validate_email(self, email):
        if not OTP.objects.filter(email=email).exists():
             raise serializers.ValidationError("Invalid email")
        return email
        
    def validate(self, data):
        received_otp = data['otp']
        received_email = data['email'].lower()  # Fixed spelling and ensure lowercase

        try:
            # Get the most recent OTP for this email
            otp_obj = OTP.objects.filter(email__iexact=received_email).order_by('-created_at').first()
            
            if not otp_obj:
                raise serializers.ValidationError("OTP not found")

            # Debug prints
            print(f'Stored OTP: {otp_obj.otp}')
            print(f'Received OTP: {received_otp}')

            # Compare OTPs
            if str(otp_obj.otp) != str(received_otp):
                raise serializers.ValidationError("Invalid OTP")

            # Check expiration using expires_at field
            if timezone.now() > otp_obj.expires_at:
                otp_obj.delete()
                raise serializers.ValidationError("OTP expired")

            return data

        except signing.BadSignature:
            raise serializers.ValidationError("Invalid OTP signature")
        
    def create(self, validated_data):
            email = validated_data['email']

            #remove the old ones 
            OTP.objects.filter(
                email__iexact = email,
                expires_at__lt = timezone.now()
            ).delete()
            
            try:
                user = User.objects.get(email=email)
                otp_obj = OTP.objects.get(email=email)

                otp_obj.is_used = True
                user.is_verified = True

                user.save()
                otp_obj.save()

            except User.DoesNotExist:
                raise serializers.ValidationError("User not found")
            
            except OTP.DoesNotExist:
                raise serializers.ValidationError("OTP not found")
            
            
            return {
                'message': 'OTP verified successfully',
                'email': email,
                'success': True
            }
            

class reset_password_serializer(serializers.Serializer):
    email = serializers.EmailField()
    new_password = serializers.CharField()
    confirm_password = serializers.CharField()

    def validate_email(self, email):
        if not User.objects.filter(email=email).exists():
            raise serializers.ValidationError("Email not found")
        return email
    
    def validate_new_password(self, password):
        try:
            validate_password(password)
        except exceptions.ValidationError as e:
            raise serializers.ValidationError(str(e))
        return password 
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs
    
    def create(self, validated_data):
        email = validated_data['email']
        new_password = validated_data['new_password']       

        try:
            user = User.objects.get(email=email)
            user.set_password(new_password)
            user.save()
            return {
                'message': 'Password reset successfully',
                'success': True
            }
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found")
        
        

class CustomTokenRefreshSerilizer(TokenRefreshSerializer):
    def validate(self, attrs):
        data = super().valdiate(attrs)
        refresh  = RefreshToken(attrs['refresh'])
        user_id  = refresh['user_id']

        try: 
            user  = User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found")
        
        data['email'] = user.email
        data["username"] = user.username
        data['role'] = user.user_role

        return data


        
        
            



