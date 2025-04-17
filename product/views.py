from django.shortcuts import render
from requests import request
from rest_framework.views import APIView
from rest_framework import generics , status , filters
from rest_framework.decorators import api_view
from .serializers import ProductSerialier ,ProductDetailSerializer
from .models import Product
from rest_framework.permissions import IsAuthenticated , AllowAny
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend


# Create your views here.


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

        

        

    
    

    
