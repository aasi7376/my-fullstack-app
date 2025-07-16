import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  Trophy, 
  Clock, 
  Calendar, 
  Activity, 
  Star, 
  Home,
  Brain,
  User,
  LogOut,
  Menu,
  X,
  CheckCircle,
  LineChart,
  BarChart2,
  MessageCircle,
  Award,
  PieChart,
  Play,
  Send,
  Calculator,
  Atom,
  FlaskConical,
  Shapes,
  Target,
  Zap,
  RotateCcw,
  Edit2,
  Settings
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProfileModal from '../components/ProfileModal';
import { useAuth } from '../context/AuthContext';
import doubtService from '../services/doubtService';
import statsService from '../services/statsService';
import mlService from '../services/mlService';
import { gameProgressService } from '../services/gameProgressService';

// Add the missing method if it doesn't exist
if (!mlService.forceActive) {
  mlService.forceActive = function(active) {
    console.log(`ML Service force active state: ${active}`);
    return true;
  };
}

// Typography configuration
const TYPOGRAPHY = {
  fontFamily: {
    primary: "'Poppins', sans-serif",
    headings: "'Montserrat', sans-serif",
    accent: "'Inter', sans-serif"
  },
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px'
  }
};

// Neon Echo Rings Color Palette
const COLORS = {
  background: '#151521', // Deep charcoal
  backgroundDarker: '#0d0d14',
  backgroundLighter: '#1d1d2e',
  primary: '#39FF14', // Vibrant green
  secondary: '#9D00FF', // Purple
  accent1: '#1AECFF', // Cyan
  accent2: '#FF2777', // Pink
  accent3: '#F8FF00', // Yellow
  dark: '#0A0A0F',
  light: '#FFFFFF',
  gray: '#8A8A9B'
};

// Motivational quotes that change every 15 seconds
const motivationalQuotes = [
  "Education is the most powerful weapon which you can use to change the world. - Nelson Mandela",
  "The beautiful thing about learning is that no one can take it away from you. - B.B. King",
  "Live as if you were to die tomorrow. Learn as if you were to live forever. - Mahatma Gandhi",
  "An investment in knowledge pays the best interest. - Benjamin Franklin",
  "The more that you read, the more things you will know. The more that you learn, the more places you'll go. - Dr. Seuss"
];

// Educational games
const educationalGames = [
  {
    id: 'game1',
    title: 'Math Master',
    category: 'Mathematics',
    difficulty: 'Easy to Hard',
    bestScore: 92,
    color: COLORS.primary,
    icon: <Calculator />,
    description: "Practice arithmetic operations and improve your calculation speed through interactive challenges.",
    skills: ["Arithmetic", "Problem Solving", "Quick Thinking"],
    lastPlayed: "2 days ago",
    xpReward: 250,
    totalPlays: 28,
    completedLevels: 5,
    totalLevels: 8,
    levels: [
      { id: 1, title: "Basic Arithmetic", completed: true, score: 98 },
      { id: 2, title: "Linear Equations", completed: true, score: 85 },
      { id: 3, title: "Quadratic Functions", completed: true, score: 90 },
      { id: 4, title: "Trigonometry", completed: true, score: 88 },
      { id: 5, title: "Calculus Basics", completed: true, score: 78 },
      { id: 6, title: "Integration", completed: false },
      { id: 7, title: "Differential Equations", completed: false },
      { id: 8, title: "Advanced Calculus", completed: false }
    ]
  },
  {
    id: 'game2',
    title: 'Physics Lab',
    category: 'Physics',
    difficulty: 'Medium to Hard',
    bestScore: 78,
    color: COLORS.accent1,
    icon: <Atom />,
    description: "Explore the fundamental laws of physics through interactive experiments and hands-on challenges.",
    skills: ["Mechanics", "Energy", "Critical Thinking"],
    lastPlayed: "5 days ago",
    xpReward: 350,
    totalPlays: 14,
    completedLevels: 3,
    totalLevels: 10,
    levels: [
      { id: 1, title: "Motion & Forces", completed: true, score: 92 },
      { id: 2, title: "Energy & Work", completed: true, score: 85 },
      { id: 3, title: "Waves & Sound", completed: true, score: 76 },
      { id: 4, title: "Heat & Temperature", completed: false },
      { id: 5, title: "Electricity", completed: false },
      { id: 6, title: "Magnetism", completed: false },
      { id: 7, title: "Optics", completed: false },
      { id: 8, title: "Modern Physics", completed: false },
      { id: 9, title: "Quantum Mechanics", completed: false },
      { id: 10, title: "Relativity", completed: false }
    ]
  },
  {
    id: 'game3',
    title: 'Chemistry Quest',
    category: 'Chemistry',
    difficulty: 'Medium',
    bestScore: 86,
    color: COLORS.secondary,
    icon: <FlaskConical />,
    description: "Build molecules, understand chemical bonds, and experiment with reactions in this interactive chemistry game.",
    skills: ["Chemical Bonds", "Reactions", "Pattern Recognition"],
    lastPlayed: "1 day ago",
    xpReward: 300,
    totalPlays: 22,
    completedLevels: 4,
    totalLevels: 9,
    levels: [
      { id: 1, title: "Periodic Table", completed: true, score: 95 },
      { id: 2, title: "Chemical Bonds", completed: true, score: 88 },
      { id: 3, title: "Acid-Base Reactions", completed: true, score: 82 },
      { id: 4, title: "Organic Chemistry", completed: true, score: 79 },
      { id: 5, title: "Thermochemistry", completed: false },
      { id: 6, title: "Equilibrium", completed: false },
      { id: 7, title: "Electrochemistry", completed: false },
      { id: 8, title: "Nuclear Chemistry", completed: false },
      { id: 9, title: "Biochemistry", completed: false }
    ]
  }
];

// Mock data for recent activities
const recentActivities = [
  {
    id: 'activity1',
    title: 'Math Quiz Completed',
    description: 'Advanced Calculus - Score: 92%',
    time: '2h ago',
    color: COLORS.primary,
    icon: <CheckCircle />
  },
  {
    id: 'activity2',
    title: 'Physics Lab Finished',
    description: 'Electromagnetic Waves - Score: 87%',
    time: '1d ago',
    color: COLORS.accent1,
    icon: <CheckCircle />
  },
  {
    id: 'activity3',
    title: 'Chemistry Assignment',
    description: 'Organic Reactions - Score: 85%',
    time: '2d ago',
    color: COLORS.secondary,
    icon: <Activity />
  }
];

// Mock data for progress chart
const progressChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  path: 'M0,150 L100,120 L200,140 L300,90 L400,70 L500,40 L600,20',
  points: [
    { x: 0, y: 150 },
    { x: 100, y: 120 },
    { x: 200, y: 140 },
    { x: 300, y: 90 },
    { x: 400, y: 70 },
    { x: 500, y: 40 },
    { x: 600, y: 20 }
  ],
  monthlyProgress: 18,
  metrics: [
    { label: 'Hours', value: '342', color: '255, 39, 119', icon: <Clock size={16} /> },
    { label: 'Games', value: '12', color: '157, 0, 255', icon: <Brain size={16} /> },
    { label: 'Assignments', value: '48', color: '26, 236, 255', icon: <CheckCircle size={16} /> },
    { label: 'Points', value: '3680', color: '57, 255, 20', icon: <Star size={16} /> }
  ]
};

// Mock exams data
const exams = [
  {
    id: 'exam1',
    title: 'Advanced Mathematics Midterm',
    date: 'June 25, 2025',
    time: '10:00 AM - 12:00 PM',
    duration: '2 hours',
    status: 'Upcoming',
    color: COLORS.primary
  },
  {
    id: 'exam2',
    title: 'Introduction to Physics Quiz',
    date: 'June 21, 2025',
    time: '2:00 PM - 3:00 PM',
    duration: '1 hour',
    status: 'Upcoming',
    color: COLORS.accent1
  },
  {
    id: 'exam3',
    title: 'Chemistry Lab Practical',
    date: 'June 30, 2025',
    time: '1:00 PM - 3:00 PM',
    duration: '2 hours',
    status: 'Upcoming',
    color: COLORS.secondary
  }
];

// Sample questions for exams
const examQuestions = {
  'exam1': [
    {
      id: 1,
      question: "If f(x) = 3x² + 2x - 5, what is f'(x)?",
      options: ["6x + 2", "6x - 2", "3x² + 2", "3x + 2"],
      correct: 0
    },
    {
      id: 2,
      question: "Solve the equation: 2x² - 7x + 3 = 0",
      options: ["x = 3 or x = 0.5", "x = 3.5 or x = 0.5", "x = 3 or x = -0.5", "x = 0.5 or x = 3"],
      correct: 3
    },
    {
      id: 3,
      question: "What is the integral of 2x + 3?",
      options: ["x² + 3x + C", "x² + 3x", "2x² + 3x + C", "x² + 3 + C"],
      correct: 0
    }
  ],
  'exam2': [
    {
      id: 1,
      question: "What is Newton's Second Law of Motion?",
      options: ["F = ma", "For every action, there is an equal and opposite reaction", "An object at rest stays at rest", "Energy can neither be created nor destroyed"],
      correct: 0
    },
    {
      id: 2,
      question: "What is the SI unit of electric current?",
      options: ["Volt", "Watt", "Ampere", "Ohm"],
      correct: 2
    },
    {
      id: 3,
      question: "Which of these is NOT a type of electromagnetic wave?",
      options: ["X-rays", "Gamma rays", "Sound waves", "Radio waves"],
      correct: 2
    }
  ],
  'exam3': [
    {
      id: 1,
      question: "What is the pH of a neutral solution at 25°C?",
      options: ["0", "7", "14", "1"],
      correct: 1
    },
    {
      id: 2,
      question: "Which of these is NOT a noble gas?",
      options: ["Helium", "Neon", "Nitrogen", "Argon"],
      correct: 2
    },
    {
      id: 3,
      question: "What type of bond forms between atoms that share electrons?",
      options: ["Ionic bond", "Covalent bond", "Hydrogen bond", "Metallic bond"],
      correct: 1
    }
  ]
};

// Mock doubts data
const doubts = [
  {
    id: 'doubt1',
    subject: 'Mathematics',
    title: 'Integration by Parts Problem',
    description: "I'm struggling with this integration by parts problem. Can someone explain how to integrate ∫x·ln(x)dx?",
    status: 'Pending',
    date: 'June 18, 2025',
    color: COLORS.primary
  },
  {
    id: 'doubt2',
    subject: 'Physics',
    title: 'Circular Motion Concept',
    description: "How does centripetal force relate to angular velocity? I'm confused about the formula relationship.",
    status: 'Answered',
    date: 'June 15, 2025',
    color: COLORS.accent1
  }
];

// ML-related components
const RecommendedGames = ({ studentId, onPlayGame }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const data = await mlService.getRecommendedGames(studentId);
        setRecommendations(data);
      } catch (error) {
        console.error("Failed to fetch game recommendations:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecommendations();
  }, [studentId]);
  
  if (loading) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        color: COLORS.primary
      }}>
        <div style={{
          display: 'inline-block',
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          borderTop: `3px solid ${COLORS.primary}`,
          borderRight: `3px solid transparent`,
          animation: 'spin 1s linear infinite',
          marginBottom: '10px'
        }} />
        <p>Loading personalized recommendations...</p>
      </div>
    );
  }
  
  if (!recommendations.length) {
    return null;
  }
  
  return (
    <div style={{ marginBottom: '40px' }}>
      <h2 style={{ 
        fontSize: '22px', 
        marginBottom: '20px',
        fontWeight: 'bold',
        color: COLORS.primary,
        fontFamily: "'Orbitron', sans-serif",
        textShadow: `0 0 15px ${COLORS.primary}60`,
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <Brain size={24} />
        Recommended for You
      </h2>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        {recommendations.map((game, index) => (
          <div
            key={game.id}
            style={{
              background: `linear-gradient(135deg, ${COLORS.backgroundLighter}, ${COLORS.background})`,
              border: `1px solid ${game.color}30`,
              borderRadius: '20px',
              padding: '25px',
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: `0 10px 30px rgba(0, 0, 0, 0.3)`,
              animation: `fade-in 0.5s ease-out ${index * 0.1}s both`
            }}
          >
            <div style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primary}CC)`,
              borderRadius: '10px',
              padding: '5px 10px',
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#000',
              boxShadow: `0 0 10px ${COLORS.primary}50`,
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}>
              <Brain size={14} />
              {game.match}% Match
            </div>
            
            <div
              style={{
                background: `radial-gradient(circle at center, ${game.color}30 0%, rgba(0,0,0,0))`,
                color: game.color,
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                marginBottom: '20px',
                position: 'relative',
                zIndex: 2,
                border: `1px solid ${game.color}50`,
                boxShadow: `0 0 15px ${game.color}50`
              }}
            >
              {game.icon}
            </div>
            
            <h3 style={{ 
              fontSize: '22px', 
              marginBottom: '15px',
              fontWeight: 'bold',
              color: game.color,
              position: 'relative',
              zIndex: 2,
              textShadow: `0 0 15px ${game.color}60`,
              fontFamily: "'Orbitron', sans-serif"
            }}>{game.title}</h3>
            
            <div style={{ 
              display: 'flex', 
              gap: '10px', 
              marginBottom: '15px', 
              position: 'relative', 
              zIndex: 2,
              flexWrap: 'wrap'
            }}>
              <span style={{ 
                fontSize: '14px', 
                color: 'rgba(255,255,255,0.7)',
                background: 'rgba(0,0,0,0.3)',
                padding: '5px 10px',
                borderRadius: '10px'
              }}>{game.category}</span>
              <span
                style={{
                  backgroundColor: `${game.color}20`,
                  color: game.color,
                  border: `1px solid ${game.color}40`,
                  padding: '5px 12px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  boxShadow: `0 0 10px ${game.color}30`
                }}
              >
                {game.difficulty}
              </span>
            </div>
            
            <p style={{
              fontSize: '14px',
              color: 'rgba(255,255,255,0.7)',
              marginBottom: '15px',
              position: 'relative',
              zIndex: 2,
              lineHeight: '1.5'
            }}>
              {game.description}
            </p>
            
            <div style={{
              padding: '12px',
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '10px',
              marginBottom: '20px',
              border: `1px solid ${COLORS.primary}30`
            }}>
              <div style={{
                fontSize: '14px',
                color: COLORS.primary,
                marginBottom: '5px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <Brain size={14} />
                Why We Recommend This
              </div>
              <p style={{
                fontSize: '13px',
                color: 'rgba(255,255,255,0.7)',
                margin: 0
              }}>
                {game.reason}
              </p>
            </div>
            
            <button
              onClick={() => onPlayGame(game.id)}
              style={{
                background: `linear-gradient(135deg, ${game.color}, ${game.color}CC)`,
                boxShadow: `0 0 20px ${game.color}50`,
                border: 'none',
                borderRadius: '15px',
                padding: '15px',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginTop: 'auto',
                width: '100%',
                position: 'relative',
                zIndex: 2,
                fontFamily: "'Orbitron', sans-serif",
                letterSpacing: '1px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
            >
              <Play size={18} />
              Play Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const SkillGapIndicator = ({ studentId }) => {
  const [skillGaps, setSkillGaps] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSubject, setActiveSubject] = useState('mathematics');
  
  useEffect(() => {
    const fetchSkillGaps = async () => {
      try {
        setLoading(true);
        const data = await mlService.getSkillGaps(studentId);
        setSkillGaps(data);
      } catch (error) {
        console.error("Failed to fetch skill gaps:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSkillGaps();
  }, [studentId]);
  
  if (loading) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        color: COLORS.accent2
      }}>
        <div style={{
          display: 'inline-block',
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          borderTop: `3px solid ${COLORS.accent2}`,
          borderRight: `3px solid transparent`,
          animation: 'spin 1s linear infinite',
          marginBottom: '10px'
        }} />
        <p>Analyzing your skills...</p>
      </div>
    );
  }
  
  if (!skillGaps) {
    return null;
  }
  
  const subjectColors = {
    mathematics: COLORS.primary,
    physics: COLORS.accent1,
    chemistry: COLORS.secondary
  };
  
  return (
    <>
      <h3 style={{ 
        fontSize: '22px', 
        marginBottom: '20px',
        fontWeight: 'bold',
        color: COLORS.accent2,
        fontFamily: "'Orbitron', sans-serif",
        textShadow: `0 0 15px ${COLORS.accent2}60`
      }}>
        Skill Analysis
      </h3>
      
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '20px'
      }}>
        {Object.keys(skillGaps).map(subject => (
          <button
            key={subject}
            onClick={() => setActiveSubject(subject)}
            style={{
              background: activeSubject === subject ? 
                `linear-gradient(135deg, ${subjectColors[subject]}, ${subjectColors[subject]}80)` : 
                'rgba(0,0,0,0.3)',
              border: activeSubject === subject ? 
                'none' : 
                `1px solid ${subjectColors[subject]}50`,
              borderRadius: '10px',
              padding: '8px 15px',
              color: activeSubject === subject ? '#000' : subjectColors[subject],
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: activeSubject === subject ? 
                `0 0 15px ${subjectColors[subject]}50` : 
                'none',
              textTransform: 'capitalize'
            }}
          >
            {subject}
          </button>
        ))}
      </div>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
      }}>
        {skillGaps && 
          skillGaps[activeSubject] && 
          Array.isArray(skillGaps[activeSubject]) && 
          skillGaps[activeSubject].map(skill => {
            const gapPercentage = Math.max(0, 
              (skill.targetProficiency || 0) - (skill.proficiency || 0)
            );
            const color = gapPercentage > 20 ? COLORS.accent2 : 
                         gapPercentage > 10 ? COLORS.accent3 : 
                         COLORS.primary;
            
            return (
              <div 
                key={skill.skill || `skill-${Math.random()}`}
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: '10px',
                  padding: '15px',
                  border: `1px solid ${subjectColors[activeSubject] || COLORS.gray}30`
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '10px',
                  alignItems: 'center'
                }}>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: 'white'
                  }}>
                    {skill.skill}
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px'
                  }}>
                    <div style={{
                      fontSize: '14px',
                      color: 'rgba(255,255,255,0.7)'
                    }}>
                      <span style={{ color: color }}>{skill.proficiency || 0}%</span>
                      {' / '}
                      <span>{skill.targetProficiency || 0}%</span>
                    </div>
                    
                    {gapPercentage > 0 && (
                      <div style={{
                        padding: '5px 10px',
                        background: `${color}20`,
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: color,
                        border: `1px solid ${color}40`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}>
                        <LineChart size={12} />
                        {gapPercentage}% Gap
                      </div>
                    )}
                  </div>
                </div>
                
                <div style={{
                  width: '100%',
                  height: '10px',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '5px',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      height: '100%',
                      width: `${skill.proficiency || 0}%`,
                      background: `linear-gradient(90deg, ${subjectColors[activeSubject] || COLORS.gray}, ${subjectColors[activeSubject] || COLORS.gray}CC)`,
                      borderRadius: '5px',
                      zIndex: 1
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      height: '100%',
                      width: `${skill.targetProficiency || 0}%`,
                      borderRight: `2px dashed ${subjectColors[activeSubject] || COLORS.gray}`,
                      zIndex: 2
                    }}
                  />
                </div>
              </div>
            );
          }) || (
            // Fallback when no data is available
            <div style={{
              padding: '15px',
              textAlign: 'center',
              color: 'rgba(255, 255, 255, 0.7)'
            }}>
              No skill data available for this subject.
            </div>
          )
        }
      </div>
    </>
  );
};

const AdaptiveDifficultySettings = ({ studentId, gameId, onApply }) => {
  const [difficulty, setDifficulty] = useState(0.5);
  const [loading, setLoading] = useState(true);
  const [applyingSettings, setApplyingSettings] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  useEffect(() => {
    const fetchDifficulty = async () => {
      try {
        setLoading(true);
        const data = await mlService.getAdaptiveDifficulty(studentId, gameId);
        setDifficulty(data);
      } catch (error) {
        console.error("Failed to fetch adaptive difficulty:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDifficulty();
  }, [studentId, gameId]);
  
  const handleApply = async () => {
    try {
      setApplyingSettings(true);
      
      // Log the action for debugging
      console.log(`Applying difficulty settings: ${difficulty} for student ${studentId} on game ${gameId}`);
      
      // Call the API to update settings
      const result = await mlService.updateDifficultySettings(studentId, gameId, { difficulty });
      
      console.log("Settings update result:", result);
      
      // Show success state
      setApplySuccess(true);
      
      // Call the onApply callback if provided
      if (onApply) {
        onApply({ difficulty });
      }
      
      // Reset success state after delay
      setTimeout(() => {
        setApplySuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to update difficulty settings:", error);
      alert("Failed to apply settings. Please try again.");
    } finally {
      setApplyingSettings(false);
    }
  };
  
  if (loading) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        color: COLORS.accent1
      }}>
        <div style={{
          display: 'inline-block',
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          borderTop: `3px solid ${COLORS.accent1}`,
          borderRight: `3px solid transparent`,
          animation: 'spin 1s linear infinite',
          marginBottom: '10px'
        }} />
        <p>Loading difficulty settings...</p>
      </div>
    );
  }
  
  // Get color based on difficulty
  const difficultyColor = difficulty < 0.3 ? COLORS.primary :
                         difficulty < 0.7 ? COLORS.accent3 : 
                         COLORS.accent2;
  
  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px'
      }}>
        <div style={{
          fontSize: '16px',
          color: 'white'
        }}>
          Current Difficulty: <span style={{ color: difficultyColor, fontWeight: 'bold' }}>
            {difficulty < 0.3 ? 'Easy' : difficulty < 0.7 ? 'Medium' : 'Hard'}
          </span>
        </div>
        
        <div style={{
          fontSize: '14px',
          color: difficultyColor,
          fontWeight: 'bold'
        }}>
          {Math.round(difficulty * 100)}%
        </div>
      </div>
      
      <div style={{
        width: '100%',
        height: '10px',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: '5px',
        overflow: 'hidden',
        marginBottom: '30px'
      }}>
        <div
          style={{
            height: '100%',
            width: `${difficulty * 100}%`,
            background: `linear-gradient(90deg, ${difficultyColor}, ${difficultyColor}CC)`,
            borderRadius: '5px'
          }}
        />
      </div>
      
      <div style={{
        marginBottom: '30px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '10px',
          color: 'rgba(255,255,255,0.7)',
          fontSize: '14px'
        }}>
          <span>Easier</span>
          <span>Balanced</span>
          <span>Harder</span>
        </div>
        
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={difficulty}
          onChange={(e) => setDifficulty(parseFloat(e.target.value))}
          style={{
            width: '100%',
            height: '15px',
            appearance: 'none',
            backgroundColor: 'rgba(0,0,0,0.3)',
            borderRadius: '10px',
            outline: 'none',
            cursor: 'pointer'
          }}
        />
      </div>
      
      <div style={{
        background: 'rgba(0,0,0,0.3)',
        borderRadius: '10px',
        padding: '15px',
        marginBottom: '20px',
        border: `1px solid ${COLORS.accent1}30`
      }}>
        <div style={{
          fontSize: '14px',
          color: COLORS.accent1,
          marginBottom: '5px',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          fontWeight: 'bold'
        }}>
          <Brain size={14} />
          How This Works
        </div>
        <p style={{
          fontSize: '13px',
          color: 'rgba(255,255,255,0.7)',
          margin: 0,
          lineHeight: '1.4'
        }}>
          Our AI analyzes your performance and automatically adjusts the difficulty to keep you in your optimal learning zone. You can override this setting manually using the slider above.
        </p>
      </div>
      
      <button
        onClick={handleApply}
        disabled={applyingSettings}
        style={{
          background: applySuccess 
            ? `linear-gradient(135deg, #00c853, #009624)` 
            : `linear-gradient(135deg, ${COLORS.accent1}, ${COLORS.accent1}CC)`,
          boxShadow: `0 0 20px ${applySuccess ? '#00c85350' : `${COLORS.accent1}50`}`,
          border: 'none',
          borderRadius: '10px',
          padding: '12px 15px',
          color: '#fff',
          fontSize: '14px',
          fontWeight: 'bold',
          cursor: applyingSettings ? 'not-allowed' : 'pointer',
          width: '100%',
          fontFamily: "'Orbitron', sans-serif",
          letterSpacing: '1px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          opacity: applyingSettings ? 0.7 : 1,
          transition: 'all 0.3s ease'
        }}
      >
        {applyingSettings ? (
          <>
            <div style={{
              display: 'inline-block',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              borderTop: '2px solid #fff',
              borderRight: '2px solid transparent',
              animation: 'spin 1s linear infinite'
            }} />
            Applying...
          </>
        ) : applySuccess ? (
          <>
            <CheckCircle size={16} />
            Applied!
          </>
        ) : (
          <>
            <CheckCircle size={16} />
            Apply Settings
          </>
        )}
      </button>
    </div>
  );
};
const LearningPathVisualizer = ({ studentId }) => {
  const [learningPath, setLearningPath] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchLearningPath = async () => {
      try {
        setLoading(true);
        const data = await mlService.getLearningPath(studentId);
        setLearningPath(data);
      } catch (error) {
        console.error("Failed to fetch learning path:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLearningPath();
  }, [studentId]);
  
  if (loading) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        color: COLORS.secondary
      }}>
        <div style={{
          display: 'inline-block',
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          borderTop: `3px solid ${COLORS.secondary}`,
          borderRight: `3px solid transparent`,
          animation: 'spin 1s linear infinite',
          marginBottom: '10px'
        }} />
        <p>Generating your learning path...</p>
      </div>
    );
  }
  
  if (!learningPath) {
    return null;
  }
  
  const getIconForType = (type) => {
    switch (type) {
      case 'Game':
        return <Brain size={16} />;
      case 'Course':
        return <BookOpen size={16} />;
      case 'Quiz':
        return <CheckCircle size={16} />;
      default:
        return <Star size={16} />;
    }
  };
  
  const getColorForPriority = (priority) => {
    switch (priority) {
      case 'High':
        return COLORS.accent2;
      case 'Medium':
        return COLORS.accent3;
      case 'Low':
        return COLORS.accent1;
      default:
        return COLORS.primary;
    }
  };
  
return (
    <div style={{
      borderRadius: '20px',
      background: `linear-gradient(135deg, ${COLORS.backgroundLighter}, ${COLORS.background})`,
      padding: '25px',
      border: `1px solid ${COLORS.secondary}20`,
      height: '100%',
      boxShadow: `0 10px 30px rgba(0, 0, 0, 0.3)`
    }}>
      <h3 style={{ 
        fontSize: '22px', 
        marginBottom: '20px',
        fontWeight: 'bold',
        color: COLORS.secondary,
        fontFamily: "'Orbitron', sans-serif",
        textShadow: `0 0 15px ${COLORS.secondary}60`,
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <LineChart size={24} />
        Your Learning Path
      </h3>
      
      <div style={{
        background: 'rgba(0,0,0,0.3)',
        borderRadius: '15px',
        padding: '20px',
        marginBottom: '25px',
        border: `1px solid ${COLORS.secondary}30`
      }}>
        <div style={{
          fontSize: '14px',
          color: COLORS.secondary,
          marginBottom: '5px',
          fontWeight: 'bold'
        }}>
          Currently Working On
        </div>
        <div style={{
          fontSize: '18px',
          color: 'white',
          fontWeight: 'bold',
          marginBottom: '5px'
        }}>
          {learningPath?.currentPosition?.subject || 'No subject'}: {learningPath?.currentPosition?.topic || 'No topic'}
        </div>
        <div style={{
          fontSize: '14px',
          color: 'rgba(255,255,255,0.7)'
        }}>
          {learningPath?.currentPosition?.subtopic || 'No subtopic'}
        </div>
      </div>
      
      <div style={{
        marginBottom: '20px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '15px'
        }}>
          <div style={{
            fontSize: '16px',
            color: 'white',
            fontWeight: 'bold'
          }}>
            Recommended Next Steps
          </div>
          
          <div style={{
            fontSize: '14px',
            color: 'rgba(255,255,255,0.6)'
          }}>
            Based on your progress
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px'
        }}>
          {learningPath?.recommendedPath?.map((item, index) => {
            const itemColor = getColorForPriority(item.priority);
            return (
              <div
                key={item.id}
                style={{
                  position: 'relative',
                  background: 'rgba(0,0,0,0.2)',
                  borderRadius: '15px',
                  padding: '15px',
                  border: `1px solid ${itemColor}30`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '20px',
                  background: `linear-gradient(135deg, ${itemColor}, ${itemColor}CC)`,
                  borderRadius: '10px',
                  padding: '3px 8px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: itemColor === COLORS.accent3 ? '#000' : '#fff',
                  boxShadow: `0 0 10px ${itemColor}50`,
                }}>
                  {index + 1}
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '5px'
                }}>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: 'white'
                  }}>
                    {item.title}
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    gap: '10px'
                  }}>
                    <div style={{
                      padding: '3px 8px',
                      background: `${itemColor}20`,
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: itemColor,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      <Target size={12} />
                      {item.priority}
                    </div>
                    
                    <div style={{
                      padding: '3px 8px',
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: 'rgba(255,255,255,0.7)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      {getIconForType(item.type)}
                      {item.type}
                    </div>
                  </div>
                </div>
                
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.7)',
                  margin: 0
                }}>
                  {item.description}
                </p>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.6)',
                  marginTop: '5px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    <Clock size={14} />
                    {item.estimated_time}
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    <Activity size={14} />
                    Difficulty: {Math.round(item.difficulty * 100)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <button
        style={{
          background: `linear-gradient(135deg, ${COLORS.secondary}, ${COLORS.secondary}CC)`,
          boxShadow: `0 0 20px ${COLORS.secondary}50`,
          border: 'none',
          borderRadius: '15px',
          padding: '15px',
          color: '#fff',
          fontSize: '14px',
          fontWeight: 'bold',
          cursor: 'pointer',
          width: '100%',
          fontFamily: "'Orbitron', sans-serif",
          letterSpacing: '1px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px'
        }}
      >
        <RotateCcw size={16} />
        Refresh Learning Path
      </button>
    </div>
  );
};

// MouseTracker Component
const MouseTracker = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleMouseDown = () => {
      setClicked(true);
      setTimeout(() => setClicked(false), 300);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);
  
  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: mousePosition.y,
          left: mousePosition.x,
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          backgroundColor: 'transparent',
          border: `2px solid ${COLORS.primary}`,
          zIndex: 9999,
          pointerEvents: 'none',
          mixBlendMode: 'lighten',
          boxShadow: `0 0 10px ${COLORS.primary}`,
          transform: 'translate(-50%, -50%)',
          opacity: clicked ? 0.5 : 0.8,
          scale: clicked ? 0.5 : 1,
          transition: 'opacity 0.3s, scale 0.3s'
        }}
      />
      
      {clicked && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }}>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: mousePosition.y,
                left: mousePosition.x,
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                border: `1px solid ${COLORS.primary}`,
                transform: 'translate(-50%, -50%) scale(0)',
                pointerEvents: 'none',
                boxShadow: `0 0 10px ${COLORS.primary}`,
                opacity: 0.8,
                animation: `ripple 0.8s ease-out ${i * 0.2}s forwards`
              }}
            />
          ))}
        </div>
      )}
      <style>
        {`
          @keyframes ripple {
            to {
              transform: translate(-50%, -50%) scale(3);
              opacity: 0;
            }
          }
        `}
      </style>
    </>
  );
};

// Modified Profile Edit Modal Component with Name, DOB, Parent Email, and Phone
const ProfileEditModal = ({ userData, onClose, onSave }) => {
  const [formData, setFormData] = useState({...userData});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    onSave(formData);
    onClose();
  };
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div
        style={{
          background: `linear-gradient(135deg, ${COLORS.backgroundLighter}, ${COLORS.background})`,
          border: `1px solid ${COLORS.accent2}30`,
          borderRadius: '20px',
          width: '100%',
          maxWidth: '600px',
          position: 'relative',
          boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${COLORS.accent2}30`,
          animation: 'modal-appear 0.3s ease-out',
          padding: '30px'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '40px',
            height: '40px',
            borderRadius:'50%',
            backgroundColor: 'rgba(0,0,0,0.4)',
            border: `1px solid ${COLORS.accent2}50`,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <X size={20} />
        </button>
        
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold',
          color: COLORS.accent2,
          marginBottom: '20px',
          fontFamily: "'Orbitron', sans-serif",
          textShadow: `0 0 15px ${COLORS.accent2}60`
        }}>
          Edit Profile
        </h2>
        
        <div>
          {/* Added Name field */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '10px',
              fontSize: '16px',
              color: 'rgba(255,255,255,0.8)'
            }}>
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 15px',
                backgroundColor: 'rgba(0,0,0,0.3)',
                border: `1px solid ${COLORS.accent2}30`,
                borderRadius: '10px',
                color: 'white',
                fontSize: '16px',
                outline: 'none'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '10px',
              fontSize: '16px',
              color: 'rgba(255,255,255,0.8)'
            }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 15px',
                backgroundColor: 'rgba(0,0,0,0.3)',
                border: `1px solid ${COLORS.accent2}30`,
                borderRadius: '10px',
                color: 'white',
                fontSize: '16px',
                outline: 'none'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '10px',
              fontSize: '16px',
              color: 'rgba(255,255,255,0.8)'
            }}>
              Date of Birth
            </label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 15px',
                backgroundColor: 'rgba(0,0,0,0.3)',
                border: `1px solid ${COLORS.accent2}30`,
                borderRadius: '10px',
                color: 'white',
                fontSize: '16px',
                outline: 'none'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '10px',
              fontSize: '16px',
              color: 'rgba(255,255,255,0.8)'
            }}>
              Parent's Email
            </label>
            <input
              type="email"
              name="parentEmail"
              value={formData.parentEmail}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 15px',
                backgroundColor: 'rgba(0,0,0,0.3)',
                border: `1px solid ${COLORS.accent2}30`,
                borderRadius: '10px',
                color: 'white',
                fontSize: '16px',
                outline: 'none'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '10px',
              fontSize: '16px',
              color: 'rgba(255,255,255,0.8)'
            }}>
              Phone Number
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 15px',
                backgroundColor: 'rgba(0,0,0,0.3)',
                border: `1px solid ${COLORS.accent2}30`,
                borderRadius: '10px',
                color: 'white',
                fontSize: '16px',
                outline: 'none'
              }}
            />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '30px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '12px 25px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '10px',
                color: 'white',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            
            <button
              onClick={handleSubmit}
              style={{
                background: `linear-gradient(135deg, ${COLORS.accent2}, ${COLORS.accent2}CC)`,
                boxShadow: `0 0 20px ${COLORS.accent2}50`,
                border: 'none',
                borderRadius: '10px',
                padding: '12px 25px',
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontFamily: "'Orbitron', sans-serif"
              }}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
      <style>
        {`
          @keyframes modal-appear {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
        `}
      </style>
    </div>
  );
};
// Motivational Quote Component
const MotivationalQuote = () => {
  const [currentQuote, setCurrentQuote] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length);
    }, 15000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div style={{
      background: `linear-gradient(135deg, ${COLORS.accent2}20, ${COLORS.primary}20)`,
      borderRadius: '20px',
      padding: '25px',
      marginBottom: '40px',
      border: `1px solid ${COLORS.accent2}30`,
      boxShadow: `0 0 30px ${COLORS.accent2}20`,
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: '-50%',
        right: '-50%',
        width: '200px',
        height: '200px',
        background: `radial-gradient(circle, ${COLORS.primary}20 0%, transparent 70%)`,
        borderRadius: '50%'
      }} />
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${COLORS.accent2}, ${COLORS.primary})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 0 20px ${COLORS.accent2}50`,
          animation: 'pulse-quote 3s infinite'
        }}>
          <Target size={24} />
        </div>
        <div>
          <h3 style={{
            fontSize: '14px',
            color: COLORS.accent2,
            margin: '0 0 5px 0',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>Daily Motivation</h3>
          <p style={{
            fontSize: '18px',
            fontWeight: '500',
            color: 'white',
            margin: 0,
            fontStyle: 'italic',
            lineHeight: '1.4',
            textShadow: `0 0 10px ${COLORS.primary}30`
          }}>
            "{motivationalQuotes[currentQuote]}"
          </p>
        </div>
      </div>
      <style>
        {`
          @keyframes pulse-quote {
            0% { transform: scale(1); box-shadow: 0 0 15px ${COLORS.accent2}50; }
            50% { transform: scale(1.05); box-shadow: 0 0 25px ${COLORS.accent2}80; }
            100% { transform: scale(1); box-shadow: 0 0 15px ${COLORS.accent2}50; }
          }
        `}
      </style>
    </div>
  );
};

// Stats Card Component 
const StatsCard = ({ stat, index }) => {
  const [hover, setHover] = useState(false);      
  return (     
    <div       
      className="stats-card"      
      onMouseEnter={() => setHover(true)}       
      onMouseLeave={() => setHover(false)}     
      style={{         
        background: `linear-gradient(135deg, ${COLORS.backgroundLighter}, ${COLORS.background})`,         
        border: `1px solid ${stat.color}30`,        
        borderRadius: '20px',       
        padding: '25px',       
        position: 'relative',        
        overflow: 'hidden',        
        height: '100%',        
        boxShadow: hover ? `0 20px 40px rgba(0, 0, 0, 0.3), 0 0 40px ${stat.color}40` : `0 10px 30px rgba(0, 0, 0, 0.3)`,   
        cursor: 'pointer',      
        transform: hover ? 'translateY(-10px)' : 'translateY(0)',    
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',     
      }}
    >
      <div
        style={{
          background: `radial-gradient(circle at center, ${stat.color}30 0%, rgba(0,0,0,0))`,
          color: stat.color,
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          marginBottom: '20px',
          position: 'relative',
          zIndex: 2,
          border: `1px solid ${stat.color}50`,
          boxShadow: `0 0 15px ${stat.color}50`
        }}
      >
        {stat.icon}
      </div>
      
      <h3 style={{ 
        fontSize: '20px', 
        marginBottom: '10px',
        fontWeight: 'bold',
        color: 'white',
        position: 'relative',
        zIndex: 2
      }}>
        {stat.label}
      </h3>
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'flex-end', 
        marginBottom: '10px', 
        position: 'relative', 
        zIndex: 2 
      }}>
        <span style={{ 
          fontSize: '36px', 
          fontWeight: 'bold', 
          color: stat.color,
          marginRight: '10px',
          fontFamily: "'Orbitron', sans-serif",
          textShadow: `0 0 15px ${stat.color}60`
        }}>
          {stat.value}
        </span>
        
        <span style={{ 
          fontSize: '18px', 
          color: 'rgba(255,255,255,0.5)',
          marginBottom: '6px'
        }}>
          / {stat.maxValue}
        </span>
      </div>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        position: 'relative',
        zIndex: 2
      }}>
        <span style={{
          color: stat.positive ? COLORS.primary : COLORS.accent2,
          fontSize: '14px',
          fontWeight: 'bold'
        }}>
          {stat.change}
        </span>
      </div>
      
      
      
      <style>
        {`
          @keyframes pulse-ring {
            0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0.7; }
            50% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
            100% { transform: translate(-50%, -50%) scale(0.5); opacity: 0.7; }
          }
        `}
      </style>
    </div>
  );
};

const GameCard = ({ game, index, onPlay }) => {
  const [hover, setHover] = useState(false);
  
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: `linear-gradient(135deg, ${COLORS.backgroundLighter}, ${COLORS.background})`,
        border: `1px solid ${game.color}30`,
        borderRadius: '20px',
        padding: '25px',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: hover ? `0 20px 40px rgba(0, 0, 0, 0.3), 0 0 40px ${game.color}40` : `0 10px 30px rgba(0, 0, 0, 0.3)`,
        transform: hover ? 'translateY(-10px)' : 'translateY(0)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        animation: `fade-in 0.5s ease-out ${index * 0.1}s both`
      }}
    >
      <div
        style={{
          background: `radial-gradient(circle at center, ${game.color}30 0%, rgba(0,0,0,0))`,
          color: game.color,
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px',
          marginBottom: '20px',
          position: 'relative',
          zIndex: 2,
          border: `1px solid ${game.color}50`,
          boxShadow: `0 0 15px ${game.color}50`
        }}
      >
        {game.icon}
      </div>
      
      <h3 style={{ 
        fontSize: '22px', 
        marginBottom: '15px',
        fontWeight: 'bold',
        color: game.color,
        position: 'relative',
        zIndex: 2,
        textShadow: `0 0 15px ${game.color}60`,
        fontFamily: "'Orbitron', sans-serif"
      }}>{game.title}</h3>
      
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        marginBottom: '15px', 
        position: 'relative', 
        zIndex: 2,
        flexWrap: 'wrap'
      }}>
        <span style={{ 
          fontSize: '14px', 
          color: 'rgba(255,255,255,0.7)',
          background: 'rgba(0,0,0,0.3)',
          padding: '5px 10px',
          borderRadius: '10px'
        }}>{game.category}</span>
        <span
          style={{
            backgroundColor: `${game.color}20`,
            color: game.color,
            border: `1px solid ${game.color}40`,
            padding: '5px 12px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            boxShadow: `0 0 10px ${game.color}30`
          }}
        >
          {game.difficulty}
        </span>
      </div>
      
      <p style={{
        fontSize: '14px',
        color: 'rgba(255,255,255,0.7)',
        marginBottom: '15px',
        position: 'relative',
        zIndex: 2,
        lineHeight: '1.5'
      }}>
        {game.description}
      </p>
      
      <div style={{ 
        marginBottom: '20px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        background: 'rgba(0,0,0,0.4)',
        padding: '15px',
        borderRadius: '15px',
        position: 'relative',
        zIndex: 2,
        border: `1px solid ${game.color}20`
      }}>
        <span style={{ 
          fontSize: '16px', 
          color: 'rgba(255,255,255,0.8)'
        }}>Best Score:</span>
        <span
          style={{ 
            color: game.color, 
            fontSize: '28px', 
            fontWeight: 'bold',
            fontFamily: "'Orbitron', sans-serif",
            textShadow: `0 0 15px ${game.color}60`
          }}
        >
          {game.bestScore}%
        </span>
      </div>
      
      <button
        onClick={() => onPlay(game.id)}
        style={{
          background: `linear-gradient(135deg, ${game.color}, ${game.color}CC)`,
          boxShadow: hover ? `0 0 30px ${game.color}` : `0 0 20px ${game.color}50`,
          border: 'none',
          borderRadius: '15px',
          padding: '15px',
          color: '#fff',
          fontSize: '14px',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginTop: 'auto',
          width: '100%',
          position: 'relative',
          zIndex: 2,
          fontFamily: "'Orbitron', sans-serif",
          letterSpacing: '1px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          transform: hover ? 'scale(1.05)' : 'scale(1)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        }}
      >
        <Play size={18} />
        Play Now
      </button>
      <style>
        {`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

// Activity Item Component
const ActivityItem = ({ activity, index }) => {
  const [hover, setHover] = useState(false);
  
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        padding: '15px',
        borderRadius: '15px',
        marginBottom: '10px',
        position: 'relative',
        border: `1px solid ${activity.color}20`,
        background: hover ? 'rgba(30, 30, 40, 0.5)' : 'rgba(20, 20, 30, 0.3)',
        transition: 'all 0.3s ease',
        overflow: 'hidden',
        transform: hover ? 'translateX(5px)' : 'translateX(0)',
        animation: `fade-in 0.5s ease-out ${0.1 * index}s both`
      }}>
      
      <div
        style={{
          width: '45px',
          height: '45px',
          borderRadius: '50%',
          background: `radial-gradient(circle at center, ${activity.color}30 0%, rgba(0,0,0,0))`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          color: activity.color,
          border: `1px solid ${activity.color}50`,
          zIndex: 2,
          position: 'relative',
          boxShadow: `0 0 15px ${activity.color}50`
        }}
      >
        {activity.icon}
      </div>
      
      <div style={{ flex: 1, zIndex: 2, position: 'relative' }}>
        <h4 style={{ 
          margin: '0 0 5px 0',
          fontSize: '16px',
          color: 'white',
          fontWeight: 'bold',
          fontFamily: TYPOGRAPHY.fontFamily.accent
        }}>{activity.title}</h4>
        <p style={{ 
          margin: 0,
          fontSize: '14px',
          color: 'rgba(255,255,255,0.7)'
        }}>{activity.description}</p>
      </div>
      
      <div 
        style={{ 
          fontSize: '13px',
          color: activity.color,
          fontWeight: 'bold',
          zIndex: 2,
          position: 'relative',
          fontFamily: "'Orbitron', sans-serif",
          textShadow: `0 0 8px ${activity.color}60`
        }}
      >
        {activity.time}
      </div>
    </div>
  );
};

// Recent Activity Component
const RecentActivity = ({ activities }) => {
  return (
    <div 
      style={{
        borderRadius: '20px',
        background: `linear-gradient(135deg, ${COLORS.backgroundLighter}, ${COLORS.background})`,
        padding: '25px',
        border: `1px solid ${COLORS.accent1}20`,
        height: '100%',
        boxShadow: `0 10px 30px rgba(0, 0, 0, 0.3)`
      }}
    >
      <h3 style={{ 
        fontSize: '22px', 
        marginBottom: '20px',
        fontWeight: 'bold',
        color: COLORS.accent1,
        fontFamily: "'Orbitron', sans-serif",
        textShadow: `0 0 15px ${COLORS.accent1}60`
      }}>Recent Activity</h3>
      
      <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '10px' }}>
        {activities.map((activity, index) => (
          <ActivityItem key={activity.id} activity={activity} index={index} />
        ))}
      </div>
    </div>
  );
};

// Progress Chart Component
const ProgressChart = ({ progressData }) => {
  return (
    <div
      style={{
        borderRadius: '20px',
        background: `linear-gradient(135deg, ${COLORS.backgroundLighter}, ${COLORS.background})`,
        padding: '25px',
        border: `1px solid ${COLORS.secondary}20`,
        position: 'relative',
        overflow: 'hidden',
        height: '100%',
        boxShadow: `0 10px 30px rgba(0, 0, 0, 0.3)`
      }}
    >
      <h3 style={{ 
        fontSize: '22px', 
        marginBottom: '20px',
        fontWeight: 'bold',
        color: COLORS.secondary,
        position: 'relative',
        zIndex: 2,
        fontFamily: "'Orbitron', sans-serif",
        textShadow: `0 0 15px ${COLORS.secondary}60`
      }}>Progress Chart</h3>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginBottom: '30px',
        position: 'relative',
        zIndex: 2
      }}>
        <div>
          <h4 style={{ 
            fontSize: '14px', 
            color: 'rgba(255,255,255,0.7)', 
            marginBottom: '5px' 
          }}>This Month</h4>
          <div style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            color: COLORS.light,
            fontFamily: "'Orbitron', sans-serif"
          }}>+{progressData.monthlyProgress}%</div>
        </div>
        
        <div>
          <select 
            style={{
              background: 'rgba(0,0,0,0.3)',
              border: `1px solid ${COLORS.secondary}30`,
              borderRadius: '10px',
              color: 'white',
              padding: '8px 15px',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
          </select>
        </div>
      </div>
      
      <div style={{ position: 'relative', height: '250px', marginBottom: '20px', zIndex: 2 }}>
        <svg width="100%" height="100%" viewBox="0 0 600 250">
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={COLORS.secondary} stopOpacity="0.8" />
              <stop offset="100%" stopColor={COLORS.secondary} stopOpacity="0.1" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line 
              key={i}
              x1="0" 
              y1={50 * i} 
              x2="600" 
              y2={50 * i} 
              stroke="rgba(255,255,255,0.1)" 
              strokeDasharray="5,5" 
            />
          ))}
          
          {/* Y-axis labels */}
          {[0, 25, 50, 75, 100].reverse().map((label, i) => (
            <text 
              key={i}
              x="10" 
              y={50 * i + 15} 
              fill="rgba(255,255,255,0.7)" 
              fontSize="12"
            >
              {label}%
            </text>
          ))}
          
          {/* X-axis labels */}
          {progressData.labels.map((label, i) => (
            <text 
              key={i}
              x={(600 / (progressData.labels.length - 1)) * i} 
              y="240" 
              fill="rgba(255,255,255,0.7)" 
              fontSize="12" 
              textAnchor="middle"
            >
              {label}
            </text>
          ))}
          
          {/* Path for line chart */}
          <path
            d={progressData.path}
            fill="none"
            stroke={COLORS.secondary}
            strokeWidth="3"
            filter="url(#glow)"
          />
          
          {/* Area under the line chart */}
          <path
            d={`${progressData.path} L600,200 L0,200 Z`}
            fill="url(#chartGradient)"
            style={{ opacity: 0.7 }}
          />
          
          {/* Data points */}
          {progressData.points.map((point, i) => (
            <g key={i}>
              <circle
                cx={point.x}
                cy={point.y}
                r="6"
                fill="transparent"
                stroke={COLORS.secondary}
                strokeWidth="1"
                opacity="0.5"
              />
            </g>
          ))}
        </svg>
      </div>
      
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-around', 
          marginTop: '10px',
          position: 'relative',
          zIndex: 2
        }}
      >
        {progressData.metrics.map((metric, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: `rgba(${metric.color}, 0.1)`,
                border: `1px solid rgba(${metric.color}, 0.5)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: `rgb(${metric.color})`
              }}
            >
              {metric.icon}
            </div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: `rgb(${metric.color})` }}>
              {metric.value}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
              {metric.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Exam Card Component
const ExamCard = ({ exam, index, onAttendExam }) => {
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: `linear-gradient(135deg, ${COLORS.backgroundLighter}, ${COLORS.background})`,
        border: `1px solid ${exam.color}30`,
        borderRadius: '20px',
        padding: '25px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: hover ? `0 20px 40px rgba(0, 0, 0, 0.3), 0 0 40px ${exam.color}40` : `0 10px 30px rgba(0, 0, 0, 0.3)`,
        transform: hover ? 'translateY(-10px)' : 'translateY(0)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        animation: `fade-in 0.5s ease-out ${index * 0.1}s both`
      }}
    >
      <h3 style={{ 
        fontSize: '18px', 
        marginBottom: '15px',
        fontWeight: 'bold',
        color: exam.color,
        textShadow: `0 0 15px ${exam.color}60`,
        fontFamily: "'Orbitron', sans-serif"
      }}>{exam.title}</h3>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        marginBottom: '20px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <Calendar size={16} color={exam.color} />
          <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
            {exam.date}
          </span>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <Clock size={16} color={exam.color} />
          <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
            {exam.time} ({exam.duration})
          </span>
        </div>
      </div>
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div
          style={{
            display: 'inline-block',
            padding: '6px 12px',
            backgroundColor: `${exam.color}20`,
            borderRadius: '15px',
            fontSize: '12px',
            fontWeight: 'bold',
            color: exam.color,
            border: `1px solid ${exam.color}40`,
            boxShadow: `0 0 10px ${exam.color}50`
          }}
        >
          {exam.status}
        </div>

        {exam.status === 'Upcoming' && (
          <button
            onClick={() => onAttendExam(exam)}
            style={{
              background: `linear-gradient(135deg, ${exam.color}, ${exam.color}CC)`,
              boxShadow: `0 0 20px ${exam.color}50`,
              border: 'none',
              borderRadius: '10px',
              padding: '8px 16px',
              color: '#fff',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontFamily: "'Orbitron', sans-serif",
              letterSpacing: '0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            <Play size={14} />
            Attend
          </button>
        )}
      </div>
    </div>
  );
};

// Doubt Card Component
const ExistingDoubtCard = ({ doubt, index }) => {
  const [hover, setHover] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: `linear-gradient(135deg, ${COLORS.backgroundLighter}, ${COLORS.background})`,
        border: `1px solid ${doubt.color}30`,
        borderRadius: '20px',
        padding: '25px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: hover ? `0 20px 40px rgba(0, 0, 0, 0.3), 0 0 40px ${doubt.color}40` : `0 10px 30px rgba(0, 0, 0, 0.3)`,
        cursor: 'pointer',
        transform: hover ? 'translateY(-5px)' : 'translateY(0)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, height 0.3s ease',
        animation: `fade-in 0.5s ease-out ${index * 0.1}s both`
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '10px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <div style={{
            padding: '5px 10px',
            backgroundColor: `${doubt.color}20`,
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 'bold',
            color: doubt.color,
            border: `1px solid ${doubt.color}40`
          }}>
            {doubt.subject}
          </div>
          
          <div style={{
            padding: '5px 10px',
            backgroundColor: doubt.status === 'Pending' ? `${COLORS.accent2}20` : `${COLORS.primary}20`,
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 'bold',
            color: doubt.status === 'Pending' ? COLORS.accent2 : COLORS.primary,
            border: doubt.status === 'Pending' ? `1px solid ${COLORS.accent2}40` : `1px solid ${COLORS.primary}40`
          }}>
            {doubt.status}
          </div>
        </div>
        
        <div style={{
          fontSize: '14px',
          color: 'rgba(255,255,255,0.6)'
        }}>
          {doubt.date}
        </div>
      </div>
      
      <h3 style={{ 
        fontSize: '18px', 
        marginBottom: '15px',
        fontWeight: 'bold',
        color: doubt.color,
        textShadow: `0 0 10px ${doubt.color}40`,
        fontFamily: TYPOGRAPHY.fontFamily.headings
      }}>{doubt.title}</h3>
      
      <p style={{
        fontSize: '14px',
        color: 'rgba(255,255,255,0.8)',
        lineHeight: '1.6',
        maxHeight: expanded ? '300px' : '40px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        transition: 'max-height 0.3s ease'
      }}>
        {doubt.description}
      </p>
      {hover && !expanded && (
        <div style={{
          textAlign: 'center',
          marginTop: '10px',
          fontSize: '12px',
          color: 'rgba(255,255,255,0.5)'
        }}>
          Click to expand
        </div>
      )}
    </div>
  );
};

// Create Doubt Modal Component
const CreateDoubtModal = ({ onClose, onSubmit }) => {
  const [subject, setSubject] = useState('Mathematics');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  const handleSubmit = () => {
    if (title.trim() === '' || description.trim() === '') {
      return;
    }
    
    onSubmit({
      id: `doubt${Date.now()}`,
      subject,
      title,
      description,
      status: 'Pending',
      date: 'June 19, 2025',
      color: COLORS.primary
    });
    
    onClose();
  };
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div
        style={{
          background: `linear-gradient(135deg, ${COLORS.backgroundLighter}, ${COLORS.background})`,
          border: `1px solid ${COLORS.primary}30`,
          borderRadius: '20px',
          width: '100%',
          maxWidth: '600px',
          position: 'relative',
          boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${COLORS.primary}30`,
          animation: 'modal-appear 0.3s ease-out',
          padding: '30px'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '40px',
            height: '40px',
            borderRadius:'50%',
            backgroundColor: 'rgba(0,0,0,0.4)',
            border: `1px solid ${COLORS.primary}50`,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <X size={20} />
        </button>
        
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold',
          color: COLORS.primary,
          marginBottom: '20px',
          fontFamily: "'Orbitron', sans-serif",
          textShadow: `0 0 15px ${COLORS.primary}60`
        }}>
          Post a Doubt
        </h2>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '10px',
            fontSize: '16px',
            color: 'rgba(255,255,255,0.8)'
          }}>
            Subject
          </label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 15px',
              backgroundColor: 'rgba(0,0,0,0.3)',
              border: `1px solid ${COLORS.primary}30`,
              borderRadius: '10px',
              color: 'white',
              fontSize: '16px',
              outline: 'none'
            }}
          >
            <option value="Mathematics">Mathematics</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Biology">Biology</option>
            <option value="Computer Science">Computer Science</option>
            <option value="English">English</option>
            <option value="History">History</option>
            <option value="Geography">Geography</option>
          </select>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '10px',
            fontSize: '16px',
            color: 'rgba(255,255,255,0.8)'
          }}>
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a concise title for your doubt"
            style={{
              width: '100%',
              padding: '12px 15px',
              backgroundColor: 'rgba(0,0,0,0.3)',
              border: `1px solid ${COLORS.primary}30`,
              borderRadius: '10px',
              color: 'white',
              fontSize: '16px',
              outline: 'none'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '30px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '10px',
            fontSize: '16px',
            color: 'rgba(255,255,255,0.8)'
          }}>
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Explain your doubt in detail..."
            rows={5}
            style={{
              width: '100%',
              padding: '12px 15px',
              backgroundColor: 'rgba(0,0,0,0.3)',
              border: `1px solid ${COLORS.primary}30`,
              borderRadius: '10px',
              color: 'white',
              fontSize: '16px',
              outline: 'none',
              resize: 'vertical'
            }}
          />
        </div>
        
        <button
          onClick={handleSubmit}
          style={{
            background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primary}CC)`,
            boxShadow: `0 0 20px ${COLORS.primary}50`,
            border: 'none',
            borderRadius: '15px',
            padding: '15px',
            color: '#000',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            width: '100%',
            fontFamily: "'Orbitron', sans-serif",
            letterSpacing: '1px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}
        >
          <Send size={18} />
          Submit Doubt
        </button>
      </div>
      <style>
        {`
          @keyframes modal-appear {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
        `}
      </style>
    </div>
  );
};

// Exam Modal Component
const ExamModal = ({ exam, onClose, onExamComplete }) => {
  // Initialize all required state variables for the exam functionality
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(3600); // Default to 1 hour (in seconds)
  const [examCompleted, setExamCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [examStarted, setExamStarted] = useState(false);
  
  // Get the questions for this exam
  const questions = examQuestions[exam?.id] || [];
  
  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Handle timer countdown
  useEffect(() => {
    let timer;
    if (examStarted && !examCompleted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [examStarted, examCompleted, timeLeft]);
  
  // Handle answer selection
  const handleAnswerSelect = (questionId, optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };
  
const handleSubmitExam = () => {
  // Calculate score
  let correctCount = 0;
  
  questions.forEach(question => {
    if (answers[question.id] === question.correct) {
      correctCount++;
    }
  });
  
  const calculatedScore = Math.round((correctCount / questions.length) * 100);
  setScore(calculatedScore);
  setExamCompleted(true);
  
  // Add this part to update stats when exam is completed
  if (typeof onExamComplete === 'function') {
    onExamComplete({
      examId: exam.id,
      score: calculatedScore,
      timeSpent: 3600 - timeLeft, // Calculate time spent
      totalQuestions: questions.length,
      correctAnswers: correctCount
    });
  }
};
  
  // Start the exam
  const handleStartExam = () => {
    setExamStarted(true);
    // Set time based on exam duration (assuming format like "2 hours")
    const durationMatch = exam.duration.match(/(\d+)/);
    if (durationMatch && durationMatch[1]) {
      const hours = parseInt(durationMatch[1], 10);
      setTimeLeft(hours * 60 * 60); // Convert hours to seconds
    }
  };
  
  // If exam is not started yet, show start screen
  if (!examStarted) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}>
        <div
          style={{
            background: `linear-gradient(135deg, ${COLORS.backgroundLighter}, ${COLORS.background})`,
            border: `1px solid ${exam.color}30`,
            borderRadius: '20px',
            width: '100%',
            maxWidth: '600px',
            position: 'relative',
            boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${exam.color}30`,
            animation: 'modal-appear 0.3s ease-out',
            padding: '40px',
            textAlign: 'center'
          }}
        >
          <h2 style={{ 
            fontSize: '28px', 
            fontWeight: 'bold',
            color: exam.color,
            marginBottom: '20px',
            fontFamily: "'Orbitron', sans-serif",
            textShadow: `0 0 15px ${exam.color}60`
          }}>
            {exam.title}
          </h2>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            marginBottom: '30px',
            textAlign: 'left',
            background: 'rgba(0,0,0,0.2)',
            padding: '20px',
            borderRadius: '15px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Calendar size={20} color={exam.color} />
              <span style={{ color: 'rgba(255,255,255,0.8)' }}>{exam.date}</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock size={20} color={exam.color} />
              <span style={{ color: 'rgba(255,255,255,0.8)' }}>{exam.time}</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Activity size={20} color={exam.color} />
              <span style={{ color: 'rgba(255,255,255,0.8)' }}>Duration: {exam.duration}</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle size={20} color={exam.color} />
              <span style={{ color: 'rgba(255,255,255,0.8)' }}>{questions.length} Questions</span>
            </div>
          </div>
          
          <p style={{
            fontSize: '16px',
            color: 'rgba(255,255,255,0.7)',
            marginBottom: '30px',
            lineHeight: '1.6'
          }}>
            This exam is ready to be taken. Once started, the timer will begin and you must complete all questions 
            within the allotted time. Good luck!
          </p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '15px 30px',
                borderRadius: '10px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              Cancel
            </button>
            
            <button
              onClick={handleStartExam}
              style={{
                background: `linear-gradient(135deg, ${exam.color}, ${exam.color}CC)`,
                border: 'none',
                padding: '15px 30px',
                borderRadius: '10px',
                color: 'white',
                cursor: 'pointer',
                boxShadow: `0 0 20px ${exam.color}50`,
                fontSize: '16px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <Play size={20} />
              Start Exam
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Exam results screen
  if (examCompleted) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}>
        <div
          style={{
            background: `linear-gradient(135deg, ${COLORS.backgroundLighter}, ${COLORS.background})`,
            border: `1px solid ${exam.color}30`,
            borderRadius: '20px',
            width: '100%',
            maxWidth: '500px',
            position: 'relative',
            boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${exam.color}30`,
            animation: 'modal-appear 0.3s ease-out',
            padding: '40px',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: score >= 70 ? `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primary}CC)` : `linear-gradient(135deg, ${COLORS.accent2}, ${COLORS.accent2}CC)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 30px',
              boxShadow: score >= 70 ? `0 0 30px ${COLORS.primary}50` : `0 0 30px ${COLORS.accent2}50`
            }}
          >
            {score >= 70 ? <Trophy size={50} color="white" /> : <X size={50} color="white" />}
          </div>

          <h2 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: score >= 70 ? COLORS.primary : COLORS.accent2,
            marginBottom: '20px',
            fontFamily: "'Orbitron', sans-serif"
          }}>
            {score >= 70 ? 'Congratulations!' : 'Exam Completed'}
          </h2>

          <div style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: exam.color,
            marginBottom: '20px',
            fontFamily: "'Orbitron', sans-serif"
          }}>
            {score}%
          </div>

          <p style={{
            fontSize: '18px',
            color: 'rgba(255,255,255,0.8)',
            marginBottom: '30px'
          }}>
            You scored {Object.keys(answers).filter(qId => answers[qId] === questions.find(q => q.id == qId)?.correct).length} out of {questions.length} questions correctly.
          </p>

          <button
            onClick={onClose}
            style={{
              background: `linear-gradient(135deg, ${exam.color}, ${exam.color}CC)`,
              boxShadow: `0 0 20px ${exam.color}50`,
              border: 'none',
              borderRadius: '10px',
              padding: '15px 30px',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontFamily: "'Orbitron', sans-serif"
            }}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Exam interface during examination
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div
        style={{
          background: `linear-gradient(135deg, ${COLORS.backgroundLighter}, ${COLORS.background})`,
          border: `1px solid ${exam.color}30`,
          borderRadius: '20px',
          width: '100%',
          maxWidth: '800px',
          height: '90vh',
          position: 'relative',
          boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${exam.color}30`,
          animation: 'modal-appear 0.3s ease-out',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Exam Header */}
        <div style={{
          padding: '20px 30px',
          borderBottom: `1px solid ${exam.color}30`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: exam.color,
              margin: 0,
              fontFamily: "'Orbitron', sans-serif"
            }}>
              {exam.title}
            </h2>
            <p style={{
              fontSize: '14px',
              color: 'rgba(255,255,255,0.7)',
              margin: '5px 0 0 0'
            }}>
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              background: timeLeft < 600 ? `${COLORS.accent2}20` : 'rgba(0,0,0,0.3)',
              borderRadius: '10px',
              border: timeLeft < 600 ? `1px solid ${COLORS.accent2}50` : '1px solid rgba(255,255,255,0.1)'
            }}>
              <Clock size={18} color={timeLeft < 600 ? COLORS.accent2 : 'white'} />
              <span style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: timeLeft < 600 ? COLORS.accent2 : 'white',
                fontFamily: "'Orbitron', sans-serif"
              }}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </div>

        {/* Question Content */}
        <div style={{
          flex: 1,
          padding: '30px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {questions[currentQuestion] && (
            <>
              <div style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '30px',
                lineHeight: '1.4'
              }}>
                {questions[currentQuestion].question}
              </div>

              <div style={{
                display: 'grid',
                gap: '15px',
                flex: 1
              }}>
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(questions[currentQuestion].id, index)}
                    style={{
                      padding: '20px',
                      backgroundColor: answers[questions[currentQuestion].id] === index 
                        ? `${exam.color}20` 
                        : 'rgba(0,0,0,0.3)',
                      border: answers[questions[currentQuestion].id] === index 
                        ? `2px solid ${exam.color}` 
                        : '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: '16px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px'
                    }}
                  >
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: answers[questions[currentQuestion].id] === index 
                        ? exam.color 
                        : 'rgba(255,255,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      color: answers[questions[currentQuestion].id] === index ? 'white' : 'rgba(255,255,255,0.7)'
                    }}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span>{option}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Navigation Footer */}
        <div style={{
          padding: '20px 30px',
          borderTop: `1px solid ${exam.color}30`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            display: 'flex',
            gap: '10px'
          }}>
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              style={{
                padding: '10px 20px',
                backgroundColor: currentQuestion === 0 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                color: currentQuestion === 0 ? 'rgba(255,255,255,0.4)' : 'white',
                fontSize: '14px',
                cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              Previous
            </button>
            
            <button
              onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
              disabled={currentQuestion === questions.length - 1}
              style={{
                padding: '10px 20px',
                backgroundColor: currentQuestion === questions.length - 1 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                color: currentQuestion === questions.length - 1 ? 'rgba(255,255,255,0.4)' : 'white',
                fontSize: '14px',
                cursor: currentQuestion === questions.length - 1 ? 'not-allowed' : 'pointer'
              }}
            >
              Next
            </button>
          </div>

          <div style={{
            display: 'flex',
            gap: '10px',
            alignItems: 'center'
          }}>
            <span style={{
              fontSize: '14px',
              color: 'rgba(255,255,255,0.7)'
            }}>
              {Object.keys(answers).length} of {questions.length} answered
            </span>
            
            <button
              onClick={handleSubmitExam}
              style={{
                background: `linear-gradient(135deg, ${exam.color}, ${exam.color}CC)`,
                boxShadow: `0 20px ${exam.color}50`,
                border: 'none',
                borderRadius: '8px',
                padding: '10px 20px',
                color: 'white',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontFamily: "'Orbitron', sans-serif"
              }}
            >
              Submit Exam
            </button>
          </div>
        </div>

        {/* Question Navigator */}
        <div style={{
          position: 'absolute',
          right: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(0,0,0,0.4)',
          borderRadius: '10px',
          padding: '15px',
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '8px',
          maxWidth: '200px'
        }}>
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: 
                  currentQuestion === index 
                    ? exam.color 
                    : answers[questions[index].id] !== undefined 
                      ? `${COLORS.primary}50` 
                      : 'rgba(255,255,255,0.2)',
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
      
      <style>
        {`
          @keyframes modal-appear {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }}
        `}
      </style>
    </div>
  );
};

// Main StudentDashboard Component
const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Moved to the top
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showDoubtModal, setShowDoubtModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [doubtsData, setDoubtsData] = useState(doubts);
  const [loading, setLoading] = useState(true);
  const [showProfileEditModal, setShowProfileEditModal] = useState(false);
  const [showMLFeatures, setShowMLFeatures] = useState(true);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [loadingDoubts, setLoadingDoubts] = useState(true);
  const [doubtError, setDoubtError] = useState(null);
  const [userStats, setUserStats] = useState(null);
  // State for user data - initialized from localStorage or API
  const [userDataState, setUserDataState] = useState(null);
    const gameRefs = {
    'game4': useRef(null),
    'game5': useRef(null)
  };
  // Update the checkGameCompletion function to use the gameProgressService

const checkGameCompletion = () => {
  // Only run if user data is loaded
  if (!userDataState || !userDataState.id) {
    console.log("User data not available, skipping game completion check");
    return;
  }
  
  try {
    console.log("Checking for completed games...");
    
    // Check if there's a game in progress
    const gameProgressStr = localStorage.getItem(`game_progress_${userDataState.id}`);
    if (!gameProgressStr) {
      console.log("No game progress found in localStorage");
      return;
    }
    
    const gameProgress = JSON.parse(gameProgressStr);
    const gameId = gameProgress.gameId;
    
    if (!gameId) {
      console.warn("Game progress found but missing gameId");
      return;
    }
    
    console.log(`Found game progress for game ${gameId}`);
    
    // Check if there's a start time for this game
    const startTimeStr = localStorage.getItem(`game_start_${userDataState.id}_${gameId}`);
    if (!startTimeStr) {
      console.warn(`Game ${gameId} in progress but no start time found`);
      return;
    }
    
    const startTime = parseInt(startTimeStr);
    const now = Date.now();
    const timeSpent = Math.floor((now - startTime) / 1000); // Convert to seconds
    
    // Ignore very short sessions (less than 10 seconds)
    if (timeSpent < 10) {
      console.log(`Game ${gameId} played for only ${timeSpent} seconds, ignoring`);
      return;
    }
    
    // Find the game
    const game = educationalGames.find(g => g.id === gameId);
    if (!game) {
      console.warn(`Game ${gameId} not found in educationalGames array`);
      return;
    }
    
    console.log(`Processing completion for game ${gameId} played for ${timeSpent} seconds`);
    
    // Generate a score based on time spent (for demo)
    // In a real app, the game would provide the actual score
    const score = Math.min(100, Math.floor(50 + (Math.random() * 50)));
    
    // Create completion data
    const completionData = {
      id: gameId,
      score: score,
      timeSpent: timeSpent,
      completedLevel: Math.min(5, Math.ceil(timeSpent / 60)), // 1 level per minute, max 5
      totalLevels: game.levels?.length || 5,
      skills: game.skills || [],
      category: game.category,
      xpReward: game.xpReward || 100
    };
    
    console.log("Generated completion data:", completionData);
    
    // Process game completion
    handleGameCompletion(completionData)
      .then(success => {
        if (success) {
          // Clear the progress and start time
          localStorage.removeItem(`game_progress_${userDataState.id}`);
          localStorage.removeItem(`game_start_${userDataState.id}_${gameId}`);
          console.log(`Game ${gameId} completion processed successfully and data cleared`);
          
          // After successful completion, try to sync with server
          gameProgressService.syncLocalData(userDataState.id)
            .then(syncResult => {
              console.log("Data sync result:", syncResult);
            })
            .catch(syncError => {
              console.warn("Failed to sync data:", syncError);
            });
        }
      })
      .catch(error => {
        console.error("Error in handleGameCompletion:", error);
      });
  } catch (error) {
    console.error('Error checking game completion:', error);
  }
};
  const checkAndResetWeeklyProgress = async (userId) => {
    // Get the current day of the week (0 = Sunday, 1 = Monday, etc.)
    const today = new Date();
    const dayOfWeek = today.getDay();
    
    // If it's Sunday (0), reset weekly progress
    if (dayOfWeek === 0) {
      // Get the last reset date from localStorage
      const lastResetDate = localStorage.getItem(`last_weekly_reset_${userId}`);
      
      // If no reset date or the reset date is not today, reset weekly progress
      if (!lastResetDate || lastResetDate !== today.toISOString().split('T')[0]) {
        // Reset weekly progress
      await statsService.resetWeeklyProgress(userId);
        
        // Update last reset date
        localStorage.setItem(`last_weekly_reset_${userId}`, today.toISOString().split('T')[0]);
      }
    }
  };
  
  const getStatsData = () => {
    if (!userStats) return [];
    
    return [
      {
        id: 'games',
        label: 'Completed Games',
        value: userStats.gamesCompleted.toString(),
        maxValue: 100,
        change: `+${userStats.weeklyProgress.gamesCompletedThisWeek} this week`,
        positive: userStats.weeklyProgress.gamesCompletedThisWeek > 0,
        color: COLORS.primary,
        icon: <Brain />
      },
      {
        id: 'points',
        label: 'Learning Points',
        value: userStats.points.toString(),
        maxValue: 5000,
        change: `+${userStats.weeklyProgress.pointsEarnedThisWeek} this week`,
        positive: userStats.weeklyProgress.pointsEarnedThisWeek > 0,
        color: COLORS.secondary,
        icon: <Star />
      },
      {
        id: 'streak',
        label: 'Study Streak',
        value: userStats.streakDays.toString(),
        maxValue: 30,
        change: `+${userStats.weeklyProgress.streakGainedThisWeek} days`,
        positive: userStats.weeklyProgress.streakGainedThisWeek > 0,
        color: COLORS.accent1,
        icon: <Activity />
      },
      {
        id: 'averageScore',
        label: 'Average Score',
        value: userStats.averageScore.toString(),
        maxValue: 100,
        change: `${userStats.weeklyProgress.scoreImprovement > 0 ? '+' : ''}${userStats.weeklyProgress.scoreImprovement}% improvement`,
        positive: userStats.weeklyProgress.scoreImprovement >= 0,
        color: COLORS.accent2,
        icon: <Award />
      }
    ];
  };

  useEffect(() => {
    if (selectedTab === 'doubts') {
      fetchDoubts();
    }
  }, [selectedTab]);
  
  // Add this function to fetch doubts from the API
  const fetchDoubts = async () => {
    try {
      setLoadingDoubts(true);
      setDoubtError(null);
      
      const response = await doubtService.getDoubts();
      setDoubtsData(response.data);
    } catch (error) {
      console.error('Error fetching doubts:', error);
      setDoubtError('Failed to load doubts. Please try again later.');
    } finally {
      setLoadingDoubts(false);
    }
  };
  
  // Add this function to handle deleting a doubt
  const handleDeleteDoubt = (doubtId) => {
    setDoubtsData(prev => prev.filter(doubt => doubt._id !== doubtId));
  };
  
  // ML Features Toggle Handler
  useEffect(() => {
    // Set ML features state from localStorage if available
    const storedMLFeatures = localStorage.getItem('showMLFeatures');
    if (storedMLFeatures !== null) {
      setShowMLFeatures(storedMLFeatures === 'true');
    }
    
    // Store ML features state when it changes
    localStorage.setItem('showMLFeatures', showMLFeatures);
    
    // Try to call forceActive if it exists
    try {
      if (mlService && typeof mlService.forceActive === 'function') {
        mlService.forceActive(showMLFeatures);
      }
    } catch (error) {
      console.log('ML Service forceActive not available or error:', error);
    }
  }, [showMLFeatures]);
  
  // Add this function to handle ML Features toggle
  const handleMLFeaturesToggle = () => {
    const newValue = !showMLFeatures;
    setShowMLFeatures(newValue);
    localStorage.setItem('showMLFeatures', newValue.toString());
    
    // Try to call forceActive if it exists
    try {
      if (mlService && typeof mlService.forceActive === 'function') {
        mlService.forceActive(newValue);
      }
    } catch (error) {
      console.log('ML Service forceActive not available or error:', error);
    }
  };
  
  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Try to get user data from localStorage first
        const userDataStr = localStorage.getItem('user');
        
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          
          // Update state with user data from registration
          setUserDataState({
            ...userData,
            // Add default values for fields that might not be in localStorage
            level: userData.level || 1,
            points: userData.points || 0,
            badges: userData.badges || 0,
            streakDays: userData.streakDays || 0,
            gpa: userData.gpa || "3.5/4.0"
          });
          
          // Fetch user stats
          const stats = await statsService.getUserStats(userData.id);
          
          // Update user stats state
          setUserStats(stats);
          
          // Check if it's a new week to reset weekly progress
          await checkAndResetWeeklyProgress(userData.id);
          
          // Update login streak
          const updatedStats = await statsService.updateLoginStreak(userData.id);
          if (updatedStats) {
            setUserStats(updatedStats);
          }
          
          // Update userData with stats values
          setUserDataState(prev => ({
            ...prev,
            points: stats.points,
            streakDays: stats.streakDays
          }));
        } else {
          // If no user data in localStorage, try API fetch or use default
          console.log("No user data found, using default values");
          setUserDataState({
            id: "Guest-" + Math.floor(1000 + Math.random() * 9000),
            name: "Guest User",
            email: "guest@example.com",
            birthDate: "2000-01-01",
            parentEmail: "parent@example.com",
            phoneNumber: "123-456-7890",
            school: "Example School",
            level: 1,
            points: 0,
            badges: 0,
            streakDays: 0,
            gpa: "3.0/4.0"
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Set some default values as fallback
        setUserDataState({
          id: "Error-User",
          name: "Student",
          email: "student@example.com",
          birthDate: "2000-01-01",
          parentEmail: "parent@example.com",
          phoneNumber: "Unknown",
          school: "Unknown School",
          level: 1,
          points: 0,
          badges: 0,
          streakDays: 0,
          gpa: "0.0/4.0"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    
    // Try to initialize ML service if forceActive exists
    try {
      if (mlService && typeof mlService.forceActive === 'function') {
        mlService.forceActive(true);
      }
    } catch (error) {
      console.log('ML Service forceActive not available or error:', error);
    }
  }, []);
  
  // Replace the entire stats array with this line
  const stats = userStats ? getStatsData() : [];
  

  
  // Modify the handlePlayGame function to track start time
  // Update the handlePlayGame function

const handlePlayGame = async (gameId) => {
  try {
    console.log(`Starting game ${gameId}...`);
    
    const game = educationalGames.find(g => g.id === gameId);
    if (!game) {
      console.error(`Game with ID ${gameId} not found`);
      return;
    }
    
    // For all games, ensure we track start time
    if (userDataState && userDataState.id) {
      // Record the game start time for tracking play duration
      const startTime = Date.now().toString();
      localStorage.setItem(`game_start_${userDataState.id}_${gameId}`, startTime);
      
      // Store current progress to resume
      const gameProgress = {
        lastPlayed: new Date().toISOString(),
        gameId: gameId,
        startTime: startTime,
        category: game.category,
        skills: game.skills || []
      };
      
      localStorage.setItem(`game_progress_${userDataState.id}`, JSON.stringify(gameProgress));
      console.log(`Game start recorded for ${gameId} at ${new Date().toLocaleTimeString()}`);
      
      // Also store in a history of played games
      try {
        const playHistoryKey = `play_history_${userDataState.id}`;
        const existingHistory = JSON.parse(localStorage.getItem(playHistoryKey) || '[]');
        
        existingHistory.push({
          gameId,
          startTime: startTime,
          date: new Date().toISOString()
        });
        
        // Limit history to last 50 games
        if (existingHistory.length > 50) {
          existingHistory.shift();
        }
        
        localStorage.setItem(playHistoryKey, JSON.stringify(existingHistory));
      } catch (historyError) {
        console.warn("Failed to save play history:", historyError);
      }
    }
    
    // For Math, Physics, and Chemistry games, navigate to their dedicated pages
    if (gameId === 'game1' || gameId === 'game2' || gameId === 'game3') {
      // Navigate to the game page
      navigate(`/play-game/${gameId}`);
      return;
    }
    
    // For other games, show the game modal (existing functionality)
    if (game) {
      // If ML features are enabled, get adaptive difficulty
      if (showMLFeatures && userDataState?.id) {
        try {
          console.log(`Getting adaptive difficulty for game ${gameId} and user ${userDataState.id}`);
          const difficulty = await mlService.getAdaptiveDifficulty(userDataState.id, gameId);
          
          console.log(`Received difficulty: ${difficulty}`);
          
          // Store difficulty in localStorage as backup
          localStorage.setItem(
            `game_difficulty_${userDataState.id}_${gameId}`,
            difficulty.toString()
          );
          
          // Set the game with adaptive difficulty
          setSelectedGame({
            ...game,
            adaptiveDifficulty: difficulty
          });
        } catch (error) {
          console.warn('ML service not available or authorization error:', error);
          
          // Get previous difficulty from localStorage if available
          let fallbackDifficulty = 0.5; // Default medium difficulty
          
          try {
            const savedDifficulty = localStorage.getItem(`game_difficulty_${userDataState.id}_${gameId}`);
            if (savedDifficulty) {
              fallbackDifficulty = parseFloat(savedDifficulty);
            }
          } catch (storageError) {
            console.warn('Could not retrieve saved difficulty', storageError);
          }
          
          // Fall back to default or saved difficulty
          setSelectedGame({
            ...game,
            adaptiveDifficulty: fallbackDifficulty
          });
        }
      } else {
        // ML features disabled, use default difficulty
        setSelectedGame(game);
      }
    }
  } catch (error) {
    console.error('Error in handlePlayGame:', error);
  }
};
  
  // ADD THE GAME COMPLETION HANDLER HERE, after handlePlayGame:
const handleGameComplete = (gameData) => {
  console.log('Game completed with data:', gameData);
  // Reset the selected game to return to game selection
  setSelectedGame(null);
};
  // Handle submitting a doubt
  const handleSubmitDoubt = (doubt) => {
    setDoubtsData(prev => [doubt, ...prev]);
  };

  // Handle attending an exam
  const handleAttendExam = (exam) => {
    setSelectedExam(exam);
  };
  
  // Handle profile edit
  const handleSaveProfile = (updatedData) => {
    // Update the user data state
    setUserDataState(prev => ({
      ...prev,
      ...updatedData
    }));
    
    // Store the updated user data in localStorage
    try {
      const currentUserData = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUserData = {
        ...currentUserData,
        ...updatedData
      };
      localStorage.setItem('user', JSON.stringify(updatedUserData));
      
      // You could also send this update to your API
      console.log("Profile updated successfully", updatedData);
      
      // Show success message (you would implement this)
      // showNotification("Profile updated successfully");
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };
  
  // Show loading state while fetching user data
  if (loading) {
    return (
      <div style={{ 
        fontFamily: TYPOGRAPHY.fontFamily.primary,
        background: COLORS.background,
        minHeight: '100vh',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            border: `3px solid ${COLORS.primary}30`,
            borderTopColor: COLORS.primary,
            animation: 'spin 1s linear infinite'
          }} />
          
          <p style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: COLORS.primary
          }}>
            Loading your dashboard...
          </p>
          
          <style>
            {`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      </div>
    );
  }
  const handleGameCompletion = async (gameData) => {
  try {
    if (!userDataState || !userDataState.id) {
      console.error("Cannot save game data: User ID not available");
      return false;
    }
    
    // Add time tracking
    let timeSpent = gameData.timeSpent || 0;
    
    // If no time provided, calculate from start time
    if (!timeSpent) {
      const gameStartTime = localStorage.getItem(`game_start_${userDataState.id}_${gameData.id}`);
      if (gameStartTime) {
        timeSpent = Math.floor((Date.now() - parseInt(gameStartTime)) / 1000);
        // Remove the start time from localStorage
        localStorage.removeItem(`game_start_${userDataState.id}_${gameData.id}`);
      } else {
        // Default to 10 minutes if no time tracked
        timeSpent = 600;
        console.log("No start time found, using default of 10 minutes");
      }
    }
    
    // Create complete game data
    const completeGameData = {
      ...gameData,
      studentId: userDataState.id,
      timeSpent: timeSpent,
      completedLevel: gameData.completedLevel || 1,
      totalLevels: gameData.totalLevels || 5,
      timestamp: new Date().toISOString()
    };
    
    console.log("Game completion data prepared:", completeGameData);
    
    // 1. Save game progress using gameProgressService
    const gameProgressResult = await gameProgressService.saveGameProgress({
      studentId: userDataState.id,
      gameId: completeGameData.id,
      score: completeGameData.score,
      timeSpent: completeGameData.timeSpent,
      completedLevel: completeGameData.completedLevel,
      totalLevels: completeGameData.totalLevels,
      skillsApplied: completeGameData.skills || []
    });
    
    console.log("Game progress save result:", gameProgressResult);
    
    // 2. Save learning progress if we have skills data
    if (completeGameData.skills && completeGameData.skills.length > 0) {
      const learningProgressData = {
        studentId: userDataState.id,
        subject: completeGameData.category,
        skills: completeGameData.skills.map(skill => ({
          name: skill,
          proficiency: completeGameData.score
        })),
        timestamp: new Date().toISOString()
      };
      
      const learningResult = await gameProgressService.saveLearningProgress(learningProgressData);
      console.log("Learning progress save result:", learningResult);
    }
    
    // 3. Save performance data
    const performanceData = {
      studentId: userDataState.id,
      activityType: 'game',
      activityId: completeGameData.id,
      score: completeGameData.score,
      timeSpent: completeGameData.timeSpent,
      level: completeGameData.completedLevel,
      timestamp: new Date().toISOString()
    };
    
    const performanceResult = await gameProgressService.savePerformanceData(performanceData);
    console.log("Performance data save result:", performanceResult);
    
    // 4. Update user stats using existing statsService
    try {
      const updatedStats = await statsService.updateGameStats(userDataState.id, completeGameData);
      
      if (updatedStats) {
        // Update stats state
        setUserStats(updatedStats);
        
        // Update user data state with new values
        setUserDataState(prev => ({
          ...prev,
          points: updatedStats.points,
          streakDays: updatedStats.streakDays
        }));
        
        console.log("Stats updated successfully:", updatedStats);
      }
    } catch (statsError) {
      console.error("Failed to update stats:", statsError);
      
      // Fallback: Update stats in localStorage
      try {
        const localStatsKey = `user_stats_${userDataState.id}`;
        const existingStats = JSON.parse(
          localStorage.getItem(localStatsKey) || JSON.stringify({
            gamesCompleted: 0,
            points: 0,
            streakDays: 0,
            averageScore: 0,
            totalScore: 0
          })
        );
        
        // Update stats
        existingStats.gamesCompleted += 1;
        existingStats.points += (completeGameData.xpReward || 100);
        existingStats.totalScore += completeGameData.score;
        existingStats.averageScore = Math.round(
          existingStats.totalScore / existingStats.gamesCompleted
        );
        
        // Save stats to localStorage
        localStorage.setItem(localStatsKey, JSON.stringify(existingStats));
        
        // Update user data state with fallback values
        setUserDataState(prev => ({
          ...prev,
          points: existingStats.points,
          streakDays: existingStats.streakDays
        }));
        
        console.log("Stats saved to localStorage as fallback");
      } catch (fallbackError) {
        console.error("Failed to save stats to localStorage:", fallbackError);
      }
    }
    
    // Display a success notification
    console.log("Game completed! You earned:", completeGameData.xpReward || 100, "points");
    
    return true;
  } catch (error) {
    console.error('Failed to process game completion:', error);
    return false;
  }
};
const handleExamCompletion = async (examData) => {
  try {
    if (!userDataState || !userDataState.id) {
      console.error("Cannot save exam data: User ID not available");
      return;
    }
    
    console.log("Processing exam completion:", examData);
    
    // Update user stats with exam data
    try {
      const updatedStats = await statsService.updateExamStats(userDataState.id, examData);
      
      if (updatedStats) {
        // Update stats state
        setUserStats(updatedStats);
        
        // Update user data state with new values
        setUserDataState(prev => ({
          ...prev,
          points: updatedStats.points,
          level: updatedStats.level || prev.level,
          badges: updatedStats.badges || prev.badges
        }));
        
        // Also store performance data using gameProgressService
        try {
          // Save performance data for the exam
          const performanceData = {
            studentId: userDataState.id,
            activityType: 'exam',
            activityId: examData.examId,
            score: examData.score,
            timeSpent: examData.timeSpent || 0,
            correctAnswers: examData.correctAnswers,
            totalQuestions: examData.totalQuestions,
            timestamp: new Date().toISOString()
          };
          
          const performanceResult = await gameProgressService.savePerformanceData(performanceData);
          console.log("Exam performance data saved:", performanceResult);
          
        } catch (performanceError) {
          console.warn("Failed to save exam performance data:", performanceError);
        }
        
        // Display a success notification
        console.log("Exam completed! You earned:", Math.round(examData.score * 2), "points");
      } else {
        throw new Error("Stats service returned no data");
      }
    } catch (statsError) {
      console.error("Failed to update stats for exam:", statsError);
    }
    
  } catch (error) {
    console.error('Failed to process exam completion:', error);
  }
};
  // Render dashboard content based on selected tab
  const renderTabContent = () => {
    switch (selectedTab) {
      case 'dashboard':
        return (
          <div>
            {/* Motivational Quote Section */}
            <MotivationalQuote />
            
            {/* Stats Section */}
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ 
                fontSize: '22px', 
                marginBottom: '20px',
                fontFamily: TYPOGRAPHY.fontFamily.headings,
                color: 'white'
              }}>Your Learning Stats</h2>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px'
              }}>
                {stats.map((stat, index) => (
                  <StatsCard key={stat.id} stat={stat} index={index} />
                ))}
              </div>
            </div>
            <button
  onClick={() => setShowProfileEditModal(true)}
  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/30 
            transition-all duration-300 flex items-center gap-2 group"
>
  <div className="w-8 h-8 rounded-full overflow-hidden bg-white/10 border border-white/30 group-hover:border-white/50 transition-all duration-300">
    {user.profilePictureUrl ? (
      <img 
        src={user.profilePictureUrl} 
        alt={user.name} 
        className="w-full h-full object-cover" 
      />
    ) : (
      <div className="w-full h-full flex items-center justify-center">
        <span className="text-sm font-medium text-white">
          {user?.name?.charAt(0)?.toUpperCase() || "S"}
        </span>
      </div>
    )}
  </div>
  <span>Edit Profile</span>
  <span className="text-white/50 group-hover:text-white transition-colors duration-300">✏️</span>
</button>
            {/* ML Features Toggle */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '30px',
              background: `linear-gradient(135deg, ${COLORS.backgroundLighter}, ${COLORS.background})`,
              borderRadius: '15px',
              padding: '20px',
              border: `1px solid ${COLORS.primary}30`
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px'
              }}>
                <div style={{
                  width: '45px',
                  height: '45px',
                  borderRadius: '50%',
                  background: `radial-gradient(circle at center, ${COLORS.primary}30 0%, rgba(0,0,0,0))`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: COLORS.primary,
                  border: `1px solid ${COLORS.primary}50`,
                  boxShadow: `0 0 15px ${COLORS.primary}50`,
                  fontSize: '24px'
                }}>
                  <Brain />
                </div>
                <div>
                  <h3 style={{
                    fontSize: '18px',
                    color: COLORS.primary,
                    margin: '0 0 5px 0',
                    fontFamily: "'Orbitron', sans-serif"
                  }}>
                    AI Learning Assistant
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.7)',
                    margin: 0
                  }}>
                    Personalized recommendations based on your performance
                  </p>
                </div>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.7)'
                }}>
                  {showMLFeatures ? 'On' : 'Off'}
                </span>
                
                <button
                  onClick={handleMLFeaturesToggle}
                  style={{
                    width: '50px',
                    height: '26px',
                    borderRadius: '13px',
                    backgroundColor: showMLFeatures ? `${COLORS.primary}50` : 'rgba(255, 255, 255, 0.1)',
                    position: 'relative',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '3px',
                    left: showMLFeatures ? 'calc(100% - 23px)' : '3px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: showMLFeatures ? COLORS.primary : COLORS.gray,
                    transition: 'left 0.3s ease, background-color 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: showMLFeatures ? COLORS.dark : COLORS.light,
                    fontSize: '10px'
                  }}>
                    {showMLFeatures ? <Brain size={12} /> : <Settings size={12} />}
                  </div>
                </button>
              </div>
            </div>
            
            {/* ML Components - Personalized Learning */}
            {showMLFeatures && (
              <div style={{ marginBottom: '40px' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                  gap: '30px',
                  marginBottom: '40px'
                }}>
                  {/* Skill Gap Indicator */}
                  <div style={{
                    background: `linear-gradient(135deg, ${COLORS.backgroundLighter}, ${COLORS.background})`,
                    borderRadius: '20px',
                    padding: '25px',
                    border: `1px solid ${COLORS.accent2}30`,
                    height: '100%',
                    boxShadow: `0 10px 30px rgba(0, 0, 0, 0.3)`
                  }}>
                    <SkillGapIndicator studentId={userDataState?.id} />
                  </div>
                  
                  {/* Currently Active Game */}
                  <div style={{
                    background: `linear-gradient(135deg, ${COLORS.backgroundLighter}, ${COLORS.background})`,
                    borderRadius: '20px',
                    padding: '25px',
                    border: `1px solid ${COLORS.accent1}30`,
                    height: '100%',
                    boxShadow: `0 10px 30px rgba(0, 0, 0, 0.3)`
                  }}>
                    <h3 style={{ 
                      fontSize: '22px', 
                      marginBottom: '20px',
                      fontWeight: 'bold',
                      color: COLORS.accent1,
                      fontFamily: "'Orbitron', sans-serif",
                      textShadow: `0 0 15px ${COLORS.accent1}60`
                    }}>Active Game Settings</h3>
                    
                    <AdaptiveDifficultySettings 
                      studentId={userDataState?.id} 
                      gameId={selectedGame?.id || educationalGames[0].id}
                      onApply={(settings) => {
                        console.log('Applied difficulty settings:', settings);
                        // In a real app, you would apply these settings to the game
                      }}
                    />
                  </div>
                </div>
                
                {/* Recommended Games */}
                <div style={{ marginBottom: '40px' }}>
                  <RecommendedGames 
                    studentId={userDataState?.id}
                    onPlayGame={handlePlayGame}
                  />
                </div>
                
                {/* Learning Path */}
                <div style={{ marginBottom: '40px' }}>
                  <LearningPathVisualizer studentId={userDataState?.id} />
                </div>
              </div>
            )}
            
            {/* Recent Activities and Progress Chart */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '30px',
              marginBottom: '40px'
            }}>
              <RecentActivity activities={recentActivities} />
              <ProgressChart progressData={progressChartData} />
            </div>
            
            {/* Educational Games Section */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <h2 style={{ 
                  fontSize: '22px',
                  fontFamily: TYPOGRAPHY.fontFamily.headings,
                  color: 'white'
                }}>
                  Educational Games
                </h2>
                
                <button
                  onClick={() => setSelectedTab('games')}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '10px',
                    padding: '8px 15px',
                    color: 'white',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  View All
                </button>
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '20px'
              }}>
                {educationalGames.slice(0, 3).map((game, index) => (
                  <GameCard 
                    key={game.id} 
                    game={game} 
                    index={index} 
                    onPlay={handlePlayGame} 
                  />
                  ))}
              </div>
            </div>
            
            {/* Upcoming Exams Section */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <h2 style={{ 
                  fontSize: '22px',
                  fontFamily: TYPOGRAPHY.fontFamily.headings,
                  color: 'white'
                }}>
                  Upcoming Exams
                </h2>
                
                <button
                  onClick={() => setSelectedTab('exams')}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '10px',
                    padding: '8px 15px',
                    color: 'white',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  View All
                </button>
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '20px'
              }}>
                {exams.map((exam, index) => (
                  <ExamCard 
                    key={exam.id} 
                    exam={exam} 
                    index={index} 
                    onAttendExam={handleAttendExam} 
                  />
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'games':
        return (
          <div>
            <h2 style={{ 
              fontSize: '26px', 
              marginBottom: '30px',
              fontWeight: 'bold',
              color: COLORS.primary,
              fontFamily: "'Orbitron', sans-serif",
              textShadow: `0 0 15px ${COLORS.primary}60`
            }}>
              Educational Games
            </h2>
            
            {/* Games Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
              gap: '30px',
              marginBottom: '40px'
            }}>
              {educationalGames.map((game, index) => (
                <GameCard 
                  key={game.id} 
                  game={game} 
                  index={index} 
                  onPlay={handlePlayGame} 
                />
              ))}
            </div>
            
            {/* Show ML features if enabled */}
            {showMLFeatures && (
              <div style={{ marginTop: '50px' }}>
                <h3 style={{ 
                  fontSize: '22px', 
                  marginBottom: '20px',
                  fontWeight: 'bold',
                  color: COLORS.accent1,
                  fontFamily: "'Orbitron', sans-serif",
                  textShadow: `0 0 15px ${COLORS.accent1}60`
                }}>
                  Personalized Recommendations
                </h3>
                
                <RecommendedGames 
                  studentId={userDataState?.id}
                  onPlayGame={handlePlayGame}
                />
              </div>
            )}
          </div>
        );
        
      case 'exams':
        return (
          <div>
            <h2 style={{ 
              fontSize: '26px', 
              marginBottom: '30px',
              fontWeight: 'bold',
              color: COLORS.accent1,
              fontFamily: "'Orbitron', sans-serif",
              textShadow: `0 0 15px ${COLORS.accent1}60`
            }}>
              Upcoming Exams
            </h2>
            
            {/* Exams Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
              gap: '30px',
              marginBottom: '40px'
            }}>
              {exams.map((exam, index) => (
                <ExamCard 
                  key={exam.id} 
                  exam={exam} 
                  index={index} 
                  onAttendExam={handleAttendExam} 
                />
              ))}
            </div>
            
            {/* Mock Exam Generator Button */}
            <div style={{
              marginTop: '50px',
              background: `linear-gradient(135deg, ${COLORS.backgroundLighter}, ${COLORS.background})`,
              borderRadius: '20px',
              padding: '30px',
              border: `1px solid ${COLORS.accent1}30`,
              boxShadow: `0 10px 30px rgba(0, 0, 0, 0.3)`
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                marginBottom: '20px'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: `radial-gradient(circle at center, ${COLORS.accent1}30 0%, rgba(0,0,0,0))`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: COLORS.accent1,
                  border: `1px solid ${COLORS.accent1}50`,
                  boxShadow: `0 0 15px ${COLORS.accent1}50`,
                  fontSize: '30px'
                }}>
                  <Brain />
                </div>
                
                <div>
                  <h3 style={{
                    fontSize: '22px',
                    color: COLORS.accent1,
                    margin: '0 0 5px 0',
                    fontWeight: 'bold',
                    fontFamily: "'Orbitron', sans-serif"
                  }}>
                    AI-Powered Mock Exam Generator
                  </h3>
                  <p style={{
                    fontSize: '16px',
                    color: 'rgba(255, 255, 255, 0.7)',
                    margin: 0
                  }}>
                    Generate personalized practice exams based on your weaknesses
                  </p>
                </div>
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '15px',
                marginBottom: '30px'
              }}>
                <button
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primary}CC)`,
                    boxShadow: `0 0 20px ${COLORS.primary}50`,
                    border: 'none',
                    borderRadius: '10px',
                    padding: '15px',
                    color: '#000',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontFamily: "'Orbitron', sans-serif",
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                  }}
                >
                  <Calculator size={16} />
                  Mathematics
                </button>
                
                <button
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.accent1}, ${COLORS.accent1}CC)`,
                    boxShadow: `0 0 20px ${COLORS.accent1}50`,
                    border: 'none',
                    borderRadius: '10px',
                    padding: '15px',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontFamily: "'Orbitron', sans-serif",
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                  }}
                >
                  <Atom size={16} />
                  Physics
                </button>
                
                <button
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.secondary}, ${COLORS.secondary}CC)`,
                    boxShadow: `0 0 20px ${COLORS.secondary}50`,
                    border: 'none',
                    borderRadius: '10px',
                    padding: '15px',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontFamily: "'Orbitron', sans-serif",
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                  }}
                >
                  <FlaskConical size={16} />
                  Chemistry
                </button>
                
                <button
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.accent2}, ${COLORS.accent2}CC)`,
                    boxShadow: `0 0 20px ${COLORS.accent2}50`,
                    border: 'none',
                    borderRadius: '10px',
                    padding: '15px',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontFamily: "'Orbitron', sans-serif",
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                  }}
                >
                  <Shapes size={16} />
                  All Subjects
                </button>
              </div>
              
              <div style={{
                borderRadius: '10px',
                background: 'rgba(0,0,0,0.3)',
                padding: '15px',
                marginBottom: '20px',
                border: `1px solid ${COLORS.accent1}20`
              }}>
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.7)',
                  margin: 0
                }}>
                  <strong style={{ color: COLORS.accent1 }}>Note:</strong> Mock exams are generated based on your performance in games and previous exams. 
                  The AI identifies your weak areas and creates targeted questions to help you improve.
                </p>
              </div>
            </div>
          </div>
        );
        
      case 'doubts':
        return (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '30px'
            }}>
              <h2 style={{ 
                fontSize: '26px',
                fontWeight: 'bold',
                color: COLORS.primary,
                fontFamily: "'Orbitron', sans-serif",
                textShadow: `0 0 15px ${COLORS.primary}60`,
                margin: 0
              }}>
                Doubts & Questions
              </h2>
              
              <button
                onClick={() => setShowDoubtModal(true)}
                style={{
                  background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primary}CC)`,
                  boxShadow: `0 0 20px ${COLORS.primary}50`,
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px 20px',
                  color: '#000',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontFamily: "'Orbitron', sans-serif",
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <MessageCircle size={16} />
                Post a Doubt
              </button>
            </div>
            
            {/* Loading state for doubts */}
            {loadingDoubts ? (
              <div style={{
                padding: '40px',
                textAlign: 'center',
                color: COLORS.primary
              }}>
                <div style={{
                  display: 'inline-block',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  borderTop: `3px solid ${COLORS.primary}`,
                  borderRight: `3px solid transparent`,
                  animation: 'spin 1s linear infinite',
                  marginBottom: '20px'
                }} />
                <p>Loading your doubts...</p>
              </div>
            ) : doubtError ? (
              <div style={{
                padding: '40px',
                textAlign: 'center',
                color: COLORS.accent2
              }}>
                <p>{doubtError}</p>
                <button
                  onClick={fetchDoubts}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '10px',
                    padding: '10px 20px',
                    color: 'white',
                    marginTop: '20px',
                    cursor: 'pointer'
                  }}
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: '20px'
              }}>
                {doubtsData.map((doubt, index) => (
                  <ExistingDoubtCard 
                    key={doubt.id} 
                    doubt={doubt} 
                    index={index} 
                  />
                ))}
              </div>
            )}
            
            {doubtsData.length === 0 && !loadingDoubts && !doubtError && (
              <div style={{
                padding: '40px',
                textAlign: 'center',
                color: 'rgba(255,255,255,0.7)',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '20px',
                marginTop: '20px'
              }}>
                <MessageCircle size={40} style={{ margin: '0 auto 20px', opacity: 0.5 }} />
                <p>You haven't posted any doubts yet.</p>
                <button
                  onClick={() => setShowDoubtModal(true)}
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primary}CC)`,
                    boxShadow: `0 0 20px ${COLORS.primary}50`,
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px 20px',
                    color: '#000',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    marginTop: '20px',
                    fontFamily: "'Orbitron', sans-serif",
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    margin: '20px auto 0'
                  }}
                >
                  <MessageCircle size={16} />
                  Post Your First Doubt
                </button>
              </div>
            )}
          </div>
        );
      
      case 'profile':
        return (
          <div>
            <h2 style={{ 
              fontSize: '26px', 
              marginBottom: '30px',
              fontWeight: 'bold',
              color: COLORS.secondary,
              fontFamily: "'Orbitron', sans-serif",
              textShadow: `0 0 15px ${COLORS.secondary}60`
            }}>
              Your Profile
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 2fr',
              gap: '30px',
              marginBottom: '40px'
            }}>
              {/* Profile Information Card */}
              <div style={{
                background: `linear-gradient(135deg, ${COLORS.backgroundLighter}, ${COLORS.background})`,
                borderRadius: '20px',
                padding: '30px',
                border: `1px solid ${COLORS.secondary}30`,
                height: 'fit-content',
                boxShadow: `0 10px 30px rgba(0, 0, 0, 0.3)`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: `radial-gradient(circle at center, ${COLORS.secondary}30 0%, rgba(0,0,0,0))`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                  border: `1px solid ${COLORS.secondary}50`,
                  boxShadow: `0 0 30px ${COLORS.secondary}50`,
                  fontSize: '60px',
                  color: COLORS.secondary
                }}>
                  <User />
                </div>
                
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '5px'
                }}>
                  {userDataState?.name || "Student"}
                </h3>
                
                <p style={{
                  fontSize: '16px',
                  color: COLORS.secondary,
                  marginBottom: '20px',
                  fontFamily: "'Orbitron', sans-serif"
                }}>
                  Level {userDataState?.level || 1} Student
                </p>
                
                <div style={{
                  display: 'flex',
                  gap: '15px',
                  marginBottom: '20px'
                }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}>
                    <div style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: COLORS.primary
                    }}>
                      {userDataState?.points || 0}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: 'rgba(255,255,255,0.7)'
                    }}>
                      Points
                    </div>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}>
                    <div style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: COLORS.accent1
                    }}>
                      {userDataState?.badges || 0}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: 'rgba(255,255,255,0.7)'
                    }}>
                      Badges
                    </div>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}>
                    <div style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: COLORS.accent2
                    }}>
                      {userDataState?.streakDays || 0}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: 'rgba(255,255,255,0.7)'
                    }}>
                      Streak
                    </div>
                  </div>
                </div>
                
                <div style={{
                  borderTop: '1px solid rgba(255,255,255,0.1)',
                  paddingTop: '20px',
                  marginBottom: '20px',
                  width: '100%'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '10px'
                  }}>
                    <PieChart size={16} color={COLORS.secondary} />
                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
                      GPA: <strong style={{ color: 'white' }}>{userDataState?.gpa || "3.0/4.0"}</strong>
                    </span>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '10px'
                  }}>
                    <BookOpen size={16} color={COLORS.secondary} />
                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
                      School: <strong style={{ color: 'white' }}>{userDataState?.school || "Unknown School"}</strong>
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowProfileEditModal(true)}
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.secondary}, ${COLORS.secondary}CC)`,
                    boxShadow: `0 0 20px ${COLORS.secondary}50`,
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px 20px',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    width: '100%',
                    fontFamily: "'Orbitron', sans-serif",
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                  }}
                >
                  <Edit2 size={16} />
                  Edit Profile
                </button>
              </div>
              
              {/* Personal Information Card */}
              <div style={{
                background: `linear-gradient(135deg, ${COLORS.backgroundLighter}, ${COLORS.background})`,
                borderRadius: '20px',
                padding: '30px',
                border: `1px solid ${COLORS.secondary}30`,
                height: 'fit-content',
                boxShadow: `0 10px 30px rgba(0, 0, 0, 0.3)`
              }}>
                <h3 style={{ 
                  fontSize: '20px', 
                  marginBottom: '25px',
                  fontWeight: 'bold',
                  color: COLORS.secondary,
                  fontFamily: "'Orbitron', sans-serif",
                  textShadow: `0 0 15px ${COLORS.secondary}60`
                }}>
                  Personal Information
                </h3>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '20px',
                  marginBottom: '30px'
                }}>
                  <div>
                    <label style={{
                      fontSize: '14px',
                      color: 'rgba(255,255,255,0.7)',
                      marginBottom: '8px',
                      display: 'block'
                    }}>
                      Full Name
                    </label>
                    <div style={{
                      fontSize: '16px',
                      color: 'white',
                      padding: '12px 15px',
                      background: 'rgba(0,0,0,0.3)',
                      borderRadius: '10px',
                      border: `1px solid ${COLORS.secondary}30`
                    }}>
                      {userDataState?.name || "Student"}
                    </div>
                  </div>
                  
                  <div>
                    <label style={{
                      fontSize: '14px',
                      color: 'rgba(255,255,255,0.7)',
                      marginBottom: '8px',
                      display: 'block'
                    }}>
                      Email Address
                    </label>
                    <div style={{
                      fontSize: '16px',
                      color: 'white',
                      padding: '12px 15px',
                      background: 'rgba(0,0,0,0.3)',
                      borderRadius: '10px',
                      border: `1px solid ${COLORS.secondary}30`
                    }}>
                      {userDataState?.email || "student@example.com"}
                    </div>
                  </div>
                  
                  <div>
                    <label style={{
                      fontSize: '14px',
                      color: 'rgba(255,255,255,0.7)',
                      marginBottom: '8px',
                      display: 'block'
                    }}>
                      Date of Birth
                    </label>
                    <div style={{
                      fontSize: '16px',
                      color: 'white',
                      padding: '12px 15px',
                      background: 'rgba(0,0,0,0.3)',
                      borderRadius: '10px',
                      border: `1px solid ${COLORS.secondary}30`
                    }}>
                      {userDataState?.birthDate ? new Date(userDataState.birthDate).toLocaleDateString() : "Not set"}
                    </div>
                  </div>
                  
                  <div>
                    <label style={{
                      fontSize: '14px',
                      color: 'rgba(255,255,255,0.7)',
                      marginBottom: '8px',
                      display: 'block'
                    }}>
                      Phone Number
                    </label>
                    <div style={{
                      fontSize: '16px',
                      color: 'white',
                      padding: '12px 15px',
                      background: 'rgba(0,0,0,0.3)',
                      borderRadius: '10px',
                      border: `1px solid ${COLORS.secondary}30`
                    }}>
                      {userDataState?.phoneNumber || "Not set"}
                    </div>
                  </div>
                </div>
                
                <h3 style={{ 
                  fontSize: '20px', 
                  marginBottom: '25px',
                  fontWeight: 'bold',
                  color: COLORS.secondary,
                  fontFamily: "'Orbitron', sans-serif",
                  textShadow: `0 0 15px ${COLORS.secondary}60`
                }}>
                  Parent/Guardian Information
                </h3>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '20px'
                }}>
                  <div>
                    <label style={{
                      fontSize: '14px',
                      color: 'rgba(255,255,255,0.7)',
                      marginBottom: '8px',
                      display: 'block'
                    }}>
                      Parent's Email
                    </label>
                    <div style={{
                      fontSize: '16px',
                      color: 'white',
                      padding: '12px 15px',
                      background: 'rgba(0,0,0,0.3)',
                      borderRadius: '10px',
                      border: `1px solid ${COLORS.secondary}30`
                    }}>
                      {userDataState?.parentEmail || "parent@example.com"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Achievements Section */}
            <div style={{
              background: `linear-gradient(135deg, ${COLORS.backgroundLighter}, ${COLORS.background})`,
              borderRadius: '20px',
              padding: '30px',
              border: `1px solid ${COLORS.accent3}30`,
              marginBottom: '40px',
              boxShadow: `0 10px 30px rgba(0, 0, 0, 0.3)`
            }}>
              <h3 style={{ 
                fontSize: '22px', 
                marginBottom: '25px',
                fontWeight: 'bold',
                color: COLORS.accent3,
                fontFamily: "'Orbitron', sans-serif",
                textShadow: `0 0 15px ${COLORS.accent3}60`
              }}>
                Achievements & Badges
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: '20px',
                marginBottom: '20px'
              }}>
                {/* Sample achievement badges */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center'
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: `radial-gradient(circle at center, ${COLORS.primary}30 0%, rgba(0,0,0,0))`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '15px',
                    border: `1px solid ${COLORS.primary}50`,
                    boxShadow: `0 0 15px ${COLORS.primary}50`,
                    fontSize: '32px',
                    color: COLORS.primary
                  }}>
                    <Trophy />
                  </div>
                  <h4 style={{
                    fontSize: '14px',
                    color: 'white',
                    margin: '0 0 5px 0'
                  }}>
                    Math Master
                  </h4>
                  <p style={{
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.7)',
                    margin: 0
                  }}>
                    Solved 50+ math problems
                  </p>
                </div>
                
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                 alignItems: 'center',
                  textAlign: 'center'
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: `radial-gradient(circle at center, ${COLORS.accent1}30 0%, rgba(0,0,0,0))`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '15px',
                    border: `1px solid ${COLORS.accent1}50`,
                    boxShadow: `0 0 15px ${COLORS.accent1}50`,
                    fontSize: '32px',
                    color: COLORS.accent1
                  }}>
                    <Zap />
                  </div>
                  <h4 style={{
                    fontSize: '14px',
                    color: 'white',
                    margin: '0 0 5px 0'
                  }}>
                    Quick Learner
                  </h4>
                  <p style={{
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.7)',
                    margin: 0
                  }}>
                    Completed 5 courses in a week
                  </p>
                </div>
                
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center'
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: `radial-gradient(circle at center, ${COLORS.secondary}30 0%, rgba(0,0,0,0))`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '15px',
                    border: `1px solid ${COLORS.secondary}50`,
                    boxShadow: `0 0 15px ${COLORS.secondary}50`,
                    fontSize: '32px',
                    color: COLORS.secondary
                  }}>
                    <FlaskConical />
                  </div>
                  <h4 style={{
                    fontSize: '14px',
                    color: 'white',
                    margin: '0 0 5px 0'
                  }}>
                    Chemistry Wizard
                  </h4>
                  <p style={{
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.7)',
                    margin: 0
                  }}>
                    Scored 90%+ in 3 exams
                  </p>
                </div>
                
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center'
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: `radial-gradient(circle at center, ${COLORS.accent2}30 0%, rgba(0,0,0,0))`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '15px',
                    border: `1px solid ${COLORS.accent2}50`,
                    boxShadow: `0 0 15px ${COLORS.accent2}50`,
                    fontSize: '32px',
                    color: COLORS.accent2
                  }}>
                    <Award />
                  </div>
                  <h4 style={{
                    fontSize: '14px',
                    color: 'white',
                    margin: '0 0 5px 0'
                  }}>
                    Perfect Attendance
                  </h4>
                  <p style={{
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.7)',
                    margin: 0
                  }}>
                    30-day login streak
                  </p>
                </div>
                
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center'
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: `radial-gradient(circle at center, ${COLORS.accent3}30 0%, rgba(0,0,0,0))`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '15px',
                    border: `1px solid ${COLORS.accent3}50`,
                    boxShadow: `0 0 15px ${COLORS.accent3}50`,
                    fontSize: '32px',
                    color: COLORS.accent3
                  }}>
                    <Target />
                  </div>
                  <h4 style={{
                    fontSize: '14px',
                    color: 'white',
                    margin: '0 0 5px 0'
                  }}>
                    Goal Crusher
                  </h4>
                  <p style={{
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.7)',
                    margin: 0
                  }}>
                    Completed all weekly targets
                  </p>
                </div>
              </div>
              
              <div style={{
                borderRadius: '10px',
                background: 'rgba(0,0,0,0.3)',
                padding: '15px',
                marginTop: '20px',
                border: `1px solid ${COLORS.accent3}20`
              }}>
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.7)',
                  margin: 0
                }}>
                  <strong style={{ color: COLORS.accent3 }}>Next Badge:</strong> "Physics Explorer" - Complete 10 physics experiments with 85%+ accuracy
                </p>
                <div style={{
                  width: '100%',
                  height: '6px',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '3px',
                  overflow: 'hidden',
                  marginTop: '10px',
                  position: 'relative'
                }}>
                  <div
                    style={{
                      height: '100%',
                      width: '60%',
                      background: `linear-gradient(90deg, ${COLORS.accent3}, ${COLORS.accent3}CC)`,
                      boxShadow: `0 0 10px ${COLORS.accent3}70`,
                      borderRadius: '3px'
                    }}
                  />
                </div>
              </div>
            </div>
            
            {/* Performance Analytics Section */}
            <div style={{
              background: `linear-gradient(135deg, ${COLORS.backgroundLighter}, ${COLORS.background})`,
              borderRadius: '20px',
              padding: '30px',
              border: `1px solid ${COLORS.primary}30`,
              boxShadow: `0 10px 30px rgba(0, 0, 0, 0.3)`
            }}>
              <h3 style={{ 
                fontSize: '22px', 
                marginBottom: '25px',
                fontWeight: 'bold',
                color: COLORS.primary,
                fontFamily: "'Orbitron', sans-serif",
                textShadow: `0 0 15px ${COLORS.primary}60`
              }}>
                Performance Analytics
              </h3>
              
              <div style={{
                marginBottom: '30px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '15px'
                }}>
                  <h4 style={{
                    fontSize: '18px',
                    color: 'white',
                    margin: 0
                  }}>
                    Subject Performance
                  </h4>
                  
                  <select style={{
                    background: 'rgba(0,0,0,0.3)',
                    border: `1px solid ${COLORS.primary}30`,
                    borderRadius: '10px',
                    color: 'white',
                    padding: '8px 15px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}>
                    <option>Last 30 Days</option>
                    <option>Last 90 Days</option>
                    <option>Last 6 Months</option>
                    <option>All Time</option>
                  </select>
                </div>
                
                {/* Mock chart - In a real app, use a proper chart library */}
                <div style={{
                  display: 'flex',
                  height: '200px',
                  alignItems: 'flex-end',
                  gap: '25px',
                  padding: '0 10px'
                }}>
                  {/* Mathematics */}
                  <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <div style={{
                      width: '100%',
                      background: `linear-gradient(to top, ${COLORS.primary}90, ${COLORS.primary}10)`,
                      height: '85%',
                      borderRadius: '5px',
                      position: 'relative'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '-25px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        color: COLORS.primary,
                        fontWeight: 'bold',
                        fontSize: '14px'
                      }}>
                        85%
                      </div>
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: 'rgba(255,255,255,0.7)'
                    }}>
                      Math
                    </div>
                  </div>
                  
                  {/* Physics */}
                  <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <div style={{
                      width: '100%',
                      background: `linear-gradient(to top, ${COLORS.accent1}90, ${COLORS.accent1}10)`,
                      height: '78%',
                      borderRadius: '5px',
                      position: 'relative'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '-25px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        color: COLORS.accent1,
                        fontWeight: 'bold',
                        fontSize: '14px'
                      }}>
                        78%
                      </div>
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: 'rgba(255,255,255,0.7)'
                    }}>
                      Physics
                    </div>
                  </div>
                  
                  {/* Chemistry */}
                  <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <div style={{
                      width: '100%',
                      background: `linear-gradient(to top, ${COLORS.secondary}90, ${COLORS.secondary}10)`,
                      height: '92%',
                      borderRadius: '5px',
                      position: 'relative'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '-25px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        color: COLORS.secondary,
                        fontWeight: 'bold',
                        fontSize: '14px'
                      }}>
                        92%
                      </div>
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: 'rgba(255,255,255,0.7)'
                    }}>
                      Chemistry
                    </div>
                  </div>
                  
                  {/* Biology */}
                  <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <div style={{
                      width: '100%',
                      background: `linear-gradient(to top, ${COLORS.accent2}90, ${COLORS.accent2}10)`,
                      height: '65%',
                      borderRadius: '5px',
                      position: 'relative'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '-25px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        color: COLORS.accent2,
                        fontWeight: 'bold',
                        fontSize: '14px'
                      }}>
                        65%
                      </div>
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: 'rgba(255,255,255,0.7)'
                    }}>
                      Biology
                    </div>
                  </div>
                  
                  {/* English */}
                  <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <div style={{
                      width: '100%',
                      background: `linear-gradient(to top, ${COLORS.accent3}90, ${COLORS.accent3}10)`,
                      height: '88%',
                      borderRadius: '5px',
                      position: 'relative'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '-25px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        color: COLORS.accent3,
                        fontWeight: 'bold',
                        fontSize: '14px'
                      }}>
                        88%
                      </div>
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: 'rgba(255,255,255,0.7)'
                    }}>
                      English
                    </div>
                  </div>
                </div>
              </div>
              
              <div style={{
                borderRadius: '10px',
                background: 'rgba(0,0,0,0.3)',
                padding: '15px',
                border: `1px solid ${COLORS.primary}20`,
                marginBottom: '20px'
              }}>
                <h4 style={{
                  fontSize: '16px',
                  color: COLORS.primary,
                  margin: '0 0 10px 0'
                }}>
                  AI Analysis
                </h4>
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.7)',
                  margin: 0,
                  lineHeight: '1.5'
                }}>
                  Your strongest subject is Chemistry (92%), while Biology (65%) shows room for improvement. 
                  Your consistency has increased by 15% in the last month, and you've shown significant 
                  progress in Mathematics with a 7% improvement over the previous period.
                </p>
              </div>
              
              <button
                style={{
                  background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primary}CC)`,
                  boxShadow: `0 0 20px ${COLORS.primary}50`,
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px 20px',
                  color: '#000',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  width: '100%',
                  fontFamily: "'Orbitron', sans-serif",
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}
              >
                <BarChart2 size={16} />
                View Detailed Analytics
              </button>
            </div>
          </div>
        );
        
      default:
        return (
          <div>
            <h2>Unknown Tab</h2>
          </div>
        );
    }
  };
  return (
    <div style={{ 
      fontFamily: TYPOGRAPHY.fontFamily.primary,
      background: COLORS.background,
      minHeight: '100vh',
      color: 'white',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Mouse tracker effect */}
      <MouseTracker />
      
      {/* Navbar */}
      <div style={{
        background: COLORS.backgroundDarker,
        borderBottom: `1px solid ${COLORS.primary}40`,
        padding: '15px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: `0 5px 20px rgba(0, 0, 0, 0.5)`
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '5px',
              display: 'none',
              '@media (maxWidth: 768px)': {
                display: 'block'
              }
            }}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
          
          <div style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: COLORS.primary,
            fontFamily: "'Orbitron', sans-serif",
            textShadow: `0 0 15px ${COLORS.primary}60`,
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Brain />
            NeonLearn
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '8px 15px',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '10px',
            border: `1px solid ${COLORS.primary}30`
          }}>
            <Star size={16} color={COLORS.primary} />
            <span style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: COLORS.primary
            }}>
              {userDataState?.points || 0} Points
            </span>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '8px 15px',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '10px',
            border: `1px solid ${COLORS.accent1}30`
          }}>
  
            <Activity size={16} color={COLORS.accent1} />
            <span style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: COLORS.accent1
            }}>
              {userDataState?.streakDays || 0} Day Streak
            </span>
          </div>
          
          <div
            onClick={() => setProfileModalOpen(true)}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: `radial-gradient(circle at center, ${COLORS.secondary}30 0%, rgba(0,0,0,0))`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: `1px solid ${COLORS.secondary}50`,
              boxShadow: `0 0 15px ${COLORS.secondary}50`,
              fontSize: '20px',
              color: COLORS.secondary
            }}
          >
            <User />
          </div>
        </div>
      </div>
      
      <div style={{
        display: 'flex',
        flex: 1
      }}>
        {/* Sidebar */}
        <div style={{
          width: '250px',
          background: COLORS.backgroundDarker,
          borderRight: `1px solid ${COLORS.primary}40`,
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 71px)',
          position: 'sticky',
          top: '71px',
          '@media (maxWidth: 768px)': {
            display: mobileMenuOpen ? 'flex' : 'none',
            position: 'fixed',
            top: '71px',
            left: 0,
            zIndex: 99,
            width: '250px',
            height: 'calc(100vh - 71px)'
          }
        }}>
          <div style={{
            marginBottom: '20px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            paddingBottom: '20px'
          }}>
            <div style={{
              fontSize: '14px',
              color: 'rgba(255,255,255,0.5)',
              marginBottom: '10px',
              padding: '0 10px'
            }}>
              MAIN MENU
            </div>
            
            <button
              onClick={() => setSelectedTab('dashboard')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 15px',
                borderRadius: '10px',
                background: selectedTab === 'dashboard' ? 
                  `linear-gradient(135deg, ${COLORS.primary}20, transparent)` : 
                  'transparent',
                border: 'none',
                color: selectedTab === 'dashboard' ? COLORS.primary : 'white',
                fontSize: '16px',
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left',
                marginBottom: '5px',
                transition: 'all 0.3s ease',
                fontFamily: selectedTab === 'dashboard' ? 
                  "'Orbitron', sans-serif" : 
                  TYPOGRAPHY.fontFamily.primary
              }}
            >
              <Home />
              Dashboard
            </button>
            
            <button
              onClick={() => setSelectedTab('games')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 15px',
                borderRadius: '10px',
                background: selectedTab === 'games' ? 
                  `linear-gradient(135deg, ${COLORS.primary}20, transparent)` : 
                  'transparent',
                border: 'none',
                color: selectedTab === 'games' ? COLORS.primary : 'white',
                fontSize: '16px',
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left',
                marginBottom: '5px',
                transition: 'all 0.3s ease',
                fontFamily: selectedTab === 'games' ? 
                  "'Orbitron', sans-serif" : 
                  TYPOGRAPHY.fontFamily.primary
              }}
            >
              <Brain />
              Games
            </button>
            
            <button
              onClick={() => setSelectedTab('exams')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 15px',
                borderRadius: '10px',
                background: selectedTab === 'exams' ? 
                  `linear-gradient(135deg, ${COLORS.primary}20, transparent)` : 
                  'transparent',
                border: 'none',
                color: selectedTab === 'exams' ? COLORS.primary : 'white',
                fontSize: '16px',
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left',
                marginBottom: '5px',
                transition: 'all 0.3s ease',
                fontFamily: selectedTab === 'exams' ? 
                  "'Orbitron', sans-serif" : 
                  TYPOGRAPHY.fontFamily.primary
              }}
            >
              <BookOpen />
              Exams
            </button>
            
            <button
              onClick={() => setSelectedTab('doubts')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 15px',
                borderRadius: '10px',
                background: selectedTab === 'doubts' ? 
                  `linear-gradient(135deg, ${COLORS.primary}20, transparent)` : 
                  'transparent',
                border: 'none',
                color: selectedTab === 'doubts' ? COLORS.primary : 'white',
                fontSize: '16px',
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left',
                transition: 'all 0.3s ease',
                fontFamily: selectedTab === 'doubts' ? 
                  "'Orbitron', sans-serif" : 
                  TYPOGRAPHY.fontFamily.primary
              }}
            >
              <MessageCircle />
              Doubts
            </button>
          </div>
          
          <div style={{
            marginBottom: '20px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            paddingBottom: '20px'
          }}>
            <div style={{
              fontSize: '14px',
              color: 'rgba(255,255,255,0.5)',
              marginBottom: '10px',
              padding: '0 10px'
            }}>
              ACCOUNT
            </div>
            
            <button
  onClick={() => setProfileModalOpen(true)}
  style={{
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 15px',
    borderRadius: '10px',
    background: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: '16px',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left',
    marginBottom: '5px',
    transition: 'all 0.3s ease',
    fontFamily: TYPOGRAPHY.fontFamily.primary
  }}
>
  <User />
  Profile
</button>
  <button     
   onClick={() => {     
     localStorage.removeItem('user');
      localStorage.removeItem('token');           
                                                                                     
         navigate('/login');      
          }}          
               style={{    
       display: 'flex',  
  alignItems: 'center',    
   gap: '12px',  
   padding: '12px 15px',   
   borderRadius: '10px',   
    background: 'transparent',    
     border: 'none',          
      color: 'white',           
        fontSize: '16px',           
          cursor: 'pointer',              
           width: '100%',               
           textAlign: 'left',                
              transition: 'all 0.3s ease'           
                }}             >     
                  <LogOut />      
                Logout            
             </button>
          
          <div style={{
            marginTop: 'auto',
            padding: '15px',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '10px',
            border: `1px solid ${COLORS.accent2}30`
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '10px'
            }}>
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: `radial-gradient(circle at center, ${COLORS.accent2}30 0%, rgba(0,0,0,0))`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: COLORS.accent2,
                border: `1px solid ${COLORS.accent2}50`,
                boxShadow: `0 0 10px ${COLORS.accent2}50`,
                fontSize: '16px'
              }}>
                <Trophy />
              </div>
              
              <div style={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: 'white'
              }}>
                Level {userDataState?.level || 1}
              </div>
            </div>
            
            <div style={{
              width: '100%',
              height: '6px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '3px',
              overflow: 'hidden',
              marginBottom: '8px'
            }}>
              <div
                style={{
                  height: '100%',
                  width: '65%',
                  background: `linear-gradient(90deg, ${COLORS.accent2}, ${COLORS.accent2}CC)`,
                  boxShadow: `0 0 10px ${COLORS.accent2}70`,
                  borderRadius: '3px'
                }}
              />
            </div>
            
            <div style={{
              fontSize: '12px',
              color: 'rgba(255,255,255,0.7)',
           textAlign: 'center'
            }}>
              3,500 more points to Level {(userDataState?.level || 1) + 1}
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div style={{
          flex: 1,
          padding: '30px',
          overflowY: 'auto'
        }}>
          {renderTabContent()}
        </div>
      </div>
      
      {/* Game Modal */}
      {selectedGame && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div
            style={{
              background: `linear-gradient(135deg, ${COLORS.backgroundLighter}, ${COLORS.background})`,
            border: `1px solid ${selectedGame?.color || '#39FF14'}30`,

              borderRadius: '20px',
              width: '100%',
              maxWidth: '800px',
              position: 'relative',
              boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${selectedGame.color}30`,
              animation: 'modal-appear 0.3s ease-out',
              padding: '30px'
            }}
          >
            <button
              onClick={() => setSelectedGame(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                width: '40px',
                height: '40px',
                borderRadius:'50%',
                backgroundColor: 'rgba(0,0,0,0.4)',
                border: `1px solid ${selectedGame.color}50`,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10
              }}
            >
              <X size={20} />
            </button>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              '@media (minWidth: 768px)': {
                flexDirection: 'row'
              }
            }}>
              <div style={{
                flex: 1,
                '@media (minWidth: 768px)': {
                  flex: '0 0 60%'
                }
              }}>
                <div
                  style={{
                    background: `radial-gradient(circle at center, ${selectedGame.color}30 0%, rgba(0,0,0,0))`,
                    color: selectedGame.color,
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '40px',
                    marginBottom: '20px',
                    border: `1px solid ${selectedGame.color}50`,
                    boxShadow: `0 0 20px ${selectedGame.color}50`
                  }}
                >
                  {selectedGame.icon}
                </div>
                
                <h2 style={{ 
                  fontSize: '32px', 
                  marginBottom: '15px',
                  fontWeight: 'bold',
                  color: selectedGame.color,
                  fontFamily: "'Orbitron', sans-serif",
                  textShadow: `0 0 15px ${selectedGame.color}60`
                }}>
                  {selectedGame.title}
                </h2>
                
                <div style={{ 
                  display: 'flex', 
                  gap: '10px', 
                  marginBottom: '20px',
                  flexWrap: 'wrap'
                }}>
                  <span style={{ 
                    fontSize: '14px', 
                    color: 'rgba(255,255,255,0.7)',
                    background: 'rgba(0,0,0,0.3)',
                    padding: '5px 10px',
                    borderRadius: '10px'
                  }}>{selectedGame.category}</span>
                  
                  <span
                    style={{
                      backgroundColor: `${selectedGame.color}20`,
                      color: selectedGame.color,
                      border: `1px solid ${selectedGame.color}40`,
                      padding: '5px 12px',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      boxShadow: `0 0 10px ${selectedGame.color}30`
                    }}
                  >
                    {selectedGame.difficulty}
                  </span>
                </div>
                
                <p style={{
                  fontSize: '16px',
                  color: 'rgba(255,255,255,0.8)',
                  marginBottom: '20px',
                  lineHeight: '1.6'
                }}>
                  {selectedGame.description}
                </p>
                
                <div style={{
                  marginBottom: '25px'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    color: 'white',
                    marginBottom: '15px'
                  }}>
                    Skills You'll Develop
                  </h3>
                  
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}>
                    {selectedGame.skills.map((skill, index) => (
                      <span
                        key={index}
                        style={{
                          background: 'rgba(0,0,0,0.3)',
                          border: `1px solid ${selectedGame.color}30`,
                          borderRadius: '20px',
                          padding: '8px 15px',
                          fontSize: '14px',
                          color: 'white'
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '15px',
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: '10px',
                  marginBottom: '25px'
                }}>
                  <div>
                    <div style={{
                      fontSize: '14px',
                      color: 'rgba(255,255,255,0.6)',
                      marginBottom: '5px'
                    }}>
                      Last Played
                    </div>
                    <div style={{
                      fontSize: '16px',
                      color: 'white'
                    }}>
                      {selectedGame.lastPlayed}
                    </div>
                  </div>
                  
                  <div>
                    <div style={{
                      fontSize: '14px',
                      color: 'rgba(255,255,255,0.6)',
                      marginBottom: '5px'
                    }}>
                      Total Plays
                    </div>
                    <div style={{
                      fontSize: '16px',
                      color: 'white'
                    }}>
                      {selectedGame.totalPlays}
                    </div>
                  </div>
                  
                  <div>
                    <div style={{
                      fontSize: '14px',
                      color: 'rgba(255,255,255,0.6)',
                      marginBottom: '5px'
                    }}>
                      XP Reward
                    </div>
                    <div style={{
                      fontSize: '16px',
                      color: selectedGame.color,
                      fontWeight: 'bold'
                    }}>
                      {selectedGame.xpReward}
                    </div>
                  </div>
                </div>
              </div>
              
              <div style={{
                flex: 1,
                '@media (minWidth: 768px)': {
                  flex: '0 0 40%'
                }
              }}>
                <div style={{
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: '15px',
                  padding: '20px',
                  marginBottom: '25px',
                  border: `1px solid ${selectedGame.color}30`
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    color: 'white',
                    marginBottom: '15px'
                  }}>
                    Level Progress
                  </h3>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '10px'
                  }}>
                    <span style={{
                      fontSize: '14px',
                      color: 'rgba(255,255,255,0.7)'
                    }}>
                      {selectedGame.completedLevels} of {selectedGame.totalLevels} levels completed
                    </span>
                    
                    <span style={{
                      fontSize: '14px',
                      color: selectedGame.color,
                      fontWeight: 'bold'
                    }}>
                      {Math.round((selectedGame.completedLevels / selectedGame.totalLevels) * 100)}%
                    </span>
                  </div>
                  
                  <div style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    marginBottom: '20px'
                  }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${(selectedGame.completedLevels / selectedGame.totalLevels) * 100}%`,
                        background: `linear-gradient(90deg, ${selectedGame.color}, ${selectedGame.color}CC)`,
                        boxShadow: `0 0 10px ${selectedGame.color}70`,
                        borderRadius: '4px'
                      }}
                    />
                  </div>
                  
                  <div style={{
                    maxHeight: '200px',
                    overflowY: 'auto',
                    paddingRight: '10px'
                  }}>
                    {selectedGame.levels && selectedGame.levels.map((level, index) => (
                      <div
                        key={level.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '10px 15px',
                          borderRadius: '8px',
                          marginBottom: '8px',
                          background: level.completed ? 
                            `${selectedGame.color}20` : 
                            'rgba(255,255,255,0.05)',
                          border: level.completed ? 
                            `1px solid ${selectedGame.color}40` : 
                            '1px solid rgba(255,255,255,0.1)'
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px'
                        }}>
                          <div style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            background: level.completed ? 
                              selectedGame.color : 
                              'rgba(255,255,255,0.1)',
                            color: level.completed ? 
                              '#000' : 
                              'rgba(255,255,255,0.7)'
                          }}>
                            {level.id}
                          </div>
                          
                          <span style={{
                            fontSize: '14px',
                            color: level.completed ? 
                              'white' : 
                              'rgba(255,255,255,0.7)'
                          }}>
                            {level.title}
                          </span>
                        </div>
                        
                        {level.completed ? (
                          <div style={{
                            fontSize: '14px',
                            fontWeight: 'bold',
                            color: selectedGame.color
                          }}>
                            {level.score}%
                          </div>
                        ) : (
                          <div style={{
                            fontSize: '12px',
                            color: 'rgba(255,255,255,0.5)'
                          }}>
                            Locked
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
              </div>
                
                {/* Adaptive Difficulty Settings */}
                {showMLFeatures && selectedGame.adaptiveDifficulty !== undefined && (
                  <div style={{
                    background: 'rgba(0,0,0,0.3)',
                    borderRadius: '15px',
                    padding: '20px',
                    marginBottom: '25px',
                    border: `1px solid ${selectedGame.color}30`
                  }}>
                    <h3 style={{
                      fontSize: '18px',
                      color: 'white',
                      marginBottom: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      <Brain size={16} color={selectedGame.color} />
                      Adaptive Difficulty
                    </h3>
                    
                    <AdaptiveDifficultySettings 
                      studentId={userDataState?.id} 
                      gameId={selectedGame.id}
                      onApply={(settings) => {
                        console.log('Applied difficulty settings:', settings);
                        // In a real app, you would apply these settings to the game
                        
                        // Save the setting to localStorage as a fallback
                        try {
                          if (userDataState?.id) {
                            localStorage.setItem(`game_difficulty_${userDataState.id}_${selectedGame.id}`, settings.difficulty.toString());
                          }
                        } catch (error) {
                          console.warn('Could not save difficulty to localStorage', error);
                        }
                      }}
                    />
                  </div>
                )}
                
                <div style={{
                  display: 'flex',
                  gap: '15px'
                }}>
                  <button
                    onClick={() => {
                      setSelectedGame(null);
                      
                      // In a real app, you would navigate to a practice mode
                      console.log("Practice mode");
                    }}
                    style={{
                      flex: 1,
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '15px',
                      padding: '15px',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      fontFamily: TYPOGRAPHY.fontFamily.primary
                    }}
                  >
                    Practice Mode
                  </button>
                  
                  <button
                    onClick={() => {
                      // Record the game start time for tracking play duration
                      if (userDataState && userDataState.id) {
                        localStorage.setItem(`game_start_${userDataState.id}_${selectedGame.id}`, Date.now().toString());
                        
                        // Also store any current progress to resume
                        const gameProgress = {
                          lastPlayed: new Date().toISOString(),
                          gameId: selectedGame.id
                        };
                        localStorage.setItem(`game_progress_${userDataState.id}`, JSON.stringify(gameProgress));
                      }
                      
                      // Close the modal and start the game
                      setSelectedGame(null);
                      
                      // In a real app, you would navigate to the game page
                      // Navigate to the game page in some cases
                      if (selectedGame.id === 'game1' || selectedGame.id === 'game2' || selectedGame.id === 'game3') {
                        navigate(`/play-game/${selectedGame.id}`);
                      } else {
                        // For demo, simulate game completion after a delay
                        setTimeout(() => {
                          // Generate a score based on adaptive difficulty (if available)
                          let score = Math.floor(50 + (Math.random() * 50)); // 50-100 score range
                          
                          // If adaptive difficulty is enabled, adjust score based on difficulty
                          if (selectedGame.adaptiveDifficulty !== undefined) {
                            // Higher difficulty = lower score (on average)
                            const difficultyFactor = 1 - (selectedGame.adaptiveDifficulty * 0.3);
                            score = Math.floor(score * difficultyFactor);
                            
                            // Ensure score is between 50-100
                            score = Math.max(50, Math.min(100, score));
                          }
                          
                          // Create completion data
                          const completionData = {
                            id: selectedGame.id,
                            score: score,
                            timeSpent: 180 + Math.floor(Math.random() * 300), // 3-8 minutes
                            completedLevel: selectedGame.completedLevels + 1,
                            totalLevels: selectedGame.levels?.length || 5,
                            skills: selectedGame.skills || [],
                            category: selectedGame.category,
                            xpReward: selectedGame.xpReward || 100
                          };
                          
                          // Process game completion
                          handleGameCompletion(completionData);
                          
                          // Notify the user (in a real app, show a proper notification)
                          console.log("Game completed with score:", score);
                        }, 1000); // Simulate 1-second game for demo
                      }
                    }}
                    style={{
                      flex: 2,
                      background: `linear-gradient(135deg, ${selectedGame.color}, ${selectedGame.color}CC)`,
                      boxShadow: `0 0 20px ${selectedGame.color}50`,
                      border: 'none',
                      borderRadius: '15px',
                      padding: '15px',
                      color: '#fff',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      fontFamily: "'Orbitron', sans-serif",
                      letterSpacing: '1px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px'
                    }}
                  >
                    <Play size={20} />
                    Play Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Create Doubt Modal */}
      {showDoubtModal && (
        <CreateDoubtModal
          onClose={() => setShowDoubtModal(false)}
          onSubmit={handleSubmitDoubt}
        />
      )}
      
      {/* Exam Modal */}
      {selectedExam && (
        <ExamModal
          exam={selectedExam}
          onClose={() => setSelectedExam(null)}
          onExamComplete={handleExamCompletion}
        />
      )}
      
      {/* Profile Edit Modal */}
      {showProfileEditModal && (
        <ProfileEditModal
          userData={userDataState}
          onClose={() => setShowProfileEditModal(false)}
          onSave={handleSaveProfile}
        />
      )}

      {/* Profile Modal */}
      {profileModalOpen && (
        <ProfileModal
          user={user}
          onClose={() => setProfileModalOpen(false)}
        />
      )}
      
      <style>
        {`
          @keyframes modal-appear {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
          
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          /* Custom scrollbar */
          ::-webkit-scrollbar {
            width: 8px;
          }
          
          ::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 10px;
          }
          
          ::-webkit-scrollbar-thumb {
            background: rgba(57, 255, 20, 0.3);
            border-radius: 10px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: rgba(57, 255, 20, 0.5);
          }
        `}
      </style>
   </div>
   </div>
  );
};

export default StudentDashboard;