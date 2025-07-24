"use client"
import React, {useEffect, memo, useCallback, useMemo, useState} from 'react';
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {useForm} from "react-hook-form";
import {Form, FormField, FormItem, FormLabel, FormControl} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Switch} from "@/components/ui/switch";
import {SingleImageDropzone} from "@/components/single-image-dropzone";
import {useEdgeStore} from "@/db/edgestore";
import {z} from "zod";
import {useUpdateAgent} from "../api/use-update-agent";
import {AgentFormSchema} from '../form-schema/agent-form-schema';
import {Textarea} from '@/components/ui/textarea';
import {TipTapEditor} from "@/components/TiptapEditor";
import {X, Crown, User} from "lucide-react";
import {employeeTable} from "@/db/schema/employee-table";
import Link from 'next/link';

type EmployeeType = typeof employeeTable.$inferSelect;

interface AdminAgentCardProps {
    agent: EmployeeType
}

const formSchema = AgentFormSchema

type formValues = z.infer<typeof formSchema>

const AdminAgentCard = memo(({agent}: AdminAgentCardProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [avatarFile, setAvatarFile] = useState<File | undefined>(undefined);
    const [hasDefaultAvatar, setHasDefaultAvatar] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {edgestore} = useEdgeStore();

    const mutation = useUpdateAgent(agent.id)

    // Memoize form default values
    const defaultValues = useMemo(() => ({
        firstName: agent.firstName || '',
        lastName: agent.lastName || '',
        email: agent.email || '',
        phone: agent.phone || '',
        title: agent.title || '',
        bio: agent.bio || '',
        rera: agent.rera || '',
        avatarUrl: agent.avatarUrl || '',
        isVisible: agent.isVisible || false,
        isLuxe: agent.isLuxe || false,
        order: agent.order || 100,
    }), [agent.firstName, agent.lastName, agent.email, agent.phone, agent.title, agent.bio, agent.rera, agent.avatarUrl, agent.isVisible, agent.isLuxe, agent.order]);

    const form = useForm<formValues>({
        mode: "onChange",
        defaultValues,
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
            form.setValue('avatarUrl', res.url)
        }
    }, [edgestore, form]);

    const onSubmit = useCallback((values: formValues) => {
        mutation.mutate(values, {
            onSuccess: () => {
                setIsOpen(false)
                form.reset()
            }
        })
    }, [mutation, form]);

    const handleEditClick = useCallback(() => {
        setIsOpen(true);
    }, []);

    const handleSheetChange = useCallback((open: boolean) => {
        setIsOpen(open);
    }, []);

    const handleCancelClick = useCallback(() => {
        setIsOpen(false);
    }, []);

    const handleRemoveAvatar = useCallback(() => {
        setHasDefaultAvatar(false);
        form.setValue('avatarUrl', '');
    }, [form]);

    // Quick toggle for luxe status
    const handleLuxeToggle = useCallback((checked: boolean) => {
        const values = form.getValues();
        mutation.mutate({...values, isLuxe: checked});
    }, [form, mutation]);

    useEffect(() => {
        if (agent.avatarUrl) {
            setHasDefaultAvatar(true)
        }
    }, [agent.avatarUrl])

    const displayName = `${agent.firstName || ''} ${agent.lastName || ''}`.trim() || 'Unnamed Agent';

    return (
        <div className="bg-white rounded-xl border flex flex-col justify-between relative">
            <div className="flex flex-col">
                <div className={'relative h-60'}>
                    {agent.avatarUrl ? (
                        <img
                            className={'rounded-t-xl h-60 object-cover w-full hover:zoom-in-50 ease-in-out transition-all duration-150'}
                            src={agent.avatarUrl}
                            alt={displayName}/>
                    ) : (
                        <div className="rounded-t-xl h-60 bg-gray-100 flex items-center justify-center">
                            <User size={48} className="text-gray-400" />
                        </div>
                    )}
                    
                    {/* Luxe badge */}
                    {agent.isLuxe && (
                        <div className="absolute top-2 right-2 bg-yellow-500 text-white p-1 rounded-full">
                            <Crown size={16} />
                        </div>
                    )}
                    
                    {/* Quick luxe toggle */}
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 flex items-center gap-2">
                        <span className="text-xs font-medium">Luxe</span>
                        <Switch
                            checked={agent.isLuxe || false}
                            onCheckedChange={handleLuxeToggle}
                        />
                    </div>
                </div>
                <div className="px-4 py-3">
                    <h2 className="font-bold">{displayName}</h2>
                    <p className="text-sm text-muted-foreground">
                        {agent.title || 'Agent'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {agent.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {agent.isLuxe ? 'Luxe Advisor' : 'Standard Agent'} • {agent.isVisible ? 'Visible' : 'Hidden'}
                    </p>
                </div>
                <div className={'flex justify-end items-end px-4 pb-4'}>
                    <Link href={`/admin/agents/${agent.id}/edit`} className={'text-sm py-1 px-3 border rounded-2xl'}>
                        Edit Agent
                    </Link>
                </div>
            </div>

            <Sheet open={isOpen} onOpenChange={handleSheetChange}>
                <SheetContent className={'bg-white max-w-4xl h-screen flex flex-col'}>
                    <SheetHeader className={'p-4 px-6'}>
                        <SheetTitle>
                            Edit Agent - {displayName}
                        </SheetTitle>
                    </SheetHeader>
                    <SheetDescription className={'h-full flex flex-col'}>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className={' h-full flex pb-12 flex-col'}>
                                <div className="flex-1 overflow-y-auto space-y-6 p-6">
                                    
                                    {/* Basic Info Section */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            name={'firstName'}
                                            control={form.control}
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>First Name</FormLabel>
                                                    <Input
                                                        {...field}
                                                        placeholder={'First Name'}
                                                        className={'input'}/>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            name={'lastName'}
                                            control={form.control}
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Last Name</FormLabel>
                                                    <Input
                                                        {...field}
                                                        placeholder={'Last Name'}
                                                        className={'input'}/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Contact Info */}
                                    <FormField
                                        name={'email'}
                                        control={form.control}
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <Input
                                                    {...field}
                                                    type="email"
                                                    placeholder={'Email Address'}
                                                    className={'input'}/>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        name={'phone'}
                                        control={form.control}
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Phone</FormLabel>
                                                <Input
                                                    {...field}
                                                    placeholder={'Phone Number'}
                                                    className={'input'}/>
                                            </FormItem>
                                        )}
                                    />

                                    {/* Professional Info */}
                                    <FormField
                                        name={'title'}
                                        control={form.control}
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Title</FormLabel>
                                                <Input
                                                    {...field}
                                                    placeholder={'Job Title'}
                                                    className={'input'}/>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        name={'rera'}
                                        control={form.control}
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>RERA Number</FormLabel>
                                                <Input
                                                    {...field}
                                                    placeholder={'RERA License Number'}
                                                    className={'input'}/>
                                            </FormItem>
                                        )}
                                    />

                                    {/* Bio */}
                                    <FormField
                                        name={'bio'}
                                        control={form.control}
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Bio</FormLabel>
                                                <TipTapEditor
                                                    name="bio"
                                                    control={form.control}
                                                    defaultValue={agent.bio || ''}
                                                />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Avatar */}
                                    <div className="">
                                        <FormField
                                            name={'avatarUrl'}
                                            control={form.control}
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Avatar</FormLabel>
                                                    <div className={'space-y-4'}>
                                                        {hasDefaultAvatar && (
                                                            <div className={'w-32 h-32 relative'}>
                                                                <img
                                                                    className={'w-full h-full object-cover rounded-full'}
                                                                    src={field.value}
                                                                    alt="Current avatar"/>
                                                                <button
                                                                    type={'button'}
                                                                    onClick={handleRemoveAvatar}
                                                                    className={'absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600'}>
                                                                    <X size={16}/>
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
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Settings */}
                                    <div className="grid grid-cols-2 gap-6">
                                        <FormField
                                            name={'isVisible'}
                                            control={form.control}
                                            render={({field}) => (
                                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                    <div className="space-y-0.5">
                                                        <FormLabel className="text-base">
                                                            Visible
                                                        </FormLabel>
                                                        <div className="text-sm text-muted-foreground">
                                                            Show agent on website
                                                        </div>
                                                    </div>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            name={'isLuxe'}
                                            control={form.control}
                                            render={({field}) => (
                                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                    <div className="space-y-0.5">
                                                        <FormLabel className="text-base">
                                                            Luxe Advisor
                                                        </FormLabel>
                                                        <div className="text-sm text-muted-foreground">
                                                            Include in Luxe section
                                                        </div>
                                                    </div>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Display Order */}
                                    <FormField
                                        name={'order'}
                                        control={form.control}
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Display Order</FormLabel>
                                                <Input
                                                    {...field}
                                                    type="number"
                                                    placeholder={'Display order (lower number = higher priority)'}
                                                    className={'input'}
                                                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                />
                                            </FormItem>
                                        )}
                                    />

                                </div>
                                
                                {/* Footer buttons */}
                                <div className={'p-6 pt-0 flex gap-4'}>
                                    <Button type={'button'} onClick={handleCancelClick} variant={'outline'}>
                                        Cancel
                                    </Button>
                                    <Button 
                                        type={'submit'} 
                                        disabled={mutation.isLoading}
                                        className={'flex-1'}>
                                        {mutation.isLoading ? 'Saving...' : 'Save Agent'}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </SheetDescription>
                </SheetContent>
            </Sheet>
        </div>
    );
});

AdminAgentCard.displayName = 'AdminAgentCard';

export default AdminAgentCard;
