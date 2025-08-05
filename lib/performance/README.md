# Core Web Vitals Optimization System

This directory contains a comprehensive Core Web Vitals optimization system designed to improve website performance across all three key metrics: LCP (Largest Contentful Paint), FID/INP (First Input Delay/Interaction to Next Paint), and CLS (Cumulative Layout Shift).

## Components

### 1. LCP Optimizer (`lcp-optimizer.ts`)

Optimizes Largest Contentful Paint by:
- Identifying critical resources for different page types
- Extracting and inlining critical CSS
- Generating resource preload hints
- Measuring LCP performance
- Providing optimization recommendations

**Key Features:**
- Page-type specific resource identification
- Critical CSS extraction and inlining
- Resource prioritization and preloading
- Performance measurement and scoring

### 2. Interaction Optimizer (`interaction-optimizer.ts`)

Optimizes First Input Delay and Interaction to Next Paint by:
- Implementing code splitting strategies
- Setting up lazy loading for non-critical JavaScript
- Using event delegation to reduce memory usage
- Scheduling idle callbacks for non-critical tasks
- Measuring interaction performance

**Key Features:**
- Dynamic code splitting configuration
- Lazy loading with intersection observer
- Event delegation for better performance
- Idle callback scheduling
- FID/INP measurement and optimization

### 3. Layout Stability Optimizer (`layout-stability-optimizer.ts`)

Prevents Cumulative Layout Shift by:
- Reserving space for images and videos
- Setting up dynamic content placeholders
- Preloading fonts to prevent layout shifts
- Monitoring layout shifts in real-time
- Providing CLS optimization recommendations

**Key Features:**
- Automatic image dimension calculation
- Dynamic content placeholder system
- Font preloading and optimization
- Real-time layout shift monitoring
- CLS measurement and recommendations

## Usage

### Basic Usage

```typescript
import { createLCPOptimizer } from '@/lib/performance/lcp-optimizer';
import { createInteractionOptimizer } from '@/lib/performance/interaction-optimizer';
import { createLayoutStabilityOptimizer } from '@/lib/performance/layout-stability-optimizer';

// Initialize optimizers for a specific page type
const lcpOptimizer = createLCPOptimizer('property-listing');
const interactionOptimizer = createInteractionOptimizer('property-listing');
const layoutOptimizer = createLayoutStabilityOptimizer('property-listing');

// Get critical resources for preloading
const criticalResources = lcpOptimizer.identifyCriticalResources('property-listing', pageData);
const resourceHints = lcpOptimizer.generateResourceHints(criticalResources);

// Setup lazy loading
interactionOptimizer.setupLazyLoading();

// Measure performance
const lcpMetrics = await lcpOptimizer.measureLCPPerformance();
const interactionMetrics = await interactionOptimizer.measureInteractionMetrics();
const clsMetrics = layoutOptimizer.measureCLSMetrics();
```

### Advanced Configuration

```typescript
import { LCPOptimizer, InteractionOptimizer, LayoutStabilityOptimizer } from '@/lib/performance';

// Custom LCP configuration
const lcpConfig = {
  criticalCSS: ['/custom-critical.css'],
  preloadResources: [],
  aboveFoldImages: ['/hero-image.jpg'],
  criticalFonts: ['/fonts/custom-font.woff2'],
  inlineCSS: true
};

const lcpOptimizer = new LCPOptimizer(lcpConfig);

// Custom interaction configuration
const interactionConfig = {
  criticalScripts: ['/critical.js'],
  deferredScripts: ['/deferred.js'],
  lazyScripts: ['/lazy.js'],
  codeSplitChunks: [],
  preloadModules: [],
  idleCallbacks: []
};

const interactionOptimizer = new InteractionOptimizer(interactionConfig);

// Custom layout stability configuration
const layoutConfig = {
  reserveImageSpace: true,
  reserveVideoSpace: true,
  reserveAdSpace: true,
  reserveFontSpace: true,
  preloadFonts: ['/fonts/inter-var.woff2'],
  fallbackFonts: ['system-ui', 'sans-serif'],
  dynamicContentPlaceholders: [
    {
      selector: '.dynamic-content',
      height: '200px',
      placeholder: 'skeleton'
    }
  ]
};

const layoutOptimizer = new LayoutStabilityOptimizer(layoutConfig);
```

## Page Type Support

The optimizers support different page types with specific optimizations:

- **property-listing**: Property search and listing pages
- **property-detail**: Individual property detail pages
- **community-listing**: Community listing pages
- **homepage**: Main homepage
- **default**: Generic page optimizations

Each page type has tailored resource identification, code splitting, and placeholder configurations.

## Performance Targets

The system is designed to achieve:

- **LCP**: < 2.5 seconds (target: < 2.0 seconds)
- **FID**: < 100ms (target: < 50ms)
- **INP**: < 200ms (target: < 100ms)
- **CLS**: < 0.1 (target: < 0.05)

## Testing

All components include comprehensive unit tests:

```bash
# Run all performance optimization tests
bun test lib/performance/__tests__/ --run

# Run specific optimizer tests
bun test lib/performance/__tests__/lcp-optimizer.test.ts --run
bun test lib/performance/__tests__/interaction-optimizer.test.ts --run
bun test lib/performance/__tests__/layout-stability-optimizer.test.ts --run
```

## Integration

The optimizers are designed to work together and can be integrated into Next.js layouts and pages:

```typescript
// In your layout or page component
import { useEffect } from 'react';
import { createLCPOptimizer, createInteractionOptimizer, createLayoutStabilityOptimizer } from '@/lib/performance';

export default function OptimizedLayout({ children, pageType = 'default' }) {
  useEffect(() => {
    // Initialize optimizers
    const lcpOptimizer = createLCPOptimizer(pageType);
    const interactionOptimizer = createInteractionOptimizer(pageType);
    const layoutOptimizer = createLayoutStabilityOptimizer(pageType);

    // Setup optimizations
    interactionOptimizer.setupLazyLoading();

    // Cleanup on unmount
    return () => {
      layoutOptimizer.cleanup();
    };
  }, [pageType]);

  return <>{children}</>;
}
```

## Monitoring and Recommendations

Each optimizer provides performance metrics and optimization recommendations:

```typescript
// Get performance metrics
const lcpMetrics = await lcpOptimizer.measureLCPPerformance();
const interactionMetrics = await interactionOptimizer.measureInteractionMetrics();
const clsMetrics = layoutOptimizer.measureCLSMetrics();

// Get optimization recommendations
const lcpRecommendations = lcpOptimizer.getOptimizationRecommendations(lcpMetrics);
const interactionRecommendations = interactionOptimizer.getOptimizationRecommendations(interactionMetrics);
const clsRecommendations = layoutOptimizer.getOptimizationRecommendations(clsMetrics);

console.log('Performance Recommendations:', {
  lcp: lcpRecommendations,
  interaction: interactionRecommendations,
  cls: clsRecommendations
});
```

This system provides a comprehensive solution for optimizing Core Web Vitals and ensuring excellent user experience across all pages of the website.