"use client"
import React, {useEffect} from 'react';
import {useEdgeStore} from "@/db/edgestore";
import {useForm} from "react-hook-form";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {SingleImageDropzone} from "@/components/single-image-dropzone";
import {Button} from "@/components/ui/button";
import {z} from "zod";
import {useAddInsight} from "@/features/admin/insights/api/use-add-insight";
import {useUpdateInsight} from "@/features/admin/insights/api/use-update-insight";
import {insightFormSchema} from "@/app/crm/schema/insight-form-schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {Textarea} from "@/components/ui/textarea";
import {useRouter} from "next/navigation";
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {format} from 'date-fns';
import {CalendarIcon} from 'lucide-react';
import {cn} from '@/lib/utils';
import {Calendar} from '@/components/ui/calendar';

import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"
import {useGetAdminAuthors} from "@/features/admin/author/api/use-get-admin-authors";
import {TipTapEditor} from "@/components/TiptapEditor";
import type { InsightType } from '@/types/insights';


type formValues = z.infer<typeof insightFormSchema>

interface AddInsightFormProps {
    insight?: InsightType
}


function InsightForm({insight}: AddInsightFormProps) {
    const [file, setFile] = React.useState<File | undefined>(undefined);
    const {edgestore} = useEdgeStore();
    const router = useRouter()
    const [isEditing, setIsEditing] = React.useState(false)
    const mutation = useAddInsight()
    const updateMutation = useUpdateInsight(insight?.slug)
    const authorQuery = useGetAdminAuthors()
    const authors = authorQuery.data


    const [metaTitleCount, setMetaTitleCount] = React.useState(0)
    const [metaDescriptionCount, setMetaDescriptionCount] = React.useState(0)
    const [contentWordCount, setContentWordCount] = React.useState(0)

    const form = useForm({
        mode: "onChange",
        resolver: zodResolver(insightFormSchema),
        defaultValues: {
            title: insight?.title || '',
            content: insight?.content || '',
            altText: insight?.altText || '',
            metaTitle: insight?.metaTitle || '',
            metaDescription: insight?.metaDescription || '',
            publishedAt: insight?.publishedAt || '',
            authorId: insight?.authorId || '',
            coverUrl: insight?.coverUrl || ''
        }
    })

    useEffect(() => {
        if (insight) {
            setIsEditing(true)
        }
    }, [insight]);

    const updateCover = async (file: File | undefined) => {
        if (file) {
            const res = await edgestore.publicFiles.upload({
                file,
                onProgressChange: (progress) => {

                },
            });
            setFile(file);
            form.setValue('coverUrl', res.url);
        } else {
            // Handle remove case
            setFile(undefined);
            form.setValue('coverUrl', '');
        }
    }


    const onSubmit = (values: formValues) => {
        if (isEditing && insight?.slug) {
            updateMutation.mutate(values, {
                onSuccess: () => {
                    form.reset();
                    setFile(undefined);
                    router.refresh()
                }
            });
        } else {
            mutation.mutate(values, {
                onSuccess: () => {
                    form.reset();
                    setFile(undefined);
                    router.push('/admin/insights');
                }
            });
        }
    };

    // Update meta title count
    useEffect(() => {
        setMetaTitleCount(form.getValues('metaTitle').length)
    }, [form.getValues('metaTitle')])

    // Update meta description count
    useEffect(() => {
        setMetaDescriptionCount(form.getValues('metaDescription').length)
    }, [form.getValues('metaDescription')])

    // Update content word count
    useEffect(() => {
        setContentWordCount(form.getValues('content').split(' ').length)
    }, [form.getValues('content')])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={'p-6 space-y-6'}>
                <div className="">
                    <FormField
                        name={'title'}
                        control={form.control}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <Input
                                    {...field}
                                    placeholder={'Title'}
                                    className={'input'}/>
                            </FormItem>
                        )}
                    />

                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2  gap-6">
                    <FormField
                        name={'metaTitle'}
                        control={form.control}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>SEO Meta title</FormLabel>
                                <Input
                                    {...field}
                                    placeholder={''}
                                    className={'input'}/>
                                {
                                    metaTitleCount > 0 && (
                                        <p className={'text-sm text-neutral-500 dark:text-neutral-400'}>
                                            Meta Title characters count {' '}
                                            {metaTitleCount} / 60
                                        </p>
                                    )
                                }
                            </FormItem>
                        )}
                    />

                    <FormField
                        name={'altText'}
                        control={form.control}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Featured image alt text</FormLabel>
                                <Input
                                    {...field}
                                    placeholder={`${form.watch('title')} image`}
                                    className={'input'}/>
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="publishedAt"
                        render={({field}) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Published Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(new Date(field.value), "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto bg-white p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value ? new Date(field.value) : undefined}
                                            onSelect={(date) => field.onChange(date?.toISOString())}
                                            disabled={(date) =>
                                                date > new Date() || date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="authorId"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Author</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Author"/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {authors?.map((author) => (
                                            <SelectItem key={author.id} value={author.id}>
                                                {author.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                </div>

                <div>
                    <FormField
                        name={'metaDescription'}
                        control={form.control}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Content</FormLabel>
                                <Textarea
                                    {...field}
                                    placeholder={'Meta Description'}
                                    className={'input'}
                                />
                                {
                                    metaDescriptionCount > 0 && (
                                        <p className={'text-sm text-neutral-500 dark:text-neutral-400'}>Meta Description
                                            characters count {metaDescriptionCount} / 160</p>
                                    )
                                }
                                <FormMessage/>
                            </FormItem>
                        )}/>
                </div>
                <div>
                    <FormField
                        name={'content'}
                        control={form.control}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Content</FormLabel>
                                <TipTapEditor
                                    name="content"
                                    control={form.control}
                                />
                                <FormMessage/>
                            </FormItem>
                        )}/>
                </div>
                <div>
                    <FormField
                        name={'coverUrl'}
                        control={form.control}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Cover</FormLabel>
                                <SingleImageDropzone
                                    width={600}
                                    height={200}
                                    value={file}
                                    previewUrl={!file ? form.watch('coverUrl') : undefined}
                                    onChange={(file) => {
                                        updateCover(file)
                                    }}
                                />
                            </FormItem>
                        )}/>

                </div>
                <div className="flex justify-end pt-8 items-center space-x-4">
                    <Button
                        type={'submit'}
                        loading={mutation.isPending || updateMutation.isPending}
                        className={'btn btn-primary w-40'}>
                        {isEditing ? 'Update' : 'Publish'}
                    </Button>
                </div>
            </form>
        </Form>
    );
}

export default InsightForm;