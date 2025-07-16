// mockApi.js - Complete file with Institution support

import axios from 'axios';

// Export MOCK_DATA so it can be accessed directly
export const MOCK_DATA = {
  // Admin profile data
  adminProfile: {
    id: 'admin_1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    avatar: '/assets/avatars/admin-avatar.png',
    department: 'IT Administration',
    joinDate: '2023-01-15',
    lastLogin: new Date().toISOString(),
    permissions: ['full_access', 'user_management', 'system_settings']
  },
  
  // Schools/institutions data
  schools: [
    {
      id: 'school_1',
      name: 'Lincoln High School',
      type: 'High School',
      address: '123 Education Ave, Lincoln, NE 68501',
      students: 1250,
      teachers: 78,
      principal: 'Dr. Sarah Williams',
      status: 'active',
      joinDate: '2023-02-10'
    },
    {
      id: 'school_2',
      name: 'Greenwood Elementary',
      type: 'Elementary School',
      address: '456 Learning Lane, Greenwood, NE 68366',
      students: 580,
      teachers: 35,
      principal: 'Mr. James Peterson',
      status: 'active',
      joinDate: '2023-03-15'
    },
    {
      id: 'school_3',
      name: 'Riverside Middle School',
      type: 'Middle School',
      address: '789 Knowledge Dr, Riverside, NE 68327',
      students: 720,
      teachers: 45,
      principal: 'Ms. Lisa Johnson',
      status: 'active',
      joinDate: '2023-01-20'
    }
  ],
  
  // Initialize institutions array
  institutions: [],
  
  // Teachers data
  teachers: [
    {
      id: 'teacher_1',
      name: 'Jane Smith',
      email: 'jsmith@lincolnhs.edu',
      subject: 'Mathematics',
      school: 'Lincoln High School',
      students: 120,
      status: 'active'
    },
    {
      id: 'teacher_2',
      name: 'Robert Johnson',
      email: 'rjohnson@lincolnhs.edu',
      subject: 'Science',
      school: 'Lincoln High School',
      students: 95,
      status: 'active'
    }
  ],
  
  // Students data
  students: [
    {
      id: 'student_1',
      name: 'Sarah Johnson',
      email: 'sjohnson@student.lincolnhs.edu',
      grade: '11',
      school: 'Lincoln High School',
      enrollmentDate: '2022-08-15',
      status: 'active'
    },
    {
      id: 'student_2',
      name: 'Michael Williams',
      email: 'mwilliams@student.lincolnhs.edu',
      grade: '10',
      school: 'Lincoln High School',
      enrollmentDate: '2022-08-15',
      status: 'active'
    }
  ],
  
  // Dashboard analytics data
  dashboardAnalytics: {
    totalSchools: 35,
    totalTeachers: 580,
    totalStudents: 8750,
    activeUsers: 9420,
    monthlySummary: {
      newSchools: 2,
      newTeachers: 15,
      newStudents: 120
    },
    activityBreakdown: {
      logins: 5240,
      lessons: 920,
      assignments: 2150,
      quizzes: 780
    },
    recentActivity: [
      {
        id: 1,
        type: 'registration',
        details: 'New Student Registration',
        description: 'Sarah Johnson joined Lincoln High School',
        timestamp: new Date(Date.now() - 120000).toISOString() // 2 min ago
      },
      {
        id: 2,
        type: 'school',
        details: 'School Added',
        description: 'Greenwood Elementary was added to the platform',
        timestamp: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
      },
      {
        id: 3,
        type: 'score',
        details: 'Score Submitted',
        description: 'High score in Algebra Quest simulation',
        timestamp: new Date(Date.now() - 10800000).toISOString() // 3 hours ago
      }
    ]
  }
};

// Add function to save data to localStorage
export const saveStoredData = (key, data) => {
  try {
    localStorage.setItem(`mock_${key}`, JSON.stringify(data));
    console.log(`✅ Saved mock ${key} to localStorage`);
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

// Function to save an institution
export const saveInstitution = (institutionData) => {
  try {
    // Parse the data if it's a string (from JSON)
    const data = typeof institutionData === 'string' 
      ? JSON.parse(institutionData) 
      : institutionData;
    
    // Create new institution with ID and timestamps
    const newInstitution = {
      ...data,
      id: `inst_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: data.status || 'Active'
    };
    
    // Add to array
    MOCK_DATA.institutions.push(newInstitution);
    
    // Save to localStorage
    saveStoredData('institutions', MOCK_DATA.institutions);
    
    console.log('✅ Saved institution to mock data:', newInstitution);
    return newInstitution;
  } catch (error) {
    console.error('Error saving institution to mock data:', error);
    return null;
  }
};

// Function to update an institution
export const updateInstitution = (id, updateData) => {
  try {
    // Find the institution
    const index = MOCK_DATA.institutions.findIndex(inst => inst.id === id);
    if (index === -1) {
      console.error(`❌ Institution with id ${id} not found`);
      return null;
    }
    
    // Update the institution
    MOCK_DATA.institutions[index] = {
      ...MOCK_DATA.institutions[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    // Save to localStorage
    saveStoredData('institutions', MOCK_DATA.institutions);
    
    console.log(`✅ Updated institution ${id}:`, MOCK_DATA.institutions[index]);
    return MOCK_DATA.institutions[index];
  } catch (error) {
    console.error(`Error updating institution ${id}:`, error);
    return null;
  }
};

// Function to delete an institution
export const deleteInstitution = (id) => {
  try {
    // Find the institution
    const index = MOCK_DATA.institutions.findIndex(inst => inst.id === id);
    if (index === -1) {
      console.error(`❌ Institution with id ${id} not found`);
      return false;
    }
    
    // Remove the institution
    MOCK_DATA.institutions.splice(index, 1);
    
    // Save to localStorage
    saveStoredData('institutions', MOCK_DATA.institutions);
    
    console.log(`✅ Deleted institution ${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting institution ${id}:`, error);
    return false;
  }
};

// Add function to load data from localStorage
const loadStoredData = () => {
  try {
    // Load schools
    const storedSchools = localStorage.getItem('mock_schools');
    if (storedSchools) {
      MOCK_DATA.schools = JSON.parse(storedSchools);
      console.log('✅ Loaded mock schools from localStorage');
    }
    
    // Load institutions
    const storedInstitutions = localStorage.getItem('mock_institutions');
    if (storedInstitutions) {
      MOCK_DATA.institutions = JSON.parse(storedInstitutions);
      console.log('✅ Loaded mock institutions from localStorage');
    } else {
      MOCK_DATA.institutions = []; // Initialize as empty array if not found
    }
    
    // Load other data types if needed
    // const storedTeachers = localStorage.getItem('mock_teachers');
    // if (storedTeachers) {
    //   MOCK_DATA.teachers = JSON.parse(storedTeachers);
    //   console.log('✅ Loaded mock teachers from localStorage');
    // }
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    // Initialize institutions as empty array if error occurs
    MOCK_DATA.institutions = [];
  }
};

// Load data when the file is executed
loadStoredData();

// Configuration
const MOCK_CONFIG = {
  enabled: true, // Make sure this is true to use mock data
  delay: 500, // Simulated network delay in ms
  logRequests: true
};

// Create custom axios instance for the interceptor
const mockAxios = axios.create();

// Helper to parse request body data
const parseRequestBody = (config) => {
  try {
    if (!config.data) return {};
    return typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
  } catch (error) {
    console.error('Error parsing request body:', error);
    return {};
  }
};

// Request interceptor to handle specific requests
mockAxios.interceptors.request.use(
  async (config) => {
    // Only intercept if mock mode is enabled
    if (!MOCK_CONFIG.enabled) {
      return config;
    }
    
    const { url, method } = config;
    
    if (MOCK_CONFIG.logRequests) {
      console.log(`🔶 MOCK API: Intercepting ${method.toUpperCase()} ${url}`);
    }
    
    // Add delay to simulate network
    if (MOCK_CONFIG.delay > 0) {
      await new Promise(resolve => setTimeout(resolve, MOCK_CONFIG.delay));
    }
    
    // Handle specific API endpoints
    // Admin profile endpoint
    if (url.includes('/admin/profile')) {
      const mockResponse = {
        status: 200,
        data: MOCK_DATA.adminProfile
      };
      console.log('✅ MOCK API: Returning admin profile data');
      return Promise.reject({ response: mockResponse, isIntercepted: true });
    }
    
    // INSTITUTION ENDPOINTS
    // GET all institutions
    else if (url.includes('/institutions') && method.toLowerCase() === 'get' && !url.includes('/institutions/')) {
      const mockResponse = {
        status: 200,
        data: {
          success: true,
          data: {
            institutions: MOCK_DATA.institutions,
            pagination: {
              total: MOCK_DATA.institutions.length,
              page: 1,
              pages: 1,
              limit: MOCK_DATA.institutions.length
            }
          }
        }
      };
      console.log('✅ MOCK API: Returning all institutions');
      return Promise.reject({ response: mockResponse, isIntercepted: true });
    }
    
    // GET single institution
    else if (url.match(/\/institutions\/[^/]+$/) && method.toLowerCase() === 'get') {
      const id = url.split('/').pop();
      const institution = MOCK_DATA.institutions.find(inst => inst.id === id);
      
      if (institution) {
        const mockResponse = {
          status: 200,
          data: {
            success: true,
            data: institution
          }
        };
        console.log(`✅ MOCK API: Returning institution ${id}`);
        return Promise.reject({ response: mockResponse, isIntercepted: true });
      } else {
        const mockResponse = {
          status: 404,
          data: {
            success: false,
            error: `Institution not found with id of ${id}`
          }
        };
        console.log(`❌ MOCK API: Institution ${id} not found`);
        return Promise.reject({ response: mockResponse, isIntercepted: true });
      }
    }
    
    // POST create new institution
    else if (url.includes('/institutions') && method.toLowerCase() === 'post') {
      try {
        const requestData = parseRequestBody(config);
        console.log('🔶 MOCK API: Creating institution with data:', requestData);
        
        // Create new institution
        const newInstitution = saveInstitution(requestData);
        
        // Update dashboard analytics
        MOCK_DATA.dashboardAnalytics.monthlySummary.newSchools += 1;
        
        const mockResponse = {
          status: 201,
          data: {
            success: true,
            data: {
              institution: newInstitution,
              school: null // This would be the school account info if createSchoolAccount is true
            }
          }
        };
        
        console.log('✅ MOCK API: Created new institution');
        return Promise.reject({ response: mockResponse, isIntercepted: true });
      } catch (error) {
        console.error('Error in mock institution creation:', error);
        const errorResponse = {
          status: 500,
          data: {
            success: false,
            error: 'Failed to create institution in mock API'
          }
        };
        return Promise.reject({ response: errorResponse, isIntercepted: true });
      }
    }
    
    // PUT update institution
    else if (url.match(/\/institutions\/[^/]+$/) && method.toLowerCase() === 'put') {
      try {
        const id = url.split('/').pop();
        const requestData = parseRequestBody(config);
        console.log(`🔶 MOCK API: Updating institution ${id} with data:`, requestData);
        
        const updatedInstitution = updateInstitution(id, requestData);
        
        if (updatedInstitution) {
          const mockResponse = {
            status: 200,
            data: {
              success: true,
              data: updatedInstitution
            }
          };
          console.log(`✅ MOCK API: Updated institution ${id}`);
          return Promise.reject({ response: mockResponse, isIntercepted: true });
        } else {
          const mockResponse = {
            status: 404,
            data: {
              success: false,
              error: `Institution not found with id of ${id}`
            }
          };
          console.log(`❌ MOCK API: Institution ${id} not found for update`);
          return Promise.reject({ response: mockResponse, isIntercepted: true });
        }
      } catch (error) {
        console.error('Error in mock institution update:', error);
        const errorResponse = {
          status: 500,
          data: {
            success: false,
            error: 'Failed to update institution in mock API'
          }
        };
        return Promise.reject({ response: errorResponse, isIntercepted: true });
      }
    }
    
    // DELETE institution
    else if (url.match(/\/institutions\/[^/]+$/) && method.toLowerCase() === 'delete') {
      try {
        const id = url.split('/').pop();
        console.log(`🔶 MOCK API: Deleting institution ${id}`);
        
        const deleted = deleteInstitution(id);
        
        if (deleted) {
          const mockResponse = {
            status: 200,
            data: {
              success: true,
              data: {}
            }
          };
          console.log(`✅ MOCK API: Deleted institution ${id}`);
          return Promise.reject({ response: mockResponse, isIntercepted: true });
        } else {
          const mockResponse = {
            status: 404,
            data: {
              success: false,
              error: `Institution not found with id of ${id}`
            }
          };
          console.log(`❌ MOCK API: Institution ${id} not found for deletion`);
          return Promise.reject({ response: mockResponse, isIntercepted: true });
        }
      } catch (error) {
        console.error('Error in mock institution deletion:', error);
        const errorResponse = {
          status: 500,
          data: {
            success: false,
            error: 'Failed to delete institution in mock API'
          }
        };
        return Promise.reject({ response: errorResponse, isIntercepted: true });
      }
    }
    
    // GET institution stats
    else if (url.includes('/institutions/stats/summary') && method.toLowerCase() === 'get') {
      const active = MOCK_DATA.institutions.filter(inst => inst.status === 'Active').length;
      const pending = MOCK_DATA.institutions.filter(inst => inst.status === 'Pending').length;
      const inactive = MOCK_DATA.institutions.filter(inst => inst.status === 'Inactive').length;
      
      const publicCount = MOCK_DATA.institutions.filter(inst => inst.type === 'Public').length;
      const privateCount = MOCK_DATA.institutions.filter(inst => inst.type === 'Private').length;
      const charterCount = MOCK_DATA.institutions.filter(inst => inst.type === 'Charter').length;
      const otherCount = MOCK_DATA.institutions.filter(inst => inst.type === 'Other').length;
      
      const mockResponse = {
        status: 200,
        data: {
          success: true,
          data: {
            counts: {
              total: MOCK_DATA.institutions.length,
              active,
              pending,
              inactive
            },
            types: {
              public: publicCount,
              private: privateCount,
              charter: charterCount,
              other: otherCount
            },
            people: {
              totalStudents: MOCK_DATA.dashboardAnalytics.totalStudents,
              totalTeachers: MOCK_DATA.dashboardAnalytics.totalTeachers
            },
            recentInstitutions: MOCK_DATA.institutions
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 5)
              .map(inst => ({
                name: inst.name,
                type: inst.type,
                location: inst.location,
                status: inst.status,
                createdAt: inst.createdAt
              }))
          }
        }
      };
      console.log('✅ MOCK API: Returning institution stats');
      return Promise.reject({ response: mockResponse, isIntercepted: true });
    }
    
    // Schools endpoint (legacy support)
    else if (url.includes('/schools') && method.toLowerCase() === 'get') {
      const mockResponse = {
        status: 200,
        data: MOCK_DATA.schools
      };
      console.log('✅ MOCK API: Returning schools data');
      return Promise.reject({ response: mockResponse, isIntercepted: true });
    }
    
    // Teachers endpoint
    else if (url.includes('/teachers')) {
      const mockResponse = {
        status: 200,
        data: MOCK_DATA.teachers
      };
      console.log('✅ MOCK API: Returning teachers data');
      return Promise.reject({ response: mockResponse, isIntercepted: true });
    }
    
    // Students endpoint
    else if (url.includes('/students')) {
      const mockResponse = {
        status: 200,
        data: MOCK_DATA.students
      };
      console.log('✅ MOCK API: Returning students data');
      return Promise.reject({ response: mockResponse, isIntercepted: true });
    }
    
    // Dashboard analytics endpoint
    else if (url.includes('/dashboard') || url.includes('/analytics')) {
      const mockResponse = {
        status: 200,
        data: MOCK_DATA.dashboardAnalytics
      };
      console.log('✅ MOCK API: Returning dashboard analytics data');
      return Promise.reject({ response: mockResponse, isIntercepted: true });
    }
    
    // Continue with original request if not intercepted
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor to return mock data
mockAxios.interceptors.response.use(
  response => response,
  error => {
    // Check if this was our mock response
    if (error.isIntercepted && error.response) {
      return Promise.resolve(error.response);
    }
    
    // Otherwise pass the error through
    return Promise.reject(error);
  }
);

// Initialize the mock API by replacing the original axios instance
export const initMockApi = () => {
  if (MOCK_CONFIG.enabled) {
    console.log('🔶 MOCK API: Initializing mock API interceptor');
    // Replace the global axios instance with our intercepted version
    Object.assign(axios, mockAxios);
    
    // Also override the axios.create method to ensure new instances have the interceptors
    const originalCreate = axios.create;
    axios.create = function(...args) {
      const instance = originalCreate.apply(this, args);
      // Apply the same interceptors to new instances
      instance.interceptors.request.use(mockAxios.interceptors.request.handlers[0].fulfilled, 
                                        mockAxios.interceptors.request.handlers[0].rejected);
      instance.interceptors.response.use(mockAxios.interceptors.response.handlers[0].fulfilled,
                                        mockAxios.interceptors.response.handlers[0].rejected);
      return instance;
    };
    
    return true;
  }
  return false;
};

// Provide helper to check if mock mode is enabled
export const isMockEnabled = () => MOCK_CONFIG.enabled;

// Allow toggling mock mode at runtime
export const toggleMockMode = (enabled = true) => {
  MOCK_CONFIG.enabled = enabled;
  console.log(`🔶 MOCK API: Mock mode ${enabled ? 'enabled' : 'disabled'}`);
  return MOCK_CONFIG.enabled;
};

// Custom helper for services to use
export const getMockData = (key) => {
  if (MOCK_CONFIG.enabled && MOCK_DATA[key]) {
    return MOCK_DATA[key];
  }
  return null;
};

export default {
  initMockApi,
  isMockEnabled,
  toggleMockMode,
  getMockData,
  MOCK_DATA,
  saveStoredData,
  saveInstitution,
  updateInstitution,
  deleteInstitution
};