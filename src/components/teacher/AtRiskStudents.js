import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const AtRiskStudents = ({ classId }) => {
  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRiskLevel, setSelectedRiskLevel] = useState('all');
  const [showInterventionModal, setShowInterventionModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Mock data for demonstration
  const mockRiskData = {
    atRiskCount: 12,
    riskPercentage: 7.7,
    totalStudentsChecked: 156,
    students: [
      {
        studentId: 1,
        name: 'Emily Brown',
        class: '10-A',
        riskLevel: 'high',
        prediction: 87,
        riskFactors: ['Low assignment completion', 'Declined test scores', 'Reduced app usage'],
        interventionSuggestions: [
          'Schedule a one-on-one session to discuss learning challenges',
          'Assign targeted practice exercises in problem areas',
          'Consider parent-teacher conference to address engagement issues'
        ]
      },
      {
        studentId: 2,
        name: 'Michael Green',
        class: '9-B',
        riskLevel: 'high',
        prediction: 82,
        riskFactors: ['Missed multiple recent assignments', 'Frequently disconnects mid-session', 'Poor quiz performance'],
        interventionSuggestions: [
          'Check for technical issues that may be causing disconnections',
          'Provide alternative assessment methods',
          'Create a catch-up plan for missed assignments'
        ]
      },
      {
        studentId: 3,
        name: 'Sarah Johnson',
        class: '10-B',
        riskLevel: 'medium',
        prediction: 65,
        riskFactors: ['Declining engagement in group activities', 'Inconsistent performance'],
        interventionSuggestions: [
          'Incorporate more interactive learning elements',
          'Pair with a peer mentor',
          'Provide positive reinforcement for completed work'
        ]
      },
      {
        studentId: 4,
        name: 'James Wilson',
        class: '9-A',
        riskLevel: 'medium',
        prediction: 58,
        riskFactors: ['Multiple incorrect attempts before success', 'Slow progress pace'],
        interventionSuggestions: [
          'Break down complex concepts into smaller steps',
          'Provide additional learning resources in different formats',
          'Allow extended time for assignments'
        ]
      },
      {
        studentId: 5,
        name: 'Olivia Davis',
        class: '10-A',
        riskLevel: 'low',
        prediction: 42,
        riskFactors: ['Recent drop in participation', 'Slight decrease in scores'],
        interventionSuggestions: [
          'Check in casually about learning experience',
          'Monitor for improvement or further decline',
          'Offer optional enrichment activities'
        ]
      }
    ]
  };

  useEffect(() => {
    // Simulating API call
    const fetchAtRiskData = async () => {
      try {
        setLoading(true);
        setTimeout(() => {
          setRiskData(mockRiskData);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching at-risk data:', err);
        setError('Failed to load student risk analysis');
        setLoading(false);
      }
    };

    fetchAtRiskData();
  }, [classId]);

  // Helper function to get risk level color
  const getRiskLevelColor = (level) => {
    switch (level) {
      case 'high': return '#ec4899'; // pink-600
      case 'medium': return '#a855f7'; // purple-600
      case 'low': return '#6366f1'; // indigo-600
      default: return '#9ca3af'; // gray-400
    }
  };

  // Handle intervene button click
  const handleIntervene = (student) => {
    setSelectedStudent(student);
    setShowInterventionModal(true);
  };

  // Filter students by risk level
  const filteredStudents = riskData?.students.filter(student => 
    selectedRiskLevel === 'all' || student.riskLevel === selectedRiskLevel
  );

  // Animation variants
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

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 via-pink-100 to-white bg-[length:200%_200%]" style={{ animation: 'auroraFlow 15s ease infinite' }}></div>
        <div className="relative z-10 flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-gray-200 border-t-indigo-500 rounded-full animate-spin"></div>
            <p className="text-gray-800">Analyzing student data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 via-pink-100 to-white bg-[length:200%_200%]" style={{ animation: 'auroraFlow 15s ease infinite' }}></div>
        <div className="relative z-10 flex items-center justify-center h-64">
          <div className="bg-white/30 backdrop-blur-lg rounded-xl p-8 shadow-lg text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-pink-600 mb-2">{error}</h3>
            <p className="text-gray-700">Please try again later or contact support.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!riskData) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 via-pink-100 to-white bg-[length:200%_200%]" style={{ animation: 'auroraFlow 15s ease infinite' }}></div>
        <div className="relative z-10 flex items-center justify-center h-64">
          <div className="bg-white/30 backdrop-blur-lg rounded-xl p-8 shadow-lg text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No data available</h3>
            <p className="text-gray-700">There is no risk analysis data available for this class.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Aurora background */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 via-pink-100 to-white bg-[length:200%_200%]" style={{ animation: 'auroraFlow 15s ease infinite' }}></div>
      
      <motion.div
        className="relative z-10 p-6 tab-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header with summary stats */}
        <motion.div variants={itemVariants} className="welcome-header mb-8">
          <h1 className="welcome-title text-3xl font-bold text-gray-900 flex items-center gap-3">
            <span className="text-4xl">⚠️</span>
            At-Risk Students Analysis
          </h1>
          <p className="welcome-subtitle text-gray-700">
            Identify students who may need additional support and intervention
          </p>
        </motion.div>

        {/* Summary Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/30 backdrop-blur-lg rounded-xl p-5 shadow-lg transition transform hover:scale-105 duration-300" style={{ animation: 'float 4s ease-in-out infinite' }}>
            <div className="flex justify-between items-start">
              <h3 className="text-gray-700 font-medium text-sm mb-1">
                At-Risk Students
              </h3>
              <div className="text-2xl">
                ⚠️
              </div>
            </div>
            <div className="text-2xl font-bold text-pink-600">
              {riskData.atRiskCount}
            </div>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-lg text-purple-500">
                📊
              </span>
              <span className="text-gray-700 text-sm">
                Require intervention
              </span>
            </div>
          </div>

          <div className="bg-white/30 backdrop-blur-lg rounded-xl p-5 shadow-lg transition transform hover:scale-105 duration-300" style={{ animation: 'float 4s ease-in-out infinite 0.3s' }}>
            <div className="flex justify-between items-start">
              <h3 className="text-gray-700 font-medium text-sm mb-1">
                Risk Percentage
              </h3>
              <div className="text-2xl">
                📈
              </div>
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {riskData.riskPercentage}%
            </div>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-lg text-gray-600">
                👥
              </span>
              <span className="text-gray-700 text-sm">
                Of total students
              </span>
            </div>
          </div>

          <div className="bg-white/30 backdrop-blur-lg rounded-xl p-5 shadow-lg transition transform hover:scale-105 duration-300" style={{ animation: 'float 4s ease-in-out infinite 0.6s' }}>
            <div className="flex justify-between items-start">
              <h3 className="text-gray-700 font-medium text-sm mb-1">
                Total Students
              </h3>
              <div className="text-2xl">
                👨‍🎓
              </div>
            </div>
            <div className="text-2xl font-bold text-indigo-600">
              {riskData.totalStudentsChecked}
            </div>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-lg text-gray-600">
                🔍
              </span>
              <span className="text-gray-700 text-sm">
                Analyzed for risk factors
              </span>
            </div>
          </div>
        </motion.div>

        {/* Risk Level Filter */}
        <motion.div variants={itemVariants} className="flex mb-6">
          <div className="tabs-container w-full flex gap-4 flex-wrap">
            <button
              className={`px-4 py-2 rounded-lg font-medium text-white transition-all duration-300 ${selectedRiskLevel === 'all' ? 'bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg' : 'bg-gray-400/70 backdrop-blur-sm hover:bg-gray-500/70'}`}
              onClick={() => setSelectedRiskLevel('all')}
            >
              <span className="mr-2">👁️</span>
              <span>All Levels</span>
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-medium text-white transition-all duration-300 ${selectedRiskLevel === 'high' ? 'bg-gradient-to-r from-pink-500 to-rose-500 shadow-lg' : 'bg-gray-400/70 backdrop-blur-sm hover:bg-gray-500/70'}`}
              onClick={() => setSelectedRiskLevel('high')}
            >
              <span className="mr-2">🔴</span>
              <span>High Risk</span>
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-medium text-white transition-all duration-300 ${selectedRiskLevel === 'medium' ? 'bg-gradient-to-r from-purple-500 to-violet-500 shadow-lg' : 'bg-gray-400/70 backdrop-blur-sm hover:bg-gray-500/70'}`}
              onClick={() => setSelectedRiskLevel('medium')}
            >
              <span className="mr-2">🟠</span>
              <span>Medium Risk</span>
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-medium text-white transition-all duration-300 ${selectedRiskLevel === 'low' ? 'bg-gradient-to-r from-indigo-500 to-blue-500 shadow-lg' : 'bg-gray-400/70 backdrop-blur-sm hover:bg-gray-500/70'}`}
              onClick={() => setSelectedRiskLevel('low')}
            >
              <span className="mr-2">🟢</span>
              <span>Low Risk</span>
            </button>
          </div>
        </motion.div>

        {/* At-Risk Students List */}
        <motion.div variants={itemVariants} className="bg-white/30 backdrop-blur-lg rounded-xl p-5 shadow-lg mb-8 transition hover:shadow-xl duration-300">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">⚠️</span>
            <h2 className="text-xl font-semibold text-gray-900">At-Risk Students</h2>
          </div>

          <div className="bg-white/50 backdrop-blur-sm rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100/80">
                    <th className="p-3 text-left text-gray-900 font-medium">Student</th>
                    <th className="p-3 text-left text-gray-900 font-medium">Class</th>
                    <th className="p-3 text-left text-gray-900 font-medium">Risk Level</th>
                    <th className="p-3 text-left text-gray-900 font-medium">Prediction</th>
                    <th className="p-3 text-left text-gray-900 font-medium">Risk Factors</th>
                    <th className="p-3 text-left text-gray-900 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-6 text-center text-gray-700">
                        No students found matching the selected risk level.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student) => (
                      <tr key={student.studentId} className="border-b border-gray-200/50 hover:bg-white/40 transition duration-150">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center font-medium text-white">
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="font-medium text-gray-900">{student.name}</span>
                          </div>
                        </td>
                        <td className="p-3 text-gray-900">{student.class}</td>
                        <td className="p-3">
                          <span
                            className="px-3 py-1 rounded-full text-xs font-semibold"
                            style={{
                              backgroundColor: `${getRiskLevelColor(student.riskLevel)}20`,
                              color: getRiskLevelColor(student.riskLevel)
                            }}
                          >
                            {student.riskLevel.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center">
                            <div className="w-full max-w-[80px] bg-gray-200/70 rounded-full h-2.5 mr-2">
                              <div
                                className="h-2.5 rounded-full"
                                style={{
                                  width: `${student.prediction}%`,
                                  backgroundColor: getRiskLevelColor(student.riskLevel)
                                }}
                              ></div>
                            </div>
                            <span className="text-gray-900">{student.prediction}/100</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <ul className="list-disc list-inside text-sm text-gray-800">
                            {student.riskFactors.map((factor, idx) => (
                              <li key={idx}>{factor}</li>
                            ))}
                          </ul>
                        </td>
                        <td className="p-3">
                          <button 
                            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-shadow"
                            onClick={() => handleIntervene(student)}
                          >
                            Intervene
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Intervention Suggestions */}
        <motion.div variants={itemVariants} className="bg-white/30 backdrop-blur-lg rounded-xl p-5 shadow-lg transition hover:shadow-xl duration-300">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">💡</span>
            <h2 className="text-xl font-semibold text-gray-900">Suggested Interventions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredStudents.slice(0, 2).map((student, index) => (
              <div 
                key={`intervention-${student.studentId}`} 
                className="bg-white/50 backdrop-blur-sm rounded-lg p-5 transition transform hover:scale-102 hover:shadow-md duration-300"
                style={{ animation: `float 4s ease-in-out infinite ${index * 0.3}s` }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center font-medium text-white">
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{student.name}</h4>
                    <p className="text-sm text-gray-700">{student.class}</p>
                  </div>
                  <span
                    className="ml-auto px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: `${getRiskLevelColor(student.riskLevel)}20`,
                      color: getRiskLevelColor(student.riskLevel)
                    }}
                  >
                    {student.riskLevel.toUpperCase()}
                  </span>
                </div>
                
                <h5 className="font-medium text-gray-800 mb-2">Recommended actions:</h5>
                <ul className="space-y-2">
                  {student.interventionSuggestions.map((suggestion, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-indigo-500 mt-1">✓</span>
                      <span className="text-gray-800">{suggestion}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-4">
                  <button 
                    className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-shadow w-full"
                    onClick={() => handleIntervene(student)}
                  >
                    Create Intervention Plan
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
      
      {/* Intervention Modal */}
      {showInterventionModal && selectedStudent && <InterventionModal
        isOpen={showInterventionModal}
        onClose={() => setShowInterventionModal(false)}
        student={selectedStudent}
      />}
    </div>
  );
};

// Custom Modal Component for Interventions
const InterventionModal = ({ isOpen, onClose, student }) => {
  const [selectedInterventions, setSelectedInterventions] = useState([]);
  const [customIntervention, setCustomIntervention] = useState('');
  const [notes, setNotes] = useState('');
  
  // Reset form when student changes
  useEffect(() => {
    setSelectedInterventions([]);
    setCustomIntervention('');
    setNotes('');
  }, [student]);
  
  const handleCheckboxChange = (intervention) => {
    if (selectedInterventions.includes(intervention)) {
      setSelectedInterventions(selectedInterventions.filter(item => item !== intervention));
    } else {
      setSelectedInterventions([...selectedInterventions, intervention]);
    }
  };
  
  const handleSubmit = () => {
    // In a real app, you would save the intervention data to your backend
    console.log('Intervention submitted for:', student.name);
    console.log('Selected interventions:', selectedInterventions);
    if (customIntervention) console.log('Custom intervention:', customIntervention);
    if (notes) console.log('Notes:', notes);
    
    // Show success message
    alert(`Intervention plan created for ${student.name}`);
    onClose();
  };
  
  // Get color based on risk level
  const getRiskLevelColor = (level) => {
    switch (level) {
      case 'high': return '#ec4899'; // pink-600
      case 'medium': return '#a855f7'; // purple-600
      case 'low': return '#6366f1'; // indigo-600
      default: return '#9ca3af'; // gray-400
    }
  };

  if (!isOpen) return null;

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
  
  return (
    <div style={overlayStyles} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={modalStyles} onClick={(e) => e.stopPropagation()}>
        <div className="p-6 bg-white/90 backdrop-blur-lg rounded-t-xl border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center font-medium text-white"
                style={{ background: `linear-gradient(to right, ${getRiskLevelColor(student.riskLevel)}, ${getRiskLevelColor(student.riskLevel)}aa)` }}
              >
                {student.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Intervention Plan: {student.name}
              </h3>
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
          <div className="space-y-6">
            {/* Student Info */}
            <div className="bg-white/50 backdrop-blur-sm p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Class</p>
                  <p className="font-medium text-gray-900">{student.class}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Risk Level</p>
                  <p>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor: `${getRiskLevelColor(student.riskLevel)}20`,
                        color: getRiskLevelColor(student.riskLevel)
                      }}
                    >
                      {student.riskLevel.toUpperCase()}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Risk Score</p>
                  <p className="font-medium text-gray-900">{student.prediction}/100</p>
                </div>
              </div>
            </div>
            
            {/* Risk Factors */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3">Identified Risk Factors</h4>
              <div className="bg-pink-50/70 p-4 rounded-lg">
                <ul className="list-disc list-inside space-y-2">
                  {student.riskFactors.map((factor, idx) => (
                    <li key={idx} className="text-gray-800">{factor}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Recommended Interventions */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3">Recommended Interventions</h4>
              <div className="bg-indigo-50/70 p-4 rounded-lg space-y-3">
                {student.interventionSuggestions.map((intervention, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id={`intervention-${idx}`}
                      checked={selectedInterventions.includes(intervention)}
                      onChange={() => handleCheckboxChange(intervention)}
                      className="mt-1 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor={`intervention-${idx}`} className="text-gray-800">
                      {intervention}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Custom Intervention */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3">Custom Intervention</h4>
              <textarea
                placeholder="Add your own intervention plan..."
                value={customIntervention}
                onChange={(e) => setCustomIntervention(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                rows={3}
              />
            </div>
            
            {/* Notes */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3">Notes</h4>
              <textarea
                placeholder="Add any additional notes about this student..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                rows={3}
              />
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-gray-50/90 backdrop-blur-lg rounded-b-xl border-t border-gray-200">
          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="px-4 py-2 bg-white/50 backdrop-blur-sm text-gray-800 rounded-lg text-sm font-medium hover:bg-white/70 transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-shadow"
              onClick={handleSubmit}
            >
              Create Intervention Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AtRiskStudents;