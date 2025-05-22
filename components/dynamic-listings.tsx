"use client"

import { Suspense, lazy } from 'react';
import { Skeleton } from "@/components/ui/skeleton";

// Dynamically import the Listings component
const Listings = lazy(() => import('@/features/properties/components/Listings'));

interface DynamicListingsProps {
  offeringType?: string;
  propertyType?: string;
  searchParams?: { [key: string]: string | string[] | undefined };
  isLandingPage?: boolean;
  page?: string;
}

export default function DynamicListings({
  offeringType,
  propertyType,
  searchParams = {},
  isLandingPage = false,
  page
}: DynamicListingsProps) {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <Skeleton className="w-full h-48" />
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-6" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <Skeleton className="h-10 w-72" />
        </div>
      </div>
    }>
      <Listings 
        offeringType={offeringType} 
        propertyType={propertyType}
        searchParams={searchParams}
        isLandingPage={isLandingPage}
        page={page}
      />
    </Suspense>
  );
}
