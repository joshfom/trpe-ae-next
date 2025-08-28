import React, { memo } from 'react';
import {db} from "@/db/drizzle";
import Link from "next/link";
import Image from "next/image";
import type {Metadata} from "next";
import {sql} from "drizzle-orm";
import {type CommunitySelect} from "@/db/schema/community-table";
import { unstable_cache } from "next/cache";

export const metadata: Metadata = {
    title: "Communities in Dubai From Dubai Marina to Majan - TRPE AE",
    description: "Explore Dubai's finest communities with TRPE. Discover your dream home in vibrant neighbourhoods tailored for every lifestyle.",
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_URL}/communities`,
    },
};

// Cached function to get communities with proper cache tags
const getCommunities = unstable_cache(
    async (): Promise<(CommunitySelect & { properties: any[] })[]> => {
        try {
            const communities = await db.query.communityTable.findMany({
                with: {
                    properties: {
                        limit: 1 // Only get count, not all properties
                    }
                }
            });
            return communities;
        } catch (error) {
            console.error('Error fetching communities:', error);
            return [];
        }
    },
    ['communities-list'],
    {
        revalidate: 1800, // Cache for 30 minutes
        tags: ['communities', 'communities-list']
    }
);

// Memoized Community Card component
const CommunityCard = memo(({ community }: { community: CommunitySelect & { properties: any[] } }) => (
    <article className={'bg-white'}>
        <div className={'relative w-full h-60 rounded-lg overflow-hidden'}>
            <Image
                src={community.image || '/images/communities-default.webp'}
                alt={community.label || 'Community'}
                fill
                className={'object-cover rounded-lg'}
                loading="lazy"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
        </div>
        <div className={'px-4 text-center py-2'}>
            <Link href={`/communities/${community.slug}`} className={'font-semibold text-center text-sm hover:text-blue-600 transition-colors'}>
                {community.label}
            </Link>
        </div>
    </article>
));
CommunityCard.displayName = 'CommunityCard';

// Component for rendering community list
const CommunityList = memo(({ communities }: { communities: (CommunitySelect & { properties: any[] })[] }) => {
    // Only try to sort if we have communities data
    const reOrderedCommunities = communities.length > 0 
        ? communities.sort((a, b) => a.properties.length - b.properties.length).reverse()
        : [];

    if (communities.length === 0) {
        return (
            <div className="py-12 max-w-7xl mx-auto">
                <h1 className="font-semibold text-3xl">Communities in Dubai</h1>
                <p className="mt-4 text-gray-600">
                    We&apos;re currently updating our communities information. Please check back later.
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="py-12 max-w-7xl mx-auto">
                <h1 className="font-semibold text-3xl">Communities in Dubai</h1>
            </div>
            <div className={'max-w-7xl mx-auto lg:pb-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'}>
                {reOrderedCommunities.map((community) => (
                    <CommunityCard key={community.id} community={community} />
                ))}
            </div>
        </>
    );
});
CommunityList.displayName = 'CommunityList';



async function CommunitiesPage() {
    const communities = await getCommunities();

    return <CommunityList communities={communities} />;
}

export default CommunitiesPage;