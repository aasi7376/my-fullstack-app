import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    login, 
    isAuthenticated, 
    handleDebugAuth, 
    isTokenValid, 
    repairAuthState 
  } = useAuth();
  
  // Use ref to track if API check has been performed
  const apiCheckPerformed = useRef(false);

  // State for form data
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'admin' // Default role
  });

  // UI state
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [apiStatus, setApiStatus] = useState({ connected: true, message: 'Connected' });
  const [loginSuccess, setLoginSuccess] = useState(false);

  // If user is already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      // Check if token is valid before redirecting
      const token = localStorage.getItem('token');
      if (token && isTokenValid(token)) {
        console.log('[LoginForm] User is authenticated, redirecting to dashboard');
        showNotification('You are already logged in. Redirecting...', 'success');
        
        setTimeout(() => {
          const dashboardPath = `/${formData.role}/dashboard`;
          navigate(dashboardPath, { replace: true });
        }, 1000);
      } else {
        // Token is invalid but auth state thinks we're authenticated
        console.log('[LoginForm] Invalid auth state detected, repairing');
        repairAuthState();
      }
    }
  }, [isAuthenticated, formData.role, isTokenValid, repairAuthState, navigate]);

  // Pre-fill email if passed from registration
  useEffect(() => {
    if (location.state?.email) {
      setFormData(prev => ({
        ...prev,
        email: location.state.email,
        role: location.state.role || 'admin'
      }));
    }
    
    // Show success message if coming from registration
    if (location.state?.message) {
      showNotification(location.state.message, 'success');
    }
  }, [location.state]);

  // Safe API debugging function - avoids unnecessary state updates
  const debugApiEndpoint = async () => {
    try {
      // Check if checkHealth exists, otherwise fall back to init
      if (typeof api.checkHealth === 'function') {
        const healthResult = await api.checkHealth();
        console.log('[LoginForm] API Health Check Result:', healthResult);
        
        // Only update state if the connection status has changed
        setApiStatus(prevStatus => {
          const newConnected = healthResult.success;
          if (prevStatus.connected !== newConnected) {
            return { 
              connected: newConnected, 
              message: newConnected ? 'Connected' : 'Server offline' 
            };
          }
          return prevStatus; // Return previous state if no change
        });
        
        return healthResult;
      } else {
        // Fallback to using init
        console.log('[LoginForm] api.checkHealth not available, using fallback');
        const isConnected = await api.init();
        const result = {
          success: isConnected,
          status: isConnected ? 'healthy' : 'unhealthy',
          mode: 'fallback',
          timestamp: new Date().toISOString()
        };
        console.log('[LoginForm] API Connection Status:', result);
        
        // Only update state if the connection status has changed
        setApiStatus(prevStatus => {
          if (prevStatus.connected !== isConnected) {
            return { 
              connected: isConnected, 
              message: isConnected ? 'Connected' : 'Server offline' 
            };
          }
          return prevStatus; // Return previous state if no change
        });
        
        return result;
      }
    } catch (error) {
      console.error('[LoginForm] Error checking API health:', error);
      
      // Only update state if currently connected
      setApiStatus(prevStatus => {
        if (prevStatus.connected) {
          return { connected: false, message: 'Connection error' };
        }
        return prevStatus; // Already disconnected, no state change needed
      });
      
      return {
        success: false,
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  };

  // Check API status on mount - using ref to ensure it only runs once
  useEffect(() => {
    // Skip if already performed
    if (apiCheckPerformed.current) return;
    
    // Mark as performed
    apiCheckPerformed.current = true;
    
    // Perform the API check
    try {
      debugApiEndpoint().catch(err => {
        console.warn('[LoginForm] API health check failed:', err);
        setApiStatus({ connected: false, message: 'Connection error' });
      });
    } catch (err) {
      console.warn('[LoginForm] Error in API debugging:', err);
      setApiStatus({ connected: false, message: 'Connection error' });
    }
  }, []);

  // Handle form input changes
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // Toggle password visibility
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset error
    setError('');
    
    // Validate form
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Show loading state
    setIsSubmitting(true);
    
    try {
      // Debug logging
      console.log('[LoginForm] Attempting login with:', {
        email: formData.email,
        role: formData.role,
        passwordLength: formData.password.length
      });
      
      // Use the login method from your api service
      const response = await api.login({
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      
      console.log('[LoginForm] Login response:', {
        success: response.success,
        hasToken: !!response.token,
        hasUser: !!response.user
      });
      
      if (response.success && response.token) {
        // Set login success state
        setLoginSuccess(true);
        
        // Show success notification
        showNotification('Login successful! Redirecting...', 'success');
        
        // Get dashboard route based on role
        const userRole = response.user?.role || formData.role;
        const dashboardRoute = `/${userRole}/dashboard`;
        
        console.log(`[LoginForm] Redirecting to ${dashboardRoute}`);
        
        // Short delay before redirect for better UX
        setTimeout(() => {
          navigate(dashboardRoute, { replace: true });
        }, 1500);
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (err) {
      console.error('[LoginForm] Login error:', err);
      
      // Extract error message
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      setIsSubmitting(false);
    }
  };

  // Show notification function
  const showNotification = (message, type = 'success') => {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.notification-toast');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification-toast fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform translate-x-full`;
    
    // Add color based on type
    switch (type) {
      case 'success':
        notification.classList.add('bg-green-600', 'text-white');
        break;
      case 'error':
        notification.classList.add('bg-red-600', 'text-white');
        break;
      default:
        notification.classList.add('bg-gray-700', 'text-white');
    }
    
    // Add message
    notification.textContent = message;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Trigger animation
    requestAnimationFrame(() => {
      notification.classList.add('notification-animate');
    });
    
    // Remove after duration
    setTimeout(() => {
      notification.classList.add('notification-exit');
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  };

  // Run auth repair if there are issues
  const runAuthDiagnostics = useCallback(() => {
    console.log('[LoginForm] Running auth diagnostics');
    const result = handleDebugAuth();
    console.log('[LoginForm] Auth diagnostics result:', result);
    
    if (result.action !== 'none') {
      showNotification('Auth system repaired. Please try logging in again.', 'success');
    } else {
      showNotification('Auth system checked - no issues found.', 'success');
    }
  }, [handleDebugAuth]);

  // Display API status indicator
  const ApiStatusIndicator = () => (
    <div className={`absolute top-4 right-4 z-20 flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
      apiStatus.connected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`}>
      <div className={`w-2 h-2 mr-2 rounded-full ${
        apiStatus.connected ? 'bg-green-500' : 'bg-red-500'
      }`}></div>
      {apiStatus.message}
    </div>
  );

  // Success screen for better UX
  const renderSuccessScreen = () => (
    <motion.div 
      className="flex items-center justify-center min-h-screen bg-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative z-10 w-full max-w-md px-4">
        <motion.div 
          className="bg-gray-800 border border-green-500/30 rounded-xl p-8 text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
        >
          <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">Login Successful!</h2>
          <p className="text-gray-300 mb-6">You're being redirected to your dashboard...</p>
          
          <div className="flex justify-center">
            <div className="w-12 h-12">
              <svg className="animate-spin w-full h-full text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>
          
          <button 
            onClick={() => {
              navigate(`/${formData.role}/dashboard`, { replace: true });
            }}
            className="mt-6 px-6 py-2.5 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-all duration-200"
          >
            Go to Dashboard Now
          </button>
        </motion.div>
      </div>
    </motion.div>
  );

  // If login successful, show success screen
  if (loginSuccess) {
    return renderSuccessScreen();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-full h-full" style={{ 
            backgroundImage: 'radial-gradient(circle 400px at top right, #3b82f6, transparent)' 
          }}></div>
          <div className="absolute bottom-0 left-0 w-full h-full" style={{ 
            backgroundImage: 'radial-gradient(circle 400px at bottom left, #6366f1, transparent)' 
          }}></div>
        </div>
        <div className="grid-background"></div>
      </div>

      {/* API Status */}
      <ApiStatusIndicator />
      
      {/* Back to home link */}
      <Link to="/" className="absolute top-4 left-4 text-blue-400 flex items-center hover:text-blue-300 transition-colors z-20">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Back to Home
      </Link>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        <div className="bg-gray-800 border border-blue-500/30 rounded-xl p-8 shadow-xl">
          <div className="relative">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 mb-6 tracking-wider text-center">
              ACCOUNT LOGIN
            </h2>
            
            {/* Decorative elements */}
            <div className="absolute -top-10 -left-10 w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 opacity-30 blur-xl"></div>
            <div className="absolute -bottom-10 -right-10 w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 opacity-30 blur-xl"></div>
            
            {/* Error message */}
            {error && (
              <div className="bg-red-900/30 border border-red-500/50 text-red-200 px-4 py-2 rounded mb-4 text-sm">
                {error}
              </div>
            )}
            
            {/* Server offline warning */}
            {!apiStatus.connected && (
              <div className="bg-yellow-900/30 border border-yellow-500/50 text-yellow-200 px-4 py-2 rounded mb-4 text-sm">
                Server connection issue. Using mock mode for login.
              </div>
            )}
            
            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Role Selection */}
              <div className="space-y-1">
                <label className="block text-blue-300 text-sm font-medium">Account Type</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-900/80 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all"
                >
                  <option value="admin">Admin</option>
                  <option value="school">School</option>
                  <option value="teacher">Teacher</option>
                  <option value="student">Student</option>
                </select>
              </div>
              
              {/* Email Field */}
              <div className="space-y-1">
                <label className="block text-blue-300 text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-900/80 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all"
                />
              </div>
              
              {/* Password Field */}
              <div className="space-y-1">
                <label className="block text-blue-300 text-sm font-medium">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-900/80 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              
              {/* Forgot Password Link */}
              <div className="text-right">
                <Link to="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                  Forgot your password?
                </Link>
              </div>
              
              {/* Submit Button */}
              <motion.button
                type="submit"
                className="w-full py-3 px-4 mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-indigo-700 transform transition-all duration-200"
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    LOGGING IN...
                  </span>
                ) : 'LOGIN'}
              </motion.button>
            </form>
            
            {/* Registration Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Register here
                </Link>
              </p>
            </div>
            
            {/* Debug button - only visible in development */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={runAuthDiagnostics}
                  className="text-xs text-gray-500 hover:text-gray-400 underline"
                >
                  Fix Auth Issues
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
      
      {/* CSS for animations and styles */}
      <style>
        {`
          /* Grid background */
          .grid-background {
            background-image: 
              linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px);
            background-size: 30px 30px;
            width: 100%;
            height: 100%;
          }
          
          /* Notification animations */
          .notification-toast {
            transition: transform 0.3s ease, opacity 0.3s ease;
          }
          
          .notification-animate {
            transform: translateX(0);
          }
          
          .notification-exit {
            opacity: 0;
            transform: translateY(-10px);
          }
          
          /* Loading Animation */
          .animate-spin {
            animation: spin 1s linear infinite;
          }
          
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default LoginForm;