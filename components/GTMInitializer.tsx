'use client';

import { useEffect } from 'react';
import { initializeGTM } from '@/lib/gtm';

export default function GTMInitializer() {
  useEffect(() => {
    console.log('GTMInitializer useEffect triggered');
    console.log('Document readyState:', document.readyState);
    
    const initGTM = () => {
      console.log('Calling initializeGTM...');
      initializeGTM();
    };

    // Ensure GTM initializes after the DOM is ready
    if (document.readyState === 'loading') {
      console.log('Document still loading, waiting for DOMContentLoaded');
      document.addEventListener('DOMContentLoaded', initGTM);
    } else {
      console.log('Document ready, initializing GTM immediately');
      // Small delay to ensure everything is mounted
      setTimeout(initGTM, 100);
    }

    // Cleanup
    return () => {
      document.removeEventListener('DOMContentLoaded', initGTM);
    };
  }, []);

  return null;
}
