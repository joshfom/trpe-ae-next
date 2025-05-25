"use client"
import React, { useState, memo, useCallback, useMemo } from 'react';
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {useForm} from "react-hook-form";
import {Form, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {SingleImageDropzone} from "@/components/single-image-dropzone";
import {useEdgeStore} from "@/db/edgestore";
import {z} from "zod";
import {useUpdateAgent} from "@/features/admin/agent/api/use-update-agent";
import {employeeCreateSchema} from "@/db/schema/employee-table";
import {TipTapEditor} from "@/components/TiptapEditor";

interface AdminAgentCardProps {
    agent: AgentType
}

const formSchema = employeeCreateSchema.omit({
    id: true,
    slug: true,
    createdAt: true,
})

type formValues = z.infer<typeof formSchema>

const AdminOffplanCard = memo<AdminAgentCardProps>(({agent}) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [file, setFile] = React.useState<File | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { edgestore } = useEdgeStore();

    const mutation = useUpdateAgent(agent.id)

    // Memoize form default values
    const defaultValues = useMemo(() => ({
        firstName: agent.firstName,
        lastName: agent.lastName,
        avatarUrl: agent.avatarUrl,
        email: agent.email,
        phone: agent.phone,
        agentId: agent.id,
        bio: agent.bio
    }), [agent.firstName, agent.lastName, agent.avatarUrl, agent.email, agent.phone, agent.id, agent.bio]);

    const form = useForm({
        mode: "onChange",
        defaultValues
    })

    // Memoize full name
    const fullName = useMemo(() => 
        agent.firstName + ' ' + agent.lastName, 
        [agent.firstName, agent.lastName]
    );

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
            // you can run some server action or api here
            // to add the necessary data to your database
            console.log( 'rest', res);
            form.setValue('avatarUrl', res.url)
        }
    }, [edgestore, form]);

    const onSubmit = useCallback((values: formValues) => {
        setIsSubmitting(true)
        mutation.mutate(values, {
            onSuccess: () => {
                setIsOpen(false)
                form.reset()
                setIsSubmitting(false)
            },
            onError: () => {
                setIsSubmitting(false)
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

    const handleImageChange = useCallback((file: File | undefined) => {
        updateAvtar(file);
    }, [updateAvtar]);

    return (
        <div className="bg-white rounded-2xl flex flex-col justify-between" key={agent.id}>
            <div className="flex flex-col">
                <div className={'relative h-96'}>
                    <img
                        className={'rounded-3xl h-96 object-cover w-full hover:zoom-in-50 ease-in-out transition-all duration-150'}
                        src={agent.avatarUrl}
                        alt={agent.firstName}/>
                </div>
                <div className="px-4 py-3">
                    <h2 className=" font-bold">{fullName}</h2>
                </div>
                <div className={'flex justify-between items-end px-4'}>
                    <div>
                        <p className="text-sm px-3">{agent.email}</p>
                        <p className="text-sm px-3">{agent.phone}</p>
                    </div>
                    <button onClick={handleEditClick} className={'text-sm py-1 px-3 border rounded-2xl'}>
                        Edit
                    </button>
                </div>
            </div>

            <Sheet open={isOpen} onOpenChange={handleSheetChange}>
                <SheetContent className={'bg-white max-w-2xl flex flex-col'}>
                    <SheetHeader className={'p-4 px-6'}>
                        <SheetTitle>
                            Edit - {agent.firstName + ' ' + agent.lastName}
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
                                                    onChange={handleImageChange}
                                                />

                                            </FormItem>
                                        )}/>

                                </div>

                                <div className="flex justify-between pt-8 items-center space-x-4">

                                    <Button
                                        variant={'destructive'}
                                        onClick={handleCancelClick}
                                        type={'button'}
                                        className={'btn btn-secondary'}>
                                        Cancel
                                    </Button>
                                    <Button
                                        type={'submit'}
                                        loading={isSubmitting}
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
})

AdminOffplanCard.displayName = 'AdminOffplanCard';

export default AdminOffplanCard;