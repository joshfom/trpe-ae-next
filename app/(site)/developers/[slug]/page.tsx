import React from 'react';
import {db} from "@/db/drizzle";
import {eq} from "drizzle-orm";
import {notFound} from "next/navigation";
import {Metadata, ResolvingMetadata} from "next";
import {truncateText} from "@/lib/truncate-text";
import {developerTable} from "@/db/schema/developer-table";

interface ShowDeveloperPageProps {
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

    const developer = await db.query.developerTable.findFirst({
        where: eq(developerTable.slug, slug),
    }) as unknown as DeveloperType

    // optionally access and extend (rather than replace) parent metadata
    const previousImages = (await parent).openGraph?.images || []

    return {
        title: `${developer?.name} | Real Estate Developers in Dubai | TRPE`,
        alternates: {
            canonical: `${process.env.NEXT_PUBLIC_URL}/developers/${developer?.slug}`,
        },
        openGraph: {
            images: [developer.logoUrl, ...previousImages],
            type: 'article',
            url: `${process.env.NEXT_PUBLIC_URL}/developers/${developer?.slug}`
        },
        description: `${ developer.about ?  truncateText(developer.about, 150) : developer.name + ' - Explore our real estate communities, where buyers, sellers, and investors connect. Stay updated on the latest property listings, market insights, and valuable resources to help you make informed decisions in buying and selling real estate.'} `,
    }
}

async function ShowDeveloperPage(props: ShowDeveloperPageProps) {
    const params = await props.params;

    const developer = await db.query.developerTable.findFirst({
        where: eq(developerTable.slug, params.slug),
    })

    if (!developer) {
        return notFound()
    }


    return (
        <div className={'bg-black lg:pt-20'}>

            {
                developer.about ? (
                    <div className="py-12 lg:pt-24 px-6 max-w-7xl mx-auto">
                        <h1 className="text-3xl text-center text-white">
                            About {developer.name}
                        </h1>
                        <div className={'text-white pt-12 text-center max-w-3xl mx-auto'}
                             dangerouslySetInnerHTML={{__html: developer.about}}>
                        </div>
                    </div>
                ) : (
                    <div className={'pt-12'}>

                    </div>
                )
            }

            {/*<div className="py-12 bg-black">*/}
            {/*    <h2 className="text-2xl text-white px-6 pb-4 max-w-7xl mx-auto">*/}
            {/*        Properties in {developer.name}*/}
            {/*    </h2>*/}
            {/*    <div*/}
            {/*        className={'max-w-7xl px-6 lg:px-0 mx-auto py-4 lg:p-6 lg:grid-cols-4 bg-black tex-slate-200'}>*/}
            {/*        <div className={'col-span-1 lg:col-span-3'}>*/}
            {/*            {*/}
            {/*                properties.length > 0 ? (*/}
            {/*                    <div className={'grid grid-cols-1 lg:grid-cols-3 gap-8'}>*/}

            {/*                        {*/}
            {/*                            properties?.map((listing) => (*/}
            {/*                                // @ts-ignore*/}
            {/*                                <PropertyCard key={listing.id} property={listing}/>*/}
            {/*                            ))}*/}
            {/*                    </div>*/}
            {/*                ) : (*/}
            {/*                    <div className={'text-white text-center'}>*/}
            {/*                        <h2 className={'text-2xl font-semibold'}>*/}
            {/*                            No properties found*/}
            {/*                        </h2>*/}
            {/*                        <p>*/}
            {/*                            No properties found for your filter.*/}
            {/*                        </p>*/}
            {/*                    </div>*/}
            {/*                )*/}

            {/*            }*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>
    );
}

export default ShowDeveloperPage;