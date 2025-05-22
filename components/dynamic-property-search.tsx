"use client"

import { Suspense, lazy } from 'react';
import { Skeleton } from "@/components/ui/skeleton";

// Dynamically import the heavy component
// Use the server-action version instead of React Query version
const PropertyPageSearchFilter = lazy(() => import('@/features/search/PropertyPageSearchFilter-server-action'));

interface DynamicPropertySearchProps {
  offeringType: string;
  propertyType?: string;
}

export default function DynamicPropertySearch({ offeringType, propertyType }: DynamicPropertySearchProps) {
  return (
    <Suspense fallback={
      <div className="w-full py-6 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-stretch">
            <Skeleton className="h-12 w-full md:w-1/2" />
            <div className="flex gap-2 md:w-1/2">
              <Skeleton className="h-12 w-full md:w-1/3" />
              <Skeleton className="h-12 w-full md:w-1/3" />
              <Skeleton className="h-12 w-24" />
            </div>
          </div>
        </div>
      </div>
    }>
      <PropertyPageSearchFilter 
        offeringType={offeringType} 
        propertyType={propertyType} 
      />
    </Suspense>
  );
}
