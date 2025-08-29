"use client"
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
// Use dynamic import with SSR enabled for better performance
const TopNavigation = dynamic(() => import("@/components/top-navigation"), { 
    ssr: true,
    loading: () => <div className="h-16 bg-black animate-pulse" aria-label="Loading navigation" />
});
import Link from "next/link";
import {usePathname} from 'next/navigation'
import {Phone, Menu, X, ChevronRight} from 'lucide-react';
import { 
    Drawer, 
    DrawerContent, 
    DrawerHeader, 
    DrawerTitle, 
    DrawerTrigger,
    DrawerClose 
} from "@/components/ui/drawer";

function SiteTopNavigation() {
    const [scroll, setScroll] = useState(0)
    const [isHomePage, setIsHomePage] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const pathname = usePathname()

    // Memoize the check for homepage
    useEffect(() => {
        setIsHomePage(pathname === '/')
    }, [pathname])
    
    // Memoize scroll handler to prevent recreation on each render
    const handleScroll = useCallback(() => {
        setScroll(window.scrollY)
    }, [])

    // Setup and cleanup the event listener
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll])

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false)
    }, [pathname])

    // Navigation sections for mobile menu
    const mobileNavSections = [
        {
            title: 'For Sale',
            items: [
                { href: '/properties/for-sale', label: 'All Properties for Sale' },
                { href: '/property-types/apartments/for-sale', label: 'Apartments for Sale' },
                { href: '/property-types/villas/for-sale', label: 'Villas for Sale' },
                { href: '/property-types/townhouses/for-sale', label: 'Townhouses for Sale' },
                { href: '/property-types/offices/commercial-sale', label: 'Offices for Sale' },
                { href: '/property-types/retails/commercial-sale', label: 'Retail for Sale' },
            ]
        },
        {
            title: 'For Rent',
            items: [
                { href: '/properties/for-rent', label: 'All Properties for Rent' },
                { href: '/property-types/apartments/for-rent', label: 'Apartments for Rent' },
                { href: '/property-types/villas/for-rent', label: 'Villas for Rent' },
                { href: '/property-types/townhouses/for-rent', label: 'Townhouses for Rent' },
                { href: '/property-types/offices/commercial-rent', label: 'Offices for Rent' },
                { href: '/property-types/retails/commercial-rent', label: 'Retail for Rent' },
            ]
        },
        {
            title: 'Off-Plan',
            items: [
                { href: '/off-plan', label: 'All Off-Plan Properties' },
                { href: '/off-plan/apartments', label: 'Off-Plan Apartments' },
                { href: '/off-plan/villas', label: 'Off-Plan Villas' },
                { href: '/off-plan/townhouses', label: 'Off-Plan Townhouses' },
            ]
        },
        {
            title: 'Areas',
            items: [
                { href: '/communities', label: 'All Communities' },
                { href: '/communities/dubai-marina', label: 'Dubai Marina' },
                { href: '/communities/downtown-dubai', label: 'Downtown Dubai' },
                { href: '/communities/dubai-hills-estate', label: 'Dubai Hills Estate' },
                { href: '/communities/palm-jumeirah', label: 'Palm Jumeirah' },
            ]
        },
        {
            title: 'About',
            items: [
                { href: '/our-team', label: 'Our Team' },
                { href: '/insights', label: 'Insights' },
                { href: '/about-us', label: 'About Us' },
                { href: '/contact-us', label: 'Contact Us' },
                { href: '/list-with-us', label: 'List with Us' },
            ]
        }
    ];

    return (
        <>
            {/* Mobile-First Header - No gaps, full width, handles safe areas */}
            <div className={`mobile-nav-sticky transition-all duration-300 bg-black`}>
                <div className="py-3 px-4 sm:px-6">
                    <div className={'max-w-7xl mx-auto'}>
                        <div className={'relative flex justify-between items-center'}>
                            
                            {/* Mobile Layout - Hamburger Menu on Left, Logo Centered, Contact on Right */}
                            <div className={'lg:hidden w-full flex items-center justify-between relative'}>
                                {/* Mobile Menu Drawer - Left Side */}
                                <Drawer open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                                    <DrawerTrigger asChild>
                                        <button
                                            className="text-white p-2 rounded-md hover:bg-white/10 transition-colors duration-200"
                                            aria-label="Open menu"
                                        >
                                            <Menu size={24} />
                                        </button>
                                    </DrawerTrigger>
                                    <DrawerContent className="bg-black border-gray-800 text-white rounded-t-3xl max-h-[85vh] overflow-hidden">
                                        <DrawerHeader className="border-b border-gray-800 flex-shrink-0 pb-4">
                                            <div className="flex items-center justify-between">
                                                <Link href={'/'} onClick={() => setIsMobileMenuOpen(false)}>
                                                    <Image
                                                        src={'/trpe-logo.webp'} 
                                                        alt="TRPE Logo" 
                                                        width={160} 
                                                        height={30}
                                                        className="h-7 w-auto"
                                                    />
                                                </Link>
                                                <DrawerClose asChild>
                                                    <button
                                                        className="text-white p-2 rounded-md hover:bg-white/10 transition-colors duration-200"
                                                        aria-label="Close menu"
                                                    >
                                                        <X size={24} />
                                                    </button>
                                                </DrawerClose>
                                            </div>
                                        </DrawerHeader>

                                        {/* Mobile Navigation Content - Scrollable */}
                                        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                                            <nav className="py-4 px-4 space-y-6">
                                                {mobileNavSections.map((section) => (
                                                    <div key={section.title} className="space-y-3">
                                                        <h3 className="text-lg font-semibold text-white border-b border-gray-800 pb-2">
                                                            {section.title}
                                                        </h3>
                                                        <div className="space-y-1">
                                                            {section.items.map((item) => (
                                                                <Link
                                                                    key={item.href}
                                                                    href={item.href}
                                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                                    className={`flex items-center justify-between px-3 py-3 text-sm rounded-xl transition-all duration-200 ${
                                                                        pathname === item.href 
                                                                            ? 'text-blue-400 bg-blue-400/10 border border-blue-400/30' 
                                                                            : 'text-gray-300 hover:text-white hover:bg-white/5'
                                                                    }`}
                                                                >
                                                                    <span>{item.label}</span>
                                                                    <ChevronRight size={16} className="text-gray-500" />
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                                
                                                {/* Luxe Collection Link */}
                                                <div className="pt-4 border-t border-gray-800">
                                                    <Link
                                                        href="/luxe"
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                        className="flex items-center justify-between px-3 py-4 text-amber-400 bg-amber-400/10 border border-amber-400/30 rounded-xl transition-all duration-200 hover:bg-amber-400/20"
                                                    >
                                                        <span className="font-medium">Luxe Collection</span>
                                                        <ChevronRight size={16} />
                                                    </Link>
                                                </div>
                                                
                                                {/* Bottom padding for safe area */}
                                                <div className="h-8"></div>
                                            </nav>
                                        </div>
                                    </DrawerContent>
                                </Drawer>

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
                                
                                {/* Mobile Contact Button - Right Side */}
                                <Link 
                                    href={'/contact-us'}
                                    aria-label={'Contact Us'}
                                    className="text-white border border-white rounded-full p-2.5 hover:text-black hover:bg-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                                >
                                    <Phone size={20} className='stroke-1' />
                                </Link>
                            </div>

                            {/* Desktop Layout - Hidden on Mobile */}
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
                                <TopNavigation/>
                            </div>

                            {/* Desktop CTA Buttons - Hidden on Mobile */}
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
            </div>
        </>
    );
}

// Memoize the entire component to prevent unnecessary re-renders
export default React.memo(SiteTopNavigation);
