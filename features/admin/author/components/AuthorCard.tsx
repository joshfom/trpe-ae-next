"use client";

import React, { useState, memo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { deleteAuthor } from '@/actions/admin/delete-author-action';
import EditAuthorForm from './EditAuthorForm';
import Image from 'next/image';

interface Author {
    id: string;
    name: string | null;
    about: string | null;
    avatar?: string | null;
    updatedAt?: string | null;
    slug?: string;
    createdAt: string;
}

interface AuthorCardProps {
    author: Author;
    onAuthorUpdated: () => void;
}

const AuthorCard = memo<AuthorCardProps>(({ author, onAuthorUpdated }) => {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Memoize callback functions
    const handleDelete = useCallback(async () => {
        try {
            setIsDeleting(true);
            const result = await deleteAuthor(author.id);
            
            if (!result.success) {
                throw new Error(result.error || 'Failed to delete author');
            }
            
            toast.success('Author deleted successfully');
            setIsDeleteDialogOpen(false);
            onAuthorUpdated();
        } catch (error) {
            console.error("Error deleting author:", error);
            toast.error('An error occurred while deleting author');
        } finally {
            setIsDeleting(false);
        }
    }, [author.id, onAuthorUpdated]);

    const handleEditClick = useCallback(() => {
        setIsEditOpen(true);
    }, []);

    const handleDeleteClick = useCallback(() => {
        setIsDeleteDialogOpen(true);
    }, []);

    const handleDeleteDialogClose = useCallback(() => {
        setIsDeleteDialogOpen(false);
    }, []);

    const handleEditSuccess = useCallback(() => {
        onAuthorUpdated();
    }, [onAuthorUpdated]);

    return (
        <>
            <Card className="h-full flex flex-col overflow-hidden">
                <CardHeader className="pb-0">
                    <div className="relative w-full h-48 mb-4">
                        {author.avatar ? (
                            <div className="relative w-full h-full">
                                <Image 
                                    src={author.avatar} 
                                    alt={author.name || "Author"}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 300px"
                                    className="object-cover rounded-md"
                                />
                            </div>
                        ) : (
                            <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                                <span className="text-gray-500 text-lg">{author.name ? author.name.charAt(0) : "A"}</span>
                            </div>
                        )}
                    </div>
                    <h3 className="text-xl font-bold">{author.name || "Unnamed Author"}</h3>
                </CardHeader>
                <CardContent className="grow">
                    <p className="text-sm text-gray-600 line-clamp-3">{author.about || "No bio available"}</p>
                </CardContent>
                <CardFooter className="flex justify-between pt-4">
                    <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleEditClick}
                    >
                        Edit
                    </Button>
                    <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={handleDeleteClick}
                    >
                        Delete
                    </Button>
                </CardFooter>
            </Card>

            {isEditOpen && (
                <EditAuthorForm 
                    author={author} 
                    isOpen={isEditOpen} 
                    setIsOpen={setIsEditOpen} 
                    onSuccess={handleEditSuccess}
                />
            )}

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Author</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {author.name}? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={handleDeleteDialogClose}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
});

AuthorCard.displayName = 'AuthorCard';

export default AuthorCard;
