import React, {Suspense, cache} from 'react';
import Listings from "@/features/properties/components/Listings";
import {Metadata} from "next";
import {offeringTypeTable} from "@/db/schema/offering-type-table";
import {eq} from "drizzle-orm";
import {db} from "@/db/drizzle";
import PropertyPageSearchFilterOptimized from "@/features/search/PropertyPageSearchFilterOptimized";
import PropertyPageSearchFilterServer from '@/features/search/PropertyPageSearchFilterServer';
import {TipTapView} from "@/components/TiptapView";
import SearchPageH1Heading from "@/features/search/SearchPageH1Heading";
import {notFound} from "next/navigation";
import {validateRequest} from "@/actions/auth-session";
import {EditPageMetaSheet} from "@/features/admin/page-meta/components/EditPageMetaSheet";
import {pageMetaTable} from "@/db/schema/page-meta-table";
import {PageMetaType} from "@/features/admin/page-meta/types/page-meta-type";
import { unstable_cache } from 'next/cache';

// Enhanced cached database queries with aggressive caching for content that doesn't change often
const getPageMeta = cache(async (pathname: string): Promise<PageMetaType | null> => {
    return unstable_cache(
        async (pathname: string) => {
            try {
                return await db.query.pageMetaTable.findFirst({
                    where: eq(pageMetaTable.path, pathname)
                }) as unknown as PageMetaType;
            } catch (error) {
                console.error('Error fetching page meta:', error);
                return null;
            }
        },
        [`page-meta-${pathname}`],
        {
            revalidate: 7200, // 2 hours - page meta changes infrequently
            tags: ['page-meta', `page-meta-${pathname}`, 'properties-pages']
        }
    )(pathname);
});

const getOfferingType = cache(async (offering: string) => {
    return unstable_cache(
        async (offering: string) => {
            try {
                return await db.query.offeringTypeTable.findFirst({
                    where: eq(offeringTypeTable.slug, offering),
                });
            } catch (error) {
                console.error('Error fetching offering type:', error);
                return null;
            }
        },
        [`offering-type-${offering}`],
        {
            revalidate: 14400, // 4 hours - offering types rarely change
            tags: ['offering-types', `offering-type-${offering}`, 'properties-config']
        }
    )(offering);
});

// Enable static generation with revalidation for better performance
export const revalidate = 3600; // Revalidate every hour

export async function generateMetadata(): Promise<Metadata> {
    // Define the static pathname
    const pathname = "/properties/commercial-sale";
    
    // Check for pageMeta first using cached function
    const pageMeta = await getPageMeta(pathname);
    
    // Default metadata
    let title = "Commercial properties for sale in Dubai | Find Your Next Home";
    let description = "Browse the latest Dubai Commercial property for sale. Find your next home or investment in Dubai.";
    
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
            canonical: `${process.env.NEXT_PUBLIC_URL}/properties/commercial-sale`,
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



async function CommercialSalePage({searchParams}: Props) {

    const page = (await searchParams).page
    const { user } = await validateRequest();
    const offering = 'commercial-sale';
    
    // Define the static pathname
    const pathname = "/properties/commercial-sale";

    const pageMeta = await db.query.pageMetaTable.findFirst({
        where: eq(pageMetaTable.path, pathname)
    }) as unknown as PageMetaType;

    const offeringType = await db.query.offeringTypeTable.findFirst({
        where: eq(offeringTypeTable.slug, offering),
    })

    if (!offeringType) {
        return notFound();
    }
    
    let pageTitle = "Commercial Properties for Sale in Dubai";

    if (offeringType.pageTitle) {
        pageTitle = offeringType.pageTitle;
    }

    return (
        <div className={' bg-slate-100'}>
            <div className="hidden lg:block py-12 bg-black">

            </div>

            <PropertyPageSearchFilterOptimized offeringType='commercial-sale' />
            
            <div className="flex justify-between py-6 items-center pt-12 max-w-7xl px-6 lg:px-0 mx-auto ">
                <div className="flex space-x-2 items-center ">
                    <SearchPageH1Heading
                        heading={pageTitle}
                    />
                </div>
                
                {user && (
                    <div className="flex justify-end mt-4 px-6">
                        <EditPageMetaSheet
                            pageMeta={pageMeta}
                            pathname={pathname}
                        />
                    </div>
                )}
            </div>
            
            <Listings
                offeringType={'commercial-sale'}
                page={page}
            />

            {
                <div className="max-w-7xl bg-white mx-auto px-4 py-8">
                    <TipTapView content={pageMeta?.content}/>
                </div>
            }
        </div>
    );
}

export default CommercialSalePage;