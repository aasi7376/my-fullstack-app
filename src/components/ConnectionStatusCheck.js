// src/components/ConnectionStatusCheck.jsx
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

const ConnectionStatusCheck = () => {
  const [status, setStatus] = useState({ 
    connected: true, 
    message: 'Connected', 
    checking: true 
  });

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Check API connection
        const result = await api.checkHealth();
        
        setStatus({
          connected: result.success,
          message: result.success ? 'Connected' : 'Server connection error',
          checking: false
        });
      } catch (error) {
        setStatus({
          connected: false,
          message: 'Connection failed',
          checking: false
        });
      }
    };

    checkConnection();
  }, []);

  if (status.checking) return null;
  if (status.connected) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center shadow-lg">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span className="flex-grow">{status.message}</span>
        <button 
          onClick={() => window.location.reload()}
          className="ml-4 bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    </div>
  );
};

export default ConnectionStatusCheck;