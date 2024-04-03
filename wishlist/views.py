from django.shortcuts import render, redirect, get_object_or_404
from .models import WishlistItem
from products.models import Product
from django.contrib.auth.decorators import login_required


@login_required
def delete_wishlist_item(request, item_id):
    item = get_object_or_404(WishlistItem, pk=item_id)
    if request.method == 'POST' and request.user == item.user:
        item.delete()
    return redirect('wishlist')

@login_required
def wishlist(request):
    if request.user.is_authenticated:
        wishlist_items = WishlistItem.objects.filter(user=request.user)
        return render(request, 'wishlist/wishlist.html', {'wishlist_items': wishlist_items})
    else:
        return render(request, 'wishlist/wishlist.html')  #

@login_required
def add_to_wishlist(request, product_id):
    if request.method == 'POST':
        product = get_object_or_404(Product, pk=product_id)
        wishlist_item, created = WishlistItem.objects.get_or_create(user=request.user, product=product)
        if created:
            
            return redirect('wishlist')
        else:
            pass
    
    return redirect('/')