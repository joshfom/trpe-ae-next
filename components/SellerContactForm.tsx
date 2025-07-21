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
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { User, Phone, Mail, MapPin, Home, MessageSquare } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const SellerFormSchema = z.object({
    fullName: z.string().min(2, { message: 'Full name is required' }),
    phone: z.string().min(4, { message: 'Enter a valid phone number' }),
    email: z.string().email({ message: 'Enter a valid email' }).optional().or(z.literal('')),
    currentCity: z.string().optional(),
    propertyType: z.string().optional(),
    message: z.string().optional(),
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

type FormValues = z.infer<typeof SellerFormSchema>

interface SellerContactFormProps {
    requestType?: string;
    redirectUrl?: string;
    language?: 'en' | 'fa';
    onLanguageChange?: (lang: 'en' | 'fa') => void;
}

const translations = {
    en: {
        title: "TRPE",
        subtitle: "Sell Your Property with Confidence - Get Your Free Consultation!",
        tagline: "Your property selling journey starts here.",
        description: "We value your privacy. Your information will only be used to connect you with the right property expert.",
        fields: {
            fullName: "Full Name",
            phone: "Mobile Number (with country code)",
            email: "Email",
            currentCity: "Current City of Residence",
            propertyType: "Property Type for Sale",
            message: "Message or Additional Info"
        },
        propertyTypes: {
            apartment: "Apartment",
            villa: "Villa",
            townhouse: "Townhouse",
            penthouse: "Penthouse",
            studio: "Studio",
            duplex: "Duplex",
            land: "Land/Plot",
            commercial: "Commercial Property",
            other: "Other"
        },
        submitButton: "GET FREE PROPERTY CONSULTATION",
        confidentiality: "Your information is strictly confidential with TRPE.",
        optional: "(optional)"
    },
    fa: {
        title: "TRPE",
        subtitle: "ملک خود را با اطمینان بفروشید - مشاوره رایگان دریافت کنید!",
        tagline: "سفر فروش ملک شما از اینجا شروع می‌شود.",
        description: "ما به حریم خصوصی شما احترام می‌گذاریم. اطلاعات شما فقط برای ارتباط با کارشناس ملک مناسب استفاده خواهد شد.",
        fields: {
            fullName: "نام کامل",
            phone: "شماره تلفن همراه (با کد کشور)",
            email: "ایمیل",
            currentCity: "شهر محل سکونت فعلی",
            propertyType: "نوع ملک برای فروش",
            message: "پیام یا اطلاعات اضافی"
        },
        propertyTypes: {
            apartment: "آپارتمان",
            villa: "ویلا",
            townhouse: "تاون‌هاوس",
            penthouse: "پنت‌هاوس",
            studio: "استودیو",
            duplex: "دوبلکس",
            land: "زمین/پلاک",
            commercial: "ملک تجاری",
            other: "سایر"
        },
        submitButton: "دریافت مشاوره رایگان ملک",
        confidentiality: "اطلاعات شما کاملاً محرمانه در TRPE نگهداری می‌شود.",
        optional: "(اختیاری)"
    }
};

function SellerContactForm({ 
    requestType = 'Seller Landing Page Contact Form', 
    redirectUrl,
    language = 'en',
    onLanguageChange
}: SellerContactFormProps) {
    const router = useRouter();
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const t = translations[language];
    const isRTL = language === 'fa';

    const form = useForm<FormValues>({
        mode: 'onBlur',
        resolver: zodResolver(SellerFormSchema),
        reValidateMode: 'onChange',
        defaultValues: {
            fullName: '',
            email: '',
            phone: '',
            currentCity: '',
            propertyType: '',
            message: ''
        }
    });

    const sendBitrix = async (data: FormValues) => {
        const comments = `
            Request Type: Property Sale Consultation
            Current City: ${data.currentCity || 'Not provided'}
            Property Type: ${data.propertyType || 'Not specified'}
            ${data.message ? `Message: ${data.message}` : ''}
        `.trim();

        const crmUrl = `https://crm.trpeglobal.com/rest/18/${process.env.NEXT_PUBLIC_BITRIX_KEY}/crm.lead.add.json?
            FIELDS[TITLE]=${encodeURIComponent(`TRPE Seller Lead - Property Sale Consultation`)}&
            &FIELDS[NAME]=${encodeURIComponent(data?.fullName)}
            &FIELDS[EMAIL][0][VALUE]=${encodeURIComponent(data.email || '')}
            &FIELDS[EMAIL][0][VALUE_TYPE]=WORK&FIELDS[PHONE][0][VALUE]=${encodeURIComponent(data.phone)}
            &FIELDS[PHONE][0][VALUE_TYPE]=WORK&FIELDS[COMMENTS]=${encodeURIComponent(comments)}
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
            throw error;
        }
    }

    const onSubmit = async (values: FormValues) => {
        setIsSubmitting(true);
        try {
            await sendBitrix(values);
            toast.success('Form submitted successfully');
            form.reset();
            setFormSubmitted(true);
            router.push(redirectUrl || '/landing/thank-you?msg=success');
        } catch (error) {
            console.error('Error sending data:', error);
            toast.error('An error occurred while submitting the form');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className={`w-full max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Language Switcher */}
            <div className={`flex mb-4 ${isRTL ? 'justify-start' : 'justify-end'}`}>
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => onLanguageChange?.('en')}
                        className={`px-3 py-1 rounded transition-all ${language === 'en' ? 'bg-white shadow' : 'hover:bg-gray-200'}`}
                    >
                        EN
                    </button>
                    <button
                        onClick={() => onLanguageChange?.('fa')}
                        className={`px-3 py-1 rounded transition-all ${language === 'fa' ? 'bg-white shadow' : 'hover:bg-gray-200'}`}
                    >
                        FA
                    </button>
                </div>
            </div>

            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">{t.title}</h1>
                <h2 className="text-xl text-gray-600 mb-4">{t.subtitle}</h2>
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-700">{t.tagline}</h3>
                    <p className="text-sm text-gray-500">{t.description}</p>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Full Name */}
                    <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    {t.fields.fullName}
                                </FormLabel>
                                <Input
                                    {...field}
                                    placeholder={t.fields.fullName}
                                    className="w-full"
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Phone */}
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Phone className="h-4 w-4" />
                                    {t.fields.phone}
                                </FormLabel>
                                <PhoneInput
                                    value={field.value}
                                    placeholder={t.fields.phone}
                                    className="w-full"
                                    onChange={(value) => {
                                        if (isPhoneValid(value)) {
                                            form.setValue('phone', value);
                                        } else {
                                            form.setValue('phone', value);
                                        }
                                    }}
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Email */}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    {t.fields.email} <span className="text-xs text-gray-400">{t.optional}</span>
                                </FormLabel>
                                <Input
                                    type="email"
                                    {...field}
                                    placeholder={t.fields.email}
                                    className="w-full"
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Current City */}
                    <FormField
                        control={form.control}
                        name="currentCity"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    {t.fields.currentCity} <span className="text-xs text-gray-400">{t.optional}</span>
                                </FormLabel>
                                <Input
                                    {...field}
                                    placeholder={t.fields.currentCity}
                                    className="w-full"
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Property Type */}
                    <FormField
                        control={form.control}
                        name="propertyType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Home className="h-4 w-4" />
                                    {t.fields.propertyType} <span className="text-xs text-gray-400">{t.optional}</span>
                                </FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder={`Select ${t.fields.propertyType.toLowerCase()}`} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(t.propertyTypes).map(([key, label]) => (
                                            <SelectItem key={key} value={key}>
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Message */}
                    <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4" />
                                    {t.fields.message} <span className="text-xs text-gray-400">{t.optional}</span>
                                </FormLabel>
                                <Textarea
                                    {...field}
                                    placeholder={t.fields.message}
                                    rows={4}
                                    className="w-full"
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Submit Button */}
                    <div className="text-center pt-4">
                        <Button
                            type="submit"
                            className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                            disabled={formSubmitted || isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : t.submitButton}
                        </Button>
                    </div>

                    {/* Confidentiality Notice */}
                    <div className="text-center pt-4">
                        <p className="text-xs text-gray-500">{t.confidentiality}</p>
                    </div>
                </form>
            </Form>
        </div>
    );
}

export default SellerContactForm;
