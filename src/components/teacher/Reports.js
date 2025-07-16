// Reports.jsx - Enhanced version with working action buttons and modals
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DataTable from '../common/DataTable';
import PerformanceChart from '../charts/PerformanceChart';

const Reports = () => {
  const [reportType, setReportType] = useState('class');
  const [timeFrame, setTimeFrame] = useState('month');
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState({});

  // Modal state variables
  const [showClassDetailsModal, setShowClassDetailsModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [showStudentProfileModal, setShowStudentProfileModal] = useState(false);
  const [selectedStudentProfile, setSelectedStudentProfile] = useState(null);
  const [showSupportPlanModal, setShowSupportPlanModal] = useState(false);
  const [selectedSupportStudent, setSelectedSupportStudent] = useState(null);
  const [showSubjectAnalysisModal, setShowSubjectAnalysisModal] = useState(false);
  const [selectedSubjectAnalysis, setSelectedSubjectAnalysis] = useState(null);

  // Mock data
  const mockReports = {
    class: {
      summary: {
        totalStudents: 156,
        avgScore: 78.5,
        improvementRate: 12.3,
        completionRate: 85.2,
        topClass: '10-A',
        lowPerforming: '9-B'
      },
      classScores: [
        { className: '10-A', students: 28, avgScore: 82.3, improvement: '+5.2%', activities: 45 },
        { className: '10-B', students: 31, avgScore: 79.1, improvement: '+3.8%', activities: 42 },
        { className: '9-A', students: 35, avgScore: 76.8, improvement: '+7.1%', activities: 38 },
        { className: '9-B', students: 29, avgScore: 74.2, improvement: '+2.9%', activities: 35 },
        { className: '8-A', students: 33, avgScore: 80.5, improvement: '+6.4%', activities: 40 },
        { className: '8-B', students: 30, avgScore: 77.9, improvement: '+4.1%', activities: 37 },
        { className: '7-A', students: 32, avgScore: 75.6, improvement: '+3.5%', activities: 34 },
        { className: '7-B', students: 28, avgScore: 73.8, improvement: '+2.7%', activities: 32 }
      ],
      detailedPerformance: [
        { className: '10-A', math: 85, science: 82, english: 79, social: 83, computer: 87 },
        { className: '10-B', math: 80, science: 78, english: 81, social: 77, computer: 83 },
        { className: '9-A', math: 77, science: 75, english: 78, social: 77, computer: 80 },
        { className: '9-B', math: 72, science: 74, english: 73, social: 78, computer: 76 },
        { className: '8-A', math: 81, science: 79, english: 82, social: 80, computer: 84 },
        { className: '8-B', math: 78, science: 76, english: 80, social: 77, computer: 81 },
        { className: '7-A', math: 76, science: 74, english: 77, social: 75, computer: 79 },
        { className: '7-B', math: 74, science: 72, english: 75, social: 73, computer: 77 }
      ]
    },
    student: {
      summary: {
        totalActivities: 463,
        avgTimeSpent: '23 min',
        completionRate: 89.4,
        mostActive: 'Alice Johnson',
        needsAttention: 8
      },
      topPerformers: [
        { id: 1, name: 'Alice Johnson', class: '10-A', avgScore: 94.5, improvement: '+8.2%', activities: 52 },
        { id: 2, name: 'David Wilson', class: '9-A', avgScore: 91.2, improvement: '+12.4%', activities: 48 },
        { id: 3, name: 'Carol Davis', class: '10-B', avgScore: 90.8, improvement: '+5.7%', activities: 45 },
        { id: 4, name: 'Emma Brown', class: '8-A', avgScore: 89.3, improvement: '+9.1%', activities: 50 },
        { id: 5, name: 'Frank Miller', class: '10-A', avgScore: 88.7, improvement: '+6.8%', activities: 47 },
        { id: 6, name: 'Grace Lee', class: '9-A', avgScore: 87.9, improvement: '+7.3%', activities: 44 },
        { id: 7, name: 'Henry Taylor', class: '8-B', avgScore: 86.4, improvement: '+5.9%', activities: 42 },
        { id: 8, name: 'Isabel Chen', class: '7-A', avgScore: 85.8, improvement: '+8.7%', activities: 41 }
      ],
      strugglingStudents: [
        { id: 1, name: 'George Thomas', class: '9-B', avgScore: 58.2, improvement: '-2.3%', activities: 25 },
        { id: 2, name: 'Hannah Adams', class: '8-A', avgScore: 62.7, improvement: '+1.5%', activities: 30 },
        { id: 3, name: 'Ian Parker', class: '10-B', avgScore: 65.4, improvement: '+0.8%', activities: 28 },
        { id: 4, name: 'Julia Rogers', class: '9-A', avgScore: 67.9, improvement: '+2.1%', activities: 32 },
        { id: 5, name: 'Kevin Harris', class: '10-A', avgScore: 69.3, improvement: '+3.7%', activities: 35 },
        { id: 6, name: 'Lily Martinez', class: '7-B', avgScore: 61.8, improvement: '+1.2%', activities: 27 },
        { id: 7, name: 'Mason Clark', class: '8-B', avgScore: 64.5, improvement: '+2.8%', activities: 29 },
        { id: 8, name: 'Nina Rodriguez', class: '7-A', avgScore: 66.7, improvement: '+4.1%', activities: 31 }
      ]
    },
    subject: {
      summary: {
        totalSubjects: 5,
        highestAvg: 'Mathematics',
        lowestAvg: 'Science',
        mostImproved: 'English',
        leastImproved: 'Social Studies'
      },
      subjectPerformance: [
        { subject: 'Mathematics', avgScore: 82.1, activities: 145, improvement: '+7.5%' },
        { subject: 'Science', avgScore: 74.8, activities: 132, improvement: '+3.2%' },
        { subject: 'English', avgScore: 79.3, activities: 118, improvement: '+8.1%' },
        { subject: 'Social Studies', avgScore: 76.5, activities: 98, improvement: '+2.8%' },
        { subject: 'Computer Science', avgScore: 81.7, activities: 105, improvement: '+6.3%' },
        { subject: 'Physics', avgScore: 78.9, activities: 89, improvement: '+5.7%' },
        { subject: 'Chemistry', avgScore: 77.2, activities: 76, improvement: '+4.9%' },
        { subject: 'Biology', avgScore: 80.4, activities: 93, improvement: '+6.8%' }
      ],
      detailedScores: [
        { subject: 'Mathematics', '10-A': 85, '10-B': 80, '9-A': 77, '9-B': 72, '8-A': 81, '8-B': 78, '7-A': 76, '7-B': 74 },
        { subject: 'Science', '10-A': 82, '10-B': 78, '9-A': 75, '9-B': 74, '8-A': 79, '8-B': 76, '7-A': 74, '7-B': 72 },
        { subject: 'English', '10-A': 79, '10-B': 81, '9-A': 78, '9-B': 73, '8-A': 82, '8-B': 80, '7-A': 77, '7-B': 75 },
        { subject: 'Social Studies', '10-A': 83, '10-B': 77, '9-A': 77, '9-B': 78, '8-A': 80, '8-B': 77, '7-A': 75, '7-B': 73 },
        { subject: 'Computer Science', '10-A': 87, '10-B': 83, '9-A': 80, '9-B': 76, '8-A': 84, '8-B': 81, '7-A': 79, '7-B': 77 }
      ]
    }
  };

  // Handler functions for modal actions
  const handleViewClassDetails = (classData) => {
    setSelectedClass(classData);
    setShowClassDetailsModal(true);
  };

  const handleViewStudentProfile = (student) => {
    setSelectedStudentProfile(student);
    setShowStudentProfileModal(true);
  };

  const handleCreateSupportPlan = (student) => {
    setSelectedSupportStudent(student);
    setShowSupportPlanModal(true);
  };

  const handleAnalyzeSubject = (subject) => {
    setSelectedSubjectAnalysis(subject);
    setShowSubjectAnalysisModal(true);
  };

  // Modal close handlers
  const closeAllModals = () => {
    setShowClassDetailsModal(false);
    setShowStudentProfileModal(false);
    setShowSupportPlanModal(false);
    setShowSubjectAnalysisModal(false);
    setSelectedClass(null);
    setSelectedStudentProfile(null);
    setSelectedSupportStudent(null);
    setSelectedSubjectAnalysis(null);
  };

  // Load data based on selected report type
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setReportData(mockReports[reportType]);
      setLoading(false);
    }, 800);
  }, [reportType, timeFrame]);

  // Improved score color function with better contrast
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-indigo-700 font-bold';
    if (score >= 75) return 'text-purple-700 font-bold';
    return 'text-pink-700 font-bold';
  };

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

  // Loading state
  if (loading && !reportData.summary) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 via-pink-100 to-white bg-[length:200%_200%]" style={{ animation: 'auroraFlow 15s ease infinite' }}></div>
        <div className="relative z-10 flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-gray-200 border-t-indigo-500 rounded-full animate-spin"></div>
            <p className="text-gray-800 font-medium">Loading reports...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Aurora background */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 via-pink-100 to-white bg-[length:200%_200%]" style={{ animation: 'auroraFlow 15s ease infinite' }}></div>
      
      {/* Dashboard content */}
      <motion.div
        className="relative z-10 p-6 tab-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header - Improved text contrast */}
        <motion.div variants={itemVariants} className="welcome-header mb-8">
          <h1 className="welcome-title text-3xl font-bold text-gray-900 flex items-center gap-3">
            <span className="text-4xl">📋</span>
            Performance Reports
          </h1>
          <p className="welcome-subtitle text-gray-800 font-medium">
            Comprehensive insights into learning performance
          </p>
        </motion.div>

        {/* Report Type Selector and Export Button - Improved text contrast */}
        <motion.div variants={itemVariants} className="flex flex-wrap justify-between items-center mb-6">
          <div className="flex flex-wrap gap-4 mb-4 md:mb-0">
            <div className="tabs-container flex gap-2">
              <button
                className={`px-4 py-2 rounded-lg font-bold text-white transition-all duration-300 ${reportType === 'class' ? 'bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg' : 'bg-gray-500/80 backdrop-blur-sm hover:bg-gray-600/80'}`}
                onClick={() => setReportType('class')}
              >
                <span className="mr-2">👨‍🎓</span>
                <span>Class Reports</span>
              </button>
              <button
                className={`px-4 py-2 rounded-lg font-bold text-white transition-all duration-300 ${reportType === 'student' ? 'bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg' : 'bg-gray-500/80 backdrop-blur-sm hover:bg-gray-600/80'}`}
                onClick={() => setReportType('student')}
              >
                <span className="mr-2">👤</span>
                <span>Student Reports</span>
              </button>
              <button
                className={`px-4 py-2 rounded-lg font-bold text-white transition-all duration-300 ${reportType === 'subject' ? 'bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg' : 'bg-gray-500/80 backdrop-blur-sm hover:bg-gray-600/80'}`}
                onClick={() => setReportType('subject')}
              >
                <span className="mr-2">📚</span>
                <span>Subject Reports</span>
              </button>
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={timeFrame}
              onChange={(e) => setTimeFrame(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 font-medium"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
            
            <button className="px-4 py-2 bg-white/70 backdrop-blur-sm text-gray-800 rounded-lg text-sm font-bold hover:bg-white/90 transition-colors flex items-center gap-2 border border-gray-200 shadow-sm">
              <span>📥</span>
              <span>Export Report</span>
            </button>
          </div>
        </motion.div>

        {/* Performance Chart */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Performance Trends</h2>
            <div className="h-80">
              <PerformanceChart 
                data={
                  reportType === 'class' 
                    ? reportData.classScores?.map(item => ({ 
                        name: item.className, 
                        score: item.avgScore,
                        activities: item.activities,
                        improvement: parseFloat(item.improvement) 
                      }))
                    : reportType === 'student'
                      ? [...(reportData.topPerformers || []), ...(reportData.strugglingStudents || [])].slice(0, 10).map(item => ({
                          name: item.name,
                          score: item.avgScore,
                          activities: item.activities,
                          improvement: parseFloat(item.improvement)
                        }))
                      : reportData.subjectPerformance?.map(item => ({
                          name: item.subject,
                          score: item.avgScore,
                          activities: item.activities,
                          improvement: parseFloat(item.improvement)
                        }))
                } 
              />
            </div>
          </div>
        </motion.div>

        {/* Class Performance Section - Matching UI screenshot */}
        {reportType === 'class' && (
          <motion.div variants={itemVariants} className="mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Class Performance</h2>
              
              {/* Search bar */}
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full max-w-md px-4 py-2 rounded-md border border-gray-300 bg-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                />
              </div>
              
              {/* Table styled to match UI */}
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white/10 rounded-lg">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-6 py-3 text-left">
                        <div className="flex items-center">
                          <span className="text-sm font-bold text-indigo-700">Class</span>
                          <button className="ml-1 text-indigo-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left">
                        <div className="flex items-center">
                          <span className="text-sm font-bold text-indigo-700">Students</span>
                          <button className="ml-1 text-indigo-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left">
                        <div className="flex items-center">
                          <span className="text-sm font-bold text-indigo-700">Average Score</span>
                          <button className="ml-1 text-indigo-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left">
                        <div className="flex items-center">
                          <span className="text-sm font-bold text-indigo-700">Improvement</span>
                          <button className="ml-1 text-indigo-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left">
                        <div className="flex items-center">
                          <span className="text-sm font-bold text-indigo-700">Activities</span>
                          <button className="ml-1 text-indigo-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left">
                        <div className="flex items-center">
                          <span className="text-sm font-bold text-indigo-700">Actions</span>
                          <button className="ml-1 text-indigo-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {reportData.classScores?.map((item, index) => (
                      <tr key={index} className="hover:bg-indigo-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-lg mr-2">
                              {item.className === '10-A' && '📝'}
                              {item.className === '10-B' && '📚'}
                              {item.className === '9-A' && '🎓'}
                              {item.className === '9-B' && '📒'}
                              {item.className === '8-A' && '📘'}
                              {item.className === '8-B' && '📗'}
                              {item.className === '7-A' && '📙'}
                              {item.className === '7-B' && '📕'}
                            </div>
                            <span className="font-semibold text-indigo-700">{item.className}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                          {item.students}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`font-bold ${
                            item.avgScore >= 80 ? 'text-indigo-700' : 
                            item.avgScore >= 75 ? 'text-purple-700' : 'text-pink-700'
                          }`}>
                            {item.avgScore.toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-indigo-600 font-bold">
                          {item.improvement}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                          {item.activities}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button 
                            className="px-3 py-1 text-sm font-bold bg-indigo-100 text-indigo-800 rounded-md hover:bg-indigo-200 transition-colors"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleViewClassDetails(item);
                            }}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Subject Breakdown by Class */}
        {reportType === 'class' && (
          <motion.div variants={itemVariants} className="mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Subject Breakdown by Class</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white/10 rounded-lg">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-sm font-bold text-indigo-700">Subject</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-indigo-700">10-A</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-indigo-700">10-B</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-indigo-700">9-A</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-indigo-700">9-B</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-indigo-700">8-A</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-indigo-700">8-B</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-indigo-700">7-A</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-indigo-700">7-B</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {reportData.detailedPerformance?.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white/5' : 'bg-white/10'}>
                        <td className="px-4 py-3 font-bold text-gray-900">{item.className}</td>
                        <td className="px-4 py-3"><span className={getScoreColor(item.math)}>{item.math}%</span></td>
                        <td className="px-4 py-3"><span className={getScoreColor(item.science)}>{item.science}%</span></td>
                        <td className="px-4 py-3"><span className={getScoreColor(item.english)}>{item.english}%</span></td>
                        <td className="px-4 py-3"><span className={getScoreColor(item.social)}>{item.social}%</span></td>
                        <td className="px-4 py-3"><span className={getScoreColor(item.computer)}>{item.computer}%</span></td>
                        <td className="px-4 py-3"><span className={getScoreColor(item.math)}>{item.math}%</span></td>
                        <td className="px-4 py-3"><span className={getScoreColor(item.science)}>{item.science}%</span></td>
                        <td className="px-4 py-3"><span className={getScoreColor(item.english)}>{item.english}%</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Additional Quick Stats Section - Improved text contrast */}
        <motion.div variants={itemVariants} className="bg-white/40 backdrop-blur-lg rounded-xl p-5 shadow-lg mb-8 transition hover:shadow-xl duration-300">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">📊</span>
            <h2 className="text-xl font-bold text-gray-900">Quick Statistics</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 {/* Continuing from the Quick Stats Section */}
        gap-4">
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-indigo-700 mb-1">
                {reportType === 'class' ? reportData.classScores?.length || 0 : 
                 reportType === 'student' ? (reportData.topPerformers?.length + reportData.strugglingStudents?.length) || 0 :
                 reportData.subjectPerformance?.length || 0}
              </div>
              <div className="text-sm text-gray-800 font-semibold">
                {reportType === 'class' ? 'Classes Analyzed' : 
                 reportType === 'student' ? 'Students Tracked' : 
                 'Subjects Covered'}
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-700 mb-1">
                {reportType === 'class' ? Math.round(reportData.summary?.avgScore || 0) :
                 reportType === 'student' ? Math.round(reportData.summary?.completionRate || 0) :
                 Math.round(reportData.subjectPerformance?.reduce((sum, s) => sum + s.avgScore, 0) / (reportData.subjectPerformance?.length || 1) || 0)}%
              </div>
              <div className="text-sm text-gray-800 font-semibold">
                {reportType === 'class' ? 'Overall Average' :
                 reportType === 'student' ? 'Completion Rate' :
                 'Average Performance'}
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-pink-700 mb-1">
                {reportType === 'class' ? `${reportData.summary?.improvementRate || 0}%` :
                 reportType === 'student' ? reportData.summary?.avgTimeSpent || '0 min' :
                 `${reportData.summary?.mostImproved || 'N/A'}`}
              </div>
              <div className="text-sm text-gray-800 font-semibold">
                {reportType === 'class' ? 'Improvement Rate' :
                 reportType === 'student' ? 'Avg Time Spent' :
                 'Most Improved'}
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-indigo-700 mb-1">
                {reportType === 'class' ? `${reportData.summary?.completionRate || 0}%` :
                 reportType === 'student' ? reportData.summary?.needsAttention || 0 :
                 reportData.summary?.totalSubjects || 0}
              </div>
              <div className="text-sm text-gray-800 font-semibold">
                {reportType === 'class' ? 'Completion Rate' :
                 reportType === 'student' ? 'Need Attention' :
                 'Total Subjects'}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Student Performance Sections */}
        {reportType === 'student' && (
          <>
            {/* Top Performers */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span>🏆</span>
                  Top Performers
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white/10 rounded-lg">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-6 py-3 text-left text-sm font-bold text-indigo-700">Student</th>
                        <th className="px-6 py-3 text-left text-sm font-bold text-indigo-700">Class</th>
                        <th className="px-6 py-3 text-left text-sm font-bold text-indigo-700">Average Score</th>
                        <th className="px-6 py-3 text-left text-sm font-bold text-indigo-700">Improvement</th>
                        <th className="px-6 py-3 text-left text-sm font-bold text-indigo-700">Activities</th>
                        <th className="px-6 py-3 text-left text-sm font-bold text-indigo-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {reportData.topPerformers?.map((student, index) => (
                        <tr key={student.id} className="hover:bg-indigo-50/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="text-lg mr-2">
                                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '⭐'}
                              </div>
                              <span className="font-semibold text-gray-900">{student.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-indigo-600 font-medium">
                            {student.class}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-bold text-indigo-700">{student.avgScore.toFixed(1)}%</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-green-600 font-bold">
                            {student.improvement}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                            {student.activities}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button 
                              className="px-3 py-1 text-sm font-bold bg-indigo-100 text-indigo-800 rounded-md hover:bg-indigo-200 transition-colors"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleViewStudentProfile(student);
                              }}
                            >
                              View Profile
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>

            {/* Struggling Students */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span>📢</span>
                  Students Needing Support
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white/10 rounded-lg">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-6 py-3 text-left text-sm font-bold text-indigo-700">Student</th>
                        <th className="px-6 py-3 text-left text-sm font-bold text-indigo-700">Class</th>
                        <th className="px-6 py-3 text-left text-sm font-bold text-indigo-700">Average Score</th>
                        <th className="px-6 py-3 text-left text-sm font-bold text-indigo-700">Improvement</th>
                        <th className="px-6 py-3 text-left text-sm font-bold text-indigo-700">Activities</th>
                        <th className="px-6 py-3 text-left text-sm font-bold text-indigo-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {reportData.strugglingStudents?.map((student) => (
                        <tr key={student.id} className="hover:bg-red-50/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="text-lg mr-2">⚠️</div>
                              <span className="font-semibold text-gray-900">{student.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-indigo-600 font-medium">
                            {student.class}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-bold text-red-600">{student.avgScore.toFixed(1)}%</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`font-bold ${student.improvement.startsWith('-') ? 'text-red-600' : 'text-green-600'}`}>
                              {student.improvement}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                            {student.activities}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button 
                              className="px-3 py-1 text-sm font-bold bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleCreateSupportPlan(student);
                              }}
                            >
                              Support Plan
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {/* Subject Performance Sections */}
        {reportType === 'subject' && (
          <>
            {/* Subject Overview */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span>📊</span>
                  Subject Performance Overview
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white/10 rounded-lg">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-6 py-3 text-left text-sm font-bold text-indigo-700">Subject</th>
                        <th className="px-6 py-3 text-left text-sm font-bold text-indigo-700">Average Score</th>
                        <th className="px-6 py-3 text-left text-sm font-bold text-indigo-700">Activities</th>
                        <th className="px-6 py-3 text-left text-sm font-bold text-indigo-700">Improvement</th>
                        <th className="px-6 py-3 text-left text-sm font-bold text-indigo-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {reportData.subjectPerformance?.map((subject, index) => (
                        <tr key={index} className="hover:bg-indigo-50/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="text-lg mr-2">
                                {subject.subject === 'Mathematics' && '🔢'}
                                {subject.subject === 'Science' && '🔬'}
                                {subject.subject === 'English' && '📝'}
                                {subject.subject === 'Social Studies' && '🌍'}
                                {subject.subject === 'Computer Science' && '💻'}
                                {subject.subject === 'Physics' && '⚡'}
                                {subject.subject === 'Chemistry' && '🧪'}
                                {subject.subject === 'Biology' && '🧬'}
                              </div>
                              <span className="font-semibold text-gray-900">{subject.subject}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={getScoreColor(subject.avgScore)}>{subject.avgScore.toFixed(1)}%</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                            {subject.activities}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-green-600 font-bold">
                            {subject.improvement}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button 
                              className="px-3 py-1 text-sm font-bold bg-indigo-100 text-indigo-800 rounded-md hover:bg-indigo-200 transition-colors"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleAnalyzeSubject(subject);
                              }}
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
            </motion.div>

            {/* Detailed Subject Scores by Class */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Detailed Subject Performance by Class</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white/10 rounded-lg">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-4 py-3 text-left text-sm font-bold text-indigo-700">Subject</th>
                        <th className="px-4 py-3 text-left text-sm font-bold text-indigo-700">10-A</th>
                        <th className="px-4 py-3 text-left text-sm font-bold text-indigo-700">10-B</th>
                        <th className="px-4 py-3 text-left text-sm font-bold text-indigo-700">9-A</th>
                        <th className="px-4 py-3 text-left text-sm font-bold text-indigo-700">9-B</th>
                        <th className="px-4 py-3 text-left text-sm font-bold text-indigo-700">8-A</th>
                        <th className="px-4 py-3 text-left text-sm font-bold text-indigo-700">8-B</th>
                        <th className="px-4 py-3 text-left text-sm font-bold text-indigo-700">7-A</th>
                        <th className="px-4 py-3 text-left text-sm font-bold text-indigo-700">7-B</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {reportData.detailedScores?.map((item, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white/5' : 'bg-white/10'}>
                          <td className="px-4 py-3 font-bold text-gray-900 flex items-center">
                            <div className="text-lg mr-2">
                              {item.subject === 'Mathematics' && '🔢'}
                              {item.subject === 'Science' && '🔬'}
                              {item.subject === 'English' && '📝'}
                              {item.subject === 'Social Studies' && '🌍'}
                              {item.subject === 'Computer Science' && '💻'}
                            </div>
                            {item.subject}
                          </td>
                          <td className="px-4 py-3"><span className={getScoreColor(item['10-A'])}>{item['10-A']}%</span></td>
                          <td className="px-4 py-3"><span className={getScoreColor(item['10-B'])}>{item['10-B']}%</span></td>
                          <td className="px-4 py-3"><span className={getScoreColor(item['9-A'])}>{item['9-A']}%</span></td>
                          <td className="px-4 py-3"><span className={getScoreColor(item['9-B'])}>{item['9-B']}%</span></td>
                          <td className="px-4 py-3"><span className={getScoreColor(item['8-A'])}>{item['8-A']}%</span></td>
                          <td className="px-4 py-3"><span className={getScoreColor(item['8-B'])}>{item['8-B']}%</span></td>
                          <td className="px-4 py-3"><span className={getScoreColor(item['7-A'])}>{item['7-A']}%</span></td>
                          <td className="px-4 py-3"><span className={getScoreColor(item['7-B'])}>{item['7-B']}%</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {/* Footer Summary */}
        <motion.div variants={itemVariants} className="bg-gradient-to-r from-indigo-50/80 to-pink-50/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Report Generated</h3>
            <p className="text-gray-800 font-medium">
              Last updated: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
            </p>
            <p className="text-sm text-gray-700 mt-2">
              Data reflects performance for the selected {timeFrame} period
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* MODAL COMPONENTS */}
      
      {/* Class Details Modal */}
      {showClassDetailsModal && selectedClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <span className="text-3xl">📝</span>
                  Class {selectedClass.className} - Detailed Report
                </h2>
                <button 
                  onClick={closeAllModals}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-indigo-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-indigo-700">{selectedClass.students}</div>
                  <div className="text-sm text-gray-600">Total Students</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-700">{selectedClass.avgScore.toFixed(1)}%</div>
                  <div className="text-sm text-gray-600">Average Score</div>
                </div>
                <div className="bg-pink-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-pink-700">{selectedClass.improvement}</div>
                  <div className="text-sm text-gray-600">Improvement</div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Subject Performance Breakdown</h3>
                <div className="space-y-3">
                  {reportData.detailedPerformance?.find(item => item.className === selectedClass.className) && (
                    <>
                      {Object.entries(reportData.detailedPerformance.find(item => item.className === selectedClass.className)).map(([subject, score]) => (
                        subject !== 'className' && (
                          <div key={subject} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium capitalize">{subject}</span>
                            <div className="flex items-center gap-3">
                              <div className="w-32 bg-gray-200 rounded-full h-3">
                                <div 
                                  className="bg-indigo-500 h-3 rounded-full transition-all duration-500"
                                  style={{ width: `${score}%` }}
                                ></div>
                              </div>
                              <span className={`font-bold ${getScoreColor(score)}`}>{score}%</span>
                            </div>
                          </div>
                        )
                      ))}
                    </>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Insights</h3>
                <div className="bg-blue-50 rounded-lg p-4">
                  <ul className="space-y-2 text-sm">
                    <li>• Class performance is {selectedClass.avgScore >= 80 ? 'excellent' : selectedClass.avgScore >= 75 ? 'good' : 'needs improvement'}</li>
                    <li>• Students are showing {selectedClass.improvement.startsWith('+') ? 'positive' : 'concerning'} improvement trends</li>
                    <li>• Recommended action: {selectedClass.avgScore < 75 ? 'Focus on additional support and practice sessions' : 'Continue current teaching methods and consider advanced challenges'}</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4 justify-end">
                <button 
                  onClick={closeAllModals}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Close
                </button>
                <button className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors">
                  Generate Full Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Student Profile Modal */}
      {showStudentProfileModal && selectedStudentProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <span className="text-3xl">👤</span>
                  {selectedStudentProfile.name} - Student Profile
                </h2>
                <button 
                  onClick={closeAllModals}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-indigo-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-indigo-700">{selectedStudentProfile.class}</div>
                  <div className="text-sm text-gray-600">Class</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-700">{selectedStudentProfile.avgScore.toFixed(1)}%</div>
                  <div className="text-sm text-gray-600">Average Score</div>
                </div>
                <div className="bg-pink-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-pink-700">{selectedStudentProfile.improvement}</div>
                  <div className="text-sm text-gray-600">Improvement</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-700">{selectedStudentProfile.activities}</div>
                  <div className="text-sm text-gray-600">Activities Completed</div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Summary</h3>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>{selectedStudentProfile.name}</strong> is performing exceptionally well with an average score of <strong>{selectedStudentProfile.avgScore.toFixed(1)}%</strong>.
                  </p>
                  <p className="text-sm text-gray-700 mb-2">
                    Recent improvement of <strong>{selectedStudentProfile.improvement}</strong> indicates strong engagement and understanding.
                  </p>
                  <p className="text-sm text-gray-700">
                    Completed <strong>{selectedStudentProfile.activities}</strong> activities, showing consistent participation.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 justify-end">
                <button 
                  onClick={closeAllModals}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Close
                </button>
                <button className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors">
                  Contact Parent
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Support Plan Modal */}
      {showSupportPlanModal && selectedSupportStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <span className="text-3xl">📢</span>
                  Support Plan for {selectedSupportStudent.name}
                </h2>
                <button 
                  onClick={closeAllModals}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-700">{selectedSupportStudent.avgScore.toFixed(1)}%</div>
                  <div className="text-sm text-gray-600">Current Average</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-orange-700">{selectedSupportStudent.improvement}</div>
                  <div className="text-sm text-gray-600">Recent Trend</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-700">{selectedSupportStudent.activities}</div>
                  <div className="text-sm text-gray-600">Activities Completed</div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Intervention Plan</h3>
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-bold text-blue-800 mb-2">Immediate Actions</h4>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-sm">Schedule one-on-one tutoring sessions</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-sm">Provide additional practice materials</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-sm">Contact parents/guardians</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-bold text-green-800 mb-2">Long-term Support</h4>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-sm">Adjust learning pace and materials</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-sm">Implement peer support system</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-sm">Regular progress monitoring</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Recommended Resources</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-bold text-gray-800 mb-2">📚 Study Materials</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Foundational math worksheets</li>
                      <li>• Interactive learning apps</li>
                      <li>• Visual learning aids</li>
                    </ul>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-bold text-gray-800 mb-2">👥 Support Network</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Assign study buddy</li>
                      <li>• Connect with counselor</li>
                      <li>• Parent involvement plan</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Notes & Comments</h3>
                <textarea 
                  className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows="4"
                  placeholder="Add specific observations, concerns, or additional notes about the student..."
                ></textarea>
              </div>

              <div className="flex gap-4 justify-end">
                <button 
                  onClick={closeAllModals}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                  Save Support Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subject Analysis Modal */}
      {showSubjectAnalysisModal && selectedSubjectAnalysis && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <span className="text-3xl">
                    {selectedSubjectAnalysis.subject === 'Mathematics' && '🔢'}
                    {selectedSubjectAnalysis.subject === 'Science' && '🔬'}
                    {selectedSubjectAnalysis.subject === 'English' && '📝'}
                    {selectedSubjectAnalysis.subject === 'Social Studies' && '🌍'}
                    {selectedSubjectAnalysis.subject === 'Computer Science' && '💻'}
                    {selectedSubjectAnalysis.subject === 'Physics' && '⚡'}
                    {selectedSubjectAnalysis.subject === 'Chemistry' && '🧪'}
                    {selectedSubjectAnalysis.subject === 'Biology' && '🧬'}
                  </span>
                  {selectedSubjectAnalysis.subject} - Detailed Analysis
                </h2>
                <button 
                  onClick={closeAllModals}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-indigo-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-indigo-700">{selectedSubjectAnalysis.avgScore.toFixed(1)}%</div>
                  <div className="text-sm text-gray-600">Average Score</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-700">{selectedSubjectAnalysis.activities}</div>
                  <div className="text-sm text-gray-600">Total Activities</div>
                </div>
                <div className="bg-pink-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-pink-700">{selectedSubjectAnalysis.improvement}</div>
                  <div className="text-sm text-gray-600">Improvement</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-700">
                    {selectedSubjectAnalysis.avgScore >= 80 ? 'A' : 
                     selectedSubjectAnalysis.avgScore >= 70 ? 'B' : 
                     selectedSubjectAnalysis.avgScore >= 60 ? 'C' : 'D'}
                  </div>
                  <div className="text-sm text-gray-600">Grade Level</div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Performance by Class</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {reportData.detailedScores?.find(item => item.subject === selectedSubjectAnalysis.subject) && (
                    Object.entries(reportData.detailedScores.find(item => item.subject === selectedSubjectAnalysis.subject))
                      .filter(([key]) => key !== 'subject')
                      .map(([className, score]) => (
                        <div key={className} className="bg-gray-50 rounded-lg p-3 text-center">
                          <div className={`text-lg font-bold ${getScoreColor(score)}`}>{score}%</div>
                          <div className="text-sm text-gray-600">{className}</div>
                        </div>
                      ))
                  )}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Subject Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-bold text-blue-800 mb-3">📈 Strengths</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Overall improvement trend is {selectedSubjectAnalysis.improvement.startsWith('+') ? 'positive' : 'concerning'}</li>
                      <li>• Performance level is {selectedSubjectAnalysis.avgScore >= 80 ? 'excellent' : selectedSubjectAnalysis.avgScore >= 70 ? 'good' : 'needs attention'}</li>
                      <li>• Student engagement is {selectedSubjectAnalysis.activities > 100 ? 'high' : 'moderate'}</li>
                    </ul>
                  </div>
                  
                  <div className="bg-orange-50 rounded-lg p-4">
                    <h4 className="font-bold text-orange-800 mb-3">🎯 Areas for Improvement</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Focus on classes with scores below 75%</li>
                      <li>• Increase interactive activities</li>
                      <li>• Provide additional practice materials</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Recommended Actions</h3>
                <div className="space-y-3">
                  <div className="border-l-4 border-indigo-500 bg-indigo-50 p-4">
                    <h4 className="font-bold text-indigo-800 mb-2">Immediate Actions</h4>
                    <p className="text-sm text-gray-700">
                      {selectedSubjectAnalysis.avgScore < 70 
                        ? "Review curriculum delivery methods and consider additional support resources."
                        : "Continue current teaching approaches while introducing more challenging material."}
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-green-500 bg-green-50 p-4">
                    <h4 className="font-bold text-green-800 mb-2">Long-term Strategy</h4>
                    <p className="text-sm text-gray-700">
                      Implement differentiated instruction based on class performance levels and increase collaborative learning opportunities.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Trend</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium">Overall Progress</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      selectedSubjectAnalysis.improvement.startsWith('+') 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedSubjectAnalysis.improvement}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-indigo-500 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${selectedSubjectAnalysis.avgScore}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-end">
                <button 
                  onClick={closeAllModals}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Close
                </button>
                <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  Create Action Plan
                </button>
                <button className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors">
                  Export Analysis
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS for aurora animation */}
      <style jsx>{`
        @keyframes auroraFlow {
          0%, 100% { background-position: 0% 50%; }
          25% { background-position: 100% 50%; }
          50% { background-position: 100% 100%; }
          75% { background-position: 0% 100%; }
        }
      `}</style>
    </div>
  );
};

export default Reports;