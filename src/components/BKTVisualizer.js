import React, { useState, useEffect } from 'react';
import bktService from '../services/bktService';

// Constants for styling
const COLORS = {
  primary: '#39FF14', // Vibrant green
  secondary: '#9D00FF', // Purple
  accent1: '#1AECFF', // Cyan
  accent2: '#FF2777', // Pink
  accent3: '#F8FF00', // Yellow
  dark: '#0A0A0F',
  light: '#FFFFFF',
  gray: '#8A8A9B',
  background: '#151521',
};

/**
 * Component to visualize Bayesian Knowledge Tracing model for a student
 */
const BKTVisualizer = ({ studentId, gameId }) => {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [knowledgeStates, setKnowledgeStates] = useState({});
  const [loading, setLoading] = useState(true);
  const [testCorrect, setTestCorrect] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  
  // Map games to relevant skills
  const gameSkillMap = {
    'game1': ['math.arithmetic', 'math.algebra'],
    'game2': ['physics.mechanics', 'physics.electricity'],
    'game3': ['chemistry.periodic', 'chemistry.bonding', 'chemistry.reactions'],
    // Use same mapping for backward compatibility
    'math': ['math.arithmetic', 'math.algebra'],
    'physics': ['physics.mechanics', 'physics.electricity'],
    'chemistry': ['chemistry.periodic', 'chemistry.bonding', 'chemistry.reactions']
  };
  
  // Get the relevant skills for this game
  const skills = gameSkillMap[gameId] || [];
  
  // Get human-readable skill names
  const getSkillName = (skillId) => {
    const parts = skillId.split('.');
    if (parts.length >= 2) {
      return parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
    }
    return skillId;
  };
  
  // Load knowledge states for all skills
  useEffect(() => {
    const loadKnowledgeStates = () => {
      setLoading(true);
      
      try {
        if (skills.length === 0) {
          setLoading(false);
          return;
        }
        
        // Get knowledge states for all skills
        const states = {};
        skills.forEach(skillId => {
          states[skillId] = bktService.getKnowledgeState(studentId, skillId);
        });
        
        setKnowledgeStates(states);
        
        // Select the first skill by default
        if (!selectedSkill && skills.length > 0) {
          setSelectedSkill(skills[0]);
        }
      } catch (error) {
        console.error('Error loading knowledge states:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadKnowledgeStates();
  }, [studentId, gameId, skills, selectedSkill]);
  
  // Handle skill selection
  const handleSelectSkill = (skillId) => {
    setSelectedSkill(skillId);
  };
  
  // Handle test observation (correct/incorrect)
  const handleTestObservation = (correct) => {
    if (!selectedSkill) return;
    
    // Update the knowledge state
    const updatedState = bktService.updateKnowledge(studentId, selectedSkill, correct);
    
    // Update the state in our component
    setKnowledgeStates(prev => ({
      ...prev,
      [selectedSkill]: updatedState
    }));
  };
  
  // Format a number as a percentage
  const formatPercent = (value) => {
    return `${Math.round(value * 100)}%`;
  };
  
  // Get color based on knowledge level
  const getKnowledgeColor = (pKnown) => {
    if (pKnown < 0.3) return COLORS.accent2; // Low knowledge
    if (pKnown < 0.7) return COLORS.accent3; // Medium knowledge
    return COLORS.primary; // High knowledge
  };
  
  // Get the overall difficulty for the game
  const getGameDifficulty = () => {
    return bktService.getAdaptiveDifficulty(studentId, gameId);
  };
  
  // Render loading state
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <div 
          style={{ 
            display: 'inline-block',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            borderTop: '3px solid #9D00FF',
            borderRight: '3px solid transparent',
            animation: 'spin 1s linear infinite'
          }} 
        />
        <p style={{ marginTop: '10px', color: '#9D00FF' }}>Loading knowledge model...</p>
      </div>
    );
  }
  
  // Render no skills message
  if (skills.length === 0) {
    return (
      <div style={{ 
        padding: '20px', 
        backgroundColor: 'rgba(255, 39, 119, 0.2)', 
        border: '1px solid #FF2777', 
        borderRadius: '10px',
        color: 'white'
      }}>
        <h3 style={{ color: '#FF2777' }}>No Skills Mapped</h3>
        <p>No skills have been mapped for this game. Knowledge tracing requires skills to be defined.</p>
      </div>
    );
  }
  
  return (
    <div style={{ 
      padding: '20px',
      backgroundColor: '#151521',
      borderRadius: '15px',
      border: '1px solid rgba(157, 0, 255, 0.3)',
      color: 'white',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h3 style={{ 
          margin: 0, 
          color: '#9D00FF',
          fontSize: '18px',
          fontWeight: 'bold'
        }}>
          Bayesian Knowledge Tracing Model
        </h3>
        
        <button
          onClick={() => setShowDetails(!showDetails)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#9D00FF',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            padding: '5px'
          }}
        >
          <span style={{
            display: 'inline-block',
            marginRight: '5px',
            transform: showDetails ? 'rotate(90deg)' : 'rotate(0)',
            transition: 'transform 0.3s'
          }}>▶</span>
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>
      
      {/* Overall Game Difficulty */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '10px'
        }}>
          <div>
            <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
              Calculated Game Difficulty:
            </span>
            <span style={{ 
              marginLeft: '5px',
              color: getKnowledgeColor(getGameDifficulty()),
              fontWeight: 'bold'
            }}>
              {getGameDifficulty() < 0.3 ? 'Easy' : 
               getGameDifficulty() < 0.7 ? 'Medium' : 'Hard'}
            </span>
          </div>
          
          <div style={{ 
            fontSize: '20px', 
            fontWeight: 'bold',
            color: getKnowledgeColor(getGameDifficulty())
          }}>
            {formatPercent(getGameDifficulty())}
          </div>
        </div>
        
        {/* Progress bar */}
        <div style={{
          height: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div 
            style={{
              height: '100%',
              width: `${getGameDifficulty() * 100}%`,
              backgroundColor: getKnowledgeColor(getGameDifficulty()),
              borderRadius: '4px',
              transition: 'width 0.5s ease-out'
            }}
          />
        </div>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginTop: '5px',
          fontSize: '12px',
          color: 'rgba(255, 255, 255, 0.5)'
        }}>
          <span>Easier</span>
          <span>Balanced</span>
          <span>Harder</span>
        </div>
      </div>
      
      {/* Skill Selector */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px', color: 'rgba(255, 255, 255, 0.7)' }}>
          Select a skill to view details:
        </div>
        
        <div style={{ 
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          {skills.map(skillId => (
            <button
              key={skillId}
              onClick={() => handleSelectSkill(skillId)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: selectedSkill === skillId 
                  ? `2px solid ${getKnowledgeColor(knowledgeStates[skillId]?.pKnown || 0)}`
                  : '1px solid rgba(255, 255, 255, 0.2)',
                backgroundColor: selectedSkill === skillId
                  ? `rgba(${getKnowledgeColor(knowledgeStates[skillId]?.pKnown || 0).replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16)).join(', ')}, 0.2)`
                  : 'rgba(0, 0, 0, 0.3)',
                color: selectedSkill === skillId
                  ? getKnowledgeColor(knowledgeStates[skillId]?.pKnown || 0)
                  : 'white',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              {getSkillName(skillId)}
              <span style={{ 
                marginLeft: '8px',
                fontSize: '12px',
                fontWeight: 'bold',
                color: getKnowledgeColor(knowledgeStates[skillId]?.pKnown || 0)
              }}>
                {formatPercent(knowledgeStates[skillId]?.pKnown || 0)}
              </span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Selected Skill Details */}
      {selectedSkill && (
        <div style={{ 
          padding: '15px',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '10px',
          marginBottom: '20px',
          border: `1px solid ${getKnowledgeColor(knowledgeStates[selectedSkill]?.pKnown || 0)}30`
        }}>
          <h4 style={{ 
            margin: '0 0 15px 0',
            color: getKnowledgeColor(knowledgeStates[selectedSkill]?.pKnown || 0),
            fontSize: '16px',
            fontWeight: 'bold',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>{getSkillName(selectedSkill)} Mastery</span>
            <span>{formatPercent(knowledgeStates[selectedSkill]?.pKnown || 0)}</span>
          </h4>
        /* Continuing from where the file was cut off */

          {/* Mastery progress bar */}
          <div style={{
            height: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '5px',
            overflow: 'hidden',
            marginBottom: '15px'
          }}>
            <div 
              style={{
                height: '100%',
                width: `${(knowledgeStates[selectedSkill]?.pKnown || 0) * 100}%`,
                backgroundColor: getKnowledgeColor(knowledgeStates[selectedSkill]?.pKnown || 0),
                borderRadius: '5px',
                transition: 'width 0.5s ease-out'
              }}
            />
          </div>
          
          {/* BKT Parameters */}
          {showDetails && (
            <div style={{ marginBottom: '15px' }}>
              <h5 style={{ 
                margin: '0 0 10px 0', 
                color: COLORS.gray,
                fontSize: '14px'
              }}>
                BKT Parameters
              </h5>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '10px',
                fontSize: '12px'
              }}>
                <div>
                  <div style={{ color: COLORS.gray }}>Initial (L0)</div>
                  <div style={{ fontWeight: 'bold' }}>
                    {formatPercent(knowledgeStates[selectedSkill]?.params.pL0 || 0)}
                  </div>
                </div>
                
                <div>
                  <div style={{ color: COLORS.gray }}>Learning (T)</div>
                  <div style={{ fontWeight: 'bold' }}>
                    {formatPercent(knowledgeStates[selectedSkill]?.params.pT || 0)}
                  </div>
                </div>
                
                <div>
                  <div style={{ color: COLORS.gray }}>Slip (S)</div>
                  <div style={{ fontWeight: 'bold' }}>
                    {formatPercent(knowledgeStates[selectedSkill]?.params.pS || 0)}
                  </div>
                </div>
                
                <div>
                  <div style={{ color: COLORS.gray }}>Guess (G)</div>
                  <div style={{ fontWeight: 'bold' }}>
                    {formatPercent(knowledgeStates[selectedSkill]?.params.pG || 0)}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Observation History */}
          {showDetails && knowledgeStates[selectedSkill]?.observations.length > 0 && (
            <div style={{ marginBottom: '15px' }}>
              <h5 style={{ 
                margin: '0 0 10px 0', 
                color: COLORS.gray,
                fontSize: '14px',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span>Observation History</span>
                <span>
                  {knowledgeStates[selectedSkill]?.observations.length} records
                </span>
              </h5>
              
              <div style={{ 
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'nowrap',
                overflowX: 'auto',
                gap: '5px',
                paddingBottom: '5px'
              }}>
                {knowledgeStates[selectedSkill]?.observations.slice(-10).map((obs, index) => (
                  <div
                    key={index}
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '4px',
                      backgroundColor: obs.correct ? COLORS.primary : COLORS.accent2,
                      opacity: 0.3 + (index / 10) * 0.7,
                      flexShrink: 0
                    }}
                    title={`${obs.correct ? 'Correct' : 'Incorrect'} - Knowledge: ${formatPercent(obs.pKnownAfter)}`}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Test Controls */}
          <div>
            <h5 style={{ 
              margin: '0 0 10px 0', 
              color: COLORS.gray,
              fontSize: '14px'
            }}>
              Test the Model
            </h5>
            
            <div style={{ 
              display: 'flex',
              gap: '10px'
            }}>
              <div style={{ 
                display: 'flex',
                alignItems: 'center'
              }}>
                <input
                  type="radio"
                  id="correct"
                  name="testResult"
                  checked={testCorrect}
                  onChange={() => setTestCorrect(true)}
                  style={{ 
                    accentColor: COLORS.primary,
                    marginRight: '5px'
                  }}
                />
                <label htmlFor="correct" style={{ fontSize: '14px' }}>Correct Answer</label>
              </div>
              
              <div style={{ 
                display: 'flex',
                alignItems: 'center'
              }}>
                <input
                  type="radio"
                  id="incorrect"
                  name="testResult"
                  checked={!testCorrect}
                  onChange={() => setTestCorrect(false)}
                  style={{ 
                    accentColor: COLORS.accent2,
                    marginRight: '5px'
                  }}
                />
                <label htmlFor="incorrect" style={{ fontSize: '14px' }}>Incorrect Answer</label>
              </div>
            </div>
            
            <button
              onClick={() => handleTestObservation(testCorrect)}
              style={{
                marginTop: '10px',
                padding: '8px 15px',
                backgroundColor: testCorrect ? COLORS.primary : COLORS.accent2,
                color: 'black',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
                transition: 'all 0.2s',
                width: '100%'
              }}
            >
              Submit {testCorrect ? 'Correct' : 'Incorrect'} Answer
            </button>
          </div>
        </div>
      )}
      
      {/* Explanation */}
      <div style={{
        fontSize: '13px',
        color: COLORS.gray,
        lineHeight: '1.4',
        padding: '10px',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: '8px'
      }}>
        <p style={{ margin: '0 0 10px 0' }}>
          <strong>How it works:</strong> Bayesian Knowledge Tracing models student knowledge as a hidden state and updates the probability a student knows each skill based on their observed performance.
        </p>
        
        {showDetails && (
          <>
            <p style={{ margin: '0 0 10px 0' }}>
              <strong>Parameters:</strong>
              <ul style={{ margin: '5px 0 0 20px', padding: 0 }}>
                <li><strong>Initial (L0):</strong> Starting probability of knowing the skill</li>
                <li><strong>Learning (T):</strong> Probability of transitioning from not knowing to knowing</li>
                <li><strong>Slip (S):</strong> Probability of answering incorrectly despite knowing the skill</li>
                <li><strong>Guess (G):</strong> Probability of answering correctly despite not knowing the skill</li>
              </ul>
            </p>
            <p style={{ margin: '0' }}>
              <strong>Adaptive difficulty:</strong> The system calculates appropriate challenge levels based on the student's current mastery level across all relevant skills for a game.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default BKTVisualizer;