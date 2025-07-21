'use client';

import Script from 'next/script';
import { useEffect } from 'react';

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
      
      // Push initial page view
      window.dataLayer.push({
        event: 'page_view',
        page_title: document.title,
        page_location: window.location.href,
        platform: 'trpe-ae',
        timestamp: new Date().toISOString()
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
