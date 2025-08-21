// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

// Only initialize Sentry if DSN is available
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,

    // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    // Enable logs to be sent to Sentry
    enableLogs: true,

    // Set up error filtering for edge runtime
    beforeSend(event) {
      // Filter out Next.js internal module errors in edge runtime too
      if (event.exception) {
        const error = event.exception.values?.[0];
        if (error?.value) {
          const nextJsInternalErrors = [
            'clientModules',
            'entryCSSFiles',
            'Cannot read properties of undefined (reading \'clientModules\')',
            'Cannot read properties of undefined (reading \'entryCSSFiles\')',
          ];
          
          if (nextJsInternalErrors.some(internalError => error.value?.includes(internalError))) {
            return null;
          }
        }
      }

      if (event.message?.includes('clientModules') || 
          event.message?.includes('entryCSSFiles')) {
        return null;
      }

      return event;
    },

    // Additional edge-specific configuration
    environment: process.env.NODE_ENV,
    release: process.env.VERCEL_GIT_COMMIT_SHA || 'unknown',

    // Enhanced context
    initialScope: {
      tags: {
        component: 'edge',
        runtime: 'edge',
      },
    },

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: process.env.NODE_ENV === 'development',
  });
} else {
  console.warn('Sentry not initialized: SENTRY_DSN environment variable not found');
}
