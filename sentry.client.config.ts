// This file configures the initialization of Sentry for the browser.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

// Only initialize Sentry if DSN is available
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    
    // Adjust this value in production, or use tracesSampler for greater control
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    
    // Session replay sample rate
    replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.01 : 0.1,
    replaysOnErrorSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    
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
      
      // Filter out specific Server Action errors that are handled
      if (event.message?.includes('Failed to find Server Action')) {
        // Still send but with lower severity
        event.level = 'warning';
        event.tags = {
          ...event.tags,
          category: 'server-action-mismatch',
          recoverable: 'true'
        };
      }
      
      // Tag clientModules errors for tracking
      if (event.message?.includes('clientModules')) {
        event.tags = {
          ...event.tags,
          category: 'client-modules-error',
          component: 'nextjs-internal'
        };
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
    
    // Integrations
    integrations: [
      new Sentry.Replay({
        maskAllText: process.env.NODE_ENV === 'production',
        blockAllMedia: process.env.NODE_ENV === 'production',
      }),
      new Sentry.BrowserTracing({
        // Capture interactions like clicks and navigation
        routingInstrumentation: Sentry.nextRouterInstrumentation,
      }),
    ],
    
    // Performance monitoring
    profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 0,
    
    // Debug mode for development
    debug: process.env.NODE_ENV === 'development',
  });
} else {
  console.warn('Sentry not initialized: NEXT_PUBLIC_SENTRY_DSN environment variable not found');
}
