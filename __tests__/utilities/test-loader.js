// Test script for image loader
const myImageLoader = require('../../scripts/loader.js').default;

console.log('🧪 Testing Image Loader Functionality');
console.log('=====================================');

// Test cases
const testCases = [
    {
        name: 'Local image',
        src: '/images/logo.png',
        width: 800,
        quality: 80
    },
    {
        name: 'S3 external image',
        src: 'https://trpe-ae.s3.me-central-1.amazonaws.com/media/test/image.webp',
        width: 1920,
        quality: 75
    },
    {
        name: 'External image without quality',
        src: 'https://images.unsplash.com/photo-123.jpg',
        width: 640
    }
];

// Set NODE_ENV to production for testing
process.env.NODE_ENV = 'production';

testCases.forEach((testCase, index) => {
    console.log(`\n${index + 1}. ${testCase.name}:`);
    console.log(`   Input: ${testCase.src}`);
    
    try {
        const result = myImageLoader({
            src: testCase.src,
            width: testCase.width,
            quality: testCase.quality
        });
        console.log(`   Output: ${result}`);
        
        // Validate the output
        if (result.includes('localhost:3000/properties/')) {
            console.log('   ❌ ERROR: Still contains incorrect path!');
        } else if (result.startsWith('https://images.trpe.ae/image/')) {
            console.log('   ✅ GOOD: Correctly formatted URL');
        } else {
            console.log('   ⚠️  WARNING: Unexpected format');
        }
    } catch (error) {
        console.log(`   ❌ ERROR: ${error.message}`);
    }
});

console.log('\n🎯 Expected URL format:');
console.log('https://images.trpe.ae/image/[encoded-source-url]?width=X&quality=Y');
