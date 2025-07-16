// src/services/doubtService.js
import axios from 'axios';

// Add /api to the base URL
const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api';

// Create axios instance with authorization header
const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
};

// File upload config with authorization header
const getFileUploadConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`
    }
  };
};

// Doubt API methods
const doubtService = {
  // Get all doubts (with optional filters)
  getDoubts: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    // Add filters to query params
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    
    const response = await axios.get(
      `${API_URL}/doubt${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
      getAuthConfig()
    );
    return response.data;
  },
  
  // Get single doubt by ID
  getDoubt: async (id) => {
    const response = await axios.get(`${API_URL}/doubt/${id}`, getAuthConfig());
    return response.data;
  },
  
  // Create a new doubt (without files)
  createDoubt: async (doubtData) => {
    const response = await axios.post(`${API_URL}/doubt`, doubtData, getAuthConfig());
    return response.data;
  },
  
  // Create a new doubt with file attachments
  createDoubtWithFiles: async (doubtData, files) => {
    const formData = new FormData();
    
    // Add doubt data
    formData.append('subject', doubtData.subject);
    formData.append('title', doubtData.title);
    formData.append('description', doubtData.description);
    
    // Add files
    if (files && files.length > 0) {
      files.forEach(file => {
        formData.append('attachments', file);
      });
    }
    
    const response = await axios.post(
      `${API_URL}/doubt`, 
      formData, 
      getFileUploadConfig()
    );
    return response.data;
  },
  
  // Update a doubt
  updateDoubt: async (id, doubtData) => {
    const response = await axios.put(
      `${API_URL}/doubt/${id}`, 
      doubtData, 
      getAuthConfig()
    );
    return response.data;
  },
  
  // Delete a doubt
  deleteDoubt: async (id) => {
    const response = await axios.delete(
      `${API_URL}/doubt/${id}`, 
      getAuthConfig()
    );
    return response.data;
  },
  
  // Get doubt statistics (for teachers, schools, and admins)
  getDoubtStats: async () => {
    const response = await axios.get(
      `${API_URL}/doubt/stats`, 
      getAuthConfig()
    );
    return response.data;
  }
};

export default doubtService;