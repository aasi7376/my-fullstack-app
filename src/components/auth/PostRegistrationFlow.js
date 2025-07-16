// src/components/auth/PostRegistrationFlow.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { PlanSelector, PaymentForm, PaymentSuccessModal } from '../payment/PaymentComponents';

const PostRegistrationFlow = ({ userData, onComplete }) => {
  const { user, getDashboardRoute } = useAuth();
  const { createRegistrationNotification } = useNotifications();
  const navigate = useNavigate();
  
  // Flow steps: welcome -> payment -> complete
  const [step, setStep] = useState('welcome');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Create notifications on component mount
  useEffect(() => {
    if (userData && userData.role) {
      createRegistrationNotification(userData, userData.role);
    }
  }, [userData, createRegistrationNotification]);
  
  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
  };
  
  const handlePaymentComplete = () => {
    setShowSuccessModal(true);
  };
  
  const handleContinueToDashboard = () => {
    const dashboardRoute = getDashboardRoute(userData.role);
    navigate(dashboardRoute, { replace: true });
    
    if (onComplete) {
      onComplete();
    }
  };
  
  // Welcome step component
  const WelcomeStep = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      style={{
        maxWidth: '800px',
        width: '100%',
        background: 'rgba(15, 15, 35, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '40px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3), 0 0 30px rgba(0, 255, 136, 0.2)',
        border: '2px solid rgba(0, 255, 136, 0.3)',
        textAlign: 'center'
      }}
    >
      {/* Role-specific icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.2), rgba(0, 168, 255, 0.2))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '50px',
          margin: '0 auto 30px',
          boxShadow: '0 0 30px rgba(0, 255, 136, 0.3)',
          border: '3px solid rgba(0, 255, 136, 0.4)'
        }}
      >
        <motion.span
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity 
          }}
        >
          {userData.role === 'student' ? '👨‍🎓' : userData.role === 'teacher' ? '👨‍🏫' : userData.role === 'school' ? '🏫' : '⚙️'}
        </motion.span>
      </motion.div>
      
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          marginBottom: '20px',
          background: 'linear-gradient(45deg, #00ff88, #00a8ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}
      >
        Welcome to Cognify, {userData.name}!
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          fontSize: '1.2rem',
          color: '#e0e0e0',
          marginBottom: '30px',
          lineHeight: 1.6,
          maxWidth: '600px',
          margin: '0 auto 30px'
        }}
      >
        {userData.role === 'student' 
          ? 'Your journey of interactive learning starts here! One more step to unlock all educational games and resources.'
          : userData.role === 'teacher'
          ? 'You\'re all set to transform your teaching experience! Just one more step to access all the tools you need.'
          : 'Your educational institution is now registered! Complete the subscription process to manage your school effectively.'}
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        style={{
          background: 'rgba(0, 255, 136, 0.1)',
          border: '1px solid rgba(0, 255, 136, 0.3)',
          borderRadius: '16px',
          padding: '25px',
          marginBottom: '30px',
          textAlign: 'left'
        }}
      >
        <h3 style={{
          color: '#00ff88',
          fontSize: '1.3rem',
          fontWeight: '600',
          marginBottom: '15px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{ fontSize: '1.5rem' }}>🚀</span>
          What's Next?
        </h3>
        
        <ul style={{
          padding: 0,
          margin: 0,
          listStyle: 'none'
        }}>
          {[
            'Choose your subscription plan',
            'Complete the payment process',
            `Access your ${userData.role} dashboard`,
            userData.role === 'student' 
              ? 'Start playing educational games!' 
              : userData.role === 'teacher'
              ? 'Manage your classes and assignments'
              : 'Add teachers and students to your school'
          ].map((item, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + (index * 0.1) }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                marginBottom: '15px',
                color: '#e0e0e0',
                fontSize: '1.1rem'
              }}
            >
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'rgba(0, 255, 136, 0.15)',
                border: '2px solid rgba(0, 255, 136, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600',
                color: '#00ff88'
              }}>
                {index + 1}
              </div>
              {item}
            </motion.li>
          ))}
        </ul>
      </motion.div>
      
      <motion.button
        onClick={() => setStep('payment')}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0, 255, 136, 0.6)' }}
        whileTap={{ scale: 0.95 }}
        style={{
          background: 'linear-gradient(45deg, #00ff88, #00a8ff)',
          border: 'none',
          borderRadius: '16px',
          padding: '18px 35px',
          fontSize: '1.2rem',
          fontWeight: '600',
          color: '#000000',
          cursor: 'pointer',
          boxShadow: '0 0 25px rgba(0, 255, 136, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}
      >
        <span style={{ fontSize: '1.3rem' }}>⚡</span>
        Get Started
      </motion.button>
    </motion.div>
  );
  
  // Payment step component
  const PaymentStep = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      style={{
        maxWidth: '1000px',
        width: '100%',
        padding: '20px'
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          marginBottom: '30px'
        }}
      >
        <motion.button
          onClick={() => setStep('welcome')}
          whileHover={{ scale: 1.1, x: -5 }}
          whileTap={{ scale: 0.9 }}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '1.5rem',
            cursor: 'pointer',
            padding: '10px 15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ←
        </motion.button>
        
        <h2 style={{
          margin: 0,
          fontSize: '1.8rem',
          color: '#ffffff',
          fontWeight: '600'
        }}>
          Choose Your Subscription
        </h2>
      </motion.div>
      
      <div style={{ marginBottom: '40px' }}>
        <PlanSelector onSelectPlan={handleSelectPlan} />
      </div>
      
      <AnimatePresence mode="wait">
        {selectedPlan && (
          <motion.div
            key="payment-form"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
          >
            <PaymentForm 
              selectedPlan={selectedPlan} 
              onPaymentComplete={handlePaymentComplete}
              onCancel={() => setSelectedPlan(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
  
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0
      }}>
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight, 
              scale: Math.random() * 0.5 + 0.5,
              opacity: Math.random() * 0.4 + 0.1
            }}
            animate={{ 
              x: [null, Math.random() * window.innerWidth],
              y: [null, Math.random() * window.innerHeight],
              opacity: [null, Math.random() * 0.4 + 0.1]
            }}
            transition={{ 
              duration: Math.random() * 30 + 20, 
              repeat: Infinity, 
              repeatType: 'mirror'
            }}
            style={{
              position: 'absolute',
              width: `${Math.random() * 8 + 3}px`,
              height: `${Math.random() * 8 + 3}px`,
              borderRadius: '50%',
              background: i % 3 === 0 ? '#00ff88' : i % 3 === 1 ? '#00a8ff' : '#8c7ae6',
              boxShadow: i % 3 === 0 ? '0 0 15px #00ff88' : i % 3 === 1 ? '0 0 15px #00a8ff' : '0 0 15px #8c7ae6'
            }}
          />
        ))}
        
        {/* Large gradient circles */}
        <motion.div
          style={{
            position: 'absolute',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 255, 136, 0.1) 0%, transparent 70%)',
            top: '10%',
            left: '5%'
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div
          style={{
            position: 'absolute',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 168, 255, 0.1) 0%, transparent 70%)',
            bottom: '5%',
            right: '10%'
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div
          style={{
            position: 'absolute',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(140, 122, 230, 0.1) 0%, transparent 70%)',
            top: '40%',
            right: '20%'
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      
      {/* Content */}
      <AnimatePresence mode="wait">
        {step === 'welcome' && <WelcomeStep key="welcome" />}
        {step === 'payment' && <PaymentStep key="payment" />}
      </AnimatePresence>
      
      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <PaymentSuccessModal 
            onClose={() => setShowSuccessModal(false)}
            onContinue={handleContinueToDashboard}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PostRegistrationFlow;