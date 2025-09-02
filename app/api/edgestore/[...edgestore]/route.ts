import { initEdgeStore } from '@edgestore/server';
import { createEdgeStoreNextHandler } from '@edgestore/server/adapters/next/app';
import {AzureProvider} from "@edgestore/server/providers/azure";
import {AWSProvider} from "@edgestore/server/providers/aws";

// EdgeStore requires dynamic routes for file uploads
export const dynamic = 'force-dynamic';

const es = initEdgeStore.create();

/**
 * This is the main router for the Edge Store buckets.
 */
const edgeStoreRouter = es.router({
    publicFiles: es.fileBucket({
        maxSize: 1024 * 1024 * 50, // 50MB
        accept: ['image/*', 'application/pdf'],
    })
        .beforeUpload(({ ctx, input }) => {
            // Optional: Add authentication check here
            return true; // allow upload
        })
        .beforeDelete(({ ctx, fileInfo }) => {
            return true; // allow delete
        }),
});

const handler = createEdgeStoreNextHandler({
    provider: AWSProvider({
        accessKeyId: process.env.ES_AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.ES_AWS_SECRET_ACCESS_KEY!,
        region: process.env.ES_AWS_REGION!,
        bucketName: process.env.ES_AWS_BUCKET_NAME!,
    }),
    router: edgeStoreRouter,
});

export { handler as GET, handler as POST };

/**
 * This type is used to create the type-safe client for the frontend.
 */
export type EdgeStoreRouter = typeof edgeStoreRouter;