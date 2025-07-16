// src/components/CreateDoubtModal.jsx
import { useState, useRef } from 'react';
import { X, Send, Paperclip, X as XIcon } from 'lucide-react';
import doubtService from '../services/doubtService';
import { COLORS } from '../constants/theme';

const CreateDoubtModal = ({ onClose, onSubmit }) => {
  const [subject, setSubject] = useState('Mathematics');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      
      // Check if total files exceed 3
      if (files.length + newFiles.length > 3) {
        setError('Maximum 3 files allowed');
        return;
      }
      
      // Check file size (5MB limit)
      const invalidFiles = newFiles.filter(file => file.size > 5 * 1024 * 1024);
      if (invalidFiles.length > 0) {
        setError('File size exceeds 5MB limit');
        return;
      }
      
      setFiles([...files, ...newFiles]);
      setError('');
    }
  };

  const handleRemoveFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    // Form validation
    if (title.trim() === '' || description.trim() === '') {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      
      // Create doubt object
      const doubtData = {
        subject,
        title,
        description
      };
      
      let response;
      
      // Call API with or without files
      if (files.length > 0) {
        response = await doubtService.createDoubtWithFiles(doubtData, files);
      } else {
        response = await doubtService.createDoubt(doubtData);
      }
      
      // Call onSubmit with the created doubt data
      onSubmit(response.data);
      
      // Close modal
      onClose();
    } catch (error) {
      console.error('Error creating doubt:', error);
      setError(error.response?.data?.error || 'Failed to submit doubt. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div
        style={{
          background: `linear-gradient(135deg, ${COLORS.backgroundLighter}, ${COLORS.background})`,
          border: `1px solid ${COLORS.primary}30`,
          borderRadius: '20px',
          width: '100%',
          maxWidth: '600px',
          position: 'relative',
          boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${COLORS.primary}30`,
          animation: 'modal-appear 0.3s ease-out',
          padding: '30px'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '40px',
            height: '40px',
            borderRadius:'50%',
            backgroundColor: 'rgba(0,0,0,0.4)',
            border: `1px solid ${COLORS.primary}50`,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <X size={20} />
        </button>
        
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold',
          color: COLORS.primary,
          marginBottom: '20px',
          fontFamily: "'Orbitron', sans-serif",
          textShadow: `0 0 15px ${COLORS.primary}60`
        }}>
          Post a Doubt
        </h2>
        
        {error && (
          <div style={{
            padding: '10px 15px',
            backgroundColor: 'rgba(255, 0, 0, 0.1)',
            border: '1px solid rgba(255, 0, 0, 0.3)',
            borderRadius: '10px',
            color: '#ff6b6b',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '10px',
            fontSize: '16px',
            color: 'rgba(255,255,255,0.8)'
          }}>
            Subject
          </label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 15px',
              backgroundColor: 'rgba(0,0,0,0.3)',
              border: `1px solid ${COLORS.primary}30`,
              borderRadius: '10px',
              color: 'white',
              fontSize: '16px',
              outline: 'none'
            }}
          >
            <option value="Mathematics">Mathematics</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Biology">Biology</option>
            <option value="Computer Science">Computer Science</option>
            <option value="English">English</option>
            <option value="History">History</option>
            <option value="Geography">Geography</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '10px',
            fontSize: '16px',
            color: 'rgba(255,255,255,0.8)'
          }}>
            Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a concise title for your doubt"
            style={{
              width: '100%',
              padding: '12px 15px',
              backgroundColor: 'rgba(0,0,0,0.3)',
              border: `1px solid ${COLORS.primary}30`,
              borderRadius: '10px',
              color: 'white',
              fontSize: '16px',
              outline: 'none'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '10px',
            fontSize: '16px',
            color: 'rgba(255,255,255,0.8)'
          }}>
            Description *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Explain your doubt in detail..."
            rows={5}
            style={{
              width: '100%',
              padding: '12px 15px',
              backgroundColor: 'rgba(0,0,0,0.3)',
              border: `1px solid ${COLORS.primary}30`,
              borderRadius: '10px',
              color: 'white',
              fontSize: '16px',
              outline: 'none',
              resize: 'vertical'
            }}
          />
        </div>
        
        {/* File Upload Section */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px'
          }}>
            <label style={{ 
              fontSize: '16px',
              color: 'rgba(255,255,255,0.8)'
            }}>
              Attachments (optional)
            </label>
            <span style={{
              fontSize: '12px',
              color: 'rgba(255,255,255,0.5)'
            }}>
              Maximum 3 files, 5MB each
            </span>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileChange}
            style={{ display: 'none' }}
            accept="image/jpeg,image/png,image/gif,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain"
          />
          
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              width: '100%',
              padding: '12px 15px',
              backgroundColor: 'rgba(0,0,0,0.3)',
              border: `1px solid ${COLORS.primary}30`,
              borderRadius: '10px',
              color: 'white',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            <Paperclip size={16} />
            Upload Files
          </button>
          
          {files.length > 0 && (
            <div style={{
              marginTop: '15px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              {files.map((file, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    borderRadius: '8px',
                    border: `1px solid ${COLORS.primary}20`
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '14px',
                    color: 'rgba(255,255,255,0.8)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '80%'
                  }}>
                    <Paperclip size={14} color={COLORS.primary} />
                    <span>{file.name}</span>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile(index);
                    }}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: 'rgba(255,255,255,0.6)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '5px'
                    }}
                  >
                    <XIcon size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          style={{
            background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primary}CC)`,
            boxShadow: `0 0 20px ${COLORS.primary}50`,
            border: 'none',
            borderRadius: '15px',
            padding: '15px',
            color: '#000',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            width: '100%',
            fontFamily: "'Orbitron', sans-serif",
            letterSpacing: '1px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            opacity: isSubmitting ? 0.7 : 1
          }}
        >
          {isSubmitting ? (
            <>
              <div style={{
                display: 'inline-block',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                borderTop: '2px solid #000',
                borderRight: '2px solid transparent',
                animation: 'spin 1s linear infinite'
              }} />
              Submitting...
            </>
          ) : (
            <>
              <Send size={18} />
              Submit Doubt
            </>
          )}
        </button>
      </div>
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          
          @keyframes modal-appear {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
        `}
      </style>
    </div>
  );
};

export default CreateDoubtModal;