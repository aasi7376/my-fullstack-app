// Fixed RegistrationForm.js component with proper redirection logic and debugging

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Extract auth functions
  const { 
    isAuthenticated, 
    register: authRegister, 
    refreshUserData,
    validateTokenWithApi,
    isTokenValid
  } = useAuth();
  
  // Debugging - Monitor auth state
  useEffect(() => {
    console.log('[RegistrationForm] Auth state:', { isAuthenticated });
  }, [isAuthenticated]);
  
  // State for API connection status
  const [apiStatus, setApiStatus] = useState({ connected: true, message: 'Connected' });
  
  // Check API connection on load
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const isConnected = await api.init();
        setApiStatus({ 
          connected: isConnected, 
          message: isConnected ? 'Connected' : 'Not connected to server' 
        });
      } catch (err) {
        setApiStatus({ 
          connected: false, 
          message: 'Server connection error' 
        });
      }
    };
    
    checkApiStatus();
  }, []);
  
  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log('[RegistrationForm] User is already authenticated, redirecting to dashboard');
      navigateToDashboard();
    }
  }, [isAuthenticated]);
  
  // Helper function to navigate to dashboard based on role
  const navigateToDashboard = () => {
    // Get current user info from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        const dashboardPath = `/${user.role}/dashboard`;
        console.log(`[RegistrationForm] Navigating to ${dashboardPath}`);
        navigate(dashboardPath, { replace: true });
      } catch (e) {
        console.error('Error parsing user data from localStorage:', e);
        navigate('/');
      }
    } else {
      navigate('/');
    }
  };
  
  // State for active form type
  const [activeForm, setActiveForm] = useState('admin');
  
  // Common state for form transitions
  const [animatingOut, setAnimatingOut] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Registration success state
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
  // States for different form types
  const [adminFormData, setAdminFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminCode: '',
    department: 'it',
    accessLevel: 'level1',
    role: 'admin'
  });
  
  const [schoolFormData, setSchoolFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    principalName: '',
    password: '',
    confirmPassword: '',
    schoolCode: 'SCH-' + Math.floor(1000 + Math.random() * 9000),
    schoolType: 'public',
    role: 'school'
  });
  
  const [teacherFormData, setTeacherFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    subjects: [''],
    experience: '',
    qualification: '',
    schoolName: '',
    password: '',
    confirmPassword: '',
    role: 'teacher'
  });
  
  const [studentFormData, setStudentFormData] = useState({
    name: '',
    email: '',
    parentEmail: '',
    phoneNumber: '',
    grade: 'elementary',
    birthDate: '',
    school: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });
  
  // Animation states
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeInput, setActiveInput] = useState(null);
  const [hoverState, setHoverState] = useState({});
  
  // Navigate to home page
  const handleBackToHome = useCallback(() => {
    console.log('Navigating back to home...');
    navigate('/');
  }, [navigate]);

  // Switch between form types with animation
  const switchForm = useCallback((formType) => {
    if (activeForm === formType) return;
    
    setAnimatingOut(true);
    setTimeout(() => {
      setActiveForm(formType);
      setAnimatingOut(false);
      setError('');
      
      setIsHovering(false);
      setHoverState({});
      setActiveInput(null);
    }, 300);
  }, [activeForm]);
  
  // Form change handlers
  const handleAdminChange = useCallback((e) => {
    const { name, value } = e.target;
    setAdminFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);
  
  const handleSchoolChange = useCallback((e) => {
    const { name, value } = e.target;
    setSchoolFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);
  
  const handleTeacherChange = useCallback((e) => {
    const { name, value } = e.target;
    
    if (name === 'subjects') {
      setTeacherFormData(prev => ({
        ...prev,
        subjects: [value]
      }));
    } else {
      setTeacherFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  }, []);
  
  const handleStudentChange = useCallback((e) => {
    const { name, value } = e.target;
    setStudentFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);
  
  // Helper function for input hover states
  const handleInputHover = useCallback((inputName, isHovering) => {
    setHoverState(prev => ({
      ...prev,
      [inputName]: isHovering
    }));
  }, []);
  
  // Form validation functions
  const validateAdminForm = useCallback(() => {
    if (!adminFormData.name || !adminFormData.email || !adminFormData.password) {
      setError('Name, email and password are required');
      return false;
    }
    
    if (adminFormData.password !== adminFormData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(adminFormData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    return true;
  }, [adminFormData]);
  
  const validateSchoolForm = useCallback(() => {
    if (!schoolFormData.name || !schoolFormData.email || !schoolFormData.phoneNumber || 
        !schoolFormData.address || !schoolFormData.principalName || !schoolFormData.password) {
      setError('All fields are required');
      return false;
    }
    
    if (schoolFormData.password !== schoolFormData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(schoolFormData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    return true;
  }, [schoolFormData]);
  
  const validateTeacherForm = useCallback(() => {
    if (!teacherFormData.name || !teacherFormData.email || !teacherFormData.phoneNumber || 
        !teacherFormData.subjects?.[0] || !teacherFormData.experience || 
        !teacherFormData.qualification || !teacherFormData.password || !teacherFormData.schoolName) {
      setError('All fields are required');
      return false;
    }
    
    if (teacherFormData.password !== teacherFormData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(teacherFormData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    return true;
  }, [teacherFormData]);
  
  const validateStudentForm = useCallback(() => {
    if (!studentFormData.name || !studentFormData.email || !studentFormData.parentEmail || 
        !studentFormData.phoneNumber || !studentFormData.grade || !studentFormData.school ||
        !studentFormData.birthDate || !studentFormData.password) {
      setError('All fields are required');
      return false;
    }
    
    if (studentFormData.password !== studentFormData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(studentFormData.email) || !emailRegex.test(studentFormData.parentEmail)) {
      setError('Please enter valid email addresses');
      return false;
    }
    
    return true;
  }, [studentFormData]);

  // Debug function to check for missing fields
  const debugRegistrationData = (formData) => {
    console.log('🔍 DEBUG: Registration data being sent:');
    console.log(JSON.stringify(formData, null, 2));
    
    // Check for missing required fields based on role
    const requiredFields = {
      admin: ['name', 'email', 'password', 'role', 'department', 'accessLevel'],
      school: ['name', 'email', 'password', 'role', 'phoneNumber', 'address', 'principalName', 'schoolType'],
      teacher: ['name', 'email', 'password', 'role', 'phoneNumber', 'subjects', 'experience', 'qualification', 'schoolName'],
      student: ['name', 'email', 'password', 'role', 'parentEmail', 'phoneNumber', 'grade', 'birthDate', 'school']
    };
    
    const role = formData.role;
    const missing = requiredFields[role]?.filter(field => !formData[field] && field !== 'role');
    
    if (missing && missing.length > 0) {
      console.log('⚠️ Missing required fields:', missing);
    }
    
    return formData;
  };

  // Admin form submit handler
  const handleAdminSubmit = async () => {
    if (!validateAdminForm()) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      console.log('[RegistrationForm] Starting admin registration with data:', {
        ...adminFormData,
        password: '********' // Mask password in logs
      });
      
      // Prepare request data with all required fields
      const requestData = debugRegistrationData({
        // User model fields
        name: adminFormData.name,
        email: adminFormData.email,
        password: adminFormData.password,
        role: 'admin',
        
        // Admin model fields
        department: adminFormData.department || 'it',
        accessLevel: adminFormData.accessLevel || 'level1',
        adminId: adminFormData.adminId || `ADM${Date.now()}`, // Generate ID if not provided
        
        // Additional fields if needed
        adminCode: adminFormData.adminCode
      });
      
      console.log('[RegistrationForm] Sending registration data with required fields');
      
      // Use the api service for registration
      const response = await api.register(requestData);
      
      console.log('[RegistrationForm] Registration response:', response);
      
      if (!response.success) {
        throw new Error(response.error || 'Registration failed');
      }
      
      // Show success message
      showNotification('Registration successful! Redirecting to dashboard...', 'success');
      
      // Set registration success for UI feedback
      setRegistrationSuccess(true);
      
      // Use timeout to ensure the user sees the success message
      setTimeout(() => {
        // Redirect to admin dashboard
        navigate('/admin/dashboard');
      }, 2000);
      
    } catch (err) {
      console.error('[RegistrationForm] Registration error:', err);
      
      // Extract error message from response if available
      const errorMessage = err.response?.data?.message || err.message || 'An unexpected error occurred';
      setError(errorMessage);
      setIsSubmitting(false);
    }
  };

  // School form submit handler
  const handleSchoolSubmit = async () => {
    if (!validateSchoolForm()) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      console.log('[RegistrationForm] Starting school registration');
      
      // Debug and prepare data
      const requestData = debugRegistrationData({
        ...schoolFormData,
        password: schoolFormData.password // Include password
      });
      
      // Use API register directly
      const response = await api.register(requestData);
      
      if (!response.success) {
        throw new Error(response.error || 'Registration failed');
      }
      
      // Show success message
      showNotification('School registration successful! Redirecting to dashboard...', 'success');
      
      // Set registration success for UI feedback
      setRegistrationSuccess(true);
      
      // Redirect after a delay
      setTimeout(() => {
        navigate('/school/dashboard');
      }, 2000);
      
    } catch (err) {
      console.error('[RegistrationForm] Registration error:', err);
      setError(err.message || 'An unexpected error occurred');
      setIsSubmitting(false);
    }
  };

  // Teacher form submit handler
  const handleTeacherSubmit = async () => {
    if (!validateTeacherForm()) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      console.log('[RegistrationForm] Starting teacher registration');
      
      // Debug and prepare data
      const requestData = debugRegistrationData({
        ...teacherFormData,
        // Ensure subjects is an array
        subjects: Array.isArray(teacherFormData.subjects) 
          ? teacherFormData.subjects 
          : [teacherFormData.subjects].filter(Boolean)
      });
      
      // Use API register directly
      const response = await api.register(requestData);
      
      if (!response.success) {
        throw new Error(response.error || 'Registration failed');
      }
      
      // Show success message
      showNotification('Teacher registration successful! Redirecting to dashboard...', 'success');
      
      // Set registration success for UI feedback
      setRegistrationSuccess(true);
      
      // Redirect after a delay
      setTimeout(() => {
        navigate('/teacher/dashboard');
      }, 2000);
      
    } catch (err) {
      console.error('[RegistrationForm] Registration error:', err);
      setError(err.message || 'An unexpected error occurred');
      setIsSubmitting(false);
    }
  };

  // Student form submit handler
  const handleStudentSubmit = async () => {
    if (!validateStudentForm()) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      console.log('[RegistrationForm] Starting student registration');
      
      // Debug and prepare data
      const requestData = debugRegistrationData({
        ...studentFormData,
        // Format birthDate if needed
        birthDate: studentFormData.birthDate instanceof Date 
          ? studentFormData.birthDate.toISOString().split('T')[0] 
          : studentFormData.birthDate
      });
      
      // Use API register directly
      const response = await api.register(requestData);
      
      if (!response.success) {
        throw new Error(response.error || 'Registration failed');
      }
      
      // Show success message
      showNotification('Student registration successful! Redirecting to dashboard...', 'success');
      
      // Set registration success for UI feedback
      setRegistrationSuccess(true);
      
      // Redirect after a delay
      setTimeout(() => {
        navigate('/student/dashboard');
      }, 2000);
      
    } catch (err) {
      console.error('[RegistrationForm] Registration error:', err);
      setError(err.message || 'An unexpected error occurred');
      setIsSubmitting(false);
    }
  };
  
  // Show notification function
  const showNotification = (message, type = 'success') => {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.notification-toast');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification-toast fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform translate-x-full`;
    
    // Add color based on type
    switch (type) {
      case 'success':
        notification.classList.add('bg-green-600', 'text-white');
        break;
      case 'error':
        notification.classList.add('bg-red-600', 'text-white');
        break;
      default:
        notification.classList.add('bg-gray-700', 'text-white');
    }
    
    // Add message
    notification.textContent = message;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Trigger animation
    requestAnimationFrame(() => {
      notification.classList.add('notification-animate');
    });
    
    // Remove after duration
    setTimeout(() => {
      notification.classList.add('notification-exit');
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  };

  // Effect to track mouse position for the follower effect
  useEffect(() => {
    if (activeForm !== 'admin' || isSubmitting) return;
    
    let lastUpdate = 0;
    const throttleTime = 50; // Only update every 50ms
    
    const handleMouseMove = (e) => {
      const now = Date.now();
      if (now - lastUpdate > throttleTime) {
        setMousePosition({ x: e.clientX, y: e.clientY });
        lastUpdate = now;
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [activeForm, isSubmitting]);

  // Extracted BackToHomeButton component to ensure consistency
  const BackToHomeButton = () => (
    <motion.button
      onClick={handleBackToHome}
      className="absolute top-4 left-4 z-20 text-blue-400 flex items-center hover:text-blue-300 transition-colors"
      whileHover={{ x: -5 }}
      whileTap={{ scale: 0.95 }}
    >
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
      </svg>
      Back to Home
    </motion.button>
  );

  // Display API status indicator
  const ApiStatusIndicator = () => (
    <div className={`absolute top-4 right-4 z-20 flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
      apiStatus.connected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`}>
      <div className={`w-2 h-2 mr-2 rounded-full ${
        apiStatus.connected ? 'bg-green-500' : 'bg-red-500'
      }`}></div>
      {apiStatus.message}
    </div>
  );

  // Success screen - NEW COMPONENT for better UI feedback
  const renderSuccessScreen = () => (
    <motion.div 
      className="flex items-center justify-center min-h-screen bg-gray-50 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative z-10 w-full max-w-md px-4">
        <motion.div 
          className="bg-white rounded-lg shadow-lg p-8 text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
        >
          <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
          <p className="text-gray-600 mb-6">Your account has been created. You're being redirected to the dashboard...</p>
          
          <div className="flex justify-center">
            <div className="w-12 h-12">
              <svg className="animate-spin w-full h-full text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>
          
          <button onClick={() => {
              const role = activeForm || 'admin';
              navigate(`/${role}/dashboard`);
            }}
            className="mt-6 px-6 py-2.5 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-all duration-200"
          >
            Go to Dashboard Now
          </button>
          
          <div className="mt-4 text-sm text-gray-500">
            If you're not redirected automatically, click the button above.
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
  
  // If registration is successful, show success screen
  if (registrationSuccess) {
    return renderSuccessScreen();
  }
  
  // Main component render with optimized form switching UI
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 overflow-hidden relative">
      {/* Form selection tabs */}
      <div className="relative z-10 pt-6 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="flex flex-wrap justify-center gap-3 mb-8"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <motion.button 
              onClick={() => switchForm('admin')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                activeForm === 'admin' 
                  ? 'bg-blue-700 text-white shadow-md' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
              whileHover={{ scale:1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Admin
            </motion.button>
            <motion.button 
              onClick={() => switchForm('school')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                activeForm === 'school' 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              School
            </motion.button>
            <motion.button 
              onClick={() => switchForm('teacher')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                activeForm === 'teacher' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Teacher
            </motion.button>
            <motion.button 
              onClick={() => switchForm('student')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                activeForm === 'student' 
                  ? 'bg-gray-800 text-white shadow-md' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Student
            </motion.button>
          </motion.div>
        </div>
      </div>
      
      {/* Form content container with optimized animation */}
      <div className="relative z-10 container mx-auto pb-12">
        <AnimatePresence mode="wait">
          <div className={`form-container transition-all duration-300 ${animatingOut ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'}`}>
            {activeForm === 'admin' && (
              <motion.div 
                className="flex items-center justify-center min-h-screen bg-gray-900 overflow-hidden relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Background grid */}
                <div className="absolute inset-0 z-0">
                  <div className="grid-background"></div>
                </div>
                
                {/* Simplified glow effect */}
                {!isSubmitting && isHovering && (
                  <div 
                    className="cursor-glow absolute pointer-events-none blur-[60px] opacity-30 rounded-full w-64 h-64 -translate-x-1/2 -translate-y-1/2 z-0"
                    style={{
                      background: 'radial-gradient(circle, #3b82f6, transparent 70%)',
                      left: `${mousePosition.x}px`,
                      top: `${mousePosition.y}px`
                    }}
                  ></div>
                )}
                
                {/* Back button */}
                <BackToHomeButton />
                
                {/* API Status */}
                <ApiStatusIndicator />
                
                {/* Card Container */}
                <div 
                  className="relative z-10 w-full max-w-md px-4"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <motion.div 
                    className="bg-gray-800 border border-blue-500/30 rounded-xl p-8 transition-all duration-300 shadow-xl"
                    style={{
                      boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)'
                    }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="relative">
                      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 mb-6 tracking-wider text-center">
                        ADMIN REGISTRATION
                      </h2>
                      
                      {/* Simplified decorative elements */}
                      <div className="absolute -top-10 -left-10 w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 opacity-30 blur-xl"></div>
                      <div className="absolute -bottom-10 -right-10 w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 opacity-30 blur-xl"></div>
                      
                      {error && (
                        <div className="bg-red-900/30 border border-red-500/50 text-red-200 px-4 py-2 rounded mb-4 text-sm">
                          {error}
                        </div>
                      )}
                      
                      <div className="space-y-5">
                        <div className="space-y-1">
                          <label className="block text-blue-300 text-sm font-medium">Full Name</label>
                          <input
                            type="text"
                            name="name"
                            value={adminFormData.name}
                            onChange={handleAdminChange}
                            className="w-full px-4 py-2.5 bg-gray-900/80 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all"/>
                        </div>
                        
                        <div className="space-y-1">
                          <label className="block text-blue-300 text-sm font-medium">Email</label>
                          <input
                            type="email"
                            name="email"
                            value={adminFormData.email}
                            onChange={handleAdminChange}
                            className="w-full px-4 py-2.5 bg-gray-900/80 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all"
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <label className="block text-blue-300 text-sm font-medium">Department</label>
                          <select
                            name="department"
                            value={adminFormData.department}
                            onChange={handleAdminChange}
                            className="w-full px-4 py-2.5 bg-gray-900/80 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all"
                          >
                            <option value="it">IT Department</option>
                            <option value="academics">Academic Affairs</option>
                            <option value="finance">Finance Department</option>
                            <option value="management">Management</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="block text-blue-300 text-sm font-medium">Access Level</label>
                          <select
                            name="accessLevel"
                            value={adminFormData.accessLevel}
                            onChange={handleAdminChange}
                            className="w-full px-4 py-2.5 bg-gray-900/80 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all"
                          >
                           <option value="level1">Level 1 - Basic Access</option>
                            <option value="level2">Level 2 - Standard Access</option>
                            <option value="level3">Level 3 - Full Access</option>
                          </select>
                        </div>
                        
                        <div className="space-y-1">
                          <label className="block text-blue-300 text-sm font-medium">Admin Code</label>
                          <input
                            type="text"
                            name="adminCode"
                            value={adminFormData.adminCode}
                            onChange={handleAdminChange}
                            className="w-full px-4 py-2.5 bg-gray-900/80 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all"
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <label className="block text-blue-300 text-sm font-medium">Password</label>
                          <input
                            type="password"
                            name="password"
                            value={adminFormData.password}
                            onChange={handleAdminChange}
                            className="w-full px-4 py-2.5 bg-gray-900/80 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all"
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <label className="block text-blue-300 text-sm font-medium">Confirm Password</label>
                          <input
                            type="password"
                            name="confirmPassword"
                            value={adminFormData.confirmPassword}
                            onChange={handleAdminChange}
                            className="w-full px-4 py-2.5 bg-gray-900/80 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all"
                          />
                        </div>
                        
                        <motion.button
                          onClick={handleAdminSubmit}
                          className="w-full py-3 px-4 mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-indigo-700 transform transition-all duration-200"
                          whileTap={{ scale: 0.98 }}
                          disabled={isSubmitting || !apiStatus.connected}
                        >
                          {isSubmitting ? (
                            <span className="flex items-center justify-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              REGISTERING...
                            </span>
                          ) : !apiStatus.connected ? 'SERVER OFFLINE' : 'REGISTER'}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
            
            {activeForm === 'school' && (
              <motion.div 
                className="flex items-center justify-center min-h-screen bg-gray-50 relative overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Simplified background patterns */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <div 
                    className="absolute top-0 right-0 w-1/3 h-1/3 bg-purple-100 rounded-bl-full opacity-70"
                  ></div>
                  <div 
                    className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-indigo-100 rounded-tr-full opacity-70"
                  ></div>
                </div>

                {/* Back button */}
                <BackToHomeButton />
                
                {/* API Status */}
                <ApiStatusIndicator />
                
                {/* Form Card */}
                <div className="relative z-10 w-full max-w-md px-4">
                  <motion.div 
                    className="bg-white rounded-lg shadow-xl p-8 transform"
                    style={{
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                    }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                  >
                    <div className="text-center mb-6">
                      <h2 className="text-3xl font-bold text-purple-800 tracking-wide">
                        School Registration
                      </h2>
                      <div className="mt-2 h-1 w-24 mx-auto rounded-full bg-purple-600"></div>
                    </div>
                    
                    {error && (
                      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 text-sm">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p>{error}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-4">
                      <div className="relative">
                        <input
                          type="text"
                          name="name"
                          value={schoolFormData.name}
                          onChange={handleSchoolChange}
                          onFocus={() => setActiveInput('name')}
                          onBlur={() => setActiveInput(null)}
                          placeholder="School Name"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          value={schoolFormData.email}
                          onChange={handleSchoolChange}
                          onFocus={() => setActiveInput('email')}
                          onBlur={() => setActiveInput(null)}
                          placeholder="Email Address"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      
                      <div className="relative">
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={schoolFormData.phoneNumber}
                          onChange={handleSchoolChange}
                          onFocus={() => setActiveInput('phoneNumber')}
                          onBlur={() => setActiveInput(null)}
                          placeholder="Phone Number"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      
                      <div className="relative">
                        <input
                          type="text"
                          name="address"
                          value={schoolFormData.address}
                          onChange={handleSchoolChange}
                          onFocus={() => setActiveInput('address')}
                          onBlur={() => setActiveInput(null)}
                          placeholder="School Address"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      
                      <div className="relative">
                        <input
                          type="text"
                          name="principalName"
                          value={schoolFormData.principalName}
                          onChange={handleSchoolChange}
                          onFocus={() => setActiveInput('principalName')}
                          onBlur={() => setActiveInput(null)}
                          placeholder="Principal Name"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      
                      <div className="relative">
                        <input
                          type="text"
                          name="schoolCode"
                          value={schoolFormData.schoolCode}
                          onChange={handleSchoolChange}
                          onFocus={() => setActiveInput('schoolCode')}
                          onBlur={() => setActiveInput(null)}
                          placeholder="School Code"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        />
                        <span className="text-xs text-gray-500 ml-1">Auto-generated code</span>
                      </div>
                      
                      <div className="relative">
                        <select
                          name="schoolType"
                          value={schoolFormData.schoolType}
                          onChange={handleSchoolChange}
                          onFocus={() => setActiveInput('schoolType')}
                          onBlur={() => setActiveInput(null)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="public">Public School</option>
                          <option value="private">Private School</option>
                          <option value="charter">Charter School</option>
                          <option value="international">International School</option>
                        </select>
                      </div>
                      
                      <div className="relative">
                        <input
                          type="password"
                          name="password"
                          value={schoolFormData.password}
                          onChange={handleSchoolChange}
                          onFocus={() => setActiveInput('password')}
                          onBlur={() => setActiveInput(null)}
                          placeholder="Password"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      
                      <div className="relative">
                        <input
                          type="password"
                          name="confirmPassword"
                          value={schoolFormData.confirmPassword}
                          onChange={handleSchoolChange}
                          onFocus={() => setActiveInput('confirmPassword')}
                          onBlur={() => setActiveInput(null)}
                          placeholder="Confirm Password"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      
                      <motion.button
                          onClick={handleSchoolSubmit}
                          className="w-full mt-4 py-3 px-4 bg-purple-600 text-white font-bold rounded-md hover:bg-purple-700 shadow-md hover:shadow-lg transform transition-all duration-200"
                          whileTap={{ scale: 0.98 }}
                          disabled={isSubmitting || !apiStatus.connected}
                        >
                          {isSubmitting ? (
                            <span className="flex items-center justify-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              REGISTERING...
                            </span>
                          ) : !apiStatus.connected ? 'SERVER OFFLINE' : 'REGISTER SCHOOL'}
                        </motion.button>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
            
            {/* Teacher Form rendering */}
            {activeForm === 'teacher' && (
              <motion.div 
                className="flex items-center justify-center min-h-screen bg-slate-100 relative overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Teacher form content - similar structure to others */}
                <BackToHomeButton />
                <ApiStatusIndicator />
                
                <div className="relative z-10 w-full max-w-md px-4">
                  <motion.div 
                    className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-blue-700"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                  >
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-blue-900">
                        Teacher Registration
                      </h2>
                      <p className="text-gray-600 text-sm mt-1">Join our teaching community</p>
                    </div>
                    
                    {error && (
                      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 text-sm">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p>{error}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Teacher form fields */}
                    <div className="space-y-4">
                      {/* Name field */}
                      <div 
                        className="input-container relative"
                        onMouseEnter={() => handleInputHover('name', true)}
                        onMouseLeave={() => handleInputHover('name', false)}
                      >
                        <label className="block text-gray-700 text-sm font-medium mb-1">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={teacherFormData.name}
                          onChange={handleTeacherChange}
                          className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all duration-200"
                        />
                      </div>
                      
                      {/* Email field */}
                      <div 
                        className="input-container relative"
                        onMouseEnter={() => handleInputHover('email', true)}
                        onMouseLeave={() => handleInputHover('email', false)}
                      >
                        <label className="block text-gray-700 text-sm font-medium mb-1">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          value={teacherFormData.email}
                          onChange={handleTeacherChange}
                          className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all duration-200"
                        />
                      </div>
                      
                      {/* Phone field */}
                      <div 
                        className="input-container relative"
                        onMouseEnter={() => handleInputHover('phoneNumber', true)}
                        onMouseLeave={() => handleInputHover('phoneNumber', false)}
                      >
                        <label className="block text-gray-700 text-sm font-medium mb-1">Phone Number</label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={teacherFormData.phoneNumber}
                          onChange={handleTeacherChange}
                          className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all duration-200"
                        />
                      </div>
                      
                      {/* School field */}
                      <div 
                        className="input-container relative"
                        onMouseEnter={() => handleInputHover('schoolName', true)}
                        onMouseLeave={() => handleInputHover('schoolName', false)}
                      >
                        <label className="block text-gray-700 text-sm font-medium mb-1">School Name</label>
                        <input
                          type="text"
                          name="schoolName"
                          value={teacherFormData.schoolName}
                          onChange={handleTeacherChange}
                          className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all duration-200"
                        />
                      </div>
                      
                      {/* Subjects field */}
                      <div 
                        className="input-container relative"
                        onMouseEnter={() => handleInputHover('subjects', true)}
                        onMouseLeave={() => handleInputHover('subjects', false)}
                      >
                        <label className="block text-gray-700 text-sm font-medium mb-1">Subject Specialization</label>
                        <input
                          type="text"
                          name="subjects"
                          value={teacherFormData.subjects[0] || ''}
                          onChange={handleTeacherChange}
                          className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all duration-200"
                        />
                      </div>
                      
                      {/* Experience and Qualification fields */}
                      <div className="grid grid-cols-2 gap-4">
                        <div 
                          className="input-container relative"
                          onMouseEnter={() => handleInputHover('experience', true)}
                          onMouseLeave={() => handleInputHover('experience', false)}
                        >
                          <label className="block text-gray-700 text-sm font-medium mb-1">Years of Experience</label>
                          <input
                            type="text"
                            name="experience"
                            value={teacherFormData.experience}
                            onChange={handleTeacherChange}
                            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all duration-200"
                          />
                        </div>
                        
                        <div 
                          className="input-container relative"
                          onMouseEnter={() => handleInputHover('qualification', true)}
                          onMouseLeave={() => handleInputHover('qualification', false)}
                        >
                          <label className="block text-gray-700 text-sm font-medium mb-1">Qualification</label>
                          <input
                            type="text"
                            name="qualification"
                            value={teacherFormData.qualification}
                            onChange={handleTeacherChange}
                            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all duration-200"
                          />
                        </div>
                      </div>
                      
                      {/* Password field */}
                      <div 
                        className="input-container relative"
                        onMouseEnter={() => handleInputHover('password', true)}
                        onMouseLeave={() => handleInputHover('password', false)}
                      >
                        <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
                        <input
                          type="password"
                          name="password"
                          value={teacherFormData.password}
                          onChange={handleTeacherChange}
                          className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all duration-200"
                        />
                      </div>
                      
                      {/* Confirm Password field */}
                      <div 
                        className="input-container relative"
                        onMouseEnter={() => handleInputHover('confirmPassword', true)}
                        onMouseLeave={() => handleInputHover('confirmPassword', false)}
                      >
                        <label className="block text-gray-700 text-sm font-medium mb-1">Confirm Password</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={teacherFormData.confirmPassword}
                          onChange={handleTeacherChange}
                          className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all duration-200"
                        />
                      </div>
                      
                      {/* Submit button */}
                      <motion.button
                        onClick={handleTeacherSubmit}
                        className="w-full mt-4 py-2.5 px-4 bg-blue-700 text-white font-semibold rounded hover:bg-blue-800 shadow transition-all duration-200"
                        whileTap={{ scale: 0.98 }}
                        disabled={isSubmitting || !apiStatus.connected}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            REGISTERING...
                          </span>
                        ) : !apiStatus.connected ? 'SERVER OFFLINE' : 'REGISTER AS TEACHER'}
                      </motion.button>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
            
            {/* Student Form rendering */}
            {activeForm === 'student' && (
              <motion.div 
                className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 relative overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Student form background */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <div className="absolute right-0 top-0 w-96 h-96 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full -mr-48 -mt-48 opacity-40"></div>
                  <div className="absolute left-0 bottom-0 w-96 h-96 bg-gradient-to-tr from-gray-200 to-gray-300 rounded-full -ml-48 -mb-48 opacity-40"></div>
                </div>
      
                {/* Navigation and status */}
                <BackToHomeButton />
                <ApiStatusIndicator />
                
                {/* Form Card */}
                <div className="relative z-10 w-full max-w-md px-4">
                  <motion.div 
                    className="bg-white rounded-lg shadow-sm p-8 border border-gray-200"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                  >
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-gray-800">
                        Student Registration
                      </h2>
                      <div className="h-0.5 w-16 bg-gray-800 mt-2"></div>
                    </div>
                    
                    {/* Error display */}
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                        {error}</div>
                    )}
                    
                    {/* Student form fields */}
                    <div className="space-y-4">
                      {/* Full Name */}
                      <div className="relative">
                        <label className="block text-gray-700 text-sm font-medium mb-1">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={studentFormData.name}
                          onChange={handleStudentChange}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-gray-900 transition-all duration-200"
                        />
                      </div>
                      
                      {/* Email */}
                      <div className="relative">
                        <label className="block text-gray-700 text-sm font-medium mb-1">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          value={studentFormData.email}
                          onChange={handleStudentChange}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-gray-900 transition-all duration-200"
                        />
                      </div>
                      
                      {/* Parent's Email */}
                      <div className="relative">
                        <label className="block text-gray-700 text-sm font-medium mb-1">Parent's Email</label>
                        <input
                          type="email"
                          name="parentEmail"
                          value={studentFormData.parentEmail}
                          onChange={handleStudentChange}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-gray-900 transition-all duration-200"
                        />
                      </div>
                      
                      {/* Phone Number */}
                      <div className="relative">
                        <label className="block text-gray-700 text-sm font-medium mb-1">Phone Number</label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={studentFormData.phoneNumber}
                          onChange={handleStudentChange}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-gray-900 transition-all duration-200"
                        />
                      </div>
                      
                      {/* Grade and Birth Date */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                          <label className="block text-gray-700 text-sm font-medium mb-1">Grade Level</label>
                          <select
                            name="grade"
                            value={studentFormData.grade}
                            onChange={handleStudentChange}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-gray-900 transition-all duration-200"
                          >
                            <option value="elementary">Elementary</option>
                            <option value="middle">Middle School</option>
                            <option value="highschool">High School</option>
                            <option value="college">College</option>
                          </select>
                        </div>
                        
                        <div className="relative">
                          <label className="block text-gray-700 text-sm font-medium mb-1">Birth Date</label>
                          <input
                            type="date"
                            name="birthDate"
                            value={studentFormData.birthDate}
                            onChange={handleStudentChange}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-gray-900 transition-all duration-200"
                          />
                        </div>
                      </div>
                      
                      {/* School Name */}
                      <div className="relative">
                        <label className="block text-gray-700 text-sm font-medium mb-1">School Name</label>
                        <input
                          type="text"
                          name="school"
                          value={studentFormData.school}
                          onChange={handleStudentChange}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-gray-900 transition-all duration-200"
                        />
                      </div>
                      
                      {/* Password */}
                      <div className="relative">
                        <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
                        <input
                          type="password"
                          name="password"
                          value={studentFormData.password}
                          onChange={handleStudentChange}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-gray-900 transition-all duration-200"
                        />
                      </div>
                      
                      {/* Confirm Password */}
                      <div className="relative">
                        <label className="block text-gray-700 text-sm font-medium mb-1">Confirm Password</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={studentFormData.confirmPassword}
                          onChange={handleStudentChange}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-gray-900 transition-all duration-200"
                        />
                      </div>
                      
                      {/* Submit Button */}
                      <motion.button
                        onClick={handleStudentSubmit}
                        className="w-full mt-4 py-2.5 px-4 bg-gray-800 text-white font-medium rounded hover:bg-gray-900 transition-all duration-200"
                        whileTap={{ scale: 0.98 }}
                        disabled={isSubmitting || !apiStatus.connected}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            REGISTERING...
                          </span>
                        ) : !apiStatus.connected ? 'SERVER OFFLINE' : 'REGISTER AS STUDENT'}
                      </motion.button>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </div>
        </AnimatePresence>
      </div>
      
      {/* Login link */}
      <div className="relative z-10 text-center pb-8">
        <motion.p 
          className="text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Already have an account? {' '}
          <motion.a 
            href="/login" 
            className="text-blue-600 hover:text-blue-800 underline font-medium"
            whileHover={{ scale: 1.05 }}
          >
            Log in here
          </motion.a>
        </motion.p>
      </div>
      
      {/* Debug Auth State Button - For troubleshooting */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 z-50">
          <button 
            onClick={() => console.log('Auth State:', { isAuthenticated, localStorage: { token: localStorage.getItem('token'), user: localStorage.getItem('user') } })}
            className="px-3 py-1.5 bg-gray-800 text-white text-xs rounded-full opacity-70 hover:opacity-100 transition-opacity"
          >
            Debug Auth
          </button>
        </div>
      )}
      {/* API Connection Status Modal - Shows if connection fails */}
      {!apiStatus.connected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
          >
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Server Connection Error</h3>
              <p className="text-gray-600">We're having trouble connecting to our servers. This may affect your ability to register.</p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      You can still fill out the form, but registration may not work until the connection is restored.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                <p className="mb-2 font-medium">Troubleshooting suggestions:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Check your internet connection</li>
                  <li>Try refreshing the page</li>
                  <li>Wait a few minutes and try again</li>
                  <li>Contact support if the problem persists</li>
                </ul>
              </div>
              
              <motion.button
                onClick={() => window.location.reload()}
                className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-all duration-200"
                whileTap={{ scale: 0.98 }}
              >
                Retry Connection
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Add styles for animations and transitions */}
      <style>
        {`
          /* General animations - simplified */
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          /* Shared form styles */
          .form-container {
            animation: fadeIn 0.3s ease-out;
          }

          /* Admin form - simplified grid background */
          .grid-background {
            background-image: 
              linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px);
            background-size: 30px 30px;
            width: 100%;
            height: 100%;
          }

          /* Cursor glow transition */
          .cursor-glow {
            transition: opacity 0.2s ease;
            pointer-events: none;
          }

          /* Notification animations */
          .notification-toast {
            transition: transform 0.3s ease, opacity 0.3s ease;
          }

          .notification-animate {
            transform: translateX(0);
          }

          .notification-exit {
            opacity: 0;
            transform: translateY(-10px);
          }

          /* Loading Animation */
          .animate-spin {
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default RegistrationForm;