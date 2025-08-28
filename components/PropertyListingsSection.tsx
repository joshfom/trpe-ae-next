import React from 'react';
import ListingsGridServer from "@/features/properties/components/ListingsGridServer";
import PaginationServer from "@/components/PaginationServer";
import { PropertyType } from "@/types/property";
import { EnrichedProperty } from "@/features/properties/api/get-properties-server";

interface PropertyListingsSectionProps {
    properties: EnrichedProperty[];
    metaLinks?: {
        currentPage: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    } | null;
    error?: string | null;
    pathname: string;
    searchParams: URLSearchParams;
}

// Pure server component that just renders pre-fetched data
function PropertyListingsSection({
    properties,
    metaLinks,
    error,
    pathname,
    searchParams
}: PropertyListingsSectionProps) {
    // Convert EnrichedProperty to PropertyType format for existing components
    const convertedProperties: PropertyType[] = properties.map(enriched => ({
        id: enriched.id,
        title: enriched.title || '',
        name: enriched.title || '',
        description: enriched.description || '',
        bedrooms: enriched.bedrooms || 0,
        bathrooms: enriched.bathrooms || 0,
        buildYear: enriched.buildYear || '',
        agentId: enriched.agentId || '',
        slug: enriched.slug,
        price: (enriched.price || 0).toString(),
        completionStatus: enriched.completionStatus || '',
        developerId: enriched.developerId || '',
        communityId: enriched.communityId || '',
        community: enriched.community ? {
            id: enriched.community.id,
            name: enriched.community.name || '',
            slug: enriched.community.slug,
            label: enriched.community.label,
            image: enriched.community.image,
            propertyCount: 0,
            metaTitle: null,
            metaDesc: null,
            about: null,
            createdAt: enriched.createdAt || new Date().toISOString(),
        } : {
            id: '',
            name: '',
            slug: '',
            label: '',
            image: '',
            propertyCount: 0,
            metaTitle: null,
            metaDesc: null,
            about: null,
            createdAt: enriched.createdAt || new Date().toISOString(),
        },
        cityId: enriched.cityId || '',
        offeringTypeId: enriched.offeringTypeId || '',
        offeringType: enriched.offeringType ? {
            id: enriched.offeringType.id,
            name: enriched.offeringType.name,
            slug: enriched.offeringType.slug,
        } : {
            id: '',
            name: '',
            slug: '',
        },
        type: enriched.unitType ? {
            id: enriched.unitType.id,
            name: enriched.unitType.name,
            slug: enriched.unitType.slug,
        } : {
            id: '',
            name: '',
            slug: '',
        },
        city: {
            id: enriched.cityId || '',
            name: 'Dubai',
            slug: 'dubai',
        },
        images: enriched.images.map(img => ({
            id: img.id,
            imageUrl: img.s3Url || img.crmUrl || '',
            altText: '',
            isPrimary: img.order === 0 || img.order === null,
            s3Url: img.s3Url || '',
            propertyId: enriched.id,
        })),
        propertyTypeId: enriched.typeId || '',
        propertyType: enriched.type ? {
            id: enriched.type.id,
            name: enriched.type.name,
            slug: enriched.type.slug,
        } : {
            id: '',
            name: '',
            slug: '',
        },
        longitude: enriched.longitude || '',
        latitude: enriched.latitude || '',
        cheques: enriched.cheques || '',
        floor: enriched.floor || '',
        permitNumber: enriched.permitNumber || '',
        plotSize: enriched.plotSize || 0,
        availabilityDate: enriched.availabilityDate || '',
        parking: enriched.parking || '',
        furnished: enriched.furnished || '',
        referenceNumber: enriched.referenceNumber || '',
        subCommunity: null,
        serviceCharge: enriched.serviceCharge || '',
        agent: {
            id: enriched.agentId || '',
            name: '',
            email: '',
            phone: '',
            image: '',
            slug: '',
        },
        size: enriched.size || 0,
        updatedAt: enriched.updatedAt || '',
        createdAt: enriched.createdAt || '',
    } as unknown as PropertyType));

    return (
        <div className='pb-6 lg:pb-8'>
            <div className={'max-w-7xl mx-auto grid sm:px-6 lg:px-0 pb-4 lg:pb-12'}>
                {convertedProperties && convertedProperties.length > 0 ? (
                    <ListingsGridServer listings={convertedProperties}/>
                ) : null}

                {metaLinks && (
                    <PaginationServer
                        metaLinks={metaLinks}
                        pathname={pathname}
                        searchParams={searchParams}
                    />
                )}

                {error && (
                    <div className={'h-[200px] sm:h-[300px] lg:h-[600px] flex flex-col justify-center items-center px-4'}>
                        <p className="text-base lg:text-lg text-center text-gray-500">
                            Oops! Something went wrong from our end. Please try again later.
                        </p>
                    </div>
                )}

                {!error && properties && properties.length === 0 && (
                    <div className={'h-[200px] sm:h-[300px] lg:h-[600px] flex flex-col gap-4 lg:gap-8 justify-center items-center px-4'}>
                        <p className="text-xl lg:text-2xl text-center text-gray-500">
                            No properties found
                        </p>

                        <p className="text-sm lg:text-base text-center text-gray-400">
                            Please try changing your search criteria or check back later.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PropertyListingsSection;
