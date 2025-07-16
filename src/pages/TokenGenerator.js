// src/pages/TokenGenerator.js
import React, { useState } from 'react';
import axios from 'axios';

const TokenGenerator = () => {
  const [userData, setUserData] = useState({
    id: '6860a8f4070dad7fc8d3d9ca', // Use your actual admin ID
    role: 'admin',
    name: 'Admin User',
    email: 'admin@example.com',
    department: 'it',
    accessLevel: 'level3'
  });
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const generateToken = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/dev/generate-token', userData);
      
      console.log('Token generated:', response.data);
      setResult(response.data);
      
      // Store token in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        alert('Token saved to localStorage!');
      }
    } catch (error) {
      console.error('Error generating token:', error);
      setResult({ 
        error: error.response?.data?.error || error.message 
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Development Token Generator</h1>
      <p>Use this tool to generate a valid JWT token for testing purposes.</p>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>User Data</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <label>User ID:</label>
            <input 
              type="text" 
              value={userData.id} 
              onChange={(e) => setUserData({...userData, id: e.target.value})}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          <div>
            <label>Role:</label>
            <select 
              value={userData.role} 
              onChange={(e) => setUserData({...userData, role: e.target.value})}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            >
              <option value="admin">Admin</option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
              <option value="school">School</option>
            </select>
          </div>
          <div>
            <label>Name:</label>
            <input 
              type="text" 
              value={userData.name} 
              onChange={(e) => setUserData({...userData, name: e.target.value})}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          <div>
            <label>Email:</label>
            <input 
              type="email" 
              value={userData.email} 
              onChange={(e) => setUserData({...userData, email: e.target.value})}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          <div>
            <label>Department:</label>
            <input 
              type="text" 
              value={userData.department} 
              onChange={(e) => setUserData({...userData, department: e.target.value})}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          <div>
            <label>Access Level:</label>
            <select 
              value={userData.accessLevel} 
              onChange={(e) => setUserData({...userData, accessLevel: e.target.value})}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            >
              <option value="level1">Level 1</option>
              <option value="level2">Level 2</option>
              <option value="level3">Level 3</option>
            </select>
          </div>
        </div>
      </div>
      
      <button 
        onClick={generateToken} 
        disabled={loading}
        style={{
          background: 'blue',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Generating...' : 'Generate Token'}
      </button>
      
      {result && (
        <div style={{ marginTop: '20px' }}>
          <h3>Result</h3>
          <pre style={{ 
            background: '#f0f0f0', 
            padding: '15px', 
            borderRadius: '5px',
            overflowX: 'auto' 
          }}>
            {JSON.stringify(result, null, 2)}
          </pre>
          
          {result.token && (
            <div style={{ marginTop: '15px' }}>
              <h4>Token</h4>
              <div style={{ 
                background: '#e0f0e0', 
                padding: '15px', 
                borderRadius: '5px',
                wordBreak: 'break-all' 
              }}>
                {result.token}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TokenGenerator;