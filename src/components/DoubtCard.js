// src/components/DoubtCard.jsx
import { useState } from 'react';
import { MessageCircle, Paperclip, Trash2 as TrashIcon, ChevronDown, ChevronUp } from 'lucide-react';
import doubtService from '../services/doubtService';
import { COLORS } from '../constants/theme';

const DoubtCard = ({ doubt, index, onDelete }) => {
  const [hover, setHover] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle doubt deletion
  const handleDelete = async (e) => {
    e.stopPropagation(); // Prevent expanding card when clicking delete
    
    if (window.confirm('Are you sure you want to delete this doubt?')) {
      try {
        setIsDeleting(true);
        await doubtService.deleteDoubt(doubt._id);
        onDelete(doubt._id);
      } catch (error) {
        console.error('Error deleting doubt:', error);
        alert('Failed to delete doubt. Please try again.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Get color based on subject
  const getSubjectColor = (subject) => {
    switch(subject) {
      case 'Mathematics':
        return COLORS.primary;
      case 'Physics':
        return COLORS.accent1;
      case 'Chemistry':
        return COLORS.secondary;
      default:
        return COLORS.accent3;
    }
  };

  const subjectColor = getSubjectColor(doubt.subject);

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: `linear-gradient(135deg, ${COLORS.backgroundLighter}, ${COLORS.background})`,
        border: `1px solid ${subjectColor}30`,
        borderRadius: '20px',
        padding: '25px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: hover ? `0 20px 40px rgba(0, 0, 0, 0.3), 0 0 40px ${subjectColor}40` : `0 10px 30px rgba(0, 0, 0, 0.3)`,
        cursor: 'pointer',
        transform: hover ? 'translateY(-5px)' : 'translateY(0)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, height 0.3s ease',
        animation: `fade-in 0.5s ease-out ${index * 0.1}s both`
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '10px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <div style={{
            padding: '5px 10px',
            backgroundColor: `${subjectColor}20`,
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 'bold',
            color: subjectColor,
            border: `1px solid ${subjectColor}40`
          }}>
            {doubt.subject}
          </div>
          
          <div style={{
            padding: '5px 10px',
            backgroundColor: doubt.status === 'Pending' ? `${COLORS.accent2}20` : `${COLORS.primary}20`,
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 'bold',
            color: doubt.status === 'Pending' ? COLORS.accent2 : COLORS.primary,
            border: doubt.status === 'Pending' ? `1px solid ${COLORS.accent2}40` : `1px solid ${COLORS.primary}40`
          }}>
            {doubt.status}
          </div>
        </div>
        
        <div style={{
          fontSize: '14px',
          color: 'rgba(255,255,255,0.6)'
        }}>
          {formatDate(doubt.createdAt)}
        </div>
      </div>
      
      <h3 style={{ 
        fontSize: '18px', 
        marginBottom: '15px',
        fontWeight: 'bold',
        color: subjectColor,
        textShadow: `0 0 10px ${subjectColor}40`,
        fontFamily: "'Montserrat', sans-serif"
      }}>{doubt.title}</h3>
      
      <p style={{
        fontSize: '14px',
        color: 'rgba(255,255,255,0.8)',
        lineHeight: '1.6',
        maxHeight: expanded ? '300px' : '40px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        transition: 'max-height 0.3s ease'
      }}>
        {doubt.description}
      </p>
      
      {/* Attachments */}
      {expanded && doubt.attachments && doubt.attachments.length > 0 && (
        <div style={{
          marginTop: '15px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          {doubt.attachments.map((attachment, index) => (
            
              key={index}
              href={attachment}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 10px',
                backgroundColor: 'rgba(0,0,0,0.2)',
                borderRadius: '8px',
                fontSize: '12px',
                color: 'rgba(255,255,255,0.8)',
                textDecoration: 'none',
                border: `1px solid ${subjectColor}30`
              }}
            >
              <Paperclip size={12} />
              Attachment {index + 1}
            </a>
          ))}
        </div>
      )}
      
      {/* Display answer if doubt is answered */}
      {expanded && doubt.status === 'Answered' && doubt.answer && doubt.answer.content && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: 'rgba(57, 255, 20, 0.1)',
          borderRadius: '10px',
          border: '1px solid rgba(57, 255, 20, 0.3)'
        }}>
          <div style={{ 
            fontSize: '14px', 
            color: COLORS.primary,
            fontWeight: 'bold',
            marginBottom: '5px' 
          }}>
            Answer:
          </div>
          <p style={{ 
            fontSize: '14px',
            color: 'rgba(255,255,255,0.9)',
            margin: 0,
            lineHeight: '1.5'
          }}>
            {doubt.answer.content}
          </p>
        </div>
      )}
      
      {/* Add delete button */}
      {hover && (
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'rgba(255, 70, 70, 0.2)',
            border: '1px solid rgba(255, 70, 70, 0.4)',
            borderRadius: '50%',
            width: '30px',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: isDeleting ? 'not-allowed' : 'pointer',
            color: '#ff4646',
            opacity: isDeleting ? 0.5 : 1,
            zIndex: 5
          }}
        >
          {isDeleting ? (
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              borderTop: '2px solid #ff4646',
              borderRight: '2px solid transparent',
              animation: 'spin 1s linear infinite'
            }} />
          ) : (
            <TrashIcon size={16} />
          )}
        </button>
      )}
      
      {/* Expand/collapse indicator */}
      <div style={{
        position: 'absolute',
        bottom: '15px',
        right: '15px',
        color: 'rgba(255,255,255,0.4)',
        transition: 'color 0.3s ease',
        ...(hover && { color: 'rgba(255,255,255,0.7)' })
      }}>
        {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>
      
      <style>
        {`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default DoubtCard;