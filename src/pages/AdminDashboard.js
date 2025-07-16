import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosWithAuth from '../utils/axiosWithAuth';
import ProfileModal from '../components/ProfileModal';
// Import form components
import AddInstitutionForm from '../components/forms/AddInstitutionForm';
import AddQuestionForm from '../components/forms/AddQuestionForm';
import AddGameForm from '../components/forms/AddGameForm';
import AdminProfileForm from '../components/forms/AdminProfileForm';

// Import separated components
import Modal from '../components/ui/Modal';
import { StableInput, StableSelect } from '../components/ui/StableInputs';
// At the top of your AddInstitutionForm.jsx file
import { createInstitution, updateInstitution } from '../services/institutionService';
import simulationService from '../services/simulationService';
// Import Toast notifications
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Add this code to your AdminDashboard.jsx file

// Define sidebar navigation items
const sidebarItems = [
  { id: 'overview', label: 'COMMAND CENTER', icon: '🏠', color: '#00e1ff' },
  { id: 'schools', label: 'INSTITUTIONS', icon: '🏫', color: '#6affef' },
  { id: 'games', label: 'SIMULATIONS', icon: '🎮', color: '#5ce5ff' },
  { id: 'scores', label: 'SCORE MANAGEMENT', icon: '📈', color: '#15ffaa' },
  { id: 'questions', label: 'QUESTION OVERSIGHT', icon: '❓', color: '#ffd36a' },
  { id: 'analytics', label: 'DATA ANALYSIS', icon: '📊', color: '#00d0ff' },
  { id: 'reports', label: 'REPORTS', icon: '📋', color: '#61efff' },
  { id: 'settings', label: 'SYSTEM CONFIG', icon: '⚙️', color: '#7df5ff' }
];

// Move getStatusConfig outside of component to prevent hooks rule violation
const getStatusConfig = (status) => {
  const configs = {
    Active: { color: '#15ffaa', bg: 'rgba(21, 255, 170, 0.15)' },
    Pending: { color: '#ffd36a', bg: 'rgba(253, 211, 106, 0.15)' },
    Inactive: { color: '#ff6a88', bg: 'rgba(255, 106, 136, 0.15)' },
    Online: { color: '#15ffaa', bg: 'rgba(21, 255, 170, 0.15)' },
    Offline: { color: '#8ab3c5', bg: 'rgba(138, 179, 197, 0.15)' },
    Beta: { color: '#00e1ff', bg: 'rgba(0, 225, 255, 0.15)' },
    Advanced: { color: '#ff6a88', bg: 'rgba(255, 106, 136, 0.15)' },
    Intermediate: { color: '#ffd36a', bg: 'rgba(253, 211, 106, 0.15)' },
    Beginner: { color: '#15ffaa', bg: 'rgba(21, 255, 170, 0.15)' },
    Published: { color: '#15ffaa', bg: 'rgba(21, 255, 170, 0.15)' },
    Draft: { color: '#ffd36a', bg: 'rgba(253, 211, 106, 0.15)' }
  };
  return configs[status] || { color: '#8ab3c5', bg: 'rgba(138, 179, 197, 0.15)' };
};

// StableTextarea component for form inputs
const StableTextarea = React.forwardRef((props, ref) => {
  return (
    <textarea
      ref={ref}
      {...props}
      style={{
        width: '100%',
        background: 'rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(0, 225, 255, 0.3)',
        borderRadius: '6px',
        padding: '12px 15px',
        color: '#ffffff',
        fontSize: '0.9rem',
        fontFamily: 'system-ui, sans-serif',
        minHeight: '80px',
        resize: 'vertical',
        ...props.style
      }}
    />
  );
});

// NeonCard component
const NeonCard = ({ children, style, color = '#00e1ff' }) => {
  return (
    <div 
      style={{
        background: 'rgba(5, 26, 46, 0.7)',
        backdropFilter: 'blur(10px)',
        borderRadius: '10px',
        border: `1px solid ${color}40`,
        boxShadow: `0 4px 20px ${color}20`,
        overflow: 'hidden',
        ...style
      }}
    >
      {children}
    </div>
  );
};

// StatusBadge component
const StatusBadge = ({ status }) => {
  const config = getStatusConfig(status);
  return (
    <div style={{
      display: 'inline-block',
      padding: '6px 12px',
      borderRadius: '4px',
      background: config.bg,
      color: config.color,
      fontSize: '0.8rem',
      fontWeight: '600',
      fontFamily: 'system-ui, sans-serif'
    }}>
      {status}
    </div>
  );
};

// Switch component
const Switch = ({ isOn, handleToggle, label }) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '15px'
    }}>
      <label style={{
        color: '#b8e0f0',
        fontSize: '0.85rem',
        fontFamily: 'system-ui, sans-serif',
        fontWeight: '600',
        letterSpacing: '0.5px'
      }}>
        {label}
      </label>
      <div 
        onClick={handleToggle}
        style={{
          position: 'relative',
          width: '46px',
          height: '24px',
          background: isOn ? 'linear-gradient(135deg, #00e1ff, #15ffaa)' : 'rgba(138, 179, 197, 0.3)',
          borderRadius: '12px',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
      >
        <div 
          style={{
            position: 'absolute',
            top: '2px',
            left: isOn ? '24px' : '2px',
            width: '20px',
            height: '20px',
            background: '#ffffff',
            borderRadius: '50%',
            transition: 'all 0.3s ease',
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.2)'
          }}
        />
      </div>
    </div>
  );
};

// Updated AddStudentForm with school name input instead of dropdown
const AddStudentForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    grade: '',
    schoolName: '', // Changed from school (id) to schoolName (text)
    status: 'Active'
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.grade) {
      newErrors.grade = 'Grade is required';
    }
    
    if (!formData.schoolName.trim()) {
      newErrors.schoolName = 'School name is required';
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
      await onSubmit(formData);
      // Form submitted successfully
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({
        submit: 'Failed to add student. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
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
          Student Name *
        </label>
        <StableInput
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter student name"
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
          Email *
        </label>
        <StableInput
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter student email"
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
          Password *
        </label>
        <StableInput
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter password"
          style={{
            width: '100%',
            background: 'rgba(0, 0, 0, 0.3)',
            border: errors.password ? '1px solid #ff6a88' : '1px solid rgba(0, 225, 255, 0.3)',
            borderRadius: '6px',
            padding: '12px 15px',
            color: '#ffffff',
            fontSize: '0.9rem',
            fontFamily: 'system-ui, sans-serif'
          }}
        />
        {errors.password && (
          <p style={{
            color: '#ff6a88',
            fontSize: '0.8rem',
            margin: '5px 0 0 0',
            fontFamily: 'system-ui, sans-serif'
          }}>
            {errors.password}
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
            Grade *
          </label>
          <StableSelect
            name="grade"
            value={formData.grade}
            onChange={handleChange}
            style={{
              width: '100%',
              background: 'rgba(0, 0, 0, 0.3)',
              border: errors.grade ? '1px solid #ff6a88' : '1px solid rgba(0, 225, 255, 0.3)',
              borderRadius: '6px',
              padding: '12px 15px',
              color: '#ffffff',
              fontSize: '0.9rem',
              fontFamily: 'system-ui, sans-serif',
              appearance: 'none'
            }}
          >
            <option value="">Select Grade</option>
            <option value="K">Kindergarten</option>
            <option value="1">1st Grade</option>
            <option value="2">2nd Grade</option>
            <option value="3">3rd Grade</option>
            <option value="4">4th Grade</option>
            <option value="5">5th Grade</option>
            <option value="6">6th Grade</option>
            <option value="7">7th Grade</option>
            <option value="8">8th Grade</option>
            <option value="9">9th Grade</option>
            <option value="10">10th Grade</option>
            <option value="11">11th Grade</option>
            <option value="12">12th Grade</option>
          </StableSelect>
          {errors.grade && (
            <p style={{
              color: '#ff6a88',
              fontSize: '0.8rem',
              margin: '5px 0 0 0',
              fontFamily: 'system-ui, sans-serif'
            }}>
              {errors.grade}
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
            School Name *
          </label>
          <StableInput
            type="text"
            name="schoolName"
            value={formData.schoolName}
            onChange={handleChange}
            placeholder="Enter school name"
            style={{
              width: '100%',
              background: 'rgba(0, 0, 0, 0.3)',
              border: errors.schoolName ? '1px solid #ff6a88' : '1px solid rgba(0, 225, 255, 0.3)',
              borderRadius: '6px',
              padding: '12px 15px',
              color: '#ffffff',
              fontSize: '0.9rem',
              fontFamily: 'system-ui, sans-serif'
            }}
          />
          {errors.schoolName && (
            <p style={{
              color: '#ff6a88',
              fontSize: '0.8rem',
              margin: '5px 0 0 0',
              fontFamily: 'system-ui, sans-serif'
            }}>
              {errors.schoolName}
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
          Status
        </label>
        <StableSelect
          name="status"
          value={formData.status}
          onChange={handleChange}
          style={{
            width: '100%',
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(0, 225, 255, 0.3)',
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
          {isSubmitting ? 'ADDING...' : 'ADD STUDENT'}
        </button>
      </div>
    </form>
  );
};
// Create this component inside your AdminDashboard.js file
const AddScoreForm = ({ onSubmit, onCancel, gamesData, studentsData }) => {
  const [formData, setFormData] = useState({
    student: '',
    game: '',
    score: 80,
    date: new Date().toISOString().split('T')[0],
    time: '30 min'
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
    
    if (!formData.student) {
      newErrors.student = 'Student is required';
    }
    
    if (!formData.game) {
      newErrors.game = 'Simulation is required';
    }
    
    if (!formData.score) {
      newErrors.score = 'Score is required';
    } else if (formData.score < 0 || formData.score > 100) {
      newErrors.score = 'Score must be between 0 and 100';
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
      await onSubmit(formData);
      // Form submitted successfully
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({
        submit: 'Failed to add score. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
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
          Student *
        </label>
        <select
          name="student"
          value={formData.student}
          onChange={handleChange}
          style={{
            width: '100%',
            background: 'rgba(0, 0, 0, 0.3)',
            border: errors.student ? '1px solid #ff6a88' : '1px solid rgba(0, 225, 255, 0.3)',
            borderRadius: '6px',
            padding: '12px 15px',
            color: '#ffffff',
            fontSize: '0.9rem',
            fontFamily: 'system-ui, sans-serif',
            appearance: 'none'
          }}
        >
          <option value="">Select Student</option>
          {studentsData.map(student => (
            <option key={student.id} value={student.name}>{student.name}</option>
          ))}
          <option value="Custom">Add Custom Student</option>
        </select>
        {formData.student === 'Custom' && (
          <input
            type="text"
            name="customStudent"
            value={formData.customStudent || ''}
            onChange={(e) => setFormData({...formData, customStudent: e.target.value})}
            placeholder="Enter student name"
            style={{
              width: '100%',
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(0, 225, 255, 0.3)',
              borderRadius: '6px',
              padding: '12px 15px',
              color: '#ffffff',
              fontSize: '0.9rem',
              marginTop: '10px'
            }}
          />
        )}
        {errors.student && (
          <p style={{
            color: '#ff6a88',
            fontSize: '0.8rem',
            margin: '5px 0 0 0'
          }}>
            {errors.student}
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
          Simulation *
        </label>
        <select
          name="game"
          value={formData.game}
          onChange={handleChange}
          style={{
            width: '100%',
            background: 'rgba(0, 0, 0, 0.3)',
            border: errors.game ? '1px solid #ff6a88' : '1px solid rgba(0, 225, 255, 0.3)',
            borderRadius: '6px',
            padding: '12px 15px',
            color: '#ffffff',
            fontSize: '0.9rem',
            fontFamily: 'system-ui, sans-serif',
            appearance: 'none'
          }}
        >
          <option value="">Select Simulation</option>
          {gamesData.map(game => (
            <option key={game.id || game._id} value={game.title}>{game.title}</option>
          ))}
        </select>
        {errors.game && (
          <p style={{
            color: '#ff6a88',
            fontSize: '0.8rem',
            margin: '5px 0 0 0'
          }}>
            {errors.game}
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
            Score (%) *
          </label>
          <input
            type="number"
            name="score"
            value={formData.score}
            onChange={handleChange}
            min="0"
            max="100"
            style={{
              width: '100%',
              background: 'rgba(0, 0, 0, 0.3)',
              border: errors.score ? '1px solid #ff6a88' : '1px solid rgba(0, 225, 255, 0.3)',
              borderRadius: '6px',
              padding: '12px 15px',
              color: '#ffffff',
              fontSize: '0.9rem'
            }}
          />
          {errors.score && (
            <p style={{
              color: '#ff6a88',
              fontSize: '0.8rem',
              margin: '5px 0 0 0'
            }}>
              {errors.score}
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
            Time Spent
          </label>
          <input
            type="text"
            name="time"
            value={formData.time}
            onChange={handleChange}
            placeholder="e.g. 30 min"
            style={{
              width: '100%',
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(0, 225, 255, 0.3)',
              borderRadius: '6px',
              padding: '12px 15px',
              color: '#ffffff',
              fontSize: '0.9rem'
            }}
          />
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
          Date
        </label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          style={{
            width: '100%',
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(0, 225, 255, 0.3)',
            borderRadius: '6px',
            padding: '12px 15px',
            color: '#ffffff',
            fontSize: '0.9rem'
          }}
        />
      </div>
      
      {errors.submit && (
        <div style={{
          background: 'rgba(255, 106, 136, 0.1)',
          border: '1px solid rgba(255, 106, 136, 0.3)',
          borderRadius: '6px',
          padding: '12px 15px',
          color: '#ff6a88',
          fontSize: '0.9rem',
          marginBottom: '20px'
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
            cursor: 'pointer'
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
            cursor: isSubmitting ? 'not-allowed' : 'pointer'
          }}
        >
          {isSubmitting ? 'ADDING...' : 'ADD SCORE'}
        </button>
      </div>
    </form>
  );
};
// Create this component inside your AdminDashboard.js file
const AddReportForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Performance',
    status: 'Draft',
    content: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
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
      await onSubmit(formData);
      // Form submitted successfully
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({
        submit: 'Failed to create report. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
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
          Report Title *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter report title"
          style={{
            width: '100%',
            background: 'rgba(0, 0, 0, 0.3)',
            border: errors.title ? '1px solid #ff6a88' : '1px solid rgba(0, 225, 255, 0.3)',
            borderRadius: '6px',
            padding: '12px 15px',
            color: '#ffffff',
            fontSize: '0.9rem'
          }}
        />
        {errors.title && (
          <p style={{
            color: '#ff6a88',
            fontSize: '0.8rem',
            margin: '5px 0 0 0'
          }}>
            {errors.title}
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
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            style={{
              width: '100%',
              background: 'rgba(0, 0, 0, 0.3)',
              border: errors.category ? '1px solid #ff6a88' : '1px solid rgba(0, 225, 255, 0.3)',
              borderRadius: '6px',
              padding: '12px 15px',
              color: '#ffffff',
              fontSize: '0.9rem',
              appearance: 'none'
            }}
          >
            <option value="Performance">Performance</option>
            <option value="Engagement">Engagement</option>
            <option value="Assessment">Assessment</option>
            <option value="Analytics">Analytics</option>
          </select>
          {errors.category && (
            <p style={{
              color: '#ff6a88',
              fontSize: '0.8rem',
              margin: '5px 0 0 0'
            }}>
              {errors.category}
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
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            style={{
              width: '100%',
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(0, 225, 255, 0.3)',
              borderRadius: '6px',
              padding: '12px 15px',
              color: '#ffffff',
              fontSize: '0.9rem',
              appearance: 'none'
            }}
          >
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
          </select>
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
          Content
        </label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Enter report content or description"
          style={{
            width: '100%',
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(0, 225, 255, 0.3)',
            borderRadius: '6px',
            padding: '12px 15px',
            color: '#ffffff',
            fontSize: '0.9rem',
            minHeight: '120px',
            resize: 'vertical'
          }}
        />
      </div>
      
      {errors.submit && (
        <div style={{
          background: 'rgba(255, 106, 136, 0.1)',
          border: '1px solid rgba(255, 106, 136, 0.3)',
          borderRadius: '6px',
          padding: '12px 15px',
          color: '#ff6a88',
          fontSize: '0.9rem',
          marginBottom: '20px'
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
            cursor: 'pointer'
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
            cursor: isSubmitting ? 'not-allowed' : 'pointer'
          }}
        >
          {isSubmitting ? 'CREATING...' : 'CREATE REPORT'}
        </button>
      </div>
    </form>
  );
};
// NotificationPanel component
const NotificationPanel = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      style={{
        position: 'absolute',
        top: '50px',
        right: '0',
        width: '320px',
        maxHeight: '400px',
        overflowY: 'auto',
        background: 'rgba(5, 26, 46, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '10px',
        border: '1px solid rgba(0, 225, 255, 0.3)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
        zIndex: 1000,
        padding: '15px'
      }}
    >
      <h3 style={{
        color: '#ffffff',
        fontSize: '1rem',
        fontWeight: '600',
        margin: '0 0 15px 0',
        fontFamily: 'system-ui, sans-serif'
      }}>
        NOTIFICATIONS
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{
          padding: '12px',
          background: 'rgba(0, 225, 255, 0.1)',
          border: '1px solid rgba(0, 225, 255, 0.2)',
          borderRadius: '8px'
        }}>
          <h4 style={{
            color: '#ffffff',
            fontSize: '0.9rem',
            fontWeight: '600',
            margin: '0 0 5px 0',
            fontFamily: 'system-ui, sans-serif'
          }}>
            New Student Registration
          </h4>
          <p style={{
            color: '#b8e0f0',
            fontSize: '0.8rem',
            margin: '0 0 5px 0'
          }}>
            Sarah Johnson joined Lincoln High School
          </p>
          <span style={{
            color: '#8ab3c5',
            fontSize: '0.75rem'
          }}>
            2 min ago
          </span>
        </div>
        
        <div style={{
          padding: '12px',
          background: 'rgba(0, 225, 255, 0.1)',
          border: '1px solid rgba(0, 225, 255, 0.2)',
          borderRadius: '8px'
        }}>
          <h4 style={{
            color: '#ffffff',
            fontSize: '0.9rem',
            fontWeight: '600',
            margin: '0 0 5px 0',
            fontFamily: 'system-ui, sans-serif'
          }}>
            School Added
          </h4>
          <p style={{
            color: '#b8e0f0',
            fontSize: '0.8rem',
            margin: '0 0 5px 0'
          }}>
            Greenwood Elementary was added to the platform
          </p>
          <span style={{
            color: '#8ab3c5',
            fontSize: '0.75rem'
          }}>
            1 hour ago
          </span>
        </div>
      </div>
      
      <button style={{
        background: 'none',
        border: 'none',
        color: '#00e1ff',
        fontSize: '0.8rem',
        padding: '10px',
        marginTop: '10px',
        cursor: 'pointer',
        width: '100%',
        textAlign: 'center',
        fontFamily: 'system-ui, sans-serif',
        fontWeight: '600'
      }}>
        VIEW ALL NOTIFICATIONS
      </button>
    </motion.div>
  );
};

// GameCard component for game display with edit and delete functionality
const GameCard = ({ game, onClick, onDelete }) => {
  const difficultyConfig = getStatusConfig(game.difficulty);
  const statusConfig = getStatusConfig(game.status);
  
  return (
    <div 
      style={{
        background: 'rgba(5, 26, 46, 0.7)',
        backdropFilter: 'blur(10px)',
        borderRadius: '10px',
        border: '1px solid rgba(0, 225, 255, 0.3)',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(0, 225, 255, 0.1)',
        position: 'relative'
      }}
      onClick={onClick}
    >
      <div style={{
        background: 'linear-gradient(135deg, rgba(0, 225, 255, 0.2), rgba(0, 149, 255, 0.1))',
        padding: '25px 20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 1
        }}>
          <StatusBadge status={game.status} />
        </div>
        
        <h3 style={{
          color: '#ffffff',
          fontSize: '1.2rem',
          fontWeight: '700',
          margin: '0 0 10px 0',
          fontFamily: 'system-ui, sans-serif'
        }}>
          {game.title}
        </h3>
        
        <p style={{
          color: '#b8e0f0',
          fontSize: '0.9rem',
          margin: '0',
          fontFamily: 'system-ui, sans-serif'
        }}>
          {game.category}
        </p>
        
        <div style={{
          position: 'absolute',
          right: '-20px',
          bottom: '-20px',
          width: '100px',
          height: '100px',
          background: 'rgba(0, 225, 255, 0.1)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          opacity: 0.7
        }}>
          {game.category === 'Mathematics' && '🧮'}
          {game.category === 'Science' && '🔬'}
          {game.category === 'History' && '🏺'}
          {game.category === 'Literature' && '📚'}
        </div>
      </div>
      
      <div style={{
        padding: '20px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '15px'
        }}>
          <div>
            <p style={{
              color: '#8ab3c5',
              fontSize: '0.8rem',
              margin: '0 0 5px 0',
              fontFamily: 'system-ui, sans-serif'
            }}>
              Difficulty
            </p>
            <p style={{
              color: difficultyConfig.color,
              fontSize: '0.9rem',
              fontWeight: '600',
              margin: '0',
              fontFamily: 'system-ui, sans-serif'
            }}>
              {game.difficulty}
            </p>
          </div>
          
          <div>
            <p style={{
              color: '#8ab3c5',
              fontSize: '0.8rem',
              margin: '0 0 5px 0',
              fontFamily: 'system-ui, sans-serif',
              textAlign: 'right'
            }}>
              Rating
            </p>
            <p style={{
              color: '#ffd36a',
              fontSize: '0.9rem',
              fontWeight: '600',
              margin: '0',
              fontFamily: 'system-ui, sans-serif',
              textAlign: 'right'
            }}>
              {'⭐'.repeat(Math.floor(game.rating))}
              {game.rating % 1 >= 0.5 ? '⭐' : ''} 
              {game.rating.toFixed(1)}
            </p>
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <p style={{
            color: '#8ab3c5',
            fontSize: '0.8rem',
            margin: '0',
            fontFamily: 'system-ui, sans-serif'
          }}>
            {game.plays.toLocaleString()} plays
          </p>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              style={{
                background: 'rgba(0, 225, 255, 0.1)',
                border: '1px solid rgba(0, 225, 255, 0.3)',
                borderRadius: '4px',
                padding: '5px 10px',
                color: '#00e1ff',
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click
                onClick(e);
              }}
            >
              EDIT
            </button>
           <button
              style={{
                background: 'rgba(255, 106, 136, 0.1)',
                border: '1px solid rgba(255, 106, 136, 0.3)',
                borderRadius: '4px',
                padding: '5px 10px',
                color: '#ff6a88',
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click
                onDelete(e);
              }}
            >
              DELETE
            </button>
           </div>
        </div>
      </div>
    </div>
  );
};

// Main AdminDashboard component
const AdminDashboard = () => {
  // Authentication and navigation
  const { isAuthenticated, user, logout } = useAuth();  // Fixed: Added logout from useAuth
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  // State variables
  const [error, setError] = useState(null);
  
  // Tab and navigation state
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showBackHome, setShowBackHome] = useState(false);
  
  // Modal visibility state
  const [showAddSchoolModal, setShowAddSchoolModal] = useState(false);
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showAddGameModal, setShowAddGameModal] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showAddReportModal, setShowAddReportModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  // Notification state
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(2);
  
  // UI state
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [schoolSearchQuery, setSchoolSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Selected item state
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedScore, setSelectedScore] = useState(null);
    const [profileModalOpen, setProfileModalOpen] = useState(false);
  // Simulations state
  const [simulations, setSimulations] = useState([]);
  
  // Use mock data state
  const [useMockData, setUseMockData] = useState(true);
  // Add these two lines:
const mousePositionRef = useRef({ x: 0, y: 0 });
const mouseFollowerRef = useRef(null);
  // Admin profile state
  const [adminProfile, setAdminProfile] = useState({
    name: 'Admin User',
    email: 'admin@example.com',
    department: 'it',
    accessLevel: 'level3',
    lastLogin: new Date().toISOString()
  });
  
  // Data state
  const [recentActivities, setRecentActivities] = useState([
    { id: 1, title: 'New Student Registration', description: 'Sarah Johnson joined Lincoln High School', time: '2 min ago', icon: '🎓' },
    { id: 2, title: 'School Added', description: 'Greenwood Elementary was added to the platform', time: '1 hour ago', icon: '🏫' },
    { id: 3, title: 'Score Submitted', description: 'High score in Algebra Quest simulation', time: '3 hours ago', icon: '📈' }
  ]);
  
  const [stats, setStats] = useState({
    totalUsers: 250,
    totalGames: 12,
    activeUsers: 180,
    totalSchools: 4,
    totalStudents: 1900,
    totalTeachers: 100
  });

  // School data
  const [schoolsData, setSchoolsData] = useState([
    { id: 1, name: 'St. Mary\'s Academy', type: 'Private', students: 450, teachers: 25, status: 'Active', location: 'New York' },
    { id: 2, name: 'Lincoln High School', type: 'Public', students: 850, teachers: 42, status: 'Active', location: 'California' },
    { id: 3, name: 'Greenwood Elementary', type: 'Public', students: 320, teachers: 18, status: 'Pending', location: 'Texas' },
    { id: 4, name: 'Elite Academy', type: 'Private', students: 280, teachers: 15, status: 'Active', location: 'Florida' }
  ]);

  // Teacher data
  const [teachersData, setTeachersData] = useState([
    { id: 1, name: 'John Doe', subject: 'Mathematics', school: 'St. Mary\'s Academy', lastActive: '2 hours ago', status: 'Online' },
    { id: 2, name: 'Jane Smith', subject: 'Science', school: 'Lincoln High School', lastActive: '30 min ago', status: 'Online' },
    { id: 3, name: 'Mike Wilson', subject: 'History', school: 'Greenwood Elementary', lastActive: '45 min ago', status: 'Online' },
    { id: 4, name: 'Emily Chen', subject: 'Literature', school: 'Elite Academy', lastActive: '5 hours ago', status: 'Offline' }
  ]);

  // Student data
  const [studentsData, setStudentsData] = useState([
    { id: 1, name: 'Sarah Johnson', grade: '10th', school: 'Lincoln High School', lastActive: '1 hour ago', status: 'Online', performanceScore: 87 },
    { id: 2, name: 'Mike Chen', grade: '11th', school: 'Elite Academy', lastActive: '2 hours ago', status: 'Online', performanceScore: 92 },
    { id: 3, name: 'Emma Wilson', grade: '9th', school: 'St. Mary\'s Academy', lastActive: '3 hours ago', status: 'Offline', performanceScore: 78 },
    { id: 4, name: 'David Brown', grade: '8th', school: 'Greenwood Elementary', lastActive: '1 day ago', status: 'Offline', performanceScore: 85 }
  ]);

  // Game/simulation data with enhanced details
  const [gamesData, setGamesData] = useState([
    { 
      id: 1, 
      title: 'Algebra Quest', 
      category: 'Mathematics', 
      difficulty: 'Intermediate', 
      plays: 12500, 
      rating: 4.8, 
      status: 'Active',
      description: 'A thrilling adventure through the world of algebra. Students solve equations and unlock new levels as they progress through increasingly challenging problems.',
      estimatedPlayTime: 45,
      targetGrade: '6-8',
      learningObjectives: 'Master linear equations, understand variables, develop problem-solving skills'
    },
    { 
      id: 2, 
      title: 'History Explorer', 
      category: 'History', 
      difficulty: 'Beginner', 
      plays: 8400, 
      rating: 4.6, 
      status: 'Active',
      description: 'Travel through time to experience key historical events firsthand. Interactive storytelling and decision-making help students understand historical contexts.',
      estimatedPlayTime: 30,
      targetGrade: '3-5',
      learningObjectives: 'Understand historical chronology, recognize cause and effect in historical events'
    },
    { 
      id: 3, 
      title: 'Science Lab VR', 
      category: 'Science', 
      difficulty: 'Advanced', 
      plays: 6200, 
      rating: 4.9, 
      status: 'Beta',
      description: 'A virtual reality lab where students can conduct experiments safely. Covers chemistry, physics, and biology experiments with detailed explanations.',
      estimatedPlayTime: 60,
      targetGrade: '9-10',
      learningObjectives: 'Apply scientific method, conduct experiments safely, analyze results'
    },
    { 
      id: 4, 
      title: 'Language Master', 
      category: 'Literature', 
      difficulty: 'Intermediate', 
      plays: 9800, 
      rating: 4.7, 
      status: 'Active',
      description: 'Improve vocabulary and grammar through interactive word games and creative writing challenges.',
      estimatedPlayTime: 40,
      targetGrade: '6-8',
      learningObjectives: 'Enhance vocabulary, improve grammar usage, develop writing skills'
    }
  ]);
  
  // Score data
  const [scoresData, setScoresData] = useState([
    { id: 1, student: 'Sarah Johnson', game: 'Algebra Quest', score: 92, date: '2024-05-15', time: '45 min' },
    { id: 2, student: 'Mike Chen', game: 'Science Lab VR', score: 88, date: '2024-05-14', time: '30 min' },
    { id: 3, student: 'Emma Wilson', game: 'History Explorer', score: 76, date: '2024-05-13', time: '25 min' },
    { id: 4, student: 'David Brown', game: 'Language Master', score: 84, date: '2024-05-12', time: '40 min' }
  ]);
  
  // Question data
  const [questionsData, setQuestionsData] = useState([
    { 
      id: 1, 
      game: 'Algebra Quest', 
      question: 'What is the solution to the equation 2x + 5 = 15?', 
      type: 'Multiple Choice',
      difficulty: 'Beginner',
      options: ['x = 5', 'x = 10', 'x = 7.5', 'x = 3'],
      answer: 'x = 5'
    },
    { 
      id: 2, 
      game: 'History Explorer', 
      question: 'In what year did World War II end?', 
      type: 'Multiple Choice',
      difficulty: 'Beginner',
      options: ['1945', '1939', '1950', '1942'],
      answer: '1945'
    },
    { 
      id: 3, 
      game: 'Science Lab VR', 
      question: 'What is the chemical symbol for water?', 
      type: 'Multiple Choice',
      difficulty: 'Beginner',
      options: ['H2O', 'CO2', 'O2', 'NaCl'],
      answer: 'H2O'
    },
    { 
      id: 4, 
      game: 'Language Master', 
      question: 'Which of the following is an example of onomatopoeia?', 
      type: 'Multiple Choice',
      difficulty: 'Intermediate',
      options: ['Buzz', 'Happy', 'Walking', 'Beautiful'],
      answer: 'Buzz'
    }
  ]);

  // Analytics data
  const [analyticsData, setAnalyticsData] = useState({
    studentProgress: [
      { month: 'Jan', avgScore: 75 },
      { month: 'Feb', avgScore: 78 },
      { month: 'Mar', avgScore: 80 },
      { month: 'Apr', avgScore: 83 },
      { month: 'May', avgScore: 87 }
    ],
    gameUsage: [
      { game: 'Algebra Quest', sessions: 12500 },
      { game: 'History Explorer', sessions: 8400 },
      { game: 'Science Lab VR', sessions: 6200 },
      { game: 'Language Master', sessions: 9800 }
    ],
    schoolPerformance: [
      { school: 'St. Mary\'s Academy', avgScore: 85 },
      { school: 'Lincoln High School', avgScore: 87 },
      { school: 'Greenwood Elementary', avgScore: 81 },
      { school: 'Elite Academy', avgScore: 89 }
    ]
  });

  // Report data
  const [reportsData, setReportsData] = useState([
    { 
      id: 1, 
      title: 'Q2 School Performance Analysis', 
      category: 'Performance',
      author: 'Admin',
      createdAt: '2024-05-15',
      status: 'Published'
    },
    { 
      id: 2, 
      title: 'Student Engagement Metrics 2024', 
      category: 'Engagement',
      author: 'Admin',
      createdAt: '2024-05-10',
      status: 'Published'
    },
    { 
      id: 3, 
      title: 'Simulation Effectiveness Report', 
      category: 'Performance',
      author: 'Admin',
      createdAt: '2024-05-05',
      status: 'Draft'
    },
    { 
      id: 4, 
      title: 'Annual Learning Outcomes', 
      category: 'Assessment',
      author: 'Admin',
      createdAt: '2024-04-30',
      status: 'Published'
    }
  ]);

  // Settings state
  const [systemSettings, setSystemSettings] = useState({
    notifications: true,
    dataBackup: true,
    autoLogout: 30,
    darkMode: true,
    language: 'English',
    timezone: 'UTC-5',
    analyticsTracking: true,
    maintenanceMode: false
  });
  // Mock API response helper - modified to not log anything to avoid confusion
  const mockApiResponse = (data = []) => {
    // No console.log to reduce noise
    return Promise.resolve({ success: true, data });
  };

  // Revised fetch simulations function - uses local data only, no API calls
const fetchSimulations = async () => {
  setLoading(true);
  try {
    const response = await simulationService.getAllSimulations();
    setGamesData(response.data || []);
    setSimulations(response.data || []);
  } catch (error) {
    console.error('Error fetching simulations:', error);
    toast.error('Failed to load simulations');
  } finally {
    setLoading(false);
  }
};
  // Mock functions to replace the deleted service functions
  // Mock admin dashboard service
  const getAdminProfile = () => {
    return Promise.resolve(adminProfile);
  };

  const updateAdminProfile = (data) => {
    return Promise.resolve({ success: true, data });
  };

  const getAdminDashboard = () => {
    return Promise.resolve({
      stats,
      recentActivities,
      topSchools: schoolsData.slice(0, 3),
      topGames: gamesData.slice(0, 3)
    });
  };

  // Mock institution service functions
  const getInstitutions = () => mockApiResponse(schoolsData);
  const createInstitution = (data) => {
    const newInstitution = {
      _id: Date.now().toString(),
      ...data
    };
    return Promise.resolve(newInstitution);
  };
  const updateInstitution = (id, data) => {
    return Promise.resolve({
      _id: id,
      ...data
    });
  };
  const deleteInstitution = () => mockApiResponse();

  // Mock simulation service functions
  const getSimulations = () => mockApiResponse(gamesData);
  const createSimulation = (data) => {
    const newSimulation = {
      _id: Date.now().toString(),
      ...data
    };
    return Promise.resolve(newSimulation);
  };
  const updateSimulation = (id, data) => {
    return Promise.resolve({
      _id: id,
      ...data
    });
  };
  const deleteSimulation = () => mockApiResponse();

  // Mock question service functions
  const getQuestions = () => mockApiResponse(questionsData);
  const createQuestion = (data) => {
    const newQuestion = {
      _id: Date.now().toString(),
      ...data
    };
    return Promise.resolve(newQuestion);
  };
  const updateQuestion = (id, data) => {
    return Promise.resolve({
      _id: id,
      ...data
    });
  };
  const deleteQuestion = () => mockApiResponse();

// Initial effect to load data
// Fix for the useEffect dependency array
useEffect(() => {
  console.log('[AdminDashboard] Component mounted', { isAuthenticated, userRole: user?.role });
  
  // Verify auth status first
  if (!isAuthenticated) {
    console.warn('[AdminDashboard] Not authenticated, redirecting to login');
    navigate('/login?expired=true');
    return;
  }
  
  // Verify user role
  if (user?.role !== 'admin') {
    console.warn(`[AdminDashboard] User has wrong role: ${user?.role}, redirecting`);
    navigate(`/${user?.role}/dashboard`);
    return;
  }
  
  // Set loading state
  setLoading(true);
  
  // Load dashboard data with API integration
  const loadData = async () => {
    try {
      // Set dashboard data with local mock data for now
      setDashboardData({
        stats,
        recentActivities,
        topSchools: schoolsData.slice(0, 3),
        topGames: gamesData.slice(0, 3)
      });
      
      // Use API for fetching simulations
      const simulationsResponse = await simulationService.getAllSimulations();
      
      // Check if the response contains the expected data structure
      if (simulationsResponse && simulationsResponse.data) {
        setGamesData(simulationsResponse.data);
        setSimulations(simulationsResponse.data);
        
        // Optionally update the topGames in dashboardData
        if (simulationsResponse.data.length > 0) {
          // Sort by rating or plays to get top games
          const sortedGames = [...simulationsResponse.data].sort((a, b) => 
            (b.rating || 0) - (a.rating || 0)
          );
          
          setDashboardData(prev => ({
            ...prev,
            topGames: sortedGames.slice(0, 3)
          }));
        }
      } else {
        console.warn('Simulation API response missing data property:', simulationsResponse);
        // Fallback to mock data
        setGamesData(gamesData);
        setSimulations(gamesData);
      }
    } catch (error) {
      console.error('Error loading simulation data:', error);
      toast.error('Failed to load simulations data');
      
      // Fallback to mock data if API fails
      setGamesData(gamesData);
      setSimulations(gamesData);
    } finally {
      setLoading(false);
    }
  };
  
  loadData();
  
// Important: Only include dependencies that should cause a re-fetch
}, [isAuthenticated, user, navigate]);
  // Handler for updating admin profile
  const handleUpdateProfile = (profileData) => {
    return new Promise((resolve, reject) => {
      setLoading(true);
      
      // Update local state instead of making API call
      setAdminProfile({
        ...adminProfile,
        ...profileData
      });
      
      toast.success('Profile updated successfully!');
      setLoading(false);
      resolve({ success: true });
    });
  };
  
  // Fixed: Properly use the logout function from useAuth
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();  // Using the logout function from useAuth
      navigate('/login');
    }
  };

 const handleAddSchool = (schoolData) => {
  return new Promise((resolve, reject) => {
    setLoading(true);
    
    // Create a new school with proper formatting to match your table expectations
    const newSchool = {
      id: Date.now(), // Generate a temporary ID
      name: schoolData.name,
      type: schoolData.type,
      location: schoolData.location || 'Unknown',
      students: 0, // Default values for new institutions
      teachers: 0,
      status: schoolData.status || 'Active',
      // Include any other fields your table expects
      principalName: schoolData.principalName,
      address: schoolData.address,
      phoneNumber: schoolData.phoneNumber,
      email: schoolData.email
    };
    
    // IMPORTANT: Add the new school to your schoolsData state
    setSchoolsData(prevSchools => [...prevSchools, newSchool]);
    
    // Close the modal
    setShowAddSchoolModal(false);
    
    // Update stats
    setStats(prev => ({
      ...prev,
      totalSchools: prev.totalSchools + 1
    }));
    
    // Add to recent activities
    const newActivity = {
      id: Date.now(),
      title: 'New Institution Added',
      description: `${newSchool.name} added to the platform`,
      time: 'Just now',
      icon: '🏫'
    };
    setRecentActivities([newActivity, ...recentActivities]);
    
    // Show success message
    toast.success('Institution added successfully!');
    setLoading(false);
    
    // Log that the school was added to the state
    console.log('Added new school to state:', newSchool);
    console.log('Updated schoolsData:', [...schoolsData, newSchool]);
    
    resolve({ success: true });
  });
};


  const handleDeleteSchool = (id) => {
    if (window.confirm('Are you sure you want to delete this institution?')) {
      setLoading(true);
      
      // Find the school before deleting for activity log
      const deletedSchool = schoolsData.find(school => school.id === id);
      
      // Update state locally
      setSchoolsData(schoolsData.filter(school => school.id !== id));
      
      // Update stats
      setStats({
        ...stats,
        totalSchools: stats.totalSchools - 1
      });
      
      // Add to recent activities
      if (deletedSchool) {
        const newActivity = {
          id: Date.now(),
          title: 'Institution Deleted',
          description: `${deletedSchool.name} removed from the platform`,
          time: 'Just now',
          icon: '🏫'
        };
        setRecentActivities([newActivity, ...recentActivities]);
      }
      
      toast.success('Institution deleted successfully!');
      setLoading(false);
    }
  };
// Add this function to your AdminDashboard component
const handleAddReport = (reportData) => {
  return new Promise((resolve, reject) => {
    setLoading(true);
    
    try {
      // Create a new report with proper formatting
      const newReport = {
        id: Date.now(),
        title: reportData.title,
        category: reportData.category,
        author: 'Admin',
        createdAt: new Date().toISOString().split('T')[0],
        status: reportData.status || 'Draft',
        content: reportData.content || ''
      };
      
      // Add the new report to reportsData state
      setReportsData(prevReports => [...prevReports, newReport]);
      
      // Close the modal
      setShowAddReportModal(false);
      
      // Add to recent activities
      const newActivity = {
        id: Date.now(),
        title: 'New Report Created',
        description: `"${newReport.title}" report has been created`,
        time: 'Just now',
        icon: '📋'
      };
      setRecentActivities(prevActivities => [newActivity, ...prevActivities]);
      
      // Show success message
      toast.success('Report created successfully!');
      setLoading(false);
      resolve({ success: true });
    } catch (error) {
      console.error('Error creating report:', error);
      toast.error('Failed to create report. Please try again.');
      setLoading(false);
      reject({ success: false, error });
    }
  });
};
const handleAddGame = async (gameData) => {
  setLoading(true);
  
  try {
    let result;
    
    if (gameData.id) {
      // If editing, update existing simulation
      result = await simulationService.updateSimulation(gameData.id, gameData);
      
      // Create a properly formatted object from the result
      const updatedGame = {
        id: result.data._id || result.data.id,
        title: result.data.title,
        category: result.data.category || result.data.simulationType,
        difficulty: result.data.difficulty,
        targetGrade: result.data.targetGrade || result.data.grade,
        plays: result.data.plays || 0,
        status: result.data.status,
        rating: result.data.rating || 4.5,
        description: result.data.description,
        estimatedPlayTime: result.data.estimatedPlayTime || 30,
        learningObjectives: result.data.learningObjectives || ''
      };
      
      // Update local state (ensure we're creating a new array)
      setGamesData(prevGames => 
        prevGames.map(game => 
          (game.id === gameData.id || game._id === gameData.id) ? updatedGame : game
        )
      );
      
      // Also update simulations state
      setSimulations(prevSims => 
        prevSims.map(sim => 
          (sim.id === gameData.id || sim._id === gameData.id) ? updatedGame : sim
        )
      );
      
      toast.success('Simulation updated successfully!');
    } else {
      // If adding new, create new simulation
      result = await simulationService.createSimulation(gameData);
      
      // Create a properly formatted game object
      const newGame = {
        id: result.data._id || result.data.id || Date.now().toString(),
        title: result.data.title,
        category: result.data.category || result.data.simulationType || 'Mathematics',
        difficulty: result.data.difficulty || 'Beginner',
        targetGrade: result.data.targetGrade || result.data.grade || '6-8',
        plays: result.data.plays || 0,
        status: result.data.status || 'Active',
        rating: result.data.rating || 4.5,
        description: result.data.description || '',
        estimatedPlayTime: result.data.estimatedPlayTime || 30,
        learningObjectives: result.data.learningObjectives || ''
      };
      
      // Update state (ensure we're creating new arrays)
      setGamesData(prevGames => [...prevGames, newGame]);
      setSimulations(prevSims => [...prevSims, newGame]);
      
      // Update stats
      setStats(prevStats => ({
        ...prevStats,
        totalGames: prevStats.totalGames + 1
      }));
      
      toast.success('Simulation added successfully!');
      
      // Debug log
      console.log('Added new game:', newGame);
      console.log('Updated gamesData state:', [...gamesData, newGame]);
    }
    
    // Add to recent activities
    const newActivity = {
      id: Date.now(),
      title: gameData.id ? 'Simulation Updated' : 'New Simulation Added',
      description: `${result.data.title} ${gameData.id ? 'updated' : 'added'} to the platform`,
      time: 'Just now',
      icon: '🎮'
    };
    setRecentActivities(prevActivities => [newActivity, ...prevActivities]);
    
    // Close modal and reset selected game
    setShowAddGameModal(false);
    setSelectedGame(null);
    
    return result;
  } catch (error) {
    console.error('Error in handleAddGame:', error);
    toast.error('Failed to process simulation. Please try again.');
    throw error;
  } finally {
    setLoading(false);
  }
};
// Add handleDeleteGame right here
  const handleDeleteGame = (id) => {
    if (window.confirm('Are you sure you want to delete this simulation?')) {
      setLoading(true);
      
      // Find the game before deleting for activity log
      const deletedGame = gamesData.find(game => game.id === id || game._id === id);
      
      // Update state by filtering out the deleted game
      setGamesData(prev => prev.filter(game => (game.id !== id && game._id !== id)));
      setSimulations(prev => prev.filter(sim => (sim.id !== id && sim._id !== id)));
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalGames: prev.totalGames - 1
      }));
      
      // Add to recent activities
      if (deletedGame) {
        const newActivity = {
          id: Date.now(),
          title: 'Simulation Deleted',
          description: `${deletedGame.title || 'Simulation'} removed from the platform`,
          time: 'Just now',
          icon: '🎮'
        };
        setRecentActivities(prev => [newActivity, ...prev]);
      }
      
      toast.success('Simulation deleted successfully!');
      setLoading(false);
    }
  };
  // Add this function to your AdminDashboard component if it doesn't exist:
const handleAddQuestion = (questionData) => {
  return new Promise((resolve, reject) => {
    setLoading(true);
    
    try {
      // If it has an ID, it's an update
      if (questionData.id) {
        // Update locally
        const updatedQuestions = questionsData.map(q => 
          q.id === questionData.id ? {
            ...q,
            ...questionData
          } : q
        );
        
        setQuestionsData(updatedQuestions);
        
        // Add to recent activities
        const newActivity = {
          id: Date.now(),
          title: 'Question Updated',
          description: `Question for ${questionData.game} updated`,
          time: 'Just now',
          icon: '❓'
        };
        setRecentActivities(prevActivities => [newActivity, ...prevActivities]);
        
        toast.success('Question updated successfully!');
        setShowQuestionModal(false);
        setSelectedQuestion(null);
        setLoading(false);
        resolve({ success: true });
      } else {
        // It's a new question, add locally
        const newQuestion = {
          id: Date.now().toString(),
          ...questionData
        };
        
        setQuestionsData(prevQuestions => [...prevQuestions, newQuestion]);
        
        // Add to recent activities
        const newActivity = {
          id: Date.now(),
          title: 'New Question Added',
          description: `Question added to ${questionData.game}`,
          time: 'Just now',
          icon: '❓'
        };
        setRecentActivities(prevActivities => [newActivity, ...prevActivities]);
        
        toast.success('Question added successfully!');
        setShowQuestionModal(false);
        setSelectedQuestion(null);
        setLoading(false);
        resolve({ success: true });
      }
    } catch (error) {
      console.error('Error in handleAddQuestion:', error);
      toast.error('Failed to process question. Please try again.');
      setLoading(false);
      reject({ success: false, error });
    }
  });
};
  const handleDeleteQuestion = (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      setLoading(true);
      
      // Find the question before deleting for activity log
      const deletedQuestion = questionsData.find(question => question.id === id);
      
      // Update state
      setQuestionsData(questionsData.filter(question => question.id !== id));
      
      // Add to recent activities
      if (deletedQuestion) {
        const newActivity = {
          id: Date.now(),
          title: 'Question Deleted',
          description: `Question removed from ${deletedQuestion.game}`,
          time: 'Just now',
          icon: '❓'
        };
        setRecentActivities([newActivity, ...recentActivities]);
      }
      
      toast.success('Question deleted successfully!');
      setLoading(false);
    }
  };
// Add this function to your AdminDashboard component
const handleAddScore = (scoreData) => {
  return new Promise((resolve, reject) => {
    setLoading(true);
    
    try {
      // Create a new score with proper formatting
      const newScore = {
        id: Date.now(),
        student: scoreData.student,
        game: scoreData.game,
        score: parseInt(scoreData.score, 10),
        date: scoreData.date || new Date().toISOString().split('T')[0],
        time: scoreData.time || '30 min'
      };
      
      // Add the new score to scoresData state
      setScoresData(prevScores => [...prevScores, newScore]);
      
      // Close the modal
      setShowScoreModal(false);
      
      // Add to recent activities
      const newActivity = {
        id: Date.now(),
        title: 'New Score Submitted',
        description: `${newScore.student} scored ${newScore.score}% in ${newScore.game}`,
        time: 'Just now',
        icon: '📈'
      };
      setRecentActivities(prevActivities => [newActivity, ...prevActivities]);
      
      // Show success message
      toast.success('Score added successfully!');
      setLoading(false);
      resolve({ success: true });
    } catch (error) {
      console.error('Error adding score:', error);
      toast.error('Failed to add score. Please try again.');
      setLoading(false);
      reject({ success: false, error });
    }
  });
};
  // Additional handler for adding students
  const handleAddStudent = (studentData) => {
    return new Promise((resolve, reject) => {
      setLoading(true);
      
      try {
        const newStudent = {
          id: studentsData.length + 1,
          ...studentData,
          lastActive: 'Just now',
          performanceScore: 0,
          status: 'Active'
        };
        
        setStudentsData([...studentsData, newStudent]);
        setShowAddStudentModal(false);
        
        // Add to recent activities
        const schoolName = studentData.schoolName || 'Unknown School';
        
        const newActivity = {
          id: Date.now(),
          title: 'New Student Registration',
          description: `${studentData.name} joined ${schoolName}`,
          time: 'Just now',
          icon: '🎓'
        };
        setRecentActivities([newActivity, ...recentActivities]);
        
        // Update stats
        setStats({
          ...stats,
          totalStudents: stats.totalStudents + 1
        });
        
        toast.success('Student added successfully!');
        setLoading(false);
        resolve({ success: true });
      } catch (error) {
        console.error('Error adding student:', error);
        toast.error('Failed to add student. Please try again.');
        setLoading(false);
        reject({ success: false, error });
      }
    });
  };
  
  // Handlers for UI interactions
  const handleEditGame = (game) => {
    setSelectedGame(game);
    setShowAddGameModal(true);
  };
  // Tab-specific render functions
  // Tab-specific render functions
  const renderInstitutionsTab = () => (
    <div style={{ padding: '30px' }}>
      <h2 style={{
        color: '#ffffff',
        fontSize: '1.5rem',
        fontWeight: '700',
        margin: '0 0 5px 0',
        fontFamily: 'system-ui, sans-serif',
        letterSpacing: '1px'
      }}>
        INSTITUTIONS
      </h2>
      <p style={{
        color: '#8ab3c5',
        fontSize: '0.9rem',
        margin: '0 0 25px 0',
        fontFamily: 'system-ui, sans-serif'
      }}>
        Manage schools and educational institutions in the platform
      </p>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <div style={{ position: 'relative', width: '300px' }}>
          <input
            type="text"
            placeholder="Search institutions..."
            value={schoolSearchQuery}
            onChange={(e) => setSchoolSearchQuery(e.target.value)}
            style={{
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(0, 225, 255, 0.3)',
             borderRadius: '20px',
              padding: '10px 15px 10px 40px',
              color: '#fff',
              fontSize: '0.9rem',
              width: '100%',
              fontFamily: 'system-ui, sans-serif'
            }}
          />
          <div style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#8ab3c5',
            fontSize: '1rem'
          }}>
            {'🔍'}
          </div>
        </div>
        
        <button
          onClick={() => setShowAddSchoolModal(true)}
          style={{
            background: 'linear-gradient(135deg, #00e1ff, #00d0ff)',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 20px',
            color: '#051a2e',
            fontWeight: '600',
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontFamily: 'system-ui, sans-serif'
          }}
        >
          ADD INSTITUTION
        </button>
      </div>
      
      <div style={{
        background: 'rgba(5, 26, 46, 0.7)',
        backdropFilter: 'blur(10px)',
        borderRadius: '10px',
        border: '1px solid rgba(0, 225, 255, 0.3)',
        overflow: 'hidden'
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'separate',
          borderSpacing: '0',
          fontSize: '0.9rem',
          color: '#e3f8ff',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <thead>
            <tr>
              <th style={{
                padding: '15px 20px',
                textAlign: 'left',
                borderBottom: '1px solid rgba(0, 225, 255, 0.3)',
                color: '#8ab3c5',
                fontWeight: '600',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>Name</th>
              <th style={{
                padding: '15px 20px',
                textAlign: 'left',
                borderBottom: '1px solid rgba(0, 225, 255, 0.3)',
                color: '#8ab3c5',
                fontWeight: '600',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>Type</th>
              <th style={{
                padding: '15px 20px',
                textAlign: 'left',
                borderBottom: '1px solid rgba(0, 225, 255, 0.3)',
                color: '#8ab3c5',
                fontWeight: '600',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>Location</th>
              <th style={{
                padding: '15px 20px',
                textAlign: 'left',
                borderBottom: '1px solid rgba(0, 225, 255, 0.3)',
                color: '#8ab3c5',
                fontWeight: '600',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>Students</th>
              <th style={{
                padding: '15px 20px',
                textAlign: 'left',
                borderBottom: '1px solid rgba(0, 225, 255, 0.3)',
                color: '#8ab3c5',
                fontWeight: '600',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>Teachers</th>
              <th style={{
                padding: '15px 20px',
                textAlign: 'left',
                borderBottom: '1px solid rgba(0, 225, 255, 0.3)',
                color: '#8ab3c5',
                fontWeight: '600',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>Status</th>
              <th style={{
                padding: '15px 20px',
                textAlign: 'left',
                borderBottom: '1px solid rgba(0, 225, 255, 0.3)',
                color: '#8ab3c5',
                fontWeight: '600',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {schoolsData
              .filter(school => 
                !schoolSearchQuery || 
                school.name.toLowerCase().includes(schoolSearchQuery.toLowerCase()) ||
                school.type.toLowerCase().includes(schoolSearchQuery.toLowerCase()) ||
                school.location.toLowerCase().includes(schoolSearchQuery.toLowerCase())
              )
              .map((school) => (
                <tr 
                  key={school.id}
                  style={{
                    borderBottom: '1px solid rgba(0, 225, 255, 0.1)',
                    transition: 'background 0.3s ease',
                    '&:hover': {
                      background: 'rgba(0, 225, 255, 0.05)'
                    }
                  }}
                >
                  <td style={{ padding: '15px 20px', verticalAlign: 'middle' }}>{school.name}</td>
                  <td style={{ padding: '15px 20px', verticalAlign: 'middle' }}>{school.type}</td>
                  <td style={{ padding: '15px 20px', verticalAlign: 'middle' }}>{school.location}</td>
                  <td style={{ padding: '15px 20px', verticalAlign: 'middle' }}>{school.students}</td>
                  <td style={{ padding: '15px 20px', verticalAlign: 'middle' }}>{school.teachers}</td>
                  <td style={{ padding: '15px 20px', verticalAlign: 'middle' }}>
                    <StatusBadge status={school.status} />
                  </td>
                  <td style={{ padding: '15px 20px', verticalAlign: 'middle' }}>
                    <button
                      onClick={() => setSelectedSchool(school)}
                      style={{
                        marginRight: '10px',
                        padding: '6px 12px',
                        background: 'rgba(0, 225, 255, 0.1)',
                        border: '1px solid rgba(0, 225, 255, 0.3)',
                        borderRadius: '4px',
                        color: '#00e1ff',
                        fontWeight: '600',
                        fontSize: '0.7rem',
                        cursor: 'pointer',
                        fontFamily: 'system-ui, sans-serif'
                      }}
                    >
                      EDIT
                    </button>
                    <button
                      onClick={() => handleDeleteSchool(school.id)}
                      style={{
                        padding: '6px 12px',
                        background: 'rgba(255, 106, 136, 0.1)',
                        border: '1px solid rgba(255, 106, 136, 0.3)',
                        borderRadius: '4px',
                        color: '#ff6a88',
                        fontWeight: '600',
                        fontSize: '0.7rem',
                        cursor: 'pointer',
                        fontFamily: 'system-ui, sans-serif'
                      }}
                    >
                      DELETE
                    </button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
const renderSimulationsTab = () => (
  <div style={{ padding: '30px' }}>
    <h2 style={{
      color: '#ffffff',
      fontSize: '1.5rem',
      fontWeight: '700',
      margin: '0 0 5px 0',
      fontFamily: 'system-ui, sans-serif',
      letterSpacing: '1px'
    }}>
      SIMULATIONS
    </h2>
    <p style={{
      color: '#8ab3c5',
      fontSize: '0.9rem',
      margin: '0 0 25px 0',
      fontFamily: 'system-ui, sans-serif'
    }}>
      Manage educational games and simulations
    </p>
    
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      marginBottom: '20px'
    }}>
      <div style={{ position: 'relative', width: '300px' }}>
        <input
          type="text"
          placeholder="Search simulations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(0, 225, 255, 0.3)',
            borderRadius: '20px',
            padding: '10px 15px 10px 40px',
            color: '#fff',
            fontSize: '0.9rem',
            width: '100%',
            fontFamily: 'system-ui, sans-serif'
          }}
        />
        <div style={{
          position: 'absolute',
          left: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#8ab3c5',
          fontSize: '1rem'
        }}>
          {'🔍'}
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '10px' }}>
        <select
          value={selectedCategory || ''}
          onChange={(e) => setSelectedCategory(e.target.value || null)}
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(0, 225, 255, 0.3)',
            borderRadius: '6px',
            padding: '10px 15px',
            color: '#ffffff',
            fontSize: '0.9rem',
            fontFamily: 'system-ui, sans-serif',
            appearance: 'none'
          }}
        >
          <option value="">All Categories</option>
          <option value="Mathematics">Mathematics</option>
          <option value="Science">Science</option>
          <option value="History">History</option>
          <option value="Literature">Literature</option>
        </select>
        
        <button
          onClick={() => {
            setSelectedGame(null);
            setShowAddGameModal(true);
          }}
          style={{
            background: 'linear-gradient(135deg, #00e1ff, #00d0ff)',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 20px',
            color: '#051a2e',
            fontWeight: '600',
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontFamily: 'system-ui, sans-serif'
          }}
        >
          ADD SIMULATION
        </button>
      </div>
    </div>
    
    <div style={{
      background: 'rgba(5, 26, 46, 0.7)',
      backdropFilter: 'blur(10px)',
      borderRadius: '10px',
      border: '1px solid rgba(0, 225, 255, 0.3)',
      overflow: 'hidden'
    }}>
      <table style={{
        width: '100%',
        borderCollapse: 'separate',
        borderSpacing: '0',
        fontSize: '0.9rem',
        color: '#e3f8ff',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <thead>
          <tr>
            <th style={{
              padding: '15px 20px',
              textAlign: 'left',
              borderBottom: '1px solid rgba(0, 225, 255, 0.3)',
              color: '#8ab3c5',
              fontWeight: '600',
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>TITLE</th>
            <th style={{
              padding: '15px 20px',
              textAlign: 'left',
              borderBottom: '1px solid rgba(0, 225, 255, 0.3)',
              color: '#8ab3c5',
              fontWeight: '600',
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>CATEGORY</th>
            <th style={{
              padding: '15px 20px',
              textAlign: 'left',
              borderBottom: '1px solid rgba(0, 225, 255, 0.3)',
              color: '#8ab3c5',
              fontWeight: '600',
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>DIFFICULTY</th>
            <th style={{
              padding: '15px 20px',
              textAlign: 'left',
              borderBottom: '1px solid rgba(0, 225, 255, 0.3)',
              color: '#8ab3c5',
              fontWeight: '600',
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>TARGET GRADE</th>
            <th style={{
              padding: '15px 20px',
              textAlign: 'left',
              borderBottom: '1px solid rgba(0, 225, 255, 0.3)',
              color: '#8ab3c5',
              fontWeight: '600',
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>PLAYS</th>
            <th style={{
              padding: '15px 20px',
              textAlign: 'left',
              borderBottom: '1px solid rgba(0, 225, 255, 0.3)',
              color: '#8ab3c5',
              fontWeight: '600',
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>STATUS</th>
            <th style={{
              padding: '15px 20px',
              textAlign: 'left',
              borderBottom: '1px solid rgba(0, 225, 255, 0.3)',
              color: '#8ab3c5',
              fontWeight: '600',
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {/* Debug output when no data */}
          {(!gamesData || gamesData.length === 0) && (
            <tr>
              <td colSpan={7} style={{textAlign: 'center', padding: '20px'}}>
                No simulations found. Click "ADD SIMULATION" to create one.
              </td>
            </tr>
          )}
          
          {/* Map through the data when available */}
          {gamesData && gamesData.length > 0 && 
            gamesData
              .filter(game => 
                (!searchQuery || 
                 (game.title && game.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
                 (game.description && game.description.toLowerCase().includes(searchQuery.toLowerCase()))) &&
                (!selectedCategory || 
                 game.category === selectedCategory || 
                 game.simulationType === selectedCategory)
              )
              .map((game) => (
                <tr 
                  key={game._id || game.id}
                  style={{
                    borderBottom: '1px solid rgba(0, 225, 255, 0.1)',
                    transition: 'background 0.3s ease',
                  }}
                >
                  <td style={{ padding: '15px 20px', verticalAlign: 'middle' }}>{game.title}</td>
                  <td style={{ padding: '15px 20px', verticalAlign: 'middle' }}>
                    {game.category || game.simulationType || 'General'}
                  </td>
                  <td style={{ padding: '15px 20px', verticalAlign: 'middle' }}>
                    <StatusBadge status={game.difficulty || 'Beginner'} />
                  </td>
                  <td style={{ padding: '15px 20px', verticalAlign: 'middle' }}>
                    {game.targetGrade || game.grade || 'All Grades'}
                  </td>
                  <td style={{ padding: '15px 20px', verticalAlign: 'middle' }}>
                    {(game.plays || 0).toLocaleString()}
                  </td>
                  <td style={{ padding: '15px 20px', verticalAlign: 'middle' }}>
                    <StatusBadge status={game.status || 'Active'} />
                  </td>
                  <td style={{ padding: '15px 20px', verticalAlign: 'middle' }}>
                    <button
                      onClick={() => handleEditGame(game)}
                      style={{
                        marginRight: '10px',
                        padding: '6px 12px',
                        background: 'rgba(0, 225, 255, 0.1)',
                        border: '1px solid rgba(0, 225, 255, 0.3)',
                        borderRadius: '4px',
                        color: '#00e1ff',
                        fontWeight: '600',
                        fontSize: '0.7rem',
                        cursor: 'pointer',
                        fontFamily: 'system-ui, sans-serif'
                      }}
                    >
                      EDIT
                    </button>
                    <button
                      onClick={() => handleDeleteGame(game._id || game.id)}
                      style={{
                        padding: '6px 12px',
                        background: 'rgba(255, 106, 136, 0.1)',
                        border: '1px solid rgba(255, 106, 136, 0.3)',
                        borderRadius: '4px',
                        color: '#ff6a88',
                        fontWeight: '600',
                        fontSize: '0.7rem',
                        cursor: 'pointer',
                        fontFamily: 'system-ui, sans-serif'
                      }}
                    >
                      DELETE
                    </button>
                  </td>
                </tr>
              ))
          }
        </tbody>
      </table>
    </div>
  </div>
);
  // Scores tab
  const renderScoresTab = () => (
    <div style={{ padding: '30px' }}>
      <h2 style={{
        color: '#ffffff',
        fontSize: '1.5rem',
        fontWeight: '700',
        margin: '0 0 5px 0',
        fontFamily: 'system-ui, sans-serif',
        letterSpacing: '1px'
      }}>
        SCORE MANAGEMENT
      </h2>
      <p style={{
        color: '#8ab3c5',
        fontSize: '0.9rem',
        margin: '0 0 25px 0',
        fontFamily: 'system-ui, sans-serif'
      }}>
        Track and manage student performance scores
      </p>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <div style={{ position: 'relative', width: '300px' }}>
          <input
            type="text"
            placeholder="Search scores..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(0, 225, 255, 0.3)',
              borderRadius: '20px',
              padding: '10px 15px 10px 40px',
              color: '#fff',
              fontSize: '0.9rem',
              width: '100%',
              fontFamily: 'system-ui, sans-serif'
            }}
          />
          <div style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#8ab3c5',
            fontSize: '1rem'
          }}>
            {'🔍'}
          </div>
        </div>
        
        <button
          onClick={() => setShowScoreModal(true)}
          style={{
            background: 'linear-gradient(135deg, #00e1ff, #00d0ff)',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 20px',
            color: '#051a2e',
            fontWeight: '600',
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontFamily: 'system-ui, sans-serif'
          }}
        >
          ADD SCORE
        </button>
      </div>
      
      <div style={{
        background: 'rgba(5, 26, 46, 0.7)',
        backdropFilter: 'blur(10px)',
        borderRadius: '10px',
        border: '1px solid rgba(0, 225, 255, 0.3)',
        overflow: 'hidden'
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'separate',
          borderSpacing: '0',
          fontSize: '0.9rem',
          color: '#e3f8ff',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <thead>
            <tr>
              <th style={{
                padding: '15px 20px',
                textAlign: 'left',
                borderBottom: '1px solid rgba(0, 225, 255, 0.3)',
                color: '#8ab3c5',
                fontWeight: '600',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>Student</th>
              <th style={{
                padding: '15px 20px',
                textAlign: 'left',
                borderBottom: '1px solid rgba(0, 225, 255, 0.3)',
                color: '#8ab3c5',
                fontWeight: '600',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>Simulation</th>
              <th style={{
                padding: '15px 20px',
                textAlign: 'left',
                borderBottom: '1px solid rgba(0, 225, 255, 0.3)',
                color: '#8ab3c5',
                fontWeight: '600',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>Score</th>
              <th style={{
                padding: '15px 20px',
                textAlign: 'left',
                borderBottom: '1px solid rgba(0, 225, 255, 0.3)',
                color: '#8ab3c5',
                fontWeight: '600',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>Date</th>
              <th style={{
                padding: '15px 20px',
                textAlign: 'left',
                borderBottom: '1px solid rgba(0, 225, 255, 0.3)',
                color: '#8ab3c5',
                fontWeight: '600',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>Time Spent</th>
              <th style={{
                padding: '15px 20px',
                textAlign: 'left',
                borderBottom: '1px solid rgba(0, 225, 255, 0.3)',
                color: '#8ab3c5',
                fontWeight: '600',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {scoresData
              .filter(score => 
                !searchQuery || 
                score.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
                score.game.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((score) => (
                <tr 
                  key={score.id}
                  style={{
                    borderBottom: '1px solid rgba(0, 225, 255, 0.1)',
                    transition: 'background 0.3s ease',
                    '&:hover': {
                      background: 'rgba(0, 225, 255, 0.05)'
                    }
                  }}
                >
                  <td style={{ padding: '15px 20px', verticalAlign: 'middle' }}>{score.student}</td>
                  <td style={{ padding: '15px 20px', verticalAlign: 'middle' }}>{score.game}</td>
                  <td style={{ padding: '15px 20px', verticalAlign: 'middle' }}>
                    <div style={{
                      color: score.score >= 90 ? '#15ffaa' : 
                             score.score >= 70 ? '#ffd36a' : '#ff6a88',
                      fontWeight: '600'
                    }}>
                      {score.score}%
                    </div>
                  </td>
                  <td style={{ padding: '15px 20px', verticalAlign: 'middle' }}>{score.date}</td>
                  <td style={{ padding: '15px 20px', verticalAlign: 'middle' }}>{score.time}</td>
                  <td style={{ padding: '15px 20px', verticalAlign: 'middle' }}>
                    <button
                      onClick={() => setSelectedScore(score)}
                      style={{
                        marginRight: '10px',
                        padding: '6px 12px',
                        background: 'rgba(0, 225, 255, 0.1)',
                        border: '1px solid rgba(0, 225, 255, 0.3)',
                        borderRadius: '4px',
                        color: '#00e1ff',
                        fontWeight: '600',
                        fontSize: '0.7rem',
                        cursor: 'pointer',
                        fontFamily: 'system-ui, sans-serif'
                      }}
                    >
                      EDIT
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this score record?')) {
                          setScoresData(scoresData.filter(s => s.id !== score.id));
                          toast.success('Score deleted successfully!');
                        }
                      }}
                      style={{
                        padding: '6px 12px',
                        background: 'rgba(255, 106, 136, 0.1)',
                        border: '1px solid rgba(255, 106, 136, 0.3)',
                        borderRadius: '4px',
                        color: '#ff6a88',
                        fontWeight: '600',
                        fontSize: '0.7rem',
                        cursor: 'pointer',
                        fontFamily: 'system-ui, sans-serif'
                      }}
                    >
                      DELETE
                    </button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
  // Questions tab
  const renderQuestionsTab = () => (
    <div style={{ padding: '30px' }}>
      <h2 style={{
        color: '#ffffff',
        fontSize: '1.5rem',
        fontWeight: '700',
        margin: '0 0 5px 0',
        fontFamily: 'system-ui, sans-serif',
        letterSpacing: '1px'
      }}>
        QUESTION OVERSIGHT
      </h2>
      <p style={{
        color: '#8ab3c5',
        fontSize: '0.9rem',
        margin: '0 0 25px 0',
        fontFamily: 'system-ui, sans-serif'
      }}>
        Manage simulation questions and assessments
      </p>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <div style={{ position: 'relative', width: '300px' }}>
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(0, 225, 255, 0.3)',
              borderRadius: '20px',
              padding: '10px 15px 10px 40px',
              color: '#fff',
              fontSize: '0.9rem',
              width: '100%',
              fontFamily: 'system-ui, sans-serif'
            }}
          />
          <div style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#8ab3c5',
            fontSize: '1rem'
          }}>
            {'🔍'}
          </div>
        </div>
        
        <button
          onClick={() => {
            setSelectedQuestion(null);
            setShowQuestionModal(true);
          }}
          style={{
            background: 'linear-gradient(135deg, #00e1ff, #00d0ff)',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 20px',
            color: '#051a2e',
            fontWeight: '600',
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontFamily: 'system-ui, sans-serif'
          }}
        >
          ADD QUESTION
        </button>
      </div>
      
      <div style={{
        background: 'rgba(5, 26, 46, 0.7)',
        backdropFilter: 'blur(10px)',
        borderRadius: '10px',
        border: '1px solid rgba(0, 225, 255, 0.3)',
        overflow: 'hidden'
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'separate',
          borderSpacing: '0',
          fontSize: '0.9rem',
          color: '#e3f8ff',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <thead>
            <tr>
              <th style={{
                padding: '15px 20px',
                textAlign: 'left',
                borderBottom: '1px solid rgba(0, 225, 255, 0.3)',
                color: '#8ab3c5',
                fontWeight: '600',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>Simulation</th>
              <th style={{
                padding: '15px 20px',
                textAlign: 'left',
                borderBottom: '1px solid rgba(0, 225, 255, 0.3)',
                color: '#8ab3c5',
                fontWeight: '600',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                width: '40%'
              }}>Question</th>
              <th style={{
                padding: '15px 20px',
                textAlign: 'left',
                borderBottom: '1px solid rgba(0, 225, 255, 0.3)',
                color: '#8ab3c5',
                fontWeight: '600',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>Type</th>
              <th style={{
                padding: '15px 20px',
                textAlign: 'left',
                borderBottom: '1px solid rgba(0, 225, 255, 0.3)',
                color: '#8ab3c5',
                fontWeight: '600',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>Difficulty</th>
              <th style={{
                padding: '15px 20px',
                textAlign: 'left',
                borderBottom: '1px solid rgba(0, 225, 255, 0.3)',
                color: '#8ab3c5',
                fontWeight: '600',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {questionsData
              .filter(question => 
                !searchQuery || 
                question.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                question.game.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((question) => (
                <tr 
                  key={question.id}
                  style={{
                    borderBottom: '1px solid rgba(0, 225, 255, 0.1)',
                    transition: 'background 0.3s ease',
                    '&:hover': {
                      background: 'rgba(0, 225, 255, 0.05)'
                    }
                  }}
                >
                  <td style={{ padding: '15px 20px', verticalAlign: 'middle' }}>{question.game}</td>
                  <td style={{ 
                    padding: '15px 20px', 
                    verticalAlign: 'middle',
                    maxWidth: '300px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {question.question}
                  </td>
                  <td style={{ padding: '15px 20px', verticalAlign: 'middle' }}>{question.type}</td>
                  <td style={{ padding: '15px 20px', verticalAlign: 'middle' }}>
                    <StatusBadge status={question.difficulty} />
                  </td>
                  <td style={{ padding: '15px 20px', verticalAlign: 'middle' }}>
                    <button
                      onClick={() => {
                        setSelectedQuestion(question);
                        setShowQuestionModal(true);
                      }}
                      style={{
                        marginRight: '10px',
                        padding: '6px 12px',
                        background: 'rgba(0, 225, 255, 0.1)',
                        border: '1px solid rgba(0, 225, 255, 0.3)',
                        borderRadius: '4px',
                        color: '#00e1ff',
                        fontWeight: '600',
                        fontSize: '0.7rem',
                        cursor: 'pointer',
                        fontFamily: 'system-ui, sans-serif'
                      }}
                    >
                      EDIT
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(question.id)}
                      style={{
                        padding: '6px 12px',
                        background: 'rgba(255, 106, 136, 0.1)',
                        border: '1px solid rgba(255, 106, 136, 0.3)',
                        borderRadius: '4px',
                        color: '#ff6a88',
                        fontWeight: '600',
                        fontSize: '0.7rem',
                        cursor: 'pointer',
                        fontFamily: 'system-ui, sans-serif'
                      }}
                    >
                      DELETE
                    </button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
  // Reports tab
  const renderReportsTab = () => (
    <div style={{ padding: '30px' }}>
      <h2 style={{
        color: '#ffffff',
        fontSize: '1.5rem',
        fontWeight: '700',
        margin: '0 0 5px 0',
        fontFamily: 'system-ui, sans-serif',
        letterSpacing: '1px'
      }}>
        REPORTS
      </h2>
      <p style={{
        color: '#8ab3c5',
        fontSize: '0.9rem',
        margin: '0 0 25px 0',
        fontFamily: 'system-ui, sans-serif'
      }}>
        Generate and manage analytical reports
      </p>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <div style={{ position: 'relative', width: '300px' }}>
          <input
            type="text"
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(0, 225, 255, 0.3)',
              borderRadius: '20px',
              padding: '10px 15px 10px 40px',
              color: '#fff',
              fontSize: '0.9rem',
              width: '100%',
              fontFamily: 'system-ui, sans-serif'
            }}
          />
          <div style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#8ab3c5',
            fontSize: '1rem'
          }}>
            {'🔍'}
          </div>
        </div>
        
        <button
          onClick={() => setShowAddReportModal(true)}
          style={{
            background: 'linear-gradient(135deg, #00e1ff, #00d0ff)',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 20px',
            color: '#051a2e',
            fontWeight: '600',
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontFamily: 'system-ui, sans-serif'
          }}
        >
          CREATE REPORT
        </button>
      </div>
      
      <div style={{
        background: 'rgba(5, 26, 46, 0.7)',
        backdropFilter: 'blur(10px)',
        borderRadius: '10px',
        border: '1px solid rgba(0, 225, 255, 0.3)',
        overflow: 'hidden'
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'separate',
          borderSpacing: '0',
          fontSize: '0.9rem',
          color: '#e3f8ff',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <thead>
            <tr>
              <th style={{
                padding: '15px 20px',
                textAlign: 'left',
                borderBottom: '1px solid rgba(0, 225, 255, 0.3)',
                color: '#8ab3c5',
                fontWeight: '600',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>Title</th>
              <th style={{
                padding: '15px 20px',
                textAlign: 'left',
                borderBottom: '1px solid rgba(0, 225, 255, 0.3)',
                color: '#8ab3c5',
                fontWeight: '600',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>Category</th>
              <th style={{
                padding: '15px 20px',
                textAlign: 'left',
                borderBottom: '1px solid rgba(0, 225, 255, 0.3)',
                color: '#8ab3c5',
                fontWeight: '600',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>Author</th>
              <th style={{
                padding: '15px 20px',
                textAlign: 'left',
                borderBottom: '1px solid rgba(0, 225, 255, 0.3)',
                color: '#8ab3c5',
                fontWeight: '600',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>Date Created</th>
              <th style={{
                padding: '15px 20px',
                textAlign: 'left',
                borderBottom: '1px solid rgba(0, 225, 255, 0.3)',
                color: '#8ab3c5',
                fontWeight: '600',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>Status</th>
              <th style={{
                padding: '15px 20px',
                textAlign: 'left',
                borderBottom: '1px solid rgba(0, 225, 255, 0.3)',
                color: '#8ab3c5',
                fontWeight: '600',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reportsData
              .filter(report => 
                !searchQuery || 
                report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                report.category.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((report) => (
                <tr 
                  key={report.id}
                  style={{
                    borderBottom: '1px solid rgba(0, 225, 255, 0.1)',
                    transition: 'background 0.3s ease',
                    '&:hover': {
                      background: 'rgba(0, 225, 255, 0.05)'
                    }
                  }}
                >
                  <td style={{ padding: '15px 20px', verticalAlign: 'middle' }}>{report.title}</td>
                  <td style={{ padding: '15px 20px', verticalAlign: 'middle' }}>{report.category}</td>
                  <td style={{ padding: '15px 20px', verticalAlign: 'middle' }}>{report.author}</td>
                  <td style={{ padding: '15px 20px', verticalAlign: 'middle' }}>{report.createdAt}</td>
                  <td style={{ padding: '15px 20px', verticalAlign: 'middle' }}>
                    <StatusBadge status={report.status} />
                  </td>
                  <td style={{ padding: '15px 20px', verticalAlign: 'middle' }}>
                    <button
                      onClick={() => setSelectedReport(report)}
                      style={{
                        marginRight: '10px',
                        padding: '6px 12px',
                        background: 'rgba(0, 225, 255, 0.1)',
                        border: '1px solid rgba(0, 225, 255, 0.3)',
                        borderRadius: '4px',
                        color: '#00e1ff',
                        fontWeight: '600',
                        fontSize: '0.7rem',
                        cursor: 'pointer',
                        fontFamily: 'system-ui, sans-serif'
                      }}
                    >
                      EDIT
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this report?')) {
                          setReportsData(reportsData.filter(r => r.id !== report.id));
                          toast.success('Report deleted successfully!');
                        }
                      }}
                      style={{
                        padding: '6px 12px',
                        background: 'rgba(255, 106, 136, 0.1)',
                        border: '1px solid rgba(255, 106, 136, 0.3)',
                        borderRadius: '4px',
                        color: '#ff6a88',
                        fontWeight: '600',
                        fontSize: '0.7rem',
                        cursor: 'pointer',
                        fontFamily: 'system-ui, sans-serif'
                      }}
                    >
                      DELETE
                    </button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
  // Analytics tab
  const renderAnalyticsTab = () => (
    <div style={{ padding: '30px' }}>
      <h2 style={{
        color: '#ffffff',
        fontSize: '1.5rem',
        fontWeight: '700',
        margin: '0 0 5px 0',
        fontFamily: 'system-ui, sans-serif',
        letterSpacing: '1px'
      }}>
        DATA ANALYSIS
      </h2>
      <p style={{
        color: '#8ab3c5',
        fontSize: '0.9rem',
        margin: '0 0 25px 0',
        fontFamily: 'system-ui, sans-serif'
      }}>
        Analyze platform performance and user engagement
      </p>
      
      {/* Student Progress Chart */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          background: 'rgba(5, 26, 46, 0.7)',
          backdropFilter: 'blur(10px)',
          borderRadius: '10px',
          border: '1px solid rgba(0, 225, 255, 0.3)',
          padding: '20px',
          height: '300px'
        }}>
          <h3 style={{
            color: '#ffffff',
            fontSize: '1.1rem',
            fontWeight: '600',
            margin: '0 0 20px 0'
          }}>
            STUDENT PROGRESS
          </h3>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '220px',
            justifyContent: 'flex-end'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              height: '180px',
              justifyContent: 'space-between',
              paddingLeft: '20px'
            }}>
              {analyticsData.studentProgress.map((item, index) => (
                <div key={index} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '40px'
                }}>
                  <div style={{
                    width: '30px',
                    background: `linear-gradient(180deg, #00e1ff, #15ffaa)`,
                    height: `${item.avgScore * 1.5}px`,
                    borderRadius: '3px 3px 0 0'
                  }}></div>
                  <div style={{
                    color: '#8ab3c5',
                    fontSize: '0.7rem',
                    marginTop: '5px'
                  }}>
                    {item.month}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Game Usage Chart */}
        <div style={{
          background: 'rgba(5, 26, 46, 0.7)',
          backdropFilter: 'blur(10px)',
          borderRadius: '10px',
          border: '1px solid rgba(0, 225, 255, 0.3)',
          padding: '20px',
          height: '300px'
        }}>
          <h3 style={{
            color: '#ffffff',
            fontSize: '1.1rem',
            fontWeight: '600',
            margin: '0 0 20px 0'
          }}>
            SIMULATION USAGE
          </h3>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            marginTop: '20px'
          }}>
            {analyticsData.gameUsage.map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '5px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{
                    color: '#e3f8ff',
                    fontSize: '0.8rem'
                  }}>
                    {item.game}
                  </span>
                  <span style={{
                    color: '#00e1ff',
                    fontSize: '0.8rem',
                    fontWeight: '600'
                  }}>
                    {item.sessions.toLocaleString()}
                  </span>
                </div>
                <div style={{
                  width: '100%',
                  height: '6px',
                  background: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${(item.sessions / 15000) * 100}%`,
                    background: 'linear-gradient(90deg, #00e1ff, #15ffaa)',
                    borderRadius: '3px'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* School Performance Table */}
      <div style={{
        background: 'rgba(5, 26, 46, 0.7)',
        backdropFilter: 'blur(10px)',
        borderRadius: '10px',
        border: '1px solid rgba(0, 225, 255, 0.3)',
        padding: '20px',
        marginBottom: '30px'
      }}>
        <h3 style={{
          color: '#ffffff',
          fontSize: '1.1rem',
          fontWeight: '600',
          margin: '0 0 20px 0'
        }}>
          SCHOOL PERFORMANCE
        </h3>
        <table style={{
          width: '100%',
          borderCollapse: 'separate',
          borderSpacing: '0 10px'
        }}>
          <thead>
            <tr>
              <th style={{
                textAlign: 'left',
                color: '#8ab3c5',
                fontSize: '0.8rem',
                fontWeight: '600',
                padding: '10px 0'
              }}>School</th>
              <th style={{
                textAlign: 'left',
                color: '#8ab3c5',
                fontSize: '0.8rem',
                fontWeight: '600',
                padding: '10px 0'
              }}>Average Score</th>
              <th style={{
                textAlign: 'left',
                color: '#8ab3c5',
                fontSize: '0.8rem',
                fontWeight: '600',
                padding: '10px 0'
              }}>Performance</th>
            </tr>
          </thead>
          <tbody>
            {analyticsData.schoolPerformance.map((item, index) => (
              <tr key={index}>
                <td style={{
                  color: '#e3f8ff',
                  fontSize: '0.9rem',
                  padding: '10px 0'
                }}>{item.school}</td>
                <td style={{
                  color: '#e3f8ff',
                  fontSize: '0.9rem',
                  padding: '10px 0'
                }}>{item.avgScore}%</td>
                <td style={{
                  padding: '10px 0'
                }}>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${item.avgScore}%`,
                      background: item.avgScore >= 85 ? 'linear-gradient(90deg, #15ffaa, #00e1ff)' : 
                                item.avgScore >= 75 ? 'linear-gradient(90deg, #ffd36a, #ffaa6a)' : 
                                'linear-gradient(90deg, #ff6a88, #ff8c6a)',
                      borderRadius: '4px'
                    }}></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Export Buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '15px'
      }}>
        <button style={{
          background: 'rgba(0, 225, 255, 0.1)',
          border: '1px solid rgba(0, 225, 255, 0.3)',
          borderRadius: '6px',
          padding: '12px 20px',
          color: '#00e1ff',
          fontWeight: '600',
          fontSize: '0.9rem',
          cursor: 'pointer',
          fontFamily: 'system-ui, sans-serif'
        }}>
          EXPORT TO PDF
        </button>
        <button style={{
          background: 'rgba(0, 225, 255, 0.1)',
          border: '1px solid rgba(0, 225, 255, 0.3)',
          borderRadius: '6px',
          padding: '12px 20px',
          color: '#00e1ff',
          fontWeight: '600',
          fontSize: '0.9rem',
          cursor: 'pointer',
          fontFamily: 'system-ui, sans-serif'
        }}>
          EXPORT TO CSV
        </button>
      </div>
    </div>
  );
  // Settings tab
  const renderSettingsTab = () => (
    <div style={{ padding: '30px' }}>
      <h2 style={{
        color: '#ffffff',
        fontSize: '1.5rem',
        fontWeight: '700',
        margin: '0 0 5px 0',
        fontFamily: 'system-ui, sans-serif',
        letterSpacing: '1px'
      }}>
        SYSTEM CONFIG
      </h2>
      <p style={{
        color: '#8ab3c5',
        fontSize: '0.9rem',
        margin: '0 0 25px 0',
        fontFamily: 'system-ui, sans-serif'
      }}>
        Customize platform settings and preferences
      </p>
      
      <div style={{
        background: 'rgba(5, 26, 46, 0.7)',
        backdropFilter: 'blur(10px)',
        borderRadius: '10px',
        border: '1px solid rgba(0, 225, 255, 0.3)',
        padding: '25px',
        marginBottom: '30px'
      }}>
        <h3 style={{
          color: '#ffffff',
          fontSize: '1.1rem',
          fontWeight: '600',
          margin: '0 0 20px 0'
        }}>
          GENERAL SETTINGS
        </h3>
        
        {/* Toggle switches for system settings */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px'
        }}>
          {/* Notification Settings */}
          <div style={{
            marginBottom: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '15px'
            }}>
              <label style={{
                color: '#b8e0f0',
                fontSize: '0.85rem',
                fontWeight: '600',
                fontFamily: 'system-ui, sans-serif'
              }}>
                Email Notifications
              </label>
              <div 
                onClick={() => setSystemSettings({...systemSettings, notifications: !systemSettings.notifications})}
                style={{
                  position: 'relative',
                  width: '46px',
                  height: '24px',
                  background: systemSettings.notifications ? 'linear-gradient(135deg, #00e1ff, #15ffaa)' : 'rgba(138, 179, 197, 0.3)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <div 
                  style={{
                    position: 'absolute',
                    top: '2px',
                    left: systemSettings.notifications ? '24px' : '2px',
                    width: '20px',
                    height: '20px',
                    background: '#ffffff',
                    borderRadius: '50%',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.2)'
                  }}
                />
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '15px'
            }}>
              <label style={{
                color: '#b8e0f0',
                fontSize: '0.85rem',
                fontWeight: '600',
                fontFamily: 'system-ui, sans-serif'
              }}>
                Automated Data Backup
              </label>
              <div 
                onClick={() => setSystemSettings({...systemSettings, dataBackup: !systemSettings.dataBackup})}
                style={{
                  position: 'relative',
                  width: '46px',
                  height: '24px',
                  background: systemSettings.dataBackup ? 'linear-gradient(135deg, #00e1ff, #15ffaa)' : 'rgba(138, 179, 197, 0.3)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <div 
                  style={{
                    position: 'absolute',
                    top: '2px',
                    left: systemSettings.dataBackup ? '24px' : '2px',
                    width: '20px',
                    height: '20px',
                    background: '#ffffff',
                    borderRadius: '50%',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.2)'
                  }}
                />
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '15px'
            }}>
              <label style={{
                color: '#b8e0f0',
                fontSize: '0.85rem',
                fontWeight: '600',
                fontFamily: 'system-ui, sans-serif'
              }}>
                Analytics Tracking
              </label>
              <div 
                onClick={() => setSystemSettings({...systemSettings, analyticsTracking: !systemSettings.analyticsTracking})}
                style={{
                  position: 'relative',
                  width: '46px',
                  height: '24px',
                  background: systemSettings.analyticsTracking ? 'linear-gradient(135deg, #00e1ff, #15ffaa)' : 'rgba(138, 179, 197, 0.3)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <div 
                  style={{
                    position: 'absolute',
                    top: '2px',
                    left: systemSettings.analyticsTracking ? '24px' : '2px',
                    width: '20px',
                    height: '20px',
                    background: '#ffffff',
                    borderRadius: '50%',
                    transition: 'all 0.3s ease',
                  boxShadow: '0 1px 4px rgba(0, 0, 0, 0.2)'
                  }}
                />
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '15px'
            }}>
              <label style={{
                color: '#b8e0f0',
                fontSize: '0.85rem',
                fontWeight: '600',
                fontFamily: 'system-ui, sans-serif'
              }}>
                Dark Mode
              </label>
              <div 
                onClick={() => setSystemSettings({...systemSettings, darkMode: !systemSettings.darkMode})}
                style={{
                  position: 'relative',
                  width: '46px',
                  height: '24px',
                  background: systemSettings.darkMode ? 'linear-gradient(135deg, #00e1ff, #15ffaa)' : 'rgba(138, 179, 197, 0.3)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <div 
                  style={{
                    position: 'absolute',
                    top: '2px',
                    left: systemSettings.darkMode ? '24px' : '2px',
                    width: '20px',
                    height: '20px',
                    background: '#ffffff',
                    borderRadius: '50%',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.2)'
                  }}
                />
              </div>
            </div>
          </div>
          
          {/* Other Settings */}
          <div>
            <div style={{
              marginBottom: '20px'
            }}>
              <label style={{
                display: 'block',
                color: '#b8e0f0',
                fontSize: '0.85rem',
                fontWeight: '600',
                marginBottom: '8px',
                fontFamily: 'system-ui, sans-serif'
              }}>
                Auto Logout (minutes)
              </label>
              <select 
                value={systemSettings.autoLogout}
                onChange={(e) => setSystemSettings({...systemSettings, autoLogout: parseInt(e.target.value)})}
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(0, 225, 255, 0.3)',
                  borderRadius: '6px',
                  padding: '10px 15px',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  fontFamily: 'system-ui, sans-serif',
                  appearance: 'none'
                }}
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>60 minutes</option>
                <option value={120}>120 minutes</option>
              </select>
            </div>
            
            <div style={{
              marginBottom: '20px'
            }}>
              <label style={{
                display: 'block',
                color: '#b8e0f0',
                fontSize: '0.85rem',
                fontWeight: '600',
                marginBottom: '8px',
                fontFamily: 'system-ui, sans-serif'
              }}>
                Language
              </label>
              <select 
                value={systemSettings.language}
                onChange={(e) => setSystemSettings({...systemSettings, language: e.target.value})}
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(0, 225, 255, 0.3)',
                  borderRadius: '6px',
                  padding: '10px 15px',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  fontFamily: 'system-ui, sans-serif',
                  appearance: 'none'
                }}
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
              </select>
            </div>
            
            <div style={{
              marginBottom: '20px'
            }}>
              <label style={{
                display: 'block',
                color: '#b8e0f0',
                fontSize: '0.85rem',
                fontWeight: '600',
                marginBottom: '8px',
                fontFamily: 'system-ui, sans-serif'
              }}>
                Timezone
              </label>
              <select 
                value={systemSettings.timezone}
                onChange={(e) => setSystemSettings({...systemSettings, timezone: e.target.value})}
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(0, 225, 255, 0.3)',
                  borderRadius: '6px',
                  padding: '10px 15px',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  fontFamily: 'system-ui, sans-serif',
                  appearance: 'none'
                }}
              >
                <option value="UTC-8">Pacific Time (UTC-8)</option>
                <option value="UTC-7">Mountain Time (UTC-7)</option>
                <option value="UTC-6">Central Time (UTC-6)</option>
                <option value="UTC-5">Eastern Time (UTC-5)</option>
                <option value="UTC+0">Greenwich Mean Time (UTC+0)</option>
                <option value="UTC+1">Central European Time (UTC+1)</option>
              </select>
            </div>
          </div>
        </div>
        
        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: 'rgba(255, 106, 136, 0.1)',
          border: '1px solid rgba(255, 106, 136, 0.3)',
          borderRadius: '8px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '10px'
          }}>
            <label style={{
              color: '#ff6a88',
              fontSize: '0.9rem',
              fontWeight: '600',
              fontFamily: 'system-ui, sans-serif'
            }}>
              Maintenance Mode
            </label>
            <div 
              onClick={() => setSystemSettings({...systemSettings, maintenanceMode: !systemSettings.maintenanceMode})}
              style={{
                position: 'relative',
                width: '46px',
                height: '24px',
                background: systemSettings.maintenanceMode ? 'linear-gradient(135deg, #ff6a88, #ff8c6a)' : 'rgba(138, 179, 197, 0.3)',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <div 
                style={{
                  position: 'absolute',
                  top: '2px',
                  left: systemSettings.maintenanceMode ? '24px' : '2px',
                  width: '20px',
                  height: '20px',
                  background: '#ffffff',
                  borderRadius: '50%',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 1px 4px rgba(0, 0, 0, 0.2)'
                }}
              />
            </div>
          </div>
          <p style={{
            color: '#b8e0f0',
            fontSize: '0.8rem',
            margin: '0'
          }}>
            Enabling maintenance mode will temporarily restrict access to the platform for all users except administrators.
          </p>
        </div>
      </div>
      
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: '20px'
      }}>
        <button style={{
          background: 'linear-gradient(135deg, #00e1ff, #00d0ff)',
          border: 'none',
          borderRadius: '6px',
          padding: '12px 25px',
          color: '#051a2e',
          fontWeight: '600',
          fontSize: '0.9rem',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          fontFamily: 'system-ui, sans-serif'
        }}>
          SAVE SETTINGS
        </button>
      </div>
    </div>
  );
  // Render active tab content
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div style={{ padding: '30px' }}>
            <h2 style={{
              color: '#ffffff',
              fontSize: '1.5rem',
              fontWeight: '700',
              margin: '0 0 5px 0',
              fontFamily: 'system-ui, sans-serif',
              letterSpacing: '1px'
            }}>
              COMMAND CENTER
            </h2>
            <p style={{
              color: '#8ab3c5',
              fontSize: '0.9rem',
              margin: '0 0 25px 0',
              fontFamily: 'system-ui, sans-serif'
            }}>
              Welcome to the Education Platform Administration Dashboard
            </p>
            
            {/* Stats row */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(4, 1fr)', 
              gap: '20px', 
              marginBottom: '30px' 
            }}>
              <NeonCard style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    background: 'linear-gradient(135deg, rgba(0, 225, 255, 0.2), rgba(21, 255, 170, 0.2))',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                  }}>
                    {'🏫'}
                  </div>
                  <div>
                    <h3 style={{
                      color: '#b8e0f0',
                      fontSize: '0.8rem',
                      margin: '0 0 5px 0',
                      fontFamily: 'system-ui, sans-serif',
                      textTransform: 'uppercase'
                    }}>
                      Schools
                    </h3>
                    <p style={{
                      color: '#ffffff',
                      fontSize: '1.8rem',
                      fontWeight: '700',
                      margin: 0,
                      fontFamily: 'system-ui, sans-serif'
                    }}>
                      {dashboardData ? dashboardData.stats.totalSchools : stats.totalSchools}
                    </p>
                  </div>
                </div>
              </NeonCard>
              
              <NeonCard style={{ padding: '20px' }} color="#15ffaa">
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    background: 'linear-gradient(135deg, rgba(21, 255, 170, 0.2), rgba(0, 225, 255, 0.2))',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                  }}>
                    {'🎓'}
                  </div>
                  <div>
                    <h3 style={{
                      color: '#b8e0f0',
                      fontSize: '0.8rem',
                      margin: '0 0 5px 0',
                      fontFamily: 'system-ui, sans-serif',
                      textTransform: 'uppercase'
                    }}>
                      Students
                    </h3>
                    <p style={{
                      color: '#ffffff',
                      fontSize: '1.8rem',
                      fontWeight: '700',
                      margin: 0,
                      fontFamily: 'system-ui, sans-serif'
                    }}>
                      {dashboardData ? dashboardData.stats.totalStudents : stats.totalStudents}
                    </p>
                  </div>
                </div>
              </NeonCard>
              
              <NeonCard style={{ padding: '20px' }} color="#ffd36a">
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    background: 'linear-gradient(135deg, rgba(253, 211, 106, 0.2), rgba(253, 181, 106, 0.2))',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                  }}>
                    {'👨‍🏫'}
                  </div>
                  <div>
                    <h3 style={{
                      color: '#b8e0f0',
                      fontSize: '0.8rem',
                      margin: '0 0 5px 0',
                      fontFamily: 'system-ui, sans-serif',
                      textTransform: 'uppercase'
                    }}>
                      Teachers
                    </h3>
                    <p style={{
                      color: '#ffffff',
                      fontSize: '1.8rem',
                      fontWeight: '700',
                      margin: 0,
                      fontFamily: 'system-ui, sans-serif'
                    }}>
                      {dashboardData ? dashboardData.stats.totalTeachers : stats.totalTeachers}
                    </p>
                  </div>
                </div>
              </NeonCard>
              
              <NeonCard style={{ padding: '20px' }} color="#00d0ff">
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    background: 'linear-gradient(135deg, rgba(0, 208, 255, 0.2), rgba(0, 149, 255, 0.2))',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                  }}>
                    {'🎮'}
                  </div>
                  <div>
                    <h3 style={{
                      color: '#b8e0f0',
                      fontSize: '0.8rem',
                      margin: '0 0 5px 0',
                      fontFamily: 'system-ui, sans-serif',
                      textTransform: 'uppercase'
                    }}>
                      Simulations
                    </h3>
                    <p style={{
                      color: '#ffffff',
                      fontSize: '1.8rem',
                      fontWeight: '700',
                      margin: 0,
                      fontFamily: 'system-ui, sans-serif'
                    }}>
                      {dashboardData ? dashboardData.stats.totalGames : stats.totalGames}
                    </p>
                  </div>
                </div>
              </NeonCard>
            </div>
            {/* Recent Activities Section */}
            <NeonCard style={{ padding: '20px', marginBottom: '30px' }}>
              <h3 style={{
                color: '#ffffff',
                fontSize: '1.2rem',
                fontWeight: '600',
                margin: '0 0 20px 0',
                fontFamily: 'system-ui, sans-serif'
              }}>
                RECENT ACTIVITIES
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(dashboardData ? dashboardData.recentActivities : recentActivities).map(activity => (
                  <div key={activity.id} style={{
                    padding: '15px',
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px'
                  }}>
                    <div style={{
                      fontSize: '1.5rem',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {activity.icon}
                    </div>
                    <div>
                      <h4 style={{
                        color: '#ffffff',
                        fontSize: '1rem',
                        margin: '0 0 5px 0'
                      }}>
                        {activity.title}
                      </h4>
                      <p style={{
                        color: '#b8e0f0',
                        fontSize: '0.8rem',
                        margin: '0 0 5px 0'
                      }}>
                        {activity.description}
                      </p>
                      <span style={{
                        color: '#8ab3c5',
                        fontSize: '0.7rem'
                      }}>
                        {activity.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </NeonCard>
            
            {/* Top Schools Section */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
              <NeonCard style={{ padding: '20px' }}>
                <h3 style={{
                  color: '#ffffff',
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  margin: '0 0 20px 0',
                  fontFamily: 'system-ui, sans-serif'
                }}>
                  TOP INSTITUTIONS
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {(dashboardData && dashboardData.topSchools ? dashboardData.topSchools : schoolsData.slice(0, 3)).map((school, index) => (
                    <div key={school.id || index} style={{
                      padding: '12px',
                      background: 'rgba(0, 0, 0, 0.2)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          background: 'linear-gradient(135deg, rgba(0, 225, 255, 0.2), rgba(21, 255, 170, 0.2))',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.2rem'
                        }}>
                          {'🏫'}
                        </div>
                        <div>
                          <h4 style={{
                            color: '#ffffff',
                            fontSize: '0.9rem',
                            margin: '0 0 5px 0'
                          }}>
                            {school.name}
                          </h4>
                          <p style={{
                            color: '#8ab3c5',
                            fontSize: '0.75rem',
                            margin: '0'
                          }}>
                            {school.type} • {school.students} students
                          </p>
                        </div>
                      </div>
                      <StatusBadge status={school.status} />
                    </div>
                  ))}
                </div>
              </NeonCard>
              
              <NeonCard style={{ padding: '20px' }}>
                <h3 style={{
                  color: '#ffffff',
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  margin: '0 0 20px 0',
                  fontFamily: 'system-ui, sans-serif'
                }}>
                  TOP SIMULATIONS
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {(dashboardData && dashboardData.topGames ? dashboardData.topGames : gamesData.slice(0, 3)).map((game, index) => (
                    <div key={game.id || index} style={{
                      padding: '12px',
                      background: 'rgba(0, 0, 0, 0.2)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          background: 'linear-gradient(135deg, rgba(0, 208, 255, 0.2), rgba(0, 149, 255, 0.2))',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.2rem'
                        }}>
                          {game.category === 'Mathematics' && '🧮'}
                          {game.category === 'Science' && '🔬'}
                          {game.category === 'History' && '🏺'}
                          {game.category === 'Literature' && '📚'}
                          {!['Mathematics', 'Science', 'History', 'Literature'].includes(game.category) && '🎮'}
                        </div>
                        <div>
                          <h4 style={{
                            color: '#ffffff',
                            fontSize: '0.9rem',
                            margin: '0 0 5px 0'
                          }}>
                            {game.title}
                          </h4>
                          <p style={{
                            color: '#8ab3c5',
                            fontSize: '0.75rem',
                            margin: '0'
                          }}>
                            {game.category} • {game.plays.toLocaleString()} plays
                          </p>
                        </div>
                      </div>
                      <div style={{
                        color: '#ffd36a',
                        fontSize: '0.9rem',
                        fontWeight: '600'
                      }}>
                        {'⭐'.repeat(Math.floor(game.rating))}
                        {game.rating % 1 >= 0.5 ? '⭐' : ''} 
                        {game.rating.toFixed(1)}
                      </div>
                    </div>
                  ))}
                </div>
              </NeonCard>
            </div>
          </div>
        );
      case 'schools':
        return renderInstitutionsTab();
      case 'games':
        return renderSimulationsTab();
      case 'scores':
        return renderScoresTab();
      case 'questions':
        return renderQuestionsTab();
      case 'analytics':
        return renderAnalyticsTab();
      case 'reports':
        return renderReportsTab();
      case 'settings':
        return renderSettingsTab();
      default:
        return <div>Tab not implemented yet</div>;
    }
  };
// Effect to track mouse position for the follower effect
useEffect(() => {
  const handleMouseMove = (e) => {
    // Update ref directly instead of state
    mousePositionRef.current = { x: e.clientX, y: e.clientY };
    
    // Update the DOM element directly
    if (mouseFollowerRef.current) {
      mouseFollowerRef.current.style.left = `${e.clientX - 10}px`;
      mouseFollowerRef.current.style.top = `${e.clientY - 10}px`;
    }
  };
  
  window.addEventListener('mousemove', handleMouseMove);
  
  return () => {
    window.removeEventListener('mousemove', handleMouseMove);
  };
}, []);
// Add this debug component just before your main return statement
const DebugPanel = ({ show = false }) => {
  if (!show && process.env.NODE_ENV !== 'development') return null;
  
  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      background: 'rgba(0, 0, 0, 0.8)',
      padding: '10px',
      borderRadius: '5px',
      maxWidth: '400px',
      maxHeight: '300px',
      overflow: 'auto',
      zIndex: 9999,
      border: '1px solid rgba(0, 225, 255, 0.3)',
      color: '#b8e0f0',
      fontSize: '0.7rem',
      fontFamily: 'monospace'
    }}>
      <h4 style={{ color: '#ffffff', margin: '0 0 5px 0' }}>Debug Info</h4>
      <div>
        <strong>Loading:</strong> {loading ? 'true' : 'false'}<br />
        <strong>Simulations:</strong> {simulations?.length || 0}<br />
        <strong>Games Data:</strong> {gamesData?.length || 0}<br />
        <strong>Active Tab:</strong> {activeTab}<br />
        <strong>Search Query:</strong> {searchQuery || 'none'}<br />
        <strong>Dashboard Data:</strong> {dashboardData ? 'loaded' : 'not loaded'}
      </div>
      <div style={{ marginTop: '10px' }}>
        <button
          onClick={() => console.log('Debug - gamesData:', gamesData)}
          style={{
            background: 'rgba(0, 225, 255, 0.1)',
            border: '1px solid rgba(0, 225, 255, 0.3)',
            borderRadius: '4px',
            padding: '5px 10px',
            color: '#00e1ff',
            fontSize: '0.7rem',
            cursor: 'pointer',
            marginRight: '5px'
          }}
        >
          Log Games
        </button>
        <button
          onClick={() => fetchSimulations()}
          style={{
            background: 'rgba(0, 225, 255, 0.1)',
            border: '1px solid rgba(0, 225, 255, 0.3)',
            borderRadius: '4px',
            padding: '5px 10px',
            color: '#00e1ff',
            fontSize: '0.7rem',
            cursor: 'pointer'
          }}
        >
          Refresh Data
        </button>
      </div>
    </div>
  );
};
  // Main render
return (
  <div style={{
    minHeight: '100vh',
    background: 'radial-gradient(ellipse at top, #051a2e 0%, #071a29 50%, #030b15 100%)',
    display: 'flex',
    position: 'relative',
    fontFamily: 'system-ui, sans-serif'
  }}>
      {/* SIDEBAR */}
      <motion.div 
        className="admin-sidebar"
        style={{
          width: sidebarCollapsed ? '80px' : '260px',
          background: 'rgba(5, 26, 46, 0.95)',
          backdropFilter: 'blur(15px)',
          borderRight: '1px solid rgba(0, 225, 255, 0.3)',
          padding: sidebarCollapsed ? '25px 10px' : '25px 20px',
          position: 'fixed',
          height: '100vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          boxShadow: '0 0 30px rgba(0, 225, 255, 0.2)',
          zIndex: 1000,
          transition: 'all 0.3s ease'
        }}
        animate={{ width: sidebarCollapsed ? 80 : 260 }}
        transition={{ duration: 0.3 }}
      >
        {/* Collapse Button */}
        <button 
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          style={{
            position: 'absolute',
            top: '20px',
            right: '10px',
            background: 'rgba(0, 225, 255, 0.1)',
            border: '1px solid rgba(0, 225, 255, 0.3)',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#00e1ff',
            fontSize: '0.7rem',
            cursor: 'pointer',
            zIndex: 2
          }}
          title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {sidebarCollapsed ? '→' : '←'}
        </button>

        {/* Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: sidebarCollapsed ? '0' : '15px',
          marginBottom: '35px',
          paddingBottom: '20px',
          borderBottom: '1px solid rgba(0, 225, 255, 0.3)',
          justifyContent: sidebarCollapsed ? 'center' : 'flex-start'
        }}>
          <div style={{
            width: '45px',
            height: '45px',
            background: 'linear-gradient(135deg, #00e1ff, #15ffaa)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem',
            fontWeight: 'bold',
            color: '#051a2e',
            fontFamily: 'system-ui, sans-serif',
            flexShrink: 0
          }}>
            E
          </div>
          {!sidebarCollapsed && (
            <div>
              <h2 style={{
                fontSize: '1.4rem',
                fontWeight: '900',
                background: 'linear-gradient(135deg, #00e1ff, #15ffaa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: 0,
                fontFamily: 'system-ui, sans-serif',
                letterSpacing: '2px'
              }}>
                EDUQUEST
              </h2>
              <p style={{
                color: '#8ab3c5',
                fontSize: '0.7rem',
                margin: 0,
                fontFamily: 'system-ui, sans-serif'
              }}>
                ADMIN CONTROL
              </p>
            </div>
          )}
        </div>

        {/* Admin Profile */}
        {!sidebarCollapsed && (
          <NeonCard color="#6affef" style={{ padding: '15px', marginBottom: '25px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '12px'
            }}>
              <div style={{
                width: '38px',
                height: '38px',
                background: 'linear-gradient(135deg, #6affef, #15ffaa)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                color: '#051a2e'
              }}>
                {'👤'}
              </div>
              <div>
                <h4 style={{
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  margin: 0,
                  fontFamily: 'system-ui, sans-serif'
                }}>
                  {adminProfile.name}
                </h4>
                <p style={{
                  color: '#b8e0f0',
                 fontSize: '0.7rem',
                  margin: 0,
                  fontFamily: 'system-ui, sans-serif'
                }}>
                  {adminProfile.accessLevel === 'level1' && 'BASIC ACCESS'}
                  {adminProfile.accessLevel === 'level2' && 'STANDARD ACCESS'}
                  {adminProfile.accessLevel === 'level3' && 'FULL ACCESS'}
                </p>
              </div>
            </div>
            <div style={{
              background: 'linear-gradient(90deg, #15ffaa, #00e1ff)',
              borderRadius: '4px',
              padding: '5px 10px',
              display: 'inline-block',
              fontFamily: 'system-ui, sans-serif'
            }}>
              <span style={{
                color: '#051a2e',
                fontSize: '0.6rem',
                fontWeight: '700',
                textTransform: 'uppercase'
              }}>
                {'🟢'} ONLINE
              </span>
            </div>
          </NeonCard>
        )}

        {/* Navigation */}
        <nav style={{ marginBottom: '25px' }}>
          {!sidebarCollapsed && (
            <p style={{
              color: '#8ab3c5',
              fontSize: '0.7rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              margin: '0 0 15px 0',
              fontFamily: 'system-ui, sans-serif'
            }}>
              ADMIN FUNCTIONS
            </p>
          )}
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
              }}
              title={sidebarCollapsed ? item.label : ''}
              style={{
                width: '100%',
                display:'flex',
                alignItems: 'center',
                gap: sidebarCollapsed ? '0' : '12px',
                padding: sidebarCollapsed ? '12px' : '12px 15px',
                background: activeTab === item.id 
                  ? `rgba(0, 225, 255, 0.2)`
                  : 'rgba(0, 225, 255, 0.05)',
                border: activeTab === item.id 
                  ? `1px solid ${item.color}60`
                  : '1px solid transparent',
                borderRadius: '6px',
                color: activeTab === item.id ? item.color : '#b8e0f0',
                fontSize: '0.8rem',
                fontWeight: activeTab === item.id ? '700' : '500',
                cursor: 'pointer',
                marginBottom: '8px',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontFamily: 'system-ui, sans-serif',
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                flexShrink: 0
              }}>
                {item.icon && (
                  <span>{item.icon}</span>
                )}
              </div>
              {!sidebarCollapsed && (
                <span style={{ fontSize: '0.75rem' }}>
                  {item.label}
                </span>
              )}
              
              {/* Active indicator */}
              {activeTab === item.id && (
                <div style={{
                  position: 'absolute',
                  right: '0',
                  top: '0',
                  bottom: '0',
                  width: '3px',
                  background: `linear-gradient(180deg, ${item.color}, ${item.color}90)`,
                  borderTopLeftRadius: '3px',
                  borderBottomLeftRadius: '3px'
                }} />
              )}
            </button>
          ))}
        </nav>
      </motion.div>
      
      {/* MAIN CONTENT AREA */}
      <div style={{
        flex: 1,
        marginLeft: sidebarCollapsed ? '80px' : '260px',
        transition: 'margin-left 0.3s ease',
        minHeight: '100vh',
        position: 'relative'
      }}>
        {/* Header */}
        <header style={{
          background: 'rgba(5, 26, 46, 0.8)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(0, 225, 255, 0.3)',
          padding: '20px 30px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              color: '#ffffff',
              margin: 0,
              fontFamily: 'system-ui, sans-serif',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              {sidebarItems.find(item => item.id === activeTab)?.label || 'COMMAND CENTER'}
            </h1>
            <p style={{
              color: '#8ab3c5',
              fontSize: '0.8rem',
              margin: '5px 0 0 0',
              fontFamily: 'system-ui, sans-serif'
            }}>
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
           <button
    onClick={() => setProfileModalOpen(true)}
    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/30 
               transition-all duration-300 flex items-center gap-2 group"
  >
    <div className="w-8 h-8 rounded-full overflow-hidden bg-white/10 border border-white/30 group-hover:border-white/50 transition-all duration-300">
      {user?.profilePictureUrl ? (
        <img 
          src={user.profilePictureUrl} 
          alt={user.name} 
          className="w-full h-full object-cover" 
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-sm font-medium text-white">
            {user?.name?.charAt(0)?.toUpperCase() || "A"}
          </span>
        </div>
      )}
    </div>
    <span>Edit Profile</span>
    <span className="text-white/50 group-hover:text-white transition-colors duration-300">✏️</span>
  </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* Profile Button */}
            <button
              onClick={() => setShowProfileModal(true)}
              style={{
                background: 'rgba(0, 225, 255, 0.1)',
                border: '1px solid rgba(0, 225, 255, 0.3)',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                color: '#00e1ff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                transition: 'all 0.3s ease'
              }}
              title="Edit Profile"
            >
              {'👤'}
            </button>
            
            {/* Notifications */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                style={{
                  background: 'rgba(0, 225, 255, 0.1)',
                  border: '1px solid rgba(0, 225, 255, 0.3)',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  color: '#00e1ff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  transition: 'all 0.3s ease'
                }}
              >
                {'🔔'}
              </button>
              
              {unreadCount > 0 && (
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    width: '20px',
                    height: '20px',
                    background: '#ff6a88',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    color: '#fff',
                    fontWeight: 'bold',
                    border: '2px solid #051a2e'
                  }}
                >
                  {unreadCount}
                </motion.div>
              )}
              
              <AnimatePresence>
                {showNotifications && <NotificationPanel />}
              </AnimatePresence>
            </div>

            {/* Search */}
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(0, 225, 255, 0.3)',
                  borderRadius: '20px',
                  padding: '8px 40px 8px 15px',
                  color: '#fff',
                  fontSize: '0.8rem',
                  width: '200px',
                  fontFamily: 'system-ui, sans-serif'
                }}
              />
              <div style={{
                position: 'absolute',
                right: '12px',
                color: '#8ab3c5',
                fontSize: '1rem'
              }}>
                {'🔍'}
              </div>
            </div>

            {/* Settings */}
            <button
              onClick={() => setActiveTab('settings')}
              style={{
                background: 'rgba(0, 225, 255, 0.1)',
                border: '1px solid rgba(0, 225, 255, 0.3)',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                color: '#00e1ff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                transition: 'all 0.3s ease'
              }}
            >
              {'⚙️'}
            </button>
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              style={{
                background: 'linear-gradient(135deg, #ff6a88, #ff8c6a)',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 15px',
                color: '#fff',
                fontWeight: '600',
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
                fontFamily: 'system-ui, sans-serif'
              }}
              title="Logout"
            >
              <span style={{ fontSize: '1rem' }}>🚪</span>
              LOGOUT
            </button>
          </div>
        </header>
        {/* Content Area */}
        <main style={{
          minHeight: 'calc(100vh - 81px)',
          position: 'relative'
        }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Render the content for the active tab */}
              {renderActiveTabContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      
      {/* Modals for adding/editing entities */}
<Modal 
  isOpen={showAddSchoolModal} 
  onClose={() => setShowAddSchoolModal(false)} 
  title="REGISTER NEW INSTITUTION"
  color="#6affef"
>
  <AddInstitutionForm 
    onSubmit={handleAddSchool}
    onCancel={() => setShowAddSchoolModal(false)}
  />
</Modal>
      
      {/* Edit Institution Modal */}
      {selectedSchool && (
        <Modal
          isOpen={!!selectedSchool}
          onClose={() => setSelectedSchool(null)}
          title="EDIT INSTITUTION"
          color="#6affef"
        >
          <AddInstitutionForm 
            existingInstitution={{
              _id: selectedSchool.id,
              name: selectedSchool.name,
              type: selectedSchool.type,
              location: selectedSchool.location,
              status: selectedSchool.status
            }}
            onSubmit={(institution) => {
              return new Promise((resolve, reject) => {
                setLoading(true);
                
                // Update locally instead of API call
                const updatedSchools = schoolsData.map(school => 
                  school.id === selectedSchool.id ? {
                    id: selectedSchool.id,
                    name: institution.name,
                    type: institution.type,
                    location: institution.location,
                    students: school.students,
                    teachers: school.teachers,
                    status: institution.status
                  } : school
                );
                setSchoolsData(updatedSchools);
                
                // Add to recent activities
                const newActivity = {
                  id: Date.now(),
                  title: 'Institution Updated',
                  description: `${institution.name} was updated`,
                  time: 'Just now',
                  icon: '🏫'
                };
                setRecentActivities([newActivity, ...recentActivities]);
                
                setSelectedSchool(null);
                toast.success('Institution updated successfully!');
                setLoading(false);
                resolve({ success: true });
              });
            }}
            onCancel={() => setSelectedSchool(null)}
          />
        </Modal>
      )}

      {/* Add Student Modal */}
      <Modal
        isOpen={showAddStudentModal}
        onClose={() => setShowAddStudentModal(false)}
        title="REGISTER NEW STUDENT"
        color="#00e1ff"
      >
        <AddStudentForm 
          onSubmit={handleAddStudent}
          onCancel={() => setShowAddStudentModal(false)}
          schoolsData={schoolsData}
        />
      </Modal>
      {/* Add New Simulation Modal */}
      <Modal 
        isOpen={showAddGameModal} 
        onClose={() => setShowAddGameModal(false)} 
        title={selectedGame ? "EDIT SIMULATION" : "ADD NEW SIMULATION"}
        color="#00e1ff"
      >
        <AddGameForm 
          existingGame={selectedGame}
          onSubmit={handleAddGame}
          onCancel={() => {
            setShowAddGameModal(false);
            setSelectedGame(null);
          }}
        />
      </Modal>
      {/* Add Score Modal */}
<Modal
  isOpen={showScoreModal}
  onClose={() => setShowScoreModal(false)}
  title="ADD NEW SCORE"
  color="#00e1ff"
>
  <AddScoreForm
    onSubmit={handleAddScore}
    onCancel={() => setShowScoreModal(false)}
    gamesData={gamesData}
    studentsData={studentsData}
  />
</Modal>
{/* Add Report Modal */}
<Modal
  isOpen={showAddReportModal}
  onClose={() => setShowAddReportModal(false)}
  title="CREATE NEW REPORT"
  color="#61efff"
>
  <AddReportForm
    onSubmit={handleAddReport}
    onCancel={() => setShowAddReportModal(false)}
  />
</Modal>
      
      {/* Add Question Modal */}
      <Modal
        isOpen={showQuestionModal}
        onClose={() => {
          setShowQuestionModal(false);
          setSelectedQuestion(null);
        }}
        title={selectedQuestion ? "EDIT QUESTION" : "ADD NEW QUESTION"}
        color="#ffd36a"
      >
        <AddQuestionForm
          existingQuestion={selectedQuestion}
          onSubmit={handleAddQuestion}
          onCancel={() => {
            setShowQuestionModal(false);
            setSelectedQuestion(null);
          }}
          gamesData={gamesData}
        />
      </Modal>
      
      {/* Admin Profile Modal */}
      <Modal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        title="EDIT ADMIN PROFILE"
        color="#00e1ff"
      >
        <AdminProfileForm
          onSubmit={handleUpdateProfile}
          onCancel={() => setShowProfileModal(false)}
          onProfileUpdate={(updatedProfile) => {
            setAdminProfile(updatedProfile);
            
            // Add to recent activities
            const newActivity = {
              id: Date.now(),
              title: 'Profile Updated',
              description: 'Admin profile has been updated',
              time: 'Just now',
              icon: '👤'
            };
            setRecentActivities([newActivity, ...recentActivities]);
          }}
        />
      </Modal>
   {/* Mouse follower using ref */}
<div 
  ref={mouseFollowerRef}
  style={{
    position: 'fixed',
    left: 0,
    top: 0,
    width: '20px',
    height: '20px',
    background: 'radial-gradient(circle, rgba(0, 225, 255, 0.3) 0%, transparent 70%)',
    borderRadius: '50%',
    pointerEvents: 'none',
    zIndex: 9999,
    transform: 'translate3d(0, 0, 0)', // Hardware acceleration
    willChange: 'left, top' // Optimizes for animation
  }} 
/>

      {/* Loading overlay */}
      {loading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(5, 26, 46, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '3px solid rgba(0, 225, 255, 0.2)',
            borderTop: '3px solid #00e1ff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <ProfileModal
    isOpen={profileModalOpen}
    onClose={() => setProfileModalOpen(false)}
  />
      {/* CSS for animations */}
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          
          /* Custom scrollbar */
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          
          ::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 4px;
          }
          
          ::-webkit-scrollbar-thumb {
            background: rgba(0, 225, 255, 0.3);
            border-radius: 4px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: rgba(0, 225, 255, 0.5);
          }
        `}
      </style>
    </div>
  );
};

export default AdminDashboard;