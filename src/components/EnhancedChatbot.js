import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// Define the API base URL - Update this to match your server's address
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const EnhancedChatbot = () => {
  // Chatbot states
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: 'bot',
      message: "Hi! I'm Cognify Assistant. I can help with platform questions or any general knowledge topics! How can I assist you today? 🤖",
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatMessagesRef = useRef(null);

  // Auto-scroll chat messages
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Comprehensive expanded chatbot knowledge base with detailed responses
const chatbotResponses = {
  greetings: [
    "Hello! Welcome to Cognify! How can I assist you today with our educational platform?",
    "Hi there! I'm here to help you with anything - from our platform features to educational resources. What would you like to know?",
    "Welcome to Cognify! I'm your AI assistant, ready to answer questions about our learning platform, pricing, or how to get started with our educational tools."
  ],
  
  thanks: [
    "You're welcome! I'm glad I could help. Is there anything else you'd like to know about Cognify's educational platform?",
    "Happy to assist! If you have any other questions about our learning tools or platform features, feel free to ask anytime.",
    "It's my pleasure to help! Don't hesitate to reach out if you need more information about our educational solutions or platform capabilities."
  ],
  
  goodbye: [
    "Goodbye! Feel free to chat again if you need assistance with Cognify's learning platform or educational resources.",
    "Have a great day! I'm here whenever you need information about our educational tools, pricing plans, or platform features.",
    "Take care! Remember you can return anytime for help with Cognify's educational solutions or to learn more about our platform."
  ],
  
  identity: [
    "I'm Cognify Assistant, designed specifically to help with questions about the Cognify learning platform. I can provide information about our educational tools, pricing options, user roles, and technical support.",
    "I'm your Cognify Assistant! I specialize in answering questions about our educational platform, including features, curriculum options, pricing plans, and how different users can make the most of our learning tools.",
    "I'm the AI assistant for Cognify, the innovative educational platform. I'm here to help explain our learning tools, pricing structure, user management, and how our platform adapts to different educational environments."
  ],
  
  capabilities: [
    "I can help with a wide range of questions about Cognify's educational platform. This includes explaining our features like adaptive learning paths, project-based activities, and assessment tools. I can also provide information about pricing plans, user roles, technical requirements, and how to get started.",
    "I'm here to assist with all aspects of the Cognify platform. I can explain our curriculum options, how our analytics work, pricing details for different institution sizes, account management, and integration capabilities with other educational systems.",
    "My capabilities include providing detailed information about Cognify's educational tools, explaining how our platform benefits different types of users, clarifying pricing and subscription options, troubleshooting common issues, and helping you understand how our platform compares to other educational technologies."
  ],
  
  general: [
    "I'd be happy to help with that. Cognify is an educational platform designed to make learning engaging and effective through personalized experiences. Could you provide more details about what specific aspect you'd like to know more about?",
    "I can answer questions about Cognify's educational features, pricing, roles, or registration process. Our platform serves K-12 schools, higher education, and professional training environments with customizable learning experiences. What specific information are you looking for?",
    "I'm here to help with all your questions about the Cognify educational platform. We offer innovative learning tools for students of all ages, with features designed to increase engagement and improve outcomes. Could you be more specific about what you'd like to learn?"
  ],
  
  features: [
    "Cognify offers a comprehensive suite of educational tools including: 1) Adaptive Learning Paths that adjust to each student's progress and learning style, 2) Interactive Project-Based Activities that apply concepts to real-world scenarios, 3) Comprehensive Analytics Dashboard for tracking progress and identifying areas for improvement, 4) Collaborative Learning Spaces where students can work together, and 5) Curriculum Builder tools for educators to create custom content aligned with their teaching objectives.",
    
    "Our platform features several innovative educational tools: First, our AI-powered learning system personalizes content based on each student's strengths and challenges. Second, our gamified elements increase engagement through points, badges, and achievement systems. Third, our comprehensive assessment tools provide immediate feedback and detailed progress reports. Fourth, our resource library contains thousands of learning materials across all subjects. Finally, our platform includes communication tools to connect students, teachers, and parents in a collaborative learning environment.",
    
    "Cognify's educational platform stands out with these key features: 1) Personalized Learning Algorithms that adapt difficulty and content to each student, 2) Immersive Interactive Simulations for science, math, and other subjects, 3) Comprehensive Progress Tracking with visual dashboards for students and educators, 4) Multi-format Content Library with videos, readings, quizzes, and hands-on activities for diverse learning styles, and 5) Accessibility Tools making education available to learners with different needs and abilities."
  ],
  
  pricing: [
    "Cognify offers three comprehensive pricing tiers to meet different educational needs:\n\n1) Basic Plan ($5/student/month): Includes core learning tools, standard curriculum content, basic progress reports, and email support. Perfect for individual classrooms or small schools with up to 100 students.\n\n2) Premium Plan ($10/student/month): Includes everything in Basic, plus advanced analytics, custom curriculum tools, priority support, parent portal access, and API integration capabilities. Ideal for schools with 100-500 students seeking deeper insights and customization.\n\n3) Enterprise Plan (Custom pricing): Includes everything in Premium, plus dedicated account manager, white-labeled platform, custom feature development, on-site training, and 24/7 support. Designed for districts or large institutions with 500+ students.\n\nAll plans include a 14-day free trial. Would you like details about a specific plan?",
    
    "We've designed our pricing structure to be flexible for educational institutions of all sizes:\n\n• Basic Tier ($5/student/month): Essential learning tools including standard curriculum content across subjects, basic assessment tools, student progress tracking, and standard email support. Best for smaller implementations.\n\n• Premium Tier ($10/student/month): Comprehensive features including advanced performance analytics, custom curriculum builder, content authoring tools, priority support with 24-hour response time, parent access portal, and LMS integration. Ideal for schools wanting deeper customization.\n\n• Enterprise Tier (Custom pricing): Full-featured solution with white-labeling options, dedicated support representative, custom development for specific needs, advanced security features, bulk user management, and professional development training. Perfect for districts and large institutions.\n\nWe also offer special discounts for non-profits and multi-year commitments. Would you like to discuss which option might be best for your needs?",
    
    "Cognify's pricing is structured to provide value at every level of implementation:\n\n1) Basic Package - $5 per student monthly:\n• Full access to standard curriculum materials\n• Basic analytics and progress reports\n• Up to 5 teacher accounts\n• Standard assessment tools\n• Email support with 48-hour response time\n\n2) Premium Package - $10 per student monthly:\n• Everything in Basic plus:\n• Advanced analytics and learning insights\n• Unlimited teacher accounts\n• Custom curriculum creation tools\n• Integration with popular LMS platforms\n• Priority support with 24-hour response time\n• Parent/guardian access portal\n\n3) Enterprise Package - Custom pricing based on institution size:\n• Everything in Premium plus:\n• Dedicated account manager\n• Custom feature development\n• White-labeled platform with your branding\n• Advanced security and administration features\n• On-site training and implementation support\n• 24/7 premium support\n\nAll packages include our core adaptive learning technology. We offer monthly or annual billing with a 20% discount for annual commitments."
  ],
  
  roles: [
    "Cognify supports four distinct user roles, each with tailored capabilities:\n\n1) System Administrators have complete platform control, including user management, system settings, data access, security configurations, and analytics across the entire implementation. They can configure the platform for their institution's specific needs.\n\n2) School Administrators manage their specific institution within the platform, including teacher onboarding, student roster management, school-wide analytics, curriculum oversight, and reporting. They ensure the platform aligns with their school's educational objectives.\n\n3) Teachers create and manage learning content, track student progress, provide feedback, customize learning paths, generate reports, and communicate with students and parents. They have tools to differentiate instruction and intervene when students need support.\n\n4) Students access personalized learning paths, complete assignments and projects, track their own progress, participate in collaborative activities, and receive immediate feedback. The student interface is engaging, intuitive, and designed to promote self-directed learning.",
    
    "Our platform is designed with tailored interfaces for different educational roles:\n\n• System Administrators: The command center for platform management. Capabilities include managing all users and roles, configuring system-wide settings, overseeing data security and privacy, accessing institution-wide analytics, and managing integrations with other systems. Suitable for IT directors and technology coordinators.\n\n• School Administrators: Tools for managing educational implementation. Features include school-specific dashboards, teacher supervision tools, student enrollment management, curriculum oversight, performance analytics, and reporting capabilities. Designed for principals, curriculum directors, and department heads.\n\n• Teachers: Comprehensive instructional toolkit. Includes lesson planning and delivery, assignment creation and grading, student progress monitoring, differentiated instruction tools, communication channels with students and parents, and collaborative teaching features. Empowers educators to focus on effective teaching.\n\n• Students: Engaging learning environment. Provides access to personalized content, interactive learning activities, progress tracking, digital portfolios, peer collaboration tools, and immediate feedback systems. Designed to be intuitive and motivating for learners of all ages.",
    
    "Cognify's role-based system ensures everyone has the right tools for their educational needs:\n\n1) System Administrators (Technical Oversight):\n• Complete user management for all roles\n• System configuration and customization\n• Data management and security controls\n• Integration with existing school systems\n• Institution-wide analytics and reporting\n• Software update management\n\n2) School Administrators (Educational Leadership):\n• School performance dashboards\n• Curriculum and standards alignment\n• Teacher performance insights\n• Student cohort management\n• Resource allocation tools\n• School-wide communication features\n\n3) Teachers (Instructional Facilitators):\n• Curriculum delivery and customization\n• Assignment creation and management\n• Real-time student monitoring\n• Intervention and support tools\n• Assessment and grading systems\n• Parent communication channels\n• Collaborative teaching features\n\n4) Students (Active Learners):\n• Personalized learning dashboard\n• Interactive lesson content\n• Practice activities and assessments\n• Progress visualization tools\n• Digital portfolio of work\n• Peer collaboration spaces\n• Achievement recognition system"
  ],
  
  registration: [
    "Getting started with Cognify is quick and straightforward! Here's the complete registration process:\n\n1) Click the 'Register' button on our homepage\n2) Select your role (Admin, School Admin, Teacher, or Student)\n3) Enter your email address and create a secure password\n4) For Admins and School Admins: Enter your institution information and verification details\n5) For Teachers: Enter your school code (provided by your administrator) and subject areas\n6) For Students: Enter your class code (provided by your teacher) and grade level\n7) Complete your profile with basic information\n8) Verify your email address via the confirmation link\n9) Log in to access your personalized dashboard\n\nThe entire process takes less than 5 minutes, and our setup wizard will guide you through configuring your initial settings. Need help? Our support team is available via live chat during the registration process.",
    
    "Joining Cognify is easy and takes just a few minutes! Follow these steps to get started:\n\n• Step 1: Visit cognify.edu/register or click the 'Register' button on our homepage\n• Step 2: Choose your account type (Admin, School, Teacher, or Student)\n• Step 3: Create your account with email and password (or use Google/Microsoft SSO if your institution has enabled it)\n• Step 4: Enter the required information for your role:\n  - Administrators: Institution details and verification\n  - Teachers: School affiliation and subject areas\n  - Students: Class code or school email domain\n• Step 5: Complete your personal profile\n• Step 6: Take a quick platform tour to learn key features\n• Step 7: Start using Cognify!\n\nFor bulk registration (for multiple students or teachers), administrators can use our CSV upload feature or API integration. Our onboarding specialists are available for guided setup for schools and districts.",
    
    "To join Cognify, simply follow our streamlined registration process:\n\n1. Navigate to the Registration Page: Click 'Register' on the Cognify homepage or go directly to cognify.edu/signup\n\n2. Select Your Role: Choose from Admin, School Admin, Teacher, or Student options. Each role has a tailored experience.\n\n3. Create Your Account:\n   • Enter your email address (use your school email if applicable)\n   • Create a secure password\n   • For students under 13: A parent/guardian email will be required for consent\n\n4. Complete Role-Specific Information:\n   • Administrators: School details, position, verification documents\n   • Teachers: School affiliation, grades taught, subject areas\n   • Students: Class code or student ID from your teacher\n\n5. Verify Your Account: Click the link in the verification email\n\n6. Set Up Your Profile: Add your name, profile picture, and preferences\n\n7. Begin Orientation: Follow the interactive tutorial to learn the platform basics\n\nOnce registered, you'll have immediate access to your personalized dashboard. The entire process typically takes 3-5 minutes."
  ],
  
  support: [
    "We offer comprehensive support for all Cognify users. Here are your support options:\n\n1) In-App Help: Access our searchable knowledge base, video tutorials, and guided tours directly within the platform by clicking the '?' icon in the top corner.\n\n2) Email Support: Contact our team at support@cognify.edu with any questions or issues. Basic tier users receive responses within 48 hours, while Premium and Enterprise users enjoy priority response times.\n\n3) Live Chat: Available Monday-Friday, 9am-6pm EST for real-time assistance. Premium and Enterprise users have extended hours.\n\n4) Phone Support: Enterprise customers receive dedicated phone support with direct access to our technical team.\n\n5) Community Forums: Connect with other educators using Cognify to share best practices and solutions.\n\n6) Scheduled Training: We offer both free webinars and custom training sessions for teams.\n\nFor urgent technical issues, our status page at status.cognify.edu provides real-time platform updates.",
    
    "Cognify provides multiple support channels to ensure you get help when you need it:\n\n• Knowledge Base: Our comprehensive self-service portal at help.cognify.edu contains hundreds of articles, tutorial videos, and step-by-step guides organized by role and feature.\n\n• Support Team: Our dedicated education specialists are available through:\n  - Email: support@cognify.edu (24-48 hour response time)\n  - Live Chat: Available on weekdays from 9am-6pm EST\n  - Scheduled Consultations: Book 1:1 help sessions through your dashboard\n\n• Administrator Assistance: School administrators have access to a dedicated support channel with priority response times.\n\n• Regular Webinars: We host free training sessions each month covering different platform features and best practices.\n\n• Implementation Specialists: Enterprise customers receive personalized onboarding and ongoing support from a dedicated team member.\n\n• Professional Development: We offer certified training programs for educators looking to master the platform.\n\nOur support team includes former educators who understand the unique challenges of educational technology implementation.",
    
    "We're committed to supporting your success with Cognify through these resources:\n\n1) Direct Support Channels:\n• Email Support: Available to all users at help@cognify.edu\n• Live Chat: Available weekdays 8am-8pm EST\n• Phone Support: Available for Premium and Enterprise customers\n• Dedicated Account Manager: For Enterprise customers\n\n2) Self-Service Resources:\n• Comprehensive Help Center with searchable articles\n• Video tutorial library covering all major features\n• Downloadable user guides for each role\n• Interactive walkthrough tutorials within the platform\n• FAQ section addressing common questions\n\n3) Community and Training:\n• User community forums moderated by our team\n• Monthly webinar sessions on platform features\n• Educator discussion groups by subject area\n• Best practice sharing network\n\n4) Technical Assistance:\n• Integration support for IT administrators\n• Data migration assistance\n• Security documentation and compliance information\n• API documentation for custom implementations\n\nWe prioritize support tickets based on urgency and plan level, with most requests addressed within 24 hours."
  ],
  
  // Additional categories for educational topics
  mathematics: [
    "Cognify's mathematics curriculum is comprehensive and engaging, covering everything from basic arithmetic to advanced calculus. Our approach combines interactive problem-solving, visual demonstrations, and real-world applications. Students progress through personalized learning paths that adapt to their skill level, with instant feedback to reinforce concepts. Our math modules include dynamic visualizations that bring abstract concepts to life, making even complex topics accessible. Teachers can track progress through detailed analytics and identify areas where students may need additional support.",
    
    "Our mathematics program leverages technology to make learning both effective and engaging. Students explore math concepts through interactive exercises, games, and simulations that provide concrete representations of abstract ideas. The curriculum covers number sense, algebra, geometry, statistics, calculus, and more, aligned with major educational standards. Each lesson includes varied practice formats, from basic skill-building to complex problem-solving and critical thinking challenges. Our adaptive system identifies knowledge gaps and automatically provides targeted remediation to ensure mastery before moving to more advanced topics.",
    
    "Cognify's approach to mathematics education emphasizes conceptual understanding alongside procedural fluency. Our comprehensive curriculum spans K-12 mathematics and beyond, with each grade level building systematically on previous knowledge. Interactive tools allow students to manipulate equations, geometric shapes, graphs, and data sets to discover mathematical relationships themselves. Regular assessments include both formative checks for understanding and summative evaluations, with detailed reports for students and teachers. For advanced students, we offer enrichment through mathematical modeling, competitions, and real-world applications in science, engineering, and finance."
  ],
  
  science: [
    "Cognify's science curriculum embraces the scientific method through interactive virtual labs and simulations. Students can conduct experiments that would be impossible or impractical in a physical classroom, from dissecting virtual organisms to manipulating atomic structures. Our modules cover biology, chemistry, physics, earth science, and environmental science with high-quality visualizations and animations that clarify complex processes. The curriculum balances content knowledge with scientific practices, encouraging students to make hypotheses, collect and analyze data, and draw evidence-based conclusions. Assessments include both traditional quizzes and authentic performance tasks like lab reports and scientific explanations.",
    
    "Our science program makes abstract concepts concrete through immersive digital experiences. Students can observe cell division in real-time, build and test virtual circuits, explore geological formations, or witness chemical reactions at the molecular level. The curriculum is aligned with Next Generation Science Standards, emphasizing cross-cutting concepts and the integration of science with technology, engineering, and mathematics. Interactive simulations allow students to change variables and immediately see the effects, developing their intuition about scientific principles. Teacher tools include ready-to-use lesson plans, demonstration guides, discussion prompts, and formative assessments.",
    
    "Cognify's approach to science education combines rigorous content with engaging experiences. Our platform includes hundreds of interactive simulations and virtual labs across all major scientific disciplines. Students can explore ecosystems, investigate forces and motion, analyze chemical bonding, or study astronomical phenomena through guided inquiry activities. The curriculum emphasizes scientific literacy and critical thinking, teaching students to evaluate evidence and distinguish between scientific and non-scientific claims. Special modules focus on contemporary issues like climate science, genetics, and renewable energy, helping students connect classroom learning to real-world challenges."
  ],
  
  coding: [
    "Cognify's coding and computer science curriculum teaches programming through creative projects rather than abstract exercises. Beginning with block-based coding for younger students, the program gradually transitions to text-based languages like Python, JavaScript, and Java. Students create games, animations, websites, and apps while learning fundamental programming concepts like variables, loops, conditionals, and functions. Our platform includes an integrated code editor with syntax highlighting, error checking, and debugging tools designed specifically for educational use. Advanced modules cover data structures, algorithms, and specialized topics like web development, mobile apps, and artificial intelligence.",
    
    "Our approach to teaching coding emphasizes computational thinking and creative problem-solving. Students learn to break down complex problems, recognize patterns, and develop algorithmic solutions through engaging projects. The curriculum is designed as a coherent progression from elementary through high school, with appropriate challenges for each developmental stage. Interactive tutorials provide immediate feedback as students code, highlighting both errors and efficient solutions. Collaborative features allow for pair programming and code review activities. Teachers receive detailed analytics on student progress, including specific concepts that may need reinforcement.",
    
    "Cognify's computer science program goes beyond just coding to develop comprehensive digital literacy. While students learn programming languages and techniques, they also explore broader concepts like data analysis, cybersecurity, and ethical computing. Project-based learning is central to our approach, with students creating digital artifacts that solve authentic problems or express creative ideas. The curriculum integrates computer science with other subjects, showing how coding can be applied in art, music, science, and mathematics. For advanced students, we offer specialized tracks in game development, data science, and web applications, with industry-standard tools and practices."
  ],
  
  language: [
    "Cognify's language arts curriculum develops strong communication skills through a balance of reading, writing, speaking, and listening activities. Our comprehensive digital library includes diverse texts from various genres, cultures, and time periods, with interactive features to support comprehension and analysis. Writing instruction covers multiple genres and purposes, from narrative and creative writing to informational and argumentative texts. The platform includes tools for drafting, revising, and publishing, with scaffolded support for the writing process. Grammar and vocabulary instruction is contextualized within authentic reading and writing tasks rather than isolated exercises.",
    
    "Our language arts program emphasizes both skill development and the joy of literacy. Students engage with high-quality texts through interactive close reading activities, guided discussions, and multimedia annotations. The writing curriculum includes mentor texts, customizable graphic organizers, and targeted mini-lessons on craft and conventions. Automated feedback on writing provides guidance on structure, clarity, and mechanics while leaving substantive revision decisions to students and teachers. The platform also includes speech recognition technology for reading fluency practice and multimedia creation tools for digital storytelling projects.",
    
    "Cognify's approach to language arts integrates traditional literacy with digital communication skills. Students analyze both classic literature and contemporary media, developing critical thinking skills applicable across text types. The writing program balances structured analytical writing with creative expression and authentic communication tasks. Personalized reading recommendations help students find texts at their level that align with their interests, building reading stamina and engagement. Collaborative features support literature circles, peer editing, and group publishing projects. Assessments include both traditional measures of reading comprehension and writing proficiency as well as performance tasks that demonstrate applied communication skills."
  ]
};

  // Enhanced isAppRelatedQuestion function
  const isAppRelatedQuestion = (message) => {
    const appKeywords = [
      'cognify', 'platform', 'app', 'register', 'login', 'feature', 'price', 
      'cost', 'plan', 'role', 'admin', 'teacher', 'student', 'support', 'help'
    ];
    
    // Common simple messages that shouldn't need API calls
    const commonPhrases = [
      'hi', 'hello', 'hey', 'hiii', 'hiiii', 'hiya', 'heya', 'yo', 
      'how are you', 'what\'s up', 'sup', 'good morning', 'good afternoon',
      'good evening', 'thanks', 'thank you', 'bye', 'goodbye',
      'what can you do', 'who are you', 'tell me about yourself'
    ];
    
    const userMessageLower = message.toLowerCase().trim();
    
    // Check for exact matches or starting phrases
    const isCommonPhrase = commonPhrases.some(phrase => 
      userMessageLower === phrase || 
      userMessageLower.startsWith(phrase + ' ') ||
      userMessageLower.endsWith(' ' + phrase));
      
    return appKeywords.some(keyword => userMessageLower.includes(keyword)) || isCommonPhrase;
  };

  /// Enhanced response generation function with better follow-up detection
const getPlatformResponse = (userMessage) => {
  const message = userMessage.toLowerCase().trim();
  
  // Check for greeting patterns
  if (message === 'hi' || message === 'hello' || message === 'hey' || 
      message.startsWith('hi ') || message.startsWith('hello ') || 
      message.includes('good morning') || message.includes('good afternoon') || 
      message.includes('good evening') || message.includes('hey') || 
      message.includes('hii')) {
    return getRandomResponse('greetings');
  } 
  // Gratitude detection
  else if (message.includes('thank') || message.includes('thanks')) {
    return getRandomResponse('thanks');
  } 
  // Farewell detection
  else if (message.includes('bye') || message.includes('goodbye') || message.includes('see you')) {
    return getRandomResponse('goodbye');
  } 
  // Identity questions
  else if (message.includes('who are you') || message.includes('what are you') || 
           message.includes('tell me about yourself') || message.includes('your name')) {
    return getRandomResponse('identity');
  }
  // Capability questions  
  else if (message.includes('what can you do') || message.includes('how can you help') || 
           message.includes('what do you do') || message.includes('your capabilities')) {
    return getRandomResponse('capabilities');
  }
  // Small talk
  else if (message.includes('how are you') || message.includes('what\'s up') || message.includes('sup')) {
    return "I'm doing great, thanks for asking! How can I help you today?";
  } 
  // Improved pricing questions detection - look for pricing keywords and follow-up patterns
  else if (message.includes('price') || message.includes('cost') || message.includes('plan') || 
           message.includes('tier') || message.includes('subscription') || message.includes('pay') ||
           message.includes('fee') || message.includes('pricing') || 
           // Detect follow-up questions to pricing
           message.includes('tell me more about') || message.includes('different') ||
           (message.includes('yes') && message.includes('please')) ||
           message.includes('what are the') || message.includes('can you explain')) {
    // Add more detailed pricing responses
    const pricingResponses = [
      "Cognify offers three main tiers: Basic ($5/student/month), Premium ($10/student/month), and Enterprise (custom pricing). Each tier includes progressively more features. The Basic plan includes core learning tools, Premium adds advanced analytics and customization, while Enterprise offers full white-labeling and dedicated support.",
      "Our pricing structure is designed to be flexible: Basic tier ($5/student/month) for essential learning tools, Premium tier ($10/student/month) for advanced features and analytics, and Enterprise tier for institutions needing custom solutions. Would you like details on a specific tier?",
      "We offer several pricing options: Basic ($5/student/month) includes essential features, Premium ($10/student/month) adds advanced analytics and curriculum tools, and Enterprise provides custom solutions for larger institutions. We also offer special discounts for schools and educational non-profits."
    ];
    
    // Return a random detailed pricing response
    return pricingResponses[Math.floor(Math.random() * pricingResponses.length)];
  } 
  // Feature questions
  else if (message.includes('feature') || 
          (message.includes('what') && message.includes('about')) || 
          (message.includes('tell') && message.includes('about'))) {
    return getRandomResponse('features');
  } 
  // Role questions
  else if (message.includes('role') || message.includes('admin') || 
           message.includes('teacher') || message.includes('student')) {
    return getRandomResponse('roles');
  } 
  // Registration questions
  else if (message.includes('register') || message.includes('sign up') || 
           message.includes('start') || message.includes('join')) {
    return getRandomResponse('registration');
  } 
  // Support questions
  else if (message.includes('help') || message.includes('support') || message.includes('contact')) {
    return getRandomResponse('support');
  } 
  // Fallback for anything else
  else {
    return getRandomResponse('general');
  }
};
  // Add educational responses function
  const getEducationalResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Educational topic detection
    if (message.includes('math') || message.includes('mathematics')) {
      return "Cognify offers excellent mathematics learning modules with interactive exercises and real-time feedback. Our math curriculum covers everything from basic arithmetic to advanced calculus.";
    }
    else if (message.includes('science') || message.includes('biology') || 
             message.includes('chemistry') || message.includes('physics')) {
      return "Our science courses include interactive simulations and virtual labs. Cognify makes complex scientific concepts easy to understand through visualization and hands-on experiments.";
    }
    else if (message.includes('coding') || message.includes('programming') || 
             message.includes('computer science')) {
      return "Cognify's coding curriculum teaches programming through project-based learning. Students build real applications while learning fundamental computer science concepts.";
    }
    else if (message.includes('language') || message.includes('english') || 
             message.includes('writing')) {
      return "Our language arts program focuses on developing strong communication skills through creative writing, critical reading, and multimedia projects.";
    }
    // Default educational response
    return "Cognify provides personalized learning experiences across many subjects including math, science, coding, and language arts. Our platform adapts to each student's learning style and pace. Would you like to know about a specific subject area?";
  };

  // Function to get a random response from a category
  const getRandomResponse = (category) => {
    const responses = chatbotResponses[category];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  // Function to get a response for general knowledge questions via backend API
  const getGeneralKnowledgeResponse = async (userMessage) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/chatbot/general`, {
        message: userMessage
      });
      
      return response.data.response;
    } catch (error) {
      console.error("API error:", error);
      return "I'm having trouble connecting to my knowledge base right now. For platform-specific questions I can still help, or please try asking general questions again later.";
    }
  };

  // Function to get weather information via backend API
  const getWeatherInfo = async (location) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/chatbot/weather`, {
        location
      });
      
      return response.data.response;
    } catch (error) {
      console.error("Weather API error:", error);
      return "I'm having trouble getting weather information right now. Please try again later.";
    }
  };

  // Function to get news information via backend API
  const getNewsInfo = async (topic) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/chatbot/news`, {
        topic
      });
      
      return response.data.response;
    } catch (error) {
      console.error("News API error:", error);
      return "I'm having trouble getting the latest news right now. Please try again later.";
    }
  };

  // Function to extract location from a weather query
  const extractLocation = (message) => {
    const weatherPatterns = [
      /weather\s+in\s+([a-zA-Z\s]+)(?:$|\?|\.)/i,
      /weather\s+(?:for|at)\s+([a-zA-Z\s]+)(?:$|\?|\.)/i,
      /weather\s+([a-zA-Z\s]+)(?:$|\?|\.)/i,
      /how'?s\s+the\s+weather\s+in\s+([a-zA-Z\s]+)(?:$|\?|\.)/i,
      /what'?s\s+the\s+weather\s+in\s+([a-zA-Z\s]+)(?:$|\?|\.)/i
    ];
    
    for (const pattern of weatherPatterns) {
      const match = message.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    
    return null;
  };

  // Function to extract topic from a news query
  const extractNewsTopic = (message) => {
    const newsPatterns = [
      /news\s+(?:about|on)\s+([a-zA-Z\s]+)(?:$|\?|\.)/i,
      /news\s+(?:for|related\s+to)\s+([a-zA-Z\s]+)(?:$|\?|\.)/i,
      /headlines\s+(?:about|on)\s+([a-zA-Z\s]+)(?:$|\?|\.)/i,
      /what'?s\s+(?:happening|going\s+on)\s+with\s+([a-zA-Z\s]+)(?:$|\?|\.)/i
    ];
    
    for (const pattern of newsPatterns) {
      const match = message.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    
    return null;
  };

  // Determine question type and route to appropriate API - Now mostly replaced by local logic
  const classifyAndRouteQuestion = async (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Still keep weather and news logic in case we want to use them later
    // Check for weather questions
    if (message.includes('weather')) {
      const location = extractLocation(message);
      if (location) {
        return "I can tell you that weather conditions vary based on location and season. For the most current weather information, please check a weather service like weather.com or your local weather app.";
      }
    }
    
    // Check for news questions
    if (message.includes('news') || message.includes('headlines')) {
      const topic = extractNewsTopic(message);
      if (topic) {
        return `For the latest news on ${topic}, I recommend checking a news website or app. News changes rapidly, and I want to make sure you have the most current information.`;
      }
    }
    
    // Instead of calling the API, return a generic response
    if (message.includes('learn') || message.includes('course') || 
        message.includes('subject') || message.includes('study') ||
        message.includes('education')) {
      return getEducationalResponse(userMessage);
    }
    
    // Default fallback response
    return "I specialize in answering questions about the Cognify platform. For other topics, please ask specific questions about our educational features, user roles, or how to get started with Cognify.";
  };

  // Updated message handling function
  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: currentMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    // Determine response type
    setTimeout(() => {
      let botResponse;
      
      // Check if app-related
      if (isAppRelatedQuestion(currentMessage)) {
        botResponse = getPlatformResponse(currentMessage);
      } 
      // Check if it might be about weather
      else if (currentMessage.toLowerCase().includes('weather')) {
        const location = extractLocation(currentMessage);
        if (location) {
          botResponse = `The weather varies throughout the day in ${location}. For real-time weather information, I recommend checking a dedicated weather service or app.`;
        } else {
          botResponse = classifyAndRouteQuestion(currentMessage);
        }
      }
      // Check if it might be about news
      else if (currentMessage.toLowerCase().includes('news') || currentMessage.toLowerCase().includes('headlines')) {
        const topic = extractNewsTopic(currentMessage);
        if (topic) {
          botResponse = `For the latest news on ${topic}, I recommend checking a reliable news source. News changes quickly, and I want to ensure you have the most up-to-date information.`;
        } else {
          botResponse = classifyAndRouteQuestion(currentMessage);
        }
      }
      // Check if it's an educational topic
      else if (currentMessage.toLowerCase().includes('learn') || 
               currentMessage.toLowerCase().includes('course') || 
               currentMessage.toLowerCase().includes('subject') ||
               currentMessage.toLowerCase().includes('study') ||
               currentMessage.toLowerCase().includes('education')) {
        botResponse = getEducationalResponse(currentMessage);
      }
      // Fallback to a general response
      else {
        botResponse = "I specialize in answering questions about the Cognify platform. For other topics, please ask specific questions about our educational features, user roles, or how to get started with Cognify.";
      }
      
      // Add bot response
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        message: botResponse,
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 3000
    }}>
      {/* Chatbot Toggle Button */}
      {!showChatbot && (
        <button
          onClick={() => setShowChatbot(true)}
          style={{
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #00ff88, #00d970)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            color: '#000',
            boxShadow: `
              0 0 30px rgba(0, 255, 136, 0.5),
              0 0 60px rgba(0, 255, 136, 0.3)
            `,
            transition: 'all 0.3s ease',
            animation: 'chatbotPulse 2s ease-in-out infinite'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1) rotate(5deg)';
            e.target.style.boxShadow = `
              0 0 40px rgba(0, 255, 136, 0.7),
              0 0 80px rgba(0, 255, 136, 0.4)
            `;
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1) rotate(0deg)';
            e.target.style.boxShadow = `
              0 0 30px rgba(0, 255, 136, 0.5),
              0 0 60px rgba(0, 255, 136, 0.3)
            `;
          }}
        >
          🤖
        </button>
      )}

      {/* Chatbot Window */}
      {showChatbot && (
        <div style={{
          width: '400px',
          height: '600px',
          background: 'rgba(10, 10, 10, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          border: '2px solid #00ff88',
          boxShadow: `
            0 0 40px rgba(0, 255, 136, 0.4),
            inset 0 0 30px rgba(0, 255, 136, 0.1)
          `,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          fontFamily: "'Inter', sans-serif"
        }}>
          {/* Chatbot Header */}
          <div style={{
            padding: '20px',
            background: 'linear-gradient(135deg, #00ff88, #00d970)',
            color: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '2px solid #00ff88'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem'
              }}>
                🤖
              </div>
              <div>
                <h3 style={{ 
                  margin: 0, 
                  fontSize: '1.2rem', 
                  fontWeight: 'bold',
                  fontFamily: "'Poppins', sans-serif" 
                }}>
                  AI Assistant
                </h3>
                <p style={{ 
                  margin: 0, 
                  fontSize: '0.8rem', 
                  opacity: 0.8,
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: '400' 
                }}>
                  {isTyping ? 'Typing...' : 'Online'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowChatbot(false)}
              style={{
                background: 'rgba(0, 0, 0, 0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                cursor: 'pointer',
                color: '#000',
                fontSize: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 0, 0, 0.2)';
                e.target.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(0, 0, 0, 0.1)';
                e.target.style.transform = 'scale(1)';
              }}
            >
              ×
            </button>
          </div>

          {/* Chat Messages */}
          <div
            ref={chatMessagesRef}
            style={{
              flex: 1,
              padding: '20px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '15px'
            }}
          >
            {chatMessages.map((message) => (
              <div
                key={message.id}
                style={{
                  display: 'flex',
                  justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                  animation: 'messageSlideIn 0.3s ease-out'
                }}
              >
                <div
                  style={{
                    maxWidth: '80%',
                    padding: '12px 16px',
                    borderRadius: message.type === 'user' ? '18px 18px 5px 18px' : '18px 18px 18px 5px',
                    background: message.type === 'user' 
                      ? 'linear-gradient(135deg, #00a8ff, #0078d4)'
                      : 'rgba(0, 255, 136, 0.1)',
                    border: message.type === 'user' 
                      ? 'none'
                      : '1px solid rgba(0, 255, 136, 0.3)',
                    color: message.type === 'user' ? '#000' : '#ffffff',
                    boxShadow: message.type === 'user'
                      ? '0 0 15px rgba(0, 168, 255, 0.3)'
                      : '0 0 15px rgba(0, 255, 136, 0.2)',
                    position: 'relative',
                    fontFamily: "'Inter', sans-serif"
                  }}
                >
                  <p style={{ 
                    margin: 0, 
                    lineHeight: '1.4', 
                    fontSize: '0.95rem',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: message.type === 'user' ? '500' : '300' 
                  }}>
                    {message.message}
                  </p>
                  <div style={{
                    fontSize: '0.7rem',
                    opacity: 0.7,
                    marginTop: '5px',
                    textAlign: message.type === 'user' ? 'right' : 'left',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: '300'
                  }}>
                    {message.timestamp.toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div style={{
                display: 'flex',
                justifyContent: 'flex-start'
              }}>
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '18px 18px 18px 5px',
                  background: 'rgba(0, 255, 136, 0.1)',
                  border: '1px solid rgba(0, 255, 136, 0.3)',
                  color: '#00ff88',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontFamily: "'Inter', sans-serif"
                }}>
                  <div style={{
                    display: 'flex',
                    gap: '3px'
                  }}>
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: '#00ff88',
                          animation: `typingDot 1.4s ease-in-out infinite ${i * 0.2}s`
                        }}
                      />
                    ))}
                  </div>
                  <span style={{ 
                    marginLeft: '5px', 
                    fontSize: '0.9rem',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: '300'
                  }}>
                    Assistant is thinking...
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div style={{
            padding: '20px',
            borderTop: '1px solid rgba(0, 255, 136, 0.3)',
            background: 'rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{
              display: 'flex',
              gap: '10px',
              alignItems: 'flex-end'
            }}>
              <textarea
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                style={{
                  flex: 1,
                  minHeight: '40px',
                  maxHeight: '100px',
                  padding: '12px 15px',
                  borderRadius: '20px',
                  border: '2px solid rgba(0, 255, 136, 0.3)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff',
                  fontSize: '0.95rem',
                  fontFamily: "'Inter', sans-serif",
                  resize: 'none',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#00ff88';
                  e.target.style.boxShadow = '0 0 15px rgba(0, 255, 136, 0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(0, 255, 136, 0.3)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!currentMessage.trim() || isTyping}
                style={{
                  width: '45px',
                  height: '45px',
                  borderRadius: '50%',
                  background: currentMessage.trim() && !isTyping 
                    ? 'linear-gradient(135deg, #00ff88, #00d970)'
                    : 'rgba(128, 128, 128, 0.3)',
                  border: 'none',
                  cursor: currentMessage.trim() && !isTyping ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: currentMessage.trim() && !isTyping ? '#000' : '#666',
                  fontSize: '1.2rem',
                  transition: 'all 0.3s ease',
                  flexShrink: 0
                }}
                onMouseEnter={(e) => {
                  if (currentMessage.trim() && !isTyping) {
                    e.target.style.transform = 'scale(1.1)';
                    e.target.style.boxShadow = '0 0 20px rgba(0, 255, 136, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Required CSS animations for the chatbot */}
      <style>{`
        @keyframes chatbotPulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 30px rgba(0, 255, 136, 0.5), 0 0 60px rgba(0, 255, 136, 0.3);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 40px rgba(0, 255, 136, 0.7), 0 0 80px rgba(0, 255, 136, 0.4);
          }
        }

        @keyframes messageSlideIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes typingDot {
          0%, 60%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          30% {
            transform: scale(1.2);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default EnhancedChatbot;