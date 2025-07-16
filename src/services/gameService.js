import { api, endpoints } from './api';
import { GAME_DIFFICULTIES, GAME_CATEGORIES } from '../utils/constants';

// Mock game data for development
const mockGames = {
  1: {
    id: 1,
    title: 'Algebra Quest',
    description: 'Master algebraic equations through exciting adventures',
    thumbnail: '🧮',
    difficulty: 'medium',
    category: 'algebra',
    timeLimit: 300,
    totalQuestions: 20,
    questions: [
      {
        id: 1,
        question: 'Solve for x: 2x + 5 = 15',
        options: ['x = 5', 'x = 10', 'x = 7.5', 'x = 2.5'],
        correct: 0,
        explanation: '2x + 5 = 15, so 2x = 10, therefore x = 5',
        points: 10,
        timeLimit: 30
      },
      {
        id: 2,
        question: 'What is the value of x² when x = 4?',
        options: ['8', '12', '16', '20'],
        correct: 2,
        explanation: 'x² = 4² = 4 × 4 = 16',
        points: 10,
        timeLimit: 30
      },
      {
        id: 3,
        question: 'Simplify: 3x + 2x',
        options: ['5x', '6x', '5x²', '6x²'],
        correct: 0,
        explanation: '3x + 2x = (3 + 2)x = 5x',
        points: 10,
        timeLimit: 30
      }
    ],
    isActive: true,
    playCount: 1234,
    avgScore: 78.5,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-12-10T00:00:00Z'
  },
  2: {
    id: 2,
    title: 'Number Ninja',
    description: 'Sharpen your arithmetic skills with fast-paced challenges',
    thumbnail: '🥷',
    difficulty: 'easy',
    category: 'arithmetic',
    timeLimit: 240,
    totalQuestions: 15,
    questions: [
      {
        id: 1,
        question: 'What is 15 + 27?',
        options: ['42', '41', '43', '40'],
        correct: 0,
        explanation: '15 + 27 = 42',
        points: 10,
        timeLimit: 20
      },
      {
        id: 2,
        question: 'What is 8 × 7?',
        options: ['54', '56', '58', '52'],
        correct: 1,
        explanation: '8 × 7 = 56',
        points: 10,
        timeLimit: 20
      }
    ],
    isActive: true,
    playCount: 2156,
    avgScore: 82.3,
    createdAt: '2024-02-20T00:00:00Z',
    updatedAt: '2024-11-25T00:00:00Z'
  }
};

class GameService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
    this.useLocalStorage = process.env.NODE_ENV === 'development';
  }

  // Simulate API delay
  delay(ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get all games
  async getAllGames(filters = {}) {
    try {
      await this.delay();

      if (this.useLocalStorage) {
        // Use mock data in development
        let games = Object.values(mockGames);

        // Apply filters
        if (filters.category && filters.category !== 'all') {
          games = games.filter(game => game.category === filters.category);
        }

        if (filters.difficulty && filters.difficulty !== 'all') {
          games = games.filter(game => game.difficulty === filters.difficulty);
        }

        if (filters.isActive !== undefined) {
          games = games.filter(game => game.isActive === filters.isActive);
        }

        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          games = games.filter(game => 
            game.title.toLowerCase().includes(searchLower) ||
            game.description.toLowerCase().includes(searchLower)
          );
        }

        return {
          success: true,
          data: games,
          total: games.length
        };
      }

      // Use real API in production
      const response = await api.get(endpoints.games.list, filters);
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch games: ${error.message}`);
    }
  }

  // Get game by ID
  async getGameById(gameId) {
    try {
      await this.delay();

      if (this.useLocalStorage) {
        const game = mockGames[gameId];
        if (!game) {
          throw new Error('Game not found');
        }

        return {
          success: true,
          data: game
        };
      }

      const response = await api.get(endpoints.games.get(gameId));
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch game: ${error.message}`);
    }
  }

  // Create new game
  async createGame(gameData) {
    try {
      await this.delay(1000);

      // Validate game data
      this.validateGameData(gameData);

      if (this.useLocalStorage) {
        const newGame = {
          ...gameData,
          id: Date.now(),
          playCount: 0,
          avgScore: 0,
          questions: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        // In a real app, this would persist to localStorage or IndexedDB
        console.log('Game created:', newGame);

        return {
          success: true,
          data: newGame,
          message: 'Game created successfully'
        };
      }

      const response = await api.post(endpoints.games.create, gameData);
      return response;
    } catch (error) {
      throw new Error(`Failed to create game: ${error.message}`);
    }
  }

  // Update game
  async updateGame(gameId, gameData) {
    try {
      await this.delay(800);

      this.validateGameData(gameData);

      if (this.useLocalStorage) {
        const updatedGame = {
          ...gameData,
          id: gameId,
          updatedAt: new Date().toISOString()
        };

        console.log('Game updated:', updatedGame);

        return {
          success: true,
          data: updatedGame,
          message: 'Game updated successfully'
        };
      }

      const response = await api.put(endpoints.games.update(gameId), gameData);
      return response;
    } catch (error) {
      throw new Error(`Failed to update game: ${error.message}`);
    }
  }

  // Delete game
  async deleteGame(gameId) {
    try {
      await this.delay();

      if (this.useLocalStorage) {
        console.log('Game deleted:', gameId);

        return {
          success: true,
          message: 'Game deleted successfully'
        };
      }

      const response = await api.delete(endpoints.games.delete(gameId));
      return response;
    } catch (error) {
      throw new Error(`Failed to delete game: ${error.message}`);
    }
  }

  // Play game (start game session)
  async playGame(gameId, userId) {
    try {
      await this.delay();

      const gameData = await this.getGameById(gameId);
      
      if (!gameData.success) {
        throw new Error('Game not found');
      }

      const game = gameData.data;

      // Create game session
      const gameSession = {
        id: Date.now(),
        gameId,
        userId,
        startTime: new Date().toISOString(),
        questions: this.shuffleQuestions(game.questions),
        currentQuestion: 0,
        score: 0,
        answers: [],
        timeRemaining: game.timeLimit,
        status: 'playing'
      };

      // In a real app, store session in backend
      if (this.useLocalStorage) {
        localStorage.setItem(`gameSession_${gameSession.id}`, JSON.stringify(gameSession));
      }

      return {
        success: true,
        data: gameSession
      };
    } catch (error) {
      throw new Error(`Failed to start game: ${error.message}`);
    }
  }

  // Submit answer
  async submitAnswer(sessionId, questionId, answerIndex) {
    try {
      await this.delay(200);

      if (this.useLocalStorage) {
        const sessionData = localStorage.getItem(`gameSession_${sessionId}`);
        if (!sessionData) {
          throw new Error('Game session not found');
        }

        const session = JSON.parse(sessionData);
        const currentQuestion = session.questions[session.currentQuestion];
        
        if (currentQuestion.id !== questionId) {
          throw new Error('Invalid question');
        }

        const isCorrect = answerIndex === currentQuestion.correct;
        const points = isCorrect ? currentQuestion.points : 0;

        // Update session
        session.answers.push({
          questionId,
          answerIndex,
          isCorrect,
          points,
          timeSpent: Math.random() * 30 + 10 // Mock time spent
        });

        session.score += points;
        session.currentQuestion += 1;

        // Save updated session
        localStorage.setItem(`gameSession_${sessionId}`, JSON.stringify(session));

        return {
          success: true,
          data: {
            isCorrect,
            points,
            explanation: currentQuestion.explanation,
            totalScore: session.score,
            isComplete: session.currentQuestion >= session.questions.length
          }
        };
      }

      const response = await api.post(`/game-sessions/${sessionId}/answer`, {
        questionId,
        answerIndex
      });
      return response;
    } catch (error) {
      throw new Error(`Failed to submit answer: ${error.message}`);
    }
  }

  // Complete game
  async completeGame(sessionId) {
    try {
      await this.delay(500);

      if (this.useLocalStorage) {
        const sessionData = localStorage.getItem(`gameSession_${sessionId}`);
        if (!sessionData) {
          throw new Error('Game session not found');
        }

        const session = JSON.parse(sessionData);
        session.status = 'completed';
        session.endTime = new Date().toISOString();
        session.totalTime = new Date(session.endTime) - new Date(session.startTime);

        // Calculate final statistics
        const correctAnswers = session.answers.filter(a => a.isCorrect).length;
        const totalQuestions = session.questions.length;
        const percentage = Math.round((correctAnswers / totalQuestions) * 100);

        const result = {
          sessionId,
          gameId: session.gameId,
          userId: session.userId,
          score: session.score,
          percentage,
          correctAnswers,
          totalQuestions,
          totalTime: session.totalTime,
          answers: session.answers
        };

        // Save result
        localStorage.setItem(`gameResult_${sessionId}`, JSON.stringify(result));
        localStorage.removeItem(`gameSession_${sessionId}`);

        return {
          success: true,
          data: result
        };
      }

      const response = await api.post(`/game-sessions/${sessionId}/complete`);
      return response;
    } catch (error) {
      throw new Error(`Failed to complete game: ${error.message}`);
    }
  }

  // Get game statistics
  async getGameStats(gameId, filters = {}) {
    try {
      await this.delay();

      if (this.useLocalStorage) {
        // Mock statistics
        const stats = {
          totalPlays: Math.floor(Math.random() * 1000) + 100,
          averageScore: Math.floor(Math.random() * 30) + 70,
          averageTime: Math.floor(Math.random() * 300) + 180,
          completionRate: Math.floor(Math.random() * 20) + 80,
          topScores: [
            { userId: 1, username: 'Alice', score: 95, date: '2025-01-20' },
            { userId: 2, username: 'Bob', score: 92, date: '2025-01-19' },
            { userId: 3, username: 'Carol', score: 89, date: '2025-01-18' }
          ]
        };

        return {
          success: true,
          data: stats
        };
      }

      const response = await api.get(endpoints.games.scores(gameId), filters);
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch game statistics: ${error.message}`);
    }
  }

  // Get leaderboard
  async getLeaderboard(gameId, limit = 10) {
    try {
      await this.delay();

      if (this.useLocalStorage) {
        // Mock leaderboard data
        const leaderboard = Array.from({ length: limit }, (_, i) => ({
          rank: i + 1,
          userId: i + 1,
          username: `User${i + 1}`,
          score: Math.floor(Math.random() * 20) + 80,
          completionTime: Math.floor(Math.random() * 300) + 120,
          date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
        })).sort((a, b) => b.score - a.score);

        return {
          success: true,
          data: leaderboard
        };
      }

      const response = await api.get(endpoints.games.leaderboard(gameId), { limit });
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch leaderboard: ${error.message}`);
    }
  }

  // Add questions to game
  async addQuestion(gameId, questionData) {
    try {
      await this.delay();

      this.validateQuestionData(questionData);

      if (this.useLocalStorage) {
        const newQuestion = {
          ...questionData,
          id: Date.now(),
          gameId,
          createdAt: new Date().toISOString()
        };

        console.log('Question added:', newQuestion);

        return {
          success: true,
          data: newQuestion,
          message: 'Question added successfully'
        };
      }

      const response = await api.post(endpoints.questions.create, {
        ...questionData,
        gameId
      });
      return response;
    } catch (error) {
      throw new Error(`Failed to add question: ${error.message}`);
    }
  }

  // Get game questions
  async getGameQuestions(gameId) {
    try {
      await this.delay();

      if (this.useLocalStorage) {
        const game = mockGames[gameId];
        return {
          success: true,
          data: game ? game.questions : []
        };
      }

      const response = await api.get(endpoints.questions.game(gameId));
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch questions: ${error.message}`);
    }
  }

  // Utility methods
  shuffleQuestions(questions) {
    const shuffled = [...questions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  validateGameData(gameData) {
    const errors = [];

    if (!gameData.title || gameData.title.trim().length < 3) {
      errors.push('Title must be at least 3 characters long');
    }

    if (!gameData.description || gameData.description.trim().length < 10) {
      errors.push('Description must be at least 10 characters long');
    }

    if (!Object.values(GAME_CATEGORIES).includes(gameData.category)) {
      errors.push('Invalid game category');
    }

    if (!Object.values(GAME_DIFFICULTIES).includes(gameData.difficulty)) {
      errors.push('Invalid difficulty level');
    }

    if (!gameData.timeLimit || gameData.timeLimit < 60 || gameData.timeLimit > 3600) {
      errors.push('Time limit must be between 60 and 3600 seconds');
    }

    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
  }

  validateQuestionData(questionData) {
    const errors = [];

    if (!questionData.question || questionData.question.trim().length < 10) {
      errors.push('Question must be at least 10 characters long');
    }

    if (!Array.isArray(questionData.options) || questionData.options.length < 2) {
      errors.push('At least 2 options are required');
    }

    if (questionData.options.some(option => !option.trim())) {
      errors.push('All options must have content');
    }

    if (questionData.correctAnswer >= questionData.options.length) {
      errors.push('Invalid correct answer index');
    }

    if (!questionData.explanation || questionData.explanation.trim().length < 5) {
      errors.push('Explanation must be at least 5 characters long');
    }

    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
  }

  // Get game categories
  getCategories() {
    return Object.entries(GAME_CATEGORIES).map(([key, value]) => ({
      value: key.toLowerCase(),
      label: value
    }));
  }

  // Get difficulty levels
  getDifficulties() {
    return Object.entries(GAME_DIFFICULTIES).map(([key, value]) => ({
      value: value,
      label: value.charAt(0).toUpperCase() + value.slice(1)
    }));
  }
}

export const gameService = new GameService();