document.addEventListener('DOMContentLoaded', () => {
    const applyDiscountButton = document.getElementById('apply-discount');
    const discountCodeInput = document.getElementById('discount_code');
    const discountMessage = document.getElementById('discount-message'); 
    const totalElement = document.querySelector('.order-total'); 
    const deliveryElement = document.querySelector('.delivery'); 
    const grandTotalElement = document.querySelector('.grand-total'); 
    const discountLabelElement = document.querySelector('.discount-label'); 
    const discountValueElement = document.querySelector('.discount-value');

    applyDiscountButton.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent form submission
        const discountCode = discountCodeInput.value.trim();

        if (!discountCode) {
            discountMessage.textContent = 'Please enter a discount code.';
            discountMessage.style.display = 'block';
            return;
        }

        // Reset previous messages
        discountMessage.style.display = 'none';

        // Send the discount code to validate
        fetch(checkoutUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'), // Use your CSRF token here
            },
            body: JSON.stringify({
                'discount_code': discountCode
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.discount_applied) {
                const discountValue = parseFloat(data.discount_value);

                // Show the discount details
                discountLabelElement.style.display = 'block';
                discountValueElement.style.display = 'block';
                discountValueElement.textContent = `-€${discountValue.toFixed(2)}`;

                // Update grand total after applying discount
                const originalTotal = parseFloat(totalElement.textContent.replace('€', '').replace(',', '.'));
                const deliveryCost = parseFloat(deliveryElement.textContent.replace('€', '').replace(',', '.'));
                const newGrandTotal = originalTotal + deliveryCost - discountValue;
                grandTotalElement.innerHTML = `<strong>€${newGrandTotal.toFixed(2)}</strong>`;

                // Display success message
                discountMessage.style.display = 'block';
                discountMessage.classList.remove('text-danger');
                discountMessage.classList.add('text-success');
                discountMessage.textContent = `Discount applied successfully! -€${discountValue.toFixed(2)}`;
            } else {
                discountMessage.style.display = 'block';
                discountMessage.classList.remove('text-success');
                discountMessage.classList.add('text-danger');
                discountMessage.textContent = data.message || 'Invalid discount code';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            discountMessage.style.display = 'block';
            discountMessage.classList.add('text-danger');
            discountMessage.textContent = 'An error occurred while applying the discount.';
        });
    });
});

// Utility function to get the CSRF token
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
