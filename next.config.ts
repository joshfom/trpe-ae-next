import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: false,
  poweredByHeader: false,
  compress: true,
  
  // Image configuration for external hosts
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'trpe-ae.s3.me-central-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'files.edgestore.dev',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
    ],
    // Enable optimization for better performance
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Webpack configuration
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    return config
  },

  // Experimental features (keeping minimal for stability)
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  // Note: Headers are disabled for export mode
  // Security headers would go here for regular server mode

  // Environment-specific configurations
  // Temporarily disable static export to allow API routes
  // ...(process.env.NODE_ENV === 'production' && {
  //   output: 'export',
  //   trailingSlash: true,
  //   skipTrailingSlashRedirect: true,
  //   distDir: 'out',
  // }),
}

export default nextConfig
