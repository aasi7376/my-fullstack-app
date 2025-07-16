// src/pages/SettingsPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, updateProfile, changePassword, logout, deleteAccount } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Form states
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    // Role-specific fields will be added conditionally
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [preferences, setPreferences] = useState({
    darkMode: true,
    notifications: true,
    emailUpdates: false,
    language: 'english',
    fontSize: 'medium',
    accessibilityMode: false,
    colorTheme: 'default'
  });
  // Track mouse position for glow effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/auth', { state: { authType: 'login' } });
    } else {
      // Load user-specific data
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        // Add role-specific fields from user.roleSpecificData if available
        ...(user.roleSpecificData || {}),
      });
    }
  }, [user, navigate]);

  // Clear notification after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [notification]);
  // Handle profile form changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle preferences changes
  const handlePreferenceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPreferences(prevPrefs => ({
      ...prevPrefs,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle password form changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Save profile changes
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await updateProfile(profileData);
      
      if (response.success) {
        setNotification({
          type: 'success',
          message: 'Profile updated successfully!'
        });
        setIsEditing(false);
      } else {
        setNotification({
          type: 'error',
          message: response.message || 'Failed to update profile'
        });
      }
    } catch (error) {
      setNotification({
        type: 'error',
        message: api.handleError(error)
      });
    }
  };

  // Save preferences
  const handlePreferencesSubmit = async (e) => {
    e.preventDefault();
    
    // Simulate API call with timeout
    setTimeout(() => {
      setNotification({
        type: 'success',
        message: 'Preferences saved successfully!'
      });
    }, 800);
  };

  // Change password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setNotification({
        type: 'error',
        message: 'New passwords do not match'
      });
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setNotification({
        type: 'error',
        message: 'Password must be at least 6 characters long'
      });
      return;
    }
    
    try {
      const response = await changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      
      if (response.success) {
        setNotification({
          type: 'success',
          message: 'Password changed successfully!'
        });
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setShowPasswordModal(false);
      } else {
        setNotification({
          type: 'error',
          message: response.message || 'Failed to change password'
        });
      }
    } catch (error) {
      setNotification({
        type: 'error',
        message: api.handleError(error)
      });
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    try {
      const response = await deleteAccount();
      
      if (response.success) {
        setNotification({
          type: 'success',
          message: 'Account deleted successfully. Redirecting...'
        });
        
        // Redirect after a short delay
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setNotification({
          type: 'error',
          message: response.message || 'Failed to delete account'
        });
        setShowDeleteConfirm(false);
      }
    } catch (error) {
      setNotification({
        type: 'error',
        message: api.handleError(error)
      });
      setShowDeleteConfirm(false);
    }
  };
  // Get role-specific fields
  const getRoleSpecificFields = () => {
    if (!user) return null;
    
    switch (user.role) {
      case 'student':
        return (
          <>
            <div style={styles.formGroup}>
              <label style={styles.label}>Grade</label>
              <input
                type="text"
                name="grade"
                value={profileData.grade || ''}
                onChange={handleProfileChange}
                style={styles.input}
                disabled={!isEditing}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>School</label>
              <input
                type="text"
                name="school"
                value={profileData.school || ''}
                onChange={handleProfileChange}
                style={styles.input}
                disabled={!isEditing}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Student ID</label>
              <input
                type="text"
                name="studentId"
                value={profileData.studentId || ''}
                onChange={handleProfileChange}
                style={styles.input}
                disabled={!isEditing}
              />
            </div>
          </>
        );
        
      case 'teacher':
        return (
          <>
            <div style={styles.formGroup}>
              <label style={styles.label}>School</label>
              <input
                type="text"
                name="schoolName"
                value={profileData.schoolName || ''}
                onChange={handleProfileChange}
                style={styles.input}
                disabled={!isEditing}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Subjects</label>
              <input
                type="text"
                name="subjects"
                value={Array.isArray(profileData.subjects) ? profileData.subjects.join(', ') : profileData.subjects || ''}
                onChange={handleProfileChange}
                style={styles.input}
                disabled={!isEditing}
              />
              {isEditing && (
                <div style={styles.helpText}>Separate multiple subjects with commas</div>
              )}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Qualification</label>
              <input
                type="text"
                name="qualification"
                value={profileData.qualification || ''}
                onChange={handleProfileChange}
                style={styles.input}
                disabled={!isEditing}
              />
            </div>
          </>
        );
        
      case 'school':
        return (
          <>
            <div style={styles.formGroup}>
              <label style={styles.label}>School Code</label>
              <input
                type="text"
                name="schoolCode"
                value={profileData.schoolCode || ''}
                onChange={handleProfileChange}
                style={styles.input}
                disabled={!isEditing}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Address</label>
              <textarea
                name="address"
                value={profileData.address || ''}
                onChange={handleProfileChange}
                style={{...styles.input, minHeight: '80px'}}
                disabled={!isEditing}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Principal Name</label>
              <input
                type="text"
                name="principalName"
                value={profileData.principalName || ''}
                onChange={handleProfileChange}
                style={styles.input}
                disabled={!isEditing}
              />
            </div>
          </>
        );
        
      case 'admin':
        return (
          <>
            <div style={styles.formGroup}>
              <label style={styles.label}>Admin ID</label>
              <input
                type="text"
                name="adminId"
                value={profileData.adminId || ''}
                onChange={handleProfileChange}
                style={styles.input}
                disabled={!isEditing}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Department</label>
              <input
                type="text"
                name="department"
                value={profileData.department || ''}
                onChange={handleProfileChange}
                style={styles.input}
                disabled={!isEditing}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Access Level</label>
              <input
                type="text"
                name="accessLevel"
                value={profileData.accessLevel || ''}
                onChange={handleProfileChange}
                style={styles.input}
                disabled={!isEditing}
              />
            </div>
          </>
        );
        
      default:
        return null;
    }
  };

  // Modal wrapper component
  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    
    return (
      <div style={styles.modalOverlay} onClick={onClose}>
        <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
          <div style={styles.modalHeader}>
            <h3 style={styles.modalTitle}>{title}</h3>
            <button style={styles.modalClose} onClick={onClose}>×</button>
          </div>
          <div style={styles.modalBody}>
            {children}
          </div>
        </div>
      </div>
    );
  };

  // Notification component
  const Notification = () => {
    if (!notification) return null;
    
    const notificationStyle = {
      ...styles.notification,
      background: notification.type === 'success' 
        ? 'rgba(0, 255, 136, 0.1)' 
        : 'rgba(255, 107, 157, 0.1)',
      borderColor: notification.type === 'success' 
        ? 'rgba(0, 255, 136, 0.3)' 
        : 'rgba(255, 107, 157, 0.3)',
      color: notification.type === 'success' ? '#00ff88' : '#ff6b9d'
    };
    
    return (
      <div style={notificationStyle}>
        <span style={{ marginRight: '10px', fontSize: '1.2rem' }}>
          {notification.type === 'success' ? '✅' : '⚠️'}
        </span>
        {notification.message}
      </div>
    );
  };
  return (
    <div style={styles.container}>
      {/* Background glow effect */}
      <div
        style={{
          position: 'fixed',
          width: '384px',
          height: '384px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #00ff88 0%, transparent 70%)',
          opacity: 0.2,
          pointerEvents: 'none',
          zIndex: 0,
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
          transition: 'all 0.1s ease'
        }}
      />
      
      {/* Page Header */}
      <header style={styles.header}>
        <button 
          onClick={() => navigate(-1)}
          style={styles.backButton}
        >
          ← Back
        </button>
        <div>
          <h1 style={styles.pageTitle}>Settings</h1>
          <p style={styles.subtitle}>
            Manage your account and preferences
          </p>
        </div>
      </header>
      
      {/* Notification area */}
      <Notification />
      
      {/* Main content */}
      <div style={styles.content}>
        {/* Tabs navigation */}
        <div style={styles.tabs}>
          <button 
            style={{
              ...styles.tab,
              ...(activeTab === 'profile' ? styles.activeTab : {})
            }} 
            onClick={() => setActiveTab('profile')}
          >
            <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>👤</span>
            Profile
          </button>
          <button 
            style={{
              ...styles.tab,
              ...(activeTab === 'preferences' ? styles.activeTab : {})
            }} 
            onClick={() => setActiveTab('preferences')}
          >
            <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>🎨</span>
            Preferences
          </button>
          <button 
            style={{
              ...styles.tab,
              ...(activeTab === 'security' ? styles.activeTab : {})
            }} 
            onClick={() => setActiveTab('security')}
          >
            <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>🔒</span>
            Security
          </button>
        </div>
        {/* Tab content */}
        <div style={styles.tabContent}>
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div>
              <div style={styles.tabHeader}>
                <h2 style={styles.tabTitle}>Profile Information</h2>
                <button 
                  style={isEditing ? styles.saveButton : styles.editButton} 
                  onClick={() => isEditing ? handleProfileSubmit() : setIsEditing(true)}
                >
                  {isEditing ? 'Save Changes' : 'Edit Profile'}
                </button>
              </div>
              
              <form onSubmit={handleProfileSubmit} style={styles.form}>
                <div style={styles.formSection}>
                  <div style={styles.sectionTitle}>
                    <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>👤</span>
                    Basic Information
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Name</label>
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      style={styles.input}
                      disabled={!isEditing}
                      required
                    />
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      style={styles.input}
                      disabled={true} // Email can't be changed in this form
                    />
                    {isEditing && (
                      <div style={styles.helpText}>Email changes require verification and are handled in Security settings</div>
                    )}
                  </div>
                </div>
                
                <div style={styles.formSection}>
                  <div style={styles.sectionTitle}>
                    <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>
                      {user?.role === 'student' ? '👨‍🎓' : 
                       user?.role === 'teacher' ? '👨‍🏫' : 
                       user?.role === 'school' ? '🏫' : '⚙️'}
                    </span>
                    {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)} Information
                  </div>
                  
                  {getRoleSpecificFields()}
                </div>

                {/* User Activity Statistics - Using Inline Function */}
                <div style={styles.formSection}>
                  <div style={styles.sectionTitle}>
                    <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>📊</span>
                    User Activity
                  </div>
                  
                  {(() => {
                    // This is an inline function that calculates and returns user statistics
                    const joinDate = user?.createdAt ? new Date(user.createdAt) : new Date();
                    const daysSinceJoin = Math.floor((new Date() - joinDate) / (1000 * 60 * 60 * 24));
                    const lastLogin = user?.lastLogin ? new Date(user.lastLogin) : new Date();
                    
                    // Calculate usage metrics based on role
                    const getActivityMetrics = () => {
                      switch(user?.role) {
                        case 'student':
                          return {
                            label: 'Games Played',
                            value: user?.roleSpecificData?.totalGamesPlayed || 0
                          };
                        case 'teacher':
                          return {
                            label: 'Students Managed',
                            value: user?.roleSpecificData?.studentsCount || 0
                          };
                        case 'school':
                          return {
                            label: 'Teachers Registered',
                            value: user?.roleSpecificData?.teachersCount || 0
                          };
                        case 'admin':
                          return {
                            label: 'Admin Actions',
                            value: user?.roleSpecificData?.actionsCount || 0
                          };
                        default:
                          return {
                            label: 'Activities',
                            value: 0
                          };
                      }
                    };
                    
                    const activityMetrics = getActivityMetrics();
                    
                    return (
                      <div style={styles.statsContainer}>
                        <div style={styles.statCard}>
                          <div style={styles.statIcon}>📅</div>
                          <div style={styles.statInfo}>
                            <div style={styles.statValue}>{daysSinceJoin}</div>
                            <div style={styles.statLabel}>Days Since Join</div>
                          </div>
                        </div>
                        
                        <div style={styles.statCard}>
                          <div style={styles.statIcon}>🕒</div>
                          <div style={styles.statInfo}>
                            <div style={styles.statValue}>
                              {lastLogin.toLocaleDateString()}
                            </div>
                            <div style={styles.statLabel}>Last Login</div>
                          </div>
                        </div>
                        
                        <div style={styles.statCard}>
                          <div style={styles.statIcon}>🎮</div>
                          <div style={styles.statInfo}>
                            <div style={styles.statValue}>{activityMetrics.value}</div>
                            <div style={styles.statLabel}>{activityMetrics.label}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
                
                {isEditing && (
                  <div style={styles.formActions}>
                    <button type="submit" style={styles.saveButton}>
                      Save Changes
                    </button>
                    <button 
                      type="button" 
                      style={styles.cancelButton}
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}
          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div>
              <div style={styles.tabHeader}>
                <h2 style={styles.tabTitle}>User Preferences</h2>
              </div>
              
              <form onSubmit={handlePreferencesSubmit} style={styles.form}>
                <div style={styles.formSection}>
                  <div style={styles.sectionTitle}>
                    <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>🌙</span>
                    Appearance
                  </div>
                  
                  <div style={styles.formGroup}>
                    <div style={styles.switchContainer}>
                      <label style={styles.switchLabel}>
                        Dark Mode
                        <div style={styles.switchDescription}>
                          Use dark theme across the application
                        </div>
                      </label>
                      <label style={styles.switch}>
                        <input
                          type="checkbox"
                          name="darkMode"
                          checked={preferences.darkMode}
                          onChange={handlePreferenceChange}
                        />
                        <span style={styles.slider}></span>
                      </label>
                    </div>
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Color Theme</label>
                    <select
                      name="colorTheme"
                      value={preferences.colorTheme}
                      onChange={handlePreferenceChange}
                      style={styles.select}
                    >
                      <option value="default">Default (Blue/Green)</option>
                      <option value="purple">Purple Dream</option>
                      <option value="sunset">Sunset Orange</option>
                      <option value="ocean">Ocean Blue</option>
                      <option value="forest">Forest Green</option>
                    </select>
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Font Size</label>
                    <select
                      name="fontSize"
                      value={preferences.fontSize}
                      onChange={handlePreferenceChange}
                      style={styles.select}
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium (Default)</option>
                      <option value="large">Large</option>
                      <option value="xlarge">Extra Large</option>
                    </select>
                  </div>
                </div>
                
                <div style={styles.formSection}>
                  <div style={styles.sectionTitle}>
                    <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>🔔</span>
                    Notifications
                  </div>
                  
                  <div style={styles.formGroup}>
                    <div style={styles.switchContainer}>
                      <label style={styles.switchLabel}>
                        Enable Notifications
                        <div style={styles.switchDescription}>
                          Receive in-app notifications
                        </div>
                      </label>
                      <label style={styles.switch}>
                        <input
                          type="checkbox"
                          name="notifications"
                          checked={preferences.notifications}
                          onChange={handlePreferenceChange}
                        />
                        <span style={styles.slider}></span>
                      </label>
                    </div>
                  </div>
                  
                  <div style={styles.formGroup}>
                    <div style={styles.switchContainer}>
                      <label style={styles.switchLabel}>
                        Email Updates
                        <div style={styles.switchDescription}>
                          Receive newsletters and feature updates
                        </div>
                      </label>
                      <label style={styles.switch}>
                        <input
                          type="checkbox"
                          name="emailUpdates"
                          checked={preferences.emailUpdates}
                          onChange={handlePreferenceChange}
                        />
                        <span style={styles.slider}></span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div style={styles.formSection}>
                  <div style={styles.sectionTitle}>
                    <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>🌐</span>
                    Language & Accessibility
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Language</label>
                    <select
                      name="language"
                      value={preferences.language}
                      onChange={handlePreferenceChange}
                      style={styles.select}
                    >
                      <option value="english">English</option>
                      <option value="spanish">Spanish</option>
                      <option value="french">French</option>
                      <option value="german">German</option>
                      <option value="japanese">Japanese</option>
                      <option value="chinese">Chinese</option>
                    </select>
                  </div>
                  
                  <div style={styles.formGroup}>
                    <div style={styles.switchContainer}>
                      <label style={styles.switchLabel}>
                        Accessibility Mode
                        <div style={styles.switchDescription}>
                          Improve readability and navigation
                        </div>
                      </label>
                      <label style={styles.switch}>
                        <input
                          type="checkbox"
                          name="accessibilityMode"
                          checked={preferences.accessibilityMode}
                          onChange={handlePreferenceChange}
                        />
                        <span style={styles.slider}></span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div style={styles.formActions}>
                  <button type="submit" style={styles.saveButton}>
                    Save Preferences
                  </button>
                  <button 
                    type="button" 
                    style={styles.cancelButton}
                    onClick={() => setPreferences({
                      darkMode: true,
                      notifications: true,
                      emailUpdates: false,
                      language: 'english',
                      fontSize: 'medium',
                      accessibilityMode: false,
                      colorTheme: 'default'
                    })}
                  >
                    Reset to Default
                  </button>
                </div>
              </form>
            </div>
          )}
          {/* Security Tab */}
          {activeTab === 'security' && (
            <div>
              <div style={styles.tabHeader}>
                <h2 style={styles.tabTitle}>Security Settings</h2>
              </div>
              
              <div style={styles.formSection}>
                <div style={styles.sectionTitle}>
                  <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>🔑</span>
                  Password Management
                </div>
                
                <div style={styles.securityCard}>
                  <div style={styles.securityCardContent}>
                    <div style={styles.securityCardIcon}>🔐</div>
                    <div style={styles.securityCardText}>
                      <h3 style={styles.securityCardTitle}>Change Password</h3>
                      <p style={styles.securityCardDescription}>
                        Update your password to keep your account secure
                      </p>
                    </div>
                  </div>
                  <button 
                    style={styles.securityCardButton}
                    onClick={() => setShowPasswordModal(true)}
                  >
                    Change Password
                  </button>
                </div>
                
                <div style={styles.securityCard}>
                  <div style={styles.securityCardContent}>
                    <div style={styles.securityCardIcon}>📅</div>
                    <div style={styles.securityCardText}>
                      <h3 style={styles.securityCardTitle}>Last Login</h3>
                      <p style={styles.securityCardDescription}>
                        {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div style={styles.formSection}>
                <div style={styles.sectionTitle}>
                  <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>💼</span>
                  Account Management
                </div>
                
                <div style={styles.securityCard}>
  <div style={styles.securityCardContent}>
    <div style={styles.securityCardIcon} style={{ color: '#ff6b9d' }}>⚠️</div>
    <div style={styles.securityCardText}>
      <h3 style={styles.securityCardTitle}>Delete Account</h3>
      <p style={styles.securityCardDescription}>
        Permanently delete your account and all associated data
      </p>
    </div>
  </div>
                  <button 
                    style={{...styles.securityCardButton, background: '#ff6b9d', color: '#000'}}
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    Delete Account
                  </button>
                </div>
                
                <div style={styles.securityCard}>
                  <div style={styles.securityCardContent}>
                    <div style={styles.securityCardIcon}>📊</div>
                    <div style={styles.securityCardText}>
                      <h3 style={styles.securityCardTitle}>Data Export</h3>
                      <p style={styles.securityCardDescription}>
                        Download all your data in a portable format
                      </p>
                    </div>
                  </div>
                  <button 
                    style={styles.securityCardButton}
                    onClick={() => alert('Data export feature coming soon!')}
                  >
                    Export Data
                  </button>
                </div>
              </div>
              
              <div style={styles.formSection}>
                <div style={styles.sectionTitle}>
                  <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>🔒</span>
                  Active Sessions
                </div>
                
                <div style={styles.securityCard}>
                  <div style={styles.securityCardContent}>
                    <div style={styles.securityCardIcon}>🖥️</div>
                    <div style={styles.securityCardText}>
                      <h3 style={styles.securityCardTitle}>Current Session</h3>
                      <p style={styles.securityCardDescription}>
                        This device • {navigator.platform} • {navigator.userAgent.includes('Chrome') ? 'Chrome' : navigator.userAgent.includes('Firefox') ? 'Firefox' : 'Other Browser'}
                      </p>
                    </div>
                  </div>
                  <button 
                    style={{...styles.securityCardButton, background: '#ff6b9d', color: '#000'}}
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                  >
                    Log Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Change Password Modal */}
      <Modal 
        isOpen={showPasswordModal} 
        onClose={() => setShowPasswordModal(false)}
        title="Change Password"
      >
        <form onSubmit={handlePasswordSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              style={styles.input}
              required
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>New Password</label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              style={styles.input}
              required
            />
            <div style={styles.helpText}>
              Must be at least 6 characters long
            </div>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              style={styles.input}
              required
            />
          </div>
          
          <div style={styles.formActions}>
            <button type="submit" style={styles.saveButton}>
              Change Password
            </button>
            <button 
              type="button" 
              style={styles.cancelButton}
              onClick={() => setShowPasswordModal(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
      
      {/* Delete Account Confirmation Modal */}
      <Modal 
        isOpen={showDeleteConfirm} 
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Account"
      >
        <div style={styles.deleteConfirmContent}>
          <div style={styles.warningIcon}>⚠️</div>
          <h3 style={styles.deleteConfirmTitle}>Are you sure?</h3>
          <p style={styles.deleteConfirmText}>
            This action <strong>cannot</strong> be undone. This will permanently delete your account 
            and remove all your data from our servers.
          </p>
          
          <div style={styles.deleteConfirmInfo}>
            <div style={styles.deleteConfirmInfoItem}>
              <span style={{ fontSize: '1.1rem', marginRight: '8px' }}>👤</span>
              <strong>Account:</strong> {user?.name} ({user?.email})
            </div>
            <div style={styles.deleteConfirmInfoItem}>
              <span style={{ fontSize: '1.1rem', marginRight: '8px' }}>🏆</span>
              <strong>Role:</strong> {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
            </div>
            <div style={styles.deleteConfirmInfoItem}>
              <span style={{ fontSize: '1.1rem', marginRight: '8px' }}>📅</span>
              <strong>Created:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </div>
          </div>
          
          <div style={styles.deleteConfirmActions}>
            <button 
              style={styles.deleteButton}
              onClick={handleDeleteAccount}
            >
              Yes, Delete My Account
            </button>
            <button 
              style={styles.cancelButton}
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
// Add these styles to the bottom of SettingsPage.js
const styles = {
  container: {
    minHeight: '100vh',
    background: '#0f0f23',
    color: '#ffffff',
    position: 'relative',
    padding: '24px',
    animation: 'fadeIn 0.5s ease'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '30px',
    padding: '0 0 20px 0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  },
  backButton: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    color: '#fff',
    padding: '10px 15px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  pageTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    margin: '0 0 5px 0',
    background: 'linear-gradient(45deg, #00ff88, #00a8ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#cccccc',
    margin: 0
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '30px'
  },
  tabs: {
    display: 'flex',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    marginBottom: '30px'
  },
  tab: {
    background: 'transparent',
    border: 'none',
    color: '#cccccc',
    padding: '15px 25px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    borderBottom: '3px solid transparent',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center'
  },
  activeTab: {
    color: '#00ff88',
    borderBottom: '3px solid #00ff88'
  },
  tabContent: {
    animation: 'slideIn 0.3s ease'
  },
  tabHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '30px'
  },
  tabTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    margin: 0,
    color: '#ffffff'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px'
  },
  formSection: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '16px',
    padding: '25px',
    marginBottom: '25px',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  sectionTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#00a8ff',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center'
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    fontSize: '0.95rem',
    color: '#ffffff',
    marginBottom: '8px',
    fontWeight: '500'
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    background: 'rgba(255, 255, 255, 0.07)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '1rem',
    transition: 'all 0.3s ease'
  },
  select: {
    width: '100%',
    padding: '12px 15px',
    background: 'rgba(255, 255, 255, 0.07)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '1rem',
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: 'url("data:image/svg+xml;utf8,<svg fill=\'white\' height=\'24\' viewBox=\'0 0 24 24\' width=\'24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/><path d=\'M0 0h24v24H0z\' fill=\'none\'/></svg>")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 10px top 50%',
    backgroundSize: '20px'
  },
  helpText: {
    fontSize: '0.8rem',
    color: '#cccccc',
    marginTop: '5px'
  },
  switchContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '5px 0'
  },
  switchLabel: {
    fontSize: '0.95rem',
    color: '#ffffff',
    fontWeight: '500'
  },
  switchDescription: {
    fontSize: '0.8rem',
    color: '#cccccc',
    marginTop: '3px'
  },
  switch: {
    position: 'relative',
    display: 'inline-block',
    width: '50px',
    height: '24px'
  },
  slider: {
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '34px',
    transition: '.4s'
  },
  formActions: {
    display: 'flex',
    gap: '15px',
    marginTop: '20px'
  },
  editButton: {
    background: 'rgba(0, 168, 255, 0.1)',
    border: '1px solid rgba(0, 168, 255, 0.3)',
    borderRadius: '8px',
    padding: '10px 20px',
    color: '#00a8ff',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  saveButton: {
    background: 'linear-gradient(45deg, #00ff88, #00a8ff)',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    color: '#000',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  cancelButton: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    padding: '12px 24px',
    color: '#ffffff',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  deleteButton: {
    background: 'linear-gradient(45deg, #ff6b9d, #ff9d6b)',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    color: '#000',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  notification: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '15px 20px',
    borderRadius: '10px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    animation: 'slideIn 0.3s ease'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(5px)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: 'fadeIn 0.3s ease'
  },
  modalContent: {
    background: 'rgba(15, 15, 35, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '16px',
    border: '1px solid rgba(0, 168, 255, 0.3)',
    width: '100%',
    maxWidth: '500px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
    animation: 'slideIn 0.3s ease'
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 25px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  },
  modalTitle: {
    fontSize: '1.3rem',
    fontWeight: '600',
    margin: 0,
    color: '#00a8ff'
  },
  modalClose: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  modalBody: {
    padding: '25px'
  },
  securityCard: {
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '15px',
    border: '1px solid rgba(255, 255, 255, 0.07)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    transition: 'all 0.3s ease'
  },
  securityCardContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  securityCardIcon: {
    fontSize: '1.8rem',
    color: '#00a8ff'
  },
  securityCardText: {
    flex: 1
  },
  securityCardTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    margin: '0 0 5px 0',
    color: '#ffffff'
  },
  securityCardDescription: {
    fontSize: '0.9rem',
    color: '#cccccc',
    margin: 0
  },
  securityCardButton: {
    background: 'linear-gradient(45deg, #00a8ff, #00ff88)',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 15px',
    color: '#000',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  deleteConfirmContent: {
    textAlign: 'center',
    padding: '10px'
  },
  warningIcon: {
    fontSize: '3rem',
    color: '#ff6b9d',
    margin: '0 0 15px 0'
  },
  deleteConfirmTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    margin: '0 0 15px 0',
    color: '#ff6b9d'
  },
  deleteConfirmText: {
    fontSize: '1rem',
    color: '#ffffff',
    marginBottom: '25px',
    lineHeight: '1.5'
  },
  deleteConfirmInfo: {
    background: 'rgba(255, 107, 157, 0.1)',
    border: '1px solid rgba(255, 107, 157, 0.3)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '25px',
    textAlign: 'left'
  },
  deleteConfirmInfoItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
    fontSize: '0.95rem',
    color: '#cccccc'
  },
  deleteConfirmActions: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center'
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '15px',
    marginTop: '10px'
  },
  statCard: {
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '12px',
    padding: '15px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    border: '1px solid rgba(255, 255, 255, 0.07)',
    transition: 'all 0.3s ease'
  },
  statIcon: {
    fontSize: '2rem',
    color: '#00a8ff'
  },
  statInfo: {
    flex: 1
  },
  statValue: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#00ff88',
    marginBottom: '3px'
  },
  statLabel: {
    fontSize: '0.85rem',
    color: '#cccccc'
  }
};

export default SettingsPage;