# AI-Enhanced E-commerce Product Search

## How to Run the App

1. Clone the repository
2. Install dependencies:
```bash
cd ecommerce
npm install --legacy-peer-deps
```
3. Configure environment variable in `.env`:
```
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
```
4. Start the application:
```bash
npm start
```
The app will run on http://localhost:3000

## Technologies and Dependencies

1. Frontend Stack:
   - React.js: Core frontend framework
   - Bootstrap: UI styling and responsive design

2. AI Integration:
   - Google Gemini Pro: Natural language processing
   - Environment Variables: API key management

3. Components:
   - CatalogViewer.jsx: Smart product display
   - SearchBar.jsx: Natural language input

## Notable Implementation Details

1. Key Functions:
   - processNaturalLanguageQuery(): Query to filter conversion
   - applySmartFilters(): Dynamic product filtering

2. Security Considerations:
   - Frontend-only implementation for demo purposes
   - API key management via environment variables

3. Performance Optimizations:
   - Debounced search input
   - Cached filter results

## Tools and Libraries Used

 **Gemini Integration**
   - Uses Google's Generative AI (Gemini)
   - Converts natural language to JSON filters
   - Handles error cases and response formatting

 **CatalogViewer Component**
   - Provides search interface
   - Displays filtered products
   - Handles loading states and errors

 **Product Filtering**
   - Applies AI-generated filters to product list
   - Supports multiple filter criteria:
     - Category
     - Price range
     - Brand
     - Color

## Setup

1. Install dependencies:
   ```bash
   npm install @google/generative-ai
   ```

2. Configure environment variables:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. Start the application:
   ```bash
   npm start
   ```

## API Response Format

```javascript
{
  success: boolean,
  filters: {
    category?: string,
    maxPrice?: number,
    minPrice?: number,
    brand?: string,
    color?: string
  }
}
```

## Security Considerations

- API key is stored securely on the .env file
- Input validation for search queries
- Error handling for API failures
- Rate limiting considerations

## Error Handling

- Invalid queries
- API failures
- Malformed responses
- Network issues

## Future Improvements

1. Cache common search patterns
2. Implement query suggestions
3. Add support for more filter types
4. Enhance response accuracy
5. Add analytics for search patterns
