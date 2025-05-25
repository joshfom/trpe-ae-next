"use client";

import React, { memo, useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { SingleImageDropzone } from '@/components/single-image-dropzone';
import { useEdgeStore } from '@/db/edgestore';
import { authorFormSchema } from '@/features/admin/author/schema/author-form-schema';
import { updateAuthor } from '@/actions/admin/update-author-action';
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

interface EditAuthorFormProps {
    author: Author;
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    onSuccess: () => void;
}

type FormValues = z.infer<typeof authorFormSchema>;

function EditAuthorForm({ author, isOpen, setIsOpen, onSuccess }: EditAuthorFormProps) {
    const [file, setFile] = useState<File | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { edgestore } = useEdgeStore();

    const form = useForm<FormValues>({
        mode: 'onChange',
        resolver: zodResolver(authorFormSchema),
        defaultValues: {
            name: author.name || '',
            about: author.about || '',
            avatar: author.avatar || ''
        }
    });

    const updateAvatar = async (file: File | undefined) => {
        if (file) {
            try {
                const res = await edgestore.publicFiles.upload({
                    file,
                    onProgressChange: (progress) => {
                        console.log(progress);
                    },
                });

                setFile(file);
                form.setValue('avatar', res.url);
            } catch (error) {
                console.error('Error uploading avatar:', error);
                toast.error('Failed to upload avatar');
            }
        }
    };

    const onSubmit = async (values: FormValues) => {
        try {
            setIsSubmitting(true);
            
            const result = await updateAuthor(author.id, values);
            
            if (!result.success) {
                throw new Error(result.error || 'Failed to update author');
            }
            
            toast.success('Author updated successfully');
            setIsOpen(false);
            onSuccess();
        } catch (error) {
            console.error('Error updating author:', error);
            toast.error('Failed to update author');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Memoized callback functions
    const handleCancelClick = useCallback(() => {
        setIsOpen(false);
    }, [setIsOpen]);

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent className="bg-white max-w-2xl flex flex-col">
                <SheetHeader className="p-4 px-6">
                    <SheetTitle>Edit Author</SheetTitle>
                    <SheetDescription>Update author information</SheetDescription>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
                            <FormField
                                name="name"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <Input {...field} placeholder="Author name" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="about"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>About</FormLabel>
                                        <Textarea
                                            {...field}
                                            placeholder="About the author"
                                            rows={5}
                                        />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="avatar"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Avatar</FormLabel>
                                        <SingleImageDropzone
                                            width={200}
                                            height={200}
                                            value={file}
                                            onChange={(file) => updateAvatar(file)}
                                            previewUrl={author.avatar || undefined}
                                        />
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-between pt-8">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancelClick}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Updating...' : 'Update Author'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </SheetContent>
        </Sheet>
    );
}

const EditAuthorFormComponent = memo(EditAuthorForm);
EditAuthorFormComponent.displayName = 'EditAuthorForm';

export default EditAuthorFormComponent;
