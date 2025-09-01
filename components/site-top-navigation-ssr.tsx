import React from 'react';
import Image from 'next/image';
import Link from "next/link";
import {Phone} from 'lucide-react';
import TopNavigationSSR from "@/components/top-navigation-ssr";
import NavigationEnhancer from "@/components/navigation-enhancer";

function SiteTopNavigationSSR() {
    // Static navigation structure for SSR mobile fallback
    const mobileNavSections = [
        {
            title: 'For Sale',
            items: [
                { href: '/properties/for-sale', label: 'All Properties for Sale' },
                { href: '/property-types/apartments/for-sale', label: 'Apartments for Sale' },
                { href: '/property-types/villas/for-sale', label: 'Villas for Sale' },
                { href: '/property-types/townhouses/for-sale', label: 'Townhouses for Sale' },
            ]
        },
        {
            title: 'For Rent',
            items: [
                { href: '/properties/for-rent', label: 'All Properties for Rent' },
                { href: '/property-types/apartments/for-rent', label: 'Apartments for Rent' },
                { href: '/property-types/villas/for-rent', label: 'Villas for Rent' },
                { href: '/property-types/townhouses/for-rent', label: 'Townhouses for Rent' },
            ]
        },
        {
            title: 'Other',
            items: [
                { href: '/off-plan', label: 'Off-Plan Properties' },
                { href: '/communities', label: 'Communities' },
                { href: '/insights', label: 'Insights' },
                { href: '/luxe', label: 'Luxe Collection' },
            ]
        }
    ];

    return (
        <>
            {/* SSR-Compatible Navigation */}
            <div className="mobile-nav-sticky transition-all duration-300 bg-black" data-ssr-nav>
                <div className="py-3 px-4 sm:px-6">
                    <div className={'max-w-7xl mx-auto'}>
                        <div className={'relative flex justify-between items-center'}>
                            
                            {/* Mobile Layout */}
                            <div className={'lg:hidden w-full flex items-center justify-between relative'}>
                                {/* Mobile Menu Button - Enhanced with JS */}
                                <button
                                    className="text-white p-2 rounded-md hover:bg-white/10 transition-colors duration-200"
                                    aria-label="Open menu"
                                    data-mobile-menu-trigger
                                    type="button"
                                >
                                    <svg 
                                        width="24" 
                                        height="24" 
                                        viewBox="0 0 24 24" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        strokeWidth="2" 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                    >
                                        <line x1="4" x2="20" y1="6" y2="6"/>
                                        <line x1="4" x2="20" y1="12" y2="12"/>
                                        <line x1="4" x2="20" y1="18" y2="18"/>
                                    </svg>
                                </button>

                                {/* Centered Logo */}
                                <Link className={'flex-shrink-0 absolute left-1/2 transform -translate-x-1/2'} href={'/'} aria-label={'TRPE Home'}>
                                    <Image
                                        src={'/trpe-logo.webp'} 
                                        alt="TRPE Logo" 
                                        width={160} 
                                        height={30}
                                        priority
                                        className="h-8 w-auto"
                                        placeholder="blur"
                                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                                    />
                                </Link>
                                
                                {/* Mobile Contact Button */}
                                <Link 
                                    href={'/contact-us'}
                                    aria-label={'Contact Us'}
                                    className="text-white border border-white rounded-full p-2.5 hover:text-black hover:bg-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                                >
                                    <Phone size={20} className='stroke-1' />
                                </Link>
                            </div>

                            {/* Desktop Layout */}
                            <div className={'hidden lg:flex space-x-8 items-center'}>
                                <Link href={'/'} aria-label={'TRPE Home'}>
                                    <span className="sr-only">TRPE Home</span>
                                    <svg width="38" height="64" viewBox="0 0 38 64" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M0.131492 0L0 45.1067L19.0532 64L38 45.2123V0H0.131492ZM32.6904 33.5274H28.9962L32.4274 36.9298V44.3803L27.2243 49.546V33.397H21.708V54.3516L18.7903 57.2449L15.9789 54.4571V28.2375H27.0176V22.6496H10.9824V50.5208L5.34718 44.9329V17.7074H16.1793V12.1195H5.34718V6.46953H32.1832V12.1195H21.8082V17.7074H32.6403L32.6904 33.5274Z"
                                            fill="white"></path>
                                    </svg>
                                </Link>
                                <TopNavigationSSR/>
                            </div>

                            {/* Desktop CTA Buttons */}
                            <div className="hidden lg:flex space-x-6 items-center">
                                <Link href={'/list-with-us'}
                                      className="py-3 px-6 rounded-full border border-white text-white font-semibold hover:bg-white hover:text-black transition-colors min-h-[44px] flex items-center">
                                    List with Us
                                </Link>
                                <Link href={'/contact-us'}
                                      aria-label={'Contact Us'}
                                      className="text-white border border-white rounded-full p-3 hover:text-black hover:bg-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
                                    <Phone size={24} className='stroke-1' />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Fallback for SSR (no JS) */}
                <noscript>
                    <div className="lg:hidden bg-gray-900 border-t border-gray-800" aria-label="Mobile navigation">
                        <div className="py-4 px-4">
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                {mobileNavSections.map((section) => (
                                    <div key={section.title} className="space-y-2">
                                        <h3 className="text-white font-semibold text-sm uppercase tracking-wide border-b border-gray-700 pb-2">
                                            {section.title}
                                        </h3>
                                        <div className="space-y-1 pl-2">
                                            {section.items.map((item) => (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    className="block text-gray-300 text-sm py-1.5 hover:text-white transition-colors"
                                                >
                                                    {item.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                <div className="pt-4 border-t border-gray-700 space-y-2">
                                    <Link href="/about-us" className="block text-white font-medium py-2">
                                        About Us
                                    </Link>
                                    <Link href="/contact-us" className="block text-white font-medium py-2">
                                        Contact Us
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </noscript>
            </div>
            
            {/* Mobile Menu Container - Enhanced with JavaScript */}
            <div 
                id="mobile-navigation-container" 
                className="mobile-nav-container hidden"
                data-mobile-nav-container
                aria-hidden="true"
            >
                {/* Mobile menu content will be injected here by NavigationEnhancer */}
            </div>
            
            {/* Progressive Enhancement - Load interactive features when JS is available */}
            <NavigationEnhancer />
        </>
    );
}

export default SiteTopNavigationSSR;
