import React from 'react';
import Listings from "@/features/properties/components/Listings";
import {Metadata, ResolvingMetadata} from "next";
import PropertyPageSearchFilter from '@/features/search/PropertyPageSearchFilter';
import {db} from "@/db/drizzle";
import {eq} from "drizzle-orm";
import {offeringTypeTable} from "@/db/schema/offering-type-table";
import {TipTapView} from "@/components/TiptapView";
import SearchPageH1Heading from "@/features/search/SearchPageH1Heading";
import {validateRequest} from "@/actions/auth-session";
import {EditPageMetaSheet} from "@/features/admin/page-meta/components/EditPageMetaSheet";
import {headers} from "next/headers";
import {pageMetaTable} from "@/db/schema/page-meta-table";
import {PageMetaType} from "@/features/admin/page-meta/types/page-meta-type";
import { generateMobileSEO, generateMobileViewport } from "@/lib/mobile/mobile-seo-optimization";

export async function generateMetadata(props: {
    searchParams: Promise<{ [key: string]: string | undefined }>
}, parent: ResolvingMetadata): Promise<Metadata> {
    // Get pathname from headers for pageMeta
    const headersList = await headers();
    const pathname = headersList.get("x-pathname") || "";
    
    // Check for pageMeta first
    const pageMeta = await db.query.pageMetaTable.findFirst({
        where: eq(pageMetaTable.path, pathname)
    }) as unknown as PageMetaType | null;
    
    // Default description to use if not overridden
    const description = "Browse exceptional commercial properties for rent in Dubai with TRPE. Your trusted experts for finding your ideal business space in this vibrant city.";
    
    // Generate mobile-optimized SEO
    const mobileViewport = generateMobileViewport('property-search');
    const baseUrl = process.env.NEXT_PUBLIC_URL || '';
    
    // Default metadata
    let title = "Commercial properties for rent in Dubai | Find Your Next Business Space - TRPE AE";
    
    // Override with pageMeta if available
    if (pageMeta?.metaTitle) {
        title = pageMeta.metaTitle;
    }

    return {
        title,
        description: pageMeta?.metaDescription || description,
        alternates: {
            canonical: `${baseUrl}/dubai/properties/commercial/for-rent`,
        },
        robots: {
            index: pageMeta?.noIndex === true ? false : undefined,
            follow: pageMeta?.noFollow === true ? false : undefined,
        },
        viewport: {
            width: mobileViewport.width,
            initialScale: mobileViewport.initialScale,
            minimumScale: mobileViewport.minimumScale,
            maximumScale: mobileViewport.maximumScale,
            userScalable: mobileViewport.userScalable,
            viewportFit: mobileViewport.viewportFit,
        },
        openGraph: {
            title,
            description: pageMeta?.metaDescription || description,
            type: 'website',
            url: `${baseUrl}/dubai/properties/commercial/for-rent`,
            images: [{
                url: `${baseUrl}/dubai-commercial-rental-properties-og.webp`,
                width: 1200,
                height: 630,
                alt: 'Commercial properties for rent in Dubai'
            }]
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description: pageMeta?.metaDescription || description,
            images: [`${baseUrl}/dubai-commercial-rental-properties-twitter.webp`]
        }
    };
}

type Props = {
    searchParams: Promise<{ [key: string]: string  | undefined }>
};

async function PropertySearchPage({searchParams}: Props) {
    const resolvedSearchParams = await searchParams;
    const page = resolvedSearchParams.page;
    const { user } = await validateRequest();
    
    // Get pathname from headers
    const headersList = await headers();
    const pathname = headersList.get("x-pathname") || "";

    const pageMeta = await db.query.pageMetaTable.findFirst({
        where: eq(pageMetaTable.path, pathname)
    }) as unknown as PageMetaType;

    const offering = 'commercial-rent';

    const offeringType = await db.query.offeringTypeTable.findFirst({
        where: eq(offeringTypeTable.slug, offering),
    });

    let pageTitle = "Commercial properties for rent in Dubai";
    if (offeringType?.pageTitle) {
        pageTitle = offeringType.pageTitle;
    }

    // If pageMeta exists with title and description, use those values
    if (pageMeta?.title) {
        pageTitle = pageMeta.title;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile-first container with responsive padding */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                {/* Mobile-optimized search filter */}
                <div className="mb-6 sm:mb-8">
                    <div className="w-full">
                        <PropertyPageSearchFilter 
                            offeringType='commercial-rent'
                        />
                    </div>
                </div>
                
                {/* Mobile-first header section */}
                <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8">
                    <div className="flex-1">
                        <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                            <SearchPageH1Heading
                                heading={pageTitle}
                            />
                        </div>
                    </div>

                    {/* Admin controls - mobile-responsive */}
                    {user && (
                        <div className="flex justify-start sm:justify-end">
                            <EditPageMetaSheet
                                pageMeta={pageMeta}
                                pathname={pathname}
                            />
                        </div>
                    )}
                </div>
                
                {/* Mobile-optimized listings */}
                <div className="w-full">
                    <Listings
                        offeringType={'commercial-rent'}
                        searchParams={resolvedSearchParams}
                        page={page}
                    />
                </div>

                {/* Mobile-responsive content section */}
                {pageMeta?.content && (
                    <div className="mt-8 sm:mt-12 lg:mt-16 bg-white rounded-lg p-4 sm:p-6 lg:p-8">
                        <div className="prose prose-sm sm:prose lg:prose-lg max-w-none">
                            <TipTapView content={pageMeta.content}/>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PropertySearchPage;