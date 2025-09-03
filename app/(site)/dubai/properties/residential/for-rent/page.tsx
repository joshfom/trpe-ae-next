import React from 'react';
import ListingsServer from "@/features/properties/components/ListingsServer";
import {Metadata, ResolvingMetadata} from "next";
import PropertyPageSearchFilter from '@/features/search/PropertyPageSearchFilter';
import {db} from "@/db/drizzle";
import {offeringTypeTable} from "@/db/schema/offering-type-table";
import {eq} from "drizzle-orm";
import {TipTapViewServer} from "@/components/TiptapViewServer";
import SearchPageH1Heading from "@/features/search/SearchPageH1Heading";
import {validateRequest} from "@/actions/auth-session";
import {EditPageMetaSheetServer} from "@/features/admin/page-meta/components/EditPageMetaSheetServer";
import {headers} from "next/headers";
import {pageMetaTable} from "@/db/schema/page-meta-table";
import {PageMetaType} from "@/features/admin/page-meta/types/page-meta-type";

export async function generateMetadata(): Promise<Metadata> {
    const headersList =  await headers();
    const pathname = headersList.get("x-pathname") || "";

    const pageMeta = await db.query.pageMetaTable.findFirst({
        where: eq(pageMetaTable.path, pathname)
    }) as unknown as PageMetaType | null;

    // Default metadata
    let title = "Properties for rent in Dubai | Find Your Next Home - TRPE AE";
    let description = "Browse exceptional 200+ properties for rent in Dubai with TRPE. Your trusted experts for finding your dream home in this vibrant city.";

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
            canonical: `${process.env.NEXT_PUBLIC_URL}/dubai/properties/residential/for-rent`,
        },
        robots: {
            index: pageMeta?.noIndex === true ? false : undefined,
            follow: pageMeta?.noFollow === true ? false : undefined,
        },
    };
}

type Props = {
    searchParams: Promise<{ [key: string]: string | undefined }>
};

async function PropertySearchPage({ searchParams }: Props) {
    const resolvedSearchParams = await searchParams;
    const page = resolvedSearchParams.page;
    const offering = 'for-rent';
    const { user } = await validateRequest();
    // Get pathname from headers - this is the approach set in your middleware.ts
    const headersList = await headers();
    const pathname = headersList.get("x-pathname") || "";

    const pageMeta = await db.query.pageMetaTable.findFirst({
        where: eq(pageMetaTable.path, pathname)
    }) as unknown as PageMetaType;

    const offeringType = await db.query.offeringTypeTable.findFirst({
        where: eq(offeringTypeTable.slug, offering),
    })

    let pageTitle = "Properties for rent in Dubai";
    if (offeringType?.pageTitle) {
        pageTitle = offeringType.pageTitle;
    }


       // If pageMeta exists with title and description, use those values
    if (pageMeta?.title) {
        pageTitle = pageMeta.title;
    }

    return (
        <div className={'bg-slate-50 min-h-screen'}>
            {/* Mobile-optimized search filter - Server Side Rendered */}
                        <PropertyPageSearchFilter offeringType='for-rent'/>
            
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
                <ListingsServer 
                    offeringType={'for-rent'}
                    searchParams={resolvedSearchParams}
                    page={page}
                    propertyType="residential"
                />
            </div>

            {/* Mobile-first content section */}
            {pageMeta?.content && (
                <div className="max-w-7xl bg-white mx-auto px-4 sm:px-6 lg:px-4 py-8 lg:py-12 mt-4 mb-8 rounded-t-lg lg:rounded-lg shadow-sm min-h-[400px] flex flex-col justify-center">
                    <div className="py-4 lg:py-8">
                        <TipTapViewServer content={pageMeta.content}/>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PropertySearchPage;