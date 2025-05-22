"use client"
import React from 'react';
import {useForm} from "react-hook-form";
import {Form, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {z} from "zod";
import {zodResolver} from '@hookform/resolvers/zod';
import {Textarea} from "@/components/ui/textarea";
import {useAddOffplanFaq} from "@/features/admin/off_plans/api/use-add-offplan-faq";


const FaqFormSchema = z.object({
    question: z.string().min(5, 'Question must be at least 5 characters'),
    answer: z.string().min(5, 'Answer must be at least 5 characters')
})

type formValues = z.infer<typeof FaqFormSchema>

interface AddOffplanFaqFormProps {
    offplanId: string;
    offplanAdded: () => void;
}

function AddOffplanFaqForm({offplanId, offplanAdded}: AddOffplanFaqFormProps) {


    const mutation = useAddOffplanFaq(offplanId)

    const form = useForm({
        mode: "onChange",
        resolver: zodResolver(FaqFormSchema),
        defaultValues: {
            question: '',
            answer: ''
        }
    })


    const onSubmit = (values: formValues) => {
        mutation.mutate(values, {
            onSuccess: () => {
                form.reset()
                offplanAdded()
            }
        })
    }


    return (
        <Form {...form}>

            <form onSubmit={
                form.handleSubmit(onSubmit)
            } className={'p-6 w-full bg-white rounded-xl space-y-6'}>
                <h3 className="text-xl font-semibold">
                    New FAQ
                </h3>

                <FormField
                    name={'question'}
                    control={form.control}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Question</FormLabel>
                            <Input
                                {...field}
                                placeholder={'Question'}
                                className={'input'}/>
                        </FormItem>
                    )}
                />

                <div className="">
                    <FormField
                        name={'answer'}
                        control={form.control}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Answer</FormLabel>
                                <Textarea
                                    {...field}
                                    rows={5}
                                    placeholder={'Answer to the question'}
                                    className={'input'}/>
                            </FormItem>
                        )}
                    />


                </div>
                <div className="flex justify-between items-center space-x-4">
                    <Button
                        type={'button'}
                        onClick={offplanAdded}
                        variant={'destructive'}
                        loading={mutation.isPending}
                        className={'btn btn-primary w-40'}>
                        Cancel
                    </Button>
                    <Button
                        type={'submit'}
                        loading={mutation.isPending}
                        className={'btn btn-primary w-40'}>
                        Save FAQ
                    </Button>
                </div>
            </form>
        </Form>
    );
}

export default AddOffplanFaqForm;