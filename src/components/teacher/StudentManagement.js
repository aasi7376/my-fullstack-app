import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';  // Import the API service

const StudentManagement = () => {
  // State for student registration form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    grade: '',
    section: '',
    rollNumber: '',
    parentEmail: '',
    parentPhone: ''
  });
  
  // State for list of students
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Fetch existing students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);
  
  // Function to fetch students from the Stud collection
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Check if user is logged in
      if (!api.isAuthenticated()) {
        setError('You must be logged in to view students');
        setLoading(false);
        return;
      }
      
      // Use the API service to fetch students
      const response = await api.getAllStuds();
      
      // Log the response for debugging
      console.log('Students API response:', response);
      
      setStudents(Array.isArray(response) ? response : []);
      setLoading(false);
    } catch (err) {
      setError('Error fetching students: ' + api.handleError(err));
      console.error('Error fetching students:', err);
      setLoading(false);
    }
  };
  
  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      
      // Use the API service to register a student
      const response = await api.registerStud(formData);
      
      if (response.success) {
        toast.success('Student registered successfully!');
        // Reset form
        setFormData({
          name: '',
          email: '',
          grade: '',
          section: '',
          rollNumber: '',
          parentEmail: '',
          parentPhone: ''
        });
        // Refresh student list
        fetchStudents();
      } else {
        throw new Error(response.message || 'Failed to register student');
      }
      
      setLoading(false);
    } catch (err) {
      setError('Error registering student: ' + api.handleError(err));
      toast.error('Failed to register student');
      console.error('Error registering student:', err);
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-8 border border-white/30 shadow-lg">
        <h1 className="text-3xl font-bold mb-2 text-white">Student Registration</h1>
        <p className="text-white/80">Register new students to your classes</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Registration Form */}
        <div className="lg:col-span-1">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-lg h-full">
            <h2 className="text-xl font-bold mb-4 text-white">Add New Student</h2>
            
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-white p-3 rounded-lg mb-4">
                <div className="font-bold">Error:</div>
                <div>{error}</div>
                {api.getBaseURL && (
                  <div className="text-sm mt-2">
                    Make sure your backend server is running at {api.getBaseURL ? api.getBaseURL() : 'http://localhost:5000/api'}
                  </div>
                )}
                <button
                  onClick={() => fetchStudents()}
                  className="mt-2 px-3 py-1 bg-blue-500/30 text-white rounded hover:bg-blue-500/50"
                >
                  Retry
                </button>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 mb-2 text-sm">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
                    placeholder="Enter student's full name"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 mb-2 text-sm">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
                    placeholder="Enter student's email"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 mb-2 text-sm">Grade</label>
                    <select
                      name="grade"
                      value={formData.grade}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
                    >
                      <option value="">Select Grade</option>
                      {[...Array(12)].map((_, i) => (
                        <option key={i} value={i + 1}>
                          Grade {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-white/80 mb-2 text-sm">Section</label>
                    <select
                      name="section"
                      value={formData.section}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
                    >
                      <option value="">Select Section</option>
                      {['A', 'B', 'C', 'D', 'E'].map(section => (
                        <option key={section} value={section}>
                          Section {section}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-white/80 mb-2 text-sm">Roll Number</label>
                  <input
                    type="text"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
                    placeholder="Enter roll number"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 mb-2 text-sm">Parent Email</label>
                  <input
                    type="email"
                    name="parentEmail"
                    value={formData.parentEmail}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
                    placeholder="Enter parent's email"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 mb-2 text-sm">Parent Phone</label>
                  <input
                    type="tel"
                    name="parentPhone"
                    value={formData.parentPhone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
                    placeholder="Enter parent's phone"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg
                           hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50 
                           transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Registering...
                    </div>
                  ) : (
                    'Register Student'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Students List */}
        <div className="lg:col-span-2">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-lg h-full">
            <h2 className="text-xl font-bold mb-4 text-white">Registered Students</h2>
            
            {loading && !students.length ? (
              <div className="flex justify-center items-center h-64">
                <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : students.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-4 px-2 text-white/80 font-medium">Name</th>
                      <th className="text-left py-4 px-2 text-white/80 font-medium">Email</th>
                      <th className="text-left py-4 px-2 text-white/80 font-medium">Grade</th>
                      <th className="text-left py-4 px-2 text-white/80 font-medium">Section</th>
                      <th className="text-left py-4 px-2 text-white/80 font-medium">Roll Number</th>
                      <th className="text-left py-4 px-2 text-white/80 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(student => (
                      <tr key={student._id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                        <td className="py-4 px-2 text-white">{student.name}</td>
                        <td className="py-4 px-2 text-white/80">{student.email}</td>
                        <td className="py-4 px-2 text-white/80">{student.grade}</td>
                        <td className="py-4 px-2 text-white/80">{student.section}</td>
                        <td className="py-4 px-2 text-white/80">{student.rollNumber}</td>
                        <td className="py-4 px-2">
                          <div className="flex space-x-2">
                            <button 
                              className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                              onClick={() => {
                                // Implement edit functionality later
                                console.log('Edit student:', student._id);
                              }}
                            >
                              ✏️
                            </button>
                            <button 
                              className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                              onClick={async () => {
                                try {
                                  if (window.confirm('Are you sure you want to delete this student?')) {
                                    await api.deleteStud(student._id);
                                    toast.success('Student deleted successfully');
                                    fetchStudents();
                                  }
                                } catch (err) {
                                  toast.error('Failed to delete student: ' + api.handleError(err));
                                }
                              }}
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-white/60">
                <div className="text-5xl mb-4">👨‍🎓</div>
                <p>No students registered yet.</p>
                <p className="text-sm">Register your first student using the form.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentManagement;