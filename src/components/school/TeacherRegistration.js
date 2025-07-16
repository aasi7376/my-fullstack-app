// src/components/school/TeacherRegistration.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';

const TeacherRegistration = () => {
  const [teacher, setTeacher] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    qualification: '',
    experience: ''
  });

  const [loading, setLoading] = useState(false);
  const [initialPassword, setInitialPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'History', 'Geography', 'Computer Science'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Call the professorAPI instead of teacher API
      const response = await api.registerProfessor(teacher);
      
      console.log('Professor registered:', response.data);
      
      // Show success alert
      alert('Professor registered successfully!');
      
      // If the API returns an initial password, show it to the user
      if (response.initialPassword) {
        setInitialPassword(response.initialPassword);
        setShowPassword(true);
      }
      
      // Reset form
      setTeacher({ 
        name: '', 
        email: '', 
        phone: '', 
        subject: '', 
        qualification: '', 
        experience: '' 
      });
    } catch (error) {
      console.error('Error registering professor:', error);
      alert(`Registration failed: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setTeacher({
      ...teacher,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.02)',
      borderRadius: '12px',
      padding: '2rem',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      color: 'white',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <h2 style={{ color: '#a855f7', marginBottom: '2rem', textAlign: 'center' }}>
        👨‍🏫 Professor Registration
      </h2>
      
      {/* Show initial password if available */}
      {showPassword && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'rgba(168, 85, 247, 0.15)',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1.5rem',
            border: '1px solid rgba(168, 85, 247, 0.3)',
          }}
        >
          <p style={{ margin: 0, textAlign: 'center' }}>
            <span style={{ fontWeight: 'bold' }}>Initial Password:</span> {initialPassword}
          </p>
          <p style={{ fontSize: '0.8rem', margin: '0.5rem 0 0 0', textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)' }}>
            Please share this password with the professor. They will be asked to change it on first login.
          </p>
        </motion.div>
      )}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255, 255, 255, 0.8)' }}>
            Professor Name *
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
            placeholder="Enter professor's full name"
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
            placeholder="professor@school.edu"
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
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {loading ? 'Registering...' : 'Register Professor'}
          
          {loading && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0, 0, 0, 0.2)'
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                border: '3px solid rgba(255, 255, 255, 0.3)',
                borderTop: '3px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
            </div>
          )}
        </button>
      </form>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default TeacherRegistration;