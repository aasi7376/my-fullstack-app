import React, { useRef, useEffect, useState } from 'react';

// StableInput component that maintains focus on re-renders
export const StableInput = React.forwardRef((props, ref) => {
  const inputRef = useRef(null);
  const [key, setKey] = useState(0);
  
  // Use the provided ref or the internal one
  const resolvedRef = ref || inputRef;
  
  // Regenerate key when value changes
  useEffect(() => {
    setKey(prevKey => prevKey + 1);
  }, [props.value]);
  
  return (
    <input
      key={key}
      ref={resolvedRef}
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
        ...props.style
      }}
    />
  );
});

// StableSelect component that maintains focus on re-renders
export const StableSelect = React.forwardRef((props, ref) => {
  const selectRef = useRef(null);
  const [key, setKey] = useState(0);
  
  // Use the provided ref or the internal one
  const resolvedRef = ref || selectRef;
  
  // Regenerate key when value changes
  useEffect(() => {
    setKey(prevKey => prevKey + 1);
  }, [props.value]);
  
  return (
    <select
      key={key}
      ref={resolvedRef}
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
        appearance: 'none',
        ...props.style
      }}
    >
      {props.children}
    </select>
  );
});

// StableTextArea component that maintains focus on re-renders
export const StableTextArea = React.forwardRef((props, ref) => {
  const textareaRef = useRef(null);
  const [key, setKey] = useState(0);
  
  // Use the provided ref or the internal one
  const resolvedRef = ref || textareaRef;
  
  // Regenerate key when value changes
  useEffect(() => {
    setKey(prevKey => prevKey + 1);
  }, [props.value]);
  
  return (
    <textarea
      key={key}
      ref={resolvedRef}
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

// Add alias for StableTextarea to fix import issues
export const StableTextarea = StableTextArea;