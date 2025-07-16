import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PerformanceChart from '../charts/PerformanceChart';

const AdminAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30days');
  const [analytics, setAnalytics] = useState({
    overview: {
      totalUsers: 15420,
      activeUsers: 8743,
      totalSchools: 45,
      totalGames: 23,
      totalGamePlays: 156789,
      avgEngagementTime: 18.5
    },
    growth: {
      userGrowth: 12.5,
      schoolGrowth: 8.3,
      gameplayGrowth: 24.7,
      engagementGrowth: 15.2
    },
    topGames: [
      { id: 1, name: 'Algebra Quest', plays: 45678, avgScore: 78.5, difficulty: 'medium' },
      { id: 2, name: 'Number Ninja', plays: 38291, avgScore: 82.3, difficulty: 'easy' },
      { id: 3, name: 'Geometry Warrior', plays: 29847, avgScore: 65.2, difficulty: 'hard' },
      { id: 4, name: 'Fraction Frenzy', plays: 25103, avgScore: 79.8, difficulty: 'medium' },
      { id: 5, name: 'Statistics Detective', plays: 17856, avgScore: 71.4, difficulty: 'hard' }
    ],
    topSchools: [
      { id: 1, name: 'St. Mary\'s Academy', students: 1250, avgScore: 84.2, engagement: 92 },
      { id: 2, name: 'Lincoln High School', students: 890, avgScore: 79.8, engagement: 88 },
      { id: 3, name: 'Roosevelt Elementary', students: 654, avgScore: 81.5, engagement: 85 },
      { id: 4, name: 'Washington Middle School', students: 432, avgScore: 77.3, engagement: 82 },
      { id: 5, name: 'Jefferson Academy', students: 378, avgScore: 85.7, engagement: 90 }
    ],
    userDistribution: {
      students: 85.2,
      teachers: 12.4,
      schools: 2.1,
      admins: 0.3
    },
    categoryPopularity: [
      { category: 'Algebra', percentage: 28.5, plays: 44582 },
      { category: 'Arithmetic', percentage: 24.1, plays: 37834 },
      { category: 'Geometry', percentage: 18.3, plays: 28746 },
      { category: 'Fractions', percentage: 15.7, plays: 24613 },
      { category: 'Statistics', percentage: 8.9, plays: 13952 },
      { category: 'Calculus', percentage: 4.5, plays: 7062 }
    ]
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [timeRange]);

  const timeRanges = [
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '3months', label: 'Last 3 Months' },
    { value: '1year', label: 'Last Year' }
  ];

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

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getGrowthColor = (growth) => {
    if (growth > 0) return 'var(--neon-green)';
    if (growth < 0) return 'var(--neon-pink)';
    return 'var(--text-secondary)';
  };

  if (loading) {
    return (
      <div className="analytics-loading">
        <motion.div
          className="loading-spinner-main"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p>Loading analytics...</p>
      </div>
    );
  }

  return (
    <motion.div
      className="admin-analytics"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div className="analytics-header" variants={itemVariants}>
        <div>
          <h2>Platform Analytics</h2>
          <p>Comprehensive insights into platform performance and usage</p>
        </div>
        <div className="time-range-selector">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="neon-input"
          >
            {timeRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Overview Stats */}
      <motion.div className="analytics-overview" variants={itemVariants}>
        <div className="overview-grid">
          <div className="overview-card">
            <div className="overview-icon">👥</div>
            <div className="overview-content">
              <h3>Total Users</h3>
              <div className="overview-value">{formatNumber(analytics.overview.totalUsers)}</div>
              <div className="overview-growth" style={{ color: getGrowthColor(analytics.growth.userGrowth) }}>
                {analytics.growth.userGrowth > 0 ? '+' : ''}{analytics.growth.userGrowth}% growth
              </div>
            </div>
          </div>

          <div className="overview-card">
            <div className="overview-icon">🟢</div>
            <div className="overview-content">
              <h3>Active Users</h3>
              <div className="overview-value">{formatNumber(analytics.overview.activeUsers)}</div>
              <div className="overview-subtitle">
                {Math.round((analytics.overview.activeUsers / analytics.overview.totalUsers) * 100)}% of total
              </div>
            </div>
          </div>

          <div className="overview-card">
            <div className="overview-icon">🏫</div>
            <div className="overview-content">
              <h3>Schools</h3>
              <div className="overview-value">{analytics.overview.totalSchools}</div>
              <div className="overview-growth" style={{ color: getGrowthColor(analytics.growth.schoolGrowth) }}>
                {analytics.growth.schoolGrowth > 0 ? '+' : ''}{analytics.growth.schoolGrowth}% growth
              </div>
            </div>
          </div>

          <div className="overview-card">
            <div className="overview-icon">🎮</div>
            <div className="overview-content">
              <h3>Game Plays</h3>
              <div className="overview-value">{formatNumber(analytics.overview.totalGamePlays)}</div>
              <div className="overview-growth" style={{ color: getGrowthColor(analytics.growth.gameplayGrowth) }}>
                {analytics.growth.gameplayGrowth > 0 ? '+' : ''}{analytics.growth.gameplayGrowth}% growth
              </div>
            </div>
          </div>

          <div className="overview-card">
            <div className="overview-icon">⏱️</div>
            <div className="overview-content">
              <h3>Avg Engagement</h3>
              <div className="overview-value">{analytics.overview.avgEngagementTime}m</div>
              <div className="overview-growth" style={{ color: getGrowthColor(analytics.growth.engagementGrowth) }}>
                {analytics.growth.engagementGrowth > 0 ? '+' : ''}{analytics.growth.engagementGrowth}% growth
              </div>
            </div>
          </div>

          <div className="overview-card">
            <div className="overview-icon">📚</div>
            <div className="overview-content">
              <h3>Total Games</h3>
              <div className="overview-value">{analytics.overview.totalGames}</div>
              <div className="overview-subtitle">Active games</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Charts Section */}
      <div className="analytics-charts">
        <motion.div className="chart-section" variants={itemVariants}>
          <PerformanceChart />
        </motion.div>

        <motion.div className="chart-section" variants={itemVariants}>
          <div className="chart-container">
            <h3>User Distribution</h3>
            <div className="pie-chart-container">
              <div className="distribution-list">
                {Object.entries(analytics.userDistribution).map(([role, percentage]) => (
                  <div key={role} className="distribution-item">
                    <div className="distribution-label">
                      <span className="distribution-dot" style={{ 
                        backgroundColor: role === 'students' ? 'var(--neon-blue)' :
                                         role === 'teachers' ? 'var(--neon-green)' :
                                         role === 'schools' ? 'var(--neon-orange)' : 'var(--neon-pink)'
                      }}></span>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </div>
                    <div className="distribution-percentage">{percentage}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Top Performers */}
      <div className="analytics-tables">
        <motion.div className="table-section" variants={itemVariants}>
          <div className="section-header">
            <h3>Top Performing Games</h3>
            <span className="section-subtitle">Most played games this period</span>
          </div>
          <div className="top-items-list">
            {analytics.topGames.map((game, index) => (
              <motion.div
                key={game.id}
                className="top-item"
                whileHover={{ scale: 1.02 }}
              >
                <div className="item-rank">#{index + 1}</div>
                <div className="item-info">
                  <h4>{game.name}</h4>
                  <div className="item-stats">
                    <span>{formatNumber(game.plays)} plays</span>
                    <span>•</span>
                    <span>{game.avgScore}% avg score</span>
                    <span>•</span>
                    <span className={`difficulty-badge ${game.difficulty}`}>
                      {game.difficulty}
                    </span>
                  </div>
                </div>
                <div className="item-progress">
                  <div className="progress-bar-container">
                    <motion.div
                      className="progress-bar"
                      initial={{ width: 0 }}
                      animate={{ width: `${(game.plays / analytics.topGames[0].plays) * 100}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div className="table-section" variants={itemVariants}>
          <div className="section-header">
            <h3>Top Performing Schools</h3>
            <span className="section-subtitle">Highest engagement and scores</span>
          </div>
          <div className="top-items-list">
            {analytics.topSchools.map((school, index) => (
              <motion.div
                key={school.id}
                className="top-item"
                whileHover={{ scale: 1.02 }}
              >
                <div className="item-rank">#{index + 1}</div>
                <div className="item-info">
                  <h4>{school.name}</h4>
                  <div className="item-stats">
                    <span>{school.students} students</span>
                    <span>•</span>
                    <span>{school.avgScore}% avg score</span>
                    <span>•</span>
                    <span>{school.engagement}% engagement</span>
                  </div>
                </div>
                <div className="item-progress">
                  <div className="progress-bar-container">
                    <motion.div
                      className="progress-bar"
                      initial={{ width: 0 }}
                      animate={{ width: `${school.engagement}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Category Popularity */}
      <motion.div className="category-section" variants={itemVariants}>
        <div className="section-header">
          <h3>Category Popularity</h3>
          <span className="section-subtitle">Game category preferences</span>
        </div>
        <div className="category-grid">
          {analytics.categoryPopularity.map((category, index) => (
            <motion.div
              key={category.category}
              className="category-card"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="category-header">
                <h4>{category.category}</h4>
                <span className="category-percentage">{category.percentage}%</span>
              </div>
              <div className="category-plays">{formatNumber(category.plays)} plays</div>
              <div className="category-progress">
                <motion.div
                  className="progress-bar"
                  initial={{ width: 0 }}
                  animate={{ width: `${category.percentage}%` }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminAnalytics;