// Examples of how to use page view tracking in different components

import { usePageViewTracking, trackPageView, trackVirtualPageView } from '@/hooks/use-page-view-tracking';

// Example 1: Property Detail Page
export const PropertyDetailPage = ({ property }: { property: any }) => {
  // Automatic tracking with property-specific data
  usePageViewTracking({
    page_category: 'properties',
    page_type: 'property_detail',
    property_id: property.id,
    content_group1: 'properties',
    content_group2: property.offering_type, // 'for-sale' or 'for-rent'
    content_group3: property.community_name,
    community_id: property.community_id,
    agent_id: property.agent_id,
    custom_data: {
      property_price: property.price,
      property_bedrooms: property.bedrooms,
      property_type: property.property_type
    }
  });

  return <div>Property Details...</div>;
};

// Example 2: Community Listing Page
export const CommunityListingPage = ({ community }: { community: any }) => {
  usePageViewTracking({
    page_category: 'communities',
    page_type: 'community_detail',
    community_id: community.id,
    content_group1: 'communities',
    content_group2: community.name,
    content_group3: community.location
  });

  return <div>Community Details...</div>;
};

// Example 3: Search Results Page
export const SearchResultsPage = ({ searchParams }: { searchParams: any }) => {
  usePageViewTracking({
    page_category: 'properties',
    page_type: 'property_search',
    content_group1: 'search',
    content_group2: searchParams.offering_type,
    content_group3: searchParams.communities?.[0],
    search_data: {
      search_term: searchParams.query,
      min_price: searchParams.min_price,
      max_price: searchParams.max_price,
      bedrooms: searchParams.bedrooms,
      property_type: searchParams.property_type
    }
  });

  return <div>Search Results...</div>;
};

// Example 4: Admin Pages
export const AdminDashboard = () => {
  usePageViewTracking({
    page_category: 'admin',
    page_type: 'admin_dashboard',
    content_group1: 'admin',
    user_type: 'admin' // Override default user type
  });

  return <div>Admin Dashboard...</div>;
};

// Example 5: Manual Page View Tracking
export const SomeComponent = () => {
  const handleTabChange = (tabName: string) => {
    // Track virtual page view for tab changes
    trackVirtualPageView(`/properties/tabs/${tabName}`, {
      page_category: 'properties',
      page_type: 'tab_view',
      content_group1: 'properties',
      content_group2: 'tabs',
      content_group3: tabName
    });
  };

  const handleModalOpen = (modalType: string) => {
    // Track virtual page view for modal opens
    trackVirtualPageView(`/modals/${modalType}`, {
      page_category: 'modal',
      page_type: 'modal_view',
      content_group1: 'modals',
      content_group2: modalType
    });
  };

  return <div>Component with virtual page views...</div>;
};

// Example 6: Property Search with Filters
export const PropertySearchWithTracking = () => {
  const handleFilterChange = (filters: any) => {
    // Track filter usage as virtual page view
    const filterString = Object.entries(filters)
      .filter(([_, value]) => value)
      .map(([key, value]) => `${key}:${value}`)
      .join('|');

    trackVirtualPageView(`/search/filtered/${filterString}`, {
      page_category: 'properties',
      page_type: 'filtered_search',
      content_group1: 'search',
      content_group2: 'filtered',
      filter_data: filters
    });
  };

  return <div>Search with filter tracking...</div>;
};
