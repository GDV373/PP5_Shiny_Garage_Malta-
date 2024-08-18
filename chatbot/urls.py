from django.urls import path
from .views import chat_view, index  # Import your views

urlpatterns = [
    path('', index, name='index'), 
    path('chat/', chat_view, name='chat'),
]