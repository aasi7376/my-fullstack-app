import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const PerformanceChart = () => {
  // Sample data for chart
  const [chartData] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    scores: [65, 68, 70, 72, 75, 78, 82, 85, 89],
    engagement: [42, 45, 50, 55, 60, 68, 75, 80, 85],
    activity: [10, 15, 25, 30, 45, 50, 60, 70, 75]
  });
  
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });
  const [activePoint, setActivePoint] = useState(null);
  const [activeTooltip, setActiveTooltip] = useState({
    visible: false,
    data: null,
    position: { x: 0, y: 0 }
  });
  
  // Update chart dimensions when window resizes
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = Math.min(800, containerRef.current.offsetWidth - 20);
        setDimensions({ width, height: 400 });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);
  
  // Chart dimensions
  const { width, height } = dimensions;
  const padding = 60;
  
  // Calculate scales
  const xScale = (index) => padding + (index / (chartData.labels.length - 1)) * (width - padding * 2);
  const yScale = (value) => height - padding - ((value - 0) / (100 - 0)) * (height - padding * 2);
  
  // Generate path for each data series
  const generatePath = (data) => {
    return data.map((value, index) => {
      const x = xScale(index);
      const y = yScale(value);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };
  
  // Generate area path (same as line path but with additional points to close the shape)
  const generateAreaPath = (data) => {
    const linePath = generatePath(data);
    const lastIndex = data.length - 1;
    const lastX = xScale(lastIndex);
    const firstX = xScale(0);
    
    return `${linePath} L ${lastX} ${height - padding} L ${firstX} ${height - padding} Z`;
  };

  // Show tooltip on hover
  const handlePointHover = (type, value, index) => {
    const colors = {
      scores: '#00a8ff',
      engagement: '#8c7ae6',
      activity: '#00ff88'
    };

    const labels = {
      scores: 'Average Score',
      engagement: 'Student Engagement',
      activity: 'Learning Activity'
    };

    setActivePoint({
      type,
      index
    });

    setActiveTooltip({
      visible: true,
      data: {
        label: chartData.labels[index],
        value: value,
        type: labels[type],
        color: colors[type]
      },
      position: {
        x: xScale(index),
        y: yScale(value)
      }
    });
  };

  // Hide tooltip
  const handlePointLeave = () => {
    setActivePoint(null);
    setActiveTooltip({
      ...activeTooltip,
      visible: false
    });
  };
  
  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        overflowX: 'auto',
        position: 'relative'
      }}
      className="cyberpunk-chart-container"
    >
      {/* Animated Background */}
      <div className="chart-background">
        <div className="grid-lines"></div>
        <div className="glow-effect"></div>
      </div>

      {/* Tooltip */}
      {activeTooltip.visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          className="chart-tooltip"
          style={{
            position: 'absolute',
            left: activeTooltip.position.x,
            top: activeTooltip.position.y - 70,
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(15, 15, 35, 0.85)',
            backdropFilter: 'blur(5px)',
            borderRadius: '8px',
            padding: '10px 15px',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3), 0 0 10px rgba(185, 103, 255, 0.2)',
            border: '1px solid rgba(185, 103, 255, 0.3)',
            zIndex: 10,
            pointerEvents: 'none'
          }}
        >
          <div style={{ 
            color: '#fff', 
            fontWeight: 'bold', 
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            paddingBottom: '5px',
            marginBottom: '5px'
          }}>
            {activeTooltip.data.label}
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            color: activeTooltip.data.color
          }}>
            <div style={{ 
              width: '8px', 
              height: '8px', 
              backgroundColor: activeTooltip.data.color, 
              borderRadius: '50%' 
            }}></div>
            {activeTooltip.data.type}: <strong>{activeTooltip.data.value}%</strong>
          </div>
        </motion.div>
      )}

      <svg 
        width="100%" 
        height={height} 
        viewBox={`0 0 ${width} ${height}`}
        style={{ 
          minWidth: '600px',
          borderRadius: '10px',
        }}
        className="cyberpunk-chart"
      >
        {/* Glowing outline for the chart area */}
        <rect
          x={padding}
          y={padding}
          width={width - padding * 2}
          height={height - padding * 2}
          fill="transparent"
          stroke="rgba(185, 103, 255, 0.1)"
          strokeWidth="1"
          rx="5"
          className="chart-border"
        />

        {/* Background Grid */}
        {[0, 25, 50, 75, 100].map((value) => (
          <g key={`grid-${value}`}>
            <line 
              x1={padding} 
              y1={yScale(value)} 
              x2={width - padding} 
              y2={yScale(value)}
              stroke="rgba(185, 103, 255, 0.1)"
              strokeDasharray="5,5"
              className="grid-line"
            />
            <text 
              x={padding - 10} 
              y={yScale(value)} 
              textAnchor="end" 
              dominantBaseline="middle"
              fill="rgba(255,255,255,0.6)"
              fontSize="12"
              className="axis-label"
            >
              {value}%
            </text>
          </g>
        ))}
        
        {/* X-Axis Labels */}
        {chartData.labels.map((label, index) => (
          <text 
            key={`label-${index}`}
            x={xScale(index)} 
            y={height - padding + 20}
            textAnchor="middle"
            fill="rgba(255,255,255,0.6)"
            fontSize="12"
            className="axis-label"
          >
            {label}
          </text>
        ))}

        {/* X-Axis */}
        <line 
          x1={padding} 
          y1={height - padding} 
          x2={width - padding} 
          y2={height - padding}
          stroke="rgba(185, 103, 255, 0.3)"
          strokeWidth="1"
          className="axis-line"
        />
        
        {/* Y-Axis */}
        <line 
          x1={padding} 
          y1={padding} 
          x2={padding} 
          y2={height - padding}
          stroke="rgba(185, 103, 255, 0.3)"
          strokeWidth="1"
          className="axis-line"
        />
        
        {/* Score Area with gradient */}
        <defs>
          <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00a8ff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#00a8ff" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        <path 
          d={generateAreaPath(chartData.scores)}
          fill="url(#scoreGradient)"
          stroke="none"
          className="area-path"
        >
          <animate
            attributeName="opacity"
            values="0.7;0.9;0.7"
            dur="3s"
            repeatCount="indefinite"
          />
        </path>
        
        {/* Engagement Area with gradient */}
        <defs>
          <linearGradient id="engagementGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8c7ae6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#8c7ae6" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        <path 
          d={generateAreaPath(chartData.engagement)}
          fill="url(#engagementGradient)"
          stroke="none"
          className="area-path"
        >
          <animate
            attributeName="opacity"
            values="0.7;0.9;0.7"
            dur="4s"
            repeatCount="indefinite"
          />
        </path>
        
        {/* Activity Area with gradient */}
        <defs>
          <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00ff88" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#00ff88" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        <path 
          d={generateAreaPath(chartData.activity)}
          fill="url(#activityGradient)"
          stroke="none"
          className="area-path"
        >
          <animate
            attributeName="opacity"
            values="0.7;0.9;0.7"
            dur="3.5s"
            repeatCount="indefinite"
          />
        </path>
        
        {/* Score Line with glow */}
        <defs>
          <filter id="blueGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        <path 
          d={generatePath(chartData.scores)}
          fill="none"
          stroke="#00a8ff"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#blueGlow)"
          className="data-line"
        />
        
        {/* Engagement Line with glow */}
        <defs>
          <filter id="purpleGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        <path 
          d={generatePath(chartData.engagement)}
          fill="none"
          stroke="#8c7ae6"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#purpleGlow)"
          className="data-line"
        />
        
        {/* Activity Line with glow */}
        <defs>
          <filter id="greenGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        <path 
          d={generatePath(chartData.activity)}
          fill="none"
          stroke="#00ff88"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#greenGlow)"
          className="data-line"
        />
        
        {/* Data Points with hover effects */}
        {chartData.scores.map((value, index) => (
          <g 
            key={`score-${index}`}
            onMouseEnter={() => handlePointHover('scores', value, index)}
            onMouseLeave={handlePointLeave}
          >
            <circle 
              cx={xScale(index)} 
              cy={yScale(value)}
              r={activePoint && activePoint.type === 'scores' && activePoint.index === index ? "8" : "5"}
              fill="#00a8ff"
              stroke="#0f0f23"
              strokeWidth="2"
              className="data-point"
              style={{ 
                transition: 'r 0.2s ease',
                cursor: 'pointer'
              }}
            >
              <animate
                attributeName="opacity"
                values="1;0.8;1"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            {activePoint && activePoint.type === 'scores' && activePoint.index === index && (
              <circle 
                cx={xScale(index)} 
                cy={yScale(value)}
                r="12"
                fill="transparent"
                stroke="#00a8ff"
                strokeWidth="1"
                opacity="0.5"
              >
                <animate
                  attributeName="r"
                  values="8;15;8"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.6;0.2;0.6"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              </circle>
            )}
          </g>
        ))}
        
        {chartData.engagement.map((value, index) => (
          <g 
            key={`engagement-${index}`}
            onMouseEnter={() => handlePointHover('engagement', value, index)}
            onMouseLeave={handlePointLeave}
          >
            <circle 
              cx={xScale(index)} 
              cy={yScale(value)}
              r={activePoint && activePoint.type === 'engagement' && activePoint.index === index ? "8" : "5"}
              fill="#8c7ae6"
              stroke="#0f0f23"
              strokeWidth="2"
              className="data-point"
              style={{ 
                transition: 'r 0.2s ease',
                cursor: 'pointer'
              }}
            >
              <animate
                attributeName="opacity"
                values="1;0.8;1"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            {activePoint && activePoint.type === 'engagement' && activePoint.index === index && (
              <circle 
                cx={xScale(index)} 
                cy={yScale(value)}
                r="12"
                fill="transparent"
                stroke="#8c7ae6"
                strokeWidth="1"
                opacity="0.5"
              >
                <animate
                  attributeName="r"
                  values="8;15;8"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.6;0.2;0.6"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              </circle>
            )}
          </g>
        ))}
        
        {chartData.activity.map((value, index) => (
          <g 
            key={`activity-${index}`}
            onMouseEnter={() => handlePointHover('activity', value, index)}
            onMouseLeave={handlePointLeave}
          >
            <circle 
              cx={xScale(index)} 
              cy={yScale(value)}
              r={activePoint && activePoint.type === 'activity' && activePoint.index === index ? "8" : "5"}
              fill="#00ff88"
              stroke="#0f0f23"
              strokeWidth="2"
              className="data-point"
              style={{ 
                transition: 'r 0.2s ease',
                cursor: 'pointer'
              }}
            >
              <animate
                attributeName="opacity"
                values="1;0.8;1"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            {activePoint && activePoint.type === 'activity' && activePoint.index === index && (
              <circle 
                cx={xScale(index)} 
                cy={yScale(value)}
                r="12"
                fill="transparent"
                stroke="#00ff88"
                strokeWidth="1"
                opacity="0.5"
              >
                <animate
                  attributeName="r"
                  values="8;15;8"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.6;0.2;0.6"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              </circle>
            )}
          </g>
        ))}
      </svg>
      
      {/* Enhanced Legend */}
      <div className="chart-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#00a8ff' }}></div>
          <span className="legend-label">Average Score</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#8c7ae6' }}></div>
          <span className="legend-label">Student Engagement</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#00ff88' }}></div>
          <span className="legend-label">Learning Activity</span>
        </div>
      </div>

      {/* Add CSS styles */}
      <style jsx>{`
        .cyberpunk-chart-container {
          padding: 10px;
          position: relative;
          border-radius: 12px;
        }

        .chart-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 0;
        }

        .grid-lines {
          background-image: 
            linear-gradient(rgba(185, 103, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(185, 103, 255, 0.05) 1px, transparent 1px);
          background-size: 20px 20px;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          opacity: 0.5;
        }

        .glow-effect {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 50% 50%, rgba(185, 103, 255, 0.1) 0%, transparent 70%);
          opacity: 0.3;
        }

        .cyberpunk-chart {
          position: relative;
          z-index: 1;
          background-color: rgba(15, 15, 35, 0.3);
          border-radius: 12px;
          overflow: visible;
        }

        .chart-border {
          box-shadow: 0 0 20px rgba(185, 103, 255, 0.2);
        }

        .grid-line {
          transition: stroke 0.3s ease;
        }
        
        .cyberpunk-chart:hover .grid-line {
          stroke: rgba(185, 103, 255, 0.15);
        }

        .axis-label {
          font-family: 'Inter', sans-serif;
          transition: fill 0.3s ease;
        }
        
        .cyberpunk-chart:hover .axis-label {
          fill: rgba(255, 255, 255, 0.8);
        }

        .axis-line {
          transition: stroke 0.3s ease;
        }
        
        .cyberpunk-chart:hover .axis-line {
          stroke: rgba(185, 103, 255, 0.5);
        }

        .area-path {
          transition: opacity 0.3s ease;
        }

        .data-line {
          transition: opacity 0.3s ease, stroke-width 0.3s ease;
        }
        
        .cyberpunk-chart:hover .data-line {
          stroke-width: 4;
        }

        .data-point {
          transition: r 0.3s ease, stroke-width 0.3s ease;
        }
        
        .data-point:hover {
          stroke-width: 3;
        }

        .chart-legend {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 20px;
          flex-wrap: wrap;
          padding: 10px;
          background-color: rgba(15, 15, 35, 0.3);
          border-radius: 8px;
          border: 1px solid rgba(185, 103, 255, 0.1);
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 5px 10px;
          border-radius: 5px;
          transition: background-color 0.3s ease;
        }
        
        .legend-item:hover {
          background-color: rgba(185, 103, 255, 0.1);
        }

        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          box-shadow: 0 0 8px currentColor;
        }

        .legend-label {
          color: #ffffff;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
};

export default PerformanceChart;