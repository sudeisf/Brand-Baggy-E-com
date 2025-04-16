from django.shortcuts import render
from requests import request
from rest_framework.views import APIView
from rest_framework import generics , status 
from rest_framework.decorators import api_view
from .serializers import ProductSerialier ,ProductDetailSerializer
from .models import Product
from rest_framework.permissions import IsAuthenticated , AllowAny
from rest_framework.response import Response

# Create your views here.


class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerialier
    queryset = Product.objects.all()
    permission_classes = [AllowAny]




class ProductDetailView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    def get(self, request, pk):
        product = Product.objects.prefetch_related('images').get(pk=pk)
        serializer = ProductDetailSerializer(product)
        return Response(serializer.data)

        

        

    
    

    
