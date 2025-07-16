// PostsManagement.jsx - With fully functional buttons and fixed modal
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '../common/Modal';
import InputField from '../forms/InputField';

// Define custom styles for the modal to ensure it's centered and visible
const FixedModal = ({ isOpen, onClose, title, children, footer, size = 'large' }) => {
  if (!isOpen) return null;
  
  const overlayStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 9998,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };
  
  const modalStyles = {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
    width: size === 'large' ? '90%' : size === 'medium' ? '70%' : '50%',
    maxWidth: size === 'large' ? '800px' : size === 'medium' ? '600px' : '400px',
    maxHeight: '90vh',
    overflow: 'auto',
    zIndex: 9999
  };
  
  return (
    <div style={overlayStyles} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={modalStyles} onClick={(e) => e.stopPropagation()}>
        <div className="p-6 bg-white/90 backdrop-blur-lg rounded-t-xl border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              ✕
            </button>
          </div>
        </div>
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {children}
        </div>
        {footer && (
          <div className="p-6 bg-gray-50/90 backdrop-blur-lg rounded-b-xl border-t border-gray-200">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

const PostsManagement = () => {
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoubt, setSelectedDoubt] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');
  const [replyText, setReplyText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' or 'oldest'

  // Mock data
  const mockDoubts = [
    {
      id: 1,
      student: {
        name: 'Alice Johnson',
        class: '10-A',
        avatar: 'AJ'
      },
      subject: 'Algebra',
      question: 'I\'m having trouble understanding quadratic equations. Can you explain how to solve x² + 5x + 6 = 0 step by step?',
      gameRelated: 'Algebra Quest',
      timestamp: '2025-01-20T10:30:00Z',
      status: 'pending',
      priority: 'medium',
      replies: []
    },
    {
      id: 2,
      student: {
        name: 'Bob Smith',
        class: '10-A',
        avatar: 'BS'
      },
      subject: 'Geometry',
      question: 'What\'s the difference between circumference and perimeter? I got confused during the Geometry Warrior game.',
      gameRelated: 'Geometry Warrior',
      timestamp: '2025-01-20T09:15:00Z',
      status: 'answered',
      priority: 'low',
      replies: [
        {
          id: 1,
          author: 'Teacher',
          text: 'Great question! Circumference is specifically for circles, while perimeter is for any closed shape. Circumference = 2πr, perimeter is the sum of all sides.',
          timestamp: '2025-01-20T09:45:00Z'
        }
      ]
    },
    {
      id: 3,
      student: {
        name: 'Carol Davis',
        class: '10-B',
        avatar: 'CD'
      },
      subject: 'Statistics',
      question: 'I don\'t understand the difference between mean, median, and mode. Can you give me some examples?',
      gameRelated: 'Statistics Detective',
      timestamp: '2025-01-20T08:22:00Z',
      status: 'pending',
      priority: 'high',
      replies: []
    },
    {
      id: 4,
      student: {
        name: 'David Wilson',
        class: '9-A',
        avatar: 'DW'
      },
      subject: 'Fractions',
      question: 'How do I add fractions with different denominators? The Fraction Frenzy game is really challenging!',
      gameRelated: 'Fraction Frenzy',
      timestamp: '2025-01-19T16:45:00Z',
      status: 'answered',
      priority: 'medium',
      replies: [
        {
          id: 1,
          author: 'Teacher',
          text: 'To add fractions with different denominators, you need to find a common denominator first. For example: 1/3 + 1/4 = 4/12 + 3/12 = 7/12',
          timestamp: '2025-01-19T17:15:00Z'
        }
      ]
    },
    {
      id: 5,
      student: {
        name: 'Emma Brown',
        class: '9-B',
        avatar: 'EB'
      },
      subject: 'Arithmetic',
      question: 'I keep making mistakes with long division. Any tips to avoid errors?',
      gameRelated: 'Number Ninja',
      timestamp: '2025-01-19T14:30:00Z',
      status: 'pending',
      priority: 'low',
      replies: []
    },
    {
      id: 6,
      student: {
        name: 'Frank Miller',
        class: '10-A',
        avatar: 'FM'
      },
      subject: 'Physics',
      question: 'Can someone explain the concept of momentum and how it relates to force?',
      gameRelated: 'Physics Explorer',
      timestamp: '2025-01-19T11:20:00Z',
      status: 'pending',
      priority: 'medium',
      replies: []
    },
    {
      id: 7,
      student: {
        name: 'Grace Lee',
        class: '9-A',
        avatar: 'GL'
      },
      subject: 'Chemistry',
      question: 'What\'s the difference between ionic and covalent bonds?',
      gameRelated: 'Chemistry Lab',
      timestamp: '2025-01-18T15:45:00Z',
      status: 'answered',
      priority: 'high',
      replies: [
        {
          id: 1,
          author: 'Teacher',
          text: 'Ionic bonds form when electrons are transferred between atoms (usually metal to non-metal), while covalent bonds form when electrons are shared between atoms (usually between non-metals).',
          timestamp: '2025-01-18T16:10:00Z'
        },
        {
          id: 2,
          author: 'Teacher',
          text: 'Think of ionic bonds like giving a gift (transferring), and covalent bonds like sharing a toy (sharing electrons).',
          timestamp: '2025-01-18T16:12:00Z'
        }
      ]
    },
    {
      id: 8,
      student: {
        name: 'Henry Taylor',
        class: '8-A',
        avatar: 'HT'
      },
      subject: 'Biology',
      question: 'How does photosynthesis work? I\'m confused about the inputs and outputs.',
      gameRelated: 'Bio Adventure',
      timestamp: '2025-01-18T13:30:00Z',
      status: 'pending',
      priority: 'medium',
      replies: []
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDoubts(mockDoubts);
      setLoading(false);
    }, 1000);
  }, []);

  const subjects = ['all', 'Algebra', 'Geometry', 'Statistics', 'Fractions', 'Arithmetic', 'Physics', 'Chemistry', 'Biology'];
  const statuses = ['all', 'pending', 'answered'];
  const priorities = ['all', 'high', 'medium', 'low'];

  // Filter and sort doubts
  const filteredAndSortedDoubts = doubts
    .filter(doubt => {
      const matchesStatus = filterStatus === 'all' || doubt.status === filterStatus;
      const matchesSubject = filterSubject === 'all' || doubt.subject === filterSubject;
      const matchesSearch = searchTerm === '' || 
        doubt.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doubt.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doubt.subject.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesStatus && matchesSubject && matchesSearch;
    })
    .sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.timestamp) - new Date(a.timestamp);
      } else {
        return new Date(a.timestamp) - new Date(b.timestamp);
      }
    });

  const pendingCount = doubts.filter(d => d.status === 'pending').length;
  const highPriorityCount = doubts.filter(d => d.priority === 'high' && d.status === 'pending').length;

  // Button handlers
  const handleReply = (doubt) => {
    setSelectedDoubt(doubt);
    setReplyText('');
    setShowReplyModal(true);
  };

  const handleSubmitReply = () => {
    if (!replyText.trim()) return;

    try {
      const newReply = {
        id: Date.now(),
        author: 'Teacher',
        text: replyText,
        timestamp: new Date().toISOString()
      };

      // Update the doubt with the new reply
      setDoubts(prev => prev.map(doubt => 
        doubt.id === selectedDoubt.id
          ? {
              ...doubt,
              status: 'answered',
              replies: [...doubt.replies, newReply]
            }
          : doubt
      ));

      setShowReplyModal(false);
      setSelectedDoubt(null);
      setReplyText('');
      
      // Show success notification (could be implemented with a toast library)
      alert('Reply sent successfully!');
    } catch (error) {
      console.error('Failed to submit reply:', error);
      alert('Failed to send reply. Please try again.');
    }
  };

  const markAsResolved = (doubtId) => {
    setDoubts(prev => prev.map(doubt => 
      doubt.id === doubtId
        ? { ...doubt, status: 'answered' }
        : doubt
    ));
    
    // Show success notification
    alert('Question marked as resolved!');
  };

  const resetFilters = () => {
    setFilterStatus('all');
    setFilterSubject('all');
    setSearchTerm('');
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest');
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ec4899'; // pink-600
      case 'medium': return '#a855f7'; // purple-600
      case 'low': return '#6366f1'; // indigo-600
      default: return '#4b5563'; // gray-600
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 via-pink-100 to-white bg-[length:200%_200%]" style={{ animation: 'auroraFlow 15s ease infinite' }}></div>
        <div className="relative z-10 flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-gray-200 border-t-indigo-500 rounded-full animate-spin"></div>
            <p className="text-gray-800">Loading student doubts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Aurora background */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 via-pink-100 to-white bg-[length:200%_200%]" style={{ animation: 'auroraFlow 15s ease infinite' }}></div>
      
      <motion.div
        className="relative z-10 p-6 tab-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="welcome-header mb-8">
          <h1 className="welcome-title text-3xl font-bold text-gray-900 flex items-center gap-3">
            <span className="text-4xl">💬</span>
            Student Posts & Questions
          </h1>
          <p className="welcome-subtitle text-gray-700">
            Manage and respond to student questions
          </p>
        </motion.div>

        {/* Stats and Filters */}
        <motion.div variants={itemVariants} className="flex flex-wrap justify-between items-center mb-6">
          <div className="flex gap-4 mb-4 md:mb-0">
            <div className="bg-white/30 backdrop-blur-lg rounded-xl p-4 shadow-lg flex flex-col items-center min-w-[100px] transition hover:scale-105 duration-300" style={{ animation: 'float 4s ease-in-out infinite' }}>
              <span className="text-2xl font-bold text-indigo-600">{pendingCount}</span>
              <span className="text-xs font-medium uppercase text-gray-700">Pending</span>
            </div>
            
            {highPriorityCount > 0 && (
              <div className="bg-white/30 backdrop-blur-lg rounded-xl p-4 shadow-lg flex flex-col items-center min-w-[100px] transition hover:scale-105 duration-300" style={{ animation: 'float 4s ease-in-out infinite 0.5s' }}>
                <span className="text-2xl font-bold text-pink-600">{highPriorityCount}</span>
                <span className="text-xs font-medium uppercase text-gray-700">High Priority</span>
              </div>
            )}

            <div className="bg-white/30 backdrop-blur-lg rounded-xl p-4 shadow-lg flex flex-col items-center min-w-[100px] transition hover:scale-105 duration-300" style={{ animation: 'float 4s ease-in-out infinite 1s' }}>
              <span className="text-2xl font-bold text-purple-600">{doubts.length}</span>
              <span className="text-xs font-medium uppercase text-gray-700">Total Questions</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search doubts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-600"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </span>
              {searchTerm && (
                <button 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={clearSearch}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
            >
              {subjects.map(subject => (
                <option key={subject} value={subject}>
                  {subject === 'all' ? 'All Subjects' : subject}
                </option>
              ))}
            </select>
            
            <button
              onClick={toggleSortOrder}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white/50 backdrop-blur-sm text-gray-800 hover:bg-white/70 transition-colors flex items-center gap-2"
            >
              <span>{sortOrder === 'newest' ? 'Newest' : 'Oldest'}</span>
              <span>{sortOrder === 'newest' ? '↓' : '↑'}</span>
            </button>

            {(filterStatus !== 'all' || filterSubject !== 'all' || searchTerm !== '') && (
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-gray-200/70 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-300/70 transition-colors"
              >
                Reset Filters
              </button>
            )}
          </div>
        </motion.div>

        {/* Doubts List */}
        <motion.div variants={itemVariants} className="space-y-6">
          <AnimatePresence>
            {filteredAndSortedDoubts.length === 0 ? (
              <motion.div 
                className="bg-white/30 backdrop-blur-lg rounded-xl p-10 text-center shadow-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="text-4xl mb-4">❓</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No doubts found</h3>
                <p className="text-gray-700">No student questions match your current filters.</p>
                {(filterStatus !== 'all' || filterSubject !== 'all' || searchTerm !== '') && (
                  <button
                    onClick={resetFilters}
                    className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600 transition-colors"
                  >
                    Reset Filters
                  </button>
                )}
              </motion.div>
            ) : (
              filteredAndSortedDoubts.map((doubt, index) => (
                <motion.div
                  key={doubt.id}
                  className={`bg-white/30 backdrop-blur-lg rounded-xl p-6 shadow-lg transition transform hover:scale-102 hover:shadow-xl duration-300 ${doubt.status === 'pending' ? 'border-l-4 border-indigo-500' : 'border-l-4 border-purple-500'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  style={{ animation: `float 4s ease-in-out infinite ${index * 0.2}s` }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium">
                        {doubt.student.avatar}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{doubt.student.name}</h4>
                        <span className="text-sm text-gray-700">{doubt.student.class}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-700">{getTimeAgo(doubt.timestamp)}</span>
                      <span 
                        className="text-xs font-semibold px-3 py-1 rounded-full"
                        style={{ 
                          backgroundColor: `${getPriorityColor(doubt.priority)}20`,
                          color: getPriorityColor(doubt.priority)
                        }}
                      >
                        {doubt.priority.toUpperCase()}
                      </span>
                      <span className={`text-xl ${doubt.status === 'pending' ? 'text-indigo-500' : 'text-purple-500'}`}>
                        {doubt.status === 'pending' ? '⏳' : '✅'}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="inline-flex items-center gap-2 bg-indigo-100/70 text-indigo-700 px-3 py-1 rounded-full text-sm mb-3">
                      <span>📚</span>
                      {doubt.subject}
                      {doubt.gameRelated && (
                        <span className="ml-2 bg-purple-100/70 text-purple-700 px-2 py-0.5 rounded-full text-xs">
                          🎮 {doubt.gameRelated}
                        </span>
                      )}
                    </div>

                    <div className="bg-white/50 backdrop-blur-sm p-4 rounded-lg">
                      <p className="text-gray-900">{doubt.question}</p>
                    </div>

                    {doubt.replies.length > 0 && (
                      <div className="mt-4 space-y-3">
                        <h5 className="text-sm font-medium text-gray-800">Replies:</h5>
                        {doubt.replies.map((reply) => (
                          <div key={reply.id} className="bg-purple-50/80 backdrop-blur-sm p-4 rounded-lg border-l-2 border-purple-500">
                            <div className="flex justify-between mb-1">
                              <strong className="text-gray-900">{reply.author}</strong>
                              <span className="text-xs text-gray-600">{getTimeAgo(reply.timestamp)}</span>
                            </div>
                            <p className="text-gray-800">{reply.text}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-3">
                    {doubt.status === 'pending' ? (
                      <>
                        <button
                          className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-shadow"
                          onClick={() => handleReply(doubt)}
                        >
                          Reply
                        </button>
                        <button
                          className="px-4 py-2 bg-white/50 backdrop-blur-sm text-gray-800 rounded-lg text-sm font-medium hover:bg-white/70 transition-colors"
                          onClick={() => markAsResolved(doubt.id)}
                        >
                          Mark Resolved
                        </button>
                      </>
                    ) : (
                      <button
                        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-shadow"
                        onClick={() => handleReply(doubt)}
                      >
                        Add Reply
                      </button>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>

        {/* Use our custom FixedModal instead of the imported Modal */}
        <FixedModal
          isOpen={showReplyModal}
          onClose={() => setShowReplyModal(false)}
          title={`Reply to ${selectedDoubt?.student.name}`}
          size="large"
          footer={
            <div className="flex justify-end gap-4">
              <button
                type="button"
                className="px-4 py-2 bg-white/50 backdrop-blur-sm text-gray-800 rounded-lg text-sm font-medium hover:bg-white/70 transition-colors"
                onClick={() => setShowReplyModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg text-sm font-medium transition-shadow ${replyText.trim() ? 'hover:shadow-lg' : 'opacity-50 cursor-not-allowed'}`}
                onClick={handleSubmitReply}
                disabled={!replyText.trim()}
              >
                Send Reply
              </button>
            </div>
          }
        >
          {selectedDoubt && (
            <div className="space-y-6">
              <div>
                <h4 className="text-gray-800 font-medium mb-3">Original Question:</h4>
                <div className="bg-white/50 backdrop-blur-sm p-4 rounded-lg mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-block px-3 py-1 bg-indigo-100/70 text-indigo-700 rounded-full text-sm">
                      {selectedDoubt.subject}
                    </span>
                    {selectedDoubt.gameRelated && (
                      <span className="inline-block px-3 py-1 bg-purple-100/70 text-purple-700 rounded-full text-xs">
                        🎮 {selectedDoubt.gameRelated}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-900">{selectedDoubt.question}</p>
                </div>
              </div>

              <div>
                <label className="block text-gray-800 font-medium mb-2">
                  Your Reply:
                </label>
                <textarea
                  placeholder="Type your reply here..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full min-h-[150px] p-4 border border-gray-300 rounded-lg bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-600"
                  rows={5}
                  required
                />
                
                <div className="mt-4 bg-indigo-50/70 backdrop-blur-sm p-4 rounded-lg border border-indigo-100">
                  <h5 className="flex items-center gap-2 text-indigo-700 font-medium mb-2">
                    <span>💡</span> Tips for effective replies:
                  </h5>
                  <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                    <li>Provide step-by-step explanations</li>
                    <li>Use examples when possible</li>
                    <li>Reference the specific game if applicable</li>
                    <li>Encourage the student to ask follow-up questions</li>
                    <li>Keep explanations simple and clear</li>
                  </ul>
                </div>

                {/* Quick Template Buttons */}
                <div className="mt-4">
                  <h5 className="text-gray-800 font-medium mb-2">Quick Templates:</h5>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setReplyText(
                        `Hi ${selectedDoubt?.student.name},\n\nGreat question! Here's a step-by-step explanation:\n\n1. \n2. \n3. \n\nDoes this help? Let me know if you have any follow-up questions!`
                      )}
                      className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-sm hover:bg-indigo-200 transition-colors"
                    >
                      Step-by-Step Template
                    </button>
                    <button
                      onClick={() => setReplyText(
                        `Hi ${selectedDoubt?.student.name},\n\nThink of it this way: \n\n[Provide analogy here]\n\nDoes that make sense?`
                      )}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm hover:bg-purple-200 transition-colors"
                    >
                      Analogy Template
                    </button>
                    <button
                      onClick={() => setReplyText(
                        `Hi ${selectedDoubt?.student.name},\n\nIn the ${selectedDoubt?.gameRelated} game, this concept is used when [explain connection].\n\nIn real life, this works like: [example]\n\nHope this helps!`
                      )}
                      className="px-3 py-1 bg-pink-100 text-pink-700 rounded-lg text-sm hover:bg-pink-200 transition-colors"
                    >
                      Game Connection
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </FixedModal>
      </motion.div>
    </div>
  );
};

export default PostsManagement;