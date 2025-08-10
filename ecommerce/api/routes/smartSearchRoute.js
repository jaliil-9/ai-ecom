const { GoogleGenerativeAI } = require('@google/generative-ai');
const express = require('express');
const router = express.Router();

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Test endpoint
router.get('/smart-search/test', (req, res) => {
    res.json({ message: 'Smart search route is working' });
});

// Smart search endpoint
router.post('/smart-search', async (req, res) => {
    try {
        const { query } = req.body;

        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Query is required'
            });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        const prompt = `Convert this search query into a JSON filter object.
            Available filters are: category, maxPrice, minPrice, brand, color.
            Example: "show me shoes under $80" becomes {"category": "shoes", "maxPrice": 80}
            Example: "find black Nike products" becomes {"brand": "Nike", "color": "black"}
            Respond only with the JSON object, no additional text.
            
            Query: ${query}`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        
        // Clean up the response
        text = text.replace(/```json\s*|\s*```/g, '').trim();
        if (text.includes('{')) {
            text = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
        }

        const structuredQuery = JSON.parse(text);

        res.status(200).json({
            success: true,
            filters: structuredQuery
        });

    } catch (error) {
        console.error('Smart search error:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing smart search query'
        });
    }
});

module.exports = router;
