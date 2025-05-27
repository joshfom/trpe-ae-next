import React from 'react';

/**
 * Optimized loading skeletons for SSR components
 * These provide better perceived performance during server rendering
 */

export function SearchSkeleton() {
    return (
        <div className="w-full max-w-4xl mx-auto animate-pulse">
            <div className="flex flex-col sm:flex-row gap-2 bg-white/20 rounded-lg p-2">
                <div className="flex-1 relative">
                    <div className="h-12 bg-white/30 rounded-md"></div>
                </div>
                <div className="w-full sm:w-auto">
                    <div className="h-12 w-32 bg-slate-700 rounded-md"></div>
                </div>
            </div>
            <div className="mt-4 text-center">
                <div className="h-4 bg-white/20 rounded mb-2 w-32 mx-auto"></div>
                <div className="flex flex-wrap justify-center gap-2">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-6 w-20 bg-white/20 rounded-full"></div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function FeaturedListingsSkeleton() {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-12 animate-pulse">
            {/* Title skeleton */}
            <div className="h-10 bg-gray-200 rounded mb-8 w-64"></div>
            
            {/* Tabs skeleton */}
            <div className="flex gap-4 mb-6 border-b border-gray-200 pb-2">
                <div className="h-8 bg-gray-200 rounded w-24"></div>
                <div className="h-8 bg-gray-200 rounded w-24"></div>
            </div>
            
            {/* Property grid skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
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
            <div className="mt-8 flex justify-center">
                <div className="h-10 bg-gray-200 rounded-full w-48"></div>
            </div>
        </div>
    );
}

export function NavigationSkeleton() {
    return (
        <div className="h-16 bg-black animate-pulse">
            <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
                <div className="w-10 h-10 bg-gray-700 rounded"></div>
                <div className="hidden lg:flex space-x-8">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-4 w-16 bg-gray-700 rounded"></div>
                    ))}
                </div>
                <div className="w-24 h-8 bg-gray-700 rounded"></div>
            </div>
        </div>
    );
}

export function FooterSkeleton() {
    return (
        <div className="bg-gray-100 animate-pulse">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="space-y-4">
                            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                            {[...Array(5)].map((_, j) => (
                                <div key={j} className="h-4 bg-gray-200 rounded w-full"></div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
