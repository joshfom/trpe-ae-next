"use client";

import React, { useCallback, useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SingleImageDropzone } from "@/components/single-image-dropzone";
import { useEdgeStore } from "@/db/edgestore";
import { CommunityFormSchema, CommunityFormType } from '@/features/admin/community/form-schema/community-form-schema';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Building2 } from "lucide-react";
import { TipTapEditor } from "@/components/TiptapEditor";
import { useCreateCommunity } from '@/features/admin/community/api/use-create-community';
import { useRouter } from 'next/navigation';

export default function CreateCommunityPage() {
    const [file, setFile] = useState<File | undefined>(undefined);
    const [hasDefaultImage, setHasDefaultImage] = useState(false);
    const { edgestore } = useEdgeStore();
    const router = useRouter();

    const mutation = useCreateCommunity();

    const form = useForm<CommunityFormType>({
        resolver: zodResolver(CommunityFormSchema),
        mode: "onChange",
        defaultValues: {
            name: '',
            image: '',
            about: '',
            metaTitle: '',
            metaDesc: '',
            featured: false,
            displayOrder: 0,
            isLuxe: false,
        }
    });

    // Avatar upload function
    const updateImage = useCallback(async (file: File | undefined) => {
        if (file) {
            try {
                const res = await edgestore.publicFiles.upload({
                    file,
                    onProgressChange: (progress) => {
                        console.log('Image upload progress:', progress);
                    },
                });

                setFile(file);
                form.setValue('image', res.url);
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }
    }, [edgestore, form]);

    const handleRemoveImage = useCallback(() => {
        setHasDefaultImage(false);
        setFile(undefined);
        form.setValue('image', '');
    }, [form]);

    const onSubmit = useCallback((values: CommunityFormType) => {
        mutation.mutate(values, {
            onSuccess: () => {
                router.push('/admin/communities');
            }
        });
    }, [mutation, router]);

    const handleBackClick = useCallback(() => {
        router.push('/admin/communities');
    }, [router]);

    return (
        <div className="container mx-auto py-8 px-4 max-w-4xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBackClick}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft size={16} />
                    Back to Communities
                </Button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold">Create New Community</h1>
                    <p className="text-muted-foreground">Add a new community to the platform</p>
                </div>
            </div>

            {/* Create Form */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Building2 size={20} />
                        Community Details
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            
                            {/* Basic Info Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    name="name"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Community Name *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Community Name"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    name="displayOrder"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Display Order</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="number"
                                                    placeholder="0"
                                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* SEO Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    name="metaTitle"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Meta Title</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder={`${form.watch('name')} - Properties for Sale & Rent`}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    name="metaDesc"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Meta Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    {...field}
                                                    placeholder="Meta description for SEO"
                                                    rows={3}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Image Upload Section */}
                            <FormField
                                name="image"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Community Image</FormLabel>
                                        <FormControl>
                                            <div className="space-y-4">
                                                <SingleImageDropzone
                                                    width={200}
                                                    height={200}
                                                    value={file}
                                                    dropzoneOptions={{
                                                        maxSize: 1024 * 1024 * 4, // 4MB
                                                    }}
                                                    onChange={(file) => {
                                                        setFile(file);
                                                        updateImage(file);
                                                    }}
                                                />
                                                
                                                {(field.value || hasDefaultImage) && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm text-muted-foreground">
                                                            Image uploaded successfully
                                                        </span>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={handleRemoveImage}
                                                        >
                                                            Remove
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {/* About Section */}
                            <FormField
                                name="about"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>About Community</FormLabel>
                                        <FormControl>
                                            <TipTapEditor
                                                name="about"
                                                control={form.control}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {/* Settings Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    name="featured"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">Featured Community</FormLabel>
                                                <div className="text-sm text-muted-foreground">
                                                    Display this community on the homepage
                                                </div>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    name="isLuxe"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">Luxe Community</FormLabel>
                                                <div className="text-sm text-muted-foreground">
                                                    Available in the Luxe section
                                                </div>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex gap-4 pt-6">
                                <Button 
                                    type="button" 
                                    variant="outline"
                                    onClick={handleBackClick}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit" 
                                    disabled={mutation.isPending}
                                    className="flex-1"
                                >
                                    {mutation.isPending ? 'Creating...' : 'Create Community'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
