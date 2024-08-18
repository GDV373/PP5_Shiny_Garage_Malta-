document.addEventListener('DOMContentLoaded', () => {
    const chatBody = document.querySelector('.livechat-body');
    const chatButton = document.getElementById('btnchatclick');
    const chatPopup = document.querySelector('.livechat-room');
    const closeButton = document.querySelector('.livechat-header .close');
    const inputField = document.querySelector('.message-input');
    const sendButton = document.querySelector('.send-button');

    // Initialize chat with a greeting message
    appendMessage('received', 'Hello! How can I assist you today?');

    // Show chat popup
    chatButton.addEventListener('click', () => {
        chatPopup.classList.add('open');
    });

    // Hide chat popup and clear chat
    closeButton.addEventListener('click', () => {
        chatPopup.classList.remove('open');
        clearChat();
    });

    // Send message handler
    function sendMessage() {
        const messageText = inputField.value.trim();
        if (!messageText) return; // Ignore empty messages

        appendMessage('sent', messageText);

        fetch(`/chatbot/get_response/?user_input=${encodeURIComponent(messageText)}`)
            .then(response => response.json())
            .then(data => {
                appendMessage('received', data.response || "I'm sorry, I didn't understand that. Could you please rephrase?");
                chatBody.scrollTop = chatBody.scrollHeight; // Scroll to the bottom
            })
            .catch(error => {
                console.error('Fetch error:', error);
                appendMessage('received', "I'm sorry, there was an error processing your request. Please try again.");
            });

        inputField.value = ''; // Clear the input field
    }

    // Event listener for the send button
    sendButton.addEventListener('click', sendMessage);

    // Event listener for the Enter key
    inputField.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent default form submission
            sendMessage();
        }
    });

    // Append a message to the chat body
    function appendMessage(type, message) {
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

    // Clear the chat body
    function clearChat() {
        chatBody.innerHTML = '';
        appendMessage('received', 'Hello! How can I assist you today? Please enter the product name for information.');
    }
});
