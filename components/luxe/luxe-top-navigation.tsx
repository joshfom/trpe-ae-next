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
import {Phone, User, Menu, X} from 'lucide-react';

function LuxeTopNavigation() {
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

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isMobileMenuOpen])

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    const navigationLinks = [
        { href: '/luxe', label: 'Home' },
        { href: '/luxe/properties', label: 'Properties' },
        { href: '/luxe/our-team', label: 'Agents' },
        { href: '/luxe/pages', label: 'Pages' },
        { href: '/luxe/contact', label: 'Contact' },
    ]

    return (
        <>
            <div className={`z-50 py-4 px-4 sm:px-6 w-full fixed transition-all duration-300 ${scroll || !isHomePage ? 'bg-black shadow-lg' : 'bg-black lg:bg-transparent'}`}>
                <div className={'max-w-7xl mx-auto'}>
                    <div className={'relative flex justify-between items-center'}>
                        
                        {/* Desktop Logo */}
                        <div className={'hidden lg:flex'}>
                            <Link href={'/'} aria-label={'TRPE Home'}>
                                <span className="sr-only">TRPE Home</span>
                                <svg width="38" height="64" viewBox="0 0 38 64" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M0.131492 0L0 45.1067L19.0532 64L38 45.2123V0H0.131492ZM32.6904 33.5274H28.9962L32.4274 36.9298V44.3803L27.2243 49.546V33.397H21.708V54.3516L18.7903 57.2449L15.9789 54.4571V28.2375H27.0176V22.6496H10.9824V50.5208L5.34718 44.9329V17.7074H16.1793V12.1195H5.34718V6.46953H32.1832V12.1195H21.8082V17.7074H32.6403L32.6904 33.5274Z"
                                        fill="white"></path>
                                </svg>
                            </Link>
                        </div>

                        {/* Mobile Logo */}
                        <div className="lg:hidden flex-1 flex justify-center">
                            <Link href={'/'} aria-label={'TRPE Home'}>
                                <img
                                    src={'/trpe-logo.webp'} 
                                    alt="TRPE Logo" 
                                    width={180} 
                                    height={32}
                                    className="h-8 w-auto"
                                    loading="eager"
                                />
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex flex-grow items-center justify-center">
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

                        {/* Desktop Profile Button */}
                        <div className="hidden lg:flex items-center">
                            <Link href={'/contact-us'}
                                  aria-label={'Contact Us'}
                                  className="text-white flex items-center rounded-full border border-white px-6 py-2 hover:text-black hover:bg-white transition-all duration-200">
                                <User size={20} className='stroke-1 mr-2' />
                                <span className="text-slate-300 hover:text-black">Profile</span>
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="lg:hidden">
                            <button
                                onClick={toggleMobileMenu}
                                className="text-white p-2 rounded-md hover:bg-white/10 transition-colors duration-200"
                                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                            >
                                {isMobileMenuOpen ? (
                                    <X size={24} />
                                ) : (
                                    <Menu size={24} />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={toggleMobileMenu}
                />
            )}

            {/* Mobile Menu Drawer */}
            <div className={`fixed top-0 right-0 h-full w-80 bg-black z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
                isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}>
                <div className="flex flex-col h-full">
                    {/* Mobile Menu Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-800">
                        <Link href={'/'} onClick={toggleMobileMenu}>
                            <img
                                src={'/trpe-logo.webp'} 
                                alt="TRPE Logo" 
                                width={160} 
                                height={30}
                                className="h-7 w-auto"
                            />
                        </Link>
                        <button
                            onClick={toggleMobileMenu}
                            className="text-white p-2 rounded-md hover:bg-white/10 transition-colors duration-200"
                            aria-label="Close menu"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Mobile Navigation Links */}
                    <nav className="flex-1 py-6">
                        <div className="space-y-1">
                            {navigationLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={toggleMobileMenu}
                                    className={`block px-6 py-4 text-lg font-medium transition-colors duration-200 ${
                                        pathname === link.href 
                                            ? 'text-amber-400 bg-amber-400/10 border-r-2 border-amber-400' 
                                            : 'text-white hover:text-amber-400 hover:bg-white/5'
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </nav>

                    {/* Mobile Menu Footer */}
                    <div className="p-6 border-t border-gray-800">
                        <Link 
                            href={'/contact-us'}
                            onClick={toggleMobileMenu}
                            className="flex items-center justify-center w-full rounded-full border border-white px-6 py-3 text-white hover:text-black hover:bg-white transition-all duration-200"
                        >
                            <User size={20} className='stroke-1 mr-2' />
                            <span>Profile</span>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

// Memoize the entire component to prevent unnecessary re-renders
export default React.memo(LuxeTopNavigation);