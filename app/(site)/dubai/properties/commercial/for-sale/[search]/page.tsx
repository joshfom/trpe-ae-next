import React from 'react';
import ListingsServer from "@/features/properties/components/ListingsServer";
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
import { generateMobileSEO, generateMobileViewport } from "@/lib/mobile/mobile-seo-optimization";

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
        viewport: {
            width: 'device-width',
            initialScale: 1,
            minimumScale: 1,
            maximumScale: 5,
            userScalable: true,
            viewportFit: 'cover',
        },
        openGraph: {
            title,
            description,
            type: 'website',
            url: `${process.env.NEXT_PUBLIC_URL}/dubai/properties/commercial/for-sale/${slug}`,
            images: [{
                url: `${process.env.NEXT_PUBLIC_URL}/dubai-commercial-sale-properties-og.webp`,
                width: 1200,
                height: 630,
                alt: title
            }]
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [`${process.env.NEXT_PUBLIC_URL}/dubai-commercial-sale-properties-twitter.webp`]
        }
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
        <div className="min-h-screen bg-gray-50">
            {/* Mobile-first container with responsive padding */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                {/* Mobile-optimized search filter */}
                <div className="mb-6 sm:mb-8">
                    <div className="w-full">
                        <PropertyPageSearchFilter offeringType='commercial-sale'/>
                    </div>
                </div>
                
                {/* Mobile-first filter summary */}
                <div className="mb-4 sm:mb-6">
                    <FilterSummary 
                        selectedCommunities={[]} 
                        searchParams={new URLSearchParams(Object.entries(resolvedSearchParams).map(([key, value]) => [key, String(value)]))} 
                    />
                </div>
                
                {/* Mobile-first header section */}
                <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8">
                    <div className="flex-1">
                        <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                            <SearchPageH1Heading
                                heading={pageTitle}
                            />
                        </div>
                    </div>

                    {/* Admin controls - mobile-responsive */}
                    {user && (
                        <div className="flex justify-start sm:justify-end">
                            <EditPageMetaSheet
                                pageMeta={pageMeta}
                                pathname={pathname}
                            />
                        </div>
                    )}
                </div>
                
                {/* Mobile-optimized listings */}
                <div className="w-full">
                    <ListingsServer 
                        offeringType={'commercial-sale'}
                        searchParams={resolvedSearchParams}
                        page={page}
                        propertyType="commercial"
                    />
                </div>

                {/* Mobile-responsive content section */}
                {pageMeta?.content && (
                    <div className="mt-8 sm:mt-12 lg:mt-16 bg-white rounded-lg p-4 sm:p-6 lg:p-8">
                        <div className="prose prose-sm sm:prose lg:prose-lg max-w-none">
                            <TipTapView content={pageMeta.content}/>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PropertySearchPage;