import { initEdgeStore } from '@edgestore/server';
import { AWSProvider } from "@edgestore/server/providers/aws";

console.log('🔍 Testing EdgeStore Configuration...\n');

// Test environment variables
console.log('Environment Variables:');
console.log('ES_AWS_ACCESS_KEY_ID:', process.env.ES_AWS_ACCESS_KEY_ID ? '✅ Set' : '❌ Missing');
console.log('ES_AWS_SECRET_ACCESS_KEY:', process.env.ES_AWS_SECRET_ACCESS_KEY ? '✅ Set' : '❌ Missing');
console.log('ES_AWS_REGION:', process.env.ES_AWS_REGION || '❌ Missing');
console.log('ES_AWS_BUCKET_NAME:', process.env.ES_AWS_BUCKET_NAME || '❌ Missing');

console.log('\n🧪 Testing AWS Provider initialization...');

try {
    const provider = AWSProvider({
        accessKeyId: process.env.ES_AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.ES_AWS_SECRET_ACCESS_KEY!,
        region: process.env.ES_AWS_REGION!,
        bucketName: process.env.ES_AWS_BUCKET_NAME!,
    });
    console.log('✅ AWS Provider initialized successfully');
} catch (error) {
    console.error('❌ AWS Provider initialization failed:', error);
}

console.log('\n🧪 Testing EdgeStore router...');

try {
    const es = initEdgeStore.create();
    const router = es.router({
        publicFiles: es.fileBucket({
            maxSize: 1024 * 1024 * 50, // 50MB
            accept: ['image/*', 'application/pdf'],
        })
    });
    console.log('✅ EdgeStore router created successfully');
} catch (error) {
    console.error('❌ EdgeStore router creation failed:', error);
}
