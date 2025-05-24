"use client"
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface WidgetSkeletonProps {
  height?: string;
  showHeader?: boolean;
  headerHeight?: string;
}

const WidgetSkeleton: React.FC<WidgetSkeletonProps> = ({ 
  height = "200px", 
  showHeader = true,
  headerHeight = "60px"
}) => {
  return (
    <Card className="overflow-hidden">
      {showHeader && (
        <div className="p-6 border-b">
          <Skeleton className={`w-1/3 ${headerHeight}`} />
        </div>
      )}
      <CardContent className="p-6">
        <div className="space-y-4">
          <Skeleton className={`w-full ${height}`} />
          <div className="flex gap-4">
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 flex-1" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WidgetSkeleton;
