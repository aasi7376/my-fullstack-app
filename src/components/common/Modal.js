// components/ui/Modal.js
import React, { useRef } from 'react';
import { motion } from 'framer-motion';

const Modal = ({ isOpen, onClose, title, color = '#00e1ff', children }) => {
  const modalContentRef = useRef(null);
  
  if (!isOpen) return null;
  
  const styles = {
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(5, 15, 25, 0.8)',
      backdropFilter: 'blur(8px)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    modalContent: {
      background: 'rgba(7, 27, 46, 0.95)',
      backdropFilter: 'blur(15px)',
      borderRadius: '12px',
      padding: '30px',
      width: '90%',
      maxWidth: '500px',
      maxHeight: '90vh',
      overflowY: 'auto',
      position: 'relative'
    },
    modalClose: {
      position: 'absolute',
      top: '15px',
      right: '20px',
      background: 'transparent',
      border: 'none',
      color: '#8ab3c5',
      fontSize: '1.5rem',
      cursor: 'pointer',
      transition: 'color 0.2s ease',
      zIndex: 10
    },
    modalTitle: {
      color: '#ffffff',
      fontSize: '1.5rem',
      fontWeight: '700',
      margin: '0 0 30px 0',
      fontFamily: 'system-ui, sans-serif',
      letterSpacing: '1px',
      textAlign: 'center'
    }
  };
  
  return (
    <div 
      style={styles.modalOverlay} 
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div 
        ref={modalContentRef}
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        style={{
          ...styles.modalContent,
          border: `1px solid ${color}40`,
          boxShadow: `0 0 30px ${color}30`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          style={styles.modalClose} 
          onClick={onClose}
        >
          ×
        </button>
        <h2 style={styles.modalTitle}>
          {title}
        </h2>
        <div className="modal-content-inner">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default React.memo(Modal);