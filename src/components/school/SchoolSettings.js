// src/components/school/SchoolSettings.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import '../../styles/SchoolSettings.css'
const SchoolSettings = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const [schoolProfile, setSchoolProfile] = useState({
    schoolName: '',
    email: '',
    phone: '',
    address: '',
    principalName: '',
    schoolType: 'public',
    establishedYear: '',
    website: '',
    description: ''
  });

  const [academicSettings, setAcademicSettings] = useState({
    academicYear: '2024-2025',
    semesters: 2,
    gradingSystem: 'percentage',
    passingGrade: 60,
    maxStudentsPerClass: 35,
    classStartTime: '08:00',
    classEndTime: '15:30',
    breakDuration: 30
  });

  const [systemSettings, setSystemSettings] = useState({
    allowStudentRegistration: true,
    allowTeacherRegistration: false,
    requireEmailVerification: true,
    enableNotifications: true,
    enableGameAnalytics: true,
    autoBackup: true,
    dataRetentionDays: 365
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordPolicy: 'medium',
    loginAttempts: 5,
    requirePasswordChange: false,
    passwordExpiry: 90
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    weeklyReports: true,
    monthlyReports: true,
    alertLowPerformance: true,
    alertHighAbsence: true
  });

  useEffect(() => {
    // Load current user data
    if (user) {
      setSchoolProfile({
        schoolName: user.name || user.schoolName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        principalName: user.principalName || '',
        schoolType: user.schoolType || 'public',
        establishedYear: user.establishedYear || '',
        website: user.website || '',
        description: user.description || ''
      });
    }
  }, [user]);

  const settingsTabs = [
    { id: 'profile', label: 'School Profile', icon: '🏫' },
    { id: 'academic', label: 'Academic Settings', icon: '📚' },
    { id: 'system', label: 'System Settings', icon: '⚙️' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'backup', label: 'Backup & Data', icon: '💾' }
  ];

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update profile in auth context
      if (activeTab === 'profile' && updateProfile) {
        await updateProfile(schoolProfile);
      }
      
      setSaveMessage('Settings saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Error saving settings. Please try again.');
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const renderProfileSettings = () => (
    <motion.div 
      className="settings-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="section-header">
        <h3>🏫 School Profile Information</h3>
        <p>Manage your school's basic information and contact details</p>
      </div>

      <div className="settings-form">
        <div className="form-grid">
          <div className="form-group">
            <label>School Name</label>
            <motion.input
              type="text"
              value={schoolProfile.schoolName}
              onChange={(e) => setSchoolProfile({...schoolProfile, schoolName: e.target.value})}
              className="form-input"
              whileFocus={{ scale: 1.02, boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)' }}
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <motion.input
              type="email"
              value={schoolProfile.email}
              onChange={(e) => setSchoolProfile({...schoolProfile, email: e.target.value})}
              className="form-input"
              whileFocus={{ scale: 1.02, boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)' }}
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <motion.input
              type="tel"
              value={schoolProfile.phone}
              onChange={(e) => setSchoolProfile({...schoolProfile, phone: e.target.value})}
              className="form-input"
              whileFocus={{ scale: 1.02, boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)' }}
            />
          </div>

          <div className="form-group">
            <label>Principal Name</label>
            <motion.input
              type="text"
              value={schoolProfile.principalName}
              onChange={(e) => setSchoolProfile({...schoolProfile, principalName: e.target.value})}
              className="form-input"
              whileFocus={{ scale: 1.02, boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)' }}
            />
          </div>

          <div className="form-group">
            <label>School Type</label>
            <select
              value={schoolProfile.schoolType}
              onChange={(e) => setSchoolProfile({...schoolProfile, schoolType: e.target.value})}
              className="form-select"
            >
              <option value="public">Public School</option>
              <option value="private">Private School</option>
              <option value="charter">Charter School</option>
              <option value="international">International School</option>
            </select>
          </div>

          <div className="form-group">
            <label>Established Year</label>
            <motion.input
              type="number"
              value={schoolProfile.establishedYear}
              onChange={(e) => setSchoolProfile({...schoolProfile, establishedYear: e.target.value})}
              className="form-input"
              min="1800"
              max="2025"
              whileFocus={{ scale: 1.02, boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)' }}
            />
          </div>

          <div className="form-group full-width">
            <label>Website</label>
            <motion.input
              type="url"
              value={schoolProfile.website}
              onChange={(e) => setSchoolProfile({...schoolProfile, website: e.target.value})}
              className="form-input"
              placeholder="https://www.yourschool.edu"
              whileFocus={{ scale: 1.02, boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)' }}
            />
          </div>

          <div className="form-group full-width">
            <label>Address</label>
            <motion.textarea
              value={schoolProfile.address}
              onChange={(e) => setSchoolProfile({...schoolProfile, address: e.target.value})}
              className="form-textarea"
              rows="3"
              whileFocus={{ scale: 1.02, boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)' }}
            />
          </div>

          <div className="form-group full-width">
            <label>School Description</label>
            <motion.textarea
              value={schoolProfile.description}
              onChange={(e) => setSchoolProfile({...schoolProfile, description: e.target.value})}
              className="form-textarea"
              rows="4"
              placeholder="Brief description about your school..."
              whileFocus={{ scale: 1.02, boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)' }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderAcademicSettings = () => (
    <motion.div 
      className="settings-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="section-header">
        <h3>📚 Academic Configuration</h3>
        <p>Configure academic year, grading system, and class schedules</p>
      </div>

      <div className="settings-form">
        <div className="form-grid">
          <div className="form-group">
            <label>Academic Year</label>
            <motion.input
              type="text"
              value={academicSettings.academicYear}
              onChange={(e) => setAcademicSettings({...academicSettings, academicYear: e.target.value})}
              className="form-input"
              whileFocus={{ scale: 1.02, boxShadow: '0 0 20px rgba(0, 168, 255, 0.3)' }}
            />
          </div>

          <div className="form-group">
            <label>Number of Semesters</label>
            <select
              value={academicSettings.semesters}
              onChange={(e) => setAcademicSettings({...academicSettings, semesters: parseInt(e.target.value)})}
              className="form-select"
            >
              <option value={2}>2 Semesters</option>
              <option value={3}>3 Terms</option>
              <option value={4}>4 Quarters</option>
            </select>
          </div>

          <div className="form-group">
            <label>Grading System</label>
            <select
              value={academicSettings.gradingSystem}
              onChange={(e) => setAcademicSettings({...academicSettings, gradingSystem: e.target.value})}
              className="form-select"
            >
              <option value="percentage">Percentage (0-100%)</option>
              <option value="letter">Letter Grades (A-F)</option>
              <option value="gpa">GPA (0-4.0)</option>
              <option value="points">Points (0-10)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Passing Grade</label>
            <motion.input
              type="number"
              value={academicSettings.passingGrade}
              onChange={(e) => setAcademicSettings({...academicSettings, passingGrade: parseInt(e.target.value)})}
              className="form-input"
              min="0"
              max="100"
              whileFocus={{ scale: 1.02, boxShadow: '0 0 20px rgba(0, 168, 255, 0.3)' }}
            />
          </div>

          <div className="form-group">
            <label>Max Students per Class</label>
            <motion.input
              type="number"
              value={academicSettings.maxStudentsPerClass}
              onChange={(e) => setAcademicSettings({...academicSettings, maxStudentsPerClass: parseInt(e.target.value)})}
              className="form-input"
              min="15"
              max="50"
              whileFocus={{ scale: 1.02, boxShadow: '0 0 20px rgba(0, 168, 255, 0.3)' }}
            />
          </div>

          <div className="form-group">
            <label>Class Start Time</label>
            <motion.input
              type="time"
              value={academicSettings.classStartTime}
              onChange={(e) => setAcademicSettings({...academicSettings, classStartTime: e.target.value})}
              className="form-input"
              whileFocus={{ scale: 1.02, boxShadow: '0 0 20px rgba(0, 168, 255, 0.3)' }}
            />
          </div>

          <div className="form-group">
            <label>Class End Time</label>
            <motion.input
              type="time"
              value={academicSettings.classEndTime}
              onChange={(e) => setAcademicSettings({...academicSettings, classEndTime: e.target.value})}
              className="form-input"
              whileFocus={{ scale: 1.02, boxShadow: '0 0 20px rgba(0, 168, 255, 0.3)' }}
            />
          </div>

          <div className="form-group">
            <label>Break Duration (minutes)</label>
            <motion.input
              type="number"
              value={academicSettings.breakDuration}
              onChange={(e) => setAcademicSettings({...academicSettings, breakDuration: parseInt(e.target.value)})}
              className="form-input"
              min="15"
              max="60"
              whileFocus={{ scale: 1.02, boxShadow: '0 0 20px rgba(0, 168, 255, 0.3)' }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderSystemSettings = () => (
    <motion.div 
      className="settings-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="section-header">
        <h3>⚙️ System Configuration</h3>
        <p>Configure system behavior and access controls</p>
      </div>

      <div className="settings-form">
        <div className="settings-toggles">
          <div className="toggle-group">
            <h4>Registration Settings</h4>
            <div className="toggle-item">
              <label className="toggle-label">
                <span>Allow Student Self-Registration</span>
                <motion.div 
                  className={`toggle-switch ${systemSettings.allowStudentRegistration ? 'active' : ''}`}
                  onClick={() => setSystemSettings({...systemSettings, allowStudentRegistration: !systemSettings.allowStudentRegistration})}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="toggle-slider" />
                </motion.div>
              </label>
            </div>

            <div className="toggle-item">
              <label className="toggle-label">
                <span>Allow Teacher Self-Registration</span>
                <motion.div 
                  className={`toggle-switch ${systemSettings.allowTeacherRegistration ? 'active' : ''}`}
                  onClick={() => setSystemSettings({...systemSettings, allowTeacherRegistration: !systemSettings.allowTeacherRegistration})}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="toggle-slider" />
                </motion.div>
              </label>
            </div>

            <div className="toggle-item">
              <label className="toggle-label">
                <span>Require Email Verification</span>
                <motion.div 
                  className={`toggle-switch ${systemSettings.requireEmailVerification ? 'active' : ''}`}
                  onClick={() => setSystemSettings({...systemSettings, requireEmailVerification: !systemSettings.requireEmailVerification})}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="toggle-slider" />
                </motion.div>
              </label>
            </div>
          </div>

          <div className="toggle-group">
            <h4>Feature Settings</h4>
            <div className="toggle-item">
              <label className="toggle-label">
                <span>Enable Push Notifications</span>
                <motion.div 
                  className={`toggle-switch ${systemSettings.enableNotifications ? 'active' : ''}`}
                  onClick={() => setSystemSettings({...systemSettings, enableNotifications: !systemSettings.enableNotifications})}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="toggle-slider" />
                </motion.div>
              </label>
            </div>

            <div className="toggle-item">
              <label className="toggle-label">
                <span>Enable Game Analytics</span>
                <motion.div 
                  className={`toggle-switch ${systemSettings.enableGameAnalytics ? 'active' : ''}`}
                  onClick={() => setSystemSettings({...systemSettings, enableGameAnalytics: !systemSettings.enableGameAnalytics})}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="toggle-slider" />
                </motion.div>
              </label>
            </div>

            <div className="toggle-item">
              <label className="toggle-label">
                <span>Auto Backup</span>
                <motion.div 
                  className={`toggle-switch ${systemSettings.autoBackup ? 'active' : ''}`}
                  onClick={() => setSystemSettings({...systemSettings, autoBackup: !systemSettings.autoBackup})}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="toggle-slider" />
                </motion.div>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Data Retention (days)</label>
            <motion.input
              type="number"
              value={systemSettings.dataRetentionDays}
              onChange={(e) => setSystemSettings({...systemSettings, dataRetentionDays: parseInt(e.target.value)})}
              className="form-input"
              min="30"
              max="3650"
              whileFocus={{ scale: 1.02, boxShadow: '0 0 20px rgba(140, 122, 230, 0.3)' }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderSecuritySettings = () => (
    <motion.div 
      className="settings-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="section-header">
        <h3>🔒 Security Configuration</h3>
        <p>Manage security policies and authentication settings</p>
      </div>

      <div className="settings-form">
        <div className="security-grid">
          <div className="security-card">
            <h4>Authentication</h4>
            <div className="toggle-item">
              <label className="toggle-label">
                <span>Two-Factor Authentication</span>
                <motion.div 
                  className={`toggle-switch ${securitySettings.twoFactorAuth ? 'active' : ''}`}
                  onClick={() => setSecuritySettings({...securitySettings, twoFactorAuth: !securitySettings.twoFactorAuth})}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="toggle-slider" />
                </motion.div>
              </label>
            </div>

            <div className="form-group">
              <label>Session Timeout (minutes)</label>
              <motion.input
                type="number"
                value={securitySettings.sessionTimeout}
                onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})}
                className="form-input"
                min="5"
                max="120"
                whileFocus={{ scale: 1.02, boxShadow: '0 0 20px rgba(255, 99, 132, 0.3)' }}
              />
            </div>

            <div className="form-group">
              <label>Max Login Attempts</label>
              <motion.input
                type="number"
                value={securitySettings.loginAttempts}
                onChange={(e) => setSecuritySettings({...securitySettings, loginAttempts: parseInt(e.target.value)})}
                className="form-input"
                min="3"
                max="10"
                whileFocus={{ scale: 1.02, boxShadow: '0 0 20px rgba(255, 99, 132, 0.3)' }}
              />
            </div>
          </div>

          <div className="security-card">
            <h4>Password Policy</h4>
            <div className="form-group">
              <label>Password Strength</label>
              <select
                value={securitySettings.passwordPolicy}
                onChange={(e) => setSecuritySettings({...securitySettings, passwordPolicy: e.target.value})}
                className="form-select"
              >
                <option value="low">Low (6+ characters)</option>
                <option value="medium">Medium (8+ chars, mixed case)</option>
                <option value="high">High (12+ chars, symbols)</option>
              </select>
            </div>

            <div className="toggle-item">
              <label className="toggle-label">
                <span>Require Regular Password Change</span>
                <motion.div 
                  className={`toggle-switch ${securitySettings.requirePasswordChange ? 'active' : ''}`}
                  onClick={() => setSecuritySettings({...securitySettings, requirePasswordChange: !securitySettings.requirePasswordChange})}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="toggle-slider" />
                </motion.div>
              </label>
            </div>

            <div className="form-group">
              <label>Password Expiry (days)</label>
              <motion.input
                type="number"
                value={securitySettings.passwordExpiry}
                onChange={(e) => setSecuritySettings({...securitySettings, passwordExpiry: parseInt(e.target.value)})}
                className="form-input"
                min="30"
                max="365"
                disabled={!securitySettings.requirePasswordChange}
                whileFocus={{ scale: 1.02, boxShadow: '0 0 20px rgba(255, 99, 132, 0.3)' }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderNotificationSettings = () => (
    <motion.div 
      className="settings-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="section-header">
        <h3>🔔 Notification Preferences</h3>
        <p>Configure how and when you receive notifications</p>
      </div>

      <div className="settings-form">
        <div className="notification-groups">
          <div className="notification-group">
            <h4>Communication Channels</h4>
            <div className="toggle-item">
              <label className="toggle-label">
                <span>📧 Email Notifications</span>
                <motion.div 
                  className={`toggle-switch ${notificationSettings.emailNotifications ? 'active' : ''}`}
                  onClick={() => setNotificationSettings({...notificationSettings, emailNotifications: !notificationSettings.emailNotifications})}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="toggle-slider" />
                </motion.div>
              </label>
            </div>

            <div className="toggle-item">
              <label className="toggle-label">
                <span>📱 SMS Notifications</span>
                <motion.div 
                  className={`toggle-switch ${notificationSettings.smsNotifications ? 'active' : ''}`}
                  onClick={() => setNotificationSettings({...notificationSettings, smsNotifications: !notificationSettings.smsNotifications})}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="toggle-slider" />
                </motion.div>
              </label>
            </div>

            <div className="toggle-item">
              <label className="toggle-label">
                <span>🔔 Push Notifications</span>
                <motion.div 
                  className={`toggle-switch ${notificationSettings.pushNotifications ? 'active' : ''}`}
                  onClick={() => setNotificationSettings({...notificationSettings, pushNotifications: !notificationSettings.pushNotifications})}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="toggle-slider" />
                </motion.div>
              </label>
            </div>
          </div>

          <div className="notification-group">
            <h4>Reports & Analytics</h4>
            <div className="toggle-item">
              <label className="toggle-label">
                <span>📊 Weekly Performance Reports</span>
                <motion.div 
                  className={`toggle-switch ${notificationSettings.weeklyReports ? 'active' : ''}`}
                  onClick={() => setNotificationSettings({...notificationSettings, weeklyReports: !notificationSettings.weeklyReports})}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="toggle-slider" />
                </motion.div>
              </label>
            </div>

            <div className="toggle-item">
              <label className="toggle-label">
                <span>📈 Monthly Summary Reports</span>
                <motion.div 
                  className={`toggle-switch ${notificationSettings.monthlyReports ? 'active' : ''}`}
                  onClick={() => setNotificationSettings({...notificationSettings, monthlyReports: !notificationSettings.monthlyReports})}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="toggle-slider" />
                </motion.div>
              </label>
            </div>
          </div>

          <div className="notification-group">
            <h4>Alerts & Warnings</h4>
            <div className="toggle-item">
              <label className="toggle-label">
                <span>⚠️ Low Performance Alerts</span>
                <motion.div 
                  className={`toggle-switch ${notificationSettings.alertLowPerformance ? 'active' : ''}`}
                  onClick={() => setNotificationSettings({...notificationSettings, alertLowPerformance: !notificationSettings.alertLowPerformance})}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="toggle-slider" />
                </motion.div>
              </label>
            </div>

            <div className="toggle-item">
              <label className="toggle-label">
                <span>📅 High Absence Alerts</span>
                <motion.div 
                  className={`toggle-switch ${notificationSettings.alertHighAbsence ? 'active' : ''}`}
                  onClick={() => setNotificationSettings({...notificationSettings, alertHighAbsence: !notificationSettings.alertHighAbsence})}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="toggle-slider" />
                </motion.div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderBackupSettings = () => (
    <motion.div 
      className="settings-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="section-header">
        <h3>💾 Backup & Data Management</h3>
        <p>Manage data backups and export options</p>
      </div>

      <div className="backup-controls">
        <div className="backup-status">
          <div className="status-card">
            <div className="status-icon">✅</div>
            <div className="status-info">
              <h4>Last Backup</h4>
              <p>May 28, 2025 at 3:00 AM</p>
              <span className="status-badge success">Successful</span>
            </div>
          </div>

          <div className="status-card">
            <div className="status-icon">📊</div>
            <div className="status-info">
              <h4>Data Size</h4>
              <p>2.3 GB</p>
              <span className="status-badge info">Normal</span>
            </div>
          </div>

          <div className="status-card">
            <div className="status-icon">⏰</div>
            <div className="status-info">
              <h4>Next Backup</h4>
              <p>May 29, 2025 at 3:00 AM</p>
              <span className="status-badge pending">Scheduled</span>
            </div>
          </div>
        </div>

        <div className="backup-actions">
          <motion.button
            className="btn-neon btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            📥 Create Backup Now
          </motion.button>

          <motion.button
            className="btn-neon btn-secondary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            📤 Export Data
          </motion.button>

          <motion.button
            className="btn-neon btn-warning"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🔄 Restore Data
          </motion.button>
        </div>

        <div className="data-export">
          <h4>Data Export Options</h4>
          <div className="export-options">
            <div className="export-item">
              <span>📊 Student Performance Data</span>
              <button className="export-btn">Export CSV</button>
            </div>
            <div className="export-item">
              <span>👨‍🏫 Teacher Information</span>
              <button className="export-btn">Export CSV</button>
            </div>
            <div className="export-item">
              <span>🏛️ Class Data</span>
              <button className="export-btn">Export CSV</button>
            </div>
            <div className="export-item">
              <span>📈 Analytics Reports</span>
              <button className="export-btn">Export PDF</button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile': return renderProfileSettings();
      case 'academic': return renderAcademicSettings();
      case 'system': return renderSystemSettings();
      case 'security': return renderSecuritySettings();
      case 'notifications': return renderNotificationSettings();
      case 'backup': return renderBackupSettings();
      default: return renderProfileSettings();
    }
  };

  return (
    <motion.div
      className="school-settings"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-title">
          <motion.span 
            className="dashboard-title-icon"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            ⚙️
          </motion.span>
          School Settings
        </div>
        <p className="dashboard-subtitle">
          Configure your school profile, system settings, and preferences
        </p>
      </div>

      <div className="settings-container">
        {/* Settings Navigation */}
        <motion.div 
          className="settings-nav"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {settingsTabs.map((tab) => (
            <motion.button
              key={tab.id}
              className={`settings-nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="nav-icon">{tab.icon}</span>
              <span className="nav-label">{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div
                  className="active-indicator"
                  layoutId="activeSettingsTab"
                />
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Settings Content */}
        <div className="settings-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>

          {/* Save Button */}
          <motion.div 
            className="settings-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              className="btn-neon btn-primary save-btn"
              onClick={handleSaveSettings}
              disabled={isSaving}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSaving ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    ⟳
                  </motion.span>
                  Saving...
                </>
              ) : (
                <>💾 Save Settings</>
              )}
            </motion.button>

            <AnimatePresence>
              {saveMessage && (
                <motion.div
                  className={`save-message ${saveMessage.includes('Error') ? 'error' : 'success'}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  {saveMessage}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default SchoolSettings;