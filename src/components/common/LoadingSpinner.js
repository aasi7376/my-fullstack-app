import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...', fullScreen = false }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  const spinnerVariants = {
    spin: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const containerClass = fullScreen 
    ? 'loading-container min-h-screen' 
    : 'loading-container';

  return (
    <div className={containerClass}>
      <motion.div
        className={`loading-spinner-main ${sizeClasses[size]}`}
        variants={spinnerVariants}
        animate="spin"
      />
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;