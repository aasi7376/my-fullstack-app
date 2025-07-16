// Status configuration for styling status badges
export const getStatusConfig = (status) => {
  const configs = {
    // Institution/School statuses
    Active: { color: '#15ffaa', bg: 'rgba(21, 255, 170, 0.15)' },
    Pending: { color: '#ffd36a', bg: 'rgba(253, 211, 106, 0.15)' },
    Inactive: { color: '#ff6a88', bg: 'rgba(255, 106, 136, 0.15)' },
    
    // User statuses
    Online: { color: '#15ffaa', bg: 'rgba(21, 255, 170, 0.15)' },
    Offline: { color: '#8ab3c5', bg: 'rgba(138, 179, 197, 0.15)' },
    
    // Simulation statuses
    Beta: { color: '#00e1ff', bg: 'rgba(0, 225, 255, 0.15)' },
    
    // Difficulty levels
    Advanced: { color: '#ff6a88', bg: 'rgba(255, 106, 136, 0.15)' },
    Intermediate: { color: '#ffd36a', bg: 'rgba(253, 211, 106, 0.15)' },
    Beginner: { color: '#15ffaa', bg: 'rgba(21, 255, 170, 0.15)' },
    
    // Report statuses
    Published: { color: '#15ffaa', bg: 'rgba(21, 255, 170, 0.15)' },
    Draft: { color: '#ffd36a', bg: 'rgba(253, 211, 106, 0.15)' }
  };
  
  // Return the config for the given status, or a default if not found
  return configs[status] || { color: '#8ab3c5', bg: 'rgba(138, 179, 197, 0.15)' };
};

export default getStatusConfig;