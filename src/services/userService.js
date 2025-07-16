// src/services/userService.js - Frontend service for your existing backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class UserService {
  // Get auth token from localStorage
  getToken() {
    return localStorage.getItem('token');
  }

  // Set auth token
  setToken(token) {
    localStorage.setItem('token', token);
  }

  // Remove auth token
  removeToken() {
    localStorage.removeItem('token');
  }

  // Get auth headers
  getAuthHeaders() {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Login user
  async login(email, password, role = null) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (data.success) {
        this.setToken(data.token);
        return { success: true, user: data.user, token: data.token };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error' };
    }
  }

  // Register user
  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.success) {
        this.setToken(data.token);
        return { success: true, user: data.user, token: data.token };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Network error' };
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/user`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (data.success) {
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Get current user error:', error);
      return { success: false, error: 'Network error' };
    }
  }

  // Logout user
  async logout() {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.removeToken();
    }
  }

  // Get all users by role (for admin)
  async getUsersByRole(role) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/role/${role}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (data.success) {
        return { success: true, users: data.data };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Get users by role error:', error);
      return { success: false, error: 'Network error' };
    }
  }

  // Get all students (for admin dashboard)
  async getStudents() {
    return this.getUsersByRole('student');
  }

  // Get all teachers (for admin dashboard)
  async getTeachers() {
    return this.getUsersByRole('teacher');
  }

  // Get all schools (for admin dashboard)
  async getSchools() {
    return this.getUsersByRole('school');
  }

  // Get all admins (for super admin)
  async getAdmins() {
    return this.getUsersByRole('admin');
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getToken();
  }

  // Check user role (requires current user data)
  hasRole(requiredRole, userRole) {
    return userRole === requiredRole;
  }

  // Check if user is admin
  isAdmin(userRole) {
    return userRole === 'admin';
  }
}

export default new UserService();