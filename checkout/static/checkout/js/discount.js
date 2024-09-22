document.addEventListener('DOMContentLoaded', () => {
    const applyDiscountButton = document.getElementById('apply-discount');
    const discountCodeInput = document.getElementById('discount_code');
    const discountMessage = document.getElementById('discount-message'); // Discount message element
    const totalElement = document.querySelector('.order-total'); // Selector for order total
    const deliveryElement = document.querySelector('.delivery'); // Selector for delivery cost
    const grandTotalElement = document.querySelector('.grand-total'); // Selector for grand total

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
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(`Error: ${response.status} - ${text}`);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Discount response data:', data); // Log the response data

            if (data.discount_applied) {
                const discountValue = data.discount_value; // Discount amount from server
                console.log('Discount applied: ', discountValue); // Log discount value

                const originalTotal = parseFloat(totalElement.textContent.replace('€', '').replace(',', '.')); // Current total
                console.log('Original total: ', originalTotal); // Log original total

                const updatedTotal = originalTotal - discountValue; // Apply discount
                console.log('Updated total: ', updatedTotal); // Log updated total

                const updatedGrandTotal = updatedTotal + parseFloat(deliveryElement.textContent.replace('€', '').replace(',', '.')); // Include delivery

                // Update the displayed values
                totalElement.textContent = `€${updatedTotal.toFixed(2).replace('.', ',')}`; // Format to Euro style
                grandTotalElement.innerHTML = `<strong>€${updatedGrandTotal.toFixed(2).replace('.', ',')}</strong>`; // Format to Euro style
                
                // Clear error message on success
                discountMessage.style.display = 'none';
                discountMessage.textContent = '';
            } else {
                // Show error message in red
                discountMessage.style.display = 'block';
                discountMessage.textContent = data.message || 'Invalid discount code';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            discountMessage.style.display = 'block';
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
