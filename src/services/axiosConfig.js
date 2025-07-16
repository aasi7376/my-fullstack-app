import axios from 'axios';

// Create custom axios instance with base URL
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to include auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add it to the headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('[Axios] Request error interceptor:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => {
    // Successful response, return it
    return response;
  },
  (error) => {
    // Get original request
    const originalRequest = error.config;
    
    // Handle specific error cases
    if (error.response) {
      // Server responded with an error status code
      const { status, data } = error.response;
      
      // Handle unauthorized errors (401)
      if (status === 401 && !originalRequest._retry) {
        // If token expired and not already retrying
        if (data.error === 'Token expired' || data.error.includes('expired')) {
          // Mark request as retried to prevent infinite loop
          originalRequest._retry = true;
          
          // Clear invalid token
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          
          // Redirect to login page
          window.location.href = '/login?session=expired';
          
          return Promise.reject(
            new Error('Your session has expired. Please login again.')
          );
        }
      }
      
      // Handle forbidden errors (403)
      if (status === 403) {
        console.error('[Axios] Forbidden access:', data.error);
      }
      
      // Handle not found errors (404)
      if (status === 404) {
        console.error('[Axios] Resource not found:', data.error);
      }
      
      // Handle validation errors (400)
      if (status === 400 && data.errors) {
        console.error('[Axios] Validation errors:', data.errors);
        
        // Format validation errors into a single message
        const errorMessages = data.errors.map(err => err.msg || err.message).join(', ');
        error.message = errorMessages;
      }
      
      // Handle server errors (500)
      if (status >= 500) {
        console.error('[Axios] Server error:', data.error || 'Unknown server error');
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('[Axios] No response received:', error.request);
      error.message = 'No response from server. Please check your internet connection.';
    } else {
      // Error in setting up the request
      console.error('[Axios] Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;