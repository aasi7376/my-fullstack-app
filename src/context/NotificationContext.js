// src/context/NotificationContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Sample notifications for testing - remove in production
  useEffect(() => {
    const sampleNotifications = [
      {
        id: '1',
        type: 'registration',
        title: 'New School Registration',
        message: 'Springfield Elementary School has submitted a registration request',
        priority: 'high',
        read: false,
        actionRequired: true,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        schoolId: 'school_123'
      },
      {
        id: '2',
        type: 'registration',
        title: 'Teacher Registration',
        message: 'John Smith has registered as a new teacher',
        priority: 'medium',
        read: false,
        actionRequired: true,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        teacherId: 'teacher_456'
      },
      {
        id: '3',
        type: 'system',
        title: 'System Maintenance',
        message: 'Scheduled maintenance will occur tonight at 2 AM',
        priority: 'low',
        read: true,
        actionRequired: false,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        id: '4',
        type: 'registration',
        title: 'Student Registration',
        message: 'Emma Johnson has registered for the platform',
        priority: 'medium',
        read: false,
        actionRequired: false,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        studentId: 'student_789'
      },
      {
        id: '5',
        type: 'security',
        title: 'Security Alert',
        message: 'Multiple failed login attempts detected',
        priority: 'high',
        read: false,
        actionRequired: true,
        createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      }
    ];
    
    setNotifications(sampleNotifications);
  }, []);

  // Update unread count whenever notifications change
  useEffect(() => {
    const count = notifications.filter(notification => !notification.read).length;
    setUnreadCount(count);
  }, [notifications]);

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      read: false,
      priority: 'medium',
      actionRequired: false,
      ...notification
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (notificationId) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const getNotificationsByType = (type) => {
    return notifications.filter(notification => notification.type === type);
  };

  const getUnreadNotifications = () => {
    return notifications.filter(notification => !notification.read);
  };

  // Mock function for Firestore timestamp compatibility
  const createFirestoreTimestamp = (date) => ({
    toDate: () => date,
    seconds: Math.floor(date.getTime() / 1000),
    nanoseconds: (date.getTime() % 1000) * 1000000
  });

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    getNotificationsByType,
    getUnreadNotifications,
    createFirestoreTimestamp
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;