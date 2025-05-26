import React, {Suspense} from 'react';
import Listings from "@/features/properties/components/Listings";
import {Metadata, ResolvingMetadata} from "next";
import {offeringTypeTable} from "@/db/schema/offering-type-table";
import {eq} from "drizzle-orm";
import {db} from "@/db/drizzle";
import {propertyTypeTable} from "@/db/schema/property-type-table";
import {notFound} from "next/navigation";
import {TipTapView} from "@/components/TiptapView";
import {validateRequest} from "@/actions/auth-session";
import {EditPageMetaSheet} from "@/features/admin/page-meta/components/EditPageMetaSheet";
import {pageMetaTable} from "@/db/schema/page-meta-table";
import {PageMetaType} from "@/features/admin/page-meta/types/page-meta-type";


type Props = {
    params: Promise<{
        offeringType: string,
        propertyType: string
    }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}


export async function generateMetadata(
    {params, searchParams}: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    // read route params
    const propertyTypeSlug = (await params).propertyType

    // Construct pathname directly from URL parameters
    const pathname = `/property-types/${propertyTypeSlug}`;
    
    // Check for pageMeta first
    const pageMeta = await db.query.pageMetaTable.findFirst({
        where: eq(pageMetaTable.path, pathname)
    }) as unknown as PageMetaType | null;
    
    // Default description that will be used if pageMeta doesn't have one
    const description = `Browse exceptional 200+ properties in Dubai with TRPE. Your trusted experts for finding your dream home in this vibrant city.`;
    
    // If pageMeta exists with metaTitle, use it
    if (pageMeta?.metaTitle) {
        return {
            title: pageMeta.metaTitle,
            description: pageMeta?.metaDescription || description,
            alternates: {
                canonical: `${process.env.NEXT_PUBLIC_URL}/property-types/${(await params).propertyType}`,
            },
        };
    }

    const offeringType = await db.query.offeringTypeTable.findFirst({
        where: eq(offeringTypeTable.slug, propertyTypeSlug)
    }) as unknown as OfferingType;


    if (!offeringType) {
        return {
            title: 'Property not found',
            description: 'The offeringType you are looking for does not exist.',
        }
    }

    return {
        title: `Properties ${offeringType?.name} in Dubai | Find Your Next Home`,

        description: `Browse exceptional 200+ ${offeringType?.name} in Dubai with TRPE. Your trusted experts for finding your dream home in this vibrant city.`,
        alternates: {
            canonical: `${process.env.NEXT_PUBLIC_URL}/properties/${offeringType.slug}`,
        },
    }
}


interface PropertyTypePage {
    params: Promise<{
        propertyType: string;
        offeringType: string;
    }>,
    searchParams: Promise<{ [key: string]: string  | undefined }>
}


async function PropertyForRentPage(props: PropertyTypePage) {
    const params = await props.params;
    const { user } = await validateRequest();
    
    // Construct pathname directly from URL parameters
    const pathname = `/property-types/${params.propertyType}`;

    const pageMeta = await db.query.pageMetaTable.findFirst({
        where: eq(pageMetaTable.path, pathname)
    }) as unknown as PageMetaType;

    const page = (await props.searchParams).page;

    const slug = (await params).offeringType

    const [unitType] = await db.select().from(propertyTypeTable).where(
        eq(propertyTypeTable.slug, params.propertyType)
    ).limit(1);

    if (!unitType) {
        return notFound()
    }

    let about = ''

    if (slug === 'for-rent') {
        about = unitType.rentContent as string
    }

    if (slug === 'for-sale') {
        about = unitType.saleContent as string,
            about = unitType.saleContent as string
    }

    return (
        <div className={'bg-black lg:pt-20'}>
            <Listings
                propertyType={unitType.slug}
                page={page}
            />

            {user && (
                <div className="flex justify-end mt-4 px-6 max-w-7xl mx-auto">
                    <EditPageMetaSheet
                        pageMeta={pageMeta}
                        pathname={pathname}
                    />
                </div>
            )}

            {pageMeta?.content && (
                <div className="max-w-7xl bg-white mx-auto px-4 py-8">
                    <TipTapView content={pageMeta.content}/>
                </div>
            )}

        </div>
    );
}

export default PropertyForRentPage;