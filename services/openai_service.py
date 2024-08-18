import openai
from django.conf import settings

openai.api_key = settings.OPENAI_API_KEY

def get_chatgpt_response(prompt):
    response = openai.Completion.create(
        model="gpt-4o",  #
        prompt=prompt,
        max_tokens=150
    )
    return response.choices[0].text.strip()
