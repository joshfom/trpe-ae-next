"use client"
import React, {useState} from 'react';
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
import { useRouter } from 'next/navigation';

const FormSchema = z.object({
    subject: z.string().optional(),
    firstName: z.string().min(3, {message: 'Name is required'}),
    email: z.string().email().min(4, {message: 'Enter a valid email'}),
    phone: z.string().min(4, {message: 'Enter a valid phone number'}),
    message: z.string(),
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

function ContactForm() {
    const [formSubmitted, setFormSubmitted] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const mutation = useSubmitForm()

    const route = useRouter()

const form = useForm<FormValues>({
    mode: 'onBlur',
    resolver: zodResolver(FormSchema),
    reValidateMode: 'onChange',
    defaultValues: {
        subject: '',
        firstName: '',
        email: '',
        phone: '',
        message: ''
    }
})

    //send data to external CRM
    const sendBitrix = async (data: FormValues) => {
        console.log('data', data)
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
                route.replace('/contact-us/thank-you')
            }
        } catch (error) {
            console.error('Error creating lead in CRM:', error);
            // return c.json({ error: 'Failed to create lead in CRM' }, 500);
        }
    }

    const formErrors = form.formState.errors

    const onSubmit = (values: FormValues) => {
        setIsSubmitting(true)

        mutation.mutate(values, {
            onSuccess: (data) => {
                sendBitrix(values)
                form.reset()
                setFormSubmitted(true)
            },
            onError: () => {
                setIsSubmitting(false)
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
                className="pt-12 space-y-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="col-span-1 lg:col-span-2">
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

                <div className="col-span-1 ">
                    <FormField
                        name={'email'}
                        render={({field, formState}) => (
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
                        render={({field, formState}) => (
                            <FormItem>
                                <Input
                                    type={'text'}
                                    {...field}
                                    placeholder="Your email"
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
                        render={({field, formState}) => (
                            <FormItem>
                                <PhoneInput
                                    value={field.value}
                                    defaultCountry='ae'
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

                <div className="col-span-1 lg:col-span-2 ">
                    <FormField
                        name={'message'}
                        render={({field, formState}) => (
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
}

export default ContactForm;