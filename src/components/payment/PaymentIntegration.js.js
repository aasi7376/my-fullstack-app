// src/components/payment/PaymentIntegration.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RegisterForm from '../forms/RegisterForm';
import PaymentOptions from './PaymentOptions';

const PaymentIntegration = ({ role, onBack }) => {
  const [step, setStep] = useState('register'); // 'register', 'payment', 'complete'
  const [userData, setUserData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [registrationComplete, setRegistrationComplete] = useState(false);

  // Enhanced role configuration with unique themes - copied from RegisterForm
  const roleConfig = {
    student: { 
      label: 'Student', 
      icon: '👨‍🎓', 
      theme: 'morphing-blob',
      primaryColor: '#00ff88',
      secondaryColor: '#00d4aa',
      gradientColors: ['#00ff88', '#00d4aa', '#06ffa5'],
      description: 'Join thousands of students learning through games'
    },
    teacher: { 
      label: 'Teacher', 
      icon: '👨‍🏫', 
      theme: 'nature-soft',
      primaryColor: '#00a8ff',
      secondaryColor: '#0088cc',
      gradientColors: ['#00a8ff', '#0088cc', '#7b68ee'],
      description: 'Empower your students with interactive learning'
    },
    school: { 
      label: 'School Admin', 
      icon: '🏫', 
      theme: 'split-screen',
      primaryColor: '#8c7ae6',
      secondaryColor: '#9c88ff',
      gradientColors: ['#8c7ae6', '#9c88ff', '#ff6b9d', '#feca57'],
      description: 'Manage your institution effectively'
    },
    admin: { 
      label: 'System Admin', 
      icon: '⚙️', 
      theme: 'liquid-form',
      primaryColor: '#ff6b9d',
      secondaryColor: '#ff5722',
      gradientColors: ['#ff6b9d', '#ff5722', '#ffa726'],
      description: 'Control and monitor the entire platform'
    }
  }[role];

  // Handle registration completion
  const handleRegistrationComplete = (data) => {
    console.log('Registration completed with data:', data);
    setUserData(data);
    setStep('payment');
  };

  // Handle payment completion
  const handlePaymentComplete = (data) => {
    console.log('Payment completed with data:', data);
    setPaymentData(data);
    setRegistrationComplete(true);

    // After 2 seconds, forward to dashboard or login page
    setTimeout(() => {
      setStep('complete');
    }, 2000);
  };

  // Handle back button
  const handleBack = () => {
    if (step === 'payment') {
      setStep('register');
    } else {
      onBack();
    }
  };

  // Handle switching to login
  const handleSwitchToLogin = () => {
    // Placeholder for navigation to login page
    console.log('Switching to login...');
    onBack();
  };

  return (
    <AnimatePresence mode="wait">
      {step === 'register' && (
        <motion.div
          key="register"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.3 }}
          style={{ width: '100%' }}
        >
          <RegisterForm 
            role={role} 
            onBack={onBack} 
            onSwitchToLogin={handleSwitchToLogin}
            onComplete={handleRegistrationComplete}
          />
        </motion.div>
      )}

      {step === 'payment' && (
        <motion.div
          key="payment"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          style={{ width: '100%' }}
        >
          <PaymentOptions 
            role={role} 
            onBack={handleBack} 
            onPaymentComplete={handlePaymentComplete}
            roleConfig={roleConfig}
            userData={userData}
          />
        </motion.div>
      )}

      {step === 'complete' && (
        <motion.div
          key="complete"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          style={{ 
            width: '100%', 
            height: '100vh', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            background: `linear-gradient(135deg, ${roleConfig.primaryColor}10, ${roleConfig.secondaryColor}05)`
          }}
        >
          <motion.div
            style={{
              background: 'rgba(20, 20, 40, 0.6)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              border: `1px solid ${roleConfig.primaryColor}30`,
              padding: '40px',
              textAlign: 'center',
              maxWidth: '600px',
              width: '100%',
              boxShadow: `0 20px 40px rgba(0, 0, 0, 0.3), 0 0 30px ${roleConfig.primaryColor}20`
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              style={{
                width: '120px',
                height: '120px',
                background: `linear-gradient(135deg, ${roleConfig.primaryColor}30, ${roleConfig.secondaryColor}30)`,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '60px',
                margin: '0 auto 30px',
                boxShadow: `0 0 40px ${roleConfig.primaryColor}40`
              }}
            >
              ✅
            </motion.div>

            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              marginBottom: '15px',
              background: `linear-gradient(45deg, ${roleConfig.primaryColor}, ${roleConfig.secondaryColor})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: `drop-shadow(0 2px 3px ${roleConfig.primaryColor}40)`
            }}>
              Account Activated!
            </h2>

            <p style={{ 
              fontSize: '1.2rem', 
              lineHeight: '1.6', 
              color: '#e0e0e0', 
              marginBottom: '30px',
              maxWidth: '450px',
              margin: '0 auto 30px'
            }}>
              Congratulations! Your {roleConfig.label} account has been fully set up and is ready to use. 
              You can now access all the features of your {paymentData?.plan?.name || 'Premium'} plan.
            </p>

            <div style={{
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '15px',
              marginBottom: '30px',
              border: `1px dashed ${roleConfig.primaryColor}40`
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <span style={{ color: '#aaaaaa' }}>
                  Account Type
                </span>
                <span style={{ color: '#ffffff', fontWeight: '600' }}>
                  {roleConfig.label}
                </span>
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <span style={{ color: '#aaaaaa' }}>
                  Subscription
                </span>
                <span style={{ color: '#ffffff', fontWeight: '600' }}>
                  {paymentData?.plan?.name || 'Premium'} Plan
                </span>
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <span style={{ color: '#aaaaaa' }}>
                  Transaction ID
                </span>
                <span style={{ color: '#ffffff' }}>
                  {paymentData?.transactionId || 'TXN' + Math.floor(Math.random() * 1000000)}
                </span>
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                padding: '10px 0'
              }}>
                <span style={{ color: '#aaaaaa' }}>
                  Status
                </span>
                <span style={{ color: roleConfig.primaryColor, fontWeight: '700' }}>
                  Active
                </span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: `0 0 30px ${roleConfig.primaryColor}60` }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.location.href = '/dashboard'}
              style={{
                background: `linear-gradient(45deg, ${roleConfig.primaryColor}, ${roleConfig.secondaryColor})`,
                border: 'none',
                borderRadius: '15px',
                padding: '16px 35px',
                fontSize: '1.1rem',
                fontWeight: '700',
                color: '#000',
                cursor: 'pointer',
                boxShadow: `0 10px 20px rgba(0, 0, 0, 0.2), 0 0 15px ${roleConfig.primaryColor}40`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                margin: '0 auto'
              }}
            >
              <span>🚀</span>
              Go to Dashboard
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentIntegration;