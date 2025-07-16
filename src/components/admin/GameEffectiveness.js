import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const GameEffectiveness = () => {
  const [effectivenessData, setEffectivenessData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMetric, setSelectedMetric] = useState('learning_improvement');
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    fetchEffectivenessData();
  }, [selectedMetric, timeRange]);

  const fetchEffectivenessData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/admin/game-effectiveness?metric=${selectedMetric}&range=${timeRange}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEffectivenessData(response.data);
    } catch (error) {
      setError('Failed to load game effectiveness data');
      console.error('Error fetching effectiveness data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Chart data configurations
  const gamePerformanceData = {
    labels: effectivenessData.games?.map(g => g.name) || [],
    datasets: [
      {
        label: 'Effectiveness Score',
        data: effectivenessData.games?.map(g => g.effectivenessScore) || [],
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
          '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
        ],
        borderColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
          '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
        ],
        borderWidth: 2
      }
    ]
  };

  const learningProgressData = {
    labels: effectivenessData.progressOverTime?.labels || [],
    datasets: [
      {
        label: 'Average Learning Progress',
        data: effectivenessData.progressOverTime?.values || [],
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const engagementData = {
    labels: ['High Engagement', 'Medium Engagement', 'Low Engagement'],
    datasets: [
      {
        data: [
          effectivenessData.engagementLevels?.high || 0,
          effectivenessData.engagementLevels?.medium || 0,
          effectivenessData.engagementLevels?.low || 0
        ],
        backgroundColor: ['#4CAF50', '#FF9800', '#F44336'],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  const horizontalBarData = {
    labels: effectivenessData.subjectEffectiveness?.map(s => s.subject) || [],
    datasets: [
      {
        label: 'Subject Effectiveness',
        data: effectivenessData.subjectEffectiveness?.map(s => s.score) || [],
        backgroundColor: '#36A2EB',
        borderColor: '#36A2EB',
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  };

  const horizontalChartOptions = {
    ...chartOptions,
    indexAxis: 'y', // This makes the bar chart horizontal
    scales: {
      x: {
        beginAtZero: true,
        max: 100
      }
    }
  };

  if (loading) {
    return (
      <div className="game-effectiveness">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading game effectiveness analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="game-effectiveness">
        <div className="error-container">
          <h3>Error Loading Data</h3>
          <p>{error}</p>
          <button onClick={fetchEffectivenessData} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-effectiveness">
      <div className="header-section">
        <h2>🎮 Game Effectiveness Analytics</h2>
        <p>Analyze the educational impact and effectiveness of learning games</p>
      </div>

      <div className="controls-section">
        <div className="control-group">
          <label>Metric:</label>
          <select 
            value={selectedMetric} 
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="metric-selector"
          >
            <option value="learning_improvement">Learning Improvement</option>
            <option value="engagement">Student Engagement</option>
            <option value="completion_rate">Completion Rate</option>
            <option value="retention">Knowledge Retention</option>
            <option value="skill_development">Skill Development</option>
          </select>
        </div>
        
        <div className="control-group">
          <label>Time Range:</label>
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="time-selector"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>

      <div className="summary-metrics">
        <div className="metric-card">
          <div className="metric-icon">📈</div>
          <div className="metric-content">
            <h3>{effectivenessData.overallEffectiveness || 0}%</h3>
            <p>Overall Effectiveness</p>
            <span className="metric-trend positive">
              +{effectivenessData.effectivenessTrend || 0}% vs last period
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🎯</div>
          <div className="metric-content">
            <h3>{effectivenessData.averageEngagement || 0}%</h3>
            <p>Average Engagement</p>
            <span className="metric-trend positive">
              +{effectivenessData.engagementTrend || 0}% vs last period
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🏆</div>
          <div className="metric-content">
            <h3>{effectivenessData.topPerformingGames || 0}</h3>
            <p>Top Performing Games</p>
            <span className="metric-trend neutral">
              {effectivenessData.newTopGames || 0} new this period
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📚</div>
          <div className="metric-content">
            <h3>{effectivenessData.learningOutcomes || 0}%</h3>
            <p>Learning Outcomes Achieved</p>
            <span className="metric-trend positive">
              +{effectivenessData.outcomesTrend || 0}% vs last period
            </span>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h3>Game Performance Comparison</h3>
          <div className="chart-wrapper">
            <Bar data={gamePerformanceData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-container">
          <h3>Learning Progress Over Time</h3>
          <div className="chart-wrapper">
            <Line data={learningProgressData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-container">
          <h3>Student Engagement Distribution</h3>
          <div className="chart-wrapper">
            <Doughnut data={engagementData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-container">
          <h3>Subject Effectiveness</h3>
          <div className="chart-wrapper">
            <Bar data={horizontalBarData} options={horizontalChartOptions} />
          </div>
        </div>
      </div>

      <div className="detailed-analysis">
        <h3>Detailed Game Analysis</h3>
        <div className="games-table">
          <table>
            <thead>
              <tr>
                <th>Game Name</th>
                <th>Subject</th>
                <th>Effectiveness Score</th>
                <th>Engagement Rate</th>
                <th>Completion Rate</th>
                <th>Learning Improvement</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {effectivenessData.detailedAnalysis?.map((game, index) => (
                <tr key={index}>
                  <td className="game-name">
                    <div className="game-info">
                      <span className="game-icon">{game.icon}</span>
                      <span>{game.name}</span>
                    </div>
                  </td>
                  <td>{game.subject}</td>
                  <td>
                    <div className="score-cell">
                      <span className="score-value">{game.effectivenessScore}%</span>
                      <div className="score-bar">
                        <div 
                          className="score-fill"
                          style={{ width: `${game.effectivenessScore}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td>{game.engagementRate}%</td>
                  <td>{game.completionRate}%</td>
                  <td>
                    <span className={`improvement ${game.learningImprovement >= 0 ? 'positive' : 'negative'}`}>
                      {game.learningImprovement >= 0 ? '+' : ''}{game.learningImprovement}%
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${game.status.toLowerCase()}`}>
                      {game.status}
                    </span>
                  </td>
                </tr>
              )) || []}
            </tbody>
          </table>
        </div>
      </div>

      <div className="insights-section">
        <h3>💡 Key Insights & Recommendations</h3>
        <div className="insights-grid">
          {effectivenessData.insights?.map((insight, index) => (
            <div key={index} className="insight-card">
              <div className="insight-icon">{insight.icon}</div>
              <div className="insight-content">
                <h4>{insight.title}</h4>
                <p>{insight.description}</p>
                <div className="insight-metrics">
                  {insight.metrics?.map((metric, mIndex) => (
                    <span key={mIndex} className="insight-metric">
                      {metric.label}: <strong>{metric.value}</strong>
                    </span>
                  ))}
                </div>
                {insight.recommendation && (
                  <div className="recommendation">
                    <strong>Recommendation:</strong> {insight.recommendation}
                  </div>
                )}
              </div>
            </div>
          )) || []}
        </div>
      </div>

      <div className="action-items">
        <h3>📋 Action Items</h3>
        <div className="actions-list">
          {effectivenessData.actionItems?.map((action, index) => (
            <div key={index} className={`action-item priority-${action.priority.toLowerCase()}`}>
              <div className="action-header">
                <div className="action-priority">
                  <span className={`priority-badge ${action.priority.toLowerCase()}`}>
                    {action.priority}
                  </span>
                </div>
                <div className="action-title">
                  <h4>{action.title}</h4>
                </div>
              </div>
              <div className="action-content">
                <p>{action.description}</p>
                <div className="action-details">
                  <span className="action-timeline">Timeline: {action.timeline}</span>
                  <span className="action-impact">Expected Impact: {action.expectedImpact}</span>
                </div>
              </div>
              <div className="action-buttons">
                <button className="action-btn primary">Implement</button>
                <button className="action-btn secondary">Learn More</button>
              </div>
            </div>
          )) || []}
        </div>
      </div>
    </div>
  );
};

export default GameEffectiveness;