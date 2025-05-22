"use client"
import React, { useState } from 'react';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "react-international-phone";
import 'react-international-phone/style.css';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const FormSchema = z.object({
    firstName: z.string().min(3, { message: 'Name is required' }),
    email: z.string().email({ message: 'Enter a valid email' }),
    phone: z.string().min(4, { message: 'Enter a valid phone number' }),
    message: z.string(),
});

const phoneUtil = PhoneNumberUtil.getInstance();

const isPhoneValid = (phone: string) => {
    try {
        return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
    } catch (e) {
        console.log(e);
        return false;
    }
};

type FormValues = z.infer<typeof FormSchema>

interface ContactFormProps {
    requestType?: string;
    redirectUrl?: string;
}

function ContactForm({ requestType = 'Footer Contact form', redirectUrl }: ContactFormProps) {
    const router = useRouter(); // Use useRouter for client-side navigation
    const [formSubmitted, setFormSubmitted] = useState(false);

    const form = useForm<FormValues>({
        mode: 'onBlur',
        resolver: zodResolver(FormSchema),
        reValidateMode: 'onChange',
        defaultValues: {
            firstName: '',
            email: '',
            phone: '',
            message: ''
        }
    });

    const sendBitrix = async (data: FormValues) => {
        const crmUrl = `https://crm.trpeglobal.com/rest/18/${process.env.NEXT_PUBLIC_BITRIX_KEY}/crm.lead.add.json?
            FIELDS[TITLE]=${encodeURIComponent(`Damac Islands Lead - ${requestType}`)}&
            &FIELDS[NAME]=${encodeURIComponent(data?.firstName)}
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
                toast.error('An error occurred while submitting the form');
                throw new Error('Failed to create lead in CRM');
            }

        } catch (error) {
            console.error('Error creating lead in CRM:', error);
        }
    }

    const onSubmit = async (values: FormValues) => {
        try {
            await sendBitrix(values);
            toast.success('Form submitted successfully');
            form.reset();
            setFormSubmitted(true);
            router.push(redirectUrl || '/landing/damac-island/thank-you?msg=success'); // Redirect after successful form submission
        } catch (error) {
            console.error('Error sending data:', error);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="pt-12 space-y-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="col-span-1 lg:col-span-2">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <Input
                                    {...field}
                                    placeholder="Your name"
                                    className="w-full bg-transparent text-white border border-white"
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="col-span-1">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <Input
                                    type="email"
                                    {...field}
                                    placeholder="Your email"
                                    className="w-full bg-transparent text-white border border-white"
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="col-span-1">
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <PhoneInput
                                    value={field.value}
                                    placeholder="Your phone"
                                    className="w-full bg-transparent text-white"
                                    onChange={(value) => {
                                        if (isPhoneValid(value)) {
                                            form.setValue('phone', value);
                                        } else {
                                            form.setValue('phone', '');
                                        }
                                    }}
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="col-span-1 lg:col-span-2">
                    <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                            <FormItem>
                                <Textarea
                                    {...field}
                                    placeholder="Your message"
                                    rows={8}
                                    className="w-full bg-transparent rounded-2xl text-white"
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end col-span-1 lg:col-span-2">
                    <Button
                        type="submit"
                        className="w-40 py-2 bg-transparent hover:bg-white hover:text-black border border-white"
                        disabled={formSubmitted}
                    >
                        Submit
                    </Button>
                </div>
            </form>
        </Form>
    );
}

export default ContactForm;