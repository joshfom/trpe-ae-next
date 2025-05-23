import React from 'react';
import {db} from "@/db/drizzle";
import {eq} from "drizzle-orm";
import {notFound} from "next/navigation";
import {insightTable} from "@/db/schema/insight-table";
import {Metadata, ResolvingMetadata} from "next";
import {truncateText} from "@/lib/truncate-text";
import SimilarInsights from "@/features/insights/components/SimilarInsights";
import {TipTapView} from "@/components/TiptapView";
import {validateRequest} from "@/actions/auth-session";
import {EditInsightSheet} from "@/features/insights/components/EditInsightSheet";


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
        where: eq(insightTable.slug, slug),
    }) as unknown as InsightType;
    const previousImages = (await parent).openGraph?.images || [];

    return {
        title: `${post?.metaTitle || post?.title}`,
        openGraph: {
            images: [post.coverUrl, ...previousImages],
            type: 'article',
            url: `${process.env.NEXT_PUBLIC_URL}/insights/${post?.slug}`
        },
        description: `${post.metaDescription || truncateText(post.content, 150)}`,
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
    const { user } = await validateRequest();

    const post = await db.query.insightTable.findFirst({
        where: eq(insightTable.slug, params.slug),
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
            <div className="py-12 bg-black hidden lg:block">

            </div>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(insightJsonLd) }}

            />


            <div className="lg:max-w-4xl mx-auto pt-12 flex flex-col gap-2">
                <h1 className={'text-2xl text-center px-6 font-semibold'}>
                    {post.title}
                </h1>
                
                {user && (
                    <div className="flex justify-end mt-4 px-6">
                        <EditInsightSheet insight={post} />
                    </div>
                )}
            </div>

            <div className={'max-w-7xl mx-auto p-6 py-8'}>
                <div className="h-[500px] relative rounded-3xl overflow-hidden">
                    <img className={'object-cover w-full h-full absolute inset-0'} src={post.coverUrl!} alt={post.title!} />
                </div>
            </div>

           <div className="max-w-7xl mx-auto p-3 bg-white rounded-xl">
           <TipTapView
                content={post.content}
            />
           </div>

            <SimilarInsights insightId={post.id}  />
        </div>
    );
}

export default InsightDetailPage;