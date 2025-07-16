// src/pages/GamePage.js
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Brain } from 'lucide-react';
// Import from your actual auth context location
import { useAuth } from '../context/AuthContext';
// Import ML service with fallback
import mlServiceImport from '../services/mlService';
// Import storage service
import storageService from '../services/storageService';

// Import game components
import MathGame from '../games/MathGame';
import PhysicsGame from '../games/PhysicsGame';
import ChemistryGame from '../games/ChemistryGame';

// Import ML debugging tools
import MLDebugConsole from '../components/MLDebugConsole';
import { validateMLAdaptation, performMLStressTest } from '../utils/mlTesting';

// Import CSS
import '../styles/GameStyles.css';

// Game metadata
const GAMES = {
  'math': {
    title: 'Math Master',
    description: 'Practice arithmetic operations and improve your calculation speed.',
    category: 'Mathematics',
    component: MathGame,
    color: '#4CAF50', // Green
    skills: ['Arithmetic', 'Problem Solving', 'Quick Thinking']
  },
  'physics': {
    title: 'Physics Lab',
    description: 'Explore the fundamental laws of physics through interactive experiments.',
    category: 'Physics',
    component: PhysicsGame,
    color: '#2196F3', // Blue
    skills: ['Mechanics', 'Energy', 'Critical Thinking']
  },
  'chemistry': {
    title: 'Chemistry Quest',
    description: 'Learn about atoms, molecules, and chemical reactions through hands-on challenges.',
    category: 'Chemistry',
    component: ChemistryGame,
    color: '#9C27B0', // Purple
    skills: ['Chemical Bonds', 'Reactions', 'Pattern Recognition']
  },
  // Add fallback entries for your game IDs to ensure they work
  'game1': {
    title: 'Math Master',
    description: 'Practice arithmetic operations and improve your calculation speed.',
    category: 'Mathematics',
    component: MathGame,
    color: '#4CAF50', // Green
    skills: ['Arithmetic', 'Problem Solving', 'Quick Thinking']
  },
  'game2': {
    title: 'Physics Lab',
    description: 'Explore the fundamental laws of physics through interactive experiments.',
    category: 'Physics',
    component: PhysicsGame,
    color: '#2196F3', // Blue
    skills: ['Mechanics', 'Energy', 'Critical Thinking']
  },
  'game3': {
    title: 'Chemistry Quest',
    description: 'Learn about atoms, molecules, and chemical reactions through hands-on challenges.',
    category: 'Chemistry',
    component: ChemistryGame,
    color: '#9C27B0', // Purple
    skills: ['Chemical Bonds', 'Reactions', 'Pattern Recognition']
  }
};

/**
 * Checks the health of the ML service with improved error handling
 * 
 * @param {Object} mlService - The ML service instance (can be null/undefined)
 * @returns {Object} Health status
 */
const checkMLServiceHealth = async (mlService) => {
  try {
    // Make sure mlService exists
    if (!mlService) {
      return {
        status: 'offline',
        error: 'ML Service not available'
      };
    }
    
    // Check if health check method exists
    if (typeof mlService.healthCheck === 'function') {
      // Use the service's own health check
      try {
        return await mlService.healthCheck();
      } catch (healthCheckError) {
        console.warn('Error calling mlService.healthCheck:', healthCheckError);
        // Continue with fallback checks if the health check method fails
      }
    }
    
    // If no health check method or it failed, check required methods
    const requiredMethods = ['recordInteraction', 'getAdaptiveDifficulty', 'updateProgress'];
    const missingMethods = requiredMethods.filter(
      method => typeof mlService[method] !== 'function'
    );
    
    if (missingMethods.length > 0) {
      return {
        status: 'degraded',
        error: `Missing methods: ${missingMethods.join(', ')}`
      };
    }
    
    // Try to activate the service if it has a forceActive method
    if (typeof mlService.forceActive === 'function') {
      try {
        mlService.forceActive(true);
      } catch (activateError) {
        console.warn('Error activating ML service:', activateError);
      }
    }
    
    // All basic checks passed
    return { status: 'online' };
  } catch (error) {
    console.error('ML service health check failed:', error);
    return { 
      status: 'offline', 
      error: error.message || 'Unknown error checking ML service health'
    };
  }
};

// Developer tools panel component
const DevTools = ({ 
  difficultyHistory, 
  scoreHistory, 
  mlService, 
  userId, 
  gameId, 
  mlActive 
}) => {
  const [testResults, setTestResults] = useState(null);
  const [validationResults, setValidationResults] = useState(null);
  const [healthStatus, setHealthStatus] = useState(null);
  
  // Run ML validation
  const runMLValidation = () => {
    if (difficultyHistory.length < 2 || scoreHistory.length < 1) {
      alert('Not enough data - play at least 2 rounds first');
      return;
    }
    
    const result = validateMLAdaptation(difficultyHistory, scoreHistory);
    console.log('ML Validation:', result);
    setValidationResults(result);
  };
  
  // Run ML stress test
  const runStressTest = async () => {
    if (!mlService) {
      alert('ML Service not available');
      return;
    }
    
    const results = await performMLStressTest(mlService, userId || 'test-user', gameId);
    console.log('ML Stress Test Results:', results);
    setTestResults(results);
  };
  
  // Check ML service health
  const checkHealth = async () => {
    if (!mlService) {
      setHealthStatus({ status: 'offline', error: 'ML Service not available' });
      return;
    }
    
    const health = await checkMLServiceHealth(mlService);
    console.log('ML Service Health:', health);
    setHealthStatus(health);
  };
  
  return (
    <div className="fixed top-4 left-4 bg-gray-800 p-3 rounded-lg text-white text-xs z-50 max-w-xs">
      <div className="font-bold mb-2 flex items-center justify-between">
        <span>ML Dev Tools</span>
        <div className={`h-2 w-2 rounded-full ${mlActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
      </div>
      
      <div className="mb-2 grid grid-cols-3 gap-1">
        <button 
          onClick={runMLValidation}
          className="bg-blue-700 hover:bg-blue-600 px-2 py-1 rounded"
        >
          Validate ML
        </button>
        <button 
          onClick={runStressTest}
          className="bg-purple-700 hover:bg-purple-600 px-2 py-1 rounded"
        >
          Stress Test
        </button>
        <button 
          onClick={checkHealth}
          className="bg-green-700 hover:bg-green-600 px-2 py-1 rounded"
        >
          Health Check
        </button>
      </div>
      
      {/* Results display */}
      <div className="text-xs overflow-auto max-h-60">
        {/* Validation results */}
        {validationResults && (
          <div className="bg-gray-700 p-2 rounded mb-2">
            <div className="font-bold mb-1 flex items-center">
              <span>Validation: </span>
              <span className={validationResults.isValid ? 'text-green-400 ml-1' : 'text-red-400 ml-1'}>
                {validationResults.isValid ? 'PASSED' : 'FAILED'}
              </span>
            </div>
            <div className="text-gray-300 mb-1">{validationResults.message}</div>
            {validationResults.evidence.length > 0 && (
              <div>
                <div className="font-bold mt-1">Evidence:</div>
                <div className="ml-2 mt-1">
                  {validationResults.evidence.map((item, i) => (
                    <div 
                      key={i} 
                      className={`mb-1 text-xs ${item.valid ? 'text-green-400' : 'text-red-400'}`}
                    >
                      Round {item.round}: {item.actual} (Expected: {item.expected})
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Health check results */}
        {healthStatus && (
          <div className="bg-gray-700 p-2 rounded mb-2">
            <div className="font-bold mb-1 flex items-center">
              <span>ML Service: </span>
              <span className={healthStatus.status === 'online' ? 'text-green-400 ml-1' : 'text-red-400 ml-1'}>
                {healthStatus.status.toUpperCase()}
              </span>
            </div>
            {healthStatus.status === 'online' ? (
              <div className="text-green-400 text-xs">Service is responding correctly</div>
            ) : (
              <div className="text-red-400 text-xs">{healthStatus.error}</div>
            )}
          </div>
        )}
        
        {/* Stress test results */}
        {testResults && (
          <div className="bg-gray-700 p-2 rounded mb-2">
            <div className="font-bold mb-1 flex items-center">
              <span>Stress Test: </span>
              <span className={testResults.overallStatus === 'PASSED' ? 'text-green-400 ml-1' : 'text-red-400 ml-1'}>
                {testResults.overallStatus}
              </span>
            </div>
            <div className="text-xs mb-1">
              Passed: {testResults.testsPassed}/{testResults.testsPassed + testResults.testsFailed} tests
            </div>
            {testResults.tests.map((test, i) => (
              <div 
                key={i}
                className={`mt-1 text-xs ${test.passed ? 'text-green-400' : 'text-red-400'}`}
              >
                • {test.name}: {test.passed ? 'Passed' : 'Failed'}
                {test.error && <div className="ml-2 text-red-300">{test.error}</div>}
                {test.details && (
                  <div className="ml-2 text-gray-400">
                    {Object.entries(test.details).map(([key, value]) => (
                      <div key={key}>{key}: {value}</div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced Difficulty History Indicator Component
const EnhancedDifficultyIndicator = ({ difficultyHistory }) => {
  // Only show if we have at least 2 data points
  if (!difficultyHistory || difficultyHistory.length < 2) {
    return (
      <div className="mt-3 p-3 bg-gray-700 rounded-lg text-center">
        <p className="text-xs text-gray-300 mb-1">Complete a game to see difficulty progression</p>
      </div>
    );
  }
  
  // Get current and previous difficulty
  const currentDifficulty = difficultyHistory[difficultyHistory.length - 1];
  const previousDifficulty = difficultyHistory[difficultyHistory.length - 2];
  const diffChange = currentDifficulty - previousDifficulty;
  
  // Calculate percentage change
  const percentageChange = Math.abs(Math.round(diffChange * 100));
  const isIncrease = diffChange > 0;
  const isDecrease = diffChange < 0;
  const isSame = diffChange === 0;
  
  return (
    <div className="bg-gray-700 rounded-lg shadow-md overflow-hidden">
      {/* Header with difficulty level */}
      <div className="bg-gray-800 p-3 flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-300">Difficulty Progression:</h3>
        <div className={`px-3 py-1 rounded-full text-xs font-bold ${
          isIncrease ? 'bg-green-900 text-green-300' : 
          isDecrease ? 'bg-blue-900 text-blue-300' : 
          'bg-gray-600 text-gray-300'
        }`}>
          {Math.round(currentDifficulty * 100)}% 
          {!isSame && (
            <span className="ml-1">
              {isIncrease ? '↑' : '↓'} {percentageChange}%
            </span>
          )}
        </div>
      </div>
      
      {/* Visual difficulty progression bar */}
      <div className="px-4 pt-4">
        <div className="h-5 bg-gray-800 rounded-full overflow-hidden">
          <div className="relative w-full h-full">
            {difficultyHistory.map((diff, index) => {
              // Calculate width based on position in history
              const segmentWidth = 100 / difficultyHistory.length;
              const position = segmentWidth * index;
              
              // Determine color based on difficulty level
              const bgColor = diff < 0.3 ? 'bg-green-500' : 
                             diff < 0.7 ? 'bg-yellow-500' : 
                             'bg-red-500';
              
              // Determine if this is the current difficulty
              const isCurrent = index === difficultyHistory.length - 1;
              
              return (
                <div 
                  key={index}
                  className={`absolute top-0 bottom-0 ${bgColor} ${isCurrent ? 'animate-pulse' : ''}`}
                  style={{ 
                    left: `${position}%`, 
                    width: `${segmentWidth}%`,
                    opacity: isCurrent ? 1 : 0.6,
                    // Add a border to the current segment
                    border: isCurrent ? '2px solid white' : 'none',
                    zIndex: isCurrent ? 10 : index,
                  }}
                  title={`Round ${index + 1}: ${Math.round(diff * 100)}%`}
                />
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Explanation text */}
      <div className="p-4 text-center">
        {isIncrease && (
          <div className="text-green-400 font-medium">
            Difficulty increased by {percentageChange}% based on your strong performance
          </div>
        )}
        {isDecrease && (
          <div className="text-blue-400 font-medium">
            Difficulty decreased by {percentageChange}% to help you build skills
          </div>
        )}
        {isSame && (
          <div className="text-gray-400 font-medium">
            Difficulty maintained at optimal learning level
          </div>
        )}
      </div>
      
      {/* Add a debug section showing raw values */}
      <details className="px-4 pb-3 border-t border-gray-600 cursor-pointer group">
        <summary className="py-2 text-xs text-gray-400 font-medium flex items-center">
          <svg className="w-4 h-4 mr-1 transform group-open:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
          Show detailed history
        </summary>
        <div className="pt-2 grid grid-cols-2 gap-1 text-xs text-gray-400">
          {difficultyHistory.map((diff, index) => (
            <div key={index} className="flex justify-between px-2 py-1 rounded even:bg-gray-800">
              <span>Round {index + 1}:</span>
              <span className="font-medium">{Math.round(diff * 100)}%</span>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
};

// Original DifficultyHistoryIndicator Component (keep for reference)
const DifficultyHistoryIndicator = ({ difficultyHistory }) => {
  // Only show if we have at least 2 data points
  if (!difficultyHistory || difficultyHistory.length < 2) return null;
  
  return (
    <div className="mt-3 p-2 bg-gray-800 rounded-lg">
      <p className="text-xs text-gray-400 mb-1">Difficulty Progression:</p>
      <div className="flex items-center h-4">
        {difficultyHistory.map((diff, index) => (
          <div key={index} className="flex flex-col items-center">
            {/* Arrow showing direction */}
            {index > 0 && (
              <div className="text-xs text-gray-400 mx-1">
                {diff > difficultyHistory[index - 1] ? '↗' : 
                diff < difficultyHistory[index - 1] ? '↘' : '→'}
              </div>
            )}
            {/* Difficulty dot */}
            <div 
              className="h-3 w-3 rounded-full mx-1"
              style={{ 
                backgroundColor: diff < 0.3 ? '#4CAF50' : diff < 0.7 ? '#FFC107' : '#F44336',
                opacity: index === difficultyHistory.length - 1 ? 1 : 0.5
              }}
              title={`Round ${index + 1}: ${Math.round(diff * 100)}%`}
            />
          </div>
        ))}
        
        {/* Explanation */}
        <div className="text-xs text-gray-400 ml-2">
          {difficultyHistory.length > 1 && (
            difficultyHistory[difficultyHistory.length - 1] > difficultyHistory[difficultyHistory.length - 2]
              ? 'Difficulty increased based on your performance'
              : difficultyHistory[difficultyHistory.length - 1] < difficultyHistory[difficultyHistory.length - 2]
                ? 'Difficulty decreased based on your performance'
                : 'Difficulty maintained based on your performance'
          )}
        </div>
      </div>
    </div>
  );
};

// Generate learning insights based on game performance
const generateLearningInsights = (gameData, game) => {
  if (!gameData || !game) return '';
  
  const { score, timeSpent, level, totalLevels } = gameData;
  
  // Calculate performance metrics
  const percentComplete = (level / totalLevels) * 100;
  const scoreRating = score > 80 ? 'excellent' : score > 50 ? 'good' : 'developing';
  const timeEfficiency = timeSpent < 120 ? 'fast' : timeSpent < 240 ? 'average' : 'methodical';
  
  // Game-specific insights
  let insights = '';
  
  switch(game.title) {
    case 'Math Master':
      insights = `You've demonstrated ${scoreRating} arithmetic skills. Your ${timeEfficiency} pace indicates ${timeEfficiency === 'fast' ? 'strong computational fluency' : timeEfficiency === 'average' ? 'developing computational skills' : 'careful calculation approach'}. `;
      
      if (percentComplete === 100) {
        insights += 'Consider challenging yourself with harder problems or exploring the Physics game to apply math concepts.';
      } else {
        insights += `Focus on completing all levels to strengthen your problem-solving abilities.`;
      }
      break;
      
    case 'Physics Lab':
      insights = `You've shown ${scoreRating} understanding of physics concepts. Your ${timeEfficiency} pace suggests ${timeEfficiency === 'fast' ? 'strong intuition for physical systems' : timeEfficiency === 'average' ? 'developing understanding of physics principles' : 'careful analytical approach'}. `;
      
      if (percentComplete === 100) {
        insights += 'Try applying these concepts in the Chemistry game to see connections between physical and chemical properties.';
      } else {
        insights += `Continue exploring the remaining challenges to build a stronger foundation in physics.`;
      }
      break;
      
    case 'Chemistry Quest':
      insights = `You've demonstrated ${scoreRating} grasp of chemical bonding. Your ${timeEfficiency} approach indicates ${timeEfficiency === 'fast' ? 'strong pattern recognition' : timeEfficiency === 'average' ? 'developing molecular understanding' : 'methodical analysis of chemical structures'}. `;
      
      if (percentComplete === 100) {
        insights += 'Consider revisiting the Math game to strengthen the quantitative skills that support chemistry.';
      } else {
        insights += `Continue building more complex molecules to reinforce your understanding of chemical bonds.`;
      }
      break;
      
    default:
      insights = `You've completed ${percentComplete}% of the game with a ${scoreRating} score in ${timeSpent} seconds. Keep practicing to improve your skills!`;
  }
  
  return insights;
};

const GamePage = () => {
  // Create a fallback for mlService if it's undefined
  const [mlService, setMlService] = useState(null);
  
  // Enhanced ML Service Initialization - with better error handling and automatic healthCheck addition
  useEffect(() => {
    // Initialize mlService with a fallback if needed
    const initMlService = async () => {
      try {
        console.log('Initializing ML service...');
        
        // Check if mlServiceImport is valid
        if (mlServiceImport && typeof mlServiceImport === 'object') {
          console.log('Using imported ML service');
          
          // Test if healthCheck method exists, if not, add it
          if (typeof mlServiceImport.healthCheck !== 'function') {
            console.log('Adding missing healthCheck method to ML service');
            
            // Add healthCheck method to mlServiceImport
            mlServiceImport.healthCheck = async function() {
              try {
                console.log("ML Service health check initiated");
                
                // Check if all required methods are available
                const requiredMethods = [
                  'recordInteraction', 
                  'getAdaptiveDifficulty', 
                  'updateProgress'
                ];
                
                const missingMethods = requiredMethods.filter(
                  method => typeof this[method] !== 'function'
                );
                
                if (missingMethods.length > 0) {
                  console.warn(`ML Service missing methods: ${missingMethods.join(', ')}`);
                  return { 
                    status: 'degraded', 
                    error: `Missing methods: ${missingMethods.join(', ')}` 
                  };
                }
                
                // Try to activate the service if it has a forceActive method
                if (typeof this.forceActive === 'function') {
                  try {
                    this.forceActive(true);
                  } catch (activateError) {
                    console.warn('Error activating ML service:', activateError);
                  }
                }
                
                // Verify storage access
                try {
                  const testRead = storageService.getItem('mlServiceLastCheck');
                  storageService.setItem('mlServiceLastCheck', new Date().toISOString());
                } catch (storageError) {
                  console.warn('ML Service storage check failed:', storageError);
                  return { 
                    status: 'degraded', 
                    error: 'Storage access issue' 
                  };
                }
                
                return { status: 'online' };
              } catch (error) {
                console.error('ML Service health check failed:', error);
                return { status: 'offline', error: error.message };
              }
            };
          }
          
          setMlService(mlServiceImport);
          storageService.setItem('mlInitialized', true);
setMlInitialized(true);
console.log('ML initialization flag set to true');
        } else {
          console.warn('ML Service import failed, creating fallback mock service');
          
          // Create a fallback mock service with the necessary methods
          const mockMlService = {
            recordInteraction: async (data) => {
              console.log('Mock recordInteraction called with', data);
              return { success: true, message: 'Mock interaction recorded' };
            },
            getAdaptiveDifficulty: async (userId, gameId) => {
              console.log('Mock getAdaptiveDifficulty called for', userId, gameId);
              return 0.5; // Default medium difficulty
            },
            updateProgress: async (data) => {
              console.log('Mock updateProgress called with', data);
              return { success: true };
            },
            healthCheck: async () => {
              console.log('Mock healthCheck called');
              return { status: 'online', mode: 'mock' };
            },
            forceActive: (active) => {
              console.log(`Mock ML Service force active state: ${active}`);
              return true;
            }
          };
          
          setMlService(mockMlService);
          storageService.setItem('mlInitialized', true);
setMlInitialized(true);
console.log('ML initialization flag set to true');
        }
        
        console.log('ML service initialization complete');
      } catch (error) {
        console.error('Error initializing ML service:', error);
        
        // Create minimal fallback in case of error
        const emergencyFallback = {
          healthCheck: async () => ({ status: 'degraded', error: 'Using emergency fallback' }),
          getAdaptiveDifficulty: async () => 0.5,
          recordInteraction: async () => ({ success: false, error: 'Using emergency fallback' }),
          updateProgress: async () => ({ success: false }),
          forceActive: () => false
        };
        
        setMlService(emergencyFallback);
      }
    };

    // Initialize ML service
    initMlService();
  }, []);

  // Log mlService status for debugging
  useEffect(() => {
    console.log('=== ML Service Status Check ===');
    console.log('mlService state:', mlService);
    console.log('healthCheck exists:', mlService ? !!mlService.healthCheck : 'mlService not initialized yet');
    console.log('recordInteraction exists:', mlService ? !!mlService.recordInteraction : 'mlService not initialized yet');
    console.log('============================');
  }, [mlService]);

  const { gameId } = useParams();
  const navigate = useNavigate();
  const gameRef = useRef(null); // Reference to Phaser game instance
  
  // Get user from auth context - handle potential errors if context is missing
  let user = null;
  try {
    const auth = useAuth();
    user = auth?.user;
  } catch (error) {
    console.error('Auth context error:', error);
    // Continue without user data
  }
  
  // Game state
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [gameData, setGameData] = useState(null);
  const [difficulty, setDifficulty] = useState(0.5); // Default medium
  const [mlAnalyzing, setMlAnalyzing] = useState(false);
  const [resettingGame, setResettingGame] = useState(false); // Track when game is being reset
  
  // NEW: Add level state to track and preserve level between game sessions
  const [currentLevel, setCurrentLevel] = useState(1);
  // Add this near your other state declarations in the GamePage component
  const [mlInitialized, setMlInitialized] = useState(
    storageService.getItem('mlInitialized') === true
  );
  // ML tracking state
  const [difficultyHistory, setDifficultyHistory] = useState([0.5]); // Track difficulty changes
  const [scoreHistory, setScoreHistory] = useState([]); // Track score history for validation
  const [mlActive, setMlActive] = useState(false); // Track if ML is active
  const [showDebugTools, setShowDebugTools] = useState(
    process.env.NODE_ENV === 'development' || // Always show in development
    storageService.getItem('showMLDebug') === 'true' // Or if enabled in storage
  );
  
const loadGame = async () => {
  try {
    setLoading(true);
    setError(null);
    
    console.log('GamePage mounted with gameId:', gameId);
    
    // Find game metadata first - this doesn't depend on ML service
    const gameInfo = GAMES[gameId];
    if (!gameInfo) {
      throw new Error(`Game not found: ${gameId}`);
    }
    
    console.log('Selected game:', gameInfo.title);
    setGame(gameInfo);
    
    // Check ML health only if we have a service and initialization is complete
    if (mlService && mlInitialized) {
      try {
        const health = await checkMLServiceHealth(mlService);
        console.log('ML service health check:', health);
        
        // Only try to use ML features if we have a healthy service
        if (health.status !== 'offline' && user && user._id) {
          try {
            console.log(`Loading adaptive difficulty for user ${user._id} and game ${gameId}`);
            const adaptiveDifficulty = await mlService.getAdaptiveDifficulty(user._id, gameId);
            console.log('Personalized difficulty loaded:', adaptiveDifficulty);
            setDifficulty(adaptiveDifficulty);
            setDifficultyHistory([adaptiveDifficulty]);
            setMlActive(true);
            console.log('ML SYSTEM STATUS: ACTIVE');
          } catch (difficultyError) {
            console.warn('Failed to load personalized difficulty:', difficultyError);
            setMlActive(false);
            console.log('ML SYSTEM STATUS: INACTIVE (Error loading difficulty)');
          }
        } else {
          setMlActive(false);
          console.log('ML SYSTEM STATUS: INACTIVE (Service offline or no user)');
        }
      } catch (healthError) {
        console.warn('ML health check failed:', healthError);
        setMlActive(false);
        console.log('ML SYSTEM STATUS: INACTIVE (Health check failed)');
      }
    } else {
      console.log('ML service not ready, using default difficulty');
      setMlActive(false);
      console.log('ML SYSTEM STATUS: INACTIVE (Service not ready)');
    }
  } catch (err) {
    console.error('Error loading game:', err);
    setError(err.message || 'Failed to load game');
  } finally {
    setLoading(false);
  }
};
// Load game metadata and adaptive difficulty
useEffect(() => {
  // Only call loadGame when we have all dependencies or initialization is complete
  if (gameId && (mlService || mlInitialized)) {
    loadGame();
  }
}, [gameId, user, mlService, mlInitialized]);

  const handleGameComplete = async (gameResultData) => {
    try {
      // Set resetting flag to true to properly handle cleanup
      setResettingGame(true);
      
      // Record game data and show completion screen
      setGameData(gameResultData);
      setGameComplete(true);
      setMlAnalyzing(true); // Start ML analysis animation
      
      // Add score to history for ML validation
      setScoreHistory(prev => [...prev, gameResultData.score]);
      
      console.log('Game completed with data:', gameResultData);
      
      // MODIFIED: Update level if the game completed with a higher level
      if (gameResultData.level > currentLevel) {
        console.log(`Updating level: ${currentLevel} -> ${gameResultData.level}`);
        setCurrentLevel(gameResultData.level);
      } else {
        console.log(`Maintaining current level: ${currentLevel}`);
      }
      
      // Record game interaction with ML service if user is authenticated and mlService is available
      if (user && user._id && mlService) {
        try {
          const mlData = {
            studentId: user._id,
            gameId,
            score: gameResultData.score,
            timeSpent: gameResultData.timeSpent,
            completedLevel: gameResultData.level,
            totalLevels: gameResultData.totalLevels,
            skillsApplied: gameResultData.skills || game.skills,
              difficulty: difficulty
          };
          
          console.log("Sending to ML service:", mlData);
          
          // Record the interaction - with proper null check
          let mlResponse;
          try {
            if (typeof mlService.recordInteraction === 'function') {
              mlResponse = await mlService.recordInteraction(mlData);
              console.log('ML analysis complete:', mlResponse);
            } else {
              console.warn('recordInteraction method not available on mlService');
            }
          } catch (recordError) {
            console.error('Error recording interaction:', recordError);
            // Continue execution even if this fails
          }
          
          // Update skills progress based on game performance
          if (gameResultData.skills && gameResultData.skills.length > 0 && typeof mlService.updateProgress === 'function') {
            for (const skill of gameResultData.skills) {
              try {
                await mlService.updateProgress({
                  studentId: user._id,
                  subject: game.category,
                  skill: skill,
                  proficiencyLevel: gameResultData.score // Use game score as proficiency indicator
                });
              } catch (progressError) {
                console.error(`Error updating progress for skill ${skill}:`, progressError);
              }
            }
          }
          
          // Get updated difficulty for next round
          const oldDifficulty = difficulty;
          let newDifficulty = oldDifficulty; // Default to same difficulty
          
          try {
            // Try to get difficulty from the server - with proper check
            if (typeof mlService.getAdaptiveDifficulty === 'function') {
              newDifficulty = await mlService.getAdaptiveDifficulty(user._id, gameId);
              console.log('New adaptive difficulty from server:', newDifficulty);
            } else {
              console.warn('getAdaptiveDifficulty method not available, using local calculation');
              
              // Calculate difficulty locally as fallback
              const maxPossibleScore = 5 * 20; // 5 questions, 20 points each
              const performancePercentage = gameResultData.score / maxPossibleScore;
              
              if (performancePercentage > 0.7) {
                // Increase difficulty for good performance
                newDifficulty = Math.min(oldDifficulty + 0.1, 1.0);
                console.log('High performance (>70%), increasing difficulty');
              } else if (performancePercentage < 0.4) {
                // Decrease difficulty for poor performance
                newDifficulty = Math.max(oldDifficulty - 0.1, 0.1);
                console.log('Low performance (<40%), decreasing difficulty');
              } else {
                // Maintain difficulty for average performance
                console.log('Average performance (40-70%), maintaining difficulty');
              }
            }
          } catch (difficultyError) {
            console.error('Error getting adaptive difficulty from server:', difficultyError);
            
            // If server call fails, calculate difficulty locally
            // Calculate performance percentage (assuming 20 points per question, 5 questions)
            const maxPossibleScore = 5 * 20; // 5 questions, 20 points each
            const performancePercentage = gameResultData.score / maxPossibleScore;
            
            // Adjust difficulty based on performance
            if (performancePercentage > 0.7) {
              // Increase difficulty for good performance
              newDifficulty = Math.min(oldDifficulty + 0.1, 1.0);
              console.log('High performance (>70%), increasing difficulty');
            } else if (performancePercentage < 0.4) {
              // Decrease difficulty for poor performance
              newDifficulty = Math.max(oldDifficulty - 0.1, 0.1);
              console.log('Low performance (<40%), decreasing difficulty');
            } else {
              // Maintain difficulty for average performance
              console.log('Average performance (40-70%), maintaining difficulty');
            }
            
            console.log(`Local difficulty adjustment: ${Math.round(oldDifficulty * 100)}% → ${Math.round(newDifficulty * 100)}%`);
          }
          // Apply the new difficulty
          setDifficulty(newDifficulty);
          
          // Add to difficulty history
          setDifficultyHistory(prev => [...prev, newDifficulty]);
          
          // Store in storage for offline use
          try {
            const localDifficultyHistory = storageService.getItem('difficultyHistory', []);
            localDifficultyHistory.push(newDifficulty);
            storageService.setItem('difficultyHistory', localDifficultyHistory);
          const localScoreHistory = storageService.getItem('scoreHistory', []);
            localScoreHistory.push(gameResultData.score);
            storageService.setItem('scoreHistory', localScoreHistory);
          } catch (storageError) {
            console.error('Error storing difficulty in storage:', storageError);
          }
          
          // Console output to show ML is working
          console.log('ML SYSTEM STATUS: ACTIVE');
          console.log(`ML ADJUSTMENT: Difficulty changed from ${Math.round(oldDifficulty * 100)}% to ${Math.round(newDifficulty * 100)}%`);
          
          if (newDifficulty > oldDifficulty) {
            console.log('ML INSIGHT: Performance indicates skill improvement, increasing challenge');
          } else if (newDifficulty < oldDifficulty) {
            console.log('ML INSIGHT: Performance indicates need for more practice, decreasing challenge');
          } else {
            console.log('ML INSIGHT: Performance indicates appropriate challenge level, maintaining difficulty');
          }
          
          setMlAnalyzing(false); // ML analysis complete
          
          // Automatically start new game after a delay with proper cleanup
          setTimeout(() => {
            console.log('Automatically starting new game with difficulty:', newDifficulty);
            
            // Important: Destroy the game properly before resetting
            if (gameRef.current) {
              try {
                // This gives Phaser time to clean up properly
                gameRef.current.destroy(true);
                gameRef.current = null;
              } catch (destroyError) {
                console.error('Error destroying game:', destroyError);
              }
            }
            
            // Reset game state
            setGameComplete(false);
            setGameData(null);
            setResettingGame(false); // Reset flag after cleanup
          }, 5000); // 5 seconds delay to show the completion screen
        } catch (mlError) {
          console.error('ML service error:', mlError);
          setMlAnalyzing(false);
          setMlActive(false);
          
          // Even if there's an ML error, restart the game after a delay
          setTimeout(() => {
            // Clean up Phaser resources
            if (gameRef.current) {
              try {
                gameRef.current.destroy(true);
                gameRef.current = null;
              } catch (destroyError) {
                console.error('Error destroying game:', destroyError);
              }
            }
            
            setGameComplete(false);
            setGameData(null);
            setResettingGame(false);
          }, 5000);
        }
      } else {
        // If no user or mlService, use local difficulty adjustment
        const oldDifficulty = difficulty;
        let newDifficulty = oldDifficulty;
        
        // Calculate performance percentage (assuming 20 points per question, 5 questions)
        const maxPossibleScore = 5 * 20; // 5 questions, 20 points each
        const performancePercentage = gameResultData.score / maxPossibleScore;
        
        // Adjust difficulty based on performance
        if (performancePercentage > 0.7) {
          // Increase difficulty for good performance
          newDifficulty = Math.min(oldDifficulty + 0.1, 1.0);
          console.log('High performance (>70%), increasing difficulty');
        } else if (performancePercentage < 0.4) {
          // Decrease difficulty for poor performance
          newDifficulty = Math.max(oldDifficulty - 0.1, 0.1);
          console.log('Low performance (<40%), decreasing difficulty');
        } else {
          // Maintain difficulty for average performance
          console.log('Average performance (40-70%), maintaining difficulty');
        }
        
        console.log(`Local difficulty adjustment: ${Math.round(oldDifficulty * 100)}% → ${Math.round(newDifficulty * 100)}%`);
        
        // Apply the new difficulty
        setDifficulty(newDifficulty);
        setDifficultyHistory(prev => [...prev, newDifficulty]);
        
        // Wait a bit before continuing
        setTimeout(() => {
          setMlAnalyzing(false);
          // Automatically start new game after a shorter delay
          setTimeout(() => {
            // Clean up Phaser resources
            if (gameRef.current) {
              try {
                gameRef.current.destroy(true);
                gameRef.current = null;
              } catch (destroyError) {
                console.error('Error destroying game:', destroyError);
              }
            }
            
            setGameComplete(false);
            setGameData(null);
            setResettingGame(false);
          }, 3000);
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to process game completion:', error);
      setMlAnalyzing(false);
      
      // Even if there's an error, try to restart the game
      setTimeout(() => {
        // Clean up Phaser resources
        if (gameRef.current) {
          try {
            gameRef.current.destroy(true);
            gameRef.current = null;
          } catch (destroyError) {
            console.error('Error destroying game:', destroyError);
          }
        }
        
        setGameComplete(false);
        setGameData(null);
        setResettingGame(false);
      }, 5000);
    }
  };
  
  // Toggle ML debug tools visibility
  const toggleDebugTools = () => {
    const newValue = !showDebugTools;
    setShowDebugTools(newValue);
    storageService.setItem('showMLDebug', newValue);
  };
  
  // Handle return to dashboard
  const handleReturnToDashboard = () => {
    try {
      navigate('/dashboard');
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to home page if dashboard fails
      navigate('/');
    }
  };
  
  // Handle return to home
  const handleReturnToHome = () => {
    navigate('/');
  };
  
  // Handle play again
  const handlePlayAgain = () => {
    setResettingGame(true);
    
    // Clean up Phaser resources before resetting
    if (gameRef.current) {
      try {
        gameRef.current.destroy(true);
        gameRef.current = null;
      } catch (error) {
        console.error('Error destroying game:', error);
      }
    }
    
    // Reset game state
    setGameComplete(false);
    setGameData(null);
    setResettingGame(false);
    
    console.log(`Starting new game with difficulty: ${difficulty}`);
  };
  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
          <h2 className="text-xl text-white">Loading game...</h2>
        </div>
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="bg-red-900 text-white p-8 rounded-lg max-w-md text-center">
          <h2 className="text-2xl mb-4">Error Loading Game</h2>
          <p className="mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={handleReturnToDashboard}
              className="px-6 py-3 bg-red-700 hover:bg-red-600 rounded-lg text-white font-medium"
            >
              Return to Dashboard
              </button>
            <button 
              onClick={handleReturnToHome}
              className="px-6 py-3 bg-blue-700 hover:bg-blue-600 rounded-lg text-white font-medium"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Get the game component - handle cases where it might not exist
  let GameComponent = null;
  try {
    GameComponent = game?.component || null;
    if (!GameComponent && gameId) {
      // Try to get component based on gameId as fallback
      if (gameId === 'game1' || gameId === 'math') {
        GameComponent = MathGame;
      } else if (gameId === 'game2' || gameId === 'physics') {
        GameComponent = PhysicsGame;
      } else if (gameId === 'game3' || gameId === 'chemistry') {
        GameComponent = ChemistryGame;
      }
    }
  } catch (error) {
    console.error('Error getting game component:', error);
  }
  
  if (!GameComponent) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="bg-red-900 text-white p-8 rounded-lg max-w-md text-center">
          <h2 className="text-2xl mb-4">Game Component Not Found</h2>
          <p className="mb-6">Unable to load the game component for {gameId}</p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={handleReturnToDashboard}
              className="px-6 py-3 bg-red-700 hover:bg-red-600 rounded-lg text-white font-medium"
            >
              Return to Dashboard
            </button>
            <button 
              onClick={handleReturnToHome}
              className="px-6 py-3 bg-blue-700 hover:bg-blue-600 rounded-lg text-white font-medium"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-900 min-h-screen">
      {/* Dev Tools - Only shown in development or if manually enabled */}
      {showDebugTools && (
        <DevTools 
          difficultyHistory={difficultyHistory}
          scoreHistory={scoreHistory}
          mlService={mlService}
          userId={user?._id}
          gameId={gameId}
          mlActive={mlActive}
        />
      )}
      
      {/* ML Debug Console */}
      {showDebugTools && (
        <MLDebugConsole 
          isActive={mlActive}
          mlData={gameData || {}}
          difficultyHistory={difficultyHistory}
        />
      )}
      
      {/* Debug toggle button */}
      <button
        onClick={toggleDebugTools}
        className="fixed bottom-4 left-4 bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-lg z-50 opacity-50 hover:opacity-100"
      >
        {showDebugTools ? 'Hide' : 'Show'} ML Debug
      </button>
      
      {/* Game header - Fixed with proper styling */}
      <div className="mb-6 bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 
          className="text-4xl font-bold mb-3" 
          style={{ color: game?.color || '#FFFFFF' }}
        >
          {game?.title || 'Educational Game'}
        </h1>
        <p className="text-gray-300 mb-4">{game?.description || 'Practice and improve your skills with this interactive learning game.'}</p>
        
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="bg-gray-700 px-4 py-2 rounded-lg">
            <span className="text-gray-400 mr-2 text-sm">Difficulty:</span>
            <span 
              className="px-2 py-1 rounded text-white font-medium"
              style={{ 
                backgroundColor: difficulty < 0.3 ? '#4CAF50' : difficulty < 0.7 ? '#FFC107' : '#F44336',
              }}
            >
              {difficulty < 0.3 ? 'Easy' : difficulty < 0.7 ? 'Medium' : 'Hard'} ({Math.round(difficulty * 100)}%)
            </span>
          </div>
          
          {/* ML Status Indicator */}
          <div className="bg-gray-700 px-4 py-2 rounded-lg flex items-center">
            <span className="text-gray-400 mr-2 text-sm">AI Learning:</span>
            <span className="flex items-center">
              <span className={`h-2 w-2 rounded-full mr-2 ${mlActive ? 'bg-green-500' : 'bg-gray-500'}`}></span>
              <span className={mlActive ? 'text-green-400' : 'text-gray-400'}>
                {mlActive ? 'Active' : 'Inactive'}
              </span>
            </span>
          </div>

          {/* Add a Level Indicator */}
          <div className="bg-gray-700 px-4 py-2 rounded-lg">
            <span className="text-gray-400 mr-2 text-sm">Current Level:</span>
            <span className="px-2 py-1 rounded text-white font-medium bg-purple-600">
              {currentLevel}
            </span>
          </div>
        </div>
        
        {/* Skills tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {game?.skills?.map((skill, index) => (
            <span 
              key={index} 
              className="text-xs py-1 px-3 rounded-full text-white font-medium"
              style={{ backgroundColor: `${game.color || '#4CAF50'}90` }}
            >
              {skill}
            </span>
          ))}
        </div>
        
        {/* Enhanced Difficulty Indicator with better styling */}
        <EnhancedDifficultyIndicator difficultyHistory={difficultyHistory} />
      </div>

      {/* Game container with improved styling */}
      <div className="relative">
        <div className="game-container neural-theme bg-black rounded-lg overflow-hidden shadow-2xl border border-gray-700">
          {GameComponent && !gameComplete && !resettingGame && (
            <GameComponent 
              difficulty={difficulty}
              initialLevel={currentLevel} // Pass the current level to the game component
              onComplete={handleGameComplete}
              gameRef={gameRef}
            />
          )}
          {resettingGame && (
            <div className="flex items-center justify-center h-full w-full bg-gray-900">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
                <p className="text-white text-lg">Preparing next round...</p>
              </div>
            </div>
          )}
        </div>

        {/* Game completion overlay */}
        {gameComplete && gameData && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-10">
            <div className="bg-gray-800 rounded-xl p-8 max-w-lg w-full text-white text-center shadow-2xl border border-gray-600">
              <h2 className="text-3xl font-bold mb-4" style={{ color: game?.color || '#4CAF50' }}>
                Game Complete!
              </h2>
              
              {/* Score and metrics */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-700 rounded-lg p-4 shadow-inner">
                  <div className="text-gray-400 mb-1 text-sm font-medium">Score</div>
                  <div className="text-3xl font-bold">{gameData.score}</div>
                </div>
                
                <div className="bg-gray-700 rounded-lg p-4 shadow-inner">
                  <div className="text-gray-400 mb-1 text-sm font-medium">Time</div>
                  <div className="text-3xl font-bold">{gameData.timeSpent}s</div>
                </div>
                
                <div className="bg-gray-700 rounded-lg p-4 shadow-inner">
                  <div className="text-gray-400 mb-1 text-sm font-medium">Level</div>
                  <div className="text-3xl font-bold">{gameData.level}/{gameData.totalLevels}</div>
                </div>
                
                <div className="bg-gray-700 rounded-lg p-4 shadow-inner">
                  <div className="text-gray-400 mb-1 text-sm font-medium">Skills Improved</div>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {(gameData.skills || game?.skills || []).map((skill, index) => (
                      <span 
                        key={index} 
                        className="text-xs py-1 px-2 rounded-full"
                        style={{ backgroundColor: `${game?.color || '#4CAF50'}40`, color: game?.color || '#4CAF50' }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* ML Analysis Indicator */}
              <div className="bg-gray-700 rounded-lg p-4 mb-4 shadow-inner">
                <div className="text-gray-300 mb-2 text-sm font-medium">AI Learning Assistant</div>
                <div className="flex items-center gap-2 justify-center mb-3">
                  <Brain size={18} className="text-blue-400" />
                  <span className="text-blue-400 font-medium">
                    {mlAnalyzing ? 'Analyzing your performance...' : 'Analysis complete'}
                  </span>
                </div>
                <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                  {mlAnalyzing ? (
                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full progress-bar-animated"></div>
                  ) : (
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '100%' }}></div>
                  )}
                </div>
                <p className="text-sm text-gray-300 mt-3">
                  {mlAnalyzing 
                    ? 'Optimizing the next round based on your performance...' 
                    : difficultyHistory.length > 1 ? (
                      difficultyHistory[difficultyHistory.length - 1] > difficultyHistory[difficultyHistory.length - 2]
                        ? `Difficulty increased to ${Math.round(difficulty * 100)}% - You're doing well!`
                        : difficultyHistory[difficultyHistory.length - 1] < difficultyHistory[difficultyHistory.length - 2]
                        ? `Difficulty decreased to ${Math.round(difficulty * 100)}% - For better skill development`
                        : `Difficulty maintained at ${Math.round(difficulty * 100)}% - Optimal learning level`
                    ) : `Next round difficulty set to ${Math.round(difficulty * 100)}%`
                  }
                </p>
                
                {/* ML system status indicator */}
                <div className="flex items-center justify-center gap-2 mt-2">
                  <div className={`h-2 w-2 rounded-full ${mlActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={`text-xs ${mlActive ? 'text-green-400' : 'text-red-400'}`}>
                    ML system {mlActive ? 'active' : 'inactive'}
                  </span>
                </div>
              </div>
              
              {/* Learning insights */}
              {!mlAnalyzing && (
                <div className="bg-gray-700 rounded-lg p-4 mb-6 text-left shadow-inner">
                  <div className="text-gray-300 mb-2 text-sm font-medium">Learning Insights</div>
                  <p className="text-sm text-gray-300">
                    {generateLearningInsights(gameData, game)}
                  </p>
                </div>
              )}
              
              {/* Action buttons */}
              <div className="flex gap-4 justify-center">
                <button 
                  onClick={handlePlayAgain}
                  className="px-6 py-3 rounded-lg font-medium shadow-md transition-all hover:shadow-lg"
                  style={{ backgroundColor: game?.color || '#4CAF50', color: '#000' }}
                  disabled={mlAnalyzing}
                >
                  {mlAnalyzing ? 'Analyzing...' : 'Play Again'}
                </button>
                
                <button 
                  onClick={handleReturnToDashboard}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-500 rounded-lg text-white font-medium shadow-md transition-all hover:shadow-lg"
                >
                  Dashboard
                </button>
                
                <button 
                  onClick={handleReturnToHome}
                  className="px-6 py-3 bg-blue-700 hover:bg-blue-600 rounded-lg text-white font-medium shadow-md transition-all hover:shadow-lg"
                >
                  Home
                </button>
              </div>
              
              {/* Auto-continue message */}
              {!mlAnalyzing && (
                <p className="text-xs text-gray-400 mt-4">
                  Starting new game automatically in a few seconds...
                </p>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* CSS for animations */}
      <style>{`
        @keyframes progress-animate {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .progress-bar-animated {
          animation: progress-animate 1.5s ease-in-out infinite;
        }
        
        .game-container {
          width: 800px;
          height: 600px;
          margin: 0 auto;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
          background-color: #000000 !important; /* Force black background */
        }
        
        canvas {
          background-color: transparent !important; /* Prevent any background color on canvas */
        }
        
        /* Neural theme improved */
        .neural-theme {
          background: #0f0c29;  /* fallback for old browsers */
          background: -webkit-linear-gradient(to right, #24243e, #302b63, #0f0c29);
          background: linear-gradient(to right, #24243e, #302b63, #0f0c29);
          position: relative;
          overflow: hidden;
        }
        
        .neural-theme::before,
        .neural-theme::after {
          content: '';
          position: absolute;
          width: 200vw;
          height: 200vh;
          top: -50vh;
          left: -50vw;
          z-index: 1;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 800 800'%3E%3Cg fill='none' stroke='%238B5CF6' stroke-width='1'%3E%3Cpathd='M119.39 414.78c55.03 55.03 220.61 220.61 330.5 330.5M178.38 96.5c18.34 18.34 36.67 36.67 55.01 55.01M287.5 198.61c-3.96 3.96-7.92 7.92-11.88 11.88M19.69 299.89c10.51 10.51 21.02 21.02 31.53 31.53M255.96 541.43c-20.43 20.43-40.87 40.87-61.3 61.3M544.43 255.96c56.16 56.16 112.33 112.33 168.49 168.49' stroke-dasharray='6,90,6'/%3E%3C/g%3E%3C/svg%3E");
          opacity: 0.1;
          animation: neural-bg 150s linear infinite;
        }
        
        .neural-theme::after {
          background-size: 100px 100px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 200 200'%3E%3Cdefs%3E%3ClinearGradient id='a' gradientUnits='userSpaceOnUse' x1='100' y1='33' x2='100' y2='140'%3E%3Cstop offset='0' stop-color='%23000' stop-opacity='0'/%3E%3Cstop offset='1' stop-color='%23000' stop-opacity='0.1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath fill='url(%23a)' d='M100 50Q100 0 150 0Q200 0 200 50V150Q200 200 150 200Q100 200 100 150Z' /%3E%3C/svg%3E");
          opacity: 0.05;
          animation: neural-bg 120s linear infinite;
        }
        
        @keyframes neural-bg {
          from { transform: translateX(0) translateY(0) rotate(0deg); }
          to { transform: translateX(-50%) translateY(-50%) rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default GamePage;