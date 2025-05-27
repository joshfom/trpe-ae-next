#!/bin/bash

# Performance testing script for SSR optimization
# Tests page load times before and after SSR implementation

echo "🚀 Testing SSR Performance Improvements"
echo "========================================"

BASE_URL="http://localhost:3000"
PAGES=(
    "/"
    "/properties/for-sale"
    "/properties/for-rent"
)

echo "📊 Testing page load times..."

for page in "${PAGES[@]}"; do
    echo ""
    echo "Testing: $BASE_URL$page"
    echo "----------------------------------------"
    
    # Test with curl to measure server response time
    echo "⏱️  Server Response Time:"
    curl -w "  DNS Lookup: %{time_namelookup}s\n  TCP Connect: %{time_connect}s\n  TLS Handshake: %{time_appconnect}s\n  Time to First Byte: %{time_starttransfer}s\n  Total Time: %{time_total}s\n" \
         -o /dev/null -s "$BASE_URL$page"
    
    echo ""
    echo "📄 Response Headers:"
    curl -I -s "$BASE_URL$page" | grep -E "(cache-control|x-cache|age|etag)"
    
    echo ""
done

echo ""
echo "🧪 Testing Cache Revalidation API..."
echo "======================================"

# Test revalidation endpoint (this will fail without proper secret, but we can test the endpoint exists)
echo "Testing revalidation endpoint availability:"
curl -X POST "$BASE_URL/api/revalidate" \
     -H "Content-Type: application/json" \
     -d '{"type": "homepage", "secret": "test"}' \
     -w "Response Code: %{http_code}\n" \
     -s -o /dev/null

echo ""
echo "✅ Performance testing complete!"
echo ""
echo "💡 Next steps:"
echo "   1. Set REVALIDATION_SECRET in .env.local"
echo "   2. Monitor Core Web Vitals in production"
echo "   3. Set up CDN caching headers"
echo "   4. Configure monitoring and alerts"
