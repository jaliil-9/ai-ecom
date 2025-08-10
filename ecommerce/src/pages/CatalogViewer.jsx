import React, { useState } from 'react';
import productsData from '../data/catalog-products.json';
import { GoogleGenerativeAI } from '@google/generative-ai';

const CatalogViewer = () => {
  // Initialize Gemini API client
  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY || '');
  const products = productsData.products;
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [isLoading, setIsLoading] = useState(false);

  // Function to process natural language query through Groq
  const processNaturalLanguageQuery = async (query) => {
    setIsLoading(true);
    try {
      console.log('Starting search with query:', query);
      
      if (!process.env.REACT_APP_GEMINI_API_KEY) {
        throw new Error('Gemini API key is not configured. Please check your .env file.');
      }
      
      console.log('Sending request to Gemini API...');
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
      
      const prompt = `Convert this search query into a JSON filter object.
        Available filters are: category, maxPrice, minPrice, brand, color.
        Example: "show me shoes under $80" becomes {"category": "shoes", "maxPrice": 80}
        Example: "find black Nike products" becomes {"brand": "Nike", "color": "black"}
        Respond only with the JSON object, no additional text.
        
        Query: ${query}`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      
      // Clean up the response if it contains any extra text
      text = text.replace(/```json\s*|\s*```/g, '').trim();
      if (text.includes('{')) {
        text = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
      }

      console.log('Gemini response:', text);
      
      let structuredQuery;
      try {
        structuredQuery = JSON.parse(text);
        console.log('Parsed structured query:', structuredQuery);
        // Apply the structured query to filter products
        applyStructuredQuery(structuredQuery);
      } catch (error) {
        console.error('Error parsing structured query:', error);
        alert(`Failed to parse structured query: ${error.message}`);
      }
    } catch (error) {
      console.error('Error processing query:', error);
      alert(`Search failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to apply the structured query returned from LLM
  const applyStructuredQuery = (structuredQuery) => {
    const filtered = products.filter(product => {
      // Example structured query format:
      // { category: "shoes", maxPrice: 80, ... }
      let matches = true;
      
      if (structuredQuery.category) {
        matches = matches && product.category === structuredQuery.category;
      }
      if (structuredQuery.maxPrice) {
        matches = matches && product.price <= structuredQuery.maxPrice;
      }
      if (structuredQuery.minPrice) {
        matches = matches && product.price >= structuredQuery.minPrice;
      }
      if (structuredQuery.brand) {
        matches = matches && product.brand.toLowerCase() === structuredQuery.brand.toLowerCase();
      }
      if (structuredQuery.color) {
        matches = matches && product.color.toLowerCase() === structuredQuery.color.toLowerCase();
      }

      return matches;
    });

    setFilteredProducts(filtered);
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Handle search submission
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      processNaturalLanguageQuery(searchQuery);
    }
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">Smart Product Catalog</h1>
      
      {/* Search Form */}
      <form onSubmit={handleSearchSubmit} className="mb-4">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Try: 'show me shoes under $80' or 'find black accessories'"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button
            className="btn btn-primary"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {/* Products Grid */}
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {filteredProducts.map(product => (
          <div key={product.id} className="col">
            <div className="card h-100">
              <img
                src={product.image}
                className="card-img-top"
                alt={product.name}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{product.description}</p>
                <p className="card-text">
                  <small className="text-muted">
                    Brand: {product.brand} | Color: {product.color}
                  </small>
                </p>
                <p className="card-text">
                  <strong>${product.price.toFixed(2)}</strong>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results Message */}
      {filteredProducts.length === 0 && (
        <div className="alert alert-info mt-4">
          No products found matching your search criteria.
        </div>
      )}
    </div>
  );
};

export default CatalogViewer;
