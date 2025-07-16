# 🎮 Cognify Frontend

A modern, animated React frontend for the Cognify educational gaming platform that transforms gaming addiction into learning excellence.

![Cognify Banner](https://via.placeholder.com/800x300/0a0a0f/00f5ff?text=COGNIFY+%E2%9A%A1+Educational+Gaming+Platform)

## ✨ Features

### 🎨 **Stunning Neon UI Design**
- **Glass Morphism Effects** with animated backgrounds
- **Neon Color Palette** (Blue, Pink, Green, Purple)
- **Smooth Animations** using Framer Motion
- **Responsive Design** that works on all devices

### 🔐 **Multi-Role Authentication**
- **Admin Dashboard** - System management and analytics
- **School Dashboard** - Teacher and student management
- **Teacher Dashboard** - Class management and progress tracking
- **Student Dashboard** - Game playing and progress monitoring

### 🎮 **Interactive Gaming System**
- **Game Interface** with real-time scoring
- **Multiple Categories** (Algebra, Geometry, Arithmetic, etc.)
- **Difficulty Levels** (Easy, Medium, Hard)
- **Achievement System** with unlockable badges
- **Leaderboards** and performance tracking

### 📊 **Advanced Analytics**
- **Performance Charts** with animated visualizations
- **Progress Tracking** and improvement metrics
- **Detailed Reports** with exportable data
- **Real-time Statistics** and insights

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Modern web browser with ES6 support

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/cognify-frontend.git
cd cognify-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm start
```

4. **Open your browser**
Navigate to `http://localhost:3000`

## 🔑 Demo Accounts

Test the platform with these pre-configured accounts:

| Role | Email | Password | Features |
|------|-------|----------|----------|
| **Admin** | admin@cognify.com | admin123 | Full system management |
| **School** | school@cognify.com | school123 | Teacher & student oversight |
| **Teacher** | teacher@cognify.com | teacher123 | Class management |
| **Student** | student@cognify.com | student123 | Game playing & learning |

## 📁 Project Structure

```
cognify-frontend/
├── public/
│   ├── index.html              # Main HTML template
│   ├── manifest.json           # PWA manifest
│   └── favicon.ico             # App icon
├── src/
│   ├── components/             # Reusable components
│   │   ├── common/            # Shared components
│   │   │   ├── Header.js      # Navigation header
│   │   │   ├── Sidebar.js     # Navigation sidebar
│   │   │   └── LoadingSpinner.js
│   │   ├── forms/             # Form components
│   │   │   ├── LoginForm.js   # Authentication form
│   │   │   ├── RegisterForm.js
│   │   │   └── InputField.js  # Custom input component
│   │   ├── admin/             # Admin-specific components
│   │   ├── teacher/           # Teacher-specific components
│   │   ├── student/           # Student-specific components
│   │   └── charts/            # Data visualization
│   ├── pages/                 # Main page components
│   │   ├── Login.js           # Authentication page
│   │   ├── AdminDashboard.js  # Admin interface
│   │   ├── SchoolDashboard.js # School management
│   │   ├── TeacherDashboard.js# Teacher interface
│   │   ├── StudentDashboard.js# Student interface
│   │   ├── GameInterface.js   # Game playing interface
│   │   ├── Reports.js         # Analytics and reports
│   │   └── NotFound.js        # 404 error page
│   ├── context/               # React Context providers
│   │   ├── AuthContext.js     # Authentication state
│   │   └── AppContext.js      # Global app state
│   ├── services/              # API and external services
│   │   ├── api.js             # HTTP client
│   │   └── authService.js     # Authentication logic
│   ├── styles/                # CSS and styling
│   │   ├── globals.css        # Global styles & variables
│   │   ├── components.css     # Component-specific styles
│   │   ├── dashboard.css      # Dashboard layouts
│   │   └── responsive.css     # Mobile responsiveness
│   ├── utils/                 # Utility functions
│   │   ├── constants.js       # App constants
│   │   ├── helpers.js         # Helper functions
│   │   ├── validation.js      # Form validation
│   │   └── localStorage.js    # Local storage utilities
│   ├── App.js                 # Main app component
│   ├── App.css                # App-specific styles
│   ├── index.js               # React entry point
│   └── index.css              # Root styles
└── package.json               # Dependencies and scripts
```

## 🎯 Key Components

### **Authentication System**
- Role-based login with validation
- Protected routes and navigation
- Session management with JWT tokens
- Registration with role-specific fields

### **Dashboard Interfaces**
Each role has a customized dashboard:
- **Real-time statistics** and performance metrics
- **Quick actions** for common tasks
- **Activity feeds** showing recent events
- **Interactive charts** and data visualizations

### **Game Interface**
- **Immersive gameplay** with smooth animations
- **Real-time scoring** and progress tracking
- **Multiple question types** and difficulties
- **Achievement system** with instant feedback

### **Analytics & Reports**
- **Performance trends** with interactive charts
- **Detailed breakdowns** by subject and time
- **Comparison tools** for benchmarking
- **Export functionality** for data analysis

## 🎨 Design System

### **Color Palette**
```css
--neon-blue: #00f5ff      /* Primary brand color */
--neon-pink: #ff0080      /* Accent and warnings */
--neon-green: #39ff14     /* Success states */
--neon-purple: #bf00ff    /* Secondary accent */
--neon-orange: #ff6600    /* Alerts and attention */
```

### **Typography**
- **Headings**: Orbitron (Futuristic, tech-inspired)
- **Body Text**: Rajdhani (Clean, readable)
- **Code/Data**: Courier New (Monospace)

### **Animations**
- **Page Transitions**: Smooth fade and slide effects
- **Micro-interactions**: Hover and click feedback
- **Loading States**: Engaging spinners and progress bars
- **Data Visualization**: Animated chart rendering

## 🛠️ Technologies Used

### **Core Framework**
- **React 18** - Component-based UI framework
- **React Router 6** - Client-side routing
- **React Context** - State management

### **Styling & Animation**
- **CSS Custom Properties** - Dynamic theming
- **Framer Motion** - Advanced animations
- **Responsive Design** - Mobile-first approach

### **Development Tools**
- **Create React App** - Build tooling
- **ES6+ JavaScript** - Modern syntax
- **Mock Services** - Development data

## 📱 Responsive Design

The application is fully responsive and optimized for:

- 📱 **Mobile Phones** (320px - 768px)
- 📱 **Tablets** (768px - 1024px)
- 💻 **Desktops** (1024px - 1440px)
- 🖥️ **Large Screens** (1440px+)

### **Mobile Features**
- Touch-friendly interactions
- Collapsible navigation
- Optimized layouts
- Gesture support

## ⚡ Performance Optimizations

- **Code Splitting** - Lazy loading of routes
- **Image Optimization** - Responsive images
- **Bundle Analysis** - Optimized build size
- **Caching Strategies** - Efficient data loading

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🏗️ Building for Production

```bash
# Create production build
npm run build

# Serve production build locally
npm install -g serve
serve -s build
```

## 🔧 Configuration

### **Environment Variables**
Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_APP_NAME=Cognify
REACT_APP_VERSION=1.0.0
```

### **Customization**
- **Colors**: Modify CSS custom properties in `globals.css`
- **Branding**: Update logo and brand assets in `public/`
- **Features**: Toggle functionality in `utils/constants.js`

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### **Code Style**
- Use functional components with hooks
- Follow React best practices
- Maintain consistent formatting
- Add comments for complex logic

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 **Email**: support@cognify.com
- 📖 **Documentation**: [docs.cognify.com](https://docs.cognify.com)
- 🐛 **Issues**: [GitHub Issues](https://github.com/your-username/cognify-frontend/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/your-username/cognify-frontend/discussions)

## 🚀 What's Next?

### **Upcoming Features**
- 🎵 **Audio Support** - Sound effects and music
- 🌐 **Multi-language** - Internationalization
- 📱 **Mobile App** - React Native version
- 🤖 **AI Tutoring** - Personalized learning assistance
- 🎮 **Multiplayer Games** - Collaborative learning
- 📊 **Advanced Analytics** - Machine learning insights

---

<div align="center">

**Built with ❤️ by the Cognify Team**

[⭐ Star this repo](https://github.com/your-username/cognify-frontend) • [🐛 Report Bug](https://github.com/your-username/cognify-frontend/issues) • [💡 Request Feature](https://github.com/your-username/cognify-frontend/issues)

</div>