"use client"

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import AuthorCard from './AuthorCard';
import AuthorForm from './AuthorForm';
import { getAllAuthors } from '@/actions/admin/get-all-authors-action';
import { toast } from 'sonner';

interface Author {
    id: string;
    name: string | null;
    about: string | null;
    avatar?: string | null;
    updatedAt?: string | null;
    slug?: string;
    createdAt: string;
}

function AllAuthors() {
    const [isOpen, setIsOpen] = useState(false);
    const [authors, setAuthors] = useState<Author[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchAuthors = async () => {
        try {
            setIsLoading(true);
            const result = await getAllAuthors();
            if (result.success) {
                setAuthors(result.data || []);
            } else {
                toast.error(result.error || 'Failed to fetch authors');
            }
        } catch (error) {
            console.error("Error fetching authors:", error);
            toast.error('An error occurred while fetching authors');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAuthors();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Authors</h1>
                <Button onClick={() => setIsOpen(true)} className="btn btn-primary">
                    Add Author
                </Button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {authors.map((author) => (
                        <AuthorCard key={author.id} author={author} onAuthorUpdated={fetchAuthors} />
                    ))}
                    {authors.length === 0 && (
                        <div className="col-span-3 text-center py-8">
                            <p className="text-lg text-gray-500">No authors found. Add a new author to get started.</p>
                        </div>
                    )}
                </div>
            )}

            <AuthorForm isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
    );
}

export default AllAuthors;