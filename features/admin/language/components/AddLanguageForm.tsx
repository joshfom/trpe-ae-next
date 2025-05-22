"use client"
import React from 'react';
import {useEdgeStore} from "@/db/edgestore";
import {useForm} from "react-hook-form";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {Form, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {SingleImageDropzone} from "@/components/single-image-dropzone";
import {Button} from "@/components/ui/button";
import {z} from "zod";
import {languageInsertSchema} from "@/db/schema/language-table";
import {useAddLanguage} from "@/features/admin/language/api/use-add-language";

interface AddLanguageFormProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
}

const formSchema = languageInsertSchema.omit({
    id: true,
    createdAt: true,
})


type formValues = z.infer<typeof formSchema>

function AddLanguageForm({isOpen, setIsOpen}: AddLanguageFormProps) {
    const [file, setFile] = React.useState<File | undefined>(undefined);
    const { edgestore } = useEdgeStore();

    const mutation = useAddLanguage()

    const form = useForm({
        mode: "onChange",
        defaultValues: {
            name: '',
            slug: '',
            icon: '',
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
            form.setValue('icon', res.url)
        }
    }

    const onSubmit = (values: formValues) => {
        mutation.mutate(values, {
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
                        Add Language
                    </SheetTitle>
                </SheetHeader>
                <SheetDescription className={'flex-1 overflow-y-auto'}>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className={'p-6 space-y-6'}>
                            <div className="">
                                <FormField
                                    name={'name'}
                                    control={form.control}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Language</FormLabel>
                                            <Input
                                                {...field}
                                                placeholder={'English'}
                                                className={'input'}/>
                                        </FormItem>
                                    )}/>


                            </div>
                            <div className="">
                                <FormField
                                    name={'slug'}
                                    control={form.control}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Language Short code</FormLabel>
                                            <Input
                                                type={'text'}
                                                {...field}
                                                placeholder={'en'}
                                                className={''}
                                            />
                                        </FormItem>
                                    )}/>

                            </div>
                            <div>
                                <FormField
                                    name={'icon'}
                                    control={form.control}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Icon </FormLabel>
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

export default AddLanguageForm;