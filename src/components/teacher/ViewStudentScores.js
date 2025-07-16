import React, { useState, useEffect } from 'react';

// This is a placeholder component for the ViewStudentScores functionality
// You'll need to implement the actual functionality based on your application's requirements

const ViewStudentScores = () => {
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [loading, setLoading] = useState(true);

  // Sample data - replace with actual API calls
  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      setStudents([
        { id: 1, name: 'Alice Johnson', class: '10A', scores: { mathematics: 92, science: 88, english: 78 }, average: 86 },
        { id: 2, name: 'Bob Smith', class: '10A', scores: { mathematics: 78, science: 85, english: 81 }, average: 81.3 },
        { id: 3, name: 'Carol Davis', class: '10B', scores: { mathematics: 95, science: 92, english: 89 }, average: 92 },
        { id: 4, name: 'David Wilson', class: '10B', scores: { mathematics: 68, science: 72, english: 75 }, average: 71.7 },
        { id: 5, name: 'Emma Brown', class: '11A', scores: { mathematics: 88, science: 85, english: 92 }, average: 88.3 },
        { id: 6, name: 'Frank Miller', class: '11A', scores: { mathematics: 75, science: 80, english: 85 }, average: 80 },
        { id: 7, name: 'Grace Lee', class: '11B', scores: { mathematics: 91, science: 87, english: 90 }, average: 89.3 },
        { id: 8, name: 'Henry Taylor', class: '11B', scores: { mathematics: 82, science: 79, english: 77 }, average: 79.3 },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const classes = ['all', '10A', '10B', '11A', '11B'];
  const subjects = ['all', 'mathematics', 'science', 'english'];

  // Filter students based on selected class and subject
  const filteredStudents = students.filter(student => {
    if (selectedClass !== 'all' && student.class !== selectedClass) return false;
    return true;
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-8 border border-white/30 shadow-lg">
        <h1 className="text-3xl font-bold mb-2 text-white">
          Student Scores
        </h1>
        <p className="text-white/80">
          View and analyze student performance across different subjects and classes
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-4">
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
                {subject === 'all' ? 'All Subjects' : subject.charAt(0).toUpperCase() + subject.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/30 shadow-lg">
          <div className="text-white/70 mb-1">Class Average</div>
          <div className="text-3xl font-bold text-white">
            {loading ? 'Loading...' : `${Math.round(filteredStudents.reduce((sum, student) => sum + student.average, 0) / filteredStudents.length)}%`}
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/30 shadow-lg">
          <div className="text-white/70 mb-1">Highest Score</div>
          <div className="text-3xl font-bold text-white">
            {loading ? 'Loading...' : `${Math.max(...filteredStudents.map(student => student.average))}%`}
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/30 shadow-lg">
          <div className="text-white/70 mb-1">Students</div>
          <div className="text-3xl font-bold text-white">
            {loading ? 'Loading...' : filteredStudents.length}
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-white">Student Scores</h2>
        
        {loading ? (
          <div className="text-center p-8">
            <div className="inline-block w-8 h-8 border-4 border-white/30 border-t-white/80 rounded-full animate-spin"></div>
            <p className="mt-4 text-white/70">Loading student data...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="py-3 px-4 text-left text-white/80">Name</th>
                  <th className="py-3 px-4 text-left text-white/80">Class</th>
                  <th className="py-3 px-4 text-left text-white/80">Mathematics</th>
                  <th className="py-3 px-4 text-left text-white/80">Science</th>
                  <th className="py-3 px-4 text-left text-white/80">English</th>
                  <th className="py-3 px-4 text-left text-white/80">Average</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map(student => (
                  <tr key={student.id} className="border-b border-white/10 hover:bg-white/5">
                    <td className="py-3 px-4 text-white">{student.name}</td>
                    <td className="py-3 px-4 text-white">{student.class}</td>
                    <td className="py-3 px-4 text-white">
                      <span className={`px-2 py-1 rounded ${student.scores.mathematics >= 90 ? 'bg-green-500/20' : 
                        student.scores.mathematics >= 75 ? 'bg-blue-500/20' : 'bg-red-500/20'}`}>
                        {student.scores.mathematics}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white">
                      <span className={`px-2 py-1 rounded ${student.scores.science >= 90 ? 'bg-green-500/20' : 
                        student.scores.science >= 75 ? 'bg-blue-500/20' : 'bg-red-500/20'}`}>
                        {student.scores.science}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white">
                      <span className={`px-2 py-1 rounded ${student.scores.english >= 90 ? 'bg-green-500/20' : 
                        student.scores.english >= 75 ? 'bg-blue-500/20' : 'bg-red-500/20'}`}>
                        {student.scores.english}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white font-bold">
                      <span className={`px-2 py-1 rounded ${student.average >= 90 ? 'bg-purple-500/30' : 
                        student.average >= 75 ? 'bg-indigo-500/20' : 'bg-red-500/20'}`}>
                        {student.average.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewStudentScores;