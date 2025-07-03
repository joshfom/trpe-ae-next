'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getFooterLuxeCommunities } from '@/actions/get-footer-luxe-communities-action';

interface FooterLuxeCommunity {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  propertyCount?: number;
}

export default function LuxeFooterCommunities() {
  const [communities, setCommunities] = useState<FooterLuxeCommunity[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const data = await getFooterLuxeCommunities();
        setCommunities(data);
      } catch (error) {
        console.error('Error fetching luxe communities:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCommunities();
  }, []);
  
  if (loading) {
    return (
      <div className="flex flex-col pt-2">
        <div className="px-4 py-2 text-sm sm:text-base animate-pulse">
          Loading communities...
        </div>
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
