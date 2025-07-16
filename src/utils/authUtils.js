// src/utils/authUtils.js
/**
 * Get authentication configuration for API requests
 * @returns {Object} Config object with headers
 */
export const getAuthConfig = () => {
  // Get the token from localStorage
  const token = localStorage.getItem('token');
  
  // Return config object with Authorization header if token exists
  return {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  };
};

/**
 * Check if the current user has admin role
 * @returns {Boolean} True if user is admin
 */
export const isAdmin = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    return user && user.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

/**
 * Get current authenticated user
 * @returns {Object|null} User object or null if not authenticated
 */
export const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Check if user is authenticated
 * @returns {Boolean} True if authenticated
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return !!token && !!user;
};

/**
 * Set authentication data after login
 * @param {Object} authData - Contains token and user data
 */
export const setAuth = (authData) => {
  if (authData.token) {
    localStorage.setItem('token', authData.token);
  }
  
  if (authData.user) {
    localStorage.setItem('user', JSON.stringify(authData.user));
  }
};

/**
 * Clear authentication data on logout
 */
export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};