import React from 'react';
import {db} from "@/db/drizzle";
import Link from "next/link";
import type {Metadata} from "next";
import { sql } from "drizzle-orm";
import { communityTable, type CommunitySelect } from "@/db/schema/community-table";
import { propertyTable } from "@/db/schema/property-table";

export const metadata: Metadata = {
    title: "Communities in Dubai From Dubai Marina to Majan - TRPE AE",
    description: "Explore Dubai's finest communities with TRPE. Discover your dream home in vibrant neighbourhoods tailored for every lifestyle.",
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_URL}/communities`,
    },
};

async function CommunitiesPage() {
    let communities: (CommunitySelect & { properties: any[] })[] = [];
    
    try {
        // Check if the community table exists before querying
        try {
            await db.execute(sql`SELECT 1 FROM information_schema.tables WHERE table_name = 'community'`);
            communities = await db.query.communityTable.findMany({
                with: {
                    properties: true
                }
            });
        } catch (error) {
            console.error('Error fetching communities:', error);
            // If the table doesn't exist or another error occurs, use an empty array
            communities = [];
        }
    } catch (error) {
        console.error('Database query failed:', error);
        communities = [];
    }

    // Only try to sort if we have communities data
    const reOrderedCommunities = communities.length > 0 
        ? communities.sort((a, b) => a.properties.length - b.properties.length).reverse()
        : [];

    return (
        <>
            <div className="py-12 bg-black hidden lg:block">

            </div>

            <div className="py-12 max-w-7xl mx-auto">
                <h1 className="font-semibold text-3xl">
                    Communities in Dubai
                </h1>
                {communities.length === 0 && (
                    <p className="mt-4 text-gray-600">
                        We&apos;re currently updating our communities information. Please check back later.
                    </p>
                )}
            </div>
            {communities.length > 0 && (
                <div className={'max-w-7xl mx-auto lg:pb-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'}>
                    {
                        reOrderedCommunities.map((community) => (
                            <div key={community.id} className={'bg-white '}>
                                <div className={'relative w-full h-60 rounded-lg overflow-hidden'}>
                                    <img
                                        className={'object-cover rounded-lg absolute inset-0 w-full h-full'}
                                        src={community.image || '/images/communities-default.webp'}
                                        alt={community.label || 'Community'}
                                    />
                                </div>
                                <div className={'px-4 text-center py-2'}>
                                    <Link href={`/communities/${community.slug}`} className={'font-semibold text-center text-sm'}>
                                        {community.label}
                                    </Link>
                                </div>
                            </div>
                        ))
                    }
                </div>
            )}

        </>
    );
}

export default CommunitiesPage;