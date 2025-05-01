from django.shortcuts import render
from rest_framework import generics , request , status
from rest_framework.response import Response
from rest_framework.views import APIView 
from rest_framework.permissions import AllowAny , IsAuthenticated
from .serializers import (
    CartSerializer,
    AddCartItemSerializer,
    UpdateCartItemSerializer
)
from .models import CartItem , Cart
from .utils import get_or_create_cart


class AddCartItemView(APIView):
    def post(self, request):
        serilaizer = AddCartItemSerializer(data=request.data,context = {'request' : request})
        serilaizer.is_valid(raise_exception=True)
        cart_item= serilaizer.save()
        return Response({
            "message": "Item added to cart",
            "item_id": cart_item.id,
            "product": cart_item.product.name,
            "quantity": cart_item.quantity
        })

class RemoveCartItemView(generics.DestroyAPIView):
    queryset = CartItem.objects.all()
    lookup_field = 'pk'

class GetCartView(generics.ListAPIView):
    permission_classes = [AllowAny]

    def get(self, request):
        cart = get_or_create_cart(request)
        serializer = CartSerializer(cart)
        return Response(serializer.data)


class UpdateCartItemView(generics.UpdateAPIView):
    permission_classes = [AllowAny]
    serializer_class = UpdateCartItemSerializer
    queryset = CartItem.objects.all()

    def get_queryset(self):
        if self.request and request.user.is_authenticated:
            return CartItem.objects.filter(cart_user = self.request.user)
        else:
            session_id = self.request.session.session_key
            if not session_id:
                self.request.session.create()
                session_id = self.request.session.session_key
            return CartItem.objects.filter(cart_session_id = session_id)
        
class ClearCartItemView(APIView):
    permission_classes = [AllowAny]

    def delete(self , request):
        if request.user.is_authenticated:
            CartItem.objects.filter(cart__user=request.user).delete()
        else:
            # Handle guest (session user)
            session_id = request.session.session_key
            if not session_id:
                request.session.create()
                session_id = request.session.session_key

            CartItem.objects.filter(cart__session_id=session_id).delete()

        return Response({"detail": "Cart cleared."}, status=status.HTTP_204_NO_CONTENT)


