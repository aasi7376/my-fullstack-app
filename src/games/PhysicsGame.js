// src/games/PhysicsGame.js - Hybrid approach
import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';

// Physics Game Component that uses Phaser
const PhysicsGame = ({ difficulty = 0.5, initialLevel = 1, onComplete, gameRef, studentId, gameId = 'game4' }) => {
  const gameContainerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Setup and cleanup game on component mount/unmount
  useEffect(() => {
    if (!gameContainerRef.current) {
      console.error('Game container ref is not available');
      setError('Game container not available');
      return;
    }
    
    console.log('Initializing physics game with container:', gameContainerRef.current);
    console.log('Current difficulty:', difficulty);
    console.log('Initial level:', initialLevel);
    
    // Configure Phaser game
    const config = {
      type: Phaser.AUTO,
      parent: gameContainerRef.current,
      width: 800,
      height: 600,
      backgroundColor: '#0c1445', // Dark blue background - NOT green
      scene: {
        init: function() {
          console.log('Physics scene init called');
          this.difficulty = difficulty;
          this.level = initialLevel; // Use the initialLevel prop
          this.onGameComplete = onComplete;
          this.gameSkills = ['Mechanics', 'Energy', 'Critical Thinking'];
          this.studentId = studentId || 'test-user';
          this.gameId = gameId || 'game4';
          window.gameScene = this;
          
          // Log the initialized level for debugging
          console.log(`Initializing physics game with level: ${initialLevel}`);
        },
        preload: function() {
          console.log('Physics game preload function called');
          
          // CORS FIX: Create all assets programmatically
          this.createBackground();
          this.createGameTextures();
        },
        
        // CORS FIX: Create space background directly
        createBackground: function() {
          console.log('Creating space background texture');
          const graphics = this.make.graphics();
          
          // Create a dark space background with gradient
          graphics.fillGradientStyle(0x000428, 0x000428, 0x004e92, 0x004e92, 1);
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
          
          // Add some distant nebula effects
          for (let i = 0; i < 5; i++) {
            const x = Phaser.Math.Between(0, 800);
            const y = Phaser.Math.Between(0, 600);
            const radius = Phaser.Math.Between(50, 150);
            
            // Create a subtle glow effect
            const color = Phaser.Utils.Array.GetRandom([0x1a237e, 0x0d47a1, 0x01579b]);
            graphics.fillStyle(color, 0.15);
            graphics.fillCircle(x, y, radius);
          }
          
          graphics.generateTexture('background', 800, 600);
          graphics.clear();
          
          console.log('Background texture created successfully');
        },
        
        // CORS FIX: Create all game textures programmatically
        createGameTextures: function() {
          console.log('Creating game textures programmatically');
          
          // Create ball texture
          const ballGraphics = this.make.graphics();
          ballGraphics.fillStyle(0x3f51b5);
          ballGraphics.fillCircle(16, 16, 16);
          // Add some highlight
          ballGraphics.fillStyle(0x7986cb, 0.8);
          ballGraphics.fillCircle(10, 10, 5);
          ballGraphics.generateTexture('ball', 32, 32);
          ballGraphics.clear();
          
          // Create platform texture
          const platformGraphics = this.make.graphics();
          platformGraphics.fillStyle(0x455a64);
          platformGraphics.fillRect(0, 0, 200, 20);
          platformGraphics.lineStyle(2, 0x78909c);
          platformGraphics.strokeRect(0, 0, 200, 20);
          platformGraphics.generateTexture('platform', 200, 20);
          platformGraphics.clear();
          
          // Create target texture
          const targetGraphics = this.make.graphics();
          targetGraphics.lineStyle(2, 0xf44336);
          targetGraphics.strokeCircle(25, 25, 24);
          targetGraphics.lineStyle(2, 0xf44336);
          targetGraphics.strokeCircle(25, 25, 16);
          targetGraphics.lineStyle(2, 0xf44336);
          targetGraphics.strokeCircle(25, 25, 8);
          targetGraphics.fillStyle(0xf44336);
          targetGraphics.fillCircle(25, 25, 4);
          targetGraphics.generateTexture('target', 50, 50);
          targetGraphics.clear();
          
          // Create arrow texture
          const arrowGraphics = this.make.graphics();
          arrowGraphics.fillStyle(0xffffff);
          // Arrow shaft
          arrowGraphics.fillRect(0, 5, 50, 10);
          // Arrow head
          arrowGraphics.fillTriangle(50, 0, 50, 20, 70, 10);
          arrowGraphics.generateTexture('arrow', 70, 20);
          arrowGraphics.clear();
          
          // Create pendulum texture
          const pendulumGraphics = this.make.graphics();
          pendulumGraphics.fillStyle(0xe91e63);
          pendulumGraphics.fillCircle(15, 15, 15);
          // Add some highlight
          pendulumGraphics.fillStyle(0xf48fb1, 0.8);
          pendulumGraphics.fillCircle(10, 10, 5);
          pendulumGraphics.generateTexture('pendulum', 30, 30);
          pendulumGraphics.clear();
          
          // Create chain link texture
          const chainGraphics = this.make.graphics();
          chainGraphics.fillStyle(0xbdbdbd);
          chainGraphics.fillRect(0, 0, 5, 5);
          chainGraphics.generateTexture('chain', 5, 5);
          chainGraphics.clear();
          
          console.log('Game textures created successfully');
        },
        
        create: function() {
          console.log('Physics game create function called');
          console.log('Scene is running:', this.scene.isActive());
          
          const self = this;
          this.gameStartTime = Date.now();
          this.score = 0;
          console.log(`Current level at create: ${this.level}`);
          this.totalLevels = 5;
          this.challengesCompleted = 0;
          this.challengesPerLevel = 3;
          this.timeSpent = 0;
          // Initialize question counter for 5-question rounds
          this.questionsAnswered = 0;
          
          // Scale difficulty (0-1) to actual game difficulty
          const gameDifficulty = Math.floor(this.difficulty * 3); // 0=easy, 1=medium, 2=hard
          
          // Add background
          this.add.image(400, 300, 'background');
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
          
          // Instructions text
          this.instructionsText = this.add.text(400, 120, '', { 
            fontSize: '20px', 
            fill: '#FFF',
            fontFamily: 'Arial'
          }).setOrigin(0.5);
          
          // Launch button (for trajectory challenges)
          this.launchButton = this.add.text(700, 550, 'LAUNCH', { 
            fontSize: '24px', 
            fill: '#FFF',
            backgroundColor: '#1AECFF',
            padding: { x: 15, y: 10 }
          })
          .setOrigin(0.5)
          .setInteractive({ useHandCursor: true })
          .setVisible(false);
          
          this.launchButton.on('pointerdown', () => {
            if (this.currentChallenge === 'trajectory') {
              this.launchProjectile();
            }
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
            console.log(`Physics game update at ${Math.floor(time)}ms`);
          }
          
          // Challenge-specific updates
          if (this.currentChallenge === 'pendulum' && this.pendulum) {
            // Update pendulum challenge
            if (this.pendulumReleased && this.pendulumBall && this.pendulumTarget) {
              const distance = Phaser.Math.Distance.Between(
                this.pendulumBall.x, this.pendulumBall.y,
                this.pendulumTarget.x, this.pendulumTarget.y
              );
              
              if (distance < 50 && !this.targetHit) {
                this.targetHit = true;
                this.completeChallenge(true);
              }
            }
          } else if (this.currentChallenge === 'trajectory' && this.projectile && this.projectileLaunched) {
            // Update trajectory challenge
            if (this.projectile && this.target) {
              const distance = Phaser.Math.Distance.Between(
                this.projectile.x, this.projectile.y,
                this.target.x, this.target.y
              );
              
              if (distance < 50 && !this.targetHit) {
                this.targetHit = true;
                this.completeChallenge(true);
              }
              
              // Check if projectile is out of bounds
              if (this.projectile.y > 600 || this.projectile.x < 0 || this.projectile.x > 800) {
                if (!this.targetHit) {
                  this.completeChallenge(false);
                }
              }
            }
          }
        }
      },
      physics: {
        default: 'matter',
        matter: {
          gravity: { y: 1 },
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
        setError('Game reference not provided');
      }
    } catch (error) {
      console.error('Failed to create Phaser game:', error);
      setError(`Failed to create game: ${error.message}`);
    }

    // Cleanup on unmount
    return () => {
      console.log('Cleanup: Physics game component unmounting');
      // Don't destroy the game here - let the parent component handle it
      // This prevents the green screen issue when transitioning
    };
  }, [difficulty, initialLevel, onComplete, gameRef, studentId, gameId]); // Added initialLevel to dependencies

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
    const bodies = this.matter.world.localWorld.bodies;
    while(bodies.length > 0) {
      this.matter.world.remove(bodies[0]);
    }
    
    // List of available challenges
    const challenges = ['pendulum', 'trajectory', 'balance'];
    
    // Choose a challenge based on level
    const challengeIndex = (this.level - 1) % challenges.length;
    this.currentChallenge = challenges[challengeIndex];
    
    console.log(`Starting challenge: ${this.currentChallenge} at level ${this.level}`);
    
    // Setup the challenge
    switch(this.currentChallenge) {
      case 'pendulum':
        this.setupPendulumChallenge();
        break;
      case 'trajectory':
        this.setupTrajectoryChallenge();
        break;
      case 'balance':
        this.setupBalanceChallenge();
        break;
    }
  };
  
  Phaser.Scene.prototype.setupPendulumChallenge = function() {
    // Challenge description
    this.challengeText.setText('Pendulum Challenge');
    this.instructionsText.setText('Release the pendulum at the right moment to hit the target');
    
    // Hide launch button
    this.launchButton.setVisible(false);
    
    // Reset state
    this.pendulumReleased = false;
    this.targetHit = false;
    
    // Create a pendulum
    const pendulumLength = 250;
    const anchorX = 400;
    const anchorY = 100;
    
    // Create pendulum anchor
    const anchor = this.matter.add.circle(anchorX, anchorY, 10, { isStatic: true });
    
    // Create pendulum ball
    this.pendulumBall = this.matter.add.image(anchorX + pendulumLength, anchorY, 'pendulum', null, {
      mass: 30,
      friction: 0,
      frictionAir: 0.001,
      restitution: 0.9
    });
    this.pendulumBall.setScale(0.5);
    
    // Create a constraint (the pendulum string)
    this.pendulum = this.matter.add.constraint(anchor, this.pendulumBall, pendulumLength, 0);
    
    // Create a target
    const targetX = 600;
    const targetY = 400;
    this.pendulumTarget = this.matter.add.image(targetX, targetY, 'target', null, { isStatic: true });
    this.pendulumTarget.setScale(0.5);
    
    // Create release button
    const releaseButton = this.add.text(400, 550, 'RELEASE', { 
      fontSize: '24px', 
      fill: '#FFF',
      backgroundColor: '#1AECFF',
      padding: { x: 15, y: 10 }
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true });
    
    releaseButton.on('pointerdown', () => {
      if (!this.pendulumReleased) {
        this.pendulumReleased = true;
        this.matter.world.removeConstraint(this.pendulum);
        
        // Set a timer for challenge failure
        this.time.delayedCall(5000, () => {
          if (!this.targetHit) {
            this.completeChallenge(false);
          }
        });
      }
    });
    
    // Store button for cleanup
    this.releaseButton = releaseButton;
  };
  
  Phaser.Scene.prototype.setupTrajectoryChallenge = function() {
    // Challenge description
    this.challengeText.setText('Trajectory Challenge');
    this.instructionsText.setText('Adjust angle and power to hit the target');
    
    // Show launch button
    this.launchButton.setVisible(true);
    
    // Reset state
    this.projectileLaunched = false;
    this.targetHit = false;
    
    // Create a launcher platform
    const platformX = 100;
    const platformY = 500;
    const platform = this.matter.add.image(platformX, platformY, 'platform', null, { isStatic: true });
    platform.setScale(0.5);
    
    // Create a projectile
    this.projectile = this.matter.add.image(platformX, platformY - 30, 'ball', null, {
      mass: 10,
      friction: 0,
      frictionAir: 0.005,
      restitution: 0.9
    });
    this.projectile.setScale(0.3);
    this.projectile.setStatic(true); // Keep static until launched
    
    // Create a target
    const targetX = 650;
    const targetY = 300;
    this.target = this.matter.add.image(targetX, targetY, 'target', null, { isStatic: true });
    this.target.setScale(0.5);
    
    // Create aiming arrow
    this.arrow = this.add.image(platformX, platformY - 30, 'arrow');
    this.arrow.setOrigin(0, 0.5);
    this.arrow.setScale(2);
    
    // Power meter background
    this.powerBg = this.add.rectangle(100, 400, 30, 150, 0x333333);
    this.powerBg.setOrigin(0.5);
    
    // Power meter fill
    this.powerFill = this.add.rectangle(100, 475, 20, 0, 0x1AECFF);
    this.powerFill.setOrigin(0.5, 1);
    
    // Power text
    this.powerText = this.add.text(100, 330, 'POWER', {
      fontSize: '16px',
      fill: '#FFF'
    }).setOrigin(0.5);
    
    // Angle control
    let angle = -45;
    const updateAngle = () => {
      this.arrow.rotation = Phaser.Math.DegToRad(angle);
    };
    updateAngle();
    
    // Angle controls
    const angleUp = this.add.text(50, 250, '↑', {
      fontSize: '30px',
      fill: '#FFF',
      backgroundColor: '#555',
      padding: { x: 10, y: 5 }
    }).setInteractive({ useHandCursor: true });
    
    const angleDown = this.add.text(50, 300, '↓', {
      fontSize: '30px',
      fill: '#FFF',
      backgroundColor: '#555',
      padding: { x: 10, y: 5 }
    }).setInteractive({ useHandCursor: true });
    
    angleUp.on('pointerdown', () => {
      angle = Math.max(angle - 5, -90);
      updateAngle();
    });
    
    angleDown.on('pointerdown', () => {
      angle = Math.min(angle + 5, 0);
      updateAngle();
    });
    
    // Power controls
    const powerUp = this.add.text(150, 360, '+', {
      fontSize: '30px',
      fill: '#FFF',
      backgroundColor: '#555',
      padding: { x: 10, y: 5 }
    }).setInteractive({ useHandCursor: true });
    
    const powerDown = this.add.text(150, 410, '-', {
      fontSize: '30px',
      fill: '#FFF',
      backgroundColor: '#555',
      padding: { x: 10, y: 5 }
    }).setInteractive({ useHandCursor: true });
    
    let power = 50; // 0-100
    const updatePower = () => {
      const height = (power / 100) * 140;
      this.powerFill.height = height;
    };
    updatePower();
    
    powerUp.on('pointerdown', () => {
      power = Math.min(power + 5, 100);
      updatePower();
    });
    
    powerDown.on('pointerdown', () => {
      power = Math.max(power - 5, 10);
      updatePower();
    });
    
    // Store references for cleanup and use
    this.angleControls = [angleUp, angleDown];
    this.powerControls = [powerUp, powerDown];
    this.launchAngle = angle;
    this.launchPower = power;
  };
  
  Phaser.Scene.prototype.setupBalanceChallenge = function() {
    // Challenge description
    this.challengeText.setText('Balance Challenge');
    this.instructionsText.setText('Stack the blocks to reach the minimum height');
    
    // Hide launch button
    this.launchButton.setVisible(false);
    
    // Create a platform
    const platform = this.matter.add.rectangle(400, 550, 600, 20, { isStatic: true });
    
    // Create blocks that can be dragged
    this.blocks = [];
    const blockColors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff];
    const blockSizes = [
      { width: 100, height: 30 },
      { width: 60, height: 60 },
      { width: 120, height: 20 },
      { width: 40, height: 80 },
      { width: 80, height: 40 }
    ];
    
    for (let i = 0; i < 5; i++) {
      const block = this.add.rectangle(100 + i * 30, 200 + i * 50, blockSizes[i].width, blockSizes[i].height, blockColors[i]);
      
      // Add to physics
      const physicsBlock = this.matter.add.gameObject(block, {
        mass: 5,
        friction: 0.8,
        restitution: 0.1
      });
      
      // Make it draggable
      physicsBlock.setInteractive({ draggable: true });
      this.input.setDraggable(physicsBlock);
      
      this.blocks.push(physicsBlock);
    }
    
    // Create a target height line
    const targetHeight = 450 - this.level * 20; // Higher target for higher levels
    const targetLine = this.add.line(0, targetHeight, 0, 0, 800, 0, 0xff0000);
    targetLine.setLineWidth(2);
    
    this.add.text(700, targetHeight - 20, 'Target', {
      fontSize: '16px',
      fill: '#ff0000'
    });
    
    // Setup drag events
    this.input.on('dragstart', (pointer, gameObject) => {
      gameObject.setStatic(true);
    });
    
    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });
    
    this.input.on('dragend', (pointer, gameObject) => {
      gameObject.setStatic(false);
    });
    
    // Create a check button
    const checkButton = this.add.text(400, 550, 'CHECK BALANCE', { 
      fontSize: '24px', 
      fill: '#FFF',
      backgroundColor: '#1AECFF',
      padding: { x: 15, y: 10 }
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true });
    
    checkButton.on('pointerdown', () => {
      // Check if any block is above target height
      let success = false;
      
      // Wait a moment for blocks to settle
      this.time.delayedCall(1000, () => {
        for (const block of this.blocks) {
          if (block.y - block.height/2 < targetHeight) {
            success = true;
            break;
          }
        }
        
        this.completeChallenge(success);
      });
    });
    
    // Store check button for cleanup
    this.checkButton = checkButton;
    
    // Store target info
    this.targetHeight = targetHeight;
  };
  
  Phaser.Scene.prototype.launchProjectile = function() {
    if (this.projectileLaunched) return;
    
    this.projectileLaunched = true;
    this.projectile.setStatic(false);
    
    // Apply force based on angle and power
    const force = this.launchPower / 100 * 0.2;
    const angle = this.launchAngle;
    
    const forceMagnitude = 0.02 + force;
    const forceX = forceMagnitude * Math.cos(Phaser.Math.DegToRad(angle));
    const forceY = forceMagnitude * Math.sin(Phaser.Math.DegToRad(angle));
    
    this.projectile.setVelocity(forceX * 100, forceY * 100);
    
    // Hide controls after launch
    this.arrow.setVisible(false);
    this.powerBg.setVisible(false);
    this.powerFill.setVisible(false);
    this.powerText.setVisible(false);
    
    for (const control of [...this.angleControls, ...this.powerControls]) {
      control.setVisible(false);
    }
    
    // Set a timer for challenge failure
    this.time.delayedCall(5000, () => {
      if (!this.targetHit) {
        this.completeChallenge(false);
      }
    });
  };
  
  Phaser.Scene.prototype.completeChallenge = function(success) {
    // Clear timer callbacks
    this.time.removeAllEvents();
    
    // Increment questions answered counter
    this.questionsAnswered = (this.questionsAnswered || 0) + 1;
    
    // Visual feedback
    if (success) {
      this.cameras.main.flash(300, 0, 255, 0);
      this.score += 20;
      this.challengesCompleted++;
      console.log(`Challenge completed successfully! Challenges completed: ${this.challengesCompleted}/${this.challengesPerLevel}`);
    } else {
      this.cameras.main.flash(300, 255, 0, 0);
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
      this.time.delayedCall(1500, () => {
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
      skills: this.gameSkills || ['Problem Solving'],
      gameId: this.gameId,
      studentId: this.studentId,
      completedLevel: this.level,
      difficulty: this.difficulty
    };
    
    console.log('Physics game completed with data:', gameData);
    
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
              
              // Record game interaction in backend
              try {
                // Store difficulty for future reference
                if (this.studentId) {
                  localStorage.setItem(
                    `game_difficulty_${this.studentId}_${this.gameId}`, 
                    this.difficulty.toString()
                  );
                  
                  // Record game end time
                  const gameStartTime = localStorage.getItem(`game_start_${this.studentId}_${this.gameId}`);
                  if (gameStartTime) {
                    const playDuration = Date.now() - parseInt(gameStartTime);
                    console.log(`Game play duration: ${playDuration}ms`);
                    
                    // Clear the start time
                    localStorage.removeItem(`game_start_${this.studentId}_${this.gameId}`);
                  }
                  
                  // Remove progress record
                  localStorage.removeItem(`game_progress_${this.studentId}`);
                }
                
                // Send data to ML service
                const token = localStorage.getItem('token'); // Get auth token if available
                
                fetch('/api/ml/interaction', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                  },
                  body: JSON.stringify(gameData)
                })
                .then(response => response.json())
                .then(data => console.log('Interaction recorded:', data))
                .catch(error => console.error('Error recording interaction:', error));
              } catch (error) {
                console.warn('Failed to record game interaction:', error);
                // Continue with callback even if recording fails
              }
              
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

  // Show loading or error states
  if (loading) {
    return (
      <div className="physics-game-loading" style={{ 
        width: '800px', 
        height: '600px', 
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0c1445',
        color: 'white',
        borderRadius: '10px'
      }}>
        <div>
          <h2>Loading Physics Game...</h2>
          <p>Preparing your adaptive learning experience</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="physics-game-error" style={{ 
        width: '800px', 
        height: '600px', 
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1a1a1a',
        color: 'white',
        borderRadius: '10px'
      }}>
        <div>
          <h2>Error Loading Game</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="physics-game-container">
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

// How to use in StudentDashboard.js:
// 
// import PhysicsGame from '../games/PhysicsGame';
//
// // In StudentDashboard component:
// const gameRefs = {
//   'game4': useRef(null),
//   'game5': useRef(null),
//   // Add other game refs as needed
// };
//
// // Handle game completion
// const handleGameComplete = (gameData) => {
//   console.log('Game completed with data:', gameData);
//   // Reset the selected game to return to game selection
//   setSelectedGame(null);
// };
//
// // In the render section:
// {selectedGame && selectedGame.id === 'game4' && (
//   <PhysicsGame
//     gameRef={gameRefs['game4']}
//     studentId={userDataState?.id}
//     gameId="game4"
//     difficulty={selectedGame.adaptiveDifficulty}
//     onComplete={handleGameComplete}
//   />
// )}

export default PhysicsGame;