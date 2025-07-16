// formStabilizer.js

/**
 * Apply optimizations to form elements to prevent blinking and enable continuous typing
 */
export const stabilizeForms = () => {
  // Global CSS fix
  if (!document.getElementById('form-stabilizer-style')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'form-stabilizer-style';
    styleEl.innerHTML = `
      input, select, textarea {
        transition: none !important;
        animation: none !important;
        -webkit-animation: none !important;
        transform: translateZ(0);
        backface-visibility: hidden;
      }
      
      input:focus, textarea:focus, select:focus {
        outline: none !important;
        box-shadow: 0 0 0 2px rgba(0, 225, 255, 0.5) !important;
      }
    `;
    document.head.appendChild(styleEl);
  }
  
  // Find all form elements
  const formElements = document.querySelectorAll('input, textarea, select');
  
  // Apply optimizations to each element
  formElements.forEach(el => {
    // Add data attribute to mark as stabilized
    if (!el.hasAttribute('data-stabilized')) {
      el.setAttribute('data-stabilized', 'true');
      
      // Apply direct style fixes
      el.style.transition = 'none';
      el.style.animation = 'none';
      el.style.willChange = 'contents';
      el.style.transform = 'translateZ(0)';
      
      // For input elements, capture the input event
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.addEventListener('input', (e) => {
          // This helps prevent React from interfering with typing
          e.stopPropagation();
        }, true);
      }
      
      // For select elements, ensure the dropdown appears
      if (el.tagName === 'SELECT') {
        el.addEventListener('mousedown', (e) => {
          e.stopPropagation();
        }, true);
      }
    }
  });
};

/**
 * Setup an observer to automatically stabilize forms as they're added to the DOM
 */
export const setupFormStabilizer = () => {
  // Apply initial stabilization
  stabilizeForms();
  
  // Setup mutation observer to catch new form elements
  const observer = new MutationObserver((mutations) => {
    let shouldStabilize = false;
    
    mutations.forEach(mutation => {
      if (mutation.type === 'childList' && mutation.addedNodes.length) {
        // Check if any added nodes are or contain form elements
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) { // Element node
            if (
              node.tagName === 'INPUT' || 
              node.tagName === 'SELECT' || 
              node.tagName === 'TEXTAREA' ||
              node.querySelectorAll('input, select, textarea').length > 0
            ) {
              shouldStabilize = true;
            }
          }
        });
      }
    });
    
    // Only call stabilizeForms if relevant elements were added
    if (shouldStabilize) {
      stabilizeForms();
    }
  });
  
  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Return function to disconnect observer
  return () => observer.disconnect();
};