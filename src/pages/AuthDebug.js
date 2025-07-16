// src/pages/AuthDebug.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import authManager from '../utils/authManager';
import authService from '../services/authService';

const AuthDebug = () => {
  const [authState, setAuthState] = useState(null);
  const [tokenInfo, setTokenInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Check authentication state
  const checkAuth = () => {
    const state = authManager.debug();
    setAuthState(state);
    
    const token = authManager.getToken();
    if (token) {
      setTokenInfo({
        token: `${token.substring(0, 10)}...${token.substring(token.length - 10)}`,
        expiration: authManager.getTokenExpiration()
      });
    } else {
      setTokenInfo(null);
    }
  };
  
  // Initial check
  useEffect(() => {
    checkAuth();
  }, []);
  
  // Create test token
  const createTestToken = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const result = await authService.createTestToken();
      
      if (result.success) {
        setMessage('Test token created successfully');
        checkAuth(); // Refresh state
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Refresh token
  const refreshToken = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const refreshed = await authService.refreshToken();
      
      if (refreshed) {
        setMessage('Token refreshed successfully');
        checkAuth(); // Refresh state
      } else {
        setMessage('Token refresh failed or not needed');
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Clear authentication
  const clearAuth = () => {
    authManager.clearAuth();
    setMessage('Authentication cleared');
    checkAuth(); // Refresh state
  };
  
  // Trigger session expired event
  const triggerSessionExpired = () => {
    const event = new CustomEvent('session-expired', {
      detail: { message: 'Session expired event triggered manually' }
    });
    window.dispatchEvent(event);
    setMessage('Session expired event triggered');
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Authentication Debug</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Authentication State</h2>
        
        {authState ? (
          <div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-100 p-3 rounded">
                <span className="font-medium">Authenticated:</span> 
                <span className={authState.isAuthenticated ? "text-green-600" : "text-red-600"}>
                  {authState.isAuthenticated ? "Yes" : "No"}
                </span>
              </div>
              
              <div className="bg-gray-100 p-3 rounded">
                <span className="font-medium">Has Token:</span> 
                <span className={authState.hasToken ? "text-green-600" : "text-red-600"}>
                  {authState.hasToken ? "Yes" : "No"}
                </span>
              </div>
              
              <div className="bg-gray-100 p-3 rounded">
                <span className="font-medium">Has User:</span> 
                <span className={authState.hasUser ? "text-green-600" : "text-red-600"}>
                  {authState.hasUser ? "Yes" : "No"}
                </span>
              </div>
              
              <div className="bg-gray-100 p-3 rounded">
                <span className="font-medium">Has Refresh Token:</span> 
                <span className={authState.hasRefreshToken ? "text-green-600" : "text-red-600"}>
                  {authState.hasRefreshToken ? "Yes" : "No"}
                </span>
              </div>
            </div>
            
            {authState.hasUser && authState.user && (
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">User Info</h3>
                <div className="bg-gray-100 p-3 rounded">
                  <pre className="whitespace-pre-wrap">{JSON.stringify(authState.user, null, 2)}</pre>
                </div>
              </div>
            )}
            
            {tokenInfo && (
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">Token Info</h3>
                <div className="bg-gray-100 p-3 rounded mb-2">
                  <div className="font-medium">Token:</div>
                  <div className="text-sm overflow-x-auto">{tokenInfo.token}</div>
                </div>
                
                {tokenInfo.expiration && (
                  <div className="bg-gray-100 p-3 rounded">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="font-medium">Expires At:</span>{' '}
                        {tokenInfo.expiration.expDate.toLocaleString()}
                      </div>
                      <div>
                        <span className="font-medium">Expired:</span>{' '}
                        <span className={tokenInfo.expiration.isExpired ? "text-red-600" : "text-green-600"}>
                          {tokenInfo.expiration.isExpired ? "Yes" : "No"}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Time Remaining:</span>{' '}
                        {tokenInfo.expiration.expiresIn.days > 0 ? 
                          `${tokenInfo.expiration.expiresIn.days} days, ${tokenInfo.expiration.expiresIn.hours % 24} hours` : 
                          tokenInfo.expiration.expiresIn.hours > 0 ?
                            `${tokenInfo.expiration.expiresIn.hours} hours, ${tokenInfo.expiration.expiresIn.minutes % 60} minutes` :
                            `${tokenInfo.expiration.expiresIn.minutes} minutes, ${tokenInfo.expiration.expiresIn.seconds % 60} seconds`
                        }
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-gray-500">Loading authentication state...</div>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Actions</h2>
        
        <div className="flex flex-wrap gap-3 mb-4">
          <button 
            onClick={createTestToken}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Create Test Token
          </button>
          
          <button 
            onClick={refreshToken}
            disabled={loading || !authState?.hasToken}
           className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Refresh Token
          </button>
          
          <button 
            onClick={clearAuth}
            disabled={loading || !authState?.hasToken}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Clear Authentication
          </button>
          
          <button 
            onClick={triggerSessionExpired}
            disabled={loading}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Trigger Session Expired
          </button>
          
          <button 
            onClick={checkAuth}
            disabled={loading}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Refresh Status
          </button>
        </div>
        
        {message && (
          <div className={`p-3 rounded ${message.startsWith('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
        
        <div className="flex flex-wrap gap-3">
          <Link 
            to="/login"
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Login Page
          </Link>
          
          <Link 
            to="/register"
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
          >
            Register Page
          </Link>
          
          <Link 
            to="/admin/dashboard"
            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded"
          >
            Admin Dashboard
          </Link>
          
          <Link 
            to="/"
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Home Page
          </Link>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Troubleshooting Tips</h2>
        
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Invalid Token Error:</strong> This occurs when your token has an invalid format or signature. 
            Try clicking "Clear Authentication" and then "Create Test Token".
          </li>
          <li>
            <strong>Session Expired:</strong> This occurs when your token is expired. 
            Use "Refresh Token" to get a new valid token.
          </li>
          <li>
            <strong>Login Issues:</strong> If login fails, check the server logs for any error messages.
            The most common issues are incorrect credentials or server connectivity problems.
          </li>
          <li>
            <strong>Authentication Not Persisting:</strong> If your authentication state doesn't persist across page refreshes,
            check if localStorage is working properly in your browser.
          </li>
          <li>
            <strong>API Calls Failing:</strong> If your API calls are failing with 401 errors, it likely means your
            token is invalid or expired. Use "Refresh Token" to get a new valid token.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AuthDebug;