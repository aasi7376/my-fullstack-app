// src/components/student/ScoreHistory.js
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ScoreHistory.css';

const ScoreHistory = () => {
  const [sortOption, setSortOption] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedScore, setSelectedScore] = useState(null);
  const [showScoreDetail, setShowScoreDetail] = useState(false);
  
  // Sample score data based on the provided images
  const scoreData = [
    { 
      id: 1, 
      game: 'Algebra Quest', 
      category: 'Algebra',
      score: '94%', 
      scoreRaw: '19/20',
      difficulty: 'Medium', 
      time: '18m 32s', 
      attempts: 1,
      improvement: '+8%',
      date: '1/20/2025'
    },
    { 
      id: 2, 
      game: 'Number Ninja', 
      category: 'Arithmetic',
      score: '87%', 
      scoreRaw: '17/20',
      difficulty: 'Easy', 
      time: '12m 45s', 
      attempts: 2,
      improvement: '+3%',
      date: '1/20/2025'
    },
    { 
      id: 3, 
      game: 'Geometry Warrior', 
      category: 'Geometry',
      score: '76%', 
      scoreRaw: '11/15',
      difficulty: 'Hard', 
      time: '25m 18s', 
      attempts: 3,
      improvement: '-2%',
      date: '1/19/2025'
    },
    { 
      id: 4, 
      game: 'Fraction Frenzy', 
      category: 'Fractions',
      score: '89%', 
      scoreRaw: '16/18',
      difficulty: 'Medium', 
      time: '15m 22s', 
      attempts: 1,
      improvement: '+12%',
      date: '1/19/2025'
    },
    { 
      id: 5, 
      game: 'Statistics Detective', 
      category: 'Statistics',
      score: '71%', 
      scoreRaw: '10/14',
      difficulty: 'Hard', 
      time: '22m 56s', 
      attempts: 2,
      improvement: '+5%',
      date: '1/18/2025'
    },
    { 
      id: 6, 
      game: 'Algebra Quest', 
      category: 'Algebra',
      score: '86%', 
      scoreRaw: '17/20',
      difficulty: 'Medium', 
      time: '21m 15s', 
      attempts: 1,
      improvement: '-8%',
      date: '1/18/2025'
    },
    { 
      id: 7, 
      game: 'Number Ninja', 
      category: 'Arithmetic',
      score: '84%', 
      scoreRaw: '17/20',
      difficulty: 'Easy', 
      time: '14m 33s', 
      attempts: 1,
      improvement: '+6%',
      date: '1/17/2025'
    },
    { 
      id: 8, 
      game: 'Geometry Warrior', 
      category: 'Geometry',
      score: '78%', 
      scoreRaw: '12/15',
      difficulty: 'Hard', 
      time: '28m 44s', 
      attempts: 2,
      improvement: '+11%',
      date: '1/16/2025'
    }
  ];

  // Personal records data
  const personalRecords = {
    highestScore: {
      score: '94%',
      game: 'Algebra Quest'
    },
    fastestCompletion: {
      time: '8m 23s',
      game: 'Number Ninja'
    },
    perfectScores: 3
  };

  // Sort function for the table
  const handleSort = (option) => {
    if (sortOption === option) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortOption(option);
      setSortDirection('desc');
    }
  };

  // Get sorted and filtered data
  const getSortedAndFilteredData = () => {
    // First filter the data based on search term
    const filteredData = scoreData.filter(record => {
      return (
        record.game.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    
    // Then sort the filtered data
    return [...filteredData].sort((a, b) => {
      let comparison = 0;
      
      switch(sortOption) {
        case 'game':
          comparison = a.game.localeCompare(b.game);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'score':
          comparison = parseInt(a.score) - parseInt(b.score);
          break;
        case 'difficulty':
          const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
          comparison = difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
          break;
        case 'time':
          // Better time comparison
          const aTimeParts = a.time.split('m ');
          const bTimeParts = b.time.split('m ');
          const aMinutes = parseInt(aTimeParts[0]);
          const aSeconds = parseInt(aTimeParts[1].replace('s', ''));
          const bMinutes = parseInt(bTimeParts[0]);
          const bSeconds = parseInt(bTimeParts[1].replace('s', ''));
          
          const aTotalSeconds = aMinutes * 60 + aSeconds;
          const bTotalSeconds = bMinutes * 60 + bSeconds;
          
          comparison = aTotalSeconds - bTotalSeconds;
          break;
        case 'attempts':
          comparison = a.attempts - b.attempts;
          break;
        case 'improvement':
          const aImprovement = parseInt(a.improvement.replace('%', ''));
          const bImprovement = parseInt(b.improvement.replace('%', ''));
          comparison = aImprovement - bImprovement;
          break;
        case 'date':
          // Better date comparison
          const aParts = a.date.split('/');
          const bParts = b.date.split('/');
          const aDate = new Date(aParts[2], aParts[0] - 1, aParts[1]);
          const bDate = new Date(bParts[2], bParts[0] - 1, bParts[1]);
          comparison = aDate - bDate;
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };

  // Handle viewing a score
  const handleViewScore = (id) => {
    const score = scoreData.find(record => record.id === id);
    setSelectedScore(score);
    setShowScoreDetail(true);
  };

  // Close the score detail modal
  const handleCloseDetail = () => {
    setShowScoreDetail(false);
  };

  // Get the arrow indicator for the currently sorted column
  const getSortArrow = (column) => {
    if (sortOption === column) {
      return sortDirection === 'asc' ? '↑' : '↓';
    }
    return null;
  };

  // Get the sorted and filtered data
  const sortedAndFilteredData = getSortedAndFilteredData();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };
  
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { type: 'spring', damping: 25, stiffness: 500 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="score-history-container">
      <motion.div
        className="scores-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Search Bar */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search games or categories..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Score Table */}
        <div className="scores-table-container">
          <table className="scores-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('game')} className="sortable-header">
                  Game {getSortArrow('game')}
                </th>
                <th onClick={() => handleSort('score')} className="sortable-header">
                  Score {getSortArrow('score')}
                </th>
                <th onClick={() => handleSort('difficulty')} className="sortable-header">
                  Difficulty {getSortArrow('difficulty')}
                </th>
                <th onClick={() => handleSort('time')} className="sortable-header">
                  Time {getSortArrow('time')}
                </th>
                <th onClick={() => handleSort('attempts')} className="sortable-header">
                  Attempts {getSortArrow('attempts')}
                </th>
                <th onClick={() => handleSort('improvement')} className="sortable-header">
                  Improvement {getSortArrow('improvement')}
                </th>
                <th onClick={() => handleSort('date')} className="sortable-header">
                  Date {getSortArrow('date')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedAndFilteredData.map((record) => (
                <motion.tr 
                  key={record.id}
                  variants={itemVariants}
                  className={record.improvement.startsWith('+') ? 'improved' : 'declined'}
                >
                  <td className="game-column">
                    <strong>{record.game}</strong>
                    <span className="category">{record.category}</span>
                  </td>
                  <td className="score-column">
                    <strong>{record.score}</strong>
                    <span className="score-raw">{record.scoreRaw}</span>
                  </td>
                  <td className={`difficulty-column difficulty-${record.difficulty.toLowerCase()}`}>
                    {record.difficulty}
                  </td>
                  <td>{record.time}</td>
                  <td>{record.attempts}</td>
                  <td className={record.improvement.startsWith('+') ? 'positive-improvement' : 'negative-improvement'}>
                    {record.improvement}
                  </td>
                  <td>{record.date}</td>
                  <td>
                    <button 
                      className="view-button"
                      onClick={() => handleViewScore(record.id)}
                    >
                      VIEW
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Personal Records Section */}
        <motion.div className="personal-records-section" variants={itemVariants}>
          <h2 className="personal-records-title">PERSONAL RECORDS</h2>
          <p className="records-description">Your best performances across different categories</p>
          
          <div className="records-grid">
            <div className="record-card highest-score">
              <h3>
                <span className="record-icon">🏆</span>
                HIGHEST SCORE
              </h3>
              <div className="record-value">{personalRecords.highestScore.score}</div>
              <div className="record-game">{personalRecords.highestScore.game}</div>
            </div>
            
            <div className="record-card fastest-completion">
              <h3>
                <span className="record-icon">⚡</span>
                FASTEST COMPLETION
              </h3>
              <div className="record-value">{personalRecords.fastestCompletion.time}</div>
              <div className="record-game">{personalRecords.fastestCompletion.game}</div>
            </div>
            
            <div className="record-card perfect-scores">
              <h3>
                <span className="record-icon">🎯</span>
                PERFECT SCORES
              </h3>
              <div className="record-value">{personalRecords.perfectScores}</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Score Detail Modal */}
      <AnimatePresence>
        {showScoreDetail && selectedScore && (
          <div className="modal-overlay" onClick={handleCloseDetail}>
            <motion.div 
              className="score-detail-modal"
              onClick={(e) => e.stopPropagation()}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="modal-header">
                <h2 className="modal-title">{selectedScore.game} Score Details</h2>
                <button className="modal-close-button" onClick={handleCloseDetail}>×</button>
              </div>
              
              <div className="modal-content">
                <div className="score-overview">
                  <div className="big-score">
                    <h3>Score</h3>
                    <div className="big-score-value">{selectedScore.score}</div>
                    <div className="score-raw-detail">{selectedScore.scoreRaw}</div>
                  </div>
                  
                  <div className="score-details-grid">
                    <div className="detail-item">
                      <span className="detail-label">Subject</span>
                      <span className="detail-value">{selectedScore.category}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Difficulty</span>
                      <span className={`detail-value difficulty-${selectedScore.difficulty.toLowerCase()}`}>
                        {selectedScore.difficulty}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Time Taken</span>
                      <span className="detail-value">{selectedScore.time}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Attempts</span>
                      <span className="detail-value">{selectedScore.attempts}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Improvement</span>
                      <span className={`detail-value ${selectedScore.improvement.startsWith('+') ? 'positive-improvement' : 'negative-improvement'}`}>
                        {selectedScore.improvement}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Date</span>
                      <span className="detail-value">{selectedScore.date}</span>
                    </div>
                  </div>
                </div>
                
                <div className="score-actions">
                  <button className="action-button primary">Play Again</button>
                  <button className="action-button secondary">View All {selectedScore.category} Scores</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScoreHistory;