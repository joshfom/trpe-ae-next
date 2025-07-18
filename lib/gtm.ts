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
  
  console.log('🚀 Starting GTM initialization...');
  
  // Initialize dataLayer first if it doesn't exist
  window.dataLayer = window.dataLayer || [];
  
  // Intercept dataLayer pushes for logging
  const originalPush = window.dataLayer.push;
  window.dataLayer.push = function(...args) {
    console.log('🏷️ GTM DataLayer Event (react-gtm-module):', args);
    return originalPush.apply(window.dataLayer, args);
  };
  
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
    console.log('🏷️ Initializing GTM with args:', tagManagerArgs);
    TagManager.initialize(tagManagerArgs);
    
    // Push initial pageview event
    window.dataLayer.push({
      event: 'page_view',
      page_title: document.title,
      page_location: window.location.href,
      timestamp: new Date().toISOString()
    });
    
    console.log('✅ GTM initialization completed');
    console.log('🏷️ dataLayer state:', window.dataLayer);
    
    // Verify GTM script is loaded
    setTimeout(() => {
      const gtmScripts = document.querySelectorAll('script[src*="googletagmanager.com"]');
      console.log('🔍 GTM scripts found:', gtmScripts.length);
      gtmScripts.forEach((script, index) => {
        console.log(`  Script ${index}:`, (script as HTMLScriptElement).src);
      });
      
      // Check GTM container status
      console.log('🏷️ GTM Container Status:');
      console.log('  - google_tag_manager exists:', !!window.google_tag_manager);
      console.log('  - dataLayer length:', window.dataLayer.length);
      
      // Send test event
      pushToDataLayer({
        event: 'gtm_react_module_test',
        test_data: 'React GTM Module test',
        timestamp: new Date().toISOString()
      });
      
    }, 2000);
    
  } catch (error) {
    console.error('❌ GTM initialization error:', error);
  }
};

export const pushToDataLayer = (data: any) => {
  if (typeof window === 'undefined') return;
  
  if (!window.dataLayer) {
    console.warn('⚠️ dataLayer not initialized, initializing GTM first');
    initializeGTM();
  }
  
  console.log('📤 Pushing to dataLayer:', data);
  window.dataLayer.push(data);
  console.log('📋 dataLayer after push:', [...window.dataLayer]);
};

// Helper function to log GTM status
export const logGTMStatus = () => {
  if (typeof window === 'undefined') {
    console.log('🔍 GTM Status: Running on server');
    return;
  }
  
  console.log('🔍 GTM Status Check:');
  console.log('  - dataLayer exists:', !!window.dataLayer);
  console.log('  - dataLayer length:', window.dataLayer?.length || 0);
  console.log('  - google_tag_manager exists:', !!window.google_tag_manager);
  
  const gtmScripts = document.querySelectorAll('script[src*="googletagmanager.com"]');
  console.log('  - GTM scripts loaded:', gtmScripts.length);
  
  if (window.dataLayer) {
    console.log('  - Recent dataLayer events:', window.dataLayer.slice(-5));
  }
};

export { TagManager };
