import React from 'react';
import PropertyListingsSection from "@/components/PropertyListingsSection";
import {Metadata} from "next";
import PropertyPageSearchFilter from '@/features/search/PropertyPageSearchFilter';
import {TipTapViewServer} from "@/components/TiptapViewServer";
import {db} from "@/db/drizzle";
import {eq} from "drizzle-orm";
import {offeringTypeTable} from "@/db/schema/offering-type-table";
import SearchPageH1Heading from "@/features/search/SearchPageH1Heading";
import {validateRequest} from "@/actions/auth-session";
import {EditPageMetaSheetServer} from "@/features/admin/page-meta/components/EditPageMetaSheetServer";
import {headers} from "next/headers";
import {pageMetaTable} from "@/db/schema/page-meta-table";
import {PageMetaType} from "@/features/admin/page-meta/types/page-meta-type";
import { generateMobileSEO, generateMobileViewport } from "@/lib/mobile/mobile-seo-optimization";

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const pathname = headersList.get("x-pathname") || "";

    const pageMeta = await db.query.pageMetaTable.findFirst({
        where: eq(pageMetaTable.path, pathname)
    }) as unknown as PageMetaType | null;

    // Default metadata
    let title = "Properties for sale in Dubai | Find Your Next Home - TRPE AE";
    let description = "Browse exceptional 200+ properties for sale in Dubai with TRPE. Your trusted experts for finding your dream home in this vibrant city.";

    // Override with pageMeta if available
    if (pageMeta?.metaTitle) {
        title = pageMeta.metaTitle;
    }
    
    if (pageMeta?.metaDescription) {
        description = pageMeta.metaDescription;
    }

    // Generate mobile-optimized SEO
    const mobileViewport = generateMobileViewport('property-search');
    const baseUrl = process.env.NEXT_PUBLIC_URL || '';

    return {
        title,
        description,
        alternates: {
            canonical: `${baseUrl}/dubai/properties/residential/for-sale`,
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
            description,
            type: 'website',
            url: `${baseUrl}/dubai/properties/residential/for-sale`,
            images: [{
                url: `${baseUrl}/dubai-properties-og.webp`,
                width: 1200,
                height: 630,
                alt: 'Properties for sale in Dubai'
            }]
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [`${baseUrl}/dubai-properties-twitter.webp`]
        }
    };
}

type Props = {
    searchParams: Promise<{ [key: string]: string | undefined }>
};

async function PropertySearchPage({ searchParams }: Props) {
    const resolvedSearchParams = await searchParams;
    const page = resolvedSearchParams.page;
    const offering = 'for-sale';
    const { user } = await validateRequest();
    // Get pathname from headers - this is the approach set in your middleware.ts
    const headersList = await headers();
    const pathname = headersList.get("x-pathname") || "";

    const pageMeta = await db.query.pageMetaTable.findFirst({
        where: eq(pageMetaTable.path, pathname)
    }) as unknown as PageMetaType;

    const offeringType = await db.query.offeringTypeTable.findFirst({
        where: eq(offeringTypeTable.slug, offering),
    });

    // Fetch properties data directly on the server
    const urlSearchParams = new URLSearchParams();
    Object.entries(resolvedSearchParams).forEach(([key, value]) => {
        if (typeof value === 'string') {
            urlSearchParams.append(key, value);
        }
    });

    // Import and use the server data fetching function
    const { getPropertiesServer } = await import("@/features/properties/api/get-properties-server");
    
    let propertiesData;
    try {
        propertiesData = await getPropertiesServer({
            offeringType: offering,
            propertyType: 'residential',
            searchParams: urlSearchParams,
            pathname,
            page
        });
    } catch (error) {
        console.error('Error fetching properties:', error);
        propertiesData = {
            properties: [],
            totalCount: 0,
            pages: [],
            metaLinks: null,
            error: 'Failed to load properties'
        };
    }

    let pageTitle = "Properties for sale in Dubai";
    if (offeringType?.pageTitle) {
        pageTitle = offeringType.pageTitle;
    }

    return (
        <div className={'bg-slate-50 min-h-screen'}>
            {/* Mobile-optimized search filter - Server Side Rendered */}
            <PropertyPageSearchFilter offeringType='for-sale'/>
            
            {/* Mobile-first heading and meta section */}
            <div className="flex flex-col lg:flex-row justify-between py-4 lg:py-6 items-start lg:items-center pt-6 lg:pt-12 max-w-7xl px-4 sm:px-6 lg:px-0 mx-auto gap-4">
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 items-start sm:items-center w-full lg:w-auto">
                    <SearchPageH1Heading
                        heading={pageTitle}
                    />
                </div>

                {user && (
                    <div className="flex justify-start lg:justify-end w-full lg:w-auto">
                        <EditPageMetaSheetServer
                            pageMeta={pageMeta}
                            pathname={pathname}
                        />
                    </div>
                )}
            </div>
            
            {/* Mobile-optimized listings section - Server Side Rendered */}
            <div className="px-4 sm:px-6 lg:px-0">
                <PropertyListingsSection 
                    properties={propertiesData.properties || []}
                    metaLinks={propertiesData.metaLinks}
                    error={propertiesData.error}
                    pathname={pathname}
                    searchParams={urlSearchParams}
                />
            </div>

            {/* Mobile-first content section */}
            {pageMeta?.content && (
                <div className="max-w-7xl bg-white mx-auto px-4 sm:px-6 lg:px-4 py-8 lg:py-12 mt-4 mb-8 rounded-t-lg lg:rounded-lg shadow-sm min-h-[400px] flex flex-col justify-center">
                    <div className="py-4 lg:py-8">
                        <TipTapViewServer content={pageMeta?.content}/>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PropertySearchPage;