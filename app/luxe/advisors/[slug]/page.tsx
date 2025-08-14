import React from 'react';
import { db } from "@/db/drizzle";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import { employeeTable } from "@/db/schema/employee-table";
import { insightTable } from "@/db/schema/insight-table";
import { authorTable } from "@/db/schema/author-table";
import { Metadata, ResolvingMetadata } from "next";
import { truncateText } from "@/lib/truncate-text";
import LuxeAdvisorClient from './LuxeAdvisorClient';

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

    const advisor = await db.query.employeeTable.findFirst({
        where: and(
            eq(employeeTable.slug, slug),
            eq(employeeTable.isLuxe, true),
            eq(employeeTable.isVisible, true)
        ),
    })

    if (!advisor) {
        return {
            title: 'Advisor Not Found | Luxe - The Real Property Experts',
            description: 'The requested luxury property advisor could not be found.'
        }
    }

    // optionally access and extend (rather than replace) parent metadata
    const previousImages = (await parent).openGraph?.images || []

    return {
        title: `${advisor?.firstName} ${advisor?.lastName} | Luxe Advisor - The Real Property Experts`,
        openGraph: {
            images: advisor.avatarUrl ? [advisor.avatarUrl, ...previousImages] : previousImages,
            type: 'article',
            url: `/luxe/advisors/${advisor?.slug}`
        },
        description: `${truncateText(advisor.bio || '', 150)} - Luxury property advisor specializing in premium real estate in Dubai`,
        alternates: {
            canonical: `/luxe/advisors/${advisor.slug}`,
        },
    }
}

interface LuxeAdvisorPageProps {
    params: Promise<{
        slug: string
    }>
}

async function LuxeAdvisorPage(props: LuxeAdvisorPageProps) {
    const params = await props.params;

    // Get the luxe advisor with their insights
    const advisor = await db.query.employeeTable.findFirst({
        where: and(
            eq(employeeTable.slug, params.slug),
            eq(employeeTable.isLuxe, true),
            eq(employeeTable.isVisible, true)
        ),
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
            },
            insights: {
                where: and(
                    eq(insightTable.isLuxe, true),
                    eq(insightTable.isPublished, 'true')
                ),
                orderBy: (insights, { desc }) => [desc(insights.publishedAt)],
                limit: 20
            },
            author: true
        }
    })

    if (!advisor) {
        return notFound()
    }

    // Use the insights from the relation, or fall back to author-based matching
    let journalArticles = advisor.insights || []
    
    // If no direct insights, try to find by author relation or name matching
    if (journalArticles.length === 0 && advisor.author) {
        const authorInsights = await db.query.insightTable.findMany({
            where: and(
                eq(insightTable.isLuxe, true),
                eq(insightTable.isPublished, 'true'),
                eq(insightTable.authorId, advisor.author.id)
            ),
            orderBy: (insights, { desc }) => [desc(insights.publishedAt)],
            limit: 20
        })
        journalArticles = authorInsights
    }
    
    // Final fallback: search by name matching
    if (journalArticles.length === 0) {
        const allInsights = await db.query.insightTable.findMany({
            where: and(
                eq(insightTable.isLuxe, true),
                eq(insightTable.isPublished, 'true')
            ),
            orderBy: (insights, { desc }) => [desc(insights.publishedAt)],
            limit: 50
        })

        // Filter by matching author name
        journalArticles = allInsights.filter(article => {
            const authorName = article.authorId?.toLowerCase() || ''
            const advisorFullName = `${advisor.firstName} ${advisor.lastName}`.toLowerCase()
            const advisorFirstName = advisor.firstName?.toLowerCase() || ''
            const advisorLastName = advisor.lastName?.toLowerCase() || ''
            
            return authorName.includes(advisorFirstName) || 
                   authorName.includes(advisorLastName) ||
                   authorName.includes(advisorFullName)
        }).slice(0, 20)
    }

    return (
        <LuxeAdvisorClient 
            advisor={advisor as any} 
            journalArticles={journalArticles as any} 
        />
    );
}

export default LuxeAdvisorPage;
