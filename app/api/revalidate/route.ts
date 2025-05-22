import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest } from 'next/server'

/**
 * Request body type definition for the revalidation endpoint
 * @example
 * {
 *   path: '/posts/123',
 *   tag: 'post-123'
 * }
 */
export interface RevalidateRequestBody {
    /** The page path to revalidate (e.g., '/posts/123') */
    path?: string;
    /** The cache tag to revalidate (e.g., 'post-123') */
    tag?: string;
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
 *
 * @param request - Next.js request object
 * @returns Response object indicating success or failure
 */
export async function POST(request: NextRequest): Promise<Response> {
    try {
        const { path, tag } = (await request.json()) as RevalidateRequestBody;

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
            error: 'Error revalidating'
        }
        return Response.json(response, { status: 500 })
    }
}