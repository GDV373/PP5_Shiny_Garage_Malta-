import uuid

from django.db import models
from django.db.models import Sum
from django.conf import settings
from django_countries.fields import CountryField
from products.models import Product
from profiles.models import UserProfile
from django.utils import timezone


class Discount(models.Model):
    DISCOUNT_TYPE_CHOICES = (
        ('item', 'Item'),
        ('shipping', 'Shipping'),
    )

    code = models.CharField(max_length=15, unique=True, null=False, blank=False)
    discount_type = models.CharField(max_length=10, choices=DISCOUNT_TYPE_CHOICES, null=False, blank=False)
    discount_value = models.DecimalField(max_digits=5, decimal_places=2, null=False, blank=False)
    valid_from = models.DateTimeField(null=False, blank=False)
    valid_to = models.DateTimeField(null=False, blank=False)
    active = models.BooleanField(default=True)

    def is_valid(self):
        """Check if discount is valid."""
        now = timezone.now()
        return self.active and self.valid_from <= now <= self.valid_to

    def __str__(self):
        return f'{self.code} ({self.discount_type} - {self.discount_value})'


class Order(models.Model):
    order_number = models.CharField(max_length=32, null=False, editable=False)
    user_profile = models.ForeignKey(UserProfile, on_delete=models.SET_NULL, null=True, blank=True, related_name='orders')
    full_name = models.CharField(max_length=50, null=False, blank=False)
    email = models.EmailField(max_length=254, null=False, blank=False)
    phone_number = models.CharField(max_length=20, null=False, blank=False)
    country = CountryField(blank_label='Country *', null=False, blank=False)
    postcode = models.CharField(max_length=20, null=True, blank=True)
    town_or_city = models.CharField(max_length=40, null=False, blank=False)
    street_address1 = models.CharField(max_length=80, null=False, blank=False)
    street_address2 = models.CharField(max_length=80, null=True, blank=True)
    county = models.CharField(max_length=80, null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)
    delivery_cost = models.DecimalField(max_digits=6, decimal_places=2, null=False, default=0)
    order_total = models.DecimalField(max_digits=10, decimal_places=2, null=False, default=0)
    grand_total = models.DecimalField(max_digits=10, decimal_places=2, null=False, default=0)
    original_bag = models.TextField(null=False, blank=False, default='')
    stripe_pid = models.CharField(max_length=254, null=False, blank=False, default='')
    discount_code = models.CharField(max_length=15, null=True, blank=True)  # Added discount code field
    discount_value = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True, default=0)  # Discount amount

    def _generate_order_number(self):
        """Generate a random, unique order number using UUID"""
        return uuid.uuid4().hex.upper()

    def update_total(self, discount=None):
        """Update grand total each time a line item is added, accounting for delivery costs and discounts."""
        self.order_total = self.lineitems.aggregate(Sum('lineitem_total'))['lineitem_total__sum'] or 0
        
        # Delivery calculation
        if self.order_total < settings.FREE_DELIVERY_THRESHOLD:
            sdp = settings.STANDARD_DELIVERY_PERCENTAGE
            self.delivery_cost = self.order_total * sdp / 100
        else:
            self.delivery_cost = 0

        # Apply discount if available
        if discount and discount.is_valid():
            if discount.discount_type == 'item':
                self.discount_value = self.order_total * (discount.discount_value / 100)
                self.order_total -= self.discount_value  # Discount on item
            elif discount.discount_type == 'shipping':
                self.discount_value = self.delivery_cost * (discount.discount_value / 100)
                self.delivery_cost -= self.discount_value  # Discount on shipping
            self.discount_code = discount.code
        else:
            self.discount_value = 0  # No valid discount

        self.grand_total = self.order_total + self.delivery_cost
        self.save()

    def save(self, *args, **kwargs):
        """Override the original save method to set the order number if it hasn't been set already."""
        if not self.order_number:
            self.order_number = self._generate_order_number()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.order_number


class OrderLineItem(models.Model):
    order = models.ForeignKey(Order, null=False, blank=False, on_delete=models.CASCADE, related_name='lineitems')
    product = models.ForeignKey(Product, null=False, blank=False, on_delete=models.CASCADE)
    quantity = models.IntegerField(null=False, blank=False, default=0)
    lineitem_total = models.DecimalField(max_digits=6, decimal_places=2, null=False, blank=False, editable=False)

    def save(self, *args, **kwargs):
        """Override the original save method to set the lineitem total and update the order total."""
        self.lineitem_total = self.product.price * self.quantity
        super().save(*args, **kwargs)

    def __str__(self):
        return f'SKU {self.product.sku} on order {self.order.order_number}'
