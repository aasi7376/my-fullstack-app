// src/utils/authManager.js - Memory-Safe Version
import { jwtDecode } from 'jwt-decode';

const AUTH_TOKEN_KEY = 'token';
const AUTH_USER_KEY = 'user';
const AUTH_REFRESH_TOKEN_KEY = 'refreshToken';

// In-memory cache to reduce localStorage reads
let tokenCache = null;
let userCache = null;
let refreshTokenCache = null;

/**
 * Enhanced Auth Manager with improved token handling and memory safety
 */
const authManager = {
  /**
   * Set authentication data (token and user)
   * @param {Object} authData - Authentication data
   * @param {string} authData.token - JWT token
   * @param {Object} authData.user - User data
   * @param {string} [authData.refreshToken] - Refresh token (optional)
   */
  setAuth: (authData) => {
    if (!authData) return false;
    
    try {
      // Store token - ensure it doesn't have Bearer prefix
      if (authData.token) {
        const token = authData.token.startsWith('Bearer ') 
          ? authData.token.slice(7) 
          : authData.token;
        
        // Update in-memory cache first
        tokenCache = token;
        
        // Then update localStorage (wrapped in try-catch to handle quota errors)
        try {
          localStorage.setItem(AUTH_TOKEN_KEY, token);
        } catch (storageError) {
          console.warn('[AuthManager] LocalStorage error when storing token:', storageError);
          // Continue execution - we still have the in-memory cache
        }
        
        console.log('[AuthManager] Token stored successfully');
      }
      
      // Store user data
      if (authData.user) {
        // Update in-memory cache
        userCache = authData.user;
        
        // Then update localStorage
        try {
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authData.user));
        } catch (storageError) {
          console.warn('[AuthManager] LocalStorage error when storing user:', storageError);
        }
        
        console.log('[AuthManager] User data stored successfully');
      }
      
      // Store refresh token if provided
      if (authData.refreshToken) {
        // Update in-memory cache
        refreshTokenCache = authData.refreshToken;
        
        // Then update localStorage
        try {
          localStorage.setItem(AUTH_REFRESH_TOKEN_KEY, authData.refreshToken);
        } catch (storageError) {
          console.warn('[AuthManager] LocalStorage error when storing refresh token:', storageError);
        }
        
        console.log('[AuthManager] Refresh token stored successfully');
      }
      
      return true;
    } catch (error) {
      console.error('[AuthManager] Error setting auth data:', error);
      return false;
    }
  },
  
  /**
   * Get authentication token
   * @returns {string|null} JWT token
   */
  getToken: () => {
    try {
      // Return from cache if available
      if (tokenCache !== null) {
        return tokenCache;
      }
      
      // Otherwise retrieve from localStorage and update cache
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      tokenCache = token;
      return token;
    } catch (error) {
      console.error('[AuthManager] Error getting token:', error);
      return tokenCache || null; // Fall back to cache if localStorage fails
    }
  },
  
  /**
   * Get refresh token
   * @returns {string|null} Refresh token
   */
  getRefreshToken: () => {
    try {
      // Return from cache if available
      if (refreshTokenCache !== null) {
        return refreshTokenCache;
      }
      
      // Otherwise retrieve from localStorage and update cache
      const refreshToken = localStorage.getItem(AUTH_REFRESH_TOKEN_KEY);
      refreshTokenCache = refreshToken;
      return refreshToken;
    } catch (error) {
      console.error('[AuthManager] Error getting refresh token:', error);
      return refreshTokenCache || null; // Fall back to cache if localStorage fails
    }
  },
  
  /**
   * Get user data
   * @returns {Object|null} User data
   */
  getUser: () => {
    try {
      // Return from cache if available
      if (userCache !== null) {
        return userCache;
      }
      
      // Otherwise retrieve from localStorage and update cache
      const userStr = localStorage.getItem(AUTH_USER_KEY);
      if (userStr) {
        const userData = JSON.parse(userStr);
        userCache = userData;
        return userData;
      }
      return null;
    } catch (error) {
      console.error('[AuthManager] Error getting user data:', error);
      return userCache || null; // Fall back to cache if localStorage fails
    }
  },
  
  /**
   * Clear all authentication data
   */
  clearAuth: () => {
    try {
      // Clear in-memory cache first
      tokenCache = null;
      userCache = null;
      refreshTokenCache = null;
      
      // Then clear localStorage
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
      localStorage.removeItem(AUTH_REFRESH_TOKEN_KEY);
      
      console.log('[AuthManager] Auth data cleared successfully');
      return true;
    } catch (error) {
      console.error('[AuthManager] Error clearing auth data:', error);
      return false;
    }
  },
  
  /**
   * Check if user is authenticated (has a token)
   * @returns {boolean} True if authenticated
   */
  isAuthenticated: () => {
    const token = authManager.getToken();
    if (!token) return false;
    
    // Check if token is expired
    return !authManager.isTokenExpired();
  },
  
  /**
   * Check if token is expired
   * @returns {boolean} True if token is expired or invalid
   */
  isTokenExpired: () => {
    try {
      const token = authManager.getToken();
      if (!token) return true;
      
      // Decode token
      const decoded = jwtDecode(token);
      
      // Check if token has exp claim
      if (!decoded.exp) return false;
      
      // Check if token is expired
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      console.error('[AuthManager] Error checking token expiration:', error);
      return true; // Assume expired if error
    }
  },
  
  /**
   * Get token expiration time
   * @returns {Object|null} Expiration info
   */
  getTokenExpiration: () => {
    try {
      const token = authManager.getToken();
      if (!token) return null;
      
      // Decode token - this could be memory intensive for large tokens
      // so we'll implement a simple cache
      const decoded = jwtDecode(token);
      
      // Check if token has exp claim
      if (!decoded.exp) return null;
      
      const currentTime = Date.now() / 1000;
      const timeRemaining = decoded.exp - currentTime;
      
      return {
        exp: decoded.exp,
        expDate: new Date(decoded.exp * 1000),
        timeRemaining: timeRemaining,
        isExpired: timeRemaining <= 0,
        expiresIn: {
          seconds: Math.max(0, Math.floor(timeRemaining)),
          minutes: Math.max(0, Math.floor(timeRemaining / 60)),
          hours: Math.max(0, Math.floor(timeRemaining / 3600)),
          days: Math.max(0, Math.floor(timeRemaining / 86400))
        }
      };
    } catch (error) {
      console.error('[AuthManager] Error getting token expiration:', error);
      return null;
    }
  },
  
  /**
   * Get authentication headers for API requests
   * @returns {Object} Headers object
   */
  getAuthHeaders: () => {
    const token = authManager.getToken();
    if (!token) return {};
    
    return {
      'Authorization': `Bearer ${token}`,
      'x-auth-token': token
    };
  },
  
  /**
   * Debug current authentication state
   * @returns {Object} Debug info
   */
  debug: () => {
    const token = authManager.getToken();
    const refreshToken = authManager.getRefreshToken();
    const user = authManager.getUser();
    const isAuthenticated = authManager.isAuthenticated();
    const tokenExpiration = authManager.getTokenExpiration();
    
    // Create a light version of debug info that won't log the full token
    const debugInfo = {
      isAuthenticated,
      hasToken: !!token,
      tokenFirstChars: token ? `${token.substring(0, 10)}...` : null,
      hasRefreshToken: !!refreshToken,
      refreshTokenFirstChars: refreshToken ? `${refreshToken.substring(0, 10)}...` : null,
      hasUser: !!user,
      tokenExpiration,
      // Only include non-sensitive user info
      user: user ? {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      } : null
    };
    
    console.log('[AuthManager] Debug Info:', debugInfo);
    
    return debugInfo;
  }
};

export default authManager;