// src/components/school/ClassManagement.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../../styles/ClassManagement.css';
import '../../styles/CyberpunkClassManagement.css';
const ClassManagement = () => {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState('all');

  // Sample data
  useEffect(() => {
    const sampleClasses = [
      {
        id: 1,
        name: '10th A',
        grade: '10th',
        section: 'A',
        classTeacher: 'Sarah Johnson',
        teacherId: 1,
        studentCount: 35,
        maxCapacity: 40,
        subjects: ['Mathematics', 'Science', 'English', 'Social Studies'],
        schedule: {
          monday: ['Math', 'Science', 'English', 'History', 'PE'],
          tuesday: ['Science', 'Math', 'English', 'Geography', 'Art'],
          wednesday: ['English', 'Math', 'Science', 'History', 'Music'],
          thursday: ['Math', 'Science', 'English', 'Geography', 'PE'],
          friday: ['Science', 'Math', 'English', 'History', 'Art']
        },
        classroom: 'Room 201',
        averageScore: 85,
        attendance: 94,
        status: 'active',
        createdDate: '2024-06-01'
      },
      {
        id: 2,
        name: '9th B',
        grade: '9th',
        section: 'B',
        classTeacher: 'Michael Chen',
        teacherId: 2,
        studentCount: 32,
        maxCapacity: 40,
        subjects: ['Mathematics', 'Science', 'English', 'Social Studies'],
        schedule: {
          monday: ['Math', 'Science', 'English', 'History', 'PE'],
          tuesday: ['Science', 'Math', 'English', 'Geography', 'Art'],
          wednesday: ['English', 'Math', 'Science', 'History', 'Music'],
          thursday: ['Math', 'Science', 'English', 'Geography', 'PE'],
          friday: ['Science', 'Math', 'English', 'History', 'Art']
        },
        classroom: 'Room 105',
        averageScore: 79,
        attendance: 91,
        status: 'active',
        createdDate: '2024-06-01'
      },
      {
        id: 3,
        name: '8th A',
        grade: '8th',
        section: 'A',
        classTeacher: 'Emily Davis',
        teacherId: 3,
        studentCount: 38,
        maxCapacity: 40,
        subjects: ['Mathematics', 'Science', 'English', 'Social Studies'],
        schedule: {
          monday: ['Math', 'Science', 'English', 'History', 'PE'],
          tuesday: ['Science', 'Math', 'English', 'Geography', 'Art'],
          wednesday: ['English', 'Math', 'Science', 'History', 'Music'],
          thursday: ['Math', 'Science', 'English', 'Geography', 'PE'],
          friday: ['Science', 'Math', 'English', 'History', 'Art']
        },
        classroom: 'Room 103',
        averageScore: 82,
        attendance: 96,
        status: 'active',
        createdDate: '2024-06-01'
      },
      {
        id: 4,
        name: '11th B',
        grade: '11th',
        section: 'B',
        classTeacher: 'Robert Wilson',
        teacherId: 4,
        studentCount: 28,
        maxCapacity: 35,
        subjects: ['Mathematics', 'Physics', 'Chemistry', 'English'],
        schedule: {
          monday: ['Math', 'Physics', 'Chemistry', 'English', 'PE'],
          tuesday: ['Physics', 'Math', 'Chemistry', 'English', 'Lab'],
          wednesday: ['Chemistry', 'Math', 'Physics', 'English', 'Lab'],
          thursday: ['Math', 'Physics', 'Chemistry', 'English', 'PE'],
          friday: ['Physics', 'Math', 'Chemistry', 'English', 'Lab']
        },
        classroom: 'Room 301',
        averageScore: 88,
        attendance: 89,
        status: 'active',
        createdDate: '2024-06-01'
      }
    ];

    const sampleTeachers = [
      { id: 1, name: 'Sarah Johnson', department: 'Mathematics' },
      { id: 2, name: 'Michael Chen', department: 'Science' },
      { id: 3, name: 'Emily Davis', department: 'English' },
      { id: 4, name: 'Robert Wilson', department: 'Social Studies' },
      { id: 5, name: 'Lisa Martinez', department: 'Arts' }
    ];

    setClasses(sampleClasses);
    setTeachers(sampleTeachers);
  }, []);

  const [newClass, setNewClass] = useState({
    name: '',
    grade: '',
    section: '',
    classTeacher: '',
    teacherId: null,
    maxCapacity: 35,
    classroom: '',
    subjects: []
  });

  const grades = ['6th', '7th', '8th', '9th', '10th', '11th', '12th'];
  const sections = ['A', 'B', 'C', 'D'];
  const availableSubjects = ['Mathematics', 'Science', 'English', 'Social Studies', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Arts', 'Physical Education'];

  const filteredClasses = classes.filter(cls => {
    const matchesSearch = cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cls.classTeacher.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = filterGrade === 'all' || cls.grade === filterGrade;
    return matchesSearch && matchesGrade;
  });

  const handleAddClass = (e) => {
    e.preventDefault();
    const selectedTeacher = teachers.find(t => t.id === parseInt(newClass.teacherId));
    const classData = {
      ...newClass,
      id: Date.now(),
      classTeacher: selectedTeacher ? selectedTeacher.name : '',
      studentCount: 0,
      averageScore: 0,
      attendance: 0,
      status: 'active',
      createdDate: new Date().toISOString().split('T')[0],
      schedule: {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: []
      }
    };

    setClasses([...classes, classData]);
    setNewClass({
      name: '',
      grade: '',
      section: '',
      classTeacher: '',
      teacherId: null,
      maxCapacity: 35,
      classroom: '',
      subjects: []
    });
    setIsAddModalOpen(false);
  };

  const handleViewClass = (classItem) => {
    setSelectedClass(classItem);
    setIsViewModalOpen(true);
  };

  const handleDeleteClass = (classId) => {
    setClasses(classes.filter(c => c.id !== classId));
  };

  const getCapacityColor = (current, max) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return '#ff6b6b';
    if (percentage >= 75) return '#ffd700';
    return '#00ff88';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#00ff88';
      case 'inactive': return '#ff6b6b';
      default: return '#94a3b8';
    }
  };

  return (
    <motion.div
      className="class-management"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-title">
          <motion.span 
            className="dashboard-title-icon"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🏛️
          </motion.span>
          Class Management
        </div>
        <p className="dashboard-subtitle">
          Create, organize, and manage classes with teachers and schedules
        </p>
      </div>

      {/* Summary Cards */}
      <motion.div 
        className="class-summary"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div 
          className="summary-card"
          whileHover={{ scale: 1.02, boxShadow: '0 10px 25px rgba(0, 255, 136, 0.2)' }}
        >
          <div className="card-icon">🏛️</div>
          <div className="card-info">
            <h3>Total Classes</h3>
            <motion.div 
              className="card-value"
              animate={{ 
                textShadow: [
                  '0 0 10px rgba(0, 168, 255, 0)',
                  '0 0 20px rgba(0, 168, 255, 0.5)',
                  '0 0 10px rgba(0, 168, 255, 0)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            >
              {classes.reduce((acc, c) => acc + c.studentCount, 0)}
            </motion.div>
          </div>
        </motion.div>

        <motion.div 
          className="summary-card"
          whileHover={{ scale: 1.02, boxShadow: '0 10px 25px rgba(140, 122, 230, 0.2)' }}
        >
          <div className="card-icon">📊</div>
          <div className="card-info">
            <h3>Average Performance</h3>
            <motion.div 
              className="card-value"
              animate={{ 
                textShadow: [
                  '0 0 10px rgba(140, 122, 230, 0)',
                  '0 0 20px rgba(140, 122, 230, 0.5)',
                  '0 0 10px rgba(140, 122, 230, 0)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            >
              {Math.round(classes.reduce((acc, c) => acc + c.averageScore, 0) / classes.length) || 0}%
            </motion.div>
          </div>
        </motion.div>

        <motion.div 
          className="summary-card"
          whileHover={{ scale: 1.02, boxShadow: '0 10px 25px rgba(255, 107, 157, 0.2)' }}
        >
          <div className="card-icon">📅</div>
          <div className="card-info">
            <h3>Average Attendance</h3>
            <motion.div 
              className="card-value"
              animate={{ 
                textShadow: [
                  '0 0 10px rgba(255, 107, 157, 0)',
                  '0 0 20px rgba(255, 107, 157, 0.5)',
                  '0 0 10px rgba(255, 107, 157, 0)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
            >
              {Math.round(classes.reduce((acc, c) => acc + c.attendance, 0) / classes.length) || 0}%
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Controls */}
      <motion.div 
        className="controls-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="search-filters">
          <div className="search-box">
            <motion.input
              type="text"
              placeholder="Search classes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              whileFocus={{ scale: 1.02, boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)' }}
            />
            <span className="search-icon">🔍</span>
          </div>
          
          <select 
            value={filterGrade} 
            onChange={(e) => setFilterGrade(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Grades</option>
            {grades.map(grade => (
              <option key={grade} value={grade}>{grade}</option>
            ))}
          </select>
        </div>

        <motion.button
          className="btn-neon btn-primary"
          onClick={() => setIsAddModalOpen(true)}
          whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(0, 255, 136, 0.5)' }}
          whileTap={{ scale: 0.95 }}
        >
          <span>➕</span>
          Add Class
        </motion.button>
      </motion.div>

      {/* Classes Grid */}
      <motion.div 
        className="classes-grid"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
          }
        }}
        initial="hidden"
        animate="visible"
      >
        {filteredClasses.map((classItem, index) => (
          <motion.div
            key={classItem.id}
            className="class-card"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            whileHover={{ 
              scale: 1.02, 
              y: -10,
              boxShadow: '0 15px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 255, 136, 0.2)'
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleViewClass(classItem)}
          >
            <div className="class-header">
              <div className="class-title">
                <motion.h3
                  animate={{ 
                    textShadow: [
                      '0 0 5px rgba(0, 255, 136, 0.2)',
                      '0 0 10px rgba(0, 255, 136, 0.4)',
                      '0 0 5px rgba(0, 255, 136, 0.2)'
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: index * 0.2 }}
                >
                  {classItem.name}
                </motion.h3>
                <p className="class-teacher">👨‍🏫 {classItem.classTeacher}</p>
              </div>
              <div 
                className="class-status"
                style={{ color: getStatusColor(classItem.status) }}
              >
                ● {classItem.status.toUpperCase()}
              </div>
            </div>

            <div className="class-info">
              <div className="info-item">
                <span className="info-label">📍 Room:</span>
                <span className="info-value">{classItem.classroom}</span>
              </div>
              <div className="info-item">
                <span className="info-label">📚 Subjects:</span>
                <span className="info-value">{classItem.subjects.length}</span>
              </div>
            </div>

            <div className="class-stats">
              <div className="stat-item">
                <span className="stat-label">Students</span>
                <div className="capacity-info">
                  <span 
                    className="stat-value"
                    style={{ color: getCapacityColor(classItem.studentCount, classItem.maxCapacity) }}
                  >
                    {classItem.studentCount}/{classItem.maxCapacity}
                  </span>
                  <div className="capacity-bar">
                    <motion.div 
                      className="capacity-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${(classItem.studentCount / classItem.maxCapacity) * 100}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      style={{ 
                        backgroundColor: getCapacityColor(classItem.studentCount, classItem.maxCapacity)
                      }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="stat-item">
                <span className="stat-label">Avg Score</span>
                <motion.span 
                  className="stat-value"
                  animate={{ 
                    textShadow: [
                      '0 0 5px rgba(0, 255, 136, 0)',
                      '0 0 10px rgba(0, 255, 136, 0.4)',
                      '0 0 5px rgba(0, 255, 136, 0)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                >
                  {classItem.averageScore}%
                </motion.span>
              </div>
              
              <div className="stat-item">
                <span className="stat-label">Attendance</span>
                <span className="stat-value">{classItem.attendance}%</span>
              </div>
            </div>

            <div className="class-subjects">
              <span className="subjects-label">Subjects:</span>
              <div className="subjects-list">
                {classItem.subjects.slice(0, 3).map((subject, idx) => (
                  <span key={idx} className="subject-tag">{subject}</span>
                ))}
                {classItem.subjects.length > 3 && (
                  <span className="subject-tag">+{classItem.subjects.length - 3}</span>
                )}
              </div>
            </div>

            <div className="class-actions">
              <motion.button
                className="action-btn edit-btn"
                whileHover={{ scale: 1.1, boxShadow: '0 0 15px rgba(0, 168, 255, 0.4)' }}
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle edit
                }}
              >
                ✏️
              </motion.button>
              <motion.button
                className="action-btn schedule-btn"
                whileHover={{ scale: 1.1, boxShadow: '0 0 15px rgba(140, 122, 230, 0.4)' }}
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle schedule
                }}
              >
                📅
              </motion.button>
              <motion.button
                className="action-btn delete-btn"
                whileHover={{ scale: 1.1, boxShadow: '0 0 15px rgba(255, 99, 132, 0.4)' }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClass(classItem.id);
                }}
              >
                🗑️
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Add Class Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsAddModalOpen(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>Add New Class</h2>
                <button 
                  className="close-btn"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddClass} className="class-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Grade</label>
                    <select
                      value={newClass.grade}
                      onChange={(e) => setNewClass({...newClass, grade: e.target.value})}
                      required
                      className="form-select"
                    >
                      <option value="">Select Grade</option>
                      {grades.map(grade => (
                        <option key={grade} value={grade}>{grade}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Section</label>
                    <select
                      value={newClass.section}
                      onChange={(e) => {
                        const section = e.target.value;
                        setNewClass({
                          ...newClass, 
                          section,
                          name: newClass.grade ? `${newClass.grade} ${section}` : section
                        });
                      }}
                      required
                      className="form-select"
                    >
                      <option value="">Select Section</option>
                      {sections.map(section => (
                        <option key={section} value={section}>{section}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Class Teacher</label>
                    <select
                      value={newClass.teacherId || ''}
                      onChange={(e) => {
                        const teacherId = parseInt(e.target.value);
                        const teacher = teachers.find(t => t.id === teacherId);
                        setNewClass({
                          ...newClass,
                          teacherId,
                          classTeacher: teacher ? teacher.name : ''
                        });
                      }}
                      required
                      className="form-select"
                    >
                      <option value="">Select Teacher</option>
                      {teachers.map(teacher => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.name} - {teacher.department}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Classroom</label>
                    <input
                      type="text"
                      value={newClass.classroom}
                      onChange={(e) => setNewClass({...newClass, classroom: e.target.value})}
                      placeholder="e.g., Room 201"
                      required
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Max Capacity</label>
                    <input
                      type="number"
                      value={newClass.maxCapacity}
                      onChange={(e) => setNewClass({...newClass, maxCapacity: parseInt(e.target.value)})}
                      min="20"
                      max="50"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Subjects</label>
                  <div className="subjects-selection">
                    {availableSubjects.map(subject => (
                      <label key={subject} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={newClass.subjects.includes(subject)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewClass({
                                ...newClass,
                                subjects: [...newClass.subjects, subject]
                              });
                            } else {
                              setNewClass({
                                ...newClass,
                                subjects: newClass.subjects.filter(s => s !== subject)
                              });
                            }
                          }}
                        />
                        <span>{subject}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setIsAddModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    className="btn-neon btn-primary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Add Class
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Class Modal */}
      <AnimatePresence>
        {isViewModalOpen && selectedClass && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsViewModalOpen(false)}
          >
            <motion.div
              className="modal-content large"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>Class Details - {selectedClass.name}</h2>
                <button 
                  className="close-btn"
                  onClick={() => setIsViewModalOpen(false)}
                >
                  ✕
                </button>
              </div>

              <div className="class-details">
                <div className="class-overview">
                  <div className="overview-item">
                    <label>Class Teacher</label>
                    <span>👨‍🏫 {selectedClass.classTeacher}</span>
                  </div>
                  <div className="overview-item">
                    <label>Classroom</label>
                    <span>📍 {selectedClass.classroom}</span>
                  </div>
                  <div className="overview-item">
                    <label>Capacity</label>
                    <span>👥 {selectedClass.studentCount}/{selectedClass.maxCapacity}</span>
                  </div>
                  <div className="overview-item">
                    <label>Average Score</label>
                    <span>📊 {selectedClass.averageScore}%</span>
                  </div>
                  <div className="overview-item">
                    <label>Attendance</label>
                    <span>📅 {selectedClass.attendance}%</span>
                  </div>
                  <div className="overview-item">
                    <label>Created</label>
                    <span>📆 {new Date(selectedClass.createdDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="subjects-section">
                  <h4>Subjects</h4>
                  <div className="subjects-grid">
                    {selectedClass.subjects.map((subject, idx) => (
                      <span key={idx} className="subject-badge">{subject}</span>
                    ))}
                  </div>
                </div>

                <div className="schedule-section">
                  <h4>Weekly Schedule</h4>
                  <div className="schedule-table">
                    {Object.entries(selectedClass.schedule).map(([day, periods]) => (
                      <div key={day} className="schedule-day">
                        <div className="day-header">
                          {day.charAt(0).toUpperCase() + day.slice(1)}
                        </div>
                        <div className="day-periods">
                          {periods.length > 0 ? (
                            periods.map((period, idx) => (
                              <span key={idx} className="period-item">{period}</span>
                            ))
                          ) : (
                            <span className="no-periods">No periods assigned</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ClassManagement;