from django.urls import path
from . import views

urlpatterns = [
    path('delete/<int:item_id>/', views.delete_wishlist_item, name='delete_wishlist_item'),
    path('', views.wishlist, name='wishlist'),
    path('add/<int:product_id>/', views.add_to_wishlist, name='add_to_wishlist'),
]
