require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
const apiKey = process.env.OPEN_API_KEY;  // Access your config variable

// Serve the frontend files
app.use(express.static('public'));
app.use(express.json());

// Endpoint to interact with ChatGPT
app.post('/call-gpt', (req, res) => {
    const userMessage = req.body.message;

    fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`  // Use the OPEN_API_KEY config variable
        },
        body: JSON.stringify({
            prompt: `User: ${userMessage}\nAI:`,
            max_tokens: 150,
            temperature: 0.7
        })
    })
    .then(response => response.json())
    .then(data => {
        res.json({ reply: data.choices[0].text.trim() });
    })
    .catch(error => {
        console.error('Error:', error);
        res.status(500).send('Something went wrong');
    });
});

// Endpoint to fetch product data
app.get('/products', (req, res) => {
    const productName = req.query.product_name.toLowerCase();

    const productsFilePath = path.join(__dirname, '/workspace/PP5_Shiny_Garage_Malta-/products/fixtures/products.json');
    const productsData = require(productsFilePath);

    const filteredProducts = productsData.products.filter(product => 
        product.name.toLowerCase().includes(productName)
    );

    if (filteredProducts.length > 0) {
        res.json({ products: filteredProducts });
    } else {
        res.json({ products: [] });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
