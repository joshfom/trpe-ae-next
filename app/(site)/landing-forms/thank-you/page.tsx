"use client";

import { useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ThankYouPage() {
    const searchParams = useSearchParams();
    const message = searchParams.get('msg');

    if (message !== 'success') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
                <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h1>
                    <p className="text-gray-600 mb-6">This page cannot be accessed directly.</p>
                    <Link href="/landing/enlgish-form">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                            Go to Form
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
                
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Thank You!</h1>
                
                <div className="space-y-4 mb-8">
                    <h2 className="text-xl text-gray-700">Your consultation request has been submitted successfully.</h2>
                    <p className="text-gray-600">
                        Our team will review your information and get back to you within 24 hours 
                        to schedule your free consultation.
                    </p>
                    <p className="text-sm text-gray-500">
                        Check your email for a confirmation message with next steps.
                    </p>
                </div>

                <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">What happens next?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="space-y-2">
                            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto font-bold">1</div>
                            <p className="font-medium">Review</p>
                            <p>We review your requirements</p>
                        </div>
                        <div className="space-y-2">
                            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto font-bold">2</div>
                            <p className="font-medium">Match</p>
                            <p>We match you with the right consultant</p>
                        </div>
                        <div className="space-y-2">
                            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto font-bold">3</div>
                            <p className="font-medium">Connect</p>
                            <p>Schedule your free consultation</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 space-y-4">
                    <p className="text-xs text-gray-500">
                        Your information is strictly confidential with TRPE.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/landing/enlgish-form">
                            <Button variant="outline" className="w-full sm:w-auto">
                                Submit Another Request
                            </Button>
                        </Link>
                        <Link href="/">
                            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
                                Visit Our Website
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
