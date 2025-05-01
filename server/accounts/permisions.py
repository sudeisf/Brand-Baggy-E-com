from rest_framework.permissions import BasePermission

class IsSeller(BasePermission):
    def has_permission(self, request, view):
        # Check if the user's role is 'SELLER'
        return request.user.is_seller()
