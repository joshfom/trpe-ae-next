import type {Metadata} from "next";
import {Poppins, Playfair_Display} from "next/font/google";
import "./globals.css";
import "./empty-para.css";
import "./tiptap-spacing.css";

import NextTopLoader from 'nextjs-toploader';
import {EdgeStoreProvider} from "@/db/edgestore";
import {Toaster} from "sonner";
import Script from "next/script";
import {cn} from "@/lib/utils";
// Choose one of these cookie consent implementations:
// import CookieConsent from "@/components/CookieConsent"; // Original blocking version
// import CookieConsentNonBlocking from "@/components/CookieConsentNonBlocking"; // Non-blocking card
// import CookieConsentBanner from "@/components/CookieConsentBanner"; // Bottom banner
import CookieConsentMinimal from "@/components/CookieConsentMinimal"; // Minimal notice
import GTMConsentScript from "@/components/GTMConsentScript";

const poppins = Poppins({
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
});

const playfairDisplay = Playfair_Display({
  weight: ['400'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-playfair-display',
});

export const metadata: Metadata = {
    robots: {
        index: true,
        follow: true,
    },
  title: "Dubai Real Estate | Buy, Sell or Rent Property in Dubai - TRPE AE",
  description: "Discover your dream property for sale or rent in Dubai with TRPE. Expert insights, seamless transactions, and personalised service await you.",
    creator: "Joshua Fomubod",
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_URL}/`,
    },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en" className="js" suppressHydrationWarning>
      <head>
   
   {/* GTM Consent Mode - Must load first */}
   <GTMConsentScript />
   
   {/* Early GTM Form Filter - Must load before GTM */}
   <Script id="gtm-early-filter" strategy="beforeInteractive" dangerouslySetInnerHTML={{
     __html: `
       // Early GTM Form Blocking Script - ULTRA AGGRESSIVE
       (function() {
         'use strict';
         
         window.dataLayer = window.dataLayer || [];
         
         const BLOCKED_EVENTS = [
           'form_start', 'form_submited', 'form_submit', 'gtm.formSubmit',
           'gtm.formStart', 'gtm.formInteraction', 'gtm.form', 'formSubmit'
         ];
         
         const shouldBlock = (data) => {
           if (!data) return false;
           
           // Always allow search_submitted and our custom events
           if (data.event === 'search_submitted' || 
               (data.event && data.event.startsWith('search_')) ||
               data.event === 'gtm.js' ||
               data.event === 'gtm.load' ||
               data.event === 'gtm.dom' ||
               data.event === 'gtm.config' ||
               data.event === 'page_view' ||
               data.event === 'gtm.historyChange' ||
               data.event === 'gtm.historyChange-v2' ||
               data.event === 'main_search' ||
               data.event === 'enhanced_contact_form' ||
               data.event === 'seller_contact_form' ||
               data.event === 'general_contact_form' ||
               data.event === 'property_listing_form') {
             return false;
           }
           
           // Block by event name
           if (data.event && BLOCKED_EVENTS.includes(data.event)) {
             return true;
           }
           
           // Block ALL events with eventModel (GTM auto-tracking) - MOST IMPORTANT
           if (data.eventModel && typeof data.eventModel === 'object') {
             // Check if it's a form-related eventModel
             const hasFormProps = Object.keys(data.eventModel).some(key => 
               key.includes('form') || key.includes('element') || key.includes('text') || key.includes('url')
             );
             if (hasFormProps || data.event !== 'page_view') { // Allow page_view with eventModel
               return true;
             }
           }
           
           // Block GTM form priorities (5, 6, 7 are form-related)
           if (data.gtm && (data.gtm.priorityId === 5 || data.gtm.priorityId === 6 || data.gtm.priorityId === 7)) {
             return true;
           }
           
           // Block events with eventCallback = "Function" (often form events)
           if (data.eventCallback === 'Function' && !data.event.startsWith('search_')) {
             return true;
           }
           
           // Block any event that has form-related properties
           if (data && (data.form_id || data.form_name || data.form_destination || data.form_length)) {
             return true;
           }
           
           // Block events with element_* properties (GTM auto-tracking)
           if (data && Object.keys(data).some(key => key.startsWith('element_'))) {
             return true;
           }
           return false;
         };
         
         const originalPush = window.dataLayer.push;
         window.dataLayer.push = function(data) {
           if (shouldBlock(data)) {
             return window.dataLayer.length;
           }
           return originalPush.call(this, data);
         };
       })();
     `
   }} />
   
   <Script id="gtm-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{
            __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];
            w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
            var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
            j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;
            f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-MNQMSPX');
            
            // Declare gtag function
            window.gtag = window.gtag || function(){(window.gtag.q=window.gtag.q||[]).push(arguments);};
            
            // Completely disable automatic form tracking - NUCLEAR OPTION
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
              'gtm.blocklist': ['html', 'form', 'formSubmit', 'formStart', 'formInteraction', 'formAbandon'],
              'gtm.allowlist': ['customEvent', 'pageview', 'historyChange'],
              'event': 'gtm.config',
              'custom_map.form_start': false,
              'custom_map.form_submit': false,
              'custom_map.form_interaction': false,
              'custom_map.form_abandon': false,
              'send_page_view': false,
              'send_form_data': false,
              'linker': { 'domains': [] },
              'transport_type': 'beacon',
              'allow_enhanced_conversions': false,
              'allow_google_signals': false
            });
            
            // Completely disable form interaction tracking
            window.gtag = window.gtag || function(){(window.gtag.q=window.gtag.q||[]).push(arguments);};
            window.gtag('config', 'GTM-MNQMSPX', {
              'send_page_view': false,
              'custom_map.form_start': false,
              'custom_map.form_submit': false
            });
            
            // Nuke all form event listeners before GTM can attach them
            if (typeof document !== 'undefined') {
              const originalAddEventListener = Element.prototype.addEventListener;
              Element.prototype.addEventListener = function(type, listener, options) {
                // Block ALL form-related GTM listeners
                if (this.tagName === 'FORM' && 
                    (type === 'submit' || type === 'focus' || type === 'blur' || type === 'input' || type === 'change') && 
                    (listener.toString().includes('gtm') || listener.toString().includes('dataLayer'))) {
                  return;
                }
                return originalAddEventListener.call(this, type, listener, options);
              };
              
              // Also block document-level form listeners
              const originalDocAddEventListener = document.addEventListener;
              document.addEventListener = function(type, listener, options) {
                if ((type === 'submit' || type === 'focus' || type === 'blur') && 
                    (listener.toString().includes('gtm') || listener.toString().includes('dataLayer'))) {
                  return;
                }
                return originalDocAddEventListener.call(this, type, listener, options);
              };
            }
            
            // TEMPORARY: Disable nuclear proxy to test filters
            // setTimeout(() => {
            //   const BLOCKED_EVENTS = ['form_start', 'form_submit', 'form_submited', 'gtm.formSubmit', 'gtm.formStart'];
              
            //   Object.defineProperty(window, 'dataLayer', {
            //     value: new Proxy(window.dataLayer || [], {
            //       get(target, prop) {
            //         if (prop === 'push') {
            //           return function(data) {
            //             // Allow only search_submitted and non-form events
            //             if (data && data.event && data.event === 'search_submitted') {
            //               console.log('✅ PROXY: Allowed search_submitted');
            //               return Array.prototype.push.call(target, data);
            //             }
                        
            //             // Block all form events
            //             if (data && data.event && BLOCKED_EVENTS.includes(data.event)) {
            //               console.log('🚫 PROXY: Blocked', data.event);
            //               return target.length;
            //             }
                        
            //             // Block events with eventModel
            //             if (data && data.eventModel) {
            //               console.log('🚫 PROXY: Blocked eventModel', data.event);
            //               return target.length;
            //             }
                        
            //             // Block form priorities
            //             if (data && data.gtm && (data.gtm.priorityId === 5 || data.gtm.priorityId === 6 || data.gtm.priorityId === 7)) {
            //               console.log('🚫 PROXY: Blocked priority', data.gtm.priorityId);
            //               return target.length;
            //             }
                        
            //             // Allow other events
            //             console.log('✅ PROXY: Allowed', data.event || 'unknown');
            //             return Array.prototype.push.call(target, data);
            //           };
            //         }
            //         return target[prop];
            //       }
            //     }),
            //     configurable: false,
            //     writable: false
            //   });
              
            //   console.log('🚫 NUCLEAR: DataLayer proxy installed');
            // }, 2000);
          `,
          }}
          />

          {/* Disable GTM Tag Assistant and Debug Mode */}
          <Script id="disable-tag-assistant" strategy="afterInteractive" dangerouslySetInnerHTML={{
            __html: `
              // Disable Tag Assistant popup
              if (typeof window !== 'undefined') {
                // Remove any Tag Assistant elements
                setTimeout(() => {
                  const tagAssistantElements = document.querySelectorAll('[data-tag-assistant], .tag-assistant, #tag-assistant');
                  tagAssistantElements.forEach(el => el.remove());
                  
                  // Disable GTM debug mode
                  if (window.google_tag_manager) {
                    window.google_tag_manager.dataLayer = window.google_tag_manager.dataLayer || {};
                    window.google_tag_manager.dataLayer.debug = false;
                  }
                  
                  // Disable Tag Assistant specific functionality
                  window.gtag = window.gtag || function(){};
                  if (window.gtag) {
                    window.gtag('config', 'GTM-MNQMSPX', {
                      'debug_mode': false,
                      'tag_assistant': false
                    });
                  }
                }, 1000);
              }
            `
          }} />

          
        {/* End Google Tag Manager */}
        <meta name="google-site-verification" content="1PdN9Ng2af8MbSlor1keRIIXn_sM3nHkj2JPsWnyB1o"/>
        <meta name="next-head-count" content="3"/>
        <style dangerouslySetInnerHTML={{ 
          __html: `
            /* JavaScript detection - essential CSS */
            .no-js .js-only { display: none !important; }
            .js .no-js-only { display: none !important; }
            
            /* Disable JS-required elements in no-JS mode */
            html.no-js button[aria-haspopup="true"],
            html.no-js [data-js-required="true"] { display: none !important; }
          `
        }} />
      </head>
      <body className={cn(poppins.className, playfairDisplay.variable, 'bg-slate-100 xl:px-0')}>

      {/* GDPR-Compliant GTM with Consent Mode */}
      <GTMConsentScript />

      <noscript>
        <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MNQMSPX"
                height="0" width="0" style={{display:"none",visibility:"hidden"}}></iframe>
      </noscript>
      {/* End Google Tag Manager (noscript) */}
      
      <NextTopLoader
          color="#374151"
      />
      <EdgeStoreProvider>
          {children}
      </EdgeStoreProvider>

      <Toaster
          position="top-center"
          richColors
      />

      <CookieConsentMinimal />

      </body>

      </html>
  );
}
