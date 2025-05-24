"use client"
import React, { useState, useEffect } from 'react';
import DashboardWidgets from '@/features/admin/dashboard/components/DashboardWidgets';
import { useGetDashboardStats } from '@/features/admin/dashboard/api/use-get-dashboard-stats';
import RecentActivity from '@/features/admin/dashboard/components/RecentActivity';
import QuickActions from '@/features/admin/dashboard/components/QuickActions';
import SummaryChart from '@/features/admin/dashboard/components/SummaryChart';
import MenuSorting from '@/features/admin/dashboard/components/MenuSorting';
import MenuSortingSkeleton from '@/features/admin/dashboard/components/MenuSortingSkeleton';
import SortingSkeleton from '@/features/admin/dashboard/components/SortingSkeleton';
import WelcomeCard from '@/features/admin/dashboard/components/WelcomeCard';

function Page() {
    const { stats, isLoading } = useGetDashboardStats();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortMode, setSortMode] = useState<string>('newest');
    const [sortingChanging, setSortingChanging] = useState<boolean>(false);

    // This simulates the loading effect when changing view or sort modes
    useEffect(() => {
        if (sortingChanging) {
            const timer = setTimeout(() => {
                setSortingChanging(false);
            }, 800); // Simulate loading delay
            return () => clearTimeout(timer);
        }
    }, [sortingChanging]);

    const handleViewChange = (view: 'grid' | 'list') => {
        setSortingChanging(true);
        setViewMode(view);
    };

    const handleSortChange = (sort: string) => {
        setSortingChanging(true);
        setSortMode(sort);
    };

    return (
        <div className="p-6 space-y-6">
            <WelcomeCard loading={isLoading} username="Admin" />
            
            {isLoading ? (
                <MenuSortingSkeleton />
            ) : (
                <MenuSorting 
                    onViewChange={handleViewChange}
                    onSortChange={handleSortChange}
                />
            )}
            
            {/* When sorting changes, show skeleton for a brief moment */}
            {sortingChanging ? (
                <SortingSkeleton layout={viewMode} />
            ) : (
                <DashboardWidgets loading={isLoading} data={stats} />
            )}
            
            <SummaryChart loading={isLoading} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <RecentActivity loading={isLoading} />
                </div>
                <div>
                    <QuickActions />
                </div>
            </div>
        </div>
    );
}

export default Page;