'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { CookieManager } from '@/lib/cookie-manager';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

const GTMConsentScript = () => {
  useEffect(() => {
    // Initialize consent mode before GTM loads
    const consent = CookieManager.getConsent();
    
    window.dataLayer = window.dataLayer || [];
    
    // Set default consent state
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'default', {
        analytics_storage: consent?.preferences.analytics ? 'granted' : 'denied',
        ad_storage: 'denied',
        functionality_storage: 'granted',
        personalization_storage: 'denied',
        security_storage: 'granted',
      });
    }
  }, []);

  return (
    <>
      {/* Consent Mode Initialization - MUST be first */}
      <Script
        id="gtm-consent-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            // Initialize Google Consent Mode
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            
            // Get stored consent
            let storedConsent = null;
            try {
              const stored = localStorage.getItem('cookie-consent');
              storedConsent = stored ? JSON.parse(stored) : null;
            } catch (e) {}
            
            gtag('consent', 'default', {
              'analytics_storage': storedConsent?.preferences?.analytics ? 'granted' : 'denied',
              'ad_storage': 'denied',
              'functionality_storage': 'granted',
              'personalization_storage': 'denied',
              'security_storage': 'granted'
            });
          `,
        }}
      />

      {/* Cookie Consent Event Listener */}
      <Script
        id="gtm-consent-listener"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            // Listen for consent changes
            window.addEventListener('storage', function(e) {
              if (e.key === 'cookie-consent' && typeof gtag === 'function') {
                try {
                  const consent = JSON.parse(e.newValue || '{}');
                  if (consent.preferences) {
                    gtag('consent', 'update', {
                      'analytics_storage': consent.preferences.analytics ? 'granted' : 'denied'
                    });
                  }
                } catch (error) {
                  console.warn('Failed to parse cookie consent:', error);
                }
              }
            });

            // Apply current consent state on load
            setTimeout(function() {
              if (typeof gtag === 'function') {
                try {
                  const stored = localStorage.getItem('cookie-consent');
                  if (stored) {
                    const consent = JSON.parse(stored);
                    if (consent.preferences) {
                      gtag('consent', 'update', {
                        'analytics_storage': consent.preferences.analytics ? 'granted' : 'denied'
                      });
                    }
                  }
                } catch (error) {
                  console.warn('Failed to apply stored cookie consent:', error);
                }
              }
            }, 100);
          `,
        }}
      />
    </>
  );
};

export default GTMConsentScript;
