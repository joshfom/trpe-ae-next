import React, {Suspense} from 'react';
import Listings from "@/features/properties/components/Listings";
import {Metadata, ResolvingMetadata} from "next";
import PropertyPageSearchFilter from '@/features/search/PropertyPageSearchFilter';
import {db} from "@/db/drizzle";
import {eq} from "drizzle-orm";
import {communityTable} from "@/db/schema/community-table";
import {prepareExcerpt} from "@/lib/prepare-excerpt";
import {propertyTypeTable} from "@/db/schema/property-type-table";
import {offeringTypeTable} from "@/db/schema/offering-type-table";
import {TipTapView} from "@/components/TiptapView";
import SearchPageH1Heading from "@/features/search/SearchPageH1Heading";
import {validateRequest} from "@/actions/auth-session";
import {EditPageMetaSheet} from "@/features/admin/page-meta/components/EditPageMetaSheet";
import {headers} from "next/headers";
import {pageMetaTable} from "@/db/schema/page-meta-table";
import {PageMetaType} from "@/features/admin/page-meta/types/page-meta-type";

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
    const description = "Browse exceptional 200+ properties for rent in Dubai with TRPE. Your trusted experts for finding your dream home in this vibrant city.";
    
    // If pageMeta exists with metaTitle, use it
    if (pageMeta?.metaTitle) {
        return {
            title: pageMeta.metaTitle,
            description: pageMeta?.metaDescription || description,
            alternates: {
                canonical: `${process.env.NEXT_PUBLIC_URL}/dubai/properties/commercial/for-rent`,
            },
            robots: {
                index: pageMeta?.noIndex === true ? false : undefined,
                follow: pageMeta?.noFollow === true ? false : undefined,
            },
        };
    }

    // Default metadata if no pageMeta found
    return {
        title: "Properties for rent in Dubai | Find Your Next Home - TRPE AE",
        description: "Browse exceptional 200+ properties for rent in Dubai with TRPE. Your trusted experts for finding your dream home in this vibrant city.",
        alternates: {
            canonical: `${process.env.NEXT_PUBLIC_URL}/dubai/properties/commercial/for-rent`,
        },
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
        <div className={'bg-slate-100'}>
            <div className="hidden lg:block py-12 bg-black">

            </div>
            <PropertyPageSearchFilter offeringType='commercial-rent' />
            
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
                offeringType={'commercial-rent'}
                searchParams={resolvedSearchParams}
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