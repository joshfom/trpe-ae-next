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

export const initializeGTM = () => {
  // Only initialize in browser environment
  if (typeof window === 'undefined') return;
  
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
    
  } catch (error) {
    console.error('GTM initialization error:', error);
  }
};

export const pushToDataLayer = (data: any) => {
  if (typeof window === 'undefined') return;
  
  if (!window.dataLayer) {
    initializeGTM();
  }
  
  window.dataLayer.push(data);
};

export { TagManager };
