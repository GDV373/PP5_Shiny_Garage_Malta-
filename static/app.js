document.addEventListener('DOMContentLoaded', () => {
    const chatBody = document.querySelector('.livechat-body');
    appendMessage('received', 'Hello! How can I assist you today? Please enter the product name for information.');

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

    function sendMessage() {
        var messageText = inputField.value.trim().toLowerCase();

        // Define lists for different types of messages
        const greetings = ['hello', 'hi', 'hola', 'hey', 'howdy', 'greetings'];
        const helpRequests = ['need help', 'i need help', 'assist me', 'can you help me', 'help', 'please help me', 'can you assist me'];

        if (greetings.includes(messageText)) {
            appendMessage('sent', inputField.value);
            appendMessage('received', 'Hello! How can I assist you today? Please enter the product name for information.');
            inputField.value = ''; // Clear the input field after sending the greeting
        } else if (helpRequests.includes(messageText)) {
            appendMessage('sent', inputField.value);
            appendMessage('received', "Sure! I'm here to help. Please tell me the product name or describe what you're looking for.");
            inputField.value = ''; // Clear the input field after sending the help response
        } else if (messageText) {
            appendMessage('sent', inputField.value);

            fetch(`chatbot/?product_name=${encodeURIComponent(messageText)}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok ' + response.statusText);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log("Data received:", data); // Debugging line
                    if (data.products && data.products.length > 0) {
                        var productList = data.products.map(product => `
                            Name: ${product.name || 'N/A'}<br>
                            Description: ${product.description || 'No description available'}<br>
                            Price: €${product.price || 'N/A'}
                        `).join('<br><br>');
                        appendMessage('received', `Here is the information you requested:<br>${productList}<br>Is there anything else I can help you with?`);
                    } else {
                        appendMessage('received', "I'm terribly sorry, but I couldn't find any products matching your request. If you need further assistance, please feel free to <a href='/contact'>contact us</a>. I'm here to help in any way I can.");
                    }

                    chatBody.scrollTop = chatBody.scrollHeight;
                })
                .catch(error => {
                    console.error('Fetch error:', error); // Enhanced error logging
                    appendMessage('received', "I'm sorry, but I couldn't process your request at this moment. Please try again or <a href='/contact'>contact us</a> for more assistance.");
                });

            inputField.value = ''; // Clear the input field after sending the message
        } else {
            appendMessage('received', "I'm sorry, but I couldn't understand your request. Could you please rephrase it? If you need further help, don't hesitate to <a href='/contact'>contact us</a>. I'm here to assist you.");
        }
    }

    // Event listener for the send button
    sendButton.addEventListener('click', sendMessage);

    // Event listener for the Enter key
    inputField.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent default form submission
            sendMessage();
        }
    });
});

function appendMessage(type, message) {
    var chatBody = document.querySelector('.livechat-body');
    var messageElement = document.createElement('div');
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
    appendMessage('received', 'Hello! How can I assist you today? Please enter the product name for information.');
}
