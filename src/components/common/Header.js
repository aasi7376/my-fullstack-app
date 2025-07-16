import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  const navItems = [
    { label: 'Dashboard', path: `/${user?.role}`, icon: '🏠' },
    { label: 'Reports', path: '/reports', icon: '📊' },
    { label: 'Help', path: '/help', icon: '❓' }
  ];

  const userMenuItems = [
    { label: 'Profile', icon: '👤', action: () => navigate('/profile') },
    { label: 'Settings', icon: '⚙️', action: () => navigate('/settings') },
    { label: 'Logout', icon: '🚪', action: handleLogout }
  ];

  return (
    <motion.header 
      className="app-header"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="header-content">
        {/* Brand */}
        <motion.div 
          className="header-brand"
          whileHover={{ scale: 1.05 }}
        >
          <div className="header-logo">C</div>
          <h1 className="header-title">COGNIFY</h1>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="header-nav desktop-nav">
          <ul className="nav-links">
            {navItems.map((item) => (
              <motion.li key={item.path}>
                <motion.a
                  href={item.path}
                  className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.path);
                  }}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {item.label}
                </motion.a>
              </motion.li>
            ))}
          </ul>

          {/* User Menu */}
          <div className="user-menu">
            <motion.div
              className="user-trigger"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="user-avatar">
                {getInitials(user?.name)}
              </div>
              <div className="user-info">
                <h4>{user?.name || 'User'}</h4>
                <p>{user?.role}</p>
              </div>
              <motion.span
                className="dropdown-arrow"
                animate={{ rotate: isUserMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                ↓
              </motion.span>
            </motion.div>

            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div
                  className="user-dropdown"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  {userMenuItems.map((item, index) => (
                    <motion.button
                      key={index}
                      className="dropdown-item"
                      onClick={() => {
                        item.action();
                        setIsUserMenuOpen(false);
                      }}
                      whileHover={{ backgroundColor: 'rgba(0, 245, 255, 0.1)' }}
                    >
                      <span className="dropdown-icon">{item.icon}</span>
                      {item.label}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <motion.button
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.span
            className="hamburger"
            animate={{ 
              rotate: isMobileMenuOpen ? 45 : 0,
              y: isMobileMenuOpen ? 6 : 0 
            }}
          />
          <motion.span
            className="hamburger"
            animate={{ 
              opacity: isMobileMenuOpen ? 0 : 1,
              x: isMobileMenuOpen ? 20 : 0 
            }}
          />
          <motion.span
            className="hamburger"
            animate={{ 
              rotate: isMobileMenuOpen ? -45 : 0,
              y: isMobileMenuOpen ? -6 : 0 
            }}
          />
        </motion.button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mobile-nav-content">
              {navItems.map((item) => (
                <motion.a
                  key={item.path}
                  href={item.path}
                  className={`mobile-nav-link ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  whileHover={{ x: 10 }}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {item.label}
                </motion.a>
              ))}
              
              <div className="mobile-user-section">
                <div className="mobile-user-info">
                  <div className="user-avatar">
                    {getInitials(user?.name)}
                  </div>
                  <div>
                    <h4>{user?.name || 'User'}</h4>
                    <p>{user?.role}</p>
                  </div>
                </div>
                
                {userMenuItems.map((item, index) => (
                  <motion.button
                    key={index}
                    className="mobile-dropdown-item"
                    onClick={() => {
                      item.action();
                      setIsMobileMenuOpen(false);
                    }}
                    whileHover={{ x: 10 }}
                  >
                    <span className="dropdown-icon">{item.icon}</span>
                    {item.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay for mobile menu */}
      <AnimatePresence>
        {(isUserMenuOpen || isMobileMenuOpen) && (
          <motion.div
            className="header-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setIsUserMenuOpen(false);
              setIsMobileMenuOpen(false);
            }}
          />
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;