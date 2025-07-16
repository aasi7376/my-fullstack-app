// src/components/student/GamePlayer.js - Stunning Design with CSS-in-JS (No Tailwind Required)
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { 
  Search, 
  Star, 
  Clock, 
  Play, 
  Trophy, 
  Target, 
  Zap, 
  Brain,
  Heart,
  Filter,
  TrendingUp,
  Award,
  BookOpen,
  Sparkles,
  Gamepad2,
  Rocket,
  Crown,
  Fire,
  Users,
  ChevronRight,
  Gem,
  Shield,
  Coins
} from 'lucide-react';

const GamePlayer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredGames, setFilteredGames] = useState([]);
  const [studentPrediction, setStudentPrediction] = useState(null);
  const [recommendedGames, setRecommendedGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [hoveredGame, setHoveredGame] = useState(null);
  
  const navigate = useNavigate();
  const studentId = localStorage.getItem('studentId') || 'demo-student-001';

  const games = [
    // Math Games
    {
      id: 'algebra-quest-001',
      title: 'Algebra Quest',
      icon: '🧮',
      favorite: true,
      rating: 4.8,
      description: 'Master algebraic equations through exciting adventures and unlock the secrets of mathematical problem-solving',
      difficulty: 'Medium',
      difficultyLevel: 0.6,
      new: false,
      category: 'Math',
      topic: 'Linear Equations',
      estimatedTime: 15,
      completionRate: 87,
      studentsPlayed: 1247,
      xpReward: 250,
      coinsReward: 150,
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 50%, #6366F1 100%)'
    },
    {
      id: 'number-ninja-002',
      title: 'Number Ninja',
      icon: '⚡',
      favorite: false,
      rating: 4.6,
      description: 'Sharpen your arithmetic skills with lightning-fast challenges that will make you a calculation master',
      difficulty: 'Easy',
      difficultyLevel: 0.3,
      new: true,
      category: 'Math',
      topic: 'Mental Math',
      estimatedTime: 10,
      completionRate: 94,
      studentsPlayed: 2156,
      xpReward: 180,
      coinsReward: 100,
      gradient: 'linear-gradient(135deg, #10B981 0%, #059669 50%, #0D9488 100%)'
    },
    {
      id: 'geometry-warrior-003',
      title: 'Geometry Warrior',
      icon: '📐',
      favorite: true,
      rating: 4.9,
      description: 'Explore shapes, angles, and spatial relationships in this immersive geometric battlefield experience',
      difficulty: 'Hard',
      difficultyLevel: 0.8,
      new: true,
      category: 'Math',
      topic: 'Shapes & Angles',
      estimatedTime: 20,
      completionRate: 76,
      studentsPlayed: 892,
      xpReward: 350,
      coinsReward: 200,
      gradient: 'linear-gradient(135deg, #EF4444 0%, #EC4899 50%, #F43F5E 100%)'
    },
    {
      id: 'fraction-frenzy-004',
      title: 'Fraction Frenzy',
      icon: '🍕',
      favorite: false,
      rating: 4.7,
      description: 'Conquer fractions, decimals, and percentages in this high-energy mathematical adventure',
      difficulty: 'Medium',
      difficultyLevel: 0.5,
      new: true,
      category: 'Math',
      topic: 'Parts & Wholes',
      estimatedTime: 12,
      completionRate: 82,
      studentsPlayed: 1634,
      xpReward: 220,
      coinsReward: 130,
      gradient: 'linear-gradient(135deg, #F97316 0%, #F59E0B 50%, #EAB308 100%)'
    },
    {
      id: 'statistics-detective-005',
      title: 'Statistics Detective',
      icon: '🔍',
      favorite: false,
      rating: 4.5,
      description: 'Solve mysteries using data analysis, graphs, and statistical methods to crack the case',
      difficulty: 'Hard',
      difficultyLevel: 0.7,
      new: false,
      category: 'Math',
      topic: 'Data Analysis',
      estimatedTime: 25,
      completionRate: 68,
      studentsPlayed: 743,
      xpReward: 320,
      coinsReward: 180,
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 50%, #0EA5E9 100%)'
    },
    {
      id: 'calculus-challenge-006',
      title: 'Calculus Challenge',
      icon: '📈',
      favorite: true,
      rating: 4.4,
      description: 'Push your mathematical limits with advanced calculus concepts and derivative challenges',
      difficulty: 'Expert',
      difficultyLevel: 0.9,
      new: true,
      category: 'Math',
      topic: 'Derivatives',
      estimatedTime: 30,
      completionRate: 54,
      studentsPlayed: 421,
      xpReward: 500,
      coinsReward: 300,
      gradient: 'linear-gradient(135deg, #9333EA 0%, #6366F1 50%, #3B82F6 100%)'
    },
    
    // Physics Games
    {
      id: 'quantum-quest-007',
      title: 'Quantum Quest',
      icon: '⚛️',
      favorite: false,
      rating: 4.7,
      description: 'Explore the fascinating world of quantum mechanics and particle physics through mind-bending challenges',
      difficulty: 'Hard',
      difficultyLevel: 0.8,
      new: true,
      category: 'Physics',
      topic: 'Quantum Mechanics',
      estimatedTime: 25,
      completionRate: 72,
      studentsPlayed: 968,
      xpReward: 350,
      coinsReward: 200,
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #EC4899 100%)'
    },
    {
      id: 'motion-masters-008',
      title: 'Motion Masters',
      icon: '🔄',
      favorite: true,
      rating: 4.6,
      description: 'Master the laws of classical mechanics, forces, and motion in this high-energy physics adventure',
      difficulty: 'Medium',
      difficultyLevel: 0.5,
      new: false,
      category: 'Physics',
      topic: 'Classical Mechanics',
      estimatedTime: 20,
      completionRate: 85,
      studentsPlayed: 1842,
      xpReward: 280,
      coinsReward: 150,
      gradient: 'linear-gradient(135deg, #059669 0%, #10B981 50%, #34D399 100%)'
    },
    
    // Chemistry Games
    {
      id: 'element-explorer-009',
      title: 'Element Explorer',
      icon: '⚗️',
      favorite: true,
      rating: 4.8,
      description: 'Journey through the periodic table and discover the fascinating properties of elements and their compounds',
      difficulty: 'Medium',
      difficultyLevel: 0.6,
      new: true,
      category: 'Chemistry',
      topic: 'Periodic Table',
      estimatedTime: 18,
      completionRate: 81,
      studentsPlayed: 1529,
      xpReward: 260,
      coinsReward: 140,
      gradient: 'linear-gradient(135deg, #F97316 0%, #FB923C 50%, #FDBA74 100%)'
    },
    {
      id: 'reaction-rush-010',
      title: 'Reaction Rush',
      icon: '🧪',
      favorite: false,
      rating: 4.5,
      description: 'Race against time to balance equations and predict outcomes in this thrilling chemistry reaction challenge',
      difficulty: 'Hard',
      difficultyLevel: 0.7,
      new: false,
      category: 'Chemistry',
      topic: 'Chemical Reactions',
      estimatedTime: 22,
      completionRate: 73,
      studentsPlayed: 1103,
      xpReward: 310,
      coinsReward: 170,
      gradient: 'linear-gradient(135deg, #EF4444 0%, #F87171 50%, #FCA5A5 100%)'
    },
    
    // Statistics Games
    {
      id: 'data-detective-011',
      title: 'Data Detective',
      icon: '📊',
      favorite: false,
      rating: 4.7,
      description: 'Solve mysteries using statistical analysis, probability, and data interpretation skills',
      difficulty: 'Medium',
      difficultyLevel: 0.6,
      new: true,
      category: 'Statistics',
      topic: 'Descriptive Statistics',
      estimatedTime: 20,
      completionRate: 79,
      studentsPlayed: 1265,
      xpReward: 290,
      coinsReward: 160,
      gradient: 'linear-gradient(135deg, #6366F1 0%, #818CF8 50%, #A5B4FC 100%)'
    },
    {
      id: 'probability-pioneer-012',
      title: 'Probability Pioneer',
      icon: '🎲',
      favorite: true,
      rating: 4.6,
      description: 'Navigate the world of chance, risk, and uncertainty in this probability-based adventure',
      difficulty: 'Hard',
      difficultyLevel: 0.8,
      new: true,
      category: 'Statistics',
      topic: 'Probability',
      estimatedTime: 25,
      completionRate: 68,
      studentsPlayed: 932,
      xpReward: 380,
      coinsReward: 220,
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 50%, #C4B5FD 100%)'
    }
  ];

  const categories = ['All', ...new Set(games.map(game => game.category))];

  useEffect(() => {
    fetchStudentPrediction();
    fetchGameRecommendations();
  }, []);

  const fetchStudentPrediction = async () => {
    try {
      setApiError(null);
      const data = await api.get(`/ml/predict/${studentId}/composite`);
      setStudentPrediction(data.prediction);
    } catch (error) {
      console.error('Error fetching prediction:', error);
      setApiError('Demo mode active - using sample data');
      
      setStudentPrediction({
        prediction: 85,
        confidence: 0.92,
        recommendations: [
          'Focus more on geometry concepts',
          'Try practicing fractions daily',
          'Great progress in algebra!'
        ]
      });
    }
  };

  const fetchGameRecommendations = async () => {
    try {
      const data = await api.get(`/ml/adaptive/study-plan/${studentId}`);
      if (data.studyPlan && data.studyPlan.recommendedPath) {
        setRecommendedGames(data.studyPlan.recommendedPath);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setRecommendedGames(['algebra-quest-001', 'fraction-frenzy-004', 'geometry-warrior-003', 'quantum-quest-007', 'element-explorer-009']);
    }
  };

  const getGameRecommendation = (game) => {
    if (!studentPrediction) return null;
    
    const predictedScore = studentPrediction.prediction;
    const gameDifficulty = game.difficultyLevel;
    
    if (predictedScore < 50 && gameDifficulty > 0.6) {
      return { type: 'warning', message: 'Epic Challenge!', icon: '🔥', color: 'linear-gradient(135deg, #F97316 0%, #EF4444 100%)' };
    } else if (predictedScore > 80 && gameDifficulty < 0.4) {
      return { type: 'info', message: 'Confidence Booster!', icon: '💪', color: 'linear-gradient(135deg, #059669 0%, #10B981 100%)' };
    } else if (Math.abs((predictedScore / 100) - gameDifficulty) < 0.2) {
      return { type: 'success', message: 'Perfect Match!', icon: '🎯', color: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)' };
    }
    
    return null;
  };

  const getDifficultyConfig = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return { 
        color: '#10B981', 
        bg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.2) 100%)', 
        icon: '🌱'
      };
      case 'Medium': return { 
        color: '#F59E0B', 
        bg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(249, 115, 22, 0.2) 100%)', 
        icon: '⚡'
      };
      case 'Hard': return { 
        color: '#EF4444', 
        bg: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)', 
        icon: '🔥'
      };
      case 'Expert': return { 
        color: '#8B5CF6', 
        bg: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)', 
        icon: '👑'
      };
      default: return { 
        color: '#6B7280', 
        bg: 'linear-gradient(135deg, rgba(107, 114, 128, 0.2) 0%, rgba(75, 85, 99, 0.2) 100%)', 
        icon: '📚'
      };
    }
  };

  const handlePlayNow = async (game) => {
    setLoading(true);
    
    try {
      let mlDifficulty = null;
      
      try {
        const difficultyData = await api.get(`/ml/adaptive/difficulty/${studentId}/${game.id}`);
        mlDifficulty = difficultyData.difficulty;
      } catch (error) {
        console.warn('Could not fetch adaptive difficulty:', error);
        mlDifficulty = 0.65;
      }
      
      navigate(`/student/game/${game.id}`, {
        state: {
          game: game,
          mlDifficulty: mlDifficulty,
          studentPrediction: studentPrediction
        }
      });
      
    } catch (error) {
      console.error('Error starting game:', error);
      navigate(`/student/game/${game.id}`, {
        state: { game: game }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredGames([]);
    } else {
      const filtered = games.filter(game => 
        game.title.toLowerCase().includes(query.toLowerCase()) || 
        game.description.toLowerCase().includes(query.toLowerCase()) ||
        game.difficulty.toLowerCase().includes(query.toLowerCase()) ||
        game.category.toLowerCase().includes(query.toLowerCase()) ||
        game.topic.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredGames(filtered);
    }
  };

  const gamesToDisplay = searchQuery.trim() === '' 
    ? (selectedCategory === 'All' ? games : games.filter(game => game.category === selectedCategory))
    : filteredGames;

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0F172A 0%, #581C87 50%, #312E81 100%)',
    color: 'white',
    position: 'relative',
    overflow: 'hidden'
  };

  const backgroundEffectStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    zIndex: 0
  };

  const contentStyle = {
    position: 'relative',
    zIndex: 10,
    padding: '2rem'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '4rem'
  };

  const titleStyle = {
    fontSize: '5rem',
    fontWeight: '900',
    background: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 25%, #06B6D4 75%, #10B981 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '1.5rem',
    animation: 'pulse 2s infinite'
  };

  const subtitleStyle = {
    fontSize: '1.5rem',
    color: '#CBD5E1',
    maxWidth: '48rem',
    margin: '0 auto',
    fontWeight: '500'
  };

  const alertStyle = {
    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(249, 115, 22, 0.2) 100%)',
    backdropFilter: 'blur(20px)',
    border: '2px solid rgba(245, 158, 11, 0.3)',
    borderRadius: '1.5rem',
    padding: '1.5rem',
    marginBottom: '3rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  const insightsStyle = {
    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 50%, rgba(236, 72, 153, 0.1) 100%)',
    backdropFilter: 'blur(20px)',
    border: '2px solid rgba(99, 102, 241, 0.3)',
    borderRadius: '2rem',
    padding: '2rem',
    marginBottom: '4rem',
    position: 'relative',
    overflow: 'hidden'
  };

  const searchContainerStyle = {
    marginBottom: '3rem'
  };

  const searchInputStyle = {
    width: '100%',
    background: 'rgba(30, 41, 59, 0.5)',
    backdropFilter: 'blur(20px)',
    border: '2px solid rgba(71, 85, 105, 0.5)',
    borderRadius: '1.5rem',
    padding: '1.5rem 1rem 1.5rem 3rem',
    color: 'white',
    fontSize: '1.1rem',
    outline: 'none',
    transition: 'all 0.3s ease'
  };

  const gamesGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '2rem',
    marginBottom: '3rem'
  };

  const gameCardStyle = {
    background: 'rgba(30, 41, 59, 0.9)',
    backdropFilter: 'blur(20px)',
    borderRadius: '2rem',
    padding: '2rem',
    border: '2px solid rgba(71, 85, 105, 0.5)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden'
  };

  const gameCardHoverStyle = {
    ...gameCardStyle,
    transform: 'scale(1.03) rotateY(5deg)',
    border: '2px solid rgba(6, 182, 212, 0.3)',
    boxShadow: '0 25px 50px -12px rgba(6, 182, 212, 0.5)'
  };

  const playButtonStyle = {
    width: '100%',
    background: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
    color: 'white',
    padding: '1.25rem 2rem',
    borderRadius: '1.5rem',
    border: 'none',
    fontSize: '1.2rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem'
  };

  return (
    <div style={containerStyle}>
      {/* Background Effects */}
      <div style={backgroundEffectStyle}>
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          style={{
            position: 'absolute',
            top: '-50%',
            right: '-50%',
            width: '24rem',
            height: '24rem',
            background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
            borderRadius: '50%',
            filter: 'blur(80px)'
          }}
        />
        <motion.div
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 25, repeat: Infinity }}
          style={{
            position: 'absolute',
            bottom: '-50%',
            left: '-50%',
            width: '24rem',
            height: '24rem',
            background: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
            borderRadius: '50%',
            filter: 'blur(80px)'
          }}
        />
      </div>

      <div style={contentStyle}>
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          style={headerStyle}
        >
          <motion.h1 
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 1 }}
            style={titleStyle}
          >
            GAME ARENA ⚡
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={subtitleStyle}
          >
            🚀 Level up your skills with <span style={{color: '#06B6D4', fontWeight: '700'}}>epic challenges</span> that make learning absolutely <span style={{color: '#EC4899', fontWeight: '700'}}>addictive!</span>
          </motion.p>
        </motion.div>

        {/* Demo Alert */}
        {apiError && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            style={alertStyle}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
              <motion.div 
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{fontSize: '2rem'}}
              >
                ✨
              </motion.div>
              <div>
                <p style={{color: '#FCD34D', fontWeight: '700', fontSize: '1.2rem', margin: 0}}>🎯 Demo Mode Activated!</p>
                <p style={{color: '#FEF3C7', margin: 0}}>Experience the full power with sample data</p>
              </div>
            </div>
            <button 
              onClick={() => setApiError(null)} 
              style={{
                background: 'linear-gradient(135deg, #F59E0B 0%, #F97316 100%)',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '1rem',
                border: 'none',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              Got it! 🎉
            </button>
          </motion.div>
        )}

        {/* AI Insights */}
        {studentPrediction && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={insightsStyle}
          >
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem'}}>
              <motion.h3 
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                style={{
                  fontSize: '2.5rem',
                  fontWeight: '900',
                  background: 'linear-gradient(135deg, #06B6D4 0%, #8B5CF6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  margin: 0
                }}
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  🧠
                </motion.div>
                YOUR AI INSIGHTS
              </motion.h3>
              <div style={{
                background: 'linear-gradient(135deg, #06B6D4 0%, #8B5CF6 100%)',
                padding: '0.5rem 1rem',
                borderRadius: '2rem',
                color: 'white',
                fontWeight: '700',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Sparkles size={16} />
                AI POWERED
              </div>
            </div>
            
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem'}}>
              {/* Performance Score */}
              <motion.div 
                whileHover={{ scale: 1.05, rotateY: 5 }}
                style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '2rem',
                  padding: '2rem',
                  border: '2px solid rgba(59, 130, 246, 0.3)',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.5 }}
                  style={{fontSize: '4rem', fontWeight: '900', color: 'white', marginBottom: '1rem'}}
                >
                  {studentPrediction.prediction}%
                </motion.div>
                <div style={{color: '#93C5FD', fontSize: '1.2rem', marginBottom: '1rem', fontWeight: '600'}}>🎯 Predicted Performance</div>
                <div style={{position: 'relative', width: '100%', background: 'rgba(59, 130, 246, 0.3)', borderRadius: '2rem', height: '0.75rem', overflow: 'hidden'}}>
                  <motion.div 
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      height: '100%',
                      background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
                      borderRadius: '2rem'
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${studentPrediction.prediction}%` }}
                    transition={{ duration: 2, delay: 1 }}
                  />
                </div>
              </motion.div>

              {/* Confidence Level */}
            <motion.div 
                whileHover={{ scale: 1.05, rotateY: -5 }}
                style={{
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '2rem',
                  padding: '2rem',
                  border: '2px solid rgba(139, 92, 246, 0.3)',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.7 }}
                  style={{fontSize: '4rem', fontWeight: '900', color: 'white', marginBottom: '1rem'}}
                >
                  {Math.round(studentPrediction.confidence * 100)}%
                </motion.div>
                <div style={{color: '#C4B5FD', fontSize: '1.2rem', marginBottom: '1rem', fontWeight: '600'}}>🎪 AI Confidence</div>
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{display: 'flex', justifyContent: 'center'}}
                >
                  <Target color="#A78BFA" size={48} />
                </motion.div>
              </motion.div>

              {/* Recommendations */}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(13, 148, 136, 0.2) 100%)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '2rem',
                  padding: '2rem',
                  border: '2px solid rgba(16, 185, 129, 0.3)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <h4 style={{fontSize: '1.5rem', fontWeight: '700', color: '#A7F3D0', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🚀
                  </motion.div>
                  Recommendations
                </h4>
                {studentPrediction.recommendations && studentPrediction.recommendations.length > 0 && (
                  <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                    {studentPrediction.recommendations.slice(0, 3).map((rec, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1 + index * 0.2 }}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.75rem',
                          background: 'rgba(16, 185, 129, 0.1)',
                          padding: '0.75rem',
                          borderRadius: '1rem'
                        }}
                      >
                        <div style={{color: '#10B981', marginTop: '0.25rem', fontSize: '1.25rem'}}>💡</div>
                        <div style={{color: '#A7F3D0', fontWeight: '500'}}>{rec}</div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Search Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={searchContainerStyle}
        >
          <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
            <div style={{position: 'relative', flex: 1}}>
              <div style={{position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none'}}>
                <Search size={24} color="#94A3B8" />
              </div>
              <input
                type="text"
                placeholder="🔍 Search for your next adventure..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                style={searchInputStyle}
                onFocus={(e) => e.target.style.borderColor = 'rgba(6, 182, 212, 0.5)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'}
              />
              <div style={{position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.5rem'}}>
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                  ⭐
                </motion.div>
              </div>
            </div>

            {/* Category Pills */}
            <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem'}}>
              <Filter size={24} color="#94A3B8" style={{flexShrink: 0}} />
              {categories.map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '1rem',
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    flexShrink: 0,
                    background: selectedCategory === category
                      ? 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)'
                      : 'rgba(30, 41, 59, 0.5)',
                    color: 'white',
                    ...(selectedCategory === category && {
                      boxShadow: '0 10px 25px -5px rgba(6, 182, 212, 0.5)'
                    })
                  }}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Games Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={gamesGridStyle}
        >
          {gamesToDisplay.map((game, index) => {
            const recommendation = getGameRecommendation(game);
            const difficultyConfig = getDifficultyConfig(game.difficulty);
            
            return (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.03,
                  rotateY: 5
                }}
                onHoverStart={() => setHoveredGame(game.id)}
                onHoverEnd={() => setHoveredGame(null)}
                style={hoveredGame === game.id ? gameCardHoverStyle : gameCardStyle}
              >
                <div style={{
                  background: game.gradient,
                  padding: '2px',
                  borderRadius: '2rem',
                  boxShadow: hoveredGame === game.id ? '0 25px 50px -12px rgba(6, 182, 212, 0.5)' : 'none'
                }}>
                  <div style={{
                    background: 'rgba(15, 23, 42, 0.9)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '2rem',
                    padding: '1.5rem',
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    
                    {/* Header Section */}
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem'}}>
                      <motion.button 
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        style={{
                          background: 'none',
                          border: 'none',
                          fontSize: '1.75rem',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          color: game.favorite ? '#EF4444' : '#94A3B8'
                        }}
                      >
                        <Heart size={28} fill={game.favorite ? 'currentColor' : 'none'} />
                      </motion.button>
                      
                      <motion.div 
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        style={{
                          width: '5rem',
                          height: '5rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: game.gradient,
                          borderRadius: '2rem',
                          fontSize: '2.5rem',
                          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
                          position: 'relative'
                        }}
                      >
                        {game.icon}
                        <motion.div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(255, 255, 255, 0.2)',
                            borderRadius: '2rem'
                          }}
                          animate={{ opacity: [0, 0.3, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </motion.div>
                    </div>

                    {/* New Badge */}
                    {game.new && (
                      <motion.div 
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        style={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          background: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
                          color: 'white',
                          fontSize: '0.75rem',
                          fontWeight: '900',
                          padding: '0.5rem 1rem',
                          borderBottomLeftRadius: '2rem',
                          borderTopRightRadius: '2rem',
                          boxShadow: '0 10px 25px -5px rgba(236, 72, 153, 0.5)'
                        }}
                      >
                        <motion.span
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          🔥 HOT!
                        </motion.span>
                      </motion.div>
                    )}

                    {/* ML Recommendation Badge */}
                    {recommendation && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        style={{
                          position: 'absolute',
                          top: '6rem',
                          right: '1rem',
                          padding: '0.5rem 1rem',
                          borderRadius: '1rem',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          backdropFilter: 'blur(10px)',
                          border: '2px solid rgba(255, 255, 255, 0.2)',
                          background: recommendation.color,
                          color: 'white'
                        }}
                      >
                        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                          <span style={{fontSize: '1.2rem'}}>{recommendation.icon}</span>
                          <span>{recommendation.message}</span>
                        </div>
                      </motion.div>
                    )}

                    {/* Game Title and Rating */}
                    <div style={{marginBottom: '1.5rem'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem'}}>
                        <motion.h3 
                          style={{
                            fontWeight: '900',
                            fontSize: '1.5rem',
                            color: 'white',
                            transition: 'color 0.3s ease',
                            margin: 0,
                            ...(hoveredGame === game.id && { color: '#06B6D4' })
                          }}
                          whileHover={{ scale: 1.05 }}
                        >
                          {game.title}
                        </motion.h3>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(249, 115, 22, 0.2) 100%)',
                          padding: '0.75rem',
                          borderRadius: '1rem',
                          border: '1px solid rgba(245, 158, 11, 0.3)'
                        }}>
                          <Star size={18} color="#F59E0B" fill="#F59E0B" />
                          <span style={{color: '#FEF3C7', fontSize: '0.9rem', fontWeight: '700'}}>{game.rating}</span>
                        </div>
                      </div>
                      
                      <p style={{color: '#CBD5E1', fontSize: '0.9rem', lineHeight: '1.5', margin: 0}}>{game.description}</p>
                    </div>

                    {/* Rewards Section */}
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem'}}>
                      <div style={{
                        background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%)',
                        border: '1px solid rgba(234, 179, 8, 0.2)',
                        borderRadius: '1rem',
                        padding: '0.75rem',
                        textAlign: 'center'
                      }}>
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.25rem'}}>
                          <Zap size={16} color="#EAB308" />
                          <span style={{color: '#FDE047', fontWeight: '700', fontSize: '0.9rem'}}>{game.xpReward} XP</span>
                        </div>
                        <div style={{color: '#FEF08A', fontSize: '0.75rem'}}>Experience</div>
                      </div>
                      <div style={{
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                        borderRadius: '1rem',
                        padding: '0.75rem',
                        textAlign: 'center'
                      }}>
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.25rem'}}>
                          <Coins size={16} color="#10B981" />
                          <span style={{color: '#34D399', fontWeight: '700', fontSize: '0.9rem'}}>{game.coinsReward}</span>
                        </div>
                        <div style={{color: '#A7F3D0', fontSize: '0.75rem'}}>Coins</div>
                      </div>
                    </div>

                    {/* Game Stats */}
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem'}}>
                      <div style={{
                        background: 'rgba(71, 85, 105, 0.3)',
                        borderRadius: '1rem',
                        padding: '0.75rem',
                        border: '1px solid rgba(71, 85, 105, 0.3)'
                      }}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem'}}>
                          <Trophy size={16} color="#A855F7" />
                          <div style={{color: 'white', fontWeight: '700', fontSize: '0.9rem'}}>{game.completionRate}%</div>
                        </div>
                        <div style={{color: '#94A3B8', fontSize: '0.75rem'}}>Success Rate</div>
                      </div>
                      <div style={{
                        background: 'rgba(71, 85, 105, 0.3)',
                        borderRadius: '1rem',
                        padding: '0.75rem',
                        border: '1px solid rgba(71, 85, 105, 0.3)'
                      }}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem'}}>
                          <Users size={16} color="#06B6D4" />
                          <div style={{color: 'white', fontWeight: '700', fontSize: '0.9rem'}}>{(game.studentsPlayed / 1000).toFixed(1)}K</div>
                        </div>
                        <div style={{color: '#94A3B8', fontSize: '0.75rem'}}>Players</div>
                      </div>
                    </div>

                    {/* Game Meta Info */}
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          fontSize: '0.75rem',
                          padding: '0.5rem 1rem',
                          borderRadius: '1rem',
                          fontWeight: '700',
                          border: `2px solid ${difficultyConfig.color}`,
                          background: difficultyConfig.bg,
                          color: difficultyConfig.color
                        }}>
                          <span style={{marginRight: '0.5rem', fontSize: '0.9rem'}}>{difficultyConfig.icon}</span>
                          {game.difficulty}
                        </div>
                      </div>
                      
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: '#94A3B8',
                        fontSize: '0.9rem',
                        background: 'rgba(71, 85, 105, 0.3)',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '1rem'
                      }}>
                        <Clock size={16} />
                        <span style={{fontWeight: '500'}}>{game.estimatedTime} min</span>
                      </div>
                    </div>

                    {/* Epic Play Button */}
                    <motion.button 
                      onClick={() => handlePlayNow(game)}
                      disabled={loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        ...playButtonStyle,
                        background: game.gradient,
                        opacity: loading ? 0.5 : 1,
                        cursor: loading ? 'not-allowed' : 'pointer',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      onMouseEnter={(e) => {
                        if (!loading) {
                          e.target.style.boxShadow = '0 25px 50px -12px rgba(6, 182, 212, 0.5)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      {loading ? (
                        <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative', zIndex: 10}}>
                          <motion.div 
                            style={{
                              width: '1.5rem',
                              height: '1.5rem',
                              border: '3px solid rgba(255, 255, 255, 0.3)',
                              borderTop: '3px solid white',
                              borderRadius: '50%'
                            }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          <span>LOADING...</span>
                        </div>
                      ) : (
                        <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative', zIndex: 10}}>
                          <motion.div
                            whileHover={{ scale: 1.2, rotate: 360 }}
                            transition={{ duration: 0.5 }}
                          >
                            <Play size={24} fill="currentColor" />
                          </motion.div>
                          <span>PLAY NOW</span>
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            <ChevronRight size={20} />
                          </motion.div>
                        </div>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* No Results */}
        {gamesToDisplay.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{textAlign: 'center', padding: '5rem 0'}}
          >
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{fontSize: '5rem', marginBottom: '1.5rem'}}
            >
              🔍
            </motion.div>
            <h3 style={{fontSize: '2.5rem', fontWeight: '900', color: '#CBD5E1', marginBottom: '1rem'}}>No Adventures Found!</h3>
            <p style={{fontSize: '1.25rem', color: '#94A3B8', marginBottom: '2rem'}}>Try different keywords or explore all categories</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setFilteredGames([]);
              }}
              style={{
                background: 'linear-gradient(135deg, #06B6D4 0%, #8B5CF6 100%)',
                color: 'white',
                padding: '1rem 2rem',
                borderRadius: '1rem',
                border: 'none',
                fontWeight: '700',
                fontSize: '1.2rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 10px 25px -5px rgba(6, 182, 212, 0.5)'
              }}
            >
              🎮 Show All Games
            </motion.button>
          </motion.div>
        )}

        {/* Floating Action Elements */}
        <div style={{position: 'fixed', bottom: '2rem', right: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{
              width: '4rem',
              height: '4rem',
              background: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
              borderRadius: '50%',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              cursor: 'pointer',
              boxShadow: '0 20px 25px -5px rgba(236, 72, 153, 0.5)'
            }}
          >
            🎁
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 360]
            }}
            transition={{ 
              scale: { duration: 2, repeat: Infinity },
              rotate: { duration: 10, repeat: Infinity, ease: "linear" }
            }}
            style={{
              width: '4rem',
              height: '4rem',
              background: 'linear-gradient(135deg, #10B981 0%, #0D9488 100%)',
              borderRadius: '50%',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              cursor: 'pointer',
              boxShadow: '0 20px 25px -5px rgba(16, 185, 129, 0.5)'
            }}
          >
            ⚡
          </motion.button>
        </div>
      </div>

      {/* Add keyframe animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

export default GamePlayer;