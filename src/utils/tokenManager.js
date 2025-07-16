// src/utils/tokenManager.js
import authManager from './authManager';

// This is a wrapper around authManager to maintain backward compatibility
const tokenManager = {
  getToken: () => authManager.getToken(),
  setToken: (token) => authManager.setAuth({ token }),
  clearToken: () => authManager.clearAuth(),
  isAuthenticated: () => authManager.isAuthenticated(),
  
  // Debug method for troubleshooting
  debugToken: () => {
    const token = authManager.getToken();
    const isExpired = authManager.isTokenExpired();
    console.log('[TokenManager] Token debug:', {
      exists: !!token,
      isExpired,
      token: token ? `${token.substring(0, 15)}...` : null
    });
  }
};

export default tokenManager;