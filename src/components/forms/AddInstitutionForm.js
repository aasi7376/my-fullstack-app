// src/components/forms/AddInstitutionForm.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { StableInput, StableSelect } from '../ui/StableInputs';
import { toast } from 'react-toastify';
import api from '../../services/api';  // Import the api service directly

const AddInstitutionForm = React.memo(({ onSubmit, onCancel, existingInstitution = null }) => {
  // Initialize form with existing institution data if provided, otherwise use defaults
  const [formData, setFormData] = useState({
    name: '',
    type: 'Public',
    location: '',
    status: 'Active',
    principalName: '',
    address: '',
    phoneNumber: '',
    email: '' 
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Set form data when existingInstitution changes
  useEffect(() => {
    if (existingInstitution) {
      setFormData({
        name: existingInstitution.name || '',
        type: existingInstitution.type || 'Public',
        location: existingInstitution.location || '',
        status: existingInstitution.status || 'Active',
        principalName: existingInstitution.principalName || '',
        address: existingInstitution.address || '',
        phoneNumber: existingInstitution.phoneNumber || '',
        email: existingInstitution.email || ''
      });
    }
  }, [existingInstitution]);
  
  // Use useCallback to prevent function recreation on every render
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: null
      }));
    }
  }, [errors]);
  
  // Simple email validation function
  const isValidEmail = useCallback((email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }, []);
  
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Institution name is required';
    }
    
    if (!formData.type) {
      newErrors.type = 'Institution type is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    // Validate email format if provided
    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Validate type against allowed values
    const validTypes = ['Public', 'Private', 'Charter', 'Other'];
    if (formData.type && !validTypes.includes(formData.type)) {
      newErrors.type = 'Invalid institution type';
    }
    
    return newErrors;
  }, [formData, isValidEmail]);
  
const handleSubmit = async (e) => {
  e.preventDefault();
  
  const newErrors = validateForm();
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    // Highlight the specific error with a toast
    if (Object.keys(newErrors).length > 0) {
      toast.error('Please fix the errors in the form');
    }
    return;
  }
  
  // Log data before submission for debugging
  console.log('Submitting institution data:', formData);
  
  setIsSubmitting(true);
  setErrors({}); // Clear any previous errors
  
  try {
    let result;
    
    if (existingInstitution) {
      // If editing, update existing institution
      result = await api.updateInstitution(existingInstitution._id || existingInstitution.id, formData);
      toast.success('Institution updated successfully!');
    } else {
      // If adding new, create new institution
      result = await api.createInstitution(formData);
      toast.success('Institution added successfully!');
    }
    
    // IMPORTANT: Make sure to call onSubmit with the form data
    // This ensures the parent component gets the data to update the table
    if (onSubmit) {
      // Pass the form data to the parent component
      await onSubmit(formData);
    }
    
    // Log success for debugging
    console.log('Form submitted successfully, result:', result);
    
  } catch (error) {
    console.error('Error submitting form:', error);
    
    // Extract error message from response
    let errorMessage = error.response?.data?.error || error.message || 
                     `Failed to ${existingInstitution ? 'update' : 'add'} institution. Please try again.`;
    
    // Handle duplicate key errors
    if (error.response?.data?.error) {
      const errorMsg = error.response.data.error;
      
      if (errorMsg.includes('email')) {
        setErrors({
          email: 'This email address is already in use. Please use a different email.'
        });
        toast.error('Email address already in use');
      } else if (errorMsg.includes('name')) {
        setErrors({
          name: 'An institution with this name already exists. Please use a different name.'
        });
        toast.error('Institution name already exists');
      } else {
        setErrors({ submit: errorMessage });
        toast.error(errorMessage);
      }
    } else {
      // Handle other errors
      setErrors({ submit: errorMessage });
      toast.error(errorMessage);
    }
  } finally {
    setIsSubmitting(false);
  }
};
  
  return (
    <form onSubmit={handleSubmit} style={{ padding: '10px' }}>
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
          Institution Name *
        </label>
        <StableInput
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter institution name"
          style={{
            width: '100%',
            background: 'rgba(0, 0, 0, 0.3)',
            border: errors.name ? '1px solid #ff6a88' : '1px solid rgba(0, 225, 255, 0.3)',
            borderRadius: '6px',
            padding: '12px 15px',
            color: '#ffffff',
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
      
      {/* Email Field */}
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
          placeholder="Enter institution email"
          style={{
            width: '100%',
            background: 'rgba(0, 0, 0, 0.3)',
            border: errors.email ? '1px solid #ff6a88' : '1px solid rgba(0, 225, 255, 0.3)',
            borderRadius: '6px',
            padding: '12px 15px',
            color: '#ffffff',
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
      
      {/* Principal Name Field */}
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
          Principal Name
        </label>
        <StableInput
          type="text"
          name="principalName"
          value={formData.principalName}
          onChange={handleChange}
          placeholder="Enter principal name"
          style={{
            width: '100%',
            background: 'rgba(0, 0, 0, 0.3)',
            border: errors.principalName ? '1px solid #ff6a88' : '1px solid rgba(0, 225, 255, 0.3)',
            borderRadius: '6px',
            padding: '12px 15px',
            color: '#ffffff',
            fontSize: '0.9rem',
            fontFamily: 'system-ui, sans-serif'
          }}
        />
        {errors.principalName && (
          <p style={{
            color: '#ff6a88',
            fontSize: '0.8rem',
            margin: '5px 0 0 0',
            fontFamily: 'system-ui, sans-serif'
          }}>
            {errors.principalName}
          </p>
        )}
      </div>
      
      {/* Address Field */}
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
          Address
        </label>
        <StableInput
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter institution address"
          style={{
            width: '100%',
            background: 'rgba(0, 0, 0, 0.3)',
            border: errors.address ? '1px solid #ff6a88' : '1px solid rgba(0, 225, 255, 0.3)',
            borderRadius: '6px',
            padding: '12px 15px',
            color: '#ffffff',
            fontSize: '0.9rem',
            fontFamily: 'system-ui, sans-serif'
          }}
        />
        {errors.address && (
          <p style={{
            color: '#ff6a88',
            fontSize: '0.8rem',
            margin: '5px 0 0 0',
            fontFamily: 'system-ui, sans-serif'
          }}>
            {errors.address}
          </p>
        )}
      </div>
      
      {/* Phone Number Field */}
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
          Phone Number
        </label>
        <StableInput
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="Enter phone number"
          style={{
            width: '100%',
            background: 'rgba(0, 0, 0, 0.3)',
            border: errors.phoneNumber ? '1px solid #ff6a88' : '1px solid rgba(0, 225, 255, 0.3)',
            borderRadius: '6px',
            padding: '12px 15px',
            color: '#ffffff',
            fontSize: '0.9rem',
            fontFamily: 'system-ui, sans-serif'
          }}
        />
        {errors.phoneNumber && (
          <p style={{
            color: '#ff6a88',
            fontSize: '0.8rem',
            margin: '5px 0 0 0',
            fontFamily: 'system-ui, sans-serif'
          }}>
            {errors.phoneNumber}
          </p>
        )}
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div>
          <label style={{
            display: 'block',
            color: '#b8e0f0',
            fontSize: '0.85rem',
            marginBottom: '8px',
            fontFamily: 'system-ui, sans-serif',
            fontWeight: '600',
            letterSpacing: '0.5px'
          }}>
            Type *
          </label>
          <StableSelect
            name="type"
            value={formData.type}
            onChange={handleChange}
            style={{
              width: '100%',
              background: 'rgba(0, 0, 0, 0.3)',
              border: errors.type ? '1px solid #ff6a88' : '1px solid rgba(0, 225, 255, 0.3)',
              borderRadius: '6px',
              padding: '12px 15px',
              color: '#ffffff',
              fontSize: '0.9rem',
              fontFamily: 'system-ui, sans-serif',
              appearance: 'none'
            }}
          >
            <option value="Public">Public</option>
            <option value="Private">Private</option>
            <option value="Charter">Charter</option>
            <option value="Other">Other</option>
          </StableSelect>
          {errors.type && (
            <p style={{
              color: '#ff6a88',
              fontSize: '0.8rem',
              margin: '5px 0 0 0',
              fontFamily: 'system-ui, sans-serif'
            }}>
              {errors.type}
            </p>
          )}
        </div>
        
        <div>
          <label style={{
            display: 'block',
            color: '#b8e0f0',
            fontSize: '0.85rem',
            marginBottom: '8px',
            fontFamily: 'system-ui, sans-serif',
            fontWeight: '600',
            letterSpacing: '0.5px'
          }}>
            Status
          </label>
          <StableSelect
            name="status"
            value={formData.status}
            onChange={handleChange}
            style={{
              width: '100%',
              background: 'rgba(0, 0, 0, 0.3)',
              border: errors.status ? '1px solid #ff6a88' : '1px solid rgba(0, 225, 255, 0.3)',
              borderRadius: '6px',
              padding: '12px 15px',
              color: '#ffffff',
              fontSize: '0.9rem',
              fontFamily: 'system-ui, sans-serif',
              appearance: 'none'
            }}
          >
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Inactive">Inactive</option>
          </StableSelect>
          {errors.status && (
            <p style={{
              color: '#ff6a88',
              fontSize: '0.8rem',
              margin: '5px 0 0 0',
              fontFamily: 'system-ui, sans-serif'
            }}>
              {errors.status}
            </p>
          )}
        </div>
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
          Location *
        </label>
        <StableInput
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Enter institution location"
          style={{
            width: '100%',
            background: 'rgba(0, 0, 0, 0.3)',
            border: errors.location ? '1px solid #ff6a88' : '1px solid rgba(0, 225, 255, 0.3)',
            borderRadius: '6px',
            padding: '12px 15px',
            color: '#ffffff',
            fontSize: '0.9rem',
            fontFamily: 'system-ui, sans-serif'
          }}
        />
        {errors.location && (
          <p style={{
            color: '#ff6a88',
            fontSize: '0.8rem',
            margin: '5px 0 0 0',
            fontFamily: 'system-ui, sans-serif'
          }}>
            {errors.location}
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
            background: isSubmitting ? 
              'rgba(0, 225, 255, 0.3)' : 'linear-gradient(135deg, #6affef, #5ce5ff)',
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
          {isSubmitting ? 
            (existingInstitution ? 'UPDATING...' : 'ADDING...') : 
            (existingInstitution ? 'UPDATE INSTITUTION' : 'ADD INSTITUTION')}
        </button>
      </div>
    </form>
  );
});

export default AddInstitutionForm;