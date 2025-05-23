import React, {Suspense} from 'react';
import Listings from "@/features/properties/components/Listings";
import {Metadata, ResolvingMetadata} from "next";
import {offeringTypeTable} from "@/db/schema/offering-type-table";
import {eq} from "drizzle-orm";
import {db} from "@/db/drizzle";
import {notFound} from "next/navigation";
import {propertyTypeTable} from "@/db/schema/property-type-table";
import PropertyPageSearchFilter from "@/features/search/PropertyPageSearchFilter";
import {TipTapView} from "@/components/TiptapView";
import SearchPageH1Heading from "@/features/search/SearchPageH1Heading";
import {validateRequest} from "@/actions/auth-session";
import {EditPageMetaSheet} from "@/features/admin/page-meta/components/EditPageMetaSheet";
import {headers} from "next/headers";
import {pageMetaTable} from "@/db/schema/page-meta-table";
import {PageMetaType} from "@/features/admin/page-meta/types/page-meta-type";


type Props = {
    params: Promise<{ propertyType: string, offeringType: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
    {params}: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    // read route params
    const slug = (await params).propertyType
    
    // Get pathname from headers for pageMeta
    const headersList = await headers();
    const pathname = headersList.get("x-pathname") || "";
    
    // Check for pageMeta first
    const pageMeta = await db.query.pageMetaTable.findFirst({
        where: eq(pageMetaTable.path, pathname)
    }) as unknown as PageMetaType | null;
    
    // Default description that will be used if pageMeta doesn't have one
    const description = `Browse exceptional properties in Dubai with TRPE. Your trusted experts for finding your ideal property in this vibrant city.`;
    
    // If pageMeta exists with metaTitle, use it
    if (pageMeta?.metaTitle) {
        return {
            title: pageMeta.metaTitle,
            description: pageMeta?.metaDescription || description,
            alternates: {
                canonical: `${process.env.NEXT_PUBLIC_URL}/property-types/${slug}/${(await params).offeringType}`,
            },
        };
    }

    const propertyType = await db.query.propertyTypeTable.findFirst({
        where: eq(propertyTypeTable.slug, slug),
    }) as unknown as UnitType;

    const offeringType = await db.query.offeringTypeTable.findFirst({
        where: eq(offeringTypeTable.slug, (await params).offeringType),
    }) as unknown as OfferingType

    // optionally access and extend (rather than replace) parent metadata
    const previousImages = (await parent).openGraph?.images || []

    let cononicalSlug = 'for-sale'

    switch (offeringType?.slug) {
        case 'for-sale':
            cononicalSlug = 'for-sale';
            break;
        case 'for-rent':
            cononicalSlug = 'for-rent';
            break;
        case 'commercial-rent':
            cononicalSlug = 'for-rent';
            break;
        case 'commercial-sale':
            cononicalSlug = 'for-sale';
            break;
    }


    return {
        title: cononicalSlug === 'for-sale' ? propertyType?.saleMetaTitle : propertyType?.rentMetaTitle,
        description: cononicalSlug === 'for-sale' ? propertyType?.saleMetaDescription : propertyType?.rentMetaDescription,
        alternates: {
            canonical: `${process.env.NEXT_PUBLIC_URL}/property-types/${propertyType?.slug}/${offeringType?.slug}`,
        },
    }
}

interface PropertyTypeOfferingPageProps {
    params: Promise<{
        propertyType: string;
        offeringType: string;
    }>,
    searchParams: Promise<{ [key: string]: string  | undefined }>
}

async function PropertyTypeOfferingPage(props: PropertyTypeOfferingPageProps) {
    const params = await props.params;
    const { user } = await validateRequest();
    
    // Get pathname from headers
    const headersList = await headers();
    const pathname = headersList.get("x-pathname") || "";

    const pageMeta = await db.query.pageMetaTable.findFirst({
        where: eq(pageMetaTable.path, pathname)
    }) as unknown as PageMetaType;

    const offeringType = await db.query.offeringTypeTable.findFirst({
        where: eq(offeringTypeTable.slug, params.offeringType)
    });

    const unitType = await db.query.propertyTypeTable.findFirst({
        where: eq(propertyTypeTable.slug, params.propertyType)
    })


    const page = (await props.searchParams).page

    if (!offeringType) {
        return notFound()
    }

    if (!unitType) {
        return notFound()
    }

    let pageTitle = ''
    let about = '' as string | null;


   if (offeringType?.slug === 'for-sale') {
       about = unitType.saleContent as string | null;
         pageTitle = unitType.saleH1 as string || `${unitType?.name ? unitType.name : "Properties"} for Sale`;
   }


    if (offeringType?.slug === 'for-rent') {
         about = unitType.rentContent as string | null;
            pageTitle = unitType.rentH1 as string || `${unitType?.name ? unitType.name : "Properties"} for Rent`;
    }


    return (
        <div className={' bg-slate-100'}>
            <div className="hidden lg:block py-12 bg-black">

            </div>

            <PropertyPageSearchFilter
                offeringType={params?.offeringType}
                propertyType={params?.propertyType}
            />

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
                offeringType={params?.offeringType}
                propertyType={params.propertyType}
                page={page}
            />



            {pageMeta?.content ? (
                <div className="max-w-7xl bg-white mx-auto px-4 py-8">
                    <h2 className="text-2xl font-bold mb-4">
                        {pageMeta.title}
                    </h2>
                    <TipTapView content={pageMeta.content} />
                </div>
            ) : about ? (
                <div className="max-w-7xl bg-white mx-auto px-4 py-8">
                    <TipTapView content={about} />
                </div>
            ) : null}

        </div>
    );
}

export default PropertyTypeOfferingPage;