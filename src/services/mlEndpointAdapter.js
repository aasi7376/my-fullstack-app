// src/services/mlEndpointAdapter.js
/**
 * This adapter maps the frontend service endpoints to the actual backend endpoints
 * It should be imported and used by mlService.js and bktService.js
 */

// Define the mapping of expected endpoints to actual endpoints
const endpointMapping = {
  // Game Interaction mappings
  '/api/game-interaction': '/api/ml/interaction',
  
  // Performance mappings
  '/api/performance': '/api/ml/progress',
  '/api/performance/:studentId/:gameId': '/api/ml/performance/:studentId/:gameId',
  '/api/performance/:studentId/:gameId/difficulty': '/api/ml/settings/:studentId/:gameId',
  
  // Knowledge State mappings
  '/api/knowledge-state/:studentId/:skillId': '/api/ml/skill/:studentId/:skillId',
  '/api/knowledge-state': '/api/ml/skill',
  '/api/knowledge-state/observation': '/api/ml/skill-observation',
  
  // Learning Path mappings
  '/api/learning-path/:studentId': '/api/ml/learning-path/:studentId',
};

/**
 * Maps a requested endpoint to the actual backend endpoint
 * @param {string} endpoint - The endpoint requested by the frontend service
 * @param {Object} params - Parameters to replace in the endpoint
 * @returns {string} The mapped endpoint
 */
const mapEndpoint = (endpoint, params = {}) => {
  // Start with the requested endpoint
  let mappedEndpoint = endpoint;
  
  // Check if this endpoint has a mapping
  if (endpointMapping[endpoint]) {
    mappedEndpoint = endpointMapping[endpoint];
  } else {
    // Try to match a parameterized endpoint
    for (const [key, value] of Object.entries(endpointMapping)) {
      // Convert the endpoint pattern to a regex
      const pattern = key.replace(/:[^\/]+/g, '([^/]+)');
      const regex = new RegExp(`^${pattern}$`);
      
      if (regex.test(endpoint)) {
        // Extract parameter values from the endpoint
        const matches = endpoint.match(regex);
        if (matches && matches.length > 1) {
          // Start with the mapped endpoint
          let result = value;
          
          // Extract parameter names from the pattern
          const paramNames = key.match(/:[^\/]+/g) || [];
          
          // Replace parameters in the mapped endpoint
          paramNames.forEach((param, index) => {
            const paramName = param.substring(1); // Remove the : prefix
            const paramValue = matches[index + 1];
            result = result.replace(`:${paramName}`, paramValue);
          });
          
          mappedEndpoint = result;
          break;
        }
      }
    }
  }
  
  // Replace any remaining parameters
  for (const [key, value] of Object.entries(params)) {
    mappedEndpoint = mappedEndpoint.replace(`:${key}`, value);
  }
  
  console.log(`Mapped endpoint: ${endpoint} → ${mappedEndpoint}`);
  return mappedEndpoint;
};

/**
 * Middleware for API calls that maps endpoints and formats data
 * @param {string} endpoint - The endpoint to call
 * @param {Object} data - The data to send
 * @param {string} method - The HTTP method
 * @returns {Promise<Object>} The API response
 */
const debugApiCall = async (endpoint, data = null, method = 'GET') => {
  console.log(`Original API Call to ${endpoint}`);
  console.log('Request data:', data);
  
  // Map the endpoint to the actual backend endpoint
  const mappedEndpoint = mapEndpoint(endpoint);
  
  try {
    // Use the mapped endpoint for the API call
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    const url = `${baseUrl}${mappedEndpoint}`;
    
    // Get token directly from localStorage
    const token = localStorage.getItem('token');
    
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      // Add body for POST/PUT requests
      ...(data && method !== 'GET' ? { body: JSON.stringify(data) } : {})
    };
    
    console.log('Making request to:', url);
    console.log('Request options:', options);
    
    const response = await fetch(url, options);
    console.log('Response status:', response.status);
    
    // Check if response is ok (status in the range 200-299)
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`API error: ${response.status} ${errorText}`);
    }
    
    const result = await response.json();
    console.log('Response data:', result);
    
    // If the API returns data in a nested format, extract it
    return result.data || result;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

module.exports = {
  mapEndpoint,
  debugApiCall
};