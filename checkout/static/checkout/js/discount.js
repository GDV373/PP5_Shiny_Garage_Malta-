document.addEventListener('DOMContentLoaded', () => {
    const applyDiscountButton = document.getElementById('apply-discount');
    const discountCodeInput = document.getElementById('discount_code');
    const discountMessage = document.getElementById('discount-message'); // Discount message element
    const totalElement = document.querySelector('.order-total'); // Selector for order total
    const deliveryElement = document.querySelector('.delivery'); // Selector for delivery cost
    const grandTotalElement = document.querySelector('.grand-total'); // Selector for grand total
    const discountLabelElement = document.querySelector('.discount-label'); // Selector for discount label
    const discountValueElement = document.querySelector('.discount-value'); // Selector for discount value

    applyDiscountButton.addEventListener('click', () => {
        const discountCode = discountCodeInput.value.trim();

        // Reset discount message each time button is clicked
        discountMessage.style.display = 'none';
        discountMessage.textContent = '';

        // Fetch request to validate the discount code
        fetch('/checkout/validate-discount/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'), // Get CSRF token
            },
            body: JSON.stringify({ discount_code: discountCode }),
        })
        .then(response => response.json())  // Parse the response as JSON
        .then(data => {
            if (data.discount_applied) {
                const discountValue = parseFloat(data.discount_value); // Convert to float to use toFixed
                const originalTotal = parseFloat(totalElement.textContent.replace('€', '').replace(',', '.')); // Current total
                const updatedGrandTotal = originalTotal + parseFloat(deliveryElement.textContent.replace('€', '').replace(',', '.')) - discountValue; // Include delivery

                // Update the displayed values
                discountLabelElement.style.display = 'block';
                discountValueElement.style.display = 'block';
                discountValueElement.textContent = `-€${discountValue.toFixed(2).replace('.', ',')}`; // Format to Euro style
                grandTotalElement.innerHTML = `<strong>€${updatedGrandTotal.toFixed(2).replace('.', ',')}</strong>`; // Format to Euro style
                
                // Show success message in green
                discountMessage.style.display = 'block';
                discountMessage.classList.remove('text-danger');
                discountMessage.classList.add('text-success');
                discountMessage.textContent = `Discount applied: -€${discountValue.toFixed(2).replace('.', ',')}`;
            } else {
                // Show error message in red (this is the invalid discount case)
                discountMessage.style.display = 'block';
                discountMessage.classList.remove('text-success');
                discountMessage.classList.add('text-danger');
                discountMessage.textContent = data.message || 'Invalid discount code';
            }
        })
        .catch(error => {
            // Catch unexpected errors (like network issues)
            console.error('Error:', error);
            discountMessage.style.display = 'block';
            discountMessage.classList.add('text-danger');
            discountMessage.textContent = 'An error occurred. Please try again.';
        });
    });
});

// Function to get CSRF token
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
