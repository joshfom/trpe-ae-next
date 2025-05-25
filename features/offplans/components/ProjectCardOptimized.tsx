'use client'
import React, { memo, useMemo } from 'react';
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

const ProjectCard = memo<ProjectCardProps>(({ project }) => {
    // Memoize computed values
    const imageUrls = useMemo(() => 
        project.images.slice(0, 3).map(image => image.url), 
        [project.images]
    );
    
    const projectLinks = useMemo(() => ({
        detail: `/off-plan/${project.slug}`,
        community: `/communities/${project.community?.slug}`,
        developer: `/developers/${project.developer?.slug}`
    }), [project.slug, project.community?.slug, project.developer?.slug]);

    const formattedValues = useMemo(() => ({
        title: truncateText(project.name, 35),
        description: prepareExcerpt(project.about, 200),
        fromPrice: currencyConverter(parseInt(`${project.fromPrice}`)),
        toSize: unitConverter(parseInt(`${project.toSize}`) / 100)
    }), [project.name, project.about, project.fromPrice, project.toSize]);

    return (
        <div className={'rounded-xl bg-white'}>
            <div className="relative">
                <div className="relative">
                    {project.images.length > 0 && (
                        <div className="h-96">
                            <ImageSwiper images={imageUrls}/>
                        </div>
                    )}
                </div>
            </div>
            <div className="p-3 pt-8 border-b border-x rounded-b-xl border-white/20 relative">
                <div className="flex flex-col space-y-2 text-lg justify-center">
                    <Link href={projectLinks.detail} className={'text-xl font-semibold'}>
                        {formattedValues.title}
                    </Link>
                </div>
                <div className="py-2">
                    <Link href={projectLinks.detail} className={'text-sm'}>
                        {formattedValues.description}
                    </Link>
                </div>
                <div className="absolute z-20 text-white -top-4 left-4">
                    <p className={'rounded-full bg-[#141414] border border-white py-1 px-3 text-center text-white text-sm'}>
                        <span className="sr-only">Property Details</span>
                        <Link href={projectLinks.community}>
                            {project.community?.name}
                        </Link>
                    </p>
                </div>

                <div className="flex flex-col-reverse lg:flex-row gap-2 lg:gap-4 items-center space-x-2 pb-2 justify-between">
                    <div className="p-3 text-center">
                        <div className="h-24 w-full flex justify-center items-center relative">
                            <Image 
                                src={project.developer?.logoUrl || ''}
                                alt={project.developer?.name || 'Developer logo'}
                                width={96}
                                height={96}
                                className="h-24 object-contain"
                                loading="lazy"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                        <p className={'text-end'}>
                            Price from {' '}
                            <span className="font-semibold">
                                {formattedValues.fromPrice}
                            </span>
                        </p>
                        <p className={'text-end'}>
                            Size upto {' '}
                            <span className="font-semibold">
                                {formattedValues.toSize}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
});

ProjectCard.displayName = 'ProjectCard';

export default ProjectCard;
