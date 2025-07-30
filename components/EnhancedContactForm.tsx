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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { User, Phone, Mail, MapPin, DollarSign, MessageSquare } from 'lucide-react';
import { safeGTMPush } from '@/lib/gtm-form-filter';

export const EnhancedFormSchema = z.object({
    requestType: z.array(z.string()).min(1, { message: 'Please select at least one request type' }),
    firstName: z.string().min(2, { message: 'First name is required' }),
    lastName: z.string().min(2, { message: 'Last name is required' }),
    phone: z.string().min(4, { message: 'Enter a valid phone number' }),
    email: z.string().email({ message: 'Enter a valid email' }),
    currentCity: z.string().min(2, { message: 'Current city is required' }),
    budget: z.string().optional(),
    currency: z.string().default('AED'),
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

type FormValues = z.infer<typeof EnhancedFormSchema>

interface EnhancedContactFormProps {
    requestType?: string;
    redirectUrl?: string;
    language?: 'en' | 'fa';
    onLanguageChange?: (lang: 'en' | 'fa') => void;
}

const translations = {
    en: {
        title: "TRPE",
        subtitle: "Fill out the form now to receive you free consultation!",
        tagline: "Your real estate journey starts here.",
        description: "We value your privacy. Your information will only be used to connect you with the right consultant.",
        requestTypes: {
            label: "Type of Request:",
            buyProperty: "Buy Property",
            sellProperty: "Sell Property",
            residency: "Residency",
            consultation: "Consultation"
        },
        fields: {
            firstName: "First Name",
            lastName: "Last Name",
            phone: "Mobile (+Country Code)",
            email: "Email",
            currentCity: "Current City",
            budget: "Approximate Budget",
            message: "Message / Note:"
        },
        currencies: {
            euro: "Euro",
            usd: "USD",
            aed: "AED"
        },
        submitButton: "REQUEST FREE CONSULTATION",
        confidentiality: "Your information is strictly confidential with TRPE."
    },
    fa: {
        title: "TRPE",
        subtitle: "فرم را همین حالا پر کنید تا مشاوره رایگان دریافت کنید!",
        tagline: "اولین قدم برای یک انتخاب درست، اینجاست",
        description: "اطلاعات شما نزد ما محرمانه است و فقط برای ارتباط با مشاور استفاده می‌شود",
        requestTypes: {
            label: "نوع درخواست:",
            buyProperty: "خرید املاک",
            sellProperty: "فروش املاک",
            residency: "اقامت",
            consultation: "مشاوره"
        },
        fields: {
            firstName: "نام",
            lastName: "نام خانوادگی",
            phone: "تلفن همراه (+کد کشور)",
            email: "ایمیل",
            currentCity: "شهر فعلی",
            budget: "بودجه تقریبی",
            message: "پیام / یادداشت:"
        },
        currencies: {
            euro: "یورو",
            usd: "دلار",
            aed: "درهم"
        },
        submitButton: "درخواست مشاوره رایگان",
        confidentiality: "اطلاعات شما کاملاً محرمانه در TRPE نگهداری می‌شود."
    }
};

function EnhancedContactForm({ 
    requestType = 'Landing Page Contact Form', 
    redirectUrl,
    language = 'en',
    onLanguageChange
}: EnhancedContactFormProps) {
    const router = useRouter();
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const t = translations[language];
    const isRTL = language === 'fa';

    const form = useForm<FormValues>({
        mode: 'onBlur',
        resolver: zodResolver(EnhancedFormSchema),
        reValidateMode: 'onChange',
        defaultValues: {
            requestType: [],
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            currentCity: '',
            budget: '',
            currency: 'AED',
            message: ''
        }
    });

    const sendBitrix = async (data: FormValues) => {
        const requestTypeString = data.requestType.join(', ');
        const budgetInfo = data.budget ? `${data.budget} ${data.currency}` : '';
        const comments = `
            Request Type: ${requestTypeString}
            Current City: ${data.currentCity}
            ${budgetInfo ? `Budget: ${budgetInfo}` : ''}
            ${data.message ? `Message: ${data.message}` : ''}
        `.trim();

        const crmUrl = `https://crm.trpeglobal.com/rest/18/${process.env.NEXT_PUBLIC_BITRIX_KEY}/crm.lead.add.json?
            FIELDS[TITLE]=${encodeURIComponent(`TRPE Landing Form Lead - ${requestTypeString}`)}&
            &FIELDS[NAME]=${encodeURIComponent(data?.firstName)}
            &FIELDS[LAST_NAME]=${encodeURIComponent(data?.lastName)}
            &FIELDS[EMAIL][0][VALUE]=${encodeURIComponent(data.email)}
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
        
        console.log('🔥 EnhancedContactForm: About to submit with values:', values);
        
        // Track enhanced contact form submission with safeGTMPush - using MainSearch pattern
        const gtmData = {
            event: 'enhanced_contact_form',
            contact_type: 'enhanced_contact',
            contact_location: 'buyer_form',
            contact_destination: typeof window !== 'undefined' ? window.location.origin : '',
            contact_fields_count: Object.keys(values).filter(key => values[key as keyof FormValues]).length,
            user_data: {
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                phone: values.phone,
                city: values.currentCity,
                budget: values.budget,
                currency: values.currency,
                requestType: values.requestType,
                message: values.message
            },
            timestamp: new Date().toISOString()
        };
        
        console.log('🔥 EnhancedContactForm: About to push to GTM:', gtmData);
        safeGTMPush(gtmData);
        console.log('🔥 EnhancedContactForm: GTM push completed');
        
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
        <div className={`w-full max-w-2xl mx-auto bg-white p-3 sm:p-6 lg:p-8 rounded-lg shadow-lg ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
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
            <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-lg sm:text-xl text-gray-600 mb-3 sm:mb-4 px-2">{t.subtitle}</h2>
                <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-700 px-2">{t.tagline}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 px-2">{t.description}</p>
                </div>
            </div>

            <Form {...form}>
                <form 
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        (e.nativeEvent as Event).stopImmediatePropagation?.();
                        form.handleSubmit((data) => onSubmit(data))(e);
                    }}
                    {...(typeof window !== 'undefined' && { 'data-gtm-disabled': 'true' })}
                    suppressHydrationWarning={true}
                    className="space-y-4 sm:space-y-6"
                >
                    {/* Request Type */}
                    <FormField
                        control={form.control}
                        name="requestType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className={`text-sm sm:text-base font-medium text-gray-700 flex gap-2 w-full ${isRTL ? '' : 'justify-start'}`}>
                                    <span>{t.requestTypes.label}</span>
                                </FormLabel>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    {[
                                        { value: 'buy', label: t.requestTypes.buyProperty },
                                        { value: 'sell', label: t.requestTypes.sellProperty },
                                        { value: 'residency', label: t.requestTypes.residency },
                                        { value: 'consultation', label: t.requestTypes.consultation }
                                    ].map((type) => (
                                        <div key={type.value} className={`flex items-center ${isRTL ? 'flex-row-reverse space-x-reverse space-x-2' : 'space-x-2'}`}>
                                            <Checkbox
                                                id={type.value}
                                                checked={field.value?.includes(type.value) || false}
                                                onCheckedChange={(checked) => {
                                                    const updatedValue = checked
                                                        ? [...(field.value || []), type.value]
                                                        : (field.value || []).filter((value) => value !== type.value);
                                                    field.onChange(updatedValue);
                                                }}
                                                onFocus={(e) => {
                                                    e.stopPropagation();
                                                    (e.nativeEvent as Event).stopImmediatePropagation?.();
                                                }}
                                                suppressHydrationWarning={true}
                                            />
                                            <Label htmlFor={type.value} className={`text-xs sm:text-sm font-medium cursor-pointer ${isRTL ? 'text-right' : 'text-left'}`}>
                                                {type.label}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Name Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className={`text-xs sm:text-sm font-medium text-gray-700 flex gap-1 sm:gap-2 w-full ${isRTL ? '' : 'justify-start'}`}>
                                        <User className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 mt-0.5 sm:mt-0" />
                                        <span>{t.fields.firstName}</span>
                                    </FormLabel>
                                    <Input
                                        {...field}
                                        placeholder={t.fields.firstName}
                                        className={`w-full text-sm ${isRTL ? 'text-right' : 'text-left'}`}
                                        onFocus={(e) => {
                                            e.stopPropagation();
                                            (e.nativeEvent as Event).stopImmediatePropagation?.();
                                        }}
                                        suppressHydrationWarning={true}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className={`text-xs sm:text-sm font-medium text-gray-700 flex gap-1 sm:gap-2 w-full ${isRTL ? '' : 'justify-start'}`}>
                                        <User className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 mt-0.5 sm:mt-0" />
                                        <span>{t.fields.lastName}</span>
                                    </FormLabel>
                                    <Input
                                        {...field}
                                        placeholder={t.fields.lastName}
                                        className={`w-full text-sm ${isRTL ? 'text-right' : 'text-left'}`}
                                        onFocus={(e) => {
                                            e.stopPropagation();
                                            (e.nativeEvent as Event).stopImmediatePropagation?.();
                                        }}
                                        suppressHydrationWarning={true}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Phone */}
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className={`text-xs sm:text-sm font-medium text-gray-700 flex gap-1 sm:gap-2 w-full ${isRTL ? '' : 'justify-start'}`}>
                                    <Phone className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 mt-0.5 sm:mt-0" />
                                    <span>{t.fields.phone}</span>
                                </FormLabel>
                                <div className={isRTL ? 'rtl-phone-input' : ''}>
                                    <PhoneInput
                                        value={field.value}
                                        placeholder={t.fields.phone}
                                        className="w-full"
                                        defaultCountry="ae"
                                        countrySelectorStyleProps={{
                                            buttonStyle: {
                                                direction: isRTL ? 'rtl' : 'ltr'
                                            }
                                        }}
                                        inputStyle={{
                                            direction: isRTL ? 'rtl' : 'ltr',
                                            textAlign: isRTL ? 'right' : 'left'
                                        }}
                                        onChange={(value) => {
                                            if (isPhoneValid(value)) {
                                                form.setValue('phone', value);
                                            } else {
                                                form.setValue('phone', value);
                                            }
                                        }}
                                        inputProps={{
                                            onFocus: (e: any) => {
                                                e.stopPropagation();
                                                (e.nativeEvent as Event).stopImmediatePropagation?.();
                                            },
                                            suppressHydrationWarning: true
                                        }}
                                    />
                                </div>
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
                                <FormLabel className={`text-xs sm:text-sm font-medium text-gray-700 flex gap-1 sm:gap-2 w-full ${isRTL ? '' : 'justify-start'}`}>
                                    <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 mt-0.5 sm:mt-0" />
                                    <span>{t.fields.email}</span>
                                </FormLabel>
                                <Input
                                    type="email"
                                    {...field}
                                    placeholder={t.fields.email}
                                    className={`w-full text-sm ${isRTL ? 'text-right' : 'text-left'}`}
                                    onFocus={(e) => {
                                        e.stopPropagation();
                                        (e.nativeEvent as Event).stopImmediatePropagation?.();
                                    }}
                                    suppressHydrationWarning={true}
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Current City and Budget */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <FormField
                            control={form.control}
                            name="currentCity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className={`text-xs sm:text-sm font-medium text-gray-700 flex gap-1 sm:gap-2 w-full ${isRTL ? '' : 'justify-start'}`}>
                                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 mt-0.5 sm:mt-0" />
                                        <span>{t.fields.currentCity}</span>
                                    </FormLabel>
                                    <Input
                                        {...field}
                                        placeholder={t.fields.currentCity}
                                        className={`w-full text-sm ${isRTL ? 'text-right' : 'text-left'}`}
                                        onFocus={(e) => {
                                            e.stopPropagation();
                                            (e.nativeEvent as Event).stopImmediatePropagation?.();
                                        }}
                                        suppressHydrationWarning={true}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="budget"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className={`text-xs sm:text-sm font-medium text-gray-700 flex gap-1 sm:gap-2 w-full ${isRTL ? '' : 'justify-start'}`}>
                                        <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 mt-0.5 sm:mt-0" />
                                        <span>{t.fields.budget} <span className="text-xs text-gray-400">(optional)</span></span>
                                    </FormLabel>
                                    <Input
                                        {...field}
                                        placeholder={t.fields.budget}
                                        className={`w-full text-sm ${isRTL ? 'text-right' : 'text-left'}`}
                                        onFocus={(e) => {
                                            e.stopPropagation();
                                            (e.nativeEvent as Event).stopImmediatePropagation?.();
                                        }}
                                        suppressHydrationWarning={true}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Currency Selection */}
                    <FormField
                        control={form.control}
                        name="currency"
                        render={({ field }) => (
                            <FormItem className='flex'>
                                <RadioGroup
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    className={`flex flex-wrap gap-4 sm:gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}
                                    onFocus={(e) => {
                                        e.stopPropagation();
                                        (e.nativeEvent as Event).stopImmediatePropagation?.();
                                    }}
                                    suppressHydrationWarning={true}
                                >
                                    {[
                                        { value: 'EUR', label: t.currencies.euro },
                                        { value: 'USD', label: t.currencies.usd },
                                        { value: 'AED', label: t.currencies.aed }
                                    ].map((currency) => (
                                        <div key={currency.value} className={`flex items-center ${isRTL ? 'flex-row-reverse space-x-reverse space-x-2' : 'space-x-2'}`}>
                                            <RadioGroupItem 
                                                value={currency.value} 
                                                id={currency.value}
                                                onFocus={(e) => {
                                                    e.stopPropagation();
                                                    (e.nativeEvent as Event).stopImmediatePropagation?.();
                                                }}
                                                suppressHydrationWarning={true}
                                            />
                                            <Label htmlFor={currency.value} className={`text-xs sm:text-sm font-medium cursor-pointer ${isRTL ? 'text-right' : 'text-left'}`}>
                                                {currency.label}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
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
                                <FormLabel className={`text-xs sm:text-sm font-medium text-gray-700 flex gap-1 sm:gap-2 w-full ${isRTL ? '' : 'justify-start'}`}>
                                    <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 mt-0.5 sm:mt-0" />
                                    <span>{t.fields.message}</span>
                                </FormLabel>
                                <Textarea
                                    {...field}
                                    placeholder={t.fields.message}
                                    rows={4}
                                    className={`w-full text-sm resize-none ${isRTL ? 'text-right' : 'text-left'}`}
                                    onFocus={(e) => {
                                        e.stopPropagation();
                                        (e.nativeEvent as Event).stopImmediatePropagation?.();
                                    }}
                                    suppressHydrationWarning={true}
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Submit Button */}
                    <div className="text-center pt-3 sm:pt-4">
                        <Button
                            type="submit"
                            className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-gray-700 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors text-sm sm:text-base"
                            disabled={formSubmitted || isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : t.submitButton}
                        </Button>
                    </div>

                    {/* Confidentiality Notice */}
                    <div className="text-center pt-3 sm:pt-4">
                        <p className="text-xs text-gray-500 px-2">{t.confidentiality}</p>
                    </div>
                </form>
            </Form>
        </div>
    );
}

export default EnhancedContactForm;
