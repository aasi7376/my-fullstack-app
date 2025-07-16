// src/components/forms/EnhancedInputField.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const EnhancedInputField = ({ 
  type, 
  name, 
  placeholder, 
  value, 
  onChange, 
  icon, 
  error, 
  required, 
  options, 
  isTextarea, 
  rows,
  roleConfig,
  themeStyles,
  className
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // Container style - ensures consistent width
  const containerStyle = {
    marginBottom: '20px',
    position: 'relative',
    width: '100%',
    boxSizing: 'border-box'
  };

  // Theme-specific input styling
  const getThemedInputStyle = () => {
    // Increased left padding to prevent text overlap with icons
    const leftPadding = '50px';
    
    const baseStyle = {
      width: '100%',
      height: isTextarea ? 'auto' : '48px', // Fixed height for consistent rendering
      padding: `0 16px 0 ${leftPadding}`, // Zero vertical padding, increased left padding
      lineHeight: '48px', // Match the height for vertical centering
      ...themeStyles.inputStyle,
      paddingLeft: leftPadding, 
      fontSize: roleConfig?.theme === 'handwritten-notebook' ? '1.1rem' : '0.95rem',
      fontWeight: roleConfig?.theme === 'handwritten-notebook' ? '400' : '500',
      fontFamily: roleConfig?.theme === 'handwritten-notebook' ? 'Caveat, cursive' : 
                  roleConfig?.theme === 'retro-terminal' ? 'Courier New, monospace' :
                  roleConfig?.theme === 'organic-nature' ? 'Georgia, serif' : 'inherit',
      outline: 'none',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box',
      verticalAlign: 'middle', // Help with vertical alignment
    };

    // Theme-specific focus and error styling
    if (error) {
      baseStyle.borderColor = '#ff6b9d';
      baseStyle.boxShadow = '0 0 10px rgba(255, 107, 157, 0.3)';
    } else if (isFocused) {
      baseStyle.borderColor = roleConfig?.primaryColor;
      
      if (roleConfig?.theme === 'handwritten-notebook') {
        baseStyle.background = 'rgba(139, 69, 19, 0.05)';
        baseStyle.borderBottomWidth = '3px';
        baseStyle.borderBottomColor = roleConfig?.primaryColor;
      } else if (roleConfig?.theme === 'retro-terminal') {
        baseStyle.boxShadow = `0 0 15px ${roleConfig?.primaryColor}40`;
        baseStyle.background = 'rgba(0, 255, 0, 0.05)';
      } else if (roleConfig?.theme === 'organic-nature') {
        baseStyle.boxShadow = `0 0 20px ${roleConfig?.primaryColor}40`;
        baseStyle.background = 'rgba(245, 245, 220, 1)';
      } else if (roleConfig?.theme === 'holographic-interface') {
        baseStyle.boxShadow = `0 0 20px ${roleConfig?.primaryColor}40, inset 0 0 20px rgba(255,255,255,0.1)`;
        baseStyle.background = 'rgba(255, 255, 255, 0.08)';
      } else if (roleConfig?.theme === 'glowing-student' || 
                 roleConfig?.theme === 'glowing-teacher' || 
                 roleConfig?.theme === 'glowing-school' || 
                 roleConfig?.theme === 'glowing-admin') {
        baseStyle.boxShadow = `0 0 20px ${roleConfig?.primaryColor}60`;
        baseStyle.borderColor = roleConfig?.primaryColor;
      }
    }

    // Adjustments for textarea
    if (isTextarea) {
      baseStyle.height = 'auto';
      baseStyle.lineHeight = '1.5';
      baseStyle.padding = `12px 16px 12px ${leftPadding}`;
      baseStyle.minHeight = '100px';
    }

    // Adjustments for select
    if (type === 'select') {
      baseStyle.paddingTop = '0';
      baseStyle.paddingBottom = '0';
    }

    return baseStyle;
  };

  // IMPROVED ICON STYLING - with consistent dimensions
  const getIconWrapperStyle = () => {
    // Base style for all themes
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '45px', // Fixed width
      height: '100%', // Full height of container
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none',
      zIndex: 2,
      color: isFocused ? roleConfig?.primaryColor : (roleConfig?.primaryColor + 'aa'),
      transition: 'all 0.3s ease',
    };
  };

  // IMPROVED ICON STYLE - ensures consistent size and alignment
  const getIconStyle = () => {
    return {
      width: '24px', // Fixed width
      height: '24px', // Fixed height
      display: 'flex',
      alignItems: 'center', 
      justifyContent: 'center',
      fontSize: '18px', // Consistent font size
      lineHeight: 1,
      textAlign: 'center',
    };
  };

  const inputProps = {
    type,
    name,
    placeholder,
    value: value || '',
    onChange: onChange,
    required,
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
    style: getThemedInputStyle()
  };

  return (
    <motion.div 
      style={containerStyle}
      whileHover={{ 
        scale: roleConfig?.theme === 'organic-nature' ? 1.01 : 1,
        y: roleConfig?.theme === 'organic-nature' ? -2 : 0
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={className}
    >
      <div style={{ position: 'relative', width: '100%' }}>
        {/* Icon with fixed size and positioning */}
        <div style={getIconWrapperStyle()}>
          <div style={getIconStyle()}>{icon}</div>
        </div>
        
        {/* Input Field */}
        {type === 'select' ? (
          <select {...inputProps}>
            <option value="" style={{ 
              background: roleConfig?.theme === 'handwritten-notebook' ? '#f5f5dc' : '#1a1a2e', 
              color: roleConfig?.theme === 'handwritten-notebook' ? roleConfig?.inkColor : '#fff' 
            }}>
              {placeholder}
            </option>
            {options?.map(option => (
              <option 
                key={option.value} 
                value={option.value} 
                style={{ 
                  background: roleConfig?.theme === 'handwritten-notebook' ? '#f5f5dc' : '#1a1a2e', 
                  color: roleConfig?.theme === 'handwritten-notebook' ? roleConfig?.inkColor : '#fff' 
                }}
              >
                {option.label}
              </option>
            ))}
          </select>
        ) : isTextarea ? (
          <textarea 
            {...inputProps} 
            rows={rows || 3} 
            style={{ 
              ...inputProps.style, 
              resize: 'vertical', 
              minHeight: '100px',
              fontFamily: inputProps.style.fontFamily,
            }} 
          />
        ) : (
          <input {...inputProps} />
        )}

        {/* Theme-specific decorative elements */}
        {roleConfig?.theme === 'handwritten-notebook' && isFocused && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            style={{
              position: 'absolute',
              bottom: '0',
              left: '0',
              height: '2px',
              background: roleConfig?.primaryColor,
              opacity: 0.6,
              zIndex: 1
            }}
          />
        )}

        {roleConfig?.theme === 'retro-terminal' && isFocused && (
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              bottom: '0',
              border: `1px solid ${roleConfig?.primaryColor}`,
              pointerEvents: 'none',
              borderRadius: inputProps.style.borderRadius,
              zIndex: 1
            }}
          />
        )}

        {roleConfig?.theme === 'holographic-interface' && isFocused && (
          <motion.div
            animate={{ 
              background: [
                `linear-gradient(45deg, ${roleConfig?.primaryColor}20, transparent)`,
                `linear-gradient(45deg, ${roleConfig?.secondaryColor}20, transparent)`,
                `linear-gradient(45deg, ${roleConfig?.accentColor}20, transparent)`,
                `linear-gradient(45deg, ${roleConfig?.primaryColor}20, transparent)`
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              bottom: '0',
              pointerEvents: 'none',
              borderRadius: inputProps.style.borderRadius,
              opacity: 0.3,
              zIndex: 1
            }}
          />
        )}
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            color: '#ff6b9d',
            fontSize: '0.85rem',
            marginTop: '5px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontFamily: roleConfig?.theme === 'retro-terminal' ? 'Courier New, monospace' : 'inherit'
          }}
        >
          <span>
            {roleConfig?.theme === 'retro-terminal' ? '[ERROR]' : 
             roleConfig?.theme === 'handwritten-notebook' ? '✗' : '⚠️'}
          </span>
          {error}
        </motion.div>
      )}

      {/* Theme-specific input guides */}
      {roleConfig?.theme === 'handwritten-notebook' && isFocused && (
        <div style={{
          position: 'absolute',
          right: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: roleConfig?.primaryColor + '60',
          fontSize: '0.8rem',
          fontFamily: 'Caveat, cursive',
          fontStyle: 'italic',
          pointerEvents: 'none'
        }}>
          write here...
        </div>
      )}
    </motion.div>
  );
};

export default EnhancedInputField;