from django.test import TestCase
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth import get_user_model
from accounts.models import OTP, CustomUser
from django.core import signing
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()

class AccountsSecurityTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="StrongPassword123!",
            user_role=CustomUser.Role.BUYER
        )

    def test_otp_is_valid_property(self):
        # Valid OTP (expires in future)
        future_otp = OTP.objects.create(
            email="testuser@example.com",
            otp="123456",
            expires_at=timezone.now() + timedelta(minutes=10)
        )
        self.assertTrue(future_otp.is_valid)

        # Expired OTP
        expired_otp = OTP.objects.create(
            email="testuser@example.com",
            otp="654321",
            expires_at=timezone.now() - timedelta(minutes=1)
        )
        self.assertFalse(expired_otp.is_valid)

    def test_registration_prevents_admin_privilege_escalation(self):
        response = self.client.post("/accounts/register/", {
            "username": "attacker",
            "email": "attacker@example.com",
            "password": "Password123!",
            "confirm_password": "Password123!",
            "role": "admin"
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_registration_allows_buyer_and_seller(self):
        response = self.client.post("/accounts/register/", {
            "username": "newbuyer",
            "email": "newbuyer@example.com",
            "password": "Password123!",
            "confirm_password": "Password123!",
            "role": "buyer"
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_password_reset_requires_valid_signed_token(self):
        # Attempt reset without valid signed token
        response = self.client.post("/accounts/reset-password/", {
            "email": "testuser@example.com",
            "new_password": "NewStrongPassword123!",
            "confirm_password": "NewStrongPassword123!",
            "reset_token": "invalid-token"
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Attempt reset with valid signed token
        signer = signing.TimestampSigner(salt="password-reset")
        valid_token = signer.sign("testuser@example.com")

        response = self.client.post("/accounts/reset-password/", {
            "email": "testuser@example.com",
            "new_password": "NewStrongPassword123!",
            "confirm_password": "NewStrongPassword123!",
            "reset_token": valid_token
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("NewStrongPassword123!"))
