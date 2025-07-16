// Assignments.jsx - Fixed version with working modals
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DataTable from '../common/DataTable';
import InputField from '../forms/InputField';

// Create a custom FixedModal component instead of using the imported Modal
const FixedModal = ({ isOpen, onClose, title, children, actions, size = 'large' }) => {
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
    maxWidth: size === 'large' ? '900px' : size === 'medium' ? '600px' : '400px',
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
        {actions && (
          <div className="p-6 bg-gray-50/90 backdrop-blur-lg rounded-b-xl border-t border-gray-200 flex justify-end gap-4">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

const Assignments = () => {
  // State management
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    class: '',
    dueDate: '',
    points: '',
    type: 'quiz',
    status: 'draft'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data
  const mockAssignments = [
    {
      id: 1,
      title: 'Algebra Fundamentals Quiz',
      description: 'A quiz covering basic algebraic concepts including equations, inequalities, and graphing.',
      subject: 'Mathematics',
      class: '10-A',
      dueDate: '2025-06-10',
      assignedDate: '2025-05-25',
      points: 50,
      type: 'quiz',
      status: 'published',
      submissions: 18,
      avgScore: 85.6,
      completionRate: 72
    },
    {
      id: 2,
      title: 'Newton\'s Laws of Motion',
      description: 'Interactive exercise applying Newton\'s three laws of motion to real-world scenarios.',
      subject: 'Physics',
      class: '10-B',
      dueDate: '2025-06-12',
      assignedDate: '2025-05-26',
      points: 75,
      type: 'interactive',
      status: 'published',
      submissions: 14,
      avgScore: 78.2,
      completionRate: 64
    },
    {
      id: 3,
      title: 'Literary Analysis: Shakespeare',
      description: 'Write a critical analysis of themes in one of Shakespeare\'s plays.',
      subject: 'English',
      class: '9-A',
      dueDate: '2025-06-15',
      assignedDate: '2025-05-20',
      points: 100,
      type: 'essay',
      status: 'published',
      submissions: 22,
      avgScore: 82.4,
      completionRate: 81
    },
    {
      id: 4,
      title: 'Introduction to Python',
      description: 'Basic programming concepts in Python including variables, loops, and functions.',
      subject: 'Computer Science',
      class: '9-B',
      dueDate: '2025-06-20',
      assignedDate: '2025-05-28',
      points: 80,
      type: 'project',
      status: 'draft',
      submissions: 0,
      avgScore: 0,
      completionRate: 0
    },
    {
      id: 5,
      title: 'Cell Biology Basics',
      description: 'Understanding cellular structures and functions through interactive models.',
      subject: 'Biology',
      class: '10-A',
      dueDate: '2025-06-08',
      assignedDate: '2025-05-22',
      points: 60,
      type: 'interactive',
      status: 'published',
      submissions: 26,
      avgScore: 91.7,
      completionRate: 93
    },
    {
      id: 6,
      title: 'World War II Timeline',
      description: 'Create a comprehensive timeline of major World War II events.',
      subject: 'History',
      class: '9-A',
      dueDate: '2025-06-25',
      assignedDate: '2025-05-30',
      points: 90,
      type: 'project',
      status: 'draft',
      submissions: 0,
      avgScore: 0,
      completionRate: 0
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAssignments(mockAssignments);
      setLoading(false);
    }, 800);
  }, []);

  // Filtered assignments based on selected filters
  const filteredAssignments = assignments.filter(assignment => {
    const matchesType = filterType === 'all' || assignment.type === filterType;
    const matchesStatus = filterStatus === 'all' || assignment.status === filterStatus;
    
    return matchesType && matchesStatus;
  });

  // Helper to get class size (mock data)
  const getClassSize = (className) => {
    const classSizes = {
      '10-A': 28,
      '10-B': 31,
      '9-A': 27,
      '9-B': 29,
      '8-A': 30
    };
    return classSizes[className] || 25;
  };

  const handleAdd = () => {
    setFormData({
      title: '',
      description: '',
      subject: '',
      class: '',
      dueDate: new Date().toISOString().split('T')[0],
      points: '',
      type: 'quiz',
      status: 'draft'
    });
    setErrors({});
    setShowAddModal(true);
  };

  const handleEdit = (assignment) => {
    setSelectedAssignment(assignment);
    setFormData({
      title: assignment.title,
      description: assignment.description,
      subject: assignment.subject,
      class: assignment.class,
      dueDate: assignment.dueDate,
      points: assignment.points.toString(),
      type: assignment.type,
      status: assignment.status
    });
    setErrors({});
    setShowEditModal(true);
  };

  const handleView = (assignment) => {
    setSelectedAssignment(assignment);
    setShowViewModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.class.trim()) newErrors.class = 'Class is required';
    if (!formData.dueDate.trim()) newErrors.dueDate = 'Due date is required';
    if (!formData.points.trim()) newErrors.points = 'Points are required';
    else if (isNaN(formData.points) || parseInt(formData.points) <= 0) {
      newErrors.points = 'Points must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newAssignment = {
        ...formData,
        points: parseInt(formData.points),
        assignedDate: new Date().toISOString().split('T')[0],
        submissions: 0,
        avgScore: 0,
        completionRate: 0
      };

      if (selectedAssignment) {
        // Update existing assignment
        const updatedAssignment = {
          ...selectedAssignment,
          ...newAssignment
        };
        
        setAssignments(prev => prev.map(item => 
          item.id === selectedAssignment.id ? updatedAssignment : item
        ));
        setShowEditModal(false);
      } else {
        // Add new assignment
        const newAssignmentWithId = {
          ...newAssignment,
          id: Date.now()
        };
        
        setAssignments(prev => [...prev, newAssignmentWithId]);
        setShowAddModal(false);
      }
      
      setSelectedAssignment(null);
    } catch (error) {
      setErrors({ submit: 'Failed to save assignment' });
    } finally {
      setIsSubmitting(false);
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

  // Form rendering - aligned with UI in screenshot
  const renderForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6" id="assignment-form">
      <div className="bg-white/40 backdrop-blur-lg rounded-xl p-6 shadow-lg">
        <h4 className="text-lg font-bold text-gray-900 mb-4">Assignment Details</h4>
        
        <div className="mb-4">
          <InputField
            name="title"
            label="Assignment Title"
            placeholder="Assignment Title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-800 mb-1">
            Description <span className="text-pink-600">*</span>
          </label>
          <textarea
            name="description"
            placeholder="Assignment Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 font-medium placeholder-gray-700"
            required
            rows={4}
          />
          {errors.description && <span className="text-sm text-pink-600 mt-1 font-medium">{errors.description}</span>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-1">
              Subject <span className="text-pink-600">*</span>
            </label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 font-medium"
              required
            >
              <option value="">Select Subject</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
              <option value="English">English</option>
              <option value="History">History</option>
              <option value="Geography">Geography</option>
              <option value="Computer Science">Computer Science</option>
            </select>
            {errors.subject && <span className="text-sm text-pink-600 mt-1 font-medium">{errors.subject}</span>}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-1">
              Class <span className="text-pink-600">*</span>
            </label>
            <select
              name="class"
              value={formData.class}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 font-medium"
              required
            >
              <option value="">Select Class</option>
              <option value="10-A">10-A</option>
              <option value="10-B">10-B</option>
              <option value="9-A">9-A</option>
              <option value="9-B">9-B</option>
              <option value="8-A">8-A</option>
            </select>
            {errors.class && <span className="text-sm text-pink-600 mt-1 font-medium">{errors.class}</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-1">
              Assignment Type <span className="text-pink-600">*</span>
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 font-medium"
              required
            >
              <option value="quiz">Quiz</option>
              <option value="interactive">Interactive</option>
              <option value="essay">Essay</option>
              <option value="project">Project</option>
            </select>
            {errors.type && <span className="text-sm text-pink-600 mt-1 font-medium">{errors.type}</span>}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-1">
              Points <span className="text-pink-600">*</span>
            </label>
            <input
              type="number"
              name="points"
              value={formData.points}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 font-medium"
              min="1"
              required
            />
            {errors.points && <span className="text-sm text-pink-600 mt-1 font-medium">{errors.points}</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-1">
              Due Date <span className="text-pink-600">*</span>
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 font-medium"
              required
            />
            {errors.dueDate && <span className="text-sm text-pink-600 mt-1 font-medium">{errors.dueDate}</span>}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-1">
              Status <span className="text-pink-600">*</span>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 font-medium"
              required
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            {errors.status && <span className="text-sm text-pink-600 mt-1 font-medium">{errors.status}</span>}
          </div>
        </div>
      </div>

      {errors.submit && (
        <div className="bg-pink-100 text-pink-700 p-4 rounded-lg font-medium">
          {errors.submit}
        </div>
      )}
    </form>
  );

  // Assignment details view - aligned with UI in screenshot
  const renderAssignmentDetails = () => (
    <div className="space-y-6">
      {selectedAssignment && (
        <>
          <div className="flex items-start gap-5 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl">
              {selectedAssignment.type === 'quiz' && '📝'}
              {selectedAssignment.type === 'interactive' && '🎮'}
              {selectedAssignment.type === 'essay' && '📄'}
              {selectedAssignment.type === 'project' && '🔬'}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-1">{selectedAssignment.title}</h3>
              <p className="text-gray-800 font-medium mb-2">{selectedAssignment.subject} • {selectedAssignment.class}</p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                selectedAssignment.status === 'published' ? 'bg-indigo-100 text-indigo-800' : 'bg-purple-100 text-purple-800'
              }`}>
                {selectedAssignment.status === 'published' ? 'Published' : 'Draft'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/40 backdrop-blur-lg rounded-xl p-5 shadow-lg">
              <h4 className="text-lg font-bold text-indigo-800 mb-4">Assignment Information</h4>
              
              <div className="mb-4">
                <h5 className="text-sm font-bold text-gray-800 mb-1">Description:</h5>
                <p className="text-gray-900 font-medium bg-white/60 backdrop-blur-sm p-3 rounded-lg">
                  {selectedAssignment.description}
                </p>
              </div>
              
              <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3">
                <div className="text-gray-800 font-bold">Type:</div>
                <div className="text-gray-900 font-medium capitalize">{selectedAssignment.type}</div>
                
                <div className="text-gray-800 font-bold">Points:</div>
                <div className="text-gray-900 font-medium">{selectedAssignment.points}</div>
                
                <div className="text-gray-800 font-bold">Due Date:</div>
                <div className="text-gray-900 font-medium">
                  {new Date(selectedAssignment.dueDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                
                <div className="text-gray-800 font-bold">Assigned:</div>
                <div className="text-gray-900 font-medium">
                  {new Date(selectedAssignment.assignedDate).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="bg-white/40 backdrop-blur-lg rounded-xl p-5 shadow-lg">
              <h4 className="text-lg font-bold text-indigo-800 mb-4">Performance Statistics</h4>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-800 font-bold">Submissions:</span>
                  <span className="font-bold text-gray-900">
                    {selectedAssignment.submissions} / {getClassSize(selectedAssignment.class)}
                  </span>
                </div>
                
                <div className="flex flex-col">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-800 font-bold">Completion Rate:</span>
                    <span className="font-bold text-gray-900">{selectedAssignment.completionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${selectedAssignment.completionRate}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-800 font-bold">Average Score:</span>
                  <span className={`font-bold ${
                    selectedAssignment.avgScore >= 85 ? 'text-indigo-700' : 
                    selectedAssignment.avgScore >= 70 ? 'text-purple-700' : 'text-pink-700'
                  }`}>
                    {selectedAssignment.avgScore > 0 ? `${selectedAssignment.avgScore}%` : 'N/A'}
                  </span>
                </div>
                
                {selectedAssignment.avgScore > 0 && (
                  <div className="flex flex-col">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-800 font-bold">Performance:</span>
                      <span className="text-xs text-gray-700 font-medium">
                        {selectedAssignment.avgScore >= 85 ? 'Excellent' : 
                         selectedAssignment.avgScore >= 70 ? 'Good' : 'Needs Improvement'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          selectedAssignment.avgScore >= 85 ? 'bg-gradient-to-r from-indigo-500 to-blue-500' : 
                          selectedAssignment.avgScore >= 70 ? 'bg-gradient-to-r from-purple-500 to-indigo-500' : 'bg-gradient-to-r from-pink-500 to-purple-500'
                        }`}
                        style={{ width: `${selectedAssignment.avgScore}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 via-pink-100 to-white bg-[length:200%_200%]" style={{ animation: 'auroraFlow 15s ease infinite' }}></div>
        <div className="relative z-10 flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-gray-200 border-t-indigo-500 rounded-full animate-spin"></div>
            <p className="text-gray-900 font-medium">Loading assignments...</p>
          </div>
        </div>
      </div>
    );
  }

  // Main component render - matching UI in screenshot
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Aurora background */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 via-pink-100 to-white bg-[length:200%_200%]" style={{ animation: 'auroraFlow 15s ease infinite' }}></div>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 p-6"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header - matching UI in screenshot */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Assignments</h1>
                <p className="text-gray-800 font-medium">Manage and track your classroom assignments</p>
              </div>
              <button
                onClick={handleAdd}
                className="px-6 py-3 bg-indigo-500 text-white font-bold rounded-lg hover:bg-indigo-600 transition-colors"
              >
                + New Assignment
              </button>
            </div>
          </motion.div>

          {/* Filters - matching UI in screenshot */}
          <motion.div variants={itemVariants} className="mb-6">
           <div className="bg-white/40 backdrop-blur-lg rounded-xl p-4 shadow-lg">
              <div className="flex flex-wrap gap-6">
                <div className="flex flex-col">
                  <label className="text-sm font-bold text-gray-800 mb-1">
                    Filter by Type:
                  </label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="rounded-md border border-gray-300 px-3 py-2 bg-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 font-medium min-w-[150px]"
                  >
                    <option value="all">All Types</option>
                    <option value="quiz">Quiz</option>
                    <option value="interactive">Interactive</option>
                    <option value="essay">Essay</option>
                    <option value="project">Project</option>
                  </select>
                </div>
                
                <div className="flex flex-col">
                  <label className="text-sm font-bold text-gray-800 mb-1">
                    Filter by Status:
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="rounded-md border border-gray-300 px-3 py-2 bg-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 font-medium min-w-[150px]"
                  >
                    <option value="all">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Search Box - matching UI in screenshot */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Assignments Table - matching UI in screenshot */}
          <motion.div variants={itemVariants}>
            <div className="bg-white/40 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Assignment
                      <button className="ml-1 text-indigo-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Due Date
                      <button className="ml-1 text-indigo-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Points
                      <button className="ml-1 text-indigo-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Status
                      <button className="ml-1 text-indigo-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Submissions
                      <button className="ml-1 text-indigo-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Avg Score
                      <button className="ml-1 text-indigo-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white/20 backdrop-blur-sm divide-y divide-gray-200">
                  {filteredAssignments.map((assignment) => (
                    <tr key={assignment.id} className="hover:bg-indigo-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-xl mr-3">
                            {assignment.type === 'quiz' && '📝'}
                            {assignment.type === 'interactive' && '🎮'}
                            {assignment.type === 'essay' && '📄'}
                            {assignment.type === 'project' && '🔬'}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-900">{assignment.title}</span>
                            <span className="text-xs text-gray-800 font-medium">{assignment.subject} • {assignment.class}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {(() => {
                          const date = new Date(assignment.dueDate);
                          const now = new Date();
                          const diffDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
                          
                          let statusText = diffDays > 0 ? `${diffDays} days left` : 'Overdue';
                          let statusClass = diffDays < 0 ? 'text-pink-700' : diffDays < 3 ? 'text-pink-700' : diffDays < 7 ? 'text-purple-700' : 'text-gray-800';
                          
                          return (
                            <div>
                              <div className="text-gray-900 font-medium">{assignment.dueDate}</div>
                              <div className={`text-xs font-bold ${statusClass}`}>{statusText}</div>
                            </div>
                          );
                        })()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-gray-900 font-medium">{assignment.points}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                          assignment.status === 'published' ? 'bg-indigo-100 text-indigo-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {assignment.status === 'published' ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-gray-900 font-medium">{assignment.submissions} / {getClassSize(assignment.class)}</div>
                          <div className="text-xs text-gray-800 font-medium">{assignment.completionRate}% completed</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {assignment.avgScore === 0 ? (
                          <span className="text-gray-700 font-medium">-</span>
                        ) : (
                          <span className={`font-bold ${
                            assignment.avgScore >= 85 ? 'text-indigo-700' : 
                            assignment.avgScore >= 70 ? 'text-purple-700' : 'text-pink-700'
                          }`}>
                            {assignment.avgScore}%
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            className="px-3 py-1 text-sm font-bold bg-indigo-100 text-indigo-800 rounded-md hover:bg-indigo-200 transition-colors"
                            onClick={() => handleView(assignment)}
                          >
                            View
                          </button>
                          <button
                            className="px-3 py-1 text-sm font-bold bg-purple-100 text-purple-800 rounded-md hover:bg-purple-200 transition-colors"
                            onClick={() => handleEdit(assignment)}
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        {/* Add Assignment Modal */}
        <AnimatePresence>
          {showAddModal && (
            <FixedModal
              isOpen={showAddModal}
              onClose={() => setShowAddModal(false)}
              title="Create New Assignment"
              size="large"
              actions={
                <>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 bg-white/60 backdrop-blur-sm text-gray-800 border border-gray-300 rounded-md hover:bg-white/80 transition-colors font-bold"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form="assignment-form"
                    className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors disabled:opacity-50 font-bold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating...' : 'Create Assignment'}
                  </button>
                </>
              }
            >
              {renderForm()}
            </FixedModal>
          )}
        </AnimatePresence>

        {/* Edit Assignment Modal */}
        <AnimatePresence>
          {showEditModal && (
            <FixedModal
              isOpen={showEditModal}
              onClose={() => setShowEditModal(false)}
              title="Edit Assignment"
              size="large"
              actions={
                <>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 bg-white/60 backdrop-blur-sm text-gray-800 border border-gray-300 rounded-md hover:bg-white/80 transition-colors font-bold"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form="assignment-form"
                    className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors disabled:opacity-50 font-bold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Updating...' : 'Update Assignment'}
                  </button>
                </>
              }
            >
              {renderForm()}
            </FixedModal>
          )}
        </AnimatePresence>

        {/* View Assignment Modal */}
        <AnimatePresence>
          {showViewModal && (
            <FixedModal
              isOpen={showViewModal}
              onClose={() => setShowViewModal(false)}
              title="Assignment Details"
              size="large"
              actions={
                <>
                  <button
                    type="button"
                    onClick={() => setShowViewModal(false)}
                    className="px-4 py-2 bg-white/60 backdrop-blur-sm text-gray-800 border border-gray-300 rounded-md hover:bg-white/80 transition-colors font-bold"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowViewModal(false);
                      handleEdit(selectedAssignment);
                    }}
                    className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors font-bold"
                  >
                    Edit Assignment
                  </button>
                </>
              }
            >
              {renderAssignmentDetails()}
            </FixedModal>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Assignments;