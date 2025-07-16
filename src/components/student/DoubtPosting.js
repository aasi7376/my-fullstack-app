// src/components/student/DoubtPosting.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './DoubtPosting.css';

const DoubtPosting = () => {
  const [activeTab, setActiveTab] = useState('all');
  
  // Doubt counts
  const doubtCounts = {
    pending: 2,
    answered: 1
  };
  
  // Tips for better answers
  const tips = [
    { icon: '💡', text: 'Be specific about what you don\'t understand' },
    { icon: '🎮', text: 'Mention which game you were playing if relevant' },
    { icon: '📝', text: 'Include any work you\'ve already tried' },
    { icon: '🏷️', text: 'Add relevant tags to help organize your doubts' }
  ];
  
  // Sample doubts
  const doubts = [
    {
      id: 1,
      question: "I'm struggling with quadratic equations in Algebra Quest. How do I factor x² + 5x + 6?",
      game: "Algebra Quest",
      subject: "Algebra",
      date: "2024-05-25T14:30:00",
      status: "pending",
      tags: ["Quadratic Equations", "Factoring"]
    },
    {
      id: 2,
      question: "Can someone explain how to calculate the area of a triangle when I only have the coordinates of the vertices?",
      game: "Geometry Warrior",
      subject: "Geometry",
      date: "2024-05-24T10:15:00",
      status: "answered",
      answer: "You can use the formula Area = (1/2)|x₁(y₂-y₃) + x₂(y₃-y₁) + x₃(y₁-y₂)|. This is derived from the cross product and works for any triangle given by three points (x₁,y₁), (x₂,y₂), and (x₃,y₃).",
      answeredBy: "Ms. Johnson",
      tags: ["Area", "Coordinates"]
    },
    {
      id: 3,
      question: "I'm having trouble with mixed fractions in Fraction Frenzy. How do I convert 3½ to an improper fraction?",
      game: "Fraction Frenzy",
      subject: "Fractions",
      date: "2024-05-23T16:45:00",
      status: "pending",
      tags: ["Mixed Numbers", "Conversion"]
    }
  ];
  
  // Get filtered doubts based on active tab
  const getFilteredDoubts = () => {
    if (activeTab === 'all') return doubts;
    return doubts.filter(doubt => doubt.status === activeTab);
  };
  
  const filteredDoubts = getFilteredDoubts();
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    
    // Format to MM/DD/YYYY to match the UI in the screenshot
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const tipsSectionVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const tipItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="doubt-posting-container">
      <motion.div
        className="doubts-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* SECTION: Header */}
        <motion.div className="doubts-header-section" variants={headerVariants}>
          <div className="doubts-title-section">
            <h2 className="section-title">ASK YOUR DOUBTS</h2>
            <p className="section-subtitle">GET HELP FROM YOUR TEACHERS ON ANY TOPIC</p>
          </div>
          
          <div className="doubts-count-section">
            <div className="count-item pending-count">
              <span className="count-number">{doubtCounts.pending}</span>
              <span className="count-label">PENDING</span>
            </div>
            <div className="count-item answered-count">
              <span className="count-number">{doubtCounts.answered}</span>
              <span className="count-label">ANSWERED</span>
            </div>
          </div>
          
          <button className="ask-question-button">
            + ASK QUESTION
          </button>
        </motion.div>
        
        {/* SECTION: Tips */}
        <motion.div 
          className="tips-section"
          variants={tipsSectionVariants}
        >
          <h3 className="tips-header">
            <span className="tips-icon">💡</span>
            TIPS FOR BETTER ANSWERS
          </h3>
          <ul className="tips-list">
            {tips.map((tip, index) => (
              <motion.li 
                key={index} 
                className="tip-item"
                variants={tipItemVariants}
              >
                <span className="tip-icon">{tip.icon}</span>
                <span className="tip-text">{tip.text}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
        
        {/* SECTION: Tabs */}
        <div className="doubts-tabs-section">
          <button 
            className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            ALL DOUBTS
          </button>
          <button 
            className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            PENDING
          </button>
          <button 
            className={`tab-button ${activeTab === 'answered' ? 'active' : ''}`}
            onClick={() => setActiveTab('answered')}
          >
            ANSWERED
          </button>
        </div>
        
        {/* SECTION: Doubts List */}
        <div className="doubts-list-section">
          {filteredDoubts.map((doubt) => (
            <motion.div 
              key={doubt.id}
              className={`doubt-card ${doubt.status}-card`}
              variants={itemVariants}
            >
              <div className="doubt-question-section">
                <h4 className="doubt-question">{doubt.question}</h4>
              </div>
              
              <div className="doubt-meta-section">
                <span className="doubt-game">{doubt.game}</span>
                <span className="doubt-date">{formatDate(doubt.date)}</span>
                <span className={`doubt-status ${doubt.status}-status`}>
                  {doubt.status === 'pending' ? 'Pending' : 'Answered'}
                </span>
              </div>
              
              <div className="doubt-tags-section">
                {doubt.tags.map((tag, idx) => (
                  <span key={idx} className="doubt-tag">{tag}</span>
                ))}
              </div>
              
              {doubt.status === 'answered' && (
                <div className="doubt-answer-section">
                  <div className="answer-header">
                    <span className="answered-by">Answered by {doubt.answeredBy}</span>
                  </div>
                  <p className="answer-text">{doubt.answer}</p>
                </div>
              )}
              
              <div className="doubt-footer-section">
                <button className={`doubt-action-button ${doubt.status}-action`}>
                  {doubt.status === 'pending' ? 'FOLLOW' : 'MARK HELPFUL'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default DoubtPosting;