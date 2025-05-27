import React, { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { db } from "@/db/drizzle";
import { asc } from "drizzle-orm";
import { communityTable } from "@/db/schema/community-table";
import { propertyTypeTable } from "@/db/schema/property-type-table";
import PropertyPageSearchFilterClient from './PropertyPageSearchFilterClient';

interface PropertyPageSearchFilterServerProps {
    offeringType: string;
}

// Cached data fetching for server component
const getFilterData = cache(async () => {
    return unstable_cache(
        async () => {
            try {
                const [communities, propertyTypes] = await Promise.all([
                    db.query.communityTable.findMany({
                        orderBy: [asc(communityTable.name)],
                        limit: 50, // Limit for performance
                        columns: {
                            id: true,
                            name: true,
                            label: true,
                            slug: true
                        }
                    }),
                    db.query.propertyTypeTable.findMany({
                        orderBy: [asc(propertyTypeTable.name)],
                        columns: {
                            id: true,
                            name: true,
                            slug: true
                        }
                    })
                ]);

                return { communities, propertyTypes };
            } catch (error) {
                console.error('Error fetching filter data:', error);
                return { communities: [], propertyTypes: [] };
            }
        },
        ['property-filter-data'],
        {
            revalidate: 21600, // 6 hours - filter data changes infrequently
            tags: ['communities', 'property-types', 'filter-data']
        }
    )();
});

// Server component for property search filter
async function PropertyPageSearchFilterServer({ offeringType }: PropertyPageSearchFilterServerProps) {
    const { communities, propertyTypes } = await getFilterData();

    return (
        <PropertyPageSearchFilterClient 
            offeringType={offeringType}
            communities={communities}
            propertyTypes={propertyTypes}
        />
    );
}

export default PropertyPageSearchFilterServer;
