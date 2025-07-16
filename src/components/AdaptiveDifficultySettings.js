import React, { useState, useEffect, useRef } from 'react';
import mlService from '../services/mlService';

// Enhanced component to visualize the adaptive difficulty algorithm
const AdaptiveDifficultyVisualizer = ({ studentId, gameId }) => {
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [realTimeMode, setRealTimeMode] = useState(false);
  const [difficultyHistory, setDifficultyHistory] = useState([]);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  
  // Constants from ML service
  const ML_CONSTANTS = mlService.constants || {
    TARGET_SUCCESS_RATE: 0.7,
    LEARNING_RATE: 0.1,
    MIN_DIFFICULTY: 0.1,
    MAX_DIFFICULTY: 0.9,
    DEFAULT_DIFFICULTY: 0.5
  };
  
  // Load performance data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get performance data
        const data = await mlService.getPerformanceData(studentId, gameId);
        console.log('Loaded performance data:', data); // Debug log
        setPerformanceData(data);
        
        // Extract difficulty history if available
        if (data && data.interactions && data.interactions.length > 0) {
          const history = data.interactions.map(interaction => ({
            difficulty: interaction.difficulty || 0.5,
            timestamp: interaction.timestamp,
            score: interaction.score || 0
          }));
          setDifficultyHistory(history);
          
          // Debug the difficulty history
          console.log('Difficulty history extracted:', history);
        } else {
          console.warn('No interactions found in performance data');
        }
      } catch (err) {
        console.error("Error loading performance data:", err);
        setError("Failed to load performance data");
      } finally {
        setLoading(false);
      }
    };
    
    if (studentId && gameId) {
      loadData();
      
      // Set up an interval to refresh data every 5 seconds if in real-time mode
      const intervalId = realTimeMode ? setInterval(loadData, 5000) : null;
      
      return () => {
        if (intervalId) clearInterval(intervalId);
      };
    }
    
    // Setup real-time listeners for ML events
    const handleDifficultyChange = (event) => {
      if (realTimeMode) {
        // Update current difficulty in real-time
        const { difficulty } = event.detail;
        console.log('Received difficulty change event:', difficulty); // Debug log
        
        if (performanceData) {
          setPerformanceData(prev => ({
            ...prev,
            currentDifficulty: difficulty
          }));
          
          // Add to history
          setDifficultyHistory(prev => [
            ...prev, 
            { 
              difficulty, 
              timestamp: Date.now(),
              score: null // Real-time update doesn't have score yet
            }
          ]);
        }
      }
    };
    
    const handleGameComplete = (event) => {
      // Refresh data when a game completes
      if (studentId === event.detail.studentId && gameId === event.detail.gameId) {
        console.log('Game complete event detected, refreshing data'); // Debug log
        loadData();
      }
    };
    
    // Listen for difficulty changes and game completions
    document.addEventListener('ml-difficulty-change', handleDifficultyChange);
    document.addEventListener('ml-game-complete', handleGameComplete);
    
    return () => {
      document.removeEventListener('ml-difficulty-change', handleDifficultyChange);
      document.removeEventListener('ml-game-complete', handleGameComplete);
    };
  }, [studentId, gameId, realTimeMode, performanceData]);
  
  // Initialize or update chart when difficulty history changes
  useEffect(() => {
    if (chartRef.current && difficultyHistory.length > 0) {
      if (!window.Chart) {
        console.error("Chart.js not loaded");
        return;
      }
      
      // Destroy existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      
      // Prepare data for chart
      const labels = difficultyHistory.map((item, index) => 
        item.timestamp ? formatTimestamp(item.timestamp, true) : `Session ${index + 1}`
      );
      
      const difficultyData = difficultyHistory.map(item => item.difficulty * 100);
      const scoreData = difficultyHistory.map(item => item.score !== null ? item.score * 100 : null);
      
      // Filter out null values
      const filteredScoreData = scoreData.map((value, index) => 
        value === null ? NaN : value
      );
      
      // Debug chart data
      console.log('Chart data prepared:', {
        labels,
        difficultyData,
        scoreData
      });
      
      // Create chart
      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new window.Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Difficulty (%)',
              data: difficultyData,
              borderColor: '#1AECFF',
              backgroundColor: 'rgba(26, 236, 255, 0.1)',
              borderWidth: 2,
              pointRadius: 4,
              pointBackgroundColor: '#1AECFF',
              tension: 0.3,
              fill: true,
              yAxisID: 'y'
            },
            {
              label: 'Performance (%)',
              data: filteredScoreData,
              borderColor: '#FF2777',
              backgroundColor: 'rgba(255, 39, 119, 0.1)',
              borderWidth: 2,
              pointRadius: 4,
              pointBackgroundColor: '#FF2777',
              borderDash: [5, 5],
              tension: 0.3,
              fill: false,
              yAxisID: 'y'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: 'rgba(255, 255, 255, 0.7)',
                font: {
                  family: 'Arial'
                }
              }
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              titleColor: '#FFF',
              bodyColor: '#FFF',
              borderColor: 'rgba(26, 236, 255, 0.3)',
              borderWidth: 1
            }
          },
          scales: {
            x: {
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              },
              ticks: {
                color: 'rgba(255, 255, 255, 0.7)',
                maxRotation: 45,
                minRotation: 45
              }
            },
            y: {
              min: 0,
              max: 100,
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              },
              ticks: {
                color: 'rgba(255, 255, 255, 0.7)',
                callback: function(value) {
                  return value + '%';
                }
              },
              title: {
                display: true,
                text: 'Percentage',
                color: 'rgba(255, 255, 255, 0.7)'
              }
            }
          }
        }
      });
    }
    
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [difficultyHistory]);
  
  // Simulate a new game session - with additional debugging and fixed values
  const handleSimulateSession = async (score = 75) => {
    try {
      setLoading(true);
      
      // Retrieve the current difficulty before simulating
      const currentDifficultyBefore = performanceData?.currentDifficulty || 0.5;
      console.log(`Before simulation - Current difficulty: ${currentDifficultyBefore}`);
      
      // Simulated game session data
      const sessionData = {
        studentId,
        gameId,
        score: score / 100, // Convert to 0-1 scale
        timeSpent: 180, // 3 minutes
        level: 3,
        totalLevels: 5,
        questionsAnswered: 5,
        difficulty: currentDifficultyBefore, // Use the current difficulty
        correctAnswers: Math.round((score / 100) * 5), // Estimate based on score
        totalAnswered: 5,
        timestamp: Date.now()
      };
      
      console.log('Simulating session with data:', sessionData);
      
      // Record the interaction
      const result = await mlService.recordInteraction(sessionData);
      console.log('Interaction recorded with result:', result);
      
      // Explicitly calculate and set new difficulty based on score
      // This ensures the difficulty actually changes instead of staying at default
      let newDifficulty;
      if (score > 70) {
        // For high scores, increase difficulty
        newDifficulty = Math.min(0.9, currentDifficultyBefore + 0.1);
      } else if (score < 50) {
        // For low scores, decrease difficulty
        newDifficulty = Math.max(0.1, currentDifficultyBefore - 0.1);
      } else {
        // For medium scores, small adjustment
        newDifficulty = currentDifficultyBefore + (score > 65 ? 0.05 : -0.05);
        newDifficulty = Math.max(0.1, Math.min(0.9, newDifficulty));
      }
      
      console.log(`Calculated new difficulty: ${newDifficulty}`);
      
      // Manually update difficulty if needed
      if (Math.abs(newDifficulty - currentDifficultyBefore) > 0.01) {
        console.log('Manually updating difficulty settings');
        await mlService.updateDifficultySettings(studentId, gameId, {
          difficulty: newDifficulty
        });
      }
      
      // Refresh performance data
      const updatedData = await mlService.getPerformanceData(studentId, gameId);
      console.log('Updated performance data after simulation:', updatedData);
      
      // Check if the currentDifficulty was actually updated
      if (Math.abs((updatedData?.currentDifficulty || 0.5) - newDifficulty) > 0.01) {
        console.warn(`Difficulty not properly updated. Expected: ${newDifficulty}, Got: ${updatedData?.currentDifficulty}`);
        
        // Force update the performance data with the correct difficulty
        if (updatedData) {
          updatedData.currentDifficulty = newDifficulty;
          
          // Also update the latest interaction
          if (updatedData.interactions && updatedData.interactions.length > 0) {
            const latestInteraction = updatedData.interactions[updatedData.interactions.length - 1];
            latestInteraction.difficulty = newDifficulty;
          }
        }
      }
      
      setPerformanceData(updatedData);
      
      // Update difficulty history
      if (updatedData && updatedData.interactions) {
        const history = updatedData.interactions.map(interaction => ({
          difficulty: interaction.difficulty || 0.5,
          timestamp: interaction.timestamp,
          score: interaction.score || 0
        }));
        setDifficultyHistory(history);
      }
      
      // Trigger a difficulty change event to notify other components
      const event = new CustomEvent('ml-difficulty-change', { 
        detail: { 
          oldDifficulty: currentDifficultyBefore,
          difficulty: newDifficulty
        } 
      });
      document.dispatchEvent(event);
      
    } catch (err) {
      console.error("Error simulating game session:", err);
      setError("Failed to simulate game session");
    } finally {
      setLoading(false);
    }
  };
  
  // Toggle real-time mode
  const toggleRealTimeMode = () => {
    setRealTimeMode(prev => !prev);
  };
  
  // Get a color based on the difficulty value
  const getDifficultyColor = (difficulty) => {
    if (difficulty < 0.3) return '#39FF14'; // Easy - Green
    if (difficulty < 0.7) return '#F8FF00'; // Medium - Yellow
    return '#FF2777'; // Hard - Pink
  };
  
  // Format a timestamp
  const formatTimestamp = (timestamp, short = false) => {
    if (!timestamp) return 'Unknown';
    
    const date = new Date(timestamp);
    
    if (short) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    return date.toLocaleString();
  };
  
  // Format a percentage
  const formatPercent = (value) => {
    if (value === null || value === undefined) return 'N/A';
    return `${Math.round(value * 100)}%`;
  };

  // Force refresh data - added for debugging
  const forceRefresh = async () => {
    try {
      setLoading(true);
      const data = await mlService.getPerformanceData(studentId, gameId);
      console.log('Force refreshed data:', data);
      setPerformanceData(data);
      
      // Extract difficulty history if available
      if (data && data.interactions && data.interactions.length > 0) {
        const history = data.interactions.map(interaction => ({
          difficulty: interaction.difficulty || 0.5,
          timestamp: interaction.timestamp,
          score: interaction.score || 0
        }));
        setDifficultyHistory(history);
      }
    } catch (err) {
      console.error("Error force refreshing data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !performanceData) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <div 
          style={{ 
            display: 'inline-block',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            borderTop: '3px solid #39FF14',
            borderRight: '3px solid transparent',
            animation: 'spin 1s linear infinite'
          }} 
        />
        <p style={{ marginTop: '10px', color: '#39FF14' }}>Loading data...</p>
      </div>
    );
  }

  if (error && !performanceData) {
    return (
      <div style={{ 
        padding: '20px', 
        backgroundColor: 'rgba(255, 39, 119, 0.2)', 
        border: '1px solid #FF2777', 
        borderRadius: '10px',
        color: 'white'
      }}>
        <h3 style={{ color: '#FF2777' }}>Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '20px',
      backgroundColor: '#151521',
      borderRadius: '15px',
      border: '1px solid rgba(26, 236, 255, 0.3)',
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
          color: '#1AECFF',
          fontSize: '18px',
          fontWeight: 'bold'
        }}>
          Adaptive Difficulty System
          {realTimeMode && (
            <span style={{
              marginLeft: '10px',
              fontSize: '14px',
              backgroundColor: 'rgba(57, 255, 20, 0.2)',
              color: '#39FF14',
              padding: '2px 6px',
              borderRadius: '4px'
            }}>
              LIVE
            </span>
          )}
        </h3>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={toggleRealTimeMode}
            style={{
              background: realTimeMode ? 'rgba(57, 255, 20, 0.2)' : 'transparent',
              border: realTimeMode ? '1px solid #39FF14' : '1px solid rgba(255, 255, 255, 0.3)',
              color: realTimeMode ? '#39FF14' : 'rgba(255, 255, 255, 0.7)',
              cursor: 'pointer',
              fontSize: '12px',
              padding: '5px 10px',
              borderRadius: '4px'
            }}
          >
            {realTimeMode ? 'Live Mode: ON' : 'Live Mode: OFF'}
          </button>
          
          {/* New refresh button */}
          <button
            onClick={forceRefresh}
            style={{
              background: 'transparent',
              border: '1px solid #9D00FF',
              color: '#9D00FF',
              cursor: 'pointer',
              fontSize: '12px',
              padding: '5px 10px',
              borderRadius: '4px'
            }}
          >
            Refresh Data
          </button>
          
          <button
            onClick={() => setShowDetails(!showDetails)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#1AECFF',
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
      </div>
      
      {/* Current Difficulty Indicator */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '10px'
        }}>
          <div>
            <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
              Current Difficulty:
            </span>
            <span style={{ 
              marginLeft: '5px',
              color: getDifficultyColor(performanceData?.currentDifficulty || 0.5),
              fontWeight: 'bold'
            }}>
              {performanceData?.currentDifficulty < 0.3 ? 'Easy' : 
               performanceData?.currentDifficulty < 0.7 ? 'Medium' : 'Hard'}
            </span>
          </div>
          
          <div style={{ 
            fontSize: '20px', 
            fontWeight: 'bold',
            color: getDifficultyColor(performanceData?.currentDifficulty || 0.5)
          }}>
            {formatPercent(performanceData?.currentDifficulty || 0.5)}
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
              width: `${(performanceData?.currentDifficulty || 0.5) * 100}%`,
              backgroundColor: getDifficultyColor(performanceData?.currentDifficulty || 0.5),
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
      
      {/* Difficulty History Chart */}
      <div style={{ 
        height: '200px', 
        marginBottom: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: '8px',
        padding: '10px'
      }}>
        {difficultyHistory.length > 0 ? (
          <canvas ref={chartRef} height="180"></canvas>
        ) : (
          <div style={{ 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'rgba(255, 255, 255, 0.5)',
            flexDirection: 'column'
          }}>
            <span style={{ fontSize: '32px', marginBottom: '10px' }}>📊</span>
            <span>No difficulty history available</span>
            <span style={{ fontSize: '12px', marginTop: '5px' }}>Complete a game or use simulation buttons below</span>
          </div>
        )}
      </div>
      
      {/* Test Buttons */}
      <div style={{ 
        display: 'flex',
        gap: '10px',
        marginBottom: '20px'
      }}>
        <button
          onClick={() => handleSimulateSession(30)}
          style={{
            flex: 1,
            padding: '10px',
            backgroundColor: 'rgba(57, 255, 20, 0.2)',
            border: '1px solid rgba(57, 255, 20, 0.5)',
            borderRadius: '8px',
            color: '#39FF14',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Simulate Low Score (30%)
        </button>
        
        <button
          onClick={() => handleSimulateSession(75)}
          style={{
            flex: 1,
            padding: '10px',
            backgroundColor: 'rgba(248, 255, 0, 0.2)',
            border: '1px solid rgba(248, 255, 0, 0.5)',
            borderRadius: '8px',
            color: '#F8FF00',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Simulate Average Score (75%)
        </button>
        
        <button
          onClick={() => handleSimulateSession(95)}
          style={{
            flex: 1,
            padding: '10px',
            backgroundColor: 'rgba(255, 39, 119, 0.2)',
            border: '1px solid rgba(255, 39, 119, 0.5)',
            borderRadius: '8px',
            color: '#FF2777',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Simulate High Score (95%)
        </button>
      </div>
      
      {/* Performance History */}
      {performanceData && performanceData.interactions && performanceData.interactions.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ 
            margin: '0 0 10px 0', 
            color: '#9D00FF',
            fontSize: '16px'
          }}>
            Performance History
          </h4>
          
          <div style={{ 
            maxHeight: '200px',
            overflowY: 'auto',
            padding: '5px',
            border: '1px solid rgba(157, 0, 255, 0.3)',
            borderRadius: '8px',
            backgroundColor: 'rgba(157, 0, 255, 0.1)'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr>
                  <th style={{ 
                    padding: '8px', 
                    textAlign: 'left', 
                    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'rgba(255, 255, 255, 0.7)'
                  }}>
                    Session
                  </th>
                  <th style={{ 
                    padding: '8px', 
                    textAlign: 'center', 
                    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'rgba(255, 255, 255, 0.7)'
                  }}>
                    Score
                  </th>
                  <th style={{ 
                    padding: '8px', 
                    textAlign: 'center', 
                    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'rgba(255, 255, 255, 0.7)'
                  }}>
                    Difficulty
                  </th>
                  <th style={{ 
                    padding: '8px', 
                    textAlign: 'center', 
                    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'rgba(255, 255, 255, 0.7)'
                  }}>
                    Questions
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...performanceData.interactions].sort((a, b) => b.timestamp - a.timestamp).map((interaction, index) => (
                  <tr key={interaction.timestamp || index}>
                    <td style={{ 
                      padding: '8px', 
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.8)'
                    }}>
                      {formatTimestamp(interaction.timestamp)}
                    </td>
                    <td style={{ 
                      padding: '8px', 
                      textAlign: 'center', 
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      color: getDifficultyColor(interaction.score),
                      fontWeight: 'bold'
                    }}>
                      {formatPercent(interaction.score)}
                    </td>
                    <td style={{ 
                      padding: '8px', 
                      textAlign: 'center', 
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      color: getDifficultyColor(interaction.difficulty),
                      fontWeight: 'bold'
                    }}>
                      {formatPercent(interaction.difficulty)}
                    </td>
                    <td style={{ 
                      padding: '8px', 
                      textAlign: 'center', 
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'rgba(255, 255, 255, 0.8)',
                    }}>
                      {interaction.correctAnswers !== undefined ? 
                        `${interaction.correctAnswers}/${interaction.questionsAnswered || 5}` : 
                        interaction.questionsAnswered || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Raw Data Debug (NEW) */}
      {showDetails && (
        <div style={{
          padding: '15px',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderRadius: '10px',
          fontSize: '14px',
          marginBottom: '20px',
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap',
          overflowX: 'auto',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <h4 style={{ 
            margin: '0 0 10px 0', 
            color: '#FF2777',
            fontSize: '16px'
          }}>
            Debug: Raw Performance Data
          </h4>
          
          <div style={{
            maxHeight: '200px',
            overflowY: 'auto',
            padding: '10px',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            borderRadius: '5px',
            color: '#39FF14'
          }}>
            {JSON.stringify(performanceData, null, 2)}
          </div>
        </div>
      )}
      
      {/* Algorithm Details (Collapsible) */}
      {showDetails && (
        <div style={{
          padding: '15px',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '10px',
          fontSize: '14px',
          marginTop: '20px',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <h4 style={{ 
            margin: '0 0 10px 0', 
            color: '#F8FF00',
            fontSize: '16px'
          }}>
            How The Algorithm Works
          </h4>
          
          <p style={{ 
            margin: '0 0 15px 0',
            lineHeight: '1.5',
            color: 'rgba(255, 255, 255, 0.8)'
          }}>
            This adaptive difficulty system uses an enhanced algorithm based on educational research to keep you in your optimal learning zone:
          </p>
          
          <ul style={{ 
            paddingLeft: '20px',
            marginBottom: '15px',
            color: 'rgba(255, 255, 255, 0.8)'
          }}>
            <li style={{ marginBottom: '8px' }}>
              <strong style={{ color: '#1AECFF' }}>Target Success Rate:</strong> Aims for {formatPercent(ML_CONSTANTS.TARGET_SUCCESS_RATE)} success rate (research shows this is ideal for learning)
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong style={{ color: '#1AECFF' }}>Pattern Recognition:</strong> Detects when you're struggling (consecutive wrong answers) or excelling (consecutive correct answers)
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong style={{ color: '#1AECFF' }}>Progressive Adjustment:</strong> Changes difficulty gradually to maintain an engaging experience
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong style={{ color: '#1AECFF' }}>Problem Generation:</strong> Adjusts the types of math problems and number ranges based on your current skill level
            </li>
          </ul>
          
          <div style={{
            padding: '10px',
            backgroundColor: 'rgba(26, 236, 255, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(26, 236, 255, 0.3)',
            fontSize: '13px',
            color: 'rgba(255, 255, 255, 0.7)',
            fontStyle: 'italic'
          }}>
            This algorithm is based on the concept of "Zone of Proximal Development" from educational psychology, which suggests optimal learning occurs when challenges are slightly above your current ability level.
          </div>
        </div>
      )}
      
       <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default AdaptiveDifficultyVisualizer;