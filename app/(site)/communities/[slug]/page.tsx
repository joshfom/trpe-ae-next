import React from 'react';
import {db} from "@/db/drizzle";
import {eq} from "drizzle-orm";
import {communityTable} from "@/db/schema/community-table";
import {notFound} from "next/navigation";
import PropertyCard from "@/components/property-card";
import {Metadata, ResolvingMetadata} from "next";
import {truncateText} from "@/lib/truncate-text";
import {TipTapView} from "@/components/TiptapView";
import Link from "next/link";
import {validateRequest} from "@/lib/auth";
import {EditCommunitySheet} from "@/features/community/components/EditCommunitySheet";

interface ShowCommunityPageProps {
    params: Promise<{
        slug: string;
    }>
}

type Props = {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    // read route params
    const slug = (await params).slug

    const community = await db.query.communityTable.findFirst({
        where: eq(communityTable.slug, slug),
    }) as unknown as CommunityType

    // optionally access and extend (rather than replace) parent metadata
    const previousImages = (await parent).openGraph?.images || []

    const metaTitle = `${community?.name} | Real Estate Communities in Dubai, UAE`
    const metaDesc = community?.metaDesc || truncateText(community?.about, 150)
    const metaDescription = `${ metaDesc ?  metaDesc : community.name + ' - Explore our real estate communities, where buyers, sellers, and investors connect. Stay updated on the latest property listings, and valuable resources to help you make informed decisions in buying and selling real estate.'} `

    return {
        title: community.metaTitle || metaTitle,
        alternates: {
            canonical: `${process.env.NEXT_PUBLIC_URL}/communities/${community?.slug}`,
        },

        openGraph: {
            images: [community.image, ...previousImages],
            type: 'article',
            url: `${process.env.NEXT_PUBLIC_URL}/communities/${community?.slug}`
        },
        description: community.metaDesc || metaDescription
    }
}

async function ShowCommunityPage(props: ShowCommunityPageProps) {
    const params = await props.params;
    const { user } = await validateRequest();

    const community = await db.query.communityTable.findFirst({
        where: eq(communityTable.slug, params.slug),
        with: {
            properties: {
                with: {
                    images: true,
                    city: true,
                    community: true,
                    subCommunity: true,
                    agent: true,
                    offeringType: true,
                    type: true
                },
                limit: 6,
            },
        },
    }) as unknown as CommunityType

    if (!community) {
        return notFound()
    }

    const properties = community.properties as unknown as PropertyType[]

    return (
        (<div className={''}>
            <div className="py-12 bg-black hidden lg:block">

            </div>
            <div className=" py-8 ">
                <div className="flex justify-between items-center px-6 pb-4 max-w-7xl mx-auto">
                    <h1 className="text-2xl">
                        Properties in {community.name}
                    </h1>
                    
                    {user && (
                        <EditCommunitySheet community={community} />
                    )}
                </div>
                <div
                    className={'max-w-7xl px-6 lg:px-0 mx-auto py-4 lg:p-6 lg:grid-cols-4  tex-slate-200'}>
                    <div className={'col-span-1 lg:col-span-3'}>
                        {
                            properties.length > 0 ? (
                                <div className={'grid grid-cols-1 lg:grid-cols-3 gap-8'}>

                                    {
                                        properties?.map((listing) => (
                                            // @ts-ignore
                                            (<PropertyCard key={listing.id} property={listing}/>)
                                        ))}
                                </div>
                            ) : (
                                <div className={' text-center'}>
                                    <h2 className={'text-2xl font-semibold'}>
                                       No listing in {community.name} yet
                                    </h2>
                                    <p>
                                        Check back later for new listings
                                    </p>
                                </div>
                            )

                        }
                    </div>
                </div>
                {/*<div className="flex items-center justify-center py-6">*/}
                {/*    {*/}
                {/*        properties.length > 0 ? (*/}
                {/*            <a href={`/communities/${community.slug}/properties`}*/}
                {/*               className="text-sm text-gray-500 hover:text-gray-700">*/}
                {/*                View all properties in {community.name}*/}
                {/*            </a>*/}
                {/*        ) : (*/}
                {/*            <div className="flex flex-col gap-6 items-center justify-between px-6">*/}

                {/*                <div className="flex flex-col lg:flex-row justify-between items-center gap-12">*/}
                {/*                    <Link href={'/communities'} className=" py-3 px-6 bg-white rounded-3xl hover:bg-slate-50 text-gray-500 hover:text-gray-700">*/}
                {/*                        Back to Communities*/}
                {/*                    </Link>*/}
                {/*                    <Link href={'/properties/for-sale'} className=" rounded-3xl bg-white hover:bg-slate-50 py-3 px-6 text-gray-500 hover:text-gray-700">*/}
                {/*                        View all properties in Dubai*/}
                {/*                    </Link>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*        )*/}
                {/*    }*/}
                {/*</div>*/}
            </div>
            {
                community.about ? (
                    <div className=" lg:pt-8 px-6 max-w-7xl mx-auto">
                        <h2 className=" text-xl ">
                            About {community.name}
                        </h2>
                        <div className={'mt-3 p-6 bg-white rounded-2xl  mx-auto'}>
                            <TipTapView content={community.about}/>
                        </div>
                    </div>
                ) : (
                    <div className={'pt-12'}>

                    </div>
                )
            }
            <div className="py-12">

            </div>
        </div>)
    );
}

export default ShowCommunityPage;