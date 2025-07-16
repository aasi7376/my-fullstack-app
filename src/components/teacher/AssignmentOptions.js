import React, { useState, useEffect } from 'react';

// This is a placeholder component for the AssignmentOptions functionality
// You'll need to implement the actual functionality based on your application's requirements

const AssignmentOptions = () => {
  const [assignments, setAssignments] = useState([]);
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showNewAssignmentModal, setShowNewAssignmentModal] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    subject: '',
    class: '',
    dueDate: '',
    points: 10
  });

  // Sample data - replace with actual API calls
  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      setAssignments([
        { 
          id: 1, 
          title: 'Algebra Quiz', 
          description: 'Practice equations and functions', 
          subject: 'Mathematics', 
          class: '10A', 
          dueDate: '2025-07-15', 
          status: 'active',
          submissions: 18,
          totalStudents: 25,
          averageScore: 82
        },
        { 
          id: 2, 
          title: 'Photosynthesis Lab Report', 
          description: 'Write a report on the photosynthesis experiment', 
          subject: 'Science', 
          class: '10A', 
          dueDate: '2025-07-20', 
          status: 'active',
          submissions: 12,
          totalStudents: 25,
          averageScore: 78
        },
        { 
          id: 3, 
          title: 'Literature Analysis', 
          description: 'Analyze the main themes in the assigned reading', 
          subject: 'English', 
          class: '10B', 
          dueDate: '2025-07-18', 
          status: 'active',
          submissions: 20,
          totalStudents: 22,
          averageScore: 85
        },
        { 
          id: 4, 
          title: 'Geometry Test', 
          description: 'Test on triangles and circles', 
          subject: 'Mathematics', 
          class: '11A', 
          dueDate: '2025-07-25', 
          status: 'upcoming',
          submissions: 0,
          totalStudents: 24,
          averageScore: null
        },
        { 
          id: 5, 
          title: 'Cell Biology Quiz', 
          description: 'Quiz on cell structure and function', 
          subject: 'Science', 
          class: '11B', 
          dueDate: '2025-07-12', 
          status: 'completed',
          submissions: 23,
          totalStudents: 23,
          averageScore: 90
        },
        { 
          id: 6, 
          title: 'Essay on Historical Events', 
          description: 'Write an essay on a significant historical event', 
          subject: 'History', 
          class: '10B', 
          dueDate: '2025-07-30', 
          status: 'upcoming',
          submissions: 0,
          totalStudents: 22,
          averageScore: null
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const classes = ['all', '10A', '10B', '11A', '11B'];
  const subjects = ['all', 'Mathematics', 'Science', 'English', 'History', 'Geography'];

  // Filter assignments based on selected class and subject
  const filteredAssignments = assignments.filter(assignment => {
    if (selectedClass !== 'all' && assignment.class !== selectedClass) return false;
    if (selectedSubject !== 'all' && assignment.subject !== selectedSubject) return false;
    return true;
  });

  const handleCreateAssignment = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to create the assignment
    
    // For demo purposes, just add it to the local state
    const newId = Math.max(...assignments.map(a => a.id)) + 1;
    const createdAssignment = {
      ...newAssignment,
      id: newId,
      status: 'upcoming',
      submissions: 0,
      totalStudents: 25, // Placeholder
      averageScore: null
    };
    
    setAssignments([...assignments, createdAssignment]);
    setShowNewAssignmentModal(false);
    setNewAssignment({
      title: '',
      description: '',
      subject: '',
      class: '',
      dueDate: '',
      points: 10
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAssignment({
      ...newAssignment,
      [name]: value
    });
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-300 border border-green-500/30';
      case 'upcoming':
        return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
      case 'completed':
        return 'bg-purple-500/20 text-purple-300 border border-purple-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border border-gray-500/30';
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-8 border border-white/30 shadow-lg">
        <h1 className="text-3xl font-bold mb-2 text-white">
          Assignment Options
        </h1>
        <p className="text-white/80">
          Create, manage, and track student assignments across different classes
        </p>
      </div>

      {/* Action Buttons & Filters */}
      <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
        <div className="flex flex-wrap gap-4">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/30">
            <label className="block text-white/80 mb-2">Class</label>
            <select 
              value={selectedClass} 
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-white/10 text-white border border-white/30 rounded-lg p-2 w-40"
            >
              {classes.map(cls => (
                <option key={cls} value={cls} className="bg-gray-800">
                  {cls === 'all' ? 'All Classes' : cls}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/30">
            <label className="block text-white/80 mb-2">Subject</label>
            <select 
              value={selectedSubject} 
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-white/10 text-white border border-white/30 rounded-lg p-2 w-40"
            >
              {subjects.map(subject => (
                <option key={subject} value={subject} className="bg-gray-800">
                  {subject === 'all' ? 'All Subjects' : subject}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button 
          onClick={() => setShowNewAssignmentModal(true)}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl px-6 py-3 
                    flex items-center gap-2 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
        >
          <span>Create New Assignment</span>
          <span className="text-xl">+</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/30 shadow-lg">
          <div className="text-white/70 mb-1">Total Assignments</div>
          <div className="text-3xl font-bold text-white">
            {loading ? 'Loading...' : filteredAssignments.length}
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/30 shadow-lg">
          <div className="text-white/70 mb-1">Active Assignments</div>
          <div className="text-3xl font-bold text-white">
            {loading ? 'Loading...' : filteredAssignments.filter(a => a.status === 'active').length}
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/30 shadow-lg">
          <div className="text-white/70 mb-1">Average Completion</div>
          <div className="text-3xl font-bold text-white">
            {loading ? 'Loading...' : 
              `${Math.round(filteredAssignments.reduce((sum, a) => sum + (a.submissions / (a.totalStudents || 1) * 100), 0) / filteredAssignments.length)}%`}
          </div>
        </div>
      </div>

      {/* Assignments Table */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-white">Current Assignments</h2>
        
        {loading ? (
          <div className="text-center p-8">
            <div className="inline-block w-8 h-8 border-4 border-white/30 border-t-white/80 rounded-full animate-spin"></div>
            <p className="mt-4 text-white/70">Loading assignments...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="py-3 px-4 text-left text-white/80">Title</th>
                  <th className="py-3 px-4 text-left text-white/80">Subject</th>
                  <th className="py-3 px-4 text-left text-white/80">Class</th>
                  <th className="py-3 px-4 text-left text-white/80">Due Date</th>
                  <th className="py-3 px-4 text-left text-white/80">Status</th>
                  <th className="py-3 px-4 text-left text-white/80">Submissions</th>
                  <th className="py-3 px-4 text-left text-white/80">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssignments.map(assignment => (
                 <tr key={assignment.id} className="border-b border-white/10 hover:bg-white/5">
                    <td className="py-3 px-4 text-white font-medium">{assignment.title}</td>
                    <td className="py-3 px-4 text-white">{assignment.subject}</td>
                    <td className="py-3 px-4 text-white">{assignment.class}</td>
                    <td className="py-3 px-4 text-white">
                      {new Date(assignment.dueDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusBadgeStyle(assignment.status)}`}>
                        {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white">
                      {assignment.submissions}/{assignment.totalStudents} 
                      <span className="text-white/60 ml-1">
                        ({Math.round(assignment.submissions / assignment.totalStudents * 100)}%)
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button className="bg-white/10 hover:bg-white/20 text-white rounded px-3 py-1 text-sm transition-colors duration-300">
                          Edit
                        </button>
                        <button className="bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded px-3 py-1 text-sm transition-colors duration-300">
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create New Assignment Modal */}
      {showNewAssignmentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-b from-indigo-900/90 to-purple-900/90 rounded-2xl p-8 w-full max-w-2xl border border-white/20 shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 text-white">Create New Assignment</h3>
            
            <form onSubmit={handleCreateAssignment}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-white/80 mb-2">Title</label>
                  <input 
                    type="text" 
                    name="title"
                    value={newAssignment.title}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/10 border border-white/30 rounded-lg p-3 text-white"
                    placeholder="Assignment title"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 mb-2">Subject</label>
                  <select 
                    name="subject"
                    value={newAssignment.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/10 border border-white/30 rounded-lg p-3 text-white"
                  >
                    <option value="" className="bg-gray-800">Select Subject</option>
                    {subjects.filter(s => s !== 'all').map(subject => (
                      <option key={subject} value={subject} className="bg-gray-800">
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-white/80 mb-2">Class</label>
                  <select 
                    name="class"
                    value={newAssignment.class}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/10 border border-white/30 rounded-lg p-3 text-white"
                  >
                    <option value="" className="bg-gray-800">Select Class</option>
                    {classes.filter(c => c !== 'all').map(cls => (
                      <option key={cls} value={cls} className="bg-gray-800">
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-white/80 mb-2">Due Date</label>
                  <input 
                    type="date" 
                    name="dueDate"
                    value={newAssignment.dueDate}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/10 border border-white/30 rounded-lg p-3 text-white"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-white/80 mb-2">Description</label>
                  <textarea 
                    name="description"
                    value={newAssignment.description}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/10 border border-white/30 rounded-lg p-3 text-white h-32 resize-none"
                    placeholder="Assignment description and instructions"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 mb-2">Points</label>
                  <input 
                    type="number" 
                    name="points"
                    value={newAssignment.points}
                    onChange={handleInputChange}
                    required
                    min="1"
                    max="100"
                    className="w-full bg-white/10 border border-white/30 rounded-lg p-3 text-white"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-4">
                <button 
                  type="button"
                  onClick={() => setShowNewAssignmentModal(false)}
                  className="px-6 py-3 rounded-lg border border-white/30 text-white hover:bg-white/10 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white 
                           hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
                >
                  Create Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentOptions;