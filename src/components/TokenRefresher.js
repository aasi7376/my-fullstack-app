// src/components/TokenRefresher.jsx
import React, { useEffect, useState } from 'react';
import authManager from '../utils/authManager';
import authService from '../services/authService';

/**
 * Component that handles token refresh in the background
 * This should be placed in your App.js or layout component
 */
const TokenRefresher = () => {
  const [nextRefresh, setNextRefresh] = useState(null);
  
  // Check token expiration and schedule refresh
  const checkAndScheduleRefresh = async () => {
    // Skip if not authenticated
    if (!authManager.isAuthenticated()) {
      setNextRefresh(null);
      return;
    }
    
    // Get token expiration
    const expiration = authManager.getTokenExpiration();
    if (!expiration) {
      setNextRefresh(null);
      return;
    }
    
    // If token is expired or about to expire (within 5 minutes), refresh now
    if (expiration.timeRemaining < 300) {
      console.log('[TokenRefresher] Token is about to expire, refreshing now');
      await authService.refreshToken();
      
      // Update next refresh time
      const newExpiration = authManager.getTokenExpiration();
      if (newExpiration) {
        // Schedule next refresh for halfway to expiration
        const nextRefreshTime = Math.floor(Date.now() + (newExpiration.timeRemaining * 500));
        setNextRefresh(nextRefreshTime);
      }
    } else {
      // Token is still valid, schedule refresh for halfway to expiration
      const nextRefreshTime = Math.floor(Date.now() + (expiration.timeRemaining * 500));
      setNextRefresh(nextRefreshTime);
    }
  };
  
  // Initial check
  useEffect(() => {
    checkAndScheduleRefresh();
    
    // Set up interval to check token expiration every minute
    const interval = setInterval(() => {
      checkAndScheduleRefresh();
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);
  
  // Schedule refresh when nextRefresh changes
  useEffect(() => {
    if (!nextRefresh) return;
    
    const now = Date.now();
    const delay = Math.max(0, nextRefresh - now);
    
    // Skip if delay is too small
    if (delay < 1000) return;
    
    console.log(`[TokenRefresher] Scheduling token refresh in ${Math.floor(delay/1000)} seconds`);
    
    const timer = setTimeout(() => {
      console.log('[TokenRefresher] Executing scheduled token refresh');
      authService.refreshToken()
        .then((refreshed) => {
          if (refreshed) {
            console.log('[TokenRefresher] Token refreshed successfully');
          } else {
            console.log('[TokenRefresher] Token refresh not needed or failed');
          }
          
          // Schedule next refresh
          checkAndScheduleRefresh();
        })
        .catch((error) => {
          console.error('[TokenRefresher] Error refreshing token:', error);
        });
    }, delay);
    
    return () => clearTimeout(timer);
  }, [nextRefresh]);
  
  // This component doesn't render anything
  return null;
};

export default TokenRefresher;