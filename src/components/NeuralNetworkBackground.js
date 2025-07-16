// src/components/NeuralNetworkBackground.jsx
import React, { useEffect, useRef } from 'react';

const NeuralNetworkBackground = () => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Settings
    const neuronCount = Math.floor(width * height / 20000); // Adjust density as needed
    const neurons = [];
    const synapses = [];
    const maxConnections = 3; // Maximum connections per neuron
    const maxDistance = Math.min(width, height) / 2.5; // Maximum connection distance
    const colors = [
      'rgba(0, 230, 255, 0.7)',   // Cyan
      'rgba(185, 103, 255, 0.7)', // Purple
      'rgba(57, 255, 20, 0.7)',   // Green
      'rgba(255, 41, 148, 0.7)',  // Pink
      'rgba(0, 119, 255, 0.7)'    // Blue
    ];
    
    // Helper function to blend colors
    const blendColors = (color1, color2) => {
      // Simple alpha blending
      return color1.replace('0.7', '0.5');
    };
    
    // Helper function to animate glow spots
    const animateGlowSpot = (element) => {
      const duration = Math.random() * 20000 + 10000;
      const newX = Math.random() * 100;
      const newY = Math.random() * 100;
      
      element.animate([
        { left: element.style.left, top: element.style.top },
        { left: `${newX}%`, top: `${newY}%` }
      ], {
        duration: duration,
        easing: 'ease-in-out',
        fill: 'forwards'
      }).onfinish = () => {
        element.style.left = `${newX}%`;
        element.style.top = `${newY}%`;
        animateGlowSpot(element);
      };
    };
    
    // Create glow spots
    const glowSpotCount = 8;
    for (let i = 0; i < glowSpotCount; i++) {
      const glowSpot = document.createElement('div');
      glowSpot.className = 'glow-spot';
      glowSpot.style.left = `${Math.random() * 100}%`;
      glowSpot.style.top = `${Math.random() * 100}%`;
      glowSpot.style.opacity = Math.random() * 0.3 + 0.1;
      
      // Random color from colors array
      const colorIndex = Math.floor(Math.random() * colors.length);
      glowSpot.style.background = `radial-gradient(circle, ${colors[colorIndex].replace('0.7', '0.15')} 0%, transparent 70%)`;
      
      container.appendChild(glowSpot);
      
      // Animate glow spots
      animateGlowSpot(glowSpot);
    }
    
    // Create neurons
    for (let i = 0; i < neuronCount; i++) {
      const neuron = document.createElement('div');
      neuron.className = 'neuron';
      
      const x = Math.random() * width;
      const y = Math.random() * height;
      
      neuron.style.left = `${x}px`;
      neuron.style.top = `${y}px`;
      
      // Random size
      const size = Math.random() * 3 + 2;
      neuron.style.width = `${size}px`;
      neuron.style.height = `${size}px`;
      
      // Random color from colors array
      const colorIndex = Math.floor(Math.random() * colors.length);
      neuron.style.backgroundColor = colors[colorIndex];
      neuron.style.boxShadow = `0 0 10px ${colors[colorIndex]}, 0 0 20px ${colors[colorIndex].replace('0.7', '0.3')}`;
      
      // Random opacity
      neuron.style.opacity = Math.random() * 0.5 + 0.2;
      
      container.appendChild(neuron);
      
      neurons.push({
        element: neuron,
        x,
        y,
        vx: Math.random() * 0.2 - 0.1,
        vy: Math.random() * 0.2 - 0.1,
        connections: 0,
        color: colors[colorIndex]
      });
    }
    
    // Create synapses (connections)
    for (let i = 0; i < neurons.length; i++) {
      const neuron1 = neurons[i];
      
      // Skip if max connections reached
      if (neuron1.connections >= maxConnections) continue;
      
      // Find closest neurons
      const distances = [];
      for (let j = 0; j < neurons.length; j++) {
        if (i === j) continue;
        
        const neuron2 = neurons[j];
        
        // Skip if max connections reached
        if (neuron2.connections >= maxConnections) continue;
        
        const dx = neuron1.x - neuron2.x;
        const dy = neuron1.y - neuron2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < maxDistance) {
          distances.push({ index: j, distance });
        }
      }
      
      // Sort by distance
      distances.sort((a, b) => a.distance - b.distance);
      
      // Connect to closest neurons (up to max connections)
      const connectionsToMake = Math.min(
        distances.length,
        maxConnections - neuron1.connections
      );
      
      for (let k = 0; k < connectionsToMake; k++) {
        const neuron2 = neurons[distances[k].index];
        
        // Skip if already at max connections
        if (neuron2.connections >= maxConnections) continue;
        
        // Create synapse
        const synapse = document.createElement('div');
        synapse.className = 'synapse';
        
        // Position and rotate synapse to connect neurons
        const dx = neuron2.x - neuron1.x;
        const dy = neuron2.y - neuron1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        
        synapse.style.width = `${distance}px`;
        synapse.style.left = `${neuron1.x}px`;
        synapse.style.top = `${neuron1.y}px`;
        synapse.style.transform = `rotate(${angle}rad)`;
        
        // Blend the colors of the connected neurons
        const blendedColor = blendColors(neuron1.color, neuron2.color);
        synapse.style.background = `linear-gradient(90deg, ${neuron1.color}, ${blendedColor}, ${neuron2.color})`;
        
        container.appendChild(synapse);
        
        synapses.push({
          element: synapse,
          neuron1: i,
          neuron2: distances[k].index,
          pulseTime: Math.random() * 10000 // Random time for first pulse
        });
        
        // Increment connection count
        neuron1.connections++;
        neuron2.connections++;
      }
    }
    
    // Helper function to create a pulse
    const createPulse = (neuron1, neuron2, container) => {
      const pulse = document.createElement('div');
      pulse.className = 'pulse';
      
      // Start at neuron1
      pulse.style.left = `${neuron1.x}px`;
      pulse.style.top = `${neuron1.y}px`;
      
      // Random color based on the neurons
      const useColor = Math.random() > 0.5 ? neuron1.color : neuron2.color;
      pulse.style.backgroundColor = useColor;
      pulse.style.boxShadow = `0 0 15px ${useColor}, 0 0 30px ${useColor.replace('0.7', '0.3')}`;
      
      container.appendChild(pulse);
      
      // Animate pulse from neuron1 to neuron2
      const animation = pulse.animate([
        { left: `${neuron1.x}px`, top: `${neuron1.y}px`, opacity: 0.8, transform: 'scale(0.8)' },
        { opacity: 0.4, transform: 'scale(1.2)' },
        { left: `${neuron2.x}px`, top: `${neuron2.y}px`, opacity: 0, transform: 'scale(0.8)' }
      ], {
        duration: 2000,
        easing: 'ease-in-out'
      });
      
      animation.onfinish = () => {
        if (container.contains(pulse)) {
          container.removeChild(pulse);
        }
      };
    };
    
    // Animation frame
    let lastTime = 0;
    const animate = (time) => {
      const delta = time - lastTime;
      lastTime = time;
      
      // Move neurons
      neurons.forEach((neuron) => {
        // Update position
        neuron.x += neuron.vx;
        neuron.y += neuron.vy;
        
        // Bounce off edges
        if (neuron.x < 0 || neuron.x > width) neuron.vx *= -1;
        if (neuron.y < 0 || neuron.y > height) neuron.vy *= -1;
        
        // Update element position
        neuron.element.style.left = `${neuron.x}px`;
        neuron.element.style.top = `${neuron.y}px`;
      });
      
      // Update synapses
      synapses.forEach((synapse) => {
        const neuron1 = neurons[synapse.neuron1];
        const neuron2 = neurons[synapse.neuron2];
        
        // Update position and rotation
        const dx = neuron2.x - neuron1.x;
        const dy = neuron2.y - neuron1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        
        synapse.element.style.width = `${distance}px`;
        synapse.element.style.left = `${neuron1.x}px`;
        synapse.element.style.top = `${neuron1.y}px`;
        synapse.element.style.transform = `rotate(${angle}rad)`;
        
        // Create pulses randomly
        synapse.pulseTime -= delta;
        if (synapse.pulseTime <= 0) {
          createPulse(neuron1, neuron2, container);
          synapse.pulseTime = Math.random() * 8000 + 2000; // Random time between pulses
        }
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    let animationFrameId = requestAnimationFrame(animate);
    
    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, []);
  
  return (
    <div ref={containerRef} className="neural-network-background"></div>
  );
};

export default NeuralNetworkBackground;