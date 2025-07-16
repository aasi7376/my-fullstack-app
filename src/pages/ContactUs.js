import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ContactPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    subject: '',
    category: 'general',
    message: '',
    priority: 'medium'
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you for your message, ${formData.name}! We'll get back to you within 24 hours.`);
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      subject: '',
      category: 'general',
      message: '',
      priority: 'medium'
    });
  };

  const contactMethods = [
    {
      icon: '📧',
      title: 'Email Support',
      description: 'Get help via email',
      detail: 'support@cognify.edu',
      color: '#00a8ff'
    },
    {
      icon: '💬',
      title: 'Live Chat',
      description: '24/7 instant support',
      detail: 'Available on website',
      color: '#00ff88'
    },
    {
      icon: '📞',
      title: 'Phone Support',
      description: 'Speak with our team',
      detail: '+1 (555) 123-4567',
      color: '#8c7ae6'
    },
    {
      icon: '📍',
      title: 'Office Location',
      description: 'Visit us in person',
      detail: '123 Education St, Learning City',
      color: '#ff6b9d'
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
      fontFamily: "'Inter', sans-serif",
      padding: '20px'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700;800&display=swap');
      `}</style>

      {/* Header */}
      <div style={{
        background: 'rgba(10, 10, 10, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '15px',
        border: '2px solid #ff6b9d',
        padding: '20px 30px',
        marginBottom: '30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 0 30px rgba(255, 107, 157, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'linear-gradient(135deg, #ff6b9d, #ff4757)',
              border: 'none',
              borderRadius: '10px',
              padding: '10px 15px',
              color: '#fff',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            ← Back to Home
          </button>
          <h1 style={{
            color: '#ff6b9d',
            fontSize: '2.5rem',
            fontFamily: "'Poppins', sans-serif",
            fontWeight: '700',
            margin: 0,
            textShadow: '0 0 15px #ff6b9d'
          }}>
            Contact Us
          </h1>
        </div>
        
        {user && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#ffffff'
          }}>
            <span>👤 {user.name}</span>
          </div>
        )}
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '40px',
        alignItems: 'start'
      }}>
        {/* Contact Form */}
        <div style={{
          background: 'rgba(10, 10, 10, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRadius: '15px',
          border: '2px solid rgba(255, 255, 255, 0.1)',
          padding: '30px',
          boxShadow: '0 0 25px rgba(0, 0, 0, 0.3)'
        }}>
          <h2 style={{
            color: '#ffffff',
            fontSize: '2rem',
            fontFamily: "'Poppins', sans-serif",
            fontWeight: '600',
            marginBottom: '25px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            💌 Send us a Message
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Name and Email Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{
                  color: '#cccccc',
                  fontSize: '0.9rem',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: '500',
                  marginBottom: '8px',
                  display: 'block'
                }}>
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '1rem',
                    fontFamily: "'Inter', sans-serif",
                    outline: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#00ff88';
                    e.target.style.boxShadow = '0 0 15px rgba(0, 255, 136, 0.3)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              
              <div>
                <label style={{
                  color: '#cccccc',
                  fontSize: '0.9rem',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: '500',
                  marginBottom: '8px',
                  display: 'block'
                }}>
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '1rem',
                    fontFamily: "'Inter', sans-serif",
                    outline: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#00a8ff';
                    e.target.style.boxShadow = '0 0 15px rgba(0, 168, 255, 0.3)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label style={{
                color: '#cccccc',
                fontSize: '0.9rem',
                fontFamily: "'Inter', sans-serif",
                fontWeight: '500',
                marginBottom: '8px',
                display: 'block'
              }}>
                Subject *
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                required
                placeholder="Brief description of your inquiry"
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '10px',
                  color: '#ffffff',
                  fontSize: '1rem',
                  fontFamily: "'Inter', sans-serif",
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#8c7ae6';
                  e.target.style.boxShadow = '0 0 15px rgba(140, 122, 230, 0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Category and Priority Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{
                  color: '#cccccc',
                  fontSize: '0.9rem',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: '500',
                  marginBottom: '8px',
                  display: 'block'
                }}>
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '1rem',
                    fontFamily: "'Inter', sans-serif",
                    outline: 'none'
                  }}
                >
                  <option value="general" style={{ background: '#1a1a2e', color: '#ffffff' }}>General Inquiry</option>
                  <option value="technical" style={{ background: '#1a1a2e', color: '#ffffff' }}>Technical Support</option>
                  <option value="billing" style={{ background: '#1a1a2e', color: '#ffffff' }}>Billing & Payments</option>
                  <option value="feature" style={{ background: '#1a1a2e', color: '#ffffff' }}>Feature Request</option>
                  <option value="bug" style={{ background: '#1a1a2e', color: '#ffffff' }}>Bug Report</option>
                </select>
              </div>
              
              <div>
                <label style={{
                  color: '#cccccc',
                  fontSize: '0.9rem',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: '500',
                  marginBottom: '8px',
                  display: 'block'
                }}>
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '1rem',
                    fontFamily: "'Inter', sans-serif",
                    outline: 'none'
                  }}
                >
                  <option value="low" style={{ background: '#1a1a2e', color: '#ffffff' }}>Low</option>
                  <option value="medium" style={{ background: '#1a1a2e', color: '#ffffff' }}>Medium</option>
                  <option value="high" style={{ background: '#1a1a2e', color: '#ffffff' }}>High</option>
                  <option value="urgent" style={{ background: '#1a1a2e', color: '#ffffff' }}>Urgent</option>
                </select>
              </div>
            </div>

            {/* Message */}
            <div>
              <label style={{
                color: '#cccccc',
                fontSize: '0.9rem',
                fontFamily: "'Inter', sans-serif",
                fontWeight: '500',
                marginBottom: '8px',
                display: 'block'
              }}>
                Message *
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                required
                rows="6"
                placeholder="Please provide detailed information about your inquiry..."
                style={{
                  width: '100%',
                  padding: '15px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '10px',
                  color: '#ffffff',
                  fontSize: '1rem',
                  fontFamily: "'Inter', sans-serif",
                  outline: 'none',
                  resize: 'vertical',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#ff6b9d';
                  e.target.style.boxShadow = '0 0 15px rgba(255, 107, 157, 0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              style={{
                padding: '15px 30px',
                background: 'linear-gradient(135deg, #00ff88, #00d970)',
                border: 'none',
                borderRadius: '12px',
                color: '#000',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                fontFamily: "'Poppins', sans-serif",
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                marginTop: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px) scale(1.02)';
                e.target.style.boxShadow = '0 10px 30px rgba(0, 255, 136, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <span>📤</span>
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Methods */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <h2 style={{
            color: '#ffffff',
            fontSize: '2rem',
            fontFamily: "'Poppins', sans-serif",
            fontWeight: '600',
            marginBottom: '5px',
            textAlign: 'center'
          }}>
            Other Ways to Reach Us
          </h2>
          
          {contactMethods.map((method, index) => (
            <div
              key={index}
              style={{
                background: 'rgba(10, 10, 10, 0.8)',
                backdropFilter: 'blur(20px)',
                borderRadius: '15px',
                border: `2px solid ${method.color}30`,
                padding: '25px',
                boxShadow: `0 0 20px ${method.color}20`,
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = `${method.color}10`;
                e.target.style.borderColor = `${method.color}60`;
                e.target.style.transform = 'translateY(-5px) scale(1.02)';
                e.target.style.boxShadow = `0 10px 30px ${method.color}30`;
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(10, 10, 10, 0.8)';
                e.target.style.borderColor = `${method.color}30`;
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = `0 0 20px ${method.color}20`;
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: `linear-gradient(135deg, ${method.color}, ${method.color}aa)`,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.8rem'
                }}>
                  {method.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    color: method.color,
                    fontSize: '1.3rem',
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: '600',
                    margin: '0 0 5px 0',
                    textShadow: `0 0 10px ${method.color}`
                  }}>
                    {method.title}
                  </h3>
                  <p style={{
                    color: '#cccccc',
                    fontSize: '0.95rem',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: '300',
                    margin: '0 0 8px 0'
                  }}>
                    {method.description}
                  </p>
                  <p style={{
                    color: '#ffffff',
                    fontSize: '1rem',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: '500',
                    margin: 0
                  }}>
                    {method.detail}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Business Hours */}
          <div style={{
            background: 'rgba(10, 10, 10, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '15px',
            border: '2px solid rgba(255, 255, 255, 0.1)',
            padding: '25px',
            marginTop: '10px'
          }}>
            <h3 style={{
              color: '#ffffff',
              fontSize: '1.5rem',
              fontFamily: "'Poppins', sans-serif",
              fontWeight: '600',
              marginBottom: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              🕒 Business Hours
            </h3>
            <div style={{ color: '#cccccc', fontFamily: "'Inter', sans-serif", lineHeight: '1.8' }}>
              <div><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM EST</div>
              <div><strong>Saturday:</strong> 10:00 AM - 4:00 PM EST</div>
              <div><strong>Sunday:</strong> Closed</div>
              <div style={{ marginTop: '10px', color: '#00ff88' }}>
                <strong>Emergency Support:</strong> 24/7 for critical issues
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;