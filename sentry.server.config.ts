// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
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

    // Set up error filtering
    beforeSend(event) {
      // Filter out Next.js internal module errors
      if (event.exception) {
        const error = event.exception.values?.[0];
        if (error?.value) {
          // Filter out internal Next.js errors that are not actionable
          const nextJsInternalErrors = [
            'clientModules',
            'entryCSSFiles',
            'Cannot read properties of undefined (reading \'clientModules\')',
            'Cannot read properties of undefined (reading \'entryCSSFiles\')',
          ];
          
          if (nextJsInternalErrors.some(internalError => error.value?.includes(internalError))) {
            return null; // Don't send these to Sentry
          }
        }
      }

      // Filter out similar message-based errors
      if (event.message?.includes('clientModules') || 
          event.message?.includes('entryCSSFiles')) {
        return null;
      }

      return event;
    },

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

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: process.env.NODE_ENV === 'development',
  });
} else {
  console.warn('Sentry not initialized: SENTRY_DSN environment variable not found');
}
