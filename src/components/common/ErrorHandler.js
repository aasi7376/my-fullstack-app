// src/components/common/ErrorHandler.jsx
import React, { useState, useEffect } from 'react';

/**
 * Enhanced error notification component that provides:
 * - Better visual feedback for different error types
 * - Retry functionality
 * - Automatic dismissal with progress bar
 * - Detailed error information for debugging
 */
const ErrorHandler = ({ 
  error, 
  onRetry, 
  onDismiss,
  showDetails = false,
  autoDismiss = true
}) => {
  const [visible, setVisible] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [retrying, setRetrying] = useState(false);
  
  // Auto dismiss after 15 seconds
  useEffect(() => {
    if (autoDismiss && !expanded) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onDismiss) onDismiss();
      }, 15000);
      
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, expanded, onDismiss]);
  
  // Reset visibility when error changes
  useEffect(() => {
    setVisible(true);
    setExpanded(false);
  }, [error]);
  
  // Determine error type for styling
  const getErrorType = () => {
    if (!error) return 'unknown';
    
    if (error.status === 401 || error.status === 403 || 
        error.statusCode === 401 || error.statusCode === 403) {
      return 'auth';
    } else if (error.status >= 500 || error.statusCode >= 500) {
      return 'server';
    } else if (error.message?.includes('timeout') || error.code === 'ECONNABORTED') {
      return 'timeout';
    } else if (error.message?.includes('Network Error') || (!error.status && !error.statusCode)) {
      return 'network';
    } else {
      return 'client';
    }
  };
  
  // Format user-friendly error message
  const getErrorMessage = () => {
    if (!error) return 'An unknown error occurred';
    
    // API returned a specific message
    if (error.message) {
      return error.message;
    }
    
    if (error.details?.message) {
      return error.details.message;
    }
    
    // Check for common error types
    if (error.status === 401 || error.statusCode === 401) {
      return 'Authentication required. Please log in again.';
    } else if (error.status === 403 || error.statusCode === 403) {
      return 'You don\'t have permission to access this resource.';
    } else if (error.status === 404 || error.statusCode === 404) {
      return 'The requested resource was not found.';
    } else if (error.status >= 500 || error.statusCode >= 500) {
      return 'Server error. The team has been notified.';
    } else if (error.message?.includes('timeout')) {
      return 'Request timed out. The server may be busy.';
    } else if (error.message?.includes('Network Error')) {
      return 'Unable to connect to the server. Please check your internet connection.';
    }
    
    // Default fallback
    return 'An unexpected error occurred. Please try again.';
  };
  
  // Handle retry with loading state
  const handleRetry = async () => {
    if (!onRetry || retrying) return;
    
    setRetrying(true);
    try {
      await onRetry();
      setVisible(false);
    } catch (err) {
      console.error('Retry failed:', err);
      // Keep the error visible
    } finally {
      setRetrying(false);
    }
  };
  
  // Don't render if not visible or no error
  if (!visible || !error) return null;
  
  // Style mapping based on error type
  const errorStyles = {
    auth: {
      bg: 'rgba(253, 211, 106, 0.2)',
      border: '1px solid rgba(253, 211, 106, 0.3)',
      icon: '🔒',
      iconColor: '#ffd36a'
    },
    server: {
      bg: 'rgba(255, 106, 136, 0.2)',
      border: '1px solid rgba(255, 106, 136, 0.3)',
      icon: '🖥️',
      iconColor: '#ff6a88'
    },
    network: {
      bg: 'rgba(138, 179, 197, 0.2)',
      border: '1px solid rgba(138, 179, 197, 0.3)',
      icon: '🌐',
      iconColor: '#8ab3c5'
    },
    timeout: {
      bg: 'rgba(0, 208, 255, 0.2)',
      border: '1px solid rgba(0, 208, 255, 0.3)',
      icon: '⏱️',
      iconColor: '#00d0ff'
    },
    client: {
      bg: 'rgba(0, 225, 255, 0.2)',
      border: '1px solid rgba(0, 225, 255, 0.3)',
      icon: '❗',
      iconColor: '#00e1ff'
    },
    unknown: {
      bg: 'rgba(138, 179, 197, 0.2)',
      border: '1px solid rgba(138, 179, 197, 0.3)',
      icon: '❓',
      iconColor: '#8ab3c5'
    }
  };
  
  const style = errorStyles[getErrorType()];
  
  return (
    <div 
      style={{
        position: 'relative',
        marginBottom: '20px',
        padding: '16px',
        borderRadius: '8px',
        background: style.bg,
        border: style.border,
        color: '#ffffff',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        overflow: 'hidden',
        fontFamily: 'system-ui, sans-serif'
      }}
      role="alert"
    >
      <div style={{
        display: 'flex',
        alignItems: 'flex-start'
      }}>
        <div style={{
          flexShrink: 0,
          marginRight: '12px',
          fontSize: '20px',
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: style.iconColor
        }}>
          {style.icon}
        </div>
        
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '8px'
          }}>
            {getErrorMessage()}
          </div>
          
          {expanded && showDetails && (
            <div style={{
              marginTop: '12px',
              fontSize: '12px',
              opacity: 0.8
            }}>
              <div style={{
                fontFamily: 'monospace',
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '8px',
                borderRadius: '4px',
                marginTop: '4px',
                maxHeight: '120px',
                overflow: 'auto'
              }}>
                {error.status && <div>Status: {error.status}</div>}
                {error.statusCode && <div>Status Code: {error.statusCode}</div>}
                {error.code && <div>Code: {error.code}</div>}
                {error.config && (
                  <>
                    <div>URL: {error.config.baseURL}{error.config.url}</div>
                    <div>Method: {error.config.method?.toUpperCase()}</div>
                  </>
                )}
                {error.stack && (
                  <details>
                    <summary style={{ cursor: 'pointer' }}>Stack Trace</summary>
                    <pre style={{
                      marginTop: '4px',
                      whiteSpace: 'pre-wrap'
                    }}>{error.stack}</pre>
                  </details>
                )}
              </div>
            </div>
          )}
          
          <div style={{
            marginTop: '12px',
            display: 'flex',
            gap: '8px'
          }}>
            {onRetry && (
              <button
                onClick={handleRetry}
                disabled={retrying}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '6px 12px',
                  color: '#ffffff',
                  cursor: retrying ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s'
                }}
              >
                {retrying ? "Retrying..." : "Retry"}
              </button>
            )}
            
            {showDetails && (
              <button
                onClick={() => setExpanded(!expanded)}
                style={{
                  fontSize: '12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '6px 12px',
                  color: '#ffffff',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
              >
                {expanded ? 'Hide Details' : 'Show Details'}
              </button>
            )}
          </div>
        </div>
        
        <button
          onClick={() => {
            setVisible(false);
            if (onDismiss) onDismiss();
          }}
          style={{
            flexShrink: 0,
            marginLeft: '12px',
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '18px',
            cursor: 'pointer',
            transition: 'color 0.2s',
            padding: 0,
            lineHeight: 1
          }}
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
      
      {/* Animated progress bar for auto-dismiss */}
      {autoDismiss && !expanded && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'rgba(255, 255, 255, 0.1)'
        }}>
          <div 
            style={{
              height: '100%',
              background: 'rgba(255, 255, 255, 0.3)',
              width: '100%',
              transformOrigin: 'left',
              animation: 'shrink 15s linear forwards'
            }}
          />
        </div>
      )}
      
      <style>
        {`
          @keyframes shrink {
            0% { width: 100%; }
            100% { width: 0%; }
          }
        `}
      </style>
    </div>
  );
};

export default ErrorHandler;