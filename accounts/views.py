from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import generics , status 
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated , AllowAny
from .serializer import (
    Email_varify_OTP_generate_serializer,
    OTP_verify_serializer,
    UserCreateSerializer, 
    UserSerializer,
    CustomTokenObtainPairSerializer,
    reset_password_serializer  # Make sure this is imported
)
from rest_framework_simplejwt.views import TokenObtainPairView
from google.oauth2 import id_token
from google.auth.transport import requests
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .services import sendEmail
import random
from .models import OTP
User = get_user_model()


# Create your views here.
class RegisterView(generics.CreateAPIView):
     serializer_class = UserCreateSerializer
     permission_classes = [AllowAny]

     def create(self, request, *args, **kwargs):
          
          serializer = self.get_serializer(data= request.data)
          serializer.is_valid(raise_exception = True)
          user = serializer.save()
          return Response({
               "message": "User registered successfully",
               'user': UserSerializer(user).data
          }, status=status.HTTP_201_CREATED)

class CustomTokenObtainPairView(TokenObtainPairView):
     serializer_class  = CustomTokenObtainPairSerializer
     

class ProtectedView(generics.RetrieveAPIView):
     permission_classes = [IsAuthenticated]

     def get(self, request):
          user = request.user
          serializer = UserSerializer(user)
          return Response({
               "message": "Protected view",
               'user': serializer.data
          })

class LogOutView(APIView):
     permission_classes = [IsAuthenticated]

     def post(self, request):
          try:
               refresh_token = request.data.get('refresh')
               if not refresh_token:
                    return Response(
                         {"error": "Refresh token is required"},
                         status=status.HTTP_400_BAD_REQUEST
                    )
               
               token = RefreshToken(refresh_token)
               token.blacklist()
               
               return Response(
                    {"message": "Successfully logged out"},
                    status=status.HTTP_205_RESET_CONTENT
               )
          except Exception as e:
               return Response(
                    {"error": str(e)},
                    status=status.HTTP_400_BAD_REQUEST
               )

class UserDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

class UserUpdateView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({
            "message": "Profile updated successfully",
            "user": serializer.data
        })

class ForgotPasswordView(APIView):
     permission_classes = [AllowAny]

     def post(self, request):

          email = request.data.get('email')
          if not email:
               return Response(
                    {
                         'error': 'Email is required'
                    },
                    status = status.HTTP_400_BAD_REQUEST               
                    )

          try:
               user = User.objects.get(email = email)
              
               OTP_CODE = random.randint(100000, 999999)
               OTP.objects.create(
                    email = email,
                    otp = OTP_CODE
               )
               sendEmail(
                    'Reset Password',
                    email,
                    f'Click the link to reset your password: http://localhost:8000/otp/{OTP_CODE}'
                    f'OTP CODE: {OTP_CODE}'
               )
               return Response(
                    {
                         'message': 'Email sent successfully'
                    },
                    status = status.HTTP_200_OK
               )
          except User.DoesNotExist:
               return Response(
                    {
                         'error': 'User does not exist'
                    },
                    status = status.HTTP_400_BAD_REQUEST
               )
          




     
class Email_varify_OTP_generate_view(generics.CreateAPIView):
    
     permission_classes = [AllowAny]

     def post(self,request):
          serializer = Email_varify_OTP_generate_serializer(data=request.data)
          if serializer.is_valid():
               result = serializer.save()
               return Response({
                "message": "OTP sent to email",
                "expires_at": result["expires_at"],
                "emailEncoded": result["emailEncoded"]
            }, status=status.HTTP_201_CREATED)
          
          return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
          

class OTP_verify_view(generics.CreateAPIView):
     serializer_class = OTP_verify_serializer
     permission_classes = [AllowAny]

     def post(self, request, *args, **kwargs):
          serializer = self.get_serializer(data=request.data)
          if serializer.is_valid():
               result = serializer.save()
               return Response(result, status=status.HTTP_200_OK)
          
          return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
     

class reset_password_view(generics.CreateAPIView):
     serializer_class = reset_password_serializer
     permission_classes = [AllowAny]

     def post(self, request, *args, **kwargs):
          serializer = self.get_serializer(data=request.data)
          if serializer.is_valid():
               result = serializer.save()
               return Response(result, status=status.HTTP_200_OK)
          
          return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

