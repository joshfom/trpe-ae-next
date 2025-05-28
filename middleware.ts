import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define strict types for our redirect data structures
type Redirect = {
  fromUrl: string;
  toUrl: string | null;
  statusCode: '301' | '410';
  isActive: 'yes' | 'no';
};

// Single cache store for all redirects
let redirectCache: Map<string, Redirect> = new Map();
// Store detected 404 URLs to prevent redirect loops
let detected404Urls: Set<string> = new Set();
let lastLoadTime = 0;
const CACHE_DURATION = 86800000; // 24 hour in milliseconds
const DEBUG = true; // Set to true to enable debug logging

// HTML template for 410 Gone responses
const html410Template = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Property not available</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 min-h-screen flex items-center justify-center p-4">
  <div class="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
    <div class="mb-6">
      <svg class="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
      </svg>
    </div>
    <h1 class="text-2xl font-bold text-gray-800 mb-3">
      This property is no longer available
    </h1>
    <p class="text-gray-600 mb-6">
      The property listing you're looking for has been permanently removed from our database.
    </p>
    <div class="mb-6">
      <a href="/properties/for-sale" class="inline-block bg-black hover:bg-white text-white hover:text-black font-medium py-2 px-6 rounded-md transition-colors">
        View Available Properties
      </a>
    </div>
    <p class="text-sm text-gray-500">
      Error code: <span class="font-mono">410 Gone</span>
    </p>
  </div>
</body>
</html>`;

// Helper function to normalize URLs consistently
function normalizeUrl(url: string): string {
  if (!url) return '';
  // Keep the root path as is
  if (url === '/') return '/';
  // Remove trailing slash and convert to lowercase for all other paths
  return url.replace(/\/$/, '').toLowerCase();
}

// Modified function to load redirects from API instead of direct DB access
async function loadAllRedirects() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const response = await fetch(`${apiUrl}/api/redirects`, {
      // Add cache: 'no-store' to always get fresh data
      cache: 'no-store',
      next: { revalidate: 300 } // Revalidate every 5 minutes
    });
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    // Clear the existing cache
    redirectCache.clear();
    
    if (result.success) {
      // Process all redirects and add them to the cache
      result.redirects.forEach((redirect: any) => {
        if (!redirect.fromUrl) return;
        
        const normalizedSource = normalizeUrl(redirect.fromUrl);
        redirectCache.set(normalizedSource, {
          fromUrl: normalizedSource,
          toUrl: redirect.toUrl?.toLowerCase() || null,
          statusCode: redirect.statusCode,
          isActive: redirect.isActive || 'yes'
        });
      });
      
      // Count redirects by status code for logging
      const redirect301Count = result.redirects.filter((r: any) => r.statusCode === '301').length;
      const redirect410Count = result.redirects.filter((r: any) => r.statusCode === '410').length;
      
      console.log(`[Middleware] Loaded ${result.redirects.length} redirects from API (${redirect301Count} 301 redirects, ${redirect410Count} 410 URLs)`);
      
      if (DEBUG) {
        // Log samples for debugging
        const sample301 = result.redirects
          .filter((r: any) => r.statusCode === '301')
          .slice(0, 5)
          .map((r: any) => `${r.fromUrl} → ${r.toUrl}`);
          
        const sample410 = result.redirects
          .filter((r: any) => r.statusCode === '410')
          .slice(0, 5)
          .map((r: any) => r.fromUrl);
          
        if (sample301.length > 0) {
          console.log(`[Middleware] 301 redirect samples: ${sample301.join(', ')}`);
        }
        
        if (sample410.length > 0) {
          console.log(`[Middleware] 410 URL samples: ${sample410.join(', ')}`);
        }
      }
      
      // Verify redirects for potential issues
      validateRedirects();
    } else {
      console.error('[Middleware] Failed to fetch redirects from API:', result.error);
    }
  } catch (error) {
    console.error('[Middleware] Failed to load redirects from API:', error);
    // Don't let the middleware crash, return empty results
    redirectCache.clear();
  }
}

// Validate redirects to prevent redirect loops and invalid destinations
function validateRedirects() {
  const redirectsToRemove: string[] = [];
  
  // Check for redirect loops and invalid destinations (like redirecting to a 410 URL)
  for (const [sourceUrl, redirect] of redirectCache.entries()) {
    // Skip 410 URLs and inactive redirects
    if (redirect.statusCode === '410' || redirect.isActive === 'no') continue;
    
    // Skip if already marked for removal
    if (redirectsToRemove.includes(sourceUrl)) continue;
    
    // Check for self-redirects (direct loops)
    if (redirect.toUrl && normalizeUrl(sourceUrl) === normalizeUrl(redirect.toUrl)) {
      console.warn(`[Middleware] Self-redirect detected and will be ignored: ${sourceUrl} → ${redirect.toUrl}`);
      redirectsToRemove.push(sourceUrl);
      continue;
    }
    
    // Follow the redirect chain to detect loops
    const visitedUrls = new Set<string>();
    visitedUrls.add(normalizeUrl(sourceUrl));
    
    let currentUrl = redirect.toUrl;
    let chain = [sourceUrl, currentUrl];
    let maxChainLength = 10; // Safety limit
    
    // Follow the chain as far as it goes
    while (currentUrl && maxChainLength-- > 0) {
      const normalizedCurrentUrl = normalizeUrl(currentUrl);
      
      // Check if we've seen this URL before (loop detected)
      if (visitedUrls.has(normalizedCurrentUrl)) {
        console.warn(`[Middleware] Redirect loop detected and will be ignored: ${chain.join(' → ')}`);
        redirectsToRemove.push(sourceUrl);
        break;
      }
      
      // Mark current URL as visited
      visitedUrls.add(normalizedCurrentUrl);
      
      // Check if there's another redirect for this destination
      const nextRedirect = redirectCache.get(normalizedCurrentUrl);
      if (!nextRedirect || nextRedirect.statusCode !== '301' || !nextRedirect.toUrl) {
        // Chain ends here, no loop
        
        // Check if destination is a 410 URL
        if (nextRedirect && nextRedirect.statusCode === '410') {
          console.warn(`[Middleware] Redirect chain leads to 410 URL and will be ignored: ${chain.join(' → ')} → (410 Gone)`);
          redirectsToRemove.push(sourceUrl);
        }
        
        // Check if destination is a known 404
        if (detected404Urls.has(normalizedCurrentUrl)) {
          console.warn(`[Middleware] Redirect leads to known 404 URL and will be ignored: ${chain.join(' → ')} → (404 Not Found)`);
          redirectsToRemove.push(sourceUrl);
        }
        
        break;
      }
      
      // Continue following the chain
      currentUrl = nextRedirect.toUrl;
      chain.push(currentUrl);
    }
    
    // If we ran out of iterations, the chain is too long
    if (maxChainLength <= 0) {
      console.warn(`[Middleware] Redirect chain too long (potential loop) and will be ignored: ${chain.join(' → ')}`);
      redirectsToRemove.push(sourceUrl);
    }
  }
  
  // Remove problematic redirects from cache
  redirectsToRemove.forEach(url => redirectCache.delete(url));
  
  if (redirectsToRemove.length > 0) {
    console.warn(`[Middleware] Removed ${redirectsToRemove.length} problematic redirects that could cause loops or lead to 404/410 pages`);
  }
}

export async function middleware(request: NextRequest) {
  const now = Date.now();
  const pathname = request.nextUrl.pathname;
  
  // Debug log
  if (DEBUG) {
    console.log(`[Middleware] Processing request for: ${pathname}`);
  }
  
  // Reload the redirect cache if it's empty or the cache has expired
  if (redirectCache.size === 0 || now - lastLoadTime > CACHE_DURATION) {
    await loadAllRedirects();
    lastLoadTime = now;
  }
  
  // Normalize the current pathname for comparison
  const normalizedPathname = normalizeUrl(pathname);
  
  if (DEBUG) {
    console.log(`[Middleware] Normalized path: ${normalizedPathname}`);
  }
  
  // Check if this URL has a redirect in our cache
  const redirect = redirectCache.get(normalizedPathname);
  
  if (redirect && redirect.isActive === 'yes') {
    // Handle based on status code
    if (redirect.statusCode === '410') {
      // Return a 410 Gone status with the HTML template
      console.log(`[Middleware] Returning 410 Gone for: ${pathname}`);
      return new NextResponse(html410Template, {
        status: 410,
        headers: {
          'Content-Type': 'text/html',
        },
      });
    } else if (redirect.statusCode === '301' && redirect.toUrl) {
      // Apply the 301 redirect
      console.log(`[Middleware] Applying 301 redirect: ${pathname} → ${redirect.toUrl}`);
      return NextResponse.redirect(new URL(redirect.toUrl, request.url), {
        status: 301,
      });
    }
  }
  
  // Track 404 pages to prevent redirecting to them in the future
  const isNotFoundPath = pathname.includes('/not-found') || pathname.includes('/404');
  if (isNotFoundPath && !detected404Urls.has(normalizedPathname)) {
    console.log(`[Middleware] Detected 404 page: ${pathname}`);
    detected404Urls.add(normalizedPathname);
  }
  
  // Add the pathname to the request headers for potential use in the application
  const response = NextResponse.next();
  response.headers.set('x-pathname', pathname);
  
  // Continue to the next middleware or to the application
  return response;
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images, fonts, assets folders (static assets)
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|images/|fonts/|assets/|api/).*)' 
  ],
};

export const runtime = 'nodejs'; // Set runtime environment to Node.js
