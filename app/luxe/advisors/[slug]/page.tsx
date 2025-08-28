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
import LuxeAdvisorSSR from './LuxeAdvisorSSR';
import SSRToCSRSwitcher from '../../components/SSRToCSRSwitcher';
import { LuxeAdvisorSEO } from '@/components/seo/LuxeSEO';

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata(
    { params }: Props,
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
        title: `${advisor.firstName} ${advisor.lastName} | Luxe Advisor - The Real Property Experts`,
        openGraph: {
            images: advisor.avatarUrl ? [advisor.avatarUrl, ...previousImages] : previousImages,
            type: 'article',
            url: `/luxe/advisors/${advisor.slug}`
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
                    eq(insightTable.isPublished, 'yes')
                ),
                orderBy: (insights, { desc }) => [desc(insights.publishedAt)],
                limit: 20
            },
            author: {
                with: {
                    insights: {
                        where: and(
                            eq(insightTable.isLuxe, true),
                            eq(insightTable.isPublished, 'yes')
                        ),
                        orderBy: (insights, { desc }) => [desc(insights.publishedAt)],
                        limit: 20
                    }
                }
            }
        }
    })

    if (!advisor) {
        return notFound()
    }

    // Get journal articles from the advisor's linked author
    let journalArticles: any[] = []
    
    // Primary method: Get journals through the author relationship
    if (advisor.author && advisor.author.insights) {
        journalArticles = advisor.author.insights
    }
    
    // Fallback 1: If no author relation but authorId exists, fetch directly
    if (journalArticles.length === 0 && advisor.authorId) {
        const authorInsights = await db.query.insightTable.findMany({
            where: and(
                eq(insightTable.isLuxe, true),
                eq(insightTable.isPublished, 'yes'),
                eq(insightTable.authorId, advisor.authorId)
            ),
            orderBy: (insights, { desc }) => [desc(insights.publishedAt)],
            limit: 20
        })
        journalArticles = authorInsights
    }
    
    // Fallback 2: Get insights directly associated with this advisor/agent
    if (journalArticles.length === 0 && advisor.insights) {
        journalArticles = advisor.insights
    }
    
    // Fallback 3: Search by agentId in insights table
    if (journalArticles.length === 0) {
        const agentInsights = await db.query.insightTable.findMany({
            where: and(
                eq(insightTable.isLuxe, true),
                eq(insightTable.isPublished, 'yes'),
                eq(insightTable.agentId, advisor.id)
            ),
            orderBy: (insights, { desc }) => [desc(insights.publishedAt)],
            limit: 20
        })
        journalArticles = agentInsights
    }

    return (
        <>
            {/* Luxe Advisor SEO with structured data and breadcrumbs */}
            <LuxeAdvisorSEO 
                advisor={{
                    name: `${advisor.firstName} ${advisor.lastName}`,
                    slug: advisor.slug,
                    title: advisor.title || 'Luxury Real Estate Advisor',
                    bio: advisor.bio || undefined,
                    email: advisor.email || undefined,
                    phone: advisor.phone || undefined,
                    avatarUrl: advisor.avatarUrl || undefined
                }}
            />
            
            {/* SSR Version */}
            <div id="ssr-advisor">
                <LuxeAdvisorSSR 
                    advisor={advisor as any}
                    journalArticles={journalArticles as any}
                />
            </div>

            {/* CSR Version - Hidden by default, shown after JS loads */}
            <div id="csr-advisor" style={{ display: 'none' }}>
                <LuxeAdvisorClient 
                    advisor={advisor as any} 
                    journalArticles={journalArticles as any} 
                />
            </div>

            {/* Component to handle SSR to CSR switching */}
            <SSRToCSRSwitcher ssrSelector="#ssr-advisor" csrSelector="#csr-advisor" />
        </>
    );
}

export default LuxeAdvisorPage;
