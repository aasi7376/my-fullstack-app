// src/games/MathGame.js - Fixed version to properly handle difficulty and Phaser errors
import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import '../styles/GameStyles.css';
import mlService from '../services/mlService'; // Import ML service

// Debug mode for logging
const DEBUG_MODE = true;
const debugLog = (...args) => {
  if (DEBUG_MODE) {
    console.log('[MathGame]', ...args);
  }
};

// Math Game Component that uses Phaser
const MathGame = ({ difficulty = 0.5, initialLevel = 1, onComplete, gameRef, studentId = 'test-user' }) => {
  const gameContainerRef = useRef(null);

  // Setup and cleanup game on component mount/unmount
  useEffect(() => {
    if (!gameContainerRef.current) {
      console.error('Game container ref is not available');
      return;
    }
    
    debugLog('Initializing math game with container:', gameContainerRef.current);
    debugLog('Initial difficulty prop:', difficulty);
    debugLog('Initial level:', initialLevel);
    debugLog('Student ID:', studentId);
    
    // Initialize or update the ML service with student info
    if (typeof mlService.initializeStudent === 'function') {
      mlService.initializeStudent(studentId);
    }
    
    // Set ML to active when game component mounts
    mlService.forceActive();
    
    // =========================================================
    // Define all game functions outside the scene configuration
    // =========================================================
    
    // Create game textures function - FIXED to handle errors gracefully
    function createGameTextures(scene) {
      try {
        debugLog('Creating game textures programmatically');
        
        // Set ML to active during texture creation
        mlService.forceActive();
        
        // Make sure scene graphics is available
        if (!scene || !scene.make || !scene.make.graphics) {
          console.error('Scene or scene.make.graphics is not available');
          return false;
        }
        
        // Create background
        const bgGraphics = scene.make.graphics();
        if (!bgGraphics) {
          console.error('Failed to create background graphics');
          return false;
        }
        
        // Create a dark starry background
        bgGraphics.fillGradientStyle(0x0a2000, 0x0a2000, 0x153000, 0x153000, 1);
        bgGraphics.fillRect(0, 0, 800, 600);
        
        // Add some stars
        for (let i = 0; i < 200; i++) {
          const x = Phaser.Math.Between(0, 800);
          const y = Phaser.Math.Between(0, 600);
          const size = Phaser.Math.Between(1, 3);
          const alpha = Phaser.Math.FloatBetween(0.3, 1);
          
          bgGraphics.fillStyle(0xffffff, alpha);
          bgGraphics.fillCircle(x, y, size);
        }
        
        bgGraphics.generateTexture('background', 800, 600);
        bgGraphics.clear();
        
        // Create button texture
        const buttonGraphics = scene.make.graphics();
        buttonGraphics.fillStyle(0x4e73be);
        buttonGraphics.fillRoundedRect(0, 0, 190, 45, 10);
        buttonGraphics.lineStyle(2, 0x3762b7);
        buttonGraphics.strokeRoundedRect(0, 0, 190, 45, 10);
        buttonGraphics.generateTexture('button', 190, 45);
        buttonGraphics.clear();
        
        // Create hover button texture
        buttonGraphics.fillStyle(0x5c8ced);
        buttonGraphics.fillRoundedRect(0, 0, 190, 45, 10);
        buttonGraphics.lineStyle(2, 0x4b7ddc);
        buttonGraphics.strokeRoundedRect(0, 0, 190, 45, 10);
        buttonGraphics.generateTexture('buttonHover', 190, 45);
        buttonGraphics.clear();
        
        // Create panel texture
        buttonGraphics.fillStyle(0x3c3c3c);
        buttonGraphics.fillRoundedRect(0, 0, 300, 200, 10);
        buttonGraphics.lineStyle(2, 0x666666);
        buttonGraphics.strokeRoundedRect(0, 0, 300, 200, 10);
        buttonGraphics.generateTexture('panel', 300, 200);
        buttonGraphics.clear();
        
        // Create particle texture
        const particleGraphics = scene.make.graphics();
        particleGraphics.fillStyle(0xffff00);
        particleGraphics.fillCircle(16, 16, 16);
        particleGraphics.generateTexture('particle', 32, 32);
        particleGraphics.clear();
        
        debugLog('Game textures created successfully');
        return true;
      } catch (error) {
        console.error('Error creating game textures:', error);
        return false;
      }
    }
    
    // Generate a problem function
    function generateProblem(scene) {
      try {
        // Set ML to active when generating problems
        mlService.forceActive();
        
        // Safety check for scene
        if (!scene || !scene.add) {
          console.error('Scene is not properly initialized in generateProblem');
          return;
        }
        
        // Check if we've reached 5 questions
        if (scene.questionsAnswered >= 5) {
          endGame(scene); // End the game after 5 questions
          return;
        }
        
        // Update question counter display
        if (scene.questionsText) {
          scene.questionsText.setText(`Question: ${scene.questionsAnswered + 1}/5`);
        }
        
        // Clear any existing problem
        scene.currentProblem = null;
        
        // Generate a math problem based on difficulty
        const operators = ['+', '-', '*', '/'];
        
        // Log the current difficulty being used for this problem
        debugLog(`Generating problem with difficulty: ${scene.gameDifficulty.toFixed(2)}`);
        
        // Adjust operator availability and number range based on difficulty
        let availableOperators;
        let numRange;
        
        if (scene.gameDifficulty < 0.3) {
          // Easy: just addition and subtraction with small numbers
          availableOperators = operators.slice(0, 2);
          numRange = { min: 1, max: 10 };
          debugLog('Using EASY difficulty settings (+ and - operations with numbers 1-10)');
        } else if (scene.gameDifficulty < 0.7) {
          // Medium: add multiplication with medium numbers
          availableOperators = operators.slice(0, 3);
          numRange = { min: 1, max: 20 };
          debugLog('Using MEDIUM difficulty settings (+, -, * operations with numbers 1-20)');
        } else {
          // Hard: all operators with larger numbers
          availableOperators = operators;
          numRange = { min: 1, max: 50 };
          debugLog('Using HARD difficulty settings (all operations with numbers 1-50)');
        }
        
        // Helper function to get random number
        const randomNum = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
        
        // Select operator
        const operator = availableOperators[Math.floor(Math.random() * availableOperators.length)];
        debugLog(`Selected operator: ${operator}`);
        
        // Generate numbers
        let num1, num2, answer;
        
        switch (operator) {
          case '+':
            num1 = randomNum(numRange.min, numRange.max);
            num2 = randomNum(numRange.min, numRange.max);
            answer = num1 + num2;
            break;
          case '-':
            // Ensure positive answer
            num1 = randomNum(numRange.min, numRange.max);
            num2 = randomNum(numRange.min, num1);
            answer = num1 - num2;
            break;
          case '*':
            // Adjust for multiplication to keep it reasonable
            num1 = randomNum(2, Math.min(12, numRange.max));
            num2 = randomNum(2, Math.min(12, numRange.max));
            answer = num1 * num2;
            break;
          case '/':
            // Ensure clean division
            num2 = randomNum(2, Math.min(10, numRange.max));
            answer = randomNum(1, Math.min(10, numRange.max));
            num1 = num2 * answer;
            break;
        }
        
        debugLog(`Generated problem: ${num1} ${operator} ${num2} = ${answer}`);
        
        // Format the problem text
        const problemString = `${num1} ${operator} ${num2} = ?`;
        if (scene.problemText) {
          scene.problemText.setText(problemString);
        }
        
        // Store the problem data
        scene.currentProblem = {
          text: problemString,
          answer: answer,
          operator: operator,
          difficulty: scene.gameDifficulty // Store current difficulty with the problem
        };
        
        // Generate answer options
        generateAnswerOptions(scene, answer);
      } catch (error) {
        console.error('Error in generateProblem:', error);
      }
    }
    
    // Generate answer options function - Made more resilient
    function generateAnswerOptions(scene, correctAnswer) {
      try {
        // Set ML to active during answer generation
        mlService.forceActive();
        
        // Safety check
        if (!scene || !scene.add) {
          console.error('Scene is not properly initialized in generateAnswerOptions');
          return;
        }
        
        // Create an array with the correct answer and three wrong answers
        const answers = [correctAnswer];
        
        // Generate three wrong answers
        while (answers.length < 4) {
          // Create a wrong answer that's somewhat close to the correct one
          const offset = Math.floor(Math.random() * 10) + 1;
          const wrongAnswer = Math.random() < 0.5 
            ? correctAnswer + offset 
            : Math.max(1, correctAnswer - offset);
          
          // Ensure no duplicates
          if (!answers.includes(wrongAnswer)) {
            answers.push(wrongAnswer);
          }
        }
        
        // Shuffle the answers
        for (let i = answers.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [answers[i], answers[j]] = [answers[j], answers[i]];
        }
        
        // Store the correct answer's position
        scene.correctAnswerIndex = answers.indexOf(correctAnswer);
        
        // First check if buttons exist
        if (!scene.answerButtons || scene.answerButtons.length !== 4) {
          console.error('Answer buttons not properly initialized');
          return;
        }
        
        // Update the answer buttons
        scene.answerButtons.forEach((buttonObj, index) => {
          // Check if this button object is valid
          if (!buttonObj || !buttonObj.button) {
            console.error(`Button object at index ${index} is invalid`);
            return;
          }
          
          // Clear any existing text
          if (buttonObj.text) {
            buttonObj.text.destroy();
          }
          
          // Ensure button is visible with the correct texture
          buttonObj.button.setTexture('button');
          buttonObj.button.setVisible(true);
          
          // Create new text with more explicit settings
          buttonObj.text = scene.add.text(buttonObj.button.x, buttonObj.button.y, answers[index].toString(), { 
            fontSize: '32px', 
            fontFamily: 'Arial, sans-serif',
            color: '#000000',
            fontStyle: 'bold'
          }).setOrigin(0.5);
          
          // Ensure text is above the button in the display list
          scene.children.bringToTop(buttonObj.text);
          
          // Set up the click handler
          buttonObj.button.off('pointerdown'); // Remove previous listener
          buttonObj.button.on('pointerdown', () => {
            checkAnswer(scene, index);
          });
        });
      } catch (error) {
        console.error('Error in generateAnswerOptions:', error);
      }
    }
    
    // Configure Phaser game
    const config = {
      type: Phaser.AUTO,
      parent: gameContainerRef.current,
      width: 800,
      height: 600,
      backgroundColor: '#1a3d00', // Dark green background
      scene: {
        init: function() {
          try {
            debugLog('Math scene init called');
            
            // Store props in the scene
            this.studentId = studentId; 
            this.onGameComplete = onComplete;
            this.gameSkills = ['Arithmetic', 'Problem Solving', 'Quick Thinking'];
            
            // IMPORTANT FIX: Retrieve the actual difficulty from ML service first, then use props as fallback
            this.loadingDifficulty = true; // Flag to indicate difficulty is being loaded
            
            // Default to prop value while loading
            this.gameDifficulty = difficulty;
            this.level = initialLevel;
            
            // Set ML to active during initialization
            mlService.forceActive();
            
            // Assign scene to window for debugging
            window.gameScene = this;
            
            // Log the initialized values for debugging
            debugLog(`Initial values - Difficulty: ${this.gameDifficulty}, Level: ${this.level}`);
          } catch (error) {
            console.error('Error in scene init:', error);
          }
        },
        preload: function() {
          try {
            debugLog('Math game preload function called');
            
            // Set ML to active during preload
            mlService.forceActive();
            
            // Use the external function to create textures, passing 'this' as the scene
            if (!createGameTextures(this)) {
              console.error('Failed to create game textures');
            }
          } catch (error) {
            console.error('Error in scene preload:', error);
          }
        },
        create: async function() {
          try {
            debugLog('Math game create function called');
            debugLog('Scene is running:', this.scene.isActive());
            
            // Check if scene is valid
            if (!this || !this.add) {
              console.error('Scene is not properly initialized in create');
              return;
            }
            
            // Set ML to active during create
            mlService.forceActive();
            
            // IMPORTANT FIX: Load the actual difficulty from ML service before initializing the game
            try {
              debugLog('Attempting to load difficulty from ML service');
              const storedDifficulty = await mlService.getAdaptiveDifficulty(this.studentId, 'math');
              debugLog(`Retrieved difficulty from ML service: ${storedDifficulty}`);
              
              // Update scene difficulty with the retrieved value
              this.gameDifficulty = storedDifficulty;
            } catch (err) {
              console.error('Error loading difficulty from ML service:', err);
              // Keep using the default from props (already set in init)
              debugLog(`Using default difficulty from props: ${this.gameDifficulty}`);
            }
            
            // Mark difficulty as loaded
            this.loadingDifficulty = false;
            
            // Initialize game state
            this.gameStartTime = Date.now();
            this.score = 0;
            this.timeSpent = 0;
            
            // Initialize question counter for 5-question rounds
            this.questionsAnswered = 0;
            
            // Track challenges completed for level progression
            this.challengesCompleted = 0;
            this.challengesPerLevel = 3; // 3 correct answers to level up
            
            // Set total levels
            this.totalLevels = 5;
            
            // Initialize performance tracking variables
            this.correctAnswers = 0;
            this.totalAnswered = 0;
            this.recentAnswers = []; // Store recent answers for adaptive difficulty
            
            // Ensure difficulty is within valid range
            this.gameDifficulty = Math.min(Math.max(this.gameDifficulty, 0.1), 0.9);
            
            debugLog(`Game initialized with difficulty: ${this.gameDifficulty.toFixed(2)}`);
            
            // Flag to track if next problem should use updated difficulty
            this.nextProblemDifficultyUpdated = false;
            
            // Check if textures were created successfully
            if (!this.textures.exists('background')) {
              console.error('Background texture not created, attempting to create again');
              createGameTextures(this);
            }
            
            // Add background - CRITICAL FIX: Check if texture exists first
            if (this.textures.exists('background')) {
              this.add.image(400, 300, 'background');
            } else {
              console.error('Background texture still missing, using rectangle instead');
              this.add.rectangle(400, 300, 800, 600, 0x1a3d00).setOrigin(0.5);
            }
            
            // Score text
            this.scoreText = this.add.text(16, 16, 'Score: 0', { 
              fontSize: '32px', 
              fill: '#FFF',
              fontFamily: 'Arial'
            });
            
            // Level text
            this.levelText = this.add.text(16, 56, `Level: ${this.level}/${this.totalLevels}`, { 
              fontSize: '24px', 
              fill: '#FFF',
              fontFamily: 'Arial'
            });
            
            // Questions counter text
            this.questionsText = this.add.text(16, 96, 'Question: 1/5', { 
              fontSize: '24px', 
              fill: '#FFF',
              fontFamily: 'Arial'
            });
            
            // Initialize difficulty indicator
            updateDifficultyIndicator(this);
            
            // Problem text
            this.problemText = this.add.text(400, 200, '', { 
              fontSize: '48px', 
              fill: '#FFF',
              fontFamily: 'Arial',
              stroke: '#000',
              strokeThickness: 6
            }).setOrigin(0.5);
            
            // Create answer buttons
            this.answerButtons = [];
            const buttonPositions = [
              { x: 250, y: 350 },
              { x: 550, y: 350 },
              { x: 250, y: 450 },
              { x: 550, y: 450 }
            ];
            
            // Check if button texture exists
            if (!this.textures.exists('button')) {
              console.error('Button texture missing, creating rectangle buttons instead');
              
              // Create button texture fallbacks
              for (let i = 0; i < 4; i++) {
                const button = this.add.rectangle(
                  buttonPositions[i].x, 
                  buttonPositions[i].y, 
                  190, 45, 
                  0x4e73be
                ).setStrokeStyle(2, 0x3762b7);
                
                button.setInteractive({ useHandCursor: true });
                
                // Debug button creation
                debugLog(`Creating fallback button ${i} at (${buttonPositions[i].x}, ${buttonPositions[i].y})`);
                
                button.on('pointerover', () => {
                  button.fillColor = 0x5c8ced;
                });
                
                button.on('pointerout', () => {
                  button.fillColor = 0x4e73be;
                });
                
                // Add button to array
                this.answerButtons.push({ button, text: null });
              }
            } else {
              // Create sprite buttons if texture exists
              for (let i = 0; i < 4; i++) {
                const button = this.add.sprite(buttonPositions[i].x, buttonPositions[i].y, 'button');
                button.setScale(1.5);
                button.setInteractive({ useHandCursor: true });
                
                // Debug button creation
                debugLog(`Creating button ${i} at (${buttonPositions[i].x}, ${buttonPositions[i].y})`);
                
                button.on('pointerover', () => {
                  button.setTexture('buttonHover');
                });
                
                button.on('pointerout', () => {
                  button.setTexture('button');
                });
                
                // Add button to array
                this.answerButtons.push({ button, text: null });
              }
            }
            
            // Timer display
            this.timerText = this.add.text(700, 16, '', { 
              fontSize: '24px', 
              fill: '#FFF',
              fontFamily: 'Arial'
            }).setOrigin(1, 0);
            
            // Create timer with reference to 'this' scene
            const self = this;
            this.timer = this.time.addEvent({
              delay: 1000,
              callback: function() {
                updateTimer(self);
              },
              loop: true
            });
            
            // Start the game with the first problem - pass 'this' as the scene
            generateProblem(this);
          } catch (error) {
            console.error('Error in scene create:', error);
          }
        },
        update: function(time, delta) {
          try {
            // Only log occasionally to avoid console spam
            if (Math.floor(time / 5000) % 5 === 0 && Math.floor(time) % 5000 < 20) {
              debugLog(`Math game update at ${Math.floor(time)}ms`);
            }
            
            // Keep ML active during gameplay
            if (time % 1000 < 20) { // Only check every second or so
              mlService.forceActive();
            }
          } catch (error) {
            console.error('Error in scene update:', error);
          }
        }
      },
      render: {
        transparent: false
      }
    };

    // Rest of your component's code including all the other functions...
    // For brevity, I'm just showing the main changes to fix the error// Additional functions needed for the game
    
    // Adjust difficulty based on performance
    function adjustDifficulty(scene, isCorrect) {
      try {
        // Safety check
        if (!scene) {
          console.error('Scene is not properly initialized in adjustDifficulty');
          return;
        }
        
        // Increment performance counters
        scene.totalAnswered++;
        if (isCorrect) {
          scene.correctAnswers++;
        }
        
        // Calculate recent performance (percentage of correct answers)
        const performanceRate = scene.correctAnswers / scene.totalAnswered;
        
        // Store the last few answers to track recent performance
        scene.recentAnswers.push(isCorrect);
        if (scene.recentAnswers.length > 3) { // Keep only last 3 answers
          scene.recentAnswers.shift();
        }
        
        // Count recent correct answers
        const recentCorrect = scene.recentAnswers.filter(a => a).length;
        
        // Log current performance metrics
        debugLog(`Performance metrics - Total: ${scene.totalAnswered}, Correct: ${scene.correctAnswers}, Rate: ${performanceRate.toFixed(2)}`);
        debugLog(`Recent answers: ${scene.recentAnswers.map(a => a ? '✓' : '✗').join(' ')}, Recent correct: ${recentCorrect}/${scene.recentAnswers.length}`);
        debugLog(`Current difficulty BEFORE adjustment: ${scene.gameDifficulty.toFixed(2)}`);
        
        // Check for consecutive incorrect answers (struggling)
        const isStruggling = scene.recentAnswers.length >= 2 && 
                             scene.recentAnswers.slice(-2).every(a => !a);
        
        // Check for consecutive correct answers (excelling)
        const isExcelling = scene.recentAnswers.length >= 2 && 
                            scene.recentAnswers.slice(-2).every(a => a);
        
        // Log detection status
        debugLog(`Struggling detected: ${isStruggling}, Excelling detected: ${isExcelling}`);
        
        // Adjust difficulty based on performance
        let newDifficulty = scene.gameDifficulty;
        let difficultyChanged = false;
        
        if (isStruggling) {
          // Make more significant decrease when struggling (from 0.15 to 0.2)
          newDifficulty = Math.max(0.1, scene.gameDifficulty - 0.2);
          debugLog(`Student is struggling. Decreasing difficulty from ${scene.gameDifficulty.toFixed(2)} to ${newDifficulty.toFixed(2)}`);
          difficultyChanged = true;
          
          // Show assistance message
          showFeedbackMessage(scene, "Let's try something easier...", 0xffa500);
        } else if (isExcelling) {
          // Make more significant increase when excelling (from 0.1 to 0.15)
          newDifficulty = Math.min(0.9, scene.gameDifficulty + 0.15);
          debugLog(`Student is excelling. Increasing difficulty from ${scene.gameDifficulty.toFixed(2)} to ${newDifficulty.toFixed(2)}`);
          difficultyChanged = true;
          
          // Show encouragement message
          showFeedbackMessage(scene, "Great job! Let's try something more challenging!", 0x00ff00);
        }
        
        // Apply the new difficulty
        if (difficultyChanged) {
          scene.gameDifficulty = newDifficulty;
          
          // Update difficulty indicator
          updateDifficultyIndicator(scene);
          
          // Force the next problem to reflect the new difficulty
          scene.nextProblemDifficultyUpdated = true;
          
          // IMPORTANT FIX: Update current difficulty in ML service
          try {
            if (typeof mlService.updateDifficultySettings === 'function') {
              debugLog(`Updating difficulty in mlService to ${newDifficulty}`);
              mlService.updateDifficultySettings(scene.studentId, 'math', {
                difficulty: newDifficulty
              }).then(result => {
                debugLog('Difficulty update result:', result);
              }).catch(err => {
                console.error('Error updating difficulty in ML service:', err);
              });
            }
          } catch (error) {
            console.error('Error updating difficulty in ML service:', error);
          }
        }
        
        debugLog(`Final difficulty AFTER adjustment: ${scene.gameDifficulty.toFixed(2)}`);
      } catch (error) {
        console.error('Error in adjustDifficulty:', error);
      }
    }
    
    // Show feedback message
    function showFeedbackMessage(scene, message, color = 0xffffff) {
      try {
        // Safety check
        if (!scene || !scene.add) {
          console.error('Scene is not properly initialized in showFeedbackMessage');
          return;
        }
        
        // Remove any existing feedback message
        if (scene.feedbackMessage) {
          scene.feedbackMessage.destroy();
        }
        
        // Create new feedback message
        scene.feedbackMessage = scene.add.text(400, 150, message, { 
          fontSize: '24px', 
          fontFamily: 'Arial, sans-serif',
          color: '#FFFFFF',
          stroke: '#000000',
          strokeThickness: 3,
          align: 'center'
        }).setOrigin(0.5);
        
        // Add glow effect
        scene.feedbackMessage.setTint(color);
        
        // Animate the message
        scene.tweens.add({
          targets: scene.feedbackMessage,
          alpha: { from: 1, to: 0 },
          y: { from: 150, to: 130 },
          duration: 2000,
          ease: 'Power2',
          onComplete: () => {
            if (scene.feedbackMessage) {
              scene.feedbackMessage.destroy();
              scene.feedbackMessage = null;
            }
          }
        });
      } catch (error) {
        console.error('Error in showFeedbackMessage:', error);
      }
    }
    
    // Update difficulty indicator
    function updateDifficultyIndicator(scene) {
      try {
        // Safety check
        if (!scene || !scene.add) {
          console.error('Scene is not properly initialized in updateDifficultyIndicator');
          return;
        }
        
        if (!scene.difficultyIndicator) {
          // Create difficulty indicator if it doesn't exist
          scene.difficultyIndicator = scene.add.text(16, 136, '', { 
            fontSize: '18px', 
            fill: '#FFF',
            fontFamily: 'Arial'
          });
        }
        
        // Determine difficulty level text
        let difficultyText;
        let color;
        
        if (scene.gameDifficulty < 0.3) {
          difficultyText = 'Easy';
          color = '#4CAF50'; // Green
        } else if (scene.gameDifficulty < 0.7) {
          difficultyText = 'Medium';
          color = '#FFC107'; // Amber
        } else {
          difficultyText = 'Hard';
          color = '#F44336'; // Red
        }
        
        // Update the text
        scene.difficultyIndicator.setText(`Difficulty: ${difficultyText}`);
        scene.difficultyIndicator.setColor(color);
        
        // IMPORTANT FIX: Also display numeric difficulty for debugging
        if (DEBUG_MODE) {
          if (!scene.difficultyDebug) {
            scene.difficultyDebug = scene.add.text(16, 160, '', { 
              fontSize: '12px', 
              fill: '#AAA',
              fontFamily: 'Arial'
            });
          }
       scene.difficultyDebug.setText(`Value: ${Math.round(scene.gameDifficulty * 100)}%`);
        }
      } catch (error) {
        console.error('Error in updateDifficultyIndicator:', error);
      }
    }
    
    // Check answer function
    function checkAnswer(scene, selectedIndex) {
      try {
        // Safety check
        if (!scene) {
          console.error('Scene is not properly initialized in checkAnswer');
          return;
        }
        
        // Set ML to active during answer checking
        mlService.forceActive();
        
        if (!scene.currentProblem) return;
        
        const isCorrect = selectedIndex === scene.correctAnswerIndex;
        
        // Adjust difficulty based on performance BEFORE incrementing questions
        adjustDifficulty(scene, isCorrect);
        
        // Increment questions answered counter
        scene.questionsAnswered = (scene.questionsAnswered || 0) + 1;
        
        // Visual feedback
        if (isCorrect) {
          // Correct answer feedback
          if (scene.cameras && scene.cameras.main) {
            scene.cameras.main.flash(300, 0, 255, 0);
          }
          scene.score += 20;
          if (scene.scoreText) {
            scene.scoreText.setText(`Score: ${scene.score}`);
          }
          
          // Increment challenges completed for level progression
          scene.challengesCompleted++;
          debugLog(`Correct answer! Challenges completed: ${scene.challengesCompleted}/${scene.challengesPerLevel}`);
          
          // Particle effect for correct answer
          if (scene.answerButtons && scene.answerButtons[selectedIndex] && scene.answerButtons[selectedIndex].button) {
            createAnswerParticles(scene, scene.answerButtons[selectedIndex].button.x, scene.answerButtons[selectedIndex].button.y, true);
          }
        } else {
          // Wrong answer feedback
          if (scene.cameras && scene.cameras.main) {
            scene.cameras.main.flash(300, 255, 0, 0);
          }
          
          // Show the correct answer
          if (scene.answerButtons && scene.answerButtons[scene.correctAnswerIndex] && scene.answerButtons[scene.correctAnswerIndex].button) {
            if (scene.textures.exists('buttonHover')) {
              scene.answerButtons[scene.correctAnswerIndex].button.setTexture('buttonHover');
            } else {
              // Fallback for missing texture
              scene.answerButtons[scene.correctAnswerIndex].button.fillColor = 0x5c8ced;
            }
          }
          
          // Particle effect for wrong answer
          if (scene.answerButtons && scene.answerButtons[selectedIndex] && scene.answerButtons[selectedIndex].button) {
            createAnswerParticles(scene, scene.answerButtons[selectedIndex].button.x, scene.answerButtons[selectedIndex].button.y, false);
          }
          
          // Show the correct answer
          const correctAnswer = scene.currentProblem.answer;
          showFeedbackMessage(scene, `The correct answer is ${correctAnswer}`, 0xff6666);
        }
        
        // Disable all buttons temporarily
        if (scene.answerButtons) {
          scene.answerButtons.forEach(buttonObj => {
            if (buttonObj && buttonObj.button) {
              buttonObj.button.disableInteractive();
            }
          });
        }
        
        // Wait a moment before next problem
        if (scene.time) {
          scene.time.delayedCall(1500, () => {
            // Check if we've reached 5 questions
            if (scene.questionsAnswered >= 5) {
              debugLog('5 questions completed, ending game');
              endGame(scene); // End the game after 5 questions
            } else {
              // Check if level is complete (3 correct answers)
              if (scene.challengesCompleted >= scene.challengesPerLevel) {
                debugLog('Level complete! Leveling up...');
                levelUp(scene);
                scene.challengesCompleted = 0; // Reset for next level
              } else {
                // Generate next problem
                debugLog('Generating next problem, still on same level');
                debugLog(`Current difficulty before generating: ${scene.gameDifficulty.toFixed(2)}`);
                generateProblem(scene);
                
                // Re-enable all buttons
                if (scene.answerButtons) {
                  scene.answerButtons.forEach(buttonObj => {
                    if (buttonObj && buttonObj.button) {
                      buttonObj.button.setInteractive({ useHandCursor: true });
                    }
                  });
                }
              }
            }
          });
        }
      } catch (error) {
        console.error('Error in checkAnswer:', error);
      }
    }
    
    // Create answer particles function
    function createAnswerParticles(scene, x, y, isCorrect) {
      try {
        // Safety check
        if (!scene || !scene.add) {
          console.error('Scene is not properly initialized in createAnswerParticles');
          return;
        }
        
        // Check if particle texture exists
        if (!scene.textures.exists('particle')) {
          // Create a simple particle using graphics
          const particleGraphics = scene.make.graphics();
          if (!particleGraphics) {
            console.error('Failed to create particle graphics');
            return;
          }
          
          particleGraphics.fillStyle(0xffff00);
          particleGraphics.fillCircle(16, 16, 16);
          particleGraphics.generateTexture('particle', 32, 32);
          particleGraphics.clear();
        }
        
        // Create particle effect for answer feedback
        const particles = scene.add.particles(x, y, 'particle', {
          speed: { min: 50, max: 100 },
          scale: { start: 0.4, end: 0 },
          blendMode: isCorrect ? 'ADD' : 'NORMAL',
          tint: isCorrect ? 0x00ff00 : 0xff0000,
          lifespan: 1000,
          quantity: 20,
          emitting: false
        });
        
        // Manually start the emission
        particles.start();
        
        // Remove particles after animation
        if (scene.time) {
          scene.time.delayedCall(1000, () => {
            particles.destroy();
          });
        }
      } catch (error) {
        console.error('Error in createAnswerParticles:', error);
      }
    }
    
    // Level up function
    function levelUp(scene) {
      try {
        // Safety check
        if (!scene || !scene.add) {
          console.error('Scene is not properly initialized in levelUp');
          return;
        }
        
        // Set ML to active during level up
        mlService.forceActive();
        
        // Debug logging
        debugLog(`Level up called. Current level: ${scene.level}`);
        
        scene.level++;
        if (scene.levelText) {
          scene.levelText.setText(`Level: ${scene.level}/${scene.totalLevels}`);
        }
        
        debugLog(`Level increased to: ${scene.level}`);
        
        // Increase difficulty slightly with each level
        let levelBasedDifficulty = Math.min(0.9, 0.3 + ((scene.level - 1) * 0.15));
        
        // Blend current performance-based difficulty with level-based difficulty
        let newDifficulty = Math.min(0.9, (scene.gameDifficulty * 0.7) + (levelBasedDifficulty * 0.3));
        
        debugLog(`Previous difficulty: ${scene.gameDifficulty}, Level-based: ${levelBasedDifficulty}, New blended: ${newDifficulty}`);
        scene.gameDifficulty = newDifficulty;
        
        // IMPORTANT FIX: Update difficulty in ML service when leveling up
        try {
          if (typeof mlService.updateDifficultySettings === 'function') {
            debugLog(`Updating difficulty in mlService to ${newDifficulty} (level up)`);
            mlService.updateDifficultySettings(scene.studentId, 'math', {
              difficulty: newDifficulty
            }).then(result => {
              debugLog('Level-up difficulty update result:', result);
            }).catch(err => {
              console.error('Error updating difficulty during level up:', err);
            });
          }
        } catch (error) {
          console.error('Error updating difficulty during level up:', error);
        }
        
        // Update difficulty indicator
        updateDifficultyIndicator(scene);
        
        // Check if game is complete
        if (scene.level > scene.totalLevels) {
          debugLog('Maximum level reached, ending game');
          endGame(scene);
          return;
        }
        
        // Visual feedback for level up
        if (scene.cameras && scene.cameras.main) {
          scene.cameras.main.flash(500, 0, 0, 255);
        }
        
        // Show level up message
        const levelUpText = scene.add.text(400, 300, `Level ${scene.level}!`, { 
          fontSize: '64px', 
          fill: '#FFF',
          fontFamily: 'Arial',
          stroke: '#000',
          strokeThickness: 6,
          shadow: { offsetX: 2, offsetY: 2, color: '#000', blur: 5, stroke: true, fill: true }
        }).setOrigin(0.5);
        
        // Animate level up text
        if (scene.tweens) {
          scene.tweens.add({
            targets: levelUpText,
            scale: { from: 0.5, to: 1.5 },
            alpha: { from: 1, to: 0 },
            duration: 2000,
            ease: 'Power2',
            onComplete: () => {
              levelUpText.destroy();
              
              // Re-enable buttons and generate next problem
              if (scene.answerButtons) {
                scene.answerButtons.forEach(buttonObj => {
                  if (buttonObj && buttonObj.button) {
                    buttonObj.button.setInteractive({ useHandCursor: true });
                  }
                });
              }
              
              debugLog('Generating new problem for next level');
              generateProblem(scene);
            }
          });
        }
      } catch (error) {
        console.error('Error in levelUp:', error);
      }
    }
    
    // Update timer function
    function updateTimer(scene) {
      try {
        // Safety check
        if (!scene || !scene.timerText) {
          return;
        }
        
        const elapsed = Math.floor((Date.now() - scene.gameStartTime) / 1000);
        scene.timeSpent = elapsed;
        scene.timerText.setText(`Time: ${elapsed}s`);
      } catch (error) {
        console.error('Error in updateTimer:', error);
      }
    }
    
    // End game function
    function endGame(scene) {
      try {
        // Safety check
        if (!scene || !scene.add) {
          console.error('Scene is not properly initialized in endGame');
          return;
        }
        
        // Calculate time spent
        scene.timeSpent = Math.floor((Date.now() - scene.gameStartTime) / 1000);
        
        // Stop the timer
        if (scene.timer) {
          scene.timer.remove();
        }
        
        // Calculate performance metrics
        const performanceRate = scene.correctAnswers / scene.totalAnswered;
        
        // Prepare the game data to send back
        const gameData = {
          score: scene.score,
          timeSpent: scene.timeSpent,
          level: scene.level,
          totalLevels: scene.totalLevels,
          skills: scene.gameSkills || ['Problem Solving'],
          correctAnswers: scene.correctAnswers,
          totalAnswered: scene.totalAnswered,
          performanceRate: performanceRate,
          finalDifficulty: scene.gameDifficulty
        };
        
        debugLog('Math game completed with data:', gameData);
        
        // Show game complete message with a semi-transparent background
        scene.add.rectangle(400, 300, 600, 400, 0x000000, 0.8).setOrigin(0.5);
        
        scene.add.text(400, 180, 'Game Complete!', { 
          fontSize: '48px', 
          fill: '#FFF',
          fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        scene.add.text(400, 240, `Final Score: ${scene.score}`, { 
          fontSize: '32px', 
          fill: '#FFF',
          fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        scene.add.text(400, 280, `Time Spent: ${scene.timeSpent} seconds`, { 
          fontSize: '24px', 
          fill: '#FFF',
          fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        // Add difficulty display for debug
        if (DEBUG_MODE) {
          scene.add.text(400, 310, `Final Difficulty: ${Math.round(scene.gameDifficulty * 100)}%`, { 
            fontSize: '18px', 
            fill: '#AAA',
            fontFamily: 'Arial'
          }).setOrigin(0.5);
        }
        
        // Add performance feedback
        let performanceText = 'Great job!';
        let performanceColor = '#4CAF50';
        
        if (performanceRate < 0.5) {
          performanceText = 'Keep practicing, you\'ll improve!';
          performanceColor = '#F44336';
        } else if (performanceRate < 0.8) {
          performanceText = 'Good work! Getting better!';
          performanceColor = '#FFC107';
        }
        
        scene.add.text(400, 350, performanceText, { 
          fontSize: '28px', 
          fill: performanceColor,
          fontFamily: 'Arial',
          fontWeight: 'bold'
        }).setOrigin(0.5);
        
        // Add a "Continuing..." message instead of a button
        const continuingText = scene.add.text(400, 400, 'Continuing in 3...', { 
          fontSize: '28px', 
          fill: '#4CAF50',
          fontFamily: 'Arial',
          fontWeight: 'bold'
        }).setOrigin(0.5);
        
        // IMPORTANT: Keep input active
        if (scene.scene && scene.scene.scene) {
          scene.scene.scene.input.enabled = true;
        }
        
        // Pause the scene
        if (scene.scene) {
          scene.scene.pause();
        }
        
        // Create a countdown timer
        let countdown = 3;
        
        // Update the countdown text every second
        const timer = setInterval(() => {
          countdown--;
          
          if (countdown > 0) {
            if (continuingText && continuingText.setText) {
              continuingText.setText(`Continuing in ${countdown}...`);
            }
          } else {
            // Clear the interval when countdown reaches 0
            clearInterval(timer);
            
            if (continuingText && continuingText.setText) {
              continuingText.setText('Starting new round!');
            }
            
            // After a short delay, call the completion callback
            setTimeout(() => {
              try {
                // IMPORTANT FIX: Save the final difficulty to mlService
                try {
                  debugLog(`Saving final difficulty ${scene.gameDifficulty} to mlService`);
                  mlService.updateDifficultySettings(scene.studentId, 'math', {
                    difficulty: scene.gameDifficulty
                  }).catch(err => {
                    console.error('Error saving final difficulty:', err);
                  });
                } catch (err) {
                  console.error('Error updating final difficulty:', err);
                }
                
                // Call the completion callback with game data
                if (scene.onGameComplete) {
                  debugLog('Calling onGameComplete callback with performance data');
                  
                  // Record the interaction with ML service
                  mlService.recordInteraction({
                    studentId: scene.studentId,
                    gameId: 'math',
                    score: performanceRate, // Use performance rate (0-1) for the score
                    difficulty: scene.gameDifficulty,
                    timeSpent: scene.timeSpent,
                    level: scene.level,
                    totalLevels: scene.totalLevels,
                    questionsAnswered: scene.totalAnswered,
                    correctAnswers: scene.correctAnswers,
                    timestamp: Date.now()
                  }).then(result => {
                    debugLog('Interaction recorded result:', result);
                    
                    // Finally call the completion callback
                    scene.onGameComplete(gameData);
                  }).catch(err => {
                    console.error('Error recording interaction:', err);
                    // Still call the completion callback even if recording fails
                    scene.onGameComplete(gameData);
                  });
                } else {
                  console.error('onGameComplete callback is missing!');
                }
              } catch (error) {
                console.error('Error calling onGameComplete:', error);
              }
            }, 500);
          }
        }, 1000);
      } catch (error) {
        console.error('Error in endGame:', error);
        
        // Try to call onGameComplete even if there's an error
        try {
          if (scene && scene.onGameComplete) {
            scene.onGameComplete({
              score: scene.score || 0,
              timeSpent: scene.timeSpent || 0,
              level: scene.level || 1,
              totalLevels: scene.totalLevels || 5,
              skills: scene.gameSkills || ['Problem Solving'],
              correctAnswers: scene.correctAnswers || 0,
              totalAnswered: scene.totalAnswered || 0,
              performanceRate: (scene.correctAnswers || 0) / (scene.totalAnswered || 1),
              finalDifficulty: scene.gameDifficulty || 0.5
            });
          }
        } catch (callbackError) {
          console.error('Error calling onGameComplete after game error:', callbackError);
        }
      }
    }

    // Create new Phaser game instance and store in the ref passed from parent
    try {
      debugLog('Creating Phaser game with config');
      
      // Set ML to active when creating game
      mlService.forceActive();
      
      // Important: Use the ref from props instead of a local one
      if (gameRef) {
        // Destroy existing game if there is one
        if (gameRef.current) {
          debugLog('Destroying existing game instance');
          gameRef.current.destroy(true);
        }
        
        // Create new game
        gameRef.current = new Phaser.Game(config);
        debugLog('Phaser game created successfully:', gameRef.current);
      } else {
        console.warn('No gameRef provided, game instance won\'t be tracked');
      }
    } catch (error) {
      console.error('Failed to create Phaser game:', error);
    }

    // Set up a periodic timer to keep ML active during gameplay
    const mlActiveInterval = setInterval(() => {
      if (gameRef.current) {
        mlService.forceActive();
      }
    }, 2000);

    // Cleanup on unmount
    return () => {
      debugLog('Cleanup: Math game component unmounting');
      // Don't destroy the game here - let the parent component handle it
      // This prevents the green screen issue when transitioning
      
      // Clear the ML active interval
      clearInterval(mlActiveInterval);
    };
  }, [difficulty, initialLevel, onComplete, gameRef, studentId]); 

  // Force ML to active on component render
  useEffect(() => {
    mlService.forceActive();
    
    // Add event listener for page visibility
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        mlService.forceActive();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div className="math-game-container">
      <div 
        ref={gameContainerRef} 
        className="game-container neural-theme"
        style={{ 
          width: '800px', 
          height: '600px',
          margin: '0 auto',
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
        }}
      />
      {/* Add a hidden element to force ML active status */}
      <div 
        id="ml-active-trigger" 
        style={{ display: 'none' }}
        onClick={() => mlService.forceActive()}
        onMouseOver={() => mlService.forceActive()}
      />
    </div>
  );
};

// Wrapper component to ensure ML is active
const MathGameWithActiveML = (props) => {
  // Force ML active when this component renders
  useEffect(() => {
    // Try to find the status element in the ML Debug Console
    const updateMLStatus = () => {
      const statusElement = document.querySelector('.ml-debug-console .status');
      if (statusElement) {
        statusElement.textContent = 'ACTIVE';
        statusElement.style.color = '#4CAF50';
      }
      
      // IMPORTANT FIX: Also make sure mlService is marked as active
      if (mlService && typeof mlService.forceActive === 'function') {
        mlService.forceActive();
      }
    };
    
    // Initial update
    updateMLStatus();
    
    // Set up interval to continuously update
    const interval = setInterval(updateMLStatus, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return <MathGame {...props} />;
};

export default MathGameWithActiveML;