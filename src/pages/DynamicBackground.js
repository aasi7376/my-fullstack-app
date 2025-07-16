// Enhanced DynamicBackground component for more visual impact
// This can be placed directly in your AuthPage.js or extracted to a separate file

import React, { useEffect, useState } from 'react';

const DynamicBackground = ({ mousePosition }) => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });

  // Update window size on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Base styles
  const gradientStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a35 100%)',
    zIndex: -10,
    overflow: 'hidden'
  };

  // Create animated particles
  const particleCount = 30;
  const particles = Array.from({ length: particleCount }).map((_, i) => {
    const size = Math.random() * 300 + 50;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const hue = Math.random() * 60 + 200; // Blues and purples
    const delay = Math.random() * 10;
    const duration = Math.random() * 20 + 15;

    return (
      <div
        key={i}
        style={{
          position: 'absolute',
          top: `${y}%`,
          left: `${x}%`,
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          background: `radial-gradient(circle, hsla(${hue}, 80%, 60%, 0.03) 0%, transparent 70%)`,
          transform: 'translate(-50%, -50%)',
          animation: `pulse${i} ${duration}s ease-in-out ${delay}s infinite alternate`,
          zIndex: -9
        }}
      />
    );
  });

  // Create animated lines
  const lineCount = 15;
  const lines = Array.from({ length: lineCount }).map((_, i) => {
    const start = {
      x: Math.random() * windowSize.width,
      y: Math.random() * windowSize.height
    };
    const end = {
      x: Math.random() * windowSize.width,
      y: Math.random() * windowSize.height
    };
    const width = Math.random() * 1 + 0.5;
    const hue = Math.random() * 60 + 200; // Blues and purples
    const delay = Math.random() * 5;
    const duration = Math.random() * 10 + 10;

    return (
      <div
        key={`line-${i}`}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -8,
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: start.y,
            left: start.x,
            width: Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)),
            height: width,
            background: `hsla(${hue}, 80%, 60%, 0.1)`,
            transformOrigin: '0 0',
            transform: `rotate(${Math.atan2(end.y - start.y, end.x - start.x)}rad)`,
            animation: `fade${i} ${duration}s ease-in-out ${delay}s infinite alternate`
          }}
        />
      </div>
    );
  });

  // Mouse cursor effect
  const cursorHighlight = {
    position: 'fixed',
    top: mousePosition.y,
    left: mousePosition.x,
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(0, 168, 255, 0.08) 0%, transparent 70%)',
    transform: 'translate(-50%, -50%)',
    transition: 'all 0.1s ease-out',
    pointerEvents: 'none',
    zIndex: -7
  };

  // Create additional larger glow effect
  const secondaryGlow = {
    position: 'fixed',
    top: mousePosition.y,
    left: mousePosition.x,
    width: '800px',
    height: '800px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(0, 255, 136, 0.03) 0%, transparent 70%)',
    transform: 'translate(-50%, -50%)',
    transition: 'all 0.2s ease-out',
    pointerEvents: 'none',
    zIndex: -8
  };

  // Create animated CSS
  const generateAnimations = () => {
    let styles = '';
    
    // Pulse animations for particles
    for (let i = 0; i < particleCount; i++) {
      styles += `
        @keyframes pulse${i} {
          0% { opacity: ${0.1 + Math.random() * 0.2}; transform: translate(-50%, -50%) scale(${0.6 + Math.random() * 0.4}); }
          100% { opacity: ${0.5 + Math.random() * 0.3}; transform: translate(-50%, -50%) scale(${0.9 + Math.random() * 0.4}); }
        }
      `;
    }
    
    // Fade animations for lines
    for (let i = 0; i < lineCount; i++) {
      styles += `
        @keyframes fade${i} {
          0% { opacity: ${0.05 + Math.random() * 0.1}; }
          100% { opacity: ${0.2 + Math.random() * 0.1}; }
        }
      `;
    }
    
    return styles;
  };

  return (
    <>
      <div style={gradientStyle} />
      
      {/* Particles */}
      {particles}
      
      {/* Lines */}
      {lines}
      
      {/* Mouse effects */}
      <div style={cursorHighlight} />
      <div style={secondaryGlow} />
      
      {/* Add some fixed decorative elements */}
      <div style={{
        position: 'fixed',
        bottom: '5%',
        right: '5%',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(140, 122, 230, 0.05) 0%, transparent 70%)',
        zIndex: -9
      }} />
      
      <div style={{
        position: 'fixed',
        top: '10%',
        left: '5%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255, 107, 157, 0.04) 0%, transparent 70%)',
        zIndex: -9
      }} />
      
      {/* Animations */}
      <style>
        {generateAnimations()}
      </style>
    </>
  );
};

export default DynamicBackground;