"use client"

import { useEffect } from 'react';

interface SSRToCSRSwitcherProps {
  ssrSelector: string;
  csrSelector: string;
}

const SSRToCSRSwitcher: React.FC<SSRToCSRSwitcherProps> = ({ ssrSelector, csrSelector }) => {
  useEffect(() => {
    const switchToClientVersion = () => {
      try {
        const ssrElement = document.querySelector(ssrSelector);
        const csrElement = document.querySelector(csrSelector);
        
        if (ssrElement && csrElement) {
          // Hide SSR version
          (ssrElement as HTMLElement).style.display = 'none';
          // Show CSR version
          (csrElement as HTMLElement).style.display = 'block';
          
          // Add a class to indicate JS is active
          document.documentElement.classList.add('js-enabled');
        }
      } catch (error) {
        console.warn('Failed to switch to client version:', error);
        // If anything fails, keep SSR version visible
      }
    };

    // Switch immediately if DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', switchToClientVersion);
    } else {
      switchToClientVersion();
    }

    // Cleanup
    return () => {
      document.removeEventListener('DOMContentLoaded', switchToClientVersion);
    };
  }, [ssrSelector, csrSelector]);

  return null; // This component doesn't render anything
};

export default SSRToCSRSwitcher;
