import React from 'react';

export const StableInput = React.memo(({ value, onChange, ...props }) => {
  return (
    <input
      {...props}
      value={value || ''}
      onChange={(e) => {
        // Prevent synthetic event issues
        const val = e.target.value;
        onChange({ ...e, target: { ...e.target, value: val } });
      }}
    />
  );
});

export const StableSelect = React.memo(({ value, onChange, children, ...props }) => {
  return (
    <select
      {...props}
      value={value || ''}
      onChange={(e) => {
        // Prevent synthetic event issues
        const val = e.target.value;
        onChange({ ...e, target: { ...e.target, value: val } });
      }}
    >
      {children}
    </select>
  );
});

export const StableTextArea = React.memo(({ value, onChange, ...props }) => {
  return (
    <textarea
      {...props}
      value={value || ''}
      onChange={(e) => {
        // Prevent synthetic event issues
        const val = e.target.value;
        onChange({ ...e, target: { ...e.target, value: val } });
      }}
    />
  );
});