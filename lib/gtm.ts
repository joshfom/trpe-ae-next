import TagManager from 'react-gtm-module';

const GTM_ID = 'G-KYYZEMLWMT';

// Extend window interface for dataLayer
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    google_tag_manager: any;
  }
}

// GTM initialization function - should only be used internally
// GTM is properly initialized in app/layout.tsx with early filter
const initializeGTM = () => {
  // Only initialize in browser environment
  if (typeof window === 'undefined') return;
  
  // Initialize form filter FIRST, before GTM loads
  import('./gtm-form-filter').then(({ initializeGTMFormFilter, startAggressiveFormEventCleaner }) => {
    initializeGTMFormFilter();
    // Enable aggressive cleaning to completely eliminate form events
    startAggressiveFormEventCleaner();
  });
  
  // Initialize dataLayer first if it doesn't exist
  window.dataLayer = window.dataLayer || [];
  
  const tagManagerArgs = {
    gtmId: GTM_ID,
    // Add initial dataLayer data
    dataLayer: {
      platform: 'trpe-ae',
      environment: process.env.NODE_ENV || 'development',
      'gtm.start': new Date().getTime(),
      event: 'gtm.js'
    },
    // Add events for better tracking
    events: {
      'gtm.start': new Date().getTime(),
      event: 'gtm.js'
    }
  };

  try {
    TagManager.initialize(tagManagerArgs);
    
    // Push initial pageview event
    window.dataLayer.push({
      event: 'page_view',
      page_title: document.title,
      page_location: window.location.href,
      timestamp: new Date().toISOString()
    });
      
    // Debug monitor disabled to prevent Tag Assistant popup
    // if (process.env.NODE_ENV === 'development') {
    //   setTimeout(() => {
    //     import('./gtm-debug').then(({ initializeGTMMonitor }) => {
    //       initializeGTMMonitor();
    //     });
    //   }, 2000);
    // }
    
  } catch (error) {
    console.error('GTM initialization error:', error);
  }
};

export const pushToDataLayer = (data: any) => {
  if (typeof window === 'undefined') return;
  
  // Initialize dataLayer if it doesn't exist, but don't re-initialize GTM
  // GTM should already be initialized in layout.tsx with early filter
  if (!window.dataLayer) {
    window.dataLayer = [];
  }
  
  // Use the safeGTMPush if available (from gtm-form-filter), otherwise use regular push
  if (typeof window !== 'undefined' && (window as any).safeGTMPush) {
    (window as any).safeGTMPush(data);
  } else {
    // Fallback to regular push
    window.dataLayer.push(data);
  }
};

export { TagManager };
