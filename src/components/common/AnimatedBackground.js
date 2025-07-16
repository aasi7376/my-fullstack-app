import React, { useRef, useEffect } from 'react';
const AnimatedBackground = ({ children }) => {
const canvasRef = useRef(null);
useEffect(() => {
const canvas = canvasRef.current;
const ctx = canvas.getContext('2d');
let animationFrameId;
let particles = [];
// Set canvas to full window size
const resizeCanvas = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initParticles(); // Reinitialize particles when resizing
};

// Color theme based on Cognify colors
const colors = [
  { r: 67, g: 97, b: 238, a: 0.3 },  // Primary color
  { r: 63, g: 55, b: 201, a: 0.3 },  // Secondary color
  { r: 76, g: 201, b: 240, a: 0.3 }, // Accent color
];

// Particle class
class Particle {
  constructor() {
    this.reset();
  }
  
  reset() {
    // Position
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    
    // Size
    this.size = Math.random() * 60 + 40; // 40-100px
    
    // Movement
    this.speedX = Math.random() * 0.5 - 0.25; // -0.25 to 0.25
    this.speedY = Math.random() * 0.5 - 0.25; // -0.25 to 0.25
    
    // Appearance
    const colorIndex = Math.floor(Math.random() * colors.length);
    this.color = colors[colorIndex];
    
    // Opacity animation
    this.alpha = 0;
    this.alphaSpeed = Math.random() * 0.01 + 0.005; // 0.005 to 0.015
    this.alphaDirection = 1; // 1 for increasing, -1 for decreasing
    
    // Shape
    this.shape = Math.floor(Math.random() * 3); // 0: circle, 1: square, 2: triangle
    
    // Rotation
    this.rotation = 0;
    this.rotationSpeed = Math.random() * 0.02 - 0.01; // -0.01 to 0.01
  }
  
  update() {
    // Move
    this.x += this.speedX;
    this.y += this.speedY;
    
    // Rotate
    this.rotation += this.rotationSpeed;
    
    // Update opacity
    this.alpha += this.alphaSpeed * this.alphaDirection;
    if (this.alpha >= 0.5) {
      this.alphaDirection = -1;
    }
    if (this.alpha <= 0 && this.alphaDirection === -1) {
      this.reset();
    }
    
    // Check if out of bounds
    if (this.x < -this.size || this.x > canvas.width + this.size || 
        this.y < -this.size || this.y > canvas.height + this.size) {
      this.reset();
    }
  }
  
  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    
    // Determine color with current alpha
    const color = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha})`;
    
    ctx.fillStyle = color;
    ctx.beginPath();
    
    // Draw different shapes
    switch(this.shape) {
      case 0: // Circle
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        break;
      case 1: // Square
        ctx.rect(-this.size / 2, -this.size / 2, this.size, this.size);
        break;
      case 2: // Triangle
        ctx.moveTo(0, -this.size / 2);
        ctx.lineTo(this.size / 2, this.size / 2);
        ctx.lineTo(-this.size / 2, this.size / 2);
        ctx.closePath();
        break;
    }
    
    ctx.fill();
    ctx.restore();
  }
}

// Initialize particles
const initParticles = () => {
  particles = [];
  const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 30000), 40);
  
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
};

// Animation loop
const animate = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
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
animate();

// Clean up
return () => {
  window.removeEventListener('resize', resizeCanvas);
  cancelAnimationFrame(animationFrameId);
};
}, []);
return (
<div className="animated-background-container" style={{ position: 'relative', width: '100%', height: '100%' }}>
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
export default AnimatedBackground;