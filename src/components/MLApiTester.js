// src/components/MLApiTester.js
import React, { useState } from 'react';
import mlService from '../services/mlService';

const MLApiTester = () => {
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const runTest = async () => {
    setLoading(true);
    try {
      const results = await mlService.diagnostics.testConnection();
      setTestResults(results);
    } catch (error) {
      setTestResults({
        success: false,
        message: `Test error: ${error.message}`,
        error
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-4 bg-gray-800 rounded-lg max-w-md">
      <h3 className="text-white text-lg font-bold mb-2">ML API Connection Test</h3>
      
      <div className="mb-4 flex items-center">
        <button
          onClick={runTest}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Connection'}
        </button>
        
        <div className="ml-4">
          <label className="text-white text-sm flex items-center">
            <input 
              type="checkbox" 
              checked={mlService.useMock} 
              onChange={() => mlService.toggleMock()}
              className="mr-2"
            />
            Use mock service
          </label>
        </div>
      </div>
      
      {testResults && (
        <div className="mt-4 p-3 rounded border" style={{
          backgroundColor: testResults.success ? 'rgba(0, 128, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)',
          borderColor: testResults.success ? 'green' : 'red'
        }}>
          <div className="font-bold text-lg" style={{ color: testResults.success ? 'green' : 'red' }}>
            {testResults.success ? 'Success' : 'Failed'}
          </div>
          <div className="text-white">{testResults.message}</div>
          {testResults.responseTime && (
            <div className="text-gray-300 text-sm">Response time: {testResults.responseTime}ms</div>
          )}
          {testResults.data && (
            <pre className="mt-2 p-2 bg-gray-900 rounded text-xs text-gray-300 overflow-auto">
              {JSON.stringify(testResults.data, null, 2)}
            </pre>
          )}
        </div>
      )}
      
      {/* Display local storage data */}
      <div className="mt-4">
        <h4 className="text-white text-md font-bold mb-2">Local Storage Data</h4>
        <div className="grid grid-cols-2 gap-2">
          {['difficultyHistory', 'scoreHistory', 'gameInteractions', 'learningProgress'].map(key => (
            <button 
              key={key}
              onClick={() => {
                const data = localStorage.getItem(key);
                setTestResults({
                  success: !!data,
                  message: data ? `Found ${key} data` : `No ${key} data found`,
                  data: data ? JSON.parse(data) : null
                });
              }}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-xs"
            >
              View {key}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MLApiTester;