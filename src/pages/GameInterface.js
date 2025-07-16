import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GameInterface = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [gameState, setGameState] = useState('loading'); // loading, playing, paused, completed
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [gameData, setGameData] = useState(null);

  // Mock game data
  const mockGameData = {
    1: {
      id: 1,
      title: 'Algebra Quest',
      description: 'Master algebraic equations through exciting adventures',
      thumbnail: '🧮',
      difficulty: 'medium',
      totalQuestions: 10,
      timeLimit: 300,
      questions: [
        {
          id: 1,
          question: 'Solve for x: 2x + 5 = 15',
          options: ['x = 5', 'x = 10', 'x = 7.5', 'x = 2.5'],
          correct: 0,
          explanation: '2x + 5 = 15, so 2x = 10, therefore x = 5'
        },
        {
          id: 2,
          question: 'What is the value of x² when x = 4?',
          options: ['8', '12', '16', '20'],
          correct: 2,
          explanation: 'x² = 4² = 4 × 4 = 16'
        },
        {
          id: 3,
          question: 'Simplify: 3x + 2x',
          options: ['5x', '6x', '5x²', '6x²'],
          correct: 0,
          explanation: '3x + 2x = (3 + 2)x = 5x'
        },
        {
          id: 4,
          question: 'If y = 2x + 3 and x = 4, what is y?',
          options: ['9', '10', '11', '12'],
          correct: 2,
          explanation: 'y = 2(4) + 3 = 8 + 3 = 11'
        },
        {
          id: 5,
          question: 'Factor: x² - 9',
          options: ['(x - 3)(x + 3)', '(x - 9)(x + 1)', 'x(x - 9)', '(x - 3)²'],
          correct: 0,
          explanation: 'x² - 9 = x² - 3² = (x - 3)(x + 3) using difference of squares'
        }
      ]
    },
    2: {
      id: 2,
      title: 'Number Ninja',
      description: 'Sharpen your arithmetic skills',
      thumbnail: '🥷',
      difficulty: 'easy',
      totalQuestions: 8,
      timeLimit: 240,
      questions: [
        {
          id: 1,
          question: 'What is 15 + 27?',
          options: ['42', '41', '43', '40'],
          correct: 0,
          explanation: '15 + 27 = 42'
        },
        {
          id: 2,
          question: 'What is 8 × 7?',
          options: ['54', '56', '58', '52'],
          correct: 1,
          explanation: '8 × 7 = 56'
        }
      ]
    }
  };

  useEffect(() => {
    // Load game data
    const game = mockGameData[gameId];
    if (game) {
      setGameData(game);
      setTimeLeft(game.timeLimit);
      setGameState('playing');
    } else {
      navigate('/404');
    }
  }, [gameId, navigate]);

  useEffect(() => {
    // Timer countdown
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleGameComplete();
    }
  }, [timeLeft, gameState]);

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === gameData.questions[currentQuestion].correct;
    if (isCorrect) {
      setScore(score + 10);
    }

    setShowResult(true);
    
    setTimeout(() => {
      setShowResult(false);
      setSelectedAnswer(null);
      
      if (currentQuestion < gameData.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        handleGameComplete();
      }
    }, 2000);
  };

  const handleGameComplete = () => {
    setGameState('completed');
    // Save score to backend here
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(gameData.timeLimit);
    setSelectedAnswer(null);
    setShowResult(false);
    setGameState('playing');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreMessage = () => {
    const percentage = (score / (gameData.questions.length * 10)) * 100;
    if (percentage >= 90) return { message: 'Excellent! 🏆', color: 'var(--neon-green)' };
    if (percentage >= 70) return { message: 'Great job! 🎉', color: 'var(--neon-blue)' };
    if (percentage >= 50) return { message: 'Good effort! 👍', color: 'var(--neon-orange)' };
    return { message: 'Keep practicing! 💪', color: 'var(--neon-pink)' };
  };

  if (gameState === 'loading' || !gameData) {
    return (
      <div className="game-loading">
        <motion.div
          className="loading-spinner-main"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p>Loading game...</p>
      </div>
    );
  }

  if (gameState === 'completed') {
    const scoreMessage = getScoreMessage();
    const percentage = (score / (gameData.questions.length * 10)) * 100;

    return (
      <motion.div
        className="game-completed"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="completion-content">
          <motion.div
            className="completion-icon"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🎉
          </motion.div>
          
          <h1>Game Complete!</h1>
          <h2 style={{ color: scoreMessage.color }}>{scoreMessage.message}</h2>
          
          <div className="score-summary">
            <div className="score-circle">
              <svg width="120" height="120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="8"
                />
                <motion.circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="var(--neon-blue)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 50 * (1 - percentage / 100) }}
                  transition={{ duration: 2, delay: 0.5 }}
                />
              </svg>
              <div className="score-text">
                <span className="score-number">{Math.round(percentage)}%</span>
                <span className="score-label">Score</span>
              </div>
            </div>
          </div>

          <div className="completion-stats">
            <div className="stat">
              <span className="stat-value">{score}</span>
              <span className="stat-label">Points Earned</span>
            </div>
            <div className="stat">
              <span className="stat-value">{currentQuestion + 1}</span>
              <span className="stat-label">Questions Answered</span>
            </div>
            <div className="stat">
              <span className="stat-value">{formatTime(gameData.timeLimit - timeLeft)}</span>
              <span className="stat-label">Time Taken</span>
            </div>
          </div>

          <div className="completion-actions">
            <motion.button
              className="btn-neon"
              onClick={handleRestart}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Play Again
            </motion.button>
            <motion.button
              className="btn-neon-secondary"
              onClick={() => navigate('/student')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Back to Dashboard
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  const currentQ = gameData.questions[currentQuestion];

  return (
    <div className="game-interface">
      {/* Game Header */}
      <div className="game-header">
        <div className="game-info">
          <h1 className="game-title">{gameData.title}</h1>
          <div className="game-progress">
            Question {currentQuestion + 1} of {gameData.questions.length}
          </div>
        </div>
        
        <div className="game-stats">
          <div className="stat-item">
            <span className="stat-icon">⏰</span>
            <span className={`stat-value ${timeLeft < 60 ? 'urgent' : ''}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">⭐</span>
            <span className="stat-value">{score}</span>
          </div>
        </div>

        <motion.button
          className="game-exit-btn"
          onClick={() => navigate('/student')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          ❌
        </motion.button>
      </div>

      {/* Progress Bar */}
      <div className="game-progress-bar">
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${((currentQuestion + 1) / gameData.questions.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Question Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          className="question-container"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <div className="question-content">
            <h2 className="question-text">{currentQ.question}</h2>
            
            <div className="options-grid">
              {currentQ.options.map((option, index) => (
                <motion.button
                  key={index}
                  className={`option-btn ${selectedAnswer === index ? 'selected' : ''}`}
                  onClick={() => handleAnswerSelect(index)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={showResult}
                >
                  <span className="option-letter">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="option-text">{option}</span>
                </motion.button>
              ))}
            </div>

            <motion.button
              className="submit-btn"
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null || showResult}
              whileHover={{ scale: selectedAnswer !== null ? 1.05 : 1 }}
              whileTap={{ scale: selectedAnswer !== null ? 0.95 : 1 }}
            >
              {showResult ? 'Processing...' : 'Submit Answer'}
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Result Modal */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            className="result-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="result-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className={`result-icon ${selectedAnswer === currentQ.correct ? 'correct' : 'incorrect'}`}>
                {selectedAnswer === currentQ.correct ? '✅' : '❌'}
              </div>
              
              <h3 className={`result-title ${selectedAnswer === currentQ.correct ? 'correct' : 'incorrect'}`}>
                {selectedAnswer === currentQ.correct ? 'Correct!' : 'Incorrect!'}
              </h3>
              
              <div className="result-explanation">
                <p><strong>Explanation:</strong></p>
                <p>{currentQ.explanation}</p>
              </div>

              {selectedAnswer === currentQ.correct && (
                <div className="points-earned">
                  <span>+10 Points!</span>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Controls */}
      <div className="game-controls">
        <motion.button
          className="control-btn pause-btn"
          onClick={() => setGameState('paused')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ⏸️ Pause
        </motion.button>
        
        <div className="question-nav">
          <motion.button
            className="nav-btn"
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            whileHover={{ scale: currentQuestion > 0 ? 1.05 : 1 }}
          >
            ← Previous
          </motion.button>
          
          <motion.button
            className="nav-btn"
            onClick={() => setCurrentQuestion(Math.min(gameData.questions.length - 1, currentQuestion + 1))}
            disabled={currentQuestion === gameData.questions.length - 1}
            whileHover={{ scale: currentQuestion < gameData.questions.length - 1 ? 1.05 : 1 }}
          >
            Next →
          </motion.button>
        </div>
      </div>

      {/* Pause Modal */}
      <AnimatePresence>
        {gameState === 'paused' && (
          <motion.div
            className="pause-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="pause-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h2>Game Paused</h2>
              <p>Take a break! Your progress is saved.</p>
              
              <div className="pause-actions">
                <motion.button
                  className="btn-neon"
                  onClick={() => setGameState('playing')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Resume Game
                </motion.button>
                
                <motion.button
                  className="btn-neon-secondary"
                  onClick={() => navigate('/student')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Exit Game
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GameInterface;