// src/components/school/SchoolAnalytics.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Pie, Line } from 'react-chartjs-2';
import './SchoolAnalytics.css';

const SchoolAnalytics = ({ schoolId }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchoolAnalytics = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/ml/analytics/school/${schoolId}`);
        setAnalytics(response.data.schoolAnalytics);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching school analytics:', err);
        setError('Failed to load school analytics');
        setLoading(false);
      }
    };

    fetchSchoolAnalytics();
  }, [schoolId]);

  if (loading) return <div className="analytics-loading">Analyzing school data...</div>;
  if (error) return <div className="analytics-error">{error}</div>;
  if (!analytics) return <div className="no-analytics">No analytics available</div>;

  // Prepare grade level chart data
  const gradeLevelData = {
    labels: analytics.gradeAnalysis ? analytics.gradeAnalysis.map(grade => `Grade ${grade.grade}`) : [],
    datasets: [
      {
        label: 'Active Rate (%)',
        data: analytics.gradeAnalysis ? analytics.gradeAnalysis.map(grade => grade.activeRate) : [],
        backgroundColor: 'rgba(78, 115, 223, 0.7)',
        borderColor: 'rgba(78, 115, 223, 1)',
        borderWidth: 1
      },
      {
        label: 'At-Risk Rate (%)',
        data: analytics.gradeAnalysis ? analytics.gradeAnalysis.map(grade => grade.atRiskRate) : [],
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }
    ]
  };

  // Prepare performance distribution chart data
  const performanceData = {
    labels: ['High', 'Medium', 'Low', 'Inactive'],
    datasets: [
      {
        data: [
          analytics.performanceAnalysis?.performanceDistribution?.high || 0,
          analytics.performanceAnalysis?.performanceDistribution?.medium || 0,
          analytics.performanceAnalysis?.performanceDistribution?.low || 0,
          analytics.performanceAnalysis?.performanceDistribution?.inactive || 0
        ],
        backgroundColor: ['#4BC0C0', '#36A2EB', '#FFCE56', '#FF6384'],
        hoverBackgroundColor: ['#3AA3A3', '#2691DA', '#EFC046', '#EF5B75']
      }
    ]
  };

  return (
    <div className="school-analytics-container">
      <div className="analytics-header">
        <h2>School Analytics: {analytics.schoolName}</h2>
        <div className="generated-date">
          Generated: {new Date(analytics.generatedAt).toLocaleDateString()}
        </div>
      </div>

      <div className="executive-summary">
        <h3>Executive Summary</h3>
        <p>{analytics.executiveSummary}</p>
      </div>

      <div className="metrics-dashboard">
        <div className="metric-card">
          <span className="metric-value">{analytics.schoolMetrics?.totalStudents || 0}</span>
          <span className="metric-label">Total Students</span>
        </div>
        <div className="metric-card">
          <span className="metric-value">{analytics.schoolMetrics?.activeRate || 0}%</span>
          <span className="metric-label">Platform Adoption</span>
        </div>
        <div className="metric-card">
          <span className="metric-value">{analytics.schoolMetrics?.totalGamesPlayed || 0}</span>
          <span className="metric-label">Total Games Played</span>
        </div>
        <div className="metric-card">
          <span className="metric-value">{analytics.performanceAnalysis?.atRiskCount || 0}</span>
          <span className="metric-label">At-Risk Students</span>
        </div>
      </div>

      <div className="analytics-charts">
        <div className="chart-container">
          <h3>Grade Level Performance</h3>
          <Bar 
            data={gradeLevelData} 
            options={{ 
              responsive: true, 
              maintainAspectRatio: false,
              scales: {
                yAxes: [{
                  ticks: {
                    beginAtZero: true,
                    max: 100
                  },
                  scaleLabel: {
                    display: true,
                    labelString: 'Percentage (%)'
                  }
                }]
              }
            }} 
          />
        </div>
        
        <div className="chart-container">
          <h3>Performance Distribution</h3>
          <Pie data={performanceData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>

      <div className="benchmarks-container">
        <h3>Performance Benchmarks</h3>
        <div className="benchmarks-grid">
          {analytics.benchmarks && Object.entries(analytics.benchmarks).map(([key, benchmark]) => (
            <div key={key} className="benchmark-card">
              <h4>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h4>
              <div className={`benchmark-comparison ${benchmark.comparison}`}>
                <div className="benchmark-value">{benchmark.value}</div>
                <div className="benchmark-indicator">
                  <div className="benchmark-line"></div>
                  <div className="benchmark-target">{benchmark.benchmark}</div>
                </div>
                <div className="comparison-label">
                  {benchmark.comparison === 'above' ? 'Above Average' : 'Below Average'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="insights-container">
        <h3>Strategic Insights</h3>
        <div className="insights-list">
          {analytics.insights && analytics.insights.map((insight, index) => (
            <div key={index} className={`insight-card insight-${insight.type}`}>
              <div className="insight-category">{insight.category}</div>
              <p className="insight-message">{insight.message}</p>
              <div className="insight-impact">
                <span className="impact-label">Impact:</span>
                <span className={`impact-value impact-${insight.impact}`}>{insight.impact}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="recommendations-container">
        <h3>Recommendations</h3>
        <div className="recommendations-list">
          {analytics.recommendations && analytics.recommendations.map((rec, index) => (
            <div key={index} className={`recommendation-card priority-${rec.priority}`}>
              <div className="priority-tag">{rec.priority}</div>
              <h4>{rec.action}</h4>
              <p className="focus">{rec.focus}</p>
              {rec.suggested && (
                <div className="suggested-actions">
                  <h5>Suggested Actions:</h5>
                  <ul>
                    {rec.suggested.map((suggestion, i) => (
                      <li key={i}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SchoolAnalytics;