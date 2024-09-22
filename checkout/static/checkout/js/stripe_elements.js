var stripe = Stripe(document.getElementById('id_stripe_public_key').textContent.trim());

// Create an instance of Elements
var elements = stripe.elements();

// Create an instance of the card Element
var card = elements.create('card', {
    style: {
        base: {
            color: '#32325d',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
                color: '#aab7c4'
            }
        },
        invalid: {
            color: '#fa755a',
            iconColor: '#fa755a'
        }
    }
});

// Add the card Element into the `card-element` div
card.mount('#card-element');

// Handle real-time validation errors from the card Element
card.on('change', function(event) {
    var displayError = document.getElementById('card-errors');
    if (event.error) {
        displayError.textContent = event.error.message;
    } else {
        displayError.textContent = '';
    }
});

// Handle form submission
var form = document.getElementById('payment-form');
form.addEventListener('submit', function(event) {
    event.preventDefault();

    // Disable the form button to prevent multiple submissions
    document.getElementById('submit-button').disabled = true;

    stripe.confirmCardPayment(document.getElementById('id_client_secret').textContent.trim(), {
        payment_method: {
            card: card,
            billing_details: {
                name: form.querySelector('input[name=full_name]').value,
                email: form.querySelector('input[name=email]').value,
                phone: form.querySelector('input[name=phone_number]').value,
                address: {
                    line1: form.querySelector('input[name=street_address1]').value,
                    line2: form.querySelector('input[name=street_address2]').value,
                    city: form.querySelector('input[name=town_or_city]').value,
                    state: form.querySelector('input[name=county]').value,
                    postal_code: form.querySelector('input[name=postcode]').value,
                    country: form.querySelector('select[name=country]').value
                }
            }
        }
    }).then(function(result) {
        if (result.error) {
            // Show error to your customer (e.g., insufficient funds)
            document.getElementById('card-errors').textContent = result.error.message;
            // Re-enable the submit button in case of error
            document.getElementById('submit-button').disabled = false;
        } else {
            // The payment has been processed!
            if (result.paymentIntent.status === 'succeeded') {
                // Submit the form to complete the order
                form.submit();
            }
        }
    });
});
