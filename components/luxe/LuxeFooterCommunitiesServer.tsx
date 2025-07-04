import React from 'react';
import Link from 'next/link';
import { getFooterLuxeCommunities } from '@/actions/get-footer-luxe-communities-action';

interface FooterLuxeCommunity {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  propertyCount?: number;
}

// Server component that pre-fetches data
export default async function LuxeFooterCommunitiesServer() {
  let communities: FooterLuxeCommunity[] = [];
  
  try {
    communities = await getFooterLuxeCommunities();
  } catch (error) {
    console.error('Error fetching luxe communities:', error);
    // Return fallback content on error
    return (
      <div className="flex flex-col pt-2">
        <Link
          className="px-4 py-2 text-sm sm:text-base border-b border-transparent hover:border-slate-700 transition-colors"
          href="/luxe/communities">
          View All Luxe Communities
        </Link>
      </div>
    );
  }
  
  // If no communities found, show a fallback
  if (communities.length === 0) {
    return (
      <div className="flex flex-col pt-2">
        <Link
          className="px-4 py-2 text-sm sm:text-base border-b border-transparent hover:border-slate-700 transition-colors"
          href="/luxe/communities">
          View All Luxe Communities
        </Link>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col pt-2">
      {communities.slice(0, 8).map((community) => (
        <Link
          key={community.id}
          className="px-4 py-2 text-sm sm:text-base border-b border-transparent hover:border-slate-700 transition-colors"
          href={`/luxe/communities/${community.slug}`}>
          {community.name}
        </Link>
      ))}
      
      {/* Show "View All" link if we have more than 8 communities */}
      {communities.length > 8 && (
        <Link
          className="px-4 py-2 text-sm sm:text-base border-b border-transparent hover:border-slate-700 transition-colors font-medium"
          href="/luxe/communities">
          View All Communities
        </Link>
      )}
    </div>
  );
}
