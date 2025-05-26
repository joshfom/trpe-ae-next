import React, {Suspense} from 'react';
import Listings from "@/features/properties/components/Listings";
import {Metadata} from "next";
import PropertyPageSearchFilter from '@/features/search/PropertyPageSearchFilter';
import {db} from "@/db/drizzle";
import {offeringTypeTable} from "@/db/schema/offering-type-table";
import {eq} from "drizzle-orm";
import {TipTapView} from "@/components/TiptapView";
import SearchPageH1Heading from "@/features/search/SearchPageH1Heading";
import {validateRequest} from "@/actions/auth-session";
import {EditPageMetaSheet} from "@/features/admin/page-meta/components/EditPageMetaSheet";
import {pageMetaTable} from "@/db/schema/page-meta-table";
import {PageMetaType} from "@/features/admin/page-meta/types/page-meta-type";

export async function generateMetadata(): Promise<Metadata> {
    // Define the static pathname
    const pathname = "/dubai/properties/residential/for-rent";
    
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
    const page = (await searchParams).page;
    const offering = 'for-rent';
    const { user } = await validateRequest();
    // Define the static pathname
    const pathname = "/dubai/properties/residential/for-rent";
    
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
        <div className={'bg-slate-100'}>
            <div className="hidden lg:block py-12 bg-black">

            </div>
            <PropertyPageSearchFilter offeringType='for-rent' />
            
            <div className="flex justify-between py-6 items-center pt-12 max-w-7xl px-6 lg:px-0 mx-auto">
                <div className="flex space-x-2 items-center">
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
                offeringType={'for-rent'}
                page={page}
            />

            {pageMeta?.content && (
                <div className="max-w-7xl bg-white mx-auto px-4 py-8">
                    <TipTapView content={pageMeta.content}/>
                </div>
            )}
        </div>
    );
}

export default PropertySearchPage;