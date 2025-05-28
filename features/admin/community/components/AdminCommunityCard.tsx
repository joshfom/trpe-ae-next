"use client"
import React, {useEffect, memo, useCallback, useMemo} from 'react';
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {useForm} from "react-hook-form";
import {Form, FormField, FormItem, FormLabel, FormControl} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Switch} from "@/components/ui/switch";
import {SingleImageDropzone} from "@/components/single-image-dropzone";
import {useEdgeStore} from "@/db/edgestore";
import {z} from "zod";
import {useUpdateCommunity} from "@/features/admin/community/api/use-update-community";
import {CommunityFormSchema} from '../form-schema/community-form-schema';
import {Textarea} from '@/components/ui/textarea';
import {X} from "lucide-react";
import {TipTapEditor} from "@/components/TiptapEditor";

interface AdminCommunityCardProps {
    community: CommunityType
}

const formSchema = CommunityFormSchema

type formValues = z.infer<typeof formSchema>

const AdminCommunityCard = memo(({community}: AdminCommunityCardProps) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [file, setFile] = React.useState<File | undefined>(undefined);
    const [hasDefaultImage, setHasDefaultImage] = React.useState(false);
    const {edgestore} = useEdgeStore();

    const mutation = useUpdateCommunity(community.id)

    // Memoize form default values
    const defaultValues = useMemo(() => ({
        name: community.name,
        image: community.image || '',
        about: community.about || '',
        metaTitle: community.metaTitle || '',
        metaDesc: community.metaDesc || '',
        featured: community.featured || false,
        displayOrder: community.displayOrder || 0,
    }), [community.name, community.image, community.about, community.metaTitle, community.metaDesc, community.featured, community.displayOrder]);

    const form = useForm({
        mode: "onChange",
        defaultValues,
    });

    // Memoize callback functions
    const updateAvtar = useCallback(async (file: File | undefined) => {
        if (file) {
            const res = await edgestore.publicFiles.upload({
                file,
                onProgressChange: (progress) => {
                    // you can use this to show a progress bar
                    console.log(progress);
                },
            });

            setFile(file);
            form.setValue('image', res.url)
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

    const handleRemoveImage = useCallback(() => {
        setHasDefaultImage(false);
    }, []);

    useEffect(() => {
        if (community.image) {
            setHasDefaultImage(true)
        }
    }, [community.image])

    return (
        <div className="bg-white rounded-xl border flex flex-col justify-between">
            <div className="flex flex-col">
                <div className={'relative h-60'}>
                    <img
                        className={'rounded-xl h-60 object-cover w-full hover:zoom-in-50 ease-in-out transition-all duration-150'}
                        src={community.image}
                        alt={community.name}/>
                </div>
                <div className="px-4 py-3">
                    <h2 className=" font-bold">{community.name}</h2>
                </div>
                <div className={'flex justify-end items-end px-4 pb-4'}>
                    <button onClick={handleEditClick} className={'text-sm py-1 px-3 border rounded-2xl'}>
                        Edit
                    </button>
                </div>
            </div>

            <Sheet open={isOpen} onOpenChange={handleSheetChange}>
                <SheetContent className={'bg-white max-w-7xl h-screen flex flex-col'}>
                    <SheetHeader className={'p-4 px-6'}>
                        <SheetTitle>
                            Edit - {community.name}
                        </SheetTitle>
                    </SheetHeader>
                    <SheetDescription className={'h-full flex flex-col'}>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className={' h-full flex pb-12 flex-col'}>
                                <div className="flex-1 overflow-y-auto space-y-6  p-6">
                                    <div className="">
                                        <FormField
                                            name={'name'}
                                            control={form.control}
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Name</FormLabel>
                                                    <Input
                                                        {...field}
                                                        placeholder={'Community Name'}
                                                        className={'input'}/>
                                                </FormItem>
                                            )}/>

                                    </div>

                                    <div className="">
                                        <FormField
                                            name={'metaTitle'}
                                            control={form.control}
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Meta Title</FormLabel>
                                                    <Input
                                                        {...field}

                                                        placeholder={`${form.watch('name')} - is default`}
                                                        className={'input'}/>
                                                </FormItem>
                                            )}/>

                                    </div>


                                    <div className="">
                                        <FormField
                                            name={'metaDesc'}
                                            control={form.control}
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Meta Description</FormLabel>
                                                    <Textarea
                                                        {...field}
                                                        placeholder={'Meta Description'}
                                                        className={'input'}/>
                                                </FormItem>
                                            )}/>

                                    </div>

                                    <div className="">
                                        <FormField
                                            name={'featured'}
                                            control={form.control}
                                            render={({field}) => (
                                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                    <div className="space-y-0.5">
                                                        <FormLabel className="text-base">
                                                            Featured Community
                                                        </FormLabel>
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
                                            )}/>
                                    </div>

                                    <div className="">
                                        <FormField
                                            name={'displayOrder'}
                                            control={form.control}
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Display Order</FormLabel>
                                                    <Input
                                                        {...field}
                                                        type="number"
                                                        placeholder="0"
                                                        className={'input'}
                                                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                                    />
                                                    <div className="text-sm text-muted-foreground">
                                                        Lower numbers display first (0 = highest priority)
                                                    </div>
                                                </FormItem>
                                            )}/>
                                    </div>

                                    <div>
                                        <FormField
                                            name={'about'}
                                            control={form.control}
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>About - {form.watch('name')}</FormLabel>
                                                    <TipTapEditor
                                                        name="about"
                                                        control={form.control}
                                                    />
                                                </FormItem>
                                            )}/>
                                    </div>
                                    <div>
                                        <FormField
                                            name={'image'}
                                            control={form.control}
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Cover Image</FormLabel>

                                                    {
                                                        hasDefaultImage ? (
                                                            <div className={'flex space-x-4 relative'}>
                                                                <div className="relative">
                                                                    <img
                                                                        className={'rounded-xl h-40 w-60 object-cover'}
                                                                        src={form.watch('image')}
                                                                        alt={form.watch('name')}
                                                                    />
                                                                    <Button
                                                                        className={'absolute  -top-4 -right-4'}
                                                                        onClick={handleRemoveImage}
                                                                        variant={'destructive'}
                                                                        size={'icon'}
                                                                    >
                                                                        <X className={'w-6 h-6'}/>
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <SingleImageDropzone
                                                                width={200}
                                                                height={200}
                                                                value={file}
                                                                onChange={(file) => {
                                                                    updateAvtar(file)
                                                                }}
                                                            />
                                                        )
                                                    }

                                                </FormItem>
                                            )}/>

                                    </div>
                                </div>

                                <div
                                    className="flex border border-t justify-between pt-6 pb-10 px-6 items-center space-x-4">

                                    <Button
                                        variant={'destructive'}
                                        onClick={handleCancelClick}
                                        type={'button'}
                                        className={'btn btn-secondary'}>
                                        Cancel
                                    </Button>
                                    <Button
                                        type={'submit'}
                                        loading={mutation.isPending}
                                        className={'btn btn-primary'}>
                                        Save
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

AdminCommunityCard.displayName = 'AdminCommunityCard';

export default AdminCommunityCard;