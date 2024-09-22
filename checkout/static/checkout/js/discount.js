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
                    document.getElementById('discount-message').textContent = 'Discount applied!';
                    document.getElementById('discount-amount').textContent = `€${response.discount_amount}`;
                    document.getElementById('new-grand-total').textContent = `€${response.new_grand_total}`;
                } else {
                    document.getElementById('discount-message').textContent = 'Invalid discount code.';
                    document.getElementById('discount-amount').textContent = '€0.00';
                }
            },
            error: function() {
                document.getElementById('discount-message').textContent = 'Error applying discount.';
            }
        });
    } else {
        document.getElementById('discount-message').textContent = 'Please enter a discount code.';
    }
});
