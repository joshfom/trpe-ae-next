export const dynamic = 'force-dynamic';
import React, {Suspense} from 'react';
import Listings from "@/features/properties/components/Listings";
import {Metadata, ResolvingMetadata} from "next";
import PropertyPageSearchFilter from '@/features/search/PropertyPageSearchFilter';
import {db} from "@/db/drizzle";
import {eq, and, sql} from "drizzle-orm";
import {prepareExcerpt} from "@/lib/prepare-excerpt";
import {communityTable} from "@/db/schema/community-table";
import {propertyTypeTable} from "@/db/schema/property-type-table";
import {propertyTable} from "@/db/schema/property-table";
import {offeringTypeTable} from "@/db/schema/offering-type-table";
import SearchPageH1Heading from "@/features/search/SearchPageH1Heading";
import {validateRequest} from "@/actions/auth-session";
import {EditPageMetaSheet} from "@/features/admin/page-meta/components/EditPageMetaSheet";
import {headers} from "next/headers";
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
    const slug = params.search || '';
    const subSlug = params.searchLevel2 || '';
    
    // Get pathname from headers for pageMeta
    const headersList = await headers();
    const pathname = headersList.get("x-pathname") || "";
    
    // Check for pageMeta first
    const pageMeta = await db.query.pageMetaTable.findFirst({
        where: eq(pageMetaTable.path, pathname)
    }) as unknown as PageMetaType | null;
    
    // Default description to use if not overridden
    let description = `Browse exceptional properties for rent in Dubai with TRPE. Your trusted experts for finding your dream home in this vibrant city.`;
    
    // If pageMeta exists with metaTitle, use it
    if (pageMeta?.metaTitle) {
        return {
            title: pageMeta.metaTitle,
            description: pageMeta?.metaDescription || description,
            alternates: {
                canonical: `${process.env.NEXT_PUBLIC_URL}/dubai/properties/residential/for-rent/${slug}/${subSlug}`,
            },
            robots: {
                index: pageMeta?.noIndex === true ? false : true,
                follow: pageMeta?.noFollow === true ? false : true,
                nocache: false
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
    let shouldIndex = true;

    // Default values
    let title = `Properties for rent in Dubai | Find Your Next Home - TRPE AE`;
    // Update the previously declared description variable
    description = `Browse exceptional properties for rent in Dubai with TRPE. Your trusted experts for finding your dream home in this vibrant city.`;

    try {
        // Fetch community if slug exists
        if (communitySlug) {
            community = await db.query.communityTable.findFirst({
                where: eq(communityTable.slug, communitySlug),
            }) as unknown as CommunityType;

            if (community) {
                const communityMetaDesc = community.metaDesc || prepareExcerpt(community.about, 160);
                title = `Properties for rent in ${community.name} | Find Your Next Home - TRPE AE`;
                description = `Browse exceptional properties for rent in ${community.name} with TRPE. ${communityMetaDesc}`;
            }
        }

        // Fetch property type if applicable
        if (isUnitType) {
            unitType = await db.query.propertyTypeTable.findFirst({
                where: eq(propertyTypeTable.slug, unitTypeSlugPlural),
            }) as unknown as PropertyType;
        }

        // Set the final title and description based on what we found
        if (unitType && community) {
            title = `${unitType.name} for rent in ${community.name} | Find Your Next Home - TRPE AE`;
            description = `Browse exceptional ${unitType.name} for rent in ${community.name} with TRPE. Your trusted experts for finding your dream home in this vibrant city.`;
        } else if (unitType) {
            title = `${unitType.name} for rent in Dubai | Find Your Next Home - TRPE AE`;
            description = `Browse exceptional ${unitType.name} for rent in Dubai with TRPE. Your trusted experts for finding your dream home in this vibrant city.`;
        }

        // if unit type and community check if there is a property with unit type in community, if not set shouldIndex to false
        if (unitType && community) {
            const forRentOfferingType = await db.query.offeringTypeTable.findFirst({
                where: eq(offeringTypeTable.slug, "for-rent")
            });
            
            if (!forRentOfferingType) {
                console.log("Warning: 'for-rent' offering type not found");
                shouldIndex = false;
            } else {
                const propertiesCount = await db.select({ count: sql<number>`count(*)` })
                    .from(propertyTable)
                    .where(
                        and(
                            eq(propertyTable.communityId, community.id),
                            eq(propertyTable.typeId, unitType.id),
                            eq(propertyTable.offeringTypeId, forRentOfferingType.id)
                        )
                    )
                    .then(result => result[0].count);
                

                
                if (propertiesCount < 1) {
                    shouldIndex = false;
                    console.log(`Setting shouldIndex to false due to zero properties`);
                }
            }
        }

    } catch (error) {
        console.error('Error generating metadata:', error);
        // Use default title and description in case of errors
    }


    // In Next.js 15, use the specific format for robots
    return {
        robots: shouldIndex ? 
            { index: true, follow: true, nocache: false } : 
            { index: false, follow: false, nocache: true },
        title,
        description,
        alternates: {
            canonical: `${process.env.NEXT_PUBLIC_URL}/dubai/properties/residential/for-rent/${slug}/${subSlug}`,
        },
    };
}

async function PropertySearchPage({ searchParams, params }: Props) {
    const page = (await searchParams).page
    const resolvedParams = await params;
    const slug = resolvedParams.search || '';
    const subSlug = resolvedParams.searchLevel2 || '';
    const { user } = await validateRequest();
    
    // Get pathname from headers
    const headersList = await headers();
    const pathname = headersList.get("x-pathname") || "";

    const pageMeta = await db.query.pageMetaTable.findFirst({
        where: eq(pageMetaTable.path, pathname)
    }) as unknown as PageMetaType;

    const isUnitType = slug.includes('property-type-');
    const unitTypeSlug = slug.replace('property-type-', '');
    const unitTypeSlugPlural = unitTypeSlug.endsWith('s') ? unitTypeSlug : unitTypeSlug + 's';

    const areas = subSlug.split('--')
        .map(area => area.replace('area-', '').trim())
        .filter(Boolean);
    const communitySlug = areas[0];

    let community = null;
    let unitType = null;
    let pageTitle = "Properties for rent in Dubai";



    try {
        if (communitySlug) {
            community = await db.query.communityTable.findFirst({
                where: eq(communityTable.slug, communitySlug),
            });
            
            if (community) {
                pageTitle = `Properties for rent in ${community.name}`;
            }
        }

        if (isUnitType) {
            unitType = await db.query.propertyTypeTable.findFirst({
                where: eq(propertyTypeTable.slug, unitTypeSlugPlural),
            });
        }

        if (unitType && community) {
            pageTitle = `${unitType.name} for rent in ${community.name}`;
        } else if (unitType) {
            pageTitle = `${unitType.name} for rent in Dubai`;
        }
    } catch (error) {
        console.error('Error generating page title:', error);
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
            
            {
                <div className="max-w-7xl bg-white mx-auto px-4 py-8">
                    <TipTapView content={pageMeta?.content}/>
                </div>
            }
        </div>
    );
}

export default PropertySearchPage;