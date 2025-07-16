// src/components/admin/AdminNotificationsPanel.js
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../../context/NotificationContext';

const AdminNotificationsPanel = () => {
  const { notifications, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const [filter, setFilter] = useState('all'); // all, unread, registration, system

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'registration') return notification.type === 'registration';
    if (filter === 'system') return notification.type === 'system';
    return true;
  });

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#ff6b9d';
      case 'medium': return '#ffdd59';
      case 'low': return '#00ff88';
      default: return '#00a8ff';
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'registration': return '📝';
      case 'system': return '⚙️';
      case 'security': return '🔒';
      case 'update': return '🔄';
      default: return '📢';
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Unknown time';
    
    // Handle Firestore timestamp
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffSec < 60) return 'just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    if (diffDay < 7) return `${diffDay}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{
        background: 'rgba(15, 15, 35, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        border: '2px solid #00ff8840',
        boxShadow: '0 0 50px #00ff8830',
        padding: '24px',
        maxHeight: '600px',
        overflowY: 'auto',
        position: 'relative'
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        paddingBottom: '15px',
        borderBottom: '1px solid #00ff8840'
      }}>
        <h3 style={{
          color: '#00ff88',
          fontSize: '1.25rem',
          fontWeight: '700',
          margin: 0,
          textShadow: '0 0 10px #00ff88'
        }}>
          Notifications Center
        </h3>
        
        {notifications.length > 0 && (
          <button
            onClick={markAllAsRead}
            style={{
              background: 'linear-gradient(45deg, #00ff88, #00a8ff)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              color: '#000',
              fontSize: '0.8rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Mark All Read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        {[
          { key: 'all', label: 'All', count: notifications.length },
          { key: 'unread', label: 'Unread', count: notifications.filter(n => !n.read).length },
          { key: 'registration', label: 'Registrations', count: notifications.filter(n => n.type === 'registration').length },
          { key: 'system', label: 'System', count: notifications.filter(n => n.type === 'system').length }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            style={{
              background: filter === tab.key 
                ? 'linear-gradient(45deg, #00ff88, #00a8ff)' 
                : 'rgba(255, 255, 255, 0.1)',
              border: filter === tab.key ? 'none' : '1px solid #ffffff20',
              borderRadius: '12px',
              padding: '8px 12px',
              color: filter === tab.key ? '#000' : '#cccccc',
              fontSize: '0.8rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {tab.label}
            {tab.count > 0 && (
              <span style={{
                background: filter === tab.key ? '#000' : '#00ff88',
                color: filter === tab.key ? '#fff' : '#000',
                fontSize: '0.7rem',
                fontWeight: '700',
                padding: '2px 6px',
                borderRadius: '10px',
                minWidth: '16px',
                textAlign: 'center'
              }}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <AnimatePresence>
          {filteredNotifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: '#888888'
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📭</div>
              <p style={{ margin: 0, fontSize: '1rem' }}>No notifications found</p>
              <p style={{ margin: '5px 0 0 0', fontSize: '0.8rem' }}>
                {filter !== 'all' ? `No ${filter} notifications` : 'Your notification center is empty'}
              </p>
            </motion.div>
          ) : (
            filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                style={{
                  background: notification.read 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : `rgba(${getPriorityColor(notification.priority)}20, 0.1)`,
                  border: notification.read 
                    ? '1px solid rgba(255, 255, 255, 0.1)' 
                    : `1px solid ${getPriorityColor(notification.priority)}40`,
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '12px',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.3s ease'
                }}
                whileHover={{
                  scale: 1.02,
                  backgroundColor: notification.read 
                    ? 'rgba(255, 255, 255, 0.08)' 
                    : `rgba(${getPriorityColor(notification.priority)}30, 0.15)`
                }}
                onClick={() => {
                  if (!notification.read) {
                    markAsRead(notification.id);
                  }
                }}
              >
                {/* Priority Indicator */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '4px',
                  height: '100%',
                  background: getPriorityColor(notification.priority),
                  borderRadius: '12px 0 0 12px'
                }} />

                {/* Unread Indicator */}
                {!notification.read && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: getPriorityColor(notification.priority),
                      boxShadow: `0 0 10px ${getPriorityColor(notification.priority)}`
                    }}
                  />
                )}

                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}>
                  {/* Type Icon */}
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: `linear-gradient(135deg, ${getPriorityColor(notification.priority)}, ${getPriorityColor(notification.priority)}cc)`,
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    flexShrink: 0,
                    boxShadow: `0 0 15px ${getPriorityColor(notification.priority)}50`
                  }}>
                    {getTypeIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '8px'
                    }}>
                      <h4 style={{
                        color: '#ffffff',
                        fontSize: '0.95rem',
                        fontWeight: '600',
                        margin: 0,
                        lineHeight: '1.3',
                        textShadow: `0 0 8px ${getPriorityColor(notification.priority)}60`
                      }}>
                        {notification.title || 'Notification'}
                      </h4>

                      <span style={{
                        color: '#888888',
                        fontSize: '0.7rem',
                        fontWeight: '500',
                        whiteSpace: 'nowrap',
                        marginLeft: '8px'
                      }}>
                        {formatTime(notification.createdAt)}
                      </span>
                    </div>

                    <p style={{
                      color: '#cccccc',
                      fontSize: '0.85rem',
                      margin: '0 0 10px 0',
                      lineHeight: '1.4'
                    }}>
                      {notification.message || notification.description || 'No message content'}
                    </p>

                    {/* Metadata */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '8px'
                    }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {/* Priority Badge */}
                        <span style={{
                          background: `${getPriorityColor(notification.priority)}30`,
                          color: getPriorityColor(notification.priority),
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontSize: '0.6rem',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          border: `1px solid ${getPriorityColor(notification.priority)}40`
                        }}>
                          {notification.priority || 'normal'}
                        </span>

                        {/* Type Badge */}
                        <span style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: '#cccccc',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontSize: '0.6rem',
                          fontWeight: '500',
                          textTransform: 'capitalize'
                        }}>
                          {notification.type || 'general'}
                        </span>

                        {/* Action Required Badge */}
                        {notification.actionRequired && (
                          <span style={{
                            background: '#ff6b9d30',
                            color: '#ff6b9d',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            fontSize: '0.6rem',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            border: '1px solid #ff6b9d40',
                            animation: 'pulse 2s infinite'
                          }}>
                            Action Required
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {!notification.read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                            style={{
                              background: 'none',
                              border: '1px solid #00ff8840',
                              borderRadius: '6px',
                              padding: '4px 8px',
                              color: '#00ff88',
                              fontSize: '0.7rem',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            Mark Read
                          </button>
                        )}
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          style={{
                            background: 'none',
                            border: '1px solid #ff6b9d40',
                            borderRadius: '6px',
                            padding: '4px 8px',
                            color: '#ff6b9d',
                            fontSize: '0.7rem',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      {filteredNotifications.length > 0 && (
        <div style={{
          marginTop: '20px',
          paddingTop: '15px',
          borderTop: '1px solid #00ff8840',
          textAlign: 'center'
        }}>
          <p style={{
            color: '#888888',
            fontSize: '0.8rem',
            margin: 0
          }}>
            Showing {filteredNotifications.length} of {notifications.length} notifications
          </p>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </motion.div>
  );
};

export default AdminNotificationsPanel;