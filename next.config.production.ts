import type { NextConfig } from "next";

// Production configuration to work around Next.js 15.5.x bugs
const productionConfig: NextConfig = {
    // CRITICAL: Use standalone mode instead of export to keep API routes working
    output: 'standalone',
    poweredByHeader: false,
    reactStrictMode: false, // Disable strict mode in production to avoid double mounting
    crossOrigin: 'anonymous',
    
    // Disable problematic experimental features that cause RSC issues
    experimental: {
        optimizePackageImports: ['lucide-react'],
        // Disable problematic features
        clientRouterFilter: false,
        clientRouterFilterAllowedRate: 0,
        serverComponentsExternalPackages: ['sharp'], // Move sharp to external packages
        // Critical fixes for clientReferenceManifest error
        forceSwcTransforms: true,
        swcTraceProfiling: false,
        // Disable problematic runtime features
        serverSourceMaps: false,
    },
    
    images: {
        // Keep default loader for standalone builds
        unoptimized: false,
        remotePatterns: [
            { protocol: 'https', hostname: "images.unsplash.com" },
            { protocol: 'https', hostname: "crm.trpeglobal.com" },
            { protocol: 'https', hostname: "trpe.ae" },
            { protocol: 'https', hostname: "images.trpe.ae" },
            { protocol: 'https', hostname: "files.edgestore.dev" },
            { protocol: 'https', hostname: "trpe-ae.s3.me-central-1.amazonaws.com" },
            { protocol: 'https', hostname: "assets.aceternity.com" }
        ],
        formats: ['image/webp', 'image/avif'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: 31536000,
    },
    
    serverExternalPackages: ['sharp', 'onnxruntime-node'],
    compress: true,
    
    webpack: (config, { dev, isServer }) => {
        // Critical fix for clientReferenceManifest bug
        if (!dev && !isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                net: false,
                tls: false,
            };
        }
        
        // Enhanced workaround for Next.js 15.5.x RSC issues
        if (!dev) {
            config.optimization = {
                ...config.optimization,
                realContentHash: false, // Disable real content hash in production
                moduleIds: 'deterministic', // Ensure consistent module IDs
            };
            
            // Force proper client reference manifest generation
            config.plugins = config.plugins || [];
            config.plugins.push({
                apply: (compiler: any) => {
                    compiler.hooks.beforeCompile.tap('ClientReferenceManifestFix', () => {
                        // Ensure proper client reference manifest initialization
                        if (typeof globalThis !== 'undefined') {
                            (globalThis as any).__webpack_require__ = (globalThis as any).__webpack_require__ || {};
                        }
                    });
                }
            });
        }
        
        return config;
    },
    
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
                    {
                        key: 'Content-Security-Policy',
                        value: [
                            "default-src 'self'",
                            "script-src 'self' 'unsafe-eval' 'unsafe-inline' 'wasm-unsafe-eval' 'inline-speculation-rules' *.vercel.app vercel.app *.trpe.ae trpe.ae *.googletagmanager.com googletagmanager.com *.google-analytics.com google-analytics.com *.facebook.net facebook.net connect.facebook.net *.doubleclick.net doubleclick.net *.googleadservices.com googleadservices.com *.clarity.ms clarity.ms *.google.com google.com *.cloudflareinsights.com cloudflareinsights.com static.cloudflareinsights.com chrome-extension: moz-extension:",
                            "style-src 'self' 'unsafe-inline'",
                            "img-src * data: blob:",
                            "font-src 'self' data:",
                            "connect-src *",
                            "frame-src 'self' *.googletagmanager.com googletagmanager.com *.doubleclick.net doubleclick.net *.facebook.com facebook.com"
                        ].join('; '),
                    },
                ],
            },
        ];
    },
};

export default productionConfig;
