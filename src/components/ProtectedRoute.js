// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import authManager from '../utils/authManager';
import authService from '../services/authService';

/**
 * Protected route component that checks authentication and role
 * Redirects to login if not authenticated or not authorized
 */
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const [checking, setChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasRole, setHasRole] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const checkAuth = async () => {
      setChecking(true);
      
      // Check if authenticated
      const authenticated = authManager.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        // Check for token expiration
        const expiration = authManager.getTokenExpiration();
        
        // If token is expired, try to refresh
        if (expiration && expiration.isExpired) {
          console.log('[ProtectedRoute] Token is expired, attempting to refresh');
          const refreshed = await authService.refreshToken();
          
          if (!refreshed) {
            console.log('[ProtectedRoute] Token refresh failed, redirecting to login');
            setIsAuthenticated(false);
            setChecking(false);
            return;
          }
        }
        
        // Check role if required
        if (requiredRole) {
          const user = authManager.getUser();
          const userHasRole = user && user.role === requiredRole;
          setHasRole(userHasRole);
          
          if (!userHasRole) {
            console.log(`[ProtectedRoute] User does not have required role: ${requiredRole}`);
          }
        } else {
          setHasRole(true);
        }
      }
      
      setChecking(false);
    };
    
    checkAuth();
  }, [requiredRole, location.pathname]);
  
  // Show loading indicator while checking
  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    // Record the location they tried to go to for redirection after login
    return <Navigate to="/login" state={{ from: location, expired: true }} replace />;
  }
  
  // If role is required and user doesn't have it, redirect to dashboard
  if (requiredRole && !hasRole) {
    // Trigger unauthorized access event
    const event = new CustomEvent('unauthorized-access', {
      detail: { 
        message: `You don't have permission to access this page. Required role: ${requiredRole}`,
        requiredRole
      }
    });
    window.dispatchEvent(event);
    
    // Redirect to home
    return <Navigate to="/" replace />;
  }
  
  // Otherwise, render the protected component
  return children;
};

export default ProtectedRoute;