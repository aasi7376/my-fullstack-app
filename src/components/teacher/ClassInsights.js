// ClassInsights.jsx - Updated with darker text colors
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Pie, Bar } from 'react-chartjs-2';
import axios from 'axios';

const ClassInsights = ({ classId }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClassInsights = async () => {
      try {
        setLoading(true);
        setTimeout(() => {
          setInsights({
            teacherName: "Ms. Johnson",
            classHealth: "good",
            classMetrics: {
              totalStudents: 28,
              activeStudents: 25,
              averageGamesPlayed: 12
            },
            performanceDistribution: {
              high: 8,
              medium: 12,
              low: 5
            },
            highPerformers: [
              { studentId: 1, name: "Alice Smith", grade: "A", gamesPlayed: 18, points: 950 },
              { studentId: 2, name: "Bob Jones", grade: "A-", gamesPlayed: 15, points: 820 },
              { studentId: 3, name: "Carol Davis", grade: "A", gamesPlayed: 17, points: 890 }
            ],
            atRiskStudents: [
              { studentId: 26, name: "David Wilson", grade: "D", gamesPlayed: 3, points: 120 },
              { studentId: 27, name: "Emma Brown", grade: "D+", gamesPlayed: 4, points: 150 }
            ],
            engagementTrends: {
              distribution: {
                high: 10,
                medium: 8,
                low: 5,
                minimal: 3,
                none: 2
              }
            },
            keyInsights: [
              { type: "positive", message: "80% of students are engaged regularly", impact: "High" },
              { type: "neutral", message: "Most students perform better in algebra than geometry", impact: "Medium" },
              { type: "negative", message: "5 students haven't logged in for over a week", impact: "High" }
            ],
            recommendations: [
              { priority: "high", action: "Reach out to at-risk students", focus: "Schedule one-on-one sessions with students who haven't logged in", suggested: ["Send personalized messages", "Offer extra help sessions"] },
              { priority: "medium", action: "Reinforce geometry concepts", focus: "Create additional practice activities for geometry", suggested: ["Use visual aids", "Connect to real-world examples"] },
              { priority: "low", action: "Recognize top performers", focus: "Highlight achievements of high-performing students", suggested: ["Digital badges", "Recognition in class"] }
            ]
          });
          setLoading(false);
        }, 1500);
      } catch (err) {
        console.error('Error fetching class insights:', err);
        setError('Failed to load class insights');
        setLoading(false);
      }
    };

    fetchClassInsights();
  }, [classId]);

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

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 via-pink-100 to-white bg-[length:200%_200%]" style={{ animation: 'auroraFlow 15s ease infinite' }}></div>
        <div className="relative z-10 flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-gray-200 border-t-indigo-500 rounded-full animate-spin"></div>
            <p className="text-gray-800">Analyzing class data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 via-pink-100 to-white bg-[length:200%_200%]" style={{ animation: 'auroraFlow 15s ease infinite' }}></div>
        <div className="relative z-10 flex items-center justify-center h-64">
          <div className="bg-white/30 backdrop-blur-lg rounded-xl p-8 shadow-lg text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{error}</h3>
            <p className="text-gray-700">Please try again later or contact support.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 via-pink-100 to-white bg-[length:200%_200%]" style={{ animation: 'auroraFlow 15s ease infinite' }}></div>
        <div className="relative z-10 flex items-center justify-center h-64">
          <div className="bg-white/30 backdrop-blur-lg rounded-xl p-8 shadow-lg text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No insights available</h3>
            <p className="text-gray-700">There's not enough data to generate insights for this class yet.</p>
          </div>
        </div>
      </div>
    );
  }

  // Prepare chart data for performance distribution
  const performanceData = {
    labels: ['High Performers', 'Medium Performers', 'Low Performers', 'At Risk'],
    datasets: [
      {
        data: [
          insights.highPerformers?.length || 0,
          insights.performanceDistribution?.medium || 0,
          insights.performanceDistribution?.low || 0,
          insights.atRiskStudents?.length || 0
        ],
        backgroundColor: ['#818cf8', '#c084fc', '#f472b6', '#fb7185'],
        hoverBackgroundColor: ['#6366f1', '#a855f7', '#ec4899', '#e11d48']
      }
    ]
  };

  // Prepare chart data for engagement trends
  const engagementData = {
    labels: ['High', 'Medium', 'Low', 'Minimal', 'None'],
    datasets: [
      {
        label: 'Student Count',
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderColor: '#6366f1',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(99, 102, 241, 0.9)',
        hoverBorderColor: '#4f46e5',
        data: [
          insights.engagementTrends?.distribution?.high || 0,
          insights.engagementTrends?.distribution?.medium || 0,
          insights.engagementTrends?.distribution?.low || 0,
          insights.engagementTrends?.distribution?.minimal || 0,
          insights.engagementTrends?.distribution?.none || 0
        ]
      }
    ]
  };

  const getHealthColor = (health) => {
    switch (health) {
      case 'excellent': return 'text-indigo-600';
      case 'good': return 'text-purple-600';
      case 'average': return 'text-violet-600';
      case 'concerning': return 'text-pink-600';
      case 'critical': return 'text-rose-600';
      default: return 'text-gray-600';
    }
  };

  const getInsightColor = (type) => {
    switch (type) {
      case 'positive': return 'bg-indigo-100/70 border-indigo-500';
      case 'neutral': return 'bg-purple-100/70 border-purple-500';
      case 'negative': return 'bg-pink-100/70 border-pink-500';
      default: return 'bg-gray-100/70 border-gray-500';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'from-pink-500 to-purple-500';
      case 'medium': return 'from-purple-500 to-indigo-500';
      case 'low': return 'from-indigo-500 to-sky-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Aurora background */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 via-pink-100 to-white bg-[length:200%_200%]" style={{ animation: 'auroraFlow 15s ease infinite' }}></div>
      
      <motion.div
        className="relative z-10 p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="bg-white/30 backdrop-blur-lg rounded-xl p-6 shadow-lg mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 md:mb-0">Class Insights: {insights.teacherName}'s Class</h2>
            <div className="flex items-center">
              <span className="text-gray-700 mr-2">Class Health:</span>
              <span className={`font-semibold ${getHealthColor(insights.classHealth)}`}>
                {insights.classHealth.charAt(0).toUpperCase() + insights.classHealth.slice(1)}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white/30 backdrop-blur-lg rounded-xl p-5 shadow-lg transition transform hover:scale-105 duration-300" style={{ animation: 'float 4s ease-in-out infinite' }}>
            <div className="text-3xl font-bold text-indigo-600 mb-1">{insights.classMetrics?.totalStudents || 0}</div>
            <div className="text-gray-700 font-medium">Total Students</div>
          </div>
          <div className="bg-white/30 backdrop-blur-lg rounded-xl p-5 shadow-lg transition transform hover:scale-105 duration-300" style={{ animation: 'float 4s ease-in-out infinite 0.3s' }}>
            <div className="text-3xl font-bold text-indigo-600 mb-1">{insights.classMetrics?.activeStudents || 0}</div>
            <div className="text-gray-700 font-medium">Active Students</div>
          </div>
          <div className="bg-white/30 backdrop-blur-lg rounded-xl p-5 shadow-lg transition transform hover:scale-105 duration-300" style={{ animation: 'float 4s ease-in-out infinite 0.6s' }}>
            <div className="text-3xl font-bold text-purple-600 mb-1">{insights.classMetrics?.averageGamesPlayed || 0}</div>
            <div className="text-gray-700 font-medium">Avg. Games/Student</div>
          </div>
          <div className="bg-white/30 backdrop-blur-lg rounded-xl p-5 shadow-lg transition transform hover:scale-105 duration-300" style={{ animation: 'float 4s ease-in-out infinite 0.9s' }}>
            <div className="text-3xl font-bold text-pink-600 mb-1">{insights.atRiskStudents?.length || 0}</div>
            <div className="text-gray-700 font-medium">At-Risk Students</div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white/30 backdrop-blur-lg rounded-xl p-5 shadow-lg transition hover:shadow-xl duration-300">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Performance Distribution</h3>
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4" style={{ height: '250px' }}>
              <Pie data={performanceData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
          
          <div className="bg-white/30 backdrop-blur-lg rounded-xl p-5 shadow-lg transition hover:shadow-xl duration-300">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Engagement Levels</h3>
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4" style={{ height: '250px' }}>
              <Bar 
                data={engagementData} 
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }} 
              />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white/30 backdrop-blur-lg rounded-xl p-5 shadow-lg mb-6 transition hover:shadow-xl duration-300">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Insights</h3>
          <div className="space-y-3">
            {insights.keyInsights && insights.keyInsights.map((insight, index) => (
              <div key={index} className={`${getInsightColor(insight.type)} p-4 rounded-lg border-l-4`}>
                <div className="flex justify-between">
                  <p className="text-gray-900 font-medium">{insight.message}</p>
                  <span className="text-sm font-medium text-gray-700">Impact: {insight.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white/30 backdrop-blur-lg rounded-xl p-5 shadow-lg mb-6 transition hover:shadow-xl duration-300">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights.recommendations && insights.recommendations.map((rec, index) => (
              <div key={index} className="bg-white/50 backdrop-blur-sm rounded-lg overflow-hidden shadow transition hover:shadow-md duration-300">
                <div className={`h-2 bg-gradient-to-r ${getPriorityColor(rec.priority)}`}></div>
                <div className="p-4">
                  <div className="uppercase text-xs font-bold text-gray-600 mb-2">Priority: {rec.priority}</div>
                  <h4 className="font-bold text-gray-900 mb-2">{rec.action}</h4>
                  <p className="text-gray-700 mb-3 text-sm">{rec.focus}</p>
                  {rec.suggested && (
                    <ul className="space-y-1">
                      {rec.suggested.map((suggestion, i) => (
                        <li key={i} className="text-sm text-gray-700 flex items-start">
                          <span className="text-indigo-500 mr-2">•</span>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white/30 backdrop-blur-lg rounded-xl p-5 shadow-lg transition hover:shadow-xl duration-300">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Top Performers</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {insights.highPerformers && insights.highPerformers.map(student => (
              <div key={student.studentId} className="bg-white/50 backdrop-blur-sm rounded-lg p-4 flex items-center gap-4 transition transform hover:scale-102 hover:shadow-md duration-300">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                  {student.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{student.name}</h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1">
                    <p className="text-sm text-gray-700">Grade: <span className="font-medium text-indigo-600">{student.grade}</span></p>
                    <p className="text-sm text-gray-700">Games: <span className="font-medium text-purple-600">{student.gamesPlayed}</span></p>
                    <p className="text-sm text-gray-700 col-span-2">Points: <span className="font-medium text-pink-600">{student.points}</span></p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ClassInsights;