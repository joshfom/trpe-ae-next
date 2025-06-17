"use client"
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
// Use dynamic import with SSR enabled for better performance
const TopNavigation = dynamic(() => import("@/components/top-navigation"), { 
    ssr: true,
    loading: () => <div className="h-16 bg-black animate-pulse" aria-label="Loading navigation" />
});
import Link from "next/link";
import {usePathname} from 'next/navigation'
import {Phone, User} from 'lucide-react';

function LuxeTopNavigation() {
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
       
<div className={`z-30 py-4 px-6  w-full lg:fixed ${scroll || !isHomePage ? 'bg-black shadow-lg' : 'bg-black lg:bg-transparent'} `}>
                <div className={'max-w-7xl px-6 mx-auto'}>
                    <div className={'max-w-7xl relative mx-auto flex justify-between items-center'}>
                        <div className={'hidden lg:flex space-x-8'}>
                            <Link href={'/'} aria-label={'TRPE Home'}>
                                <span className="sr-only">
                                    TRPE Home
                                </span>
                                <svg width="38" height="64" viewBox="0 0 38 64" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M0.131492 0L0 45.1067L19.0532 64L38 45.2123V0H0.131492ZM32.6904 33.5274H28.9962L32.4274 36.9298V44.3803L27.2243 49.546V33.397H21.708V54.3516L18.7903 57.2449L15.9789 54.4571V28.2375H27.0176V22.6496H10.9824V50.5208L5.34718 44.9329V17.7074H16.1793V12.1195H5.34718V6.46953H32.1832V12.1195H21.8082V17.7074H32.6403L32.6904 33.5274Z"
                                        fill="white"></path>
                                </svg>
                            </Link>

                        </div>
                         <div className="flex-grow flex items-center justify-center">
                            <nav className={'flex space-x-8 items-center'}> 
                                <Link href={'/luxe'} className={'text-white hover:text-gray-300'}>
                                    Home
                                </Link>
                                <Link href={'/luxe/properties'} className={'text-white hover:text-gray-300'}>
                                   Properties
                                </Link>
                                <Link href={'/luxe/our-team'} className={'text-white hover:text-gray-300'}>
                                    Agents
                                </Link>
                                <Link href={'/luxe/pages'} className={'text-white hover:text-gray-300'}>
                                    Pages
                                </Link>
                                <Link href={'/luxe/contact'} className={'text-white hover:text-gray-300'}>
                                    Contact
                                </Link>
                            </nav>
                         </div>
                        <div className={'lg:hidden bg-black flex items-center p-2 grow justify-between'}>

                            <div className="flex-1 flex justify-center">
                                <Link className={''} href={'/'}>
                                    <img
                                        src={'/trpe-logo.webp'} 
                                        alt="TRPE Logo" 
                                        width={213} 
                                        height={40}
                                        loading="eager"
                                    />
                                </Link>
                            </div>
                        </div>

                        <div className="hidden lg:flex space-x-6 items-center">
                            <Link href={'/contact-us'}
                                  aria-label={'Contact Us'}
                                  className="text-white flex items-center rounded-3xl border border-white px-6 py-2 hover:text-black hover:bg-white">
                                <User size={24} className='stroke-1 mr-2' />
                                <span className="text-slate-300">Profile</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>


        </>
    )
        ;
}

// Memoize the entire component to prevent unnecessary re-renders
export default React.memo(LuxeTopNavigation);