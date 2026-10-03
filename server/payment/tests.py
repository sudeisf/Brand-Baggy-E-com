from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from orders.models import Order, ShippingInfo
from accounts.models import CustomUser

User = get_user_model()

class PaymentSecurityTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(
            username="user1",
            email="user1@example.com",
            password="Password123!",
            user_role=CustomUser.Role.BUYER
        )
        self.user2 = User.objects.create_user(
            username="user2",
            email="user2@example.com",
            password="Password123!",
            user_role=CustomUser.Role.BUYER
        )

        self.shipping_info = ShippingInfo.objects.create(
            user=self.user1,
            full_name="User One",
            address="123 Main St",
            city="City",
            state="State",
            zip_code="12345",
            country="Country",
            phone="1234567890"
        )

        self.order1 = Order.objects.create(
            user=self.user1,
            total_price=50.00,
            shipping_info=self.shipping_info,
            status=Order.OrderStatus.PENDING
        )

    def test_user_cannot_initiate_stripe_payment_for_other_user_order(self):
        # Authenticate as user2
        refresh = RefreshToken.for_user(self.user2)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")

        # Attempt to access user1's order
        response = self.client.post("/payment/stripe/create-order/", {
            "order_id": self.order1.id
        }, format="json")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
