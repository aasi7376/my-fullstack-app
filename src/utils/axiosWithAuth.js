// axiosWithAuth.js
import axios from 'axios';

const axiosWithAuth = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to handle authentication
axiosWithAuth.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = localStorage.getItem('token');
    
    // Block requests to specific endpoints to prevent 404 errors
    if (
      config.url === '/simulations' || 
      config.url === '/questions' ||
      config.url.includes('/simulations') || 
      config.url.includes('/questions')
    ) {
      console.log(`Blocked API request to: ${config.url}`);
      // Cancel the request
      return {
        ...config,
        cancelToken: new axios.CancelToken((cancel) => 
          cancel(`Request to ${config.url} was blocked`)
        )
      };
    }
    
    // If token exists, add it to the authorization header
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
axiosWithAuth.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login?expired=true';
    }
    
    return Promise.reject(error);
  }
);

export default axiosWithAuth;