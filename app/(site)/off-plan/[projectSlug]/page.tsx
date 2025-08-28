import React from 'react';
import {Metadata, ResolvingMetadata} from "next";
import {propertyTable} from "@/db/schema/property-table";
import {db} from "@/db/drizzle";
import {and, eq, ne} from "drizzle-orm";
import {notFound} from "next/navigation";
import {prepareExcerpt} from "@/lib/prepare-excerpt";
import {offplanTable} from "@/db/schema/offplan-table";
import ProjectDetailViewServer from "@/features/offplans/components/ProjectDetailViewServer";

// Generate static params for off-plan projects
export async function generateStaticParams() {
    try {
        const projects = await db.query.offplanTable.findMany({
            columns: { slug: true },
            limit: 50 // Limit to top 50 projects
        });
        
        return projects.map(project => ({
            projectSlug: project.slug,
        }));
    } catch (error) {
        console.error('Error generating static params:', error);
        return [];
    }
}

type Props = {
    params: Promise<{ projectSlug: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
    {params, searchParams}: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    // read route params
    const slug = (await params).projectSlug

    const project = await db.query.offplanTable.findFirst({
        where: eq(offplanTable.slug, slug),
        with: {
            images: true,
            developer: true,
        }
    }) as unknown as ProjectType | undefined;

    // optionally access and extend (rather than replace) parent metadata
    const previousImages = (await parent).openGraph?.images || []

    if (!project) {
        return {
            title: 'Project not found',
            description: 'The project you are looking for does not exist.',
        }
    }

    return {
        title: `${project.name} by ${project?.developer?.name} | off-plan property in ${project?.community?.name} | TRPE`,
        openGraph: {
            images: [project.images[0]?.url, ...previousImages],
            type: 'website',
            url: `/off-plans/${project?.slug}}`
        },
        description: `${prepareExcerpt(project.about, 166)} `,
    }
}

interface ShowProjectPageProps {
    params: Promise<{
        projectSlug: string
    }>
}

async function ShowProjectPage(props: ShowProjectPageProps) {
    const params = await props.params;

    const project = await db.query.offplanTable.findFirst({
        where: eq(offplanTable.slug, params.projectSlug),
        with: {
            community: true,
            images: true,
            developer: true,
            paymentPlans: true,
        }
    }) as unknown as ProjectType;

    if (!project) {
        notFound()
    }

    const similarProjects = await db.query.offplanTable.findMany({
        where: and(
            eq(propertyTable.communityId, project.communityId!),
            ne(propertyTable.id, project.id),
        ),
        with: {
            community: true,
            images: true,
        },
        limit: 3,
    }) as unknown as ProjectType[];

    return (
        <div>
            <ProjectDetailViewServer project={project} />
        </div>
    );
}

export default ShowProjectPage;