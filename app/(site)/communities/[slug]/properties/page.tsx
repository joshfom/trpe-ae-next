import React, {Suspense} from 'react';
import Listings from "@/features/properties/components/Listings";
import {Metadata} from "next";
import {offeringTypeTable} from "@/db/schema/offering-type-table";
import {eq} from "drizzle-orm";
import {db} from "@/db/drizzle";
import PropertyPageSearchFilterServer from '@/features/search/PropertyPageSearchFilterServer';
import {TipTapView} from "@/components/TiptapView";
import {communityTable} from "@/db/schema/community-table";

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
    }>
}


async function CommunityPropertiesPage(props: CommunityPropertiesPageProps) {
    const params = await props.params;

    const {slug} = params;

    const community = await db.query.communityTable.findFirst({
        where: eq(communityTable.slug, slug),
    })

    return (
        <div className={' bg-slate-100'}>
            <div className="hidden lg:block py-12 bg-black">

            </div>

            <Listings offeringType={'for-sale'}/>

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