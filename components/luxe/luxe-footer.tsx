'use client'
import React, {useState, useCallback, useMemo, memo} from 'react';
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {Facebook, Instagram, Linkedin, Youtube} from "lucide-react";
import {HoverCard, HoverCardContent, HoverCardTrigger} from "@/components/ui/hover-card";
import {toast} from "sonner";
import {useUnitStore} from "@/hooks/use-unit-store";
import {useCurrencyStore} from "@/hooks/use-currency-store";
import {usePathname, useRouter} from "next/navigation";
import LuxeFooterCommunities from './LuxeFooterCommunities';
import { Separator } from '../ui/separator';





interface LuxeFooterProps {
    showAbout?: boolean;
}

function LuxeFooter({showAbout = true}: LuxeFooterProps) {
    const {unit, setUnit} = useUnitStore();
    const {currency, setCurrency} = useCurrencyStore();
    const [active, setActive] = useState<string | null>(null);

    // Memoize the current year to avoid recalculation on every render
    const currentYear = useMemo(() => new Date().getFullYear(), []);

    const pathname = usePathname()
    const router = useRouter();

    // Memoize callback functions to prevent recreation on each render
    const changeUnitType = useCallback((unitType: string) => {
        setUnit(unitType as 'sqf' | 'sqm')
        router.refresh()
        toast.success(`Unit type changed to ${unitType.toUpperCase()}`)
    }, [setUnit, router]);

    const changeCurrency = useCallback((currency: string) => {
        setCurrency(currency as 'AED' | 'GBP' | 'EUR' | 'USD')
        toast.success(`Currency changed to ${currency}`)
        router.refresh()
    }, [setCurrency, router]);

    const handleChangeUnitSqm = useCallback(() => {
        changeUnitType('sqm');
    }, [changeUnitType]);

    const handleChangeUnitSqf = useCallback(() => {
        changeUnitType('sqf');
    }, [changeUnitType]);

    const handleChangeCurrencyGBP = useCallback(() => {
        changeCurrency('GBP');
    }, [changeCurrency]);

    const handleChangeCurrencyEUR = useCallback(() => {
        changeCurrency('EUR');
    }, [changeCurrency]);

    const handleChangeCurrencyUSD = useCallback(() => {
        changeCurrency('USD');
    }, [changeCurrency]);

    const handleChangeCurrencyAED = useCallback(() => {
        changeCurrency('AED');
    }, [changeCurrency]);

    const handleChangeUnitSqmAndClose = useCallback(() => {
        changeUnitType('sqm');
    }, [changeUnitType]);

    const handleChangeUnitSqfAndClose = useCallback(() => {
        changeUnitType('sqf');
    }, [changeUnitType]);


    return (
        <div className={'w-full border-zinc-500'}>

            <div className="py-8 sm:py-12">
                <div className="max-w-7xl mx-auto border-t px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12 lg:pb-12 pt-6 sm:pt-8 lg:pt-6">
              <div className="flex flex-col lg:flex-row justify-end py-6 sm:py-8 lg:py-12">

                    </div>



                    <div className="py-6 sm:py-8 lg:py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        <div className="space-y-4 sm:space-y-6">
                            <div>
                                <p className="text-lg sm:text-xl px-4 font-medium mb-3">
                                    For Sale
                                </p>
                                <div className="flex flex-col pt-2">
                                    <Link
                                        className="px-4 py-2 text-sm sm:text-base border-b border-transparent hover:border-slate-700 transition-colors"
                                        href="/properties/for-sale">
                                        Properties for sale in Dubai
                                    </Link>
                                    <Link
                                        className="px-4 py-2 text-sm sm:text-base border-b border-transparent hover:border-slate-700 transition-colors"
                                        href="/property-types/apartments/for-sale">
                                        Apartments for sale in Dubai
                                    </Link>
                                    <Link
                                        className="px-4 py-2 text-sm sm:text-base border-b border-transparent hover:border-slate-700 transition-colors"
                                        href="/property-types/villas/for-sale">
                                        Villas for sale in Dubai
                                    </Link>
                                    <Link
                                        className="px-4 py-2 text-sm sm:text-base border-b border-transparent hover:border-slate-700 transition-colors"
                                        href="/property-types/townhouses/for-sale">
                                        Townhouse for sale in Dubai
                                    </Link>
                                    <Link
                                        className="px-4 py-2 text-sm sm:text-base border-b border-transparent hover:border-slate-700 transition-colors"
                                        href="/property-types/penthouses/for-sale">
                                        Penthouses for sale in Dubai
                                    </Link>
                                    <Link
                                        className="px-4 py-2 text-sm sm:text-base border-b border-transparent hover:border-slate-700 transition-colors"
                                        href="/property-types/offices/commercial-sale">
                                        Offices for sale in Dubai
                                    </Link>
                                    <Link
                                        className="px-4 py-2 text-sm sm:text-base border-b border-transparent hover:border-slate-700 transition-colors"
                                        href="/property-types/retails/commercial-sale">
                                        Retails for sale in Dubai
                                    </Link>
                                </div>
                            </div>
                        </div>
                        
                        <div className="space-y-4 sm:space-y-6">
                            <p className="text-lg sm:text-xl px-4 font-medium mb-3">
                                Neighbourhoods
                            </p>
                            <LuxeFooterCommunities />
                        </div>
                        
                        <div className="pb-6 sm:pb-8 lg:pb-0 space-y-4 sm:space-y-6">
                            <p className="text-lg sm:text-xl px-4 font-medium mb-3">
                                Contact Us
                            </p>
                            <div className="flex flex-col pt-2">
                                <Link
                                    className="px-4 py-2 text-sm sm:text-base border-b border-transparent hover:border-slate-700 transition-colors"
                                    href="/luxe/about-us">
                                    About Us
                                </Link>
                                <Link
                                    className="px-4 py-2 text-sm sm:text-base border-b border-transparent hover:border-slate-700 transition-colors"
                                    href="/luxe/contact-us">
                                    Contact Us
                                </Link>
                                <Link
                                    className="px-4 py-2 text-sm sm:text-base border-b border-transparent hover:border-slate-700 transition-colors"
                                    href="/luxe/advisors">
                                    Meet Our Advisors
                                </Link>
                            </div>
                            
                            {/* Newsletter Subscription */}
                            <div className="mt-8 px-4">
                                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                                    Stay informed with exclusive insights and the finest luxury properties in Dubai delivered to your inbox.
                                </p>
                                <div className="space-y-3">
                                    <Input 
                                        type="email" 
                                        placeholder="Enter your email address"
                                        className="w-full text-sm border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                                    />
                                    <Button 
                                        className="w-full bg-black hover:bg-gray-800 text-white text-sm py-2.5"
                                        type="submit"
                                    >
                                        Subscribe to Updates
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Mobile-optimized Footer Bottom */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Mobile Layout: Stacked */}
                    <div className="block lg:hidden space-y-4">
                        {/* Privacy menu items on top */}
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-center">
                            <Link className="py-2 text-sm border-b border-transparent hover:border-black transition-colors" href="/privacy-policy">
                                Privacy Policy
                            </Link>
                            <Link className="py-2 text-sm border-b border-transparent hover:border-black transition-colors" href="/terms-conditions">
                                Terms & Conditions
                            </Link>
                            <Link className="py-2 text-sm border-b border-transparent hover:border-black transition-colors" href="/cookie-policy">
                                Cookie Policy
                            </Link>
                        </div>
                        
                        {/* Separator */}
                        <Separator className="h-[1px] bg-gray-300" />
                        
                        {/* TRPE copy below */}
                        <div className="text-center py-2">
                            <span className="text-sm text-gray-600">
                                TRPE ©{currentYear}
                            </span>
                        </div>
                    </div>
                    
                    {/* Desktop Layout: Original horizontal layout */}
                    <div className="hidden lg:flex gap-8 items-center py-4">
                        <div className="text-sm text-gray-600">
                            TRPE ©{currentYear}. 2025
                        </div>
                        <div className="flex-grow">
                            <Separator className="h-[2px] bg-black" />
                        </div>
                        <div className="flex flex-row gap-4">
                            <Link className="pb-1 text-center border-b border-transparent hover:border-black transition-colors text-sm" href="/privacy-policy">
                                Privacy Policy
                            </Link>
                            <Link className="pb-1 border-b border-transparent hover:border-black transition-colors text-sm" href="/terms-conditions">
                                Terms & Conditions
                            </Link>
                            <Link className="pb-1 border-b border-transparent hover:border-black transition-colors text-sm" href="/cookie-policy">
                                Cookie Policy
                            </Link>
                        </div>
                    </div>
                </div>

            </div>

            <div className="hidden lg:block">
                {/*<MobileSearch isOpen={openSearch} setIsOpen={setOpenSearch}/>*/}
            </div>

        </div>
    );
}

// Memoize the entire component to prevent unnecessary re-renders
const LuxeFooterMemo = memo(LuxeFooter);
LuxeFooterMemo.displayName = 'LuxeFooter';

export default LuxeFooterMemo;
