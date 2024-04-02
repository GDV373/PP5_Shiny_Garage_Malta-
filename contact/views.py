from django.shortcuts import render, redirect, reverse, get_object_or_404
from django.contrib import messages
from django.http import HttpResponseRedirect
from .forms import ContactUsForm
from allauth.account.models import EmailAddress
from allauth.account.utils import send_email_confirmation
from django.contrib.auth import get_user_model

def contact_us(request):
    if request.method == 'POST':
        form = ContactUsForm(request.POST)
        if form.is_valid():
            form.save()
            
            # Send email confirmation to the user if email is provided
            email = form.cleaned_data['email']
            if email:
                user_model = get_user_model()
                user = user_model.objects.filter(email=email).first()
                if user:
                    if not EmailAddress.objects.filter(user=user, verified=True).exists():
                        send_email_confirmation(request, user)
                        
            messages.success(request, 'Your message has been sent!')
            return HttpResponseRedirect(reverse('contact_us') + '?submitted=True')
        else:
            messages.warning(request, 'Message not sent. Please try again.')
    
    else:
        form = ContactUsForm()
        if 'submitted' in request.GET:
            form = ContactUsForm()

    template = 'contact/contactus.html'
    context = {
        'form': form,
    }

    return render(request, template, context)
