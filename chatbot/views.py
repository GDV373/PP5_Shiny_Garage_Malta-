from django.conf import settings
import openai
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

# Set up your OpenAI API key from settings
openai.api_key = settings.OPENAI_API_KEY

@csrf_exempt
def chat_view(request):
    if request.method == 'POST':
        try:
            # Parse the JSON data from the request body
            data = json.loads(request.body)
            user_message = data.get('message')
            
            if not user_message:
                return JsonResponse({'error': 'No message provided'}, status=400)
            
            # Interact with OpenAI API
            response = openai.Completion.create(
                engine="text-davinci-003",  # You can use other engines if needed
                prompt=user_message,
                max_tokens=150
            )
            
            bot_message = response.choices[0].text.strip()
            
            return JsonResponse({'response': bot_message})
        
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Invalid request method'}, status=405)
