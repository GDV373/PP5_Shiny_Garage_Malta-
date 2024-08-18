document.addEventListener('DOMContentLoaded', () => {
    const chatBody = document.querySelector('.livechat-body');
    const chatButton = document.getElementById('btnchatclick');
    const chatPopup = document.querySelector('.livechat-room');
    const closeButton = document.querySelector('.livechat-header .close');
    const inputField = document.querySelector('.message-input');
    const sendButton = document.querySelector('.send-button');

    let conversationHistory = [];

    function initializeChat() {
        appendMessage('received', 'Hello! I\'m your AI assistant. How can I help you today?');
    }

    function handleUserInput(userInput) {
        appendMessage('sent', userInput);
        conversationHistory.push({ role: 'user', content: userInput });

        // Simulate AI processing
        showTypingIndicator();
        setTimeout(() => {
            const aiResponse = generateAIResponse(userInput);
            appendMessage('received', aiResponse);
            conversationHistory.push({ role: 'assistant', content: aiResponse });
            hideTypingIndicator();
        }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
    }

    function generateAIResponse(userInput) {
        // This is where you'd integrate with a real AI model
        // For now, we'll use a simple keyword-based response system
        const lowerInput = userInput.toLowerCase();
        if (lowerInput.includes('product') || lowerInput.includes('item')) {
            return "I'd be happy to help you find product information. Could you please specify the name or type of product you're interested in?";
        } else if (lowerInput.includes('price') || lowerInput.includes('cost')) {
            return "Pricing information varies by product. Can you tell me which specific product you'd like the price for?";
        } else if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
            return "Hello! How can I assist you today?";
        } else {
            return "I'm not sure I understand. Could you please rephrase your question or provide more details?";
        }
    }

    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.textContent = 'AI is typing...';
        chatBody.appendChild(indicator);
    }

    function hideTypingIndicator() {
        const indicator = document.querySelector('.typing-indicator');
        if (indicator) indicator.remove();
    }

    function appendMessage(type, message) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.innerHTML = `
            <div class="content">
                <div class="body">
                    <div class="message-body">${message}</div>
                </div>
            </div>
        `;
        chatBody.appendChild(messageElement);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function clearChat() {
        chatBody.innerHTML = '';
        conversationHistory = [];
        initializeChat();
    }

    chatButton.addEventListener('click', () => chatPopup.classList.add('open'));
    closeButton.addEventListener('click', () => {
        chatPopup.classList.remove('open');
        clearChat();
    });

    sendButton.addEventListener('click', () => {
        const userInput = inputField.value.trim();
        if (userInput) {
            handleUserInput(userInput);
            inputField.value = '';
        }
    });

    inputField.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendButton.click();
        }
    });

    initializeChat();
});