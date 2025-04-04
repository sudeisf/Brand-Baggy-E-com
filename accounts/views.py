from django.shortcuts import render
from rest_framework import generics , status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated , AllowAny
from .serializer import (
    UserCreateSerializer, 
    UserSerializer,
    CustomTokenObtainPairSerializer  # Make sure this is imported
)
from rest_framework_simplejwt.views import TokenObtainPairView



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

    
    
