from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password
from django.core import exceptions
from django.contrib.auth import authenticate
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

