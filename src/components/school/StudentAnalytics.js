// src/components/school/StudentAnalytics.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import '../../styles/StudentAnalytics.css';
const StudentAnalytics = () => {
  const [students, setStudents] = useState([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('performance');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Sample student data
  useEffect(() => {
    const sampleStudents = [
      {
        id: 1,
        name: 'Alice Johnson',
        class: '10th A',
        rollNumber: 'A001',
        averageScore: 95,
        gamesPlayed: 45,
        timeSpent: 180, // minutes
        lastActive: '2025-05-28',
        subjects: {
          math: { score: 98, games: 15, time: 60 },
          science: { score: 94, games: 12, time: 45 },
          english: { score: 92, games: 18, time: 75 }
        },
        performance: [
          { date: '2025-05-01', score: 85 },
          { date: '2025-05-08', score: 88 },
          { date: '2025-05-15', score: 92 },
          { date: '2025-05-22', score: 95 },
          { date: '2025-05-28', score: 95 }
        ],
        achievements: ['Top Performer', 'Math Wizard', 'Consistent Learner'],
        status: 'active'
      },
      {
        id: 2,
        name: 'Bob Smith',
        class: '9th B',
        rollNumber: 'B002',
        averageScore: 87,
        gamesPlayed: 38,
        timeSpent: 145,
        lastActive: '2025-05-27',
        subjects: {
          math: { score: 85, games: 12, time: 50 },
          science: { score: 89, games: 14, time: 55 },
          english: { score: 87, games: 12, time: 40 }
        },
        performance: [
          { date: '2025-05-01', score: 80 },
          { date: '2025-05-08', score: 83 },
          { date: '2025-05-15', score: 85 },
          { date: '2025-05-22', score: 87 },
          { date: '2025-05-28', score: 87 }
        ],
        achievements: ['Science Explorer', 'Team Player'],
        status: 'active'
      },
      {
        id: 3,
        name: 'Carol Davis',
        class: '10th C',
        rollNumber: 'C003',
        averageScore: 92,
        gamesPlayed: 42,
        timeSpent: 165,
        lastActive: '2025-05-28',
        subjects: {
          math: { score: 90, games: 14, time: 55 },
          science: { score: 95, games: 16, time: 60 },
          english: { score: 91, games: 12, time: 50 }
        },
        performance: [
          { date: '2025-05-01', score: 88 },
          { date: '2025-05-08', score: 89 },
          { date: '2025-05-15', score: 91 },
          { date: '2025-05-22', score: 92 },
          { date: '2025-05-28', score: 92 }
        ],
        achievements: ['Science Master', 'Quick Learner'],
        status: 'active'
      },
      {
        id: 4,
        name: 'David Wilson',
        class: '8th A',
        rollNumber: 'D004',
        averageScore: 78,
        gamesPlayed: 25,
        timeSpent: 95,
        lastActive: '2025-05-25',
        subjects: {
          math: { score: 75, games: 8, time: 30 },
          science: { score: 82, games: 9, time: 35 },
          english: { score: 77, games: 8, time: 30 }
        },
        performance: [
          { date: '2025-05-01', score: 70 },
          { date: '2025-05-08', score: 74 },
          { date: '2025-05-15', score: 76 },
          { date: '2025-05-22', score: 78 },
          { date: '2025-05-28', score: 78 }
        ],
        achievements: ['Improving Student'],
        status: 'needs-attention'
      },
      {
        id: 5,
        name: 'Emma Brown',
        class: '9th A',
        rollNumber: 'E005',
        averageScore: 89,
        gamesPlayed: 35,
        timeSpent: 135,
        lastActive: '2025-05-28',
        subjects: {
          math: { score: 87, games: 11, time: 45 },
          science: { score: 91, games: 12, time: 50 },
          english: { score: 89, games: 12, time: 40 }
        },
        performance: [
          { date: '2025-05-01', score: 85 },
          { date: '2025-05-08', score: 86 },
          { date: '2025-05-15', score: 88 },
          { date: '2025-05-22', score: 89 },
          { date: '2025-05-28', score: 89 }
        ],
        achievements: ['Balanced Learner', 'Regular Player'],
        status: 'active'
      }
    ];
    setStudents(sampleStudents);
  }, []);

  // Analytics data
  const classPerformanceData = [
    { class: '8th A', avgScore: 75, students: 32 },
    { class: '9th A', avgScore: 82, students: 35 },
    { class: '9th B', avgScore: 79, students: 33 },
    { class: '10th A', avgScore: 88, students: 30 },
    { class: '10th C', avgScore: 85, students: 29 }
  ];

  const subjectPerformanceData = [
    { subject: 'Mathematics', avgScore: 78, color: '#00ff88' },
    { subject: 'Science', avgScore: 84, color: '#00a8ff' },
    { subject: 'English', avgScore: 81, color: '#8c7ae6' },
    { subject: 'History', avgScore: 76, color: '#ff6b9d' }
  ];

  const engagementData = [
    { name: 'Mon', activeStudents: 120, gamesPlayed: 45 },
    { name: 'Tue', activeStudents: 135, gamesPlayed: 52 },
    { name: 'Wed', activeStudents: 145, gamesPlayed: 48 },
    { name: 'Thu', activeStudents: 158, gamesPlayed: 63 },
    { name: 'Fri', activeStudents: 162, gamesPlayed: 71 },
    { name: 'Sat', activeStudents: 95, gamesPlayed: 38 },
    { name: 'Sun', activeStudents: 88, gamesPlayed: 35 }
  ];

  const classes = [...new Set(students.map(s => s.class))];

  const filteredStudents = students
    .filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesClass = selectedClass === 'all' || student.class === selectedClass;
      return matchesSearch && matchesClass;
    });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#00ff88';
      case 'needs-attention': return '#ffd700';
      case 'inactive': return '#ff6b6b';
      default: return '#94a3b8';
    }
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setIsDetailModalOpen(true);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          className="chart-tooltip"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="tooltip-header">{label}</div>
          {payload.map((entry, index) => (
            <div key={index} className="tooltip-item" style={{ color: entry.color }}>
              <span className="tooltip-label">{entry.dataKey}:</span>
              <span className="tooltip-value">{entry.value}</span>
            </div>
          ))}
        </motion.div>
      );
    }
    return null;
  };

  return (
    <motion.div
      className="student-analytics"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-title">
          <motion.span 
            className="dashboard-title-icon"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            👨‍🎓
          </motion.span>
          Student Analytics
        </div>
        <p className="dashboard-subtitle">
          Comprehensive insights into student performance and engagement
        </p>
      </div>

      {/* Analytics Summary Cards */}
      <motion.div 
        className="analytics-summary"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div 
          className="summary-card"
          whileHover={{ scale: 1.02, boxShadow: '0 10px 25px rgba(0, 255, 136, 0.2)' }}
        >
          <div className="card-icon">📊</div>
          <div className="card-info">
            <h3>Average Performance</h3>
            <motion.div 
              className="card-value"
              animate={{ 
                textShadow: [
                  '0 0 10px rgba(0, 255, 136, 0)',
                  '0 0 20px rgba(0, 255, 136, 0.5)',
                  '0 0 10px rgba(0, 255, 136, 0)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {Math.round(students.reduce((acc, s) => acc + s.averageScore, 0) / students.length)}%
            </motion.div>
          </div>
        </motion.div>

        <motion.div 
          className="summary-card"
          whileHover={{ scale: 1.02, boxShadow: '0 10px 25px rgba(0, 168, 255, 0.2)' }}
        >
          <div className="card-icon">🎮</div>
          <div className="card-info">
            <h3>Total Games Played</h3>
            <motion.div 
              className="card-value"
              animate={{ 
                textShadow: [
                  '0 0 10px rgba(0, 168, 255, 0)',
                  '0 0 20px rgba(0, 168, 255, 0.5)',
                  '0 0 10px rgba(0, 168, 255, 0)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            >
              {students.reduce((acc, s) => acc + s.gamesPlayed, 0)}
            </motion.div>
          </div>
        </motion.div>

        <motion.div 
          className="summary-card"
          whileHover={{ scale: 1.02, boxShadow: '0 10px 25px rgba(140, 122, 230, 0.2)' }}
        >
          <div className="card-icon">⏱️</div>
          <div className="card-info">
            <h3>Total Learning Time</h3>
            <motion.div 
              className="card-value"
              animate={{ 
                textShadow: [
                  '0 0 10px rgba(140, 122, 230, 0)',
                  '0 0 20px rgba(140, 122, 230, 0.5)',
                  '0 0 10px rgba(140, 122, 230, 0)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            >
              {Math.round(students.reduce((acc, s) => acc + s.timeSpent, 0) / 60)}h
            </motion.div>
          </div>
        </motion.div>

        <motion.div 
          className="summary-card"
          whileHover={{ scale: 1.02, boxShadow: '0 10px 25px rgba(255, 107, 157, 0.2)' }}
        >
          <div className="card-icon">⚠️</div>
          <div className="card-info">
            <h3>Need Attention</h3>
            <motion.div 
              className="card-value"
              animate={{ 
                textShadow: [
                  '0 0 10px rgba(255, 107, 157, 0)',
                  '0 0 20px rgba(255, 107, 157, 0.5)',
                  '0 0 10px rgba(255, 107, 157, 0)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
            >
              {students.filter(s => s.status === 'needs-attention').length}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Charts Section */}
      <div className="charts-section">
        <motion.div 
          className="chart-container"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="chart-header">
            <h3>Class Performance Comparison</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={classPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis dataKey="class" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="avgScore" fill="url(#classGradient)" radius={[4, 4, 0, 0]} />
              <defs>
                <linearGradient id="classGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00ff88" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#00ff88" stopOpacity={0.6}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div 
          className="chart-container"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="chart-header">
            <h3>Subject Performance</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={subjectPerformanceData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={50}
                paddingAngle={5}
                dataKey="avgScore"
              >
                {subjectPerformanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Student Engagement Chart */}
      <motion.div 
        className="chart-container full-width"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="chart-header">
          <h3>Weekly Student Engagement</h3>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={engagementData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="activeStudents" 
              stroke="#00ff88" 
              strokeWidth={3}
              dot={{ fill: '#00ff88', strokeWidth: 2, r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="gamesPlayed" 
              stroke="#00a8ff" 
              strokeWidth={3}
              dot={{ fill: '#00a8ff', strokeWidth: 2, r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Student List */}
      <motion.div 
        className="students-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="section-header">
          <h3>Student Performance List</h3>
          <div className="controls">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>
            <select 
              value={selectedClass} 
              onChange={(e) => setSelectedClass(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Classes</option>
              {classes.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="students-grid">
          {filteredStudents.map((student, index) => (
            <motion.div
              key={student.id}
              className="student-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.02, 
                y: -5,
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 255, 136, 0.2)'
              }}
              onClick={() => handleViewStudent(student)}
            >
              <div className="student-header">
                <motion.div 
                  className="student-avatar"
                  animate={{ 
                    boxShadow: [
                      '0 0 10px rgba(0, 255, 136, 0.3)',
                      '0 0 20px rgba(0, 255, 136, 0.5)',
                      '0 0 10px rgba(0, 255, 136, 0.3)'
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: index * 0.2 }}
                >
                  {student.name.split(' ').map(n => n[0]).join('')}
                </motion.div>
                <div className="student-basic-info">
                  <h4>{student.name}</h4>
                  <p>{student.class} • {student.rollNumber}</p>
                  <div 
                    className="student-status"
                    style={{ color: getStatusColor(student.status) }}
                  >
                    ● {student.status.replace('-', ' ').toUpperCase()}
                  </div>
                </div>
              </div>

              <div className="student-metrics">
                <div className="metric">
                  <span className="metric-label">Avg Score</span>
                  <motion.span 
                    className="metric-value"
                    animate={{ 
                      textShadow: [
                        '0 0 5px rgba(0, 255, 136, 0)',
                        '0 0 10px rgba(0, 255, 136, 0.5)',
                        '0 0 5px rgba(0, 255, 136, 0)'
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                  >
                    {student.averageScore}%
                  </motion.span>
                </div>
                <div className="metric">
                  <span className="metric-label">Games</span>
                  <span className="metric-value">{student.gamesPlayed}</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Time</span>
                  <span className="metric-value">{Math.round(student.timeSpent / 60)}h</span>
                </div>
              </div>

              <div className="student-subjects">
                <div className="subject-performance">
                  <div className="subject-item">
                    <span>Math: {student.subjects.math.score}%</span>
                  </div>
                  <div className="subject-item">
                    <span>Science: {student.subjects.science.score}%</span>
                  </div>
                  <div className="subject-item">
                    <span>English: {student.subjects.english.score}%</span>
                  </div>
                </div>
              </div>

              <div className="achievements">
                {student.achievements.slice(0, 2).map((achievement, idx) => (
                  <span key={idx} className="achievement-badge">{achievement}</span>
                ))}
                {student.achievements.length > 2 && (
                  <span className="achievement-badge">+{student.achievements.length - 2}</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Student Detail Modal */}
      <AnimatePresence>
        {isDetailModalOpen && selectedStudent && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsDetailModalOpen(false)}
          >
            <motion.div
              className="modal-content large"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>Student Analytics - {selectedStudent.name}</h2>
                <button 
                  className="close-btn"
                  onClick={() => setIsDetailModalOpen(false)}
                >
                  ✕
                </button>
              </div>

              <div className="student-detail-content">
                <div className="student-profile">
                  <div className="profile-avatar">
                    {selectedStudent.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="profile-info">
                    <h3>{selectedStudent.name}</h3>
                    <p>{selectedStudent.class} • {selectedStudent.rollNumber}</p>
                    <div 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(selectedStudent.status) }}
                    >
                      {selectedStudent.status.replace('-', ' ').toUpperCase()}
                    </div>
                  </div>
                </div>

                <div className="performance-chart">
                  <h4>Performance Trend</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={selectedStudent.performance}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                      <XAxis dataKey="date" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#00ff88" 
                        strokeWidth={3}
                        dot={{ fill: '#00ff88', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="subject-details">
                  <h4>Subject Performance</h4>
                  <div className="subjects-grid">
                    {Object.entries(selectedStudent.subjects).map(([subject, data]) => (
                      <div key={subject} className="subject-detail-card">
                        <h5>{subject.charAt(0).toUpperCase() + subject.slice(1)}</h5>
                        <div className="subject-stats">
                          <span>Score: {data.score}%</span>
                          <span>Games: {data.games}</span>
                          <span>Time: {data.time}min</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="achievements-section">
                  <h4>Achievements</h4>
                  <div className="achievements-grid">
                    {selectedStudent.achievements.map((achievement, idx) => (
                      <span key={idx} className="achievement-badge large">{achievement}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default StudentAnalytics;