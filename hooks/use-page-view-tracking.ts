'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackEnhancedPageView } from '@/lib/gtm-events';

interface PageViewData {
  page_category?: string;
  page_type?: string;
  content_group1?: string;
  content_group2?: string;
  content_group3?: string;
  user_type?: string;
  property_id?: string;
  community_id?: string;
  agent_id?: string;
  [key: string]: any;
}

/**
 * Hook to automatically track page views when route changes
 * Usage: usePageViewTracking({ page_category: 'properties', page_type: 'listing' })
 */
export const usePageViewTracking = (pageData?: PageViewData) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Create URL with search params
    const url = searchParams ? `${pathname}?${searchParams.toString()}` : pathname;
    
    // Determine page category and type from pathname
    const pathSegments = pathname.split('/').filter(Boolean);
    const autoDetectedData = {
      page_category: getPageCategory(pathname),
      page_type: getPageType(pathname),
      content_group1: pathSegments[0] || 'home',
      content_group2: pathSegments[1] || undefined,
      content_group3: pathSegments[2] || undefined,
    };

    // Track the page view
    trackEnhancedPageView({
      page_path: url,
      ...autoDetectedData,
      ...pageData // Override with provided data
    });
  }, [pathname, searchParams, pageData]);
};

/**
 * Get page category based on URL path
 */
function getPageCategory(pathname: string): string {
  if (pathname.startsWith('/properties') || pathname.startsWith('/for-sale') || pathname.startsWith('/for-rent')) {
    return 'properties';
  }
  if (pathname.startsWith('/communities')) {
    return 'communities';
  }
  if (pathname.startsWith('/agents')) {
    return 'agents';
  }
  if (pathname.startsWith('/insights')) {
    return 'insights';
  }
  if (pathname.startsWith('/luxe')) {
    return 'luxe';
  }
  if (pathname.startsWith('/admin')) {
    return 'admin';
  }
  if (pathname.startsWith('/contact')) {
    return 'contact';
  }
  if (pathname === '/') {
    return 'home';
  }
  return 'other';
}

/**
 * Get page type based on URL path
 */
function getPageType(pathname: string): string {
  // Property pages
  if (pathname.match(/\/properties\/[^\/]+$/)) {
    return 'property_detail';
  }
  if (pathname.includes('/for-sale') || pathname.includes('/for-rent')) {
    return 'property_search';
  }
  
  // Community pages
  if (pathname.match(/\/communities\/[^\/]+$/)) {
    return 'community_detail';
  }
  if (pathname === '/communities') {
    return 'community_listing';
  }
  
  // Agent pages
  if (pathname.match(/\/agents\/[^\/]+$/)) {
    return 'agent_detail';
  }
  if (pathname === '/agents') {
    return 'agent_listing';
  }
  
  // Insight pages
  if (pathname.match(/\/insights\/[^\/]+$/)) {
    return 'insight_detail';
  }
  if (pathname === '/insights') {
    return 'insight_listing';
  }
  
  // Admin pages
  if (pathname.startsWith('/admin')) {
    return 'admin_panel';
  }
  
  // Contact pages
  if (pathname.includes('/contact')) {
    return 'contact_form';
  }
  
  // Home page
  if (pathname === '/') {
    return 'homepage';
  }
  
  // Landing pages
  if (pathname.startsWith('/landing')) {
    return 'landing_page';
  }
  
  return 'page';
}

/**
 * Track page view manually with custom data
 */
export const trackPageView = (customData?: PageViewData) => {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const autoDetectedData = {
    page_category: getPageCategory(pathname),
    page_type: getPageType(pathname),
  };

  trackEnhancedPageView({
    ...autoDetectedData,
    ...customData
  });
};

/**
 * Track virtual page views (for SPAs, modals, tabs, etc.)
 */
export const trackVirtualPageView = (virtualPath: string, pageData?: PageViewData) => {
  trackEnhancedPageView({
    page_path: virtualPath,
    page_category: getPageCategory(virtualPath),
    page_type: getPageType(virtualPath),
    ...pageData
  });
};
