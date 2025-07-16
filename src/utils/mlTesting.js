// src/utils/mlTesting.js
// Utility functions to test if ML service is working properly

/**
 * Validates whether the ML service is correctly adjusting difficulty
 * @param {Array} difficultyHistory - Array of difficulty values over time
 * @param {Array} scores - Array of corresponding scores
 * @returns {Object} Analysis of ML service behavior
 */
export const validateMLAdaptation = (difficultyHistory, scores) => {
  if (!difficultyHistory || difficultyHistory.length < 2 || !scores || scores.length < difficultyHistory.length - 1) {
    return { 
      isValid: false, 
      message: 'Not enough data to validate ML adaptation',
      evidence: []
    };
  }
  
  const evidence = [];
  let isValid = true;
  
  // Check for last few rounds
  for (let i = 1; i < difficultyHistory.length; i++) {
    const prevDifficulty = difficultyHistory[i-1];
    const currentDifficulty = difficultyHistory[i];
    const scoreForRound = scores[i-1];
    
    // For high scores (>80%), difficulty should increase or stay the same
    if (scoreForRound > 80) {
      if (currentDifficulty < prevDifficulty) {
        evidence.push({
          round: i,
          score: scoreForRound,
          prevDifficulty,
          currentDifficulty,
          expected: 'increase or maintain',
          actual: 'decreased',
          valid: false
        });
        isValid = false;
      } else {
        evidence.push({
          round: i,
          score: scoreForRound,
          prevDifficulty,
          currentDifficulty,
          expected: 'increase or maintain',
          actual: currentDifficulty > prevDifficulty ? 'increased' : 'maintained',
          valid: true
        });
      }
    }
    // For low scores (<30%), difficulty should decrease or stay the same
    else if (scoreForRound < 30) {
      if (currentDifficulty > prevDifficulty) {
        evidence.push({
          round: i,
          score: scoreForRound,
          prevDifficulty,
          currentDifficulty,
          expected: 'decrease or maintain',
          actual: 'increased',
          valid: false
        });
        isValid = false;
      } else {
        evidence.push({
          round: i,
          score: scoreForRound,
          prevDifficulty,
          currentDifficulty,
          expected: 'decrease or maintain',
          actual: currentDifficulty < prevDifficulty ? 'decreased' : 'maintained',
          valid: true
        });
      }
    }
    // For medium scores, any adjustment is acceptable
    else {
      evidence.push({
        round: i,
        score: scoreForRound,
        prevDifficulty,
        currentDifficulty,
        expected: 'any adjustment',
        actual: currentDifficulty > prevDifficulty 
          ? 'increased' 
          : currentDifficulty < prevDifficulty 
            ? 'decreased' 
            : 'maintained',
        valid: true
      });
    }
  }
  
  return {
    isValid,
    message: isValid 
      ? 'ML service is correctly adjusting difficulty based on performance' 
      : 'ML service shows inconsistent difficulty adjustment patterns',
    evidence
  };
};

/**
 * Performs a stress test on the ML service to ensure it responds properly
 * @param {Function} mlService - The ML service object with methods
 * @param {String} userId - User ID to test with
 * @param {String} gameId - Game ID to test with
 * @returns {Promise<Object>} Test results
 */
export const performMLStressTest = async (mlService, userId, gameId) => {
  console.log('Starting ML Service Stress Test...');
  const results = {
    testsPassed: 0,
    testsFailed: 0,
    tests: []
  };
  
  try {
    // Test 1: Check if service returns valid difficulty
    try {
      console.log('Test 1: Fetching initial difficulty...');
      const initialDifficulty = await mlService.getAdaptiveDifficulty(userId, gameId);
      const isValid = initialDifficulty !== undefined && 
                      initialDifficulty !== null && 
                      typeof initialDifficulty === 'number' &&
                      initialDifficulty >= 0 && 
                      initialDifficulty <= 1;
      
      results.tests.push({
        name: 'Initial Difficulty Fetch',
        passed: isValid,
        details: { difficulty: initialDifficulty }
      });
      
      if (isValid) results.testsPassed++;
      else results.testsFailed++;
    } catch (error) {
      results.tests.push({
        name: 'Initial Difficulty Fetch',
        passed: false,
        error: error.message
      });
      results.testsFailed++;
    }
    
    // Test 2: Record a high score and see if difficulty increases
    try {
      console.log('Test 2: Recording high score interaction...');
      // Record a perfect score
      await mlService.recordInteraction({
        studentId: userId,
        gameId,
        score: 100,
        timeSpent: 60,
        completedLevel: 5,
        totalLevels: 5,
        skillsApplied: ['Skill1', 'Skill2']
      });
      
      // Get new difficulty
      const newDifficulty = await mlService.getAdaptiveDifficulty(userId, gameId);
      const initialDifficulty = results.tests[0].details?.difficulty || 0.5;
      
      results.tests.push({
        name: 'High Score Difficulty Adjustment',
        passed: newDifficulty >= initialDifficulty,
        details: { 
          initialDifficulty, 
          newDifficulty, 
          change: newDifficulty - initialDifficulty 
        }
      });
      
      if (newDifficulty >= initialDifficulty) results.testsPassed++;
      else results.testsFailed++;
    } catch (error) {
      results.tests.push({
        name: 'High Score Difficulty Adjustment',
        passed: false,
        error: error.message
      });
      results.testsFailed++;
    }
    
    // Test 3: Record a low score and see if difficulty decreases
    try {
      console.log('Test 3: Recording low score interaction...');
      // Record a low score
      await mlService.recordInteraction({
        studentId: userId,
        gameId,
        score: 10,
        timeSpent: 120,
        completedLevel: 1,
        totalLevels: 5,
        skillsApplied: ['Skill1', 'Skill2']
      });
      
      // Get new difficulty
      const difficultyShouldDecrease = await mlService.getAdaptiveDifficulty(userId, gameId);
      const previousDifficulty = results.tests[1].details?.newDifficulty || 0.5;
      
      results.tests.push({
        name: 'Low Score Difficulty Adjustment',
        passed: difficultyShouldDecrease <= previousDifficulty,
        details: { 
          previousDifficulty, 
          newDifficulty: difficultyShouldDecrease, 
          change: difficultyShouldDecrease - previousDifficulty 
        }
      });
      
      if (difficultyShouldDecrease <= previousDifficulty) results.testsPassed++;
      else results.testsFailed++;
    } catch (error) {
      results.tests.push({
        name: 'Low Score Difficulty Adjustment',
        passed: false,
        error: error.message
      });
      results.testsFailed++;
    }
    
    // Test 4: Test response time
    try {
      console.log('Test 4: Testing response time...');
      const startTime = Date.now();
      await mlService.getAdaptiveDifficulty(userId, gameId);
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      // Response should be under 500ms for good user experience
      const passed = responseTime < 500;
      
      results.tests.push({
        name: 'Response Time',
        passed,
        details: { responseTime: `${responseTime}ms` }
      });
      
      if (passed) results.testsPassed++;
      else results.testsFailed++;
    } catch (error) {
      results.tests.push({
        name: 'Response Time',
        passed: false,
        error: error.message
      });
      results.testsFailed++;
    }
    
    console.log('ML Service Stress Test Complete.');
    console.log(`Tests Passed: ${results.testsPassed}/${results.testsPassed + results.testsFailed}`);
    
    return {
      ...results,
      timestamp: new Date().toISOString(),
      overallStatus: results.testsFailed === 0 ? 'PASSED' : 'FAILED'
    };
  } catch (error) {
    console.error('ML Service Stress Test Failed:', error);
    return {
      testsPassed: 0,
      testsFailed: 1,
      tests: [{
        name: 'Overall Test Execution',
        passed: false,
        error: error.message
      }],
      timestamp: new Date().toISOString(),
      overallStatus: 'FAILED'
    };
  }
};

/**
 * ML Service health check - returns simple status
 */
export const checkMLServiceHealth = async (mlService) => {
  try {
    // Try to fetch dummy difficulty
    const dummy = await mlService.getAdaptiveDifficulty('test-user', 'test-game');
    return {
      status: 'online',
      responseReceived: true,
      validResponse: dummy !== undefined && dummy !== null && typeof dummy === 'number'
    };
  } catch (error) {
    return {
      status: 'offline',
      error: error.message,
      responseReceived: false
    };
  }
};