from django.shortcuts import render, redirect, reverse, get_object_or_404
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.db.models.functions import Lower

from .models import Product, Category
from .forms import ProductForm

from .models import WishItem

def wish_list(request):
    # Fetch wish items associated with the current user
    wish_items = WishItem.objects.filter(user=request.user)

    # Fetch all available products
    all_products = Product.objects.all()

    return render(request, 'wishlist/wish_list.html', {'wish_items': wish_items, 'all_products': all_products})

def add_to_wishlist(request):
    if request.method == 'POST':
        product_id = request.POST.get('product_id')
        user = request.user
        # Create a WishItem instance for the selected product and current user
        WishItem.objects.create(user=user, product_id=product_id)
    return redirect('wish_list')