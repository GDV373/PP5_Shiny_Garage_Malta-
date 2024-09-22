document.addEventListener('DOMContentLoaded', () => {
    var stripePublicKey = JSON.parse(document.getElementById('id_stripe_public_key').textContent);
    var clientSecret = JSON.parse(document.getElementById('id_client_secret').textContent);
    var stripe = Stripe(stripePublicKey);
    var elements = stripe.elements();
    var style = {
        base: {
            color: '#000',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
                color: '#aab7c4'
            }
        },
        invalid: {
            color: '#dc3545',
            iconColor: '#dc3545'
        }
    };
    var card = elements.create('card', { style: style });
    card.mount('#card-element');

    // Handle real-time validation errors on the card element
    card.addEventListener('change', function (event) {
        var errorDiv = document.getElementById('card-errors');
        if (event.error) {
            var html = `
                <span class="icon" role="alert">
                    <i class="fas fa-times"></i>
                </span>
                <span>${event.error.message}</span>`;
            $(errorDiv).html(html);
        } else {
            errorDiv.textContent = '';
        }
    });

    var form = document.getElementById('payment-form');
    var isSubmitting = false;  // Flag to prevent multiple submissions

    form.addEventListener('submit', function(ev) {
        ev.preventDefault();
        console.log("Form submission triggered");

        if (isSubmitting) {
            console.log("Form is already submitting, stopping duplicate submission");
            return;  // Prevent duplicate submissions
        }
        isSubmitting = true;  // Set flag to true after first submission
        console.log("Form is now submitting...");

        // Disable card and button while processing
        card.update({ 'disabled': true });
        $('#submit-button').attr('disabled', true);
        $('#payment-form').fadeToggle(100);
        $('#loading-overlay').fadeToggle(100);

        var saveInfo = Boolean($('#id-save-info').attr('checked'));
        var csrfToken = $('input[name="csrfmiddlewaretoken"]').val();
        
        // Extract discount value and grand total
        var discountValue = parseFloat($('.discount-value').text().replace('€', '').replace(',', '.')) || 0;
        var grandTotal = parseFloat($('.grand-total').text().replace('€', '').replace(',', '.'));

        // Data to send to backend
        var postData = {
            'csrfmiddlewaretoken': csrfToken,
            'client_secret': clientSecret,
            'save_info': saveInfo,
            'discount_value': discountValue,  // Pass the discount value to backend
            'total': grandTotal  // Pass the total after discount to backend
        };

        var url = '/checkout/cache_checkout_data/';

        // Update PaymentIntent with final total, then confirm the payment
        $.post(url, postData).done(function () {
            console.log("PaymentIntent successfully updated");
            stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: card,
                    billing_details: {
                        name: $.trim(form.full_name.value),
                        phone: $.trim(form.phone_number.value),
                        email: $.trim(form.email.value),
                        address: {
                            line1: $.trim(form.street_address1.value),
                            line2: $.trim(form.street_address2.value),
                            city: $.trim(form.town_or_city.value),
                            country: $.trim(form.country.value),
                            state: $.trim(form.county.value),
                        }
                    }
                },
                shipping: {
                    name: $.trim(form.full_name.value),
                    phone: $.trim(form.phone_number.value),
                    address: {
                        line1: $.trim(form.street_address1.value),
                        line2: $.trim(form.street_address2.value),
                        city: $.trim(form.town_or_city.value),
                        country: $.trim(form.country.value),
                        postal_code: $.trim(form.postcode.value),
                        state: $.trim(form.county.value),
                    }
                },
            }).then(function(result) {
                if (result.error) {
                    console.log("Error confirming payment:", result.error.message);
                    var errorDiv = document.getElementById('card-errors');
                    var html = `
                        <span class="icon" role="alert">
                            <i class="fas fa-times"></i>
                        </span>
                        <span>${result.error.message}</span>`;
                    $(errorDiv).html(html);
                    $('#payment-form').fadeToggle(100);
                    $('#loading-overlay').fadeToggle(100);
                    card.update({ 'disabled': false });
                    $('#submit-button').attr('disabled', false);
                    isSubmitting = false;  // Reset flag if error occurs
                } else {
                    if (result.paymentIntent.status === 'succeeded') {
                        console.log("Payment succeeded, submitting form");
                        form.submit();  // Submit form after successful payment
                    }
                }
            });
        }).fail(function () {
            console.log("Failed to update PaymentIntent");
            location.reload();  // Reload page if backend fails
            isSubmitting = false;  // Reset flag on failure
        });
    });
});
