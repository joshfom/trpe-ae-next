import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Simplified middleware that only adds the x-pathname header
 * This middleware runs on all non-static/API routes and adds the current
 * pathname to the request headers for use in the application
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Add the pathname to the request headers for use in the application
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
