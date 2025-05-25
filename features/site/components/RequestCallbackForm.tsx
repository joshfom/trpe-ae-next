"use client"
import React, {useState, memo, useCallback, useMemo} from 'react';
import {PhoneNumberUtil} from 'google-libphonenumber';
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {PhoneInput} from "react-international-phone";
import 'react-international-phone/style.css';
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {useSubmitForm} from "@/features/site/api/use-submit-form";
import { useRouter } from 'next/navigation';
import {useCallbackRequest} from "@/features/site/api/use-submit-request-callback";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {toast} from "sonner";

const FormSchema = z.object({
    firstName: z.string().min(3, {message: 'Name is required'}),
    phone: z.string().min(4, {message: 'Enter a valid phone number'}),
    timeToCall: z.string()
});

const phoneUtil = PhoneNumberUtil.getInstance();

const isPhoneValid = (phone: string) => {
    try {
        return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
    } catch (error) {
        return false;
    }
};

type FormValues = z.infer<typeof FormSchema>

interface RequestCallBackProps {
    itemUrl : string
    itemType : string
    agentName : string
    handleFormSubmitted : () => void
}

function RequestCallBack({itemUrl, itemType, agentName, handleFormSubmitted} : RequestCallBackProps) {
    const mutation = useCallbackRequest()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formSubmitted, setFormSubmitted] = useState(false)

    const defaultValues = useMemo(() => ({
        firstName: '',
        phone: '',
        timeToCall: ''
    }), [])

    const form = useForm<FormValues>({
        mode: 'onBlur',
        resolver: zodResolver(FormSchema),
        reValidateMode: 'onChange',
        defaultValues
    })

    //send data to external CRM
    const sendBitrix = useCallback(async (data: FormValues) => {
        let message = `I am interested in ${itemType} ${itemUrl} and would like to know more. Please contact me at ${data.phone}`
        const crmUrl = `https://crm.trpeglobal.com/rest/18/l3lel0d42eptuymb/crm.lead.add.json?
            FIELDS[TITLE]=${encodeURIComponent(`New TRPE.AE Callback Request - ${agentName} - ${itemType}`)}
            &FIELDS[NAME]=${encodeURIComponent(data?.firstName!)}
            &FIELDS[EMAIL][0][VALUE_TYPE]=WORK&FIELDS[PHONE][0][VALUE]=${encodeURIComponent(data.phone)}
            &FIELDS[PHONE][0][VALUE_TYPE]=WORK&FIELDS[COMMENTS]=${encodeURIComponent(message!)}
            `;

        try {
            const crmResponse = await fetch(crmUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!crmResponse.ok) {
                throw new Error('Failed to create lead in CRM');
            } else {
                toast.success('We have received your Callback Request, one of our Experts will contact you shortly')
                handleFormSubmitted()
            }
        } catch (error) {

        }
    }, [itemType, itemUrl, agentName, handleFormSubmitted])

    const formErrors = form.formState.errors


    const onSubmit = useCallback((values: FormValues) => {
        setIsSubmitting(true)

        mutation.mutate(values, {
            onSuccess: (data) => {
                sendBitrix(values)
                form.reset()
                handleFormSubmitted()
                setFormSubmitted(true)
            },
            onError: () => {
                setIsSubmitting(false)
            }
        })
    }, [mutation, sendBitrix, form, handleFormSubmitted])

    return (

        <Form {...form}>

            <form
                onSubmit={
                    form.handleSubmit(onSubmit)
                }
                className="p-3 lg:p-6 flex  flex-col gap-8">
                <div className="">
                    <FormField
                        name={'firstName'}
                        render={({field, formState}) => (
                            <FormItem>
                                <Input
                                    {...field}
                                    placeholder="Your name"
                                    className="w-full "
                                />
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="">
                    <FormField
                        name={'timeToCall'}
                        render={({field, formState}) => (
                            <FormItem>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Best time to call" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="morning">Morning</SelectItem>
                                        <SelectItem value="afternoon">Afternoon</SelectItem>
                                        <SelectItem value="evening">Evening</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="w-full ">
                    <FormField
                        name={'phone'}
                        render={({field, formState}) => (
                            <FormItem>
                                <PhoneInput
                                    value={field.value}
                                    placeholder="Your phone"
                                    className="w-full bg-transparent text-white"
                                    onChange={useCallback((value) => {
                                        // @ts-ignore
                                        isPhoneValid(value) ? form.setValue('phone', value) : form.setValue('phone', '')
                                    }, [form])}
                                />
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end  py-4 ">
                    <Button
                        type={'submit'}
                        loading={isSubmitting}
                        disabled={isSubmitting || formSubmitted}
                        className="w-40 py-2 ">
                        Submit
                    </Button>
                </div>
            </form>
        </Form>
    );
}

const RequestCallBackMemo = memo(RequestCallBack);
RequestCallBackMemo.displayName = 'RequestCallBack';

export default RequestCallBackMemo;