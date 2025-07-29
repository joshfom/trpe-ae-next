"use client"
import React, {memo, useCallback, useMemo, useState} from 'react';
import {PhoneNumberUtil} from 'google-libphonenumber';
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {PhoneInput} from "react-international-phone";
import 'react-international-phone/style.css';
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {useSubmitForm} from "@/features/site/api/use-submit-form";
import {useRouter} from 'next/navigation';
import {trackContactFormSubmit} from "@/lib/gtm-events";

const FormSchema = z.object({
    subject: z.string().optional(),
    firstName: z.string().min(3, { message: 'Name is required' }),
    email: z.string().email().min(4, { message: 'Enter a valid email' }),
    phone: z.string().min(4, { message: 'Enter a valid phone number' }),
    message: z.string(),
});

// Memoize phone utility instance
const phoneUtil = PhoneNumberUtil.getInstance();

// Memoize phone validation function
const isPhoneValid = (phone: string) => {
    try {
        return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
    } catch (error) {
        return false;
    }
};

type FormValues = z.infer<typeof FormSchema>

const ContactForm = memo(() => {
    const [formSubmitted, setFormSubmitted] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const mutation = useSubmitForm()
    const router = useRouter()

    // Memoize form default values
    const defaultValues = useMemo(() => ({
        subject: '',
        firstName: '',
        email: '',
        phone: '',
        message: ''
    }), []);

    const form = useForm<FormValues>({
        resolver: zodResolver(FormSchema),
        defaultValues,
    })

    // Memoize sendBitrix function
    const sendBitrix = useCallback(async (data: FormValues) => {
        const crmUrl = `https://crm.trpeglobal.com/rest/18/l3lel0d42eptuymb/crm.lead.add.json?
            FIELDS[TITLE]=${encodeURIComponent('New TRPE.AE Lead')}
            &FIELDS[NAME]=${encodeURIComponent(data?.firstName!)}
            &FIELDS[EMAIL][0][VALUE]=${encodeURIComponent(data.email)}
            &FIELDS[EMAIL][0][VALUE_TYPE]=WORK&FIELDS[PHONE][0][VALUE]=${encodeURIComponent(data.phone)}
            &FIELDS[PHONE][0][VALUE_TYPE]=WORK&FIELDS[COMMENTS]=${encodeURIComponent(data.message!)}
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
                router.replace('/contact-us/thank-you')
            }
        } catch (error) {
            console.error('Error creating lead in CRM:', error);
        }
    }, [router]);

    // Memoize onSubmit handler
    const onSubmit = useCallback((values: FormValues) => {
        setIsSubmitting(true)

        // Track contact form submission with enhanced data
        trackContactFormSubmit({
            form_id: 'general-contact-form',
            form_name: 'General Contact Form',
            form_type: 'general_contact',
            form_destination: window.location.origin,
            form_length: Object.keys(values).filter(key => values[key as keyof FormValues]).length,
            user_data: {
                name: values.firstName,
                email: values.email,
                phone: values.phone,
                message: values.message,
                subject: values.subject
            }
        });

        mutation.mutate(values, {
            onSuccess: (data: any) => {
                sendBitrix(values)
                form.reset()
                setFormSubmitted(true)
            },
            onError: () => {
                setIsSubmitting(false)
            }
        })
    }, [mutation, sendBitrix, form]);

    // Memoize phone change handler
    const handlePhoneChange = useCallback((value: string) => {
        isPhoneValid(value) ? form.setValue('phone', value) : form.setValue('phone', '')
    }, [form]);

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="pt-12 space-y-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="col-span-1 lg:col-span-2">
                    <FormField
                        name={'firstName'}
                        render={({field}) => (
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

                <div className="col-span-1 ">
                    <FormField
                        name={'email'}
                        render={({field}) => (
                            <FormItem>
                                <Input
                                    type={'email'}
                                    {...field}
                                    placeholder="Your email"
                                    className="w-full bg-transparent "
                                />
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="col-span-1 hidden ">
                    <FormField
                        name={'subject'}
                        render={({field}) => (
                            <FormItem>
                                <Input
                                    type={'text'}
                                    {...field}
                                    placeholder="Subject"
                                    className="w-full bg-transparent "
                                />
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="col-span-1 ">
                    <FormField
                        name={'phone'}
                        render={({field}) => (
                            <FormItem>
                                <PhoneInput
                                    value={field.value}
                                    defaultCountry='ae'
                                    placeholder="Your phone"
                                    className="w-full bg-transparent text-white"
                                    onChange={handlePhoneChange}
                                />
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="col-span-1 lg:col-span-2 ">
                    <FormField
                        name={'message'}
                        render={({field}) => (
                            <FormItem>
                                <Textarea
                                    {...field}
                                    placeholder="Your message"
                                    rows={8}
                                    className="w-full bg-transparent rounded-2xl"
                                />
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex justify-end col-span-1 lg:col-span-2 ">
                    <Button
                        type={'submit'}
                        loading={isSubmitting}
                        disabled={isSubmitting || formSubmitted}
                        className="w-40 py-2">
                        Submit
                    </Button>
                </div>
            </form>
        </Form>
    );
});

ContactForm.displayName = 'ContactForm';

export default ContactForm;