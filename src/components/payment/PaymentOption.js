// src/components/payment/PaymentOptions.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCreditCard, FaPaypal, FaGooglePay, FaApplePay, FaMoneyBillWave, FaInfoCircle, FaCheckCircle, FaUniversity } from 'react-icons/fa';
import { RiSecurePaymentLine } from 'react-icons/ri';
import { MdOutlineSchool, MdPerson, MdAdminPanelSettings, MdGroups } from 'react-icons/md';

const PaymentOptions = ({ role, onPaymentComplete, onBack, roleConfig }) => {
  // State for selected plan, payment method, and card details
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showPlanDetails, setShowPlanDetails] = useState(null);

  // Role-specific payment plans
  const paymentPlans = {
    admin: [
      {
        id: 'admin-enterprise',
        name: 'Enterprise',
        price: 999.99,
        billingCycle: 'yearly',
        features: [
          'Unlimited school management',
          'Advanced analytics dashboard',
          'Custom game creation tools',
          'API access for integration',
          'White-label solution',
          'Priority 24/7 support',
          'Dedicated account manager'
        ],
        recommended: true,
        discount: '20% off'
      },
      {
        id: 'admin-professional',
        name: 'Professional',
        price: 599.99,
        billingCycle: 'yearly',
        features: [
          'Up to 50 schools',
          'Standard analytics dashboard',
          'Game creation tools',
          'Email and chat support',
          'Regular system updates'
        ]
      },
      {
        id: 'admin-basic',
        name: 'Basic',
        price: 299.99,
        billingCycle: 'yearly',
        features: [
          'Up to 10 schools',
          'Basic analytics',
          'Pre-designed games only',
          'Email support'
        ]
      }
    ],
    school: [
      {
        id: 'school-premium',
        name: 'Premium',
        price: 499.99,
        billingCycle: 'yearly',
        features: [
          'Unlimited teachers and students',
          'All educational games',
          'Advanced performance analytics',
          'Custom report generation',
          'School-wide leaderboards',
          'Priority support',
          'Parent portal access'
        ],
        recommended: true,
        discount: '15% off first year'
      },
      {
        id: 'school-standard',
        name: 'Standard',
        price: 299.99,
        billingCycle: 'yearly',
        features: [
          'Up to 50 teachers',
          'Up to 1000 students',
          'Standard game library',
          'Basic analytics',
          'Regular support'
        ]
      },
      {
        id: 'school-basic',
        name: 'Basic',
        price: 149.99,
        billingCycle: 'yearly',
        features: [
          'Up to 20 teachers',
          'Up to 400 students',
          'Limited game access',
          'Email support'
        ]
      }
    ],
    teacher: [
      {
        id: 'teacher-premium',
        name: 'Premium',
        price: 14.99,
        billingCycle: 'monthly',
        features: [
          'All educational games',
          'Custom question creation',
          'Advanced student analytics',
          'Personalized learning paths',
          'Parent communication tools',
          'Offline access',
          'Priority support'
        ],
        recommended: true
      },
      {
        id: 'teacher-standard',
        name: 'Standard',
        price: 9.99,
        billingCycle: 'monthly',
        features: [
          'Standard game library',
          'Question bank access',
          'Student performance tracking',
          'Regular support'
        ]
      },
      {
        id: 'teacher-basic',
        name: 'Basic',
        price: 4.99,
        billingCycle: 'monthly',
        features: [
          'Basic games',
          'Limited question creation',
          'Basic student tracking',
          'Email support'
        ]
      }
    ],
    student: [
      {
        id: 'student-premium',
        name: 'Premium',
        price: 9.99,
        billingCycle: 'monthly',
        features: [
          'Full access to all games',
          'Advanced learning paths',
          'Personalized AI tutoring',
          'Progress reports',
          'Offline mode',
          'Ad-free experience',
          'Premium badges and rewards'
        ],
        recommended: true,
        discount: '3 months free with annual plan'
      },
      {
        id: 'student-standard',
        name: 'Standard',
        price: 5.99,
        billingCycle: 'monthly',
        features: [
          'Access to standard games',
          'Basic learning paths',
          'Limited tutoring sessions',
          'Ad-free experience'
        ]
      },
      {
        id: 'student-basic',
        name: 'Free',
        price: 0,
        billingCycle: 'monthly',
        features: [
          'Limited game access',
          'Basic progress tracking',
          'Ad-supported experience'
        ]
      }
    ]
  };

  // Get plans for current role
  const plans = paymentPlans[role] || [];

  // Handle plan selection
  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setErrors({});
  };

  // Handle payment method selection
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setErrors({});
  };

  // Handle card detail changes
  const handleCardDetailChange = (e) => {
    const { name, value } = e.target;
    setCardDetails({
      ...cardDetails,
      [name]: value
    });

    // Clear error when field is being edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};

    if (!selectedPlan) {
      newErrors.plan = 'Please select a plan';
    }

    if (paymentMethod === 'card') {
      if (!cardDetails.cardNumber.trim()) {
        newErrors.cardNumber = 'Card number is required';
      } else if (!/^\d{16}$/.test(cardDetails.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Invalid card number';
      }

      if (!cardDetails.cardHolder.trim()) {
        newErrors.cardHolder = 'Card holder name is required';
      }

      if (!cardDetails.expiryDate.trim()) {
        newErrors.expiryDate = 'Expiry date is required';
      } else if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiryDate)) {
        newErrors.expiryDate = 'Invalid format (MM/YY)';
      }

      if (!cardDetails.cvv.trim()) {
        newErrors.cvv = 'CVV is required';
      } else if (!/^\d{3,4}$/.test(cardDetails.cvv)) {
        newErrors.cvv = 'Invalid CVV';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      
      // After 2 seconds, call the onPaymentComplete callback
      setTimeout(() => {
        onPaymentComplete({
          plan: selectedPlan,
          paymentMethod,
          transactionId: 'TXN' + Math.floor(Math.random() * 1000000),
          timestamp: new Date().toISOString()
        });
      }, 2000);
    }, 2000);
  };

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Generate theme styles based on role
  const getThemeStyles = () => {
    if (!roleConfig) return {};

    const baseStyles = {
      backgroundGradient: `linear-gradient(135deg, ${roleConfig.primaryColor}10, ${roleConfig.secondaryColor}05)`,
      container: {
        background: 'rgba(20, 20, 40, 0.6)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        border: `1px solid ${roleConfig.primaryColor}30`,
        boxShadow: `0 10px 30px rgba(0, 0, 0, 0.2), 0 0 20px ${roleConfig.primaryColor}15`
      },
      card: {
        background: 'rgba(30, 30, 50, 0.6)',
        backdropFilter: 'blur(5px)',
        borderRadius: '15px',
        border: `1px solid ${roleConfig.primaryColor}20`,
        transition: 'all 0.3s ease'
      },
      inputStyle: {
        borderRadius: '12px',
        background: 'rgba(255, 255, 255, 0.05)',
        border: `1px solid ${roleConfig.primaryColor}30`,
        color: '#ffffff',
        transition: 'all 0.3s ease'
      },
      button: {
        background: `linear-gradient(45deg, ${roleConfig.primaryColor}, ${roleConfig.secondaryColor})`,
        color: '#000000',
        fontWeight: '600',
        borderRadius: '12px',
        border: 'none',
        boxShadow: `0 4px 15px ${roleConfig.primaryColor}40`
      }
    };

    // Role-specific style adjustments
    switch (roleConfig.theme) {
      case 'morphing-blob': // Student
        return {
          ...baseStyles,
          container: {
            ...baseStyles.container,
            borderRadius: '30px',
            background: 'rgba(20, 20, 40, 0.5)'
          },
          card: {
            ...baseStyles.card,
            borderRadius: '25px',
            boxShadow: `0 5px 20px rgba(0, 0, 0, 0.15), 0 0 15px ${roleConfig.primaryColor}20`
          },
          inputStyle: {
            ...baseStyles.inputStyle,
            borderRadius: '20px'
          },
          button: {
            ...baseStyles.button,
            borderRadius: '25px'
          }
        };

      case 'nature-soft': // Teacher
        return {
          ...baseStyles,
          card: {
            ...baseStyles.card,
            background: 'rgba(30, 30, 50, 0.5)',
            boxShadow: `0 4px 15px rgba(0, 0, 0, 0.15), 0 0 10px ${roleConfig.primaryColor}15`
          }
        };

      case 'split-screen': // School
        return {
          ...baseStyles,
          container: {
            ...baseStyles.container,
            background: 'linear-gradient(135deg, rgba(140, 122, 230, 0.1), rgba(255, 107, 157, 0.1))'
          }
        };

      case 'liquid-form': // Admin
        return {
          ...baseStyles,
          card: {
            ...baseStyles.card,
            background: 'rgba(40, 40, 60, 0.7)'
          },
          button: {
            ...baseStyles.button,
            position: 'relative',
            overflow: 'hidden'
          }
        };

      default:
        return baseStyles;
    }
  };

  const themeStyles = getThemeStyles();

  // Return the appropriate icon based on role
  const getRoleIcon = () => {
    switch (role) {
      case 'admin': return <MdAdminPanelSettings size={24} />;
      case 'school': return <MdOutlineSchool size={24} />;
      case 'teacher': return <MdPerson size={24} />;
      case 'student': return <MdGroups size={24} />;
      default: return null;
    }
  };

  // If payment was successful, show success screen
  if (paymentSuccess) {
    return (
      <div style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: themeStyles.backgroundGradient
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            ...themeStyles.container,
            padding: '40px',
            textAlign: 'center',
            maxWidth: '500px',
            width: '100%'
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, 10, 0] }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            style={{
              width: '100px',
              height: '100px',
              background: `linear-gradient(135deg, ${roleConfig.primaryColor}30, ${roleConfig.secondaryColor}30)`,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
              margin: '0 auto 30px',
              boxShadow: `0 0 40px ${roleConfig.primaryColor}40`
            }}
          >
            <FaCheckCircle color={roleConfig.primaryColor} />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{
              fontSize: '2rem',
              fontWeight: '700',
              marginBottom: '15px',
              background: `linear-gradient(45deg, ${roleConfig.primaryColor}, ${roleConfig.secondaryColor})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Payment Successful!
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            style={{
              fontSize: '1.1rem',
              lineHeight: '1.6',
              color: '#e0e0e0',
              marginBottom: '30px'
            }}
          >
            Thank you for subscribing to the <span style={{ color: roleConfig.primaryColor, fontWeight: '600' }}>{selectedPlan.name}</span> plan.
            Your account is now being set up and will be ready in just a moment.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            style={{
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '15px',
              marginBottom: '30px',
              border: `1px dashed ${roleConfig.primaryColor}40`
            }}
          >
            <p style={{ color: '#ffffff', margin: '0 0 5px 0', textAlign: 'left', fontSize: '0.9rem' }}>
              <strong>Transaction ID:</strong> TXN{Math.floor(Math.random() * 1000000)}
            </p>
            <p style={{ color: '#ffffff', margin: '0 0 5px 0', textAlign: 'left', fontSize: '0.9rem' }}>
              <strong>Date:</strong> {new Date().toLocaleDateString()}
            </p>
            <p style={{ color: '#ffffff', margin: '0', textAlign: 'left', fontSize: '0.9rem' }}>
              <strong>Amount:</strong> ${selectedPlan.price.toFixed(2)} / {selectedPlan.billingCycle}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            style={{
              width: '100%',
              height: '6px',
              background: `linear-gradient(to right, ${roleConfig.primaryColor}, ${roleConfig.secondaryColor})`,
              borderRadius: '3px',
              marginBottom: '30px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <motion.div
              animate={{
                x: ['-100%', '0%', '100%'],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '50%',
                height: '100%',
                background: 'rgba(255, 255, 255, 0.3)',
                borderRadius: '3px'
              }}
            />
          </motion.div>

          <p style={{ color: '#aaaaaa', fontSize: '0.9rem', marginBottom: '30px' }}>
            Redirecting you to account setup...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      background: themeStyles.backgroundGradient,
      padding: '20px 0'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          ...themeStyles.container,
          padding: '30px',
          maxWidth: '800px',
          width: '100%',
          color: '#ffffff',
          margin: '20px auto'
        }}
      >
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: '25px',
          position: 'sticky',
          top: '0',
          background: themeStyles.container.background,
          zIndex: 10,
          padding: '10px 0'
        }}>
          <motion.button 
            onClick={onBack}
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.9 }}
            style={{ 
              background: 'rgba(255, 255, 255, 0.1)',
              border: `2px solid ${roleConfig.primaryColor}40`,
              borderRadius: '12px',
              color: '#fff', 
              fontSize: '1.5rem', 
              cursor: 'pointer',
              padding: '8px 15px',
              marginRight: '15px'
            }}
          >
            ←
          </motion.button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
            <div style={{ fontSize: '1.8rem' }}>
              {getRoleIcon()}
            </div>
            
            <div>
              <h2 style={{ 
                fontSize: '1.6rem', 
                margin: 0, 
                color: roleConfig.primaryColor,
                fontWeight: '700'
              }}>
                Select Your {roleConfig.label} Plan
              </h2>
              <p style={{ margin: 0, color: '#cccccc', fontSize: '0.9rem' }}>
                Choose a subscription that fits your needs
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Plan Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              marginBottom: '30px'
            }}
          >
            <h3 style={{ 
              color: roleConfig.primaryColor, 
              marginBottom: '20px',
              fontSize: '1.2rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span>1</span> Choose Your Plan
            </h3>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
              gap: '20px'
            }}>
              {plans.map((plan) => (
                <motion.div
                  key={plan.id}
                  whileHover={{ y: -5, boxShadow: `0 10px 30px rgba(0, 0, 0, 0.2), 0 0 20px ${roleConfig.primaryColor}30` }}
                  style={{
                    ...themeStyles.card,
                    padding: '20px',
                    cursor: 'pointer',
                    border: selectedPlan && selectedPlan.id === plan.id 
                      ? `2px solid ${roleConfig.primaryColor}` 
                      : themeStyles.card.border,
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onClick={() => handlePlanSelect(plan)}
                >
                  {plan.recommended && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '-30px',
                      background: roleConfig.primaryColor,
                      color: '#000',
                      padding: '5px 30px',
                      transform: 'rotate(45deg)',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      zIndex: 1
                    }}>
                      RECOMMENDED
                    </div>
                  )}

                  <h4 style={{ 
                    fontSize: '1.3rem', 
                    margin: '0 0 5px 0', 
                    color: '#ffffff',
                    fontWeight: '700'
                  }}>
                    {plan.name}
                  </h4>
                  
                  <div style={{ marginBottom: '15px' }}>
                    <span style={{ 
                      fontSize: '2rem', 
                      color: roleConfig.primaryColor,
                      fontWeight: '700'
                    }}>
                      ${plan.price.toFixed(2)}
                    </span>
                    <span style={{ 
                      fontSize: '0.9rem',
                      color: '#aaaaaa'
                    }}>
                      /{plan.billingCycle}
                    </span>
                  </div>

                  {plan.discount && (
                    <div style={{
                      background: `${roleConfig.primaryColor}20`,
                      color: roleConfig.primaryColor,
                      padding: '5px 10px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      marginBottom: '15px',
                      display: 'inline-block'
                    }}>
                      {plan.discount}
                    </div>
                  )}
                  
                  <ul style={{ 
                    listStyle: 'none', 
                    padding: 0, 
                    margin: '15px 0',
                    fontSize: '0.9rem',
                    color: '#e0e0e0'
                  }}>
                    {plan.features.slice(0, 3).map((feature, index) => (
                      <li key={index} style={{ 
                        marginBottom: '8px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px' 
                      }}>
                        <span style={{ color: roleConfig.primaryColor, marginTop: '2px' }}>✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  {plan.features.length > 3 && (
                    <motion.div
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowPlanDetails(showPlanDetails === plan.id ? null : plan.id);
                      }}
                      style={{
                        fontSize: '0.8rem',
                        color: roleConfig.primaryColor,
                        cursor: 'pointer',
                        marginBottom: '15px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      <FaInfoCircle size={14} />
                      {showPlanDetails === plan.id ? 'Show less' : 'Show all features'}
                    </motion.div>
                  )}

                  <AnimatePresence>
                    {showPlanDetails === plan.id && (
                      <motion.ul
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ 
                          listStyle: 'none', 
                          padding: 0, 
                          margin: '0 0 15px 0',
                          fontSize: '0.9rem',
                          color: '#e0e0e0',
                          overflow: 'hidden'
                        }}
                      >
                        {plan.features.slice(3).map((feature, index) => (
                          <motion.li 
                            key={index} 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            style={{ 
                              marginBottom: '8px',
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '10px' 
                            }}
                          >
                            <span style={{ color: roleConfig.primaryColor, marginTop: '2px' }}>✓</span>
                            {feature}
                          </motion.li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePlanSelect(plan)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: selectedPlan && selectedPlan.id === plan.id 
                        ? `linear-gradient(45deg, ${roleConfig.primaryColor}, ${roleConfig.secondaryColor})` 
                        : 'rgba(255, 255, 255, 0.1)',
                      color: selectedPlan && selectedPlan.id === plan.id ? '#000000' : '#ffffff',
                      border: `1px solid ${roleConfig.primaryColor}40`,
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '0.9rem'
                    }}
                  >
                    {selectedPlan && selectedPlan.id === plan.id ? 'Selected' : 'Select Plan'}
                  </motion.button>
                </motion.div>
              ))}
            </div>

            {errors.plan && (
              <p style={{ 
                color: '#ff6b9d', 
                fontSize: '0.9rem', 
                marginTop: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>⚠️</span> {errors.plan}
              </p>
            )}
          </motion.div>

          {/* Step 2: Payment Method */}
          {selectedPlan && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              style={{ marginBottom: '30px' }}
            >
              <h3 style={{ 
                color: roleConfig.primaryColor, 
                marginBottom: '20px',
                fontSize: '1.2rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span>2</span> Payment Method
              </h3>

              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap',
                gap: '15px',
                marginBottom: '20px' 
              }}>
                <motion.div
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePaymentMethodChange('card')}
                  style={{
                    padding: '15px 20px',
                    background: paymentMethod === 'card' 
                      ? `linear-gradient(45deg, ${roleConfig.primaryColor}20, ${roleConfig.secondaryColor}20)` 
                      : 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    minWidth: '120px',
                    textAlign: 'center',
                    border: paymentMethod === 'card' 
                      ? `1px solid ${roleConfig.primaryColor}60` 
                      : '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <FaCreditCard size={24} color={paymentMethod === 'card' ? roleConfig.primaryColor : '#ffffff'} style={{ marginBottom: '8px' }} />
                  <div style={{ 
                    color: paymentMethod === 'card' ? roleConfig.primaryColor : '#ffffff',
                    fontWeight: paymentMethod === 'card' ? '600' : 'normal',
                    fontSize: '0.9rem'
                  }}>
                    Credit Card
                  </div>
                </motion.div>
                
                <motion.div
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePaymentMethodChange('paypal')}
                  style={{
                    padding: '15px 20px',
                    background: paymentMethod === 'paypal' 
                      ? `linear-gradient(45deg, ${roleConfig.primaryColor}20, ${roleConfig.secondaryColor}20)` 
                      : 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    minWidth: '120px',
                    textAlign: 'center',
                    border: paymentMethod === 'paypal' 
                      ? `1px solid ${roleConfig.primaryColor}60` 
                      : '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <FaPaypal size={24} color={paymentMethod === 'paypal' ? roleConfig.primaryColor : '#ffffff'} style={{ marginBottom: '8px' }} />
                  <div style={{ 
                    color: paymentMethod === 'paypal' ? roleConfig.primaryColor : '#ffffff',
                    fontWeight: paymentMethod === 'paypal' ? '600' : 'normal',
                    fontSize: '0.9rem'
                  }}>
                    PayPal
                  </div>
                </motion.div>
                
                <motion.div
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePaymentMethodChange('bank')}
                  style={{
                    padding: '15px 20px',
                    background: paymentMethod === 'bank' 
                      ? `linear-gradient(45deg, ${roleConfig.primaryColor}20, ${roleConfig.secondaryColor}20)` 
                      : 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    minWidth: '120px',
                    textAlign: 'center',
                    border: paymentMethod === 'bank' 
                      ? `1px solid ${roleConfig.primaryColor}60` 
                      : '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <FaUniversity size={24} color={paymentMethod === 'bank' ? roleConfig.primaryColor : '#ffffff'} style={{ marginBottom: '8px' }} />
                  <div style={{ 
                    color: paymentMethod === 'bank' ? roleConfig.primaryColor : '#ffffff',
                    fontWeight: paymentMethod === 'bank' ? '600' : 'normal',
                    fontSize: '0.9rem'
                  }}>
                    Bank Transfer
                  </div>
                </motion.div>
              </div>

              {/* Credit Card Form */}
              <AnimatePresence>
                {paymentMethod === 'card' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{
                      overflow: 'hidden'
                    }}
                  >
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '15px',
                      padding: '20px',
                      marginBottom: '20px'
                    }}>
                      <div style={{
                        background: `linear-gradient(135deg, rgba(30, 30, 60, 0.9), rgba(40, 40, 70, 0.9))`,
                        borderRadius: '12px',
                        padding: '20px',
                        marginBottom: '20px',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
                        minHeight: '180px'
                      }}>
                        {/* Card shine effect */}
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '30%',
                          background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.1), transparent)',
                          borderTopLeftRadius: '12px',
                          borderTopRightRadius: '12px'
                        }} />

                        <div style={{
                          position: 'absolute',
                          top: '20px',
                          right: '20px',
                          fontSize: '24px',
                          color: '#ffffff80'
                        }}>
                          <RiSecurePaymentLine />
                        </div>

                        <div style={{
                          position: 'absolute',
                          bottom: '20px',
                          right: '20px',
                          width: '50px',
                          height: '50px',
                          background: `linear-gradient(45deg, ${roleConfig.primaryColor}, ${roleConfig.secondaryColor})`,
                          borderRadius: '50%',
                          opacity: 0.8
                        }} />

                        <div style={{
                          position: 'absolute',
                          bottom: '40px',
                          right: '80px',
                          width: '30px',
                          height: '30px',
                          background: `linear-gradient(45deg, ${roleConfig.secondaryColor}, ${roleConfig.primaryColor})`,
                          borderRadius: '50%',
                          opacity: 0.5
                        }} />

                        <div style={{ marginBottom: '20px', fontSize: '1.1rem', color: '#ffffff' }}>
                          {cardDetails.cardNumber ? formatCardNumber(cardDetails.cardNumber) : '•••• •••• •••• ••••'}
                        </div>

                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          color: '#ffffff80',
                          fontSize: '0.8rem'
                        }}>
                          <div>
                            <div style={{ marginBottom: '5px' }}>CARD HOLDER</div>
                            <div style={{ color: '#ffffff', textTransform: 'uppercase' }}>
                              {cardDetails.cardHolder || 'YOUR NAME'}
                            </div>
                          </div>
                          <div>
                            <div style={{ marginBottom: '5px' }}>EXPIRES</div>
                            <div style={{ color: '#ffffff' }}>
                              {cardDetails.expiryDate || 'MM/YY'}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '15px'
                      }}>
                        <div>
                          <label style={{ 
                            display: 'block', 
                            marginBottom: '8px', 
                            color: '#ffffff',
                            fontSize: '0.9rem'
                          }}>
                            Card Number
                          </label>
                          <input
                            type="text"
                            name="cardNumber"
                            value={cardDetails.cardNumber}
                            onChange={(e) => {
                              const formattedValue = formatCardNumber(e.target.value);
                              handleCardDetailChange({
                                target: {
                                  name: 'cardNumber',
                                  value: formattedValue
                                }
                              });
                            }}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            style={{
                              ...themeStyles.inputStyle,
                              width: '100%',
                              padding: '12px 15px',
                              fontSize: '0.9rem',
                              border: errors.cardNumber ? '1px solid #ff6b9d' : themeStyles.inputStyle.border
                            }}
                          />
                          {errors.cardNumber && (
                            <p style={{ color: '#ff6b9d', fontSize: '0.8rem', margin: '5px 0 0 0' }}>
                              {errors.cardNumber}
                            </p>
                          )}
                        </div>

                        <div>
                          <label style={{ 
                            display: 'block', 
                            marginBottom: '8px', 
                            color: '#ffffff',
                            fontSize: '0.9rem'
                          }}>
                            Card Holder
                          </label>
                          <input
                            type="text"
                            name="cardHolder"
                            value={cardDetails.cardHolder}
                            onChange={handleCardDetailChange}
                            placeholder="John Doe"
                            style={{
                              ...themeStyles.inputStyle,
                              width: '100%',
                              padding: '12px 15px',
                              fontSize: '0.9rem',
                              border: errors.cardHolder ? '1px solid #ff6b9d' : themeStyles.inputStyle.border
                            }}
                          />
                          {errors.cardHolder && (
                            <p style={{ color: '#ff6b9d', fontSize: '0.8rem', margin: '5px 0 0 0' }}>
                              {errors.cardHolder}
                            </p>
                          )}
                        </div>

                        <div>
                          <label style={{ 
                            display: 'block', 
                            marginBottom: '8px', 
                            color: '#ffffff',
                            fontSize: '0.9rem'
                          }}>
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            name="expiryDate"
                            value={cardDetails.expiryDate}
                            onChange={handleCardDetailChange}
                            placeholder="MM/YY"
                            maxLength={5}
                            style={{
                              ...themeStyles.inputStyle,
                              width: '100%',
                              padding: '12px 15px',
                              fontSize: '0.9rem',
                              border: errors.expiryDate ? '1px solid #ff6b9d' : themeStyles.inputStyle.border
                            }}
                          />
                          {errors.expiryDate && (
                            <p style={{ color: '#ff6b9d', fontSize: '0.8rem', margin: '5px 0 0 0' }}>
                              {errors.expiryDate}
                            </p>
                          )}
                        </div>

                        <div>
                          <label style={{ 
                            display: 'block', 
                            marginBottom: '8px', 
                            color: '#ffffff',
                            fontSize: '0.9rem'
                          }}>
                            CVV
                          </label>
                          <input
                            type="text"
                            name="cvv"
                            value={cardDetails.cvv}
                            onChange={handleCardDetailChange}
                            placeholder="123"
                            maxLength={4}
                            style={{
                              ...themeStyles.inputStyle,
                              width: '100%',
                              padding: '12px 15px',
                              fontSize: '0.9rem',
                              border: errors.cvv ? '1px solid #ff6b9d' : themeStyles.inputStyle.border
                            }}
                          />
                          {errors.cvv && (
                            <p style={{ color: '#ff6b9d', fontSize: '0.8rem', margin: '5px 0 0 0' }}>
                              {errors.cvv}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {paymentMethod === 'paypal' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{
                      overflow: 'hidden',
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '15px',
                      padding: '30px 20px',
                      marginBottom: '20px',
                      textAlign: 'center'
                    }}
                  >
                    <FaPaypal size={50} color="#00a8ff" style={{ marginBottom: '15px' }} />
                    <p style={{ color: '#ffffff', marginBottom: '20px' }}>
                      You will be redirected to PayPal to complete your payment securely.
                    </p>
                    <div style={{
                      padding: '15px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '10px',
                      maxWidth: '400px',
                      margin: '0 auto',
                      border: '1px dashed rgba(255, 255, 255, 0.2)'
                    }}>
                      <p style={{ margin: '0 0 10px 0', color: '#aaaaaa', fontSize: '0.9rem' }}>
                        Total Amount:
                      </p>
                      <p style={{ margin: '0', color: '#ffffff', fontSize: '1.5rem', fontWeight: '600' }}>
                        ${selectedPlan.price.toFixed(2)} / {selectedPlan.billingCycle}
                      </p>
                    </div>
                  </motion.div>
                )}

                {paymentMethod === 'bank' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{
                      overflow: 'hidden',
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '15px',
                      padding: '20px',
                      marginBottom: '20px'
                    }}
                  >
                    <p style={{ color: '#ffffff', marginBottom: '20px' }}>
                      Please use the following details to complete your bank transfer:
                    </p>
                    
                    <div style={{ 
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '15px',
                      marginBottom: '20px'
                    }}>
                      <div>
                        <p style={{ margin: '0 0 5px 0', color: '#aaaaaa', fontSize: '0.9rem' }}>
                          Account Name
                        </p>
                        <p style={{ margin: '0', color: '#ffffff', fontWeight: '600' }}>
                          Cognify Education Ltd
                        </p>
                      </div>
                      
                      <div>
                        <p style={{ margin: '0 0 5px 0', color: '#aaaaaa', fontSize: '0.9rem' }}>
                          Account Number
                        </p>
                        <p style={{ margin: '0', color: '#ffffff', fontWeight: '600' }}>
                          1234567890
                        </p>
                      </div>
                      
                      <div>
                        <p style={{ margin: '0 0 5px 0', color: '#aaaaaa', fontSize: '0.9rem' }}>
                          Bank Name
                        </p>
                        <p style={{ margin: '0', color: '#ffffff', fontWeight: '600' }}>
                          International Education Bank
                        </p>
                      </div>
                      
                      <div>
                        <p style={{ margin: '0 0 5px 0', color: '#aaaaaa', fontSize: '0.9rem' }}>
                          SWIFT/BIC
                        </p>
                        <p style={{ margin: '0', color: '#ffffff', fontWeight: '600' }}>
                          IEDUBANX
                        </p>
                      </div>
                    </div>
                    
                    <div style={{
                      padding: '15px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '10px',
                      border: '1px dashed rgba(255, 255, 255, 0.2)',
                      marginBottom: '15px'
                    }}>
                      <p style={{ margin: '0 0 5px 0', color: '#aaaaaa', fontSize: '0.9rem' }}>
                        Payment Reference (Important)
                      </p>
                      <p style={{ margin: '0', color: roleConfig.primaryColor, fontWeight: '600' }}>
                        COGNIFY-{role.toUpperCase()}-{Math.floor(Math.random() * 1000000)}
                      </p>
                    </div>
                    
                    <p style={{ color: '#aaaaaa', fontSize: '0.9rem', margin: '0' }}>
                      Please include the payment reference in your transfer. Your account will be activated within 24 hours after we receive your payment.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Order Summary */}
          {selectedPlan && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '15px',
                padding: '20px',
                marginBottom: '30px'
              }}
            >
              <h3 style={{ 
                color: roleConfig.primaryColor, 
                marginBottom: '20px',
                fontSize: '1.2rem',
                fontWeight: '600'
              }}>
                Order Summary
              </h3>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <span style={{ color: '#ffffff' }}>
                  {roleConfig.label} {selectedPlan.name} Plan
                </span>
                <span style={{ color: '#ffffff', fontWeight: '600' }}>
                  ${selectedPlan.price.toFixed(2)}
                </span>
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <span style={{ color: '#ffffff' }}>
                  Billing Cycle
                </span>
                <span style={{ color: '#ffffff', textTransform: 'capitalize' }}>
                  {selectedPlan.billingCycle}
                </span>
              </div>
              
              {selectedPlan.discount && (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  padding: '10px 0',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <span style={{ color: roleConfig.primaryColor }}>
                    Discount
                  </span>
                  <span style={{ color: roleConfig.primaryColor }}>
                    {selectedPlan.discount}
                  </span>
                </div>
              )}
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                padding: '15px 0',
                marginTop: '5px'
              }}>
                <span style={{ color: '#ffffff', fontSize: '1.1rem', fontWeight: '600' }}>
                  Total
                </span>
                <span style={{ color: roleConfig.primaryColor, fontSize: '1.1rem', fontWeight: '700' }}>
                  ${selectedPlan.price.toFixed(2)} / {selectedPlan.billingCycle}
                </span>
              </div>
            </motion.div>
          )}

          {/* Submit Button */}
          {selectedPlan && (
            <motion.button
              type="submit"
              disabled={isProcessing}
              whileHover={{ 
                scale: isProcessing ? 1 : 1.02,
                boxShadow: isProcessing ? 'none' : `0 0 30px ${roleConfig.primaryColor}60`
              }}
              whileTap={{ scale: isProcessing ? 1 : 0.98 }}
              style={{
                ...themeStyles.button,
                width: '100%',
                padding: '16px',
                fontSize: '1rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                opacity: isProcessing ? 0.7 : 1,
                cursor: isProcessing ? 'not-allowed' : 'pointer'
              }}
            >
              {isProcessing ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    style={{
                      width: '20px',
                      height: '20px',
                      border: '3px solid rgba(0, 0, 0, 0.3)',
                      borderTop: '3px solid #000000',
                      borderRadius: '50%'
                    }}
                  />
                  Processing Payment...
                </>
              ) : (
                <>
                  <RiSecurePaymentLine size={20} />
                  Complete Payment
                </>
              )}
            </motion.button>
          )}
        </form>

        {/* Security Note */}
        <div style={{ 
          marginTop: '30px',
          textAlign: 'center',
          color: '#aaaaaa',
          fontSize: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          <RiSecurePaymentLine />
          All payments are secure and encrypted. We never store your full payment details.
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentOptions;