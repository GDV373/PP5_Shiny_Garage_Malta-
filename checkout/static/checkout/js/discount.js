document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('apply-discount').addEventListener('click', function() {
        const discountCode = document.getElementById('discount-code').value;
        const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
        const currentTotal = parseFloat(document.getElementById('current-total').textContent.replace('€', ''));
        const currentShipping = parseFloat(document.getElementById('current-shipping').textContent.replace('€', ''));

        if (discountCode) {
            $.ajax({
                url: '/checkout/apply_discount/',
                method: 'POST',
                data: {
                    'discount_code': discountCode,
                    'csrfmiddlewaretoken': csrfToken,
                    'current_total': currentTotal,
                    'current_shipping': currentShipping
                },
                success: function(response) {
                    if (response.valid) {
                        // Show discount and update grand total
                        document.getElementById('discount-amount').textContent = `€${response.discount_amount}`;
                        document.getElementById('new-grand-total').textContent = `€${response.new_grand_total}`;
                        document.getElementById('discount-message').textContent = 'Discount applied!';
                        document.getElementById('discount-message').style.color = 'green';
                        document.getElementById('discount-row').style.display = 'block';  // Show the discount row
                    } else {
                        // Hide the discount row and show error message
                        document.getElementById('discount-message').textContent = 'Invalid discount code.';
                        document.getElementById('discount-message').style.color = 'red';
                        document.getElementById('discount-row').style.display = 'none';
                    }
                },
                error: function(xhr, status, error) {
                    document.getElementById('discount-message').textContent = 'Error applying discount.';
                    document.getElementById('discount-message').style.color = 'red';
                    document.getElementById('discount-row').style.display = 'none';
                }
            });
        } else {
            // No discount code entered, ensure grand total remains visible
            document.getElementById('discount-message').textContent = 'Please enter a discount code.';
            document.getElementById('discount-message').style.color = 'red';
            document.getElementById('discount-row').style.display = 'none';
        }
    });
});
