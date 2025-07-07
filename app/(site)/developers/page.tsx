import React, {cache, Suspense} from 'react';
import {db} from "@/db/drizzle";
import Link from "next/link";
import type {Metadata} from "next";
import {asc} from "drizzle-orm";
import {developerTable} from "@/db/schema/developer-table";

// Cached database query for better performance
const getDevelopers = cache(async () => {
    try {
        return await db.query.developerTable.findMany({
            orderBy: [asc(developerTable.order)]
        });
    } catch (error) {
        console.error('Error fetching developers:', error);
        return [];
    }
});

// Skeleton component for loading state
const DeveloperCardSkeleton = React.memo(() => (
    <div className={'bg-white rounded-lg animate-pulse'}>
        <div className={'relative w-full h-40 border rounded-xl overflow-hidden bg-gray-300'}></div>
        <div className={'px-4 text-center py-2'}>
            <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto"></div>
        </div>
    </div>
));
DeveloperCardSkeleton.displayName = 'DeveloperCardSkeleton';

// Memoized developer card component
const DeveloperCard = React.memo<{ developer: any }>(({ developer }) => (
    <div key={developer.id} className={'bg-white rounded-lg'}>
        <div className={'relative w-full h-40 border rounded-xl overflow-hidden'}>
            <Link href={`/developers/${developer.slug}`} className="block relative h-40 w-full">
                <img 
                    className={'object-cover transition-all hover:scale-105 aspect-3/4 rounded-t-lg w-full h-full'}
                    src={developer.logoUrl || '/images/communities-default.webp'}
                    alt={developer.name || 'Dubai real estate developer'}
                    loading="lazy"
                />
            </Link>
        </div>
        <div className={'px-4 text-center py-2'}>
            <Link href={`/developers/${developer.slug}`} className="font-medium hover:text-blue-600 transition-colors">
                {developer.name}
            </Link>
        </div>
    </div>
));
DeveloperCard.displayName = 'DeveloperCard';

// Add this line to make the page dynamic instead of statically generated at build time
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: "Real estate developers | Dubai Real Estate | Buy, Sell or Rent Property in Dubai",
    description: "List of real estate developers in Dubai, Find your next home or investment in Dubai. Browse the latest Dubai property for sale or rent.",
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_URL}/developers`,
    },
};

async function DevelopersPage() {
    const developers = await getDevelopers();

    return (
        <>
            <div className="py-12 bg-black hidden lg:block">

            </div>
            <div className="py-12 px-6 max-w-7xl mx-auto">
                <h1 className="text-3xl font-semibold">
                    Real Estate Developers in Dubai
                </h1>
            </div>

            <div className={'max-w-7xl mx-auto py-6 lg:py-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'}>
                <Suspense fallback={
                    Array.from({ length: 8 }).map((_, index) => (
                        <DeveloperCardSkeleton key={index} />
                    ))
                }>
                    {developers.map((developer) => (
                        <DeveloperCard key={developer.id} developer={developer} />
                    ))}
                    
                    {developers.length === 0 && (
                        <div className="col-span-4 text-center py-12">
                            <p className="text-xl">No developers available at the moment.</p>
                        </div>
                    )}
                </Suspense>
            </div>

        </>
    );
}

export default DevelopersPage;