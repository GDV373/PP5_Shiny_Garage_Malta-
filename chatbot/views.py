from django.http import JsonResponse
from products.models import Product

def chatbot(request):
    product_name = request.GET.get('product_name', '').lower()

    # Define keyword categories
    keywords = {
        'wheels': ['wheel','wheel cleaner', 'tire cleaner', 'wheel clean', 'wheels clean'],
        'wheel': ['wheel','wheel cleaner', 'tire cleaner', 'wheel clean', 'wheels clean'],
        'foam': ['foam', 'foam cleaner', 'good foams', 'foams'],
    }
    
    matched_products = []
    for keyword, related_terms in keywords.items():
        for term in related_terms:
            if term in product_name:
                products = Product.objects.filter(name__icontains=keyword)
                matched_products.extend(products)
                break 
    if not matched_products:
        matched_products = Product.objects.filter(name__icontains=product_name)
    
    if not matched_products:
        return JsonResponse({'message': 'No products found related to your query.'})
    
    product_list = [{
        'name': product.name or 'N/A',
        'description': product.description or 'No description available',
        'price': str(product.price) if product.price is not None else 'N/A'
    } for product in matched_products]
    
    return JsonResponse({'products': product_list})

