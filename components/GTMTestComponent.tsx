'use client';

import { useState } from 'react';
import { pushToDataLayer, logGTMStatus } from '@/lib/gtm';

export default function GTMTestComponent() {
  const [eventCount, setEventCount] = useState(0);

  const sendTestEvent = () => {
    const eventData = {
      event: 'manual_test_event',
      event_category: 'testing',
      event_action: 'button_click',
      event_label: 'gtm_test_button',
      value: eventCount + 1,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent
    };

    // Using direct dataLayer push
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push(eventData);
      console.log('🎯 Manual event sent via direct dataLayer push:', eventData);
    }

    // Also using utility function
    pushToDataLayer({
      event: 'utility_test_event',
      event_category: 'testing',
      event_action: 'utility_button_click',
      event_label: 'gtm_utility_test',
      value: eventCount + 1,
      timestamp: new Date().toISOString(),
      method: 'utility_function'
    });

    setEventCount(prev => prev + 1);
  };

  const sendPageViewEvent = () => {
    const pageViewData = {
      event: 'page_view',
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname,
      timestamp: new Date().toISOString()
    };

    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push(pageViewData);
      console.log('📄 Manual page view sent:', pageViewData);
    }
  };

  const sendCustomEvent = () => {
    const customData = {
      event: 'custom_interaction',
      event_category: 'user_engagement',
      event_action: 'test_interaction',
      custom_parameter_1: 'test_value_1',
      custom_parameter_2: 123,
      timestamp: new Date().toISOString()
    };

    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push(customData);
      console.log('🔧 Custom event sent:', customData);
    }
  };

  const checkGTMStatus = () => {
    logGTMStatus();
    
    // Additional checks
    if (typeof window !== 'undefined') {
      console.log('🔍 Additional GTM Checks:');
      console.log('  - Current URL:', window.location.href);
      console.log('  - Document title:', document.title);
      console.log('  - User agent:', navigator.userAgent);
      
      // Check if GTM container is present
      const gtmContainer = document.querySelector('script[src*="GTM-MNQMSPX"]');
      console.log('  - GTM container script found:', !!gtmContainer);
      
      if (gtmContainer) {
        console.log('  - GTM container src:', (gtmContainer as HTMLScriptElement).src);
      }
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '20px', 
      right: '20px', 
      background: 'white', 
      border: '1px solid #ccc', 
      padding: '15px', 
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 'bold' }}>
        GTM Test Panel
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button 
          onClick={sendTestEvent}
          style={{ 
            padding: '8px 12px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Send Test Event ({eventCount})
        </button>
        
        <button 
          onClick={sendPageViewEvent}
          style={{ 
            padding: '8px 12px', 
            backgroundColor: '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Send Page View
        </button>
        
        <button 
          onClick={sendCustomEvent}
          style={{ 
            padding: '8px 12px', 
            backgroundColor: '#ffc107', 
            color: 'black', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Send Custom Event
        </button>
        
        <button 
          onClick={checkGTMStatus}
          style={{ 
            padding: '8px 12px', 
            backgroundColor: '#6c757d', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Check GTM Status
        </button>
      </div>
      
      <p style={{ 
        margin: '10px 0 0 0', 
        fontSize: '11px', 
        color: '#666',
        lineHeight: '1.4'
      }}>
        Check browser console for detailed logging. 
        Events sent: {eventCount}
      </p>
    </div>
  );
}
