import React from 'react';
import Link from "next/link";
import currencyConverter from "@/lib/currency-converter";
import unitConverter from "@/lib/unit-converter";
import { TipTapView } from "@/components/TiptapView";
import Image from "next/image";
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import {faqTable} from "@/db/schema/faq-table";

interface ProjectDetailViewServerProps {
    project: ProjectType
}

async function ProjectDetailViewServer({ project }: ProjectDetailViewServerProps) {
    // Fetch FAQs server-side
    const faqs = await db.query.faqTable.findMany({
        where: eq(faqTable.targetId, project.id),
    });
    
    return (
        <div className={'py-8 px-6 max-w-7xl mx-auto'}>
            <div className="flex justify-between pt-6 items-center mb-4">
                <div className="space-x-3">
                    <Link href={`/off-plan/`} className="text-gray-600 underline">
                        Off Plans
                    </Link>
                    <Link href={`/developers/${project.developer?.slug}`} className="text-gray-600 underline">
                        {project.developer.name}
                    </Link>
                    <span className="text-gray-600 underline">
                        {project.community.name}
                    </span>
                </div>
            </div>

            <div className={'grid grid-cols-1 lg:grid-cols-2 gap-1 rounded-lg overflow-hidden'}>
                <div className={'flex flex-col justify-center items-center gap-3'}>
                    <h1 className="text-4xl">
                        {project.name}
                    </h1>
                    By <Link href={`/developers/${project.developer.slug}`}>
                        <div className="h-32 w-full flex justify-center items-center relative">
                            <Image 
                                src={project.developer.logoUrl} 
                                alt={project.developer.name}
                                width={128}
                                height={128}
                                className="h-32 object-contain"
                            />
                        </div>
                    </Link>
                </div>
                <div className={'col-span-1 relative h-[300px] lg:h-[550px]'}>
                    {project.images.length > 0 && (
                        <div className="relative h-full w-full">
                            <Image
                                src={project.images[0].url}
                                alt={project.name}
                                fill
                                className="object-cover rounded-3xl overflow-hidden"
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="py-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6">
                <div>
                    Price from {' '} <span className="font-semibold">{currencyConverter(parseInt(`${project.fromPrice}`))}</span>
                </div>
                <div>
                    Price upto {' '} <span className="font-semibold">{currencyConverter(parseInt(`${project.toPrice}`))}</span>
                </div>
                <div>
                    Size from {' '} <span className="font-semibold">{unitConverter(parseInt(`${project.fromSize}`) / 100)}</span>
                </div>
                <div>
                    Size upto {' '} <span className="font-semibold">{unitConverter(parseInt(`${project.toSize}`) / 100)}</span>
                </div>
                <div className="">
                    Permit Number {' '} <span className="font-semibold">{project.permitNumber}</span>
                </div>
            </div>

            <div className="col-span-1 lg:col-span-2 px-6 py-12">
                <div className={'space-y-3 pb-12'}>
                    <h3 className={'text-2xl font-semibold mt-6'}>
                        About {project.name}
                    </h3>
                    <div id={'tip-tap'} className="p-6 bg-white rounded-xl">
                        <TipTapView content={project.about} />
                    </div>
                </div>

                <div className="pb-12 space-y-3">
                    <h3 className="text-2xl font-semibold my-6">
                        Gallery
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {project.images.slice(0, 6).map((image, index) => (
                            <div key={index} className={'relative'}>
                                <Image 
                                    src={image.url} 
                                    alt={`${project.name} - image ${index+1}`}
                                    width={300}
                                    height={240}
                                    className={'w-full h-60 rounded-lg object-cover'}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className={'space-y-3 pb-12'}>
                    <h3 className={'text-2xl font-semibold mt-6'}>
                        Developer
                    </h3>
                    <div dangerouslySetInnerHTML={{__html: project.developer.about}} className="p-3 rounded-2xl bg-white">
                    </div>
                </div>

                {faqs.length > 0 && (
                    <div className={'space-y-3 pb-12'}>
                        <h3 className={'text-2xl font-semibold mt-6'}>
                            FAQs
                        </h3>
                        {faqs.map((faq, index) => (
                            <div key={index} className="p-4 border rounded-lg mb-2">
                                <h4 className="font-semibold text-lg mb-2">{faq.question}</h4>
                                <p>{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProjectDetailViewServer;