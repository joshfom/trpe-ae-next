/**
 * ResponsiveDesignManager - Mobile-first responsive design optimization
 * Handles breakpoint optimization, critical CSS generation, and touch target optimization
 */

export interface ViewportConfig {
  width: string;
  height: string;
  initialScale: number;
  minimumScale: number;
  maximumScale: number;
  userScalable: boolean;
  viewportFit: 'auto' | 'contain' | 'cover';
}

export interface BreakpointConfig {
  name: string;
  minWidth: number;
  maxWidth?: number;
  criticalCSS: string[];
  resourceHints: string[];
}

export interface TouchElement {
  selector: string;
  minSize: number;
  spacing: number;
  type: 'button' | 'link' | 'input' | 'interactive';
}

export interface TouchOptimization {
  selector: string;
  styles: Record<string, string>;
  accessibility: {
    ariaLabel?: string;
    role?: string;
    tabIndex?: number;
  };
}

export interface CriticalCSSConfig {
  inlineCSS: string;
  preloadCSS: string[];
  deferCSS: string[];
  mediaQueries: Record<string, string>;
}

export interface ResponsiveDesignConfig {
  viewport: ViewportConfig;
  breakpoints: BreakpointConfig[];
  touchOptimizations: TouchOptimization[];
  criticalCSS: CriticalCSSConfig;
  mobileFirstRules: string[];
}

export class ResponsiveDesignManager {
  private readonly defaultBreakpoints: BreakpointConfig[] = [
    {
      name: 'mobile',
      minWidth: 0,
      maxWidth: 767,
      criticalCSS: ['base', 'mobile-layout', 'mobile-navigation'],
      resourceHints: ['mobile-fonts', 'mobile-icons']
    },
    {
      name: 'tablet',
      minWidth: 768,
      maxWidth: 1023,
      criticalCSS: ['base', 'tablet-layout', 'tablet-grid'],
      resourceHints: ['tablet-fonts', 'tablet-images']
    },
    {
      name: 'desktop',
      minWidth: 1024,
      criticalCSS: ['base', 'desktop-layout', 'desktop-grid', 'desktop-navigation'],
      resourceHints: ['desktop-fonts', 'desktop-images', 'desktop-animations']
    }
  ];

  private readonly touchTargetMinSize = 44; // iOS/Android recommended minimum
  private readonly touchTargetSpacing = 8; // Minimum spacing between touch targets

  /**
   * Generate viewport configuration for specific page types
   */
  generateViewportConfig(pageType: string): ViewportConfig {
    const baseConfig: ViewportConfig = {
      width: 'device-width',
      height: 'device-height',
      initialScale: 1.0,
      minimumScale: 1.0,
      maximumScale: 5.0,
      userScalable: true,
      viewportFit: 'cover'
    };

    // Page-specific viewport optimizations
    switch (pageType) {
      case 'property-detail':
        return {
          ...baseConfig,
          maximumScale: 3.0, // Allow zoom for property images
          viewportFit: 'contain' // Ensure full image visibility
        };
      
      case 'property-search':
        return {
          ...baseConfig,
          userScalable: false, // Prevent zoom on search interactions
          maximumScale: 1.0
        };
      
      case 'contact-form':
        return {
          ...baseConfig,
          initialScale: 1.0,
          minimumScale: 0.8, // Allow slight zoom out for form visibility
          viewportFit: 'auto'
        };
      
      default:
        return baseConfig;
    }
  }

  /**
   * Generate breakpoint-specific configurations
   */
  generateBreakpointConfig(customBreakpoints?: Partial<BreakpointConfig>[]): BreakpointConfig[] {
    if (!customBreakpoints) {
      return this.defaultBreakpoints;
    }

    return this.defaultBreakpoints.map(defaultBp => {
      const customBp = customBreakpoints.find(bp => bp.name === defaultBp.name);
      return customBp ? { ...defaultBp, ...customBp } : defaultBp;
    });
  }

  /**
   * Optimize touch targets for mobile interactions
   */
  optimizeTouchTargets(elements: TouchElement[]): TouchOptimization[] {
    return elements.map(element => {
      const optimization: TouchOptimization = {
        selector: element.selector,
        styles: this.generateTouchStyles(element),
        accessibility: this.generateAccessibilityAttributes(element)
      };

      return optimization;
    });
  }

  /**
   * Generate critical CSS configuration for mobile-first approach
   */
  generateCriticalCSS(pageType: string, breakpoint: string = 'mobile'): CriticalCSSConfig {
    const baseCriticalCSS = this.getBaseCriticalCSS();
    const pageSpecificCSS = this.getPageSpecificCSS(pageType);
    const breakpointCSS = this.getBreakpointCSS(breakpoint);

    return {
      inlineCSS: [
        baseCriticalCSS.reset,
        baseCriticalCSS.typography,
        baseCriticalCSS.layout,
        pageSpecificCSS.aboveFold,
        breakpointCSS.critical
      ].join('\n'),
      preloadCSS: [
        `/css/${pageType}-${breakpoint}.css`,
        `/css/components-${breakpoint}.css`
      ],
      deferCSS: [
        `/css/animations.css`,
        `/css/print.css`,
        `/css/non-critical.css`
      ],
      mediaQueries: this.generateMediaQueries(breakpoint)
    };
  }

  /**
   * Generate mobile-first CSS rules
   */
  generateMobileFirstRules(pageType: string): string[] {
    const baseRules = [
      '/* Mobile-first base styles */',
      'html { font-size: 16px; line-height: 1.5; }',
      'body { margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; }',
      '*, *::before, *::after { box-sizing: border-box; }',
      
      '/* Touch-friendly interactive elements */',
      'button, [role="button"], input[type="submit"] { min-height: 44px; min-width: 44px; }',
      'a { min-height: 44px; display: inline-flex; align-items: center; }',
      
      '/* Mobile typography */',
      'h1 { font-size: 1.75rem; line-height: 1.2; margin: 0 0 1rem; }',
      'h2 { font-size: 1.5rem; line-height: 1.3; margin: 0 0 0.875rem; }',
      'h3 { font-size: 1.25rem; line-height: 1.4; margin: 0 0 0.75rem; }',
      'p { font-size: 1rem; line-height: 1.6; margin: 0 0 1rem; }',
      
      '/* Mobile layout */',
      '.container { width: 100%; max-width: 100%; padding: 0 1rem; }',
      '.grid { display: grid; gap: 1rem; }',
      '.flex { display: flex; flex-wrap: wrap; gap: 0.5rem; }'
    ];

    const pageSpecificRules = this.getPageSpecificMobileRules(pageType);
    
    return [...baseRules, ...pageSpecificRules];
  }

  /**
   * Generate complete responsive design configuration
   */
  generateResponsiveConfig(pageType: string, options?: {
    customBreakpoints?: Partial<BreakpointConfig>[];
    touchElements?: TouchElement[];
  }): ResponsiveDesignConfig {
    const viewport = this.generateViewportConfig(pageType);
    const breakpoints = this.generateBreakpointConfig(options?.customBreakpoints);
    const touchOptimizations = options?.touchElements 
      ? this.optimizeTouchTargets(options.touchElements)
      : this.getDefaultTouchOptimizations(pageType);
    const criticalCSS = this.generateCriticalCSS(pageType);
    const mobileFirstRules = this.generateMobileFirstRules(pageType);

    return {
      viewport,
      breakpoints,
      touchOptimizations,
      criticalCSS,
      mobileFirstRules
    };
  }

  /**
   * Validate responsive design configuration
   */
  validateConfig(config: ResponsiveDesignConfig): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate viewport configuration
    if (config.viewport.initialScale < 0.1 || config.viewport.initialScale > 10) {
      errors.push('Initial scale must be between 0.1 and 10');
    }

    // Validate breakpoints
    const sortedBreakpoints = [...config.breakpoints].sort((a, b) => a.minWidth - b.minWidth);
    for (let i = 0; i < sortedBreakpoints.length - 1; i++) {
      const current = sortedBreakpoints[i];
      const next = sortedBreakpoints[i + 1];
      
      if (current.maxWidth && current.maxWidth >= next.minWidth) {
        errors.push(`Breakpoint overlap: ${current.name} and ${next.name}`);
      }
    }

    // Validate touch targets
    config.touchOptimizations.forEach(opt => {
      const minHeight = opt.styles.minHeight;
      const minWidth = opt.styles.minWidth;
      
      if (minHeight && parseInt(minHeight) < this.touchTargetMinSize) {
        warnings.push(`Touch target ${opt.selector} height below recommended ${this.touchTargetMinSize}px`);
      }
      
      if (minWidth && parseInt(minWidth) < this.touchTargetMinSize) {
        warnings.push(`Touch target ${opt.selector} width below recommended ${this.touchTargetMinSize}px`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  // Private helper methods
  private generateTouchStyles(element: TouchElement): Record<string, string> {
    const baseStyles: Record<string, string> = {
      minHeight: `${Math.max(element.minSize, this.touchTargetMinSize)}px`,
      minWidth: `${Math.max(element.minSize, this.touchTargetMinSize)}px`,
      padding: `${element.spacing}px`,
      margin: `${this.touchTargetSpacing}px`,
      cursor: 'pointer',
      userSelect: 'none',
      WebkitTapHighlightColor: 'transparent'
    };

    // Element-specific optimizations
    switch (element.type) {
      case 'button':
        return {
          ...baseStyles,
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px', // Prevent zoom on iOS
          lineHeight: '1.2'
        };
      
      case 'link':
        return {
          ...baseStyles,
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center'
        };
      
      case 'input':
        return {
          ...baseStyles,
          fontSize: '16px', // Prevent zoom on iOS
          borderRadius: '4px',
          border: '1px solid #ccc'
        };
      
      default:
        return baseStyles;
    }
  }

  private generateAccessibilityAttributes(element: TouchElement): TouchOptimization['accessibility'] {
    const base = {
      tabIndex: 0
    };

    switch (element.type) {
      case 'button':
        return {
          ...base,
          role: 'button',
          ariaLabel: `${element.selector.replace(/[.#]/, '')} button`
        };
      
      case 'link':
        return {
          ...base,
          role: 'link'
        };
      
      case 'input':
        return {
          ...base,
          role: 'textbox'
        };
      
      default:
        return base;
    }
  }

  private getBaseCriticalCSS() {
    return {
      reset: `*,*::before,*::after{box-sizing:border-box}body{margin:0;font-family:system-ui,-apple-system,sans-serif}`,
      typography: `h1,h2,h3,h4,h5,h6{margin:0 0 1rem;line-height:1.2}p{margin:0 0 1rem;line-height:1.6}`,
      layout: `.container{width:100%;max-width:1200px;margin:0 auto;padding:0 1rem}`
    };
  }

  private getPageSpecificCSS(pageType: string) {
    const cssMap: Record<string, { aboveFold: string }> = {
      'property-detail': {
        aboveFold: `.property-hero{height:50vh;background-size:cover}.property-title{font-size:1.75rem}`
      },
      'property-search': {
        aboveFold: `.search-form{padding:1rem;background:#f8f9fa}.search-input{width:100%;padding:0.75rem}`
      },
      'home': {
        aboveFold: `.hero{height:60vh;display:flex;align-items:center}.hero-title{font-size:2rem}`
      },
      default: {
        aboveFold: `.main{padding:1rem 0}`
      }
    };

    return cssMap[pageType] || cssMap.default;
  }

  private getBreakpointCSS(breakpoint: string) {
    const cssMap: Record<string, { critical: string }> = {
      mobile: {
        critical: `.grid{grid-template-columns:1fr}.nav{flex-direction:column}`
      },
      tablet: {
        critical: `.grid{grid-template-columns:repeat(2,1fr)}.nav{flex-direction:row}`
      },
      desktop: {
        critical: `.grid{grid-template-columns:repeat(3,1fr)}.container{padding:0 2rem}`
      }
    };

    return cssMap[breakpoint] || cssMap.mobile;
  }

  private generateMediaQueries(breakpoint: string): Record<string, string> {
    return {
      mobile: '@media (max-width: 767px)',
      tablet: '@media (min-width: 768px) and (max-width: 1023px)',
      desktop: '@media (min-width: 1024px)',
      print: '@media print',
      'reduced-motion': '@media (prefers-reduced-motion: reduce)'
    };
  }

  private getPageSpecificMobileRules(pageType: string): string[] {
    const rulesMap: Record<string, string[]> = {
      'property-detail': [
        '/* Property detail mobile styles */',
        '.property-gallery { overflow-x: auto; }',
        '.property-info { padding: 1rem; }',
        '.property-features { display: grid; grid-template-columns: 1fr; gap: 0.5rem; }'
      ],
      'property-search': [
        '/* Property search mobile styles */',
        '.search-filters { position: sticky; top: 0; background: white; z-index: 10; }',
        '.property-grid { grid-template-columns: 1fr; }',
        '.property-card { margin-bottom: 1rem; }'
      ],
      'contact-form': [
        '/* Contact form mobile styles */',
        '.form-group { margin-bottom: 1rem; }',
        '.form-input { width: 100%; padding: 0.75rem; font-size: 16px; }',
        '.form-button { width: 100%; padding: 1rem; }'
      ]
    };

    return rulesMap[pageType] || [];
  }

  private getDefaultTouchOptimizations(pageType: string): TouchOptimization[] {
    const defaultElements: TouchElement[] = [
      { selector: 'button', minSize: 44, spacing: 8, type: 'button' },
      { selector: 'a', minSize: 44, spacing: 4, type: 'link' },
      { selector: 'input', minSize: 44, spacing: 8, type: 'input' },
      { selector: '[role="button"]', minSize: 44, spacing: 8, type: 'interactive' }
    ];

    return this.optimizeTouchTargets(defaultElements);
  }
}

export const responsiveDesignManager = new ResponsiveDesignManager();