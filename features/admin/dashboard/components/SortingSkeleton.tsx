"use client"
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

interface SortingSkeletonProps {
  itemCount?: number;
  layout?: 'grid' | 'list';
}

const SortingSkeleton: React.FC<SortingSkeletonProps> = ({ 
  itemCount = 6,
  layout = 'grid'
}) => {
  return (
    <div className={
      layout === 'grid'
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        : "space-y-4"
    }>
      {Array.from({ length: itemCount }).map((_, i) => (
        <div key={i} className={
          layout === 'grid'
            ? "bg-white rounded-lg shadow-sm p-4"
            : "bg-white rounded-lg shadow-sm p-4 flex items-center gap-4"
        }>
          {layout === 'list' && <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />}
          
          <div className={layout === 'list' ? "flex-1 space-y-2" : "space-y-3"}>
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
            {layout === 'grid' && (
              <>
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-8 w-1/4" />
              </>
            )}
          </div>
          
          {layout === 'list' && <Skeleton className="h-8 w-24 flex-shrink-0" />}
        </div>
      ))}
    </div>
  );
};

export default SortingSkeleton;
