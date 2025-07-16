// src/services/newTeacherService.js
import axios from 'axios';

// Base API URL - Add the base URL to ensure requests go to the correct server
const BASE_URL = 'http://localhost:5000'; // Make sure this matches your server address
const API_URL = `${BASE_URL}/api/newteacher`;

/**
 * Service for managing NewTeacher operations
 */
const newTeacherService = {
  /**
   * Get all teachers for the current school
   * @returns {Promise} Promise object with teacher data
   */
  getAllTeachers: async () => {
    try {
      console.log('newTeacherService: Getting all teachers');
      console.log('Full URL being called:', API_URL);
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No token found in localStorage');
        throw new Error('Authentication required');
      }
      
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      
      const response = await axios.get(API_URL, config);
      console.log('getAllTeachers response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('newTeacherService getAllTeachers error:', error);
      
      // Enhanced error information
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
        
        // Return the error response data if available
        if (error.response.data) {
          return error.response.data;
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
      }
      
      throw {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to fetch teachers',
        error: error
      };
    }
  },

  /**
   * Get a specific teacher by ID
   * @param {string} id - Teacher ID
   * @returns {Promise} Promise object with teacher data
   */
  getTeacher: async (id) => {
    try {
      console.log(`newTeacherService: Getting teacher with ID ${id}`);
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No token found in localStorage');
        throw new Error('Authentication required');
      }
      
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      
      const response = await axios.get(`${API_URL}/${id}`, config);
      console.log('getTeacher response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error(`newTeacherService getTeacher ${id} error:`, error);
      
      throw {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to fetch teacher details',
        error: error
      };
    }
  },

  /**
   * Register a new teacher
   * @param {Object} teacherData - Teacher data object
   * @returns {Promise} Promise object with created teacher data
   */
  registerTeacher: async (teacherData) => {
    try {
      console.log('newTeacherService: Registering teacher', teacherData);
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No token found in localStorage');
        throw new Error('Authentication required');
      }
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };
      
      console.log('Making request to:', API_URL);
      console.log('With data:', teacherData);
      const response = await axios.post(API_URL, teacherData, config);
      console.log('registerTeacher response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('newTeacherService registerTeacher error:', error);
      
      // Enhanced error handling
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        
        // Return the error response data if available
        if (error.response.data) {
          return error.response.data;
        }
      }
      
      throw {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to register teacher',
        error: error
      };
    }
  },

  /**
   * Update a teacher
   * @param {string} id - Teacher ID
   * @param {Object} teacherData - Updated teacher data
   * @returns {Promise} Promise object with updated teacher data
   */
  updateTeacher: async (id, teacherData) => {
    try {
      console.log(`newTeacherService: Updating teacher ${id}`, teacherData);
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No token found in localStorage');
        throw new Error('Authentication required');
      }
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };
      
      const response = await axios.put(`${API_URL}/${id}`, teacherData, config);
      console.log('updateTeacher response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error(`newTeacherService updateTeacher ${id} error:`, error);
      
      throw {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to update teacher',
        error: error
      };
    }
  },

  /**
   * Delete a teacher
   * @param {string} id - Teacher ID
   * @returns {Promise} Promise object with deletion status
   */
  deleteTeacher: async (id) => {
    try {
      console.log(`newTeacherService: Deleting teacher ${id}`);
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No token found in localStorage');
        throw new Error('Authentication required');
      }
      
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      
      const response = await axios.delete(`${API_URL}/${id}`, config);
      console.log('deleteTeacher response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error(`newTeacherService deleteTeacher ${id} error:`, error);
      
      throw {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to delete teacher',
        error: error
      };
    }
  },

  /**
   * Search for teachers
   * @param {string} query - Search query
   * @returns {Promise} Promise object with search results
   */
  searchTeachers: async (query) => {
    try {
      console.log(`newTeacherService: Searching teachers with query: ${query}`);
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No token found in localStorage');
        throw new Error('Authentication required');
      }
      
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      
      const response = await axios.get(`${API_URL}/search?q=${query}`, config);
      console.log('searchTeachers response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error(`newTeacherService searchTeachers error:`, error);
      
      throw {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to search teachers',
        error: error
      };
    }
  },

  /**
   * Assign a teacher to a class and subject
   * @param {Object} assignmentData - Assignment data with teacherId, classId, and subject
   * @returns {Promise} Promise object with assignment result
   */
  assignTeacher: async (assignmentData) => {
    try {
      console.log('newTeacherService: Assigning teacher', assignmentData);
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No token found in localStorage');
        throw new Error('Authentication required');
      }
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };
      
      const response = await axios.post(`${API_URL}/assign`, assignmentData, config);
      console.log('assignTeacher response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('newTeacherService assignTeacher error:', error);
      
      throw {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to assign teacher',
        error: error
      };
    }
  },

  /**
   * Handle errors consistently
   * @param {Error|Object|string} error - Error object or message
   * @returns {string} Formatted error message
   */
  handleError: (error) => {
    // Extract error message from various error formats
    if (typeof error === 'string') return error;
    if (error.message) return error.message;
    if (error.response?.data?.message) return error.response.data.message;
    if (error.response?.data?.error) return error.response.data.error;
    
    return 'An unexpected error occurred';
  }
};

export default newTeacherService;