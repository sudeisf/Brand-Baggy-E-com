from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework import generics , status , filters
from .serializers import (ProductSerialier ,
                          ProductDetailSerializer , 
                          ProductPublicSerializer, 
                          ProductReviewSerializer , 
                          CreateProductSerializer, 
                          SellerProductDetailSerializer,
                          UpdateProductSerializer ,
                          SellerProductListSerializer,
                          FavoriteProductSerializer,
                          SerachProductSerializer,
                          ProductChooseForSellerSerializer,
                          ProductReviewSummarySerializer
                          )
from rest_framework.pagination import PageNumberPagination

from .models import Product , FavoriteProduct , ProductReview
from rest_framework.permissions import IsAuthenticated , AllowAny 
from accounts.permisions import IsSeller 
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
import cloudinary
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator


@method_decorator(cache_page(60*15), name="dispatch")
class ProductListView(generics.ListAPIView):
    serializer_class = ProductPublicSerializer
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

class ProductDetailSellerView(APIView):
    serializer_class = SellerProductDetailSerializer
    permission_classes = [IsAuthenticated, IsSeller]

    def get(self, request, product_id):
        product = get_object_or_404(Product, id=product_id, seller=request.user)
        serializer = self.serializer_class(product)
        return Response(serializer.data)

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
        product = Product.objects.get(id= product_id)
        fav_prod = FavoriteProduct.objects.filter(user = request.user , product = product)
        if fav_prod.exists():
            fav_prod.delete()
            return Response({"message": "Removed from favorites"}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'message': 'Product was not in favorites'}, status=status.HTTP_400_BAD_REQUEST)
    
class RemoveAllFavItems(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        fav_prod = FavoriteProduct.objects.filter(user=request.user)
        deleted_count, _ = fav_prod.delete()
        if deleted_count > 0:
            return Response({"message": "Removed all favorites"}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'No favorites to remove'}, status=status.HTTP_200_OK)


class ProductReviewListCreateView(generics.ListAPIView):
    serializer_class = ProductReviewSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        product = self.kwargs['product_id']
        return ProductReview.objects.get_or_create(user = self.request.user , product=product)
    
    def perform_create(self ,serializer):
        product = get_object_or_404(Product , id=self.kwargs['product_id'])
        serializer.save(user=self.request.user , product= Product)

class ProductCreateAPIView(generics.CreateAPIView):
    queryset = Product.objects.all()
    serializer_class = CreateProductSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Product created successfully."}, status=status.HTTP_201_CREATED)
        
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
    permission_classes = [IsAuthenticated,IsSeller]
    
    def patch(self, request,pk):  
        try:
            product = Product.objects.get(id=pk, seller=request.user)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = UpdateProductSerializer(
            product, 
            data=request.data, 
            partial=True  
        )
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class DeleteSellerProductAPIVIew(APIView):
    permission_classes = [IsAuthenticated,IsSeller]
    def delete(self,request,id):
        try:
            product = Product.objects.get(id=id, seller=request.user)
            self._delete_related_objects(product)
            product.delete()
            return Response({'message': 'Product deleted'}, status=status.HTTP_204_NO_CONTENT)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

    def _delete_related_objects(self, product):
        for image in product.images.all():
            # Delete the image from Cloudinary
            cloudinary.uploader.destroy(str(image.image))
            image.delete()
        product.variants.all().delete()
        product.favorites.all().delete()

from .models import Category
from .serializers import CatagorySerializer

@method_decorator(cache_page(60*15), name='dispatch') 
class CategoryListView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        queryset = Category.objects.filter(parent=None)
        serializer = CatagorySerializer(queryset, many=True)
        return Response(serializer.data)

@method_decorator(cache_page(60*15), name='dispatch') 
class CategorySubListView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        queryset = Category.objects.filter(parent__isnull=False)
        serializer = CatagorySerializer(queryset, many=True)
        return Response(serializer.data)

@method_decorator(cache_page(60*15), name='dispatch')
class CategoryFilterView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        # Get all parent categories with their immediate children
        parent_categories = Category.objects.filter(parent=None)
        
        result = []
        for parent in parent_categories:
            parent_data = CatagorySerializer(parent).data
            parent_data['children'] = CatagorySerializer(
                Category.objects.filter(parent=parent),
                many=True
            ).data
            result.append(parent_data)
        
        return Response(result)

class ProductStockUpdateView(APIView):
    permission_classes = [IsAuthenticated, IsSeller]

    def patch(self, request, pk):
        product = get_object_or_404(Product, id=pk, seller=request.user)
        data = request.data
        if "in_stock" not in data:
            return Response(
                {"error": "in_stock is missing from the request"},
                status=status.HTTP_400_BAD_REQUEST
            )
        serializer = ProductSerialier(
            product,
            data={'in_stock': data['in_stock']},
            partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "stock status updated"},
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class MergeFavProductView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self,request):
        user = request.user
        data = request.data.get("items",[])

        if not isinstance(data, list):
            return Response({"detail": "Expected a list of items"}, status=status.HTTP_400_BAD_REQUEST)

        for item in data:
            if not isinstance(item, dict):
                return Response({"detail": "Each item must be an object"}, status=status.HTTP_400_BAD_REQUEST)

            product_id = item.get("id")
            print(product_id)
            product = get_object_or_404(Product,id=product_id)
            fav_item , created = FavoriteProduct.objects.get_or_create(
                product = product,
                user = user
            )

            if not created:
                continue
        return Response(
            {
                "detail" : "favorite product merged"
            },
            status=status.HTTP_201_CREATED
        )
        

class GetFavProductView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        fav_products = FavoriteProduct.objects.filter(user=request.user)
        serializer = FavoriteProductSerializer(fav_products, many=True)
        return Response(serializer.data)
        
from rest_framework.filters import SearchFilter

class SearchProductAPIView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = SerachProductSerializer
    pagination_class = PageNumberPagination
    filter_backends = [SearchFilter, DjangoFilterBackend]
    search_fields = ['name', 'description', 'category__name','brand']
    filterset_fields = {
        'price': ['gte', 'lte'],
        'category': ['exact'],
        'in_stock': ['exact']
    }

        
class SellerProductList(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        user = request.user
        try:
            products = Product.objects.filter(seller=user).prefetch_related('variants__size')
            serializer = ProductChooseForSellerSerializer(products, many=True)
            return Response(serializer.data,status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return Response({
                "error" : "product doest not exist for this seller"
            },status=status.HTTP_404_NOT_FOUND)
        
from django.db.models import Avg

class ProductReviewAndRatingAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, product_id):
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"detail": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

        # Get average rating
        avg_rating = ProductReview.objects.filter(product=product).aggregate(avg=Avg("rating"))["avg"] or 0.0

        # Get reviews
        reviews = ProductReview.objects.filter(product=product)

        # Create the data structure with model instances, not serialized data
        data = {
            "average_rating": round(avg_rating, 1),
            "reviews": reviews  # Pass model instances, not serialized data
        }
        
        summary_serializer = ProductReviewSummarySerializer(data)
        return Response(summary_serializer.data, status=status.HTTP_200_OK)


from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ObjectDoesNotExist
from .models import ProductReview, Product
from django.utils import timezone
from orders.models import Order

class CreateReviewAndRatingAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, order_id):
        try:
            # Get the order by order_id
            order = Order.objects.get(id=order_id)

            # Verify the order belongs to the authenticated user
            if not order.user or order.user != request.user:
                return Response(
                    {"error": "Unauthorized: Only the user who placed the order can submit a review."},
                    status=status.HTTP_403_FORBIDDEN
                )

            # Check if the order is delivered
            if order.status != Order.OrderStatus.DELIVERED:
                return Response(
                    {"error": "Reviews can only be submitted for delivered orders."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Get input data
            email = request.data.get('email')
            rating = request.data.get('rating')
            review_text = request.data.get('review')

            # Validate email
            if not email or email != request.user.email:
                return Response(
                    {"error": "Email does not match the authenticated user's email."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Validate rating
            try:
                rating = int(rating)
                if not 1 <= rating <= 5:
                    return Response(
                        {"error": "Rating must be an integer between 1 and 5."},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            except (ValueError, TypeError):
                return Response(
                    {"error": "Rating must be a valid integer."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Validate review text
            if not review_text or review_text == "[Prototype]: Object":
                return Response(
                    {"error": "A valid review text is required."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Since the body doesn't specify a product_id, assume the review is for the first product in the order
            # (You may need to adjust this logic based on your requirements)
            order_item = order.items.first()
            if not order_item:
                return Response(
                    {"error": "No products found in the order."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            product = order_item.product

            # Check for duplicate reviews
            if ProductReview.objects.filter(product=product, user=request.user).exists():
                return Response(
                    {"error": f"You have already reviewed the product {product.name}."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Create the review
            ProductReview.objects.create(
                product=product,
                user=request.user,
                review=review_text,
                rating=rating,
                created_at=timezone.now(),
                updated_at=timezone.now()
            )

            return Response(
                {"message": "Review submitted successfully."},
                status=status.HTTP_201_CREATED
            )

        except Order.DoesNotExist:
            return Response(
                {"error": "Order not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )