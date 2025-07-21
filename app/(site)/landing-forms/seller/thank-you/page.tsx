import { Suspense } from 'react';
import { ThankYouContent } from '@/components/ThankYouContent';

function ThankYouFallback() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg text-center">
                <div className="animate-pulse">
                    <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto mb-6"></div>
                    <div className="h-8 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2 w-3/4 mx-auto"></div>
                </div>
            </div>
        </div>
    );
}

export default function SellerThankYouPage() {
    return (
        <Suspense fallback={<ThankYouFallback />}>
            <ThankYouContent formType="seller" />
        </Suspense>
    );
}
