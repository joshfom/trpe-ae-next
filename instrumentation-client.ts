// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

// Only initialize Sentry if DSN is available
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    
    // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    
    // Session replay sample rate
    replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.01 : 0.1,
    replaysOnErrorSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    
    // Add optional integrations for additional features
    integrations: [
      Sentry.replayIntegration({
        maskAllText: process.env.NODE_ENV === 'production',
        blockAllMedia: process.env.NODE_ENV === 'production',
      }),
    ],
    
    // Enable logs to be sent to Sentry
    enableLogs: true,
    
    // Set up error filtering for production
    beforeSend(event) {
      // Don't send events in development unless explicitly enabled
      if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_SENTRY_ENABLE_DEV) {
        return null;
      }
      
      // Filter out specific errors
      if (event.exception) {
        const error = event.exception.values?.[0];
        if (error?.value) {
          // Filter out known harmless errors
          const harmlessErrors = [
            'ResizeObserver loop limit exceeded',
            'Non-Error promise rejection captured',
            'Loading chunk',
            'Loading CSS chunk',
            'ChunkLoadError',
            'Script error',
            'clientModules', // Filter out the clientModules errors
            'entryCSSFiles', // Filter out the entryCSSFiles errors
          ];
          
          if (harmlessErrors.some(harmless => error.value?.includes(harmless))) {
            return null;
          }
          
          // Filter out network errors that are not actionable
          if (error.value?.includes('Failed to fetch') || 
              error.value?.includes('NetworkError') ||
              error.value?.includes('ERR_NETWORK')) {
            return null;
          }
        }
      }
      
      // Filter out Next.js internal module errors
      if (event.message?.includes('clientModules') || 
          event.message?.includes('entryCSSFiles')) {
        return null; // Don't send these to Sentry as they're internal Next.js issues
      }
      
      return event;
    },
    
    // Additional browser-specific configuration
    environment: process.env.NODE_ENV,
    release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || 'unknown',
    
    // Enhanced context
    initialScope: {
      tags: {
        component: 'client',
        runtime: 'browser',
      },
    },
    
    // Performance monitoring
    profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 0,
    
    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: process.env.NODE_ENV === 'development',
  });
} else {
  console.warn('Sentry not initialized: NEXT_PUBLIC_SENTRY_DSN environment variable not found');
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;