"use client"
import React, {useState} from 'react';
import {PhoneNumberUtil} from 'google-libphonenumber';
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {PhoneInput} from "react-international-phone";
import 'react-international-phone/style.css';
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {useSubmitForm} from "@/features/site/api/use-submit-form";

const FormSchema = z.object({
    firstName: z.string().min(3, {message: 'Name is required'}),
    requestType: z.string().optional(),
    email: z.string().email().min(4, {message: 'Enter a valid email'}),
    phone: z.string().min(4, {message: 'Enter a valid phone number'}),
    message: z.string().optional(),
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

interface OffplanContactFormProps {
    requestType?: string,
    projectName? : string,
    submissionComplete: () => void
}

function OffplanContactForm({requestType = 'Floor plans', projectName, submissionComplete}: OffplanContactFormProps) {
    const [formSubmitted, setFormSubmitted] = useState(false)
    const mutation = useSubmitForm()

    const form = useForm<FormValues>({
        mode: 'onBlur',
        resolver: zodResolver(FormSchema),
        reValidateMode: 'onChange',
        defaultValues: {
            firstName: '',
            requestType: requestType,
            email: '',
            phone: '',
            message: '',
        } as FormValues
    })

    //send data to external CRM
    const sendBitrix = async (data: FormValues) => {
        const crmUrl = `https://crm.trpeglobal.com/rest/18/l3lel0d42eptuymb/crm.lead.add.json?
            FIELDS[TITLE]=${encodeURIComponent(`New TRPE.AE Offplan lead - ${projectName}`)}
            &FIELDS[NAME]=${encodeURIComponent(data?.firstName!)}
            &FIELDS[EMAIL][0][VALUE]=${encodeURIComponent(data.email)}
            &FIELDS[EMAIL][0][VALUE_TYPE]=WORK&FIELDS[PHONE][0][VALUE]=${encodeURIComponent(data.phone)}
            &FIELDS[PHONE][0][VALUE_TYPE]=WORK&FIELDS[COMMENTS]=${encodeURIComponent(data.requestType!)}
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
            }
        } catch (error) {
            console.error('Error creating lead in CRM:', error);
            // return c.json({ error: 'Failed to create lead in CRM' }, 500);
        }
    }

    const onSubmit = (values: FormValues) => {

        mutation.mutate(values, {
            onSuccess: (data) => {
                sendBitrix(values)
                form.reset()
                submissionComplete()
                setFormSubmitted(true)
            }
        })
    }

    return (
        <Form {...form}>

            <form
                onSubmit={
                // @ts-ignore
                form.handleSubmit(onSubmit)
            }
                className="flex flex-col pt-12 gap-8">
                <div className="col-span-1 lg:col-span-2">
                    <FormField
                        name={'name'}
                        render={({field, formState}) => (
                            <FormItem>
                                <Input
                                    {...field}
                                    placeholder="Your name"
                                    className="w-full bg-transparent text-white border border-white"
                                />
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="col-span-1 ">
                    <FormField
                        name={'email'}
                        render={({field, formState}) => (
                            <FormItem>
                                <Input
                                    type={'email'}
                                    {...field}
                                    placeholder="Your email"
                                    className="w-full bg-transparent text-white border border-white"
                                />
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="col-span-1 ">
                    <FormField
                        name={'phone'}
                        render={({field, formState}) => (
                            <FormItem>
                                <PhoneInput
                                    value={field.value}
                                    placeholder="Your phone"
                                    className="w-full bg-transparent text-white"
                                    onChange={(value) => {
                                        // @ts-ignore
                                        isPhoneValid(value) ? form.setValue('phone', value) : form.setValue('phone', '')
                                    }}
                                />
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end col-span-1 lg:col-span-2 ">
                    <Button
                        type={'submit'}
                        loading={mutation.isPending}
                        disabled={mutation.isPending || formSubmitted}
                        className="px-8 py-2 bg-transparent hover:bg-white hover:text-black border border-white">
                        Download {requestType}
                    </Button>
                </div>
            </form>
        </Form>
    );
}

export default OffplanContactForm;