from django.utils import timezone
from django.shortcuts import (
    render, redirect, reverse, get_object_or_404, HttpResponse
)
from django.views.decorators.http import require_POST
from django.contrib import messages
from django.conf import settings
from django.http import JsonResponse

from .models import Order, OrderLineItem, Discount
from .forms import OrderForm
from products.models import Product
from profiles.models import UserProfile
from profiles.forms import UserProfileForm
from bag.contexts import bag_contents

import stripe
import json


def validate_discount(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            discount_code = data.get('discount_code')

            if not discount_code:
                return JsonResponse({'discount_applied': False, 'message': 'Discount code missing'}, status=400)

            # Try to find a valid discount
            try:
                discount = Discount.objects.get(
                    code=discount_code,
                    valid_from__lte=timezone.now(),
                    valid_to__gte=timezone.now(),
                    active=True  # Assuming there's an 'active' field
                )
                
                # Return discount value if valid
                return JsonResponse({
                    'discount_applied': True,
                    'discount_value': discount.discount_value
                })
                
            except Discount.DoesNotExist:
                return JsonResponse({'discount_applied': False, 'message': 'Invalid or expired discount code'}, status=400)
                
        except json.JSONDecodeError:
            return JsonResponse({'discount_applied': False, 'message': 'Invalid JSON data'}, status=400)
        
    return JsonResponse({'discount_applied': False, 'message': 'Invalid request method'}, status=400)


@require_POST
def cache_checkout_data(request):
    try:
        pid = request.POST.get('client_secret').split('_secret')[0]
        stripe.api_key = settings.STRIPE_SECRET_KEY

        # Get discount value and total from the frontend
        discount_value = float(request.POST.get('discount_value', 0))
        total = float(request.POST.get('total'))
        total_after_discount = total - discount_value

        # Modify the PaymentIntent with the updated amount
        stripe.PaymentIntent.modify(
            pid,
            amount=int(total_after_discount * 100),  # Stripe expects amounts in cents
        )
        return HttpResponse(status=200)
    except Exception as e:
        messages.error(request, 'Sorry, your payment cannot be processed right now. Please try again later.')
        return HttpResponse(content=e, status=400)



def checkout_success(request, order_number):
    save_info = request.session.get('save_info')
    order = get_object_or_404(Order, order_number=order_number)

    if request.user.is_authenticated:
        profile = UserProfile.objects.get(user=request.user)
        order.user_profile = profile
        order.save()

        if save_info:
            profile_data = {
                'default_phone_number': order.phone_number,
                'default_country': order.country,
                'default_postcode': order.postcode,
                'default_town_or_city': order.town_or_city,
                'default_street_address1': order.street_address1,
                'default_street_address2': order.street_address2,
                'default_county': order.county,
            }
            user_profile_form = UserProfileForm(profile_data, instance=profile)
            if user_profile_form.is_valid():
                user_profile_form.save()

    messages.success(request, f'Order successfully processed! Your order number is {order_number}. A confirmation email will be sent to {order.email}.')

    if 'bag' in request.session:
        del request.session['bag']

    template = 'checkout/checkout_success.html'
    context = {
        'order': order,
    }

    return render(request, template, context)


def checkout(request):
    stripe_public_key = settings.STRIPE_PUBLIC_KEY
    stripe_secret_key = settings.STRIPE_SECRET_KEY

    discount_value = 0
    total = 0
    discount_code = None

    if request.method == 'POST':
        # This section should handle the POST request when the form is submitted

        bag = request.session.get('bag', {})
        discount_code = request.POST.get('discount_code', '').strip()

        form_data = {
            'full_name': request.POST['full_name'],
            'email': request.POST['email'],
            'phone_number': request.POST['phone_number'],
            'country': request.POST['country'],
            'postcode': request.POST['postcode'],
            'town_or_city': request.POST['town_or_city'],
            'street_address1': request.POST['street_address1'],
            'street_address2': request.POST['street_address2'],
            'county': request.POST['county'],
        }

        order_form = OrderForm(form_data)
        if order_form.is_valid():
            # Create the order and handle discounts if necessary
            current_bag = bag_contents(request)
            total = current_bag['grand_total']
            if discount_code:
                # Apply discount logic
                pass

            # Only create or modify the PaymentIntent at this point
            stripe.api_key = stripe_secret_key
            intent = stripe.PaymentIntent.create(
                amount=int(total * 100),  # Convert to cents for Stripe
                currency=settings.STRIPE_CURRENCY,
            )
            # Then pass the intent.client_secret to the template

    else:
        # If it's a GET request (page load), just render the page without creating or modifying the PaymentIntent
        current_bag = bag_contents(request)
        total = current_bag['grand_total']

        if request.user.is_authenticated:
            try:
                profile = UserProfile.objects.get(user=request.user)
                order_form = OrderForm(initial={
                    'full_name': profile.user.get_full_name(),
                    'email': profile.user.email,
                    'phone_number': profile.default_phone_number,
                    'country': profile.default_country,
                    'postcode': profile.default_postcode,
                    'town_or_city': profile.default_town_or_city,
                    'street_address1': profile.default_street_address1,
                    'street_address2': profile.default_street_address2,
                    'county': profile.default_county,
                })
            except UserProfile.DoesNotExist:
                order_form = OrderForm()
        else:
            order_form = OrderForm()

    template = 'checkout/checkout.html'
    context = {
        'order_form': order_form,
        'stripe_public_key': stripe_public_key,
        'total': total,
    }

    return render(request, template, context)

