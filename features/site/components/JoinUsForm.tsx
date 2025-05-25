"use client"
import React, { useState, useCallback, memo } from 'react';
import { Input } from "@/components/ui/input";
import { PhoneInput } from "react-international-phone";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import 'react-international-phone/style.css';

const JoinUsForm = memo(() => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        linkedin: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Memoize input handlers
    const handleInputChange = useCallback((field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    }, []);

    const handlePhoneChange = useCallback((value: string) => {
        setFormData(prev => ({
            ...prev,
            phone: value
        }));
    }, []);

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // TODO: Implement form submission logic
        console.log('Form data:', formData);
        
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            // Reset form on success
            setFormData({
                fullName: '',
                email: '',
                phone: '',
                linkedin: '',
                message: ''
            });
        }, 1000);
    }, [formData]);

    return (
        <form onSubmit={handleSubmit} className="pt-12 space-y-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="col-span-1 lg:col-span-2">
                <Input 
                    type="text" 
                    placeholder="Full Name" 
                    className="w-full bg-black text-white border border-white"
                    value={formData.fullName}
                    onChange={handleInputChange('fullName')}
                    required
                />
            </div>

            <div className="col-span-1 ">
                <Input 
                    type="email" 
                    placeholder="example@email.com" 
                    className="w-full bg-black text-white border border-white"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    required
                />
            </div>

            <div className="col-span-1 ">
                <PhoneInput
                    placeholder="Enter phone number"
                    value={formData.phone}
                    name={'phone'}
                    defaultCountry={'ae'}
                    onChange={handlePhoneChange}
                />
            </div>

            <div className="col-span-1 lg:col-span-2">
                <Input 
                    type="url" 
                    placeholder="LinkedIn Url" 
                    className="w-full bg-black text-white border border-white"
                    value={formData.linkedin}
                    onChange={handleInputChange('linkedin')}
                />
            </div>

            <div className="col-span-1 lg:col-span-2 ">
                <Textarea 
                    rows={8} 
                    placeholder="Your message" 
                    className="w-full rounded-2xl text-white bg-black"
                    value={formData.message}
                    onChange={handleInputChange('message')}
                />
            </div>
            <div className="flex justify-end col-span-1 lg:col-span-2 ">
                <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-40 py-2 bg-transparent hover:bg-white hover:text-black border border-white"
                >
                    {isSubmitting ? 'Applying...' : 'Apply'}
                </Button>
            </div>
        </form>
    );
});

JoinUsForm.displayName = 'JoinUsForm';

export default JoinUsForm;