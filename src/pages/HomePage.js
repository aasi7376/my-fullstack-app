import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import EnhancedChatbot from '../components/EnhancedChatbot';

const HomePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [showRegisterDropdown, setShowRegisterDropdown] = useState(false);
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
const [showSettingsModal, setShowSettingsModal] = useState(false);
const [showHelpModal, setShowHelpModal] = useState(false);
  // Update date/time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle role selection for auth
  const handleRoleSelection = (role, type) => {
    navigate('/auth', { 
      state: { 
        role: role, 
        authType: type
      } 
    });
    setShowRegisterDropdown(false);
    setShowLoginDropdown(false);
  };

  const handleLogout = () => {
    logout();
  };

  const goToDashboard = () => {
    if (user && user.role) {
      navigate('/dashboard');
    }
  };

  const handleFeedbackSubmit = () => {
    alert(`Thank you for your feedback: ${feedback}`);
    setFeedback('');
    setShowFeedbackModal(false);
  };

  // FIXED: Fixed navigation handler - directly use navigate without try/catch
  // This was causing the issue with the Settings and Help navigation
  const handleNavigation = (path) => {
    navigate(path);
  };

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

  // Updated features with new text content
  const features = [
    {
      icon: '🎮',
      title: 'HANDS-ON PROJECTS',
      description: 'Build practical skills through project-based activities that connect theory to real-world applications.',
      color: '#00ff88'
    },
    {
      icon: '🎯',
      title: 'CUSTOM CURRICULUM',
      description: 'Follow a learning path designed specifically for your goals, interests, and current skill level.',
      color: '#00a8ff'
    },
    {
      icon: '🏆',
      title: 'SKILLS TRACKING',
      description: 'Monitor your progress with detailed skill assessments and milestone tracking throughout your learning journey.',
      color: '#8c7ae6'
    },
    {
      icon: '📊',
      title: 'PROGRESS INSIGHTS',
      description: 'Visualize your learning journey with comprehensive reports that highlight strengths and areas for improvement.',
      color: '#ff6b9d'
    },
    {
      icon: '👥',
      title: 'COMMUNITY FORUMS',
      description: 'Connect with peers to discuss concepts, share resources, and collaborate on challenging problems.',
      color: '#ffd93d'
    },
    {
      icon: '🔒',
      title: 'PRIVACY FOCUSED',
      description: 'Your data is protected with enterprise-grade security and strict privacy controls that put you in charge.',
      color: '#6c5ce7'
    }
  ];

  // Enhanced Auth Dropdown Component
  const AuthDropdown = ({ isOpen, type, onClose }) => {
    if (!isOpen) return null;

    return (
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2000
        }}
        onClick={onClose}
      >
        <div 
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'rgba(10, 10, 10, 0.95)',
            borderRadius: '20px',
            padding: '30px',
            backdropFilter: 'blur(20px)',
            border: '2px solid #00ff88',
            boxShadow: `
              0 0 30px rgba(0, 255, 136, 0.5),
              inset 0 0 20px rgba(0, 255, 136, 0.1)
            `,
            maxWidth: '500px',
            width: '90%',
            fontFamily: "'Inter', sans-serif"
          }}
        >
          <h3 style={{
            color: '#00ff88',
            textAlign: 'center',
            marginBottom: '25px',
            fontSize: '1.8rem',
            fontFamily: "'Poppins', sans-serif",
            fontWeight: '700',
            letterSpacing: '0.5px',
            textShadow: '0 0 15px #00ff88'
          }}>
            Choose Your Role to {type === 'register' ? 'Register' : 'Login'}
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {roleOptions.map((role) => (
              <button
                key={role.id}
                onClick={() => handleRoleSelection(role.id, type)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  padding: '18px 25px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: `2px solid ${role.color}`,
                  borderRadius: '15px',
                  color: '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: `0 0 15px ${role.color}30`,
                  textAlign: 'left',
                  width: '100%',
                  fontFamily: "'Inter', sans-serif"
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = `${role.color}20`;
                  e.target.style.transform = 'translateX(10px) scale(1.02)';
                  e.target.style.boxShadow = `0 0 25px ${role.color}60`;
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.03)';
                  e.target.style.transform = 'translateX(0) scale(1)';
                  e.target.style.boxShadow = `0 0 15px ${role.color}30`;
                }}
              >
                <span style={{ 
                  fontSize: '2.5rem',
                  filter: `drop-shadow(0 0 10px ${role.color})`
                }}>{role.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontWeight: '600', 
                    fontSize: '1.3rem',
                    color: role.color,
                    textShadow: `0 0 10px ${role.color}`,
                    fontFamily: "'Poppins', sans-serif"
                  }}>{role.label}</div>
                  <div style={{ 
                    fontSize: '1rem', 
                    opacity: 0.8,
                    color: '#cccccc',
                    marginTop: '5px',
                    fontWeight: '300',
                    fontFamily: "'Inter', sans-serif"
                  }}>{role.description}</div>
                </div>
                <span style={{ 
                  marginLeft: 'auto', 
                  color: role.color,
                  fontSize: '1.5rem',
                  textShadow: `0 0 10px ${role.color}`,
                  fontFamily: "'Poppins', sans-serif"
                }}>→</span>
              </button>
            ))}
          </div>
          
          <button
            onClick={onClose}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: 'transparent',
              border: '2px solid #ff6b9d',
              borderRadius: '10px',
              color: '#ff6b9d',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto',
              fontFamily: "'Inter', sans-serif",
              fontWeight: '500'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#ff6b9d';
              e.target.style.color = '#000';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#ff6b9d';
            }}
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* FIXED: Add CSS styles in head instead of jsx style tag */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&family=Source+Sans+Pro:wght@300;400;600;700&display=swap');

        @keyframes neonFloat {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
            opacity: 0.3;
          }
          25% { 
            transform: translateY(-15px) rotate(90deg); 
            opacity: 0.7;
          }
          50% { 
            transform: translateY(-25px) rotate(180deg); 
            opacity: 1;
          }
          75% { 
            transform: translateY(-15px) rotate(270deg); 
            opacity: 0.7;
          }
        }

        @keyframes neuralPulse {
          0%, 100% { 
            opacity: 0.3;
            transform: scale(1);
            box-shadow: 0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor;
          }
          50% { 
            opacity: 1;
            transform: scale(1.2);
            box-shadow: 0 0 20px currentColor, 0 0 40px currentColor, 0 0 60px currentColor;
          }
        }

        @keyframes chatbotPulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 30px rgba(0, 255, 136, 0.5), 0 0 60px rgba(0, 255, 136, 0.3);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 40px rgba(0, 255, 136, 0.7), 0 0 80px rgba(0, 255, 136, 0.4);
          }
        }

        @keyframes messageSlideIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes typingDot {
          0%, 60%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          30% {
            transform: scale(1.2);
            opacity: 1;
          }
        }
      `}</style>

      {/* Enhanced Neural Network Background Animation */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 1,
        overflow: 'hidden'
      }}>
        {/* Neural Nodes */}
        {Array.from({length: 12}, (_, i) => (
          <div
            key={`node-${i}`}
            style={{
              position: 'absolute',
              width: '8px',
              height: '8px',
              background: `radial-gradient(circle, #00ff88, transparent)`,
              borderRadius: '50%',
              top: `${15 + (i * 7)}%`,
              left: `${10 + (i * 8)}%`,
              boxShadow: '0 0 20px #00ff88, 0 0 40px #00ff88, 0 0 60px #00ff88',
              animation: `neuralPulse 3s ease-in-out infinite ${i * 0.3}s`
            }}
          />
        ))}
        
        {/* Floating Math Symbols with Neon Effect */}
        {['+', '-', '×', '÷', '=', '%', '∑', '∞', '∆', '∇'].map((symbol, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: `${15 + index * 8}%`,
              left: `${8 + index * 9}%`,
              color: `hsl(${120 + index * 30}, 100%, 60%)`,
              fontSize: `${1.5 + (index % 3) * 0.5}rem`,
              fontFamily: "'Poppins', sans-serif",
              textShadow: `
                0 0 5px currentColor,
                0 0 10px currentColor,
                0 0 15px currentColor,
                0 0 20px currentColor
              `,
              animation: `neonFloat 6s ease-in-out infinite ${index * 0.4}s`
            }}
          >
            {symbol}
          </div>
        ))}
      </div>

      {/* Enhanced Sidebar with Toggle Button */}
      <div 
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          width: sidebarCollapsed ? '80px' : '280px',
          background: 'rgba(10, 10, 10, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRight: '2px solid #00ff88',
          boxShadow: `
            inset 0 0 20px rgba(0, 255, 136, 0.1),
            0 0 30px rgba(0, 255, 136, 0.3)
          `,
          padding: '20px',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.3s ease',
          fontFamily: "'Inter', sans-serif"
        }}
      >
        {/* Sidebar Toggle Button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          style={{
            position: 'absolute',
            top: '20px',
            right: '-15px',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #00ff88, #00d970)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000',
            fontSize: '1rem',
            fontWeight: 'bold',
            fontFamily: "'Inter', sans-serif",
            boxShadow: '0 0 15px rgba(0, 255, 136, 0.5)',
            transition: 'all 0.3s ease',
            zIndex: 1001
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.boxShadow = '0 0 20px rgba(0, 255, 136, 0.7)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 0 15px rgba(0, 255, 136, 0.5)';
          }}
        >
          {sidebarCollapsed ? '→' : '←'}
        </button>

        {/* Enhanced Logo */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: sidebarCollapsed ? '0' : '15px',
            marginBottom: '30px',
            padding: '15px',
            background: 'rgba(0, 255, 136, 0.05)',
            borderRadius: '15px',
            border: '2px solid #00ff88',
            boxShadow: `
              0 0 20px rgba(0, 255, 136, 0.3),
              inset 0 0 20px rgba(0, 255, 136, 0.1)
            `,
            justifyContent: sidebarCollapsed ? 'center' : 'flex-start'
          }}
        >
          <div 
            style={{
              width: '50px',
              height: '50px',
              background: 'linear-gradient(135deg, #00ff88, #00a8ff)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000',
              fontWeight: 'bold',
              fontSize: '1.5rem',
              fontFamily: "'Poppins', sans-serif",
              boxShadow: `
                0 0 20px rgba(0, 255, 136, 0.5),
                0 0 40px rgba(0, 255, 136, 0.3)
              `
            }}
          >
            C
          </div>
          {!sidebarCollapsed && (
            <h2 
              style={{ 
                color: '#00ff88', 
                margin: 0, 
                fontSize: '1.8rem',
                fontWeight: '700',
                fontFamily: "'Poppins', sans-serif",
                letterSpacing: '1px',
                textShadow: `
                  0 0 10px #00ff88,
                  0 0 20px #00ff88,
                  0 0 30px #00ff88
                `
              }}
            >
              COGNIFY
            </h2>
          )}
        </div>

        {/* Animated Date & Time */}
        {!sidebarCollapsed && (
          <div 
            style={{
              background: 'rgba(0, 168, 255, 0.05)',
              border: '2px solid #00a8ff',
              borderRadius: '15px',
              padding: '20px',
              marginBottom: '25px',
              textAlign: 'center',
              boxShadow: `
                0 0 20px rgba(0, 168, 255, 0.3),
                inset 0 0 20px rgba(0, 168, 255, 0.1)
              `
            }}
          >
            <div style={{ 
              color: '#00a8ff', 
              fontSize: '1.1rem', 
              fontWeight: 'bold',
              fontFamily: "'Inter', sans-serif",
              textShadow: `0 0 10px #00a8ff, 0 0 20px #00a8ff`
            }}>
              {currentDateTime.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            <div style={{ 
              color: '#ffffff', 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              marginTop: '5px',
              fontFamily: "'Poppins', sans-serif",
              letterSpacing: '1px',
              textShadow: `0 0 10px #ffffff, 0 0 20px #00a8ff`
            }}>
              {currentDateTime.toLocaleTimeString('en-US', {
                hour12: true,
                hour: 'numeric',
                minute: '2-digit',
                second: '2-digit'
              })}
            </div>
          </div>
        )}

        {/* FIXED: Enhanced Navigation with Direct Event Handlers */}
        <nav style={{ flex: 1 }}>
          {[
            { id: 'home', label: 'Home', icon: '🏠', color: '#00ff88', path: '/' },
            { id: 'settings', label: 'Settings', icon: '⚙️', color: '#00a8ff', path: '/settings' },
            { id: 'help', label: 'Help', icon: '❓', color: '#8c7ae6', path: '/help' },
            { id: 'contact', label: 'Contact Us', icon: '📞', color: '#ff6b9d', path: '/contact' }
          ].map((item) => (
            <button
              key={item.id}
              // FIXED: Direct navigation without using handleNavigation function
              onClick={() => navigate(item.path)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: sidebarCollapsed ? '0' : '15px',
                width: '100%',
                padding: '15px 20px',
                margin: '5px 0',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '2px solid transparent',
                borderRadius: '12px',
                color: '#cccccc',
                fontSize: '1.1rem',
                fontFamily: "'Inter', sans-serif",
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = `rgba(${item.color === '#00ff88' ? '0, 255, 136' : 
                  item.color === '#00a8ff' ? '0, 168, 255' : 
                  item.color === '#8c7ae6' ? '140, 122, 230' : '255, 107, 157'}, 0.1)`;
                e.target.style.borderColor = item.color;
                e.target.style.color = item.color;
                e.target.style.transform = sidebarCollapsed ? 'scale(1.05)' : 'translateX(15px) scale(1.05)';
                e.target.style.boxShadow = `0 0 25px ${item.color}50`;
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.02)';
                e.target.style.borderColor = 'transparent';
                e.target.style.color = '#cccccc';
                e.target.style.transform = 'translateX(0) scale(1)';
                e.target.style.boxShadow = 'none';
              }}
              title={sidebarCollapsed ? item.label : ''}
            >
              <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
              {!sidebarCollapsed && item.label}
            </button>
          ))}
        </nav>

        {/* Enhanced User Section */}
        {user ? (
          <div style={{
            background: 'rgba(0, 255, 136, 0.05)',
            border: '2px solid #00ff88',
            borderRadius: '15px',
            padding: '20px',
            marginTop: '20px',
            boxShadow: `0 0 20px rgba(0, 255, 136, 0.3)`
          }}>
            {!sidebarCollapsed ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    background: 'linear-gradient(135deg, #00ff88, #00d970)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#000',
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    fontFamily: "'Inter', sans-serif",
                    boxShadow: `0 0 15px rgba(0, 255, 136, 0.5)`
                  }}>
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div style={{ 
                      color: '#ffffff', 
                      fontWeight: 'bold',
                      fontFamily: "'Inter', sans-serif" 
                    }}>{user.name}</div>
                    <div style={{ 
                      color: '#00ff88', 
                      fontSize: '0.9rem',
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: '300'
                    }}>
                      {user.role?.charAt(0)?.toUpperCase() + user.role?.slice(1)}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={goToDashboard}
                    style={{
                      flex: 1,
                      padding: '10px 15px',
                      background: 'linear-gradient(135deg, #00ff88, #00d970)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#000',
                      fontWeight: 'bold',
                      fontFamily: "'Inter', sans-serif",
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    style={{
                      flex: 1,
                      padding: '10px 15px',
                      background: 'transparent',
                      border: '2px solid #ff6b9d',
                      borderRadius: '8px',
                      color: '#ff6b9d',
                      fontWeight: 'bold',
                      fontFamily: "'Inter', sans-serif",
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #00ff88, #00d970)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#000',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  fontFamily: "'Inter', sans-serif",
                  boxShadow: `0 0 15px rgba(0, 255, 136, 0.5)`,
                  margin: '0 auto'
                }}>
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              </div>
            )}
          </div>
        ) : (
          !sidebarCollapsed && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '2px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '15px',
              padding: '20px',
              textAlign: 'center',
              marginTop: '20px'
            }}>
              <p style={{ 
                color: '#cccccc', 
                margin: '0 0 15px 0',
                fontFamily: "'Inter', sans-serif",
                fontWeight: '300'
              }}>
                Please login to access your dashboard
              </p>
            </div>
          )
        )}
      </div>

      {/* Main Content */}
      <div style={{ marginLeft: sidebarCollapsed ? '80px' : '280px', minHeight: '100vh', transition: 'margin-left 0.3s ease' }}>
        {/* Enhanced Top Navbar with Auth Buttons */}
        <nav 
          style={{
            background: 'rgba(10, 10, 10, 0.95)',
            backdropFilter: 'blur(20px)',
            borderBottom: '2px solid #00ff88',
            boxShadow: `0 0 20px rgba(0, 255, 136, 0.3)`,
            padding: '15px 40px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '20px',
            position: 'relative',
            fontFamily: "'Inter', sans-serif"
          }}
        >
          {/* Welcome Message */}
         <div style={{ 
            color: '#ffffff', 
            fontSize: '1.2rem',
            fontFamily: "'Inter', sans-serif",
            fontWeight: '500'
          }}>
            {user ? `Welcome back, ${user.name}!` : 'Welcome to Cognify'}
          </div>

          {/* Auth Buttons for Non-Logged Users */}
          {!user && (
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <button
                onClick={() => setShowRegisterDropdown(true)}
                style={{
                  padding: '12px 25px',
                  background: 'linear-gradient(135deg, #00ff88, #00d970)',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#000',
                  fontWeight: 'bold',
                  fontFamily: "'Inter', sans-serif",
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: `0 0 20px rgba(0, 255, 136, 0.4)`
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px) scale(1.05)';
                  e.target.style.boxShadow = `0 8px 25px rgba(0, 255, 136, 0.6)`;
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = `0 0 20px rgba(0, 255, 136, 0.4)`;
                }}
              >
                <span>✨ Register</span>
                <span style={{
                  transform: showRegisterDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease'
                }}>▼</span>
              </button>
              
              <button
                onClick={() => setShowLoginDropdown(true)}
                style={{
                  padding: '12px 25px',
                  background: 'transparent',
                  border: '2px solid #00a8ff',
                  borderRadius: '10px',
                  color: '#00a8ff',
                  fontWeight: 'bold',
                  fontFamily: "'Inter', sans-serif",
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: `0 0 15px rgba(0, 168, 255, 0.3)`
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #00a8ff, #0078d4)';
                  e.target.style.color = '#000';
                  e.target.style.transform = 'translateY(-2px) scale(1.05)';
                  e.target.style.boxShadow = `0 8px 25px rgba(0, 168, 255, 0.6)`;
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#00a8ff';
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = `0 0 15px rgba(0, 168, 255, 0.3)`;
                }}
              >
                <span>🔑 Login</span>
                <span style={{
                  transform: showLoginDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease'
                }}>▼</span>
              </button>
            </div>
          )}

          {/* User Actions for Logged Users */}
          {user && (
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <button
                onClick={goToDashboard}
                style={{
                  padding: '12px 25px',
                  background: 'linear-gradient(135deg, #00ff88, #00d970)',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#000',
                  fontWeight: 'bold',
                  fontFamily: "'Inter', sans-serif",
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px) scale(1.05)';
                  e.target.style.boxShadow = `0 8px 25px rgba(0, 255, 136, 0.6)`;
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                📊 Dashboard
              </button>
              
              <button
                onClick={handleLogout}
                style={{
                  padding: '12px 25px',
                  background: 'transparent',
                  border: '2px solid #ff6b9d',
                  borderRadius: '10px',
                  color: '#ff6b9d',
                  fontWeight: 'bold',
                  fontFamily: "'Inter', sans-serif",
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#ff6b9d';
                  e.target.style.color = '#000';
                  e.target.style.transform = 'translateY(-2px) scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#ff6b9d';
                  e.target.style.transform = 'translateY(0) scale(1)';
                }}
              >
                🚪 Logout
              </button>
            </div>
          )}
        </nav>

        {/* Enhanced Welcome Section */}
        <section style={{
          padding: '80px 40px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 10
        }}>
          <h1 style={{
            fontSize: '4.5rem',
            fontWeight: '800',
            fontFamily: "'Poppins', sans-serif",
            color: '#ffffff',
            marginBottom: '20px',
            lineHeight: '1.2',
            letterSpacing: '1px',
            textShadow: `
              0 0 10px rgba(0, 255, 136, 0.8),
              0 0 20px rgba(0, 255, 136, 0.6),
              0 0 30px rgba(0, 255, 136, 0.4)
            `
          }}>
            Welcome to Cognify
          </h1>
          
          <p style={{
            fontSize: '1.6rem',
            fontFamily: "'Inter', sans-serif",
            fontWeight: '300',
            color: '#ffffff',
            maxWidth: '800px',
            margin: '0 auto 60px auto',
            lineHeight: '1.6',
            opacity: 0.9
          }}>
            Transform education through innovative learning games and personalized experiences. 
            Our platform makes learning engaging, fun, and effective for students of all ages.
          </p>

          {/* Show CTA buttons only for non-logged users */}
          {!user && (
            <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', marginBottom: '80px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setShowRegisterDropdown(true)}
                style={{
                  padding: '20px 45px',
                  background: 'linear-gradient(135deg, #00ff88, #00d970)',
                  border: 'none',
                  borderRadius: '15px',
                  color: '#000',
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  fontFamily: "'Poppins', sans-serif",
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  boxShadow: `0 0 30px rgba(0, 255, 136, 0.4)`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-5px) scale(1.05)';
                  e.target.style.boxShadow = `0 15px 40px rgba(0, 255, 136, 0.6)`;
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = `0 0 30px rgba(0, 255, 136, 0.4)`;
                }}
              >
                🚀 Get Started Free
              </button>
              
              <button
                onClick={() => setShowLoginDropdown(true)}
                style={{
                  padding: '20px 45px',
                  background: 'transparent',
                  border: '3px solid #00a8ff',
                  borderRadius: '15px',
                  color: '#00a8ff',
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  fontFamily: "'Poppins', sans-serif",
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  boxShadow: `0 0 25px rgba(0, 168, 255, 0.3)`,
                  textShadow: '0 0 15px #00a8ff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #00a8ff, #0078d4)';
                  e.target.style.color = '#000';
                  e.target.style.transform = 'translateY(-5px) scale(1.05)';
                  e.target.style.boxShadow = `0 15px 40px rgba(0, 168, 255, 0.6)`;
                  e.target.style.textShadow = '0 0 5px rgba(0, 0, 0, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#00a8ff';
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = `0 0 25px rgba(0, 168, 255, 0.3)`;
                  e.target.style.textShadow = '0 0 15px #00a8ff';
                }}
              >
                📚 Learn More
              </button>
            </div>
          )}

          {/* For logged users, show dashboard CTA */}
          {user && (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '80px' }}>
              <button
                onClick={goToDashboard}
                style={{
                  padding: '20px 45px',
                  background: 'linear-gradient(135deg, #00ff88, #00d970)',
                  border: 'none',
                  borderRadius: '15px',
                  color: '#000',
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  fontFamily: "'Poppins', sans-serif",
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  boxShadow: `0 0 30px rgba(0, 255, 136, 0.4)`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-5px) scale(1.05)';
                  e.target.style.boxShadow = `0 15px 40px rgba(0, 255, 136, 0.6)`;
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = `0 0 30px rgba(0, 255, 136, 0.4)`;
                }}
              >
                📊 Go to Dashboard
              </button>
            </div>
          )}
        </section>

        {/* Features Section with Updated Font Styles */}
        <section style={{
          padding: '60px 40px',
          background: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(10px)'
        }}>
          <h2 style={{
            fontSize: '3rem',
            color: '#ffffff',
            fontFamily: "'Poppins', sans-serif",
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '60px',
            letterSpacing: '3px',
            background: 'linear-gradient(135deg, #00ff88, #00a8ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 10px rgba(0, 255, 136, 0.3)'
          }}>
            LEARNING TOOLS
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '30px',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {features.map((feature, index) => (
              <div
                key={index}
                style={{
                  padding: '30px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '20px',
                  border: `2px solid ${feature.color}60`,
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  boxShadow: `0 0 20px ${feature.color}30`
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-10px)';
                  e.target.style.background = `${feature.color}15`;
                  e.target.style.borderColor = `${feature.color}`;
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.03)';
                  e.target.style.borderColor = `${feature.color}60`;
                }}
              >
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: `linear-gradient(135deg, ${feature.color}, ${feature.color}aa)`,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.5rem',
                  marginBottom: '20px'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  color: feature.color,
                  fontSize: '1.6rem',
                  fontFamily: "'Source Sans Pro', sans-serif",
                  fontWeight: '600',
                  letterSpacing: '0.5px',
                  marginBottom: '15px',
                  textShadow: `0 0 10px ${feature.color}`
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  color: '#cccccc',
                  fontSize: '1.05rem',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: '300',
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer style={{
          background: 'rgba(15, 25, 35, 0.95)',
          backdropFilter: 'blur(20px)',
          borderTop: '2px solid rgba(0, 255, 136, 0.3)',
          padding: '60px 40px 40px 40px',
          fontFamily: "'Inter', sans-serif"
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '60px',
            alignItems: 'start'
          }}>
            {/* About Us */}
            <div>
              <h3 style={{
                color: '#00ff88',
                fontSize: '2rem',
                fontFamily: "'Poppins', sans-serif",
                fontWeight: '700',
                letterSpacing: '1px',
                marginBottom: '20px'
              }}>
                About Cognify
              </h3>
              <p style={{
                color: '#cccccc',
                fontSize: '1.1rem',
                fontFamily: "'Inter', sans-serif",
                fontWeight: '300',
                lineHeight: '1.8',
                marginBottom: '30px'
              }}>
                Cognify is a revolutionary educational platform that transforms traditional learning through 
                project-based activities, personalized curriculums, and comprehensive skills tracking. We believe that education 
                should be engaging, accessible, and effective for every learner.
              </p>
              <p style={{
                color: '#00a8ff',
                fontSize: '1rem',
                fontFamily: "'Inter', sans-serif",
                fontWeight: '400',
                fontStyle: 'italic'
              }}>
                "Empowering minds, one project at a time."
              </p>
            </div>

            {/* Feedback Section */}
            <div>
              <h3 style={{
                color: '#00a8ff',
                fontSize: '1.8rem',
                fontFamily: "'Poppins', sans-serif",
                fontWeight: '700',
                letterSpacing: '1px',
                marginBottom: '20px'
              }}>
                Share Your Feedback
              </h3>
              <p style={{
                color: '#cccccc',
                fontSize: '1rem',
                fontFamily: "'Inter', sans-serif",
                fontWeight: '300',
                marginBottom: '20px'
              }}>
                Help us improve Cognify by sharing your thoughts and suggestions.
              </p>
              <button
                onClick={() => setShowFeedbackModal(true)}
                style={{
                  padding: '15px 30px',
                  background: 'linear-gradient(135deg, #8c7ae6, #7b68ee)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  fontFamily: "'Inter', sans-serif",
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 10px 25px rgba(140, 122, 230, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                📝 Write Feedback
              </button>
            </div>
          </div>
{/* Settings Page Div Section*/}
<div>
  <h3 style={{
    color: '#00a8ff',
    fontSize: '1.8rem',
    fontFamily: "'Poppins', sans-serif",
    fontWeight: '700',
    letterSpacing: '1px',
    marginBottom: '20px'
  }}>
    Settings
  </h3>
  <p style={{
    color: '#cccccc',
    fontSize: '1rem',
    fontFamily: "'Inter', sans-serif",
    fontWeight: '300',
    marginBottom: '20px'
  }}>
    Customize your Cognify experience and manage your preferences.
  </p>
  <button
    onClick={() => setShowSettingsModal(true)}
    style={{
      padding: '15px 30px',
      background: 'linear-gradient(135deg, #2ecc71, #27ae60)',
      border: 'none',
      borderRadius: '12px',
      color: '#ffffff',
      fontSize: '1.1rem',
      fontWeight: 'bold',
      fontFamily: "'Inter', sans-serif",
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    }}
    onMouseEnter={(e) => {
      e.target.style.transform = 'translateY(-3px)';
      e.target.style.boxShadow = '0 10px 25px rgba(46, 204, 113, 0.4)';
    }}
    onMouseLeave={(e) => {
      e.target.style.transform = 'translateY(0)';
      e.target.style.boxShadow = 'none';
    }}
  >
    ⚙️ Open Settings
  </button>
</div>

{/* Help Page Div Section*/}
<div>
  <h3 style={{
    color: '#00a8ff',
    fontSize: '1.8rem',
    fontFamily: "'Poppins', sans-serif",
    fontWeight: '700',
    letterSpacing: '1px',
    marginBottom: '20px'
  }}>
    Help & Support
  </h3>
  <p style={{
    color: '#cccccc',
    fontSize: '1rem',
    fontFamily: "'Inter', sans-serif",
    fontWeight: '300',
    marginBottom: '20px'
  }}>
    Get assistance, find answers, and learn more about using Cognify effectively.
  </p>
  <button
    onClick={() => setShowHelpModal(true)}
    style={{
      padding: '15px 30px',
      background: 'linear-gradient(135deg, #3498db, #2980b9)',
      border: 'none',
      borderRadius: '12px',
      color: '#ffffff',
      fontSize: '1.1rem',
      fontWeight: 'bold',
      fontFamily: "'Inter', sans-serif",
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    }}
    onMouseEnter={(e) => {
      e.target.style.transform = 'translateY(-3px)';
      e.target.style.boxShadow = '0 10px 25px rgba(52, 152, 219, 0.4)';
    }}
    onMouseLeave={(e) => {
      e.target.style.transform = 'translateY(0)';
      e.target.style.boxShadow = 'none';
    }}
  >
    ❓ Get Help
  </button>
</div>
          {/* Copyright */}
          <div style={{
            textAlign: 'center',
            marginTop: '40px',
            paddingTop: '30px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#888',
            fontSize: '1rem',
            fontFamily: "'Inter', sans-serif",
            fontWeight: '300'
          }}>
            © {new Date().getFullYear()} Cognify. All rights reserved. | Made with ❤️ for better education.
          </div>
        </footer>
      </div>

      {/* Enhanced Chatbot - Replaced the old chatbot with the new EnhancedChatbot component */}
      <EnhancedChatbot />

      {/* Auth Dropdowns */}
      <AuthDropdown 
        isOpen={showRegisterDropdown} 
        type="register" 
        onClose={() => setShowRegisterDropdown(false)}
      />
      
      <AuthDropdown 
        isOpen={showLoginDropdown} 
        type="login" 
        onClose={() => setShowLoginDropdown(false)}
      />

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 3000
          }}
          onClick={() => setShowFeedbackModal(false)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'rgba(20, 30, 40, 0.95)',
              borderRadius: '20px',
              padding: '40px',
              backdropFilter: 'blur(20px)',
              border: '2px solid rgba(140, 122, 230, 0.5)',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 0 30px rgba(140, 122, 230, 0.3)',
              fontFamily: "'Inter', sans-serif"
            }}
          >
            <h3 style={{
              color: '#8c7ae6',
              textAlign: 'center',
              marginBottom: '25px',
              fontSize: '1.8rem',
              fontFamily: "'Poppins', sans-serif",
              fontWeight: '700',
              letterSpacing: '1px',
              textShadow: '0 0 15px #8c7ae6'
            }}>
              Share Your Feedback
            </h3>
            
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us what you think about Cognify..."
              style={{
                width: '100%',
                height: '120px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '2px solid rgba(140, 122, 230, 0.3)',
                borderRadius: '12px',
                padding: '15px',
                color: '#ffffff',
                fontSize: '1rem',
                fontFamily: "'Inter', sans-serif",
                fontWeight: '300',
                resize: 'vertical',
                marginBottom: '25px',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#8c7ae6';
                e.target.style.boxShadow = '0 0 15px rgba(140, 122, 230, 0.3)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(140, 122, 230, 0.3)';
                e.target.style.boxShadow = 'none';
              }}
            />
            
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button
                onClick={handleFeedbackSubmit}
                disabled={!feedback.trim()}
                style={{
                  padding: '12px 30px',
                  background: feedback.trim() ? 'linear-gradient(135deg, #8c7ae6, #7b68ee)' : '#666',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#ffffff',
                  fontWeight: 'bold',
                  fontFamily: "'Inter', sans-serif",
                  cursor: feedback.trim() ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s ease',
                  fontSize: '1rem'
                }}
                onMouseEnter={(e) => {
                  if (feedback.trim()) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 5px 15px rgba(140, 122, 230, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                Submit Feedback
              </button>
              
              <button
                onClick={() => setShowFeedbackModal(false)}
                style={{
                  padding: '12px 30px',
                  background: 'transparent',
                  border: '2px solid #ff6b9d',
                  borderRadius: '10px',
                  color: '#ff6b9d',
                  fontWeight: 'bold',
                  fontFamily: "'Inter', sans-serif",
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '1rem'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#ff6b9d';
                  e.target.style.color = '#000';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 5px 15px rgba(255, 107, 157, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#ff6b9d';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;