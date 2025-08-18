'use client'

export default function myImageLoader({ src, width, quality }) {
    // Your image optimization service (MUST be absolute URL)
    const imageOptimizationApi = 'https://images.trpe.ae';
    
    // For development with local images, bypass optimization
    if (process.env.NODE_ENV === 'development' && !src.startsWith('http')) {
        return src;
    }
    
    // Build query parameters
    const params = new URLSearchParams();
    if (width) params.set('width', width);
    if (quality) params.set('quality', quality || 75);
    
    let targetUrl;
    
    if (src.startsWith('http')) {
        // External URL (S3, etc.) - use as is
        targetUrl = src;
    } else if (src.startsWith('/')) {
        // Local absolute path - prepend your domain
        targetUrl = `https://trpe.ae${src}`;
    } else {
        // Relative path - convert to absolute
        targetUrl = `https://trpe.ae/${src}`;
    }
    
    // Based on the coollabs service, let's try the format they expect
    // URL should be: https://images.trpe.ae/image/https://source-url
    const baseOptimizationUrl = `${imageOptimizationApi}/image/${targetUrl}`;
    
    return params.toString() ? `${baseOptimizationUrl}?${params.toString()}` : baseOptimizationUrl;
}