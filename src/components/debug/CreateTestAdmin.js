// src/components/debug/CreateTestAdmin.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const CreateTestAdmin = () => {
  const { createTestAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showCredentials, setShowCredentials] = useState(false);
  
  const handleCreateTestAdmin = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const response = await createTestAdmin();
      setResult(response);
    } catch (error) {
      setResult({
        success: false,
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="debug-panel">
      <h3>Create Test Admin</h3>
      <p className="debug-description">
        This will create a test admin user with a random email and pre-set password.
        Use this for testing when you can't login.
      </p>
      
      <button 
        onClick={handleCreateTestAdmin}
        disabled={loading}
        className="debug-button"
      >
        {loading ? 'Creating...' : 'Create Test Admin'}
      </button>
      
      {result && (
        <div className={`debug-result ${result.success ? 'success' : 'error'}`}>
          <p>{result.success ? 'Success! Test admin created.' : `Error: ${result.error}`}</p>
          
          {result.success && result.credentials && (
            <div className="credentials-section">
              <button 
                onClick={() => setShowCredentials(!showCredentials)}
                className="toggle-credentials-button"
              >
                {showCredentials ? 'Hide Credentials' : 'Show Credentials'}
              </button>
              
              {showCredentials && (
                <div className="credentials">
                  <p><strong>Email:</strong> {result.credentials.email}</p>
                  <p><strong>Password:</strong> {result.credentials.password}</p>
                  <p><strong>Role:</strong> {result.credentials.role}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      <style jsx>{`
        .debug-panel {
          background: rgba(0, 0, 0, 0.7);
          border: 1px solid #444;
          border-radius: 8px;
          padding: 16px;
          margin: 20px 0;
          color: white;
        }
        
        .debug-description {
          margin-bottom: 16px;
          font-size: 14px;
          color: #aaa;
        }
        
        .debug-button {
          background: linear-gradient(45deg, #6B46C1, #4834d4);
          color: white;
          border: none;
          border-radius: 4px;
          padding: 8px 16px;
          cursor: pointer;
          font-weight: bold;
        }
        
        .debug-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .debug-result {
          margin-top: 16px;
          padding: 12px;
          border-radius: 4px;
        }
        
        .success {
          background: rgba(0, 128, 0, 0.2);
          border: 1px solid #00800050;
        }
        
        .error {
          background: rgba(255, 0, 0, 0.2);
          border: 1px solid #ff000050;
        }
        
        .credentials-section {
          margin-top: 12px;
        }
        
        .toggle-credentials-button {
          background: transparent;
          border: 1px solid #555;
          color: #ccc;
          padding: 4px 8px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }
        
        .credentials {
          margin-top: 12px;
          padding: 12px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 4px;
          font-family: monospace;
        }
      `}</style>
    </div>
  );
};

export default CreateTestAdmin;