import type {Metadata} from "next";
import {Poppins, Playfair_Display} from "next/font/google";
import "./globals.css";
import "./empty-para.css";
import "./tiptap-spacing.css";

import NextTopLoader from 'nextjs-toploader';
import {EdgeStoreProvider} from "@/db/edgestore";
import {Toaster} from "sonner";
import {SpeedInsights} from "@vercel/speed-insights/next";
import {Analytics} from "@vercel/analytics/react"
import Script from "next/script";
import {cn} from "@/lib/utils";
import Clarity from '@microsoft/clarity';

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

    const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID!;
    Clarity.init(projectId);
  return (
      <html lang="en" className="js" suppressHydrationWarning>
      <head>
        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MNQMSPX');`}
        </Script>
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
      <body className={cn(poppins.className, playfairDisplay.variable, 'bg-slate-100 px-6 xl:px-0')}>
      {/* Google Tag Manager (noscript) */}
      <noscript>
        <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MNQMSPX"
                height="0" width="0" style={{display:"none",visibility:"hidden"}}></iframe>
      </noscript>
      <SpeedInsights/>
      <Analytics/>
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

      <Script
          id="facebook-pixel"
          strategy="afterInteractive"
      >
          {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${process.env.NEXT_PUBLIC_FACEBOOK_PIXEL}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
          <img
              height="1"
              width="1"
              style={{display: "none"}}
              src={`https://www.facebook.com/tr?${process.env.NEXT_PUBLIC_FACEBOOK_PIXEL}&ev=PageView&noscript=1`}
              alt="Facebook Pixel"
          />
      </noscript>
      </body>

      </html>
  );
}
