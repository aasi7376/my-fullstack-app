// src/components/school/PerformanceReports.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import '../../styles/CyberpunkPerformanceReports.css'; // Import the cyberpunk styling
import '../../styles/CyberpunkAnimation.css'; // Import additional animations

const PerformanceReports = () => {
  const [selectedReport, setSelectedReport] = useState('overview');
  const [dateRange, setDateRange] = useState('month');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);

  // Sample data
  const overviewData = [
    { month: 'Jan', avgScore: 75, attendance: 92, gamesPlayed: 450 },
    { month: 'Feb', avgScore: 78, attendance: 89, gamesPlayed: 520 },
    { month: 'Mar', avgScore: 82, attendance: 94, gamesPlayed: 680 },
    { month: 'Apr', avgScore: 79, attendance: 91, gamesPlayed: 590 },
    { month: 'May', avgScore: 85, attendance: 95, gamesPlayed: 720 }
  ];

  const classPerformanceData = [
    { class: '6th A', students: 35, avgScore: 78, improvement: 5.2 },
    { class: '7th A', students: 38, avgScore: 82, improvement: 3.8 },
    { class: '8th A', students: 32, avgScore: 85, improvement: 7.1 },
    { class: '9th A', students: 30, avgScore: 81, improvement: 2.5 },
    { class: '10th A', students: 28, avgScore: 88, improvement: 6.3 }
  ];

  const subjectPerformanceData = [
    { subject: 'Mathematics', avgScore: 76, totalStudents: 163, color: '#00ff88' },
    { subject: 'Science', avgScore: 84, totalStudents: 163, color: '#00a8ff' },
    { subject: 'English', avgScore: 81, totalStudents: 163, color: '#8c7ae6' },
    { subject: 'Social Studies', avgScore: 79, totalStudents: 163, color: '#ff6b9d' },
    { subject: 'Arts', avgScore: 88, totalStudents: 85, color: '#ffd700' }
  ];

  const teacherPerformanceData = [
    { teacher: 'Sarah Johnson', subject: 'Math', classAvg: 85, studentCount: 95, rating: 4.8 },
    { teacher: 'Michael Chen', subject: 'Science', classAvg: 82, studentCount: 78, rating: 4.6 },
    { teacher: 'Emily Davis', subject: 'English', classAvg: 89, studentCount: 92, rating: 4.9 },
    { teacher: 'Robert Wilson', subject: 'History', classAvg: 77, studentCount: 65, rating: 4.5 },
    { teacher: 'Lisa Martinez', subject: 'Arts', classAvg: 91, studentCount: 48, rating: 4.7 }
  ];

  const engagementData = [
    { week: 'Week 1', activeStudents: 145, gamesCompleted: 320, avgTimeSpent: 45 },
    { week: 'Week 2', activeStudents: 158, gamesCompleted: 380, avgTimeSpent: 52 },
    { week: 'Week 3', activeStudents: 162, gamesCompleted: 420, avgTimeSpent: 48 },
    { week: 'Week 4', activeStudents: 171, gamesCompleted: 465, avgTimeSpent: 55 }
  ];

  const reportTypes = [
    { id: 'overview', label: 'School Overview', icon: '📊' },
    { id: 'class', label: 'Class Performance', icon: '🏛️' },
    { id: 'subject', label: 'Subject Analysis', icon: '📚' },
    { id: 'teacher', label: 'Teacher Performance', icon: '👨‍🏫' },
    { id: 'engagement', label: 'Student Engagement', icon: '🎮' },
    { id: 'attendance', label: 'Attendance Report', icon: '📅' }
  ];

  const handleGenerateReport = () => {
    setIsGenerating(true);
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      // Handle report generation logic here
    }, 2000);
  };

  const handleExportReport = (format) => {
    // Handle export logic (PDF, Excel, etc.)
    console.log(`Exporting report in ${format} format`);
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

  const renderOverviewReport = () => (
    <motion.div 
      className="report-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="report-header">
        <h3 className="typing-effect">📊 School Performance Overview</h3>
        <p>Comprehensive analysis of school performance metrics</p>
      </div>

      <div className="charts-grid">
        <div className="chart-container neon-border data-flow">
          <h4>Monthly Performance Trends</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={overviewData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="avgScore" stroke="#00ff88" strokeWidth={3} />
              <Line type="monotone" dataKey="attendance" stroke="#00a8ff" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container neon-border">
          <h4>Games Played Trend</h4>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={overviewData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="gamesPlayed" stroke="#8c7ae6" fill="url(#gamesGradient)" />
              <defs>
                <linearGradient id="gamesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8c7ae6" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="#8c7ae6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="summary-stats">
        <div className="stat-card tilt-effect">
          <div className="stat-icon">📈</div>
          <div className="stat-info">
            <h4>Average Score Improvement</h4>
            <span className="stat-value neon-text">+13.3%</span>
            <span className="stat-period">vs last quarter</span>
          </div>
        </div>
        <div className="stat-card tilt-effect">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h4>Student Engagement</h4>
            <span className="stat-value neon-text">94.2%</span>
            <span className="stat-period">active participation</span>
          </div>
        </div>
        <div className="stat-card tilt-effect">
          <div className="stat-icon">🎯</div>
          <div className="stat-info">
            <h4>Goal Achievement</h4>
            <span className="stat-value neon-text">87%</span>
            <span className="stat-period">targets met</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderClassReport = () => (
    <motion.div 
      className="report-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="report-header">
        <h3 className="typing-effect glitch-text" data-text="🏛️ Class Performance Analysis">🏛️ Class Performance Analysis</h3>
        <p>Detailed performance breakdown by class</p>
      </div>

      <div className="chart-container full-width neon-border">
        <ResponsiveContainer width="100%" height={400}>
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
      </div>

      <div className="class-details-table circuit-bg">
        <table className="performance-table">
          <thead>
            <tr>
              <th>Class</th>
              <th>Students</th>
              <th>Average Score</th>
              <th>Improvement</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {classPerformanceData.map((cls, index) => (
              <motion.tr
                key={cls.class}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="tilt-effect"
              >
                <td>{cls.class}</td>
                <td>{cls.students}</td>
                <td>
                  <span className="score-badge cyber-badge">{cls.avgScore}%</span>
                </td>
                <td>
                  <span className={`improvement ${cls.improvement > 0 ? 'positive' : 'negative'}`}>
                    {cls.improvement > 0 ? '+' : ''}{cls.improvement}%
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${cls.avgScore >= 85 ? 'excellent' : cls.avgScore >= 75 ? 'good' : 'needs-improvement'}`}>
                    {cls.avgScore >= 85 ? 'Excellent' : cls.avgScore >= 75 ? 'Good' : 'Needs Improvement'}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );

  const renderSubjectReport = () => (
    <motion.div 
      className="report-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="report-header">
        <h3 className="typing-effect">📚 Subject Performance Analysis</h3>
        <p>Performance breakdown by subject areas</p>
      </div>

      <div className="charts-grid">
        <div className="chart-container neon-border cyber-radar">
          <h4>Subject Performance Distribution</h4>
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
        </div>

        <div className="chart-container neon-border">
          <h4>Subject Scores Comparison</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subjectPerformanceData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis type="number" stroke="#94a3b8" />
              <YAxis dataKey="subject" type="category" stroke="#94a3b8" width={100} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="avgScore" fill="#00a8ff" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="subject-insights">
        <h4>Subject Insights</h4>
        <div className="insights-grid">
          {subjectPerformanceData.map((subject, index) => (
            <motion.div
              key={subject.subject}
              className="insight-card holographic"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="insight-header">
                <h5>{subject.subject}</h5>
                <span className="score-circle" style={{ borderColor: subject.color }}>
                  {subject.avgScore}%
                </span>
              </div>
              <div className="insight-stats">
                <div className="stat-item">
                  <span>Students: {subject.totalStudents}</span>
                </div>
                <div className="stat-item">
                  <span>Performance: {subject.avgScore >= 85 ? 'Excellent' : subject.avgScore >= 75 ? 'Good' : 'Needs Focus'}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderTeacherReport = () => (
    <motion.div 
      className="report-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="report-header">
        <h3 className="typing-effect">👨‍🏫 Teacher Performance Analysis</h3>
        <p>Individual teacher performance and student outcomes</p>
      </div>

      <div className="teacher-performance-grid digital-noise">
        {teacherPerformanceData.map((teacher, index) => (
          <motion.div
            key={teacher.teacher}
            className="teacher-card neon-border"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, boxShadow: '0 10px 25px rgba(0, 255, 136, 0.2)' }}
          >
            <div className="teacher-header">
              <div className="teacher-avatar holographic">
                {teacher.teacher.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="teacher-info">
                <h4 className="retro-terminal">{teacher.teacher}</h4>
                <p>{teacher.subject}</p>
              </div>
            </div>
            <div className="teacher-metrics">
              <div className="metric">
                <span className="metric-label">Class Average</span>
                <span className="metric-value">{teacher.classAvg}%</span>
              </div>
              <div className="metric">
                <span className="metric-label">Students</span>
                <span className="metric-value">{teacher.studentCount}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Rating</span>
                <span className="metric-value">⭐ {teacher.rating}</span>
              </div>
            </div>
            <div className="performance-indicator">
              <div className="indicator-bar">
                <motion.div 
                  className="indicator-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${teacher.classAvg}%` }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                  style={{ backgroundColor: teacher.classAvg >= 85 ? '#00ff88' : teacher.classAvg >= 75 ? '#ffd700' : '#ff6b6b' }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderEngagementReport = () => (
    <motion.div 
      className="report-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="report-header">
        <h3 className="typing-effect neon-text">🎮 Student Engagement Analysis</h3>
        <p>Gaming activity and learning engagement metrics</p>
      </div>

      <div className="chart-container full-width neon-border data-flow">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={engagementData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis dataKey="week" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="activeStudents" stroke="#00ff88" strokeWidth={3} />
            <Line type="monotone" dataKey="gamesCompleted" stroke="#00a8ff" strokeWidth={3} />
            <Line type="monotone" dataKey="avgTimeSpent" stroke="#8c7ae6" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="engagement-metrics">
        <div className="metric-card tilt-effect energy-pulse">
          <div className="metric-icon">👥</div>
          <div className="metric-info">
            <h4>Weekly Active Students</h4>
            <span className="metric-value">171</span>
            <span className="metric-change positive">+18% vs last week</span>
          </div>
        </div>
        <div className="metric-card tilt-effect energy-pulse">
          <div className="metric-icon">🎮</div>
          <div className="metric-info">
            <h4>Games Completed</h4>
            <span className="metric-value">465</span>
            <span className="metric-change positive">+10.7% vs last week</span>
          </div>
        </div>
        <div className="metric-card tilt-effect energy-pulse">
          <div className="metric-icon">⏱️</div>
          <div className="metric-info">
            <h4>Avg Time Spent</h4>
            <span className="metric-value">55 min</span>
            <span className="metric-change positive">+14.6% vs last week</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderAttendanceReport = () => (
    <motion.div 
      className="report-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="report-header">
        <h3 className="typing-effect">📅 Attendance Analysis</h3>
        <p>Student attendance patterns and trends</p>
      </div>

      <div className="attendance-summary circuit-connect">
        <div className="summary-card neon-border">
          <h4>Overall Attendance</h4>
          <div className="attendance-circle">
            <motion.div 
              className="circle-progress"
              initial={{ strokeDasharray: "0 283" }}
              animate={{ strokeDasharray: "267 283" }}
              transition={{ duration: 2 }}
            >
              <svg width="120" height="120">
                <circle cx="60" cy="60" r="45" stroke="#2a2a2a" strokeWidth="8" fill="none" />
                <circle 
                  cx="60" 
                  cy="60" 
                  r="45" 
                  stroke="#00ff88" 
                  strokeWidth="8" 
                  fill="none"
                  strokeDasharray="267 283"
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                />
              </svg>
              <div className="circle-text neon-text">94.5%</div>
            </motion.div>
          </div>
        </div>

        <div className="attendance-breakdown">
          <div className="breakdown-item holographic">
            <span className="breakdown-label">Present</span>
            <span className="breakdown-value present">1,580 days</span>
          </div>
          <div className="breakdown-item holographic">
            <span className="breakdown-label">Absent</span>
            <span className="breakdown-value absent">92 days</span>
          </div>
          <div className="breakdown-item holographic">
            <span className="breakdown-label">Late</span>
            <span className="breakdown-value late">45 days</span>
          </div>
        </div>
      </div>

      <div className="class-attendance-table matrix-bg">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Class</th>
              <th>Total Students</th>
              <th>Present Today</th>
              <th>Attendance Rate</th>
              <th>Trend</th>
            </tr>
          </thead>
          <tbody>
            {classPerformanceData.map((cls, index) => {
              const attendanceRate = Math.floor(Math.random() * 10) + 90;
              const trend = Math.random() > 0.5 ? 'up' : 'down';
              return (
                <motion.tr
                  key={cls.class}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="tilt-effect"
                >
                  <td>{cls.class}</td>
                  <td>{cls.students}</td>
                  <td>{Math.floor(cls.students * (attendanceRate / 100))}</td>
                  <td>
                    <span className={`attendance-rate ${attendanceRate >= 95 ? 'excellent' : attendanceRate >= 90 ? 'good' : 'poor'}`}>
                      {attendanceRate}%
                    </span>
                  </td>
                  <td>
                    <span className={`trend ${trend}`}>
                      {trend === 'up' ? '📈' : '📉'}
                    </span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );

  const renderReportContent = () => {
    switch (selectedReport) {
      case 'overview': return renderOverviewReport();
      case 'class': return renderClassReport();
      case 'subject': return renderSubjectReport();
      case 'teacher': return renderTeacherReport();
      case 'engagement': return renderEngagementReport();
      case 'attendance': return renderAttendanceReport();
      default: return renderOverviewReport();
    }
  };

  return (
    <motion.div
      className="performance-reports noise"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="dashboard-header circuit-bg">
        <div className="dashboard-title retro-terminal glitch-text" data-text="Performance Reports">
          <motion.span 
            className="dashboard-title-icon"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            📋
          </motion.span>
          Performance Reports
        </div>
        <p className="dashboard-subtitle typing-effect">
          Comprehensive analytics and insights on school performance
        </p>
      </div>

      {/* Report Controls */}
      <motion.div 
        className="report-controls neon-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="report-types">
          {reportTypes.map((type) => (
            <motion.button
              key={type.id}
              className={`report-type-btn ${selectedReport === type.id ? 'active' : ''} ${selectedReport === type.id ? 'neon-pulse' : ''}`}
              onClick={() => setSelectedReport(type.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="btn-icon">{type.icon}</span>
              <span className="btn-label">{type.label}</span>
            </motion.button>
          ))}
        </div>

        <div className="report-actions">
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className="date-range-select"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>

          <motion.button
            className="btn-neon btn-secondary cyber-button"
            onClick={handleGenerateReport}
            disabled={isGenerating}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isGenerating ? (
              <>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  ⟳
                </motion.span>
                <div className="cyber-loading-bar"></div>
                Generating...
              </>
            ) : (
              <>📊 Generate Report</>
            )}
          </motion.button>

          <div className="export-dropdown">
            <motion.button
              className="btn-neon btn-primary energy-pulse"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              📥 Export
            </motion.button>
            <div className="export-options">
              <button onClick={() => handleExportReport('pdf')}>📄 PDF</button>
              <button onClick={() => handleExportReport('excel')}>📊 Excel</button>
              <button onClick={() => handleExportReport('csv')}>📋 CSV</button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Report Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedReport}
          className="report-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderReportContent()}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default PerformanceReports;