// src/pages/HelpPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HelpPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [expandedFaqs, setExpandedFaqs] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackData, setFeedbackData] = useState({
    type: 'question',
    message: '',
    email: user?.email || '',
    priority: 'medium'
  });
  // Track mouse position for glow effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const results = [];
    
    // Search through all FAQ items
    faqCategories.forEach(category => {
      category.faqs.forEach(faq => {
        if (
          faq.question.toLowerCase().includes(query) || 
          faq.answer.toLowerCase().includes(query)
        ) {
          results.push({
            id: faq.id,
            question: faq.question,
            answer: faq.answer,
            category: category.id
          });
        }
      });
    });
    
    setSearchResults(results);
  }, [searchQuery]);

  // Toggle FAQ expansion
  const toggleFaq = (faqId) => {
    setExpandedFaqs(prev => 
      prev.includes(faqId) 
        ? prev.filter(id => id !== faqId) 
        : [...prev, faqId]
    );
  };

  // Handle feedback form input
  const handleFeedbackChange = (e) => {
    const { name, value } = e.target;
    setFeedbackData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle feedback form submission
  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    
    // Here you would typically send this data to your API
    console.log('Feedback submitted:', feedbackData);
    
    // Show success message
    alert('Thank you for your feedback! Our team will review it shortly.');
    
    // Reset form and close
    setFeedbackData({
      type: 'question',
      message: '',
      email: user?.email || '',
      priority: 'medium'
    });
    setShowFeedbackForm(false);
  };
  // Feedback form component
  const FeedbackForm = () => (
    <div style={styles.feedbackFormContainer}>
      <div style={styles.feedbackForm}>
        <div style={styles.feedbackHeader}>
          <h3 style={styles.feedbackTitle}>Send Us Feedback</h3>
          <button 
            style={styles.closeButton}
            onClick={() => setShowFeedbackForm(false)}
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleFeedbackSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Feedback Type</label>
            <select
              name="type"
              value={feedbackData.type}
              onChange={handleFeedbackChange}
              style={styles.select}
              required
            >
              <option value="question">Question</option>
              <option value="problem">Problem/Bug</option>
              <option value="suggestion">Suggestion</option>
              <option value="praise">Praise</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Your Message</label>
            <textarea
              name="message"
              value={feedbackData.message}
              onChange={handleFeedbackChange}
              style={styles.textarea}
              placeholder="Please describe your question or feedback in detail..."
              rows={5}
              required
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              name="email"
              value={feedbackData.email}
              onChange={handleFeedbackChange}
              style={styles.input}
              placeholder="Your email for response"
              required
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Priority</label>
            <select
              name="priority"
              value={feedbackData.priority}
              onChange={handleFeedbackChange}
              style={styles.select}
            >
              <option value="low">Low - General Question</option>
              <option value="medium">Medium - Need Help Soon</option>
              <option value="high">High - Blocking Issue</option>
              <option value="critical">Critical - System Unavailable</option>
            </select>
          </div>
          
          <div style={styles.formActions}>
            <button type="submit" style={styles.submitButton}>
              Submit Feedback
            </button>
            <button 
              type="button" 
              style={styles.cancelButton}
              onClick={() => setShowFeedbackForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  // FAQ Categories
  const faqCategories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: '🚀',
      color: '#00ff88',
      faqs: [
        {
          id: 'gs-1',
          question: 'How do I create an account?',
          answer: 'To create an account, click on the "Register" button on the homepage and select your role (Student, Teacher, School Admin, or System Admin). Fill in the required information and submit the form. You will then be automatically logged in and redirected to your dashboard.'
        },
        {
          id: 'gs-2',
          question: 'What are the different user roles?',
          answer: 'Cognify supports four user roles: Students can access learning games and track their progress; Teachers can manage their classes and monitor student performance; School Admins can manage school-wide settings and accounts; System Admins have full administrative access to the platform.'
        },
        {
          id: 'gs-3',
          question: 'How do I navigate my dashboard?',
          answer: 'After logging in, you will be directed to your role-specific dashboard. The sidebar menu contains links to all available features. The main dashboard displays an overview of your activities, recent games, progress, and important notifications.'
        },
        {
          id: 'gs-4',
          question: 'Can I change my user role after registration?',
          answer: 'Currently, you cannot change your user role after registration. If you need to use a different role, you will need to register a new account with that role. In the future, we plan to add functionality for role changes subject to verification.'
        }
      ]
    },
    {
      id: 'student-help',
      title: 'For Students',
      icon: '👨‍🎓',
      color: '#00a8ff',
      faqs: [
        {
          id: 'st-1',
          question: 'How do I start playing educational games?',
          answer: 'From your student dashboard, navigate to the "Games" section. You\'ll find a catalog of available games categorized by subject and grade level. Click on any game to view details and click "Play" to begin. Your progress will be automatically saved.'
        },
        {
          id: 'st-2',
          question: 'How do I track my progress?',
          answer: 'Your progress is automatically tracked and displayed on your dashboard. You can also view detailed statistics by clicking on "My Progress" in the sidebar. This includes your performance in different subjects, completion rates, and achievements earned.'
        },
        {
          id: 'st-3',
          question: 'How do I earn badges and rewards?',
          answer: 'Badges and rewards are earned by completing games, achieving high scores, maintaining consistent practice streaks, and accomplishing specific challenges. Your earned badges are displayed in your profile and on your dashboard.'
        },
        {
          id: 'st-4',
          question: 'How can I ask for help with a specific concept?',
          answer: 'If you\'re struggling with a concept, you can use the "Ask a Question" feature available during gameplay or from your dashboard. Your question will be directed to your teacher, who can provide assistance. You can also access the "Learning Resources" section for additional help.'
        }
      ]
    },
    {
      id: 'teacher-help',
      title: 'For Teachers',
      icon: '👨‍🏫',
      color: '#8c7ae6',
      faqs: [
        {
          id: 'tc-1',
          question: 'How do I create a class?',
          answer: 'To create a class, navigate to the "Classes" section from your teacher dashboard and click on "Create New Class". Fill in the class details such as name, grade, subject, and description. You can then add students to your class by email address or by sharing the class code for self-enrollment.'
        },
        {
          id: 'tc-2',
          question: 'How do I monitor student progress?',
          answer: 'You can monitor student progress by visiting the "Student Analytics" section from your dashboard. Here, you can view individual student performance, class averages, and identify learning gaps. You can also generate detailed reports and export data for further analysis.'
        },
        {
          id: 'tc-3',
          question: 'How do I assign games to my students?',
          answer: 'From your dashboard, navigate to "Assignments". Click on "Create New Assignment", select the target class or individual students, choose the game or activity, set due dates, and specify any custom instructions. Students will receive a notification about the new assignment.'
        },
        {
          id: 'tc-4',
          question: 'How do I respond to student questions?',
          answer: 'Student questions appear in your "Messages" inbox. You can view, prioritize, and respond to them directly. Your responses will be sent to the student who asked the question. You can also create resource collections to address common questions.'
        }
      ]
    },
    {
      id: 'school-help',
      title: 'For School Admins',
      icon: '🏫',
      color: '#ff6b9d',
      faqs: [
        {
          id: 'sc-1',
          question: 'How do I add teachers to my school?',
          answer: 'From your school admin dashboard, navigate to "Staff Management" and click on "Add Teacher". You can either enter the teacher\'s email to send an invitation or create the account directly. You can also bulk import teachers using a CSV template.'
        },
        {
          id: 'sc-2',
          question: 'How do I manage subscriptions and billing?',
          answer: 'Access the "Subscription & Billing" section from your dashboard to view your current plan, usage statistics, billing history, and payment methods. You can upgrade, downgrade, or cancel your subscription, and download invoices for your records.'
        },
        {
          id: 'sc-3',
          question: 'How do I access school-wide analytics?',
          answer: 'School-wide analytics are available in the "Analytics" section of your dashboard. Here you can view aggregate data across all classes, compare performance between different grades or subjects, and identify trends over time to inform educational decisions.'
        },
        {
          id: 'sc-4',
          question: 'How do I customize the platform for my school?',
          answer: 'Navigate to "School Settings" to customize your school\'s profile, add your logo, set color themes, and configure other school-specific settings. You can also create custom categories for classes and manage which features are available to your teachers and students.'
        }
      ]
    },
    {
      id: 'technical-help',
      title: 'Technical Support',
      icon: '🔧',
      color: '#00a8ff',
      faqs: [
        {
          id: 'tech-1',
          question: 'What browsers are supported?',
          answer: 'Cognify works best on the latest versions of Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated for optimal performance. Internet Explorer is not supported. Mobile browsers are supported, but some advanced games may require a desktop or tablet.'
        },
        {
          id: 'tech-2',
          question: 'What should I do if I forgot my password?',
          answer: 'On the login page, click the "Forgot Password" link. Enter your email address and submit the form. You will receive an email with instructions to reset your password. If you don\'t receive the email, check your spam folder or contact support.'
        },
        {
          id: 'tech-3',
          question: 'How can I report a bug or technical issue?',
          answer: 'To report a bug or technical issue, navigate to the Help section and click on "Report a Problem", or use the feedback button available on most pages. Provide as much detail as possible including the steps to reproduce the issue, your device, browser, and screenshots if applicable.'
        },
        {
          id: 'tech-4',
          question: 'Is my data secure?',
          answer: 'Yes, we take data security seriously. All data is encrypted in transit and at rest. We comply with educational privacy regulations including FERPA and COPPA. For more information, please review our Privacy Policy and Data Security documentation.'
        }
      ]
    },
    {
      id: 'billing',
      title: 'Billing & Subscriptions',
      icon: '💰',
      color: '#ffcc00',
      faqs: [
        {
          id: 'bill-1',
          question: 'What subscription plans are available?',
          answer: 'We offer several subscription tiers: Free (basic access for individual students), Basic (for small classes), Premium (for schools with advanced features), and Enterprise (for districts with custom integrations). Each plan has different features, user limits, and support levels.'
        },
        {
          id: 'bill-2',
          question: 'How do I upgrade or downgrade my subscription?',
          answer: 'School administrators can manage subscriptions from the "Billing & Subscription" section of their dashboard. Select "Change Plan" to view available options. Changes take effect immediately for upgrades or at the end of the current billing cycle for downgrades.'
        },
        {
          id: 'bill-3',
          question: 'What payment methods do you accept?',
          answer: 'We accept major credit cards (Visa, MasterCard, American Express, Discover), PayPal, and purchase orders for schools and districts. For enterprise customers, we also offer invoice-based payments with net-30 terms.'
        },
        {
          id: 'bill-4',
          question: 'Do you offer discounts for schools?',
          answer: 'Yes, we offer volume discounts for schools based on the number of users. We also have special pricing for public schools, non-profits, and educational organizations. Contact our sales team for custom quotes and multi-year discounts.'
        }
      ]
    }
  ];

  // Get the current FAQ category
  const getCurrentCategory = () => {
    return faqCategories.find(category => category.id === activeCategory) || faqCategories[0];
  };
  return (
    <div style={styles.container}>
      {/* Background glow effect */}
      <div
        style={{
          position: 'fixed',
          width: '384px',
          height: '384px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #00ff88 0%, transparent 70%)',
          opacity: 0.2,
          pointerEvents: 'none',
          zIndex: 0,
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
          transition: 'all 0.1s ease'
        }}
      />
      
      {/* Page Header */}
      <header style={styles.header}>
        <button 
          onClick={() => navigate(-1)}
          style={styles.backButton}
        >
          ← Back
        </button>
        <div>
          <h1 style={styles.pageTitle}>Help Center</h1>
          <p style={styles.subtitle}>
            Find answers and support for all your questions
          </p>
        </div>
      </header>
      
      {/* Search Bar */}
      <div style={styles.searchContainer}>
        <div style={styles.searchWrapper}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search for help topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              style={styles.clearButton}
            >
              ×
            </button>
          )}
        </div>
      </div>
      {/* Main Content */}
      <div style={styles.content}>
        {/* If there are search results, show them */}
        {searchResults.length > 0 ? (
          <div style={styles.searchResults}>
            <h2 style={styles.searchResultsTitle}>
              Search Results for "{searchQuery}"
            </h2>
            <p style={styles.searchResultsCount}>
              Found {searchResults.length} results
            </p>
            
            <div style={styles.faqList}>
              {searchResults.map(result => (
                <div key={result.id} style={styles.faqItem}>
                  <div 
                    style={styles.faqQuestion}
                    onClick={() => toggleFaq(result.id)}
                  >
                    <span style={styles.faqQuestionText}>{result.question}</span>
                    <span style={styles.faqToggle}>
                      {expandedFaqs.includes(result.id) ? '−' : '+'}
                    </span>
                  </div>
                  
                  {expandedFaqs.includes(result.id) && (
                    <div style={styles.faqAnswer}>
                      {result.answer}
                      <div style={styles.faqCategory}>
                        Category: {faqCategories.find(cat => cat.id === result.category)?.title}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <button 
              style={styles.clearSearchButton}
              onClick={() => setSearchQuery('')}
            >
              Clear Search
            </button>
          </div>
        ) : (
            <>
            {/* Category Navigation */}
            <div style={styles.categoryNav}>
              {faqCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  style={{
                    ...styles.categoryButton,
                    ...(activeCategory === category.id && {
                      background: `rgba(${hexToRgb(category.color)}, 0.1)`,
                      borderColor: `rgba(${hexToRgb(category.color)}, 0.5)`,
                      color: category.color
                    })
                  }}
                >
                  <span style={styles.categoryIcon}>{category.icon}</span>
                  <span>{category.title}</span>
                </button>
              ))}
            </div>
            
            {/* FAQ Section */}
            <div style={styles.faqSection}>
              <div style={styles.faqHeader}>
                <div style={{
                  ...styles.categoryBadge,
                  background: `rgba(${hexToRgb(getCurrentCategory().color)}, 0.1)`,
                  borderColor: `rgba(${hexToRgb(getCurrentCategory().color)}, 0.5)`,
                  color: getCurrentCategory().color
                }}>
                  <span style={styles.categoryIcon}>{getCurrentCategory().icon}</span>
                  <span>{getCurrentCategory().title}</span>
                </div>
              </div>
              
              <div style={styles.faqList}>
                {getCurrentCategory().faqs.map(faq => (
                  <div key={faq.id} style={styles.faqItem}>
                    <div 
                      style={styles.faqQuestion}
                      onClick={() => toggleFaq(faq.id)}
                    >
                      <span style={styles.faqQuestionText}>{faq.question}</span>
                      <span style={styles.faqToggle}>
                        {expandedFaqs.includes(faq.id) ? '−' : '+'}
                      </span>
                    </div>
                    
                    {expandedFaqs.includes(faq.id) && (
                      <div style={styles.faqAnswer}>
                        {(() => {
                          // Using an inline function to enhance the answer display with formatting
                          // This could be expanded to add rich formatting, links, etc.
                          const answer = faq.answer;
                          
                          // Check if the answer contains keywords that we want to highlight
                          const highlightedAnswer = answer
                            .replace(/dashboard/g, '<strong>dashboard</strong>')
                            .replace(/navigate/g, '<strong>navigate</strong>')
                            .replace(/"([^"]*)"/g, '<em>"$1"</em>');
                          
                          return (
                            <div 
                              dangerouslySetInnerHTML={{ __html: highlightedAnswer }}
                              style={{ lineHeight: '1.6' }}
                            />
                          );
                        })()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        {/* Additional Help Section */}
        <div style={styles.additionalHelp}>
          <h2 style={styles.additionalHelpTitle}>
            Need Additional Help?
          </h2>
          
          <div style={styles.helpOptions}>
            {(() => {
              // Using an inline function to dynamically generate help options based on user role
              const helpOptions = [
                {
                  icon: '📞',
                  title: 'Contact Support',
                  description: 'Our support team is available Monday-Friday, 9am-5pm EST.',
                  contact: {
                    email: 'support@cognify.com',
                    phone: '+1 (555) 123-4567'
                  }
                },
                {
                  icon: '📝',
                  title: 'Submit Feedback',
                  description: 'Have a suggestion or found a bug? Let us know!',
                  action: () => setShowFeedbackForm(true)
                },
                {
                  icon: '📚',
                  title: 'Documentation',
                  description: 'Browse our comprehensive documentation.',
                  action: () => window.open('/documentation', '_blank')
                }
              ];
              
              // Add role-specific help options
              if (user) {
                if (user.role === 'student') {
                  helpOptions.push({
                    icon: '👨‍🏫',
                    title: 'Ask Your Teacher',
                    description: 'Send questions directly to your assigned teacher.',
                    action: () => navigate('/student-dashboard/messages/new')
                  });
                } else if (user.role === 'teacher') {
                  helpOptions.push({
                    icon: '📊',
                    title: 'Teaching Resources',
                    description: 'Access teaching guides and materials.',
                    action: () => navigate('/teacher-dashboard/resources')
                  });
                } else if (user.role === 'school') {
                  helpOptions.push({
                    icon: '💼',
                    title: 'Admin Resources',
                    description: 'Access school administration guides.',
                    action: () => navigate('/school-dashboard/resources')
                  });
                }
              }
              
              return helpOptions.map((option, index) => (
                <div key={index} style={styles.helpOption}>
                  <div style={styles.helpOptionIcon}>{option.icon}</div>
                  <h3 style={styles.helpOptionTitle}>{option.title}</h3>
                  <p style={styles.helpOptionText}>{option.description}</p>
                  
                  {option.contact && (
                    <div style={styles.helpOptionContact}>
                      <div>📧 {option.contact.email}</div>
                      <div>☎️ {option.contact.phone}</div>
                    </div>
                  )}
                  
                  {option.action && (
                    <button 
                      style={styles.helpOptionButton}
                      onClick={option.action}
                    >
                      {option.title === 'Submit Feedback' 
                        ? 'Send Feedback' 
                        : option.title === 'Documentation'
                          ? 'View Documentation'
                          : 'Access Now'}
                    </button>
                  )}
                </div>
              ));
            })()}
          </div>
        </div>
      </div>
      
      {/* Feedback Form Modal */}
      {showFeedbackForm && <FeedbackForm />}
    </div>
  );
};
// Helper function to convert hex to rgb
const hexToRgb = (hex) => {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Parse hex
  const r = parseInt(hex.substring(0, 2), 16) || 0;
  const g = parseInt(hex.substring(2, 4), 16) || 0;
  const b = parseInt(hex.substring(4, 6), 16) || 0;
  
  return `${r}, ${g}, ${b}`;
};
// Add these styles to the bottom of HelpPage.js
const styles = {
  container: {
    minHeight: '100vh',
    background: '#0f0f23',
    color: '#ffffff',
    position: 'relative',
    padding: '24px'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '30px',
    padding: '0 0 20px 0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  },
  backButton: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    color: '#fff',
    padding: '10px 15px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  pageTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    margin: '0 0 5px 0',
    background: 'linear-gradient(45deg, #00ff88, #00a8ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#cccccc',
    margin: 0
  },
  content: {
    maxWidth: '1000px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '40px'
  },
  searchContainer: {
    maxWidth: '800px',
    margin: '0 auto 40px auto'
  },
  searchWrapper: {
    position: 'relative',
    width: '100%'
  },
  searchIcon: {
    position: 'absolute',
    left: '15px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '1.2rem',
    color: '#cccccc'
  },
  searchInput: {
    width: '100%',
    padding: '15px 50px 15px 45px',
    background: 'rgba(255, 255, 255, 0.07)',
    border: '2px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '1.1rem',
    transition: 'all 0.3s ease'
  },
  clearButton: {
    position: 'absolute',
    right: '15px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontSize: '1rem',
    cursor: 'pointer'
  },
  categoryNav: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '15px',
    marginBottom: '30px'
  },
  categoryButton: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    padding: '12px 20px',
    color: '#ffffff',
    fontSize: '1rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    transition: 'all 0.3s ease',
    fontWeight: '500'
  },
  categoryIcon: {
    fontSize: '1.2rem'
  },
  faqSection: {
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '16px',
    padding: '30px',
    border: '1px solid rgba(255, 255, 255, 0.05)'
  },
  faqHeader: {
    marginBottom: '25px'
  },
  categoryBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '1rem',
    fontWeight: '600',
    border: '1px solid',
    marginBottom: '15px'
  },
  faqList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  faqItem: {
    background: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    overflow: 'hidden'
  },
  faqQuestion: {
    padding: '16px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  faqQuestionText: {
    fontSize: '1.05rem',
    fontWeight: '500',
    color: '#ffffff'
  },
  faqToggle: {
    fontSize: '1.2rem',
    color: '#00a8ff',
    fontWeight: '700'
  },
  faqAnswer: {
    padding: '5px 20px 20px',
    color: '#cccccc',
    fontSize: '0.95rem',
    lineHeight: '1.6',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)'
  },
  faqCategory: {
    marginTop: '15px',
    fontSize: '0.85rem',
    color: '#00a8ff',
    fontStyle: 'italic'
  },
  searchResults: {
    padding: '30px',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.05)'
  },
  searchResultsTitle: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '5px'
  },
  searchResultsCount: {
    fontSize: '0.9rem',
    color: '#cccccc',
    marginBottom: '25px'
  },
  clearSearchButton: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    padding: '10px 20px',
    color: '#ffffff',
    fontSize: '0.95rem',
    cursor: 'pointer',
    marginTop: '20px',
    alignSelf: 'flex-start'
  },
  additionalHelp: {
    padding: '40px 0'
  },
  additionalHelpTitle: {
    fontSize: '1.6rem',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '30px',
    textAlign: 'center'
  },
  helpOptions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '25px'
  },
  helpOption: {
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '16px',
    padding: '25px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center'
  },
  helpOptionIcon: {
    fontSize: '2.5rem',
    marginBottom: '15px'
  },
  helpOptionTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '10px'
  },
  helpOptionText: {
    fontSize: '0.95rem',
    color: '#cccccc',
    marginBottom: '20px',
    lineHeight: '1.5'
  },
  helpOptionContact: {
    fontSize: '0.9rem',
    color: '#00a8ff',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  helpOptionButton: {
    background: 'linear-gradient(45deg, #00ff88, #00a8ff)',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    color: '#000',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  feedbackFormContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(5px)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  },
  feedbackForm: {
    background: 'rgba(15, 15, 35, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '16px',
    border: '1px solid rgba(0, 168, 255, 0.3)',
    width: '100%',
    maxWidth: '500px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
  },
  feedbackHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 25px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  },
  feedbackTitle: {
    fontSize: '1.3rem',
    fontWeight: '600',
    margin: 0,
    color: '#00a8ff'
  },
  closeButton: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  form: {
    padding: '25px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  formGroup: {
    marginBottom: '15px'
  },
  label: {
    display: 'block',
    fontSize: '0.95rem',
    color: '#ffffff',
    marginBottom: '8px',
    fontWeight: '500'
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    background: 'rgba(255, 255, 255, 0.07)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '1rem',
    transition: 'all 0.3s ease'
  },
  textarea: {
    width: '100%',
    padding: '12px 15px',
    background: 'rgba(255, 255, 255, 0.07)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    resize: 'vertical',
    minHeight: '100px'
  },
  select: {
    width: '100%',
    padding: '12px 15px',
    background: 'rgba(255, 255, 255, 0.07)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '1rem',
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: 'url("data:image/svg+xml;utf8,<svg fill=\'white\' height=\'24\' viewBox=\'0 0 24 24\' width=\'24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/><path d=\'M0 0h24v24H0z\' fill=\'none\'/></svg>")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 10px top 50%',
    backgroundSize: '20px'
  },
  formActions: {
    display: 'flex',
    gap: '15px',
    marginTop: '10px'
  },
  submitButton: {
    background: 'linear-gradient(45deg, #00ff88, #00a8ff)',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    color: '#000',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    flex: 1
  },
  cancelButton: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    padding: '12px 24px',
    color: '#ffffff',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  }
};

export default HelpPage;