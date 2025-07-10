from django.shortcuts import get_object_or_404, render
from rest_framework import generics , request , status
from rest_framework.response import Response
from rest_framework.views import APIView 
from rest_framework.permissions import AllowAny , IsAuthenticated
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator
from decimal import Decimal

from product.models import Product
from .serializers import (
    CartSerializer,
    AddCartItemSerializer,
    UpdateCartItemSerializer
)
from .models import CartItem , Cart



class AddCartItemView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        serializer  = AddCartItemSerializer(data=request.data,context = {'request' : request})
        serializer .is_valid(raise_exception=True)
        cart_item= serializer.save()
        return Response({
            "message": "Item added to cart",
            "item_id": cart_item.id,
            "product": cart_item.product.name,
            "quantity": cart_item.quantity
        })

class RemoveCartItemView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        id = request.data.get('cart_id')
        try:
            cart_item = CartItem.objects.get(id=id, cart__user=request.user)
            cart_item.delete()
            return Response({"detail": "Cart item deleted."}, status=status.HTTP_204_NO_CONTENT)
        except CartItem.DoesNotExist:
            return Response({"detail": "Cart item does not exist."}, status=status.HTTP_404_NOT_FOUND)
        
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



class UpdateCartItemView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, id):
        try:
            cart = Cart.objects.get(user=request.user)
        except Cart.DoesNotExist:
            return Response({'detail': 'Cart is missing'}, status=status.HTTP_404_NOT_FOUND)

        size = request.data.get("size")
        if not size:
            return Response({'detail': 'Size is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cart_item = CartItem.objects.get(pk=id, cart=cart, size=size)
        except CartItem.DoesNotExist:
            return Response({'detail': 'Cart item not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = UpdateCartItemSerializer(cart_item, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
   
        
class ClearCartItemView(APIView):
    permission_classes = [AllowAny]

    def delete(self , request):
        if request.user.is_authenticated:
            CartItem.objects.filter(cart__user=request.user).delete()
        else:
            session_id = request.session.session_key
            if not session_id:
                request.session.create()
                session_id = request.session.session_key

            CartItem.objects.filter(cart__session_id=session_id).delete()

        return Response({"detail": "Cart cleared."}, status=status.HTTP_204_NO_CONTENT)


from product.models import ProductVariants
from django.db import transaction
class MergeCartItemsView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        data = request.data.get("items", [])
        
        if not isinstance(data, list):
            return Response(
                {"detail": "Expected a list of items"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        merged_items = []
        errors = []
        
        for index, item in enumerate(data):
            if not isinstance(item, dict):
                errors.append(f"Item {index}: Must be an object")
                continue

            try:
                product_id = item.get("product_id") or item.get("id")
                quantity = int(item.get("quantity", 1))
                size = str(item.get("size", "S")).strip().upper()
                
                # Validate required fields
                if not product_id:
                    errors.append(f"Item {index}: Missing product ID")
                    continue
                
                if quantity <= 0:
                    errors.append(f"Item {index}: Invalid quantity")
                    continue

                # Get product and variant
                product = get_object_or_404(Product, id=product_id)
                
                try:
                    variant = product.variants.get(size__name=size)
                except ProductVariants.DoesNotExist:
                    errors.append(f"Item {index}: Size '{size}' not available")
                    continue
                
                # Check stock availability
                if quantity > variant.stock:
                    errors.append(
                        f"Item {index}: Only {variant.stock} available in size {size}"
                    )
                    continue
                
                # Calculate pricing
                discount = product.active_discount
                if discount:
                    discount_amount = discount.calcualteDiscount(product.price)
                else:
                    discount_amount = Decimal('0.00')
                final_price = product.price - discount_amount
                
                # Create or update cart item
                cart_item, created = CartItem.objects.update_or_create(
                    cart=cart,
                    product=product,
                    size=size,
                    defaults={
                        'quantity': quantity,
                        'discount': discount,
                        'discount_amount': discount_amount,
                        'final_price': final_price,
                    }
                )
                
                if not created:
                    # Ensure we don't exceed stock when incrementing
                    new_quantity = min(
                        cart_item.quantity + quantity,
                        variant.stock
                    )
                    cart_item.quantity = new_quantity
                    cart_item.save()
                
                # Prepare response data
                merged_items.append({
                    "id": cart_item.id,
                    "product_id": product.id,
                    "name": product.name,
                    "price": str(product.price),
                    "main_image": product.main_image.url if product.main_image else None,
                    "quantity": cart_item.quantity,
                    "size": size,
                    "discount_type": discount.discount_type if discount else None,
                    "discount_value": str(discount.value) if discount else "0.00",
                    "final_price": str(final_price),
                    "subtotal": str(final_price * cart_item.quantity),
                    "variant_id": variant.id
                })
                
            except Exception as e:
                errors.append(f"Item {index}: {str(e)}")
                continue

        # Calculate totals
        total = sum(Decimal(item['subtotal']) for item in merged_items)
        
        response_data = {
            "detail": "Cart merged successfully",
            "merged_items": merged_items,
            "total": str(total),
            "count": len(merged_items),
            "errors": errors if errors else None
        }
        
        return Response(response_data, status=status.HTTP_200_OK)