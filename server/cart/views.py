from django.shortcuts import get_object_or_404, render
from rest_framework import generics , request , status
from rest_framework.response import Response
from rest_framework.views import APIView 
from rest_framework.permissions import AllowAny , IsAuthenticated

from product.models import Product
from .serializers import (
    CartSerializer,
    AddCartItemSerializer,
    UpdateCartItemSerializer
)
from .models import CartItem , Cart



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

class GetCartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        queryset = get_object_or_404(Cart , user= request.user)
        serializer = CartSerializer(queryset)
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


class MergeCartItemsView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        cart = Cart.objects.get_or_create(user=request.user)
        data = request.data

        if isinstance(data,list):
            return Response({"detail": "the api expects list"} , status=status)

        for item in data:
            product_id = item.get("product_id")
            quantity = item.get("quantity")
            size = item.get("size")

            product  = get_object_or_404(Product, id=product_id)

            cartItem , created = CartItem.objects.get_or_create(
                cart=cart,
                product=product,
                size=size,
                defaults={'quantity': quantity}
            )

            if not created:
                cartItem.quantity += quantity
                cartItem.save()
            
            return Response({
                "detail" : "cart merged successfully"
            }, status=status.HTTP_200_OK)

