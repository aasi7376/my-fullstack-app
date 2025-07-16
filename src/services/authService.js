// src/services/authService.js - Enhanced authentication service
import axios from 'axios';
import authManager from '../utils/authManager';

// API configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const TOKEN_REFRESH_THRESHOLD = 60 * 60; // 1 hour in seconds

// Create axios instance for auth requests (without interceptors)
const authAxios = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Create axios instance for authenticated requests
const apiAxios = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to add auth headers
apiAxios.interceptors.request.use(
  async (config) => {
    // Check if token needs refresh
    await checkTokenExpiration();
    
    // Add auth headers
    const headers = authManager.getAuthHeaders();
    config.headers = {
      ...config.headers,
      ...headers
    };
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle authentication errors
apiAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If response is 401 Unauthorized and not a retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // If token is expired, try to refresh
      if (authManager.isTokenExpired()) {
        try {
          // Try refreshing token
          const refreshed = await refreshToken();
          
          if (refreshed) {
            // Retry the original request with new token
            const headers = authManager.getAuthHeaders();
            originalRequest.headers = {
              ...originalRequest.headers,
              ...headers
            };
            
            return apiAxios(originalRequest);
          }
        } catch (refreshError) {
          console.error('[AuthService] Token refresh failed:', refreshError);
        }
      }
      
      // If we reached here, refresh failed or wasn't attempted
      // Dispatch session expired event
      const event = new CustomEvent('session-expired', {
        detail: { message: 'Your session has expired. Please log in again.' }
      });
      window.dispatchEvent(event);
      
      // Clear auth data
      authManager.clearAuth();
    }
    
    return Promise.reject(error);
  }
);

/**
 * Check if token is about to expire and refresh if needed
 */
const checkTokenExpiration = async () => {
  const expiration = authManager.getTokenExpiration();
  
  // If no expiration info or not authenticated, do nothing
  if (!expiration || !authManager.isAuthenticated()) return false;
  
  // If token is expired, try to refresh
  if (expiration.isExpired) {
    return await refreshToken();
  }
  
  // If token is about to expire (within threshold), try to refresh
  if (expiration.timeRemaining < TOKEN_REFRESH_THRESHOLD) {
    return await refreshToken();
  }
  
  return false;
};

/**
 * Refresh token
 * @returns {Promise<boolean>} True if token was refreshed
 */
const refreshToken = async () => {
  try {
    // Get refresh token
    const refreshToken = authManager.getRefreshToken();
    
    // If no refresh token, use token generation endpoint
    if (!refreshToken) {
      // Use token generation endpoint
      const user = authManager.getUser();
      if (!user || !user.id) return false;
      
      const response = await authAxios.post('/dev/generate-token', {
        id: user.id,
        role: user.role,
        email: user.email,
        name: user.name
      });
      
      if (response.data.token) {
        // Update token
        authManager.setAuth({
          token: response.data.token,
          user: authManager.getUser() // Keep existing user data
        });
        
        console.log('[AuthService] Token refreshed using dev endpoint');
        return true;
      }
    } else {
      // Use refresh token endpoint (if implemented)
      const response = await authAxios.post('/auth/refresh-token', {
        refreshToken
      });
      
      if (response.data.token) {
        // Update tokens
        authManager.setAuth({
          token: response.data.token,
          refreshToken: response.data.refreshToken,
          user: authManager.getUser() // Keep existing user data
        });
        
        console.log('[AuthService] Token refreshed using refresh token');
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('[AuthService] Token refresh error:', error);
    return false;
  }
};

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} role - User role
 * @returns {Promise<Object>} Login result
 */
const login = async (email, password, role = null) => {
  try {
    console.log('[AuthService] Login attempt:', { email, role });
    
    // Prepare login data
    const loginData = { email, password };
    if (role) loginData.role = role;
    
    // Make login request
    const response = await authAxios.post('/auth/login', loginData);
    
    // Check response
    if (response.data.success && response.data.token) {
      // Store auth data
      authManager.setAuth({
        token: response.data.token,
        user: response.data.user
      });
      
      console.log('[AuthService] Login successful');
      
      return {
        success: true,
        user: response.data.user,
        token: response.data.token,
        message: response.data.message || 'Login successful'
      };
    } else {
      throw new Error(response.data.message || 'Login failed');
    }
  } catch (error) {
    console.error('[AuthService] Login error:', error);
    
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
};

/**
 * Register user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Registration result
 */
const register = async (userData) => {
  try {
    console.log('[AuthService] Registration attempt:', { 
      email: userData.email, 
      role: userData.role 
    });
    
    // Make registration request
    const response = await authAxios.post('/auth/register', userData);
    
    // Check response
    if (response.data.success) {
      console.log('[AuthService] Registration successful');
      
      // If auto-login (token provided), store auth data
      if (response.data.token) {
        authManager.setAuth({
          token: response.data.token,
          user: response.data.user
        });
      }
      
      return {
        success: true,
        message: response.data.message || 'Registration successful',
        user: response.data.user,
        token: response.data.token
      };
    } else {
      throw new Error(response.data.message || 'Registration failed');
    }
  } catch (error) {
    console.error('[AuthService] Registration error:', error);
    
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
};

/**
 * Logout user
 * @returns {Promise<Object>} Logout result
 */
const logout = async () => {
  try {
    // Try to call logout endpoint if authenticated
    if (authManager.isAuthenticated()) {
      try {
        await apiAxios.post('/auth/logout');
      } catch (error) {
        // Ignore errors from logout endpoint
        console.warn('[AuthService] Error calling logout endpoint:', error.message);
      }
    }
    
    // Always clear auth data
    authManager.clearAuth();
    
    return {
      success: true,
      message: 'Logged out successfully'
    };
  } catch (error) {
    console.error('[AuthService] Logout error:', error);
    
    // Still clear auth data
    authManager.clearAuth();
    
    return {
      success: true,
      message: 'Logged out successfully'
    };
  }
};

/**
 * Get current user profile from server
 * @returns {Promise<Object>} User profile
 */
const getCurrentUser = async () => {
  try {
    // Check if authenticated
    if (!authManager.isAuthenticated()) {
      return {
        success: false,
        error: 'Not authenticated'
      };
    }
    
    // Get user profile
    const response = await apiAxios.get('/auth/user');
    
    return {
      success: true,
      user: response.data.user,
      profile: response.data.profile
    };
  } catch (error) {
    console.error('[AuthService] Get current user error:', error);
    
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
};

/**
 * Debug authentication state
 */
const debugAuth = () => {
  return authManager.debug();
};

/**
 * Create test token for debugging
 * @param {Object} userData - User data for token
 * @returns {Promise<Object>} Token result
 */
const createTestToken = async (userData = null) => {
  try {
    // If no user data, use current user
    if (!userData) {
      userData = authManager.getUser();
      
      // If no user, use default
      if (!userData) {
        userData = {
          id: 'test_user_id',
          role: 'admin',
          email: 'test@example.com',
          name: 'Test User'
        };
      }
    }
    
    // Ensure ID is present
    if (!userData.id) {
      return {
        success: false,
        error: 'User ID is required'
      };
    }
    
    // Make request to token generator endpoint
    const response = await authAxios.post('/dev/generate-token', userData);
    
    // Store token
    if (response.data.token) {
      authManager.setAuth({
        token: response.data.token,
        user: userData
      });
      
      console.log('[AuthService] Test token created and stored');
    }
    
    return {
      success: true,
      token: response.data.token,
      payload: response.data.payload
    };
  } catch (error) {
    console.error('[AuthService] Create test token error:', error);
    
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
};

// Export service
const authService = {
  login,
  register,
  logout,
  getCurrentUser,
  refreshToken,
  checkTokenExpiration,
  debugAuth,
  createTestToken,
  // Expose axios instances for direct use
  authAxios,
  apiAxios
};

export default authService;