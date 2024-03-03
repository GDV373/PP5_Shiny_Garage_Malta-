from django.shortcuts import render

# Create your views here.

def view_bag(request):
    """ A view to return the cart contents """
    
    return render(request, 'bag/bag.html')