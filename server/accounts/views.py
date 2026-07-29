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
    reset_password_serializer 
    ,CustomTokenRefreshSerilizer
)
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.views import TokenObtainPairView , TokenRefreshView
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
User = get_user_model()
from .models import CustomUser



class RegisterView(generics.CreateAPIView):
     serializer_class = UserCreateSerializer
     permission_classes = [AllowAny]

     def create(self, request, *args, **kwargs):

          role = request.data.get('role', CustomUser.Role.BUYER)  
          if role not in [CustomUser.Role.SELLER, CustomUser.Role.BUYER, CustomUser.Role.ADMIN]:
               return Response({"error": "Invalid role specified."}, status=status.HTTP_400_BAD_REQUEST)
          
          # Create a mutable copy of request.data
          data = request.data.copy() if hasattr(request.data, 'copy') else dict(request.data)
          data['role'] = role
               
          serializer = self.get_serializer(data=data)
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

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            "user": serializer.data
        })

from rest_framework.exceptions import ValidationError
class UserUpdateView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        
        if 'email' in request.data:
            new_email = request.data['email']
            if User.objects.filter(email=new_email).exclude(id=instance.id).exists():
                raise ValidationError({"email": ["This email is already in use."]})
        
        if "oldPassword" in request.data and "newPassword" in request.data:
            old_password = request.data['oldPassword']
            new_password = request.data['newPassword']

            if not instance.check_password(old_password):
                raise ValidationError({"password": ["old password is incorrect"]})
         
            instance.set_password(new_password)
            instance.save()
        
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        return Response({
            "message": "Profile updated successfully",
            "user": serializer.data
        })

class updateProfileImageView(APIView):
     permission_classes = [IsAuthenticated]
     parser_classes = [MultiPartParser, FormParser]
     def patch(self, request):
          try:
               if 'profile_image' not in request.FILES:
                    return Response(
                         {"error": "No image file provided"},
                         status=status.HTTP_400_BAD_REQUEST
                    )
               
               user = request.user
               user.profile_url = request.FILES['profile_image']
               user.save()
               
               serializer = UserSerializer(user)
               return Response({
                    "message": "Profile image updated successfully",
                    "user": serializer.data
               }, status=status.HTTP_200_OK)
               
          except Exception as e:
               return Response(
                    {"error": str(e)},
                    status=status.HTTP_400_BAD_REQUEST
               )

class UserDeleteView(APIView):
     permission_classes = [IsAuthenticated]
     def delete(self,request):
          try:
            user = request.user
            user.delete()
            return Response({
                "message": "Account deleted successfully"
            }, status=status.HTTP_200_OK)
            
          except Exception as e:
               return Response({
                    "error": str(e)
               }, status=status.HTTP_400_BAD_REQUEST)


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

class CustomTokenRefreshView(TokenRefreshView):
     serializer_class = CustomTokenRefreshSerilizer

class GetMe(APIView):
     def get(self, request):
          if request.user and request.user.is_authenticated:
               serializer = UserSerializer(request.user)
               return Response({
                    "user" : serializer.data},
                    status=status.HTTP_200_OK)
          else:
                 return Response({
                    "error": "User is not authenticated"
               }, status=status.HTTP_401_UNAUTHORIZED)

class TokenTestView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            'message': 'Token is valid',
            'user': request.user.username
        })


from .models import StoreProfile, NotificationPreferences
from .serializer import StoreProfileSerializer, NotificationPreferencesSerializer

class StoreSettingsView(generics.RetrieveUpdateAPIView):
    serializer_class = StoreProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        obj, created = StoreProfile.objects.get_or_create(user=self.request.user)
        return obj

class NotificationSettingsView(generics.RetrieveUpdateAPIView):
    serializer_class = NotificationPreferencesSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        obj, created = NotificationPreferences.objects.get_or_create(user=self.request.user)
        return obj
