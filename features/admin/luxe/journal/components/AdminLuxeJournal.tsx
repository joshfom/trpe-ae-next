"use client"
import React from 'react';
import { useGetLuxeJournal } from '../api/use-get-luxe-journal';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, EditIcon, EyeIcon } from 'lucide-react';
import { insightTable } from "@/db/schema/insight-table";

type InsightType = typeof insightTable.$inferSelect;

function AdminLuxeJournal() {
    const { data: journals, isLoading, error } = useGetLuxeJournal();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="text-gray-500">Loading luxe journal entries...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="text-red-500">Error loading luxe journal entries: {error.message}</div>
            </div>
        );
    }

    if (!journals || journals.length === 0) {
        return (
            <div className="flex flex-col justify-center items-center py-16 px-8">
                <div className="text-gray-500 text-center">
                    <h3 className="text-lg font-medium mb-2">No luxe journal entries found</h3>
                    <p className="text-sm mb-4">Create your first luxe journal entry to get started.</p>
                    <Link href="/admin/luxe/journal/create">
                        <Button>Create First Entry</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {journals.map((journal: InsightType) => (
                    <Card key={journal.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 mb-2">
                                    Luxe Journal
                                </Badge>
                                <div className="flex space-x-2">
                                    <Link href={`/admin/luxe/journal/edit/${journal.slug}`}>
                                        <Button variant="outline" size="sm">
                                            <EditIcon className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                            <CardTitle className="text-lg line-clamp-2">
                                {journal.title}
                            </CardTitle>
                        </CardHeader>
                        
                        <CardContent>
                            {journal.coverUrl && (
                                <div className="mb-4">
                                    <img 
                                        src={journal.coverUrl} 
                                        alt={journal.altText || journal.title || 'Journal cover'}
                                        className="w-full h-32 object-cover rounded-md"
                                    />
                                </div>
                            )}
                            
                            <div className="space-y-2 text-sm text-gray-600">
                                {journal.publishedAt && (
                                    <div className="flex items-center space-x-2">
                                        <CalendarIcon className="h-4 w-4" />
                                        <span>
                                            {new Date(journal.publishedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                )}
                                
                                {journal.authorId && (
                                    <div className="flex items-center space-x-2">
                                        <EyeIcon className="h-4 w-4" />
                                        <span>Author: {journal.authorId}</span>
                                    </div>
                                )}
                                
                                <div className="mt-3">
                                    <Badge variant={journal.isPublished === 'yes' ? 'default' : 'secondary'}>
                                        {journal.isPublished === 'yes' ? 'Published' : 'Draft'}
                                    </Badge>
                                </div>
                            </div>
                            
                            <div className="mt-4 pt-4 border-t">
                                <Link href={`/admin/luxe/journal/edit/${journal.slug}`}>
                                    <Button variant="outline" className="w-full">
                                        Edit Entry
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default AdminLuxeJournal;
