import React, { useState } from 'react';

const RoleSwitcher = ({ currentUserType, onRoleChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const roles = [
    { id: 'student', label: 'Student', icon: '👨‍🎓', color: 'bg-blue-500' },
    { id: 'teacher', label: 'Teacher', icon: '👩‍🏫', color: 'bg-green-500' },
    { id: 'school', label: 'School Admin', icon: '🏫', color: 'bg-purple-500' },
    { id: 'admin', label: 'Platform Admin', icon: '👨‍💼', color: 'bg-red-500' }
  ];

  const handleRoleSwitch = (roleId) => {
    const mockUsers = {
      student: {
        id: 1,
        name: 'John Student',
        username: 'john.student',
        schoolName: 'Cognify High School',
        class: '10-A'
      },
      teacher: {
        id: 2,
        name: 'Sarah Teacher',
        username: 'sarah.teacher',
        schoolName: 'Cognify High School',
        subjects: ['Mathematics', 'Science']
      },
      school: {
        id: 3,
        name: 'Cognify High School',
        username: 'school.admin',
        schoolName: 'Cognify High School',
        totalStudents: 1200,
        totalTeachers: 45
      },
      admin: {
        id: 4,
        name: 'Platform Administrator',
        username: 'platform.admin',
        totalSchools: 25,
        totalUsers: 15000
      }
    };

    const userData = mockUsers[roleId];
    
    // Update localStorage
    localStorage.setItem('cognify_user_type', roleId);
    localStorage.setItem('cognify_user', JSON.stringify(userData));
    
    // Call the parent callback
    if (onRoleChange) {
      onRoleChange(userData, roleId);
    }
    
    // Reload the page to apply changes
    window.location.reload();
    
    setIsOpen(false);
  };

  const currentRole = roles.find(role => role.id === currentUserType);

  // Only show in development mode
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative">
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`${currentRole?.color || 'bg-gray-500'} text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2`}
          title="Switch Role (Development Only)"
        >
          <span className="text-lg">{currentRole?.icon || '👤'}</span>
          <span className="hidden sm:block font-medium">{currentRole?.label || 'Unknown'}</span>
          <span className="text-sm">⚙️</span>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-2xl border border-gray-200 min-w-48 overflow-hidden">
            <div className="p-3 bg-gray-50 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800 text-sm">Switch Role</h3>
              <p className="text-xs text-gray-600">Development Mode Only</p>
            </div>
            
            <div className="py-2">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => handleRoleSwitch(role.id)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 flex items-center gap-3 ${
                    currentUserType === role.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                  }`}
                >
                  <span className="text-lg">{role.icon}</span>
                  <div>
                    <div className="font-medium text-gray-800">{role.label}</div>
                    {currentUserType === role.id && (
                      <div className="text-xs text-blue-600">Current Role</div>
                    )}
                  </div>
                  {currentUserType === role.id && (
                    <span className="ml-auto text-blue-500">✓</span>
                  )}
                </button>
              ))}
            </div>
            
            <div className="p-3 bg-gray-50 border-t border-gray-200">
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default RoleSwitcher;