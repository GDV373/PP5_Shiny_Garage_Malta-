document.addEventListener('DOMContentLoaded', () => {
    const chatBody = document.querySelector('.livechat-body');
    const chatButton = document.getElementById('btnchatclick');
    const chatPopup = document.querySelector('.livechat-room');
    const closeButton = document.querySelector('.livechat-header .close');
    const inputField = document.querySelector('.message-input');
    const sendButton = document.querySelector('.send-button');

    let conversationHistory = [];
    let products = [];
    let fuse;

    function loadProducts() {
        fetch('/products/fixtures/products.json')
            .then(response => response.json())
            .then(data => {
                products = data;
                console.log('Products loaded:', products.length);
                initializeFuse();
            })
            .catch(error => console.error('Error loading products:', error));
    }

    function initializeFuse() {
        const options = {
            keys: ['fields.name', 'fields.description', 'fields.category'],
            threshold: 0.3,
            includeScore: true
        };
        fuse = new Fuse(products, options);
    }

    function initializeChat() {
        loadProducts();
        appendMessage('received', 'Hello! I\'m your AI assistant. How can I help you with our car care products today?');
    }

    function handleUserInput(userInput) {
        appendMessage('sent', userInput);
        conversationHistory.push({ role: 'user', content: userInput });

        showTypingIndicator();
        setTimeout(() => {
            const aiResponse = generateAIResponse(userInput);
            appendMessage('received', aiResponse);
            conversationHistory.push({ role: 'assistant', content: aiResponse });
            hideTypingIndicator();
        }, 1000 + Math.random() * 1000);
    }

    function generateAIResponse(userInput) {
        const lowerInput = userInput.toLowerCase();
        
        if (!fuse) {
            return "I'm still loading product information. Please try again in a moment.";
        }

        const searchResults = fuse.search(lowerInput);
        const matchingProducts = searchResults.slice(0, 3).map(result => result.item); // Get top 3 matches

        if (matchingProducts.length > 0) {
            let response = "I found the following product(s) that might interest you:\n\n";
            matchingProducts.forEach(product => {
                response += `${product.fields.name}\n`;
                response += `Description: ${product.fields.description}\n`;
                response += `Price: €${product.fields.price}\n`;
                response += `Category: ${product.fields.category}\n\n`;
            });
            response += "Would you like more information about any of these products?";
            return response;
        } else if (lowerInput.includes('product') || lowerInput.includes('item')) {
            return "I'd be happy to help you find product information. Could you please specify the name or type of car care product you're interested in?";
        } else if (lowerInput.includes('price') || lowerInput.includes('cost')) {
            return "Our prices vary depending on the product. Can you tell me which specific car care product you'd like the price for?";
        } else if (lowerInput.includes('category')) {
            return "We have various categories of car care products including cleaners, polishes, waxes, and accessories. Which category are you interested in?";
        } else if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
            return "Hello! How can I assist you with our car care products today?";
        } else {
            return "I'm not sure I understand. Could you please rephrase your question or provide more details about what you're looking for in our car care product range?";
        }
    }

    // ... (rest of the code remains the same)

    initializeChat();
});