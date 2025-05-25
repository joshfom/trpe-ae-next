"use client"
import React, {memo, useCallback, useMemo} from 'react';
import {useEdgeStore} from "@/db/edgestore";
import {useForm} from "react-hook-form";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {Form, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {SingleImageDropzone} from "@/components/single-image-dropzone";
import {Button} from "@/components/ui/button";
import {z} from "zod";
import {useAddAuthor} from "@/features/admin/author/api/use-add-author";
import {Textarea} from "@/components/ui/textarea";
import {authorFormSchema} from "@/features/admin/author/schema/author-form-schema";
import {zodResolver} from "@hookform/resolvers/zod";

interface AuthorFormProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
}

type FormValues = z.infer<typeof authorFormSchema>;

function AuthorForm({isOpen, setIsOpen}: AuthorFormProps) {
    const [file, setFile] = React.useState<File | undefined>(undefined);
    const {edgestore} = useEdgeStore();

    const mutation = useAddAuthor();

    const defaultValues = useMemo(() => ({
        name: '',
        about: '',
        avatar: ''
    }), []);

    const form = useForm<FormValues>({
        mode: "onChange",
        reValidateMode: "onChange",
        resolver: zodResolver(authorFormSchema),
        defaultValues
    });

    const updateAvatar = useCallback(async (file: File | undefined) => {
        if (file) {
            const res = await edgestore.publicFiles.upload({
                file,
                onProgressChange: (progress) => {
                    // you can use this to show a progress bar
                    console.log(progress);
                },
            });

            setFile(file);
            form.setValue('avatar', res.url);
        }
    }, [edgestore, form]);

    const onSubmit = useCallback((values: FormValues) => {
        mutation.mutate(values, {
            onSuccess: () => {
                setIsOpen(false);
                form.reset();
                setFile(undefined);
            }
        });
    }, [mutation, setIsOpen, form]);

    const handleCancelClick = useCallback(() => {
        setIsOpen(false);
    }, [setIsOpen]);

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent className={'bg-white max-w-2xl flex flex-col'}>
                <SheetHeader className={'p-4 px-6'}>
                    <SheetTitle>
                        Add Author
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
                                            <FormLabel>Name</FormLabel>
                                            <Input
                                                {...field}
                                                placeholder={'John Doe'}
                                                className={'input'}/>
                                        </FormItem>
                                    )}/>
                            </div>
                            <div className="">
                                <FormField
                                    name={'about'}
                                    control={form.control}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>About {form.watch('name')}</FormLabel>
                                            <Textarea
                                                {...field}
                                                rows={5}
                                                placeholder={'About'}
                                                className={'input'}/>
                                        </FormItem>
                                    )}/>
                            </div>
                            <div>
                                <FormField
                                    name={'avatar'}
                                    control={form.control}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Avatar</FormLabel>
                                            <SingleImageDropzone
                                                width={200}
                                                height={200}
                                                value={file}
                                                onChange={(file) => {
                                                    updateAvatar(file);
                                                }}
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

const AuthorFormMemo = memo(AuthorForm);
AuthorFormMemo.displayName = 'AuthorForm';

export default AuthorFormMemo;