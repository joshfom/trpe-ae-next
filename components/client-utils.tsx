"use client"

import { useEffect } from 'react'

/**
 * This component handles client-side functionality like JS detection
 * It simply ensures proper CSS classes are applied for JS/no-JS environments
 */
export function ClientUtilities() {
  useEffect(() => {
    // Ensure JS class is applied - this runs after hydration is complete
    if (typeof document !== 'undefined') {
      if (!document.documentElement.classList.contains('js')) {
        document.documentElement.classList.add('js')
      }
      if (document.documentElement.classList.contains('no-js')) {
        document.documentElement.classList.remove('no-js')
      }
      
      // Dispatch custom event for JS detection
      try {
        const jsEnabledEvent = new CustomEvent('jsenabled', { bubbles: true });
        document.dispatchEvent(jsEnabledEvent);
      } catch (e) {
        console.error('Error dispatching JS enabled event:', e);
      }
    }
  }, [])
  
  // Return null - no visible UI needed
  return null;
}

// Add default export to ensure compatibility
export default ClientUtilities;
