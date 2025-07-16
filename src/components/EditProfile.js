// src/components/EditProfile.js
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const EditProfile = () => {
  const navigate = useNavigate();
  // Extract auth functions
  const { 
    user,
    isAuthenticated, 
    refreshUserData,
  } = useAuth();
  
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
  
  // Check if user is authenticated and get role
  const [userRole, setUserRole] = useState('student');
  
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('[EditProfile] User authenticated:', user);
      setUserRole(user.role);
      
      // Load the appropriate form data based on role
      switch(user.role) {
        case 'admin':
          setAdminFormData({
            name: user.name || '',
            email: user.email || '',
            phoneNumber: user.phoneNumber || '',
            adminCode: user.adminCode || '',
            department: user.department || 'it',
            accessLevel: user.accessLevel || 'level1',
            // Don't set password fields for security
            password: '',
            confirmPassword: '',
            role: 'admin',
            profilePicture: null
          });
          break;
          
        case 'school':
          setSchoolFormData({
            name: user.name || '',
            email: user.email || '',
            phoneNumber: user.phoneNumber || '',
            address: user.address || '',
            principalName: user.principalName || '',
            schoolCode: user.schoolCode || '',
            schoolType: user.schoolType || 'public',
            password: '',
            confirmPassword: '',
            role: 'school',
            profilePicture: null
          });
          break;
          
        case 'teacher':
          setTeacherFormData({
            name: user.name || '',
            email: user.email || '',
            phoneNumber: user.phoneNumber || '',
            // FIXED: Properly handle subjects to avoid empty string keys
            subjects: (user.subjects && user.subjects.length > 0) 
              ? user.subjects.filter(Boolean) // Filter out any empty strings
              : [], // Start with empty array if no subjects
            experience: user.experience || '',
            qualification: user.qualification || '',
            schoolName: user.schoolName || '',
            password: '',
            confirmPassword: '',
            role: 'teacher',
            profilePicture: null
          });
          break;
          
        case 'student':
          setStudentFormData({
            name: user.name || '',
            email: user.email || '',
            parentEmail: user.parentEmail || '',
            phoneNumber: user.phoneNumber || '',
            grade: user.grade || 'elementary',
            birthDate: user.birthDate || '',
            school: user.school || '',
            password: '',
            confirmPassword: '',
            role: 'student',
            profilePicture: null
          });
          break;
          
        default:
          console.warn('[EditProfile] Unknown user role:', user.role);
      }
      
      // Set preview image if exists
      if (user.profilePictureUrl) {
        setPreviewImage(user.profilePictureUrl);
      }
    } else {
      console.log('[EditProfile] User not authenticated, redirecting');
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  // Common state for form transitions
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  
  // States for different form types
  const [adminFormData, setAdminFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    adminCode: '',
    department: 'it',
    accessLevel: 'level1',
    role: 'admin',
    profilePicture: null
  });
  
  const [schoolFormData, setSchoolFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    principalName: '',
    password: '',
    confirmPassword: '',
    schoolCode: '',
    schoolType: 'public',
    role: 'school',
    profilePicture: null
  });
  
  const [teacherFormData, setTeacherFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    // FIXED: Changed from [''] to [] to avoid empty string key
    subjects: [],
    experience: '',
    qualification: '',
    schoolName: '',
    password: '',
    confirmPassword: '',
    role: 'teacher',
    profilePicture: null
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
    role: 'student',
    profilePicture: null
  });
  
  // Animation states
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeInput, setActiveInput] = useState(null);
  const [hoverState, setHoverState] = useState({});
  
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
  
  // FIXED: Modified to handle subjects properly with unique keys
  const handleTeacherChange = useCallback((e) => {
    const { name, value } = e.target;
    
    if (name === 'subjects') {
      setTeacherFormData(prev => ({
        ...prev,
        // Only add non-empty values to the subjects array
        subjects: value.trim() ? [value.trim()] : []
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

  // File upload handler
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Update the appropriate form data based on role
    switch(userRole) {
      case 'admin':
        setAdminFormData(prev => ({ ...prev, profilePicture: file }));
        break;
      case 'school':
        setSchoolFormData(prev => ({ ...prev, profilePicture: file }));
        break;
      case 'teacher':
        setTeacherFormData(prev => ({ ...prev, profilePicture: file }));
        break;
      case 'student':
        setStudentFormData(prev => ({ ...prev, profilePicture: file }));
        break;
      default:
        break;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };
  
  // Helper function for input hover states
  const handleInputHover = useCallback((inputName, isHovering) => {
    setHoverState(prev => ({
      ...prev,
      [inputName]: isHovering
    }));
  }, []);
  
  // Form validation functions
  const validateAdminForm = useCallback(() => {
    if (!adminFormData.name || !adminFormData.email || !adminFormData.phoneNumber) {
      setError('Name, email and phone are required');
      return false;
    }
    
    if (adminFormData.password && adminFormData.password !== adminFormData.confirmPassword) {
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
        !schoolFormData.address || !schoolFormData.principalName) {
      setError('All fields are required');
      return false;
    }
    
    if (schoolFormData.password && schoolFormData.password !== schoolFormData.confirmPassword) {
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
        !teacherFormData.qualification || !teacherFormData.schoolName) {
      setError('All fields are required');
      return false;
    }
    
    if (teacherFormData.password && teacherFormData.password !== teacherFormData.confirmPassword) {
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
        !studentFormData.phoneNumber || !studentFormData.grade || !studentFormData.school) {
      setError('All fields are required');
      return false;
    }
    
    if (studentFormData.password && studentFormData.password !== studentFormData.confirmPassword) {
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
  const debugUpdateData = (formData) => {
    console.log('🔍 DEBUG: Profile update data being sent:');
    console.log(JSON.stringify(formData, null, 2));
    
    return formData;
  };

  // Admin form submit handler
  const handleAdminSubmit = async () => {
    if (!validateAdminForm()) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      console.log('[EditProfile] Starting admin profile update');
      
      // Prepare form data for multipart/form-data
      const formData = new FormData();
      
      // Add all fields except password if it's empty
      Object.keys(adminFormData).forEach(key => {
        if (key === 'profilePicture' && adminFormData[key]) {
          formData.append(key, adminFormData[key]);
        } else if (key !== 'password' && key !== 'confirmPassword') {
          formData.append(key, adminFormData[key]);
        }
      });
      
      // Only add password if it's not empty
      if (adminFormData.password) {
        formData.append('password', adminFormData.password);
      }
      
      // Debug data before sending
      debugUpdateData(Object.fromEntries(formData.entries()));
      
      // Use the api service for profile update
      const response = await api.updateProfile(formData);
      
      console.log('[EditProfile] Update response:', response);
      
      if (!response.success) {
        throw new Error(response.error || 'Update failed');
      }
      
      // Show success message
      showNotification('Profile updated successfully!', 'success');
      
      // Refresh user data in context
      refreshUserData();
      
      // Set update success for UI feedback
      setUpdateSuccess(true);
      
      // Reset success state after a delay
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
      
    } catch (err) {
      console.error('[EditProfile] Update error:', err);
      
      // Extract error message from response if available
      const errorMessage = err.response?.data?.message || err.message || 'An unexpected error occurred';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // School form submit handler
  const handleSchoolSubmit = async () => {
    if (!validateSchoolForm()) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      console.log('[EditProfile] Starting school profile update');
      
      // Prepare form data for multipart/form-data
      const formData = new FormData();
      
      // Add all fields except password if it's empty
      Object.keys(schoolFormData).forEach(key => {
        if (key === 'profilePicture' && schoolFormData[key]) {
          formData.append(key, schoolFormData[key]);
        } else if (key !== 'password' && key !== 'confirmPassword') {
          formData.append(key, schoolFormData[key]);
        }
      });
      
      // Only add password if it's not empty
      if (schoolFormData.password) {
        formData.append('password', schoolFormData.password);
      }
      
      // Debug data before sending
      debugUpdateData(Object.fromEntries(formData.entries()));
      
      // Use the api service for profile update
      const response = await api.updateProfile(formData);
      
      if (!response.success) {
        throw new Error(response.error || 'Update failed');
      }
      
      // Show success message
      showNotification('School profile updated successfully!', 'success');
      
      // Refresh user data in context
      refreshUserData();
      
      // Set update success for UI feedback
      setUpdateSuccess(true);
      
      // Reset success state after a delay
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
      
    } catch (err) {
      console.error('[EditProfile] Update error:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Teacher form submit handler
  const handleTeacherSubmit = async () => {
    if (!validateTeacherForm()) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      console.log('[EditProfile] Starting teacher profile update');
      
      // Prepare form data for multipart/form-data
      const formData = new FormData();
      
      // Add all fields except password if it's empty
      Object.keys(teacherFormData).forEach(key => {
        if (key === 'profilePicture' && teacherFormData[key]) {
          formData.append(key, teacherFormData[key]);
        } else if (key === 'subjects') {
          // FIXED: Ensure subjects is handled as array with proper keys
          const subjects = Array.isArray(teacherFormData.subjects) 
            ? teacherFormData.subjects.filter(Boolean) // Filter out empty strings
            : [teacherFormData.subjects].filter(Boolean);
            
          subjects.forEach((subject, index) => {
            // Use index as part of the key to ensure uniqueness
            formData.append(`subjects[${index}]`, subject);
          });
        } else if (key !== 'password' && key !== 'confirmPassword') {
          formData.append(key, teacherFormData[key]);
        }
      });
      
      // Only add password if it's not empty
      if (teacherFormData.password) {
        formData.append('password', teacherFormData.password);
      }
      
      // Debug data before sending
      debugUpdateData(Object.fromEntries(formData.entries()));
      
      // Use the api service for profile update
      const response = await api.updateProfile(formData);
      
      if (!response.success) {
        throw new Error(response.error || 'Update failed');
      }
      
      // Show success message
      showNotification('Teacher profile updated successfully!', 'success');
      
      // Refresh user data in context
      refreshUserData();
      
      // Set update success for UI feedback
      setUpdateSuccess(true);
      
      // Reset success state after a delay
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
      
    } catch (err) {
      console.error('[EditProfile] Update error:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Student form submit handler
  const handleStudentSubmit = async () => {
    if (!validateStudentForm()) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      console.log('[EditProfile] Starting student profile update');
      
      // Prepare form data for multipart/form-data
      const formData = new FormData();
      
      // Add all fields except password if it's empty
      Object.keys(studentFormData).forEach(key => {
        if (key === 'profilePicture' && studentFormData[key]) {
          formData.append(key, studentFormData[key]);
        } else if (key === 'birthDate' && studentFormData[key]) {
          // Format birthDate if needed
          const birthDate = studentFormData.birthDate instanceof Date 
            ? studentFormData.birthDate.toISOString().split('T')[0] 
            : studentFormData.birthDate;
          formData.append('birthDate', birthDate);
        } else if (key !== 'password' && key !== 'confirmPassword') {
          formData.append(key, studentFormData[key]);
        }
      });
      
      // Only add password if it's not empty
      if (studentFormData.password) {
        formData.append('password', studentFormData.password);
      }
      
      // Debug data before sending
      debugUpdateData(Object.fromEntries(formData.entries()));
      
      // Use the api service for profile update
      const response = await api.updateProfile(formData);
      
      if (!response.success) {
        throw new Error(response.error || 'Update failed');
      }
      
      // Show success message
      showNotification('Student profile updated successfully!', 'success');
      
      // Refresh user data in context
      refreshUserData();
      
      // Set update success for UI feedback
      setUpdateSuccess(true);
      
      // Reset success state after a delay
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
      
    } catch (err) {
      console.error('[EditProfile] Update error:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
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
    if (userRole !== 'admin' || isSubmitting) return;
    
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
  }, [userRole, isSubmitting]);

  // API Status Indicator Component
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

  // Success indicator component
  const SuccessIndicator = () => (
    <motion.div
      key="success-toast" // FIXED: Added key to motion component
      className="fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium">Profile updated successfully!</p>
        </div>
      </div>
    </motion.div>
  );

  // Main component render
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 overflow-hidden relative py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Edit Profile</h1>
        
        {/* Render the appropriate form based on user role */}
        <AnimatePresence>
          {userRole === 'admin' && (
            <motion.div 
              key="admin-profile" // FIXED: Added key prop for AnimatePresence
              className="bg-gray-900 rounded-xl shadow-xl overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
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
              
              {/* API Status */}
              <ApiStatusIndicator />
              
              <div className="relative z-10 p-8">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Profile Picture Section */}
                  <div className="md:w-1/3 flex flex-col items-center">
                    <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-blue-500/30 mb-4">
                      {previewImage ? (
                        <img 
                          src={previewImage} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                          <span className="text-blue-500 text-4xl font-bold">
                            {adminFormData.name.charAt(0).toUpperCase() || 'A'}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <label className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">
                      <span>Change Photo</span>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  
                  {/* Form Section */}
                  <div className="md:w-2/3" 
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}>
                    
                    {error && (
                      <div className="bg-red-900/30 border border-red-500/50 text-red-200 px-4 py-2 rounded mb-4 text-sm">
                        {error}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <label className="block text-blue-300 text-sm font-medium">Phone Number</label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={adminFormData.phoneNumber}
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
                          disabled
                        />
                        <span className="text-xs text-gray-400">Admin code cannot be changed</span>
                      </div>
                      
                      <div className="space-y-1 col-span-2">
                        <label className="block text-blue-300 text-sm font-medium">New Password (leave blank to keep current)</label>
                        <input
                          type="password"
                          name="password"
                          value={adminFormData.password}
                          onChange={handleAdminChange}
                          className="w-full px-4 py-2.5 bg-gray-900/80 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all"
                        />
                      </div>
                      
                      <div className="space-y-1 col-span-2">
                        <label className="block text-blue-300 text-sm font-medium">Confirm New Password</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={adminFormData.confirmPassword}
                          onChange={handleAdminChange}
                          className="w-full px-4 py-2.5 bg-gray-900/80 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all"
                        />
                      </div>
                    </div>
                    
                    <motion.button
                      onClick={handleAdminSubmit}
                      className="w-full py-3 px-4 mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-indigo-700 transform transition-all duration-200"
                      whileTap={{ scale: 0.98 }}
                      disabled={isSubmitting || !apiStatus.connected}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          UPDATING...
                        </span>
                      ) : !apiStatus.connected ? 'SERVER OFFLINE' : 'SAVE CHANGES'}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {userRole === 'school' && (
            <motion.div 
              key="school-profile" // FIXED: Added key prop for AnimatePresence
              className="bg-white rounded-lg shadow-xl overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
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
              
              {/* API Status */}
              <ApiStatusIndicator />
              
              <div className="relative z-10 p-8">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold text-purple-800 tracking-wide">
                    School Profile
                  </h2>
                  <div className="mt-2 h-1 w-24 mx-auto rounded-full bg-purple-600"></div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Profile Picture Section */}
                  <div className="md:w-1/3 flex flex-col items-center">
                    <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-purple-200 mb-4">
                      {previewImage ? (
                        <img 
                          src={previewImage} 
                          alt="School Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-purple-50 flex items-center justify-center">
                          <span className="text-purple-500 text-4xl font-bold">
                            {schoolFormData.name.charAt(0).toUpperCase() || 'S'}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <label className="px-4 py-2 bg-purple-600 text-white rounded-lg cursor-pointer hover:bg-purple-700 transition-colors">
                      <span>Change School Logo</span>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  
                  {/* Form Section */}
                  <div className="md:w-2/3">
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
                    
                    <div className="space-y-4">
                      <div className="relative">
                        <label className="block text-gray-700 text-sm font-medium mb-1">School Name</label>
                        <input
                          type="text"
                          name="name"
                          value={schoolFormData.name}
                          onChange={handleSchoolChange}
                          placeholder="School Name"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      
                      <div className="relative">
                        <label className="block text-gray-700 text-sm font-medium mb-1">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          value={schoolFormData.email}
                          onChange={handleSchoolChange}
                          placeholder="Email Address"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                          <label className="block text-gray-700 text-sm font-medium mb-1">Phone Number</label>
                          <input
                            type="tel"
                            name="phoneNumber"
                            value={schoolFormData.phoneNumber}
                            onChange={handleSchoolChange}
                            placeholder="Phone Number"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                        
                        <div className="relative">
                          <label className="block text-gray-700 text-sm font-medium mb-1">School Type</label>
                          <select
                            name="schoolType"
                            value={schoolFormData.schoolType}
                            onChange={handleSchoolChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                          >
                            <option value="public">Public School</option>
                            <option value="private">Private School</option>
                            <option value="charter">Charter School</option>
                            <option value="international">International School</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="relative">
                        <label className="block text-gray-700 text-sm font-medium mb-1">School Address</label>
                        <input
                          type="text"
                          name="address"
                          value={schoolFormData.address}
                          onChange={handleSchoolChange}
                          placeholder="School Address"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      
                      <div className="relative">
                        <label className="block text-gray-700 text-sm font-medium mb-1">Principal Name</label>
                        <input
                          type="text"
                          name="principalName"
                          value={schoolFormData.principalName}
                          onChange={handleSchoolChange}
                          placeholder="Principal Name"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      
                      <div className="relative">
                        <label className="block text-gray-700 text-sm font-medium mb-1">School Code</label>
                        <input
                          type="text"
                          name="schoolCode"
                          value={schoolFormData.schoolCode}
                          onChange={handleSchoolChange}
                          placeholder="School Code"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-100"
                          disabled
                        />
                        <span className="text-xs text-gray-500 ml-1">School code cannot be changed</span>
                      </div>
                      
                      <div className="relative">
                        <label className="block text-gray-700 text-sm font-medium mb-1">New Password (leave blank to keep current)</label>
                        <input
                          type="password"
                          name="password"
                          value={schoolFormData.password}
                          onChange={handleSchoolChange}
                          placeholder="New Password"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      
                      <div className="relative">
                        <label className="block text-gray-700 text-sm font-medium mb-1">Confirm New Password</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={schoolFormData.confirmPassword}
                          onChange={handleSchoolChange}
                          placeholder="Confirm New Password"
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
                            UPDATING...
                          </span>
                        ) : !apiStatus.connected ? 'SERVER OFFLINE' : 'SAVE CHANGES'}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Teacher form */}
          {userRole === 'teacher' && (
            <motion.div 
              key="teacher-profile" // FIXED: Added key prop for AnimatePresence
              className="bg-white rounded-lg shadow-lg border-t-4 border-blue-700 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* API Status */}
              <ApiStatusIndicator />
              
              <div className="p-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-blue-900">
                    Teacher Profile
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">Update your teaching profile</p>
                </div>
                
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Profile Picture Section */}
                  <div className="md:w-1/3 flex flex-col items-center">
                    <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-blue-200 mb-4">
                      {previewImage ? (
                        <img 
                          src={previewImage} 
                          alt="Teacher Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-blue-50 flex items-center justify-center">
                          <span className="text-blue-500 text-4xl font-bold">
                            {teacherFormData.name.charAt(0).toUpperCase() || 'T'}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <label className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">
                      <span>Change Photo</span>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  
                  {/* Form Section */}
                  <div className="md:w-2/3">
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
                    
                    <div className="space-y-4">
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
                      
                      <div 
                        className="input-container relative"
                        onMouseEnter={() => handleInputHover('subjects', true)}
                        onMouseLeave={() => handleInputHover('subjects', false)}
                      >
                        <label className="block text-gray-700 text-sm font-medium mb-1">Subject Specialization</label>
                        <input
                          type="text"
                          name="subjects"
                          // FIXED: Better handling of value display
                          value={teacherFormData.subjects && teacherFormData.subjects.length > 0 ? teacherFormData.subjects[0] : ''}
                          onChange={handleTeacherChange}
                          className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all duration-200"
                        />
                      </div>
                      
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
                      
                      <div 
                        className="input-container relative"
                        onMouseEnter={() => handleInputHover('password', true)}
                        onMouseLeave={() => handleInputHover('password', false)}
                      >
                        <label className="block text-gray-700 text-sm font-medium mb-1">New Password (leave blank to keep current)</label>
                        <input
                          type="password"
                          name="password"
                          value={teacherFormData.password}
                          onChange={handleTeacherChange}
                          className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all duration-200"
                        />
                      </div>
                      
                      <div 
                        className="input-container relative"
                        onMouseEnter={() => handleInputHover('confirmPassword', true)}
                        onMouseLeave={() => handleInputHover('confirmPassword', false)}
                      >
                        <label className="block text-gray-700 text-sm font-medium mb-1">Confirm New Password</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={teacherFormData.confirmPassword}
                          onChange={handleTeacherChange}
                          className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all duration-200"
                        />
                      </div>
                      
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
                            UPDATING...
                          </span>
                        ) : !apiStatus.connected ? 'SERVER OFFLINE' : 'SAVE CHANGES'}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Student form */}
          {userRole === 'student' && (
            <motion.div 
              key="student-profile" // FIXED: Added key prop for AnimatePresence
              className="bg-white rounded-lg shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Student form background */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute right-0 top-0 w-96 h-96 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full -mr-48 -mt-48 opacity-40"></div>
                <div className="absolute left-0 bottom-0 w-96 h-96 bg-gradient-to-tr from-gray-200 to-gray-300 rounded-full -ml-48 -mb-48 opacity-40"></div>
              </div>
      
              {/* API Status */}
              <ApiStatusIndicator />
              
              <div className="relative z-10 p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Student Profile
                  </h2>
                  <div className="h-0.5 w-16 bg-gray-800 mt-2"></div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Profile Picture Section */}
                  <div className="md:w-1/3 flex flex-col items-center">
                    <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-gray-200 mb-4">
                      {previewImage ? (
                        <img 
                          src={previewImage} 
                          alt="Student Profile" 
                          className="w-full h-full object-cover"
                        />) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-500 text-4xl font-bold">
                            {studentFormData.name.charAt(0).toUpperCase() || 'S'}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <label className="px-4 py-2 bg-gray-800 text-white rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
                      <span>Change Photo</span>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  
                  {/* Form Section */}
                  <div className="md:w-2/3">
                    {/* Error display */}
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                        {error}
                      </div>
                    )}
                    
                    <div className="space-y-4">
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
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      
                      <div className="relative">
                        <label className="block text-gray-700 text-sm font-medium mb-1">New Password (leave blank to keep current)</label>
                        <input
                          type="password"
                          name="password"
                          value={studentFormData.password}
                          onChange={handleStudentChange}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-gray-900 transition-all duration-200"
                        />
                      </div>
                      
                      <div className="relative">
                        <label className="block text-gray-700 text-sm font-medium mb-1">Confirm New Password</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={studentFormData.confirmPassword}
                          onChange={handleStudentChange}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-gray-900 transition-all duration-200"
                        />
                      </div>
                      
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
                            UPDATING...
                          </span>
                        ) : !apiStatus.connected ? 'SERVER OFFLINE' : 'SAVE CHANGES'}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Show success indicator when update is successful */}
          {updateSuccess && <SuccessIndicator key="success-indicator" />}
        </AnimatePresence>
      </div>
      
      {/* API Connection Status Modal - Shows if connection fails */}
      {!apiStatus.connected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            key="connection-error-modal" // FIXED: Added key for AnimatePresence children
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
              <p className="text-gray-600">We're having trouble connecting to our servers. This may affect your ability to update your profile.</p>
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
                      You can still fill out the form, but updates may not be saved until the connection is restored.
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
          /* General animations */
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          /* Admin form - grid background */
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

export default EditProfile;