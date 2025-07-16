// src/components/AuthDebugger.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AuthDebugger = () => {
  const auth = useAuth();
  const [debugInfo, setDebugInfo] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [testCredentials, setTestCredentials] = useState({
    email: 'test@example.com',
    password: 'password123',
    role: 'user'
  });
  const [loginResult, setLoginResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedSection, setExpandedSection] = useState('auth');

  // Update debug info on mount and when auth state changes
  useEffect(() => {
    if (auth && auth.debugAuth) {
      setDebugInfo(auth.debugAuth());
    }
  }, [auth, auth.user, auth.token, auth.isAuthenticated]);

  // Handle test login
  const handleTestLogin = async () => {
    setIsLoading(true);
    setLoginResult(null);
    
    try {
      const result = await auth.login(
        testCredentials.email,
        testCredentials.password,
        testCredentials.role
      );
      
      setLoginResult(result);
    } catch (error) {
      setLoginResult({
        success: false,
        error: error.message || 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTestCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Force token refresh
  const handleForceRefresh = async () => {
    setIsLoading(true);
    
    try {
      const result = await auth.refreshToken();
      
      setLoginResult({
        success: result,
        message: result ? 'Token refreshed successfully' : 'Token refresh failed'
      });
    } catch (error) {
      setLoginResult({
        success: false,
        error: error.message || 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Clear auth data
  const handleClearAuth = () => {
    auth.logout();
    setLoginResult({
      success: true,
      message: 'Logged out successfully'
    });
  };

  // Toggle expanded section
  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '4px',
      padding: '16px',
      margin: '16px 0',
      maxWidth: '800px',
      fontFamily: 'monospace',
      fontSize: '14px',
      backgroundColor: '#f9f9f9'
    }}>
      <h2 style={{ margin: '0 0 16px' }}>Auth Debugger</h2>
      
      {/* Debug Information */}
      <div style={{ marginBottom: '16px' }}>
        <h3 
          style={{ 
            cursor: 'pointer', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            margin: '0 0 8px',
            padding: '8px',
            backgroundColor: expandedSection === 'auth' ? '#e3f2fd' : '#f5f5f5',
            borderRadius: '4px'
          }}
          onClick={() => toggleSection('auth')}
        >
          Auth State
          <span>{expandedSection === 'auth' ? '▼' : '▶'}</span>
        </h3>
        
        {expandedSection === 'auth' && (
          <div style={{ 
            backgroundColor: '#fff', 
            border: '1px solid #eee', 
            borderRadius: '4px', 
            padding: '8px', 
            maxHeight: '300px', 
            overflow: 'auto' 
          }}>
            <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        )}
      </div>
      
      {/* Test Login */}
      <div style={{ marginBottom: '16px' }}>
        <h3 
          style={{ 
            cursor: 'pointer',
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            margin: '0 0 8px',
            padding: '8px',
            backgroundColor: expandedSection === 'login' ? '#e3f2fd' : '#f5f5f5',
            borderRadius: '4px'
          }}
          onClick={() => toggleSection('login')}
        >
          Test Login
          <span>{expandedSection === 'login' ? '▼' : '▶'}</span>
        </h3>
        
        {expandedSection === 'login' && (
          <div style={{ 
            backgroundColor: '#fff', 
            border: '1px solid #eee', 
            borderRadius: '4px', 
            padding: '16px' 
          }}>
            <div style={{ marginBottom: '8px' }}>
              <label style={{ display: 'block', marginBottom: '4px' }}>Email:</label>
              <input 
                type="email"
                name="email"
                value={testCredentials.email}
                onChange={handleInputChange}
                style={{ 
                  width: '100%', 
                  padding: '8px', 
                  borderRadius: '4px', 
                  border: '1px solid #ddd' 
                }}
              />
            </div>
            
            <div style={{ marginBottom: '8px' }}>
              <label style={{ display: 'block', marginBottom: '4px' }}>
                Password:
                <span 
                  style={{ 
                    marginLeft: '8px', 
                    cursor: 'pointer', 
                    fontSize: '12px',
                    color: '#2196f3'
                  }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </span>
              </label>
              <input 
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={testCredentials.password}
                onChange={handleInputChange}
                style={{ 
                  width: '100%', 
                  padding: '8px', 
                  borderRadius: '4px', 
                  border: '1px solid #ddd' 
                }}
              />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '4px' }}>Role (optional):</label>
              <select 
                name="role"
                value={testCredentials.role}
                onChange={handleInputChange}
                style={{ 
                  width: '100%', 
                  padding: '8px', 
                  borderRadius: '4px', 
                  border: '1px solid #ddd' 
                }}
              >
                <option value="">No specific role</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
                <option value="school_admin">School Admin</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button 
                onClick={handleTestLogin}
                disabled={isLoading}
                style={{ 
                  padding: '8px 16px', 
                  backgroundColor: '#4caf50', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px', 
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.7 : 1
                }}
              >
                {isLoading ? 'Loading...' : 'Test Login'}
              </button>
              
              <button 
                onClick={handleForceRefresh}
                disabled={isLoading || !auth.isAuthenticated}
                style={{ 
                  padding: '8px 16px', 
                  backgroundColor: '#2196f3', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px', 
                  cursor: (isLoading || !auth.isAuthenticated) ? 'not-allowed' : 'pointer',
                  opacity: (isLoading || !auth.isAuthenticated) ? 0.7 : 1
                }}
              >
                Refresh Token
              </button>
              
              <button 
                onClick={handleClearAuth}
                disabled={isLoading || !auth.isAuthenticated}
                style={{ 
                  padding: '8px 16px', 
                  backgroundColor: '#f44336', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px', 
                  cursor: (isLoading || !auth.isAuthenticated) ? 'not-allowed' : 'pointer',
                  opacity: (isLoading || !auth.isAuthenticated) ? 0.7 : 1
                }}
              >
                Clear Auth
              </button>
            </div>
            
            {/* Login Result */}
            {loginResult && (
              <div style={{ 
                marginTop: '16px', 
                padding: '8px', 
                borderRadius: '4px', 
                backgroundColor: loginResult.success ? '#e8f5e9' : '#ffebee',
                border: `1px solid ${loginResult.success ? '#a5d6a7' : '#ffcdd2'}`
              }}>
                <h4 style={{ margin: '0 0 8px' }}>
                  {loginResult.success ? 'Success' : 'Error'}
                </h4>
                <pre style={{ margin: 0 }}>{JSON.stringify(loginResult, null, 2)}</pre>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Network Tests */}
      <div style={{ marginBottom: '16px' }}>
        <h3 
          style={{ 
            cursor: 'pointer',
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            margin: '0 0 8px',
            padding: '8px',
            backgroundColor: expandedSection === 'network' ? '#e3f2fd' : '#f5f5f5',
            borderRadius: '4px'
          }}
          onClick={() => toggleSection('network')}
        >
          Network Tests
          <span>{expandedSection === 'network' ? '▼' : '▶'}</span>
        </h3>
        
        {expandedSection === 'network' && (
          <div style={{ 
            backgroundColor: '#fff', 
            border: '1px solid #eee', 
            borderRadius: '4px', 
            padding: '16px' 
          }}>
            <p>API Base URL: <code>{process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}</code></p>
            
            <p>Check these endpoints in your browser Network tab:</p>
            <ul style={{ margin: '8px 0', paddingLeft: '24px' }}>
              <li>POST /api/auth/login</li>
              <li>POST /api/auth/register</li>
              <li>GET /api/auth/me (requires auth)</li>
            </ul>
            
            <p>Common issues:</p>
            <ul style={{ margin: '8px 0', paddingLeft: '24px' }}>
              <li>CORS errors - Backend not allowing requests from frontend</li>
              <li>Connection refused - Backend server not running</li>
              <li>401 Unauthorized - Invalid credentials or token</li>
              <li>500 Server Error - Backend error (check server logs)</li>
            </ul>
          </div>
        )}
      </div>
      
      {/* Browser Storage */}
      <div>
        <h3 
          style={{ 
            cursor: 'pointer',
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            margin: '0 0 8px',
            padding: '8px',
            backgroundColor: expandedSection === 'storage' ? '#e3f2fd' : '#f5f5f5',
            borderRadius: '4px'
          }}
          onClick={() => toggleSection('storage')}
        >
          localStorage Inspection
          <span>{expandedSection === 'storage' ? '▼' : '▶'}</span>
        </h3>
        
        {expandedSection === 'storage' && (
          <div style={{ 
            backgroundColor: '#fff', 
            border: '1px solid #eee', 
            borderRadius: '4px', 
            padding: '16px' 
          }}>
            <p><strong>token:</strong> {localStorage.getItem('token') ? '✅ Present' : '❌ Missing'}</p>
            <p><strong>user:</strong> {localStorage.getItem('user') ? '✅ Present' : '❌ Missing'}</p>
            <p><strong>refreshToken:</strong> {localStorage.getItem('refreshToken') ? '✅ Present' : '❌ Missing'}</p>
            
            <p>To inspect localStorage contents, open your browser console and type:</p>
            <pre style={{ 
              backgroundColor: '#f5f5f5', 
              padding: '8px', 
              borderRadius: '4px',
              overflowX: 'auto'
            }}>
{`// View all storage
console.log({
  token: localStorage.getItem('token'),
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  refreshToken: localStorage.getItem('refreshToken')
});

// Clear all storage
localStorage.removeItem('token');
localStorage.removeItem('user');
localStorage.removeItem('refreshToken');`}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthDebugger;