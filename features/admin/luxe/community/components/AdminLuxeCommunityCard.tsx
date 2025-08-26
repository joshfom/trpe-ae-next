"use client"
import React, {useEffect, memo, useCallback, useMemo} from 'react';
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Switch} from "@/components/ui/switch";
import {SingleImageDropzone} from "@/components/single-image-dropzone";
import {useEdgeStore} from "@/db/edgestore";
import {z} from "zod";
import {useUpdateLuxeCommunity} from "../api/use-update-luxe-community";
import {LuxeCommunityFormSchema} from '../form-schema/luxe-community-form-schema';
import {Textarea} from '@/components/ui/textarea';
import {X, Crown} from "lucide-react";

interface AdminLuxeCommunityCardProps {
    community: CommunityType
}

const formSchema = LuxeCommunityFormSchema

type formValues = z.infer<typeof formSchema>

const AdminLuxeCommunityCard = memo(({community}: AdminLuxeCommunityCardProps) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [mainImageFile, setMainImageFile] = React.useState<File | undefined>(undefined);
    const [heroImageFile, setHeroImageFile] = React.useState<File | undefined>(undefined);
    const [hasDefaultMainImage, setHasDefaultMainImage] = React.useState(false);
    const [hasDefaultHeroImage, setHasDefaultHeroImage] = React.useState(false);
    const {edgestore} = useEdgeStore();

    const mutation = useUpdateLuxeCommunity(community.id)

    // Memoize form default values
    const defaultValues = useMemo(() => ({
        luxeMetaTitle: community.luxeMetaTitle || '',
        luxeTitle: community.luxeName || '', // Map luxeName to luxeTitle in form
        luxeDescription: community.luxeAbout || '', // Map luxeAbout to luxeDescription in form
        luxeImageUrl: community.luxeImageUrl || '',
        luxeHeroImageUrl: community.luxeHeroImageUrl || '',
        isLuxe: community.isLuxe || false,
        luxeFeatured: community.luxeFeatured || false,
        luxeDisplayOrder: community.luxeDisplayOrder || 0,
    }), [community.luxeMetaTitle, community.luxeName, community.luxeAbout, community.luxeImageUrl, community.luxeHeroImageUrl, community.isLuxe, community.luxeFeatured, community.luxeDisplayOrder]);

    const form = useForm<formValues>({
        mode: "onChange",
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    // Memoize callback functions
    const updateMainImage = useCallback(async (file: File | undefined) => {
        if (file) {
            const res = await edgestore.publicFiles.upload({
                file,
                onProgressChange: (progress) => {
                    console.log('Main image upload progress:', progress);
                },
            });

            setMainImageFile(file);
            form.setValue('luxeImageUrl', res.url)
        }
    }, [edgestore, form]);

    const updateHeroImage = useCallback(async (file: File | undefined) => {
        if (file) {
            const res = await edgestore.publicFiles.upload({
                file,
                onProgressChange: (progress) => {
                    console.log('Hero image upload progress:', progress);
                },
            });

            setHeroImageFile(file);
            form.setValue('luxeHeroImageUrl', res.url)
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

    const handleRemoveMainImage = useCallback(() => {
        setHasDefaultMainImage(false);
        form.setValue('luxeImageUrl', '');
    }, [form]);

    const handleRemoveHeroImage = useCallback(() => {
        setHasDefaultHeroImage(false);
        form.setValue('luxeHeroImageUrl', '');
    }, [form]);

    useEffect(() => {
        if (community.luxeImageUrl) {
            setHasDefaultMainImage(true)
        }
        if (community.luxeHeroImageUrl) {
            setHasDefaultHeroImage(true)
        }
    }, [community.luxeImageUrl, community.luxeHeroImageUrl])

    return (
        <div className="bg-white rounded-xl border flex flex-col justify-between">
            <div className="flex flex-col">
                <div className={'relative h-60'}>
                    <img
                        className={'rounded-xl h-60 object-cover w-full hover:zoom-in-50 ease-in-out transition-all duration-150'}
                        src={community.luxeImageUrl || community.image}
                        alt={community.name || 'Community image'}/>
                    {community.isLuxe && (
                        <div className="absolute top-2 right-2 bg-yellow-500 text-white p-1 rounded-full">
                            <Crown size={16} />
                        </div>
                    )}
                </div>
                <div className="px-4 py-3">
                    <h2 className=" font-bold">{community.luxeName || community.name}</h2>
                    <p className="text-sm text-muted-foreground">
                        {community.isLuxe ? 'Luxe Enabled' : 'Not in Luxe'}
                    </p>
                </div>
                <div className={'flex justify-end items-end px-4 pb-4'}>
                    <button onClick={handleEditClick} className={'text-sm py-1 px-3 border rounded-2xl'}>
                        Edit Luxe Content
                    </button>
                </div>
            </div>

            <Sheet open={isOpen} onOpenChange={handleSheetChange}>
                <SheetContent className={'bg-white max-w-7xl h-screen flex flex-col'}>
                    <SheetHeader className={'p-4 px-6'}>
                        <SheetTitle>
                            Edit Luxe Content - {community.name}
                        </SheetTitle>
                    </SheetHeader>
                    <SheetDescription className={'h-full flex flex-col'}>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className={' h-full flex pb-12 flex-col'}>
                                <div className="flex-1 overflow-y-auto space-y-6 p-6">
                                    
                                    {/* Enable Luxe Toggle */}
                                    <FormField
                                        name={'isLuxe'}
                                        control={form.control}
                                        render={({field}) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-base">
                                                        Enable Luxe
                                                    </FormLabel>
                                                    <div className="text-sm text-muted-foreground">
                                                        Make this community available in the Luxe section
                                                    </div>
                                                </div>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Luxe Meta Title */}
                                    <FormField
                                        name={'luxeMetaTitle'}
                                        control={form.control}
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Luxe Meta Title</FormLabel>
                                                <Input
                                                    {...field}
                                                    placeholder={'Luxe Meta Title for SEO'}
                                                    className={'input'}/>
                                            </FormItem>
                                        )}
                                    />

                                    {/* Luxe Title */}
                                    <FormField
                                        name={'luxeTitle'}
                                        control={form.control}
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Luxe Title</FormLabel>
                                                <Input
                                                    {...field}
                                                    placeholder={'Luxe Display Title'}
                                                    className={'input'}/>
                                            </FormItem>
                                        )}
                                    />

                                    {/* Luxe Description */}
                                    <FormField
                                        name={'luxeDescription'}
                                        control={form.control}
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Luxe Description</FormLabel>
                                                <Textarea
                                                    {...field}
                                                    placeholder={'Luxe-specific description'}
                                                    className={'textarea min-h-[100px]'}/>
                                            </FormItem>
                                        )}
                                    />

                                    {/* Luxe Main Image */}
                                    <div className="">
                                        <FormField
                                            name={'luxeImageUrl'}
                                            control={form.control}
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Luxe Main Image</FormLabel>
                                                    <div className={'space-y-4'}>
                                                        {hasDefaultMainImage && (
                                                            <div className={'w-full h-40 relative'}>
                                                                <img
                                                                    className={'w-full h-full object-cover rounded-md'}
                                                                    src={field.value}
                                                                    alt="Current luxe image"/>
                                                                <button
                                                                    type={'button'}
                                                                    onClick={handleRemoveMainImage}
                                                                    className={'absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600'}>
                                                                    <X size={16}/>
                                                                </button>
                                                            </div>
                                                        )}
                                                        <SingleImageDropzone
                                                            width={200}
                                                            height={200}
                                                            value={mainImageFile}
                                                            onChange={(file) => {
                                                                setMainImageFile(file);
                                                                updateMainImage(file);
                                                            }}
                                                        />
                                                    </div>
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Luxe Hero Image */}
                                    <div className="">
                                        <FormField
                                            name={'luxeHeroImageUrl'}
                                            control={form.control}
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Luxe Hero Image</FormLabel>
                                                    <div className={'space-y-4'}>
                                                        {hasDefaultHeroImage && (
                                                            <div className={'w-full h-40 relative'}>
                                                                <img
                                                                    className={'w-full h-full object-cover rounded-md'}
                                                                    src={field.value}
                                                                    alt="Current luxe hero image"/>
                                                                <button
                                                                    type={'button'}
                                                                    onClick={handleRemoveHeroImage}
                                                                    className={'absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600'}>
                                                                    <X size={16}/>
                                                                </button>
                                                            </div>
                                                        )}
                                                        <SingleImageDropzone
                                                            width={200}
                                                            height={200}
                                                            value={heroImageFile}
                                                            onChange={(file) => {
                                                                setHeroImageFile(file);
                                                                updateHeroImage(file);
                                                            }}
                                                        />
                                                    </div>
                                                </FormItem>
                                            )}
                                        />
                                    </div>

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
                                        {mutation.isLoading ? 'Saving...' : 'Save Luxe Content'}
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

AdminLuxeCommunityCard.displayName = 'AdminLuxeCommunityCard';

export default AdminLuxeCommunityCard;
