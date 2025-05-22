'use client'
import React from 'react';
import {Dot} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {truncateText} from "@/lib/truncate-text";
import currencyConverter from "@/lib/currency-converter";
import unitConverter from "@/lib/unit-converter";
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css';
import {ImageSwiper} from "@/features/properties/components/ImageSwiper";
import {prepareExcerpt} from "@/lib/prepare-excerpt";

interface ProjectCardProps {
    project: ProjectType
}

function ProjectCard({project}: ProjectCardProps) {

   const imageUrls = project.images.slice(0, 3).map(image => image.url);
    return (
        <div
            className={'rounded-xl  bg-white'}>
            <div className="relative">
                <div className="relative">
                    {
                        project.images.length > 0 && (
                            <div className="h-96 ">
                                <ImageSwiper images={imageUrls}/>
                            </div>
                        )
                    }
                </div>
            </div>
            <div className="p-3 pt-8 border-b border-x rounded-b-xl border-white/20 relative">
                <div
                    className="flex flex-col space-y-2 text-lg justify-center">
                    <Link href={`/off-plan/${project.slug}`} className={'text-xl font-semibold'}>
                        {
                            truncateText(project.name, 35)
                        }
                    </Link>

                </div>
                <div className="py-2">
                    <Link href={`/off-plan/${project.slug}`}
                          className={'text-sm '}>
                        {
                            prepareExcerpt(project.about, 200)
                        }
                    </Link>
                </div>
                <div
                    className="absolute  z-20  text-white -top-4 left-4">
                    <p
                        className={'rounded-full  bg-[#141414] border border-white py-1 px-3 text-center text-white text-sm'}>
                        <span className="sr-only">Property Details</span>
                        <Link href={`/communities/${project.community?.slug}`}>
                            {
                                project.community?.name
                            }
                        </Link>

                    </p>
                </div>

                <div
                    className="flex flex-col-reverse lg:flex-row gap-2 lg:gap-4 items-center space-x-2 pb-2 justify-between">
                    <div className="p-3 text-center">
                        <div className="h-24 w-full flex justify-center items-center relative">
                            <Image 
                                src={project.developer?.logoUrl || ''}
                                alt={project.developer?.name || 'Developer logo'}
                                width={96}
                                height={96}
                                className="h-24 object-contain"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                        <p className={'text-end'}>
                            Price from {' '}
                            <span className="font-semibold">
                            {
                                currencyConverter(parseInt(`${project.fromPrice}`))
                            }
                       </span>
                        </p>
                        <p className={'text-end'}>
                           Size upto {' '}
                            <span className="font-semibold">
                            {
                                unitConverter(parseInt(`${project.toSize}`) / 100)
                            }
                       </span>
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default ProjectCard;