// Validation utilities

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const validatePassword = (password) => {
  return password.length >= 6;
};

// Strong password validation
export const validateStrongPassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return {
    isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
    length: password.length >= minLength,
    upperCase: hasUpperCase,
    lowerCase: hasLowerCase,
    numbers: hasNumbers,
    specialChar: hasSpecialChar
  };
};

// Phone validation
export const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Name validation
export const validateName = (name) => {
  return name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name.trim());
};

// URL validation
export const validateURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Grade validation
export const validateGrade = (grade) => {
  const validGrades = ['6th', '7th', '8th', '9th', '10th', '11th', '12th'];
  return validGrades.includes(grade);
};

// Score validation
export const validateScore = (score) => {
  const numScore = Number(score);
  return !isNaN(numScore) && numScore >= 0 && numScore <= 100;
};

// File validation
export const validateFile = (file, maxSize = 5 * 1024 * 1024, allowedTypes = []) => {
  const errors = [];

  if (!file) {
    errors.push('File is required');
    return { isValid: false, errors };
  }

  if (file.size > maxSize) {
    errors.push(`File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`);
  }

  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    errors.push(`File type must be one of: ${allowedTypes.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Form validation schemas
export const validationSchemas = {
  login: {
    email: (value) => {
      if (!value) return 'Email is required';
      if (!validateEmail(value)) return 'Please enter a valid email';
      return null;
    },
    password: (value) => {
      if (!value) return 'Password is required';
      if (!validatePassword(value)) return 'Password must be at least 6 characters';
      return null;
    },
    role: (value) => {
      if (!value) return 'Please select a role';
      return null;
    }
  },

  register: {
    name: (value) => {
      if (!value) return 'Name is required';
      if (!validateName(value)) return 'Please enter a valid name (letters only)';
      return null;
    },
    email: (value) => {
      if (!value) return 'Email is required';
      if (!validateEmail(value)) return 'Please enter a valid email';
      return null;
    },
    password: (value) => {
      if (!value) return 'Password is required';
      if (!validatePassword(value)) return 'Password must be at least 6 characters';
      return null;
    },
    confirmPassword: (value, formData) => {
      if (!value) return 'Please confirm your password';
      if (value !== formData.password) return 'Passwords do not match';
      return null;
    },
    role: (value) => {
      if (!value) return 'Please select a role';
      return null;
    }
  },

  game: {
    title: (value) => {
      if (!value) return 'Game title is required';
      if (value.length < 3) return 'Title must be at least 3 characters';
      return null;
    },
    description: (value) => {
      if (!value) return 'Description is required';
      if (value.length < 10) return 'Description must be at least 10 characters';
      return null;
    },
    difficulty: (value) => {
      if (!value) return 'Please select difficulty level';
      if (!['easy', 'medium', 'hard'].includes(value)) return 'Invalid difficulty level';
      return null;
    }
  }
};

// Generic form validator
export const validateForm = (formData, schema) => {
  const errors = {};
  
  Object.keys(schema).forEach(field => {
    const validator = schema[field];
    const error = validator(formData[field], formData);
    if (error) {
      errors[field] = error;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Real-time field validator
export const validateField = (fieldName, value, schema, formData = {}) => {
  if (!schema[fieldName]) return null;
  return schema[fieldName](value, formData);
};