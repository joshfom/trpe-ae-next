'use client';

import { useEffect, useState } from 'react';

export default function GTMDebugPanel() {
  const [gtmStatus, setGtmStatus] = useState<any>({});

  useEffect(() => {
    const checkGTMStatus = () => {
      if (typeof window !== 'undefined') {
        const status = {
          dataLayerExists: !!window.dataLayer,
          dataLayerLength: window.dataLayer?.length || 0,
          gtmExists: !!(window as any).google_tag_manager,
          scriptsFound: document.querySelectorAll('script[src*="googletagmanager"]').length,
          currentUrl: window.location.href,
          lastEvents: window.dataLayer ? window.dataLayer.slice(-3) : []
        };
        setGtmStatus(status);
        console.log('🔍 GTM Debug Status:', status);
      }
    };

    // Check immediately and then every 5 seconds
    checkGTMStatus();
    const interval = setInterval(checkGTMStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  const sendTestEvent = () => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      const testEvent = {
        event: 'debug_test_event',
        test_category: 'debugging',
        test_action: 'manual_test',
        timestamp: new Date().toISOString()
      };
      
      window.dataLayer.push(testEvent);
      console.log('🧪 Debug test event sent:', testEvent);
      
      // Update status
      setTimeout(() => {
        setGtmStatus((prev: any) => ({
          ...prev,
          dataLayerLength: window.dataLayer?.length || 0,
          lastEvents: window.dataLayer ? window.dataLayer.slice(-3) : []
        }));
      }, 100);
    }
  };

  const sendPageView = () => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      const pageViewEvent = {
        event: 'page_view',
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname,
        timestamp: new Date().toISOString()
      };
      
      window.dataLayer.push(pageViewEvent);
      console.log('📄 Debug page view sent:', pageViewEvent);
    }
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: 'white',
      border: '2px solid #007bff',
      borderRadius: '8px',
      padding: '15px',
      maxWidth: '300px',
      fontSize: '12px',
      zIndex: 10000,
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#007bff', fontWeight: 'bold' }}>
        🏷️ GTM Debug Panel
      </h3>
      
      <div style={{ marginBottom: '10px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
          <span>DataLayer:</span>
          <span style={{ color: gtmStatus.dataLayerExists ? 'green' : 'red' }}>
            {gtmStatus.dataLayerExists ? '✅' : '❌'}
          </span>
          
          <span>Events:</span>
          <span>{gtmStatus.dataLayerLength}</span>
          
          <span>GTM Container:</span>
          <span style={{ color: gtmStatus.gtmExists ? 'green' : 'red' }}>
            {gtmStatus.gtmExists ? '✅' : '❌'}
          </span>
          
          <span>Scripts:</span>
          <span>{gtmStatus.scriptsFound}</span>
        </div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '10px' }}>
        <button 
          onClick={sendTestEvent}
          style={{
            padding: '5px 10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '11px'
          }}
        >
          Send Test Event
        </button>
        
        <button 
          onClick={sendPageView}
          style={{
            padding: '5px 10px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '11px'
          }}
        >
          Send Page View
        </button>
      </div>
      
      {gtmStatus.lastEvents && gtmStatus.lastEvents.length > 0 && (
        <div style={{ fontSize: '10px', color: '#666' }}>
          <strong>Last Events:</strong>
          <div style={{ maxHeight: '60px', overflow: 'auto', marginTop: '2px' }}>
            {gtmStatus.lastEvents.map((event: any, index: number) => (
              <div key={index} style={{ padding: '2px 0', borderBottom: '1px solid #eee' }}>
                {event.event || 'Unknown Event'}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

declare global {
  interface Window {
    dataLayer: any[];
    google_tag_manager: any;
  }
}
