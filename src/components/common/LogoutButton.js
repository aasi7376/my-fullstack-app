// src/components/common/LogoutButton.js
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/LogoutButton.css';

const LogoutButton = () => {
  const [showModal, setShowModal] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    setShowModal(true);
  };

  const handleConfirmLogout = () => {
    // Call logout function from auth context
    logout();
    // Navigate to login page
    navigate('/login');
    // Close modal
    setShowModal(false);
  };

  const handleCancelLogout = () => {
    setShowModal(false);
  };

  return (
    <>
      <div className="logout-button-container">
        <motion.button
          className="logout-button"
          onClick={handleLogoutClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="logout-icon">⏻</span>
          Logout
        </motion.button>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="logout-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="logout-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="logout-modal-header">
                <h2 className="logout-modal-title">Confirm Logout</h2>
                <p className="logout-modal-message">
                  Are you sure you want to log out of the School Dashboard? 
                  Any unsaved changes will be lost.
                </p>
              </div>
              <div className="logout-modal-actions">
                <motion.button
                  className="logout-modal-button logout-cancel"
                  onClick={handleCancelLogout}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  className="logout-modal-button logout-confirm"
                  onClick={handleConfirmLogout}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Confirm Logout
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LogoutButton;