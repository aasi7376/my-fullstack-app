import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StudentManagement from '../components/teacher/StudentManagement';
import ScoreAnalysis from '../components/teacher/ScoreAnalysis';
import PostsManagement from '../components/teacher/PostsManagement';
import Sidebar from '../components/common/Sidebar';
import Reports from '../components/teacher/Reports';
import Assignments from '../components/teacher/Assignments';
import ViewStudentScores from '../components/teacher/ViewStudentScores'; // You'll need to create this component
import AssignmentOptions from '../components/teacher/AssignmentOptions'; // You'll need to create this component
import ProfileModal from '../components/ProfileModal';

const TeacherDashboard = () => {
  const { user, loading, updateUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const particlesRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  // Enhanced state with more data
  const [stats, setStats] = useState({
    totalStudents: 156,
    totalClasses: 6,
    averageScore: 82.3,
    pendingDoubts: 8,
    gamesAssigned: 12,
    completionRate: 78,
    activeToday: 89,
    weeklyGrowth: 12.5,
    topPerformer: 'Alice Johnson',
    strugglingStudents: 3,
    // New stats for teacher roles
    studentsRegisteredThisMonth: 12,
    postsAnswered: 45,
    questionsCreated: 28,
    reportsGenerated: 15,
    improvementAreas: 3
  });

  // Initialize profile data from user
  useEffect(() => {
    if (user && !profileData) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        subjects: user.subjects || ['Mathematics', 'Science'],
        bio: user.bio || 'Experienced educator passionate about helping students excel.',
        profileImage: user.profileImage || null,
        yearsOfExperience: user.yearsOfExperience || 5,
        qualifications: user.qualifications || 'M.Ed. in Mathematics Education',
        specializations: user.specializations || ['Algebra', 'Geometry', 'Statistics'],
        preferredTeachingMethods: user.preferredTeachingMethods || ['Interactive Learning', 'Game-Based Learning']
      });
    }
  }, [user, profileData]);

  // Loading effect
  useEffect(() => {
    if (!loading && user) {
      const timer = setTimeout(() => setIsLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [loading, user]);

  // Aurora particles effect
  useEffect(() => {
    if (!isLoading && particlesRef.current) {
      const container = particlesRef.current;
      container.innerHTML = '';
      
      for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        
        const size = Math.random() * 3 + 1;
        const colors = ['#4f46e5', '#7e22ce', '#ec4899', '#d946ef', '#8b5cf6'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.cssText = `
          width: ${size}px;
          height: ${size}px;
          background: ${color};
          border-radius: 50%;
          position: absolute;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          box-shadow: 0 0 ${size * 2}px ${color};
          opacity: ${Math.random() * 0.5 + 0.3};
          z-index: 1;
          pointer-events: none;
          transform: translateY(0);
          transition: transform 1s ease;
        `;
        
        // Fancy floating animation
        const animate = () => {
          const randomY = Math.random() * 20 - 10;
          const randomX = Math.random() * 20 - 10;
          particle.style.transform = `translate(${randomX}px, ${randomY}px)`;
          
          setTimeout(() => {
            particle.style.transform = 'translate(0, 0)';
            setTimeout(animate, Math.random() * 3000 + 2000);
          }, Math.random() * 3000 + 2000);
        };
        
        setTimeout(animate, Math.random() * 1000);
        container.appendChild(particle);
      }
    }
  }, [isLoading]);

  // Handle mouse movement for following glow effect
  useEffect(() => {
    let lastUpdate = 0;
    const throttleTime = 50;
    
    const handleMouseMove = (e) => {
      const now = Date.now();
      if (now - lastUpdate > throttleTime) {
        setMousePosition({ x: e.clientX, y: e.clientY });
        lastUpdate = now;
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Updated Sidebar items - removed Teacher Registration, At-Risk Students, Class Insights
  // and added View Student Scores and Assignment Options
  const sidebarItems = [
    { id: 'overview', label: 'Dashboard', icon: '📊', path: '/teacher' },
    { id: 'posts', label: 'Student Posts', icon: '💬', path: '/teacher/posts' },
    { id: 'assignments', label: 'Create Questions', icon: '📝', path: '/teacher/assignments' },
    { id: 'assignment-options', label: 'Assignment Options', icon: '📚', path: '/teacher/assignment-options' },
    { id: 'view-scores', label: 'View Student Scores', icon: '🎯', path: '/teacher/view-scores' },
    { id: 'reports', label: 'Performance Reports', icon: '📋', path: '/teacher/reports' },
    { id: 'scores', label: 'Score Analysis', icon: '📈', path: '/teacher/scores' },
  ];

  // Aurora-styled Stats Card
  const StatsCard = ({ title, value, icon, iconBg, textColor, onClick, delay = 0 }) => (
    <div 
      className="bg-white/20 backdrop-blur-md rounded-xl p-5 cursor-pointer relative overflow-hidden 
                border border-white/30 shadow-lg hover:shadow-xl transition-transform duration-300 ease-out
                hover:border-white/40 hover:scale-105 group"
      style={{ animationDelay: `${delay}ms` }}
      onClick={onClick}
    >
      <div className="absolute top-0 right-0 m-3 w-12 h-12 flex items-center justify-center rounded-lg bg-opacity-30" 
           style={{ backgroundColor: iconBg }}>
        <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{icon}</span>
      </div>
      
      <div className="mt-8">
        <h3 className="text-white/80 text-sm font-medium mb-2 uppercase tracking-wider">
          {title}
        </h3>
        <div className="text-3xl font-extrabold text-white group-hover:text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-300 transition-colors duration-300">
          {value}
        </div>
      </div>
      
      <div className="absolute -bottom-3 -left-3 w-24 h-24 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300" 
           style={{ backgroundColor: iconBg }}></div>
      
      {/* Neon glow effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-300"
          style={{ boxShadow: `0 0 20px ${iconBg}, 0 0 30px ${iconBg}` }}>
      </div>
    </div>
  );

  // Aurora-styled Role Card 
  const RoleCard = ({ title, description, icon, stats, path, primaryColor, secondaryColor, iconBg, delay = 0 }) => (
    <div
      className="bg-white/20 backdrop-blur-md p-6 rounded-xl cursor-pointer relative overflow-hidden 
                 border border-white/30 shadow-lg transition-transform duration-300 ease-out
                 hover:border-white/40 hover:scale-[1.02] group"
      style={{ animationDelay: `${delay}ms` }}
      onClick={() => navigate(path)}
    >
      <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-30 group-hover:opacity-50 transition-opacity duration-300" 
           style={{ background: `radial-gradient(circle, ${primaryColor}, transparent 70%)`, transform: 'translate(20%, -30%)' }}></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full opacity-30 group-hover:opacity-50 transition-opacity duration-300" 
           style={{ background: `radial-gradient(circle, ${secondaryColor}, transparent 70%)`, transform: 'translate(-30%, 20%)' }}></div>
      
      <div className="flex items-start gap-4 mb-5 relative z-10">
        <div 
          className="w-14 h-14 rounded-lg flex items-center justify-center text-2xl bg-white/20 border border-white/40 
                    group-hover:scale-110 group-hover:border-white/60 transition-all duration-300"
          style={{ background: iconBg }}
        >
          {icon}
        </div>
        
        <div>
          <h3 className="text-white text-xl font-bold mb-1 group-hover:text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-pink-200 transition-colors duration-300">
            {title}
          </h3>
          
          <p className="text-white/70 text-sm group-hover:text-white/90 transition-colors duration-300">
            {description}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 relative z-10">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 
                                    group-hover:bg-white/20 group-hover:border-white/30 transition-all duration-300">
            <div className="text-2xl font-extrabold text-white group-hover:text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-pink-200 transition-colors duration-300">
              {stat.value}
            </div>
            <div className="text-white/60 text-xs group-hover:text-white/80 transition-colors duration-300">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 flex justify-end">
        <div className="text-white/60 text-sm border-b border-white/30 pb-1 
                      group-hover:text-white group-hover:border-white/50 transition-colors duration-300">
          View {title} →
        </div>
      </div>
      
      {/* Neon glow effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300"
           style={{ boxShadow: `0 0 25px ${primaryColor}, 0 0 35px ${secondaryColor}` }}>
      </div>
    </div>
  );

  // Aurora-styled Loading Screen
  if (loading || isLoading) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        {/* Aurora background */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 
                       bg-[length:200%_200%] animate-[gradient_15s_ease_infinite]"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxkZWZzPgogICAgPHBhdHRlcm4gaWQ9InBhdHRlcm4iIHg9IjAiIHk9IjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+CiAgICAgIDxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjAuNSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA3KSIgLz4KICAgIDwvcGF0dGVybj4KICA8L2RlZnM+CiAgPHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIgLz4KPC9zdmc+')]"></div>
        
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-xl p-10 rounded-2xl border border-white/30 shadow-2xl">
            <div className="relative w-20 h-20 mx-auto mb-5">
              <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-white/80 animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-4 border-white/10"></div>
              <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-white/60 animate-spin" style={{ animationDuration: '1.5s' }}></div>
              <div className="absolute inset-4 rounded-full border-4 border-white/5"></div>
              <div className="absolute inset-4 rounded-full border-4 border-transparent border-t-white/40 animate-spin" style={{ animationDuration: '2s' }}></div>
            </div>
            <h2 className="text-2xl mb-3 font-bold text-white text-center"
                style={{ textShadow: '0 0 15px rgba(255,255,255,0.5)' }}>
              Loading Teacher Dashboard
            </h2>
            <p className="text-white/80 text-center">Preparing your enhanced experience...</p>
          </div>
        </div>
      </div>
    );
  }

  // Aurora-styled Error Screen
  if (!user) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        {/* Aurora background */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 
                       bg-[length:200%_200%] animate-[gradient_15s_ease_infinite]"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxkZWZzPgogICAgPHBhdHRlcm4gaWQ9InBhdHRlcm4iIHg9IjAiIHk9IjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+CiAgICAgIDxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjAuNSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA3KSIgLz4KICAgIDwvcGF0dGVybj4KICA8L2RlZnM+CiAgPHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIgLz4KPC9zdmc+')]"></div>
        
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-xl p-10 rounded-2xl border border-white/30 shadow-2xl">
            <div className="w-16 h-16 flex items-center justify-center mx-auto mb-5 bg-rose-500/40 text-white text-3xl rounded-full border border-white/50">⚠️</div>
            <h2 className="text-2xl mb-3 text-white font-bold text-center"
                style={{ textShadow: '0 0 15px rgba(255,255,255,0.5)' }}>
              User Data Not Available
            </h2>
            <p className="text-white/80 mb-6 text-center">Please try logging in again.</p>
            <div className="flex justify-center">
              <button 
                onClick={() => navigate('/login')}
                className="relative px-6 py-3 rounded-lg font-semibold text-white overflow-hidden group bg-gradient-to-r from-pink-500 to-purple-600 hover:shadow-lg hover:shadow-pink-500/30 transition-shadow duration-300"
              >
                <span className="relative z-10">Go to Login</span>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                    style={{ boxShadow: "0 0 20px #ec4899, 0 0 30px #8b5cf6" }}>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Dashboard with Aurora styling
  const renderOverview = () => {
    return (
      <div className="min-h-screen relative">
        {/* Mouse glow effect */}
        <div
          className="fixed w-[400px] h-[400px] rounded-full bg-gradient-to-r from-indigo-500/20 to-pink-500/20 pointer-events-none z-10 blur-[80px] transition-all duration-300 ease-out"
          style={{
            left: mousePosition.x - 200,
            top: mousePosition.y - 200,
          }}
        />

        {/* Header */}
        <div className="p-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-8 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300">
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-4">
              <span className="text-3xl p-3 bg-white/10 rounded-xl">📚</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300"
                    style={{ textShadow: '0 0 20px rgba(255,255,255,0.3)' }}>
                Welcome back, {user?.name || "Teacher"}!
              </span>
            </h1>
            <p className="text-white/80 text-xl">
              Manage your students, track their progress, and answer their questions with enhanced analytics
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 px-8 mb-6">
          <button
            onClick={() => setProfileModalOpen(true)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/30 
                    transition-all duration-300 flex items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden bg-white/10 border border-white/30 group-hover:border-white/50 transition-all duration-300">
              {user.profilePictureUrl ? (
                <img 
                  src={user.profilePictureUrl} 
                  alt={user.name} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {user?.name?.charAt(0)?.toUpperCase() || "T"}
                  </span>
                </div>
              )}
            </div>
            <span>Edit Profile</span>
            <span className="text-white/50 group-hover:text-white transition-colors duration-300">✏️</span>
          </button>
        </div>

        {/* Main Content Area - Updated Role Cards */}
        <div className="px-8 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RoleCard
              title="Student Posts"
              description="Monitor questions and doubts posted by students."
              icon="💬"
              stats={[
                { label: "Pending Doubts", value: stats.pendingDoubts },
                { label: "Answered", value: stats.postsAnswered }
              ]}
              path="/teacher/posts"
              primaryColor="#f472b6"
              secondaryColor="#e879f9"
              iconBg="linear-gradient(135deg, #f472b6, #e879f9)"
              delay={100}
            />
            
            <RoleCard
              title="Create Questions"
              description="Prepare academic questions for practice and homework."
              icon="📝"
              stats={[
                { label: "Questions Created", value: stats.questionsCreated },
                { label: "Active Assignments", value: "2" }
              ]}
              path="/teacher/assignments"
              primaryColor="#a78bfa"
              secondaryColor="#c084fc"
              iconBg="linear-gradient(135deg, #a78bfa, #c084fc)"
              delay={200}
            />
            
            <RoleCard
              title="Assignment Options"
              description="Configure and manage student assignments."
              icon="📚"
              stats={[
                { label: "Total Assignments", value: "14" },
                { label: "Active Assignments", value: "6" }
              ]}
              path="/teacher/assignment-options"
              primaryColor="#34d399"
              secondaryColor="#10b981"
              iconBg="linear-gradient(135deg, #34d399, #10b981)"
              delay={300}
            />
            
            <RoleCard
              title="View Student Scores"
              description="Check individual and class performance metrics."
              icon="🎯"
              stats={[
                { label: "Average Score", value: stats.averageScore + "%" },
                { label: "Top Performer", value: stats.topPerformer.split(' ')[0] }
              ]}
              path="/teacher/view-scores"
              primaryColor="#3b82f6"
              secondaryColor="#2563eb"
              iconBg="linear-gradient(135deg, #3b82f6, #2563eb)"
              delay={400}
            />
          </div>
        </div>

        {/* Performance Reports Role Card */}
        <div className="px-8 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RoleCard
              title="Performance Reports"
              description="Generate detailed analytics for students or classes."
              icon="📊"
              stats={[
                { label: "Reports Generated", value: stats.reportsGenerated },
                { label: "Completion Rate", value: stats.completionRate + "%" }
              ]}
              path="/teacher/reports"
              primaryColor="#fb923c"
              secondaryColor="#fbbf24"
              iconBg="linear-gradient(135deg, #fb923c, #fbbf24)"
              delay={500}
            />
            
            <RoleCard
              title="Score Analysis"
              description="Analyze test results and identify improvement areas."
              icon="📈"
              stats={[
                { label: "Analyzed Tests", value: "12" },
                { label: "Improvement Areas", value: stats.improvementAreas }
              ]}
              path="/teacher/scores"
              primaryColor="#6366f1"
              secondaryColor="#4f46e5"
              iconBg="linear-gradient(135deg, #6366f1, #4f46e5)"
              delay={600}
            />
          </div>
        </div>

        {/* Stats Section */}
        <div className="px-8 pb-8">
          <h2 className="text-2xl font-bold text-white mb-4 ml-2"
              style={{ textShadow: '0 0 10px rgba(255,255,255,0.3)' }}>
            Quick Stats
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <StatsCard
              title="My Students"
              value={stats.totalStudents}
              icon="👨‍🎓"
              iconBg="#38bdf8"
              textColor="#38bdf8"
              onClick={() => navigate('/teacher/view-scores')}
              delay={100}
            />
            <StatsCard
              title="Average Score"
              value={`${stats.averageScore}%`}
              icon="📊"
              iconBg="#22c55e"
              textColor="#22c55e"
              onClick={() => navigate('/teacher/scores')}
              delay={200}
            />
            <StatsCard
              title="Pending Doubts"
              value={stats.pendingDoubts}
              icon="❓"
              iconBg="#f472b6"
              textColor="#f472b6"
              onClick={() => navigate('/teacher/posts')}
              delay={300}
            />
            <StatsCard
              title="Questions Created"
              value={stats.questionsCreated}
              icon="📝"
              iconBg="#a78bfa"
              textColor="#a78bfa"
              onClick={() => navigate('/teacher/assignments')}
              delay={400}
            />
          </div>
        </div>

        {/* Floating Activity Section with Aurora styling */}
        <div className="px-8 pb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300"
               style={{ animationDelay: "600ms" }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white"
                  style={{ textShadow: '0 0 10px rgba(255,255,255,0.3)' }}>
                Recent Activity
              </h2>
              <div className="text-white/60 hover:text-white transition-colors duration-300 cursor-pointer">
                View all →
              </div>
            </div>
            
            <div className="space-y-4">
              {[
                { icon: "👨‍🎓", text: "Alice Johnson completed all assignments", time: "2 hours ago", color: "#38bdf8" },
                { icon: "📝", text: "You created a new math quiz", time: "Yesterday", color: "#a78bfa" },
                { icon: "💬", text: "Bob Smith asked a question about trigonometry", time: "2 days ago", color: "#f472b6" }
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-white/10 border border-white/20 
                                           hover:bg-white/20 hover:border-white/30 transition-all duration-300 group">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                       style={{ backgroundColor: `${activity.color}40` }}>
                    <span className="text-xl group-hover:scale-110 transition-transform duration-300">{activity.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white/90 group-hover:text-white transition-colors duration-300">{activity.text}</p>
                    <p className="text-white/60 text-xs">{activity.time}</p>
                  </div></div>
              ))}
            </div>
          </div>
        </div>

        {/* Particles container */}
        <div ref={particlesRef} className="fixed inset-0 pointer-events-none z-1" />
      </div>
    );
  };
  
  // Posts Management Section
  const renderPostsManagement = () => (
    <PostsManagement />
  );
  
  // Question Creation Section
  const renderCreateQuestions = () => (
    <Assignments />
  );
  
  // Reports Section
  const renderPerformanceReports = () => (
    <Reports />
  );
  
  // Score Analysis Section
  const renderScoreAnalysis = () => (
    <ScoreAnalysis />
  );
  
  // New View Student Scores Section
  const renderViewStudentScores = () => (
    <ViewStudentScores />
  );
  
  // New Assignment Options Section
  const renderAssignmentOptions = () => (
    <AssignmentOptions />
  );

  // Main return with Aurora styling
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Aurora background */}
     <div className="fixed inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 
                     bg-[length:200%_200%] animate-[gradient_15s_ease_infinite]"></div>
      
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxkZWZzPgogICAgPHBhdHRlcm4gaWQ9InBhdHRlcm4iIHg9IjAiIHk9IjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+CiAgICAgIDxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjAuNSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA3KSIgLz4KICAgIDwvcGF0dGVybj4KICA8L2RlZnM+CiAgPHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIgLz4KPC9zdmc+')]"></div>
      
      {/* CSS for purple neon sidebar */}
      <style jsx>{`
        /* Purple Neon Sidebar Styles */
        .sidebar-item.active .active-dot {
          background-color: #954ce9 !important;
          box-shadow: 0 0 8px #954ce9, 0 0 12px rgba(149, 76, 233, 0.8) !important;
        }

        .sidebar-item.active .icon,
        .sidebar-item:hover .icon {
          color: #954ce9 !important;
          filter: drop-shadow(0 0 8px rgba(149, 76, 233, 0.8)) !important;
        }

        .sidebar-item.active span,
        .sidebar-item:hover span {
          color: #ffffff !important;
          text-shadow: 0 0 10px rgba(149, 76, 233, 0.5) !important;
        }

        .sidebar-item.active::before {
          background: linear-gradient(to bottom, #954ce9, #6e2ad1) !important;
          box-shadow: 0 0 8px #954ce9, 0 0 12px rgba(149, 76, 233, 0.5) !important;
        }

        .sidebar-item:hover {
          background: linear-gradient(135deg, rgba(149, 76, 233, 0.1), rgba(110, 42, 209, 0.05)) !important;
          border: 1px solid rgba(149, 76, 233, 0.3) !important;
        }

        .sidebar-item.active {
          background: linear-gradient(135deg, rgba(149, 76, 233, 0.15), rgba(110, 42, 209, 0.1)) !important;
          border: 1px solid rgba(149, 76, 233, 0.3) !important;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2), 0 0 20px rgba(149, 76, 233, 0.1) !important;
        }

        /* User section styling */
        .user-info .user-role,
        .sidebar-footer p {
          color: #954ce9 !important;
        }

        .logout-button {
          background: linear-gradient(135deg, rgba(149, 76, 233, 0.2), rgba(110, 42, 209, 0.1)) !important;
          border: 1px solid rgba(149, 76, 233, 0.3) !important;
          color: #954ce9 !important;
          text-shadow: 0 0 8px rgba(149, 76, 233, 0.5) !important;
        }

        .logout-button:hover {
          box-shadow: 0 0 20px rgba(149, 76, 233, 0.4) !important;
        }
      `}</style>
      
      {/* Sidebar with purple neon styling */}
      <div className="relative z-10">
        <Sidebar 
          items={sidebarItems} 
          onItemClick={(id) => setActiveTab(id)}
          collapsed={false}
          className="sidebar-container" // Custom CSS applied above
        />
        {/* Profile Modal */}
        <ProfileModal
          isOpen={profileModalOpen}
          onClose={() => setProfileModalOpen(false)}
        />
        {/* Main Content */}
        <div className="ml-[280px] min-h-screen relative z-10">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'posts' && renderPostsManagement()}
          {activeTab === 'assignments' && renderCreateQuestions()}
          {activeTab === 'assignment-options' && renderAssignmentOptions()}
          {activeTab === 'view-scores' && renderViewStudentScores()}
          {activeTab === 'reports' && renderPerformanceReports()}
          {activeTab === 'scores' && renderScoreAnalysis()}
        </div>
      </div>
      
      {/* Purple particles for the sidebar */}
      <div className="fixed inset-y-0 left-0 w-[280px] overflow-hidden pointer-events-none z-1">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: `${Math.random() * 280}px`,
              top: `${Math.random() * 100 + (i * 50)}px`,
              background: i % 2 === 0 ? '#954ce9' : '#b78efa',
              boxShadow: i % 2 === 0 ? '0 0 8px #954ce9' : '0 0 8px #b78efa',
              opacity: Math.random() * 0.5 + 0.3,
              animation: `float ${Math.random() * 10 + 10}s ease-in-out infinite ${Math.random() * 5}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default TeacherDashboard;