import { initEdgeStore } from '@edgestore/server';
import { createEdgeStoreNextHandler } from '@edgestore/server/adapters/next/app';
import {AzureProvider} from "@edgestore/server/providers/azure";
import {AWSProvider} from "@edgestore/server/providers/aws";

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