// src/components/forms/InputField.js
import React from 'react';
import { motion } from 'framer-motion';

const InputField = ({
  type = 'text',
  name,
  placeholder,
  value,
  onChange,
  icon,
  error,
  required = false,
  isTextarea = false,
  rows = 4,
  options = [],
  className = '',
  style = {},
  ...props
}) => {
  // Generate a unique ID for the input field
  const inputId = `input-${name}-${Math.random().toString(36).substr(2, 9)}`;

  // Render different input types
  const renderInputField = () => {
    const baseStyle = {
      width: '100%',
      padding: '12px 15px 12px 40px',
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '10px',
      color: 'white',
      fontSize: '0.95rem',
      transition: 'all 0.3s ease',
      outline: 'none',
      ...style
    };

    if (isTextarea) {
      return (
        <textarea
          id={inputId}
          name={name}
          placeholder={placeholder}
          value={value || ''}
          onChange={onChange}
          rows={rows}
          required={required}
          className={className}
          style={baseStyle}
          {...props}
        />
      );
    }

    if (type === 'select') {
      return (
        <select
          id={inputId}
          name={name}
          value={value || ''}
          onChange={onChange}
          required={required}
          className={className}
          style={{
            ...baseStyle,
            appearance: 'none',
            cursor: 'pointer'
          }}
          {...props}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    // Default text input
    return (
      <input
        id={inputId}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value || ''}
        onChange={onChange}
        required={required}
        className={className}
        style={baseStyle}
        {...props}
      />
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ 
        position: 'relative',
        marginBottom: '20px'
      }}
    >
      <div style={{ 
        position: 'absolute',
        left: '12px',
        top: isTextarea ? '12px' : '50%',
        transform: isTextarea ? 'none' : 'translateY(-50%)',
        pointerEvents: 'none',
        fontSize: '1.2rem',
        opacity: 0.8,
        zIndex: 1
      }}>
        {icon}
      </div>

      {renderInputField()}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            color: '#ff6b9d', 
            fontSize: '0.85rem', 
            marginTop: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          <span>⚠️</span> {error}
        </motion.div>
      )}

      {type === 'select' && (
        <div style={{
          position: 'absolute',
          right: '15px',
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          fontSize: '1rem'
        }}>
          ▼
        </div>
      )}
    </motion.div>
  );
};

export default InputField;