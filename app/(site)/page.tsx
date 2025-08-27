import 'swiper/css';
import MainSearchServer from "@/features/search/MainSearchServer";
import MainSearchSSR from "@/components/main-search-ssr";
import SearchEnhancer from "@/components/search-enhancer";
import SearchEnhancement from "@/features/search/SearchEnhancement";
import Link from "next/link";
import HomeAboutSection from "@/components/home/home-about-section";
import {db} from "@/db/drizzle";
import {propertyTable} from "@/db/schema/property-table";
import {offeringTypeTable} from "@/db/schema/offering-type-table";
import {asc, eq} from "drizzle-orm";
import FeaturedListingsSectionServer from "@/features/site/Homepage/components/FeaturedListingsSectionServer";
import {communityTable} from "@/db/schema/community-table";
import React, { cache, Suspense } from "react";
import { PropertyType } from "@/types/property";
import { unstable_cache } from 'next/cache';
import { SearchSkeleton, FeaturedListingsSkeleton } from '@/components/ssr-skeletons';

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

// Cached database queries with Next.js cache for better performance and SSR optimization
const getOfferingTypes = cache(async () => {
    return unstable_cache(
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
                return { rentalType: null, saleType: null };
            }
        },
        ['offering-types'],
        {
            revalidate: 3600, // Revalidate every hour
            tags: ['offering-types']
        }
    )();
});

const getListings = cache(async (offeringTypeId: string, limit: number = 3): Promise<PropertyType[]> => {
    return unstable_cache(
        async (offeringTypeId: string, limit: number) => {
            try {
                return await db.query.propertyTable.findMany({
                    where: eq(propertyTable.offeringTypeId, offeringTypeId),
                    limit,
                    with: {
                        images: true,
                        agent: true,
                        community: true,
                        city: true,
                        subCommunity: true,
                        offeringType: true,
                        type: true,
                    }
                }) as unknown as PropertyType[];
            } catch (error) {
                console.error('Error fetching listings:', error);
                return [];
            }
        },
        [`listings-${offeringTypeId}-${limit}`],
        {
            revalidate: 1800, // Revalidate every 30 minutes
            tags: ['listings', `offerings-${offeringTypeId}`]
        }
    )(offeringTypeId, limit);
});

const getCommunities = cache(async () => {
    return unstable_cache(
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

                // Transform to match CommunityType by adding propertyCount
                return communities.map(community => ({
                    ...community,
                    propertyCount: community.properties ? community.properties.length : 0,
                    // Remove the properties array since we just needed it for counting
                    properties: undefined
                })) as unknown as CommunityType[];
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
    )();
});

// Enable static generation with revalidation
export const revalidate = 3600; // Revalidate every hour
export default async function Home() {
    // Use cached functions for better performance
    const { rentalType, saleType } = await getOfferingTypes();
    
    if (!rentalType || !saleType) {
        return <div>Error loading page data</div>;
    }

    // Fetch listings in parallel for better performance
    const [rentalListings, saleListings, communities] = await Promise.all([
        getListings(rentalType.id, 3),
        getListings(saleType.id, 3),
        getCommunities()
    ]);

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
            
            {/* Mobile-optimized search */}
            <div className="w-full max-w-4xl mx-auto">
                {/* SSR Search - Works without JavaScript, hidden when JS loads */}
                <div id="ssr-search">
                    <MainSearchSSR />
                </div>
                {/* Client Enhancement - Shows interactive search with type switching and dropdowns */}
                <div id="csr-search" className="hidden">
                    <Suspense fallback={<SearchSkeleton />}>
                        <MainSearchServer mode="general" />
                        <SearchEnhancement mode="general" />
                    </Suspense>
                </div>
            </div>
        </div>
    </div>
</section>

                {/* Mobile-first featured listings */}
                <div className="w-full">
                    <FeaturedListingsSectionServer
                        saleListings={saleListings}
                        rentalListings={rentalListings}
                    />
                </div>

                {/* Mobile-first about section */}
                <div className="w-full">
                    <HomeAboutSection/>
                </div>


                {/* Mobile-first communities section */}
                <section className="w-full bg-white">
                    {/* Static communities grid - Works without JavaScript */}
                    <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
                        <div className="max-w-7xl mx-auto">
                            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-6 lg:mb-8 text-gray-900">
                                Top Communities In Dubai
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mt-6 lg:mt-8">
                                {communities.slice(0, 8).map((community, index) => (
                                    <div key={community.id || index} className="relative h-[300px] sm:h-[350px] lg:h-[400px] w-full bg-white rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden shadow-lg">
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

                            <div className="flex justify-center mt-6 lg:mt-8">
                                <Link 
                                    href="/communities"
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full transition-colors min-h-[44px] flex items-center"
                                >
                                    View All Communities
                                </Link>
                            </div>
                        </div>
                    </div>
                    {/* Client Enhancement - Adds carousel and interactions */}
                    <div className="hidden" data-client-enhancement>
                        <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
                            <div className="max-w-7xl mx-auto text-white">
                                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-6 lg:mb-8">
                                    Top Communities In Dubai
                                </h3>

                                {/* Desktop expandable carousel - Hidden for SSR, will be enhanced by client */}
                                <div className="hidden md:flex">
                                    <div className="text-center py-8">
                                        <p className="text-gray-400 mb-4">Interactive community carousel requires JavaScript.</p>
                                        <Link 
                                            href="/communities"
                                            className="text-blue-400 hover:text-blue-300 underline"
                                        >
                                            View all communities
                                        </Link>
                                    </div>
                                </div>

                                {/* Mobile grid - Works without JavaScript */}
                                <div className="grid grid-cols-1 md:hidden gap-4 sm:gap-6 mt-6 lg:mt-8">
                                    {communities.map((community, index) => (
                                        <div key={index} className="relative h-[300px] sm:h-[350px] lg:h-[400px] w-full bg-white rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden">
                                            <img 
                                                className="object-cover absolute w-full h-full"
                                                src={community.image || 'https://trpe.ae/wp-content/uploads/2024/03/downtown-dxb_result.webp'}
                                                alt={community.label}
                                            />
                                            <div className="absolute inset-0 bg-black/30 hover:bg-black/50 transition-colors"/>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                                                <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-center">
                                                    {community.label}
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
                    </div>
                </section>

                {/* Mobile-first "Why Invest in Dubai" section */}
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
                                                    src="/images/emirate-towers.webp"
                                                    alt="Dubai Emirates Towers"
                                                />
                                            </div>
                                            <div className="relative h-40 sm:h-52 lg:h-72 w-full">
                                                <img 
                                                    className="object-cover rounded-lg sm:rounded-xl lg:rounded-2xl border border-white/20 absolute w-full h-full"
                                                    src="/images/burj-arab.webp"
                                                    alt="Burj Al Arab"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3 sm:space-y-4 lg:space-y-8 -mt-8 sm:-mt-12 lg:-mt-24">
                                            <div className="relative h-40 sm:h-52 lg:h-72 w-full">
                                                <img 
                                                    className="object-cover rounded-lg sm:rounded-xl lg:rounded-2xl border border-white/20 absolute w-full h-full"
                                                    src="/images/home-3.jpg"
                                                    alt="Dubai Real Estate"
                                                />
                                            </div>
                                            <div className="relative h-40 sm:h-52 lg:h-72 w-full">
                                                <img 
                                                    className="object-cover rounded-lg sm:rounded-xl lg:rounded-2xl border border-white/20 absolute w-full h-full"
                                                    src="/images/bur-khalifa.webp"
                                                    alt="Burj Khalifa"
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
           {/* Progressive enhancement for search functionality */}
           <SearchEnhancer />
        </div>
    );
}
