// AdminProfileForm.js - Fixed version
import React, { useState, useEffect } from 'react';
import { StableInput, StableSelect } from '../ui/StableInputs';
import { getStatusConfig } from '../../utils/statusConfig';
import { toast } from 'react-toastify';
import { updateAdminProfile, getAdminProfile } from '../../services/adminDashboardService';

const AdminProfileForm = ({ onCancel, onProfileUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    accessLevel: '',
    adminCode: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch current admin profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const profile = await getAdminProfile();
        
        setFormData({
          name: profile.name || '',
          email: profile.email || '',
          department: profile.department || '',
          accessLevel: profile.accessLevel || '',
          adminCode: '' // Don't show admin code for security
        });
      } catch (error) {
        console.error('Error fetching admin profile:', error);
        toast.error('Failed to load profile information');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (formData.adminCode && formData.adminCode.length < 6) {
      newErrors.adminCode = 'Admin code must be at least 6 characters';
    }
    
    return newErrors;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Only include fields that have values
      const updatedData = Object.fromEntries(
        Object.entries(formData).filter(([_, v]) => v !== '')
      );
      
      console.log('Submitting profile update with data:', updatedData);
      
      // Call the service function to update the profile
      const result = await updateAdminProfile(updatedData);
      console.log('Profile update result:', result);
      
      // Check if result.data exists (from the service)
      const updatedProfile = result.data || result;
      
      toast.success('Profile updated successfully!');
      
      // Call the onProfileUpdate callback if provided
      if (onProfileUpdate) {
        onProfileUpdate(updatedProfile);
      }
      
      // Close the form
      onCancel();
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrors({
        submit: 'Failed to update profile. Please try again.'
      });
      toast.error('Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div style={{ padding: '30px', textAlign: 'center' }}>
        <p style={{ color: '#b8e0f0' }}>Loading profile information...</p>
      </div>
    );
  }
  
  // Rest of the form rendering code remains the same
  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
      {/* Form fields - keeping the same as before */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          color: '#b8e0f0',
          fontSize: '0.85rem',
          marginBottom: '8px',
          fontFamily: 'system-ui, sans-serif',
          fontWeight: '600',
          letterSpacing: '0.5px'
        }}>
          Name
        </label>
        <StableInput
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your name"
          disabled={true} // Name usually can't be changed
          style={{
            width: '100%',
            background: 'rgba(0, 0, 0, 0.3)',
            border: errors.name ? '1px solid #ff6a88' : '1px solid rgba(0, 225, 255, 0.3)',
            borderRadius: '6px',
            padding: '12px 15px',
            color: '#8ab3c5',
            fontSize: '0.9rem',
            fontFamily: 'system-ui, sans-serif'
          }}
        />
        {errors.name && (
          <p style={{
            color: '#ff6a88',
            fontSize: '0.8rem',
            margin: '5px 0 0 0',
            fontFamily: 'system-ui, sans-serif'
          }}>
            {errors.name}
          </p>
        )}
      </div>
      
      {/* Remaining form fields remain the same */}
      {/* ... */}
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          color: '#b8e0f0',
          fontSize: '0.85rem',
          marginBottom: '8px',
          fontFamily: 'system-ui, sans-serif',
          fontWeight: '600',
          letterSpacing: '0.5px'
        }}>
          Email
        </label>
        <StableInput
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Your email"
          disabled={true} // Email usually can't be changed
          style={{
            width: '100%',
            background: 'rgba(0, 0, 0, 0.3)',
            border: errors.email ? '1px solid #ff6a88' : '1px solid rgba(0, 225, 255, 0.3)',
            borderRadius: '6px',
            padding: '12px 15px',
            color: '#8ab3c5',
            fontSize: '0.9rem',
            fontFamily: 'system-ui, sans-serif'
          }}
        />
        {errors.email && (
          <p style={{
            color: '#ff6a88',
            fontSize: '0.8rem',
            margin: '5px 0 0 0',
            fontFamily: 'system-ui, sans-serif'
          }}>
            {errors.email}
          </p>
        )}
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          color: '#b8e0f0',
          fontSize: '0.85rem',
          marginBottom: '8px',
          fontFamily: 'system-ui, sans-serif',
          fontWeight: '600',
          letterSpacing: '0.5px'
        }}>
          Department
        </label>
        <StableSelect
          name="department"
          value={formData.department}
          onChange={handleChange}
          style={{
            width: '100%',
            background: 'rgba(0, 0, 0, 0.3)',
            border: errors.department ? '1px solid #ff6a88' : '1px solid rgba(0, 225, 255, 0.3)',
            borderRadius: '6px',
            padding: '12px 15px',
            color: '#ffffff',
            fontSize: '0.9rem',
            fontFamily: 'system-ui, sans-serif',
            appearance: 'none'
          }}
        >
          <option value="">Select Department</option>
          <option value="it">IT Department</option>
          <option value="academics">Academic Affairs</option>
          <option value="finance">Finance Department</option>
          <option value="management">Management</option>
        </StableSelect>
        {errors.department && (
          <p style={{
            color: '#ff6a88',
            fontSize: '0.8rem',
            margin: '5px 0 0 0',
            fontFamily: 'system-ui, sans-serif'
          }}>
            {errors.department}
          </p>
        )}
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          color: '#b8e0f0',
          fontSize: '0.85rem',
          marginBottom: '8px',
          fontFamily: 'system-ui, sans-serif',
          fontWeight: '600',
          letterSpacing: '0.5px'
        }}>
          Access Level
        </label>
        <StableSelect
          name="accessLevel"
          value={formData.accessLevel}
          onChange={handleChange}
          style={{
            width: '100%',
            background: 'rgba(0, 0, 0, 0.3)',
            border: errors.accessLevel ? '1px solid #ff6a88' : '1px solid rgba(0, 225, 255, 0.3)',
            borderRadius: '6px',
            padding: '12px 15px',
            color: '#ffffff',
            fontSize: '0.9rem',
            fontFamily: 'system-ui, sans-serif',
            appearance: 'none'
          }}
        >
          <option value="">Select Access Level</option>
          <option value="level1">Level 1 - Basic Access</option>
          <option value="level2">Level 2 - Standard Access</option>
          <option value="level3">Level 3 - Full Access</option>
        </StableSelect>
        {errors.accessLevel && (
          <p style={{
            color: '#ff6a88',
            fontSize: '0.8rem',
            margin: '5px 0 0 0',
            fontFamily: 'system-ui, sans-serif'
          }}>
            {errors.accessLevel}
          </p>
        )}
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          color: '#b8e0f0',
          fontSize: '0.85rem',
          marginBottom: '8px',
          fontFamily: 'system-ui, sans-serif',
          fontWeight: '600',
          letterSpacing: '0.5px'
        }}>
          Admin Code (only fill if changing)
        </label>
        <StableInput
          type="password"
          name="adminCode"
          value={formData.adminCode}
          onChange={handleChange}
          placeholder="Enter new admin code"
          style={{
            width: '100%',
            background: 'rgba(0, 0, 0, 0.3)',
            border: errors.adminCode ? '1px solid #ff6a88' : '1px solid rgba(0, 225, 255, 0.3)',
            borderRadius: '6px',
            padding: '12px 15px',
            color: '#ffffff',
            fontSize: '0.9rem',
            fontFamily: 'system-ui, sans-serif'
          }}
        />
        {errors.adminCode && (
          <p style={{
            color: '#ff6a88',
            fontSize: '0.8rem',
            margin: '5px 0 0 0',
            fontFamily: 'system-ui, sans-serif'
          }}>
            {errors.adminCode}
          </p>
        )}
      </div>
      
      {errors.submit && (
        <div style={{
          background: 'rgba(255, 106, 136, 0.1)',
          border: '1px solid rgba(255, 106, 136, 0.3)',
          borderRadius: '6px',
          padding: '12px 15px',
          color: '#ff6a88',
          fontSize: '0.9rem',
          marginBottom: '20px',
          fontFamily: 'system-ui, sans-serif'
        }}>
          {errors.submit}
        </div>
      )}
      
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            background: 'rgba(138, 179, 197, 0.1)',
            border: '1px solid rgba(138, 179, 197, 0.3)',
            borderRadius: '6px',
            padding: '12px 25px',
            color: '#8ab3c5',
            fontWeight: '600',
            fontSize: '0.9rem',
            cursor: 'pointer',
            fontFamily: 'system-ui, sans-serif'
          }}
        >
          CANCEL
        </button>
        
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            background: isSubmitting ? 'rgba(0, 225, 255, 0.3)' : 'linear-gradient(135deg, #00e1ff, #00d0ff)',
            border: 'none',
            borderRadius: '6px',
            padding: '12px 25px',
            color: isSubmitting ? '#8ab3c5' : '#051a2e',
            fontWeight: '600',
            fontSize: '0.9rem',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            fontFamily: 'system-ui, sans-serif'
          }}
        >
          {isSubmitting ? 'UPDATING...' : 'UPDATE PROFILE'}
        </button>
      </div>
    </form>
  );
};

export default AdminProfileForm;