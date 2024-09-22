from django.shortcuts import (
    render, redirect, reverse, get_object_or_404, HttpResponse
)
from django.views.decorators.http import require_POST
from django.contrib import messages
from django.conf import settings

from .forms import OrderForm
from .models import Order, OrderLineItem
from django.http import HttpResponse
from products.models import Product
from profiles.models import UserProfile
from profiles.forms import UserProfileForm
from bag.contexts import bag_contents

from django.http import JsonResponse
from .models import Discount
from django.utils import timezone

import stripe
import json
import decimal

stripe.api_key = settings.STRIPE_SECRET_KEY

def apply_discount(request):
    if request.method == 'POST':
        try:
            # Get the discount code from the POST data
            discount_code = request.POST.get('discount_code', '')

            # Log the incoming data for debugging
            print(f"Discount Code: {discount_code}")
            print(f"Current Total: {request.POST.get('current_total')}")
            print(f"Current Shipping: {request.POST.get('current_shipping')}")

            # Fetch the discount object from the database
            discount = Discount.objects.get(code=discount_code, active=True)

            # Check if the discount is valid
            if not discount.is_valid():
                return JsonResponse({'valid': False, 'error': 'Discount code is not valid'}, status=400)

            # Convert current_total and current_shipping to float and ensure discount_value is float
            current_total = float(request.POST.get('current_total', 0))
            current_shipping = float(request.POST.get('current_shipping', 0))
            discount_value = float(discount.discount_value)  # The fixed discount value 

            discount_amount = 0

            # Apply the discount based on the type
            if discount.discount_type == 'item':
                # Subtract the fixed discount value from the item total
                discount_amount = min(current_total, discount_value)  # Ensure we don't subtract more than the total
            elif discount.discount_type == 'shipping':
                # Subtract the fixed discount value from the shipping cost
                discount_amount = min(current_shipping, discount_value)  # Ensure we don't subtract more than the shipping cost

            # Calculate the new grand total: total + shipping - discount
            new_grand_total = current_total + current_shipping - discount_amount

            # Return success response
            return JsonResponse({
                'valid': True,
                'discount_type': discount.discount_type,
                'discount_amount': f'{discount_amount:.2f}',
                'new_grand_total': f'{new_grand_total:.2f}',
            })

        except Discount.DoesNotExist:
            return JsonResponse({'valid': False, 'error': 'Discount code not found'}, status=400)

        except Exception as e:
            # Log the error and return a 500 response with detailed information
            print(f"Error applying discount: {str(e)}")
            return JsonResponse({'valid': False, 'error': str(e)}, status=500)

    return JsonResponse({'valid': False, 'error': 'Invalid request method'}, status=400)

def checkout(request):
    if request.method == 'POST':
        # Get the discounted grand total (fallback to grand_total if not provided)
        discounted_grand_total = request.POST.get('discounted_grand_total', None)

        if discounted_grand_total:
            amount_to_charge = float(discounted_grand_total)
        else:
            # If order is missing, handle error or default action here
            return HttpResponse("Error: Order not found or no total provided", status=400)

        # Convert amount to smallest unit (e.g., cents for Stripe)
        stripe_amount = int(amount_to_charge * 100)

        # Create Stripe PaymentIntent with the correct amount
        try:
            stripe.PaymentIntent.create(
                amount=stripe_amount,
                currency="eur",
                payment_method=request.POST['payment_method'],
                confirm=True,
            )
        except Exception as e:
            # If Stripe fails, return an error message to the user
            return HttpResponse(f"Stripe error: {str(e)}", status=500)

        # Redirect to checkout success after payment is confirmed
        order_number = "YOUR_ORDER_NUMBER"  # Fetch or generate the actual order number
        return redirect('checkout_success', order_number=order_number)

    else:
        # This branch handles GET requests (render checkout form)
        # Fetch or set any necessary context for your checkout form here
        context = {
            'client_secret': 'YOUR_STRIPE_CLIENT_SECRET',  # Fetch the real client secret
            'grand_total': 'YOUR_GRAND_TOTAL',  # Fetch the real grand total
        }
        return render(request, 'checkout/checkout.html', context)

def checkout_success(request, order_number):
    order = get_object_or_404(Order, order_number=order_number)

    context = {
        'order': order,
        'from_profile': 'profile' in request.GET,
    }
    return render(request, 'checkout/checkout_success.html', context)

@require_POST
def cache_checkout_data(request):
    try:
        pid = request.POST.get('client_secret').split('_secret')[0]
        stripe.api_key = settings.STRIPE_SECRET_KEY
        stripe.PaymentIntent.modify(pid, metadata={
            'bag': json.dumps(request.session.get('bag', {})),
            'save_info': request.POST.get('save_info'),
            'username': request.user,
        })
        return HttpResponse(status=200)
    except Exception as e:
        messages.error(request, ('Sorry, your payment cannot be '
                                 'processed right now. Please try '
                                 'again later.'))
        return HttpResponse(content=e, status=400)



    stripe_public_key = settings.STRIPE_PUBLIC_KEY
    stripe_secret_key = settings.STRIPE_SECRET_KEY

    if request.method == 'POST':
        bag = request.session.get('bag', {})

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
            order = order_form.save(commit=False)
            pid = request.POST.get('client_secret').split('_secret')[0]
            order.stripe_pid = pid
            order.original_bag = json.dumps(bag)
            order.save()
            for item_id, item_data in bag.items():
                try:
                    product = Product.objects.get(id=item_id)
                    order_line_item = OrderLineItem(
                            order=order,
                            product=product,
                            quantity=item_data,
                        )
                    order_line_item.save()
                except Product.DoesNotExist:
                    messages.error(request, (
                        "One of the products in your cart wasn't "
                        "found in our database. "
                        "Please call us for assistance!")
                    )
                    order.delete()
                    return redirect(reverse('view_bag'))

            # Save the info to the user's profile if all is well
            request.session['save_info'] = 'save-info' in request.POST
            return redirect(reverse('checkout_success',
                                    args=[order.order_number]))
        else:
            messages.error(request, ('There was an error with your form. '
                                     'Please double check your information.'))
    else:
        bag = request.session.get('bag', {})
        if not bag:
            messages.error(request,
                           "There's nothing in your cart at the moment")
            return redirect(reverse('products'))

        current_bag = bag_contents(request)
        total = current_bag['grand_total']
        stripe_total = round(total * 100)
        stripe.api_key = stripe_secret_key
        intent = stripe.PaymentIntent.create(
            amount=stripe_total,
            currency=settings.STRIPE_CURRENCY,
        )

        # Attempt to prefill the form with any info
        # the user maintains in their profile
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

    if not stripe_public_key:
        messages.warning(request, ('Stripe public key is missing. '
                                   'Did you forget to set it in '
                                   'your environment?'))

    template = 'checkout/checkout.html'
    context = {
        'order_form': order_form,
        'stripe_public_key': stripe_public_key,
        'client_secret': intent.client_secret,
    }

    return render(request, template, context)


    order = get_object_or_404(Order, order_number=order_number)

    # Get the discount amount (if any)
    discount_amount = 0
    if hasattr(order, 'discount'):
        discount_amount = order.discount_value  # Adjust depending on how your discount is stored

    context = {
        'order': order,
        'discount_amount': discount_amount,  # Pass discount to the context
        'from_profile': 'profile' in request.GET,
    }
    return render(request, 'checkout/checkout_success.html', context)

    """
    Handle successful checkouts
    """
    save_info = request.session.get('save_info')
    order = get_object_or_404(Order, order_number=order_number)

    if request.user.is_authenticated:
        profile = UserProfile.objects.get(user=request.user)
        # Attach the user's profile to the order
        order.user_profile = profile
        order.save()

        # Save the user's info
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

    messages.success(request, f'Order successfully processed! \
        Your order number is {order_number}. A confirmation \
        email will be sent to {order.email}.')

    if 'bag' in request.session:
        del request.session['bag']

    template = 'checkout/checkout_success.html'
    context = {
        'order': order,
    }

    return render(request, template, context)