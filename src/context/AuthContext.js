// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

// Create the auth context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state - check if user is already logged in
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (api.isAuthenticated()) {
          console.log('AuthContext: Token found, fetching user data...');
          const response = await api.getCurrentUser();
          
          if (response.success) {
            console.log('AuthContext: User authenticated');
            setUser(response.data);
          } else {
            console.log('AuthContext: Invalid token, logging out');
            api.logout();
          }
        }
      } catch (error) {
        console.error('AuthContext: Authentication error', error);
        api.logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Register a new user
  const register = async (userData) => {
    setError(null);
    try {
      const response = await api.register(userData);
      
      if (response.success) {
        setUser(response.user);
      }
      
      return response;
    } catch (error) {
      setError(api.handleError(error));
      return { success: false, error: api.handleError(error) };
    }
  };

  // Login user
  const login = async (credentials) => {
    setError(null);
    try {
      const response = await api.login(credentials);
      
      if (response.success) {
        setUser(response.user);
      }
      
      return response;
    } catch (error) {
      setError(api.handleError(error));
      return { success: false, error: api.handleError(error) };
    }
  };

  // Update user profile - supports FormData for file uploads
  const updateProfile = async (userData) => {
    setError(null);
    try {
      const response = await api.updateProfile(userData);
      
      if (response.success) {
        setUser(prevUser => ({
          ...prevUser,
          ...response.data
        }));
      }
      
      return response;
    } catch (error) {
      setError(api.handleError(error));
      return { success: false, error: api.handleError(error) };
    }
  };

  // Refresh user data from the server
  const refreshUserData = async () => {
    try {
      const response = await api.getCurrentUser();
      
      if (response.success) {
        setUser(response.data);
      }
      
      return response;
    } catch (error) {
      console.error('Refresh user data error:', error);
      return { success: false, error: api.handleError(error) };
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    setError(null);
    try {
      const response = await api.changePassword(currentPassword, newPassword);
      return response;
    } catch (error) {
      setError(api.handleError(error));
      return { success: false, error: api.handleError(error) };
    }
  };

  // Delete account
  const deleteAccount = async () => {
    setError(null);
    try {
      const response = await api.deleteAccount();
      
      if (response.success) {
        setUser(null);
      }
      
      return response;
    } catch (error) {
      setError(api.handleError(error));
      return { success: false, error: api.handleError(error) };
    }
  };

  // Logout user
  const logout = () => {
    api.logout();
    setUser(null);
    return { success: true };
  };

  // Debug auth state - get detailed information about the current auth state
  const debugAuth = () => {
    // Get token from localStorage (similar to how your API service does it)
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    // Parse stored user data
    let parsedStoredUser = null;
    try {
      parsedStoredUser = storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      // Handle JSON parse error
    }
    
    return {
      // Context state
      contextUser: user,
      contextLoading: loading,
      contextError: error,
      
      // localStorage state
      hasToken: !!token,
      token: token ? `${token.substring(0, 10)}...` : null, // Show first 10 chars only for security
      storedUser: parsedStoredUser,
      
      // API state
      apiAuthenticated: api.isAuthenticated(),
      
      // Derived state
      isAuthenticated: !!user,
      syncStatus: JSON.stringify(user) === storedUser ? 'in-sync' : 'out-of-sync',
      
      // Timestamps
      debugTimestamp: new Date().toISOString()
    };
  };

  // Context value
  const contextValue = {
    user,
    loading,
    error,
    register,
    login,
    updateProfile,
    refreshUserData, // Add the refreshUserData function to the context
    changePassword,
    deleteAccount,
    logout,
    debugAuth,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;