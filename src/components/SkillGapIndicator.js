// src/components/SkillGapIndicator.jsx
import { useState, useEffect } from 'react';
import mlService from '../services/mlService';
import { Target, AlertTriangle, ArrowUpRight, Book } from 'lucide-react';

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

const SkillGapIndicator = ({ studentId }) => {
  const [skillGaps, setSkillGaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchSkillGaps = async () => {
      try {
        // If studentId is undefined or null, don't make the API call
        if (!studentId) {
          setLoading(false);
          setError('No student ID provided.');
          return;
        }
        
        setLoading(true);
        
        // Fetch learning path data which contains skill gaps
        const learningPath = await mlService.getLearningPath(studentId);
        
        // Make sure learningPath is an array
        if (!Array.isArray(learningPath)) {
          console.error('Expected learningPath to be an array but got:', learningPath);
          setError('Invalid data format received from server.');
          setLoading(false);
          return;
        }
        
        // Extract skill gaps (skills with low proficiency)
        const gaps = [];
        
        learningPath.forEach(item => {
          if (item && typeof item.currentProficiency === 'number' && item.currentProficiency < 50) {
            gaps.push({
              subject: item.subject || 'Unknown Subject',
              skill: item.skill || 'Unknown Skill',
              proficiency: item.currentProficiency,
              recommendedActivities: Array.isArray(item.recommendedActivities) 
                ? item.recommendedActivities.slice(0, 2) 
                : []
            });
          }
        });
        
        // Sort by proficiency (ascending)
        gaps.sort((a, b) => a.proficiency - b.proficiency);
        
        setSkillGaps(gaps.slice(0, 3)); // Only show top 3 gaps
        setError(null);
      } catch (err) {
        console.error('Failed to fetch skill gaps:', err);
        setError('Could not load skill gap data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSkillGaps();
  }, [studentId]);
  
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <div style={{
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          border: `2px solid ${COLORS.accent2}`,
          borderTopColor: 'transparent',
          margin: '0 auto 10px',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ color: 'white', fontSize: '14px' }}>Analyzing skill gaps...</p>
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
        padding: '15px',
        borderRadius: '10px',
        backgroundColor: 'rgba(255, 39, 119, 0.1)',
        border: `1px solid ${COLORS.accent2}`,
        color: 'white',
        textAlign: 'center'
      }}>
        <p style={{ margin: 0, fontSize: '14px' }}>{error}</p>
      </div>
    );
  }
  
  if (skillGaps.length === 0) {
    return (
      <div style={{
        padding: '20px',
        borderRadius: '15px',
        backgroundColor: `${COLORS.backgroundLighter}`,
        border: `1px solid ${COLORS.primary}30`,
        textAlign: 'center',
        color: 'white'
      }}>
        <Target size={30} color={COLORS.primary} style={{ marginBottom: '10px' }} />
        <h3 style={{ fontSize: '16px', margin: '0 0 10px 0' }}>No major skill gaps detected</h3>
        <p style={{ fontSize: '14px', margin: 0, color: 'rgba(255, 255, 255, 0.7)' }}>
          Keep up the good work! You're doing well in all skill areas.
        </p>
      </div>
    );
  }
  
  return (
    <div>
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
          background: `radial-gradient(circle at center, ${COLORS.accent2}30 0%, rgba(0,0,0,0))`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: COLORS.accent2,
          border: `1px solid ${COLORS.accent2}50`,
          boxShadow: `0 0 15px ${COLORS.accent2}50`
        }}>
          <AlertTriangle size={20} />
        </div>
        
        <div>
          <h3 style={{
            fontSize: '18px',
            color: COLORS.accent2,
            margin: '0 0 5px 0',
            fontFamily: "'Orbitron', sans-serif"
          }}>
            Focus Areas
          </h3>
          <p style={{
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.7)',
            margin: 0
          }}>
            Skills that need your attention
          </p>
        </div>
      </div>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {skillGaps.map((gap, index) => (
          <div
            key={`${gap.subject}-${gap.skill}`}
            style={{
              background: `linear-gradient(135deg, ${COLORS.backgroundLighter}, ${COLORS.background})`,
              borderRadius: '15px',
              padding: '15px',
              border: `1px solid ${COLORS.accent2}30`,
              animation: `fade-in 0.5s ease-out ${index * 0.1}s both`
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px'
            }}>
              <div>
                <div style={{
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.5)',
                  marginBottom: '4px'
                }}>
                  {gap.subject}
                </div>
                <div style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: 'white'
                }}>
                  {gap.skill}
                </div>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <div style={{
                  width: '80px',
                  height: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${gap.proficiency}%`,
                    backgroundColor: COLORS.accent2,
                    borderRadius: '4px'
                  }} />
                </div>
                <span style={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: COLORS.accent2
                }}>
                  {gap.proficiency}%
                </span>
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              flexWrap: 'wrap'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                color: 'rgba(255, 255, 255, 0.7)'
              }}>
                <Book size={14} />
                <span>Try:</span>
              </div>
              
              {/* Add null check and check for array before mapping */}
              {Array.isArray(gap.recommendedActivities) && gap.recommendedActivities.map(activity => (
                <div
                  key={activity.gameId}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: `${COLORS.primary}20`,
                    borderRadius: '15px',
                    fontSize: '13px',
                    color: COLORS.primary,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    cursor: 'pointer'
                  }}
                >
                  <ArrowUpRight size={14} />
                  {activity.title}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default SkillGapIndicator;