// src/components/school/TeacherManagement.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import newTeacherService from '../../services/newTeacherService';

const TeacherManagement = () => {
  // Auth context for user info and token
  const { user, token } = useAuth();
  
  // Component state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  
  // New teacher form state
  const [teacher, setTeacher] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    qualification: '',
    experience: ''
  });

  // List of teachers - initialize as empty array
  const [teachers, setTeachers] = useState([]);

  // Available subjects
  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'History', 'Geography', 'Computer Science'];

  // Fetch teachers on component mount
  useEffect(() => {
    fetchTeachers();
    // Log auth info for debugging
    console.log('Auth user:', user);
    console.log('Auth token exists:', !!token);
  }, []);

  // Debugging function
  const runDebug = async () => {
    setDebugInfo('Running diagnostic tests...');
    try {
      // Test auth
      const authTest = !!token ? 'Token exists' : 'No token found!';
      
      // Test user role
      const roleTest = user?.role === 'school' ? 'User has school role' : `User role is ${user?.role || 'undefined'} (should be 'school')`;
      
      // Test API connectivity using service
      let apiTest = 'Testing API via service...';
      try {
        const response = await newTeacherService.getAllTeachers();
        apiTest = `Service call responded with success: ${response.success}`;
        apiTest += ` and data: ${JSON.stringify(response)}`;
      } catch (apiError) {
        apiTest += ` ERROR: ${apiError.message}`;
        
        // Try direct fetch as fallback
        try {
          apiTest += ' | Falling back to direct fetch...';
          const directResponse = await fetch('/api/newteacher', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const directData = await directResponse.json();
          apiTest += ` Direct fetch response: ${JSON.stringify(directData)}`;
        } catch (directError) {
          apiTest += ` Direct fetch also failed: ${directError.message}`;
        }
      }
      
      // Check database connection with a test save
      let dbTest = 'Testing DB with a direct save...';
      try {
        // Create a test teacher with unique email
        const testTeacher = {
          name: 'Debug Test Teacher',
          email: `test${Date.now()}@debug.com`,
          phone: '9876543210',
          subject: 'Mathematics',
          qualification: 'Debug',
          experience: 1
        };
        
        const saveResponse = await newTeacherService.registerTeacher(testTeacher);
        dbTest += ` Save via service responded with success: ${saveResponse.success}`;
        dbTest += ` and data: ${JSON.stringify(saveResponse)}`;
      } catch (dbError) {
        dbTest += ` ERROR: ${dbError.message}`;
      }
      
      // Update debug info
      setDebugInfo(`
        DIAGNOSTIC RESULTS:
        
        AUTHENTICATION:
        ${authTest}
        
        AUTHORIZATION:
        ${roleTest}
        
        API CONNECTIVITY:
        ${apiTest}
        
        DATABASE:
        ${dbTest}
        
        USER INFO:
        ${JSON.stringify(user, null, 2)}
      `);
      
      // Refresh teachers list
      fetchTeachers();
    } catch (error) {
      setDebugInfo(`Debug error: ${error.message}`);
    }
  };

  // Fetch teachers from backend using service
  const fetchTeachers = async () => {
    setLoading(true);
    try {
      console.log('Fetching teachers via service...');
      
      const response = await newTeacherService.getAllTeachers();
      console.log('Service response:', response);
      
      if (response.success) {
        // Check if data exists and is an array
        if (response.data && Array.isArray(response.data)) {
          setTeachers(response.data);
          console.log('Teachers set to:', response.data);
        } else {
          console.warn('response.data is not an array:', response.data);
          setTeachers([]);
        }
      } else {
        console.warn('Service returned success: false', response);
        setTeachers([]);
        setError(response.message || 'Failed to fetch teachers');
      }
    } catch (err) {
      console.error('Error fetching teachers:', err);
      
      // Try direct fetch as fallback
      try {
        console.log('Falling back to direct fetch...');
        const directResponse = await fetch('/api/newteacher', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const directData = await directResponse.json();
        console.log('Direct fetch response:', directData);
        
        if (directData.success && directData.data && Array.isArray(directData.data)) {
          setTeachers(directData.data);
        } else {
          setTeachers([]);
        }
      } catch (directError) {
        console.error('Direct fetch also failed:', directError);
        setError('Failed to load teachers. Please try again.');
        setTeachers([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    setTeacher({
      ...teacher,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      console.log('Registering teacher with data:', teacher);
      
      const response = await newTeacherService.registerTeacher(teacher);
      console.log('Service register response:', response);
      
      if (response.success) {
        setSuccess('Teacher registered successfully!');
        
        // Reset form
        setTeacher({
          name: '',
          email: '',
          phone: '',
          subject: '',
          qualification: '',
          experience: ''
        });
        
        // Refresh teachers list
        fetchTeachers();
      } else {
        throw new Error(response.message || 'Failed to register teacher');
      }
    } catch (err) {
      console.error('Error registering teacher:', err);
      
      // Try direct API call as fallback
      try {
        console.log('Falling back to direct API call for registration...');
        const directResponse = await fetch('/api/newteacher', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(teacher)
        });
        
        const directData = await directResponse.json();
        console.log('Direct API call response:', directData);
        
        if (directData.success) {
          setSuccess('Teacher registered successfully!');
          
          // Reset form
          setTeacher({
            name: '',
            email: '',
            phone: '',
            subject: '',
            qualification: '',
            experience: ''
          });
          
          // Refresh teachers list
          fetchTeachers();
        } else {
          setError(directData.message || 'Failed to register teacher. Please try again.');
        }
      } catch (directErr) {
        console.error('Direct API call also failed:', directErr);
        setError(err.message || 'Failed to register teacher. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle teacher deletion
  const handleDelete = async (id) => {
    if (!id) {
      console.error('Cannot delete teacher without ID');
      setError('Invalid teacher ID');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      setLoading(true);
      try {
        console.log(`Deleting teacher with ID: ${id}`);
        
        const response = await newTeacherService.deleteTeacher(id);
        console.log('Service delete response:', response);
        
        if (response.success) {
          // Update teachers list
          setTeachers(teachers.filter(teacher => teacher._id !== id));
          setSuccess('Teacher deleted successfully!');
        } else {
          throw new Error(response.message || 'Failed to delete teacher');
        }
      } catch (err) {
        console.error('Error deleting teacher:', err);
        
        // Try direct API call as fallback
        try {
          console.log('Falling back to direct API call for deletion...');
          const directResponse = await fetch(`/api/newteacher/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          const directData = await directResponse.json();
          console.log('Direct API call response:', directData);
          
          if (directData.success) {
            setTeachers(teachers.filter(teacher => teacher._id !== id));
            setSuccess('Teacher deleted successfully!');
          } else {
            setError(directData.message || 'Failed to delete teacher. Please try again.');
          }
        } catch (directErr) {
          console.error('Direct API call also failed:', directErr);
          setError(err.message || 'Failed to delete teacher. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.02)',
      borderRadius: '12px',
      padding: '2rem',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      color: 'white'
    }}>
      <h2 style={{ color: '#a855f7', marginBottom: '2rem', textAlign: 'center' }}>
        👨‍🏫 Teacher Management
      </h2>

      {/* Debug Button - You can remove this in production */}
      <div style={{ marginBottom: '1rem', textAlign: 'right' }}>
        <button
          onClick={runDebug}
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            color: '#888',
            border: '1px solid #555',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.8rem'
          }}
        >
          Run Diagnostics
        </button>
      </div>
      
      {/* Debug Info - You can remove this in production */}
      {debugInfo && (
        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1rem',
          fontFamily: 'monospace',
          fontSize: '0.8rem',
          whiteSpace: 'pre-wrap',
          maxHeight: '200px',
          overflowY: 'auto'
        }}>
          {debugInfo}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Teacher Registration Form */}
        <div>
          <h3 style={{ marginBottom: '1.5rem' }}>Register New Teacher</h3>
          
          {/* Error and Success Messages */}
          {error && (
            <div style={{ 
              background: 'rgba(239, 68, 68, 0.2)', 
              color: '#ef4444',
              padding: '0.75rem',
              borderRadius: '8px',
              marginBottom: '1rem'
            }}>
              {error}
            </div>
          )}
          
          {success && (
            <div style={{ 
              background: 'rgba(16, 185, 129, 0.2)', 
              color: '#10b981',
              padding: '0.75rem',
              borderRadius: '8px',
              marginBottom: '1rem'
            }}>
              {success}
            </div>
          )}
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                Teacher Name *
              </label>
              <input
                type="text"
                name="name"
                value={teacher.name}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '1rem'
                }}
                placeholder="Enter teacher's full name"
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={teacher.email}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '1rem'
                }}
                placeholder="teacher@school.edu"
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={teacher.phone}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '1rem'
                }}
                placeholder="+91 9876543210"
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                Primary Subject *
              </label>
              <select
                name="subject"
                value={teacher.subject}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '1rem'
                }}
              >
                <option value="">Select Subject</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject} style={{ background: '#1e293b', color: 'white' }}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                Qualification
              </label>
              <input
                type="text"
                name="qualification"
                value={teacher.qualification}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '1rem'
                }}
                placeholder="B.Ed, M.Sc, etc."
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                Experience (Years)
              </label>
              <input
                type="number"
                name="experience"
                value={teacher.experience}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '1rem'
                }}
                placeholder="Years of teaching experience"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading ? 'rgba(168, 85, 247, 0.5)' : 'linear-gradient(135deg, #a855f7, #7c3aed)',
                color: 'white',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {loading ? 'Registering...' : 'Register Teacher'}
            </button>
          </form>
        </div>

        {/* Teachers List */}
        <div>
          <h3 style={{ marginBottom: '1.5rem' }}>Teachers List</h3>
          
          {loading && <p>Loading teachers...</p>}
          
          {!loading && Array.isArray(teachers) && teachers.length === 0 ? (
            <div style={{ 
              padding: '2rem',
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              color: 'rgba(255, 255, 255, 0.7)'
            }}>
              No teachers registered yet.
            </div>
          ) : (
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {Array.isArray(teachers) && teachers.map((teacher, index) => (
                <motion.div
                  key={teacher._id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '1.5rem',
                    borderRadius: '10px',
                    marginBottom: '1rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ color: '#a855f7', marginBottom: '0.5rem', fontSize: '1.2rem' }}>
                        {teacher.name}
                      </h4>
                      <p style={{ 
                        color: 'rgba(255, 255, 255, 0.8)',
                        marginBottom: '0.5rem',
                        fontSize: '0.9rem'
                      }}>
                        <span style={{ display: 'inline-block', width: '70px' }}>Email:</span> {teacher.email}
                      </p>
                      <p style={{ 
                        color: 'rgba(255, 255, 255, 0.8)',
                        marginBottom: '0.5rem',
                        fontSize: '0.9rem'
                      }}>
                        <span style={{ display: 'inline-block', width: '70px' }}>Phone:</span> {teacher.phone}
                      </p>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                        <span style={{
                          background: 'rgba(168, 85, 247, 0.2)',
                          color: '#a855f7',
                          padding: '0.3rem 0.8rem',
                          borderRadius: '15px',
                          fontSize: '0.8rem',
                          fontWeight: '500'
                        }}>
                          {teacher.subject}
                        </span>
                        {teacher.qualification && (
                          <span style={{
                            background: 'rgba(59, 130, 246, 0.2)',
                            color: '#3b82f6',
                            padding: '0.3rem 0.8rem',
                            borderRadius: '15px',
                            fontSize: '0.8rem',
                            fontWeight: '500'
                          }}>
                            {teacher.qualification}
                          </span>
                        )}
                        {teacher.experience > 0 && (
                          <span style={{
                            background: 'rgba(16, 185, 129, 0.2)',
                            color: '#10b981',
                            padding: '0.3rem 0.8rem',
                            borderRadius: '15px',
                            fontSize: '0.8rem',
                            fontWeight: '500'
                          }}>
                            {teacher.experience} {teacher.experience === 1 ? 'Year' : 'Years'}
                          </span>
                        )}
                      </div>
                      {/* Debug info - Remove in production */}
                      <div style={{ 
                        fontSize: '0.7rem', 
                        color: '#666', 
                        marginTop: '0.5rem',
                        fontFamily: 'monospace'
                      }}>
                        ID: {teacher._id}
                      </div>
                    </div>
                    <div>
                      <button
                        onClick={() => handleDelete(teacher._id)}
                        style={{
                          background: 'rgba(239, 68, 68, 0.2)',
                          color: '#ef4444',
                          border: '1px solid rgba(239, 68, 68, 0.4)',
                          padding: '0.5rem 1rem',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherManagement;