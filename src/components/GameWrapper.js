// src/components/GameWrapper.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import MathGame from '../games/MathGame';
import mlService from '../services/mlService';

const GameWrapper = ({ gameId = 'math', userId = 'test-user' }) => {
  const [difficulty, setDifficulty] = useState(0.5);
  const [initialLevel, setInitialLevel] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [usingMockMode, setUsingMockMode] = useState(false);
  
  const gameRef = useRef(null);
  const navigate = useNavigate();
  
  // Check authentication and load game settings
  useEffect(() => {
    const loadGameSettings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Test connection and check auth status
        const connectionTest = await mlService.diagnostics.testConnection();
        console.log('Connection test result:', connectionTest);
        
        // If connection test failed, show error but continue with defaults
        if (!connectionTest.success) {
          setError(`Connection issue: ${connectionTest.message}`);
          // If connection fails, we'll use mock mode
          setUsingMockMode(true);
        }
        
        // Check if we're authenticated
        const isAuthenticated = await mlService.auth.checkStatus();
        
        // If not authenticated, show login prompt and use mock mode
        if (!isAuthenticated) {
          console.log('Not authenticated - using local data and mock services');
          setShowLoginPrompt(true);
          setUsingMockMode(true);
        }
        
        // Get difficulty level - this will use mock service if needed
        const gameDifficulty = await mlService.getAdaptiveDifficulty(userId, gameId);
        setDifficulty(gameDifficulty);
        
        // Determine initial level (could be based on past performance)
        const userHistory = await mlService.getPerformanceData(userId, gameId);
        const startLevel = calculateStartLevel(userHistory);
        setInitialLevel(startLevel);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading game settings:', error);
        setError('Failed to load game settings. Using defaults.');
        setDifficulty(0.5);
        setInitialLevel(1);
        setUsingMockMode(true);
        setIsLoading(false);
      }
    };
    
    loadGameSettings();
  }, [gameId, userId]);
  
  // Calculate starting level based on user history
  const calculateStartLevel = (history) => {
    // If no history or no interactions, start at level 1
    if (!history || !history.interactions || history.interactions.length === 0) {
      return 1;
    }
    
    // Get the last 3 interactions
    const recentInteractions = [...history.interactions]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 3);
    
    // Calculate average score
    const avgScore = recentInteractions.reduce((sum, item) => sum + item.score, 0) / recentInteractions.length;
    
    // Determine level based on score
    if (avgScore > 0.8) {
      return 3; // Start at level 3 for high performers
    } else if (avgScore > 0.6) {
      return 2; // Start at level 2 for moderate performers
    } else {
      return 1; // Start at level 1 for new or struggling users
    }
  };
  
  // Handle game completion
  const handleGameComplete = async (gameData) => {
    try {
      console.log('Game completed with data:', gameData);
      
      // Record the interaction
      const interactionResult = await mlService.recordInteraction({
        studentId: userId,
        gameId: gameId,
        score: gameData.score,
        timeSpent: gameData.timeSpent,
        level: gameData.level,
        questionsAnswered: 5
      });
      
      console.log('Interaction recorded:', interactionResult);
      
      // Update difficulty for next game
      if (interactionResult && interactionResult.newDifficulty) {
        setDifficulty(interactionResult.newDifficulty);
      }
      
      // Reset game or navigate based on shouldContinue flag
      if (interactionResult && interactionResult.shouldContinue !== false) {
        // Start a new game with the new difficulty
        setInitialLevel(1); // Reset level for new game
        
        // Clean up the old game
        if (gameRef.current) {
          gameRef.current.destroy(true);
          gameRef.current = null;
        }
        
        // Force component to re-render with new settings
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      } else {
        // Navigate away if should not continue
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error handling game completion:', error);
      // Handle error but still allow continuing
      setError('Failed to save game results, but you can continue playing.');
      
      // Reset for a new game anyway
      setInitialLevel(1);
      
      // Clean up the old game
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
      
      // Force re-render
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  };
  
  // Handle login button click
  const handleLogin = () => {
    // Save current location to return after login
    sessionStorage.setItem('returnAfterLogin', window.location.pathname);
    navigate('/login');
  };
  
  // Handle continuing in offline mode
  const handleContinueOffline = () => {
    setShowLoginPrompt(false);
  };
  
  // Toggle mock mode manually
  const toggleMockMode = () => {
    const newMode = !usingMockMode;
    mlService.toggleMock(newMode);
    setUsingMockMode(newMode);
  };

  return (
    <div className="game-wrapper">
      {/* Header with status indicators */}
      <div className="game-header">
        <h2>Math Challenge</h2>
        
        {/* Display connection status */}
        <div className="connection-status">
          <span className={usingMockMode ? "status-offline" : "status-online"}>
            {usingMockMode ? "Offline Mode" : "Online Mode"}
          </span>
          
          {/* Toggle button for mock/real mode */}
          <button 
            className="toggle-mode-btn"
            onClick={toggleMockMode}
          >
            Switch to {usingMockMode ? "Online" : "Offline"} Mode
          </button>
        </div>
      </div>
      
      {/* Error message if any */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
      
      {/* Login prompt if not authenticated */}
      {showLoginPrompt && (
        <div className="login-prompt">
          <div className="prompt-content">
            <h3>Login Required</h3>
            <p>For the best experience with personalized difficulty and progress tracking, please log in.</p>
            <p>You're currently using offline mode with local data only.</p>
            
            <div className="prompt-buttons">
              <button className="login-btn" onClick={handleLogin}>
                Log In
              </button>
              <button className="continue-offline-btn" onClick={handleContinueOffline}>
                Continue Offline
              </button>
            </div>
          </div></div>
      )}
      
      {/* Loading state */}
      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading game...</p>
        </div>
      ) : (
        /* Game component */
        <div className="game-container">
          {/* Display current difficulty and level */}
          <div className="game-info">
            <div className="info-box">
              <span className="info-label">Difficulty:</span>
              <span className="info-value">{Math.round(difficulty * 100)}%</span>
            </div>
            <div className="info-box">
              <span className="info-label">Starting Level:</span>
              <span className="info-value">{initialLevel}</span>
            </div>
          </div>
          
          {/* The actual game component */}
          <MathGame
            difficulty={difficulty}
            initialLevel={initialLevel}
            onComplete={handleGameComplete}
            gameRef={gameRef}
          />
        </div>
      )}
      
      {/* Footer with help text */}
      <div className="game-footer">
        <p className="help-text">
          Complete challenges to progress through levels. Your performance will adjust the game difficulty automatically.
        </p>
        {usingMockMode && (
          <p className="offline-notice">
            You're playing in offline mode. Your progress is saved locally but won't sync with your account.
          </p>
        )}
      </div>
      
      {/* Add some CSS for this component */}
      <style jsx="true">{`
        .game-wrapper {
          display: flex;
          flex-direction: column;
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        
        .game-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .connection-status {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .status-online {
          color: #4CAF50;
          font-weight: bold;
        }
        
        .status-offline {
          color: #FF9800;
          font-weight: bold;
        }
        
        .toggle-mode-btn {
          background-color: #f1f1f1;
          border: 1px solid #ddd;
          padding: 5px 10px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }
        
        .error-message {
          background-color: #ffebee;
          color: #c62828;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 20px;
        }
        
        .login-prompt {
          background-color: rgba(0, 0, 0, 0.8);
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .prompt-content {
          background-color: white;
          border-radius: 8px;
          padding: 30px;
          max-width: 500px;
          text-align: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }
        
        .prompt-buttons {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 20px;
        }
        
        .login-btn {
          background-color: #4285F4;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        }
        
        .continue-offline-btn {
          background-color: #f1f1f1;
          border: 1px solid #ddd;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 600px;
        }
        
        .loading-spinner {
          border: 5px solid #f3f3f3;
          border-top: 5px solid #3498db;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .game-info {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
        }
        
        .info-box {
          background-color: #f8f9fa;
          padding: 10px 15px;
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .info-label {
          font-size: 14px;
          color: #666;
        }
        
        .info-value {
          font-size: 18px;
          font-weight: bold;
          color: #333;
        }
        
        .game-footer {
          margin-top: 20px;
          text-align: center;
          color: #666;
        }
        
        .offline-notice {
          color: #FF9800;
          font-size: 14px;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
};

export default GameWrapper;