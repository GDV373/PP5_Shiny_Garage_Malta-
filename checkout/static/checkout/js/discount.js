document.addEventListener('DOMContentLoaded', function() {
    const applyButton = document.getElementById('apply_discount');
    const discountCodeInput = document.getElementById('discount_code');
    const grandTotalElement = document.getElementById('grand_total');
    const finalAmountElement = document.getElementById('final_amount');
    const orderSummary = document.getElementById('order-summary');

    const originalTotal = parseFloat(orderSummary.dataset.total); // Use the data attribute
    const deliveryCost = parseFloat(orderSummary.dataset.delivery); // Use the data attribute

    applyButton.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent form submission
        const discountCode = discountCodeInput.value.trim();
        
        // Example logic for applying discount
        let discountValue = 0; // Set initial discount value
        if (discountCode === 'YOUR_DISCOUNT_CODE') {
            discountValue = 10; // Example fixed discount value
        }
        
        // Update totals
        const newGrandTotal = (originalTotal + deliveryCost) - discountValue;
        
        grandTotalElement.innerText = '€' + newGrandTotal.toFixed(2);
        finalAmountElement.innerText = newGrandTotal.toFixed(2);

        if (discountValue > 0) {
            alert("Discount applied: -€" + discountValue.toFixed(2));
        }
    });
});
