// src/components/common/NotificationComponents.js
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

// Notification Bell Icon with Badge
export const NotificationBell = ({ color = '#00ff88', size = 'medium' }) => {
  const { unreadCount } = useNotifications();
  const [showDropdown, setShowDropdown] = useState(false);
  const bellRef = useRef(null);
  
  // Size configurations
  const sizeConfig = {
    small: { bellSize: '1.5rem', badgeSize: '16px', fontSize: '0.6rem', padding: '2px' },
    medium: { bellSize: '1.8rem', badgeSize: '20px', fontSize: '0.7rem', padding: '3px' },
    large: { bellSize: '2.2rem', badgeSize: '24px', fontSize: '0.8rem', padding: '4px' },
  }[size] || { bellSize: '1.8rem', badgeSize: '20px', fontSize: '0.7rem', padding: '3px' };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div ref={bellRef} style={{ position: 'relative' }}>
      <motion.div
        onClick={() => setShowDropdown(!showDropdown)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: 'relative',
          cursor: 'pointer',
          fontSize: sizeConfig.bellSize,
          color: unreadCount > 0 ? color : '#e0e0e0',
          filter: unreadCount > 0 ? `drop-shadow(0 0 5px ${color})` : 'none',
          transition: 'all 0.3s ease'
        }}
        animate={unreadCount > 0 ? {
          rotate: [0, 10, -10, 0],
          scale: [1, 1.1, 1]
        } : {}}
        transition={{ duration: 1.5, repeat: unreadCount > 0 ? Infinity : 0, repeatDelay: 2 }}
      >
        🔔
        
        {/* Notification Badge */}
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              background: '#ff6b9d',
              color: '#fff',
              borderRadius: '50%',
              width: sizeConfig.badgeSize,
              height: sizeConfig.badgeSize,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: sizeConfig.fontSize,
              fontWeight: 'bold',
              padding: sizeConfig.padding,
              boxShadow: '0 0 10px rgba(255, 107, 157, 0.8)'
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.div>
        )}
      </motion.div>
      
      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <NotificationsDropdown onClose={() => setShowDropdown(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

// Notifications Dropdown Component
const NotificationsDropdown = ({ onClose }) => {
  const { notifications, markAsRead, markAllAsRead, loading } = useNotifications();
  const navigate = useNavigate();
  
  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    if (notification.link) {
      navigate(notification.link);
    }
    
    onClose();
  };
  
  const getRelativeTime = (timestamp) => {
    if (!timestamp || !timestamp.toDate) return 'just now';
    
    const now = new Date();
    const notifDate = timestamp.toDate();
    const diffMs = now - notifDate;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffSec < 60) return 'just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    if (diffDay < 7) return `${diffDay}d ago`;
    
    return notifDate.toLocaleDateString();
  };
  
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#ff6b9d';
      case 'medium': return '#ffd700';
      case 'low': return '#00ff88';
      default: return '#00a8ff';
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      style={{
        position: 'absolute',
        top: '45px',
        right: '-15px',
        width: '350px',
        maxHeight: '500px',
        background: 'rgba(15, 15, 35, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        border: '2px solid rgba(0, 168, 255, 0.3)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 30px rgba(0, 168, 255, 0.2)',
        zIndex: 1000,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h3 style={{
          margin: 0,
          color: '#ffffff',
          fontSize: '1.1rem',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ fontSize: '1.2rem' }}>🔔</span>
          Notifications
        </h3>
        
        <motion.button
          onClick={() => markAllAsRead()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: 'rgba(0, 168, 255, 0.1)',
            border: '1px solid rgba(0, 168, 255, 0.3)',
            borderRadius: '8px',
            padding: '6px 12px',
            color: '#00a8ff',
            fontSize: '0.8rem',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Mark all as read
        </motion.button>
      </div>
      
      {/* Notifications List */}
      <div style={{
        overflowY: 'auto',
        maxHeight: '400px',
        padding: '10px'
      }}>
        {loading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '30px'
          }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              style={{
                width: '25px',
                height: '25px',
                border: '3px solid rgba(0, 168, 255, 0.3)',
                borderTop: '3px solid #00a8ff',
                borderRadius: '50%'
              }}
            />
          </div>
        ) : notifications.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
            color: '#cccccc',
            textAlign: 'center'
          }}>
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ fontSize: '2.5rem', marginBottom: '15px' }}
            >
              📭
            </motion.div>
            <p style={{ margin: 0 }}>No notifications yet!</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <motion.div
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ 
                scale: 1.02, 
                x: 5,
                backgroundColor: notification.read ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 168, 255, 0.1)'
              }}
              style={{
                padding: '15px',
                borderRadius: '12px',
                marginBottom: '8px',
                cursor: 'pointer',
                backgroundColor: notification.read ? 'transparent' : 'rgba(0, 168, 255, 0.05)',
                border: notification.read ? '1px solid transparent' : '1px solid rgba(0, 168, 255, 0.2)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Priority Indicator */}
              {notification.priority && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '4px',
                  height: '100%',
                  background: getPriorityColor(notification.priority),
                  boxShadow: `0 0 10px ${getPriorityColor(notification.priority)}`
                }} />
              )}
              
              {/* Unread Indicator */}
              {!notification.read && (
                <motion.div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#00a8ff',
                    boxShadow: '0 0 10px #00a8ff'
                  }}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
              
              <div style={{ display: 'flex', gap: '12px' }}>
                {/* Icon */}
                <div style={{ 
                  fontSize: '1.8rem',
                  lineHeight: 1,
                  filter: `drop-shadow(0 0 5px ${notification.read ? 'rgba(255, 255, 255, 0.3)' : getPriorityColor(notification.priority)})`
                }}>
                  {notification.icon || '🔔'}
                </div>
                
                <div style={{ flex: 1 }}>
                  {/* Title */}
                  <h4 style={{ 
                    margin: '0 0 5px 0', 
                    color: notification.read ? '#e0e0e0' : '#ffffff',
                    fontSize: '1rem',
                    fontWeight: notification.read ? '500' : '600'
                  }}>
                    {notification.title}
                  </h4>
                  
                  {/* Message */}
                  <p style={{ 
                    margin: '0 0 8px 0', 
                    color: notification.read ? '#aaaaaa' : '#cccccc',
                    fontSize: '0.9rem',
                    lineHeight: '1.4'
                  }}>
                    {notification.message}
                  </p>
                  
                  {/* Time and Action Indicator */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ 
                      color: '#888888', 
                      fontSize: '0.8rem' 
                    }}>
                      {getRelativeTime(notification.createdAt)}
                    </span>
                    
                    {notification.actionRequired && (
                      <span style={{ 
                        color: getPriorityColor(notification.priority),
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}>
                        <span style={{ fontSize: '0.9rem' }}>⚡</span>
                        Action Required
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
      
      {/* Footer */}
      <div style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '12px',
        textAlign: 'center'
      }}>
        <motion.button
          onClick={() => navigate('/notifications')}
          whileHover={{ scale: 1.05, color: '#00a8ff' }}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#cccccc',
            fontSize: '0.9rem',
            cursor: 'pointer',
            padding: '5px 10px'
          }}
        >
          View All Notifications
        </motion.button>
      </div>
    </motion.div>
  );
};

// Individual Notification Card for pages (vs dropdown)
export const NotificationCard = ({ notification, onAction }) => {
  const { markAsRead } = useNotifications();
  const navigate = useNavigate();
  
  const getRelativeTime = (timestamp) => {
    if (!timestamp || !timestamp.toDate) return 'just now';
    
    const now = new Date();
    const notifDate = timestamp.toDate();
    const diffMs = now - notifDate;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffSec < 60) return 'just now';
    if (diffMin < 60) return `${diffMin} minutes ago`;
    if (diffHour < 24) return `${diffHour} hours ago`;
    if (diffDay < 7) return `${diffDay} days ago`;
    
    return notifDate.toLocaleDateString();
  };
  
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#ff6b9d';
      case 'medium': return '#ffd700';
      case 'low': return '#00ff88';
      default: return '#00a8ff';
    }
  };
  
  const handleClick = () => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    if (notification.link) {
      navigate(notification.link);
    }
  };
  
  const handleActionClick = (e) => {
    e.stopPropagation();
    if (onAction) {
      onAction(notification);
    }
  };
  
  return (
    <motion.div
      onClick={handleClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        scale: 1.02, 
        boxShadow: `0 10px 30px rgba(0, 0, 0, 0.2), 0 0 20px ${getPriorityColor(notification.priority)}30`
      }}
      style={{
        background: 'rgba(15, 15, 35, 0.8)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '15px',
        cursor: 'pointer',
        border: notification.read 
          ? '1px solid rgba(255, 255, 255, 0.1)' 
          : `1px solid ${getPriorityColor(notification.priority)}50`,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: notification.read 
          ? '0 10px 30px rgba(0, 0, 0, 0.1)' 
          : `0 10px 30px rgba(0, 0, 0, 0.2), 0 0 15px ${getPriorityColor(notification.priority)}30`
      }}
    >
      {/* Priority Indicator */}
      {notification.priority && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '5px',
          height: '100%',
          background: getPriorityColor(notification.priority),
          boxShadow: `0 0 15px ${getPriorityColor(notification.priority)}`
        }} />
      )}
      
      {/* Unread Indicator */}
      {!notification.read && (
        <motion.div
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: getPriorityColor(notification.priority),
            boxShadow: `0 0 10px ${getPriorityColor(notification.priority)}`
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      
      <div style={{ display: 'flex', gap: '15px', paddingLeft: '10px' }}>
        {/* Icon */}
        <motion.div 
          style={{ 
            fontSize: '2.2rem',
            lineHeight: 1,
            filter: `drop-shadow(0 0 5px ${notification.read ? 'rgba(255, 255, 255, 0.3)' : getPriorityColor(notification.priority)})`
          }}
          animate={!notification.read ? {
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          } : {}}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {notification.icon || '🔔'}
        </motion.div>
        
        <div style={{ flex: 1 }}>
          {/* Title */}
          <h3 style={{ 
            margin: '0 0 10px 0', 
            color: notification.read ? '#e0e0e0' : '#ffffff',
            fontSize: '1.2rem',
            fontWeight: notification.read ? '500' : '600'
          }}>
            {notification.title}
          </h3>
          
          {/* Message */}
          <p style={{ 
            margin: '0 0 15px 0', 
            color: notification.read ? '#aaaaaa' : '#cccccc',
            fontSize: '1rem',
            lineHeight: '1.5'
          }}>
            {notification.message}
          </p>
          
          {/* Time and Action Indicator */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ 
              color: '#888888', 
              fontSize: '0.9rem' 
            }}>
              {getRelativeTime(notification.createdAt)}
            </span>
            
            {notification.actionRequired && onAction && (
              <motion.button
                onClick={handleActionClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: `linear-gradient(45deg, ${getPriorityColor(notification.priority)}, ${getPriorityColor(notification.priority)}aa)`,
                  border: 'none',
                  borderRadius: '10px',
                  padding: '8px 15px',
                  color: '#000',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: `0 0 15px ${getPriorityColor(notification.priority)}50`
                }}
              >
                Take Action
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Empty Notifications State Component
export const EmptyNotifications = ({ message = 'No notifications found' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
        background: 'rgba(15, 15, 35, 0.6)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        margin: '20px 0'
      }}
    >
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{ 
          fontSize: '4rem', 
          marginBottom: '20px',
          filter: 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.3))'
        }}
      >
        📭
      </motion.div>
      <h3 style={{
        color: '#ffffff',
        fontSize: '1.5rem',
        fontWeight: '600',
        margin: '0 0 10px 0',
        textAlign: 'center'
      }}>
        All Caught Up!
      </h3>
      <p style={{
        color: '#cccccc',
        fontSize: '1.1rem',
        margin: 0,
        textAlign: 'center',
        maxWidth: '400px'
      }}>
        {message}
      </p>
    </motion.div>
  );
};