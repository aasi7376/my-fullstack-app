// File: src/pages/Login.js (Main Authentication Page) - Updated with API Integration
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import RoleSelection from '../components/auth/RoleSelection';
import LoginForm from '../components/forms/LoginForm';
import RegisterForm from '../components/forms/RegisterForm';
import api from '../services/api';
import '../styles/auth.css';

const AuthPage = () => {
  const [currentView, setCurrentView] = useState('home'); // 'home', 'roleSelect', 'login', 'register'
  const [selectedRole, setSelectedRole] = useState(null);
  const [authType, setAuthType] = useState('login'); // 'login' or 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('checking'); // 'checking', 'connected', 'disconnected'
  
  const navigate = useNavigate();

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      if (api.isAuthenticated()) {
        try {
          console.log('🔍 Checking existing authentication...');
          await api.getCurrentUser();
          console.log('✅ User already authenticated, redirecting...');
          navigate('/dashboard'); // Redirect to dashboard if already logged in
        } catch (error) {
          console.log('❌ Existing token invalid, clearing...');
          api.logout(); // Clear invalid token
        }
      }
    };

    checkAuth();
  }, [navigate]);

  // Check API connection on component mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        console.log('🔍 Checking API connection...');
        setConnectionStatus('checking');
        
        // Test basic connection
        const response = await fetch('http://localhost:5000/');
        if (response.ok) {
          console.log('✅ API connection successful');
          setConnectionStatus('connected');
        } else {
          throw new Error('Server not responding');
        }
      } catch (error) {
        console.error('❌ API connection failed:', error);
        setConnectionStatus('disconnected');
        setError('Cannot connect to server. Please make sure the backend is running on port 5000.');
      }
    };

    checkConnection();
  }, []);

  const handleRoleSelect = (role) => {
    console.log('📝 Role selected:', role);
    setSelectedRole(role);
    setCurrentView(authType);
    setError(''); // Clear any previous errors
  };

  const handleBack = () => {
    if (currentView === 'login' || currentView === 'register') {
      setCurrentView('roleSelect');
      setSelectedRole(null);
    } else {
      setCurrentView('home');
    }
    setError(''); // Clear errors when navigating back
  };

  const handleAuthSwitch = () => {
    if (currentView === 'login') {
      setCurrentView('register');
    } else if (currentView === 'register') {
      setCurrentView('login');
    }
    setError(''); // Clear errors when switching
  };

  // Handle login
  const handleLogin = async (credentials) => {
    setLoading(true);
    setError('');
    
    try {
      console.log('🔐 Attempting login...');
      const loginData = {
        ...credentials,
        role: selectedRole // Include selected role
      };
      
      const response = await api.login(loginData);
      
      if (response.success) {
        console.log('✅ Login successful!');
        // Redirect to dashboard or appropriate page based on role
        navigate('/dashboard');
      } else {
        setError(response.error || 'Login failed');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      setError(api.handleError(error));
    } finally {
      setLoading(false);
    }
  };

  // Handle registration
  const handleRegister = async (userData) => {
    setLoading(true);
    setError('');
    
    try {
      console.log('📝 Attempting registration...');
      const registerData = {
        ...userData,
        role: selectedRole // Include selected role
      };
      
      const response = await api.register(registerData);
      
      if (response.success) {
        console.log('✅ Registration successful!');
        // Redirect to dashboard or appropriate page based on role
        navigate('/dashboard');
      } else {
        setError(response.error || 'Registration failed');
      }
    } catch (error) {
      console.error('❌ Registration error:', error);
      setError(api.handleError(error));
    } finally {
      setLoading(false);
    }
  };

  // Try demo login
  const handleDemoLogin = async (role) => {
    setLoading(true);
    setError('');
    
    try {
      console.log('🎯 Attempting demo login for role:', role);
      const demoCredentials = {
        email: `demo@${role}.com`,
        password: 'demo123',
        role: role
      };
      
      const response = await api.login(demoCredentials);
      
      if (response.success) {
        console.log('✅ Demo login successful!');
        navigate('/dashboard');
      } else {
        setError('Demo login failed. Please try manual login.');
      }
    } catch (error) {
      console.error('❌ Demo login error:', error);
      setError('Demo login failed. Please try manual login.');
    } finally {
      setLoading(false);
    }
  };

  const renderCurrentView = () => {
    // Show connection error if API is not available
    if (connectionStatus === 'disconnected') {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            background: 'rgba(15, 15, 35, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            border: '2px solid rgba(255, 0, 0, 0.3)',
            padding: '40px',
            textAlign: 'center',
            maxWidth: '500px',
            width: '100%',
            color: '#ffffff'
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⚠️</div>
          <h2 style={{ color: '#ff6b6b', marginBottom: '20px' }}>Connection Error</h2>
          <p style={{ color: '#cccccc', marginBottom: '20px' }}>
            Cannot connect to the server. Please make sure:
          </p>
          <ul style={{ textAlign: 'left', color: '#cccccc', marginBottom: '30px' }}>
            <li>The backend server is running on port 5000</li>
            <li>Run: <code style={{ background: '#333', padding: '2px 6px', borderRadius: '4px' }}>node server.js</code></li>
            <li>Check the server console for errors</li>
          </ul>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: 'linear-gradient(45deg, #ff6b6b, #ff8e8e)',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Retry Connection
          </button>
        </motion.div>
      );
    }

    switch (currentView) {
      case 'roleSelect':
        return (
          <RoleSelection
            title={authType === 'login' ? 'Choose Role to Login' : 'Choose Role to Register'}
            onRoleSelect={handleRoleSelect}
            onClose={() => setCurrentView('home')}
            loading={loading}
            error={error}
          />
        );
      case 'login':
        return (
          <LoginForm
            role={selectedRole}
            onBack={handleBack}
            onSwitchToRegister={handleAuthSwitch}
            onSubmit={handleLogin}
            loading={loading}
            error={error}
          />
        );
      case 'register':
        return (
          <RegisterForm
            role={selectedRole}
            onBack={handleBack}
            onSwitchToLogin={handleAuthSwitch}
            onSubmit={handleRegister}
            loading={loading}
            error={error}
          />
        );
      default:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: 'rgba(15, 15, 35, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: '2px solid rgba(0, 255, 136, 0.3)',
              padding: '60px 40px',
              textAlign: 'center',
              maxWidth: '500px',
              width: '100%',
              color: '#ffffff',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Connection Status Indicator */}
            <div style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.85rem'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: connectionStatus === 'connected' ? '#00ff88' : 
                           connectionStatus === 'checking' ? '#ffa500' : '#ff6b6b'
              }} />
              <span style={{
                color: connectionStatus === 'connected' ? '#00ff88' : 
                       connectionStatus === 'checking' ? '#ffa500' : '#ff6b6b'
              }}>
                {connectionStatus === 'connected' ? 'Connected' : 
                 connectionStatus === 'checking' ? 'Connecting...' : 'Disconnected'}
              </span>
            </div>

            {/* Animated COGNIFY Logo */}
            <motion.h1
              style={{
                fontSize: '3.5rem',
                fontWeight: '900',
                background: 'linear-gradient(45deg, #00ff88, #00a8ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '20px',
                letterSpacing: '3px'
              }}
              animate={{
                textShadow: [
                  '0 0 10px rgba(0, 255, 136, 0.5)',
                  '0 0 30px rgba(0, 255, 136, 0.7)',
                  '0 0 10px rgba(0, 255, 136, 0.5)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              COGNIFY
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{ 
                fontSize: '1.3rem', 
                marginBottom: '15px', 
                color: '#00a8ff',
                fontWeight: '600'
              }}
            >
              Transform Gaming into Learning
            </motion.p>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{ 
                fontSize: '1rem', 
                marginBottom: '40px', 
                color: '#cccccc',
                lineHeight: '1.6'
              }}
            >
              Join thousands of students and educators in our revolutionary learning platform
            </motion.p>

            {/* Show error if any */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: 'rgba(255, 107, 107, 0.1)',
                  border: '1px solid rgba(255, 107, 107, 0.3)',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '20px',
                  color: '#ff6b6b'
                }}
              >
                {error}
              </motion.div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <motion.button
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{ 
                  scale: connectionStatus === 'connected' ? 1.05 : 1, 
                  boxShadow: connectionStatus === 'connected' ? '0 0 30px rgba(0, 255, 136, 0.4)' : 'none',
                  y: connectionStatus === 'connected' ? -3 : 0
                }}
                whileTap={{ scale: connectionStatus === 'connected' ? 0.98 : 1 }}
                onClick={() => {
                  if (connectionStatus === 'connected') {
                    setAuthType('login');
                    setCurrentView('roleSelect');
                  }
                }}
                disabled={connectionStatus !== 'connected' || loading}
                style={{
                  background: connectionStatus === 'connected' ? 
                    'linear-gradient(45deg, #00ff88, #00a8ff)' : 
                    'rgba(100, 100, 100, 0.3)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '16px 32px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: connectionStatus === 'connected' ? '#000' : '#666',
                  cursor: connectionStatus === 'connected' ? 'pointer' : 'not-allowed',
                  width: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                  opacity: loading ? 0.7 : 1
                }}
              >
                <span style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '10px',
                  position: 'relative',
                  zIndex: 2
                }}>
                  <span style={{ fontSize: '1.2rem' }}>
                    {loading ? '⏳' : '🔐'}
                  </span>
                  {loading ? 'Please wait...' : 'Sign In'}
                </span>
                
                {/* Button shine effect */}
                {connectionStatus === 'connected' && !loading && (
                  <motion.div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
                      zIndex: 1
                    }}
                    animate={{ left: ['100%', '-100%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
              </motion.button>

              <motion.button
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                whileHover={{ 
                  scale: connectionStatus === 'connected' ? 1.05 : 1, 
                  boxShadow: connectionStatus === 'connected' ? '0 0 30px rgba(0, 168, 255, 0.4)' : 'none',
                  borderColor: connectionStatus === 'connected' ? 'rgba(0, 168, 255, 0.8)' : 'rgba(100, 100, 100, 0.3)',
                  y: connectionStatus === 'connected' ? -3 : 0
                }}
                whileTap={{ scale: connectionStatus === 'connected' ? 0.98 : 1 }}
                onClick={() => {
                  if (connectionStatus === 'connected') {
                    setAuthType('register');
                    setCurrentView('roleSelect');
                  }
                }}
                disabled={connectionStatus !== 'connected' || loading}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: `2px solid ${connectionStatus === 'connected' ? 'rgba(0, 168, 255, 0.5)' : 'rgba(100, 100, 100, 0.3)'}`,
                  borderRadius: '12px',
                  padding: '16px 32px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: connectionStatus === 'connected' ? '#fff' : '#666',
                  cursor: connectionStatus === 'connected' ? 'pointer' : 'not-allowed',
                  width: '100%',
                  transition: 'all 0.3s ease',
                  opacity: loading ? 0.7 : 1
                }}
              >
                <span style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '10px' 
                }}>
                  <span style={{ fontSize: '1.2rem' }}>🚀</span>
                  Create Account
                </span>
              </motion.button>
            </div>

            {/* Demo Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              style={{ 
                marginTop: '40px', 
                padding: '20px', 
                background: 'rgba(0, 255, 136, 0.1)', 
                borderRadius: '12px', 
                border: '1px solid rgba(0, 255, 136, 0.3)' 
              }}
            >
              <h4 style={{ 
                color: '#00ff88', 
                marginBottom: '15px', 
                fontSize: '1.1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}>
                <span style={{ fontSize: '1.3rem' }}>🎯</span> 
                Try Demo Accounts
              </h4>
              <div style={{ 
                fontSize: '0.85rem', 
                color: '#cccccc', 
                textAlign: 'left',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '8px',
                marginBottom: '15px'
              }}>
                <div><strong style={{ color: '#00ff88' }}>Student:</strong> demo123</div>
                <div><strong style={{ color: '#00a8ff' }}>Teacher:</strong> demo123</div>
                <div><strong style={{ color: '#8c7ae6' }}>School:</strong> demo123</div>
                <div><strong style={{ color: '#ff6b9d' }}>Admin:</strong> demo123</div>
              </div>
              
              {/* Quick Demo Login Buttons */}
              {connectionStatus === 'connected' && (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(2, 1fr)', 
                  gap: '8px',
                  marginTop: '10px'
                }}>
                  {['student', 'teacher', 'school', 'admin'].map((role) => (
                    <button
                      key={role}
                      onClick={() => handleDemoLogin(role)}
                      disabled={loading}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        color: '#fff',
                        fontSize: '0.8rem',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.5 : 1,
                        textTransform: 'capitalize'
                      }}
                    >
                      {loading ? '...' : `Try ${role}`}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Background decoration */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '-40px',
                width: '80px',
                height: '80px',
                background: 'linear-gradient(45deg, rgba(0, 255, 136, 0.1), rgba(0, 168, 255, 0.1))',
                borderRadius: '50%',
                zIndex: -1
              }}
            />
            
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              style={{
                position: 'absolute',
                bottom: '-30px',
                left: '-30px',
                width: '60px',
                height: '60px',
                background: 'linear-gradient(45deg, rgba(0, 168, 255, 0.1), rgba(140, 122, 230, 0.1))',
                borderRadius: '50%',
                zIndex: -1
              }}
            />
          </motion.div>
        );
    }
  };

  return (
    <div className="auth-page-container">
      {/* Animated Background Particles */}
      <div className="floating-particles">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="particle"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
              opacity: Math.random() * 0.5 + 0.1
            }}
            animate={{
              x: [null, Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920)],
              y: [null, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080)],
              opacity: [null, Math.random() * 0.5 + 0.1]
            }}
            transition={{
              duration: Math.random() * 20 + 15,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: "linear"
            }}
            style={{
              position: 'absolute',
              width: Math.random() * 4 + 2 + 'px',
              height: Math.random() * 4 + 2 + 'px',
              borderRadius: '50%',
              background: i % 3 === 0 ? '#00ff88' : i % 3 === 1 ? '#00a8ff' : '#8c7ae6',
              boxShadow: i % 3 === 0 ? '0 0 10px #00ff88' : i % 3 === 1 ? '0 0 10px #00a8ff' : '0 0 10px #8c7ae6'
            }}
          />
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {renderCurrentView()}
      </AnimatePresence>
    </div>
  );
};

export default AuthPage;