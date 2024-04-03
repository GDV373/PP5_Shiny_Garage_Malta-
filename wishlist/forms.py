from products.forms import ProductForm
from django import forms

class WishListForm(forms.Form):
    item = forms.CharField(label='Item')
    description = forms.CharField(label='Description', widget=forms.Textarea)