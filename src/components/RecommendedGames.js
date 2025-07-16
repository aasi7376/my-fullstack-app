// src/components/RecommendedGames.jsx
import { useState, useEffect } from 'react';
import mlService from '../services/mlService';
import { Brain, Play } from 'lucide-react';

// Define colors similar to the existing design
const COLORS = {
  background: '#151521',
  backgroundDarker: '#0d0d14',
  backgroundLighter: '#1d1d2e',
  primary: '#39FF14',
  secondary: '#9D00FF',
  accent1: '#1AECFF',
  accent2: '#FF2777',
  accent3: '#F8FF00',
  dark: '#0A0A0F',
  light: '#FFFFFF',
  gray: '#8A8A9B'
};

const RecommendedGames = ({ studentId, onPlayGame }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const data = await mlService.getRecommendedGames(studentId);
        
        // Merge recommendations with game data
        // In a real app, you would fetch full game details from your API
        const enrichedRecommendations = data.map(rec => ({
          ...rec,
          title: `Game ${rec.gameId}`, // Replace with actual game titles
          description: 'Recommended based on your learning profile',
          color: COLORS.primary,
          icon: <Brain />
        }));
        
        setRecommendations(enrichedRecommendations);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch recommendations:', err);
        setError('Could not load recommendations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecommendations();
  }, [studentId]);
  
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: `2px solid ${COLORS.primary}`,
          borderTopColor: 'transparent',
          margin: '0 auto 20px',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ color: 'white' }}>Loading recommendations...</p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }
  
  if (error) {
    return (
      <div style={{
        padding: '20px',
        borderRadius: '10px',
        backgroundColor: 'rgba(255, 39, 119, 0.1)',
        border: `1px solid ${COLORS.accent2}`,
        color: 'white',
        textAlign: 'center'
      }}>
        <p>{error}</p>
      </div>
    );
  }
  
  if (recommendations.length === 0) {
    return (
      <div style={{
        padding: '30px',
        borderRadius: '15px',
        backgroundColor: `${COLORS.backgroundLighter}`,
        border: `1px solid ${COLORS.gray}30`,
        textAlign: 'center',
        color: 'white'
      }}>
        <Brain size={40} color={COLORS.primary} style={{ marginBottom: '15px' }} />
        <h3>No recommendations yet</h3>
        <p>Play more games to get personalized recommendations!</p>
      </div>
    );
  }
  
  return (
    <div>
      <h2 style={{ 
        fontSize: '22px', 
        marginBottom: '20px',
        color: COLORS.primary,
        fontFamily: "'Orbitron', sans-serif",
        textShadow: `0 0 15px ${COLORS.primary}60`
      }}>
        Recommended for You
      </h2>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        {recommendations.map((game, index) => (
          <div
            key={game.gameId}
            style={{
              background: `linear-gradient(135deg, ${COLORS.backgroundLighter}, ${COLORS.background})`,
              border: `1px solid ${game.color}30`,
              borderRadius: '20px',
              padding: '25px',
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: `0 10px 30px rgba(0, 0, 0, 0.3)`,
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
              marginTop: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: COLORS.primary,
              fontSize: '14px'
            }}>
              <div style={{
                padding: '6px 12px',
                backgroundColor: `${COLORS.primary}20`,
                borderRadius: '20px',
                fontSize: '14px',
                color: COLORS.primary
              }}>
                AI Recommended
              </div>
              
              <div style={{ marginLeft: 'auto', color: 'white', opacity: 0.7 }}>
                {Math.round(game.score * 100)}% match
              </div>
            </div>
            
            <button
              onClick={() => onPlayGame(game.gameId)}
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
                marginTop: '20px',
                width: '100%',
                position: 'relative',
                zIndex: 2,
                fontFamily: "'Orbitron', sans-serif",
                letterSpacing: '1px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
              }}
            >
              <Play size={18} />
              Play Now
            </button>
          </div>
        ))}
      </div>
      
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default RecommendedGames;