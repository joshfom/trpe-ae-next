"use client"

import React, { useState } from 'react';
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useGetAdminInsights } from "@/features/admin/insights/api/use-get-admin-insights";
import { useDeleteInsight } from "@/features/admin/insights/api/use-delete-insight";
import { Search, Plus, MoreVertical, Edit, Trash2, Eye, ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { InsightType } from '@/types/insights';

interface InsightsListProps {
    // Component is now fully client-side
}

function InsightsList({ }: InsightsListProps) {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const router = useRouter();
    
    const { data, isLoading, isError } = useGetAdminInsights({ 
        search, 
        page, 
        limit: 10,
        sortBy,
        sortOrder
    });
    
    const deleteMutation = useDeleteInsight();
    
    // Use client data from hook
    const insights = data?.data || [];
    const totalPages = data?.totalPages || 1;
    const totalCount = data?.totalCount || 0;

    const handleDelete = async (insight: InsightType) => {
        await deleteMutation.mutate(
            { slug: insight.slug, coverUrl: insight.coverUrl },
            {
                onSuccess: () => {
                    // Refresh the page to update the list
                    router.refresh();
                }
            }
        );
    };

    const handleSearch = (value: string) => {
        setSearch(value);
        setPage(1); // Reset to first page when searching
    };

    const handleSortChange = (newSortBy: string) => {
        if (newSortBy === sortBy) {
            // Toggle order if same column
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            // New column, default to desc
            setSortBy(newSortBy);
            setSortOrder("desc");
        }
        setPage(1); // Reset to first page when sorting
    };

    const getStatusBadge = (insight: InsightType) => {
        if (insight.publishedAt) {
            return <Badge variant="default" className="bg-green-100 text-green-800">Published</Badge>;
        }
        return <Badge variant="secondary">Draft</Badge>;
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "Not set";
        try {
            return format(new Date(dateString), "MMM dd, yyyy");
        } catch {
            return "Invalid date";
        }
    };

    if (isError) {
        return (
            <div className="p-6 text-center">
                <p className="text-red-500">Error loading insights. Please try again.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Insights Management</h2>
                    <p className="text-gray-600">Manage all insights articles</p>
                </div>
                <Link href="/admin/insights/create">
                    <Button className="bg-black text-white hover:bg-gray-800">
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Insight
                    </Button>
                </Link>
            </div>

            {/* Search and Stats */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Search insights..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Sort by:</span>
                        <Select value={sortBy} onValueChange={handleSortChange}>
                            <SelectTrigger className="w-40">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="createdAt">Created Date</SelectItem>
                                <SelectItem value="publishedAt">Published Date</SelectItem>
                                <SelectItem value="updatedAt">Updated Date</SelectItem>
                                <SelectItem value="title">Title</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                            className="px-2"
                        >
                            <ArrowUpDown className="w-4 h-4" />
                            {sortOrder === "asc" ? "↑" : "↓"}
                        </Button>
                    </div>
                </div>
                <div className="text-sm text-gray-600">
                    Total: {totalCount} insights
                </div>
            </div>

            {/* Table */}
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Published Date</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="w-20">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            // Loading skeleton
                            Array.from({ length: 5 }).map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-48"></div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="h-8 bg-gray-200 rounded animate-pulse w-8"></div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : insights.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">
                                    <div className="text-gray-500">
                                        {search ? `No insights found for "${search}"` : "No insights yet"}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            insights.map((insight: InsightType) => (
                                <TableRow key={insight.id}>
                                    <TableCell>
                                        <div className="flex items-center space-x-3">
                                            {insight.coverUrl && (
                                                <img 
                                                    src={insight.coverUrl} 
                                                    alt={insight.altText || insight.title || "Insight cover"} 
                                                    className="w-12 h-8 object-cover rounded"
                                                />
                                            )}
                                            <div>
                                                <div className="font-medium text-gray-900 max-w-xs truncate">
                                                    {insight.title || "Untitled"}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    /{insight.slug}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(insight)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm text-gray-600">
                                            {formatDate(insight.publishedAt)}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm text-gray-600">
                                            {formatDate(insight.createdAt)}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                {insight.publishedAt && (
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/insights/${insight.slug}`} target="_blank">
                                                            <Eye className="w-4 h-4 mr-2" />
                                                            View
                                                        </Link>
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/admin/insights/edit/${insight.slug}`}>
                                                        <Edit className="w-4 h-4 mr-2" />
                                                        Edit
                                                    </Link>
                                                </DropdownMenuItem>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                            <Trash2 className="w-4 h-4 mr-2" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Delete Insight</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Are you sure you want to delete "{insight.title}"? This action cannot be undone.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDelete(insight)}
                                                                className="bg-red-500 hover:bg-red-600"
                                                                disabled={deleteMutation.isPending}
                                                            >
                                                                {deleteMutation.isPending ? "Deleting..." : "Delete"}
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center space-x-2">
                    <Button 
                        variant="outline" 
                        disabled={page === 1}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                    >
                        Previous
                    </Button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <Button
                            key={pageNum}
                            variant={page === pageNum ? "default" : "outline"}
                            onClick={() => setPage(pageNum)}
                            className="w-10"
                        >
                            {pageNum}
                        </Button>
                    ))}
                    
                    <Button 
                        variant="outline" 
                        disabled={page === totalPages}
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}

export default InsightsList;
