// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

// Only initialize Sentry if DSN is available
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    
    // Adjust this value in production, or use tracesSampler for greater control
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    
    // Set up error filtering for production
    beforeSend(event) {
      // Don't send events in development unless explicitly enabled
      if (process.env.NODE_ENV === 'development' && !process.env.SENTRY_ENABLE_DEV) {
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
          ];
          
          if (harmlessErrors.some(harmless => error.value?.includes(harmless))) {
            return null;
          }
        }
      }
      
      return event;
    },
    
    // Capture unhandled promise rejections
    captureUnhandledRejections: true,
    
    // Additional server-specific configuration
    environment: process.env.NODE_ENV,
    release: process.env.VERCEL_GIT_COMMIT_SHA || 'unknown',
    
    // Enhanced context
    initialScope: {
      tags: {
        component: 'server',
        runtime: 'nodejs',
      },
    },
    
    // Performance monitoring
    profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 0,
    
    // Debug mode for development
    debug: process.env.NODE_ENV === 'development',
  });
} else {
  console.warn('Sentry not initialized: SENTRY_DSN environment variable not found');
}
