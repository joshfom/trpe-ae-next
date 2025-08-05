# Advanced Image Optimization System

This system provides comprehensive image optimization for SEO and performance, including next-generation format support, responsive images with lazy loading, and SEO optimization.

## Components

### 1. ImageOptimizer (`image-optimizer.ts`)

Handles next-generation image format support with automatic format selection.

**Features:**
- WebP and AVIF format generation
- Browser support detection
- Content-type specific quality optimization
- Automatic format fallbacks

**Usage:**
```typescript
import { ImageOptimizer, createImageConfig } from '@/lib/performance/image-optimizer';

const optimizer = ImageOptimizer.getInstance();

// Detect browser support
const support = await optimizer.detectBrowserSupport();

// Get optimal format
const format = await optimizer.getOptimalFormat('photo');

// Generate multiple formats
const config = createImageConfig('photo', 1920, 1080);
config.formats = await optimizer.getRecommendedFormats('photo');
const optimizedImages = await optimizer.generateFormats(file, config);
```

### 2. ResponsiveImageSystem (`responsive-image-system.ts`)

Provides responsive image generation with lazy loading support.

**Features:**
- Srcset generation for multiple breakpoints
- Intersection Observer-based lazy loading
- Placeholder generation (blur, color, skeleton)
- Content-type specific breakpoints

**Usage:**
```typescript
import { ResponsiveImageGenerator, LazyLoadManager } from '@/lib/performance/responsive-image-system';

const generator = ResponsiveImageGenerator.getInstance();
const lazyLoader = LazyLoadManager.getInstance();

// Generate responsive image set
const responsiveSet = await generator.generateResponsiveImageSet(
  'image.jpg',
  getOptimalBreakpoints('hero'),
  true // generate placeholder
);

// Initialize lazy loading
lazyLoader.initialize({
  rootMargin: '50px',
  threshold: 0.1
});

// Observe image for lazy loading
lazyLoader.observe(imgElement);
```

### 3. ResponsiveImage Component (`components/performance/ResponsiveImage.tsx`)

React component with built-in optimization and lazy loading.

**Features:**
- Automatic responsive image generation
- Built-in lazy loading
- Multiple placeholder types
- Priority loading support
- Error handling

**Usage:**
```tsx
import ResponsiveImage from '@/components/performance/ResponsiveImage';

<ResponsiveImage
  src="property-image.jpg"
  alt="Luxury villa in Dubai Marina"
  contentType="property"
  priority={false}
  placeholder="blur"
  className="property-image"
  onLoad={() => console.log('Image loaded')}
/>
```

### 4. ImageSEOOptimizer (`image-seo-optimizer.ts`)

Handles SEO optimization for images including alt text generation and structured data.

**Features:**
- Automatic alt text generation
- Image structured data generation
- Image sitemap generation
- SEO validation
- Property-specific optimization

**Usage:**
```typescript
import { ImageSEOOptimizer, createPropertyImageData } from '@/lib/performance/image-seo-optimizer';

const optimizer = ImageSEOOptimizer.getInstance();

// Generate alt text
const altText = optimizer.generateAltText(imageData, context);

// Generate structured data
const structuredData = optimizer.generateImageStructuredData(imageData, context);

// Create property image data
const propertyImage = createPropertyImageData(
  'villa.jpg',
  'prop-123',
  'Luxury Villa',
  'Villa',
  'Dubai Marina',
  1200,
  800,
  { bedrooms: 4, bathrooms: 5 }
);

// Generate property alt text
const propertyAltText = optimizer.generatePropertyAltText(propertyImage);

// Validate SEO
const validation = optimizer.validateImageSEO(imageData);
```

## Content Type Breakpoints

The system provides optimized breakpoints for different content types:

- **Hero**: Large images (768px - 2560px)
- **Gallery**: Medium images (320px - 1280px)  
- **Thumbnail**: Small images (150px - 450px)
- **Content**: Standard images (320px - 1024px)

## Image Formats

The system automatically selects the best format based on:

1. **AVIF**: Best compression for photos (when supported)
2. **WebP**: Good compression for all content types (when supported)
3. **JPEG**: Fallback for photos and screenshots
4. **PNG**: Fallback for graphics and images with transparency

## Quality Settings

Quality is automatically adjusted based on:

- **Content Type**: Photos (0.7-0.8), Graphics (0.85-0.95), Screenshots (0.75-0.85)
- **File Size**: Larger files get lower quality to reduce size
- **Format**: AVIF uses lower quality due to better compression

## SEO Features

### Alt Text Generation

Automatic alt text generation using templates:

- **Property**: "{propertyType} in {location}"
- **Community**: "{communityName} community in Dubai"
- **Agent**: "{agentName} - Real Estate Agent"
- **Insight**: "{title} - Real Estate Insight"

### Structured Data

Generates schema.org ImageObject structured data with:

- Image dimensions and URL
- Caption and description
- Author information (for insights)
- Copyright and license information

### Image Sitemaps

Generates XML image sitemaps with:

- Image locations and metadata
- Captions and titles
- Geographic location
- License information

## Performance Features

### Lazy Loading

- Intersection Observer-based loading
- Configurable root margin and threshold
- Retry logic with exponential backoff
- Fade-in animations

### Placeholders

- **Blur**: Low-quality image preview
- **Color**: Dominant color extraction
- **Skeleton**: Animated loading placeholder

### Caching

- Browser format support detection caching
- Responsive image set caching
- Placeholder generation caching

## Testing

All components include comprehensive unit tests:

```bash
# Run image optimizer tests
bun test lib/performance/__tests__/image-optimizer.test.ts

# Run responsive image system tests  
bun test lib/performance/__tests__/responsive-image-system.test.ts

# Run image SEO optimizer tests
bun test lib/performance/__tests__/image-seo-optimizer.test.ts
```

## Integration

The system integrates with:

- **Next.js Image Component**: Can be used alongside or as replacement
- **EdgeStore**: For image storage and CDN delivery
- **SEO System**: Provides structured data for SEO components
- **Performance Monitoring**: Tracks Core Web Vitals improvements

## Browser Support

- **Modern Browsers**: Full feature support including AVIF and WebP
- **Legacy Browsers**: Graceful fallback to JPEG/PNG
- **No JavaScript**: Images still load with native lazy loading
- **No IntersectionObserver**: Falls back to immediate loading

## Configuration

The system is highly configurable:

```typescript
// Custom breakpoints
const customBreakpoints = [
  { width: 480, quality: 0.8 },
  { width: 768, quality: 0.85 },
  { width: 1200, quality: 0.9 }
];

// Custom lazy loading config
const lazyConfig = {
  rootMargin: '100px',
  threshold: 0.2,
  fadeInDuration: 500,
  retryAttempts: 5
};

// Custom image config
const imageConfig = createImageConfig('photo', 1920, 1080);
imageConfig.generatePlaceholder = true;
imageConfig.contentType = 'photo';
```

This system provides a complete solution for modern image optimization, combining performance, SEO, and user experience best practices.