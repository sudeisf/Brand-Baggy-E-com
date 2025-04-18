
from django.contrib.auth.signals import user_logged_in
from django.dispatch import receiver
from .models import Cart , CartItem
from django.db import transaction


@receiver(user_logged_in)
def merge_cart_on_login(sender , request , user , **kwargs):
    session_id  = request.session.session_key
    if not session_id:
        return 
    
    try:
        session_cart = Cart.objects.get(session_id= session_id , user = None)
    except Cart.DoesNotExist:
        return
    
    with transaction.atomic():
        cart_user, created = Cart.objects.get_or_create(user=user)

        for item in session_cart.items.all():

            existing  = cart_user.items.filter(product=item.product).first()
            if existing:
                existing.qauntity += item.quantity 
                existing.save()
            else:
                item.cart = cart_user
                item.pk = None
                item.save()
        
        session_cart.delete()
