document.addEventListener('DOMContentLoaded', () => {
    const applyDiscountButton = document.getElementById('apply-discount');
    const discountCodeInput = document.getElementById('discount_code');
    const totalElement = document.querySelector('.order-total'); // Selector for order total
    const deliveryElement = document.querySelector('.delivery'); // Selector for delivery cost
    const grandTotalElement = document.querySelector('.grand-total'); // Selector for grand total

    applyDiscountButton.addEventListener('click', () => {
        const discountCode = discountCodeInput.value.trim();

        // Fetch request to validate the discount code
        fetch('{% url "checkout" %}', {  // Change this to your actual checkout URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'), // Get CSRF token
            },
            body: JSON.stringify({ discount_code: discountCode }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.discount_applied) {
                const discountValue = data.discount_value; // Discount amount from server
                const originalTotal = parseFloat(totalElement.textContent.replace('€', '')); // Current total
                const updatedTotal = originalTotal - discountValue; // Apply discount
                const updatedGrandTotal = updatedTotal + parseFloat(deliveryElement.textContent.replace('€', '')); // Include delivery

                // Update the displayed values
                totalElement.textContent = `€${updatedTotal.toFixed(2)}`;
                grandTotalElement.innerHTML = `<strong>€${updatedGrandTotal.toFixed(2)}</strong>`;
                
                alert(`Discount applied: -€${discountValue.toFixed(2)}`);
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
