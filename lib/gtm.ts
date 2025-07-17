import TagManager from 'react-gtm-module';

const GTM_ID = 'GTM-MNQMSPX';

// Extend window interface for dataLayer
declare global {
  interface Window {
    dataLayer: any[];
  }
}

export const initializeGTM = () => {
  // Only initialize in browser environment
  if (typeof window === 'undefined') return;
  
  // Check if GTM is already initialized to prevent duplicates
  if (window.dataLayer) {
    console.log('GTM already initialized');
    return;
  }

  const tagManagerArgs = {
    gtmId: GTM_ID,
    // Initialize dataLayer if it doesn't exist
    dataLayer: {
      platform: 'trpe-ae',
      environment: process.env.NODE_ENV || 'development'
    }
  };

  console.log('Initializing GTM with ID:', GTM_ID);
  TagManager.initialize(tagManagerArgs);
  
  // Verify initialization
  setTimeout(() => {
    if (window.dataLayer) {
      console.log('GTM successfully initialized');
    } else {
      console.error('GTM initialization failed');
    }
  }, 1000);
};

export const pushToDataLayer = (data: any) => {
  if (typeof window === 'undefined') return;
  
  TagManager.dataLayer({
    dataLayer: data
  });
};

export { TagManager };
