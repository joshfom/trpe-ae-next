"use client"
import React from 'react';
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {useForm} from "react-hook-form";
import {Form, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {z} from "zod";
import {OfferingTypeFormSchema} from '../form-schema/offering-type-form-schema';
import {Textarea} from '@/components/ui/textarea';
import {TipTapEditor} from "@/components/TiptapEditor";
import {useUpdateOfferingType} from "@/features/admin/offering/api/use-update-offering-type";
import {zodResolver} from "@hookform/resolvers/zod";

interface AdminOfferingTypeProps {
    offeringType: OfferingType
}

const formSchema = OfferingTypeFormSchema

type formValues = z.infer<typeof formSchema>

function AdminOfferingTypeCard({offeringType}: AdminOfferingTypeProps) {
    const [isOpen, setIsOpen] = React.useState(false);

    const mutation = useUpdateOfferingType(offeringType.id)
    const form = useForm({
        mode: "onChange",
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: offeringType.name,
            about: offeringType.about,
            metaDesc: offeringType.metaDesc,
            metaTitle: offeringType.metaTitle,
            pageTitle: offeringType.pageTitle,
        }
    })



    const onSubmit = (values: formValues) => {
        mutation.mutate(values, {
            onSuccess: () => {
                setIsOpen(false)
                form.reset()
            }
        })
    }


    return (
        <div className="bg-white rounded-xl border flex flex-col justify-between">
            <div className="flex flex-col">
                <div className={'relative h-20'}>

                </div>
                <div className="px-4 py-3">
                    <h2 className=" font-bold">{offeringType.name}</h2>
                </div>
                <div className={'flex justify-end items-end px-4 pb-4'}>
                    <button onClick={() => setIsOpen(true)} className={'text-sm py-1 px-3 border rounded-2xl'}>
                        Edit
                    </button>
                </div>
            </div>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetContent className={'bg-white max-w-7xl h-screen flex flex-col'}>
                    <SheetHeader className={'p-4 px-6'}>
                        <SheetTitle>
                            Edit - {offeringType.name}
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
                                                        placeholder={'Offering  label'}
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
                                            name={'pageTitle'}
                                            control={form.control}
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Page Title</FormLabel>
                                                    <Input
                                                        {...field}
                                                        placeholder={'Page Title'}
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
                                </div>

                                <div
                                    className="flex border border-t justify-between pt-6 pb-10 px-6 items-center space-x-4">

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
}

export default AdminOfferingTypeCard;