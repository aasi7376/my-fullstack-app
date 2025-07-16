import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import PerformanceChart from '../components/charts/PerformanceChart';

const Reports = () => {
  const { user } = useAuth();
  const [activeReport, setActiveReport] = useState('performance');
  const [dateRange, setDateRange] = useState('7days');
  const [reportData, setReportData] = useState({
    performance: {
      totalGames: 45,
      averageScore: 83.5,
      improvementRate: 12.3,
      timeSpent: 120,
      completionRate: 89
    },
    progress: {
      currentLevel: 'Intermediate',
      nextLevel: 'Advanced',
      progressToNext: 72,
      totalAchievements: 15,
      recentAchievements: 3
    },
    detailed: {
      subjects: [
        { name: 'Algebra', gamesPlayed: 12, avgScore: 87, improvement: '+5%' },
        { name: 'Geometry', gamesPlayed: 8, avgScore: 79, improvement: '+12%' },
        { name: 'Arithmetic', gamesPlayed: 15, avgScore: 91, improvement: '+3%' },
        { name: 'Statistics', gamesPlayed: 6, avgScore: 76, improvement: '+8%' },
        { name: 'Calculus', gamesPlayed: 4, avgScore: 82, improvement: '+15%' }
      ]
    }
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const reportTypes = [
    { id: 'performance', label: 'Performance Report', icon: '📊' },
    { id: 'progress', label: 'Progress Report', icon: '📈' },
    { id: 'detailed', label: 'Detailed Analytics', icon: '📋' },
    { id: 'comparison', label: 'Comparison Report', icon: '⚖️' }
  ];

  const dateRanges = [
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '3months', label: 'Last 3 Months' },
    { value: '1year', label: 'Last Year' }
  ];

  const renderPerformanceReport = () => (
    <motion.div
      className="report-content"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Performance Summary */}
      <motion.div className="report-section" variants={itemVariants}>
        <h3 className="section-title">Performance Summary</h3>
        <div className="performance-grid">
          <div className="performance-card">
            <div className="performance-icon">🎮</div>
            <div className="performance-data">
              <span className="performance-value">{reportData.performance.totalGames}</span>
              <span className="performance-label">Total Games</span>
            </div>
          </div>
          
          <div className="performance-card">
            <div className="performance-icon">⭐</div>
            <div className="performance-data">
              <span className="performance-value">{reportData.performance.averageScore}%</span>
              <span className="performance-label">Average Score</span>
            </div>
          </div>
          
          <div className="performance-card">
            <div className="performance-icon">📈</div>
            <div className="performance-data">
              <span className="performance-value">+{reportData.performance.improvementRate}%</span>
              <span className="performance-label">Improvement</span>
            </div>
          </div>
          
          <div className="performance-card">
            <div className="performance-icon">⏱️</div>
            <div className="performance-data">
              <span className="performance-value">{reportData.performance.timeSpent}h</span>
              <span className="performance-label">Time Spent</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Chart Section */}
      <motion.div className="report-section" variants={itemVariants}>
        <h3 className="section-title">Performance Trend</h3>
        <div className="chart-container">
          <PerformanceChart />
        </div>
      </motion.div>

      {/* Strengths & Areas for Improvement */}
      <motion.div className="report-section" variants={itemVariants}>
        <div className="insights-grid">
          <div className="insight-card strengths">
            <h4>💪 Strengths</h4>
            <ul>
              <li>Excellent performance in Arithmetic (91% avg)</li>
              <li>Consistent daily practice habits</li>
              <li>Quick problem-solving speed</li>
              <li>High completion rate (89%)</li>
            </ul>
          </div>
          
          <div className="insight-card improvements">
            <h4>🎯 Areas for Improvement</h4>
            <ul>
              <li>Geometry concepts need more practice</li>
              <li>Word problems accuracy can be improved</li>
              <li>Time management in complex problems</li>
              <li>Statistics fundamentals review</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  const renderProgressReport = () => (
    <motion.div
      className="report-content"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Level Progress */}
      <motion.div className="report-section" variants={itemVariants}>
        <h3 className="section-title">Level Progress</h3>
        <div className="level-progress-container">
          <div className="current-level">
            <span className="level-label">Current Level</span>
            <span className="level-name">{reportData.progress.currentLevel}</span>
          </div>
          
          <div className="progress-visualization">
            <div className="progress-bar-enhanced">
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${reportData.progress.progressToNext}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
            <span className="progress-percentage">{reportData.progress.progressToNext}%</span>
          </div>
          
          <div className="next-level">
            <span className="level-label">Next Level</span>
            <span className="level-name">{reportData.progress.nextLevel}</span>
          </div>
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div className="report-section" variants={itemVariants}>
        <h3 className="section-title">Achievements</h3>
        <div className="achievements-summary">
          <div className="achievement-stat">
            <span className="achievement-number">{reportData.progress.totalAchievements}</span>
            <span className="achievement-label">Total Achievements</span>
          </div>
          <div className="achievement-stat">
            <span className="achievement-number">{reportData.progress.recentAchievements}</span>
            <span className="achievement-label">Recent Unlocks</span>
          </div>
        </div>
        
        <div className="recent-achievements">
          {[
            { title: 'Speed Demon', description: 'Complete 5 games in one session', icon: '⚡' },
            { title: 'Perfect Score', description: 'Score 100% in any game', icon: '🎯' },
            { title: 'Week Warrior', description: 'Play games for 7 consecutive days', icon: '🔥' }
          ].map((achievement, index) => (
            <motion.div
              key={index}
              className="achievement-item unlocked"
              whileHover={{ scale: 1.02 }}
            >
              <div className="achievement-icon">{achievement.icon}</div>
              <div className="achievement-content">
                <h4>{achievement.title}</h4>
                <p>{achievement.description}</p>
              </div>
              <div className="achievement-badge">✅</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );

  const renderDetailedReport = () => (
    <motion.div
      className="report-content"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Subject-wise Performance */}
      <motion.div className="report-section" variants={itemVariants}>
        <h3 className="section-title">Subject-wise Performance</h3>
        <div className="subjects-table">
          <div className="table-header">
            <span>Subject</span>
            <span>Games Played</span>
            <span>Average Score</span>
            <span>Improvement</span>
          </div>
          {reportData.detailed.subjects.map((subject, index) => (
            <motion.div
              key={index}
              className="table-row"
              whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
            >
              <span className="subject-name">{subject.name}</span>
              <span className="games-count">{subject.gamesPlayed}</span>
              <span className="average-score">{subject.avgScore}%</span>
              <span className={`improvement ${subject.improvement.startsWith('+') ? 'positive' : 'negative'}`}>
                {subject.improvement}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Time Analysis */}
      <motion.div className="report-section" variants={itemVariants}>
        <h3 className="section-title">Time Analysis</h3>
        <div className="time-analysis-grid">
          <div className="time-card">
            <h4>Peak Performance Hours</h4>
            <div className="time-slots">
              <div className="time-slot active">4:00 PM - 6:00 PM</div>
              <div className="time-slot">7:00 PM - 9:00 PM</div>
              <div className="time-slot">10:00 AM - 12:00 PM</div>
            </div>
          </div>
          
          <div className="time-card">
            <h4>Daily Study Pattern</h4>
            <div className="study-pattern">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                <div key={day} className="day-activity">
                  <span className="day-label">{day}</span>
                  <div className="activity-bar">
                    <div 
                      className="activity-fill" 
                      style={{ height: `${Math.random() * 80 + 20}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  const renderComparisonReport = () => (
    <motion.div
      className="report-content"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="report-section" variants={itemVariants}>
        <h3 className="section-title">Performance Comparison</h3>
        <div className="comparison-grid">
          <div className="comparison-card">
            <h4>Class Average</h4>
            <div className="comparison-stats">
              <div className="comparison-item">
                <span>Your Score: 83.5%</span>
                <span>Class Avg: 78.2%</span>
                <span className="comparison-result positive">+5.3% above average</span>
              </div>
            </div>
          </div>
          
          <div className="comparison-card">
            <h4>School Ranking</h4>
            <div className="ranking-info">
              <span className="rank-number">15</span>
              <span className="rank-total">out of 156 students</span>
              <span className="percentile">Top 10%</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  const renderReportContent = () => {
    switch (activeReport) {
      case 'performance':
        return renderPerformanceReport();
      case 'progress':
        return renderProgressReport();
      case 'detailed':
        return renderDetailedReport();
      case 'comparison':
        return renderComparisonReport();
      default:
        return renderPerformanceReport();
    }
  };

  return (
    <div className="reports-container">
      {/* Header */}
      <motion.div 
        className="reports-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="reports-title">
          <span className="reports-title-icon">📊</span>
          Performance Reports
        </div>
        <p className="reports-subtitle">
          Analyze your learning progress and performance metrics
        </p>
      </motion.div>

      {/* Controls */}
      <motion.div 
        className="reports-controls"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* Report Type Selector */}
        <div className="report-type-selector">
          {reportTypes.map((type) => (
            <motion.button
              key={type.id}
              className={`report-type-btn ${activeReport === type.id ? 'active' : ''}`}
              onClick={() => setActiveReport(type.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="report-type-icon">{type.icon}</span>
              {type.label}
            </motion.button>
          ))}
        </div>

        {/* Date Range Selector */}
        <div className="date-range-selector">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="neon-input"
          >
            {dateRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        {/* Export Button */}
        <motion.button
          className="btn-neon export-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          📥 Export Report
        </motion.button>
      </motion.div>

      {/* Report Content */}
      <motion.div
        className="reports-content"
        key={activeReport}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderReportContent()}
      </motion.div>
    </div>
  );
};

export default Reports;