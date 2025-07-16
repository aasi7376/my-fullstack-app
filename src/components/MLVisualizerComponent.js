// src/components/MLVisualizerComponent.jsx
import React, { useState, useEffect } from 'react';
import bktService from '../services/bktService';
import mlService from '../services/mlService';

/**
 * A component that visualizes how the two ML algorithms work together
 * to provide adaptive learning experiences.
 */
const MLVisualizerComponent = ({ studentId = 'demo-user', gameId = 'math' }) => {
  const [bktData, setBktData] = useState(null);
  const [mlData, setMlData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');
  const [simulationHistory, setSimulationHistory] = useState([]);
  
  // Load data for both algorithms
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Get BKT data
        const bktState = bktService.getKnowledgeState(studentId, 'math.arithmetic');
        const bktDifficulty = bktService.getAdaptiveDifficulty(studentId, gameId);
        
        // Get ML data
        const mlPerformance = await mlService.getPerformanceData(studentId, gameId);
        const mlDifficulty = await mlService.getAdaptiveDifficulty(studentId, gameId);
        
        setBktData({
          knowledgeState: bktState,
          difficulty: bktDifficulty
        });
        
        setMlData({
          performanceData: mlPerformance,
          difficulty: mlDifficulty
        });
        
        setLoading(false);
      } catch (error) {
        console.error("Error loading ML data:", error);
        setLoading(false);
      }
    };
    
    loadData();
  }, [studentId, gameId]);
  
  // Run a simulation with different performance levels
  const runSimulation = async (performanceLevel) => {
    try {
      setLoading(true);
      
      // Get initial values
      const initialBktDifficulty = bktService.getAdaptiveDifficulty(studentId, gameId);
      const initialMlDifficulty = await mlService.getAdaptiveDifficulty(studentId, gameId);
      
      // Generate a score based on performance level (0-1)
      const score = Math.round(performanceLevel * 100);
      
      // Simulate game interaction for BKT
      const bktResult = await bktService.recordInteraction({
        studentId,
        gameId,
        score,
        questionsAnswered: 5
      });
      
      // Simulate game interaction for ML
      const mlResult = await mlService.recordInteraction({
        studentId,
        gameId,
        score,
        timeSpent: 180, // 3 minutes
        questionsAnswered: 5
      });
      
      // Get updated values
      const updatedBktDifficulty = bktService.getAdaptiveDifficulty(studentId, gameId);
      const updatedMlDifficulty = await mlService.getAdaptiveDifficulty(studentId, gameId);
      
      // Record simulation results
      const simulation = {
        timestamp: Date.now(),
        performanceLevel,
        score,
        bkt: {
          before: initialBktDifficulty,
          after: updatedBktDifficulty,
          change: updatedBktDifficulty - initialBktDifficulty
        },
        ml: {
          before: initialMlDifficulty,
          after: updatedMlDifficulty,
          change: updatedMlDifficulty - initialMlDifficulty
        },
        combined: {
          before: (initialBktDifficulty + initialMlDifficulty) / 2,
          after: (updatedBktDifficulty + updatedMlDifficulty) / 2,
          change: ((updatedBktDifficulty + updatedMlDifficulty) / 2) - ((initialBktDifficulty + initialMlDifficulty) / 2)
        }
      };
      
      // Add to simulation history
      setSimulationHistory(prev => [...prev, simulation]);
      
      // Refresh data
      setBktData({
        knowledgeState: bktService.getKnowledgeState(studentId, 'math.arithmetic'),
        difficulty: updatedBktDifficulty
      });
      
      setMlData({
        performanceData: await mlService.getPerformanceData(studentId, gameId),
        difficulty: updatedMlDifficulty
      });
      
      setLoading(false);
    } catch (error) {
      console.error("Error running simulation:", error);
      setLoading(false);
    }
  };
  
  // Format a number as a percentage
  const formatPercent = (value) => {
    return `${Math.round(value * 100)}%`;
  };
  
  // Get color based on difficulty level
  const getDifficultyColor = (difficulty) => {
    if (difficulty < 0.3) return '#4CAF50'; // Easy - Green
    if (difficulty < 0.7) return '#FFC107'; // Medium - Yellow
    return '#F44336'; // Hard - Red
  };
  
  // Get difficulty text
  const getDifficultyText = (difficulty) => {
    if (difficulty < 0.3) return 'Easy';
    if (difficulty < 0.7) return 'Medium';
    return 'Hard';
  };
  
  // Reset all data
  const resetData = async () => {
    try {
      setLoading(true);
      
      // Reset BKT
      bktService.resetAllKnowledgeStates();
      
      // Reset ML
      await mlService.resetPerformanceData();
      
      // Clear simulation history
      setSimulationHistory([]);
      
      // Reload data
      const bktState = bktService.getKnowledgeState(studentId, 'math.arithmetic');
      const bktDifficulty = bktService.getAdaptiveDifficulty(studentId, gameId);
      
      const mlPerformance = await mlService.getPerformanceData(studentId, gameId);
      const mlDifficulty = await mlService.getAdaptiveDifficulty(studentId, gameId);
      
      setBktData({
        knowledgeState: bktState,
        difficulty: bktDifficulty
      });
      
      setMlData({
        performanceData: mlPerformance,
        difficulty: mlDifficulty
      });
      
      setLoading(false);
    } catch (error) {
      console.error("Error resetting data:", error);
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        <span className="ml-3 text-lg text-purple-500">Loading ML data...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-gray-900 text-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center text-purple-400">
        Adaptive Learning ML System Visualizer
      </h2>
      
      {/* Tab Navigation */}
      <div className="flex mb-6 border-b border-gray-700">
        <button
          className={`px-4 py-2 ${tab === 'overview' ? 'border-b-2 border-purple-500 text-purple-400' : 'text-gray-400'}`}
          onClick={() => setTab('overview')}
        >
          Overview
        </button>
        <button
          className={`px-4 py-2 ${tab === 'bkt' ? 'border-b-2 border-purple-500 text-purple-400' : 'text-gray-400'}`}
          onClick={() => setTab('bkt')}
        >
          Bayesian Knowledge Tracing
        </button>
        <button
          className={`px-4 py-2 ${tab === 'ml' ? 'border-b-2 border-purple-500 text-purple-400' : 'text-gray-400'}`}
          onClick={() => setTab('ml')}
        >
          Enhanced Adaptive
        </button>
        <button
          className={`px-4 py-2 ${tab === 'simulation' ? 'border-b-2 border-purple-500 text-purple-400' : 'text-gray-400'}`}
          onClick={() => setTab('simulation')}
        >
          Simulation
        </button>
      </div>
      
      {/* Overview Tab */}
      {tab === 'overview' && (
        <div>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-blue-400">BKT Algorithm</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">Current Difficulty:</span>
                <span 
                  className="px-3 py-1 rounded-full text-black font-medium"
                  style={{ backgroundColor: getDifficultyColor(bktData.difficulty) }}
                >
                  {getDifficultyText(bktData.difficulty)} ({formatPercent(bktData.difficulty)})
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Knowledge Level:</span>
                <span className="text-green-400 font-medium">
                  {formatPercent(bktData.knowledgeState.pKnown)}
                </span>
              </div>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-cyan-400">Enhanced Adaptive</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">Current Difficulty:</span>
                <span 
                  className="px-3 py-1 rounded-full text-black font-medium"
                  style={{ backgroundColor: getDifficultyColor(mlData.difficulty) }}
                >
                  {getDifficultyText(mlData.difficulty)} ({formatPercent(mlData.difficulty)})
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Interactions:</span>
                <span className="text-cyan-400 font-medium">
                  {mlData.performanceData?.interactions?.length || 0}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-3 text-purple-400">Combined Adaptive System</h3>
            <p className="text-gray-300 mb-4">
              This system combines the Bayesian Knowledge Tracing model with the Enhanced Adaptive algorithm 
              to create a comprehensive adaptive learning experience.
            </p>
            
            <div className="mb-4">
              <div className="text-sm text-gray-400 mb-1">Combined Difficulty:</div>
              <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${((bktData.difficulty + mlData.difficulty) / 2) * 100}%`,
                    backgroundColor: getDifficultyColor((bktData.difficulty + mlData.difficulty) / 2)
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Easy</span>
                <span>Medium</span>
                <span>Hard</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm text-gray-400 mb-1">BKT Contribution:</div>
                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full"
                    style={{ 
                      width: `${bktData.difficulty * 100}%`,
                      backgroundColor: 'rgba(66, 135, 245, 0.7)'
                    }}
                  />
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-400 mb-1">Enhanced Adaptive Contribution:</div>
                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full"
                    style={{ 
                      width: `${mlData.difficulty * 100}%`,
                      backgroundColor: 'rgba(14, 203, 129, 0.7)'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">How It Works</h3>
            <p className="text-gray-300 mb-3">
              Our adaptive learning system uses two complementary algorithms:
            </p>
            
            <div className="mb-4">
              <h4 className="font-medium text-blue-400 mb-1">Bayesian Knowledge Tracing (BKT)</h4>
              <p className="text-gray-400 text-sm">
                Models student knowledge as a hidden state and updates probability estimates 
                based on observed performance. BKT tracks specific skills and concepts.
              </p>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium text-cyan-400 mb-1">Enhanced Adaptive Algorithm</h4>
              <p className="text-gray-400 text-sm">
                Focuses on performance patterns and learning progression over time, 
                with weighted recency to prioritize recent performance.
              </p>
            </div>
            
            <p className="text-purple-300 text-sm italic">
              Together, these algorithms provide a comprehensive view of student knowledge and 
              performance to dynamically adjust difficulty levels for optimal learning.
            </p>
          </div>
        </div>
      )}
      
      {/* BKT Tab */}
      {tab === 'bkt' && (
        <div>
          <div className="bg-gray-800 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-3 text-blue-400">Bayesian Knowledge Tracing Model</h3>
            
            <div className="mb-4">
              <div className="text-sm text-gray-400 mb-1">Knowledge Mastery:</div>
              <div className="h-6 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500 flex items-center pl-3"
                  style={{ 
                    width: `${bktData.knowledgeState.pKnown * 100}%`,
                    backgroundColor: 'rgba(72, 187, 120, 0.7)'
                  }}
                >
                  {bktData.knowledgeState.pKnown > 0.2 && (
                    <span className="text-xs font-medium">{formatPercent(bktData.knowledgeState.pKnown)}</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <div className="text-sm text-gray-400 mb-1">Recommended Difficulty:</div>
                <div className="h-6 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full flex items-center pl-3"
                    style={{ 
                      width: `${bktData.difficulty * 100}%`,
                      backgroundColor: getDifficultyColor(bktData.difficulty)
                    }}
                  >
                    {bktData.difficulty > 0.2 && (
                      <span className="text-xs font-medium text-black">{formatPercent(bktData.difficulty)}</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col justify-center">
                <span 
                  className="px-3 py-1 rounded-full text-center text-black font-medium inline-block"
                  style={{ backgroundColor: getDifficultyColor(bktData.difficulty) }}
                >
                  {getDifficultyText(bktData.difficulty)}
                </span>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium text-gray-300 mb-2">BKT Parameters:</h4>
              <div className="grid grid-cols-4 gap-2 text-sm">
                <div className="bg-gray-700 p-2 rounded">
                  <div className="text-gray-400">Initial (L0)</div>
                  <div className="font-medium text-blue-300">
                    {formatPercent(bktData.knowledgeState.params.pL0)}
                  </div>
                </div>
                
                <div className="bg-gray-700 p-2 rounded">
                  <div className="text-gray-400">Learning (T)</div>
                  <div className="font-medium text-blue-300">
                    {formatPercent(bktData.knowledgeState.params.pT)}
                  </div>
                </div>
                
                <div className="bg-gray-700 p-2 rounded">
                  <div className="text-gray-400">Slip (S)</div>
                  <div className="font-medium text-blue-300">
                    {formatPercent(bktData.knowledgeState.params.pS)}
                  </div>
                </div>
                
                <div className="bg-gray-700 p-2 rounded">
                  <div className="text-gray-400">Guess (G)</div>
                  <div className="font-medium text-blue-300">
                    {formatPercent(bktData.knowledgeState.params.pG)}
                  </div>
                </div>
              </div>
            </div>
            
            {bktData.knowledgeState.observations.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-300 mb-2">Observation History:</h4>
                <div className="bg-gray-700 p-2 rounded">
                  <div className="flex space-x-1 overflow-x-auto pb-2">
                    {bktData.knowledgeState.observations.slice(-10).map((obs, index) => (
                      <div 
                        key={index}
                        className="flex-shrink-0 w-8 h-8 rounded flex items-center justify-center"
                        style={{ 
                          backgroundColor: obs.correct ? 'rgba(72, 187, 120, 0.7)' : 'rgba(245, 101, 101, 0.7)',
                          opacity: 0.5 + (index / 10) * 0.5
                        }}
                        title={`${obs.correct ? 'Correct' : 'Incorrect'} - Knowledge: ${formatPercent(obs.pKnownAfter)}`}
                      >
                        {obs.correct ? '✓' : '✗'}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">How BKT Works</h3>
            <p className="text-gray-300 mb-3">
              Bayesian Knowledge Tracing uses a probabilistic model to estimate a student's knowledge state:
            </p>
            
            <div className="text-sm text-gray-400 space-y-3">
              <div className="bg-gray-700 p-3 rounded">
                <strong className="text-blue-300">Hidden State:</strong> Whether the student has mastered a skill (binary)
              </div>
              
              <div className="bg-gray-700 p-3 rounded">
                <strong className="text-blue-300">Observable State:</strong> Whether they answer questions correctly (binary)
              </div>
              
              <div className="bg-gray-700 p-3 rounded">
                <strong className="text-blue-300">Bayesian Update:</strong> After each observation (correct/incorrect answer), the probability of knowledge is updated using Bayes' rule
              </div>
              
              <div className="bg-gray-700 p-3 rounded">
                <strong className="text-blue-300">Learning Probability:</strong> Even if a student doesn't know a skill, they might learn it during practice
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* ML Tab */}
      {tab === 'ml' && (
        <div>
          <div className="bg-gray-800 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-3 text-cyan-400">Enhanced Adaptive Algorithm</h3>
            
            <div className="mb-4">
              <div className="text-sm text-gray-400 mb-1">Current Difficulty:</div>
              <div className="h-6 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500 flex items-center pl-3"
                  style={{ 
                    width: `${mlData.difficulty * 100}%`,
                    backgroundColor: getDifficultyColor(mlData.difficulty)
                  }}
                >
                  {mlData.difficulty > 0.2 && (
                    <span className="text-xs font-medium text-black">{formatPercent(mlData.difficulty)}</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex flex-col justify-center">
                <span 
                  className="px-3 py-1 rounded-full text-center text-black font-medium inline-block"
                  style={{ backgroundColor: getDifficultyColor(mlData.difficulty) }}
                >
                  {getDifficultyText(mlData.difficulty)}
                </span>
              </div>
              
              <div>
                <div className="text-sm text-gray-400 mb-1">Algorithm Constants:</div>
                <div className="text-xs grid grid-cols-2 gap-1">
                  <div className="bg-gray-700 p-1 rounded">
                    <span className="text-gray-400">Target: </span>
                    <span className="font-medium text-cyan-300">{formatPercent(mlService.constants.TARGET_SUCCESS_RATE)}</span>
                  </div>
                  <div className="bg-gray-700 p-1 rounded">
                    <span className="text-gray-400">Learn Rate: </span>
                    <span className="font-medium text-cyan-300">{mlService.constants.LEARNING_RATE}</span>
                  </div>
                  <div className="bg-gray-700 p-1 rounded">
                    <span className="text-gray-400">Recency: </span>
                    <span className="font-medium text-cyan-300">{mlService.constants.RECENCY_WEIGHT}</span>
                  </div>
                  <div className="bg-gray-700 p-1 rounded">
                    <span className="text-gray-400">Min Interact: </span>
                    <span className="font-medium text-cyan-300">{mlService.constants.MIN_INTERACTIONS}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {mlData.performanceData?.interactions && mlData.performanceData.interactions.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-300 mb-2">Performance History:</h4>
                <div className="bg-gray-700 p-2 rounded max-h-40 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs text-gray-400">
                        <th className="text-left p-1">Score</th>
                        <th className="text-left p-1">Difficulty</th>
                        <th className="text-left p-1">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...mlData.performanceData.interactions]
                        .sort((a, b) => b.timestamp - a.timestamp)
                        .map((interaction, index) => (
                          <tr key={index} className="border-t border-gray-600">
                            <td className="p-1">
                              <span 
                                className="inline-block w-10 text-center py-1 rounded text-xs font-medium"
                                style={{ backgroundColor: getDifficultyColor(interaction.score) }}
                              >
                                {formatPercent(interaction.score)}
                              </span>
                            </td>
                            <td className="p-1">
                              <span className="text-cyan-300 font-medium">{formatPercent(interaction.difficulty)}</span>
                            </td>
                            <td className="p-1 text-gray-400">
                              {new Date(interaction.timestamp).toLocaleTimeString()}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">How Enhanced Adaptive Works</h3>
            <p className="text-gray-300 mb-3">
              The Enhanced Adaptive Algorithm adjusts difficulty based on performance patterns:
            </p>
            
            <div className="text-sm text-gray-400 space-y-3">
              <div className="bg-gray-700 p-3 rounded">
                <strong className="text-cyan-300">Target Success Rate:</strong> Aims for an optimal success rate ({formatPercent(mlService.constants.TARGET_SUCCESS_RATE)}) to keep students in their Zone of Proximal Development
              </div>
              
              <div className="bg-gray-700 p-3 rounded">
                <strong className="text-cyan-300">Weighted History:</strong> Recent performance has more weight than older interactions
              </div>
              
              <div className="bg-gray-700 p-3 rounded">
                <strong className="text-cyan-300">Performance Delta:</strong> Adjusts difficulty based on how far current performance is from target
              </div>
              
              <div className="bg-gray-700 p-3 rounded">
                <strong className="text-cyan-300">Adaptive Scaling:</strong> Uses different calculation methods based on number of interactions
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Simulation Tab */}
      {tab === 'simulation' && (
        <div>
          <div className="bg-gray-800 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-3 text-purple-400">Run Simulation</h3>
            <p className="text-gray-300 mb-4">
              Simulate student performance to see how both algorithms adjust difficulty.
            </p>
            
            <div className="flex space-x-3 mb-6">
              <button
                onClick={() => runSimulation(0.3)}
                className="flex-1 py-2 px-4 bg-red-700 hover:bg-red-600 rounded text-white"
                disabled={loading}
              >
                Low Score (30%)
              </button>
              
              <button
                onClick={() => runSimulation(0.7)}
                className="flex-1 py-2 px-4 bg-yellow-600 hover:bg-yellow-500 rounded text-white"
                disabled={loading}
              >
                Average Score (70%)
              </button>
              
              <button
                onClick={() => runSimulation(0.9)}
                className="flex-1 py-2 px-4 bg-green-700 hover:bg-green-600 rounded text-white"
                disabled={loading}
              >
                High Score (90%)
              </button>
            </div>
            
            <button
              onClick={resetData}
              className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded text-gray-300"
              disabled={loading}
            >
              Reset All Data
            </button>
          </div>
          
          {simulationHistory.length > 0 && (
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Simulation Results</h3>
              <div className="max-h-80 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-gray-400 border-b border-gray-700">
                      <th className="text-left p-2">Score</th>
                      <th className="text-left p-2">BKT Change</th>
                      <th className="text-left p-2">ML Change</th>
                      <th className="text-left p-2">Combined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {simulationHistory.map((sim, index) => (
                      <tr key={index} className="border-b border-gray-700">
                        <td className="p-2">
                          <span 
                            className="inline-block w-16 text-center py-1 rounded text-xs font-medium"
                            style={{ backgroundColor: getDifficultyColor(sim.performanceLevel) }}
                          >
                            {sim.score}%
                          </span>
                        </td>
                        <td className="p-2">
                          <div className="flex items-center">
                           <span className="w-12 text-blue-300 font-medium">{formatPercent(sim.bkt.after)}</span>
                            <span className={`ml-2 ${sim.bkt.change > 0 ? 'text-green-400' : sim.bkt.change < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                              {sim.bkt.change > 0 ? '↑' : sim.bkt.change < 0 ? '↓' : '–'}
                              {sim.bkt.change !== 0 && Math.abs(sim.bkt.change * 100).toFixed(1) + '%'}
                            </span>
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="flex items-center">
                            <span className="w-12 text-cyan-300 font-medium">{formatPercent(sim.ml.after)}</span>
                            <span className={`ml-2 ${sim.ml.change > 0 ? 'text-green-400' : sim.ml.change < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                              {sim.ml.change > 0 ? '↑' : sim.ml.change < 0 ? '↓' : '–'}
                              {sim.ml.change !== 0 && Math.abs(sim.ml.change * 100).toFixed(1) + '%'}
                            </span>
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="flex items-center">
                            <span className="w-12 text-purple-300 font-medium">{formatPercent(sim.combined.after)}</span>
                            <span className={`ml-2 ${sim.combined.change > 0 ? 'text-green-400' : sim.combined.change < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                              {sim.combined.change > 0 ? '↑' : sim.combined.change < 0 ? '↓' : '–'}
                              {sim.combined.change !== 0 && Math.abs(sim.combined.change * 100).toFixed(1) + '%'}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MLVisualizerComponent;