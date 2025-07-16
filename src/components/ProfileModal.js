// src/components/ProfileModal.js
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import EditProfile from './EditProfile';

const ProfileModal = ({ isOpen, onClose }) => {
  // FIXED: Move hooks before conditional rendering
  const { refreshUserData } = useAuth();
  const modalRef = useRef(null);
  
  // Handle ESC key press
  useEffect(() => {
    if (!isOpen) return; // Skip effect if modal is closed
    
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = ''; // Restore scrolling when modal is closed
    };
  }, [isOpen, onClose]);
  
  // Click outside to close
  useEffect(() => {
    if (!isOpen) return; // Skip effect if modal is closed
    
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleOutsideClick);
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose]);

  // Handle profile update
  const handleProfileUpdate = () => {
    refreshUserData();
    // FIXED: Make sure to close the modal after update
    onClose();
  };
  
  // Early return if not open - AFTER all hooks have been called
  if (!isOpen) return null;
  
  // Create portal to render modal at the root level
  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="profile-modal-title">
      {/* Background overlay with animation */}
      <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity animate-fadeIn"></div>
      
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        {/* Modal panel with animation */}
        <div
          ref={modalRef}
          className="relative transform overflow-hidden rounded-lg bg-gray-900 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-5xl animate-scaleIn"
          style={{
            background: 'linear-gradient(135deg, #1d1d2e, #151521)',
            border: '1px solid rgba(57, 255, 20, 0.3)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(57, 255, 20, 0.3)'
          }}
        >
          {/* Modal header */}
          <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
            <h3 
              className="text-xl font-bold text-white" 
              id="profile-modal-title"
              style={{
                fontFamily: "'Orbitron', sans-serif",
                color: '#39FF14',
                textShadow: '0 0 15px rgba(57, 255, 20, 0.6)'
              }}
            >
              Edit Profile
            </h3>
            <button
              type="button"
              className="rounded-full w-8 h-8 flex items-center justify-center bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              onClick={onClose}
              aria-label="Close"
            >
              <span className="sr-only">Close</span>
              <X size={20} />
            </button>
          </div>
          
          {/* Modal content - Use the actual EditProfile component */}
          <div className="bg-transparent max-h-[80vh] overflow-y-auto">
            <EditProfile onUpdate={handleProfileUpdate} />
          </div>
        </div>
      </div>
      
      {/* Style using global CSS or React-compatible approach */}
      <style jsx="true">{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out forwards;
        }
      `}</style>
    </div>,
    document.body
  );
};

export default ProfileModal;