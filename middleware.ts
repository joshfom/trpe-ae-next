import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Enhanced middleware that handles navigation errors and adds necessary headers
 * This middleware runs on all non-static/API routes and provides better error handling
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  try {
    // Add the pathname to the request headers for use in the application
    const response = NextResponse.next();
    
    // Add headers for better navigation handling
    response.headers.set('x-pathname', pathname);
    response.headers.set('x-navigation-timestamp', Date.now().toString());
    
    // Add cache control headers for better performance during navigation
    if (request.nextUrl.pathname.startsWith('/api/')) {
      response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    } else {
      response.headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
    }
    
    // Add headers to prevent 503 errors during navigation
    response.headers.set('X-Navigation-Safe', 'true');
    
    return response;
  } catch (error) {
    // Log middleware errors but don't break the request
    console.warn('Middleware error:', error);
    
    // Return a minimal response that won't cause 503 errors
    const response = NextResponse.next();
    response.headers.set('x-pathname', pathname);
    response.headers.set('X-Navigation-Error', 'middleware-error');
    return response;
  }
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
     * - api routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|images/|fonts/|assets/|api/).*)' 
  ],
};
