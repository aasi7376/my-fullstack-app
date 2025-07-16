// src/pages/SchoolDashboard.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import EnhancedSidebar from '../components/common/Sidebar';
import PerformanceChart from '../components/charts/PerformanceChart';
import TeacherManagement from '../components/school/TeacherManagement';
import StudentAnalytics from '../components/school/StudentAnalytics';
import ClassManagement from '../components/school/ClassManagement';
import SchoolSettings from '../components/school/SchoolSettings';
import CyberpunkBackground from '../components/common/CyberpunkBackground';
import LogoutButton from '../components/common/LogoutButton';
import ProfileModal from '../components/ProfileModal';
// Import CSS
import '../styles/SchoolDashboard.css';
import '../styles/CyberpunkTheme.css';
import '../styles/CyberpunkPurple.css';
import '../styles/CyberpunkUtilityEffects.css'
import '../styles/CyberpunkAnimation.css'
import '../styles/CyberpunkBackgroundEffects.css';
import '../styles/LogoutButton.css';

// =================== TEACHER ASSIGNMENT COMPONENT ===================
const TeacherAssignment = () => {
  const [assignment, setAssignment] = useState({
    teacherId: '',
    teacherName: '',
    subject: '',
    class: '',
    section: ''
  });

  const [assignments, setAssignments] = useState([
    { id: 1, teacherName: 'Ms. Sarah Connor', subject: 'Mathematics', class: '10th', section: 'A' },
    { id: 2, teacherName: 'Mr. John Smith', subject: 'Physics', class: '9th', section: 'B' },
    { id: 3, teacherName: 'Ms. Emily Davis', subject: 'Chemistry', class: '11th', section: 'C' }
  ]);

  const teachers = ['Ms. Sarah Connor', 'Mr. John Smith', 'Ms. Emily Davis', 'Mr. Robert Brown'];
  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi'];
  const classes = ['6th', '7th', '8th', '9th', '10th', '11th', '12th'];
  const sections = ['A', 'B', 'C'];

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAssignment = {
      id: assignments.length + 1,
      ...assignment
    };
    setAssignments([...assignments, newAssignment]);
    setAssignment({ teacherId: '', teacherName: '', subject: '', class: '', section: '' });
    alert('Teacher assigned successfully!');
  };

  const handleDelete = (id) => {
    setAssignments(assignments.filter(assign => assign.id !== id));
    alert('Assignment deleted successfully!');
  };

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.02)',
      borderRadius: '12px',
      padding: '2rem',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      color: 'white'
    }}>
      <h2 style={{ color: '#3b82f6', marginBottom: '2rem', textAlign: 'center' }}>
        📋 Teacher Assignment
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Assignment Form */}
        <div>
          <h3 style={{ marginBottom: '1rem' }}>New Assignment</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <select
              value={assignment.teacherName}
              onChange={(e) => setAssignment({...assignment, teacherName: e.target.value})}
              required
              style={{
                padding: '0.8rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white'
              }}
            >
              <option value="">Select Teacher</option>
              {teachers.map(teacher => (
                <option key={teacher} value={teacher} style={{ background: '#1e293b' }}>
                  {teacher}
                </option>
              ))}
            </select>

            <select
              value={assignment.subject}
              onChange={(e) => setAssignment({...assignment, subject: e.target.value})}
              required
              style={{
                padding: '0.8rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white'
              }}
            >
              <option value="">Select Subject</option>
              {subjects.map(subject => (
                <option key={subject} value={subject} style={{ background: '#1e293b' }}>
                  {subject}
                </option>
              ))}
            </select>

            <select
              value={assignment.class}
              onChange={(e) => setAssignment({...assignment, class: e.target.value})}
              required
              style={{
                padding: '0.8rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white'
              }}
            >
              <option value="">Select Class</option>
              {classes.map(cls => (
                <option key={cls} value={cls} style={{ background: '#1e293b' }}>
                  {cls}
                </option>
              ))}
            </select>

            <select
              value={assignment.section}
              onChange={(e) => setAssignment({...assignment, section: e.target.value})}
              required
              style={{
                padding: '0.8rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white'
              }}
            >
              <option value="">Select Section</option>
              {sections.map(section => (
                <option key={section} value={section} style={{ background: '#1e293b' }}>
                  Section {section}
                </option>
              ))}
            </select>

            <button
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                color: 'white',
                border: 'none',
                padding: '1rem',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Assign Teacher
            </button>
          </form>
        </div>

        {/* Current Assignments */}
        <div>
          <h3 style={{ marginBottom: '1rem' }}>Current Assignments</h3>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {assignments.map(assign => (
              <div
                key={assign.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '1rem',
                  borderRadius: '8px',
                  marginBottom: '0.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: 'bold', color: '#3b82f6' }}>
                    {assign.teacherName}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                    {assign.subject} - {assign.class} {assign.section}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(assign.id)}
                  style={{
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// =================== MAIN SCHOOL DASHBOARD COMPONENT ===================
const SchoolDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [isSidebarCollapsed] = useState(false);
  
  const getCurrentTab = () => {
    const path = location.pathname;
    if (path.includes('/teachers') && !path.includes('/teacher-')) return 'teachers';
    if (path.includes('/teacher-assignment')) return 'teacher-assignment';
    if (path.includes('/students')) return 'students';
    if (path.includes('/classes')) return 'classes';
    if (path.includes('/settings')) return 'settings';
    return 'overview';
  };
  
  const [activeTab, setActiveTab] = useState(getCurrentTab());
  
  useEffect(() => {
    setActiveTab(getCurrentTab());
  }, [location]);
  
  const [stats] = useState({
    totalTeachers: 45,
    totalStudents: 1240,
    totalClasses: 32,
    averageScore: 78.5,
    gamesPlayed: 5680,
    activeToday: 456
  });

  const [topPerformers] = useState([
    { id: 1, name: 'Alice Johnson', class: '10th A', score: 95, games: 12 },
    { id: 2, name: 'Bob Smith', class: '9th B', score: 92, games: 15 },
    { id: 3, name: 'Carol Davis', class: '10th C', score: 89, games: 10 },
    { id: 4, name: 'David Wilson', class: '8th A', score: 87, games: 18 },
    { id: 5, name: 'Emma Brown', class: '9th A', score: 85, games: 14 }
  ]);

  const [recentActivities] = useState([
    {
      id: 1,
      type: 'teacher_registered',
      title: 'New Teacher Registered',
      description: 'Ms. Sarah Connor joined Mathematics department',
      time: '1 hour ago',
      icon: '👨‍🏫'
    },
    {
      id: 2,
      type: 'class_completed',
      title: 'Class Activity Completed',
      description: '10th A completed Algebra Quest with 85% average',
      time: '3 hours ago',
      icon: '🎯'
    },
    {
      id: 3,
      type: 'achievement',
      title: 'Achievement Unlocked',
      description: 'School reached 1000+ completed games milestone',
      time: '1 day ago',
      icon: '🏆'
    }
  ]);

  // UPDATED SIDEBAR - REMOVED UNWANTED ITEMS
  const sidebarItems = [
    { id: 'overview', label: 'School Overview', icon: '🏫', path: '/school' },
    { id: 'teachers', label: 'Teacher Management', icon: '👨‍🏫', path: '/school/teachers' },
    { id: 'teacher-assignment', label: 'Assign Teachers', icon: '📋', path: '/school/teacher-assignment' },
    { id: 'students', label: 'Student Analytics', icon: '👨‍🎓', path: '/school/students' },
    { id: 'classes', label: 'Class Management', icon: '🏛️', path: '/school/classes' },
    { id: 'settings', label: 'School Settings', icon: '⚙️', path: '/school/settings' }
  ];
  
  // FIXED HANDLER - DIRECT NAVIGATION
  const handleSidebarItemClick = (itemId) => {
    setActiveTab(itemId);
    const item = sidebarItems.find(item => item.id === itemId);
    if (item && item.path) {
      navigate(item.path);
    }
  };

 // Modified renderOverview function with simplified UI
const renderOverview = () => (
  <div style={{
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    padding: '2rem',
    color: 'white'
  }}>
    {/* Clean Header */}
    <div style={{
      marginBottom: '3rem',
      textAlign: 'center'
    }}>
      <h1 style={{
        fontSize: '2.5rem',
        fontWeight: '700',
        color: 'white',
        marginBottom: '0.5rem'
      }}>
        {user?.schoolName || 'School Management Dashboard'}
      </h1>
      <p style={{
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: '1.1rem'
      }}>
        Comprehensive school administration and analytics platform
      </p>
    </div>

    {/* Clean Stats Grid */}
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1.5rem',
      marginBottom: '3rem'
    }}>
      {[
        { title: 'Teachers', value: stats.totalTeachers, icon: '👨‍🏫', color: '#3b82f6' },
        { title: 'Students', value: stats.totalStudents.toLocaleString(), icon: '👨‍🎓', color: '#10b981' },
        { title: 'Classes', value: stats.totalClasses, icon: '🏛️', color: '#f59e0b' },
        { title: 'Avg Score', value: `${stats.averageScore}%`, icon: '📊', color: '#ef4444' },
        { title: 'Games Played', value: stats.gamesPlayed.toLocaleString(), icon: '🎮', color: '#8b5cf6' },
        { title: 'Active Today', value: stats.activeToday, icon: '🟢', color: '#06b6d4' }
      ].map((stat, index) => (
        <motion.div
          key={index}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center'
          }}
          whileHover={{
            scale: 1.02,
            background: 'rgba(255, 255, 255, 0.08)'
          }}
        >
          <div style={{
            fontSize: '2rem',
            marginBottom: '0.5rem'
          }}>
            {stat.icon}
          </div>
          <div style={{
            fontSize: '1.8rem',
            fontWeight: '600',
            color: stat.color,
            marginBottom: '0.25rem'
          }}>
            {stat.value}
          </div>
          <div style={{
            fontSize: '0.9rem',
            color: 'rgba(255, 255, 255, 0.7)'
          }}>
            {stat.title}
          </div>
        </motion.div>
      ))}
    </div>

    {/* School Functions Grid - UPDATED TO REMOVE UNWANTED ITEMS */}
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem',
      marginBottom: '3rem'
    }}>
      {[
        {
          title: 'Teacher Management',
          description: 'Register and assign teachers to classes and subjects',
          icon: '👨‍🏫',
          color: '#3b82f6',
          path: '/school/teachers'
        },
        {
          title: 'Teacher Assignment',
          description: 'Assign teachers to specific classes and subjects',
          icon: '📋',
          color: '#8b5cf6',
          path: '/school/teacher-assignment'
        },
        {
          title: 'Student Analytics',
          description: 'Comprehensive student data and progress tracking',
          icon: '👨‍🎓',
          color: '#f59e0b',
          path: '/school/students'
        },
        {
          title: 'Class Management',
          description: 'Manage classes, schedules, and assignments',
          icon: '🏛️',
          color: '#06b6d4',
          path: '/school/classes'
        }
      ].map((func, index) => (
        <motion.div
          key={index}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            cursor: 'pointer'
          }}
          whileHover={{
            scale: 1.02,
            background: 'rgba(255, 255, 255, 0.08)',
            borderColor: func.color
          }}
          onClick={() => navigate(func.path)}
        >
          <div style={{
            fontSize: '3rem',
            marginBottom: '1rem'
          }}>
            {func.icon}
          </div>
          <h3 style={{
            fontSize: '1.3rem',
            fontWeight: '600',
            color: func.color,
            marginBottom: '0.5rem'
          }}>
            {func.title}
          </h3>
          <p style={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '0.95rem',
            lineHeight: '1.5'
          }}>
            {func.description}
          </p>
        </motion.div>
      ))}
    </div>
  
    <button
      onClick={() => setProfileModalOpen(true)}
      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/30 
                transition-all duration-300 flex items-center gap-2 group"
    >
      <div className="w-8 h-8 rounded-full overflow-hidden bg-white/10 border border-white/30 group-hover:border-white/50 transition-all duration-300">
        {user?.profilePictureUrl ? (
          <img 
            src={user.profilePictureUrl} 
            alt={user.name} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-sm font-medium text-white">
              {user?.name?.charAt(0)?.toUpperCase() || "S"}
            </span>
          </div>
        )}
      </div>
      <span>View Profile</span>
      <span className="text-white/50 group-hover:text-white transition-colors duration-300">👤</span>
    </button>
    
    {/* Performance Chart */}
    <div style={{
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '12px',
      padding: '2rem',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      marginBottom: '3rem',
      marginTop: '2rem'
    }}>
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '600',
        marginBottom: '1.5rem',
        color: 'white'
      }}>
        📈 School Performance Overview
      </h2>
      <div style={{ height: '300px' }}>
        <PerformanceChart />
      </div>
    </div>
  </div>
);

return (
  <div className={`school-dashboard-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
    <CyberpunkBackground />
    
    <EnhancedSidebar 
      items={sidebarItems}
      onItemClick={handleSidebarItemClick}
      collapsed={isSidebarCollapsed}
      activeTab={activeTab}
    />
    
    <ProfileModal
      isOpen={profileModalOpen}
      onClose={() => setProfileModalOpen(false)}
    />
    
    <div className="school-content">
      <Routes>
        <Route path="/" element={renderOverview()} />
        <Route path="/teachers" element={<TeacherManagement />} />
        <Route path="/teacher-assignment" element={<TeacherAssignment />} />
        <Route path="/students" element={<StudentAnalytics />} />
        <Route path="/classes" element={<ClassManagement />} />
        <Route path="/settings" element={<SchoolSettings />} />
      </Routes>
    </div>
    
    <LogoutButton />
  </div>
);
};

export default SchoolDashboard;