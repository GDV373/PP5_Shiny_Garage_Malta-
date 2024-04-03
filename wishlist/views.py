from django.shortcuts import render, redirect, reverse, get_object_or_404
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseBadRequest
from .models import Product, WishItem

@login_required
def wish_list(request):
    # Fetch wish items associated with the current user
    wish_items = WishItem.objects.filter(user=request.user)
    return render(request, 'wishlist/wishlist.html', {'wish_items': wish_items})

@login_required
def add_to_wishlist(request):
    if request.method == 'POST':
        product_id = request.POST.get('product_id')
        if product_id:
            product = get_object_or_404(Product, pk=product_id)
            # Create a WishItem instance for the selected product and current user
            WishItem.objects.create(user=request.user, product=product)
            messages.success(request, 'Product added to wish list successfully.')
            return redirect('wish_list')
    # Handle invalid or missing product_id
    return HttpResponseBadRequest('Invalid request or missing product ID.')
