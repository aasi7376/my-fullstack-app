import { useState, useEffect, useRef } from 'react';

// StableInput component that prevents focus loss and reduces re-renders
export const StableInput = ({ value, onChange, ...props }) => {
  // Initialize localValue with the provided value or empty string
  const [localValue, setLocalValue] = useState(value || '');
  const inputRef = useRef(null);
  const isInitialMount = useRef(true);
  const isUserChange = useRef(false);

  // Update local state when prop value changes (only if not from user input)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Only update if value is different and this isn't from a user change
    if (!isUserChange.current && value !== localValue) {
      setLocalValue(value || '');
    }
    
    // Reset the user change flag
    isUserChange.current = false;
  }, [value]);

  // Handle change locally, then propagate
  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    isUserChange.current = true;
    
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <input
      {...props}
      ref={inputRef}
      value={localValue}
      onChange={handleChange}
    />
  );
};

// StableSelect component for dropdowns
export const StableSelect = ({ value, onChange, children, ...props }) => {
  // Initialize localValue with the provided value or empty string
  const [localValue, setLocalValue] = useState(value || '');
  const selectRef = useRef(null);
  const isInitialMount = useRef(true);
  const isUserChange = useRef(false);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Only update if value is different and this isn't from a user change
    if (!isUserChange.current && value !== localValue) {
      setLocalValue(value || '');
    }
    
    // Reset the user change flag
    isUserChange.current = false;
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    isUserChange.current = true;
    
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <select
      {...props}
      ref={selectRef}
      value={localValue}
      onChange={handleChange}
    >
      {children}
    </select>
  );
};

// StableTextArea component for multi-line inputs
export const StableTextArea = ({ value, onChange, ...props }) => {
  // Initialize localValue with the provided value or empty string
  const [localValue, setLocalValue] = useState(value || '');
  const textareaRef = useRef(null);
  const isInitialMount = useRef(true);
  const isUserChange = useRef(false);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Only update if value is different and this isn't from a user change
    if (!isUserChange.current && value !== localValue) {
      setLocalValue(value || '');
    }
    
    // Reset the user change flag
    isUserChange.current = false;
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    isUserChange.current = true;
    
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <textarea
      {...props}
      ref={textareaRef}
      value={localValue}
      onChange={handleChange}
    />
  );
};