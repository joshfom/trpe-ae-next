"use client";

import { useState } from 'react';
import EnhancedContactForm from '@/components/EnhancedContactForm';

export default function EnglishFormPage() {
    const [language, setLanguage] = useState<'en' | 'fa'>('en');

    return (
        <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 ${language === 'fa' ? 'rtl' : 'ltr'}`}>
            <div className="container mx-auto mt-32 max-w-4xl">
                <EnhancedContactForm
                    requestType="Landing Page English Form"
                    redirectUrl="/landing/thank-you?msg=success"
                    language={language}
                    onLanguageChange={setLanguage}
                />
            </div>
        </div>
    );
}
