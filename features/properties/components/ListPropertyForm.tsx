"use client";
import React, { useState, useCallback, useMemo, memo } from 'react';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PhoneInput } from "react-international-phone";
import 'react-international-phone/style.css';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useSubmitPropertyListingForm } from "@/features/properties/api/use-submit-property-listing-form";
import { useRouter } from 'next/navigation';
import { trackContactFormSubmit } from "@/lib/gtm-events";

const FormSchema = z.object({
    firstName: z.string().min(2, { message: 'First name is required' }),
    lastName: z.string().min(2, { message: 'Last name is required' }),
    email: z.string().email().min(4, { message: 'Enter a valid email' }),
    phone: z.string().min(4, { message: 'Enter a valid phone number' }),
    offeringType: z.string().min(1, { message: 'Please select an offering type' }),
    propertyType: z.string().min(1, { message: 'Please select a property type' }),
    address: z.string().min(5, { message: 'Property address is required' }),
    message: z.string().optional(),
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

const ListPropertyForm = memo(() => {
    const [formSubmitted, setFormSubmitted] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const mutation = useSubmitPropertyListingForm()
    const router = useRouter()

    // Memoize form default values
    const defaultValues = useMemo(() => ({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        offeringType: '',
        propertyType: '',
        address: '',
        message: ''
    }), []);

    const form = useForm<FormValues>({
        resolver: zodResolver(FormSchema),
        defaultValues,
    })

    // Memoize onSubmit handler
    const onSubmit = useCallback((values: FormValues) => {
        setIsSubmitting(true)

        // Track property listing form submission with detailed data
        trackContactFormSubmit({
            form_id: 'property-listing-form',
            form_name: 'Property Listing Form',
            form_type: 'property_listing',
            form_destination: window.location.origin,
            form_length: Object.keys(values).filter(key => values[key as keyof FormValues]).length,
            user_data: {
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                phone: values.phone,
                offeringType: values.offeringType,
                propertyType: values.propertyType,
                address: values.address,
                message: values.message
            }
        });

        mutation.mutate(values, {
            onSuccess: (data: any) => {
                form.reset()
                setFormSubmitted(true)
                // Redirect to a thank you page or show success message
                setTimeout(() => {
                    setFormSubmitted(false)
                    setIsSubmitting(false)
                }, 3000)
            },
            onError: () => {
                setIsSubmitting(false)
            }
        })
    }, [mutation, form]);

    // Memoize phone change handler
    const handlePhoneChange = useCallback((value: string) => {
        isPhoneValid(value) ? form.setValue('phone', value) : form.setValue('phone', '')
    }, [form]);
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={'grid p-6 bg-white rounded-2xl gap-6'}>
                <h3 className={'text-xl'}>Share details</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <Label className={'ml-4'} htmlFor={"firstName"}>First Name</Label>
                        <FormField
                            name={'firstName'}
                            render={({field}) => (
                                <FormItem>
                                    <Input 
                                        {...field}
                                        placeholder="First Name" 
                                        className="w-full"
                                    />
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div>
                        <Label className={'ml-4'} htmlFor={"lastName"}>Last Name</Label>
                        <FormField
                            name={'lastName'}
                            render={({field}) => (
                                <FormItem>
                                    <Input 
                                        {...field}
                                        placeholder="Last Name" 
                                        className="w-full"
                                    />
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <Label className={'ml-4'} htmlFor={"phone"}>Phone</Label>
                        <FormField
                            name={'phone'}
                            render={({field}) => (
                                <FormItem>
                                    <PhoneInput
                                        value={field.value}
                                        defaultCountry='ae'
                                        placeholder="Enter phone number"
                                        className="w-full"
                                        onChange={handlePhoneChange}
                                    />
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div>
                        <Label className={'ml-4'} htmlFor={"email"}>Email</Label>
                        <FormField
                            name={'email'}
                            render={({field}) => (
                                <FormItem>
                                    <Input 
                                        {...field}
                                        type="email" 
                                        placeholder="example@email.com" 
                                        className="w-full"
                                    />
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <Label className={'ml-4'} htmlFor={"offeringType"}>Offering Type</Label>
                        <FormField
                            name={'offeringType'}
                            render={({field}) => (
                                <FormItem>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="w-full border rounded-3xl py-3">
                                            <SelectValue placeholder="Select offering type"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="for-sale">For Sale</SelectItem>
                                            <SelectItem value="for-rent">For Rent</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div>
                        <Label className={'ml-4'} htmlFor={"propertyType"}>Property Type</Label>
                        <FormField
                            name={'propertyType'}
                            render={({field}) => (
                                <FormItem>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="w-full border rounded-3xl py-3">
                                            <SelectValue placeholder="Select property type"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="apartment">Apartment</SelectItem>
                                            <SelectItem value="villa">Villa</SelectItem>
                                            <SelectItem value="townhouse">Townhouse</SelectItem>
                                            <SelectItem value="office">Office</SelectItem>
                                            <SelectItem value="retail">Retail</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div>
                    <Label className={'ml-4'} htmlFor={"address"}>Property Address</Label>
                    <FormField
                        name={'address'}
                        render={({field}) => (
                            <FormItem>
                                <Input 
                                    {...field}
                                    placeholder="Property Address"
                                    className="w-full"
                                />
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>

                <div>
                    <Label className={'ml-4'} htmlFor={"message"}>Message</Label>
                    <FormField
                        name={'message'}
                        render={({field}) => (
                            <FormItem>
                                <Textarea 
                                    {...field}
                                    rows={9} 
                                    placeholder="Share additional information about your property"
                                    className="w-full rounded-3xl"
                                />
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end">
                    <Button 
                        type="submit"
                        disabled={isSubmitting || formSubmitted}
                        className={'py-2 w-40'}
                    >
                        {isSubmitting ? 'Submitting...' : formSubmitted ? 'Submitted!' : 'Submit'}
                    </Button>
                </div>
            </form>
        </Form>
    );
});

ListPropertyForm.displayName = 'ListPropertyForm';

export default ListPropertyForm;