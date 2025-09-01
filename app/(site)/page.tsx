import 'swiper/css';
import MainSearchServer from "@/features/search/MainSearchServer";
import Link from "next/link";
import HomeAboutSection from "@/components/home/home-about-section";
import {db} from "@/db/drizzle";
import {propertyTable} from "@/db/schema/property-table";
import {propertyImagesTable} from "@/db/schema/property-images-table";
import {offeringTypeTable} from "@/db/schema/offering-type-table";
import {asc, eq, and, desc} from "drizzle-orm";
import FeaturedListingsSectionServer from "@/features/site/Homepage/components/FeaturedListingsSectionServer";
import {communityTable, type CommunitySelect} from "@/db/schema/community-table";

// Local type for the homepage that matches CommunityType requirements
type HomepageCommunityType = {
    id: string;
    name: string;
    slug: string;
    image: string;
    label: string;
    propertyCount: number;
    metaTitle: string | null;
    metaDesc: string | null;
    about: string | null;
    createdAt: string;
    featured?: boolean;
    displayOrder?: number;
};
import React, { Suspense } from "react";
import NextDynamic from "next/dynamic";
import { PropertyType } from "@/types/property";
import { unstable_cache } from 'next/cache';
import { SearchSkeleton, FeaturedListingsSkeleton } from '@/components/ssr-skeletons';
import { SearchEnhancement } from './client-enhancement-wrapper';

// Client-side enhancements - loaded only when JavaScript is available
// Note: We'll render this in a client component wrapper
const DynamicExpandable = NextDynamic(() => import("@/features/site/components/carousel/expandable"), {
    loading: () => <div className="h-96 bg-gray-200 animate-pulse rounded-lg"></div>,
    ssr: true
});

// Hybrid rendering approach - works with and without JavaScript
export const dynamic = 'auto'; // Changed from 'force-static' to allow both SSR and CSR
export const revalidate = 3600; // Revalidate every hour

// Add the CommunityType interface for the communities section
interface CommunityType {
    id: string;
    name: string | null;
    label: string;
    image: string;
    slug: string;
    featured?: boolean;
    displayOrder?: number;
    propertyCount?: number;
    properties?: Array<{ id: string }>;
}

// Enhanced cached database queries with better error handling and cache optimization
const getOfferingTypes = unstable_cache(
    async () => {
        try {
            const [rentalType] = await db.select().from(offeringTypeTable).where(
                eq(offeringTypeTable.slug, 'for-rent')
            ).limit(1);

            const [saleType] = await db.select().from(offeringTypeTable).where(
                eq(offeringTypeTable.slug, 'for-sale')
            ).limit(1);

            return { rentalType, saleType };
        } catch (error) {
            console.error('Error fetching offering types:', error);
            // Return default types if database fails - ensures page still works
            return { 
                rentalType: { id: 'for-rent', slug: 'for-rent', name: 'For Rent' }, 
                saleType: { id: 'for-sale', slug: 'for-sale', name: 'For Sale' } 
            };
        }
    },
    ['offering-types'],
    {
        revalidate: 3600, // Revalidate every hour
        tags: ['offering-types']
    }
);

// Unified listings function that works for both rental and sale
const getListings = (offeringTypeId: string, limit: number = 3) => {
    return unstable_cache(
        async (offeringTypeId: string, limit: number) => {
            try {
                // First try to get featured properties
                let listings = await db.query.propertyTable.findMany({
                    where: and(
                        eq(propertyTable.offeringTypeId, offeringTypeId),
                        eq(propertyTable.isFeatured, true),
                        eq(propertyTable.status, 'published')
                    ),
                    orderBy: [desc(propertyTable.updatedAt), desc(propertyTable.createdAt)],
                    limit,
                    with: {
                        images: {
                            limit: 1,
                            orderBy: [asc(propertyImagesTable.order)],
                        },
                        developer: true,
                        community: true,
                        offeringType: true,
                        type: true,
                    }
                });

                // If no featured properties found, get the first available properties
                if (!listings || listings.length === 0) {
                    listings = await db.query.propertyTable.findMany({
                        where: and(
                            eq(propertyTable.offeringTypeId, offeringTypeId),
                            eq(propertyTable.status, 'published')
                        ),
                        orderBy: [desc(propertyTable.updatedAt), desc(propertyTable.createdAt)],
                        limit,
                        with: {
                            images: {
                                limit: 1,
                                orderBy: [asc(propertyImagesTable.order)],
                            },
                            developer: true,
                            community: true,
                            offeringType: true,
                            type: true,
                        }
                    });
                }

                return listings || [];
            } catch (error) {
                console.error(`Error fetching ${offeringTypeId} listings:`, error);
                return [];
            }
        },
        [`properties-${offeringTypeId}-${limit}`],
        {
            revalidate: 1800, // Revalidate every 30 minutes
            tags: ['properties', `offering-${offeringTypeId}`, 'featured']
        }
    )(offeringTypeId, limit);
};

const getCommunities = unstable_cache(
    async () => {
        try {
            // Fetch featured communities only, ordered by displayOrder
            const communities = await db.query.communityTable.findMany({
                where: eq(communityTable.featured, true),
                orderBy: [asc(communityTable.displayOrder), asc(communityTable.name)],
                limit: 10,
                with: {
                    properties: {
                        // Just to count them, we don't need the full property data
                        columns: {
                            id: true,
                        },
                    },
                },
            });

            // Transform to match expandable component requirements (only needs name, slug, image)
            return communities.map(community => {
                const { properties, ...communityData } = community;
                return {
                    id: communityData.id,
                    name: communityData.name || '',
                    slug: communityData.slug,
                    image: communityData.image || '',
                    label: communityData.label || communityData.name || '',
                    propertyCount: properties ? properties.length : 0,
                    metaTitle: communityData.metaTitle,
                    metaDesc: communityData.metaDesc,
                    about: communityData.about,
                    createdAt: communityData.createdAt || new Date().toISOString(),
                    featured: communityData.featured ?? undefined,
                    displayOrder: communityData.displayOrder ?? undefined,
                } as HomepageCommunityType;
            });
        } catch (error) {
            console.error('Error fetching communities:', error);
            return [];
        }
    },
    ['homepage-featured-communities'],
    {
        revalidate: 3600, // Revalidate every hour
        tags: ['communities', 'homepage', 'featured']
    }
);

export default async function Home() {
    try {
        // Use cached functions for better performance
        const { rentalType, saleType } = await getOfferingTypes();
        
        if (!rentalType || !saleType) {
            console.warn('Missing offering types, using defaults');
        }

        // Fetch listings in parallel for better performance with robust error handling
        const rentalTypeId = rentalType?.id || 'k370xottdduadd5pmclg9vax';
        const saleTypeId = saleType?.id || 'guwo8gsogptj5tj07exegp8g';
        
        const [rentalListings, saleListings, communities] = await Promise.allSettled([
            getListings(rentalTypeId, 3),
            getListings(saleTypeId, 3),
            getCommunities()
        ]);

        // Extract successful results or use empty arrays as fallbacks
        const finalRentalListings = rentalListings.status === 'fulfilled' ? rentalListings.value : [];
        const finalSaleListings = saleListings.status === 'fulfilled' ? saleListings.value : [];
        const finalCommunities = communities.status === 'fulfilled' ? communities.value : [];

        // Log any errors but don't fail the page
        if (rentalListings.status === 'rejected') {
            console.error('Error fetching rental listings:', rentalListings.reason);
        }
        if (saleListings.status === 'rejected') {
            console.error('Error fetching sale listings:', saleListings.reason);
        }
        if (communities.status === 'rejected') {
            console.error('Error fetching communities:', communities.reason);
        }

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
        }

        return (
            <div className={'relative min-h-screen'}>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{__html: JSON.stringify(webpageJsonLD)}}
                />

                {/* Main content with mobile-first hero section */}
                <main className="flex min-h-screen flex-col">
                    {/* Mobile-first hero section */}
                    <section className={'relative w-full h-[100vh] min-h-[500px] max-h-[800px] lg:h-screen'}>
                        <div className="relative w-full h-full">
                            <img 
                                className="object-cover absolute inset-0 w-full h-full" 
                                src="/dubai-real-estate-agents-hero_result.webp" 
                                alt="TRPE Home Image"
                            />
                        </div>
                        <div className={'absolute z-10 inset-0 bg-black/30'}>
                            <div className={'h-full flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8'}>
                                {/* Mobile-first title section */}
                                <div className={'text-center space-y-3 sm:space-y-4 lg:space-y-6 mb-6 sm:mb-8 lg:mb-12'}>
                                    <h1 className="font-display text-center text-2xl sm:text-3xl lg:text-4xl xl:text-6xl font-semibold text-white">
                                        The Real Property Experts
                                    </h1>
                    <div className="text-base sm:text-lg lg:text-xl xl:text-2xl text-white">
                        Your Gateway to Dubai&apos;s Real Estate Market
                    </div>
                </div>
                
                {/* Mobile-optimized search - Works both with and without JavaScript */}
                <div className="w-full max-w-4xl mx-auto">
                    {/* Suspense wrapper for better loading experience */}
                    <div data-server-search>
                        <Suspense fallback={<SearchSkeleton />}>
                            <MainSearchServer mode="general" />
                        </Suspense>
                    </div>
                    {/* Progressive enhancement for search functionality - positioned in hero */}
                    <SearchEnhancement mode="general" />
                </div>
            </div>
        </div>
    </section>

                    {/* Mobile-first featured listings with interactive tabs */}
                    <div className="w-full">
                        <Suspense fallback={<FeaturedListingsSkeleton />}>
                            <FeaturedListingsSectionServer
                                saleListings={finalSaleListings as any}
                                rentalListings={finalRentalListings as any}
                            />
                        </Suspense>
                    </div>

                    {/* Mobile-first about section */}
                    <div className="w-full">
                        <HomeAboutSection/>
                    </div>


                    {/* Hybrid Communities Section - Works both SSR and CSR */}
                    <section className="w-full bg-black">
                        <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
                            <div className="max-w-7xl mx-auto text-white">
                                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-6 lg:mb-8">
                                    Top Communities In Dubai
                                </h3>

                                {/* Desktop expandable carousel - Enhanced by client-side JS */}
                                <div className="hidden md:block">
                                    <DynamicExpandable 
                                        list={finalCommunities as any} 
                                        className="w-full min-w-72 mt-6 storybook-fix"
                                    />
                                </div>

                                {/* Mobile grid - Always works, enhanced by JavaScript */}
                                <div className="grid grid-cols-1 md:hidden gap-4 sm:gap-6 mt-6 lg:mt-8">
                                    {finalCommunities.slice(0, 6).map((community, index) => (
                                        <div key={community.id || index} className="relative h-[300px] sm:h-[350px] lg:h-[400px] w-full bg-white rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden">
                                            <img 
                                                className="object-cover absolute w-full h-full"
                                                src={community.image || 'https://trpe.ae/wp-content/uploads/2024/03/downtown-dxb_result.webp'}
                                                alt={community.label || community.name || ''}
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-black/30 hover:bg-black/50 transition-colors"/>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                                                <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-center">
                                                    {community.label || community.name}
                                                </h3>
                                                <Link 
                                                    href={`/communities/${community.slug}`}
                                                    className="border rounded-full py-2 sm:py-3 px-4 sm:px-6 border-white hover:bg-white hover:text-black bg-transparent font-semibold transition-colors min-h-[44px] flex items-center"
                                                >
                                                    View Community
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Mobile-first CTA button */}
                                <div className="flex justify-center mt-6 lg:mt-8">
                                    <Link 
                                        href="/communities"
                                        className="border rounded-full py-3 px-6 border-white hover:bg-white hover:text-black bg-transparent font-semibold transition-colors min-h-[44px] flex items-center"
                                    >
                                        View All Communities
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>                {/* Mobile-first "Why Invest in Dubai" section */}
                <section className="w-full bg-black">
                    <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
                        <div className="max-w-7xl mx-auto">
                            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                                {/* Content section - mobile first */}
                                <div className="w-full lg:w-1/2 space-y-4 lg:space-y-6">
                                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white mb-4 lg:mb-6">
                                        Why Invest in Dubai
                                    </h3>
                                    <p className="text-white text-sm sm:text-base leading-relaxed">
                                        Dubai is one of the most popular real estate markets in the world today. Investors from
                                        all over the world are buying properties in this fast-paced, visionary city.
                                    </p>
                                    <p className="text-white text-sm sm:text-base leading-relaxed">
                                        Lower property transfer fees, a higher net Return on Investment (ROI) than most other 
                                        property markets globally and the safety levels (especially due to the establishment of 
                                        escrow accounts) in the off-plan property market; collectively make Dubai a safe haven 
                                        for property investors.
                                    </p>
                                    <p className="text-white text-sm sm:text-base leading-relaxed">
                                        The recent amendments to residency regulations that saw the introduction of several 
                                        long-term and remote working visa categories, has led many people to move to Dubai. 
                                        The influx of new residents has led to an increase in demand in the property market.
                                    </p>

                                    <div className="pt-4 lg:pt-6">
                                        <Link
                                            className="border rounded-full px-4 sm:px-6 py-2 sm:py-3 bg-transparent text-white font-semibold hover:text-black hover:bg-white transition-colors min-h-[44px] flex items-center justify-center sm:inline-flex sm:w-auto"
                                            href="/properties"
                                        >
                                            View Properties
                                        </Link>
                                    </div>
                                </div>

                                {/* Images section - mobile optimized */}
                                <div className="w-full lg:w-1/2 mt-8 lg:mt-0">
                                    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                                        <div className="space-y-3 sm:space-y-4 lg:space-y-8">
                                            <div className="relative h-40 sm:h-52 lg:h-72 w-full">
                                                <img 
                                                    className="object-cover rounded-lg sm:rounded-xl lg:rounded-2xl border border-white/20 absolute w-full h-full"
                                                    src="https://cdn.trpe.ae/emirate-towers%20(1).webp"
                                                    alt="Dubai Emirates Towers"
                                                    loading="lazy"
                                                />
                                            </div>
                                            <div className="relative h-40 sm:h-52 lg:h-72 w-full">
                                                <img 
                                                    className="object-cover rounded-lg sm:rounded-xl lg:rounded-2xl border border-white/20 absolute w-full h-full"
                                                    src="https://cdn.trpe.ae/burj-arab_compressed%20(1).webp"
                                                    alt="Burj Al Arab"
                                                    loading="lazy"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3 sm:space-y-4 lg:space-y-8 -mt-8 sm:-mt-12 lg:-mt-24">
                                            <div className="relative h-40 sm:h-52 lg:h-72 w-full">
                                                <img 
                                                    className="object-cover rounded-lg sm:rounded-xl lg:rounded-2xl border border-white/20 absolute w-full h-full"
                                                    src="https://cdn.trpe.ae/home-3%20(1).webp"
                                                    alt="Dubai Real Estate"
                                                    loading="lazy"
                                                />
                                            </div>
                                            <div className="relative h-40 sm:h-52 lg:h-72 w-full">
                                                <img 
                                                    className="object-cover rounded-lg sm:rounded-xl lg:rounded-2xl border border-white/20 absolute w-full h-full"
                                                    src="https://cdn.trpe.ae/bur-khalifa-trpe.webp"
                                                    alt="Burj Khalifa"
                                                    loading="lazy"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>


            </main>
        </div>
    );
    } catch (error) {
        console.error('Critical error in home page:', error);
        // Return a robust fallback page that works without JavaScript
        return (
            <div className="min-h-screen bg-white">
                {/* Basic hero section fallback */}
                <section className="relative w-full h-[60vh] min-h-[400px] bg-black">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-white px-4">
                            <h1 className="text-3xl md:text-5xl font-bold mb-4">
                                The Real Property Experts
                            </h1>
                            <p className="text-lg md:text-xl mb-8">
                                Your Gateway to Dubai&apos;s Real Estate Market
                            </p>
                            <div className="space-y-4 md:space-y-0 md:space-x-4">
                                <Link 
                                    href="/properties" 
                                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full transition-colors"
                                >
                                    Browse Properties
                                </Link>
                                <Link 
                                    href="/contact-us" 
                                    className="inline-block border border-white text-white hover:bg-white hover:text-black font-semibold py-3 px-6 rounded-full transition-colors"
                                >
                                    Contact Us
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* Basic content fallback */}
                <section className="py-16 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-2xl font-bold mb-8">We&apos;re experiencing some technical difficulties</h2>
                        <p className="text-gray-600 mb-8">Please try refreshing the page or browse our properties directly.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Link href="/properties" className="block p-6 border rounded-lg hover:shadow-lg transition-shadow">
                                <h3 className="text-xl font-semibold mb-2">Browse Properties</h3>
                                <p className="text-gray-600">Explore our latest property listings</p>
                            </Link>
                            <Link href="/communities" className="block p-6 border rounded-lg hover:shadow-lg transition-shadow">
                                <h3 className="text-xl font-semibold mb-2">Communities</h3>
                                <p className="text-gray-600">Discover Dubai&apos;s top communities</p>
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}
