document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('apply-discount').addEventListener('click', function() {
        const discountCode = document.getElementById('discount-code').value;
        const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
        const currentTotal = parseFloat(document.getElementById('current-total').textContent); 
        const currentShipping = parseFloat(document.getElementById('current-shipping').textContent); 

        if (discountCode) {
            $.ajax({
                url: '/checkout/apply_discount/',
                method: 'POST',
                data: {
                    'discount_code': discountCode,  // Discount code entered by the user
                    'csrfmiddlewaretoken': csrfToken,  // CSRF token for security, required by Django
                    'current_total': currentTotal,  // Current total price of items in the cart
                    'current_shipping': currentShipping  // Current shipping cost (if applicable)
                },
                success: function(response) {
                    if (response.valid) {
                        // Discount applied successfully: Update totals and show a success message
                        document.getElementById('discount-amount').textContent = `€${response.discount_amount}`;
                        document.getElementById('new-grand-total').textContent = `€${response.new_grand_total}`;
                        document.getElementById('discount-message').textContent = 'Discount applied!';
                        document.getElementById('discount-message').style.color = 'green';
                    } else {
                        // Invalid discount code: Show an error message
                        document.getElementById('discount-message').textContent = 'Invalid discount code.';
                        document.getElementById('discount-message').style.color = 'red';
                    }
                },
                error: function(xhr, status, error) {
                    console.log("AJAX Error:", error);  // Log error details
                    document.getElementById('discount-message').textContent = 'Error applying discount.';
                    document.getElementById('discount-message').style.color = 'red';
                }
            });
        } else {
            document.getElementById('discount-message').textContent = 'Please enter a discount code.';
            document.getElementById('discount-message').style.color = 'red';
        }
    });
});
