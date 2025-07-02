"use client"
import React from 'react';
import {useEdgeStore} from "@/db/edgestore";
import {useForm} from "react-hook-form";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {Form, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {SingleImageDropzone} from "@/components/single-image-dropzone";
import {Button} from "@/components/ui/button";
import {useAddAgent} from "@/features/admin/agent/api/use-add-agent";
import {z} from "zod";
import {employeeCreateSchema} from "@/db/schema/employee-table";
import {TipTapEditor} from "@/components/TiptapEditor";
import { RequestData } from "@/actions/admin/add-agent-action";

interface AddAgentCardProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
}

const formSchema = employeeCreateSchema.omit({
    id: true,
    slug: true,
    createdAt: true,
})


type formValues = z.infer<typeof formSchema>

function AddAgentForm({isOpen, setIsOpen}: AddAgentCardProps) {
    const [file, setFile] = React.useState<File | undefined>(undefined);
    const { edgestore } = useEdgeStore();

    const mutation = useAddAgent()

    const form = useForm({
        mode: "onChange",
        defaultValues: {
            firstName: '',
            lastName: '',
            avatarUrl: '',
            email: '',
            phone: '',
            bio: '',
            title: '',
            rera: '',
            isVisible: false,
            isLuxe: false,
            order: 100
        }
    })

    const updateAvtar = async (file: File | undefined) => {
        if (file) {
            const res = await edgestore.publicFiles.upload({
                file,
                onProgressChange: (progress) => {
                    // you can use this to show a progress bar
                    console.log(progress);
                },
            });

            setFile(file);
            // you can run some server action or api here
            // to add the necessary data to your database
            console.log( 'rest', res);
            form.setValue('avatarUrl', res.url)
        }
    }

    const onSubmit = (values: formValues) => {
        // Transform values to ensure required fields are set
        const transformedValues: RequestData = {
            firstName: values.firstName || undefined,
            lastName: values.lastName || undefined,
            email: values.email || undefined,
            phone: values.phone || undefined,
            title: values.title || undefined,
            bio: values.bio || undefined,
            rera: values.rera || undefined,
            avatarUrl: values.avatarUrl || undefined,
            isVisible: values.isVisible ?? false,
            isLuxe: values.isLuxe ?? false,
            order: values.order ?? 100,
        };
        
        mutation.mutate(transformedValues, {
            onSuccess: () => {
                setIsOpen(false)
                form.reset()
                setFile(undefined)
            }
        })
    }


    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent className={'bg-white max-w-2xl flex flex-col'}>
                <SheetHeader className={'p-4 px-6'}>
                    <SheetTitle>
                        Add Agent
                    </SheetTitle>
                </SheetHeader>
                <SheetDescription className={'flex-1 overflow-y-auto'}>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className={'p-6 space-y-6'}>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                                    )}/>

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
                                    )}/>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <FormField
                                    name={'email'}
                                    control={form.control}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <Input
                                                type={'email'}
                                                {...field}
                                                placeholder={'email@trpe.ae'}
                                                className={'input'}/>
                                        </FormItem>
                                    )}/>

                                <FormField
                                    name={'phone'}
                                    control={form.control}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Phone</FormLabel>
                                            <Input
                                                {...field}
                                                placeholder={'Phone'}
                                                className={'input'}/>
                                        </FormItem>
                                    )}/>
                            </div>
                            <div>
                                <FormField
                                    name={'bio'}
                                    control={form.control}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Bio</FormLabel>
                                            <TipTapEditor
                                                name="bio"
                                                control={form.control}
                                            />
                                        </FormItem>
                                    )}/>
                            </div>
                            <div>
                                <FormField
                                    name={'avatarUrl'}
                                    control={form.control}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Avatar</FormLabel>
                                            <SingleImageDropzone
                                                width={200}
                                                height={200}
                                                value={file}
                                                onChange={(file) => {
                                                    updateAvtar(file)
                                                }}
                                            />

                                        </FormItem>
                                    )}/>

                            </div>

                            <div className="flex justify-between pt-8 items-center space-x-4">

                                <Button
                                    variant={'destructive'}
                                    onClick={() => setIsOpen(false)}
                                    type={'button'}
                                    className={'btn btn-secondary'}>
                                    Cancel
                                </Button>
                                <Button
                                    type={'submit'}
                                    loading={mutation.isPending}
                                    className={'btn btn-primary w-40'}>
                                    Add
                                </Button>
                            </div>
                        </form>
                    </Form>
                </SheetDescription>
            </SheetContent>
        </Sheet>
    );
}

export default AddAgentForm;