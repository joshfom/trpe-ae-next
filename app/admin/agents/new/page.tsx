"use client";

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { SingleImageDropzone } from "@/components/single-image-dropzone";
import { useEdgeStore } from "@/db/edgestore";
import { z } from "zod";
import { useAddAgent } from "@/features/admin/agent/api/use-add-agent";
import { AgentFormSchema } from '@/features/admin/agents/form-schema/agent-form-schema';
import { TipTapEditor } from "@/components/TiptapEditor";
import { X, ArrowLeft, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = AgentFormSchema;
type FormValues = z.infer<typeof formSchema>;

export default function NewAgentPage() {
    const router = useRouter();
    const [avatarFile, setAvatarFile] = useState<File | undefined>(undefined);
    const [hasDefaultAvatar, setHasDefaultAvatar] = useState(false);
    const { edgestore } = useEdgeStore();
    
    const mutation = useAddAgent();

    const form = useForm<FormValues>({
        mode: "onChange",
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            title: '',
            bio: '',
            rera: '',
            avatarUrl: '',
            isVisible: true,
            isLuxe: false,
            order: 100,
        },
    });

    // Memoize callback functions
    const updateAvatar = useCallback(async (file: File | undefined) => {
        if (file) {
            const res = await edgestore.publicFiles.upload({
                file,
                onProgressChange: (progress) => {
                    console.log('Avatar upload progress:', progress);
                },
            });

            setAvatarFile(file);
            form.setValue('avatarUrl', res.url);
            setHasDefaultAvatar(true);
        }
    }, [edgestore, form]);

    const onSubmit = useCallback((values: FormValues) => {
        mutation.mutate(values, {
            onSuccess: () => {
                router.push('/admin/agents');
            }
        });
    }, [mutation, router]);

    const handleBackClick = useCallback(() => {
        router.push('/admin/agents');
    }, [router]);

    const handleRemoveAvatar = useCallback(() => {
        setHasDefaultAvatar(false);
        setAvatarFile(undefined);
        form.setValue('avatarUrl', '');
    }, [form]);

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleBackClick}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft size={16} />
                    Back to Agents
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Add New Agent</h1>
                    <p className="text-muted-foreground">Create a new agent profile</p>
                </div>
            </div>

            {/* Add Form */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User size={20} />
                        Agent Details
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            
                            {/* Basic Info Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    name="firstName"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>First Name *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="First Name"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    name="lastName"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Last Name *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Last Name"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Contact Info */}
                            <FormField
                                name="email"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email *</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="email"
                                                placeholder="Email Address"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name="phone"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Phone Number"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {/* Professional Info */}
                            <FormField
                                name="title"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Job Title"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name="rera"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>RERA Number</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="RERA License Number"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {/* Bio with TipTap Editor */}
                            <FormField
                                name="bio"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bio</FormLabel>
                                        <FormControl>
                                            <TipTapEditor
                                                name="bio"
                                                control={form.control}
                                                defaultValue=""
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {/* Avatar */}
                            <FormField
                                name="avatarUrl"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Avatar</FormLabel>
                                        <FormControl>
                                            <div className="space-y-4">
                                                {hasDefaultAvatar && field.value && (
                                                    <div className="w-32 h-32 relative">
                                                        <img
                                                            className="w-full h-full object-cover rounded-full"
                                                            src={field.value}
                                                            alt="Agent avatar"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={handleRemoveAvatar}
                                                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                )}
                                                <SingleImageDropzone
                                                    width={200}
                                                    height={200}
                                                    value={avatarFile}
                                                    onChange={(file) => {
                                                        setAvatarFile(file);
                                                        updateAvatar(file);
                                                    }}
                                                />
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {/* Settings */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    name="isVisible"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">
                                                    Visible
                                                </FormLabel>
                                                <div className="text-sm text-muted-foreground">
                                                    Show agent on website
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
                                                <FormLabel className="text-base">
                                                    Luxe Advisor
                                                </FormLabel>
                                                <div className="text-sm text-muted-foreground">
                                                    Include in Luxe section
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

                            {/* Display Order */}
                            <FormField
                                name="order"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Display Order</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="number"
                                                placeholder="Display order (lower number = higher priority)"
                                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {/* Action Buttons */}
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
                                    disabled={mutation.isLoading}
                                    className="flex-1"
                                >
                                    {mutation.isLoading ? 'Creating...' : 'Create Agent'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
