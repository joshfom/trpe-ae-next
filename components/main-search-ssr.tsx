import React from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

/**
 * SSR-compatible search component
 * Renders static HTML that works without JavaScript
 * Gets enhanced with dynamic functionality when JS loads
 */
export default function MainSearchSSR() {
    return (
        <div className="w-full lg:w-[70%] max-w-4xl mx-auto">
            <div className="relative">
                {/* Desktop Search */}
                <div className="hidden lg:flex gap-6 bg-white rounded-full shadow-lg p-3 pl-8 items-center">
                    <div className="flex-1 relative">
                        <form id="desktop-search-form" action="/properties/for-sale" method="GET" className="w-full">
                            <input
                                type="text"
                                name="search"
                                placeholder="Search properties by location, property type, or developer..."
                                className="w-full h-12 bg-transparent text-gray-900 placeholder-gray-500 border-none outline-none text-lg"
                            />
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                                <Search size={24} />
                            </div>
                        </form>
                    </div>
                    <button 
                        type="submit"
                        form="desktop-search-form"
                        className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-full font-semibold transition-colors min-h-[48px] flex items-center"
                    >
                        Search
                    </button>
                </div>
                
                {/* Mobile Search */}
                <div className="lg:hidden">
                    <div className="relative w-full">
                        <form action="/properties/for-sale" method="GET">
                            <input
                                type="text"
                                name="search"
                                placeholder="Search properties..."
                                className="w-full h-12 bg-white text-gray-900 placeholder-gray-500 rounded-full px-6 pr-12 shadow-lg border-none outline-none"
                            />
                            <button 
                                type="submit"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <Search size={20} />
                            </button>
                        </form>
                    </div>
                </div>
                
                {/* Popular Searches - Static for SSR */}
                <div className="mt-4 text-center">
                    <p className="text-white text-sm mb-2 opacity-90">Popular searches:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                        <Link href="/properties/for-sale" className="bg-white/20 hover:bg-white/30 text-white text-xs px-3 py-1 rounded-full transition-colors">
                            For Sale
                        </Link>
                        <Link href="/properties/for-rent" className="bg-white/20 hover:bg-white/30 text-white text-xs px-3 py-1 rounded-full transition-colors">
                            For Rent
                        </Link>
                        <Link href="/property-types/apartments" className="bg-white/20 hover:bg-white/30 text-white text-xs px-3 py-1 rounded-full transition-colors">
                            Apartments
                        </Link>
                        <Link href="/property-types/villas" className="bg-white/20 hover:bg-white/30 text-white text-xs px-3 py-1 rounded-full transition-colors">
                            Villas
                        </Link>
                    </div>
                </div>
                
                {/* JavaScript Enhancement Notice */}
                <noscript>
                    <div className="mt-4 text-center">
                        <p className="text-white/70 text-sm">
                            Enhanced search features require JavaScript. Use the links above to browse properties.
                        </p>
                    </div>
                </noscript>
            </div>
        </div>
    );
}
