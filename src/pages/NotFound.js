import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const floatingVariants = {
    float: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="not-found-container">
      <div className="animated-bg"></div>
      
      <motion.div
        className="not-found-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 404 Number */}
        <motion.div 
          className="error-code"
          variants={itemVariants}
        >
          <motion.span
            className="error-digit"
            animate={{ 
              textShadow: [
                "0 0 20px var(--neon-blue)",
                "0 0 40px var(--neon-pink)",
                "0 0 20px var(--neon-blue)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            4
          </motion.span>
          <motion.span
            className="error-digit"
            variants={floatingVariants}
            animate="float"
          >
            0
          </motion.span>
          <motion.span
            className="error-digit"
            animate={{ 
              textShadow: [
                "0 0 20px var(--neon-green)",
                "0 0 40px var(--neon-orange)",
                "0 0 20px var(--neon-green)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          >
            4
          </motion.span>
        </motion.div>

        {/* Error Message */}
        <motion.div
          className="error-message"
          variants={itemVariants}
        >
          <h1 className="error-title">Oops! Page Not Found</h1>
          <p className="error-description">
            The page you're looking for seems to have vanished into the digital void. 
            Don't worry, even the best students sometimes take a wrong turn!
          </p>
        </motion.div>

        {/* Illustration */}
        <motion.div
          className="error-illustration"
          variants={itemVariants}
        >
          <motion.div
            className="floating-icon"
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity }
            }}
          >
            🎮
          </motion.div>
          <motion.div
            className="floating-icon"
            animate={{ 
              y: [-20, 20, -20],
              x: [-10, 10, -10]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            style={{ position: 'absolute', left: '20%', top: '30%' }}
          >
            📚
          </motion.div>
          <motion.div
            className="floating-icon"
            animate={{ 
              rotate: [0, -360],
              y: [10, -10, 10]
            }}
            transition={{ 
              rotate: { duration: 15, repeat: Infinity, ease: "linear" },
              y: { duration: 3, repeat: Infinity }
            }}
            style={{ position: 'absolute', right: '20%', bottom: '30%' }}
          >
            🧮
          </motion.div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="error-actions"
          variants={itemVariants}
        >
          <motion.button
            className="btn-neon home-btn"
            onClick={() => navigate('/')}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 0 30px var(--neon-blue)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="btn-icon">🏠</span>
            Go Home
          </motion.button>

          <motion.button
            className="btn-neon-secondary back-btn"
            onClick={() => navigate(-1)}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 0 30px var(--neon-pink)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="btn-icon">↩️</span>
            Go Back
          </motion.button>
        </motion.div>

        {/* Help Text */}
        <motion.div
          className="error-help"
          variants={itemVariants}
        >
          <p>Need help? Here are some suggestions:</p>
          <div className="help-suggestions">
            <motion.div 
              className="suggestion"
              whileHover={{ x: 5 }}
            >
              <span className="suggestion-icon">🎯</span>
              <span>Check the URL for typos</span>
            </motion.div>
            <motion.div 
              className="suggestion"
              whileHover={{ x: 5 }}
            >
              <span className="suggestion-icon">🔍</span>
              <span>Use the search feature</span>
            </motion.div>
            <motion.div 
              className="suggestion"
              whileHover={{ x: 5 }}
            >
              <span className="suggestion-icon">📧</span>
              <span>Contact support if the problem persists</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Footer Message */}
        <motion.div
          className="error-footer"
          variants={itemVariants}
        >
          <p className="footer-text">
            "Every mistake is a learning opportunity - even 404 errors!" 
            <span className="footer-emoji">🚀</span>
          </p>
        </motion.div>
      </motion.div>

      {/* Background Particles */}
      <div className="error-particles">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="particle"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default NotFound;