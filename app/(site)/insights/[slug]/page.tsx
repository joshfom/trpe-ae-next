import React from 'react';
import {db} from "@/db/drizzle";
import {and, eq} from "drizzle-orm";
import {notFound} from "next/navigation";
import {insightTable} from "@/db/schema/insight-table";
import {Metadata, ResolvingMetadata} from "next";
import {truncateText} from "@/lib/truncate-text";
import SimilarInsights from "@/features/insights/components/SimilarInsights";
import {ServerProcessedTiptap} from "@/components/ServerProcessedTiptap";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Edit2 } from 'lucide-react';
import type {InsightType} from '@/types/insights';
import AdminEditButton from '@/components/admin-edit-button';

// Static generation configuration
export const dynamic = 'auto';
export const revalidate = 3600; // Revalidate every hour

// Generate static params for insights
export async function generateStaticParams() {
    try {
        const insights = await db.query.insightTable.findMany({
            columns: { slug: true },
            where: eq(insightTable.isLuxe, false),
            limit: 100 // Limit to top 100 insights
        });
        
        return insights.map(insight => ({
            slug: insight.slug,
        }));
    } catch (error) {
        console.error('Error generating static params:', error);
        return [];
    }
}


type Props = {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}


/**
 * Generates metadata for an insight detail page.
 * This function is used by Next.js to generate dynamic metadata for SEO purposes.
 *
 * @param {Object} props - The component props
 * @param {Object} props.params - Route parameters containing the insight slug
 * @param {Object} props.searchParams - Search parameters from the URL
 * @param {ResolvingMetadata} parent - Parent metadata from Next.js
 * @returns {Promise<Metadata>} A promise that resolves to the page metadata
 */
export async function generateMetadata(
    { params, searchParams }: {
        params: Promise<{ slug: string }>;
        searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
    },
    parent: ResolvingMetadata
): Promise<Metadata> {
    // Resolve the params promise
    const resolvedParams = await params;
    const slug = resolvedParams.slug;
    
    const post = await db.query.insightTable.findFirst({
        where: and(
            eq(insightTable.slug, slug),
            eq(insightTable.isLuxe, false)
        ),
    }) as unknown as InsightType;
    
    // Handle case when post is not found
    if (!post) {
        return {
            title: 'Insight not found',
            description: 'The insight you are looking for does not exist.',
            alternates: {
                canonical: `${process.env.NEXT_PUBLIC_URL}/insights/${slug}`,
            },
        };
    }
    
    const previousImages = (await parent).openGraph?.images || [];

    return {
        title: `${post.metaTitle || post.title}`,
        openGraph: {
            images: post.coverUrl ? [post.coverUrl, ...previousImages] : previousImages,
            type: 'article',
            url: `${process.env.NEXT_PUBLIC_URL}/insights/${post.slug}`
        },
        description: `${post.metaDescription || truncateText(post.content || '', 150)}`,
        alternates: {
            canonical: `${process.env.NEXT_PUBLIC_URL}/insights/${post.slug}`,
        },
    };
}

/**
 * Props interface for the InsightDetailPage component.
 * @interface
 * @property {Promise<{slug: string}>} params - Route parameters containing the insight slug
 */
interface InsightDetailPageProps {
    params: Promise<{
        slug: string
    }>;
}


async function InsightDetailPage(props: InsightDetailPageProps) {
    const params = await props.params;

    const post = await db.query.insightTable.findFirst({
        where: and(
            eq(insightTable.slug, params.slug),
            eq(insightTable.isLuxe, false)
        ),
    }) as unknown as InsightType

    if (!post) {
        return notFound()
    }

    const insightJsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.metaTitle || post.title,
        "image": post.coverUrl,
        "author": {
            "@type": "Organization",
            "name": "Drizzle"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Drizzle",
            "logo": {
                "@type": "ImageObject",
                "url": "https://drizzle.io/logo.png"
            }
        },
        "datePublished": post.publishedAt,
        "dateModified": post.updatedAt,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${process.env.NEXT_PUBLIC_URL}/insights/${post.slug}`
        }
    }

    return (
        <div className={' pb-12'}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(insightJsonLd) }}

            />


            <div className="lg:max-w-4xl mx-auto pt-12 flex flex-col gap-2">
                <h1 className={'text-2xl text-center px-6 font-semibold'}>
                    {post.title}
                </h1>
                
                <AdminEditButton href={`/admin/insights/edit/${post.slug}`} label="Edit Insight" />
            </div>

            <div className={'max-w-7xl mx-auto p-6 py-8'}>
                <div className="h-[500px] relative rounded-3xl overflow-hidden">
                    <img className={'object-cover w-full h-full absolute inset-0'} src={post.coverUrl!} alt={post.title!} />
                </div>
            </div>

           <div className="max-w-7xl mx-auto p-3 bg-white rounded-xl">
           <ServerProcessedTiptap
                content={post.content || ''}
            />
           </div>

            <SimilarInsights insightId={post.id}  />
        </div>
    );
}

export default InsightDetailPage;