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
from rest_framework.authtoken.models import Token
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

# import os
# from dotenv import load_dotenv   
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
#             idinfo = id_token.verify_oauth2_token(token,requests.Request() , os.getenv('GOOGLE_CLIENT_ID'))
#             email = idinfo['email']
#             first_name = idinfo.get('given_name', '')
#             last_name = idinfo.get('family_name', '')

#             user , created  = User.objects.get_or_create(email = email , defaults= {
#                 "first_name" : first_name,
#                 "last_name": last_name
#             })

#             refresh = RefreshToken.for_user(user)

#             return Response(
#                  {
#                       'refresh': str(refresh),
#                       'access' : str(refresh.access_token)
#                  }
#             )
         
#         except Exception as e :
#             return Response({"error": "Invalid token", "details": str(e)}, status=400)
    
