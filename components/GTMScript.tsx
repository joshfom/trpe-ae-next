'use client';

import Script from 'next/script';
import { useEffect } from 'react';

const GTM_ID = 'GTM-MNQMSPX';

export default function GTMScript() {
  useEffect(() => {
    // Initialize dataLayer with comprehensive logging
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      
      // Store original push function to intercept all dataLayer events
      const originalPush = window.dataLayer.push;
      window.dataLayer.push = function(...args) {
        console.log('🏷️ GTM DataLayer Event:', args);
        console.log('🏷️ GTM DataLayer State Before Push:', [...window.dataLayer]);
        const result = originalPush.apply(window.dataLayer, args);
        console.log('🏷️ GTM DataLayer State After Push:', [...window.dataLayer]);
        
        // Log specific event types
        args.forEach(arg => {
          if (arg && typeof arg === 'object') {
            if (arg.event) {
              console.log(`🎯 GTM Event Fired: ${arg.event}`, arg);
            }
            if (arg.page_view || arg.event === 'page_view') {
              console.log('📄 GTM Page View Event:', arg);
            }
          }
        });
        
        return result;
      };
      
      // Push initial GTM events
      window.dataLayer.push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js'
      });
      
      // Push initial page view
      window.dataLayer.push({
        event: 'page_view',
        page_title: document.title,
        page_location: window.location.href,
        platform: 'trpe-ae',
        timestamp: new Date().toISOString()
      });
      
      console.log('✅ GTM Script: dataLayer initialized with logging', window.dataLayer);
      
      // Test event after 2 seconds to verify communication
      setTimeout(() => {
        window.dataLayer.push({
          event: 'gtm_test_event',
          test_data: 'GTM communication test',
          timestamp: new Date().toISOString()
        });
        console.log('🧪 GTM Test event sent');
      }, 2000);
    }
  }, []);

  return (
    <>
      {/* Google Tag Manager */}
      <Script
        id="gtm-script"
        src={`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`}
        strategy="afterInteractive"
        onLoad={() => {
          console.log('✅ GTM script loaded successfully from:', `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`);
          
          // Verify GTM container is loaded
          setTimeout(() => {
            const gtmContainer = document.querySelector(`script[src*="${GTM_ID}"]`);
            console.log('🏷️ GTM Container Script Found:', !!gtmContainer);
            
            // Check for GTM-specific variables
            if (typeof window !== 'undefined') {
              console.log('🏷️ GTM Variables Check:');
              console.log('  - window.dataLayer exists:', !!window.dataLayer);
              console.log('  - window.dataLayer length:', window.dataLayer?.length || 0);
              console.log('  - window.google_tag_manager exists:', !!(window as any).google_tag_manager);
              
              // Send a verification event
              window.dataLayer.push({
                event: 'gtm_loaded',
                gtm_id: GTM_ID,
                load_time: new Date().toISOString()
              });
            }
          }, 1000);
        }}
        onError={(e) => {
          console.error('❌ GTM script failed to load:', e);
          console.error('❌ Failed URL:', `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`);
        }}
      />
      
      {/* Google Tag Manager (noscript) */}
      <noscript>
        <iframe 
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0" 
          width="0" 
          style={{display:"none",visibility:"hidden"}}
        />
      </noscript>
    </>
  );
}

declare global {
  interface Window {
    dataLayer: any[];
  }
}
