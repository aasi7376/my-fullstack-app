import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get current page title from path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Dashboard';
    if (path.includes('/games')) return 'Learning Games';
    if (path.includes('/students')) return 'Students';
    if (path.includes('/reports')) return 'Reports';
    if (path.includes('/messages')) return 'Messages';
    if (path.includes('/resources')) return 'Resources';
    return 'Dashboard';
  };
  
  // Sample notifications for demo
  const notifications = [
    { 
      id: 1, 
      type: 'message', 
      content: 'New message from John Smith',
      time: '5 min ago',
      read: false
    },
    { 
      id: 2, 
      type: 'assignment', 
      content: 'Assignment "Math Quiz 3" is due soon',
      time: '1 hour ago',
      read: false
    },
    { 
      id: 3, 
      type: 'system', 
      content: 'System maintenance scheduled for tonight',
      time: '3 hours ago',
      read: true
    }
  ];
  
  // Toggle notification panel
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (showUserMenu) setShowUserMenu(false);
  };
  
  // Toggle user menu
  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
    if (showNotifications) setShowNotifications(false);
  };
  
  // Handle logout
  const handleLogout = () => {
    // Implement your logout logic here
    navigate('/login');
  };
  
  return (
    <motion.header 
      className="navbar"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="navbar-left">
        <motion.button 
          className="toggle-sidebar-btn"
          onClick={toggleSidebar}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isSidebarOpen ? '◀' : '▶'}
        </motion.button>
        
        <h2 className="page-title">{getPageTitle()}</h2>
      </div>
      
      <div className="navbar-search">
        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="Search..." 
            className="search-input"
          />
        </div>
      </div>
      
      <div className="navbar-right">
        {/* Help Button */}
        <motion.button 
          className="navbar-btn help-btn"
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="btn-icon">❓</span>
          <span className="btn-text">Help</span>
        </motion.button>
        
        {/* Notifications */}
        <div className="notification-container">
          <motion.button 
            className="navbar-btn notification-btn"
            onClick={toggleNotifications}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="btn-icon">🔔</span>
            <span className="notification-badge">
              {notifications.filter(n => !n.read).length}
            </span>
          </motion.button>
          
          {/* Notification Dropdown */}
          {showNotifications && (
            <motion.div 
              className="dropdown notification-dropdown"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="dropdown-header">
                <h3>Notifications</h3>
                <button className="mark-all-btn">Mark all as read</button>
              </div>
              
              <div className="notification-list">
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`notification-item ${!notification.read ? 'unread' : ''}`}
                    >
                      <div className="notification-icon">
                        {notification.type === 'message' ? '💬' : 
                         notification.type === 'assignment' ? '📝' : '🔧'}
                      </div>
                      <div className="notification-content">
                        <p className="notification-text">{notification.content}</p>
                        <span className="notification-time">{notification.time}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-notifications">
                    <p>No notifications</p>
                  </div>
                )}
              </div>
              
              <div className="dropdown-footer">
                <button className="see-all-btn">See all notifications</button>
              </div>
            </motion.div>
          )}
        </div>
        
        {/* User Profile */}
        <div className="user-profile">
          <motion.div 
            className="avatar"
            onClick={toggleUserMenu}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>S</span>
          </motion.div>
          
          {/* User Menu Dropdown */}
          {showUserMenu && (
            <motion.div 
              className="dropdown user-dropdown"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="user-info">
                <div className="user-avatar">S</div>
                <div className="user-details">
                  <h4>Sarah Johnson</h4>
                  <p>Teacher</p>
                  <span className="user-email">sarah.j@cognify.edu</span>
                </div>
              </div>
              
              <div className="dropdown-divider"></div>
              
              <div className="user-menu-items">
                <button className="user-menu-item">
                  <span className="item-icon">👤</span>
                  <span className="item-text">My Profile</span>
                </button>
                <button className="user-menu-item">
                  <span className="item-icon">⚙️</span>
                  <span className="item-text">Settings</span>
                </button>
                <button className="user-menu-item">
                  <span className="item-icon">🌙</span>
                  <span className="item-text">Dark Mode</span>
                  <span className="toggle-switch active"></span>
                </button>
              </div>
              
              <div className="dropdown-divider"></div>
              
              <button className="logout-btn" onClick={handleLogout}>
                <span className="item-icon">🚪</span>
                <span className="item-text">Logout</span>
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;