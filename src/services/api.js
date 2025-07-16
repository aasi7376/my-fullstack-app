// src/services/api.js - Service for API interactions
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests if available
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API service object with methods for all backend interactions
const api = {
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Initialize API and check connection
  init: async () => {
    try {
      const response = await axios.get('http://localhost:5000/health');
      return response.data && response.data.success;
    } catch (error) {
      console.error('API initialization error:', error);
      return false;
    }
  },
  
  // Login user
  login: async (credentials) => {
    try {
      console.log('API Service: Logging in user', credentials.email, credentials.role);
      
      // Send login request
      const response = await apiClient.post('/auth/login', credentials);
      
      console.log('Login response:', response.data);
      
      // Store token and user data if successful
      if (response.data.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error);
      throw error.response?.data || { error: 'Login failed' };
    }
  },

  register: async (userData) => {
    try {
      console.log('API Service: Registering user', userData.role);
      
      // Ensure all required fields are present based on role
      let processedData = { ...userData };
      
      // Add default fields based on role if they're missing
      switch (userData.role) {
        case 'admin':
          processedData = {
            ...processedData,
            adminId: processedData.adminId || `ADM${Date.now()}`,
            department: processedData.department || 'it',
            accessLevel: processedData.accessLevel || 'level1',
          };
          break;
        case 'school':
          processedData = {
            ...processedData,
            schoolCode: processedData.schoolCode || `SCH-${Math.floor(1000 + Math.random() * 9000)}`,
            schoolType: processedData.schoolType || 'public',
          };
          break;
        case 'teacher':
          // Ensure subjects is an array
          if (typeof processedData.subjects === 'string') {
            processedData.subjects = processedData.subjects.split(',').map(s => s.trim());
          } else if (!Array.isArray(processedData.subjects)) {
            processedData.subjects = ['General'];
          }
          break;
        case 'student':
          // Format birthDate if it's not already a date string
          if (processedData.birthDate && !(processedData.birthDate instanceof Date) && !isNaN(new Date(processedData.birthDate))) {
            const date = new Date(processedData.birthDate);
            processedData.birthDate = date.toISOString().split('T')[0];
          }
          break;
      }
      
      console.log('API Service: Processed registration data:', processedData);
      
      // Send request with processed data
      const response = await apiClient.post('/auth/register', processedData);
      
      // Store token and user data if successful
      if (response.data.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      console.error('Registration error:', error.response?.data || error);
      throw error.response?.data || { error: 'Registration failed' };
    }
  },

  // Get current user data
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error.response?.data || error);
      throw error.response?.data || { error: 'Failed to get user data' };
    }
  },

  // Update user profile with file upload support
  updateProfile: async (formData) => {
    try {
      // Get user info from local storage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const role = user.role;
      const userId = user._id;
      
      if (!role || !userId) {
        throw { error: 'User data not found' };
      }
      
      // Determine endpoint based on user role - use the profile endpoint for file uploads
      const endpoint = `/${role}/${userId}/profile`;
      
      console.log('API Service: Updating profile', role, userId);
      
      // For FormData, we need different headers
      let config = {};
      
      // Check if we have a File object in the data (profile picture)
      let hasFile = false;
      let data;
      
      if (formData instanceof FormData) {
        // Already a FormData object
        data = formData;
        hasFile = true; // Assume FormData has files
      } else {
        // Check if any property is a File
        hasFile = Object.values(formData).some(val => val instanceof File);
        
        // Create FormData object
        data = new FormData();
        
        // Add all fields to FormData
        Object.keys(formData).forEach(key => {
          // Special handling for arrays (e.g., subjects for teachers)
          if (Array.isArray(formData[key])) {
            formData[key].forEach((item, index) => {
              data.append(`${key}[${index}]`, item);
            });
          } else {
            data.append(key, formData[key]);
          }
        });
      }
      
      // If we have files, don't set Content-Type (let the browser set it with boundary)
      if (hasFile) {
        config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        };
      }
      
      // Make the request
      const response = await apiClient.put(endpoint, data, config);
      
      // Update stored user data if successful
      if (response.data.success) {
        const updatedUser = {
          ...user,
          ...response.data.data
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error.response?.data || error);
      throw error.response?.data || { error: 'Failed to update profile', details: error.message };
    }
  },

  // Regular updateProfile without file upload
  updateUserData: async (userData) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const role = user.role;
      const userId = user._id;
      
      if (!role || !userId) {
        throw { error: 'User data not found' };
      }
      
      const response = await apiClient.put(`/${role}/${userId}`, userData);
      
      // Update stored user data if successful
      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify({
          ...user,
          ...response.data.data
        }));
      }
      
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error.response?.data || error);
      throw error.response?.data || { error: 'Failed to update profile' };
    }
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await apiClient.post('/auth/change-password', {
        currentPassword,
        newPassword
      });
      
      return response.data;
    } catch (error) {
      console.error('Change password error:', error.response?.data || error);
      throw error.response?.data || { error: 'Failed to change password' };
    }
  },

  // Delete account
  deleteAccount: async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const role = user.role;
      const userId = user._id;
      
      if (!role || !userId) {
        throw { error: 'User data not found' };
      }
      
      const response = await apiClient.delete(`/${role}/${userId}`);
      
      // Clear stored data if successful
      if (response.data.success) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      
      return response.data;
    } catch (error) {
      console.error('Delete account error:', error.response?.data || error);
      throw error.response?.data || { error: 'Failed to delete account' };
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { success: true };
  },

  // Check API health
  checkHealth: async () => {
    try {
      const response = await axios.get('http://localhost:5000/health');
      return {
        success: true,
        status: 'healthy',
        mode: 'online',
        timestamp: new Date().toISOString(),
        details: response.data
      };
    } catch (error) {
      console.error('Health check error:', error);
      return {
        success: false,
        status: 'unhealthy',
        mode: 'offline',
        timestamp: new Date().toISOString(),
        error: error.message
      };
    }
  },
  
 // Get all institutions
getInstitutions: async () => {
  try {
    // Use the admin/institutions path that matches your server.js configuration
    const response = await apiClient.get('/admin/institutions');
    return response.data;
  } catch (error) {
    console.error('Get institutions error:', error.response?.data || error);
    throw error.response?.data || { error: 'Failed to fetch institutions' };
  }
},

// Get a single institution
getInstitution: async (id) => {
  try {
    // Use the admin/institutions path that matches your server.js configuration
    const response = await apiClient.get(`/admin/institutions/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Get institution ${id} error:`, error.response?.data || error);
    throw error.response?.data || { error: 'Failed to fetch institution details' };
  }
},

// Create a new institution
createInstitution: async (institutionData) => {
  try {
    console.log('API Service: Creating institution', institutionData.name);
    
    // Use the admin/institutions path that matches your server.js configuration
    const response = await apiClient.post('/admin/institutions', institutionData);
    return response.data;
  } catch (error) {
    console.error('Create institution error:', error.response?.data || error);
    throw error.response?.data || { error: 'Failed to create institution' };
  }
},

// Update an institution
updateInstitution: async (id, institutionData) => {
  try {
    console.log(`API Service: Updating institution ${id}`, institutionData.name);
    
    // Use the admin/institutions path that matches your server.js configuration
    const response = await apiClient.put(`/admin/institutions/${id}`, institutionData);
    return response.data;
  } catch (error) {
    console.error(`Update institution ${id} error:`, error.response?.data || error);
    throw error.response?.data || { error: 'Failed to update institution' };
  }
},

// Delete an institution
deleteInstitution: async (id) => {
  try {
    console.log(`API Service: Deleting institution ${id}`);
    
    // Use the admin/institutions path that matches your server.js configuration
    const response = await apiClient.delete(`/admin/institutions/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Delete institution ${id} error:`, error.response?.data || error);
    throw error.response?.data || { error: 'Failed to delete institution' };
  }
},
// Add these methods to your api object in api.js

// Get all simulations
getSimulations: async () => {
  try {
    const response = await apiClient.get('/simulation');
    return response.data;
  } catch (error) {
    console.error('Get simulations error:', error.response?.data || error);
    throw error.response?.data || { error: 'Failed to fetch simulations' };
  }
},

// Get a single simulation
getSimulation: async (id) => {
  try {
    const response = await apiClient.get(`/simulation/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Get simulation ${id} error:`, error.response?.data || error);
    throw error.response?.data || { error: 'Failed to fetch simulation details' };
  }
},

// Create a new simulation
createSimulation: async (simulationData) => {
  try {
    console.log('API Service: Creating simulation', simulationData.title);
    const response = await apiClient.post('/simulation', simulationData);
    return response.data;
  } catch (error) {
    console.error('Create simulation error:', error.response?.data || error);
    throw error.response?.data || { error: 'Failed to create simulation' };
  }
},

// Update a simulation
updateSimulation: async (id, simulationData) => {
  try {
    console.log(`API Service: Updating simulation ${id}`, simulationData.title);
    const response = await apiClient.put(`/simulation/${id}`, simulationData);
    return response.data;
  } catch (error) {
    console.error(`Update simulation ${id} error:`, error.response?.data || error);
    throw error.response?.data || { error: 'Failed to update simulation' };
  }
},

// Delete a simulation
deleteSimulation: async (id) => {
  try {
    console.log(`API Service: Deleting simulation ${id}`);
    const response = await apiClient.delete(`/simulation/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Delete simulation ${id} error:`, error.response?.data || error);
    throw error.response?.data || { error: 'Failed to delete simulation' };
  }
},

// Get simulations by type
getSimulationsByType: async (type) => {
  try {
    const response = await apiClient.get(`/simulation/type/${type}`);
    return response.data;
  } catch (error) {
    console.error(`Get simulations by type ${type} error:`, error.response?.data || error);
    throw error.response?.data || { error: 'Failed to fetch simulations by type' };
  }
},

// Get simulations by difficulty
getSimulationsByDifficulty: async (difficulty) => {
  try {
    const response = await apiClient.get(`/simulation/difficulty/${difficulty}`);
    return response.data;
  } catch (error) {
    console.error(`Get simulations by difficulty ${difficulty} error:`, error.response?.data || error);
    throw error.response?.data || { error: 'Failed to fetch simulations by difficulty' };
  }
},

// Get simulations by grade
getSimulationsByGrade: async (grade) => {
  try {
    const response = await apiClient.get(`/simulation/grade/${grade}`);
    return response.data;
  } catch (error) {
    console.error(`Get simulations by grade ${grade} error:`, error.response?.data || error);
    throw error.response?.data || { error: 'Failed to fetch simulations by grade' };
  }
},
// Add these methods to your api.js service file

// Update these methods in your api.js file

// Get all students
getAllStuds: async () => {
  try {
    // Correct endpoint - no duplicate '/api' prefix
    const response = await apiClient.get('/stud');
    return response.data;
  } catch (error) {
    console.error('Get students error:', error.response?.data || error);
    throw error.response?.data || { error: 'Failed to fetch students' };
  }
},

// Get a single student
getStud: async (id) => {
  try {
    const response = await apiClient.get(`/stud/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Get student ${id} error:`, error.response?.data || error);
    throw error.response?.data || { error: 'Failed to fetch student details' };
  }
},

// Register a new student
registerStud: async (studentData) => {
  try {
    console.log('API Service: Registering student', studentData.name);
    const response = await apiClient.post('/stud/register', studentData);
    return response.data;
  } catch (error) {
    console.error('Register student error:', error.response?.data || error);
    throw error.response?.data || { error: 'Failed to register student' };
  }
},

// Update a student
updateStud: async (id, studentData) => {
  try {
    console.log(`API Service: Updating student ${id}`, studentData.name);
    const response = await apiClient.put(`/stud/${id}`, studentData);
    return response.data;
  } catch (error) {
    console.error(`Update student ${id} error:`, error.response?.data || error);
    throw error.response?.data || { error: 'Failed to update student' };
  }
},

// Delete a student
deleteStud: async (id) => {
  try {
    console.log(`API Service: Deleting student ${id}`);
    const response = await apiClient.delete(`/stud/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Delete student ${id} error:`, error.response?.data || error);
    throw error.response?.data || { error: 'Failed to delete student' };
  }
},

// Search students
searchStuds: async (query) => {
  try {
    const response = await apiClient.get(`/stud/search/${query}`);
    return response.data;
  } catch (error) {
    console.error(`Search students error:`, error.response?.data || error);
    throw error.response?.data || { error: 'Failed to search students' };
  }
},

// Get students by grade
getStudsByGrade: async (grade) => {
  try {
    const response = await apiClient.get(`/stud/grade/${grade}`);
    return response.data;
  } catch (error) {
    console.error(`Get students by grade error:`, error.response?.data || error);
    throw error.response?.data || { error: 'Failed to fetch students by grade' };
  }
},

// New Teacher Management Methods
getNewTeachers: async () => {
  try {
    const response = await apiClient.get('/newteacher');
    return response.data;
  } catch (error) {
    console.error('Get new teachers error:', error.response?.data || error);
    throw error.response?.data || { error: 'Failed to fetch teachers' };
  }
},

getNewTeacher: async (id) => {
  try {
    const response = await apiClient.get(`/newteacher/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Get teacher ${id} error:`, error.response?.data || error);
    throw error.response?.data || { error: 'Failed to fetch teacher details' };
  }
},

registerNewTeacher: async (teacherData) => {
  try {
    console.log('API Service: Registering new teacher', teacherData.name);
    const response = await apiClient.post('/newteacher', teacherData);
    return response.data;
  } catch (error) {
    console.error('Register teacher error:', error.response?.data || error);
    throw error.response?.data || { error: 'Failed to register teacher' };
  }
},

updateNewTeacher: async (id, teacherData) => {
  try {
    console.log(`API Service: Updating teacher ${id}`, teacherData.name);
    const response = await apiClient.put(`/newteacher/${id}`, teacherData);
    return response.data;
  } catch (error) {
    console.error(`Update teacher ${id} error:`, error.response?.data || error);
    throw error.response?.data || { error: 'Failed to update teacher' };
  }
},

deleteNewTeacher: async (id) => {
  try {
    console.log(`API Service: Deleting teacher ${id}`);
    const response = await apiClient.delete(`/newteacher/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Delete teacher ${id} error:`, error.response?.data || error);
    throw error.response?.data || { error: 'Failed to delete teacher' };
  }
},

searchNewTeachers: async (query) => {
  try {
    const response = await apiClient.get(`/newteacher/search?q=${query}`);
    return response.data;
  } catch (error) {
    console.error(`Search teachers error:`, error.response?.data || error);
    throw error.response?.data || { error: 'Failed to search teachers' };
  }
},

assignNewTeacher: async (assignmentData) => {
  try {
    console.log('API Service: Assigning teacher', assignmentData);
    const response = await apiClient.post('/newteacher/assign', assignmentData);
    return response.data;
  } catch (error) {
    console.error('Assign teacher error:', error.response?.data || error);
    throw error.response?.data || { error: 'Failed to assign teacher' };
  }
},

// NEW METHODS FOR GAME PROGRESS TRACKING

// Save game progress
saveGameProgress: async (progressData) => {
  try {
    console.log('API Service: Saving game progress', progressData);
    const response = await apiClient.post('/progress/game', progressData);
    return response.data;
  } catch (error) {
    console.error('Save game progress error:', error.response?.data || error);
    throw error.response?.data || { error: 'Failed to save game progress' };
  }
},

// Save learning progress
saveLearningProgress: async (progressData) => {
  try {
    console.log('API Service: Saving learning progress', progressData);
    const response = await apiClient.post('/progress/learning', progressData);
    return response.data;
  } catch (error) {
    console.error('Save learning progress error:', error.response?.data || error);
    throw error.response?.data || { error: 'Failed to save learning progress' };
  }
},

// Save performance data
savePerformanceData: async (performanceData) => {
  try {
    console.log('API Service: Saving performance data', performanceData);
    const response = await apiClient.post('/progress/performance', performanceData);
    return response.data;
  } catch (error) {
    console.error('Save performance data error:', error.response?.data || error);
    throw error.response?.data || { error: 'Failed to save performance data' };
  }
},

// Sync progress data
syncProgressData: async (syncData) => {
  try {
    console.log('API Service: Syncing progress data', syncData);
    const response = await apiClient.post('/progress/sync', syncData);
    return response.data;
  } catch (error) {
    console.error('Sync progress data error:', error.response?.data || error);
    throw error.response?.data || { error: 'Failed to sync progress data' };
  }
},

// Get student progress
getStudentProgress: async (studentId) => {
  try {
    const response = await apiClient.get(`/progress/student/${studentId}`);
    return response.data;
  } catch (error) {
    console.error(`Get student progress error:`, error.response?.data || error);
    throw error.response?.data || { error: 'Failed to fetch student progress' };
  }
},

  // Helper to handle error messages consistently
  handleError: (error) => {
    // Extract error message from various error formats
    if (typeof error === 'string') return error;
    if (error.error) return error.error;
    if (error.message) return error.message;
    if (error.response?.data?.error) return error.response.data.error;
    if (error.response?.data?.message) return error.response.data.message;
    
    return 'An unexpected error occurred';
  }
}

// Export both as default and named export to support different import styles
export { api };
export default api;