import { api, endpoints } from './api';

class DataService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
    this.useLocalStorage = process.env.NODE_ENV === 'development';
  }

  // Simulate API delay
  delay(ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Generic CRUD operations
  async create(endpoint, data) {
    try {
      await this.delay();
      const response = await api.post(endpoint, data);
      return response;
    } catch (error) {
      throw new Error(`Failed to create data: ${error.message}`);
    }
  }

  async read(endpoint, params = {}) {
    try {
      await this.delay();
      const response = await api.get(endpoint, params);
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error.message}`);
    }
  }

  async update(endpoint, data) {
    try {
      await this.delay();
      const response = await api.put(endpoint, data);
      return response;
    } catch (error) {
      throw new Error(`Failed to update data: ${error.message}`);
    }
  }

  async delete(endpoint) {
    try {
      await this.delay();
      const response = await api.delete(endpoint);
      return response;
    } catch (error) {
      throw new Error(`Failed to delete data: ${error.message}`);
    }
  }

  // Student data operations
  async getStudents(filters = {}) {
    try {
      if (this.useLocalStorage) {
        const mockStudents = [
          {
            id: 1,
            name: 'Alice Johnson',
            email: 'alice@example.com',
            class: '10-A',
            grade: '10th',
            totalGames: 45,
            avgScore: 87.5,
            status: 'active',
            lastActive: new Date().toISOString()
          },
          {
            id: 2,
            name: 'Bob Smith',
            email: 'bob@example.com',
            class: '10-A',
            grade: '10th',
            totalGames: 38,
            avgScore: 82.3,
            status: 'active',
            lastActive: new Date(Date.now() - 86400000).toISOString()
          }
        ];

        return {
          success: true,
          data: mockStudents.filter(student => {
            if (filters.class && student.class !== filters.class) return false;
            if (filters.grade && student.grade !== filters.grade) return false;
            if (filters.status && student.status !== filters.status) return false;
            return true;
          })
        };
      }

      return await this.read(endpoints.students.list, filters);
    } catch (error) {
      throw new Error(`Failed to fetch students: ${error.message}`);
    }
  }

  async getStudentById(studentId) {
    try {
      if (this.useLocalStorage) {
        // Mock detailed student data
        const mockStudent = {
          id: studentId,
          name: 'Alice Johnson',
          email: 'alice@example.com',
          class: '10-A',
          grade: '10th',
          totalGames: 45,
          avgScore: 87.5,
          status: 'active',
          lastActive: new Date().toISOString(),
          gamesPlayed: [
            { gameId: 1, gameName: 'Algebra Quest', score: 94, date: '2025-01-20' },
            { gameId: 2, gameName: 'Number Ninja', score: 87, date: '2025-01-19' }
          ],
          achievements: [
            { id: 1, name: 'First Steps', unlockedAt: '2025-01-15' },
            { id: 2, name: 'Speed Demon', unlockedAt: '2025-01-18' }
          ]
        };

        return {
          success: true,
          data: mockStudent
        };
      }

      return await this.read(endpoints.students.get(studentId));
    } catch (error) {
      throw new Error(`Failed to fetch student: ${error.message}`);
    }
  }

  async createStudent(studentData) {
    try {
      if (this.useLocalStorage) {
        const newStudent = {
          ...studentData,
          id: Date.now(),
          totalGames: 0,
          avgScore: 0,
          status: 'active',
          createdAt: new Date().toISOString()
        };

        return {
          success: true,
          data: newStudent,
          message: 'Student created successfully'
        };
      }

      return await this.create(endpoints.students.create, studentData);
    } catch (error) {
      throw new Error(`Failed to create student: ${error.message}`);
    }
  }

  // Score data operations
  async getScores(filters = {}) {
    try {
      if (this.useLocalStorage) {
        const mockScores = [
          {
            id: 1,
            studentId: 1,
            studentName: 'Alice Johnson',
            gameId: 1,
            gameName: 'Algebra Quest',
            score: 94,
            percentage: 94,
            timeSpent: 1120,
            completedAt: '2025-01-20T10:30:00Z'
          },
          {
            id: 2,
            studentId: 1,
            studentName: 'Alice Johnson',
            gameId: 2,
            gameName: 'Number Ninja',
            score: 87,
            percentage: 87,
            timeSpent: 765,
            completedAt: '2025-01-19T14:15:00Z'
          }
        ];

        return {
          success: true,
          data: mockScores.filter(score => {
            if (filters.studentId && score.studentId !== filters.studentId) return false;
            if (filters.gameId && score.gameId !== filters.gameId) return false;
            if (filters.startDate && new Date(score.completedAt) < new Date(filters.startDate)) return false;
            if (filters.endDate && new Date(score.completedAt) > new Date(filters.endDate)) return false;
            return true;
          })
        };
      }

      return await this.read(endpoints.scores.list, filters);
    } catch (error) {
      throw new Error(`Failed to fetch scores: ${error.message}`);
    }
  }

  async createScore(scoreData) {
    try {
      if (this.useLocalStorage) {
        const newScore = {
          ...scoreData,
          id: Date.now(),
          createdAt: new Date().toISOString()
        };

        return {
          success: true,
          data: newScore,
          message: 'Score saved successfully'
        };
      }

      return await this.create(endpoints.scores.create, scoreData);
    } catch (error) {
      throw new Error(`Failed to save score: ${error.message}`);
    }
  }

  // Analytics data operations
  async getDashboardStats(userRole, userId = null) {
    try {
      await this.delay();

      if (this.useLocalStorage) {
        const mockStats = {
          admin: {
            totalUsers: 15420,
            totalSchools: 45,
            totalGames: 23,
            totalGamePlays: 156789,
            activeUsers: 8743,
            avgEngagementTime: 18.5
          },
          school: {
            totalTeachers: 45,
            totalStudents: 1240,
            totalClasses: 32,
            averageScore: 78.5,
            gamesPlayed: 5680,
            activeToday: 456
          },
          teacher: {
            totalStudents: 156,
            totalClasses: 6,
            averageScore: 82.3,
            pendingDoubts: 8,
            gamesAssigned: 12,
            completionRate: 78
          },
          student: {
            gamesPlayed: 15,
            totalScore: 2450,
            averageScore: 85,
            currentStreak: 5,
            nextLevel: 'Advanced',
            progressToNext: 75
          }
        };

        return {
          success: true,
          data: mockStats[userRole] || {}
        };
      }

      return await this.read(`/dashboard/stats/${userRole}`, { userId });
    } catch (error) {
      throw new Error(`Failed to fetch dashboard stats: ${error.message}`);
    }
  }

  async getPerformanceData(filters = {}) {
    try {
      await this.delay();

      if (this.useLocalStorage) {
        const mockPerformanceData = [
          { label: 'Mon', value: 78, games: 3 },
          { label: 'Tue', value: 82, games: 4 },
          { label: 'Wed', value: 75, games: 2 },
          { label: 'Thu', value: 88, games: 5 },
          { label: 'Fri', value: 91, games: 4 },
          { label: 'Sat', value: 85, games: 6 },
          { label: 'Sun', value: 89, games: 3 }
        ];

        return {
          success: true,
          data: mockPerformanceData
        };
      }

      return await this.read('/analytics/performance', filters);
    } catch (error) {
      throw new Error(`Failed to fetch performance data: ${error.message}`);
    }
  }

  // Report generation
  async generateReport(reportType, filters = {}) {
    try {
      await this.delay(1500); // Reports take longer to generate

      if (this.useLocalStorage) {
        const mockReport = {
          id: Date.now(),
          type: reportType,
          filters,
          generatedAt: new Date().toISOString(),
          data: {
            summary: {
              totalRecords: Math.floor(Math.random() * 1000) + 100,
              averageScore: Math.floor(Math.random() * 30) + 70,
              timeRange: filters.timeRange || '30days'
            },
            details: Array.from({ length: 10 }, (_, i) => ({
              id: i + 1,
              name: `Item ${i + 1}`,
              value: Math.floor(Math.random() * 100),
              date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
            }))
          }
        };

        return {
          success: true,
          data: mockReport,
          message: 'Report generated successfully'
        };
      }

      return await this.create('/reports/generate', { type: reportType, filters });
    } catch (error) {
      throw new Error(`Failed to generate report: ${error.message}`);
    }
  }

  async exportData(dataType, format = 'csv', filters = {}) {
    try {
      await this.delay(1000);

      if (this.useLocalStorage) {
        // Mock export - in reality this would return a file download URL
        const mockExport = {
          downloadUrl: `https://api.cognify.com/exports/${Date.now()}.${format}`,
          filename: `${dataType}_export_${new Date().toISOString().split('T')[0]}.${format}`,
          size: Math.floor(Math.random() * 1000) + 100 + 'KB',
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        };

        return {
          success: true,
          data: mockExport,
          message: 'Export ready for download'
        };
      }

      return await this.create('/data/export', { type: dataType, format, filters });
    } catch (error) {
      throw new Error(`Failed to export data: ${error.message}`);
    }
  }

  // Data aggregation and statistics
  async getAggregatedData(metric, groupBy, filters = {}) {
    try {
      await this.delay();

      if (this.useLocalStorage) {
        const mockAggregatedData = {
          scores_by_subject: [
            { subject: 'Algebra', average: 82.3, count: 156 },
            { subject: 'Geometry', average: 75.8, count: 134 },
            { subject: 'Arithmetic', average: 87.1, count: 198 },
            { subject: 'Statistics', average: 73.2, count: 89 }
          ],
          games_by_difficulty: [
            { difficulty: 'easy', average: 85.2, count: 245 },
            { difficulty: 'medium', average: 78.9, count: 189 },
            { difficulty: 'hard', average: 69.4, count: 124 }
          ],
          students_by_class: [
            { class: '10-A', average: 84.1, count: 28 },
            { class: '10-B', average: 79.3, count: 31 },
            { class: '9-A', average: 81.7, count: 35 }
          ]
        };

        const key = `${metric}_by_${groupBy}`;
        return {
          success: true,
          data: mockAggregatedData[key] || []
        };
      }

      return await this.read('/analytics/aggregate', { metric, groupBy, ...filters });
    } catch (error) {
      throw new Error(`Failed to fetch aggregated data: ${error.message}`);
    }
  }

  // Search functionality
  async searchData(query, type = 'all', filters = {}) {
    try {
      await this.delay(300);

      if (this.useLocalStorage) {
        const mockSearchResults = {
          students: [
            { id: 1, type: 'student', name: 'Alice Johnson', class: '10-A', relevance: 0.95 },
            { id: 2, type: 'student', name: 'Alice Brown', class: '9-B', relevance: 0.87 }
          ],
          games: [
            { id: 1, type: 'game', name: 'Algebra Quest', category: 'algebra', relevance: 0.92 }
          ],
          teachers: [
            { id: 1, type: 'teacher', name: 'Ms. Alice Wilson', subject: 'Mathematics', relevance: 0.89 }
          ]
        };

        let results = [];
        if (type === 'all') {
          results = Object.values(mockSearchResults).flat();
        } else {
          results = mockSearchResults[type] || [];
        }

        // Filter by query
        const filteredResults = results.filter(item =>
          item.name.toLowerCase().includes(query.toLowerCase())
        );

        return {
          success: true,
          data: filteredResults.sort((a, b) => b.relevance - a.relevance)
        };
      }

      return await this.read('/search', { q: query, type, ...filters });
    } catch (error) {
      throw new Error(`Failed to search: ${error.message}`);
    }
  }

  // Data validation and sanitization
  validateAndSanitizeData(data, schema) {
    const sanitized = { ...data };
    const errors = [];

    Object.keys(schema).forEach(field => {
      const rules = schema[field];
      const value = sanitized[field];

      // Required field validation
      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push(`${field} is required`);
        return;
      }

      // Skip further validation if field is empty and not required
      if (!rules.required && (value === undefined || value === null || value === '')) {
        return;
      }

      // Type validation
      if (rules.type && typeof value !== rules.type) {
        errors.push(`${field} must be of type ${rules.type}`);
      }

      // String validations
      if (rules.type === 'string') {
        if (rules.minLength && value.length < rules.minLength) {
          errors.push(`${field} must be at least ${rules.minLength} characters`);
        }
        if (rules.maxLength && value.length > rules.maxLength) {
          errors.push(`${field} cannot exceed ${rules.maxLength} characters`);
        }
        if (rules.pattern && !rules.pattern.test(value)) {
          errors.push(`${field} format is invalid`);
        }
        // Sanitize string
        sanitized[field] = value.trim();
      }

      // Number validations
      if (rules.type === 'number') {
        if (rules.min !== undefined && value < rules.min) {
          errors.push(`${field} must be at least ${rules.min}`);
        }
        if (rules.max !== undefined && value > rules.max) {
          errors.push(`${field} cannot exceed ${rules.max}`);
        }
      }

      // Array validations
      if (rules.type === 'array') {
        if (rules.minItems && value.length < rules.minItems) {
          errors.push(`${field} must have at least ${rules.minItems} items`);
        }
        if (rules.maxItems && value.length > rules.maxItems) {
          errors.push(`${field} cannot have more than ${rules.maxItems} items`);
        }
      }

      // Enum validation
      if (rules.enum && !rules.enum.includes(value)) {
        errors.push(`${field} must be one of: ${rules.enum.join(', ')}`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      data: sanitized
    };
  }

  // Data transformation utilities
  transformDataForChart(data, chartType) {
    switch (chartType) {
      case 'line':
        return data.map(item => ({
          x: item.date || item.label,
          y: item.value || item.score
        }));

      case 'bar':
        return data.map(item => ({
          category: item.category || item.name,
          value: item.value || item.count
        }));

      case 'pie':
        return data.map(item => ({
          name: item.name || item.category,
          value: item.value || item.percentage,
          color: item.color || this.generateColor()
        }));

      default:
        return data;
    }
  }

  generateColor() {
    const colors = [
      '#00f5ff', '#ff0080', '#39ff14', '#bf00ff', '#ff6600'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // Data caching utilities
  setCachedData(key, data, ttl = 300000) { // 5 minutes default TTL
    if (this.useLocalStorage) {
      const cacheItem = {
        data,
        timestamp: Date.now(),
        ttl
      };
      localStorage.setItem(`cache_${key}`, JSON.stringify(cacheItem));
    }
  }

  getCachedData(key) {
    if (this.useLocalStorage) {
      const cached = localStorage.getItem(`cache_${key}`);
      if (cached) {
        const cacheItem = JSON.parse(cached);
        if (Date.now() - cacheItem.timestamp < cacheItem.ttl) {
          return cacheItem.data;
        } else {
          localStorage.removeItem(`cache_${key}`);
        }
      }
    }
    return null;
  }

  clearCache(pattern = null) {
    if (this.useLocalStorage) {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('cache_')) {
          if (!pattern || key.includes(pattern)) {
            localStorage.removeItem(key);
          }
        }
      });
    }
  }

  // Batch operations
  async batchCreate(endpoint, dataArray) {
    try {
      await this.delay(dataArray.length * 100); // Simulate time based on batch size

      if (this.useLocalStorage) {
        const results = dataArray.map((data, index) => ({
          ...data,
          id: Date.now() + index,
          createdAt: new Date().toISOString()
        }));

        return {
          success: true,
          data: results,
          message: `${results.length} items created successfully`
        };
      }

      return await this.create(`${endpoint}/batch`, { items: dataArray });
    } catch (error) {
      throw new Error(`Failed to batch create: ${error.message}`);
    }
  }

  async batchUpdate(endpoint, updates) {
    try {
      await this.delay(updates.length * 100);

      if (this.useLocalStorage) {
        const results = updates.map(update => ({
          ...update,
          updatedAt: new Date().toISOString()
        }));

        return {
          success: true,
          data: results,
          message: `${results.length} items updated successfully`
        };
      }

      return await this.update(`${endpoint}/batch`, { updates });
    } catch (error) {
      throw new Error(`Failed to batch update: ${error.message}`);
    }
  }

  async batchDelete(endpoint, ids) {
    try {
      await this.delay(ids.length * 50);

      if (this.useLocalStorage) {
        return {
          success: true,
          data: { deletedIds: ids },
          message: `${ids.length} items deleted successfully`
        };
      }

      return await this.delete(`${endpoint}/batch`, { ids });
    } catch (error) {
      throw new Error(`Failed to batch delete: ${error.message}`);
    }
  }

  // Data synchronization
  async syncData(lastSyncTimestamp = null) {
    try {
      await this.delay(1000);

      if (this.useLocalStorage) {
        const mockSyncData = {
          students: { updated: 5, deleted: 0, created: 2 },
          games: { updated: 1, deleted: 0, created: 1 },
          scores: { updated: 15, deleted: 0, created: 23 },
          lastSync: new Date().toISOString()
        };

        return {
          success: true,
          data: mockSyncData,
          message: 'Data synchronized successfully'
        };
      }

      return await this.read('/sync', { lastSync: lastSyncTimestamp });
    } catch (error) {
      throw new Error(`Failed to sync data: ${error.message}`);
    }
  }
}

export const dataService = new DataService();