// src/components/games/AdaptiveDifficultyHandler.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdaptiveDifficultyHandler.css';

const AdaptiveDifficultyHandler = ({ studentId, gameId, onDifficultyLoaded }) => {
  const [difficultySettings, setDifficultySettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDifficulty = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/ml/adaptive/difficulty/${studentId}/${gameId}`);
        setDifficultySettings(response.data.difficultyResult);
        // Pass settings to parent component
        if (onDifficultyLoaded) {
          onDifficultyLoaded(response.data.difficultyResult);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching difficulty settings:', err);
        setError('Failed to load personalized settings');
        setLoading(false);
      }
    };

    fetchDifficulty();
  }, [studentId, gameId, onDifficultyLoaded]);

  if (loading) return <div className="difficulty-loading">Personalizing your experience...</div>;
  if (error) return <div className="difficulty-error">{error}</div>;
  if (!difficultySettings) return null;

  return (
    <div className="adaptive-difficulty-panel">
      <h3>Personalized Game Settings</h3>
      <div className="difficulty-badge">
        <span className="difficulty-label">Difficulty:</span> 
        <span className={`difficulty-value ${difficultySettings.difficultyLabel.toLowerCase()}`}>
          {difficultySettings.difficultyLabel}
        </span>
      </div>
      
      <div className="settings-details">
        <div className="setting-item">
          <span className="setting-label">Time Limit:</span> 
          <span className="setting-value">{difficultySettings.settings.timeLimit} seconds</span>
        </div>
        <div className="setting-item">
          <span className="setting-label">Hints:</span> 
          <span className="setting-value">{difficultySettings.settings.hintsAvailable}</span>
        </div>
        <div className="setting-item">
          <span className="setting-label">Points Multiplier:</span> 
          <span className="setting-value">x{difficultySettings.settings.pointMultiplier}</span>
        </div>
      </div>
      
      <div className="difficulty-rationale">
        <h4>Why This Difficulty?</h4>
        <ul>
          {difficultySettings.rationale.map((reason, index) => (
            <li key={index}>{reason}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdaptiveDifficultyHandler;