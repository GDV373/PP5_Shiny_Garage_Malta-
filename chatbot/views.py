from django.shortcuts import render
from django.http import JsonResponse
import openai
import time

# Set your OpenAI API key and assistant ID
openai.api_key = 'OPENAI_API_KEY'
assistant_id = 'OPEN_API_USER'

def chatbot_view(request):
    return render(request, 'chatbot/chatbot.html')

def get_response(request):
    user_input = request.GET.get('user_input', '')
    response = get_assistant_response(user_input)
    return JsonResponse({'response': response})

def get_assistant_response(user_input):
    # Replace this with your OpenAI interaction logic
    try:
        completion = openai.Completion.create(
            engine="davinci-codex",
            prompt=user_input,
            max_tokens=150
        )
        return completion.choices[0].text.strip()
    except Exception as e:
        return str(e)
