// NavigationDebug.js - Fixed version to prevent loop detection spam
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const NavigationDebug = () => {
  const location = useLocation();
  const [navHistory, setNavHistory] = useState([]);
  const [loopDetected, setLoopDetected] = useState(false);
  const [loopIgnored, setLoopIgnored] = useState(false);
  
  // Only track the last 10 navigation events
  const MAX_HISTORY = 10;
  
  // Define paths that should be ignored for loop detection
  // For example, we might expect rapid navigation between these paths
  const IGNORED_PATH_PATTERNS = [
    // Paths that naturally might have frequent back-and-forth navigation
    /^\/dashboard/,
    /^\/auth/,
    /^\/login/,
    // Add other patterns as needed
  ];
  
  // Enhanced loop detection that ignores certain expected navigation patterns
  const isIgnoredPathPattern = (path) => {
    return IGNORED_PATH_PATTERNS.some(pattern => pattern.test(path));
  };
  
  useEffect(() => {
    // Get current path
    const currentPath = location.pathname;
    
    // Add timestamp for debugging
    const timestamp = new Date().toISOString();
    const navEvent = {
      path: currentPath,
      timestamp,
      search: location.search
    };
    
    // Update navigation history
    setNavHistory(prev => {
      const newHistory = [navEvent, ...prev].slice(0, MAX_HISTORY);
      
      // Check for navigation loops - if same path occurs 3+ times in last 5 navigations
      if (!loopIgnored && newHistory.length >= 5) {
        const last5Paths = newHistory.slice(0, 5).map(h => h.path);
        const uniquePaths = new Set(last5Paths);
        
        // If we have 5 navigations but only 1-2 unique paths, likely a loop
        if (uniquePaths.size <= 2) {
          // Check if all paths in potential loop are in our ignore list
          const allPathsIgnorable = last5Paths.every(isIgnoredPathPattern);
          
          // Only report loop if it's not involving our ignored paths
          if (!allPathsIgnorable) {
            console.log('[NAV] Possible navigation loop detected!');
            console.log('[NAV] Last 5 paths:', last5Paths);
            setLoopDetected(true);
            
            // Only log once per session to avoid console spam
            setLoopIgnored(true);
            
            // You could add more detailed loop analysis here
            return newHistory;
          }
        }
      }
      
      return newHistory;
    });
  }, [location, loopDetected, loopIgnored]);
  
  // Only render in development mode and if explicitly enabled
  if (process.env.NODE_ENV !== 'development' || 
      process.env.REACT_APP_ENABLE_NAV_DEBUG !== 'true') {
    return null;
  }
  
  // Simple floating debugger UI, collapsed by default
  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: '#00ff00',
      fontFamily: 'monospace',
      fontSize: '12px',
      padding: '5px 10px',
      borderRadius: '5px',
      zIndex: 9999,
      maxHeight: '300px',
      overflowY: 'auto',
      border: loopDetected ? '2px solid red' : '1px solid #333',
      maxWidth: '300px'
    }}>
      <div>
        <strong>🧭 Navigation Debug {loopDetected && '⚠️ LOOP'}</strong>
        <div>Current: {location.pathname}</div>
        {navHistory.length > 0 && (
          <div>
            <strong>History:</strong>
            <ul style={{ padding: '0 0 0 20px', margin: '5px 0' }}>
              {navHistory.map((nav, i) => (
                <li key={i} style={{ marginBottom: '3px' }}>
                  {nav.path}
                  {nav.search && <span style={{ color: '#aaa' }}>{nav.search}</span>}
                </li>
              ))}
            </ul>
          </div>
        )}
        {loopDetected && (
          <div style={{ color: 'red' }}>
            Loop detected! Check your routing logic.
          </div>
        )}
      </div>
    </div>
  );
};

export default NavigationDebug;