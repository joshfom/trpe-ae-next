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
import { getFooterCommunities } from '@/actions/get-footer-communities-action';

// Dynamic imports for better code splitting - SSR compatible
const DynamicExpandable = NextDynamic(() => import("@/features/site/components/carousel/expandable"), {
    loading: () => <div className="h-96 bg-gray-200 animate-pulse rounded-lg"></div>,
    ssr: true
});

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
    const [rentalListings, saleListings, communities, footerCommunities] = await Promise.all([
        getListings(rentalType.id, 3),
        getListings(saleType.id, 3),
        getCommunities(),
        getFooterCommunities()
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
        <div className={'relative'}>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{__html: JSON.stringify(webpageJsonLD)}}
            />

            <SiteTopNavigation/>
            {/*<MainNav />*/}
            <main className="flex min-h-screen flex-col items-center relative">
                <section className={'relative w-full h-[350px] lg:h-screen '}>
                    <div className="relative w-full h-[350px] lg:h-screen">
                        <Image fill={true} className={'object-cover'} src={'/dubai-real-estate-agents-hero_result.webp'}
                               alt={'TRPE Home Image'}/>
                    </div>
                    <div className={'absolute z-0 inset-0 bg-black/30'}>
                        <div className={'max-w-7xl mx-auto h-full flex flex-col justify-center items-center'}>
                            <div className={'hidden lg:block space-y-4 pb-12'}>
                                <h1
                                    className="font-display text-center text-4xl font-semibold   text-white md:text-6xl"
                                >
                                    The Real Property Experts
                                </h1>

                                <WordPullUp
                                    className="text-2xl text-white"
                                    words="Your Gateway to Dubai&apos;s Real Estate Market"
                                />
                            </div>
                            {/* Server-rendered search with client enhancement */}
                            <Suspense fallback={<SearchSkeleton />}>
                                <MainSearchServer mode="general" />
                                <SearchEnhancement mode="general" />
                            </Suspense>

                        </div>

                    </div>


                </section>

                <Suspense fallback={<FeaturedListingsSkeleton />}>
                    <FeaturedListingsSectionServer
                        saleListings={saleListings}
                        rentalListings={rentalListings}
                    />
                </Suspense>


                {/* ABOUT SECTION */}
                <HomeAboutSection/>


                {/*COMMUNITIES SECTION     */}

                <section className="pt-12 w-full bg-black">

                    <div className="max-w-7xl mx-auto pb-12 px-6 xl:px-0 text-white">
                        <h3 className="text-4xl font-semibold py-4">
                            Top Communities In Dubai
                        </h3>

                        <DynamicExpandable list={communities} className="w-full hidden md:flex  min-w-72 mt-6 storybook-fix"/>

                        <div className="grid grid-cols-1 md:hidden gap-6 mt-8 py-6">
                            {
                                communities.map((community, index) => {
                                    return (
                                        <div key={index}
                                             className="relative h-[400px] w-full bg-white rounded-2xl overflow-hidden">
                                            <Image fill={true} className={'object-cover'}
                                                   src={community.image || 'https://trpe.ae/wp-content/uploads/2024/03/downtown-dxb_result.webp'}
                                                   alt={community.label}/>
                                            <div
                                                className="absolute inset-0 bg-black/30 hover:bg-black"/>
                                            <div
                                                className="absolute inset-0 flex flex-col items-center justify-center text-white">
                                                <h3 className="text-2xl font-semibold">
                                                    {community.label}
                                                </h3>
                                                <div className="pt-4">
                                                    <Link href={`/communities/${community.slug}`}
                                                          className={'border rounded-full py-2 border-white hover:bg-white hover:text-black px-6 bg-transparent font-semibold '}>
                                                        View Community
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>

                        <div className=" py-6 w-full mt-6 flex justify-center">
                            <Link href={'/communities'}
                                  className={'border rounded-full py-2 border-white hover:bg-white hover:text-black px-6 bg-transparent font-semibold '}>
                                View All Communities
                            </Link>
                        </div>
                    </div>
                </section>




                <section
                    className={'w-full px-6 bg-black py-12 z-20'}>
                    <div className="max-w-7xl  mx-auto flex flex-col pt-36 lg:flex-row gap-12 pb-12">
                        <div className={'py-12 w-full lg:w-1/2 space-y-4 lg:pr-12'}>
                            <h3 className="text-4xl pb-4 font-semibold text-white">
                                Why Invest in Dubai
                            </h3>
                            <p className={'text-white'}>
                                Dubai is one of the most popular real estate markets in the world today. Investors from
                                all over the world are buying properties in this fast-paced, visionary city.
                            </p>
                            <p className={'text-white'}> Lower property transfer fees, a higher net Return on Investment
                                (ROI) than most other property markets globally and the safety levels (especially due to
                                the establishment of escrow accounts) in the off-plan property market; collectively make
                                Dubai a safe haven for property investors.
                            </p>
                            <p className={'text-white'}>The recent amendments to residency regulations that saw the
                                introduction of several long-term and remote working visa categories, has led many
                                people to move to Dubai. The influx of new residents has led to an increase in demand in
                                the property market.
                            </p>


                            <div className="pt-6">
                                <Link
                                    className={'border rounded-full px-6  py-2 bg-transparent text-white font-semibold hover:text-black hover:bg-white'}
                                    href={'/communities'}>
                                    View Properties
                                </Link>
                            </div>
                        </div>
                        <div className={'grid grid-cols-2 gap-2 lg:gap-6 pt-24 lg:pt-0 w-full lg:w-1/2'}>
                            <div className={'space-y-3 lg:space-y-8'}>

                                <div className="relative h-72 w-72">
                                    <Image 
                                        className={'object-cover rounded-2xl broder border-white'}
                                        src="/images/emirate-towers.webp"
                                        alt="invest"
                                        fill
                                        sizes="(max-width: 768px) 100vw, 288px"
                                    />
                                </div>
                                <div className="relative h-72 w-72">
                                    <Image 
                                        className={'object-cover rounded-2xl broder border-white'}
                                        src="/images/burj-arab.webp"
                                        alt="invest"
                                        fill
                                        sizes="(max-width: 768px) 100vw, 288px"
                                    />
                                </div>

                            </div>
                            <div className={' space-y-3 lg:space-y-8 -mt-24'}>

                                <div className="relative h-72 w-72">
                                    <Image 
                                        className={'object-cover rounded-2xl broder border-white'}
                                        src="/images/home-3.jpg"
                                        alt="invest"
                                        fill
                                        sizes="(max-width: 768px) 100vw, 288px"
                                    />
                                </div>
                                <div className="relative h-72 w-72">
                                    <Image 
                                        className={'object-cover rounded-2xl broder border-white'}
                                        src="/images/bur-khalifa.webp"
                                        alt="invest"
                                        fill
                                        sizes="(max-width: 768px) 100vw, 288px"
                                    />
                                </div>


                            </div>
                        </div>
                    </div>

                </section>


                <SiteFooter communities={footerCommunities}/>


            </main>
        </div>

    );
}
