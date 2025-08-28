import React from 'react';
import ListingsServer from "@/features/properties/components/ListingsServer";
import {Metadata, ResolvingMetadata} from "next";
import PropertyPageSearchFilterServer from '@/features/search/components/PropertyPageSearchFilterServer';
import {db} from "@/db/drizzle";
import {eq} from "drizzle-orm";
import {offeringTypeTable} from "@/db/schema/offering-type-table";
import {TipTapViewServer} from "@/components/TiptapViewServer";
import SearchPageH1Heading from "@/features/search/SearchPageH1Heading";
import {validateRequest} from "@/actions/auth-session";
import {EditPageMetaSheetServer} from "@/features/admin/page-meta/components/EditPageMetaSheetServer";
import {headers} from "next/headers";
import {pageMetaTable} from "@/db/schema/page-meta-table";
import {PageMetaType} from "@/features/admin/page-meta/types/page-meta-type";
import { generateMobileSEO, generateMobileViewport } from "@/lib/mobile/mobile-seo-optimization";

type Props = {
    searchParams: Promise<{ [key: string]: string | undefined }>
};

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
    const description = "Browse exceptional commercial properties for sale in Dubai with TRPE. Your trusted experts for finding your ideal business investment in this vibrant city.";
    
    // Generate mobile-optimized SEO
    const mobileViewport = generateMobileViewport('property-search');
    const baseUrl = process.env.NEXT_PUBLIC_URL || '';
    
    // Default metadata
    let title = "Commercial properties for sale in Dubai | Find Your Next Investment - TRPE AE";
    
    // Override with pageMeta if available
    if (pageMeta?.metaTitle) {
        title = pageMeta.metaTitle;
    }

    return {
        title,
        description: pageMeta?.metaDescription || description,
        alternates: {
            canonical: `${baseUrl}/dubai/properties/commercial/for-sale`,
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
            url: `${baseUrl}/dubai/properties/commercial/for-sale`,
            images: [{
                url: `${baseUrl}/dubai-commercial-properties-og.webp`,
                width: 1200,
                height: 630,
                alt: 'Commercial properties for sale in Dubai'
            }]
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description: pageMeta?.metaDescription || description,
            images: [`${baseUrl}/dubai-commercial-properties-twitter.webp`]
        }
    };
}

async function PropertySearchPage({ searchParams }: Props) {
    const resolvedSearchParams = await searchParams;
    const page = resolvedSearchParams.page;
    const { user } = await validateRequest();
    // Get pathname from headers - this is the approach set in your middleware.ts
    const headersList = await headers();
    const pathname = headersList.get("x-pathname") || "";

    const pageMeta = await db.query.pageMetaTable.findFirst({
        where: eq(pageMetaTable.path, pathname)
    }) as unknown as PageMetaType;

    const offering = 'commercial-sale';

    const offeringType = await db.query.offeringTypeTable.findFirst({
        where: eq(offeringTypeTable.slug, offering),
    })

    let pageTitle = "Commercial properties for sale in Dubai";
    if (offeringType?.pageTitle) {
        pageTitle = offeringType.pageTitle;
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Mobile-first container - no extra spacing needed as layout handles it */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Mobile-optimized search filter */}
                <div className="mb-6 sm:mb-8">
                    <div className="w-full">
                        <PropertyPageSearchFilterServer 
                            offeringType='commercial-sale'
                            searchParams={new URLSearchParams(resolvedSearchParams as Record<string, string>)}
                            pathname={pathname}
                        />
                    </div>
                </div>
                
                {/* Mobile-first heading and meta section */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 sm:mb-8 gap-4">
                    <div className="flex-1">
                        <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                            <SearchPageH1Heading
                                heading={pageTitle}
                            />
                        </div>
                    </div>

                    {/* Admin controls - mobile-responsive */}
                    {user && (
                        <div className="flex justify-start lg:justify-end">
                            <EditPageMetaSheetServer
                                pageMeta={pageMeta}
                                pathname={pathname}
                            />
                        </div>
                    )}
                </div>
                
                {/* Mobile-optimized listings section */}
                <div className="w-full">
                    <ListingsServer 
                        offeringType={'commercial-sale'}
                        searchParams={resolvedSearchParams}
                        page={page}
                        propertyType="commercial"
                    />
                </div>

                {/* Mobile-responsive content section */}
                {pageMeta?.content && (
                    <div className="mt-8 sm:mt-12 lg:mt-16 bg-white rounded-lg p-4 sm:p-6 lg:p-8">
                        <div className="prose prose-sm sm:prose lg:prose-lg max-w-none">
                            <TipTapViewServer content={pageMeta.content}/>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PropertySearchPage;