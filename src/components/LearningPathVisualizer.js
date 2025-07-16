// src/components/LearningPathVisualizer.jsx
import { useState, useEffect } from 'react';
import mlService from '../services/mlService';
import { Route, Map, Target, Brain, ArrowRight, Award } from 'lucide-react';

// Define colors similar to the existing design
const COLORS = {
  background: '#151521',
  backgroundDarker: '#0d0d14',
  backgroundLighter: '#1d1d2e',
  primary: '#39FF14',
  secondary: '#9D00FF',
  accent1: '#1AECFF',
  accent2: '#FF2777',
  accent3: '#F8FF00',
  dark: '#0A0A0F',
  light: '#FFFFFF',
  gray: '#8A8A9B'
};

const LearningPathVisualizer = ({ studentId }) => {
  const [learningPath, setLearningPath] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Add debugging
  console.log('LearningPathVisualizer received studentId:', studentId);
  
  useEffect(() => {
    // Check if studentId is provided
    if (!studentId) {
      console.error('LearningPathVisualizer: studentId is required but not provided');
      setError('Student ID is required to load learning path');
      setLoading(false);
      return;
    }
    
    const fetchLearningPath = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await mlService.getLearningPath(studentId);
        
        // Ensure we always have an array
        if (Array.isArray(data)) {
          setLearningPath(data);
        } else if (data && typeof data === 'object') {
          // If it's an object, try to extract array from common properties
          setLearningPath(data.learningPath || data.path || data.items || []);
        } else {
          setLearningPath([]);
        }
      } catch (err) {
        console.error('Failed to fetch learning path:', err);
        setError('Could not load your learning path. Please try again later.');
        setLearningPath([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLearningPath();
  }, [studentId]);
  
  // Handle missing studentId
  if (!studentId) {
    return (
      <div style={{
        padding: '30px',
        borderRadius: '15px',
        backgroundColor: `${COLORS.backgroundLighter}`,
        border: `1px solid ${COLORS.accent2}`,
        textAlign: 'center',
        color: 'white'
      }}>
        <Brain size={40} color={COLORS.accent2} style={{ marginBottom: '15px' }} />
        <h3 style={{ color: COLORS.accent2, margin: '0 0 10px 0' }}>Missing Student Information</h3>
        <p>Student ID is required to display learning path.</p>
        <p style={{ fontSize: '14px', color: COLORS.gray }}>
          Please make sure you're logged in properly.
        </p>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        color: COLORS.secondary
      }}>
        <div style={{
          display: 'inline-block',
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          borderTop: `3px solid ${COLORS.secondary}`,
          borderRight: `3px solid transparent`,
          animation: 'spin 1s linear infinite',
          marginBottom: '10px'
        }} />
        <p>Generating your learning path...</p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }
  
  if (error) {
    return (
      <div style={{
        padding: '20px',
        borderRadius: '10px',
        backgroundColor: 'rgba(255, 39, 119, 0.1)',
        border: `1px solid ${COLORS.accent2}`,
        color: 'white',
        textAlign: 'center'
      }}>
        <p>{error}</p>
      </div>
    );
  }

  if (!learningPath || !Array.isArray(learningPath) || learningPath.length === 0) {
    return (
      <div style={{
        padding: '30px',
        borderRadius: '15px',
        backgroundColor: `${COLORS.backgroundLighter}`,
        border: `1px solid ${COLORS.gray}30`,
        textAlign: 'center',
        color: 'white'
      }}>
        <Map size={40} color={COLORS.secondary} style={{ marginBottom: '15px' }} />
        <h3>Your learning path is being created</h3>
        <p>Complete more activities to help us generate your personalized learning journey!</p>
      </div>
    );
  }
  
  // Only process data if we have valid learningPath array
  let groupedPath = {};
  
  try {
    // Group learning path by subject with extensive null checking
    groupedPath = learningPath.reduce((acc, item) => {
      // Add null/undefined checks and provide default values
      if (!item || typeof item !== 'object') {
        console.warn('Invalid item in learning path:', item);
        return acc;
      }
      
      const subject = (item.subject && typeof item.subject === 'string') ? item.subject : 'General';
      const skill = (item.skill && typeof item.skill === 'string') ? item.skill : 'Unknown Skill';
      const currentProficiency = (typeof item.currentProficiency === 'number') ? item.currentProficiency : 0;
      const recommendedActivities = Array.isArray(item.recommendedActivities) ? item.recommendedActivities : [];
      
      if (!acc[subject]) {
        acc[subject] = [];
      }
      
      acc[subject].push({
        ...item,
        subject,
        skill,
        currentProficiency,
        recommendedActivities
      });
      
      return acc;
    }, {});
  } catch (reduceError) {
    console.error('Error processing learning path data:', reduceError);
    return (
      <div style={{
        padding: '20px',
        borderRadius: '10px',
        backgroundColor: 'rgba(255, 39, 119, 0.1)',
        border: `1px solid ${COLORS.accent2}`,
        color: 'white',
        textAlign: 'center'
      }}>
        <p>Error processing learning path data. Please try again.</p>
      </div>
    );
  }
  
  // If no valid data after processing, show empty state
  if (!groupedPath || Object.keys(groupedPath).length === 0) {
    return (
      <div style={{
        padding: '30px',
        borderRadius: '15px',
        backgroundColor: `${COLORS.backgroundLighter}`,
        border: `1px solid ${COLORS.gray}30`,
        textAlign: 'center',
        color: 'white'
      }}>
        <Map size={40} color={COLORS.secondary} style={{ marginBottom: '15px' }} />
        <h3>Your learning path is being created</h3>
        <p>Complete more activities to help us generate your personalized learning journey!</p>
      </div>
    );
  }
  
  return (
    <div>
      <h2 style={{ 
        fontSize: '22px', 
        marginBottom: '20px',
        color: COLORS.secondary,
        fontFamily: "'Orbitron', sans-serif",
        textShadow: `0 0 15px ${COLORS.secondary}60`
      }}>
        Your Learning Path
      </h2>
      
      {Object.entries(groupedPath).map(([subject, items], subjectIndex) => (
        <div 
          key={subject}
          style={{
            marginBottom: '30px',
            animation: `fade-in 0.5s ease-out ${subjectIndex * 0.2}s both`
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '15px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: `radial-gradient(circle at center, ${COLORS.secondary}30 0%, rgba(0,0,0,0))`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: COLORS.secondary,
              border: `1px solid ${COLORS.secondary}50`,
              boxShadow: `0 0 15px ${COLORS.secondary}50`
            }}>
              <Brain size={20} />
            </div>
            <h3 style={{
              fontSize: '18px',
              color: COLORS.secondary,
              margin: 0,
              fontFamily: "'Orbitron', sans-serif",
              textTransform: 'capitalize'
            }}>
              {subject}
            </h3>
          </div>
          
          <div style={{
            position: 'relative',
            paddingLeft: '20px',
            marginLeft: '20px'
          }}>
            {/* Vertical line connecting skills */}
            <div style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '2px',
              background: `linear-gradient(to bottom, ${COLORS.secondary}, ${COLORS.accent1})`,
              zIndex: 1
            }} />
            
            {Array.isArray(items) && items.map((pathItem, index) => (
              <div 
                key={`${subject}-${pathItem.skill}-${index}`}
                style={{
                  position: 'relative',
                  marginBottom: '25px',
                  paddingLeft: '30px',
                  animation: `fade-in 0.5s ease-out ${(subjectIndex * 0.2) + (index * 0.1)}s both`
                }}
              >
                {/* Node circle */}
                <div style={{
                  position: 'absolute',
                  left: '-10px',
                  top: '0',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: index === 0 ? COLORS.secondary : COLORS.accent1,
                  border: `2px solid ${COLORS.backgroundLighter}`,
                  boxShadow: `0 0 10px ${index === 0 ? COLORS.secondary : COLORS.accent1}`,
                  zIndex: 2
                }} />
                
                <div style={{
                  background: `linear-gradient(135deg, ${COLORS.backgroundLighter}, ${COLORS.background})`,
                  borderRadius: '15px',
                  padding: '20px',
                  border: `1px solid ${index === 0 ? COLORS.secondary : COLORS.accent1}30`
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '15px'
                  }}>
                    <h4 style={{
                      fontSize: '16px',
                      color: 'white',
                      margin: 0,
                      fontWeight: 'bold'
                    }}>
                      {pathItem.skill}
                    </h4>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <div style={{
                        width: '100px',
                        height: '8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${Math.min(100, Math.max(0, pathItem.currentProficiency))}%`,
                          backgroundColor: pathItem.currentProficiency < 30 ? COLORS.accent2 :
                                          pathItem.currentProficiency < 70 ? COLORS.accent3 : COLORS.primary,
                          borderRadius: '4px'
                        }} />
                      </div>
                      <span style={{
                        fontSize: '14px',
                        color: pathItem.currentProficiency < 30 ? COLORS.accent2 :
                               pathItem.currentProficiency < 70 ? COLORS.accent3 : COLORS.primary,
                        fontWeight: 'bold'
                      }}>
                        {pathItem.currentProficiency}%
                      </span>
                    </div>
                  </div>
                  
                  <div style={{
                    marginBottom: '15px'
                  }}>
                    <p style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      margin: 0
                    }}>
                      Recommended activities to improve this skill:
                    </p>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}>
                    {pathItem.recommendedActivities.length > 0 ? (
                      pathItem.recommendedActivities.map((activity, activityIndex) => (
                        <div
                          key={activity.gameId || `activity-${activityIndex}`}
                          style={{
                            padding: '8px 12px',
                            backgroundColor: `${COLORS.primary}20`,
                            borderRadius: '20px',
                            fontSize: '14px',
                            color: COLORS.primary,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <Target size={16} />
                          {activity.title || 'Activity'}
                        </div>
                      ))
                    ) : (
                      <div style={{
                        padding: '8px 12px',
                        backgroundColor: `${COLORS.gray}20`,
                        borderRadius: '20px',
                        fontSize: '14px',
                        color: COLORS.gray,
                        fontStyle: 'italic'
                      }}>
                        No activities available
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default LearningPathVisualizer;