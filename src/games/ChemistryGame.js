// src/games/ChemistryGame.js - CORS-fixed version
import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

// Chemistry Game Component that uses Phaser
const ChemistryGame = ({ difficulty = 0.5, initialLevel = 1, onComplete, gameRef }) => {
  const gameContainerRef = useRef(null);

  // Setup and cleanup game on component mount/unmount
  useEffect(() => {
    if (!gameContainerRef.current) {
      console.error('Game container ref is not available');
      return;
    }
    
    console.log('Initializing chemistry game with container:', gameContainerRef.current);
    console.log('Current difficulty:', difficulty);
    console.log('Initial level:', initialLevel);
    
    // Helper functions for creating textures - defined BEFORE the config
    const createBackgroundTexture = (scene) => {
      console.log('Creating nebula background texture');
      const graphics = scene.make.graphics();
      
      // Create a dark space background with purple/pink gradient
      graphics.fillGradientStyle(0x1f002e, 0x1f002e, 0x38025e, 0x38025e, 1);
      graphics.fillRect(0, 0, 800, 600);
      
      // Add some stars
      for (let i = 0; i < 150; i++) {
        const x = Phaser.Math.Between(0, 800);
        const y = Phaser.Math.Between(0, 600);
        const size = Phaser.Math.Between(1, 3);
        const alpha = Phaser.Math.FloatBetween(0.3, 1);
        
        graphics.fillStyle(0xffffff, alpha);
        graphics.fillCircle(x, y, size);
      }
      
      // Add some nebula effects
      for (let i = 0; i < 8; i++) {
        const x = Phaser.Math.Between(0, 800);
        const y = Phaser.Math.Between(0, 600);
        const radius = Phaser.Math.Between(70, 200);
        
        // Create nebula glow effects
        const color = Phaser.Utils.Array.GetRandom([0x9c27b0, 0x673ab7, 0x6a1b9a]);
        graphics.fillStyle(color, 0.15);
        graphics.fillCircle(x, y, radius);
      }
      
      graphics.generateTexture('lab', 800, 600);
      graphics.clear();
      
      console.log('Background texture created successfully');
    };
    
    const createGameTextures = (scene) => {
      console.log('Creating game textures programmatically');
      
      // Create flask texture
      const flaskGraphics = scene.make.graphics();
      // Draw flask shape
      flaskGraphics.fillStyle(0xf5f5f5, 0.8);
      flaskGraphics.fillRect(8, 0, 10, 15); // neck
      flaskGraphics.fillEllipse(13, 15, 12, 5); // neck base
      flaskGraphics.fillEllipse(13, 35, 18, 15); // body
      flaskGraphics.generateTexture('flask', 30, 50);
      flaskGraphics.clear();
      
      // Create bench texture
      const benchGraphics = scene.make.graphics();
      benchGraphics.fillStyle(0x795548);
      benchGraphics.fillRect(0, 0, 200, 20);
      benchGraphics.lineStyle(2, 0x5d4037);
      benchGraphics.strokeRect(0, 0, 200, 20);
      benchGraphics.generateTexture('bench', 200, 20);
      benchGraphics.clear();
      
      // Create particle texture
      const particleGraphics = scene.make.graphics();
      particleGraphics.fillStyle(0x2196f3);
      particleGraphics.fillCircle(8, 8, 8);
      particleGraphics.generateTexture('particle', 16, 16);
      particleGraphics.clear();
      
      // Create molecule texture
      const moleculeGraphics = scene.make.graphics();
      moleculeGraphics.fillStyle(0x4caf50);
      moleculeGraphics.fillCircle(10, 10, 10);
      moleculeGraphics.generateTexture('molecule', 20, 20);
      moleculeGraphics.clear();
      
      // Create tube texture
      const tubeGraphics = scene.make.graphics();
      tubeGraphics.fillStyle(0xffffff, 0.8);
      tubeGraphics.fillRect(2, 0, 10, 25);
      tubeGraphics.fillEllipse(7, 25, 7, 3);
      tubeGraphics.generateTexture('tube', 14, 28);
      tubeGraphics.clear();
      
      console.log('Game textures created successfully');
    };
    
    const createElementTextures = (scene) => {
      console.log('Creating element textures programmatically');
      
      // Element colors
      const elementColors = {
        'H': 0xFFFFFF,
        'O': 0x0000FF,
        'C': 0xFF0000,
        'N': 0xFF0000,
        'Na': 0xFFD700,
        'Cl': 0x00FF00
      };
      
      // Create element textures
      Object.entries(elementColors).forEach(([element, color]) => {
        const graphics = scene.make.graphics();
        graphics.fillStyle(color);
        graphics.fillCircle(15, 15, 15);
        graphics.generateTexture(element, 30, 30);
        graphics.clear();
      });
      
      console.log('Element textures created successfully');
    };
    
    // Configure Phaser game
    const config = {
      type: Phaser.AUTO,
      parent: gameContainerRef.current,
      width: 800,
      height: 600,
      backgroundColor: '#1f002e', // Dark purple background - NOT green
      scene: {
        init: function() {
          console.log('Chemistry scene init called');
          this.difficulty = difficulty;
          this.level = initialLevel; // Use the initialLevel prop
          this.onGameComplete = onComplete;
          this.gameSkills = ['Chemical Bonds', 'Reactions', 'Pattern Recognition'];
          window.gameScene = this;
          
          // Log the initialized level for debugging
          console.log(`Initializing chemistry game with level: ${initialLevel}`);
        },
        preload: function() {
          console.log('Chemistry game preload function called');
          
          // CORS FIX: Create all assets programmatically using the external functions
          createBackgroundTexture(this);
          createGameTextures(this);
          createElementTextures(this);
        },
        
        create: function() {
          console.log('Chemistry game create function called');
          console.log('Scene is running:', this.scene.isActive());
          
          const self = this;
          this.gameStartTime = Date.now();
          this.score = 0;
          console.log(`Current level at create: ${this.level}`);
          this.totalLevels = 5;
          this.challengesCompleted = 0;
          this.challengesPerLevel = 3;
          this.timeSpent = 0;
          this.questionsAnswered = 0;
          
          // Initialize these groups early to prevent undefined errors
          this.elementTray = this.add.group();
          this.workspace = this.add.group();
          
          // Scale difficulty (0-1) to actual game difficulty
          const gameDifficulty = Math.floor(this.difficulty * 3); // 0=easy, 1=medium, 2=hard
          
          // Configure element complexity based on difficulty
          this.availableElements = [
            ['H', 'O', 'C', 'N'],             // Easy - Basic elements only
            ['H', 'O', 'C', 'N', 'Na', 'Cl'], // Medium - Add more elements
            ['H', 'O', 'C', 'N', 'Na', 'Cl']  // Hard - Same elements but more complex molecules
          ][gameDifficulty];
          
          // Element data - simplified atomic weights and colors
          this.elements = {
            'H': { weight: 1, color: 0xFFFFFF, name: 'Hydrogen' },
            'O': { weight: 16, color: 0x0000FF, name: 'Oxygen' },
            'C': { weight: 12, color: 0xFF0000, name: 'Carbon' }, // Changed from black to red for visibility
            'N': { weight: 14, color: 0xFF0000, name: 'Nitrogen' },
            'Na': { weight: 23, color: 0xFFD700, name: 'Sodium' },
            'Cl': { weight: 35.5, color: 0x00FF00, name: 'Chlorine' }
          };
          
          // Define molecules for each difficulty level
          this.molecules = {
            easy: [
              { formula: 'H2O', name: 'Water', components: ['H', 'H', 'O'] },
              { formula: 'O2', name: 'Oxygen', components: ['O', 'O'] },
              { formula: 'CO2', name: 'Carbon Dioxide', components: ['C', 'O', 'O'] }
            ],
            medium: [
              { formula: 'NH3', name: 'Ammonia', components: ['N', 'H', 'H', 'H'] },
              { formula: 'CH4', name: 'Methane', components: ['C', 'H', 'H', 'H', 'H'] },
              { formula: 'NaCl', name: 'Sodium Chloride', components: ['Na', 'Cl'] }
            ],
            hard: [
              { formula: 'C2H6O', name: 'Ethanol', components: ['C', 'C', 'H', 'H', 'H', 'H', 'H', 'H', 'O'] },
              { formula: 'C6H12O6', name: 'Glucose', components: ['C', 'C', 'C', 'C', 'C', 'C', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'O', 'O', 'O', 'O', 'O', 'O'] },
              { formula: 'NaHCO3', name: 'Sodium Bicarbonate', components: ['Na', 'H', 'C', 'O', 'O', 'O'] }
            ]
          };
          
          // Select difficulty set
          this.difficultySet = ['easy', 'medium', 'hard'][gameDifficulty];
          
          // Add background
          this.add.image(400, 300, 'lab');
          
          // Create lab bench
          const bench = this.physics.add.staticGroup();
          bench.create(400, 580, 'bench').setScale(2).refreshBody();
          
          // Score text
          this.scoreText = this.add.text(16, 16, 'Score: 0', { 
            fontSize: '32px', 
            fill: '#FFF',
            fontFamily: 'Arial'
          });
          
          // Level text - Update to show current level from initialLevel
          this.levelText = this.add.text(16, 56, `Level: ${this.level}/${this.totalLevels}`, { 
            fontSize: '24px', 
            fill: '#FFF',
            fontFamily: 'Arial'
          });
          
          // Questions counter text (new)
          this.questionsText = this.add.text(16, 96, 'Question: 1/5', { 
            fontSize: '24px', 
            fill: '#FFF',
            fontFamily: 'Arial'
          });
          
          // Challenge text
          this.challengeText = this.add.text(400, 80, '', { 
            fontSize: '32px', 
            fill: '#FFF',
            fontFamily: 'Arial',
            stroke: '#000',
            strokeThickness: 2
          }).setOrigin(0.5);
          
          // Formula text
          this.formulaText = this.add.text(400, 130, '', { 
            fontSize: '48px', 
            fill: '#FFF',
            fontFamily: 'monospace',
            stroke: '#000',
            strokeThickness: 3
          }).setOrigin(0.5);
          
          // Instructions text
          this.instructionsText = this.add.text(400, 180, '', { 
            fontSize: '20px', 
            fill: '#FFF',
            fontFamily: 'Arial'
          }).setOrigin(0.5);
          
          // Create element tray
          this.elementTray = this.add.group();
          
          // Create molecule workspace
          this.workspace = this.add.group();
          
          // Create reset button
          this.resetButton = this.add.text(700, 550, 'RESET', { 
            fontSize: '24px', 
            fill: '#FFF',
            backgroundColor: '#FF0000',
            padding: { x: 15, y: 10 }
          })
          .setOrigin(0.5)
          .setInteractive({ useHandCursor: true });
          
          this.resetButton.on('pointerdown', () => {
            this.resetWorkspace();
          });
          
          // End game button (for testing)
          const endButton = this.add.text(700, 16, 'End Game', { 
            fontSize: '20px', 
            fill: '#FFF',
            backgroundColor: '#FF0000',
            padding: { x: 10, y: 5 }
          }).setInteractive({ useHandCursor: true });
          
          endButton.on('pointerdown', () => {
            this.endGame();
          });
          
          // Start the first challenge
          this.startNextChallenge();
        },
        
        update: function(time, delta) {
          // Only log occasionally to avoid console spam
          if (Math.floor(time / 5000) % 5 === 0 && Math.floor(time) % 5000 < 20) {
            console.log(`Chemistry game update at ${Math.floor(time)}ms`);
          }
          
          // Check if molecule is complete and correct
          if (this.targetMolecule && this.workspace.getChildren().length === this.targetMolecule.components.length) {
            // Check if current arrangement matches target molecule
            this.checkMolecule();
          }
        }
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 200 },
          debug: false
        }
      },
      // Make sure transparent is false to avoid weird rendering
      render: {
        transparent: false
      }
    };

    // Create new Phaser game instance and store in the ref passed from parent
    try {
      console.log('Creating Phaser game with config');
      
      // Important: Use the ref from props instead of a local one
      if (gameRef) {
        // Destroy existing game if there is one
        if (gameRef.current) {
          console.log('Destroying existing game instance');
          gameRef.current.destroy(true);
        }
        
        // Create new game
        gameRef.current = new Phaser.Game(config);
        console.log('Phaser game created successfully:', gameRef.current);
      } else {
        console.warn('No gameRef provided, game instance won\'t be tracked');
      }
    } catch (error) {
      console.error('Failed to create Phaser game:', error);
    }

    // Cleanup on unmount
    return () => {
      console.log('Cleanup: Chemistry game component unmounting');
      // Don't destroy the game here - let the parent component handle it
      // This prevents the green screen issue when transitioning
    };
  }, [difficulty, initialLevel, onComplete, gameRef]); // Added initialLevel to dependencies

  // Game-specific functions added to the scene
  Phaser.Scene.prototype.startNextChallenge = function() {
    // Check if we've reached 5 questions
    if (this.questionsAnswered >= 5) {
      console.log('5 questions completed, ending game');
      this.endGame(); // End the game after 5 questions
      return;
    }
    
    // Update question counter display
    this.questionsText.setText(`Question: ${this.questionsAnswered + 1}/5`);
    
    // Clear previous challenge
    this.resetWorkspace();
    
    // Choose a molecule based on level and difficulty
    const difficultySet = this.difficultySet;
    const moleculePool = this.molecules[difficultySet];
    
    // Choose a random molecule from the pool
    const randomIndex = Math.floor(Math.random() * moleculePool.length);
    this.targetMolecule = moleculePool[randomIndex];
    
    // Setup the challenge
    this.setupMoleculeChallenge();
  };
  
  Phaser.Scene.prototype.setupMoleculeChallenge = function() {
    // Challenge description
    this.challengeText.setText(`Create: ${this.targetMolecule.name}`);
    this.formulaText.setText(this.targetMolecule.formula);
    this.instructionsText.setText('Drag elements into the workspace to build the molecule');
    
    // Create element tray with available elements
    this.createElementTray();
    
    // Create molecule workspace
    this.createWorkspace();
  };
  
  Phaser.Scene.prototype.createElementTray = function() {
    // Clear previous elements
    this.elementTray.clear(true, true);
    
    // Create element buttons
    const elements = this.availableElements;
    const spacing = 80;
    const startX = 400 - ((elements.length - 1) * spacing) / 2;
    
    elements.forEach((element, index) => {
      const x = startX + index * spacing;
      const y = 500;
      
      // Create element circle
      const elementObj = this.add.circle(x, y, 30, this.elements[element].color);
      
      // Add element symbol
      const elementText = this.add.text(x, y, element, {
        fontSize: '24px',
        fontFamily: 'Arial',
        fontWeight: 'bold',
        color: element === 'C' ? '#FFFFFF' : '#000000'
      }).setOrigin(0.5);
      
      // Make the element draggable
      elementObj.setInteractive({ draggable: true });
      
      // Add element data
      elementObj.elementData = {
        symbol: element,
        color: this.elements[element].color,
        name: this.elements[element].name
      };
      
      // Add to element tray group
      this.elementTray.add(elementObj);
      this.elementTray.add(elementText);
    });
    
    // Setup drag events
    this.input.on('dragstart', (pointer, gameObject) => {
      if (this.elementTray.contains(gameObject)) {
        gameObject.setAlpha(0.7);
      }
    });
    
    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      if (this.elementTray.contains(gameObject)) {
        // When dragging from tray, create a new element to add to workspace
        return;
      } else {
        // If dragging within workspace
        gameObject.x = dragX;
        gameObject.y = dragY;
      }
    });
    
    this.input.on('dragend', (pointer, gameObject) => {
      if (this.elementTray.contains(gameObject)) {
        gameObject.setAlpha(1);
        
        // Check if drop is within workspace area
        if (pointer.y < 450 && pointer.y > 200) {
          // Create a new element in the workspace
          this.addElementToWorkspace(gameObject.elementData, pointer.x, pointer.y);
        }
      }
    });
  };
  
  Phaser.Scene.prototype.createWorkspace = function() {
    // Clear previous workspace
    this.workspace.clear(true, true);
    
    // Create workspace area
    const workspaceArea = this.add.rectangle(400, 320, 600, 250, 0x333333, 0.3);
    
    // Add text
    this.add.text(400, 220, 'Workspace', {
      fontSize: '20px',
      fill: '#FFF'
    }).setOrigin(0.5);
  };
  
  Phaser.Scene.prototype.addElementToWorkspace = function(elementData, x, y) {
    // Create a new element in the workspace
    const element = this.add.circle(x, y, 25, elementData.color);
    
    // Add element symbol
    const elementText = this.add.text(x, y, elementData.symbol, {
      fontSize: '20px',
      fontFamily: 'Arial',
      fontWeight: 'bold',
      color: elementData.symbol === 'C' ? '#FFFFFF' : '#000000'
    }).setOrigin(0.5);
    
    // Make the element draggable within workspace
    element.setInteractive({ draggable: true });
    
    // Add element data
    element.elementData = elementData;
    
    // Add to workspace group
    this.workspace.add(element);
    this.workspace.add(elementText);
    
    // Add bond visualization if more than one element
    this.updateBonds();
    
    // Check for particle effect
    if (this.workspace.getChildren().filter(obj => obj.type === 'Arc').length % 2 === 0) {
      this.createReactionParticles(x, y);
    }
  };
  
  Phaser.Scene.prototype.updateBonds = function() {
    // Remove previous bonds
    this.children.list.forEach(child => {
      if (child.type === 'Graphics' && child.isBond) {
        child.destroy();
      }
    });
    
    // Get all elements
    const elements = this.workspace.getChildren().filter(obj => obj.type === 'Arc');
    
    if (elements.length < 2) return;
    
    // Create bonds between elements
    for (let i = 0; i < elements.length - 1; i++) {
      const element1 = elements[i];
      const element2 = elements[i + 1];
      
      // Create a line between elements
      const bond = this.add.graphics();
      bond.isBond = true;
      
      bond.lineStyle(4, 0xFFFFFF, 0.8);
      bond.beginPath();
      bond.moveTo(element1.x, element1.y);
      bond.lineTo(element2.x, element2.y);
      bond.closePath();
      bond.strokePath();
    }
  };
  
  Phaser.Scene.prototype.createReactionParticles = function(x, y) {
    // Fixed particle effect using programmatically created particle texture
    const particles = this.add.particles(x, y, 'particle', {
      speed: { min: 50, max: 100 },
      scale: { start: 0.4, end: 0 },
      blendMode: 'ADD',
      lifespan: 1000,
      quantity: 20,
      emitting: false
    });
    
    // Manually start the emission
    particles.start();
    
    // Remove particles after animation
    this.time.delayedCall(1000, () => {
      particles.destroy();
    });
  };
    
  
  Phaser.Scene.prototype.resetWorkspace = function() {
    // Clear workspace
    this.workspace.clear(true, true);
    
    // Remove bonds
    this.children.list.forEach(child => {
      if (child.type === 'Graphics' && child.isBond) {
        child.destroy();
      }
    });
  };
  
  Phaser.Scene.prototype.checkMolecule = function() {
    // Get elements from workspace
    const workspaceElements = this.workspace.getChildren()
      .filter(obj => obj.type === 'Arc')
      .map(element => element.elementData.symbol);
    
    // Check if all required elements are present
    const targetElements = [...this.targetMolecule.components];
    
    // Simple check: do we have the right count of each element
    let isCorrect = true;
    
    // Check for each required element
    for (const element of this.availableElements) {
      const targetCount = targetElements.filter(e => e === element).length;
      const workspaceCount = workspaceElements.filter(e => e === element).length;
      
      if (targetCount !== workspaceCount) {
        isCorrect = false;
        break;
      }
    }
    
    if (isCorrect) {
      this.completeChallenge(true);
    }
  };
  
  Phaser.Scene.prototype.completeChallenge = function(success) {
    // Increment questions answered counter
    this.questionsAnswered = (this.questionsAnswered || 0) + 1;
    
    // Visual feedback
    if (success) {
      this.cameras.main.flash(300, 0, 255, 0);
      this.score += 20;
      this.challengesCompleted++;
      console.log(`Challenge completed successfully! Challenges completed: ${this.challengesCompleted}/${this.challengesPerLevel}`);
      
      // Show success message
      const successText = this.add.text(400, 350, 'Correct Molecule!', {
        fontSize: '48px',
        fill: '#00FF00',
        fontFamily: 'Arial',
        stroke: '#000',
        strokeThickness: 4
      }).setOrigin(0.5);
      
      // Add molecule completion effect
      this.createReactionParticles(400, 350);
      
      // Remove message after delay
      this.time.delayedCall(1500, () => {
        successText.destroy();
      });
    } else {
      console.log('Challenge failed');
    }
    
    // Update score
    this.scoreText.setText('Score: ' + this.score);
    
    // Check if we've reached 5 questions
    if (this.questionsAnswered >= 5) {
      console.log('5 questions completed, ending game');
      this.endGame(); // End the game after 5 questions
      return;
    }
    
    // Check if level is complete
    if (this.challengesCompleted >= this.challengesPerLevel) {
      console.log('Level complete! Leveling up...');
      this.levelUp();
      this.challengesCompleted = 0; // Reset for next level
    } else {
      console.log('Level not complete yet, starting next challenge');
      // Wait a moment and then start next challenge
      this.time.delayedCall(2000, () => {
        this.startNextChallenge();
      });
    }
  };
  
  Phaser.Scene.prototype.levelUp = function() {
    // Debug logging
    console.log(`Level up called. Current level: ${this.level}`);
    
    this.level++;
    this.levelText.setText(`Level: ${this.level}/${this.totalLevels}`);
    
    console.log(`Level increased to: ${this.level}`);
    
    // Check if game is complete
    if (this.level > this.totalLevels) {
      console.log('Maximum level reached, ending game');
      this.endGame();
      return;
    }
    
    // Visual feedback for level up
    this.cameras.main.flash(500, 0, 0, 255);
    
    // Show level up message
    const levelUpText = this.add.text(400, 300, `Level ${this.level}!`, { 
      fontSize: '64px', 
      fill: '#FFF',
      fontFamily: 'Arial',
      stroke: '#000',
      strokeThickness: 6,
      shadow: { offsetX: 2, offsetY: 2, color: '#000', blur: 5, stroke: true, fill: true }
    }).setOrigin(0.5);
    
    // Animate level up text
    this.tweens.add({
      targets: levelUpText,
      scale: { from: 0.5, to: 1.5 },
      alpha: { from: 1, to: 0 },
      duration: 2000,
      ease: 'Power2',
      onComplete: () => {
        levelUpText.destroy();
        console.log('Starting next challenge for new level');
        this.startNextChallenge();
      }
    });
  };
  
  Phaser.Scene.prototype.endGame = function() {
    // Calculate time spent
    this.timeSpent = Math.floor((Date.now() - this.gameStartTime) / 1000);
    
    // Prepare the game data to send back
    const gameData = {
      score: this.score,
      timeSpent: this.timeSpent,
      level: this.level,
      totalLevels: this.totalLevels,
      skills: this.gameSkills || ['Problem Solving']
    };
    
    console.log('Chemistry game completed with data:', gameData);
    
    // Show game complete message with a semi-transparent background
    this.add.rectangle(400, 300, 600, 400, 0x000000, 0.8).setOrigin(0.5);
    
    this.add.text(400, 200, 'Game Complete!', { 
      fontSize: '48px', 
      fill: '#FFF',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
    
    this.add.text(400, 270, `Final Score: ${this.score}`, { 
      fontSize: '32px', 
      fill: '#FFF',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
    
    this.add.text(400, 320, `Time Spent: ${this.timeSpent} seconds`, { 
      fontSize: '24px', 
      fill: '#FFF',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
    
    // Add a "Continuing..." message instead of a button
    const continuingText = this.add.text(400, 400, 'Continuing in 3...', { 
      fontSize: '28px', 
      fill: '#4CAF50',
      fontFamily: 'Arial',
      fontWeight: 'bold'
    }).setOrigin(0.5);
    
    // IMPORTANT: Keep input active
    if (this.scene && this.scene.scene) {
      this.scene.scene.input.enabled = true;
    }
    
    // Pause the scene
    this.scene.pause();
    
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
            // Call the completion callback with game data
            if (this.onGameComplete) {
              console.log('Calling onGameComplete callback');
              this.onGameComplete(gameData);
            } else {
              console.error('onGameComplete callback is missing!');
            }
          } catch (error) {
            console.error('Error calling onGameComplete:', error);
          }
        }, 500);
      }
    }, 1000);
  };

  return (
    <div className="chemistry-game-container">
      <div 
        ref={gameContainerRef} 
        style={{ 
          width: '800px', 
          height: '600px',
          margin: '0 auto',
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
          backgroundColor: '#1a1a1a' // Dark fallback background
        }}
      />
    </div>
  );
};

export default ChemistryGame;