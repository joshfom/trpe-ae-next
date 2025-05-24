"use client"
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

interface RecentActivityProps {
  loading?: boolean;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ loading = true }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
      
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No recent activity to display</p>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
