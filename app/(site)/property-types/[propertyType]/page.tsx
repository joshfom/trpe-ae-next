import React from 'react';
import Listings from "@/features/properties/components/Listings";
import {Metadata, ResolvingMetadata} from "next";
import {eq} from "drizzle-orm";
import {db} from "@/db/drizzle";
import {propertyTypeTable} from "@/db/schema/property-type-table";
import {notFound} from "next/navigation";
import {TipTapView} from "@/components/TiptapView";
import {validateRequest} from "@/actions/auth-session";
import {EditPageMetaSheet} from "@/features/admin/page-meta/components/EditPageMetaSheet";
import {headers} from "next/headers";
import {pageMetaTable} from "@/db/schema/page-meta-table";
import {PageMetaType} from "@/features/admin/page-meta/types/page-meta-type";


type Props = {
    params: Promise<{
        propertyType: string
    }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}


export async function generateMetadata(
    {params, searchParams}: Props,
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
    const description = `Browse exceptional 200+ properties in Dubai with TRPE. Your trusted experts for finding your dream home in this vibrant city.`;
    
    // If pageMeta exists with metaTitle, use it
    if (pageMeta?.metaTitle) {
        return {
            title: pageMeta.metaTitle,
            description: pageMeta?.metaDescription || description,
            alternates: {
                canonical: `${process.env.NEXT_PUBLIC_URL}/property-types/${slug}`,
            },
        };
    }

    const propertyType = await db.query.propertyTypeTable.findFirst({
        where: eq(propertyTypeTable.slug, slug)
    });

    if (!propertyType) {
        return {
            title: 'Property Type not found',
            description: 'The property type you are looking for does not exist.',
        }
    }

    return {
        title: `${propertyType?.name} Properties in Dubai | Find Your Next Home - TRPE AE`,
        description: `Browse exceptional ${propertyType?.name} properties in Dubai with TRPE. Your trusted experts for finding your dream home in this vibrant city.`,
        alternates: {
            canonical: `${process.env.NEXT_PUBLIC_URL}/property-types/${propertyType.slug}`,
        },
    }
}


interface PropertyTypePage {
    params: Promise<{
        propertyType: string;
    }>,
    searchParams: Promise<{ [key: string]: string  | undefined }>
}


async function PropertyForRentPage(props: PropertyTypePage) {
    const params = await props.params;
    const { user } = await validateRequest();
    
    // Get pathname from headers
    const headersList = await headers();
    const pathname = headersList.get("x-pathname") || "";

    const pageMeta = await db.query.pageMetaTable.findFirst({
        where: eq(pageMetaTable.path, pathname)
    }) as unknown as PageMetaType;

    const page = (await props.searchParams).page;

    const [unitType] = await db.select().from(propertyTypeTable).where(
        eq(propertyTypeTable.slug, params.propertyType)
    ).limit(1);

    if (!unitType) {
        return notFound()
    }

    return (
        <div className={' lg:pt-20'}>
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