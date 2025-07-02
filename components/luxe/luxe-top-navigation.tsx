"use client"
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
// Use dynamic import with SSR enabled for better performance

import Link from "next/link";
import {usePathname} from 'next/navigation'
import {Phone, Menu, X} from 'lucide-react';
import { 
    Drawer, 
    DrawerContent, 
    DrawerHeader, 
    DrawerTitle, 
    DrawerTrigger,
    DrawerClose 
} from "@/components/ui/drawer";
import { MotionValue } from "framer-motion";

interface LuxeTopNavigationProps {
    scrollYProgress?: MotionValue<number>;
}

function LuxeTopNavigation({ scrollYProgress }: LuxeTopNavigationProps) {
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

    const navigationLinks = [
        { href: '/', label: 'Home' },
        { href: '/luxe/dubai/properties', label: 'Properties' },
        { href: '/luxe/advisors', label: 'Advisors' },
        { href: '/luxe/journals', label: 'Journals' },
        { href: '/luxe/contact-us', label: 'Contact' },
    ]

    return (
        <>
            <div className={`z-50 py-2 px-4 sm:px-6 w-full fixed transition-all duration-300 ${scroll || !isHomePage ? 'bg-black shadow-lg' : 'bg-black lg:bg-transparent'}`}>
                <div className={'max-w-7xl mx-auto'}>
                    <div className={'relative flex justify-between items-center'}>
                        
                        {/* Desktop Logo */}
                        <div className={'hidden lg:flex'}>
                            <Link href={'/'} aria-label={'TRPE Home'}>
                                <span className="sr-only">TRPE Home</span>
                                {/* <svg width="38" height="64" viewBox="0 0 38 64" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M0.131492 0L0 45.1067L19.0532 64L38 45.2123V0H0.131492ZM32.6904 33.5274H28.9962L32.4274 36.9298V44.3803L27.2243 49.546V33.397H21.708V54.3516L18.7903 57.2449L15.9789 54.4571V28.2375H27.0176V22.6496H10.9824V50.5208L5.34718 44.9329V17.7074H16.1793V12.1195H5.34718V6.46953H32.1832V12.1195H21.8082V17.7074H32.6403L32.6904 33.5274Z"
                                        fill="white"></path>
                                </svg> */}
                                 <img
                                    src={'/luxe-logo.webp'} 
                                    alt="TRPE Luxe Logo" 
                
                                    className="h-16 w-auto"
                                    loading="eager"
                                />
                            </Link>
                        </div>

                        {/* Mobile Logo */}
                        <div className="lg:hidden flex-1 flex justify-center">
                            <Link href={'/'} aria-label={'TRPE Home'}>
                                <img
                                    src={'/luxe-logo.webp'} 
                                    alt="TRPE Luxe Logo" 
                                    width={180} 
                                    height={32}
                                    className="h-8 w-auto"
                                    loading="eager"
                                />
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center ml-auto">
                            <nav className={'flex space-x-8 items-center'}> 
                                {navigationLinks.map((link) => (
                                    <Link 
                                        key={link.href}
                                        href={link.href} 
                                        className={`text-white hover:text-amber-400 transition-colors duration-200 font-medium ${
                                            pathname === link.href ? 'text-amber-400' : ''
                                        }`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        {/* Mobile Menu Drawer */}
                        <div className="lg:hidden">
                            <Drawer open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                                <DrawerTrigger asChild>
                                    <button
                                        className="text-white p-2 rounded-md hover:bg-white/10 transition-colors duration-200"
                                        aria-label="Open menu"
                                    >
                                        <Menu size={24} />
                                    </button>
                                </DrawerTrigger>
                                <DrawerContent className="bg-black border-gray-800 text-white rounded-t-3xl">
                                    <DrawerHeader className="border-b border-gray-800">
                                        <div className="flex items-center justify-between">
                                            <Link href={'/'} onClick={() => setIsMobileMenuOpen(false)}>
                                                <img
                                                    src={'/luxe-logo.webp'} 
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

                                    {/* Mobile Navigation Links */}
                                    <nav className="py-6 px-4">
                                        <div className="space-y-2">
                                            {navigationLinks.map((link) => (
                                                <Link
                                                    key={link.href}
                                                    href={link.href}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className={`block px-4 py-4 text-lg font-medium rounded-2xl transition-all duration-200 ${
                                                        pathname === link.href 
                                                            ? 'text-amber-400 bg-amber-400/10 border border-amber-400/30' 
                                                            : 'text-white hover:text-amber-400 hover:bg-white/5'
                                                    }`}
                                                >
                                                    {link.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </nav>
                                </DrawerContent>
                            </Drawer>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

// Memoize the entire component to prevent unnecessary re-renders
export default React.memo(LuxeTopNavigation);