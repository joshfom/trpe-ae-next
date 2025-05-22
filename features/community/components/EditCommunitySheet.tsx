"use client"

import React, { useState } from 'react';
import { 
    Sheet, 
    SheetContent, 
    SheetHeader, 
    SheetTitle, 
    SheetTrigger,
    SheetDescription 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Edit2, X } from 'lucide-react';
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from '@/components/ui/textarea';
import { TipTapEditor } from "@/components/TiptapEditor";
import { SingleImageDropzone } from "@/components/single-image-dropzone";
import { useEdgeStore } from "@/db/edgestore";
import { z } from "zod";
import { useUpdateCommunity } from "@/features/admin/community/api/use-update-community";
import { CommunityFormSchema } from '@/features/admin/community/form-schema/community-form-schema';

interface EditCommunitySheetProps {
    community: CommunityType;
}

type formValues = z.infer<typeof CommunityFormSchema>;

export const EditCommunitySheet = ({ community }: EditCommunitySheetProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [file, setFile] = useState<File | undefined>(undefined);
    const [hasDefaultImage, setHasDefaultImage] = useState(false);
    const { edgestore } = useEdgeStore();
    const mutation = useUpdateCommunity(community.id);

    const form = useForm({
        mode: "onChange",
        defaultValues: {
            name: community.name,
            image: community.image || '',
            about: community.about || '',
            metaTitle: community.metaTitle || '',
            metaDesc: community.metaDesc || '',
        }
    });

    React.useEffect(() => {
        if (community.image) {
            setHasDefaultImage(true);
        }
    }, [community.image]);

    const updateAvatar = async (file: File | undefined) => {
        if (file) {
            const res = await edgestore.publicFiles.upload({
                file,
                onProgressChange: (progress) => {
                    // you can use this to show a progress bar
                    console.log(progress);
                },
            });

            setFile(file);
            form.setValue('image', res.url);
        }
    };

    const onSubmit = (values: formValues) => {
        mutation.mutate(values, {
            onSuccess: () => {
                setIsOpen(false);
                form.reset();
            }
        });
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                    <Edit2 className="h-4 w-4" />
                    Edit Community
                </Button>
            </SheetTrigger>
            <SheetContent className="h-screen flex flex-col md:w-[80%] lg:w-[70%] overflow-y-auto" side="right">
                <SheetHeader className='px-4 py-3 border-b'>
                    <SheetTitle>Edit Community - {community.name}</SheetTitle>
                </SheetHeader>
                <SheetDescription className="flex-1 flex flex-col">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex pb-12 flex-col">
                            <div className="flex-1 overflow-y-auto space-y-6 p-6">
                                <div>
                                    <FormField
                                        name="name"
                                        control={form.control}
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <Input
                                                    {...field}
                                                    placeholder="Community Name"
                                                    className="input"
                                                />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div>
                                    <FormField
                                        name="metaTitle"
                                        control={form.control}
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Meta Title</FormLabel>
                                                <Input
                                                    {...field}
                                                    placeholder={`${form.watch('name')} - is default`}
                                                    className="input"
                                                />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div>
                                    <FormField
                                        name="metaDesc"
                                        control={form.control}
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Meta Description</FormLabel>
                                                <Textarea
                                                    {...field}
                                                    placeholder="Meta Description"
                                                    className="input"
                                                />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div>
                                    <FormField
                                        name="about"
                                        control={form.control}
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>About - {form.watch('name')}</FormLabel>
                                                <TipTapEditor
                                                    name="about"
                                                    control={form.control}
                                                />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div>
                                    <FormField
                                        name="image"
                                        control={form.control}
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Cover Image</FormLabel>
                                                {hasDefaultImage ? (
                                                    <div className="flex space-x-4 relative">
                                                        <div className="relative">
                                                            <img
                                                                className="rounded-xl h-40 w-60 object-cover"
                                                                src={form.watch('image')}
                                                                alt={form.watch('name')}
                                                            />
                                                            <Button
                                                                className="absolute -top-4 -right-4"
                                                                onClick={() => {
                                                                    setHasDefaultImage(false);
                                                                }}
                                                                variant="destructive"
                                                                size="icon"
                                                            >
                                                                <X className="w-6 h-6"/>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <SingleImageDropzone
                                                        width={200}
                                                        height={200}
                                                        value={file}
                                                        onChange={(file) => {
                                                            updateAvatar(file);
                                                        }}
                                                    />
                                                )}
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="flex border border-t justify-between pt-6 pb-10 px-6 items-center space-x-4">
                                <Button
                                    variant="destructive"
                                    onClick={() => setIsOpen(false)}
                                    type="button"
                                    className="btn btn-secondary"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={mutation.isPending}
                                    className="btn btn-primary"
                                >
                                    Save
                                </Button>
                            </div>
                        </form>
                    </Form>
                </SheetDescription>
            </SheetContent>
        </Sheet>
    );
};