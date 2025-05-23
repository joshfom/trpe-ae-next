import type {Metadata} from "next";
import {Poppins} from "next/font/google";
import "./globals.css";

import NextTopLoader from 'nextjs-toploader';
import {EdgeStoreProvider} from "@/db/edgestore";
import {Toaster} from "sonner";
import {SpeedInsights} from "@vercel/speed-insights/next";
import {Analytics} from "@vercel/analytics/react"
import {GoogleAnalytics} from '@next/third-parties/google'
import Script from "next/script";
import {cn} from "@/lib/utils";
import GoogleTag from "@/components/GoogleTag";
import Clarity from '@microsoft/clarity';

const poppins = Poppins({
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
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
      <html lang="en">
      <meta name="google-site-verification" content="1PdN9Ng2af8MbSlor1keRIIXn_sM3nHkj2JPsWnyB1o"/>
      <body className={cn(poppins.className, 'bg-slate-100')}>
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

      <GoogleTag GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GOOGLE_TAG!}/>
      <GoogleAnalytics
          gaId="G-NQ5VN37Z0Y"
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
          />
      </noscript>
      </body>

      </html>
  );
}
