from django.urls import path
from . import views

urlpatterns = [
    path('', views.wish_list, name='wish_list'),
    path('add-to-wishlist/', views.add_to_wishlist, name='add_to_wishlist'),
]
