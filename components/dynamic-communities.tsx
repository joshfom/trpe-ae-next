"use client"

import { Suspense, lazy } from 'react';
import { Skeleton } from "@/components/ui/skeleton";

// Dynamically import the Communities component
// Use the server-action version instead of React Query version
const Communities = lazy(() => import('@/features/community/components/Communities-server-action'));

interface DynamicCommunitiesProps {
  classNames?: string;
}

export default function DynamicCommunities({ classNames }: DynamicCommunitiesProps) {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto lg:pb-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="bg-white">
            <div className="relative w-full h-60 rounded-lg overflow-hidden">
              <Skeleton className="absolute inset-0 w-full h-full" />
            </div>
            <div className="px-4 text-center py-2">
              <Skeleton className="h-6 w-32 mx-auto mt-2" />
            </div>
          </div>
        ))}
      </div>
    }>
      <Communities classNames={classNames} />
    </Suspense>
  );
}
