"use client"

import React, { useState, memo, useCallback, useMemo, useRef, useEffect } from 'react';
import { useGetAdminInsights } from "@/features/admin/insights/api/use-get-admin-insights";
import { useGetAdminInsightsSimple } from "@/features/admin/insights/api/use-get-admin-insights-simple";
import { useDeleteInsight } from "@/features/admin/insights/api/use-delete-insight";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Eye, Pencil, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { Pagination } from "@/components/ui/pagination";
import { client } from "@/lib/hono";
import { AuthStatus } from "@/components/auth-status";
import { AdminDebugPanel } from "@/components/admin-debug-panel";
import { ServerActionTest } from "@/components/server-action-test";
import { 
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Memoized skeleton array to prevent re-creation on every render
const SKELETON_ARRAY = Array.from({length: 9});

// Memoized loading skeleton component
const LoadingSkeleton = memo(() => (
    <div className={'grid grid-cols-1 lg:grid-cols-3 gap-6'}>
        {SKELETON_ARRAY.map((_, index) => (
            <div key={index} className={'bg-white p-4 rounded-lg'}>
               <Skeleton className={'h-60 w-full'} />
                <Skeleton className={'h-4 w-1/2 mt-4'} />
            </div>
        ))}
    </div>
));

LoadingSkeleton.displayName = 'LoadingSkeleton';

// Memoized InsightCard component to prevent unnecessary re-renders
const InsightCard = memo(({ insight, onDeleteClick }: {
    insight: any;
    onDeleteClick: (slug: string, coverUrl?: string) => void;
}) => {
    const handleDeleteClick = useCallback(() => {
        onDeleteClick(insight.slug, insight.coverUrl);
    }, [insight.slug, insight.coverUrl, onDeleteClick]);

    return (
        <div className={'bg-white flex flex-col rounded-lg'}>
            <div className="grow">
                <div className="relative w-full h-80">
                    <img
                        src={insight?.coverUrl || ''}
                        alt={insight?.title || ''}
                        className="object-cover rounded-lg w-full h-full"
                        loading="lazy"
                    />
                </div>
                <h2 className={'text-lg mt-4 px-3'}>{insight.title}</h2>
            </div>
            <div className="flex justify-between mt-4 py-4 border-t px-4">
                <Link href={`/insights/${insight.slug}`} className="px-4 inline-flex rounded-3xl items-center border border-slate-400 text-slate-600 hover:bg-slate-100 hover:text-white py-0.5 ">
                    <Eye className={'w-5 h-5 mr-2'} />
                    View
                </Link>

                <div className="flex gap-2 items-center">
                    <div className="">
                        <Link href={`/crm/insights/${insight.slug}/edit`} className="inline-flex rounded-3xl items-center px-4 py-0.5 border border-slate-400 text-slate-600 hover:bg-slate-100 hover:text-white">
                        <Pencil className={'w-5 h-5 mr-2'} />
                        Edit
                    </Link>
                    </div>
                    
                    <div>
                        <Button 
                        variant="destructive" 
                        className="inline-flex items-center" 
                        size="sm"
                        onClick={handleDeleteClick}
                    >
                            <Trash2 className={'w-5 h-5 mr-2'} />
                            Delete
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}, (prevProps, nextProps) => {
    // Custom comparison function to prevent re-renders when insight data hasn't changed
    return (
        prevProps.insight.id === nextProps.insight.id &&
        prevProps.insight.title === nextProps.insight.title &&
        prevProps.insight.slug === nextProps.insight.slug &&
        prevProps.insight.coverUrl === nextProps.insight.coverUrl &&
        prevProps.onDeleteClick === nextProps.onDeleteClick
    );
});

InsightCard.displayName = 'InsightCard';

function AdminInsights() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Extract specific parameter values and stabilize them
    const pageParam = searchParams.get('page');
    const searchParam = searchParams.get('search');
    
    // Memoize parsed values with stable dependencies to prevent re-renders
    const currentPage = useMemo(() => {
        return pageParam ? parseInt(pageParam) : 1;
    }, [pageParam]);
    
    const searchQuery = useMemo(() => 
        searchParam || '', 
        [searchParam]
    );
    
    const [tempSearch, setTempSearch] = useState(searchQuery);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [insightToDelete, setInsightToDelete] = useState<{slug: string; coverUrl?: string} | null>(null);
    
    // Sync tempSearch with searchQuery only when searchQuery actually changes
    const prevSearchQueryRef = useRef(searchQuery);
    useEffect(() => {
        if (prevSearchQueryRef.current !== searchQuery) {
            setTempSearch(searchQuery);
            prevSearchQueryRef.current = searchQuery;
        }
    }, [searchQuery]);
    
    // Temporarily disable server action calls for debugging
    const insightsQuery = {
        data: { data: [], totalPages: 1, currentPage: 1, total: 0 },
        isLoading: false,
        isError: false,
        error: null,
        refetch: () => Promise.resolve()
    };
    
    // Also test the original query for comparison
    const originalInsightsQuery = {
        data: null,
        isLoading: false,
        isError: false,
        error: null,
        refetch: () => Promise.resolve()
    };

    
    console.log('Simple insightsQuery:', insightsQuery);
    console.log('Original insightsQuery:', originalInsightsQuery);

    const deleteInsightMutation = useDeleteInsight();
    
    // Direct access to data instead of excessive memoization
    const insights = insightsQuery.data?.data || [];
    const totalPages = insightsQuery.data?.totalPages || 1;
    const isLoading = insightsQuery.isLoading;
    const isError = insightsQuery.isError;
    const isPending = deleteInsightMutation.isPending;
    
    // Only memoize complex computations or frequently changing values
    const isLoaded = useMemo(() => 
        !insightsQuery.isLoading && !insightsQuery.isError && insightsQuery.data !== null && insightsQuery.data !== undefined,
        [insightsQuery.isLoading, insightsQuery.isError, insightsQuery.data]
    );

    const handleSearch = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(window.location.search);
        
        if (tempSearch) {
            params.set('search', tempSearch);
        } else {
            params.delete('search');
        }
        
        params.set('page', '1'); // Reset to first page on new search
        router.push(`?${params.toString()}`);
    }, [tempSearch, router]);

    const handlePageChange = useCallback((page: number) => {
        const params = new URLSearchParams(window.location.search);
        params.set('page', page.toString());
        router.push(`?${params.toString()}`);
    }, [router]);
    
    const handleDeleteClick = useCallback((slug: string, coverUrl?: string) => {
        setInsightToDelete({ slug, coverUrl });
        setDeleteDialogOpen(true);
    }, []);
    
    // Memoize the handleDeleteClick to prevent InsightCard re-renders
    const memoizedHandleDeleteClick = useMemo(() => handleDeleteClick, [handleDeleteClick]);
    
    const handleConfirmDelete = useCallback(async () => {
        if (insightToDelete) {
            try {
                await deleteInsightMutation.mutate(insightToDelete, {
                    onSuccess: () => {
                        setDeleteDialogOpen(false);
                        setInsightToDelete(null);
                        // Use mutate with refetch instead of direct refetch
                        insightsQuery.refetch();
                    }
                });
            } catch (error) {
                console.error('Failed to delete insight:', error);
            }
        }
    }, [insightToDelete, deleteInsightMutation, insightsQuery.refetch]);

    const handleRetry = useCallback(() => {
        insightsQuery.refetch();
    }, [insightsQuery.refetch]);

    const handleTempSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setTempSearch(e.target.value);
    }, []);

    return (
        <div className={'pb-12'}>
            {/* Debug Panel - for development */}
            {typeof window !== 'undefined' && process.env.NODE_ENV === 'development' && (
                <>
                    <AdminDebugPanel />
                    {/* <ServerActionTest /> - Temporarily disabled */}
                </>
            )}
            
            {/* Search Bar - Temporarily disabled for debugging */}
            <div className="mb-6 max-w-3xl pt-4 pb-8 mx-auto">
                <div className="flex gap-2">
                    <Input
                        type="text"
                        placeholder="Search by title..."
                        value={tempSearch}
                        onChange={handleTempSearchChange}
                        className="max-w-sm"
                    />
                    <Button 
                        type="button" 
                        onClick={(e) => {
                            e.preventDefault();
                            handleSearch(e as any);
                        }}
                        className="flex items-center"
                    >
                        <Search className="w-4 h-4 mr-2" />
                        Search
                    </Button>
                </div>
            </div>

            {isLoading && <LoadingSkeleton />}

            {isLoaded && insights.length > 0 && (
                <>
                    <div className={'grid grid-cols-1 lg:grid-cols-3 gap-8'}>
                        {insights.map((insight: any) => (
                            <InsightCard
                                key={insight.id}
                                insight={insight}
                                onDeleteClick={memoizedHandleDeleteClick}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        className="mt-8"
                    />
                </>
            )}

            {isLoaded && insights.length === 0 && (
                <div className={'flex flex-col justify-center items-center'}>
                    <h2 className={'text-xl font-medium'}>No insights found</h2>
                    <p className={'text-gray-500'}>Try a different search term or create a new insight</p>
                </div>
            )}

            {/* Error state */}
            {isError && (
                <div className={'flex flex-col justify-center gap-3 items-center min-h-[400px] p-8'}>
                    <h2 className={'text-2xl font-bold text-red-600'}>Oops! Something went wrong</h2>
                    <p className={'text-gray-600 text-center max-w-md'}>
                        {(insightsQuery.error as unknown as Error)?.message || 'Failed to load insights. Please check your connection and try again.'}
                    </p>
                    
                    {/* Show specific authentication error */}
                    {(insightsQuery.error as unknown as Error)?.message?.includes('Unauthorized') && (
                        <div className={'bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4'}>
                            <p className={'text-yellow-800 font-medium'}>Authentication Required</p>
                            <p className={'text-yellow-700 text-sm mt-1'}>
                                Please make sure you're logged in to access admin features.
                            </p>
                            <Link href="/login" className={'inline-block mt-2'}>
                                <Button size="sm" variant="outline">
                                    Sign In
                                </Button>
                            </Link>
                        </div>
                    )}
                    
                    {process.env.NODE_ENV === 'development' && (
                        <details className={'mt-4 p-4 bg-gray-100 rounded text-sm'}>
                            <summary className={'cursor-pointer font-medium'}>Debug Information</summary>
                            <pre className={'mt-2 text-xs overflow-auto'}>
                                {JSON.stringify({
                                    error: insightsQuery.error,
                                    baseUrl: typeof window !== 'undefined' ? window.location.origin : 'server-side',
                                    hasClient: !!client
                                }, null, 2)}
                            </pre>
                        </details>
                    )}
                    <button 
                        onClick={handleRetry} 
                        className={'bg-black text-white px-6 py-3 rounded-lg mt-4 hover:bg-gray-800 transition-colors'}
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Delete confirmation dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to delete this insight?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the 
                            insight and its associated image from AWS.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleConfirmDelete}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={isPending}
                        >
                            {isPending ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

const AdminInsightsMemo = memo(AdminInsights);
AdminInsightsMemo.displayName = 'AdminInsights';

export default AdminInsightsMemo;