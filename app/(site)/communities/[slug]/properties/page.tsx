import React from 'react';
import ListingsServer from "@/features/properties/components/ListingsServer";
import {Metadata} from "next";
import {eq} from "drizzle-orm";
import {db} from "@/db/drizzle";
import {TipTapView} from "@/components/TiptapView";
import {communityTable} from "@/db/schema/community-table";

// Generate static params for all communities
export async function generateStaticParams() {
    try {
        const communities = await db.query.communityTable.findMany({
            columns: { slug: true }
        });
        
        return communities.map((community) => ({
            slug: community.slug,
        }));
    } catch (error) {
        console.error('Error generating static params for communities:', error);
        return [];
    }
}

export const metadata: Metadata = {
    title: "Properties for Sale in Dubai | Find Your Next Home",
    description: "Browse the latest Dubai property for sale. Find your next home or investment in Dubai.",
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_URL}/properties/for-sale`,
    },
};

interface CommunityPropertiesPageProps {
    params: Promise<{
        slug: string;
    }>,
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}


async function CommunityPropertiesPage(props: CommunityPropertiesPageProps) {
    const params = await props.params;
    const searchParams = await props.searchParams;

    const {slug} = params;

    const community = await db.query.communityTable.findFirst({
        where: eq(communityTable.slug, slug),
    })

    return (
        <div className={' bg-slate-100'}>
            <ListingsServer 
                offeringType={'for-sale'}
                searchParams={searchParams}
                page={typeof searchParams.page === 'string' ? searchParams.page : undefined}
            />

            {
                community?.about &&
                <div className="max-w-7xl bg-white mx-auto px-4 py-8">
                    <TipTapView content={community.about}/>
                </div>
            }
        </div>
    );
}

export default CommunityPropertiesPage;