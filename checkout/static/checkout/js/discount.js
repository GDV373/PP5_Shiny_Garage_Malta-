document.addEventListener('DOMContentLoaded', () => {
    const applyDiscountButton = document.getElementById('apply-discount');
    const discountCodeInput = document.getElementById('discount_code');
    const totalElement = document.querySelector('.order-total'); // Selector for order total
    const deliveryElement = document.querySelector('.delivery'); // Selector for delivery cost
    const grandTotalElement = document.querySelector('.grand-total'); // Selector for grand total

    applyDiscountButton.addEventListener('click', () => {
        const discountCode = discountCodeInput.value.trim();

        // Fetch request to validate the discount code
        fetch(checkoutUrl, {  // Use the JavaScript variable here
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'), // Get CSRF token
            },
            body: JSON.stringify({ discount_code: discountCode }),
        })
        .then(response => {
            // Check if response is OK (status 200-299)
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(`Error: ${response.status} - ${text}`);
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.discount_applied) {
                const discountValue = data.discount_value; // Discount amount from server
                const originalTotal = parseFloat(totalElement.textContent.replace('€', '').replace(',', '.')); // Current total
                const updatedTotal = originalTotal - discountValue; // Apply discount
                const updatedGrandTotal = updatedTotal + parseFloat(deliveryElement.textContent.replace('€', '').replace(',', '.')); // Include delivery

                // Update the displayed values
                totalElement.textContent = `€${updatedTotal.toFixed(2).replace('.', ',')}`; // Format to Euro style
                grandTotalElement.innerHTML = `<strong>€${updatedGrandTotal.toFixed(2).replace('.', ',')}</strong>`; // Format to Euro style
                
                alert(`Discount applied: -€${discountValue.toFixed(2).replace('.', ',')}`);
            } else {
                alert(data.message || 'Invalid discount code');
            }
        })
        .catch(error => console.error('Error:', error));
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
