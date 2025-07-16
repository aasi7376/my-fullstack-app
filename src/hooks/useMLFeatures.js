// src/hooks/useMLFeatures.js
import { useState, useEffect, useCallback } from 'react';
import mlService from '../services/mlService';

/**
 * Custom hook for accessing ML features in React components
 * @param {string} studentId - The student's ID
 * @returns {Object} ML feature methods and state
 */
const useMLFeatures = (studentId) => {
  // State for recommendations
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [recommendationsError, setRecommendationsError] = useState(null);

  // State for learning path
  const [learningPath, setLearningPath] = useState([]);
  const [learningPathLoading, setLearningPathLoading] = useState(false);
  const [learningPathError, setLearningPathError] = useState(null);

  // Fetch game recommendations
  const fetchRecommendations = useCallback(async () => {
    if (!studentId) return;

    try {
      setRecommendationsLoading(true);
      setRecommendationsError(null);
      const data = await mlService.getRecommendedGames(studentId);
      setRecommendations(data);
    } catch (error) {
      setRecommendationsError(error.error || 'Failed to fetch recommendations');
      console.error('Error fetching recommendations:', error);
    } finally {
      setRecommendationsLoading(false);
    }
  }, [studentId]);

  // Fetch learning path
  const fetchLearningPath = useCallback(async () => {
    if (!studentId) return;

    try {
      setLearningPathLoading(true);
      setLearningPathError(null);
      const data = await mlService.getLearningPath(studentId);
      setLearningPath(data);
    } catch (error) {
      setLearningPathError(error.error || 'Failed to fetch learning path');
      console.error('Error fetching learning path:', error);
    } finally {
      setLearningPathLoading(false);
    }
  }, [studentId]);

  // Get adaptive difficulty for a game
  const getGameDifficulty = useCallback(async (gameId) => {
    if (!studentId || !gameId) return 0.5; // Default medium difficulty

    try {
      return await mlService.getAdaptiveDifficulty(studentId, gameId);
    } catch (error) {
      console.error('Error fetching game difficulty:', error);
      return 0.5; // Default to medium difficulty on error
    }
  }, [studentId]);

  // Record game interaction
  const recordGamePlay = useCallback(async (gameData) => {
    if (!studentId) return;

    try {
      const interactionData = {
        studentId,
        ...gameData
      };
      const result = await mlService.recordInteraction(interactionData);
      
      // Refresh recommendations after recording new interaction
      fetchRecommendations();
      return result;
    } catch (error) {
      console.error('Error recording game interaction:', error);
      throw error;
    }
  }, [studentId, fetchRecommendations]);

  // Update learning progress
  const updateProgress = useCallback(async (subject, skill, proficiencyLevel) => {
    if (!studentId) return;

    try {
      const progressData = {
        studentId,
        subject,
        skill,
        proficiencyLevel
      };
      const result = await mlService.updateProgress(progressData);
      
      // Refresh relevant data
      fetchLearningPath();
      return result;
    } catch (error) {
      console.error('Error updating learning progress:', error);
      throw error;
    }
  }, [studentId, fetchLearningPath]);

  // Initialize data when studentId changes
  useEffect(() => {
    if (studentId) {
      fetchRecommendations();
      fetchLearningPath();
    }
  }, [studentId, fetchRecommendations, fetchLearningPath]);

  return {
    // Data
    recommendations,
    learningPath,
    
    // Loading states
    recommendationsLoading,
    learningPathLoading,
    
    // Error states
    recommendationsError,
    learningPathError,
    
    // Methods
    fetchRecommendations,
    fetchLearningPath,
    getGameDifficulty,
    recordGamePlay,
    updateProgress
  };
};

export default useMLFeatures;