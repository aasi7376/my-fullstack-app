// IconAlignment.js
// This is a specialized component for properly aligning emoji icons in form fields
// Copy this file into your project and import it in EnhancedInputField.js

import React from 'react';

const IconAlignment = ({ icon, isFocused, roleConfig }) => {
  // Special styles for System Admin (holographic) theme
  const isHolographic = roleConfig?.theme === 'holographic-interface';
  const isRetroTerminal = roleConfig?.theme === 'retro-terminal';
  
  const getIconWrapperStyle = () => {
    // Base styles for all themes
    const baseStyle = {
      position: 'absolute',
      left: isHolographic ? '10px' : '15px',
      top: '50%',
      transform: 'translateY(-50%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '24px',
      height: '24px',
      fontSize: isHolographic ? '16px' : '18px',
      zIndex: 10,
      pointerEvents: 'none'
    };
    
    // Add theme-specific styling
    if (isHolographic) {
      return {
        ...baseStyle,
        color: isFocused ? roleConfig?.primaryColor : '#ffffff99',
        filter: isFocused ? 'drop-shadow(0 0 5px currentColor)' : 'none',
        transition: 'all 0.3s ease'
      };
    } else if (isRetroTerminal) {
      return {
        ...baseStyle,
        color: isFocused ? roleConfig?.primaryColor : (roleConfig?.primaryColor + '80'),
        transition: 'all 0.3s ease'
      };
    } else {
      return {
        ...baseStyle,
        color: isFocused ? roleConfig?.primaryColor : (roleConfig?.primaryColor + 'aa'),
        transition: 'all 0.3s ease'
      };
    }
  };
  
  // Different rendering for different icon types
  const renderIcon = () => {
    // Holographic theme gets special rendering
    if (isHolographic) {
      return (
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%'
        }}>
          {icon}
        </div>
      );
    }
    
    // Default rendering for other themes
    return icon;
  };
  
  return (
    <div style={getIconWrapperStyle()}>
      {renderIcon()}
    </div>
  );
};

export default IconAlignment;