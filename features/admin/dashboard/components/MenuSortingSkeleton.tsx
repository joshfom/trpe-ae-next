"use client"
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

const MenuSortingSkeleton: React.FC = () => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div>
        <Skeleton className="h-7 w-60 mb-2" />
        <Skeleton className="h-4 w-80" />
      </div>
      
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-20" />
      </div>
    </div>
  );
};

export default MenuSortingSkeleton;
