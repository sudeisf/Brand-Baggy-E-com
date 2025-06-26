from django.shortcuts import get_object_or_404, render
from rest_framework import generics , request , status
from rest_framework.response import Response
from rest_framework.views import APIView 
from rest_framework.permissions import AllowAny , IsAuthenticated
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator

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

@method_decorator(cache_page(60*15), name='dispatch') 
class GetCartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart = Cart.objects.filter(user=request.user).first()
        if not cart:
            return Response({
                "items": [],
                "total": 0,
                "detail": "Cart is empty."
            }, status=status.HTTP_200_OK)
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


class MergeCartItemsView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        data = request.data.get("items", [])

        if not isinstance(data, list):
            return Response({"detail": "Expected a list of items"}, status=status.HTTP_400_BAD_REQUEST)

        for item in data:
            if not isinstance(item, dict):
                return Response({"detail": "Each item must be an object"}, status=status.HTTP_400_BAD_REQUEST)

            product_id = item.get("id")  # ✅ corrected key
            quantity = item.get("quantity", 1)
            size = item.get("size", "default")

            if not product_id:
                continue  # or return error if required

            product = get_object_or_404(Product, id=product_id)

            cart_item, created = CartItem.objects.get_or_create(
                cart=cart,
                product=product,
                size=size,
                defaults={'quantity': quantity}
            )

            if not created:
                cart_item.quantity += quantity
                cart_item.save()

        return Response({"detail": "Cart merged successfully"}, status=status.HTTP_200_OK)

