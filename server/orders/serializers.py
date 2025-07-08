from rest_framework import serializers
from .models import Order , OrderItem ,ShippingInfo
from payment.models import Payment


class ShippingInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingInfo
        exclude = ['id', 'created_at']


from cloudinary import CloudinaryImage

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    varients = serializers.CharField(source='product.variants.size', read_only=True)
    main_image = serializers.SerializerMethodField()
    description = serializers.CharField(source="product.description",read_only=True)
    product_id = serializers.CharField(source="product.id",read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product_name',"product_id","varients", 'price', 'subtotal', 'quantity' ,"main_image", "description"]

    def get_main_image(self,obj):
        if obj.product.main_image:
            public_id = str(obj.product.main_image)
            return CloudinaryImage(public_id).build_url(secure=True)

class OrderSerializer(serializers.ModelSerializer):
    shipping_info = ShippingInfoSerializer()
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'cart', 'total_price', 'status', 'order_date', 'shipping_info', 'items']
        read_only_fields = ['status', 'order_date', 'items']

class OrderDetailSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)  
    class Meta:
        model = Order
        fields = ['id', "status" , "order_date" ,"items"]


class createOrderSerializer(serializers.Serializer):
    """create serializer"""
    shipping_address = serializers.CharField()
    shipping_city = serializers.CharField()
    shipping_state = serializers.CharField()
    shipping_zip_code = serializers.CharField()
    shipping_country = serializers.CharField()
    shipping_phone =serializers.CharField()
    shipping_email = serializers.EmailField()
    guest_email= serializers.CharField()
  


class GetOrderSerializer(serializers.Serializer):
    pass


class ListUserOrdersSerializer(serializers.Serializer):
    pass


class UpdateOrderSerializer(serializers.Serializer):
    pass


class CancelOrderSerializer(serializers.Serializer):
    pass 

class UpdateOrderItemStatusSerializer(serializers.Serializer):
    pass

class AdminOrderListViewSerializer(serializers.Serializer):
    pass


class OrderTableSerializer(serializers.ModelSerializer):
    order_id = serializers.IntegerField(source='id')
    date = serializers.DateTimeField(source='order_date', format="%Y-%m-%d %H:%M")
    customer = serializers.SerializerMethodField()
    total = serializers.DecimalField(source='total_price', max_digits=10, decimal_places=2)
    payment_status = serializers.SerializerMethodField()
    items = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ['order_id', 'date', 'customer', 'total', 'payment_status', 'items', 'status']

    def get_customer(self, obj):
        if obj.user:
            return obj.user.username
        elif obj.guest_full_name:
            return f"{obj.guest_full_name} ({obj.guest_email or 'No Email'})"
        else:
            return "Guest"

    def get_payment_status(self, obj):
        try:
            return obj.payment.status
        except:
            return "no payment"

    def get_items(self, obj):
        return obj.items.count()

class SellerRecentOrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_image = serializers.SerializerMethodField()
    payment_status = serializers.SerializerMethodField()
    order_date = serializers.DateTimeField(source='order.created_at', format="%Y-%m-%d %H:%M")
    customer = serializers.SerializerMethodField()
    price = serializers.DecimalField(max_digits=10, decimal_places=2)
    sold = serializers.IntegerField(source='quantity')
    status = serializers.CharField(source='order.status')

    class Meta:
        model = OrderItem
        fields = ['id','product_image', 'product_name', 'payment_status', 'order_date', 'customer', 'price', 'sold', 'status']

    def get_payment_status(self, obj):
        try:
            return obj.order.payment.status
        except:
            return "no payment"
    
    def get_product_image(self,obj):
        if obj.product.main_image:
            public_id = str(obj.product.main_image)
            return CloudinaryImage(public_id).build_url(secure=True)

    def get_customer(self, obj):
        order = obj.order
        if order.user:
            if order.user.profile_url:
                public_id = str(order.user.profile_url)
                return {
                    "username" : order.user.username,
                    "image" : CloudinaryImage(public_id).build_url(secure=True)
                }
            return order.user.username
        elif order.guest_full_name:
            return f"{order.guest_full_name} ({order.guest_email or 'No Email'})"
        else:
            return "Guest"



class PaymentAndOrderStatusSerializer(serializers.Serializer):
    order_id = serializers.IntegerField()
    payment_status = serializers.ChoiceField(choices=Payment.Status.choices, required=False)
    order_status = serializers.ChoiceField(choices=Order.OrderStatus.choices, required=False)

    def validate(self, data):
        if not data.get("payment_status") and not data.get("order_status"):
            raise serializers.ValidationError("At least one status must be provided.")
        return data

class SellerOrderDetailsSerializer(serializers.ModelSerializer):
    user_data = serializers.SerializerMethodField(read_only=True)
    items = serializers.SerializerMethodField()
    payment_method = serializers.CharField(source='payment.method', read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "user_data",
            "status",
            "order_date",
            "payment_method",
            "items",
            "total_price"
        ]

    def get_user_data(self, obj):
        if obj.user:
            # Registered user info
            return {
                "id": obj.user.id,
                "full_name": f'{obj.user.first_name} {obj.user.lastname_name}',
                "email": obj.user.email,
                "phone": obj.user.phone_number
            }
        else:
            return {
                "id": None,
                "full_name": obj.guest_full_name,
                "email": obj.guest_email,
                "phone": obj.guest_phone
            }

    def get_items(self, obj):
        items = obj.items.all()
        return OrderItemSerializer(items, many=True).data


class UnifiedCustomerSerializer(serializers.Serializer):
    name = serializers.CharField()
    email = serializers.CharField(source='annotated_email')
    is_registered = serializers.BooleanField()
    order_count = serializers.IntegerField()
    total_spent = serializers.DecimalField(max_digits=10, decimal_places=2)
    last_order_date = serializers.DateTimeField(allow_null=True)
    country = serializers.CharField(allow_null=True)
    city = serializers.CharField(allow_null=True)
    main_image = serializers.SerializerMethodField()

    def get_main_image(self, obj):
        # For registered users, obj['main_image'] is a Cloudinary public_id or None
        if obj.get('main_image'):
            try:
                from cloudinary import CloudinaryImage
                public_id = str(obj['main_image'])
                return CloudinaryImage(public_id).build_url(secure=True)
            except Exception:
                return None
        return None
