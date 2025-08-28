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
import {Phone} from 'lucide-react';

function SiteTopNavigation() {
    const [scroll, setScroll] = useState(0)
    const [isHomePage, setIsHomePage] = useState(false)
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

    return (
        <>
            {/* Mobile-First Header - No gaps, full width, handles safe areas */}
            <div className={`mobile-nav-sticky transition-all duration-300 bg-black`}>
                <div className="py-3 px-4 sm:px-6">
                    <div className={'max-w-7xl mx-auto'}>
                        <div className={'relative flex justify-between items-center'}>
                            
                            {/* Mobile Layout - Centered Logo */}
                            <div className={'lg:hidden w-full flex items-center justify-center relative'}>
                                <Link className={'flex-shrink-0'} href={'/'} aria-label={'TRPE Home'}>
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
                                    className="absolute right-0 text-white border border-white rounded-full p-2.5 hover:text-black hover:bg-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
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
