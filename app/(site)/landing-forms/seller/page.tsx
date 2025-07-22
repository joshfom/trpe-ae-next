"use client";

import { useState } from 'react';
import SellerContactForm from '@/components/SellerContactForm';

export default function SellerFormPage() {
    const [language, setLanguage] = useState<'en' | 'fa'>('en');

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
            <div className="lg:container mx-auto mt-16 lg:mt-32 lg:max-w-4xl">
                <SellerContactForm
                    requestType="Seller Landing Page Form"
                    redirectUrl="/landing-forms/seller/thank-you?msg=success"
                    language={language}
                    onLanguageChange={setLanguage}
                />
            </div>
        </div>
    );
}
