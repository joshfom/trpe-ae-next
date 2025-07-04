import React from 'react';
import Link from 'next/link';
import { Separator } from '../ui/separator';
import LuxeFooterCommunitiesServer from './LuxeFooterCommunitiesServer';

interface LuxeFooterServerProps {
  showAbout?: boolean;
}

export default function LuxeFooterServer({ showAbout = true }: LuxeFooterServerProps) {
  const currentYear = new Date().getFullYear();

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
              <LuxeFooterCommunitiesServer />
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
              
              {/* Newsletter Subscription - Static version */}
              <div className="mt-8 px-4">
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  Stay informed with exclusive insights and the finest luxury properties in Dubai delivered to your inbox.
                </p>
                <div className="space-y-3">
                  <input 
                    type="email" 
                    placeholder="Enter your email address"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none"
                  />
                  <button 
                    className="w-full bg-black hover:bg-gray-800 text-white text-sm py-2.5 px-4 rounded-md transition-colors"
                    type="submit"
                  >
                    Subscribe to Updates
                  </button>
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
              TRPE ©{currentYear}
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
    </div>
  );
}
