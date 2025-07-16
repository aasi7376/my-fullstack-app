import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('cognifyTheme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('cognifyTheme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Mock notifications
  useEffect(() => {
    const mockNotifications = [
      {
        id: 1,
        title: 'New Achievement Unlocked!',
        message: 'You completed your first game',
        type: 'success',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        read: false
      },
      {
        id: 2,
        title: 'Assignment Due Soon',
        message: 'Algebra Quest assignment is due tomorrow',
        type: 'warning',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: false
      },
      {
        id: 3,
        title: 'Welcome to Cognify!',
        message: 'Start your learning journey today',
        type: 'info',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        read: true
      }
    ];
    setNotifications(mockNotifications);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const addNotification = (notification) => {
    const newNotification = {
      ...notification,
      id: Date.now(),
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (id) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== id)
    );
  };

  const clearError = () => {
    setError(null);
  };

  const showError = (errorMessage) => {
    setError(errorMessage);
    // Auto-clear error after 5 seconds
    setTimeout(() => {
      setError(null);
    }, 5000);
  };

  const showSuccess = (message) => {
    addNotification({
      title: 'Success',
      message,
      type: 'success'
    });
  };

  const showWarning = (message) => {
    addNotification({
      title: 'Warning',
      message,
      type: 'warning'
    });
  };

  const showInfo = (message) => {
    addNotification({
      title: 'Info',
      message,
      type: 'info'
    });
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const value = {
    // Theme
    theme,
    toggleTheme,
    isDarkTheme: theme === 'dark',

    // UI State
    sidebarCollapsed,
    setSidebarCollapsed,
    toggleSidebar,

    // Loading & Error
    loading,
    setLoading,
    error,
    setError,
    clearError,
    showError,

    // Notifications
    notifications,
    unreadNotificationsCount,
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    removeNotification,
    showSuccess,
    showWarning,
    showInfo,

    // Utility functions
    formatDate: (date) => {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date(date));
    },

    formatRelativeTime: (date) => {
      const now = new Date();
      const diff = now - new Date(date);
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);

      if (minutes < 1) return 'Just now';
      if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
      if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
      return `${days} day${days > 1 ? 's' : ''} ago`;
    },

    formatScore: (score, total = 100) => {
      const percentage = Math.round((score / total) * 100);
      return `${percentage}%`;
    },

    getScoreColor: (percentage) => {
      if (percentage >= 90) return 'var(--neon-green)';
      if (percentage >= 70) return 'var(--neon-blue)';
      if (percentage >= 50) return 'var(--neon-orange)';
      return 'var(--neon-pink)';
    },

    getDifficultyColor: (difficulty) => {
      switch (difficulty.toLowerCase()) {
        case 'easy': return 'var(--neon-green)';
        case 'medium': return 'var(--neon-orange)';
        case 'hard': return 'var(--neon-pink)';
        default: return 'var(--neon-blue)';
      }
    }
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};