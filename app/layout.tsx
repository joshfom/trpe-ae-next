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
import GTMDebugPanel from "@/components/GTMDebugPanel";

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
   
   <Script id="gtm-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{
            __html: `
            console.log('🚀 Initializing GTM...');
            (function(w,d,s,l,i){
            w[l]=w[l]||[];
            w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
            console.log('🏷️ GTM dataLayer initialized:', w[l]);
            var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
            j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;
            console.log('🏷️ GTM script URL:', j.src);
            j.onload = function() {
              console.log('✅ GTM script loaded successfully');
              console.log('🏷️ GTM container status:', typeof w.google_tag_manager);
              w[l].push({
                event: 'gtm_script_loaded',
                timestamp: new Date().toISOString()
              });
            };
            j.onerror = function() {
              console.error('❌ GTM script failed to load');
            };
            f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-MNQMSPX');
            
            // Additional logging
            setTimeout(function() {
              console.log('🔍 GTM Status Check:');
              console.log('  - dataLayer exists:', !!window.dataLayer);
              console.log('  - dataLayer length:', window.dataLayer ? window.dataLayer.length : 0);
              console.log('  - google_tag_manager exists:', !!window.google_tag_manager);
              console.log('  - GTM scripts on page:', document.querySelectorAll('script[src*="googletagmanager"]').length);
              
              if (window.dataLayer && window.dataLayer.length > 0) {
                console.log('🎉 SUCCESS: GTM is working! Tag Assistant should now detect your container.');
                console.log('🏷️ Recent events:', window.dataLayer.slice(-5));
              }
            }, 2000);
          `,
          }}
          />

          
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
      
      {/* GTM Debug Panel - Development only */}
      <GTMDebugPanel />

      </body>

      </html>
  );
}
