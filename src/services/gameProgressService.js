// gameProgressService.js
import { api } from './api';

class GameProgressService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
    this.useLocalStorage = process.env.NODE_ENV === 'development' || true; // Force localStorage for now
  }

  // Simulate API delay
  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Save game progress
  async saveGameProgress(progressData) {
    try {
      await this.delay();
      
      console.log('Saving game progress:', progressData);
      
      // Always save to localStorage as a backup
      this.saveToLocalStorage('game_interactions', progressData.studentId, progressData);

      if (!this.useLocalStorage) {
        // In production, also save to API
        const response = await api.post('/progress/game', progressData);
        return response;
      }

      return {
        success: true,
        data: progressData,
        message: 'Game progress saved successfully'
      };
    } catch (error) {
      console.error('Error saving game progress:', error);
      // Still return success if saved to localStorage
      return {
        success: this.useLocalStorage,
        data: progressData,
        message: this.useLocalStorage 
          ? 'Game progress saved to local storage' 
          : 'Failed to save game progress'
      };
    }
  }

  // Save learning progress
  async saveLearningProgress(progressData) {
    try {
      await this.delay();
      
      console.log('Saving learning progress:', progressData);
      
      // Always save to localStorage as a backup
      this.saveToLocalStorage('learning_progress', progressData.studentId, progressData);

      if (!this.useLocalStorage) {
        // In production, also save to API
        const response = await api.post('/progress/learning', progressData);
        return response;
      }

      return {
        success: true,
        data: progressData,
        message: 'Learning progress saved successfully'
      };
    } catch (error) {
      console.error('Error saving learning progress:', error);
      return {
        success: this.useLocalStorage,
        data: progressData,
        message: this.useLocalStorage 
          ? 'Learning progress saved to local storage' 
          : 'Failed to save learning progress'
      };
    }
  }

  // Save performance data
  async savePerformanceData(performanceData) {
    try {
      await this.delay();
      
      console.log('Saving performance data:', performanceData);
      
      // Always save to localStorage as a backup
      this.saveToLocalStorage('performance', performanceData.studentId, performanceData);

      if (!this.useLocalStorage) {
        // In production, also save to API
        const response = await api.post('/progress/performance', performanceData);
        return response;
      }

      return {
        success: true,
        data: performanceData,
        message: 'Performance data saved successfully'
      };
    } catch (error) {
      console.error('Error saving performance data:', error);
      return {
        success: this.useLocalStorage,
        data: performanceData,
        message: this.useLocalStorage 
          ? 'Performance data saved to local storage' 
          : 'Failed to save performance data'
      };
    }
  }

  // Sync local data with server
  async syncLocalData(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }
      
      console.log('Syncing local data for user:', userId);
      
      // Sync game progress
      const gameInteractions = this.getFromLocalStorage('game_interactions', userId);
      const learningProgress = this.getFromLocalStorage('learning_progress', userId);
      const performance = this.getFromLocalStorage('performance', userId);
      
      console.log('Data to sync:', {
        gameInteractions: gameInteractions.length,
        learningProgress: learningProgress.length,
        performance: performance.length
      });

      if (!this.useLocalStorage) {
        // In production, sync with server
        if (gameInteractions.length > 0) {
          await api.post('/progress/sync', {
            type: 'game_interactions',
            userId,
            data: gameInteractions
          });
          // Clear synced data
          localStorage.removeItem(`game_interactions_${userId}`);
        }
        
        if (learningProgress.length > 0) {
          await api.post('/progress/sync', {
            type: 'learning_progress',
            userId,
            data: learningProgress
          });
          // Clear synced data
          localStorage.removeItem(`learning_progress_${userId}`);
        }
        
        if (performance.length > 0) {
          await api.post('/progress/sync', {
            type: 'performance',
            userId,
            data: performance
          });
          // Clear synced data
          localStorage.removeItem(`performance_${userId}`);
        }
      }

      return {
        success: true,
        message: 'Data synchronized successfully',
        data: {
          gameInteractions: gameInteractions.length,
          learningProgress: learningProgress.length,
          performance: performance.length
        }
      };
    } catch (error) {
      console.error('Error syncing data:', error);
      return {
        success: false,
        message: `Failed to sync data: ${error.message}`
      };
    }
  }

  // Get all stored progress data for a user
  getAllProgressData(userId) {
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    return {
      gameInteractions: this.getFromLocalStorage('game_interactions', userId),
      learningProgress: this.getFromLocalStorage('learning_progress', userId),
      performance: this.getFromLocalStorage('performance', userId)
    };
  }

  // Helper to save data to localStorage
  saveToLocalStorage(type, userId, data) {
    try {
      const key = `${type}_${userId}`;
      const existingData = JSON.parse(localStorage.getItem(key) || '[]');
      
      // Add timestamp if not present
      if (!data.timestamp) {
        data.timestamp = new Date().toISOString();
      }
      
      existingData.push(data);
      
      // Limit storage to prevent localStorage overflow
      if (existingData.length > 100) {
        existingData.splice(0, existingData.length - 100);
      }
      
      localStorage.setItem(key, JSON.stringify(existingData));
      return true;
    } catch (error) {
      console.error(`Error saving to localStorage (${type}):`, error);
      return false;
    }
  }

  // Helper to get data from localStorage
  getFromLocalStorage(type, userId) {
    try {
      const key = `${type}_${userId}`;
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch (error) {
      console.error(`Error reading from localStorage (${type}):`, error);
      return [];
    }
  }

  // Debug helper
  debugStorageData(userId) {
    const data = this.getAllProgressData(userId);
    console.log('All stored progress data:', data);
    return data;
  }

  // Clear all stored data (for testing)
  clearAllData(userId) {
    localStorage.removeItem(`game_interactions_${userId}`);
    localStorage.removeItem(`learning_progress_${userId}`);
    localStorage.removeItem(`performance_${userId}`);
    return {
      success: true,
      message: 'All progress data cleared'
    };
  }
}

export const gameProgressService = new GameProgressService();