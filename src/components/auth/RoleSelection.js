// File: src/components/auth/RoleSelection.js
import React from 'react';
import { motion } from 'framer-motion';

const RoleSelection = ({ onRoleSelect, onClose, title = "Choose Your Role" }) => {
  const roles = [
    { 
      id: 'student', 
      label: 'Student', 
      icon: '👨‍🎓', 
      color: '#00ff88', 
      description: 'Learn through interactive games',
      features: ['Play educational games', 'Track your progress', 'Ask doubts to teachers']
    },
    { 
      id: 'teacher', 
      label: 'Teacher', 
      icon: '👨‍🏫', 
      color: '#00a8ff', 
      description: 'Manage and track student progress',
      features: ['Manage students', 'Assign games', 'Answer student doubts']
    },
    { 
      id: 'school', 
      label: 'School Admin', 
      icon: '🏫', 
      color: '#8c7ae6', 
      description: 'Oversee school-wide activities',
      features: ['Manage teachers', 'View school analytics', 'Generate reports']
    },
    { 
      id: 'admin', 
      label: 'System Admin', 
      icon: '⚙️', 
      color: '#ff6b9d', 
      description: 'Manage the entire platform',
      features: ['Manage schools', 'System settings', 'Platform analytics']
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      style={{
        background: 'rgba(15, 15, 35, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        border: '2px solid rgba(0, 255, 136, 0.3)',
        padding: '40px',
        maxWidth: '1000px',
        width: '100%',
        color: '#ffffff',
        position: 'relative',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4), 0 0 100px rgba(0, 255, 136, 0.1)'
      }}
    >
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '40px' 
      }}>
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ 
            fontSize: '2.5rem', 
            fontWeight: '700', 
            margin: 0,
            background: 'linear-gradient(45deg, #00ff88, #00a8ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          {title}
        </motion.h2>
        <motion.button 
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{ 
            background: 'rgba(255, 255, 255, 0.1)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            color: '#fff', 
            fontSize: '1.5rem', 
            cursor: 'pointer',
            padding: '10px 15px',
            transition: 'all 0.3s ease'
          }}
        >
          ✕
        </motion.button>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          fontSize: '1.2rem',
          color: '#cccccc',
          textAlign: 'center',
          marginBottom: '40px',
          lineHeight: '1.6'
        }}
      >
        Select your role to access the appropriate features and dashboard
      </motion.p>

      {/* Role Cards Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
        gap: '25px' 
      }}>
        {roles.map((role, index) => (
          <motion.button
            key={role.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.3 }}
            whileHover={{ 
              scale: 1.05, 
              y: -10,
              boxShadow: `0 25px 50px ${role.color}40`,
              borderColor: role.color
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onRoleSelect(role.id)}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: `2px solid ${role.color}40`,
              borderRadius: '20px',
              padding: '30px 20px',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              minHeight: '280px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            {/* Role Icon */}
            <motion.div 
              style={{ fontSize: '3.5rem', marginBottom: '15px' }}
              whileHover={{ 
                scale: 1.2, 
                rotate: [0, -10, 10, 0],
                transition: { duration: 0.5 }
              }}
            >
              {role.icon}
            </motion.div>
            
            {/* Role Title */}
            <h3 style={{ 
              fontSize: '1.4rem', 
              fontWeight: '700', 
              marginBottom: '10px', 
              color: role.color,
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              {role.label}
            </h3>
            
            {/* Role Description */}
            <p style={{ 
              fontSize: '0.95rem', 
              color: '#cccccc', 
              margin: '0 0 20px 0', 
              lineHeight: '1.4',
              flex: 1
            }}>
              {role.description}
            </p>

            {/* Features List */}
            <div style={{ textAlign: 'left' }}>
              {role.features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.5 + idx * 0.1 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px',
                    fontSize: '0.85rem',
                    color: '#e0e0e0'
                  }}
                >
                  <span style={{ color: role.color, fontSize: '0.8rem' }}>✓</span>
                  {feature}
                </motion.div>
              ))}
            </div>

            {/* Hover Glow Effect */}
            <motion.div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `linear-gradient(135deg, ${role.color}10, transparent)`,
                opacity: 0,
                borderRadius: '18px',
                pointerEvents: 'none'
              }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        ))}
      </div>

      {/* Bottom Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        style={{
          marginTop: '30px',
          padding: '20px',
          background: 'rgba(0, 255, 136, 0.1)',
          borderRadius: '15px',
          border: '1px solid rgba(0, 255, 136, 0.2)',
          textAlign: 'center'
        }}
      >
        <p style={{ 
          color: '#00ff88', 
          margin: 0, 
          fontSize: '0.95rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          <span style={{ fontSize: '1.2rem' }}>💡</span>
          You can switch between roles anytime from your profile settings
        </p>
      </motion.div>

      {/* Animated Background Elements */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '100px',
          height: '100px',
          background: 'linear-gradient(45deg, rgba(0, 255, 136, 0.1), rgba(0, 168, 255, 0.1))',
          borderRadius: '50%',
          zIndex: -1
        }}
      />
      
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        style={{
          position: 'absolute',
          bottom: '-30px',
          left: '-30px',
          width: '80px',
          height: '80px',
          background: 'linear-gradient(45deg, rgba(0, 168, 255, 0.1), rgba(140, 122, 230, 0.1))',
          borderRadius: '50%',
          zIndex: -1
        }}
      />
    </motion.div>
  );
};

export default RoleSelection;