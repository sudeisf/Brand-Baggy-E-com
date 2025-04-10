from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import generics , status 
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated , AllowAny
from .serializer import (
    UserCreateSerializer, 
    UserSerializer,
    CustomTokenObtainPairSerializer  # Make sure this is imported
)
from rest_framework_simplejwt.views import TokenObtainPairView
from google.oauth2 import id_token
from google.auth.transport import requests
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

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

# import os
# from dotenv import load_dotenv   
# load_dotenv()

# class GoogleApiView(APIView):
#     permission_classes = [AllowAny]

#     def post(self, request):
#         token  = request.data.get('id_token')
#         if not token:
#             return Response(
#                 {
#                     "error" : "No ID token provided"
#                 },
#                 status=400
#             )
        
#         try:
#             idinfo = id_token.verify_oauth2_token(token,requests.Request() ,
#                     '133179609677-nd6mg0lfdgbecpbn223f63i98kf7miti.apps.googleusercontent.com')
#             email = idinfo['email']
           

#             user, created = User.objects.get_or_create(email=email, defaults={
#                 'username': email.split('@')[0],  # or any default username strategy
#                 'is_verified': True,
#                })

#             refresh = RefreshToken.for_user(user)

#             return Response(
#                  {
#                       'message': "User authenticated successfully",
#                       'user': UserSerializer(user).data,
#                       'refresh': str(refresh),
#                       'access' : str(refresh.access_token)
#                  }
#             )
         
#         except Exception as e :
#             return Response({"error": "Invalid token", "details": str(e)}, status=400)