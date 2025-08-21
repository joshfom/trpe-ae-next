import { NextConfig } from 'next';

// Check if Sentry configuration is available
const SENTRY_DSN = process.env.SENTRY_DSN;
const SENTRY_ORG = process.env.SENTRY_ORG;
const SENTRY_PROJECT = process.env.SENTRY_PROJECT;

// Only configure Sentry if all required environment variables are available
const withSentry = SENTRY_DSN && SENTRY_ORG && SENTRY_PROJECT 
  ? require("@sentry/nextjs").withSentryConfig 
  : (config: NextConfig) => config;

import nextConfig from './next.config';

// Sentry configuration (only applied if environment variables are set)
const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry webpack plugin. 
  // Keep in mind that some options are overridden by Next.js.
  silent: true, // Suppresses source map uploading logs during build
  org: SENTRY_ORG,
  project: SENTRY_PROJECT,
  
  // Only upload source maps in production and when Sentry is configured
  dryRun: process.env.NODE_ENV !== 'production' || !SENTRY_DSN,
  
  // Disable source map upload if no auth token
  disableServerWebpackPlugin: !process.env.SENTRY_AUTH_TOKEN,
  disableClientWebpackPlugin: !process.env.SENTRY_AUTH_TOKEN,
};

const configWithSentry = SENTRY_DSN 
  ? withSentry(nextConfig, sentryWebpackPluginOptions)
  : nextConfig;

export default configWithSentry;
