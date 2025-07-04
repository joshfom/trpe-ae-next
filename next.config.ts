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
    loaderFile: './loader.js',
        unoptimized: false, // Ensure images are optimized
        remotePatterns: [
            { protocol: 'https', hostname: "images.unsplash.com" },
            { protocol: 'https', hostname: "crm.trpeglobal.com" },
            { protocol: 'https', hostname: "trpe.ae" },
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
                        value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' *.vercel.app vercel.app *.trpe.ae trpe.ae; style-src 'self' 'unsafe-inline'; img-src * data:; font-src 'self' data:; connect-src *;",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
