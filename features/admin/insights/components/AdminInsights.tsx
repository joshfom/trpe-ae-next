"use client"

import React, { useState } from 'react';
import { useGetAdminInsights } from "@/features/admin/insights/api/use-get-admin-insights";
import { useDeleteInsight } from "@/features/admin/insights/api/use-delete-insight";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@react-email/components";
import { Eye, Pencil, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Pagination } from "@/components/ui/pagination";
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

function AdminInsights() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentPage = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
    const searchQuery = searchParams.get('search') || '';
    
    const [tempSearch, setTempSearch] = useState(searchQuery);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [insightToDelete, setInsightToDelete] = useState<{slug: string; coverUrl?: string} | null>(null);
    
    const insightsQuery = useGetAdminInsights({
        search: searchQuery,
        page: currentPage,
        limit: 9
    });
    
    const deleteInsightMutation = useDeleteInsight();
    
    const insights = insightsQuery.data?.data || [];
    const totalPages = insightsQuery.data?.totalPages || 1;
    
    // is loaded without error
    const isLoaded = !insightsQuery.isLoading && !insightsQuery.isError && insightsQuery.data !== null;
    const isLoading = insightsQuery.isLoading;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());
        
        if (tempSearch) {
            params.set('search', tempSearch);
        } else {
            params.delete('search');
        }
        
        params.set('page', '1'); // Reset to first page on new search
        router.push(`?${params.toString()}`);
    };

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page.toString());
        router.push(`?${params.toString()}`);
    };
    
    const handleDeleteClick = (slug: string, coverUrl?: string) => {
        setInsightToDelete({ slug, coverUrl });
        setDeleteDialogOpen(true);
    };
    
    const handleConfirmDelete = async () => {
        if (insightToDelete) {
            try {
                await deleteInsightMutation.mutate(insightToDelete, {
                    onSuccess: () => {
                        setDeleteDialogOpen(false);
                        setInsightToDelete(null);
                        insightsQuery.refetch();
                    }
                });
            } catch (error) {
                console.error('Failed to delete insight:', error);
            }
        }
    };

    return (
        <div className={'pb-12'}>
            {/* Search Bar */}
            <div className="mb-6 max-w-3xl pt-4 pb-8 mx-auto">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <Input
                        type="text"
                        placeholder="Search by title..."
                        value={tempSearch}
                        onChange={(e) => setTempSearch(e.target.value)}
                        className="max-w-sm"
                    />
                    <Button type="submit" className="flex items-center">
                        <Search className="w-4 h-4 mr-2" />
                        Search
                    </Button>
                </form>
            </div>

            {
                isLoading &&
                <div className={'grid grid-cols-1 lg:grid-cols-3 gap-6'}>
                    {
                        Array.from({length: 9}).map((_, index) => (
                            <div key={index} className={'bg-white p-4 rounded-lg'}>
                               <Skeleton className={'h-60 w-full'} />
                                <Skeleton className={'h-4 w-1/2 mt-4'} />
                            </div>
                        ))
                    }
                </div>
            }

            {
                isLoaded && insights.length > 0 &&
                <>
                    <div className={'grid grid-cols-1 lg:grid-cols-3 gap-8'}>
                        {
                            insights.map((insight: any) => (
                                <div key={insight.id} className={'bg-white flex flex-col rounded-lg'}>
                                    <div className="grow">
                                        <div className="relative w-full h-80">
                                            <Image 
                                                src={insight?.coverUrl || ''} 
                                                alt={insight?.title || ''}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                className="object-cover rounded-lg"
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
                                                onClick={() => handleDeleteClick(insight.slug, insight.coverUrl)}
                                                disabled={!!deleteInsightMutation.isPending}
                                            >
                                                <Trash2 className={'w-5 h-5 mr-2'} />
                                                Delete
                                            </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>

                    {/* Pagination */}
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        className="mt-8"
                    />
                </>
            }

            {
                isLoaded && insights.length === 0 &&
                <div className={'flex flex-col justify-center items-center'}>
                    <h2 className={'text-xl font-medium'}>No insights found</h2>
                    <p className={'text-gray-500'}>Try a different search term or create a new insight</p>
                </div>
            }

            {/* Error state */}
            {
                insightsQuery.isError &&
                <div className={'flex flex-col justify-center gap-3 items-center mind-[600px]'}>
                    <h2 className={'text-2xl font-bold'}>Oops! Something went wrong</h2>
                    <button onClick={() => insightsQuery.refetch()} className={'bg-black text-white px-4 py-2 rounded-lg mt-4'}>
                        Retry
                    </button>
                </div>
            }

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
                            disabled={!!deleteInsightMutation.isPending}
                        >
                            {deleteInsightMutation.isPending ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

export default AdminInsights;