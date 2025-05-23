import 'swiper/css';
import MainSearch from "@/features/search/MainSearch";
import SiteFooter from "@/components/site-footer";
import SiteTopNavigation from "@/components/site-top-navigation";
import Link from "next/link";
import HomeAboutSection from "@/components/home/home-about-section";
import {db} from "@/db/drizzle";
import {propertyTable} from "@/db/schema/property-table";
import {offeringTypeTable} from "@/db/schema/offering-type-table";
import {asc, eq} from "drizzle-orm";
import FeaturedListingsSection from "@/features/site/Homepage/components/FeaturedListingsSection";
import Image from "next/image"
import {communityTable} from "@/db/schema/community-table";
import React from "react";
import Expandable from "@/features/site/components/carousel/expandable";
import WordPullUp from "@/features/site/components/WordPullUp";


export const dynamic = 'force-dynamic';
export default async function Home() {

    const [rentalType] = await db.select().from(offeringTypeTable).where(
        eq(offeringTypeTable.slug, 'for-rent')
    ).limit(1);

    const [saleType] = await db.select().from(offeringTypeTable).where(
        eq(offeringTypeTable.slug, 'for-sale')
    ).limit(1);


    const rentalListings = await db.query.propertyTable.findMany({
        where: eq(propertyTable.offeringTypeId, rentalType.id),
        limit: 3,
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

    const saleListings = await db.query.propertyTable.findMany({
        where: eq(propertyTable.offeringTypeId, saleType.id),
        limit: 3,
        with: {
            images: true,
            agent: true,
            community: true,
            city: true,
            subCommunity: true,
            offeringType: true,
            type: true
        }
    }) as unknown as PropertyType[];


    const communities = await db.query.communityTable.findMany({
        orderBy: [asc(communityTable.createdAt)],
        limit: 8,
    }) as unknown as CommunityType[];


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

                            <MainSearch/>

                        </div>

                    </div>


                </section>

                <FeaturedListingsSection
                    saleListings={saleListings}
                    rentalListings={rentalListings}
                />


                {/* ABOUT SECTION */}
                <HomeAboutSection/>


                {/*COMMUNITIES SECTION     */}

                <section className="pt-12 w-full bg-black">

                    <div className="max-w-7xl mx-auto pb-12 px-6 xl:px-0 text-white">
                        <h3 className="text-4xl font-semibold py-4">
                            Top Communities In Dubai
                        </h3>

                        <Expandable list={communities} className="w-full hidden md:flex  min-w-72 mt-6 storybook-fix"/>

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


                <SiteFooter/>


            </main>
        </div>

    );
}
