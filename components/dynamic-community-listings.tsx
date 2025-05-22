"use client"

import { Suspense, lazy } from 'react';
import { Skeleton } from "@/components/ui/skeleton";

// Dynamically import the Listings component
const Listings = lazy(() => import('@/features/properties/components/Listings'));

interface DynamicCommunityListingsProps {
  offeringType?: string;
  communitySlug?: string;
  searchParams?: { [key: string]: string | string[] | undefined };
  isLandingPage?: boolean;
  page?: string;
}

export default function DynamicCommunityListings({
  offeringType,
  communitySlug,
  searchParams = {},
  isLandingPage = false,
  page
}: DynamicCommunityListingsProps) {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg overflow-hidden shadow">
              <Skeleton className="h-52 w-full" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center py-8">
          <Skeleton className="h-10 w-64" />
        </div>
      </div>
    }>
      <Listings
        offeringType={offeringType}
        searchParams={{
          ...searchParams,
          community: communitySlug
        }}
        isLandingPage={isLandingPage}
        page={page}
      />
    </Suspense>
  );
}
