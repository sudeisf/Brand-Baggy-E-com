from django.shortcuts import get_object_or_404, render
from requests import request
from rest_framework.views import APIView
from rest_framework import generics , status , filters
from rest_framework.decorators import api_view
from .serializers import ProductSerialier ,ProductDetailSerializer
from .models import Product , FavoriteProduct
from accounts.models import CustomUser
from rest_framework.permissions import IsAuthenticated , AllowAny
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend


class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerialier
    queryset = Product.objects.all()
    permission_classes = [AllowAny]


class ProductDetailView(generics.RetrieveAPIView):
    serializer_class = ProductDetailSerializer
    queryset = Product.objects.prefetch_related('images').all()
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend,filters.SearchFilter]
    filterset_fields = ['category', 'brand', 'price']
    search_fields = ['name', "description"]

    def get_serializer_context(self):
        context  = super().get_serializer_context()
        context['request'] = self.request
        return context


class AddFavoriteProductView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self , request , product_id):
        product = get_object_or_404(Product, id=product_id)
        favourite , created = FavoriteProduct.objects.get_or_create(user=request.user , product = product)
        if not created:
            return Response(
                {
                    'Messsage' : "Already in Favourites."
                }, 
                status=status.HTTP_200_OK
            )

        return Response(
            {
                'Message' : "Added to favourite"
            },
            status= status.HTTP_201_CREATED
        )

class RemoveFavouriteProductView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self , request , product_id):
        fav_prod = FavoriteProduct.objects.filter(user = request.user , product_id = product_id)
        if fav_prod.exists():
            fav_prod.delete()
            return Response({"message": "Removed from favorites"}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'message': 'Product was not in favorites'}, status=status.HTTP_400_BAD_REQUEST)
    

    
