document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('apply-discount').addEventListener('click', function() {
        const discountCode = document.getElementById('discount-code').value;
        const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;

        if (discountCode) {
            $.ajax({
                url: '/checkout/apply_discount/',
                method: 'POST',
                data: {
                    'discount_code': discountCode,
                    'csrfmiddlewaretoken': csrfToken
                },
                success: function(response) {
                    if (response.valid) {
                        // Show the discount row if discount is valid
                        document.getElementById('discount-row').style.display = 'block';
                        document.getElementById('discount-message').textContent = 'Discount applied!';
                        document.getElementById('discount-message').style.color = 'green';

                        if (response.discount_type === 'item') {
                            document.getElementById('discount-amount').textContent = `€${response.discount_amount}`;
                            document.getElementById('new-grand-total').textContent = `€${response.new_grand_total}`;
                        } else if (response.discount_type === 'shipping') {
                            document.getElementById('discount-label').textContent = 'Shipping Discount:';
                            document.getElementById('discount-amount').textContent = `€${response.discount_amount}`;
                            document.getElementById('new-grand-total').textContent = `€${response.new_grand_total}`;
                        }

                    } else {
                        document.getElementById('discount-message').textContent = 'Invalid discount code.';
                        document.getElementById('discount-message').style.color = 'red';
                        document.getElementById('discount-row').style.display = 'none';  // Hide if invalid
                        document.getElementById('discount-amount').textContent = '€0.00';
                    }
                },
                error: function() {
                    document.getElementById('discount-message').textContent = 'Error applying discount.';
                    document.getElementById('discount-message').style.color = 'red';
                    document.getElementById('discount-row').style.display = 'none';  // Hide if there's an error
                }
            });
        } else {
            document.getElementById('discount-message').textContent = 'Please enter a discount code.';
            document.getElementById('discount-message').style.color = 'red';
            document.getElementById('discount-row').style.display = 'none';  // Hide if no code entered
        }
    });
});
