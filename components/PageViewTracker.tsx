'use client';

import { usePageViewTracking } from '@/hooks/use-page-view-tracking';

interface PageViewTrackerProps {
  /**
   * Additional data to include with every page view
   */
  defaultPageData?: {
    user_type?: string;
    content_group1?: string;
    content_group2?: string;
    content_group3?: string;
    [key: string]: any;
  };
}

/**
 * Component to automatically track page views on route changes
 * Add this to your root layout to track all page views
 */
export const PageViewTracker = ({ defaultPageData }: PageViewTrackerProps) => {
  usePageViewTracking(defaultPageData);
  
  // This component doesn't render anything
  return null;
};

export default PageViewTracker;
