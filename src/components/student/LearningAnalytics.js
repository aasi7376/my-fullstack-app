import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './LearningAnalytics.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

const LearningAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedView, setSelectedView] = useState('overview');

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedPeriod]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/student/analytics?period=${selectedPeriod}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalyticsData(response.data);
    } catch (error) {
      setError('Failed to load analytics data');
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Chart configurations
  const progressChartData = {
    labels: analyticsData.progressData?.labels || [],
    datasets: [
      {
        label: 'Learning Progress',
        data: analyticsData.progressData?.values || [],
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const subjectPerformanceData = {
    labels: analyticsData.subjects?.map(s => s.name) || [],
    datasets: [
      {
        label: 'Average Score',
        data: analyticsData.subjects?.map(s => s.averageScore) || [],
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
          '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
        ]
      }
    ]
  };

  const skillRadarData = {
    labels: analyticsData.skills?.map(s => s.name) || [],
    datasets: [
      {
        label: 'Current Level',
        data: analyticsData.skills?.map(s => s.level) || [],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
      },
      {
        label: 'Target Level',
        data: analyticsData.skills?.map(s => s.target) || [],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
      }
    ]
  };

  const timeSpentData = {
    labels: analyticsData.timeSpent?.labels || [],
    datasets: [
      {
        label: 'Hours Spent',
        data: analyticsData.timeSpent?.values || [],
        backgroundColor: '#36A2EB',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      }
    }
  };

  if (loading) {
    return (
      <div className="learning-analytics">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your learning analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="learning-analytics">
        <div className="error-container">
          <h3>Unable to load analytics</h3>
          <p>{error}</p>
          <button onClick={fetchAnalyticsData} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="learning-analytics">
      <div className="analytics-header">
        <h2>📊 Your Learning Analytics</h2>
        <div className="controls">
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="period-selector"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>

      <div className="view-tabs">
        <button 
          className={`tab ${selectedView === 'overview' ? 'active' : ''}`}
          onClick={() => setSelectedView('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab ${selectedView === 'subjects' ? 'active' : ''}`}
          onClick={() => setSelectedView('subjects')}
        >
          Subjects
        </button>
        <button 
          className={`tab ${selectedView === 'skills' ? 'active' : ''}`}
          onClick={() => setSelectedView('skills')}
        >
          Skills
        </button>
        <button 
          className={`tab ${selectedView === 'achievements' ? 'active' : ''}`}
          onClick={() => setSelectedView('achievements')}
        >
          Achievements
        </button>
      </div>

      {selectedView === 'overview' && (
        <div className="overview-section">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🎯</div>
              <div className="stat-content">
                <h3>{analyticsData.totalGamesPlayed || 0}</h3>
                <p>Games Played</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <h3>{analyticsData.totalPoints || 0}</h3>
                <p>Points Earned</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">🏆</div>
              <div className="stat-content">
                <h3>{analyticsData.averageScore || 0}%</h3>
                <p>Average Score</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">⏱️</div>
              <div className="stat-content">
                <h3>{analyticsData.totalTimeSpent || 0}h</h3>
                <p>Time Spent</p>
              </div>
            </div>
          </div>

          <div className="charts-grid">
            <div className="chart-container">
              <h3>Learning Progress Over Time</h3>
              <div className="chart-wrapper">
                <Line data={progressChartData} options={chartOptions} />
              </div>
            </div>

            <div className="chart-container">
              <h3>Time Spent by Day</h3>
              <div className="chart-wrapper">
                <Bar data={timeSpentData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedView === 'subjects' && (
        <div className="subjects-section">
          <div className="chart-container full-width">
            <h3>Performance by Subject</h3>
            <div className="chart-wrapper">
              <Doughnut data={subjectPerformanceData} options={chartOptions} />
            </div>
          </div>

          <div className="subjects-list">
            {analyticsData.subjects?.map((subject, index) => (
              <div key={index} className="subject-card">
                <div className="subject-header">
                  <h4>{subject.name}</h4>
                  <span className="subject-score">{subject.averageScore}%</span>
                </div>
                <div className="subject-details">
                  <div className="detail-item">
                    <span>Games Played:</span>
                    <span>{subject.gamesPlayed}</span>
                  </div>
                  <div className="detail-item">
                    <span>Time Spent:</span>
                    <span>{subject.timeSpent}h</span>
                  </div>
                  <div className="detail-item">
                    <span>Improvement:</span>
                    <span className={subject.improvement >= 0 ? 'positive' : 'negative'}>
                      {subject.improvement >= 0 ? '+' : ''}{subject.improvement}%
                    </span>
                  </div>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${subject.averageScore}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedView === 'skills' && (
        <div className="skills-section">
          <div className="chart-container">
            <h3>Skills Assessment</h3>
            <div className="chart-wrapper">
              <Radar data={skillRadarData} options={chartOptions} />
            </div>
          </div>

          <div className="skills-breakdown">
            <h3>Skill Breakdown</h3>
            {analyticsData.skills?.map((skill, index) => (
              <div key={index} className="skill-item">
                <div className="skill-header">
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-level">Level {skill.level}/{skill.target}</span>
                </div>
                <div className="skill-progress">
                  <div 
                    className="skill-bar"
                    style={{ width: `${(skill.level / skill.target) * 100}%` }}
                  ></div>
                </div>
                <div className="skill-description">
                  <small>{skill.description}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedView === 'achievements' && (
        <div className="achievements-section">
          <div className="achievements-grid">
            {analyticsData.achievements?.map((achievement, index) => (
              <div 
                key={index} 
                className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
              >
                <div className="achievement-icon">
                  {achievement.unlocked ? achievement.icon : '🔒'}
                </div>
                <div className="achievement-content">
                  <h4>{achievement.title}</h4>
                  <p>{achievement.description}</p>
                  {achievement.unlocked && (
                    <small>Unlocked on {achievement.unlockedDate}</small>
                  )}
                  {!achievement.unlocked && achievement.progress && (
                    <div className="achievement-progress">
                      <div className="progress-text">
                        {achievement.progress.current}/{achievement.progress.total}
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${(achievement.progress.current / achievement.progress.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="insights-section">
        <h3>💡 Insights & Recommendations</h3>
        <div className="insights-list">
          {analyticsData.insights?.map((insight, index) => (
            <div key={index} className="insight-card">
              <div className="insight-icon">{insight.icon}</div>
              <div className="insight-content">
                <h4>{insight.title}</h4>
                <p>{insight.description}</p>
                {insight.actionButton && (
                  <button className="insight-action">
                    {insight.actionButton}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearningAnalytics;