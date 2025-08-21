import {withSentryConfig} from '@sentry/nextjs';
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    output: 'standalone', // Ensures better optimization for deployment
    poweredByHeader: false, // Remove X-Powered-By header for security
    reactStrictMode: true, // Helps catch bugs early
    crossOrigin: 'anonymous', // Set CORS headers
    
    // Add worker process limits to prevent runaway processes
    experimental: {
        optimizePackageImports: ['lucide-react', '@radix-ui/react-*', '@tiptap/react'],
        // Limit worker processes to prevent infinite loops
        workerThreads: false,
        cpus: Math.min(4, require('os').cpus().length), // Limit CPU usage
    },
    
    // Note: NODE_OPTIONS should be set in package.json scripts instead
    images: {
        loader: 'custom',
        loaderFile: './scripts/loader.js',
        unoptimized: false, // Ensure images are optimized
        remotePatterns: [
            { protocol: 'https', hostname: "images.unsplash.com" },
            { protocol: 'https', hostname: "crm.trpeglobal.com" },
            { protocol: 'https', hostname: "trpe.ae" },
            { protocol: 'https', hostname: "images.trpe.ae" },
            { protocol: 'https', hostname: "files.edgestore.dev" },
            { protocol: 'https', hostname: "trpe-ae.s3.me-central-1.amazonaws.com" },
            { protocol: 'https', hostname: "assets.aceternity.com" }
        ],
        formats: ['image/webp', 'image/avif'], // Enable modern formats
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: 31536000, // 1 year cache for images
    },
    // Move serverComponentsExternalPackages to root level as per Next.js 15
    serverExternalPackages: ['sharp', 'onnxruntime-node'],
    // Enable compression
    compress: true,
    
    // Simplified webpack configuration (Turbopack compatible)
    webpack: (config, { dev, isServer }) => {
        // Remove optimization settings that conflict with Turbopack
        return config;
    },
    
    // Headers for better caching and security
    async headers() {
        return [
            {
                source: '/_next/static/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
            // Luxe routes optimization
            {
                source: '/luxe/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
                    },
                    {
                        key: 'Vary',
                        value: 'Accept-Encoding, Accept',
                    },
                ],
            },
            // API routes should not be cached
            {
                source: '/api/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'no-store, no-cache, must-revalidate',
                    },
                ],
            },
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on',
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'origin-when-cross-origin',
                    },
                    // Ensure scripts can load properly
                    {
                        key: 'Content-Security-Policy',
                        value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' *.vercel.app vercel.app *.trpe.ae trpe.ae *.googletagmanager.com googletagmanager.com *.google-analytics.com google-analytics.com *.facebook.net facebook.net connect.facebook.net *.doubleclick.net doubleclick.net *.googleadservices.com googleadservices.com *.clarity.ms clarity.ms *.google.com google.com; style-src 'self' 'unsafe-inline'; img-src * data:; font-src 'self' data:; connect-src *; frame-src 'self' *.googletagmanager.com googletagmanager.com *.doubleclick.net doubleclick.net *.facebook.com facebook.com;",
                    },
                ],
            },
        ];
    },
};

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "real-estate-97",

  project: "javascript-nextjs",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/monitoring",

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
});