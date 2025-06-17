import 'swiper/css';
import MainSearchServer from "@/features/search/MainSearchServer";
import SearchEnhancement from "@/features/search/SearchEnhancement";
import SiteFooter from "@/components/site-footer";
import SiteTopNavigation from "@/components/site-top-navigation";
import Link from "next/link";
import HomeAboutSection from "@/components/home/home-about-section";
import {db} from "@/db/drizzle";
import {propertyTable} from "@/db/schema/property-table";
import {offeringTypeTable} from "@/db/schema/offering-type-table";
import {asc, eq} from "drizzle-orm";
import FeaturedListingsSectionServer from "@/features/site/Homepage/components/FeaturedListingsSectionServer";
import Image from "next/image"
import {communityTable} from "@/db/schema/community-table";
import React, { cache, Suspense } from "react";
import WordPullUp from "@/features/site/components/WordPullUp";
import NextDynamic from "next/dynamic";
import { PropertyType } from "@/types/property";
import { unstable_cache } from 'next/cache';
import { SearchSkeleton, FeaturedListingsSkeleton } from '@/components/ssr-skeletons';
import LuxeHero from '@/components/luxe/LuxeHero';
import { LuxeMainSearch } from '@/components/luxe/LuxeMainSearch';
import { LuxePropCard, LuxuryCommunities, LuxeBlogSection } from '@/components/luxe';



// Enable static generation with revalidation
export const revalidate = 3600; // Revalidate every hour
export default async function LuxeHome() {
    // Use cached functions for better performance


    const webpageJsonLD = {
        "@id": "https://trpe.ae#WebPage",
        "url": "https://trpe.ae",
        "description": "Discover your dream property for sale or rent in Dubai with TRPE. Expert insights, seamless transactions, and personalised service await you.",
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "TRPE Real Estate",
        "logo": "https://trpe.ae/logo.png",
        "contactPoint": [{
            "@type": "ContactPoint",
            "telephone": "+971 50 523 2712",
            "contactType": "Customer Service",
            "areaServed": "AE",
            "availableLanguage": ["English", "Arabic"]
        }],
        "sameAs": [
            "https://www.facebook.com/trpedubai",
            "https://www.instagram.com/trpe.ae/",
            "https://www.linkedin.com/company/trpedubai"
        ]
    };
    return (
        <div className={'relative'}>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{__html: JSON.stringify(webpageJsonLD)}}
            />

        
            <main className="flex min-h-screen flex-col items-center relative">
                
                <LuxeHero />

                <LuxeMainSearch />

                <section className='w-full relative py-12'>
                    <div className='w-1/2'>
                        <img src="https://images.unsplash.com/photo-1734437406517-f2f731579114?q=80&w=4140&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
                    </div>
                   <div className="absolute inset-0">
                     <div className='max-w-7xl py-12 mx-auto flex flex-col lg:flex-row min-h-[600px]'>
                        {/* Left side - Full width image */}
                        <div className='relative w-1/2 h-full min-h-[400px] lg:min-h-[600px]'>
                          
                        </div>
                        
                        {/* Right side - Content with max-width constraint */}
                        <div className='w-1/2 flex flex-col'>
                            <div className='flex-grow flex flex-col justify-center'>
                                <div className='lg:pl-12 flex flex-col gap-1'>
                                    <h2 className='font-playfair text-3xl lg:text-4xl font-bold mb-6'>
                                        Your Heading Here
                                    </h2>
                                    <p className='text-lg text-gray-600 mb-8'>
                                        Your content goes here. This section maintains the max-width-7xl alignment 
                                        on the right side while the left image extends to the edge.
                                    </p>
                                     <p className='text-lg text-gray-600 mb-8'>
                                        Your content goes here. This section maintains the max-width-7xl alignment 
                                        on the right side while the left image extends to the edge.
                                    </p>
                                   <div>
                                     <Link href="/properties" className='inline-flex items-center px-6 py-3 bg-primary text-white rounded-full hover:bg-white hover:text-black hover:border-slate-200 border border:transparent transition-colors'>
                                        Explore Properties
                                    </Link>
                                   </div>
                                </div>
                            </div>
                        </div>
                    </div>
                   </div>
                </section>



                <section className='w-full relative py-6 bg-white'>
                    <div className='w-full max-h-[700px] overflow-hidden    '>
                        <img src="https://images.unsplash.com/photo-1734437406517-f2f731579114?q=80&w=4140&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
                    </div>
                    <div className="absolute inset-0 my-6 bg-white bg-opacity-60 backdrop:blur-sm"></div>
                   <div className="absolute inset-0">
                     <div className='max-w-7xl py-12 mx-auto flex flex-col lg:flex-row min-h-[600px]'>

                             
                        {/* Right side - Content with max-width constraint */}
                        <div className='w-1/2 flex flex-col'>
                            <div className='flex-grow flex flex-col justify-center'>
                                <div className='lg:pr-12 flex flex-col gap-1'>
                                    <h2 className='font-playfair text-3xl lg:text-4xl font-bold mb-6'>
                                        Your Heading Here
                                    </h2>
                                    <p className='text-lg text-gray-600 mb-8'>
                                        Your content goes here. This section maintains the max-width-7xl alignment 
                                        on the right side while the left image extends to the edge.
                                    </p>
                                     <p className='text-lg text-gray-600 mb-8'>
                                        Your content goes here. This section maintains the max-width-7xl alignment 
                                        on the right side while the left image extends to the edge.
                                    </p>
                                   
                                </div>
                            </div>
                        </div>

                        {/* Left side - Full width image */}
                        <div className='relative w-1/2 h-full min-h-[400px] lg:min-h-[600px]'>
                          
                        </div>
                   
                    </div>
                   </div>
                </section>


                <section className='w-full py-12 bg-white'>
                    <div className='max-w-7xl mx-auto px-4'>
                        <h2 className='text-3xl font-playfair mb-6'>Featured Listings</h2>
                        
                        <div className='grid grid-cols-1 md:grid-cols-2 pt-8 lg:grid-cols-3 gap-8'>
                            <LuxePropCard 
                                title="West Square Villa"
                                location="Jumeirah Village Triangle"
                                className='bg-slate-50'
                                price={2300000}
                                beds={5}
                                baths={7}
                                sqft={9780}
                                imageUrl="https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            />
                            
                            <LuxePropCard 
                                title="Marina Bay Penthouse"
                                location="Dubai Marina"
                                price={4500000}
                                beds={4}
                                baths={5}
                                 className='bg-slate-50'
                                sqft={8200}
                                imageUrl="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            />
                            
                            <LuxePropCard 
                                title="Palm Jumeirah Mansion"
                                location="Palm Jumeirah"
                                price={8900000}
                                beds={6}
                                className='bg-slate-50'
                                baths={8}
                                sqft={12500}
                                imageUrl="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            />
                        </div>

                    </div>
                </section>


                
                <section className='w-full relative py-12'>
                    <div className='w-1/2 ml-auto'>
                        <img src="https://images.unsplash.com/photo-1734437406517-f2f731579114?q=80&w=4140&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
                    </div>
                   <div className="absolute inset-0">
                     <div className='max-w-7xl py-12 mx-auto flex flex-col lg:flex-row min-h-[600px]'>
                        {/* Left side - Content with max-width constraint */}
                        <div className='w-1/2 flex flex-col'>
                            <div className='flex-grow flex flex-col justify-center'>
                                <div className='lg:pr-12 flex flex-col gap-1'>
                                    <h2 className='font-playfair text-3xl lg:text-4xl font-bold mb-6'>
                                        Your Heading Here
                                    </h2>
                                    <p className='text-lg text-gray-600 mb-8'>
                                        Your content goes here. This section maintains the max-width-7xl alignment 
                                        on the left side while the right image extends to the edge.
                                    </p>
                                     <p className='text-lg text-gray-600 mb-8'>
                                        Your content goes here. This section maintains the max-width-7xl alignment 
                                        on the left side while the right image extends to the edge.
                                    </p>
                                   <div>
                                     <Link href="/properties" className='inline-flex items-center px-6 py-3 bg-primary text-white rounded-full hover:bg-white hover:text-black hover:border-slate-200 border border:transparent transition-colors'>
                                        Explore Properties
                                    </Link>
                                   </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Right side - Full width image */}
                        <div className='relative w-1/2 h-full min-h-[400px] lg:min-h-[600px]'>
                          
                        </div>
                    </div>
                   </div>
                </section>


            {/* Dark Section with Centered Content */}
            <section className='w-full py-20 bg-slate-900'>
                <div className='max-w-4xl mx-auto px-4 text-center'>
                    {/* H2 Title */}
                    <p className='text-gray-400 text-sm uppercase tracking-wider mb-4'>
                        H2 Title
                    </p>
                    
                    {/* Main Title */}
                    <h2 className='text-white text-4xl lg:text-6xl font-playfair font-light mb-8'>
                        Main Title
                    </h2>
                    
                    {/* Description */}
                    <p className='text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto'>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna 
                        aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.
                    </p>
                </div>
            </section>


                {/* Luxury communities */}
                <LuxuryCommunities />



                {/* Special and different villa section  */}
                <section className='w-full relative h-[600px] lg:h-[700px]'>
                    {/* Background Image */}
                    <img 
                        src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Special Villa"
                        className='w-full h-full object-cover'
                    />
                    
                    {/* Gradient Overlay - Left to Right (Dark to Transparent) */}
                    <div className='absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent'></div>
                    
                    {/* Content - Text on Left */}
                    <div className='absolute inset-0 flex items-center'>
                        <div className='max-w-7xl mx-auto px-4 w-full'>
                            <div className='max-w-xl text-white'>
                                <h2 className='text-4xl lg:text-6xl font-playfair font-light mb-6'>
                                    Special & Different Villas
                                </h2>
                                <p className='text-lg lg:text-xl text-gray-200 mb-8 leading-relaxed'>
                                    Discover extraordinary luxury villas that redefine elegance and sophistication. Each property offers unique architectural design and premium amenities.
                                </p>
                                <Link href="/villas" className='inline-flex items-center px-8 py-4 bg-white text-black rounded-full hover:bg-gray-100 transition-colors font-medium'>
                                    Explore Special Villas
                                    <svg className='ml-2 w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>


                {/* Apartment with unique designs */}
                <section className='w-full relative h-[600px] lg:h-[700px]'>
                    {/* Background Image */}
                    <img 
                        src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Unique Apartment Design"
                        className='w-full h-full object-cover'
                    />
                    
                    {/* Gradient Overlay - Right to Left (Dark to Transparent) */}
                    <div className='absolute inset-0 bg-gradient-to-l from-black/80 via-black/40 to-transparent'></div>
                    
                    {/* Content - Text on Right */}
                    <div className='absolute inset-0 flex items-center'>
                        <div className='max-w-7xl mx-auto px-4 w-full'>
                            <div className='max-w-xl ml-auto text-white text-right'>
                                <h2 className='text-4xl lg:text-6xl font-playfair font-light mb-6'>
                                    Apartments with Unique Designs
                                </h2>
                                <p className='text-lg lg:text-xl text-gray-200 mb-8 leading-relaxed'>
                                    Experience innovative architectural concepts and cutting-edge interior designs. Each apartment features distinctive layouts and premium finishes.
                                </p>
                                <Link href="/apartments" className='inline-flex items-center px-8 py-4 bg-white text-black rounded-full hover:bg-gray-100 transition-colors font-medium'>
                                    Discover Unique Apartments
                                    <svg className='ml-2 w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>


                {/* LATEST BLOG SECTION  */}
                <LuxeBlogSection />

                {/* Dubai Cityscape Section */}
                <section className='w-full relative h-[500px] lg:h-[600px] overflow-hidden'>
                    {/* Background Image - Dubai cityscape with palm trees */}
                    <img 
                        src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Dubai Cityscape"
                        className='w-full h-full object-cover'
                    />
                    
                    {/* Light overlay for better text readability */}
                    <div className='absolute inset-0 bg-white/20'></div>
                    
                    {/* Content Container */}
                    <div className='absolute inset-0 flex items-center'>
                        <div className='max-w-7xl mx-auto px-4 w-full'>
                            <div className='flex flex-col lg:flex-row items-center justify-between'>
                                {/* Left Side - Text Content */}
                                <div className='max-w-2xl mb-8 lg:mb-0'>
                                    <h2 className='text-3xl lg:text-5xl font-playfair font-light text-slate-800 mb-6 leading-tight'>
                                        is simply dummy text of the printing 
                                        <br />
                                        and typesetting industry.
                                    </h2>
                                </div>
                                
                                {/* Right Side - Button */}
                                <div className='flex-shrink-0'>
                                    <Link 
                                        href="/properties" 
                                        className='inline-flex items-center px-12 py-4 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors font-medium text-lg'
                                    >
                                        PLP Button
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>


            </main>
        </div>

    );
}
