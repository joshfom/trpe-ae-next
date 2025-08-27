import React from 'react';

/**
 * Optimized loading skeletons for SSR components
 * These provide better perceived performance during server rendering
 */

export function SearchSkeleton() {
    return (
        <div className="w-full lg:w-[70%] max-w-4xl mx-auto animate-pulse">
            <div className="relative">
                {/* Desktop skeleton */}
                <div className="hidden lg:flex gap-6 bg-white rounded-full shadow-lg p-3 pl-8 items-center">
                    <div className="flex-1 h-12 bg-gray-200 rounded"></div>
                    <div className="w-40 h-12 bg-gray-900 rounded"></div>
                </div>
                
                {/* Mobile skeleton */}
                <div className="lg:hidden">
                    <div className="relative w-full">
                        <div className="w-full h-12 bg-white rounded-full"></div>
                    </div>
                </div>
                
                {/* Popular searches skeleton */}
                <div className="mt-4 text-center">
                    <div className="h-4 bg-white/20 rounded mb-2 w-32 mx-auto"></div>
                    <div className="flex flex-wrap justify-center gap-2">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-6 w-20 bg-white/20 rounded-full"></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function FeaturedListingsSkeleton() {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-8 border-b border-gray-500 sm:px-6 lg:px-8 sm:py-12 lg:py-16 animate-pulse">
            {/* Title skeleton */}
            <div className="space-y-3 py-6 sm:space-y-4 sm:py-8 lg:py-12">
                <div className="h-10 bg-gray-200 rounded mb-8 w-64"></div>
            </div>
            
            {/* Tabs skeleton */}
            <div className="flex gap-4 mb-6 border-b border-gray-500 pb-2">
                <div className="h-8 bg-gray-200 rounded w-24"></div>
                <div className="h-8 bg-gray-200 rounded w-24"></div>
            </div>
            
            {/* Property grid skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-gray-100 rounded-lg overflow-hidden">
                        <div className="h-48 bg-gray-200"></div>
                        <div className="p-4 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Button skeleton */}
            <div className="py-4 sm:py-6 flex items-center mt-6 sm:mt-8 justify-center">
                <div className="h-12 w-48 bg-gray-900 rounded-full"></div>
            </div>
        </div>
    );
}