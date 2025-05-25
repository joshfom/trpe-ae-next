import React, {Suspense, cache} from 'react';
import Listings from "@/features/properties/components/Listings";
import {Metadata} from "next";
import {offeringTypeTable} from "@/db/schema/offering-type-table";
import {eq} from "drizzle-orm";
import {db} from "@/db/drizzle";
import PropertyPageSearchFilterOptimized from "@/features/search/PropertyPageSearchFilterOptimized";
import {TipTapView} from "@/components/TiptapView";
import SearchPageH1Heading from "@/features/search/SearchPageH1Heading";
import {notFound} from "next/navigation";
import {validateRequest} from "@/actions/auth-session";
import {EditPageMetaSheet} from "@/features/admin/page-meta/components/EditPageMetaSheet";
import {headers} from "next/headers";
import {pageMetaTable} from "@/db/schema/page-meta-table";
import {PageMetaType} from "@/features/admin/page-meta/types/page-meta-type";

// Cached database queries for better performance
const getPageMeta = cache(async (pathname: string) => {
    try {
        return await db.query.pageMetaTable.findFirst({
            where: eq(pageMetaTable.path, pathname)
        }) as unknown as PageMetaType;
    } catch (error) {
        console.error('Error fetching page meta:', error);
        return null;
    }
});

const getOfferingType = cache(async (offering: string) => {
    try {
        return await db.query.offeringTypeTable.findFirst({
            where: eq(offeringTypeTable.slug, offering),
        });
    } catch (error) {
        console.error('Error fetching offering type:', error);
        return null;
    }
});

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const pathname = headersList.get("x-pathname") || "";
    
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
    
    // Get pathname from headers
    const headersList = await headers();
    const pathname = headersList.get("x-pathname") || "";

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