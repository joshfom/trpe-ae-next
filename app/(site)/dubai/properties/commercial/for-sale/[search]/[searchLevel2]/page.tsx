import React, {Suspense} from 'react';
import Listings from "@/features/properties/components/Listings";
import {Metadata, ResolvingMetadata} from "next";
import PropertyPageSearchFilter from '@/features/search/PropertyPageSearchFilter';
import {db} from "@/db/drizzle";
import {eq, and, sql} from "drizzle-orm";
import { headers } from "next/headers";
import {prepareExcerpt} from "@/lib/prepare-excerpt";
import {communityTable} from "@/db/schema/community-table";
import {propertyTypeTable} from "@/db/schema/property-type-table";
import {propertyTable} from "@/db/schema/property-table";
import {offeringTypeTable} from "@/db/schema/offering-type-table";
import SearchPageH1Heading from "@/features/search/SearchPageH1Heading";
import {validateRequest} from "@/actions/auth-session";
import {EditPageMetaSheet} from "@/features/admin/page-meta/components/EditPageMetaSheet";
import {pageMetaTable} from "@/db/schema/page-meta-table";
import {PageMetaType} from "@/features/admin/page-meta/types/page-meta-type";
import {TipTapView} from "@/components/TiptapView";

type CommunityType = {
    id: string;
    name: string;
    slug: string;
    about: string;
    metaDesc?: string;
};

type PropertyType = {
    id: string;
    name: string;
    slug: string;
};

type Props = {
    params: Promise<{ 
        search: string, 
        searchLevel2: string 
    }>,
    searchParams: Promise<{ [key: string]: string | undefined }>
}

export async function generateMetadata(props: Props, parent: ResolvingMetadata): Promise<Metadata> {
    const params = await props.params;
    const slug = params.search;
    const subSlug = params.searchLevel2;
    
    // Construct pathname directly from URL parameters
    const pathname = `/dubai/properties/commercial/for-sale/${slug}/${subSlug}`;
    
    // Check for pageMeta first
    const pageMeta = await db.query.pageMetaTable.findFirst({
        where: eq(pageMetaTable.path, pathname)
    }) as unknown as PageMetaType | null;
    
    // Default description to use if not overridden
    let description = `Browse exceptional commercial properties for sale in Dubai with TRPE. Your trusted experts for finding your ideal business investment in this vibrant city.`;
    
    // If pageMeta exists with metaTitle, use it
    if (pageMeta?.metaTitle) {
        return {
            title: pageMeta.metaTitle,
            description: pageMeta?.metaDescription || description,
            alternates: {
                canonical: `${process.env.NEXT_PUBLIC_URL}/dubai/properties/commercial/for-sale/${slug}/${subSlug}`,
            },
            robots: {
                index: pageMeta?.noIndex === true ? false : true,
                follow: pageMeta?.noFollow === true ? false : true,
            },
        };
    }

    const isUnitType = slug.includes('property-type-');
    const unitTypeSlug = slug.replace('property-type-', '');
    // Check if the slug already ends with 's' before making it plural
    const unitTypeSlugPlural = unitTypeSlug.endsWith('s') ? unitTypeSlug : unitTypeSlug + 's';

    const areas = subSlug.split('--')
        .map(area => area.replace('area-', '').trim())
        .filter(Boolean);
    const communitySlug = areas[0];

    let community: CommunityType | null = null;
    let unitType: PropertyType | null = null;

    // Default values
    let title = `Commercial properties for sale in Dubai | Find Your Next Investment - TRPE AE`;
    // Update the previously declared description variable
    description = `Browse exceptional commercial properties for sale in Dubai with TRPE. Your trusted experts for finding your ideal business investment in this vibrant city.`;
    let shouldIndex = true;

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

        // Fetch property type if applicable
        if (isUnitType) {
            unitType = await db.query.propertyTypeTable.findFirst({
                where: eq(propertyTypeTable.slug, unitTypeSlugPlural),
            }) as unknown as PropertyType;
        }

        // if unit type and community check if there is a property with unit type in community, if not set shouldIndex to false
        if (unitType && community) {
            const propertiesCount = await db.select({ count: sql<number>`count(*)` })
                .from(propertyTable)
                .where(
                    and(
                        eq(propertyTable.communityId, community.id),
                        eq(propertyTable.typeId, unitType.id),
                        eq(propertyTable.offeringTypeId, 
                            (await db.query.offeringTypeTable.findFirst({
                                where: eq(offeringTypeTable.slug, "commercial-sale")
                            }))?.id || ''
                        )
                    )
                )
                .then(result => result[0].count);
           
            if (propertiesCount < 1) {
                shouldIndex = false;
            }
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
        robots: {
            index: shouldIndex,
            follow: true,
        },
        title,
        description,
        alternates: {
            canonical: `${process.env.NEXT_PUBLIC_URL}/dubai/properties/commercial/for-sale/${slug}/${subSlug}`,
        },
    };
}

async function PropertySearchPage({ searchParams, params }: Props) {
    const awaitedSearchParams = await searchParams;
    const page = awaitedSearchParams.page;
    const awaitedParams = await params;
    const slug = awaitedParams.search;
    const subSlug = awaitedParams.searchLevel2;
        
    // Get pathname from headers (set by middleware) for consistency
    // This is critical for server-side rendering when JavaScript is disabled
    const headersList = await headers();
    const pathnameFromHeader = headersList.get("x-pathname");
    
    // Always construct a complete path (make sure it's absolute and not relative)
    const constructedPath = `/dubai/properties/commercial/for-sale/${slug}/${subSlug}`;
    
    // Use the pathname from headers if available, otherwise use constructed path
    // For consistency with client navigation and SSR
    const pathname = pathnameFromHeader || constructedPath;
    
    console.log('Page component using pathname:', pathname);
    console.log('Pathname source:', pathnameFromHeader ? 'header' : 'constructed');
    
    // Log warning if the pathname is not available from headers
    if (!pathnameFromHeader) {
        console.warn('x-pathname header is missing, using constructed path. Check middleware configuration.');
    }
    const pageMeta = await db.query.pageMetaTable.findFirst({
        where: eq(pageMetaTable.path, pathname)
    }) as unknown as PageMetaType;

          const { user } = await validateRequest();

    // Check if this is a property type search
    const isUnitType = slug.includes('property-type-');
    
    // Extract the unit type slug, removing 'property-type-' prefix
    const unitTypeSlug = slug.replace('property-type-', '');
    
    // For database queries we need the plural form
    const unitTypeSlugPlural = unitTypeSlug.endsWith('s') ? unitTypeSlug : unitTypeSlug + 's';

    const areas = subSlug.split('--')
        .map((area: string) => area.replace('area-', '').trim())
        .filter(Boolean);
    const communitySlug = areas[0];

    let community = null;
    let unitType = null;
    let pageTitle = "Commercial properties for sale in Dubai";

    try {
        if (communitySlug) {
            community = await db.query.communityTable.findFirst({
                where: eq(communityTable.slug, communitySlug),
            });
            
            if (community) {
                pageTitle = `Commercial properties for sale in ${community.name}`;
            }
        }

        if (isUnitType) {
            unitType = await db.query.propertyTypeTable.findFirst({
                where: eq(propertyTypeTable.slug, unitTypeSlugPlural),
            });
        }

        if (unitType && community) {
            pageTitle = `${unitType.name} for sale in ${community.name}`;
        } else if (unitType) {
            pageTitle = `${unitType.name} for sale in Dubai`;
        }
    } catch (error) {
        console.error('Error generating page title:', error);
    }

       // If pageMeta exists with title and description, use those values
    if (pageMeta?.title) {
        pageTitle = pageMeta.title;
    }
    
    return (
        <div className="bg-slate-100">
            <div className="hidden lg:block py-12 bg-black">
            </div>
            <PropertyPageSearchFilter offeringType="commercial-sale" />

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
                offeringType="commercial-sale"
                propertyType={isUnitType ? unitTypeSlug : undefined}
                searchParams={awaitedSearchParams}
                page={page}
                isLandingPage={false}
                // Pass the pathname explicitly to ensure consistent server-side rendering
                pathname={pathname}
                key={pathname} /* Add a key to force re-render on navigation */
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