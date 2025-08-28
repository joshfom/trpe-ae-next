import { initEdgeStore } from '@edgestore/server';
import { createEdgeStoreNextHandler } from '@edgestore/server/adapters/next/app';
import {AzureProvider} from "@edgestore/server/providers/azure";
import {AWSProvider} from "@edgestore/server/providers/aws";

// For static export compatibility
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

// Generate static params for edgestore routes
export async function generateStaticParams() {
    return [
        { edgestore: ['upload'] },
        { edgestore: ['confirm'] },
        { edgestore: ['delete'] },
    ];
}

const es = initEdgeStore.create();

/**
 * This is the main router for the Edge Store buckets.
 */
const edgeStoreRouter = es.router({
    publicFiles: es.fileBucket()
        .beforeDelete(({ ctx, fileInfo }) => {
            return true; // allow delete
        }),
});

const handler = createEdgeStoreNextHandler({
    provider: AWSProvider({

    }),
    router: edgeStoreRouter,
});

export { handler as GET, handler as POST };

/**
 * This type is used to create the type-safe client for the frontend.
 */
export type EdgeStoreRouter = typeof edgeStoreRouter;