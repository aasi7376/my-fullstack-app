// src/components/common/Sidebar.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ items, onItemClick, collapsed = false }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Find active item based on current path
  const activeItemId = items.find(item => 
    location.pathname === item.path || 
    (location.pathname.includes(item.path) && item.path !== '/')
  )?.id || items[0]?.id;

  // Track mouse position for glow effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleItemClick = (item) => {
    if (onItemClick) {
      onItemClick(item.id);
    } else {
      navigate(item.path);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <motion.div
      initial={{ width: isCollapsed ? 80 : 280 }}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="sidebar"
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100vh',
        background: 'rgba(15, 15, 35, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRight: '2px solid rgba(0, 255, 136, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        padding: isCollapsed ? '20px 10px' : '20px',
        zIndex: 100,
        boxShadow: '0 0 30px rgba(0, 0, 0, 0.5), 0 0 50px rgba(0, 255, 136, 0.1)'
      }}
    >
      {/* Mouse Follower Glow Effect */}
      <div
        style={{
          position: 'absolute',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 255, 136, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
          top: mousePosition.y - 75,
          left: mousePosition.x - 75,
          opacity: 0.6,
          zIndex: 0,
          transition: 'all 0.1s linear'
        }}
      />

      {/* Logo Section */}
      <motion.div
        className="sidebar-header"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: isCollapsed ? '0' : '15px',
          marginBottom: '40px',
          justifyContent: isCollapsed ? 'center' : 'flex-start',
        }}
      >
        <motion.div
          whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
          transition={{ duration: 0.5 }}
          style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, #00ff88 0%, #00ffcc 100%)',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            fontWeight: 'bold',
            color: '#111',
            boxShadow: '0 0 20px rgba(0, 255, 136, 0.7), 0 0 30px rgba(0, 255, 136, 0.4), inset 0 0 10px rgba(255, 255, 255, 0.6)'
          }}
        >
          C
        </motion.div>

        <AnimatePresence>
          {!isCollapsed && (
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              style={{
                margin: 0,
                fontSize: '24px',
                fontWeight: '800',
                background: 'linear-gradient(to right, #00ff88, #00ffcc)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 15px rgba(0, 255, 136, 0.7)'
              }}
            >
              COGNIFY
            </motion.h1>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Navigation Items */}
      <div className="sidebar-menu" style={{ flex: 1 }}>
        {items.map((item) => (
          <motion.div
            key={item.id}
            className={`sidebar-item ${activeItemId === item.id ? 'active' : ''}`}
            onClick={() => handleItemClick(item)}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ 
              x: 10, 
              transition: { duration: 0.2 } 
            }}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: isCollapsed ? '0' : '15px',
              padding: isCollapsed ? '15px 0' : '15px 20px',
              margin: '5px 0',
              borderRadius: '14px',
              cursor: 'pointer',
              overflow: 'hidden',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              background: activeItemId === item.id 
                ? 'linear-gradient(135deg, rgba(0, 255, 136, 0.15), rgba(0, 168, 255, 0.1))'
                : 'transparent',
              border: activeItemId === item.id
                ? '1px solid rgba(0, 255, 136, 0.3)'
                : '1px solid transparent',
              boxShadow: activeItemId === item.id
                ? '0 5px 15px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 255, 136, 0.1)'
                : 'none'
            }}
          >
            {/* Background glow effect when hovered */}
            <AnimatePresence>
              {hoveredItem === item.id && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 168, 255, 0.05))',
                    borderRadius: '14px',
                    zIndex: 1
                  }}
                />
              )}
            </AnimatePresence>

            {/* Active item indicator - left side glow bar */}
            {activeItemId === item.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: '80%', opacity: 1 }}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: '10%',
                  width: '3px',
                  borderRadius: '3px',
                  background: 'linear-gradient(to bottom, #00ff88, #00a8ff)',
                  boxShadow: '0 0 8px #00ff88, 0 0 12px rgba(0, 255, 136, 0.5)',
                  zIndex: 2
                }}
              />
            )}

            {/* Icon with neon glow effect */}
            <motion.div
              whileHover={{ scale: 1.2 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'relative',
                zIndex: 3,
                fontSize: isCollapsed ? '20px' : '18px',
                color: activeItemId === item.id ? '#00ff88' : '#ffffff',
                filter: activeItemId === item.id 
                  ? 'drop-shadow(0 0 8px rgba(0, 255, 136, 0.8))' 
                  : hoveredItem === item.id 
                    ? 'drop-shadow(0 0 5px rgba(0, 255, 136, 0.5))'
                    : 'none',
                transition: 'all 0.3s ease'
              }}
            >
              {item.icon}
            </motion.div>

            {/* Item label with animation */}
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: 'relative',
                    zIndex: 3,
                    color: activeItemId === item.id ? '#00ff88' : '#ffffff',
                    fontWeight: activeItemId === item.id ? '600' : '500',
                    fontSize: '15px',
                    textShadow: activeItemId === item.id 
                      ? '0 0 8px rgba(0, 255, 136, 0.5)' 
                      : hoveredItem === item.id 
                        ? '0 0 5px rgba(0, 255, 136, 0.3)'
                        : 'none'
                  }}
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Active item indicator - dot on the right */}
            {activeItemId === item.id && !isCollapsed && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{
                  position: 'absolute',
                  right: '15px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#00ff88',
                  boxShadow: '0 0 8px rgba(0, 255, 136, 0.8)',
                  zIndex: 3
                }}
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* User Section */}
      {user && (
        <motion.div
          className="sidebar-footer"
          style={{
            marginTop: 'auto',
            padding: isCollapsed ? '15px 5px' : '15px 15px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          {isCollapsed ? (
            <motion.div
              whileHover={{ scale: 1.1 }}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #00a8ff, #00ff88)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '16px',
                color: '#111',
                margin: '0 auto',
                boxShadow: '0 0 15px rgba(0, 168, 255, 0.5)'
              }}
            >
              {user.name?.charAt(0) || 'U'}
            </motion.div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #00a8ff, #00ff88)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    color: '#111',
                    boxShadow: '0 0 15px rgba(0, 168, 255, 0.5)'
                  }}
                >
                  {user.name?.charAt(0) || 'U'}
                </motion.div>
                <div>
                  <h3 style={{ 
                    margin: 0, 
                    fontSize: '14px', 
                    fontWeight: '600',
                    color: '#fff' 
                  }}>
                    {user.name}
                  </h3>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '12px', 
                    color: '#00ff88',
                    opacity: 0.8
                  }}>
                    {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0, 255, 136, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                style={{
                  background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.2), rgba(0, 168, 255, 0.1))',
                  border: '1px solid rgba(0, 255, 136, 0.3)',
                  borderRadius: '10px',
                  color: '#00ff88',
                  padding: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  width: '100%',
                  textShadow: '0 0 8px rgba(0, 255, 136, 0.5)'
                }}
              >
                Logout
              </motion.button>
            </div>
          )}
        </motion.div>
      )}

      {/* Collapse/Expand Toggle */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsCollapsed(!isCollapsed)}
        style={{
          position: 'absolute',
          top: '20px',
          right: isCollapsed ? '10px' : '-15px',
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #00ff88, #00a8ff)',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: '14px',
          color: '#111',
          boxShadow: '0 0 15px rgba(0, 255, 136, 0.5), 0 4px 10px rgba(0, 0, 0, 0.2)',
          transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s ease'
        }}
      >
        ◀
      </motion.button>

      {/* Floating particles for decoration */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * (isCollapsed ? 80 : 280), 
              y: Math.random() * 100 + 100, 
              scale: Math.random() * 0.5 + 0.5,
              opacity: Math.random() * 0.5 + 0.3
            }}
            animate={{ 
              y: [null, Math.random() * 100 + 500],
              opacity: [null, 0]
            }}
            transition={{ 
              duration: Math.random() * 20 + 10, 
              repeat: Infinity, 
              ease: "linear",
              delay: Math.random() * 5
            }}
            style={{
              position: 'absolute',
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              background: i % 2 === 0 ? '#00ff88' : '#00a8ff',
              boxShadow: i % 2 === 0 ? '0 0 8px #00ff88' : '0 0 8px #00a8ff',
              zIndex: 0
            }}
          />
        ))}
      </div>

      {/* Global styles for animations */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 1; }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
          
          .sidebar-item {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .sidebar-item:hover {
            transform: translateX(8px);
          }
        `}
      </style>
    </motion.div>
  );
};

export default Sidebar;