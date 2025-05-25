import React from 'react';
import Link from "next/link";
import {truncateText} from "@/lib/truncate-text";
import currencyConverter from "@/lib/currency-converter";
import unitConverter from "@/lib/unit-converter";
import {prepareExcerpt} from "@/lib/prepare-excerpt";
import Image from "next/image";

interface ProjectCardServerProps {
    project: ProjectType
}

const ProjectCardServer = React.memo<ProjectCardServerProps>(({project}) => {
    // Memoized computed values
    const truncatedName = React.useMemo(() => truncateText(project.name, 35), [project.name]);
    const excerpt = React.useMemo(() => prepareExcerpt(project.about, 200), [project.about]);
    const primaryImage = React.useMemo(() => project.images?.[0]?.url, [project.images]);
    const communityLink = React.useMemo(() => `/communities/${project.community?.slug}`, [project.community?.slug]);
    const projectLink = React.useMemo(() => `/off-plan/${project.slug}`, [project.slug]);
    return (
        <div className={'rounded-xl bg-white'}>
            <div className="relative">
                <div className="relative">
                    {primaryImage && (
                        <div className="h-96 relative">
                            <Image 
                                src={primaryImage} 
                                alt={project.name}
                                fill
                                className="object-cover rounded-t-xl"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                loading="lazy"
                                placeholder="blur"
                                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                            />
                        </div>
                    )}
                </div>
            </div>
            <div className="p-3 pt-8 border-b border-x rounded-b-xl border-white/20 relative">
                <div className="flex flex-col space-y-2 text-lg justify-center">
                    <Link href={projectLink} className={'text-xl font-semibold'}>
                        {truncatedName}
                    </Link>
                </div>
                
                <div className="py-2">
                    <Link href={projectLink} className={'text-sm'}>
                        {excerpt}
                    </Link>
                </div>
                
                <div className="absolute z-20 text-white -top-4 left-4">
                    <p className={'rounded-full bg-[#141414] border border-white py-1 px-3 text-center text-white text-sm'}>
                        <span className="sr-only">Property Details</span>
                        <Link href={communityLink}>
                            {project.community?.name}
                        </Link>
                    </p>
                </div>

                <div className="flex flex-col-reverse lg:flex-row gap-2 lg:gap-4 items-center space-x-2 pb-2 justify-between">
                    <div className="">
                        <Link href={`/developers/${project.developer?.slug}`}>
                            <div className="p-3 text-center">
                                <div className="h-24 w-full flex justify-center items-center relative">
                                    <Image 
                                        src={project.developer?.logoUrl || ''} 
                                        alt={project.developer?.name || "Developer logo"}
                                        width={96}
                                        height={96}
                                        className="h-24 object-contain"
                                    />
                                </div>
                            </div>
                        </Link>
                    </div>
                    <div className="flex flex-col space-y-2">
                        <p className={'text-end'}>
                            Price from {' '}
                            <span className="font-semibold">
                                {currencyConverter(parseInt(`${project.fromPrice}`))}
                            </span>
                        </p>
                        <p className={'text-end'}>
                            Size upto {' '}
                            <span className="font-semibold">
                                {unitConverter(parseInt(`${project.toSize}`) / 100)}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
});

ProjectCardServer.displayName = 'ProjectCardServer';

export default ProjectCardServer;