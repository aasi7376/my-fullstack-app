// src/components/common/CyberpunkBackground.js
import React from 'react';

const CyberpunkBackground = () => {
  return (
    <div className="cyberpunk-animated-bg">
      {/* Base gradient mesh */}
      <div className="gradient-mesh"></div>
      
      {/* Grid overlay */}
      <div className="grid-overlay"></div>
      
      {/* Digital rain effect */}
      <div className="digital-rain">
        {[...Array(20)].map((_, index) => (
          <div key={`rain-${index}`} className="rain-column"></div>
        ))}
      </div>
      
      {/* Glowing orbs */}
      <div className="glowing-orbs">
        {[...Array(5)].map((_, index) => (
          <div key={`orb-${index}`} className="orb"></div>
        ))}
      </div>
      
      {/* Circuit pattern */}
      <div className="circuit-pattern"></div>
      
      {/* Scanlines */}
      <div className="scanlines"></div>
      
      {/* Glow effect */}
      <div className="glow-effect"></div>
      
      {/* Particles */}
      <div className="particles">
        {[...Array(25)].map((_, index) => (
          <div key={`particle-${index}`} className="particle"></div>
        ))}
      </div>
      
      {/* Data streams */}
      <div className="data-stream">
        {[...Array(15)].map((_, index) => (
          <div key={`stream-${index}`} className="stream"></div>
        ))}
      </div>
      
      {/* Pulse overlay */}
      <div className="pulse-overlay"></div>
    </div>
  );
};

export default CyberpunkBackground;