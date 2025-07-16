import React, { useState, useEffect } from 'react';

// Custom FixedModal component for game analysis
const GameAnalysisModal = ({ isOpen, onClose, game }) => {
  if (!isOpen || !game) return null;
  
  const overlayStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 9998,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };
  
  const modalStyles = {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
    width: '90%',
    maxWidth: '800px',
    maxHeight: '90vh',
    overflow: 'auto',
    zIndex: 9999
  };

  // Mock detailed game data
  const detailedData = {
    scoreDistribution: [
      { range: '90-100%', count: Math.floor(Math.random() * 20) + 10, color: 'bg-indigo-500' },
      { range: '80-89%', count: Math.floor(Math.random() * 30) + 20, color: 'bg-purple-500' },
      { range: '70-79%', count: Math.floor(Math.random() * 40) + 30, color: 'bg-blue-500' },
      { range: '60-69%', count: Math.floor(Math.random() * 30) + 10, color: 'bg-yellow-500' },
      { range: 'Below 60%', count: Math.floor(Math.random() * 20) + 5, color: 'bg-red-500' }
    ],
    topPerformers: [
      { name: 'Alice Johnson', class: '10-A', score: 98, time: '12m 45s' },
      { name: 'Bob Smith', class: '9-B', score: 95, time: '14m 12s' },
      { name: 'Carol Davis', class: '10-A', score: 93, time: '11m 30s' }
    ],
    commonMistakes: [
      { concept: 'Variable Substitution', frequency: '32%', students: 28 },
      { concept: 'Formula Application', frequency: '27%', students: 24 },
      { concept: 'Calculation Errors', frequency: '19%', students: 17 }
    ],
    timeAnalysis: {
      avgCompletionTime: '18m 42s',
      fastestTime: '9m 15s',
      slowestTime: '31m 24s',
      recommendedTime: '20m 00s',
      timeDistribution: [
        { range: '<10m', count: 12, percentage: 8 },
        { range: '10-15m', count: 35, percentage: 24 },
        { range: '15-20m', count: 58, percentage: 40 },
        { range: '20-25m', count: 29, percentage: 20 },
        { range: '>25m', count: 12, percentage: 8 }
      ]
    },
    difficultQuestions: [
      { id: 'Q7', topic: 'Quadratic Equations', success: '42%', attempts: 312 },
      { id: 'Q12', topic: 'Function Graphing', success: '38%', attempts: 287 },
      { id: 'Q5', topic: 'Word Problems', success: '45%', attempts: 324 }
    ],
    improvementSuggestions: [
      'Provide additional practice on Quadratic Equations with step-by-step guidance',
      'Create visual aids for Function Graphing concepts',
      'Incorporate more real-world examples for Word Problems',
      'Consider adding a tutorial section on Variable Substitution'
    ]
  };
  
  const getScoreColor = (score) => {
    if (score >= 85) return 'text-indigo-600';
    if (score >= 70) return 'text-purple-600';
    if (score >= 60) return 'text-pink-600';
    return 'text-red-600';
  };

  return (
    <div style={overlayStyles} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={modalStyles} onClick={(e) => e.stopPropagation()}>
        <div className="p-6 bg-white/90 rounded-t-xl border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎮</span>
              <h2 className="text-xl font-semibold text-gray-900">{game.game} Analysis</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              ✕
            </button>
          </div>
        </div>
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* Game Overview */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Total Plays</p>
                <p className="text-2xl font-bold text-indigo-600">{game.plays}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Average Score</p>
                <p className={`text-2xl font-bold ${getScoreColor(game.avgScore)}`}>{game.avgScore}%</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Completion Rate</p>
                <p className="text-2xl font-bold text-green-600">{game.completion}%</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Difficulty</p>
                <p className="text-xl font-semibold text-purple-600">{game.difficulty}</p>
              </div>
            </div>
          </div>

          {/* Score Distribution */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Distribution</h3>
            <div className="space-y-4">
              {detailedData.scoreDistribution.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.range}</span>
                    <span className="text-sm font-medium text-gray-700">{item.count} students</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`${item.color} h-2.5 rounded-full`}
                      style={{ width: `${Math.min(100, item.count)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performers */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {detailedData.topPerformers.map((student, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{student.name}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-700">{student.class}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`font-semibold ${getScoreColor(student.score)}`}>{student.score}%</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-700">{student.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Common Mistakes */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Mistakes</h3>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Concept</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {detailedData.commonMistakes.map((mistake, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">{mistake.concept}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-red-600 font-medium">{mistake.frequency}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-700">{mistake.students}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Time Analysis */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Analysis</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
                <p className="text-sm text-gray-600 mb-1">Avg. Completion</p>
                <p className="text-lg font-bold text-indigo-600">{detailedData.timeAnalysis.avgCompletionTime}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
                <p className="text-sm text-gray-600 mb-1">Fastest Time</p>
                <p className="text-lg font-bold text-green-600">{detailedData.timeAnalysis.fastestTime}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
                <p className="text-sm text-gray-600 mb-1">Slowest Time</p>
                <p className="text-lg font-bold text-red-600">{detailedData.timeAnalysis.slowestTime}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
                <p className="text-sm text-gray-600 mb-1">Recommended</p>
                <p className="text-lg font-bold text-purple-600">{detailedData.timeAnalysis.recommendedTime}</p>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-sm font-medium text-gray-700 mb-4">Time Distribution</p>
              <div className="flex h-8 rounded-lg overflow-hidden mb-2">
                {detailedData.timeAnalysis.timeDistribution.map((segment, index) => (
                  <div 
                    key={index}
                    className={`${
                      index === 0 ? 'bg-green-500' :
                      index === 1 ? 'bg-blue-500' :
                      index === 2 ? 'bg-indigo-500' :
                      index === 3 ? 'bg-purple-500' :
                      'bg-pink-500'
                    }`}
                    style={{ width: `${segment.percentage}%` }}
                  ></div>
                ))}
              </div>
              <div className="flex justify-between">
                {detailedData.timeAnalysis.timeDistribution.map((segment, index) => (
                  <div key={index} className="text-xs text-gray-600 flex flex-col items-center">
                    <span>{segment.range}</span>
                    <span>{segment.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Difficult Questions */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Difficult Questions</h3>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Topic</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Success Rate</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attempts</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {detailedData.difficultQuestions.map((question, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">{question.id}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-700">{question.topic}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-red-600 font-medium">{question.success}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-700">{question.attempts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Improvement Suggestions */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Suggestions for Improvement</h3>
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
              <ul className="space-y-2">
                {detailedData.improvementSuggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-indigo-600 mt-1">✓</span>
                    <span className="text-gray-800">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="p-6 bg-gray-50 rounded-b-xl border-t border-gray-200 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
};

const ScoreAnalysis = () => {
  const [analysisData, setAnalysisData] = useState({});
  const [selectedTimeRange, setSelectedTimeRange] = useState('30days');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showGameAnalysisModal, setShowGameAnalysisModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);

  // Mock data
  const mockData = {
    summary: {
      totalStudents: 156,
      averageScore: 78.5,
      improvementRate: 12.3,
      completionRate: 85.2,
      topPerformer: 'Alice Johnson',
      strugglingStudents: 8
    },
    classPerformance: [
      { class: '10-A', students: 28, avgScore: 82.3, improvement: '+5.2%', highestScore: 95, lowestScore: 68 },
      { class: '10-B', students: 31, avgScore: 79.1, improvement: '+3.8%', highestScore: 92, lowestScore: 65 },
      { class: '9-A', students: 35, avgScore: 76.8, improvement: '+7.1%', highestScore: 89, lowestScore: 62 },
      { class: '9-B', students: 29, avgScore: 74.2, improvement: '+2.9%', highestScore: 87, lowestScore: 59 },
      { class: '8-A', students: 33, avgScore: 80.5, improvement: '+6.4%', highestScore: 93, lowestScore: 67 },
      { class: '8-B', students: 30, avgScore: 77.9, improvement: '+4.1%', highestScore: 90, lowestScore: 64 },
      { class: '7-A', students: 32, avgScore: 75.6, improvement: '+3.5%', highestScore: 88, lowestScore: 61 },
      { class: '7-B', students: 28, avgScore: 73.8, improvement: '+2.7%', highestScore: 86, lowestScore: 58 }
    ],
    subjectPerformance: [
      { subject: 'Algebra', avgScore: 82.1, games: 45, difficulty: 'medium', trend: '+8.2%' },
      { subject: 'Geometry', avgScore: 74.8, games: 32, difficulty: 'hard', trend: '+3.1%' },
      { subject: 'Arithmetic', avgScore: 85.3, games: 58, difficulty: 'easy', trend: '+5.7%' },
      { subject: 'Fractions', avgScore: 78.9, games: 28, difficulty: 'medium', trend: '+6.4%' },
      { subject: 'Statistics', avgScore: 71.2, games: 19, difficulty: 'hard', trend: '+2.8%' },
      { subject: 'Physics', avgScore: 79.4, games: 35, difficulty: 'medium', trend: '+7.3%' },
      { subject: 'Chemistry', avgScore: 76.7, games: 22, difficulty: 'hard', trend: '+4.9%' },
      { subject: 'Biology', avgScore: 81.5, games: 29, difficulty: 'medium', trend: '+6.8%' }
    ],
    recentScores: [
      {
        id: 1,
        studentName: 'Alice Johnson',
        class: '10-A',
        game: 'Algebra Quest',
        score: 94,
        timeSpent: '18m 32s',
        attempts: 1,
        date: '2025-01-20',
        improvement: '+8%',
        subject: 'Algebra'
      },
      {
        id: 2,
        studentName: 'Bob Smith',
        class: '10-A',
        game: 'Number Ninja',
        score: 87,
        timeSpent: '12m 45s',
        attempts: 2,
        date: '2025-01-20',
        improvement: '+3%',
        subject: 'Arithmetic'
      },
      {
        id: 3,
        studentName: 'Carol Davis',
        class: '10-B',
        game: 'Geometry Warrior',
        score: 76,
        timeSpent: '25m 18s',
        attempts: 3,
        date: '2025-01-19',
        improvement: '-2%',
        subject: 'Geometry'
      },
      {
        id: 4,
        studentName: 'David Wilson',
        class: '9-A',
        game: 'Fraction Frenzy',
        score: 89,
        timeSpent: '15m 22s',
        attempts: 1,
        date: '2025-01-19',
        improvement: '+12%',
        subject: 'Fractions'
      },
      {
        id: 5,
        studentName: 'Emma Brown',
        class: '8-A',
        game: 'Stats Detective',
        score: 82,
        timeSpent: '20m 10s',
        attempts: 2,
        date: '2025-01-18',
        improvement: '+5%',
        subject: 'Statistics'
      },
      {
        id: 6,
        studentName: 'Frank Miller',
        class: '10-A',
        game: 'Physics Explorer',
        score: 91,
        timeSpent: '22m 35s',
        attempts: 1,
        date: '2025-01-18',
        improvement: '+7%',
        subject: 'Physics'
      },
      {
        id: 7,
        studentName: 'Grace Lee',
        class: '9-A',
        game: 'Chemistry Lab',
        score: 78,
        timeSpent: '28m 14s',
        attempts: 3,
        date: '2025-01-17',
        improvement: '+4%',
        subject: 'Chemistry'
      },
      {
        id: 8,
        studentName: 'Henry Taylor',
        class: '8-B',
        game: 'Bio Adventure',
        score: 85,
        timeSpent: '19m 48s',
        attempts: 2,
        date: '2025-01-17',
        improvement: '+9%',
        subject: 'Biology'
      }
    ],
    strugglingStudents: [
      {
        id: 1,
        name: 'Emily Brown',
        class: '10-A',
        avgScore: 58.2,
        gamesPlayed: 12,
        needsHelp: ['Algebra', 'Geometry'],
        lastActive: '2025-01-18',
        trend: '-3.2%',
        totalTime: '2h 45m'
      },
      {
        id: 2,
        name: 'Michael Green',
        class: '9-B',
        avgScore: 62.7,
        gamesPlayed: 8,
        needsHelp: ['Statistics', 'Fractions'],
        lastActive: '2025-01-17',
        trend: '-1.8%',
        totalTime: '1h 32m'
      },
      {
        id: 3,
        name: 'Olivia Davis',
        class: '8-A',
        avgScore: 65.4,
        gamesPlayed: 15,
        needsHelp: ['Physics', 'Chemistry'],
        lastActive: '2025-01-16',
        trend: '+0.5%',
        totalTime: '3h 12m'
      },
      {
        id: 4,
        name: 'James Wilson',
        class: '7-B',
        avgScore: 59.8,
        gamesPlayed: 6,
        needsHelp: ['Arithmetic', 'Fractions'],
        lastActive: '2025-01-15',
        trend: '-2.1%',
        totalTime: '1h 18m'
      }
    ],
    performanceDistribution: {
      excellent: 23,
      good: 45,
      average: 52,
      poor: 28,
      failing: 8
    },
    gameAnalytics: [
      { game: 'Algebra Quest', plays: 234, avgScore: 82.1, completion: 89.2, difficulty: 'Medium' },
      { game: 'Number Ninja', plays: 198, avgScore: 85.3, completion: 92.1, difficulty: 'Easy' },
      { game: 'Geometry Warrior', plays: 156, avgScore: 74.8, completion: 78.3, difficulty: 'Hard' },
      { game: 'Fraction Frenzy', plays: 142, avgScore: 78.9, completion: 85.7, difficulty: 'Medium' },
      { game: 'Stats Detective', plays: 89, avgScore: 71.2, completion: 76.4, difficulty: 'Hard' },
      { game: 'Physics Explorer', plays: 167, avgScore: 79.4, completion: 83.6, difficulty: 'Medium' },
      { game: 'Chemistry Lab', plays: 134, avgScore: 76.7, completion: 81.2, difficulty: 'Hard' },
      { game: 'Bio Adventure', plays: 145, avgScore: 81.5, completion: 87.9, difficulty: 'Medium' }
    ]
  };

  useEffect(() => {
    setTimeout(() => {
      setAnalysisData(mockData);
      setLoading(false);
    }, 1000);
  }, [selectedTimeRange, selectedClass, selectedSubject]);

  const timeRanges = [
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '3months', label: 'Last 3 Months' },
    { value: '6months', label: 'Last 6 Months' },
    { value: '1year', label: 'Last Year' }
  ];

  const classes = [
    { value: 'all', label: 'All Classes' },
    { value: '10-A', label: '10-A' },
    { value: '10-B', label: '10-B' },
    { value: '9-A', label: '9-A' },
    { value: '9-B', label: '9-B' },
    { value: '8-A', label: '8-A' },
    { value: '8-B', label: '8-B' },
    { value: '7-A', label: '7-A' },
    { value: '7-B', label: '7-B' }
  ];

  const subjects = [
    { value: 'all', label: 'All Subjects' },
    { value: 'algebra', label: 'Algebra' },
    { value: 'geometry', label: 'Geometry' },
    { value: 'arithmetic', label: 'Arithmetic' },
    { value: 'fractions', label: 'Fractions' },
    { value: 'statistics', label: 'Statistics' },
    { value: 'physics', label: 'Physics' },
    { value: 'chemistry', label: 'Chemistry' },
    { value: 'biology', label: 'Biology' }
  ];

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-indigo-600';
    if (score >= 70) return 'text-purple-600';
    if (score >= 60) return 'text-pink-600';
    return 'text-rose-600';
  };

  const getDifficultyColor = (difficulty) => {
    if (difficulty === 'Easy') return 'bg-indigo-100 text-indigo-700';
    if (difficulty === 'Medium') return 'bg-purple-100 text-purple-700';
    return 'bg-pink-100 text-pink-700';
  };

  // Handle the Analyze button click
  const handleAnalyzeGame = (game) => {
    setSelectedGame(game);
    setShowGameAnalysisModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-gray-200 border-t-indigo-500 rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading score analysis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">📈</span>
            <h1 className="text-3xl font-bold text-gray-900">Score Analysis</h1>
          </div>
          <p className="text-gray-600">Detailed insights into student performance and progress</p>
        </div>

        {/* Filter Controls */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
              >
                {timeRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex-1 min-w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
              >
                {classes.map((cls) => (
                  <option key={cls.value} value={cls.value}>
                    {cls.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex-1 min-w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
              >
                {subjects.map((subject) => (
                  <option key={subject.value} value={subject.value}>
                    {subject.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-3xl font-bold text-indigo-600">{analysisData.summary?.totalStudents}</p>
              </div>
              <div className="text-3xl">👥</div>
            </div>
            <p className="text-sm text-gray-500">Active learners</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-3xl font-bold text-purple-600">{analysisData.summary?.averageScore}%</p>
              </div>
              <div className="text-3xl">📊</div>
            </div>
            <p className="text-sm text-gray-500">Overall performance</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Improvement Rate</p>
                <p className="text-3xl font-bold text-green-600">+{analysisData.summary?.improvementRate}%</p>
              </div>
              <div className="text-3xl">📈</div>
            </div>
            <p className="text-sm text-gray-500">This period</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-3xl font-bold text-blue-600">{analysisData.summary?.completionRate}%</p>
              </div>
              <div className="text-3xl">✅</div>
            </div>
            <p className="text-sm text-gray-500">Games finished</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Top Performer</p>
                <p className="text-lg font-bold text-yellow-600">{analysisData.summary?.topPerformer}</p>
              </div>
              <div className="text-3xl">🏆</div>
            </div>
            <p className="text-sm text-gray-500">Class leader</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Need Support</p>
                <p className="text-3xl font-bold text-red-600">{analysisData.summary?.strugglingStudents}</p>
              </div>
              <div className="text-3xl">⚠️</div>
            </div>
            <p className="text-sm text-gray-500">Students</p>
          </div>
        </div>

        {/* Performance Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">🎯</span>
            <h2 className="text-xl font-semibold text-gray-900">Performance Distribution</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600 mb-1">{analysisData.performanceDistribution?.excellent}</div>
              <div className="text-sm font-medium text-gray-700 mb-1">Excellent</div>
              <div className="text-xs text-gray-500">90-100%</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">{analysisData.performanceDistribution?.good}</div>
              <div className="text-sm font-medium text-gray-700 mb-1">Good</div>
              <div className="text-xs text-gray-500">80-89%</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">{analysisData.performanceDistribution?.average}</div>
              <div className="text-sm font-medium text-gray-700 mb-1">Average</div>
              <div className="text-xs text-gray-500">70-79%</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600 mb-1">{analysisData.performanceDistribution?.poor}</div>
              <div className="text-sm font-medium text-gray-700 mb-1">Poor</div>
              <div className="text-xs text-gray-500">60-69%</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600 mb-1">{analysisData.performanceDistribution?.failing}</div>
              <div className="text-sm font-medium text-gray-700 mb-1">Failing</div>
              <div className="text-xs text-gray-500">&lt;60%</div>
            </div>
          </div>
        </div>

        {/* Class and Subject Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Class Performance */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">👨‍🎓</span>
              <h2 className="text-xl font-semibold text-gray-900">Class Performance</h2>
            </div>
            
            <div className="space-y-4">
              {analysisData.classPerformance?.map((classData) => (
                <div key={classData.class} className="border border-gray-100 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{classData.class}</h4>
                      <p className="text-sm text-gray-600">{classData.students} students</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getScoreColor(classData.avgScore)}`}>
                        {classData.avgScore}%
                      </div>
                      <div className={`text-sm ${classData.improvement.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                        {classData.improvement}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span>Highest: {classData.highestScore}%</span>
                    <span>Lowest: {classData.lowestScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${classData.avgScore}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subject Performance */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">📚</span>
              <h2 className="text-xl font-semibold text-gray-900">Subject Performance</h2>
            </div>
            
            <div className="space-y-4">
              {analysisData.subjectPerformance?.map((subjectData) => (
                <div key={subjectData.subject} className="border border-gray-100 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{subjectData.subject}</h4>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-600">{subjectData.games} games</p>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyColor(subjectData.difficulty)}`}>
                          {subjectData.difficulty}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getScoreColor(subjectData.avgScore)}`}>
                        {subjectData.avgScore}%
                      </div>
                      <div className={`text-sm ${subjectData.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                        {subjectData.trend}
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${subjectData.avgScore}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Game Analytics Table */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">🎮</span>
            <h2 className="text-xl font-semibold text-gray-900">Game Analytics</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Game</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Total Plays</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Avg Score</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Completion Rate</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Difficulty</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {analysisData.gameAnalytics?.map((game, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-900">{game.game}</span>
                    </td>
                    <td className="py-4 px-4 text-center text-gray-700">{game.plays}</td>
                    <td className="py-4 px-4 text-center">
                      <span className={`font-semibold ${getScoreColor(game.avgScore)}`}>
                        {game.avgScore}%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`font-semibold ${getScoreColor(game.completion)}`}>
                        {game.completion}%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(game.difficulty)}`}>
                        {game.difficulty}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button 
                        className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-200 transition-colors"
                        onClick={() => handleAnalyzeGame(game)}
                      >
                        Analyze
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Scores Table */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">⭐</span>
            <h2 className="text-xl font-semibold text-gray-900">Recent Scores</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Student</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Game</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Score</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Time Spent</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Attempts</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Improvement</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {analysisData.recentScores?.map((score) => (
                  <tr key={score.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{score.studentName}</div>
                        <div className="text-sm text-gray-500">{score.class}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{score.game}</div>
                        <div className="text-sm text-gray-500">{score.subject}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`text-xl font-bold ${getScoreColor(score.score)}`}>
                        {score.score}%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center text-gray-700">{score.timeSpent}</td>
                    <td className="py-4 px-4 text-center text-gray-700">{score.attempts}</td>
                    <td className="py-4 px-4 text-center">
                      <span className={`font-semibold ${score.improvement.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                        {score.improvement}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center text-gray-500">{score.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Struggling Students */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">🆘</span>
            <h2 className="text-xl font-semibold text-gray-900">Students Needing Support</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analysisData.strugglingStudents?.map((student) => (
              <div key={student.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{student.name}</h4>
                    <p className="text-sm text-gray-600">{student.class}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-red-600">{student.avgScore}%</div>
                    <div className={`text-sm ${student.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {student.trend}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Games Played:</span>
                    <span className="font-medium">{student.gamesPlayed}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Time:</span>
                    <span className="font-medium">{student.totalTime}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Last Active:</span>
                    <span className="font-medium">{student.lastActive}</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Needs Help With:</p>
                  <div className="flex flex-wrap gap-2">
                    {student.needsHelp.map((subject, index) => (
                      <span key={index} className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    Contact Parent
                  </button>
                  <button className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                    Assign Tutor
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Game Analysis Modal */}
      <GameAnalysisModal 
        isOpen={showGameAnalysisModal}
        onClose={() => setShowGameAnalysisModal(false)}
        game={selectedGame}
      />
    </div>
  );
  };

export default ScoreAnalysis;