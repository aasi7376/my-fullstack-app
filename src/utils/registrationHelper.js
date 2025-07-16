// src/utils/registrationHelper.js
/**
 * Registration Helper - Specialized utilities for handling registration
 * This can be used independently of the auth context for debugging
 */

import axiosWithAuth from './axiosWithAuth';
import authManager from './authManager';

// Debug mode
const DEBUG = process.env.NODE_ENV === 'development';

// Log debug messages
const debug = (message, data = null) => {
  if (DEBUG) {
    if (data) {
      console.log(`[RegistrationHelper] ${message}`, data);
    } else {
      console.log(`[RegistrationHelper] ${message}`);
    }
  }
};

/**
 * Register user with direct API approach
 * This bypasses the AuthContext for troubleshooting
 */
const registerUser = async (userData) => {
  debug('Starting direct registration with data:', {
    ...userData,
    password: userData.password ? '[REDACTED]' : undefined
  });
  
  try {
    // Make sure we have required fields
    if (!userData.name || !userData.email || !userData.password || !userData.role) {
      throw new Error('Missing required fields for registration');
    }
    
    // Try both with and without /api prefix if needed
    let response;
    
    try {
      // First try with explicit /api prefix
      debug('Attempting registration with /api prefix');
      response = await axiosWithAuth.post('/api/auth/register', userData);
    } catch (error) {
      debug('First attempt failed:', error.message);
      
      // If first attempt fails, try without /api prefix
      debug('Attempting registration without /api prefix');
      response = await axiosWithAuth.post('/auth/register', userData);
    }
    
    debug('Registration successful, response:', {
      success: response.data?.success,
      hasToken: !!response.data?.token,
      hasUser: !!response.data?.user
    });
    
    // Auto-login if token and user are returned
    if (response.data?.token && response.data?.user) {
      debug('Auto-login from registration response');
      
      // Store auth data
      authManager.setAuth({
        token: response.data.token,
        user: response.data.user
      });
    }
    
    return {
      success: true,
      data: response.data,
      autoLogin: !!response.data?.token && !!response.data?.user
    };
  } catch (error) {
    debug('Registration failed:', error);
    
    // Extract error message
    const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error || 
                         error.message || 
                         'Registration failed';
    
    return {
      success: false,
      error: errorMessage,
      details: error.response?.data || null
    };
  }
};

/**
 * Test registration endpoint for direct registration to a custom endpoint
 * This is useful for testing server implementations
 */
const testRegistration = async (userData, endpoint = '/api/test-register') => {
  debug(`Testing registration at endpoint: ${endpoint}`);
  
  try {
    const response = await axiosWithAuth.post(endpoint, userData);
    
    debug('Test registration successful:', {
      success: response.data?.success,
      hasToken: !!response.data?.token,
      hasUser: !!response.data?.user
    });
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    debug('Test registration failed:', error);
    
    return {
      success: false,
      error: error.response?.data?.message || error.message,
      details: error.response?.data || null
    };
  }
};

/**
 * Debug user registration state
 * Checks localStorage, token validity, and decoded data
 */
const debugRegistrationState = () => {
  try {
    const token = authManager.getToken();
    const user = authManager.getUser();
    const decodedToken = token ? authManager.decodeToken(token) : null;
    const expiryInfo = token ? authManager.getTokenExpiryInfo() : null;
    
    const state = {
      hasToken: !!token,
      hasUser: !!user,
      tokenFirstChars: token ? `${token.substring(0, 15)}...` : null,
      decodedToken: decodedToken ? {
        user: decodedToken.user,
        exp: decodedToken.exp ? new Date(decodedToken.exp * 1000).toISOString() : null,
        iat: decodedToken.iat ? new Date(decodedToken.iat * 1000).toISOString() : null
      } : null,
      user: user ? {
        id: user.id || user._id,
        name: user.name,
        email: user.email,
        role: user.role
      } : null,
      expiryInfo: expiryInfo ? {
        expiryDate: expiryInfo.expiryDate.toISOString(),
        remainingSeconds: expiryInfo.remainingSeconds,
        isExpired: expiryInfo.isExpired
      } : null
    };
    
    console.log('=== REGISTRATION STATE DEBUG ===');
    console.table(state);
    
    if (state.hasToken && state.hasUser) {
      console.log('✅ Authentication state is complete');
    } else if (state.hasToken && !state.hasUser) {
      console.log('⚠️ Token exists but user data is missing');
    } else if (!state.hasToken && state.hasUser) {
      console.log('⚠️ User data exists but token is missing');
    } else {
      console.log('❌ No authentication data found');
    }
    
    if (state.expiryInfo?.isExpired) {
      console.log('⚠️ Token is expired');
    }
    
    return state;
  } catch (error) {
    console.error('Error debugging registration state:', error);
    return { error: error.message };
  }
};

/**
 * Emergency fix for registration issues
 * This can be used to manually fix auth state when something goes wrong
 */
const emergencyFixAuthState = (token, userData) => {
  try {
    if (!token || !userData) {
      console.error('Both token and userData are required for emergency fix');
      return false;
    }
    
    debug('Applying emergency fix to auth state');
    
    // Clear existing data first
    authManager.clearAuth();
    
    // Set new auth data
    const success = authManager.setAuth({
      token,
      user: userData
    });
    
    if (success) {
      debug('Emergency fix applied successfully');
      return true;
    } else {
      debug('Emergency fix failed');
      return false;
    }
  } catch (error) {
    debug('Error applying emergency fix:', error);
    return false;
  }
};

// Export all helpers
const registrationHelper = {
  registerUser,
  testRegistration,
  debugRegistrationState,
  emergencyFixAuthState
};

export default registrationHelper;