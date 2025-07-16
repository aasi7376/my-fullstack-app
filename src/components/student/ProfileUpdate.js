// src/components/student/ProfileUpdate.js
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import '../../styles/ProfileUpdateCyberpunk.css';

const ProfileUpdate = ({ user }) => {
  // Use updateProfile from AuthContext
  const { updateProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    grade: '',
    section: '',
    age: '',
    parentName: '',
    parentEmail: '',
    bio: '',
    profileImage: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Load user data into form
  useEffect(() => {
    if (user) {
      // First, set the base user data
      const initialFormData = {
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        grade: user.grade || '',
        section: user.section || '',
        age: user.age || '',
        parentName: user.parentName || '',
        parentEmail: user.parentEmail || '',
        bio: user.bio || '',
        profileImage: null
      };
      
      // If we have role-specific student data, merge it
      if (user.roleSpecificData) {
        initialFormData.grade = user.roleSpecificData.grade || initialFormData.grade;
        initialFormData.section = user.roleSpecificData.section || initialFormData.section;
        initialFormData.age = user.roleSpecificData.age || initialFormData.age;
        initialFormData.parentName = user.roleSpecificData.parentName || initialFormData.parentName;
        initialFormData.parentEmail = user.roleSpecificData.parentEmail || initialFormData.parentEmail;
      }
      
      setFormData(initialFormData);
      
      if (user.profileImage) {
        setPreviewImage(user.profileImage);
      } else if (user.avatar) {
        setPreviewImage(user.avatar);
      }
    }
  }, [user]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle profile image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
        setFormData(prev => ({
          ...prev,
          profileImage: file
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove selected image
  const removeImage = () => {
    setPreviewImage(user?.profileImage || user?.avatar || null);
    setFormData(prev => ({
      ...prev,
      profileImage: null
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Create data object for the update
      const submitData = { ...formData };
      delete submitData.profileImage; // Remove the file object from the JSON data
      
      // Add flag to update role-specific collection too
      submitData.updateRoleCollection = true;
      
      console.log('📝 Updating profile with data:', submitData);
      
      // Use updateProfile from AuthContext
      const result = await updateProfile(submitData);
      
      if (result.success) {
        console.log('✅ Profile updated successfully:', result.user);
        
        // Handle profile image upload if a new image was selected
        if (formData.profileImage) {
          console.log('📤 Uploading profile image...');
          const imageData = new FormData();
          imageData.append('profileImage', formData.profileImage);
          
          try {
            // Use API service for file upload
            const uploadResult = await api.upload('/users/profile/avatar', formData.profileImage, {
              type: 'avatar'
            });
            
            console.log('✅ Profile image uploaded successfully:', uploadResult);
          } catch (imageError) {
            console.error('❌ Error uploading profile image:', imageError);
            // Don't fail the request if image upload fails
          }
        }
        
        setSuccess(true);
        
        // Reset success message after 3 seconds
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        setError(result.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('❌ Profile update error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-update">
      <motion.h2 
        className="section-title"
        animate={{
          textShadow: [
            '0 0 5px rgba(17, 138, 178, 0.5)',
            '0 0 10px rgba(17, 138, 178, 0.7)',
            '0 0 5px rgba(17, 138, 178, 0.5)'
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <span className="section-icon">👤</span> Update Profile
      </motion.h2>
      
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-image-container">
            <motion.div 
              className="profile-image"
              whileHover={{ scale: 1.05 }}
            >
              {previewImage ? (
                <img src={previewImage} alt="Profile" />
              ) : (
                <div className="profile-placeholder">
                  {formData.name ? formData.name.charAt(0).toUpperCase() : '👤'}
                </div>
              )}
            </motion.div>
            <div className="image-actions">
              <motion.button
                type="button"
                className="change-image-button"
                onClick={() => fileInputRef.current.click()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Change Image
              </motion.button>
              {previewImage && previewImage !== (user?.profileImage || user?.avatar) && (
                <motion.button
                  type="button"
                  className="remove-image-button"
                  onClick={removeImage}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Remove
                </motion.button>
              )}
            </div>
          </div>
          
          <div className="profile-info">
            <h3>{formData.name || 'Student'}</h3>
            <p>{formData.email || 'student@example.com'}</p>
            {formData.grade && <p>Grade: {formData.grade}</p>}
          </div>
        </div>
        
        <form className="profile-form" onSubmit={handleSubmit}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
          
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="grade">Grade/Class</label>
              <select
                id="grade"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
              >
                <option value="">Select Grade</option>
                <option value="1">Grade 1</option>
                <option value="2">Grade 2</option>
                <option value="3">Grade 3</option>
                <option value="4">Grade 4</option>
                <option value="5">Grade 5</option>
                <option value="6">Grade 6</option>
                <option value="7">Grade 7</option>
                <option value="8">Grade 8</option>
                <option value="9">Grade 9</option>
                <option value="10">Grade 10</option>
                <option value="11">Grade 11</option>
                <option value="12">Grade 12</option>
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="section">Section</label>
              <select
                id="section"
                name="section"
                value={formData.section}
                onChange={handleChange}
              >
                <option value="">Select Section</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
                <option value="D">Section D</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="5"
                max="25"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="bio">Bio/About Me</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              placeholder="Tell us a bit about yourself..."
            ></textarea>
          </div>
          
          <div className="parent-info-section">
            <h3>Parent/Guardian Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="parentName">Parent/Guardian Name</label>
                <input
                  type="text"
                  id="parentName"
                  name="parentName"
                  value={formData.parentName}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="parentEmail">Parent/Guardian Email</label>
                <input
                  type="email"
                  id="parentEmail"
                  name="parentEmail"
                  value={formData.parentEmail}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          
          <div className="security-section">
            <h3>Security</h3>
            <p>To update your password, please use the fields below:</p>
            
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                placeholder="Enter your current password"
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  placeholder="Enter new password"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          </div>
          
          <AnimatePresence>
            {error && (
              <motion.div 
                className="error-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <span className="error-icon">❌</span> {error}
              </motion.div>
            )}
            
            {success && (
              <motion.div 
                className="success-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <span className="success-icon">✅</span> Profile updated successfully!
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="form-actions">
            <motion.button
              type="button"
              className="cancel-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </motion.button>
            
            <motion.button
              type="submit"
              className="save-button"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.05 }}
              whileTap={{ scale: loading ? 1 : 0.95 }}
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Saving...
                </>
              ) : 'Save Changes'}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileUpdate;