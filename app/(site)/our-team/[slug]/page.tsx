import React from 'react';
import {Mail, Phone} from "lucide-react";
import {db} from "@/db/drizzle";
import {eq} from "drizzle-orm";
import ListWithAgent from "@/features/agents/components/ListWithAgent";
import {notFound} from "next/navigation";
import ListingsGrid from "@/features/properties/components/ListingsGrid";
import {employeeTable} from "@/db/schema/employee-table";
import {Metadata, ResolvingMetadata} from "next";
import {communityTable} from "@/db/schema/community-table";
import {truncateText} from "@/lib/truncate-text";


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

    const agent = await db.query.employeeTable.findFirst({
        where: eq(employeeTable.slug, slug),
    }) as unknown as AgentType

    // optionally access and extend (rather than replace) parent metadata
    const previousImages = (await parent).openGraph?.images || []

    return {
        title: `${agent?.firstName} ${agent?.lastName} | The Real Property Experts`,

        openGraph: {
            images: [agent.avatarUrl, ...previousImages],
            type: 'article',
            url: `/our-team/${agent?.slug}`
        },
        description: `${truncateText(agent.bio, 150)} `,
        alternates: {
            canonical: `/our-team/${agent.slug}`,
        },
    }
}

interface AgentDetailPageProps {
    params: Promise<{
        slug: string
    }>
}

async function AgentDetailPage(props: AgentDetailPageProps) {
    const params = await props.params;

    const agent = await db.query.employeeTable.findFirst({
        where: eq(employeeTable.slug, params.slug),
        with: {
            properties: {
                with: {
                    images: true,
                    agent: true,
                    community: true,
                    city: true,
                    subCommunity: true,
                    offeringType: true,
                    type: true
                }
            }
        }
    })

    if (!agent) {
        return notFound()
    }

    const agentJsonLD = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": agent?.firstName + ' ' + agent?.lastName,
        "jobTitle": "Property Expert",
        "image": agent?.avatarUrl,
        "url": `${process.env.NEXT_PUBLIC_URL}/our-team/${agent?.slug}`,
        "email": agent?.email,
        "telephone": agent?.phone,
        "description": agent?.bio,
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Dubai",
            "addressCountry": "UAE"
        }
    }

    return (
        (<div className={'bg-black pt-12 lg:pt-24 text-white'}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{__html: JSON.stringify(agentJsonLD)}}
            />
            <div className={'max-w-7xl mx-auto p-6 pt-12 grid grid-cols-1 lg:grid-cols-3 gap-8'}>
                <div className={'py-6'}>
                    <div
                        className={'bg-[#1a1a1a] shadow-sm rounded-xl p-6 flex items-center justify-center flex-col gap-4'}>
                        <div className=" flex flex-col gap-2">
                            <h1 className={'text-2xl text-center font-semibold'}>
                                {agent?.firstName + ' ' + agent?.lastName}
                            </h1>
                            <div className="flex justify-between items-center">
                                <p className={'text-center'}>Property Expert {' '}</p>
                                {
                                    agent?.rera && (
                                        <p className={'text-center pl-2'}>
                                            BRN: <span className="font-semibold">{' '+agent.rera}</span>
                                        </p>
                                    )
                                }
                            </div>
                        </div>
                        <div className={'w-full h-[500px] relative'}>
                            <div className="relative h-[500px] w-full lg:w-[90%] mx-auto border border-gray-700 rounded-3xl overflow-hidden">
                                <img 
                                    className={'object-cover absolute inset-0 w-full h-full'} 
                                    src={agent.avatarUrl || '/images/defaults/agent.jpg'} 
                                    alt={`${agent.firstName} ${agent.lastName}`}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col w-full lg:w-[90%] justify-between">
                            <div className={'flex justify-between gap-4'}>
                                <a className={'inline-flex items-center justify-center border w-1/2 py-1.5 rounded-3xl px-4 border-gray-700'} href="tel:+971 50 523 2712">
                                    <Phone className={'mr-2 text-white stroke-1'} size={20}/>
                                    <span className={'text-lg'}>
                                       Call
                                    </span>
                                </a>
                                <a className={'inline-flex items-center justify-center border w-1/2 py-1.5 rounded-3xl px-4 border-gray-700'} href="mailto:info@trpe.ae">
                                    <Mail className={'mr-2 text-white stroke-1'} size={20}/>
                                    <span className={'text-lg'}>
                                        Email
                                    </span>
                                </a>
                            </div>
                            <div>

                            </div>
                        </div>
                    </div>

                </div>
                <div className={'col-span-1 lg:col-span-2 pt-6 lg:px-16 h-full justify-between flex  flex-col'}>
                   <div className="space-y-4 flex-1">
                       <h2 className="text-3xl font-semibold">
                           About
                       </h2>

                       {
                           agent?.bio && (
                               <div className="space-y-2 text-white flex-1 overflow-y-auto mt-6" dangerouslySetInnerHTML={{__html: agent.bio}}>

                               </div>
                           )
                       }
                   </div>

                    <div className="py-6 w-full flex justify-between">
                        <div className={'space-x-3 flex'}>

                            <div className={'flex space-x-3'}>
                                <div className={'flex'}>
                                    <svg
                                        viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg"
                                        xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img"
                                        className="h-6 w-6 mr-2" preserveAspectRatio="xMidYMid meet"
                                        fill="#000000">
                                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round"
                                           strokeLinejoin="round"></g>
                                        <g id="SVGRepo_iconCarrier">
                                            <path fill="#00247D"
                                                  d="M0 9.059V13h5.628zM4.664 31H13v-5.837zM23 25.164V31h8.335zM0 23v3.941L5.63 23zM31.337 5H23v5.837zM36 26.942V23h-5.631zM36 13V9.059L30.371 13zM13 5H4.664L13 10.837z"></path>
                                            <path fill="#CF1B2B"
                                                  d="M25.14 23l9.712 6.801a3.977 3.977 0 0 0 .99-1.749L28.627 23H25.14zM13 23h-2.141l-9.711 6.8c.521.53 1.189.909 1.938 1.085L13 23.943V23zm10-10h2.141l9.711-6.8a3.988 3.988 0 0 0-1.937-1.085L23 12.057V13zm-12.141 0L1.148 6.2a3.994 3.994 0 0 0-.991 1.749L7.372 13h3.487z"></path>
                                            <path fill="#EEE"
                                                  d="M36 21H21v10h2v-5.836L31.335 31H32a3.99 3.99 0 0 0 2.852-1.199L25.14 23h3.487l7.215 5.052c.093-.337.158-.686.158-1.052v-.058L30.369 23H36v-2zM0 21v2h5.63L0 26.941V27c0 1.091.439 2.078 1.148 2.8l9.711-6.8H13v.943l-9.914 6.941c.294.07.598.116.914.116h.664L13 25.163V31h2V21H0zM36 9a3.983 3.983 0 0 0-1.148-2.8L25.141 13H23v-.943l9.915-6.942A4.001 4.001 0 0 0 32 5h-.663L23 10.837V5h-2v10h15v-2h-5.629L36 9.059V9zM13 5v5.837L4.664 5H4a3.985 3.985 0 0 0-2.852 1.2l9.711 6.8H7.372L.157 7.949A3.968 3.968 0 0 0 0 9v.059L5.628 13H0v2h15V5h-2z"></path>
                                            <path fill="#CF1B2B" d="M21 15V5h-6v10H0v6h15v10h6V21h15v-6z"></path>
                                        </g>
                                    </svg>
                                    English

                                </div>
                            </div>
                        </div>
                        {/*// @ts-ignore*/}
                        <ListWithAgent agent={agent}/>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto py-12 px-6">
                <h3 className="text-3xl">
                    {agent?.firstName}&apos;s Listings
                </h3>

                <div className="py-6">
                    {
                        agent?.properties &&
                        agent?.properties?.length > 0 ? (
                            // @ts-ignore
                            (<ListingsGrid listings={agent?.properties}/>)
                        ) : (
                            <div className={'text-white text-center'}>
                                <h2 className={'text-2xl font-semibold'}>
                                    No properties found
                                </h2>
                                <p>
                                    No properties found for your filter.
                                </p>
                            </div>
                        )

                    }
                </div>
            </div>
        </div>)
    );
}

export default AgentDetailPage;