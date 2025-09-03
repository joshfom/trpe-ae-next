import React from 'react';
import ListingsServer from "@/features/properties/components/ListingsServer";
import {Metadata, ResolvingMetadata} from "next";
import PropertyPageSearchFilter from '@/features/search/PropertyPageSearchFilter';
import {db} from '@/db/drizzle';
import {communityTable} from "@/db/schema/community-table";
import {prepareExcerpt} from "@/lib/prepare-excerpt";
import {eq} from 'drizzle-orm';
import {propertyTypeTable} from "@/db/schema/property-type-table";
import SearchPageH1Heading from "@/features/search/SearchPageH1Heading";
import {validateRequest} from "@/actions/auth-session";
import {EditPageMetaSheet} from "@/features/admin/page-meta/components/EditPageMetaSheet";
import {headers} from "next/headers";
import {pageMetaTable} from "@/db/schema/page-meta-table";
import {PageMetaType} from "@/features/admin/page-meta/types/page-meta-type";
import FilterSummary from "@/features/search/components/FilterSummary";
import {TipTapView} from "@/components/TiptapView";

// Generate static params for popular communities and property types
export async function generateStaticParams() {
    try {
        const [communities, propertyTypes] = await Promise.all([
            db.query.communityTable.findMany({
                columns: { slug: true },
                limit: 15 // Limit to top 15 communities
            }),
            db.query.propertyTypeTable.findMany({
                columns: { slug: true },
                limit: 8 // Limit to top 8 property types
            })
        ]);
        
        const params = [];
        
        // Add individual communities
        for (const community of communities) {
            params.push({ search: community.slug });
        }
        
        // Add individual property types
        for (const propertyType of propertyTypes) {
            params.push({ search: propertyType.slug });
        }
        
        return params;
    } catch (error) {
        console.error('Error generating static params:', error);
        return [];
    }
}

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
    const slug = params.search;
    
    // Get pathname from headers for pageMeta
    const headersList = await headers();
    const pathname = headersList.get("x-pathname") || "";
    
    // Check for pageMeta first
    const pageMeta = await db.query.pageMetaTable.findFirst({
        where: eq(pageMetaTable.path, pathname)
    }) as unknown as PageMetaType | null;
    
    // Default description to use if not overridden
    let description = `Browse exceptional commercial properties for rent in Dubai with TRPE. Your trusted experts for finding your ideal business space in this vibrant city.`;
    
    // If pageMeta exists with metaTitle, use it
    if (pageMeta?.metaTitle) {
        return {
            title: pageMeta.metaTitle,
            description: pageMeta?.metaDescription || description,
            alternates: {
                canonical: `${process.env.NEXT_PUBLIC_URL}/dubai/properties/commercial/for-rent/${slug}`,
            },
            robots: {
                index: pageMeta?.noIndex === true ? false : undefined,
                follow: pageMeta?.noFollow === true ? false : undefined,
            },
        };
    }

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
    let title = `Commercial properties for rent in Dubai | Find Your Next Space - TRPE AE`;
    // Update the previously declared description variable
    description = `Browse exceptional commercial properties for rent in Dubai with TRPE. Your trusted experts for finding your ideal business space in this vibrant city.`;

    try {
        // Fetch community if slug exists
        if (communitySlug) {
            community = await db.query.communityTable.findFirst({
                where: eq(communityTable.slug, communitySlug),
            }) as unknown as CommunityType;

            if (community) {
                const communityMetaDesc = community.metaDesc || prepareExcerpt(community.about, 160);
                title = `Commercial properties for rent in ${community.name} | Find Your Next Space - TRPE AE`;
                description = `Browse exceptional commercial properties for rent in ${community.name} with TRPE. ${communityMetaDesc}`;
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
            title = `${unitType.name} for rent in ${community.name} | Find Your Next Space - TRPE AE`;
            description = `Browse exceptional ${unitType.name} for rent in ${community.name} with TRPE. Your trusted experts for finding your ideal business space in this vibrant city.`;
        } else if (unitType) {
            title = `${unitType.name} for rent in Dubai | Find Your Next Space - TRPE AE`;
            description = `Browse exceptional ${unitType.name} for rent in Dubai with TRPE. Your trusted experts for finding your ideal business space in this vibrant city.`;
        }
        // If only community exists, we already set the title and description above
    } catch (error) {
        console.error('Error generating metadata:', error);
    }

    return {
        title,
        description,
        alternates: {
            canonical: `${process.env.NEXT_PUBLIC_URL}/dubai/properties/commercial/for-rent/${slug}`,
        },
    };
}

async function PropertySearchPage(props: Props) {
    const searchParams = await props.searchParams;
    const page = searchParams.page;
    const params = await props.params;
    const slug = params.search;
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

    const areas = slug.split('--')
        .map(area => area.replace('area-', '').trim())
        .filter(Boolean);
    const communitySlug = areas[0];

    let community = null;
    let unitType = null;
    let pageTitle = "Commercial properties for rent in Dubai";

    try {
        if (communitySlug) {
            community = await db.query.communityTable.findFirst({
                where: eq(communityTable.slug, communitySlug),
            });
            
            if (community) {
                pageTitle = `Commercial properties for rent in ${community.name}`;
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
            <PropertyPageSearchFilter offeringType='commercial-rent'/>
            
            {/* Filter Summary */}
            <FilterSummary 
                selectedCommunities={[]} 
                searchParams={new URLSearchParams(Object.entries(searchParams).map(([key, value]) => [key, String(value)]))} 
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
            
            <ListingsServer
                offeringType={'commercial-rent'}
                searchParams={searchParams}
                page={page}
                propertyType="commercial"
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