// statsService.js
// Service for handling all user statistics and learning metrics

const statsService = {
  /**
   * Get a user's stats from localStorage or API
   * @param {string} userId - The user's ID
   * @returns {Object} The user's statistics
   */
  getUserStats: async (userId) => {
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate by getting from localStorage
      const statsStr = localStorage.getItem(`user_stats_${userId}`);
      
      if (statsStr) {
        return JSON.parse(statsStr);
      }
      
      // Default stats if none exist
      return {
        gamesCompleted: 0,
        points: 0,
        streakDays: 0,
        averageScore: 0,
        gamesPlayed: [],
        lastLoginDate: new Date().toISOString().split('T')[0],
        weeklyProgress: {
          gamesCompletedThisWeek: 0,
          pointsEarnedThisWeek: 0,
          streakGainedThisWeek: 0,
          scoreImprovement: 0
        }
      };
    } catch (error) {
      console.error("Error fetching user stats:", error);
      return null;
    }
  },
  
  /**
   * Update stats after a game is completed
   * @param {string} userId - The user's ID
   * @param {Object} gameData - Data about the completed game
   * @returns {Object} Updated user statistics
   */
  updateGameStats: async (userId, gameData) => {
    try {
      // Get current stats
      const currentStats = await statsService.getUserStats(userId);
      
      // Calculate new values
      const gameIndex = currentStats.gamesPlayed.findIndex(g => g.gameId === gameData.id);
      let newAverageScore = currentStats.averageScore;
      let pointsEarned = gameData.xpReward || 100;
      
      // Add game to played games or update existing
      if (gameIndex >= 0) {
        // Game already played before, update it
        currentStats.gamesPlayed[gameIndex] = {
          ...currentStats.gamesPlayed[gameIndex],
          score: gameData.score,
          timesPlayed: (currentStats.gamesPlayed[gameIndex].timesPlayed || 0) + 1,
          lastPlayed: new Date().toISOString()
        };
      } else {
        // New game
        currentStats.gamesPlayed.push({
          gameId: gameData.id,
          score: gameData.score,
          timesPlayed: 1,
          lastPlayed: new Date().toISOString()
        });
        
        // Increment completed games counter
        currentStats.gamesCompleted++;
        currentStats.weeklyProgress.gamesCompletedThisWeek++;
      }
      
      // Recalculate average score
      if (currentStats.gamesPlayed.length > 0) {
        const totalScore = currentStats.gamesPlayed.reduce((sum, game) => sum + game.score, 0);
        newAverageScore = Math.round(totalScore / currentStats.gamesPlayed.length);
      }
      
      // Update weekly progress
      currentStats.weeklyProgress.pointsEarnedThisWeek += pointsEarned;
      
      // Calculate score improvement (difference between new average and old average)
      const oldAverage = currentStats.averageScore;
      currentStats.weeklyProgress.scoreImprovement = newAverageScore - oldAverage;
      
      // Update final stats
      const updatedStats = {
        ...currentStats,
        points: currentStats.points + pointsEarned,
        averageScore: newAverageScore,
      };
      
      // Save updated stats
      localStorage.setItem(`user_stats_${userId}`, JSON.stringify(updatedStats));
      
      return updatedStats;
    } catch (error) {
      console.error("Error updating game stats:", error);
      return null;
    }
  },
  
  /**
   * Update the user's login streak
   * @param {string} userId - The user's ID
   * @returns {Object} Updated user statistics
   */
  updateLoginStreak: async (userId) => {
    try {
      // Get current stats
      const currentStats = await statsService.getUserStats(userId);
      
      // Get current date and last login date
      const today = new Date().toISOString().split('T')[0];
      const lastLogin = currentStats.lastLoginDate;
      
      // Convert to Date objects for comparison
      const todayDate = new Date(today);
      const lastLoginDate = new Date(lastLogin);
      
      // Calculate difference in days
      const diffTime = Math.abs(todayDate - lastLoginDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Only update streak if it's a different day
      if (today !== lastLogin) {
        let newStreakDays = currentStats.streakDays;
        
        // If last login was yesterday, increase streak
        if (diffDays === 1) {
          newStreakDays++;
          currentStats.weeklyProgress.streakGainedThisWeek++;
        }
        // If more than 1 day has passed, reset streak
        else if (diffDays > 1) {
          newStreakDays = 1; // Reset to 1 for today
          currentStats.weeklyProgress.streakGainedThisWeek = 0;
        }
        
        // Update stats
        const updatedStats = {
          ...currentStats,
          streakDays: newStreakDays,
          lastLoginDate: today
        };
        
        // Save updated stats
        localStorage.setItem(`user_stats_${userId}`, JSON.stringify(updatedStats));
        
        return updatedStats;
      }
      
      return currentStats;
    } catch (error) {
      console.error("Error updating login streak:", error);
      return null;
    }
  },
  
  /**
   * Reset weekly progress stats (typically done at the start of each week)
   * @param {string} userId - The user's ID
   * @returns {Object} Updated user statistics
   */
  resetWeeklyProgress: async (userId) => {
    try {
      // Get current stats
      const currentStats = await statsService.getUserStats(userId);
      
      // Reset weekly progress
      currentStats.weeklyProgress = {
        gamesCompletedThisWeek: 0,
        pointsEarnedThisWeek: 0,
        streakGainedThisWeek: 0,
        scoreImprovement: 0
      };
      
      // Save updated stats
      localStorage.setItem(`user_stats_${userId}`, JSON.stringify(currentStats));
      
      return currentStats;
    } catch (error) {
      console.error("Error resetting weekly progress:", error);
      return null;
    }
  }
};

export default statsService;