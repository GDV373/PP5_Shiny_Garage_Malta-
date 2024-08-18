from django.urls import path
from .views import chatbot_view, get_response

urlpatterns = [
    path('', chatbot_view, name='chatbot'),
    path('get_response/', get_response, name='get_response'),
]
