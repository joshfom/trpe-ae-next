'use client';

import { useEffect } from 'react';
import { initializeGTM } from '@/lib/gtm';

export default function GTMInitializer() {
  useEffect(() => {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeGTM);
    } else {
      initializeGTM();
    }

    // Cleanup
    return () => {
      document.removeEventListener('DOMContentLoaded', initializeGTM);
    };
  }, []);

  return null;
}
