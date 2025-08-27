import React from 'react';
import Link from 'next/link';

// Define Community interface to match the API response format
interface Community {
  id?: string;
  name: string | null;
  slug: string;
  shortName?: string | null;
  propertyCount?: number;
  rentCount?: number;
  saleCount?: number;
  commercialRentCount?: number;
  commercialSaleCount?: number;
}

interface FooterCommunitiesSSRProps {
  communities: Community[];
}

export default function FooterCommunitiesSSR({ communities }: FooterCommunitiesSSRProps) {
  // If no communities, don't render anything
  if (!communities || communities.length === 0) {
    return null;
  }

  return (
    <div className="pt-2 flex text-sm flex-col">
      {communities.map((community) => (
        <Link
          className="px-4 py-2 border-b border-transparent hover:bg-zinc-900 text-slate-300 hover:text-white hover:border-white"
          key={community.slug}
          href={`/communities/${community.slug}`}
        >
          {community.name || community.slug}
        </Link>
      ))}
    </div>
  );
}