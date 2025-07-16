// src/services/storageService.js
/**
 * A service to abstract storage operations across environments,
 * providing graceful fallbacks when localStorage is not available
 */

// In-memory fallback storage
const memoryStorage = new Map();

/**
 * Check if localStorage is available
 * @returns {boolean} Whether localStorage is available
 */
const isLocalStorageAvailable = () => {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Get an item from storage
 * @param {string} key - The storage key
 * @param {*} defaultValue - Default value if key not found
 * @returns {*} The stored value, or defaultValue if not found
 */
const getItem = (key, defaultValue = null) => {
  try {
    if (isLocalStorageAvailable()) {
      const item = localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : defaultValue;
    } else {
      return memoryStorage.has(key) ? memoryStorage.get(key) : defaultValue;
    }
  } catch (error) {
    console.warn(`StorageService: Error retrieving item [${key}]`, error);
    return defaultValue;
  }
};

/**
 * Set an item in storage
 * @param {string} key - The storage key
 * @param {*} value - The value to store
 * @returns {boolean} Whether the operation succeeded
 */
const setItem = (key, value) => {
  try {
    if (isLocalStorageAvailable()) {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      memoryStorage.set(key, value);
    }
    return true;
  } catch (error) {
    console.warn(`StorageService: Error storing item [${key}]`, error);
    return false;
  }
};

/**
 * Remove an item from storage
 * @param {string} key - The storage key
 * @returns {boolean} Whether the operation succeeded
 */
const removeItem = (key) => {
  try {
    if (isLocalStorageAvailable()) {
      localStorage.removeItem(key);
    } else {
      memoryStorage.delete(key);
    }
    return true;
  } catch (error) {
    console.warn(`StorageService: Error removing item [${key}]`, error);
    return false;
  }
};

/**
 * Clear all items from storage
 * @returns {boolean} Whether the operation succeeded
 */
const clear = () => {
  try {
    if (isLocalStorageAvailable()) {
      localStorage.clear();
    } else {
      memoryStorage.clear();
    }
    return true;
  } catch (error) {
    console.warn('StorageService: Error clearing storage', error);
    return false;
  }
};

const storageService = {
  getItem,
  setItem,
  removeItem,
  clear,
  isLocalStorageAvailable
};

export default storageService;