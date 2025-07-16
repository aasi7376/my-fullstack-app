// src/components/DashboardRouter.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Simple placeholder dashboard components
const AdminDashboard = () => (
  <div style={{ padding: '20px', color: 'white' }}>
    <h1>System Admin Dashboard</h1>
    <p>Welcome to the admin dashboard. You have full system access.</p>
  </div>
);

const SchoolDashboard = () => (
  <div style={{ padding: '20px', color: 'white' }}>
    <h1>School Admin Dashboard</h1>
    <p>Welcome to the school dashboard. Manage your institution here.</p>
  </div>
);

const TeacherDashboard = () => (
  <div style={{ padding: '20px', color: 'white' }}>
    <h1>Teacher Dashboard</h1>
    <p>Welcome to the teacher dashboard. Manage your classes and assignments here.</p>
  </div>
);

const StudentDashboard = () => (
  <div style={{ padding: '20px', color: 'white' }}>
    <h1>Student Dashboard</h1>
    <p>Welcome to the student dashboard. Access your learning materials and games here.</p>
  </div>
);

// Default dashboard shows basic info and redirects based on role
const DefaultDashboard = () => {
  const { currentUser, getDashboardRoute } = useAuth();
  
  if (currentUser && currentUser.role) {
    return <Navigate to={getDashboardRoute(currentUser.role)} replace />;
  }
  
  return (
    <div style={{ padding: '20px', color: 'white' }}>
      <h1>Dashboard</h1>
      <p>Please select a role-specific dashboard.</p>
    </div>
  );
};

const DashboardRouter = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
    }}>
      <Routes>
        <Route path="/" element={<DefaultDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/school" element={<SchoolDashboard />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
};

export default DashboardRouter;