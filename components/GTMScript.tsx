'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { trackEnhancedPageView } from '@/lib/gtm-events';

const GTM_ID = 'GTM-MNQMSPX';

export default function GTMScript() {
  useEffect(() => {
    // Initialize dataLayer
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      
      // Push initial GTM events
      window.dataLayer.push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js'
      });
      
      // Push enhanced initial page view with better data structure
      trackEnhancedPageView({
        page_category: window.location.pathname === '/' ? 'home' : 'other',
        page_type: window.location.pathname === '/' ? 'homepage' : 'page',
        content_group1: 'initial_load',
        user_type: 'visitor' // You can enhance this with actual user data
      });
    }
  }, []);

  return (
    <>
      {/* Google Tag Manager */}
      <Script
        id="gtm-script"
        src={`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`}
        strategy="afterInteractive"
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
