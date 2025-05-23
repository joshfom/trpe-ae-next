"use client"
import React, {useEffect, useState} from 'react';
import {useEdgeStore} from "@/db/edgestore";
import {useForm} from "react-hook-form";
import {Form, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {SingleImageDropzone} from "@/components/single-image-dropzone";
import {Button} from "@/components/ui/button";
import {z} from "zod";
import {useAddDeveloper} from "@/features/admin/developers/api/use-add-developer";
import {DeveloperFormSchema} from "@/features/admin/developers/schema/developer-form-schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {useUpdateDeveloper} from "@/features/admin/developers/api/use-update-developer";
import {useRouter} from "next/navigation";
import {TipTapEditor} from "@/components/TiptapEditor";

const formSchema = DeveloperFormSchema


interface AddDeveloperFormProps {
    developer?: DeveloperType
}

type formValues = z.infer<typeof formSchema>

function AddDeveloperForm({developer}: AddDeveloperFormProps) {

    const [file, setFile] = React.useState<File | undefined>(undefined);
    const { edgestore } = useEdgeStore();

    const [isEditing, setIsEditing] = React.useState(false)

    const mutation = useAddDeveloper()
    const editDeveloperMutation = useUpdateDeveloper(developer?.id)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const router = useRouter()

    const form = useForm({
        mode: "onChange",
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            about: '',
            logoUrl: '',
            short_name: '',
            order: 100
        }
    })


    useEffect(() => {
        if (developer) {
            form.setValue('name', developer.name)
            form.setValue('about', developer.about)
            form.setValue('logoUrl', developer.logoUrl)
            form.setValue('logoUrl', developer.logoUrl)
            form.setValue('order', developer.order)
            setIsEditing(true)
        }
    }, [developer]);


    const updateCover = async (file: File | undefined) => {
        if (file) {
            const res = await edgestore.publicFiles.upload({
                file,
                onProgressChange: (progress) => {
                },
            });

            setFile(file);
            form.setValue('logoUrl', res.url)
        }
    }

    const onSubmit = (values: formValues) => {
       setIsSubmitting(true)
       if (isEditing) {
           editDeveloperMutation.mutate(values, {
                onSuccess: () => {
                    router.push('/admin/developers')
                },
                onError: () => {
                    setIsSubmitting(false)
                }
           })
       } else {
           mutation.mutate(values, {
               onSuccess: () => {
                   form.reset()
                   setFile(undefined)
                   setIsSubmitting(false)
               },
               onError: () => {
                   setIsSubmitting(false)
               }
           })
       }
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={'p-6 space-y-6'}>
                <div className="grid gap-6">
                    <FormField
                        name={'name'}
                        control={form.control}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Developer Name</FormLabel>
                                <Input
                                    {...field}
                                    placeholder={'Emmar'}
                                    className={'input'}/>
                            </FormItem>
                        )}
                    />
                </div>
                <div>
                    <FormField
                        name={'about'}
                        control={form.control}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>About { form.watch('name')}</FormLabel>
                                <TipTapEditor
                                    name="about"
                                    control={form.control}
                                />
                                <FormMessage/>
                            </FormItem>
                        )}/>
                </div>
                <div>
                    <FormField
                        name={'logoUrl'}
                        control={form.control}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Logo</FormLabel>
                                <SingleImageDropzone
                                    width={600}
                                    height={200}
                                    value={file}
                                    onChange={(file) => {
                                        updateCover(file)
                                    }}
                                />
                            </FormItem>
                        )}/>

                </div>
                <div className="flex justify-between pt-8 items-center space-x-4">
                    <Button
                        type={'submit'}
                        loading={isSubmitting}
                        className={'btn btn-primary w-40'}>
                        Post
                    </Button>
                </div>
            </form>
        </Form>
    );
}

export default AddDeveloperForm;