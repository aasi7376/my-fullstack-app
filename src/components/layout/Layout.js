import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import NeonAnimatedBackground from '../common/NeonAnimatedBackground';
import './Layout.css';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState('dashboard');
  const [isMobile, setIsMobile] = useState(false);

  // Menu items for sidebar
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠', path: '/dashboard' },
    { id: 'games', label: 'Learning Games', icon: '🎮', path: '/games', badge: '3' },
    { id: 'students', label: 'Students', icon: '👨‍🎓', path: '/students' },
    { id: 'reports', label: 'Reports', icon: '📊', path: '/reports' },
    { id: 'messages', label: 'Messages', icon: '💬', path: '/messages', badge: '5' },
    { id: 'resources', label: 'Resources', icon: '📚', path: '/resources' },
  ];

  // Check if on mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768 && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [isSidebarOpen]);

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Handle sidebar item click
  const handleItemClick = (itemId) => {
    setActiveItem(itemId);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className={`app-layout ${isSidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
      {/* Animated Background */}
      <NeonAnimatedBackground />
      
      {/* Sidebar */}
      <Sidebar 
        items={sidebarItems} 
        activeItem={activeItem} 
        onItemClick={handleItemClick} 
        isOpen={isSidebarOpen}
      />
      
      {/* Main Content Area */}
      <div className="main-container">
        {/* Top Navigation */}
        <Navbar 
          toggleSidebar={toggleSidebar} 
          isSidebarOpen={isSidebarOpen} 
        />
        
        {/* Page Content */}
        <motion.main 
          className="main-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="page-container">
            {children}
          </div>
        </motion.main>
        
        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && isMobile && (
          <motion.div 
            className="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
          />
        )}
      </div>
    </div>
  );
};

export default Layout;