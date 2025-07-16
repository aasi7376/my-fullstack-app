// src/services/bktService.js - Fixed to properly connect with MongoDB backend
import api from './api';
import storageService from './storageService';

/**
 * Bayesian Knowledge Tracing (BKT) Implementation
 * 
 * BKT is a probabilistic model that estimates a student's knowledge state
 * based on their observed performance. It uses a Hidden Markov Model where:
 * - The hidden state is whether the student has mastered a skill (binary)
 * - The observed variable is whether they answer correctly (binary)
 * 
 * The model has four parameters for each skill:
 * - p(L0): Initial probability of knowing the skill
 * - p(T): Probability of transitioning from not knowing to knowing (learning)
 * - p(S): Probability of correct answer when skill is not known (slip)
 * - p(G): Probability of incorrect answer when skill is known (guess)
 */

// Default BKT parameters by subject/skill
const DEFAULT_BKT_PARAMS = {
  // Math skills
  'math.arithmetic': { pL0: 0.30, pT: 0.09, pS: 0.10, pG: 0.20 },
  'math.algebra': { pL0: 0.20, pT: 0.08, pS: 0.08, pG: 0.25 },
  'math.geometry': { pL0: 0.15, pT: 0.07, pS: 0.12, pG: 0.30 },
  'math.calculus': { pL0: 0.10, pT: 0.06, pS: 0.05, pG: 0.15 },
  
  // Physics skills
  'physics.mechanics': { pL0: 0.15, pT: 0.08, pS: 0.10, pG: 0.25 },
  'physics.electricity': { pL0: 0.10, pT: 0.07, pS: 0.08, pG: 0.20 },
  'physics.thermodynamics': { pL0: 0.12, pT: 0.06, pS: 0.07, pG: 0.22 },
  
  // Chemistry skills
  'chemistry.periodic': { pL0: 0.25, pT: 0.09, pS: 0.09, pG: 0.18 },
  'chemistry.bonding': { pL0: 0.20, pT: 0.08, pS: 0.10, pG: 0.22 },
  'chemistry.reactions': { pL0: 0.15, pT: 0.07, pS: 0.08, pG: 0.20 },
  
  // Default parameters for any skill
  'default': { pL0: 0.20, pT: 0.08, pS: 0.10, pG: 0.20 }
};

// In-memory storage for student knowledge states
const studentKnowledgeStates = new Map();

// Debug mode flag for detailed logging
const DEBUG_MODE = true;

// Debug logger function that only logs when debug mode is enabled
const debugLog = (...args) => {
  if (DEBUG_MODE) {
    console.log('[BKT Service]', ...args);
  }
};

/**
 * Debug API call function for better error logging
 * @param {string} endpoint - API endpoint to call
 * @param {Object} data - Optional data to send with POST/PUT requests
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @returns {Promise<Object>} API response
 */
const debugApiCall = async (endpoint, data = null, method = 'GET') => {
  debugLog(`API Call to ${endpoint}`);
  debugLog('Request data:', data);
  
  try {
    // Construct URL - this should match your backend API structure
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    const url = `${baseUrl}${endpoint}`;
    
    // Get token directly from localStorage to match how it was stored
    const token = localStorage.getItem('token');
    
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      // Add body for POST/PUT requests
      ...(data && method !== 'GET' ? { body: JSON.stringify(data) } : {})
    };
    
    debugLog('Request options:', options);
    debugLog('Full URL:', url);
    
    // IMPORTANT: Log the actual request being made for debugging
    console.log(`Making ${method} request to ${url}`, options);
    
    const response = await fetch(url, options);
    debugLog('Response status:', response.status);
    
    // Check if response is ok (status in the range 200-299)
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`API error: ${response.status} ${errorText}`);
    }
    
    const result = await response.json();
    debugLog('Response data:', result);
    return result;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

/**
 * Get BKT parameters for a specific skill
 * @param {string} skillId - The skill identifier
 * @returns {Object} BKT parameters for the skill
 */
const getBKTParams = (skillId) => {
  return DEFAULT_BKT_PARAMS[skillId] || DEFAULT_BKT_PARAMS.default;
};

/**
 * Initialize knowledge state for a student-skill pair
 * @param {string} studentId - The student identifier
 * @param {string} skillId - The skill identifier
 * @returns {Object} Initial knowledge state
 */
const initializeKnowledgeState = (studentId, skillId) => {
  const params = getBKTParams(skillId);
  const key = `${studentId}-${skillId}`;
  
  const state = {
    pKnown: params.pL0, // Probability that the student knows the skill
    observations: [],   // History of correct/incorrect responses
    lastUpdated: Date.now(),
    params: { ...params }  // Keep a copy of the parameters
  };
  
  studentKnowledgeStates.set(key, state);
  
  // IMPORTANT: Attempt to create this in the backend too
  // This is async, but we don't need to await it here
  try {
    debugApiCall('/api/knowledge-state', {
      studentId,
      skillId,
      pKnown: params.pL0,
      params
    }, 'POST').catch(error => {
      console.warn('Failed to initialize knowledge state in backend:', error);
    });
  } catch (error) {
    console.warn('Error sending knowledge state to backend:', error);
  }
  
  return state;
};

/**
 * Update knowledge state based on a new observation
 * @param {Object} state - Current knowledge state
 * @param {boolean} correct - Whether the student answered correctly
 * @returns {Object} Updated knowledge state
 */
const updateKnowledgeState = (state, correct) => {
  const { pKnown, params, observations } = state;
  const { pT, pS, pG } = params;
  
  // Step 1: Adjust probability based on observation (correct/incorrect)
  let pKnownAdjusted;
  
  if (correct) {
    // If student answered correctly
    // p(known | correct) = p(correct | known) * p(known) / p(correct)
    const pCorrectGivenKnown = 1 - pS; // Probability of correct given known (1 - slip)
    const pCorrectGivenNotKnown = pG;  // Probability of correct given not known (guess)
    
    // Calculate probability of correct response
    const pCorrect = (pCorrectGivenKnown * pKnown) + (pCorrectGivenNotKnown * (1 - pKnown));
    
    // Apply Bayes' rule
    pKnownAdjusted = (pCorrectGivenKnown * pKnown) / pCorrect;
  } else {
    // If student answered incorrectly
    // p(known | incorrect) = p(incorrect | known) * p(known) / p(incorrect)
    const pIncorrectGivenKnown = pS;     // Probability of incorrect given known (slip)
    const pIncorrectGivenNotKnown = 1 - pG; // Probability of incorrect given not known (1 - guess)
    
    // Calculate probability of incorrect response
    const pIncorrect = (pIncorrectGivenKnown * pKnown) + (pIncorrectGivenNotKnown * (1 - pKnown));
    
    // Apply Bayes' rule
    pKnownAdjusted = (pIncorrectGivenKnown * pKnown) / pIncorrect;
  }
  
  // Step 2: Apply learning transition
  // Even if they didn't know it before, they might have learned it now
  const pKnownNew = pKnownAdjusted + ((1 - pKnownAdjusted) * pT);
  
  // Update the state
  const newObservation = {
    timestamp: Date.now(),
    correct,
    pKnownBefore: pKnown,
    pKnownAfter: pKnownNew
  };
  
  const updatedState = {
    ...state,
    pKnown: pKnownNew,
    observations: [...observations, newObservation],
    lastUpdated: Date.now()
  };
  
  return updatedState;
};

/**
 * Convert mastery probability to difficulty level (0.1-0.9)
 * This maps student knowledge to appropriate challenge level
 * @param {number} pKnown - Probability of student knowing the skill
 * @returns {number} Appropriate difficulty level (0.1-0.9)
 */
const masteryToDifficulty = (pKnown) => {
  // Inverting the relationship: higher knowledge = higher difficulty
  // We adjust the range to be between 0.1 and 0.9 for reasonable difficulty bounds
  // We also add a small adjustment to keep students slightly challenged
  const challengeAdjustment = 0.1; // Keep difficulty slightly above mastery level
  const difficulty = 0.1 + (pKnown * 0.8) + challengeAdjustment;
  
  // Ensure we stay within bounds
  return Math.min(Math.max(difficulty, 0.1), 0.9);
};

/**
 * Calculate the difficulty level based on knowledge of multiple skills
 * @param {Array} skillStates - Array of knowledge states for relevant skills
 * @param {Object} weights - Optional weights for each skill (default: equal weights)
 * @returns {number} Appropriate difficulty level (0.1-0.9)
 */
const calculateDifficultyFromSkills = (skillStates, weights = null) => {
  if (!skillStates || skillStates.length === 0) {
    return 0.5; // Default middle difficulty if no skill data
  }
  
  // If weights not provided, use equal weights
  const skillWeights = weights || skillStates.map(() => 1 / skillStates.length);
  
  // Calculate weighted average of knowledge
  let weightedKnowledge = 0;
  let totalWeight = 0;
  
  skillStates.forEach((state, index) => {
    weightedKnowledge += state.pKnown * skillWeights[index];
    totalWeight += skillWeights[index];
  });
  
  const averageKnowledge = weightedKnowledge / totalWeight;
  
  // Convert to difficulty
  return masteryToDifficulty(averageKnowledge);
};

// API for interacting with the BKT model
const bktService = {
  /**
   * Get the knowledge state for a student-skill pair
   * @param {string} studentId - The student identifier
   * @param {string} skillId - The skill identifier
   * @returns {Object} Knowledge state
   */
  getKnowledgeState: async (studentId, skillId) => {
    const key = `${studentId}-${skillId}`;
    
    try {
      // First try to fetch from backend
      const response = await debugApiCall(`/api/knowledge-state/${studentId}/${skillId}`);
      
      // If backend response is successful, use that data
      if (response) {
        debugLog(`Retrieved knowledge state from backend for ${key}`);
        
        // Update local cache
        studentKnowledgeStates.set(key, response);
        
        return { ...response }; // Return a copy to prevent direct modification
      }
    } catch (error) {
      debugLog(`Failed to get knowledge state from backend for ${key}, using local: ${error.message}`);
    }
    
    // If backend request fails or returns no data, use local cache
    let state = studentKnowledgeStates.get(key);
    
    if (!state) {
      // If not in local cache, try to get from local storage
      try {
        const knowledgeStorage = storageService.getItem('bktKnowledgeStates', {});
        state = knowledgeStorage[key];
        
        if (state) {
          studentKnowledgeStates.set(key, state);
          debugLog(`Retrieved knowledge state from local storage for ${key}`);
        }
      } catch (error) {
        debugLog(`Failed to get knowledge state from local storage for ${key}: ${error.message}`);
      }
    }
    
    if (!state) {
      // Initialize if still not found
      debugLog(`Initializing new knowledge state for ${key}`);
      state = initializeKnowledgeState(studentId, skillId);
    }
    
    return { ...state }; // Return a copy to prevent direct modification
  },
  
  /**
   * Update knowledge state based on observation
   * @param {string} studentId - The student identifier
   * @param {string} skillId - The skill identifier
   * @param {boolean} correct - Whether the student answered correctly
   * @returns {Object} Updated knowledge state
   */
  updateKnowledge: async (studentId, skillId, correct) => {
    const key = `${studentId}-${skillId}`;
    
    // Get current state (local or from backend if available)
    let state = await bktService.getKnowledgeState(studentId, skillId);
    
    // Update the state based on the observation
    const updatedState = updateKnowledgeState(state, correct);
    
    // Store updated state in local cache
    studentKnowledgeStates.set(key, updatedState);
    
    // Create observation data for backend
    const observationData = {
      studentId,
      skillId,
      correct,
      pKnownBefore: state.pKnown,
      pKnownAfter: updatedState.pKnown,
      timestamp: Date.now()
    };
    
    // Attempt to update backend
    try {
      debugLog(`Sending observation to backend for ${key}`);
      
      // Send observation to backend
      const response = await debugApiCall('/api/knowledge-state/observation', observationData, 'POST');
      
      if (response) {
        debugLog(`Observation recorded in backend for ${key}`);
        
        // If backend returns updated state, use that
        if (response.pKnown) {
          // Update local cache with backend response
          studentKnowledgeStates.set(key, response);
          debugLog(`Updated local knowledge state with backend response for ${key}`);
          
          // Also persist to storage
          try {
            const knowledgeStorage = storageService.getItem('bktKnowledgeStates', {});
            knowledgeStorage[key] = response;
            storageService.setItem('bktKnowledgeStates', knowledgeStorage);
          } catch (storageError) {
            console.warn('Failed to save knowledge state to storage:', storageError);
          }
          
          return { ...response };
        }
      }
    } catch (error) {
      console.warn(`Failed to update knowledge state in backend for ${key}:`, error);
      
      // If backend update fails, just store locally
      debugLog(`Storing knowledge state locally for ${key} due to backend error`);
    }
    
    // Always persist to storage for offline usage, even if backend update succeeded
    try {
      const knowledgeStorage = storageService.getItem('bktKnowledgeStates', {});
      knowledgeStorage[key] = updatedState;
      storageService.setItem('bktKnowledgeStates', knowledgeStorage);
    } catch (error) {
      console.warn('Failed to save knowledge state to storage:', error);
    }
    
    return { ...updatedState }; // Return a copy to prevent direct modification
  },
  
  /**
   * Get adaptive difficulty for a game based on BKT model
   * @param {string} studentId - The student identifier
   * @param {string} gameId - The game identifier
   * @returns {number} Appropriate difficulty level (0.1-0.9)
   */
  getAdaptiveDifficulty: async (studentId, gameId) => {
    // Try to get from backend first
    try {
      const response = await debugApiCall(`/api/performance/${studentId}/${gameId}`);
      if (response && typeof response.currentDifficulty === 'number') {
        debugLog(`Retrieved difficulty from performance API: ${response.currentDifficulty}`);
        return response.currentDifficulty;
      }
    } catch (error) {
      debugLog(`Failed to get difficulty from performance API: ${error.message}`);
    }
    
    // Map games to relevant skills
    const gameSkillMap = {
      'game1': ['math.arithmetic', 'math.algebra'],
      'game2': ['physics.mechanics', 'physics.electricity'],
      'game3': ['chemistry.periodic', 'chemistry.bonding', 'chemistry.reactions'],
      // Use same mapping for backward compatibility
      'math': ['math.arithmetic', 'math.algebra'],
      'physics': ['physics.mechanics', 'physics.electricity'],
      'chemistry': ['chemistry.periodic', 'chemistry.bonding', 'chemistry.reactions']
    };
    
    // Get the relevant skills for this game
    const skills = gameSkillMap[gameId] || [];
    
    if (skills.length === 0) {
      debugLog(`No skills mapped for game ${gameId}, using default difficulty`);
      return 0.5; // Default middle difficulty
    }
    
    // Get knowledge states for all relevant skills
    const skillStatePromises = skills.map(skillId => bktService.getKnowledgeState(studentId, skillId));
    const skillStates = await Promise.all(skillStatePromises);
    
    // Calculate difficulty based on the skill states
    const difficulty = calculateDifficultyFromSkills(skillStates);
    
    // Store this calculated difficulty in the backend
    try {
      debugApiCall(`/api/performance/${studentId}/${gameId}/difficulty`, {
        difficulty
      }, 'PUT').catch(error => {
        debugLog(`Failed to store calculated difficulty in backend: ${error.message}`);
      });
    } catch (error) {
      debugLog(`Error storing calculated difficulty: ${error.message}`);
    }
    
    return difficulty;
  },
  
  /**
   * Record an interaction with the game
   * @param {Object} interactionData - Data about the interaction
   * @returns {Object} Result of the operation
   */
  recordInteraction: async (interactionData) => {
    const { studentId, gameId, score, questionsAnswered = 5 } = interactionData;
    
    debugLog(`Recording interaction for ${studentId} in ${gameId}`);
    
    // Map games to relevant skills
    const gameSkillMap = {
      'game1': ['math.arithmetic', 'math.algebra'],
      'game2': ['physics.mechanics', 'physics.electricity'],
      'game3': ['chemistry.periodic', 'chemistry.bonding', 'chemistry.reactions'],
      // Use same mapping for backward compatibility
      'math': ['math.arithmetic', 'math.algebra'],
      'physics': ['physics.mechanics', 'physics.electricity'],
      'chemistry': ['chemistry.periodic', 'chemistry.bonding', 'chemistry.reactions']
    };
    
    // Get the relevant skills for this game
    const skills = gameSkillMap[gameId] || [];
    
    if (skills.length === 0) {
      console.warn(`No skills mapped for game ${gameId}, interaction not recorded`);
      return { 
        success: false, 
        message: 'No skills mapped for this game'
      };
    }
    
    // Normalize score to 0-1 range
    const normalizedScore = score > 1 ? score / 100 : score;
    
    // IMPORTANT: First try to record the interaction in the backend
    try {
      // Format data to match GameInteraction model
      const gameInteractionData = {
        studentId,
        gameId,
        score: normalizedScore * 100, // Store as 0-100 in backend
        timeSpent: interactionData.timeSpent || 0,
        completedLevel: interactionData.level || 1,
        totalLevels: interactionData.totalLevels || 5,
        difficulty: interactionData.difficulty || 0.5,
        skillsApplied: skills,
        timestamp: Date.now()
      };
      
      // Send to backend
      const backendResponse = await debugApiCall('/api/game-interaction', gameInteractionData, 'POST');
      debugLog('Game interaction recorded in backend:', backendResponse);
    } catch (error) {
      console.warn('Failed to record game interaction in backend:', error);
    }
    
    // Update knowledge state for each skill locally too
    const updates = [];
    for (const skillId of skills) {
      debugLog(`Updating knowledge state for skill ${skillId}`);
      
      // Simulate whether each "question" was answered correctly based on the score
      // This is a simplification - ideally you'd have per-question data
      for (let i = 0; i < questionsAnswered; i++) {
        // Randomly determine if this question was correct based on overall score probability
        const correct = Math.random() < normalizedScore;
        
        // Update the knowledge state for this skill
        const update = await bktService.updateKnowledge(studentId, skillId, correct);
        updates.push({ skillId, update });
      }
    }
    
    // Calculate new difficulty
    const newDifficulty = await bktService.getAdaptiveDifficulty(studentId, gameId);
    
    debugLog(`BKT: New difficulty calculated: ${newDifficulty.toFixed(2)}`);
    
    // Return result
    return {
      success: true,
      message: 'Interaction recorded and BKT model updated',
      updates,
      newDifficulty
    };
  },
  
  /**
   * Get all knowledge states for a student
   * @param {string} studentId - The student identifier
   * @returns {Object} Map of skill IDs to knowledge states
   */
  getAllKnowledgeStates: async (studentId) => {
    // First try to get from backend
    try {
      const response = await debugApiCall(`/api/knowledge-state/${studentId}`);
      if (response && Array.isArray(response)) {
        debugLog(`Retrieved ${response.length} knowledge states from backend`);
        
        // Convert array to map for consistent return format
        const states = {};
        
        // Update local cache with backend data
        response.forEach(state => {
          const key = `${studentId}-${state.skillId}`;
          studentKnowledgeStates.set(key, state);
          states[state.skillId] = { ...state };
        });
        
        return states;
      }
    } catch (error) {
      debugLog(`Failed to get knowledge states from backend: ${error.message}`);
    }
    
    // If backend request fails, use local cache
    const states = {};
    
    // Get all keys that start with the student ID
    for (const [key, state] of studentKnowledgeStates.entries()) {
      if (key.startsWith(`${studentId}-`)) {
        const skillId = key.substring(studentId.length + 1);
        states[skillId] = { ...state }; // Return a copy to prevent direct modification
      }
    }
    
    return states;
  },
  
  /**
   * Reset all knowledge states (for testing)
   */
  resetAllKnowledgeStates: async () => {
    studentKnowledgeStates.clear();
    
    try {
      storageService.removeItem('bktKnowledgeStates');
    } catch (error) {
      console.warn('Failed to clear knowledge states from storage:', error);
    }
    
    // Also try to reset on backend
    try {
      await debugApiCall('/api/knowledge-state/reset', {}, 'POST');
      debugLog('Knowledge states reset on backend');
    } catch (error) {
      console.warn('Failed to reset knowledge states on backend:', error);
    }
    
    return { success: true, message: 'All knowledge states reset' };
  },
  
  /**
   * Get mastery level for a specific skill
   * @param {string} studentId - The student identifier
   * @param {string} skillId - The skill identifier
   * @returns {number} Mastery level (0-1)
   */
  getMasteryLevel: async (studentId, skillId) => {
    const state = await bktService.getKnowledgeState(studentId, skillId);
    return state.pKnown;
  },
  
  /**
   * Sync offline knowledge states to backend
   * @returns {Object} Result of sync operation
   */
  syncOfflineStates: async () => {
    debugLog('Syncing offline knowledge states to backend');
    
    // Get all states from local storage
    let knowledgeStorage;
    try {
      knowledgeStorage = storageService.getItem('bktKnowledgeStates', {});
    } catch (error) {
      console.warn('Failed to get knowledge states from storage:', error);
      return { success: false, error: 'Failed to get knowledge states from storage' };
    }
    
    const syncResults = {
      success: true,
      total: Object.keys(knowledgeStorage).length,
      synced: 0,
      failed: 0
    };
    
    // Sync each state to backend
    for (const [key, state] of Object.entries(knowledgeStorage)) {
      // Extract studentId and skillId from key
      const [studentId, skillId] = key.split('-');
      
      if (!studentId || !skillId) {
        debugLog(`Invalid key format: ${key}`);
        syncResults.failed++;
        continue;
      }
      
      try {
        // Format data for backend
        const backendData = {
          studentId,
          skillId,
          pKnown: state.pKnown,
          params: state.params,
          observations: state.observations || [],
          lastUpdated: state.lastUpdated || Date.now()
        };
        
        // Send to backend
        await debugApiCall('/api/knowledge-state', backendData, 'POST');
        syncResults.synced++;
      } catch (error) {
        console.warn(`Failed to sync knowledge state for ${key}:`, error);
        syncResults.failed++;
      }
    }
    
    debugLog(`Sync completed: ${syncResults.synced}/${syncResults.total} states synced`);
    return syncResults;
  },
  
  // Expose internal functions for testing and visualization
  _internal: {
    getBKTParams,
    initializeKnowledgeState,
    updateKnowledgeState,
    masteryToDifficulty,
    calculateDifficultyFromSkills
  }
};

// Initialize by loading stored knowledge states from storage
try {
  const knowledgeStorage = storageService.getItem('bktKnowledgeStates', {});
  
  Object.entries(knowledgeStorage).forEach(([key, state]) => {
    studentKnowledgeStates.set(key, state);
  });
  
  debugLog(`Loaded knowledge states for ${studentKnowledgeStates.size} student-skill pairs`);
  
  // Try to sync with backend on initialization
  bktService.syncOfflineStates().catch(error => {
    console.warn('Failed to sync knowledge states on initialization:', error);
  });
} catch (error) {
  console.warn('Failed to load knowledge states from storage:', error);
}

export default bktService;