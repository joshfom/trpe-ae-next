"use client"
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SummaryChartProps {
  loading?: boolean;
}

const SummaryChart: React.FC<SummaryChartProps> = ({ loading = true }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Summary</CardTitle>
        <CardDescription>Property listings and views overview</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-[200px] w-full" />
            <div className="flex justify-around mt-4">
              <div className="text-center">
                <Skeleton className="h-4 w-24 mx-auto mb-1" />
                <Skeleton className="h-3 w-16 mx-auto" />
              </div>
              <div className="text-center">
                <Skeleton className="h-4 w-24 mx-auto mb-1" />
                <Skeleton className="h-3 w-16 mx-auto" />
              </div>
              <div className="text-center">
                <Skeleton className="h-4 w-24 mx-auto mb-1" />
                <Skeleton className="h-3 w-16 mx-auto" />
              </div>
            </div>
          </div>
        ) : (
          <div className="h-[200px] flex items-center justify-center">
            <p className="text-gray-500">Chart will render here when data is available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SummaryChart;
