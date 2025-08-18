// Quick test script to verify image URLs
console.log('Testing Image URL Construction:');
console.log('=====================================');

// Simulate the loader function
function testImageLoader({ src, width, quality }) {
    const imageOptimizationApi = 'https://images.trpe.ae';
    
    const params = new URLSearchParams();
    if (width) params.set('width', width);
    if (quality) params.set('quality', quality || 75);
    
    let targetUrl;
    
    if (src.startsWith('http')) {
        targetUrl = src;
    } else if (src.startsWith('/')) {
        targetUrl = `https://trpe.ae${src}`;
    } else {
        targetUrl = `https://trpe.ae/${src}`;
    }
    
    const baseOptimizationUrl = `${imageOptimizationApi}/image/${targetUrl}`;
    return params.toString() ? `${baseOptimizationUrl}?${params.toString()}` : baseOptimizationUrl;
}

// Test with your S3 URL
const s3Url = 'https://trpe-ae.s3.me-central-1.amazonaws.com/media/mvwblq7qdfashlpnyio05i78/mvwblq7qdfashlpnyio05i78-4-1751330528415.webp';
const result = testImageLoader({ src: s3Url, width: 1920, quality: 75 });

console.log('Input S3 URL:', s3Url);
console.log('Generated URL:', result);
console.log('');
console.log('Expected format should be:');
console.log('https://images.trpe.ae/image/https://trpe-ae.s3.me-central-1.amazonaws.com/media/.../image.webp?width=1920&quality=75');
console.log('');

// Test if the service is running
console.log('To test if your image optimization service is working, try:');
console.log(`curl "${result}"`);
