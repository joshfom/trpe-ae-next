import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest } from 'next/server'
import { revalidateAllContent, revalidateHomepage, revalidateListings, revalidateCommunities, revalidateInsights } from '@/lib/cache-revalidation';

/**
 * Request body type definition for the revalidation endpoint
 * @example
 * {
 *   path: '/posts/123',
 *   tag: 'post-123',
 *   type: 'homepage',
 *   secret: 'your-secret-key'
 * }
 */
export interface RevalidateRequestBody {
    /** The page path to revalidate (e.g., '/posts/123') */
    path?: string;
    /** The cache tag to revalidate (e.g., 'post-123') */
    tag?: string;
    /** The type of content to revalidate (homepage, listings, communities, insights, all) */
    type?: 'homepage' | 'listings' | 'communities' | 'insights' | 'all';
    /** Secret key for authentication */
    secret?: string;
    /** Optional offering type ID for listings revalidation */
    offeringTypeId?: string;
}

/**
 * Success response type definition
 * @example
 * {
 *   revalidated: true,
 *   now: 1706454789543
 * }
 */
export interface RevalidateSuccessResponse {
    /** Indicates whether revalidation was successful */
    revalidated: true;
    /** Timestamp of when revalidation occurred */
    now: number;
}

/**
 * Error response type definition
 * @example
 * {
 *   revalidated: false,
 *   error: 'Error revalidating'
 * }
 */
export interface RevalidateErrorResponse {
    /** Indicates that revalidation failed */
    revalidated: false;
    /** Error message describing what went wrong */
    error: string;
}

/**
 * Combined response type for the revalidation endpoint
 */
export type RevalidateResponse = RevalidateSuccessResponse | RevalidateErrorResponse;

/**
 * Route handler for on-demand revalidation of Next.js cache
 * Endpoint: POST /api/revalidate
 *
 * This handler enables on-demand revalidation of Next.js cached pages and data.
 * It can revalidate specific paths or tagged cache entries.
 *
 * @description
 * The handler accepts POST requests with a JSON body containing:
 * - path: The page path to revalidate (e.g., '/posts/123')
 * - tag: The cache tag to revalidate (e.g., 'post-123')
 *
 * You can provide either path, tag, or both. The handler will revalidate
 * the specified cache entries, making fresh data available for subsequent requests.
 *
 * @example
 * // Revalidate by path
 * await fetch('/api/revalidate', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ path: '/posts/123' })
 * })
 *
 * // Revalidate by tag
 * await fetch('/api/revalidate', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ tag: 'post-123' })
 * })
 */
export async function POST(request: NextRequest): Promise<Response> {
    try {
        const { path, tag, type, secret, offeringTypeId } = (await request.json()) as RevalidateRequestBody;

        // Check for secret if type-based revalidation is requested
        if (type && secret !== process.env.REVALIDATION_SECRET) {
            return Response.json({ revalidated: false, error: 'Invalid secret' }, { status: 401 });
        }

        // Handle type-based revalidation (new SSR optimization)
        if (type) {
            switch (type) {
                case 'homepage':
                    await revalidateHomepage();
                    break;
                case 'listings':
                    await revalidateListings(offeringTypeId);
                    break;
                case 'communities':
                    await revalidateCommunities();
                    break;
                case 'insights':
                    await revalidateInsights();
                    break;
                case 'all':
                    await revalidateAllContent();
                    break;
                default:
                    return Response.json({ revalidated: false, error: 'Invalid revalidation type' }, { status: 400 });
            }
        }

        // Handle legacy path/tag revalidation
        if (path) {
            revalidatePath(path)
        }

        if (tag) {
            revalidateTag(tag)
        }

        const response: RevalidateSuccessResponse = {
            revalidated: true,
            now: Date.now()
        }
        return Response.json(response)
    } catch (error) {
        const response: RevalidateErrorResponse = {
            revalidated: false,
            error: error instanceof Error ? error.message : 'Error revalidating'
        }
        return Response.json(response, { status: 500 })
    }
}