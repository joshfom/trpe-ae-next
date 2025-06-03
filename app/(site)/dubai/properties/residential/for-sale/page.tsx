import React from 'react';
import Listings from "@/features/properties/components/Listings";
import {Metadata} from "next";
import PropertyPageSearchFilter from '@/features/search/PropertyPageSearchFilter';
import {TipTapView} from "@/components/TiptapView";
import {db} from "@/db/drizzle";
import {eq} from "drizzle-orm";
import {offeringTypeTable} from "@/db/schema/offering-type-table";
import SearchPageH1Heading from "@/features/search/SearchPageH1Heading";
import {validateRequest} from "@/actions/auth-session";
import {EditPageMetaSheet} from "@/features/admin/page-meta/components/EditPageMetaSheet";
import {headers} from "next/headers";
import {pageMetaTable} from "@/db/schema/page-meta-table";
import {PageMetaType} from "@/features/admin/page-meta/types/page-meta-type";

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

    return {
        title,
        description,
        alternates: {
            canonical: `${process.env.NEXT_PUBLIC_URL}/dubai/properties/residential/for-sale`,
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

    let pageTitle = "Properties for sale in Dubai";
    if (offeringType?.pageTitle) {
        pageTitle = offeringType.pageTitle;
    }

    return (
        <div className={'bg-slate-100'}>
            <div className="hidden lg:block py-12 bg-black">

            </div>
            <PropertyPageSearchFilter offeringType='for-sale' />
            
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
                offeringType={'for-sale'}
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

export default PropertySearchPage;