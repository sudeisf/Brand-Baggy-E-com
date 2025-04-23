from django.shortcuts import get_object_or_404, render
from requests import request
from rest_framework.views import APIView
from rest_framework import generics , status , filters
from rest_framework.decorators import api_view
from .serializers import ProductSerialier ,ProductDetailSerializer ,ProductReviewSerializer , CreateProductSerializer , DeleteProdctSerilizer , UpdateProductSerializer ,ListProductSerializer
from .models import Product , FavoriteProduct , ProductReview
from accounts.models import CustomUser
from rest_framework.permissions import IsAuthenticated , AllowAny 
from accounts.permisions import IsSeller 
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
    filterset_fields = ['category', 'brand']
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
    

class ProductReviewListCreateView(generics.ListAPIView):
    serializer_class = ProductReviewSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        product = self.kwargs['product_id']
        return ProductReview.objects.get_or_create(user = self.request.user , product=product)
    
    def perform_create(self ,serializer):
        product = get_object_or_404(Product , id=self.kwargs['product_id'])
        serializer.save(user=self.request.user , product= Product)

class CreateProductView(APIView):
    permission_classes = [IsAuthenticated, IsSeller]
    def post(self , request):
        serializer = CreateProductSerializer(data=request.data , context = {'request' : request})
        serializer.is_valid(raise_exception=True)
        product = serializer.save()
        return Response({"message": "Product created successfully.", "product_id": product.id}, status=status.HTTP_201_CREATED)

class ListSellerProductAPIView(APIView):
    permission_classes = [IsSeller]
    def get(self , request):
        products = Product.objects.filter(seller=request.user)
        serializer = ListProductSerializer(products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UpdateSellerProdctAPIView(APIView):
    permission_classes = [IsSeller]
    def put(self , request):
        try:
            product = Product.objects.get(id=pk, seller=request.user)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = UpdateProductSerializer(product, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DeleteSellerProductAPIVIew(APIView):
    permission_classes = [IsSeller]
    def Delete(self  , request):
        try:
            product = Product.objects.get(id=pk, seller=request.user)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        product.delete()
        return Response({'message': 'Product deleted'}, status=status.HTTP_204_NO_CONTENT)

    



