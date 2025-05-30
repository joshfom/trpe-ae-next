import React, { cache } from 'react';
import Listings from "@/features/properties/components/Listings";
import {Metadata} from "next";
import {offeringTypeTable} from "@/db/schema/offering-type-table";
import {eq} from "drizzle-orm";
import {db} from "@/db/drizzle";
import PropertyPageSearchFilterOptimized from '@/features/search/PropertyPageSearchFilterOptimized';
import PropertyPageSearchFilterServer from '@/features/search/PropertyPageSearchFilterServer';
import {TipTapView} from "@/components/TiptapView";
import SearchPageH1Heading from "@/features/search/SearchPageH1Heading";
import {notFound} from "next/navigation";
import {validateRequest} from "@/actions/auth-session";
import {EditPageMetaSheet} from "@/features/admin/page-meta/components/EditPageMetaSheet";
import {pageMetaTable} from "@/db/schema/page-meta-table";
import {PageMetaType} from "@/features/admin/page-meta/types/page-meta-type";
import { unstable_cache } from 'next/cache';
import { Suspense } from 'react';
import { createAdvancedCache } from "@/lib/advanced-cache";
import { generateBreadcrumbStructuredData, generateOrganizationStructuredData, generateBreadcrumbSchema } from "@/lib/structured-data";
import { WebVitalsReporter } from "@/lib/web-vitals";

// Advanced caching for page metadata and offering types
const pageMetaCache = createAdvancedCache({
  keyPrefix: 'page-meta',
  memoryTTL: 1800000, // 30 minutes in memory
  diskTTL: 7200000,   // 2 hours on disk
  namespace: 'page-metadata'
});

const offeringTypeCache = createAdvancedCache({
  keyPrefix: 'offering-type',
  memoryTTL: 3600000, // 1 hour in memory
  diskTTL: 14400000,  // 4 hours on disk
  namespace: 'offering-types'
});

// Enhanced cached database queries with advanced caching layers
const getPageMeta = async (pathname: string): Promise<PageMetaType | null> => {
    return pageMetaCache.get(pathname, async () => {
        try {
            return await db.query.pageMetaTable.findFirst({
                where: eq(pageMetaTable.path, pathname)
            }) as unknown as PageMetaType;
        } catch (error) {
            console.error('Error fetching page meta:', error);
            return null;
        }
    });
};

const getOfferingType = async (offering: string) => {
    return offeringTypeCache.get(offering, async () => {
        try {
            return await db.query.offeringTypeTable.findFirst({
                where: eq(offeringTypeTable.slug, offering),
            });
        } catch (error) {
            console.error('Error fetching offering type:', error);
            return null;
        }
    });
};

// Enable static generation with revalidation for better performance
export const revalidate = 3600; // Revalidate every hour

export async function generateMetadata(): Promise<Metadata> {
    // Define the static pathname
    const pathname = "/properties/for-sale";
    
    // Check for pageMeta first using cached function
    const pageMeta = await getPageMeta(pathname);
    
    // Default metadata
    let title = "Properties for Sale in Dubai | Find Your Next Home";
    let description = "Browse the latest Dubai property for sale. Find your next home or investment in Dubai.";
    
    // Override with pageMeta if available
    if (pageMeta?.metaTitle) {
        title = pageMeta.metaTitle;
    }
    
    if (pageMeta?.metaDescription) {
        description = pageMeta.metaDescription;
    }

    return {
        title,
        description,
        alternates: {
            canonical: `${process.env.NEXT_PUBLIC_URL}/properties/for-sale`,
        },
        robots: {
            index: pageMeta?.noIndex === true ? false : undefined,
            follow: pageMeta?.noFollow === true ? false : undefined,
        },
    };
}


type Props = {
    searchParams: Promise<{ [key: string]: string  | undefined }>
};

async function PropertyForSalePage({searchParams}: Props) {

    const page = (await searchParams).page
    const { user } = await validateRequest();
    const offering = 'for-sale';
    
    // Define the static pathname
    const pathname = "/properties/for-sale";

    const pageMeta = await getPageMeta(pathname);
    const offeringType = await getOfferingType(offering);

    if (!offeringType) {
        return notFound();
    }
    
    let pageTitle = "Properties for Sale in Dubai";

    if (offeringType.pageTitle) {
        pageTitle = offeringType.pageTitle;
    }

    // Generate structured data
    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: 'Home', url: process.env.NEXT_PUBLIC_URL || '' },
        { name: 'Properties', url: `${process.env.NEXT_PUBLIC_URL}/properties` },
        { name: 'For Sale', url: `${process.env.NEXT_PUBLIC_URL}/properties/for-sale` }
    ]);

    const organizationSchema = generateOrganizationStructuredData();

    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [breadcrumbSchema, organizationSchema]
    };

    return (
        <>
            {/* Web Vitals Monitoring */}
            <WebVitalsReporter />
            
            {/* Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            
            <div className={' bg-slate-100'}>
            <div className="hidden lg:block py-12 bg-black">

            </div>

            {/* Server-side search filter with client enhancement */}
            <Suspense fallback={
                <div className="w-full h-16 bg-white border-b animate-pulse" />
            }>
                <PropertyPageSearchFilterServer offeringType='for-sale'/>
                <div className="hidden" suppressHydrationWarning>
                    <PropertyPageSearchFilterOptimized offeringType='for-sale'/>
                </div>
            </Suspense>
            
            <div className="flex justify-between py-6 items-center pt-12 max-w-7xl px-6 lg:px-0 mx-auto ">
                <div className="flex space-x-2 items-center ">
                    <SearchPageH1Heading
                        heading={pageTitle}
                    />
                </div>
                
                {user && (
                    <div className="flex justify-end mt-4 px-6">
                        <EditPageMetaSheet
                            pageMeta={pageMeta || undefined}
                            pathname={pathname}
                        />
                    </div>
                )}
            </div>
            
            {/* Server-side listings with enhanced caching */}
            <Suspense fallback={
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(9)].map((_, i) => (
                            <div key={i} className="h-64 bg-gray-200 animate-pulse rounded"></div>
                        ))}
                    </div>
                </div>
            }>
                <Listings
                    offeringType={'for-sale'}
                    page={page}
                />
            </Suspense>

            {pageMeta?.content && (
                <div className="max-w-7xl bg-white mx-auto px-4 py-8">
                    <TipTapView content={pageMeta.content}/>
                </div>
            )}
        </div>
        </>
    );
}

export default PropertyForSalePage;