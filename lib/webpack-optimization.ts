import { Configuration } from 'webpack';

export function getAdvancedWebpackConfig(): Configuration {
  return {
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          // Framework bundles
          framework: {
            name: 'framework',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
            priority: 40,
            enforce: true,
          },
          
          // UI Library bundle
          ui: {
            name: 'ui',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](@radix-ui|lucide-react|class-variance-authority|clsx|tailwind-merge)[\\/]/,
            priority: 30,
            enforce: true,
          },
          
          // Database and ORM bundle
          database: {
            name: 'database',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](drizzle-orm|postgres|pg)[\\/]/,
            priority: 25,
            enforce: true,
          },
          
          // Forms and validation bundle
          forms: {
            name: 'forms',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](react-hook-form|@hookform|zod)[\\/]/,
            priority: 25,
            enforce: true,
          },
          
          // Image processing bundle
          images: {
            name: 'images',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](sharp|next\/image|@edgestore)[\\/]/,
            priority: 25,
            enforce: true,
          },
          
          // Rich text editor bundle
          editor: {
            name: 'editor',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](@tiptap|prosemirror)[\\/]/,
            priority: 25,
            enforce: true,
          },
          
          // Common vendor libraries
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            enforce: true,
            minChunks: 2,
          },
          
          // Common application code
          common: {
            name: 'common',
            chunks: 'all',
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      },
      
      // Module concatenation for better tree shaking
      concatenateModules: true,
      
      // Remove empty chunks
      removeEmptyChunks: true,
      
      // Merge duplicate chunks
      mergeDuplicateChunks: true,
      
      // Flag dependent modules
      flagIncludedChunks: true,
      
      // Side effects optimization
      sideEffects: false,
    },
    
    // Module resolution optimizations
    resolve: {
      // Prefer ES modules
      mainFields: ['module', 'main'],
      
      // Extensions in order of preference
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
      
      // Alias for commonly used paths
      alias: {
        '@': '.',
        '@/components': './components',
        '@/lib': './lib',
        '@/features': './features',
        '@/types': './types',
      },
    },
    
    // Performance hints
    performance: {
      maxAssetSize: 250000,
      maxEntrypointSize: 250000,
      hints: process.env.NODE_ENV === 'production' ? 'warning' : false,
    },
    
    // Module rules for optimization
    module: {
      rules: [
        // Tree shaking for lodash
        {
          test: /[\\/]node_modules[\\/]lodash[\\/]/,
          sideEffects: false,
        },
        
        // Optimize moment.js
        {
          test: /[\\/]node_modules[\\/]moment[\\/]/,
          parser: {
            amd: false,
          },
        },
      ],
    },
    
    // Plugins for additional optimizations
    plugins: [
      // Bundle analyzer in development
      ...(process.env.ANALYZE === 'true' ? [
        new (require('webpack-bundle-analyzer').BundleAnalyzerPlugin)({
          analyzerMode: 'static',
          openAnalyzer: false,
        })
      ] : []),
    ],
  };
}

// Helper function to get optimized externals for different runtimes
export function getOptimizedExternals(runtime: 'nodejs' | 'edge' = 'nodejs') {
  const baseExternals = [
    'sharp',
    'canvas',
    'onnxruntime-node',
    'aws-crt',
  ];
  
  if (runtime === 'edge') {
    return [
      ...baseExternals,
      'fs',
      'path',
      'os',
      'crypto',
      'stream',
      'util',
      'buffer',
    ];
  }
  
  return baseExternals;
}

// Bundle size monitoring utility
export function createBundleSizeMonitor() {
  return {
    apply(compiler: any) {
      compiler.hooks.emit.tap('BundleSizeMonitor', (compilation: any) => {
        const assets = compilation.assets;
        const sizes = Object.keys(assets).map(name => ({
          name,
          size: assets[name].size(),
          type: assets[name].constructor.name,
        }));
        
        const totalSize = sizes.reduce((acc, { size }) => acc + size, 0);
        const largeChunks = sizes.filter(({ size }) => size > 100000);
        
        console.log('📦 Bundle Analysis:');
        console.log(`   Total Size: ${(totalSize / 1024).toFixed(2)}KB`);
        
        if (largeChunks.length > 0) {
          console.log('   Large Chunks (>100KB):');
          largeChunks.forEach(({ name, size }) => {
            console.log(`     - ${name}: ${(size / 1024).toFixed(2)}KB`);
          });
        }
        
        // Alert for chunks that are too large
        const tooLargeChunks = sizes.filter(({ size }) => size > 250000);
        if (tooLargeChunks.length > 0) {
          console.warn('⚠️  Chunks exceeding 250KB detected:');
          tooLargeChunks.forEach(({ name, size }) => {
            console.warn(`     - ${name}: ${(size / 1024).toFixed(2)}KB`);
          });
        }
      });
    },
  };
}

// Progressive loading utilities
export function createProgressiveLoadingConfig() {
  return {
    // Preload critical chunks
    preloadChunks: [
      'framework',
      'main',
      'pages/_app',
    ],
    
    // Prefetch secondary chunks
    prefetchChunks: [
      'ui',
      'vendor',
      'common',
    ],
    
    // Lazy load heavy chunks
    lazyChunks: [
      'database',
      'images',
      'editor',
      'forms',
    ],
    
    // Module federation for micro-frontends (if needed)
    moduleFederation: {
      name: 'trpe-next',
      exposes: {
        './PropertyCard': './components/property-card',
        './PropertySearch': './features/search/PropertyPageSearchFilterServer',
      },
      shared: {
        react: { singleton: true, eager: true },
        'react-dom': { singleton: true, eager: true },
        'next/router': { singleton: true },
      },
    },
  };
}
