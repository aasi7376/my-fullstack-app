import React from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate, 
  useLocation,
  useNavigate
} from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { NotificationProvider } from './context/NotificationContext';
import NavigationDebug from './components/forms/NavigationDebug';

// Page Components
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import AuthPage from './pages/AuthPage';
import AdminDashboard from './pages/AdminDashboard';
import SchoolDashboard from './pages/SchoolDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import GameInterface from './pages/GameInterface';
import Reports from './pages/Reports';
import NotFound from './pages/NotFound';
import SettingsPage from './pages/SettingsPage';
import HelpPage from './pages/HelpPage';
import GamePage from './pages/GamePage';
import GameRecommendations from './components/student/GameRecommendations';
import LearningAnalytics from './components/student/LearningAnalytics';
import AtRiskStudents from './components/teacher/AtRiskStudents';
import ClassInsights from './components/teacher/ClassInsights';
import SchoolAnalytics from './components/school/SchoolAnalytics';
import GameEffectiveness from './components/admin/GameEffectiveness';
import SessionExpiredHandler from './components/SessionExpiredHandler';

// Import Styles
import './styles/globals.css';
import './styles/animations.css';
import './styles/auth.css';
import './App.css';
import './styles/modern-theme.css';
import './styles/GameStyles.css';
// Wrapper components that use hooks
const ProtectedRouteWrapper = ({ children, allowedRoles }) => {
  const location = useLocation();
  return <ProtectedRoute location={location} allowedRoles={allowedRoles}>{children}</ProtectedRoute>;
};

const PublicRouteWrapper = ({ children }) => {
  const location = useLocation();
  return <PublicRoute location={location}>{children}</PublicRoute>;
};

const DashboardRouteWrapper = () => {
  const location = useLocation();
  const navigate = useNavigate();
  return <DashboardRoute location={location} navigate={navigate} />;
};

// Loading component
const LoadingScreen = () => (
  <div className="loading-container">
    <div className="loading-card">
      <div className="spinner"></div>
      Loading...
    </div>
  </div>
);

// Protected route component
const ProtectedRoute = ({ children, allowedRoles, location }) => {
  const { user, loading, isAuthenticated } = useAuth();
  
  // Debug logging
  if (process.env.NODE_ENV !== 'production') {
    console.log('Protected Route:', { location: location.pathname, user, isAuthenticated, loading, allowedRoles });
  }
  
  // Check for too many redirects
  if (location.state?.redirectCount > 3) {
    console.error('Too many redirects detected!');
    return (
      <div className="error-container">
        <div className="error-card">
          <h2>Navigation Error</h2>
          <p>Too many redirects detected. Please try refreshing the page.</p>
          <button
            onClick={() => window.location.href = '/'}
            className="error-button"
          >
            Go to Home Page
          </button>
        </div>
      </div>
    );
  }
  
  // Show loading screen
  if (loading) {
    return <LoadingScreen />;
  }
  
  // Redirect to auth if not authenticated
  if (!user || !isAuthenticated) {
    const redirectCount = (location.state?.redirectCount || 0) + 1;
    return <Navigate to="/auth" replace state={{ 
      from: location.pathname,
      redirectCount
    }} />;
  }
  
  // Allow all authenticated users to access settings and help
  if (['/settings', '/help'].includes(location.pathname)) {
    return children;
  }
  
  // Check user role
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = String(user.role).toLowerCase().trim();
    const normalizedAllowedRoles = allowedRoles.map(role => String(role).toLowerCase().trim());
    
    if (!normalizedAllowedRoles.includes(userRole)) {
      // Get correct dashboard route based on user role
      let dashboardRoute;
      switch (userRole) {
        case 'student': dashboardRoute = '/student/dashboard'; break;
        case 'teacher': dashboardRoute = '/teacher/dashboard'; break;
        case 'school':
        case 'school_admin': dashboardRoute = '/school/dashboard'; break;
        case 'admin': dashboardRoute = '/admin/dashboard'; break;
        default: dashboardRoute = '/';
      }
      
      // Prevent redirect loop
      if (location.pathname === dashboardRoute) {
        console.warn('Already at dashboard route, preventing redirect loop');
        return children;
      }
      
      const redirectCount = (location.state?.redirectCount || 0) + 1;
      return <Navigate to={dashboardRoute} replace state={{ 
        from: location.pathname,
        redirectCount
      }} />;
    }
  }
  
  return children;
};

// Public route component
const PublicRoute = ({ children, location }) => {
  const { loading, isAuthenticated, user } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  // Redirect authenticated users from auth pages to dashboard
  if (isAuthenticated && user && ['/auth', '/login'].includes(location.pathname)) {
    // Prevent redirect loop
    if (location.state?.from?.includes('/dashboard')) {
      return (
        <div className="error-container">
          <div className="error-card">
            <div>Navigation issue detected</div>
            <button
              onClick={() => window.location.reload()}
              className="error-button"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    
    let dashboardRoute;
    switch (user.role) {
      case 'student': dashboardRoute = '/student/dashboard'; break;
      case 'teacher': dashboardRoute = '/teacher/dashboard'; break;
      case 'school':
      case 'school_admin': dashboardRoute = '/school/dashboard'; break;
      case 'admin': dashboardRoute = '/admin/dashboard'; break;
      default: dashboardRoute = '/';
    }
    
    return <Navigate to={dashboardRoute} replace state={{ from: location.pathname }} />;
  }
  
  return children;
};

// Dashboard redirect route
const DashboardRoute = ({ location, navigate }) => {
  const { user, isAuthenticated, loading } = useAuth();
  
  // Use navigate instead of Navigate component to prevent rendering issues
  React.useEffect(() => {
    // Only redirect if not loading and authenticated
    if (!loading) {
      if (!user || !isAuthenticated) {
        navigate('/auth', { replace: true, state: { from: location.pathname } });
      } else {
        // Only redirect if we're not already on a dashboard page
        if (!(location.pathname.includes('/dashboard') && location.pathname !== '/dashboard')) {
          // Get dashboard route based on user role
          let dashboardRoute;
          const userRole = user.role;
          switch (userRole) {
            case 'student': dashboardRoute = '/student/dashboard'; break;
            case 'teacher': dashboardRoute = '/teacher/dashboard'; break;
            case 'school':
            case 'school_admin': dashboardRoute = '/school/dashboard'; break;
            case 'admin': dashboardRoute = '/admin/dashboard'; break;
            default: dashboardRoute = '/';
          }
          
          navigate(dashboardRoute, { replace: true, state: { from: '/dashboard' } });
        }
      }
    }
  }, [loading, user, isAuthenticated, navigate, location.pathname]);
  
  return <LoadingScreen />;
};

// Simple page components
const TestSettingsPage = () => (
  <div className="test-page">
    <div className="test-card">
      <h1>🎯 TEST SETTINGS PAGE WORKS!</h1>
      <p>If you can see this, the settings route is working correctly.</p>
      <button
        onClick={() => window.location.href = '/'}
        className="test-button"
      >
        🏠 Back to Home
      </button>
    </div>
  </div>
);

const AboutPage = () => (
  <div className="about-page">
    <div className="about-card">
      <h1>About Cognify</h1>
      <p>Transforming education through personalized learning games.</p>
      <button
        onClick={() => window.location.href = '/'}
        className="about-button"
      >
        🏠 Back to Home
      </button>
    </div>
  </div>
);

const ContactPage = () => (
  <div className="contact-page">
    <div className="contact-card">
      <h1>Contact Us</h1>
      <p>
        Get in touch with our team for support, partnerships, or inquiries.
        <br /><br />
        📧 support@cognify.com<br />
        📞 +1 (555) 123-4567
      </p>
      <button
        onClick={() => window.location.href = '/'}
        className="contact-button"
      >
        🏠 Back to Home
      </button>
    </div>
  </div>
);

const Enhanced404Page = () => (
  <div className="not-found-page">
    <div className="not-found-card">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <button
        onClick={() => window.location.href = '/'}
        className="not-found-button"
      >
        🏠 Go Home
      </button>
    </div>
  </div>
);

function App() {
  console.log('App component rendering');
  
  return (
    <Router>
      <AuthProvider>
        <NavigationDebug />
         <SessionExpiredHandler />
         
        <NotificationProvider>
          <AppProvider>
            <div className="App">
              <Routes>
                {/* Test route */}
                <Route path="/test-settings" element={<TestSettingsPage />} />
                
                {/* Public routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<PublicRouteWrapper><Login /></PublicRouteWrapper>} />
                <Route path="/auth" element={<PublicRouteWrapper><AuthPage /></PublicRouteWrapper>} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />

                {/* Settings and help routes */}
                <Route path="/settings" element={<ProtectedRouteWrapper><SettingsPage /></ProtectedRouteWrapper>} />
                <Route path="/help" element={<ProtectedRouteWrapper><HelpPage /></ProtectedRouteWrapper>} />

                {/* Dashboard redirect */}
                <Route path="/dashboard" element={<DashboardRouteWrapper />} />
                
                {/* Role-specific dashboard routes */}
                <Route path="/student/dashboard" element={<ProtectedRouteWrapper allowedRoles={['student']}><StudentDashboard /></ProtectedRouteWrapper>} />
                <Route path="/teacher/dashboard" element={<ProtectedRouteWrapper allowedRoles={['teacher']}><TeacherDashboard /></ProtectedRouteWrapper>} />
                <Route path="/school/dashboard" element={<ProtectedRouteWrapper allowedRoles={['school', 'school_admin']}><SchoolDashboard /></ProtectedRouteWrapper>} />
                <Route path="/admin/dashboard" element={<ProtectedRouteWrapper allowedRoles={['admin']}><AdminDashboard /></ProtectedRouteWrapper>} />
                
                {/* Legacy dashboard routes */}
                <Route path="/student-dashboard" element={<Navigate to="/student/dashboard" replace />} />
                <Route path="/teacher-dashboard" element={<Navigate to="/teacher/dashboard" replace />} />
                <Route path="/school-dashboard" element={<Navigate to="/school/dashboard" replace />} />
                <Route path="/admin-dashboard" element={<Navigate to="/admin/dashboard" replace />} />
                
                {/* Student specific routes */}
                <Route path="/student/game/:gameId" element={<ProtectedRouteWrapper allowedRoles={['student']}></ProtectedRouteWrapper>} />
                <Route path="/student/recommendations/:studentId" element={<ProtectedRouteWrapper allowedRoles={['student']}><GameRecommendations /></ProtectedRouteWrapper>} />
                <Route path="/student/analytics/:studentId" element={<ProtectedRouteWrapper allowedRoles={['student']}><LearningAnalytics /></ProtectedRouteWrapper>} />
                 <Route path="/play-game/:gameId" element={<GamePage />} />
                {/* Teacher specific routes */}
                <Route path="/teacher/at-risk/:classId" element={<ProtectedRouteWrapper allowedRoles={['teacher']}><AtRiskStudents /></ProtectedRouteWrapper>} />
                <Route path="/teacher/class-insights/:classId" element={<ProtectedRouteWrapper allowedRoles={['teacher']}><ClassInsights /></ProtectedRouteWrapper>} />
                
                {/* School specific routes */}
                <Route path="/school/analytics/:schoolId" element={<ProtectedRouteWrapper allowedRoles={['school', 'school_admin']}><SchoolAnalytics /></ProtectedRouteWrapper>} />
                
                {/* Admin specific routes */}
                <Route path="/admin/game-effectiveness/:schoolId?" element={<ProtectedRouteWrapper allowedRoles={['admin']}><GameEffectiveness /></ProtectedRouteWrapper>} />
                
                {/* General protected routes */}
                <Route path="/game/:gameId" element={<ProtectedRouteWrapper allowedRoles={['student']}><GameInterface /></ProtectedRouteWrapper>} />
                <Route path="/reports" element={<ProtectedRouteWrapper allowedRoles={['teacher', 'school_admin', 'school', 'admin']}><Reports /></ProtectedRouteWrapper>} />
                
                {/* Role-based wildcard routes */}
                <Route path="/admin/*" element={<ProtectedRouteWrapper allowedRoles={['admin']}><AdminDashboard /></ProtectedRouteWrapper>} />
                <Route path="/school/*" element={<ProtectedRouteWrapper allowedRoles={['school', 'school_admin']}><SchoolDashboard /></ProtectedRouteWrapper>} />
                <Route path="/teacher/*" element={<ProtectedRouteWrapper allowedRoles={['teacher']}><TeacherDashboard /></ProtectedRouteWrapper>} />
                <Route path="/student/*" element={<ProtectedRouteWrapper allowedRoles={['student']}><StudentDashboard /></ProtectedRouteWrapper>} />
                
                {/* 404 fallback */}
                <Route path="*" element={<Enhanced404Page />} />
              </Routes>
            </div>
          </AppProvider>
        </NotificationProvider>
      </AuthProvider>
      
      {/* Global CSS */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .App {
          min-height: 100vh;
        }
        
        /* Loading container */
        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
        }
        
        .loading-card {
          display: flex;
          align-items: center;
          gap: 15px;
          background: rgba(15, 15, 35, 0.95);
          padding: 30px 40px;
          border-radius: 16px;
          border: 2px solid rgba(0, 255, 136, 0.3);
          backdrop-filter: blur(20px);
          color: #fff;
          font-size: 1.2rem;
        }
        
        .spinner {
          width: 24px;
          height: 24px;
          border: 3px solid rgba(0, 255, 136, 0.3);
          border-top: 3px solid #00ff88;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        /* Error container */
        .error-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
          color: #fff;
          padding: 20px;
        }
        
        .error-card {
          background: rgba(15, 15, 35, 0.95);
          padding: 30px;
          border-radius: 16px;
          border: 2px solid rgba(255, 0, 0, 0.5);
          max-width: 600px;
          text-align: center;
        }
        
        .error-button {
          margin-top: 20px;
          background: linear-gradient(45deg, #ff6b9d, #8c7ae6);
          border: none;
          border-radius: 8px;
          padding: 10px 20px;
          color: #000;
          cursor: pointer;
        }
        
        /* Page styles */
        .test-page, .about-page, .contact-page, .not-found-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          text-align: center;
          padding: 20px;
        }
        
        .test-card, .about-card, .contact-card, .not-found-card {
          background: rgba(15, 15, 35, 0.95);
          padding: 60px;
          border-radius: 24px;
          border: 2px solid rgba(0, 255, 136, 0.3);
          backdrop-filter: blur(20px);
          max-width: 600px;
        }
        
        .not-found-card {
          border: 2px solid rgba(255, 107, 157, 0.3);
        }
        
        .contact-card {
          border: 2px solid rgba(0, 168, 255, 0.3);
        }
        
        .test-button, .about-button, .contact-button, .not-found-button {
          margin-top: 30px;
          background: linear-gradient(45deg, #00ff88, #00a8ff);
          border: none;
          border-radius: 12px;
          padding: 16px 32px;
          font-size: 1.1rem;
          font-weight: 600;
          color: #000;
          cursor: pointer;
        }
        
        .contact-button {
          background: linear-gradient(45deg, #00a8ff, #8c7ae6);
        }
        
        .not-found-button {
          background: linear-gradient(45deg, #ff6b9d, #8c7ae6);
        }
        
        /* Responsive design */
        @media (max-width: 768px) {
          .loading-card, .error-card, .test-card, .about-card, .contact-card, .not-found-card {
            padding: 20px 30px;
            margin: 20px;
          }
          
          .spinner {
            width: 20px;
            height: 20px;
          }
        }
      `}</style>
    </Router>
  );
}

export default App;