import React, {Suspense} from 'react';
import Listings from "@/features/properties/components/Listings";
import {Metadata, ResolvingMetadata} from "next";
import PropertyPageSearchFilter from '@/features/search/PropertyPageSearchFilter';
import {db} from "@/db/drizzle";
import {eq} from "drizzle-orm";
import {communityTable} from "@/db/schema/community-table";
import {prepareExcerpt} from "@/lib/prepare-excerpt";
import {propertyTypeTable} from "@/db/schema/property-type-table";
import SearchPageH1Heading from "@/features/search/SearchPageH1Heading";
import {EditPageMetaSheet} from "@/features/admin/page-meta/components/EditPageMetaSheet";
import {validateRequest} from "@/actions/auth-session";
import {TipTapView} from "@/components/TiptapView";
import {pageMetaTable} from "@/db/schema/page-meta-table";
import {PageMetaType} from "@/features/admin/page-meta/types/page-meta-type";
import {headers} from "next/headers";
import FilterSummary from "@/features/search/components/FilterSummary";

type CommunityType = {
    name: string;
    slug: string;
    about: string;
    metaDesc?: string;
};

type PropertyType = {
    name: string;
    slug: string;
};

type Props = {
    params: Promise<{ search: string }>,
    searchParams: Promise<{ [key: string]: string | undefined }>
}

export async function generateMetadata(props: Props, parent: ResolvingMetadata): Promise<Metadata> {
    const params = await props.params;
    const headersList = await headers();
    const slug = params.search;
    const pathname = headersList.get("x-pathname") || "";

    const isUnitType = slug.includes('property-type-');
    const unitTypeSlug = slug.replace('property-type-', '');
    // Check if the slug already ends with 's' before making it plural
    const unitTypeSlugPlural = unitTypeSlug.endsWith('s') ? unitTypeSlug : unitTypeSlug + 's';

    const areas = slug.split('--')
        .map(area => area.replace('area-', '').trim())
        .filter(Boolean);
    const communitySlug = areas[0];

    let community: CommunityType | null = null;
    let unitType: PropertyType | null = null;

    // Default values
    let title = `Commercial properties for sale in Dubai | Find Your Next Investment - TRPE AE`;
    let description = `Browse exceptional commercial properties for sale in Dubai with TRPE. Your trusted experts for finding your ideal business investment in this vibrant city.`;

    try {
        // Fetch community if slug exists
        if (communitySlug) {
            community = await db.query.communityTable.findFirst({
                where: eq(communityTable.slug, communitySlug),
            }) as unknown as CommunityType;

            if (community) {
                const communityMetaDesc = community.metaDesc || prepareExcerpt(community.about, 160);
                title = `Commercial properties for sale in ${community.name} | Find Your Next Investment - TRPE AE`;
                description = `Browse exceptional commercial properties for sale in ${community.name} with TRPE. ${communityMetaDesc}`;
            }
        }


        // Check for pageMeta first
        const pageMeta = await db.query.pageMetaTable.findFirst({
            where: eq(pageMetaTable.path, pathname)
        }) as unknown as PageMetaType | null;

        // Fetch property type if applicable
        if (isUnitType) {
            unitType = await db.query.propertyTypeTable.findFirst({
                where: eq(propertyTypeTable.slug, unitTypeSlugPlural),
            }) as unknown as PropertyType;
        }

        // Set the final title and description based on what we found
        if (unitType && community) {
            title = `${unitType.name} for sale in ${community.name} | Find Your Next Investment - TRPE AE`;
            description = `Browse exceptional ${unitType.name} for sale in ${community.name} with TRPE. Your trusted experts for finding your ideal business investment in this vibrant city.`;
        } else if (unitType) {
            title = `${unitType.name} for sale in Dubai | Find Your Next Investment - TRPE AE`;
            description = `Browse exceptional ${unitType.name} for sale in Dubai with TRPE. Your trusted experts for finding your ideal business investment in this vibrant city.`;
        }
        // If only community exists, we already set the title and description above
    } catch (error) {
        console.error('Error generating metadata:', error);
        // Use default title and description in case of errors
    }

    return {
        title,
        description,
        alternates: {
            canonical: `${process.env.NEXT_PUBLIC_URL}/dubai/properties/commercial/for-sale/${slug}`,
        },
    };
}

async function PropertySearchPage({ searchParams, params }: Props) {
    const resolvedSearchParams = await searchParams;
    const page = resolvedSearchParams.page;
    const slug = (await params).search || '';
    const headersList = await headers();

    const isUnitType = slug.includes('property-type-');
    const unitTypeSlug = slug.replace('property-type-', '');
    const unitTypeSlugPlural = unitTypeSlug.endsWith('s') ? unitTypeSlug : unitTypeSlug + 's';
    const pathname = headersList.get("x-pathname") || "";
    const pageMeta = await db.query.pageMetaTable.findFirst({
        where: eq(pageMetaTable.path, pathname)
    }) as unknown as PageMetaType;

    const areas = slug.split('--')
        .map(area => area.replace('area-', '').trim())
        .filter(Boolean);
    const communitySlug = areas[0];
    const { user } = await validateRequest();

    let community: CommunityType | null = null;
    let unitType: PropertyType | null = null;
    let pageTitle = "Commercial properties for sale in Dubai";

    try {
        if (communitySlug) {
            community = await db.query.communityTable.findFirst({
                where: eq(communityTable.slug, communitySlug),
            }) as unknown as CommunityType;

            if (community) {
                pageTitle = `Commercial properties for sale in ${community.name}`;
            }
        }

        if (isUnitType) {
            unitType = await db.query.propertyTypeTable.findFirst({
                where: eq(propertyTypeTable.slug, unitTypeSlugPlural),
            }) as unknown as PropertyType;
        }

        if (unitType && community) {
            pageTitle = `${unitType.name} for sale in ${community.name}`;
        } else if (unitType) {
            pageTitle = `${unitType.name} for sale in Dubai`;
        }
    } catch (error) {
        console.error('Error generating page title:', error);
    }

    if (pageMeta?.title) {
        pageTitle = pageMeta.title;
    }

    return (
        <div className={'bg-slate-100'}>
            <div className="hidden lg:block py-12 bg-black">

            </div>
            <PropertyPageSearchFilter offeringType='commercial-sale' />
            
            {/* Filter Summary */}
            <FilterSummary 
                selectedCommunities={[]} 
                searchParams={new URLSearchParams(Object.entries(resolvedSearchParams).map(([key, value]) => [key, String(value)]))} 
            />
            
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
                offeringType={'commercial-sale'}
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