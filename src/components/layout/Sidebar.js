import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ items, activeItem, onItemClick, isOpen = true }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleItemClick = (item) => {
    onItemClick(item.id);
    navigate(item.path);
  };

  const isActive = (item) => {
    return location.pathname === item.path || location.pathname.startsWith(item.path + '/');
  };

  // Sidebar animation variants
  const sidebarVariants = {
    open: {
      width: '280px',
      transition: { duration: 0.3 }
    },
    closed: {
      width: '70px',
      transition: { duration: 0.3 }
    }
  };

  // Menu item animation variants
  const itemVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: {
        y: { stiffness: 1000, velocity: -100 }
      }
    },
    closed: {
      x: -10,
      opacity: 0,
      transition: {
        y: { stiffness: 1000 }
      }
    }
  };

  // Text animation variants
  const textVariants = {
    open: {
      opacity: 1,
      display: 'block',
      transition: { 
        delay: 0.1,
        duration: 0.2
      }
    },
    closed: {
      opacity: 0,
      display: 'none',
      transition: { 
        duration: 0.1
      }
    }
  };

  return (
    <motion.aside
      className="sidebar"
      initial={isOpen ? 'open' : 'closed'}
      animate={isOpen ? 'open' : 'closed'}
      variants={sidebarVariants}
    >
      <div className="sidebar-header">
        <motion.div 
          className="sidebar-brand"
          whileHover={{ scale: 1.05 }}
        >
          <motion.div 
            className="sidebar-logo"
            animate={{
              boxShadow: [
                '0 0 10px rgba(0, 255, 136, 0.5)',
                '0 0 20px rgba(0, 255, 136, 0.7)',
                '0 0 10px rgba(0, 255, 136, 0.5)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            C
          </motion.div>
          
          <motion.h1 
            className="sidebar-title"
            variants={textVariants}
            animate={isOpen ? 'open' : 'closed'}
          >
            COGNIFY
          </motion.h1>
        </motion.div>
      </div>

      <div className="sidebar-content">
        <nav className="sidebar-nav">
          <div className="nav-section">
            <motion.div 
              className="nav-section-title"
              variants={textVariants}
              animate={isOpen ? 'open' : 'closed'}
            >
              Main Navigation
            </motion.div>
            
            <div className="nav-items">
              {items.map((item, index) => (
                <motion.button
                  key={item.id}
                  className={`nav-item ${isActive(item) ? 'active' : ''}`}
                  onClick={() => handleItemClick(item)}
                  whileHover={{ x: isOpen ? 5 : 0, backgroundColor: 'rgba(0, 255, 136, 0.1)' }}
                  whileTap={{ scale: 0.98 }}
                  variants={itemVariants}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { 
                      delay: index * 0.05,
                      duration: 0.3
                    } 
                  }}
                >
                  <div className="nav-item-content">
                    <motion.span 
                      className="nav-icon"
                      animate={isActive(item) ? {
                        color: '#00ff88',
                        scale: [1, 1.2, 1],
                      } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      {item.icon}
                    </motion.span>
                    
                    <motion.span 
                      className="nav-text"
                      variants={textVariants}
                      animate={isOpen ? 'open' : 'closed'}
                    >
                      {item.label}
                    </motion.span>
                  </div>
                  
                  {item.badge && (
                    <motion.span 
                      className="nav-badge"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 500,
                        damping: 15 
                      }}
                      variants={isOpen ? {} : {
                        open: { position: 'relative' },
                        closed: { 
                          position: 'absolute',
                          top: '5px',
                          right: '5px',
                          width: '14px',
                          height: '14px',
                          padding: 0,
                          fontSize: '10px'
                        }
                      }}
                    >
                      {isOpen ? item.badge : ''}
                    </motion.span>
                  )}
                  
                  {isActive(item) && (
                    <motion.div 
                      className="active-indicator"
                      layoutId="activeIndicator"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </nav>
        
        <div className="sidebar-footer">
          <motion.div
            className="user-status"
            variants={textVariants}
            animate={isOpen ? 'open' : 'closed'}
          >
            <div className="status-indicator online"></div>
            <span className="status-text">Online</span>
          </motion.div>
          
          <div className="footer-actions">
            <motion.button
              className="footer-button"
              whileHover={{ y: -3, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}
              whileTap={{ y: 0, boxShadow: '0 0px 0px rgba(0, 0, 0, 0.0)' }}
            >
              <span className="footer-icon">⚙️</span>
              <motion.span 
                className="footer-text"
                variants={textVariants}
                animate={isOpen ? 'open' : 'closed'}
              >
                Settings
              </motion.span>
            </motion.button>
            
            <motion.button
              className="footer-button"
              whileHover={{ y: -3, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}
              whileTap={{ y: 0, boxShadow: '0 0px 0px rgba(0, 0, 0, 0.0)' }}
            >
              <span className="footer-icon">🚪</span>
              <motion.span 
                className="footer-text"
                variants={textVariants}
                animate={isOpen ? 'open' : 'closed'}
              >
                Logout
              </motion.span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;