// src/services/simulationService.js
import axios from 'axios';

// Hard-code the API URL for now to ensure it's correct
const API_URL = 'http://localhost:5000/api';
console.log('Using API URL:', API_URL);

// Create axios instance with credentials
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add authorization header if token exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Making request to:', config.baseURL + config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network errors (including CORS)
    if (error.message === 'Network Error') {
      console.error('Network Error - possible CORS issue:', error);
      console.error('CORS Troubleshooting: Check backend CORS configuration and ensure it allows credentials.');
    }
    
    // Log complete error for debugging
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        method: error.config?.method,
        headers: error.config?.headers
      }
    });
    
    // Handle unauthorized errors (e.g. redirect to login)
    if (error.response && error.response.status === 401) {
      // Handle token expiration
      console.error('Authentication error:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

// Mock data for fallback when API is unavailable
const mockSimulationData = [
  { 
    _id: '1', 
    title: 'Algebra Quest', 
    simulationType: 'Mathematics', 
    difficulty: 'Intermediate', 
    plays: 12500, 
    rating: 4.8, 
    status: 'Active',
    description: 'A thrilling adventure through the world of algebra. Students solve equations and unlock new levels as they progress through increasingly challenging problems.',
    estimatedPlayTime: 45,
    targetGrade: '6-8',
    learningObjectives: 'Master linear equations, understand variables, develop problem-solving skills'
  },
  { 
    _id: '2', 
    title: 'History Explorer', 
    simulationType: 'History', 
    difficulty: 'Beginner', 
    plays: 8400, 
    rating: 4.6, 
    status: 'Active',
    description: 'Travel through time to experience key historical events firsthand. Interactive storytelling and decision-making help students understand historical contexts.',
    estimatedPlayTime: 30,
    targetGrade: '3-5',
    learningObjectives: 'Understand historical chronology, recognize cause and effect in historical events'
  },
  { 
    _id: '3', 
    title: 'Science Lab VR', 
    simulationType: 'Science', 
    difficulty: 'Advanced', 
    plays: 6200, 
    rating: 4.9, 
    status: 'Beta',
    description: 'A virtual reality lab where students can conduct experiments safely. Covers chemistry, physics, and biology experiments with detailed explanations.',
    estimatedPlayTime: 60,
    targetGrade: '9-10',
    learningObjectives: 'Apply scientific method, conduct experiments safely, analyze results'
  },
  { 
    _id: '4', 
    title: 'Language Master', 
    simulationType: 'Literature', 
    difficulty: 'Intermediate', 
    plays: 9800, 
    rating: 4.7, 
    status: 'Active',
    description: 'Improve vocabulary and grammar through interactive word games and creative writing challenges.',
    estimatedPlayTime: 40,
    targetGrade: '6-8',
    learningObjectives: 'Enhance vocabulary, improve grammar usage, develop writing skills'
  }
];

// Simulation service methods with fallback to mock data
const simulationService = {
  // Get all simulations
  getAllSimulations: async () => {
    try {
      // For development testing when API might be down - use mock data
      if (process.env.REACT_APP_USE_MOCK_DATA === 'true') {
        console.log('Using mock simulation data as configured in .env');
        return {
          success: true,
          data: mockSimulationData
        };
      }
      
      // Add a debug log to see exactly what URL is being requested
      console.log('Making request to:', API_URL + '/simulation');
      
      // Note: Don't include /api here - it's already in the baseURL
      const response = await api.get('/simulation');
      return response.data;
    } catch (error) {
      console.error('Error fetching simulations:', error);
      
      // If in development, return mock data when API fails
      if (process.env.NODE_ENV === 'development') {
        console.log('API error occurred. Using mock simulation data as fallback');
        return {
          success: true,
          data: mockSimulationData
        };
      }
      
      throw error;
    }
  },
// Get simulation by ID
getSimulationById: async (id) => {
  try {
    // For development testing when API might be down - use mock data
    if (process.env.REACT_APP_USE_MOCK_DATA === 'true') {
      console.log('Using mock simulation data as configured in .env');
      const mockItem = mockSimulationData.find(item => item._id === id);
      if (mockItem) {
        return {
          success: true,
          data: mockItem
        };
      } else {
        throw new Error('Simulation not found in mock data');
      }
    }
    
    // Add a debug log to see exactly what URL is being requested
    console.log('Making request to:', API_URL + `/simulation/${id}`);
    
    // Note: Don't include /api here - it's already in the baseURL
    const response = await api.get(`/simulation/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching simulation ${id}:`, error);
    
    // If in development, return mock data when API fails
    if (process.env.NODE_ENV === 'development') {
      console.log('API error occurred. Using mock simulation data as fallback');
      const mockItem = mockSimulationData.find(item => item._id === id);
      if (mockItem) {
        return {
          success: true,
          data: mockItem
        };
      }
    }
    
    throw error;
  }
},
  // Create new simulation
  createSimulation: async (simulationData) => {
    try {
      const response = await api.post('/simulation', simulationData);
      return response.data;
    } catch (error) {
      console.error('Error creating simulation:', error);
      throw error;
    }
  },
  
  // Update simulation
  updateSimulation: async (id, simulationData) => {
    try {
      const response = await api.put(`/simulation/${id}`, simulationData);
      return response.data;
    } catch (error) {
      console.error(`Error updating simulation ${id}:`, error);
      throw error;
    }
  },
  
  // Delete simulation
  deleteSimulation: async (id) => {
    try {
      const response = await api.delete(`/simulation/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting simulation ${id}:`, error);
      throw error;
    }
  },
  
  // Get simulations by type
  getSimulationsByType: async (type) => {
    try {
      const response = await api.get(`/simulation/type/${type}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching simulations by type ${type}:`, error);
      
      // Fallback to mock data in development
      if (process.env.NODE_ENV === 'development') {
        const filteredMockData = mockSimulationData.filter(
          item => item.simulationType === type
        );
        return { success: true, data: filteredMockData };
      }
      
      throw error;
    }
  },
  
  // Get simulations by difficulty
  getSimulationsByDifficulty: async (difficulty) => {
    try {
      const response = await api.get(`/simulation/difficulty/${difficulty}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching simulations by difficulty ${difficulty}:`, error);
      
      // Fallback to mock data in development
      if (process.env.NODE_ENV === 'development') {
        const filteredMockData = mockSimulationData.filter(
          item => item.difficulty === difficulty
        );
        return { success: true, data: filteredMockData };
      }
      
      throw error;
    }
  },
  
  // Get simulations by grade
  getSimulationsByGrade: async (grade) => {
    try {
      const response = await api.get(`/simulation/grade/${grade}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching simulations by grade ${grade}:`, error);
      
      // Fallback to mock data in development
      if (process.env.NODE_ENV === 'development') {
        const filteredMockData = mockSimulationData.filter(
          item => item.targetGrade === grade
        );
        return { success: true, data: filteredMockData };
      }
      
      throw error;
    }
  },
  
  // Update simulation rating
  updateSimulationRating: async (id, rating) => {
    try {
      const response = await api.put(`/simulation/${id}/rating`, { rating });
      return response.data;
    } catch (error) {
      console.error(`Error updating simulation rating for ${id}:`, error);
      throw error;
    }
  },
  
  // Increment play count
  incrementPlayCount: async (id) => {
    try {
      const response = await api.put(`/simulation/${id}/play`);
      return response.data;
    } catch (error) {
      console.error(`Error incrementing play count for ${id}:`, error);
      throw error;
    }
  }
};

export default simulationService;