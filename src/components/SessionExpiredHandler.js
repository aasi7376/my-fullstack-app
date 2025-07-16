// src/components/SessionExpiredHandler.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SessionExpiredHandler = () => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('Your session has expired. Please log in again.');
  const navigate = useNavigate();

  useEffect(() => {
    // Check URL for expired parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('expired') === 'true') {
      setVisible(true);
      setMessage('Your session has expired. Please log in again.');
    }

    // Listen for session expired events
    const handleSessionExpired = (event) => {
      setMessage(event.detail?.message || 'Your session has expired. Please log in again.');
      setVisible(true);
    };

    window.addEventListener('session-expired', handleSessionExpired);

    // Auto-hide after 8 seconds
    let timer;
    if (visible) {
      timer = setTimeout(() => {
        setVisible(false);
      }, 8000);
    }

    return () => {
      window.removeEventListener('session-expired', handleSessionExpired);
      clearTimeout(timer);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-red-500 text-white p-3 z-50 flex justify-between items-center">
      <div className="flex items-center">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>
        <span>{message}</span>
      </div>
      <div className="flex items-center">
        <button 
          onClick={() => navigate('/login')}
          className="bg-white text-red-500 px-3 py-1 rounded text-sm mr-2"
        >
          Log In
        </button>
        <button 
          onClick={() => setVisible(false)}
          className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-sm"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

export default SessionExpiredHandler;