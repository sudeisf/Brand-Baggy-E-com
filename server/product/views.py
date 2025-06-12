from django.shortcuts import get_object_or_404, render
from requests import request
from rest_framework.views import APIView
from rest_framework import generics , status , filters
from rest_framework.decorators import api_view
from .serializers import ProductSerialier ,ProductDetailSerializer ,ProductReviewSerializer , CreateProductSerializer  , UpdateProductSerializer ,SellerProductListSerializer
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

class SellerProductDashboardView(generics.ListAPIView):
    serializer_class = SellerProductListSerializer
    permission_classes = [IsAuthenticated , IsSeller]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['in_stock', 'category']
    
    def get_queryset(self):
        return Product.objects.filter(
            seller=self.request.user
        ).select_related('category').prefetch_related('variants')

class UpdateSellerProductAPIView(APIView):
    permission_classes = [IsSeller]
    
    def patch(self, request, product_id):  # Changed from put to patch for semantic correctness
        try:
            product = Product.objects.get(id=product_id, seller=request.user)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        # Add partial=True here ↓
        serializer = UpdateProductSerializer(
            product, 
            data=request.data, 
            partial=True  # ← This is the critical change
        )
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class DeleteSellerProductAPIVIew(APIView):
    permission_classes = [IsSeller]
    def delete(self,request,pk):
        try:
            product = Product.objects.get(id=pk, seller=request.user)
            self._delete_related_objects(product)
            product.delete()
            return Response({'message': 'Product deleted'}, status=status.HTTP_204_NO_CONTENT)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

    def _delete_related_objects(self, product):

        for image in product.images.all():
            image.image.delete() 
            image.delete()  
        
        # Delete all variants
        product.variants.all().delete()
        
        # Delete all favorites referencing this product
        product.favorites.all().delete()

from .models import Category
from .serializers import CatagorySerializer
class CategoryListView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        queryset = Category.objects.filter(parent=None)
        serializer = CatagorySerializer(queryset, many=True)
        return Response(serializer.data)


class CategorySubListView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        queryset = Category.objects.filter(parent__isnull=False)
        serializer = CatagorySerializer(queryset, many=True)
        return Response(serializer.data)
