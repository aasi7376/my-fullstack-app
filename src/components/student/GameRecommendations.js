import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GameRecommendations.css';

const GameRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [studentData, setStudentData] = useState({});

  useEffect(() => {
    fetchRecommendations();
    fetchStudentProfile();
  }, []);

  const fetchStudentProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/student/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudentData(response.data);
    } catch (error) {
      console.error('Error fetching student profile:', error);
    }
  };

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/student/game-recommendations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecommendations(response.data);
    } catch (error) {
      setError('Failed to load recommendations');
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const startGame = async (gameId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/student/games/${gameId}/start`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Navigate to game or update UI
      window.location.href = `/game/${gameId}`;
    } catch (error) {
      console.error('Error starting game:', error);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'hard': return '#F44336';
      default: return '#2196F3';
    }
  };

  const getSubjectIcon = (subject) => {
    const icons = {
      'mathematics': '🔢',
      'science': '🔬',
      'english': '📚',
      'history': '📜',
      'geography': '🌍',
      'art': '🎨',
      'music': '🎵',
      'physical education': '⚽',
      'computer science': '💻'
    };
    return icons[subject?.toLowerCase()] || '🎮';
  };

  if (loading) {
    return (
      <div className="game-recommendations">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading personalized game recommendations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="game-recommendations">
        <div className="error-container">
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
          <button onClick={fetchRecommendations} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-recommendations">
      <div className="header-section">
        <h2>🎮 Recommended Games for You</h2>
        <p>Based on your learning progress and interests</p>
      </div>

      {studentData.name && (
        <div className="welcome-section">
          <h3>Welcome back, {studentData.name}! 👋</h3>
          <p>Here are some games tailored just for you:</p>
        </div>
      )}

      <div className="recommendations-grid">
        {recommendations.length === 0 ? (
          <div className="no-recommendations">
            <div className="no-games-icon">🎯</div>
            <h3>No recommendations yet</h3>
            <p>Play some games and we'll suggest more based on your progress!</p>
          </div>
        ) : (
          recommendations.map((game) => (
            <div key={game.id} className="game-card">
              <div className="game-header">
                <div className="game-icon">
                  {getSubjectIcon(game.subject)}
                </div>
                <div className="game-info">
                  <h3>{game.title}</h3>
                  <p className="game-subject">{game.subject}</p>
                </div>
              </div>

              <div className="game-description">
                <p>{game.description}</p>
              </div>

              <div className="game-metadata">
                <div className="metadata-item">
                  <span className="label">Difficulty:</span>
                  <span 
                    className="difficulty-badge"
                    style={{ backgroundColor: getDifficultyColor(game.difficulty) }}
                  >
                    {game.difficulty}
                  </span>
                </div>
                
                <div className="metadata-item">
                  <span className="label">Duration:</span>
                  <span className="duration">{game.estimatedTime} min</span>
                </div>

                <div className="metadata-item">
                  <span className="label">Points:</span>
                  <span className="points">+{game.maxPoints} pts</span>
                </div>
              </div>

              <div className="recommendation-reason">
                <small>
                  <strong>Why this game?</strong> {game.recommendationReason}
                </small>
              </div>

              <div className="game-stats">
                <div className="stat">
                  <span className="stat-value">{game.completionRate}%</span>
                  <span className="stat-label">Completion Rate</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{game.averageScore}</span>
                  <span className="stat-label">Avg Score</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{game.playCount}</span>
                  <span className="stat-label">Times Played</span>
                </div>
              </div>

              <div className="game-actions">
                <button 
                  className="play-btn primary"
                  onClick={() => startGame(game.id)}
                >
                  🎮 Play Now
                </button>
                <button className="info-btn secondary">
                  ℹ️ More Info
                </button>
              </div>

              {game.isNew && (
                <div className="new-badge">NEW!</div>
              )}
              
              {game.trending && (
                <div className="trending-badge">🔥 Trending</div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="footer-section">
        <button onClick={fetchRecommendations} className="refresh-btn">
          🔄 Refresh Recommendations
        </button>
      </div>
    </div>
  );
};

export default GameRecommendations;