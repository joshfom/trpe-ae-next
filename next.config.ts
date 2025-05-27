import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
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
    experimental: {
        optimizePackageImports: ['lucide-react', '@radix-ui/react-*', '@tiptap/react'],
        // Enable modern optimizations
        // optimizeCss: true,  // Disabled temporarily due to critters dependency issue
        // Note: typedRoutes removed due to Turbopack incompatibility
    },
    // Move serverComponentsExternalPackages to root level as per Next.js 15
    serverExternalPackages: ['sharp', 'onnxruntime-node'],
    // Enable compression
    compress: true,
    
    // Simplified webpack configuration (Turbopack compatible)
    webpack: (config, { dev, isServer }) => {
        // Basic optimizations only
        config.optimization.usedExports = true;
        config.optimization.providedExports = true;
        
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
                ],
            },
        ];
    },
};

export default nextConfig;
