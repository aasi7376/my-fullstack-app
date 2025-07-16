// Application Constants

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  TIMEOUT: 10000,
  VERSION: 'v1'
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  SCHOOL: 'school',
  TEACHER: 'teacher',
  STUDENT: 'student'
};

// Game Difficulties
export const GAME_DIFFICULTIES = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
};

// Game Categories
export const GAME_CATEGORIES = {
  ALGEBRA: 'Algebra',
  ARITHMETIC: 'Arithmetic',
  GEOMETRY: 'Geometry',
  FRACTIONS: 'Fractions',
  STATISTICS: 'Statistics',
  CALCULUS: 'Calculus',
  TRIGONOMETRY: 'Trigonometry'
};

// Score Thresholds
export const SCORE_THRESHOLDS = {
  EXCELLENT: 90,
  GOOD: 70,
  AVERAGE: 50,
  NEEDS_IMPROVEMENT: 0
};

// Achievement Types
export const ACHIEVEMENT_TYPES = {
  FIRST_GAME: 'first_game',
  PERFECT_SCORE: 'perfect_score',
  SPEED_DEMON: 'speed_demon',
  WEEK_WARRIOR: 'week_warrior',
  MATH_MASTER: 'math_master',
  STREAK_KEEPER: 'streak_keeper'
};

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  THEME: 'cognifyTheme',
  USER_PREFERENCES: 'userPreferences',
  GAME_PROGRESS: 'gameProgress'
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  ADMIN: '/admin',
  SCHOOL: '/school',
  TEACHER: '/teacher',
  STUDENT: '/student',
  GAME: '/game',
  REPORTS: '/reports',
  NOT_FOUND: '/404'
};

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100]
};

// Colors
export const COLORS = {
  NEON_BLUE: '#00f5ff',
  NEON_PINK: '#ff0080',
  NEON_GREEN: '#39ff14',
  NEON_PURPLE: '#bf00ff',
  NEON_ORANGE: '#ff6600',
  ELECTRIC_BLUE: '#0066ff'
};

// Animation Durations (in milliseconds)
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  PAGE_TRANSITION: 600
};

// Breakpoints for responsive design
export const BREAKPOINTS = {
  MOBILE: 480,
  TABLET: 768,
  DESKTOP: 1024,
  LARGE_DESKTOP: 1440
};

// Game Configuration
export const GAME_CONFIG = {
  DEFAULT_TIME_LIMIT: 300, // 5 minutes
  POINTS_PER_CORRECT_ANSWER: 10,
  BONUS_POINTS_SPEED: 5,
  MAX_QUESTIONS_PER_GAME: 20
};

// File Upload Configuration
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: {
    IMAGES: ['image/jpeg', 'image/png', 'image/gif'],
    DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    SPREADSHEETS: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
  }
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  VALIDATION_FAILED: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  NOT_FOUND: 'The requested resource was not found.',
  FILE_TOO_LARGE: 'File size is too large. Please choose a smaller file.',
  INVALID_FILE_TYPE: 'Invalid file type. Please choose a supported file format.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  LOGOUT_SUCCESS: 'Logout successful!',
  REGISTRATION_SUCCESS: 'Registration successful!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PASSWORD_CHANGED: 'Password changed successfully!',
  GAME_COMPLETED: 'Game completed successfully!',
  SCORE_SAVED: 'Score saved successfully!',
  DATA_SAVED: 'Data saved successfully!'
};

// Default User Preferences
export const DEFAULT_PREFERENCES = {
  theme: 'dark',
  language: 'en',
  notifications: {
    email: true,
    push: true,
    achievements: true,
    reminders: true
  },
  gameSettings: {
    soundEnabled: true,
    autoSave: true,
    showHints: true,
    difficulty: GAME_DIFFICULTIES.MEDIUM
  }
};

// Chart Configuration
export const CHART_CONFIG = {
  DEFAULT_HEIGHT: 300,
  COLORS: [
    COLORS.NEON_BLUE,
    COLORS.NEON_PINK,
    COLORS.NEON_GREEN,
    COLORS.NEON_ORANGE,
    COLORS.NEON_PURPLE
  ],
  ANIMATION_DURATION: 1000
};

// Date Formats
export const DATE_FORMATS = {
  SHORT: 'MMM dd',
  MEDIUM: 'MMM dd, yyyy',
  LONG: 'MMMM dd, yyyy',
  WITH_TIME: 'MMM dd, yyyy HH:mm',
  TIME_ONLY: 'HH:mm'
};

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_ACHIEVEMENTS: true,
  ENABLE_LEADERBOARDS: true,
  ENABLE_MULTIPLAYER: false,
  ENABLE_VOICE_COMMANDS: false,
  ENABLE_OFFLINE_MODE: false
};

// Keyboard Shortcuts
export const KEYBOARD_SHORTCUTS = {
  SEARCH: 'ctrl+k',
  HELP: 'ctrl+h',
  SETTINGS: 'ctrl+comma',
  LOGOUT: 'ctrl+shift+l',
  NEW_GAME: 'ctrl+n'
};

// Social Media Links
export const SOCIAL_LINKS = {
  FACEBOOK: 'https://facebook.com/cognify',
  TWITTER: 'https://twitter.com/cognify',
  INSTAGRAM: 'https://instagram.com/cognify',
  LINKEDIN: 'https://linkedin.com/company/cognify'
};

// Support Information
export const SUPPORT_INFO = {
  EMAIL: 'support@cognify.com',
  PHONE: '+1 (555) 123-4567',
  HOURS: 'Monday - Friday, 9:00 AM - 6:00 PM EST',
  KNOWLEDGE_BASE: 'https://help.cognify.com'
};

export default {
  API_CONFIG,
  USER_ROLES,
  GAME_DIFFICULTIES,
  GAME_CATEGORIES,
  SCORE_THRESHOLDS,
  ACHIEVEMENT_TYPES,
  NOTIFICATION_TYPES,
  STORAGE_KEYS,
  ROUTES,
  VALIDATION_RULES,
  PAGINATION,
  COLORS,
  ANIMATION_DURATIONS,
  BREAKPOINTS,
  GAME_CONFIG,
  FILE_UPLOAD,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  DEFAULT_PREFERENCES,
  CHART_CONFIG,
  DATE_FORMATS,
  FEATURE_FLAGS,
  KEYBOARD_SHORTCUTS,
  SOCIAL_LINKS,
  SUPPORT_INFO
};