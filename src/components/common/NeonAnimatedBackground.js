
import React, { useRef, useEffect } from 'react';
const NeonAnimatedBackground = ({ children }) => {
const canvasRef = useRef(null);
useEffect(() => {
const canvas = canvasRef.current;
const ctx = canvas.getContext('2d');
let animationFrameId;
let particles = [];
let mousePosition = { x: 0, y: 0 };
let lines = [];
// Set canvas to full window size
const resizeCanvas = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initParticles();
};

// Neon color themes based on Cognify colors with glow effect
const neonColors = [
  { r: 67, g: 97, b: 238, glow: '#4361ee' },   // Primary neon blue
  { r: 76, g: 201, b: 240, glow: '#4cc9f0' },  // Accent neon cyan
  { r: 236, g: 72, b: 153, glow: '#ec4899' },  // Neon pink
  { r: 129, g: 61, b: 221, glow: '#813ddd' }   // Neon purple
];

// Track mouse position for interactive effects
const updateMousePosition = (e) => {
  mousePosition.x = e.clientX;
  mousePosition.y = e.clientY;
};

// Particle class with neon glow
class NeonParticle {
  constructor() {
    this.reset();
  }
  
  reset() {
    // Position
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    
    // Size
    this.size = Math.random() * 4 + 2; // Smaller particles for neon effect
    
    // Movement
    this.speedX = Math.random() * 1 - 0.5; // -0.5 to 0.5
    this.speedY = Math.random() * 1 - 0.5; // -0.5 to 0.5
    
    // Appearance
    const colorIndex = Math.floor(Math.random() * neonColors.length);
    this.color = neonColors[colorIndex];
    
    // Opacity/glow animation
    this.alpha = Math.random() * 0.5 + 0.5; // 0.5 to 1
    this.alphaSpeed = Math.random() * 0.02 + 0.005; // 0.005 to 0.025
    this.alphaDirection = Math.random() > 0.5 ? 1 : -1; // Random initial direction
    
    // Pulse effect
    this.pulse = 0;
    this.pulseSpeed = Math.random() * 0.05 + 0.01; // 0.01 to 0.06
    
    // Interaction parameters
    this.interactionDistance = 150; // Distance to respond to mouse
    this.interacting = false;
  }
  
  update() {
    // Move
    this.x += this.speedX;
    this.y += this.speedY;
    
    // Pulse effect for glow
    this.pulse += this.pulseSpeed;
    if (this.pulse > Math.PI * 2) {
      this.pulse = 0;
    }
    
    // Update opacity with pulsing
    this.alpha += this.alphaSpeed * this.alphaDirection;
    if (this.alpha >= 1) {
      this.alphaDirection = -1;
    } else if (this.alpha <= 0.5) {
      this.alphaDirection = 1;
    }
    
    // Mouse interaction
    const dx = mousePosition.x - this.x;
    const dy = mousePosition.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < this.interactionDistance) {
      this.interacting = true;
      // Move away from mouse with a subtle effect
      const angle = Math.atan2(dy, dx);
      const repelForce = (this.interactionDistance - distance) / this.interactionDistance;
      this.speedX -= Math.cos(angle) * repelForce * 0.2;
      this.speedY -= Math.sin(angle) * repelForce * 0.2;
      
      // Limit max speed
      const maxSpeed = 3;
      const currentSpeed = Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY);
      if (currentSpeed > maxSpeed) {
        this.speedX = (this.speedX / currentSpeed) * maxSpeed;
        this.speedY = (this.speedY / currentSpeed) * maxSpeed;
      }
    } else {
      this.interacting = false;
      
      // Gradually slow down if not interacting
      this.speedX *= 0.99;
      this.speedY *= 0.99;
    }
    
    // Check if out of bounds
    if (this.x < 0) {
      this.x = 0;
      this.speedX *= -1;
    } else if (this.x > canvas.width) {
      this.x = canvas.width;
      this.speedX *= -1;
    }
    
    if (this.y < 0) {
      this.y = 0;
      this.speedY *= -1;
    } else if (this.y > canvas.height) {
      this.y = canvas.height;
      this.speedY *= -1;
    }
  }
  
  draw() {
    // Pulsing size for additional effect
    const pulsingSize = this.size + Math.sin(this.pulse) * (this.size * 0.3);
    const glowSize = pulsingSize * 3; // Size of glow effect
    
    // Draw glow (larger, more transparent circle underneath)
    const glow = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, glowSize
    );
    
    // Adjust glow intensity based on interaction
    const glowAlpha = this.interacting ? this.alpha * 0.7 : this.alpha * 0.4;
    
    glow.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${glowAlpha})`);
    glow.addColorStop(1, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`);
    
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(this.x, this.y, glowSize, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw main particle (small bright core)
    ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, pulsingSize, 0, Math.PI * 2);
    ctx.fill();
    
    // Extra bright center for neon effect
    ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha * 0.8})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, pulsingSize * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Line class for connecting particles
class NeonLine {
  constructor(particleA, particleB) {
    this.particleA = particleA;
    this.particleB = particleB;
    this.distance = 0;
    this.maxDistance = 150; // Maximum distance to draw a line
    this.alpha = 0;
  }
  
  update() {
    const dx = this.particleA.x - this.particleB.x;
    const dy = this.particleA.y - this.particleB.y;
    this.distance = Math.sqrt(dx * dx + dy * dy);
    
    // Only show lines between nearby particles
    if (this.distance < this.maxDistance) {
      // Alpha based on distance (closer = more opaque)
      this.alpha = (1 - this.distance / this.maxDistance) * 0.4;
    } else {
      this.alpha = 0;
    }
  }
  
  draw() {
    if (this.alpha <= 0) return;
    
    // Blend colors from both particles
    const r = Math.floor((this.particleA.color.r + this.particleB.color.r) / 2);
    const g = Math.floor((this.particleA.color.g + this.particleB.color.g) / 2);
    const b = Math.floor((this.particleA.color.b + this.particleB.color.b) / 2);
    
    // Create gradient for neon line effect
    const gradient = ctx.createLinearGradient(
      this.particleA.x, this.particleA.y,
      this.particleB.x, this.particleB.y
    );
    
    gradient.addColorStop(0, `rgba(${this.particleA.color.r}, ${this.particleA.color.g}, ${this.particleA.color.b}, ${this.alpha})`);
    gradient.addColorStop(1, `rgba(${this.particleB.color.r}, ${this.particleB.color.g}, ${this.particleB.color.b}, ${this.alpha})`);
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 1;
    
    // Add glow effect to lines
    ctx.shadowBlur = 10;
    ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${this.alpha})`;
    
    ctx.beginPath();
    ctx.moveTo(this.particleA.x, this.particleA.y);
    ctx.lineTo(this.particleB.x, this.particleB.y);
    ctx.stroke();
    
    // Reset shadow for next draw
    ctx.shadowBlur = 0;
  }
}

// Initialize particles and connections
const initParticles = () => {
  particles = [];
  lines = [];
  
  // Number of particles based on screen size
  const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 20000), 100);
  
  // Create particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new NeonParticle());
  }
  
  // Create lines between particles (not all combinations to save performance)
  for (let i = 0; i < particleCount; i++) {
    for (let j = i + 1; j < particleCount; j++) {
      if (Math.random() > 0.7) { // Only create some lines to avoid too many
        lines.push(new NeonLine(particles[i], particles[j]));
      }
    }
  }
};

// Animation loop
const animate = () => {
  // Create dark background with slight transparency for trail effect
  ctx.fillStyle = 'rgba(10, 10, 20, 0.2)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Update and draw all lines first (so they appear behind particles)
  lines.forEach(line => {
    line.update();
    line.draw();
  });
  
  // Update and draw all particles
  particles.forEach(particle => {
    particle.update();
    particle.draw();
  });
  
  animationFrameId = requestAnimationFrame(animate);
};

// Set up canvas and start animation
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
window.addEventListener('mousemove', updateMousePosition);

// Create dark background initially
ctx.fillStyle = 'rgba(10, 10, 20, 1)';
ctx.fillRect(0, 0, canvas.width, canvas.height);

animate();

// Clean up
return () => {
  window.removeEventListener('resize', resizeCanvas);
  window.removeEventListener('mousemove', updateMousePosition);
  cancelAnimationFrame(animationFrameId);
};
}, []);
return (
<div className="neon-animated-background-container" style={{ position: 'relative', width: '100%', height: '100%' }}>
<canvas
ref={canvasRef}
style={{
position: 'fixed',
top: 0,
left: 0,
width: '100%',
height: '100%',
zIndex: -1
}}
/>
<div style={{ position: 'relative', zIndex: 1 }}>
{children}
</div>
</div>
);
};
export default NeonAnimatedBackground;