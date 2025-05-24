"use client";

import React from 'react';
import {z} from 'zod';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {PageMetaFormSchema} from '@/lib/types/form-schema/page-meta-form-schema';
import {Button} from '@/components/ui/button';
import {
    Form,
    FormControl, FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {TipTapEditor} from "@/components/TiptapEditor";
import {useAddPageMeta} from "@/features/admin/page-meta/api/use-add-page-meta";
import {useUpdatePageMeta} from "@/features/admin/page-meta/api/use-update-page-meta";
import {PageMetaType} from "@/features/admin/page-meta/types/page-meta-type";
import {Switch} from "@/components/ui/switch";

type FormValues = z.infer<typeof PageMetaFormSchema>;

interface PageMetaFormProps {
    defaultValues?: PageMetaType | null;
    onSubmitted?: () => void;
    pathname?: string;
}

export function PageMetaForm({defaultValues, onSubmitted, pathname}: PageMetaFormProps) {
    const addFormMutation = useAddPageMeta();
    const updateFormMutation = useUpdatePageMeta(defaultValues?.id || '');
    const defaultPath = pathname || defaultValues?.path || '';
    console.log('PageMetaForm defaultPath:', defaultPath);

    const form = useForm<FormValues>({
        resolver: zodResolver(PageMetaFormSchema),
        mode: 'onBlur',
        defaultValues: {
            metaTitle: defaultValues?.metaTitle || '',
            // Convert null to false or undefined to boolean
            noIndex: typeof defaultValues?.noIndex === 'boolean' ? defaultValues.noIndex : false,
            noFollow: typeof defaultValues?.noFollow === 'boolean' ? defaultValues.noFollow : false,
            includeInSitemap: typeof defaultValues?.includeInSitemap === 'boolean' ? defaultValues.includeInSitemap : true,
            metaKeywords: defaultValues?.metaKeywords || '',
            metaDescription: defaultValues?.metaDescription || '',
            title: defaultValues?.title || '',
            content: defaultValues?.content || '',
            path: defaultPath,
        },
    });

    const onSubmit = form.handleSubmit(async (values: FormValues) => {
        console.log('Submitting form values:', values);

        // Determine if we're creating or updating based on whether we have defaultValues with an id
        const isUpdating = !!defaultValues?.id;
        
        if (isUpdating) {
            try {
                const result = await updateFormMutation.mutate(values);
                console.log('Update successful:', result);
                if (onSubmitted) {
                    onSubmitted();
                }
            } catch (error) {
                console.error('Error updating page meta:', error);
                handleFormError(error);
            }
        } else {
            try {
                const result = await addFormMutation.mutate(values);
                console.log('Creation successful:', result);
                form.reset();
                if (onSubmitted) {
                    onSubmitted();
                }
            } catch (error) {
                console.error('Error creating page meta:', error);
                handleFormError(error);
            }
        }
    });
    
    // Helper function to handle form errors
    const handleFormError = (err: unknown) => {
        const error = err instanceof Error ? err : new Error('An unknown error occurred');
        console.error('Error message:', error.message);
        try {
            const errorData = JSON.parse(error.message);
            if (errorData.error) {
                form.setError('path', {
                    type: 'manual',
                    message: errorData.error
                });
            }
        } catch (e) {
            // Not a JSON error
            form.setError('path', {
                type: 'manual',
                message: error.message
            });
        }
    };

    // Log form errors when they occur
    React.useEffect(() => {
        if (Object.keys(form.formState.errors).length) {
            console.log('Form validation errors:', form.formState.errors);
        }
    }, [form.formState.errors]);

    // Monitor form changes
    return (
        <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-6">
                <FormField
                    control={form.control}
                    name="path"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Path</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    disabled={!!pathname}
                                    value={field.value || ''}
                                    onChange={(e) => {
                                        // Ensure path starts with a slash
                                        let value = e.target.value;
                                        if (value && !value.startsWith('/')) {
                                            value = `/${value}`;
                                        }
                                        field.onChange(value);
                                    }}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="title"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Page Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Page Title" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="noIndex"
                    render={({field}) => (
                        <FormItem
                            className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <FormLabel>No Index</FormLabel>
                                <FormDescription>
                                    {field.value === true ? "This page will NOT be indexed by search engines" : "This page will be indexed by search engines"}
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value === true}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="noFollow"
                    render={({field}) => (
                        <FormItem
                            className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <FormLabel>No Follow</FormLabel>
                                <FormDescription>
                                    {field.value === true ? "Search engines will NOT follow links on this page" : "Search engines will follow links on this page"}
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value === true}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="includeInSitemap"
                    render={({field}) => (
                        <FormItem
                            className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <FormLabel>Include in Sitemap</FormLabel>
                                <FormDescription>
                                    {field.value === true ? "This page will be included in the sitemap.xml" : "This page will NOT be included in the sitemap.xml"}
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value === true}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="metaKeywords"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Meta Keywords</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Meta Keywords (comma separated)"
                                    {...field}
                                    className="min-h-[60px]"
                                />
                            </FormControl>
                            <FormDescription>
                                Enter keywords separated by commas
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="metaTitle"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Meta Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Meta Title" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="metaDescription"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Meta Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Meta Description"
                                    {...field}
                                    className="min-h-[100px]"
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="content"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Content</FormLabel>
                            <FormControl>
                                <TipTapEditor
                                    name="content"
                                    control={form.control}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <Button 
                    type="submit" 
                    disabled={addFormMutation.isLoading || updateFormMutation.isLoading}
                >
                    {addFormMutation.isLoading || updateFormMutation.isLoading ? 'Saving...' : 
                     defaultValues?.id ? 'Update Page' : 'Create Page'}
                </Button>
            </form>
        </Form>
    );
}