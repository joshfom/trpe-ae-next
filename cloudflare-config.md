# Cloudflare Configuration for Next.js App

# Add these rules to your Cloudflare dashboard:

## Page Rules:
# 1. For /luxe* routes
#    - Cache Level: Standard
#    - Browser Cache TTL: 4 hours
#    - Edge Cache TTL: 1 day

## Transform Rules:
# 1. Response Headers
#    - If: URI Path contains "/luxe"
#    - Then: Set static header "Cache-Control" to "public, max-age=3600, s-maxage=86400"

## Security Rules:
# 1. Skip speculation rules for API routes
#    - If: URI Path starts with "/api/"
#    - Then: Set header "Speculation-Rules" to "none"

# Alternative: Add to your next.config.js
async headers() {
  return [
    {
      source: '/luxe/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
        },
        {
          key: 'Speculation-Rules',
          value: 'prefetch',
        },
      ],
    },
    {
      source: '/api/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'no-store',
        },
      ],
    },
  ];
}
