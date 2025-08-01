'use client';

import React, { useState, useCallback } from 'react';
import { pushToDataLayer } from '@/lib/gtm';

export default function LuxeContactForm() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = useCallback((field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    }, []);

    const handleInputFocus = useCallback((field: string) => () => {
        pushToDataLayer({
            event: 'luxe_contact_form_field_focused',
            field_name: field,
            form_type: 'luxe_contact',
            page_location: '/luxe/contact-us',
            timestamp: new Date().toISOString()
        });
    }, []);

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Track form submission in GTM
        pushToDataLayer({
            event: 'luxe_contact_form_submitted',
            form_type: 'luxe_contact',
            page_location: '/luxe/contact-us',
            form_data: {
                full_name: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                subject: formData.subject,
                message_length: formData.message.length
            },
            timestamp: new Date().toISOString()
        });

        // TODO: Implement actual form submission

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            
            // Track successful submission
            pushToDataLayer({
                event: 'luxe_contact_form_success',
                form_type: 'luxe_contact',
                page_location: '/luxe/contact-us',
                timestamp: new Date().toISOString()
            });

            // Reset form
            setFormData({
                fullName: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });
        }, 1000);
    }, [formData]);

    return (
        <form onSubmit={handleSubmit} className='space-y-4 sm:space-y-6'>
            {/* First Row - Full Name and Email */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6'>
                <div>
                    <label htmlFor='fullName' className='block text-sm font-medium text-gray-700 mb-2'>
                        Full Name
                    </label>
                    <input
                        type='text'
                        id='fullName'
                        name='fullName'
                        placeholder='Enter your name'
                        value={formData.fullName}
                        onChange={handleInputChange('fullName')}
                        onFocus={handleInputFocus('fullName')}
                        className='w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm sm:text-base'
                        required
                    />
                </div>
                
                <div>
                    <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-2'>
                        Email
                    </label>
                    <input
                        type='email'
                        id='email'
                        name='email'
                        placeholder='Enter your email'
                        value={formData.email}
                        onChange={handleInputChange('email')}
                        onFocus={handleInputFocus('email')}
                        className='w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm sm:text-base'
                        required
                    />
                </div>
            </div>

            {/* Second Row - Phone and Subject */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6'>
                <div>
                    <label htmlFor='phone' className='block text-sm font-medium text-gray-700 mb-2'>
                        Phone
                    </label>
                    <input
                        type='tel'
                        id='phone'
                        name='phone'
                        placeholder='Enter your phone number'
                        value={formData.phone}
                        onChange={handleInputChange('phone')}
                        onFocus={handleInputFocus('phone')}
                        className='w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm sm:text-base'
                    />
                </div>
                
                <div>
                    <label htmlFor='subject' className='block text-sm font-medium text-gray-700 mb-2'>
                        Subject
                    </label>
                    <select
                        id='subject'
                        name='subject'
                        value={formData.subject}
                        onChange={handleInputChange('subject')}
                        onFocus={handleInputFocus('subject')}
                        className='w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm sm:text-base bg-white'
                        required
                    >
                        <option value=''>Select a subject</option>
                        <option value='luxury-property-inquiry'>Luxury Property Inquiry</option>
                        <option value='investment-consultation'>Investment Consultation</option>
                        <option value='property-valuation'>Property Valuation</option>
                        <option value='general-inquiry'>General Inquiry</option>
                        <option value='other'>Other</option>
                    </select>
                </div>
            </div>

            {/* Message */}
            <div>
                <label htmlFor='message' className='block text-sm font-medium text-gray-700 mb-2'>
                    Message
                </label>
                <textarea
                    id='message'
                    name='message'
                    rows={6}
                    placeholder='Tell us about your requirements or questions...'
                    value={formData.message}
                    onChange={handleInputChange('message')}
                    onFocus={handleInputFocus('message')}
                    className='w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm sm:text-base resize-vertical'
                    required
                ></textarea>
            </div>

            {/* Submit Button */}
            <div className='text-center sm:text-left'>
                <button
                    type='submit'
                    disabled={isSubmitting}
                    className='w-full sm:w-auto bg-black text-white px-6 sm:px-8 py-2 sm:py-3 rounded-md hover:bg-gray-800 focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all text-sm sm:text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed'
                >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
            </div>
        </form>
    );
}
