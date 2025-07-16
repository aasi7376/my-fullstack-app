// src/components/MLDebugConsole.js
import React, { useState, useEffect } from 'react';

const MLDebugConsole = ({ isActive = false, mlData = {}, difficultyHistory = [] }) => {
  const [expanded, setExpanded] = useState(false);
  const [logs, setLogs] = useState([]);
  
  // Add a log entry
  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { message, type, timestamp }]);
  };
  
  // Clear logs
  const clearLogs = () => {
    setLogs([]);
  };
  
  // Add log when ML data changes
  useEffect(() => {
    if (Object.keys(mlData).length > 0) {
      addLog(`ML Event: ${JSON.stringify(mlData)}`, 'data');
    }
  }, [mlData]);
  
  // Add log when difficulty changes
  useEffect(() => {
    if (difficultyHistory.length > 1) {
      const prev = difficultyHistory[difficultyHistory.length - 2];
      const curr = difficultyHistory[difficultyHistory.length - 1];
      
      if (curr > prev) {
        addLog(`Difficulty increased: ${Math.round(prev * 100)}% → ${Math.round(curr * 100)}%`, 'increase');
      } else if (curr < prev) {
        addLog(`Difficulty decreased: ${Math.round(prev * 100)}% → ${Math.round(curr * 100)}%`, 'decrease');
      } else {
        addLog(`Difficulty unchanged: ${Math.round(curr * 100)}%`, 'unchanged');
      }
    }
  }, [difficultyHistory]);
  
  // Add a log when component mounts
  useEffect(() => {
    addLog(`ML Debug Console Initialized, ML System ${isActive ? 'Active' : 'Inactive'}`);
    
    // Return cleanup function
    return () => {
      console.log('ML Debug Console closed');
    };
  }, [isActive]);
  
  if (!expanded) {
    return (
      <div 
        className="fixed bottom-4 right-4 bg-gray-800 text-white p-2 rounded-lg shadow-lg cursor-pointer z-50"
        onClick={() => setExpanded(true)}
      >
        <div className="flex items-center gap-2">
          <div className={`h-3 w-3 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-xs">ML Debug</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg z-50 w-96 max-h-96 flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <div className={`h-3 w-3 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <h3 className="font-bold">ML Debug Console</h3>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={clearLogs}
            className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
          >
            Clear
          </button>
          <button 
            onClick={() => setExpanded(false)}
            className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
          >
            Minimize
          </button>
        </div>
      </div>
      
      {/* ML Status */}
      <div className="bg-gray-700 p-2 rounded mb-2 text-xs">
        <div className="flex justify-between">
          <span>Status:</span>
          <span className={isActive ? 'text-green-400' : 'text-red-400'}>
            {isActive ? 'ACTIVE' : 'INACTIVE'}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Current Difficulty:</span>
          <span>
            {difficultyHistory.length > 0 
              ? `${Math.round(difficultyHistory[difficultyHistory.length - 1] * 100)}%` 
              : 'N/A'}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Rounds:</span>
          <span>{difficultyHistory.length}</span>
        </div>
      </div>
      
      {/* Difficulty Visualization */}
      {difficultyHistory.length > 0 && (
        <div className="bg-gray-700 p-2 rounded mb-2">
          <div className="text-xs mb-1">Difficulty Progression:</div>
          <div className="flex items-end h-20 w-full">
            {difficultyHistory.map((diff, index) => (
              <div 
                key={index}
                className="flex-1 mx-0.5 rounded-t"
                style={{ 
                  height: `${diff * 100}%`,
                  backgroundColor: diff < 0.3 ? '#4CAF50' : diff < 0.7 ? '#FFC107' : '#F44336'
                }}
                title={`Round ${index + 1}: ${Math.round(diff * 100)}%`}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span>Round 1</span>
            <span>Current</span>
          </div>
        </div>
      )}
      
      {/* Log Console */}
      <div className="flex-1 overflow-auto bg-gray-900 p-2 rounded text-xs font-mono">
        {logs.map((log, index) => (
          <div 
            key={index}
            className={`mb-1 ${
              log.type === 'info' ? 'text-gray-300' : 
              log.type === 'data' ? 'text-blue-400' : 
              log.type === 'increase' ? 'text-green-400' : 
              log.type === 'decrease' ? 'text-red-400' : 
              log.type === 'unchanged' ? 'text-yellow-400' : 
              'text-gray-300'
            }`}
          >
            <span className="text-gray-500">[{log.timestamp}]</span> {log.message}
          </div>
        ))}
        {logs.length === 0 && (
          <div className="text-gray-500 italic">No ML events logged yet</div>
        )}
      </div>
    </div>
  );
};

export default MLDebugConsole;