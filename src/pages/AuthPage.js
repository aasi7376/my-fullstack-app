// src/pages/AuthPage.js - FIXED with proper onSubmit handlers
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/forms/LoginForm';
import RegisterForm from '../components/forms/RegisterForm';

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // ⭐ FIXED: Get both user and login/register functions from AuthContext
  const { user, login, register } = useAuth();
  
  console.log('🔍 AuthPage - Location state:', location.state);
  
  // Extract role and authType from location state if available
  const initialRole = location.state?.role || 'student';
  const initialAuthType = location.state?.authType || 'register';
  
  // Set state based on location or defaults
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [authType, setAuthType] = useState(initialAuthType);
  const [showRoleSelection, setShowRoleSelection] = useState(!initialRole);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Update state when location changes
  useEffect(() => {
    console.log('📍 Location state changed:', location.state);
    
    if (location.state?.role) {
      setSelectedRole(location.state.role);
      setShowRoleSelection(false); // Hide role selection and show the form
    }
    
    if (location.state?.authType) {
      setAuthType(location.state.authType);
    }
  }, [location.state]);

  // Mouse tracking for animations
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // ⭐ CRITICAL FIX: Add login submit handler that calls AuthContext
  const handleLoginSubmit = async (loginData) => {
    console.log('🔄 AuthPage calling AuthContext login...');
    try {
      const result = await login(loginData);
      console.log('✅ AuthContext login result:', result);
      return result;
    } catch (error) {
      console.error('❌ AuthPage login error:', error);
      throw error;
    }
  };

  // ⭐ CRITICAL FIX: Add register submit handler that calls AuthContext
  const handleRegisterSubmit = async (registerData) => {
    console.log('🔄 AuthPage calling AuthContext register...');
    try {
      const result = await register(registerData);
      console.log('✅ AuthContext register result:', result);
      return result;
    } catch (error) {
      console.error('❌ AuthPage register error:', error);
      throw error;
    }
  };

  // Role configurations
  const roleOptions = [
    { 
      id: 'admin', 
      label: 'System Admin', 
      icon: '⚙️', 
      color: '#ff6b9d',
      description: 'Manage the entire platform'
    },
    { 
      id: 'school', 
      label: 'School Admin', 
      icon: '🏫', 
      color: '#8c7ae6',
      description: 'Manage your institution'
    },
    { 
      id: 'teacher', 
      label: 'Teacher', 
      icon: '👨‍🏫', 
      color: '#00a8ff',
      description: 'Empower your students'
    },
    { 
      id: 'student', 
      label: 'Student', 
      icon: '👨‍🎓', 
      color: '#00ff88',
      description: 'Learn through games'
    }
  ];

  // Role Selection Screen
  const RoleSelectionScreen = () => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '24px',
      maxWidth: '900px',
      width: '100%',
      padding: '20px'
    }}>
      <div style={{
        gridColumn: '1 / -1',
        textAlign: 'center',
        marginBottom: '20px'
      }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: '900',
          background: 'linear-gradient(135deg, #00ff88, #00a8ff, #8c7ae6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: 0,
          marginBottom: '12px',
          textShadow: '0 0 30px #00ff8860'
        }}>
          Join Cognify
        </h1>
        <p style={{
          color: '#cccccc',
          fontSize: '1.2rem',
          margin: 0,
          fontWeight: '500'
        }}>
          Choose your role to {authType === 'register' ? 'get started' : 'sign in'}
        </p>
      </div>

      {roleOptions.map((role) => (
        <div
          key={role.id}
          onClick={() => {
            console.log(`Selected role: ${role.id}`);
            setSelectedRole(role.id);
            setShowRoleSelection(false);
          }}
          style={{
            background: 'rgba(15, 15, 35, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: `2px solid ${role.color}40`,
            padding: '32px',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
            e.currentTarget.style.boxShadow = `0 20px 40px ${role.color}30, 0 0 60px ${role.color}20`;
            e.currentTarget.style.borderColor = role.color;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
            e.currentTarget.style.borderColor = `${role.color}40`;
          }}
        >
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '200%',
            height: '200%',
            background: `radial-gradient(circle, ${role.color}10 0%, transparent 70%)`,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none'
          }} />

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            position: 'relative',
            zIndex: 2
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: `linear-gradient(135deg, ${role.color}, ${role.color}cc)`,
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              marginBottom: '20px',
              boxShadow: `0 8px 32px ${role.color}40`
            }}>
              {role.icon}
            </div>

            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#ffffff',
              margin: 0,
              marginBottom: '8px',
              textShadow: `0 0 10px ${role.color}60`
            }}>
              {role.label}
            </h3>

            <p style={{
              color: '#cccccc',
              fontSize: '0.9rem',
              margin: 0,
              marginBottom: '16px',
              lineHeight: '1.4'
            }}>
              {role.description}
            </p>

            <div style={{
              background: `${role.color}20`,
              color: role.color,
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              border: `1px solid ${role.color}40`
            }}>
              {authType === 'register' ? 'Register' : 'Sign In'}
            </div>
          </div>
        </div>
      ))}

      <div style={{
        gridColumn: '1 / -1',
        textAlign: 'center',
        marginTop: '20px'
      }}>
        <p style={{ color: '#cccccc', fontSize: '1rem', margin: 0 }}>
          {authType === 'register' ? 'Already have an account?' : 'Need an account?'}{' '}
          <span 
            onClick={() => setAuthType(authType === 'register' ? 'login' : 'register')}
            style={{ 
              color: '#00a8ff', 
              cursor: 'pointer', 
              textDecoration: 'underline',
              fontWeight: '600'
            }}
          >
            {authType === 'register' ? 'Sign In' : 'Register'}
          </span>
        </p>
      </div>
    </div>
  );

  // Dynamic Background Component
  const DynamicBackground = () => {
    const gradientStyle = {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a35 100%)',
      zIndex: -2
    };

    const particleCount = 30;
    const particles = Array.from({ length: particleCount }).map((_, i) => {
      const size = Math.random() * 300 + 50;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const hue = Math.random() * 60 + 200; // Blues and purples
      const delay = Math.random() * 10;
      const duration = Math.random() * 20 + 15;

      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: `${y}%`,
            left: `${x}%`,
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: '50%',
            background: `radial-gradient(circle, hsla(${hue}, 80%, 60%, 0.03) 0%, transparent 70%)`,
            transform: 'translate(-50%, -50%)',
            animation: `pulse ${duration}s ease-in-out ${delay}s infinite alternate`,
            zIndex: -1
          }}
        />
      );
    });

    const cursorHighlight = {
      position: 'fixed',
      top: mousePosition.y,
      left: mousePosition.x,
      width: '400px',
      height: '400px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(0, 168, 255, 0.08) 0%, transparent 70%)',
      transform: 'translate(-50%, -50%)',
      transition: 'all 0.1s ease-out',
      pointerEvents: 'none',
      zIndex: -1
    };

    return (
      <>
        <div style={gradientStyle} />
        {particles}
        <div style={cursorHighlight} />
        <style>
          {`
            @keyframes pulse {
              0% { opacity: 0.3; transform: translate(-50%, -50%) scale(0.8); }
              100% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.2); }
            }
          `}
        </style>
      </>
    );
  };

  // Main Render
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'Inter, system-ui, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <DynamicBackground />
      
      {showRoleSelection ? (
        <RoleSelectionScreen />
      ) : (
        authType === 'login' ? (
          <LoginForm 
            role={selectedRole} 
            onBack={() => setShowRoleSelection(true)} 
            onSwitchToRegister={() => setAuthType('register')}
            onSubmit={handleLoginSubmit} // ⭐ CRITICAL FIX: Pass the login handler
          />
        ) : (
          <RegisterForm 
            role={selectedRole} 
            onBack={() => setShowRoleSelection(true)} 
            onSwitchToLogin={() => setAuthType('login')}
            onSubmit={handleRegisterSubmit} // ⭐ CRITICAL FIX: Pass the register handler
          />
        )
      )}

      {/* Debug panel for development only - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          position: 'fixed',
          bottom: '10px',
          left: '10px',
          background: 'rgba(0, 0, 0, 0.7)',
          padding: '10px',
          borderRadius: '8px',
          fontSize: '12px',
          color: '#00ff88',
          zIndex: 1000
        }}>
          <div>🔍 Role: {selectedRole || 'None'}</div>
          <div>🔑 Auth Type: {authType}</div>
          <div>🚩 Show Selection: {showRoleSelection.toString()}</div>
          <div>📍 Location: {location.pathname}</div>
          <div>📦 State: {JSON.stringify(location.state || {})}</div>
          <div>👤 User: {user ? `✅ ${user.email}` : '❌ Not logged in'}</div>
        </div>
      )}
    </div>
  );
};

export default AuthPage;