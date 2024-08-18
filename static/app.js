document.addEventListener('DOMContentLoaded', () => {
    const chatBody = document.querySelector('.livechat-body');
    appendMessage('received', 'Hello! Please enter the product name for information.');

    const chatButton = document.getElementById('btnchatclick');
    const chatPopup = document.querySelector('.livechat-room');
    const closeButton = document.querySelector('.livechat-header .close');
    const inputField = document.querySelector('.message-input');
    const sendButton = document.querySelector('.send-button');

    chatButton.addEventListener('click', () => {
        chatPopup.classList.add('open');
    });

    closeButton.addEventListener('click', () => {
        chatPopup.classList.remove('open');
        clearChat();
    });

    // Define your products for fuzzy search
    const products = [
        { name: 'wheel cleaner', category: 'wheel cleaner' },
        { name: 'cleaning kit', category: 'cleaning kit' },
        { name: 'tire shine', category: 'tire shine' },
        { name: 'car wax', category: 'car wax' },
        { name: 'car shampoo', category: 'car shampoo' },
        // Add more products as needed
    ];

    // Initialize Fuse.js for fuzzy search
    const fuse = new Fuse(products, {
        keys: ['name'],
        threshold: 0.3, // Adjust the threshold for fuzziness
    });

    function sendMessage() {
        const messageText = inputField.value.trim().toLowerCase();

        const greetings = ['hello', 'hi', 'hola', 'hey', 'howdy', 'greetings'];
        const farewells = ['bye', 'goodbye', 'see you', 'later', 'ciao'];
        const thanks = ['thank you', 'thanks', 'cheers', 'much appreciated'];
        const smallTalk = ['how are you', 'how\'s it going', 'what\'s up', 'what\'s new'];

        const productRequestPattern = /(?:i (?:want|need|am looking for|would like|could use) (?:to )?(?:buy|purchase|get|find))\s+(.+?)(?: for my car|)/;

        let product = null;

        // Fuzzy search for product matches
        const matches = fuse.search(messageText);
        if (matches.length > 0) {
            product = matches[0].item.name;
        }

        if (greetings.includes(messageText)) {
            appendMessage('sent', inputField.value);
            appendMessageWithDelay('received', `Hello! How can I assist you today? You can ask me about our products.`);
        } else if (smallTalk.some(phrase => messageText.includes(phrase))) {
            appendMessage('sent', inputField.value);
            appendMessageWithDelay('received', `I'm doing great, thank you! How can I assist you with our products today?`);
        } else if (farewells.includes(messageText)) {
            appendMessage('sent', inputField.value);
            appendMessageWithDelay('received', `Goodbye! Feel free to chat with me again if you need more information.`);
        } else if (thanks.some(phrase => messageText.includes(phrase))) {
            appendMessage('sent', inputField.value);
            appendMessageWithDelay('received', `You're welcome! I'm here to help. Is there anything else you need?`);
        } else if (product) {
            appendMessage('sent', inputField.value);
            showTypingIndicator();

            setTimeout(() => {
                fetch(`chatbot/?product_name=${encodeURIComponent(product)}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok ' + response.statusText);
                        }
                        return response.json();
                    })
                    .then(data => {
                        hideTypingIndicator();
                        if (data.products && data.products.length > 0) {
                            const productList = data.products.map(product => `
                                <strong>Name:</strong> ${product.name || 'N/A'}<br>
                                <strong>Description:</strong> ${product.description || 'No description available'}<br>
                                <strong>Price:</strong> €${product.price || 'N/A'}
                            `).join('<br><br>');
                            appendMessage('received', `Here are the available ${product}s:<br>${productList}<br>Is there anything else I can help you with?`);
                        } else {
                            appendMessage('received', `I'm terribly sorry, but I couldn't find any products matching "${product}". Please try a different product name or <a href='/contact'>contact us</a> for assistance.`);
                        }
                        chatBody.scrollTop = chatBody.scrollHeight;
                    })
                    .catch(error => {
                        console.error('Fetch error:', error);
                        hideTypingIndicator();
                        appendMessage('received', `I'm sorry, but I couldn't process your request at this moment. Please try again later or <a href='/contact'>contact us</a> for more assistance.`);
                    });
            }, 2000); // 2-second delay before showing the response

        } else if (messageText) {
            appendMessage('sent', inputField.value);
            showTypingIndicator();

            setTimeout(() => {
                fetch(`chatbot/?product_name=${encodeURIComponent(messageText)}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok ' + response.statusText);
                        }
                        return response.json();
                    })
                    .then(data => {
                        hideTypingIndicator();
                        if (data.products && data.products.length > 0) {
                            const productList = data.products.map(product => `
                                <strong>Name:</strong> ${product.name || 'N/A'}<br>
                                <strong>Description:</strong> ${product.description || 'No description available'}<br>
                                <strong>Price:</strong> €${product.price || 'N/A'}
                            `).join('<br><br>');
                            appendMessage('received', `Here is the information you requested:<br>${productList}<br>Is there anything else I can help you with?`);
                        } else {
                            appendMessage('received', `I'm terribly sorry, but I couldn't find any products matching "${messageText}". Please try a different product name or <a href='/contact'>contact us</a> for assistance.`);
                        }
                        chatBody.scrollTop = chatBody.scrollHeight;
                    })
                    .catch(error => {
                        console.error('Fetch error:', error);
                        hideTypingIndicator();
                        appendMessage('received', `I'm sorry, but I couldn't process your request at this moment. Please try again later or <a href='/contact'>contact us</a> for more assistance.`);
                    });
            }, 2000); // 2-second delay before showing the response

        } else {
            appendMessageWithDelay('received', `I didn't catch that. Could you please rephrase your request? I'm here to help.`);
        }

        inputField.value = ''; // Clear the input field after sending the message
    }

    sendButton.addEventListener('click', sendMessage);

    inputField.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent default form submission
            sendMessage();
        }
    });

    function showTypingIndicator() {
        appendMessage('received', 'Typing...');
    }

    function hideTypingIndicator() {
        const lastMessage = chatBody.lastChild;
        if (lastMessage && lastMessage.textContent === 'Typing...') {
            chatBody.removeChild(lastMessage);
        }
    }

    function appendMessageWithDelay(type, message) {
        showTypingIndicator();

        setTimeout(() => {
            hideTypingIndicator();
            appendMessage(type, message);
        }, 2000); // 2-second delay before showing the actual message
    }
});

function appendMessage(type, message) {
    const chatBody = document.querySelector('.livechat-body');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;

    messageElement.innerHTML = `
        <div class="content">
            <div class="body" dir="auto">
                <div class="message-body">${message}</div>
            </div>
        </div>
    `;
    chatBody.appendChild(messageElement);
}

function clearChat() {
    const chatBody = document.querySelector('.livechat-body');
    chatBody.innerHTML = '';
    appendMessage('received', 'Hello! Please enter the product name for information.');
}
