import { describe, it, expect, beforeEach } from '@jest/globals';
import { 
  ResponsiveDesignManager, 
  type TouchElement, 
  type BreakpointConfig,
  type ViewportConfig 
} from '@/lib/responsive-design-manager';

describe('ResponsiveDesignManager', () => {
  let manager: ResponsiveDesignManager;

  beforeEach(() => {
    manager = new ResponsiveDesignManager();
  });

  describe('generateViewportConfig', () => {
    it('should generate default viewport config', () => {
      const config = manager.generateViewportConfig('default');
      
      expect(config).toEqual({
        width: 'device-width',
        height: 'device-height',
        initialScale: 1.0,
        minimumScale: 1.0,
        maximumScale: 5.0,
        userScalable: true,
        viewportFit: 'cover'
      });
    });

    it('should generate property-detail specific viewport config', () => {
      const config = manager.generateViewportConfig('property-detail');
      
      expect(config.maximumScale).toBe(3.0);
      expect(config.viewportFit).toBe('contain');
    });

    it('should generate property-search specific viewport config', () => {
      const config = manager.generateViewportConfig('property-search');
      
      expect(config.userScalable).toBe(false);
      expect(config.maximumScale).toBe(1.0);
    });

    it('should generate contact-form specific viewport config', () => {
      const config = manager.generateViewportConfig('contact-form');
      
      expect(config.minimumScale).toBe(0.8);
      expect(config.viewportFit).toBe('auto');
    });
  });

  describe('generateBreakpointConfig', () => {
    it('should return default breakpoints when no custom config provided', () => {
      const breakpoints = manager.generateBreakpointConfig();
      
      expect(breakpoints).toHaveLength(3);
      expect(breakpoints[0].name).toBe('mobile');
      expect(breakpoints[1].name).toBe('tablet');
      expect(breakpoints[2].name).toBe('desktop');
    });

    it('should merge custom breakpoint configurations', () => {
      const customBreakpoints = [
        { name: 'mobile', criticalCSS: ['custom-mobile'] }
      ];
      
      const breakpoints = manager.generateBreakpointConfig(customBreakpoints);
      
      expect(breakpoints[0].criticalCSS).toContain('custom-mobile');
      expect(breakpoints[0].minWidth).toBe(0); // Should preserve default values
    });

    it('should maintain breakpoint order and structure', () => {
      const breakpoints = manager.generateBreakpointConfig();
      
      expect(breakpoints[0].minWidth).toBe(0);
      expect(breakpoints[0].maxWidth).toBe(767);
      expect(breakpoints[1].minWidth).toBe(768);
      expect(breakpoints[1].maxWidth).toBe(1023);
      expect(breakpoints[2].minWidth).toBe(1024);
      expect(breakpoints[2].maxWidth).toBeUndefined();
    });
  });

  describe('optimizeTouchTargets', () => {
    it('should optimize touch targets with minimum size requirements', () => {
      const elements: TouchElement[] = [
        { selector: '.button', minSize: 30, spacing: 4, type: 'button' },
        { selector: '.link', minSize: 50, spacing: 8, type: 'link' }
      ];
      
      const optimizations = manager.optimizeTouchTargets(elements);
      
      expect(optimizations).toHaveLength(2);
      
      // Should enforce minimum 44px size
      expect(optimizations[0].styles.minHeight).toBe('44px');
      expect(optimizations[0].styles.minWidth).toBe('44px');
      
      // Should respect larger custom size
      expect(optimizations[1].styles.minHeight).toBe('50px');
      expect(optimizations[1].styles.minWidth).toBe('50px');
    });

    it('should apply button-specific styles', () => {
      const elements: TouchElement[] = [
        { selector: '.button', minSize: 44, spacing: 8, type: 'button' }
      ];
      
      const optimizations = manager.optimizeTouchTargets(elements);
      
      expect(optimizations[0].styles.border).toBe('none');
      expect(optimizations[0].styles.borderRadius).toBe('8px');
      expect(optimizations[0].styles.fontSize).toBe('16px');
    });

    it('should apply link-specific styles', () => {
      const elements: TouchElement[] = [
        { selector: '.link', minSize: 44, spacing: 4, type: 'link' }
      ];
      
      const optimizations = manager.optimizeTouchTargets(elements);
      
      expect(optimizations[0].styles.textDecoration).toBe('none');
      expect(optimizations[0].styles.display).toBe('inline-flex');
      expect(optimizations[0].styles.alignItems).toBe('center');
    });

    it('should apply input-specific styles', () => {
      const elements: TouchElement[] = [
        { selector: '.input', minSize: 44, spacing: 8, type: 'input' }
      ];
      
      const optimizations = manager.optimizeTouchTargets(elements);
      
      expect(optimizations[0].styles.fontSize).toBe('16px');
      expect(optimizations[0].styles.borderRadius).toBe('4px');
      expect(optimizations[0].styles.border).toBe('1px solid #ccc');
    });

    it('should generate appropriate accessibility attributes', () => {
      const elements: TouchElement[] = [
        { selector: '.button', minSize: 44, spacing: 8, type: 'button' },
        { selector: '.link', minSize: 44, spacing: 4, type: 'link' }
      ];
      
      const optimizations = manager.optimizeTouchTargets(elements);
      
      expect(optimizations[0].accessibility.role).toBe('button');
      expect(optimizations[0].accessibility.ariaLabel).toContain('button');
      expect(optimizations[0].accessibility.tabIndex).toBe(0);
      
      expect(optimizations[1].accessibility.role).toBe('link');
      expect(optimizations[1].accessibility.tabIndex).toBe(0);
    });
  });

  describe('generateCriticalCSS', () => {
    it('should generate critical CSS configuration', () => {
      const config = manager.generateCriticalCSS('property-detail', 'mobile');
      
      expect(config.inlineCSS).toContain('box-sizing:border-box');
      expect(config.inlineCSS).toContain('property-hero');
      expect(config.preloadCSS).toContain('/css/property-detail-mobile.css');
      expect(config.deferCSS).toContain('/css/animations.css');
    });

    it('should include page-specific CSS', () => {
      const propertyConfig = manager.generateCriticalCSS('property-detail');
      const searchConfig = manager.generateCriticalCSS('property-search');
      
      expect(propertyConfig.inlineCSS).toContain('property-hero');
      expect(searchConfig.inlineCSS).toContain('search-form');
    });

    it('should include breakpoint-specific CSS', () => {
      const mobileConfig = manager.generateCriticalCSS('default', 'mobile');
      const desktopConfig = manager.generateCriticalCSS('default', 'desktop');
      
      expect(mobileConfig.inlineCSS).toContain('grid-template-columns:1fr');
      expect(desktopConfig.inlineCSS).toContain('grid-template-columns:repeat(3,1fr)');
    });

    it('should generate appropriate media queries', () => {
      const config = manager.generateCriticalCSS('default', 'mobile');
      
      expect(config.mediaQueries.mobile).toBe('@media (max-width: 767px)');
      expect(config.mediaQueries.tablet).toBe('@media (min-width: 768px) and (max-width: 1023px)');
      expect(config.mediaQueries.desktop).toBe('@media (min-width: 1024px)');
    });
  });

  describe('generateMobileFirstRules', () => {
    it('should generate base mobile-first CSS rules', () => {
      const rules = manager.generateMobileFirstRules('default');
      
      expect(rules.some(rule => rule.includes('font-size: 16px'))).toBe(true);
      expect(rules.some(rule => rule.includes('box-sizing: border-box'))).toBe(true);
      expect(rules.some(rule => rule.includes('min-height: 44px'))).toBe(true);
    });

    it('should include page-specific mobile rules', () => {
      const propertyRules = manager.generateMobileFirstRules('property-detail');
      const searchRules = manager.generateMobileFirstRules('property-search');
      
      expect(propertyRules.some(rule => rule.includes('property-gallery'))).toBe(true);
      expect(searchRules.some(rule => rule.includes('search-filters'))).toBe(true);
    });

    it('should ensure touch-friendly interactive elements', () => {
      const rules = manager.generateMobileFirstRules('default');
      
      const touchRules = rules.filter(rule => 
        rule.includes('min-height: 44px') || rule.includes('min-width: 44px')
      );
      
      expect(touchRules.length).toBeGreaterThan(0);
    });
  });

  describe('generateResponsiveConfig', () => {
    it('should generate complete responsive configuration', () => {
      const config = manager.generateResponsiveConfig('property-detail');
      
      expect(config.viewport).toBeDefined();
      expect(config.breakpoints).toHaveLength(3);
      expect(config.touchOptimizations).toBeDefined();
      expect(config.criticalCSS).toBeDefined();
      expect(config.mobileFirstRules).toBeDefined();
    });

    it('should accept custom options', () => {
      const customElements: TouchElement[] = [
        { selector: '.custom-button', minSize: 48, spacing: 12, type: 'button' }
      ];
      
      const config = manager.generateResponsiveConfig('default', {
        touchElements: customElements
      });
      
      expect(config.touchOptimizations).toHaveLength(1);
      expect(config.touchOptimizations[0].selector).toBe('.custom-button');
    });
  });

  describe('validateConfig', () => {
    it('should validate correct configuration', () => {
      const config = manager.generateResponsiveConfig('default');
      const validation = manager.validateConfig(config);
      
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should detect invalid initial scale', () => {
      const config = manager.generateResponsiveConfig('default');
      config.viewport.initialScale = 15; // Invalid scale
      
      const validation = manager.validateConfig(config);
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Initial scale must be between 0.1 and 10');
    });

    it('should detect breakpoint overlaps', () => {
      const config = manager.generateResponsiveConfig('default');
      config.breakpoints[0].maxWidth = 800; // Overlaps with tablet
      
      const validation = manager.validateConfig(config);
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors.some(error => error.includes('Breakpoint overlap'))).toBe(true);
    });

    it('should warn about small touch targets', () => {
      const config = manager.generateResponsiveConfig('default');
      config.touchOptimizations[0].styles.minHeight = '30px'; // Below recommended
      
      const validation = manager.validateConfig(config);
      
      expect(validation.warnings.some(warning => 
        warning.includes('height below recommended')
      )).toBe(true);
    });

    it('should provide detailed validation feedback', () => {
      const config = manager.generateResponsiveConfig('default');
      config.viewport.initialScale = 0.05; // Too small
      config.breakpoints[0].maxWidth = 1000; // Overlap
      config.touchOptimizations[0].styles.minWidth = '20px'; // Too small
      
      const validation = manager.validateConfig(config);
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
      expect(validation.warnings.length).toBeGreaterThan(0);
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle unknown page types gracefully', () => {
      const config = manager.generateViewportConfig('unknown-page-type');
      
      expect(config.width).toBe('device-width');
      expect(config.initialScale).toBe(1.0);
    });

    it('should handle empty touch elements array', () => {
      const optimizations = manager.optimizeTouchTargets([]);
      
      expect(optimizations).toHaveLength(0);
    });

    it('should handle missing breakpoint data', () => {
      const config = manager.generateCriticalCSS('unknown-page', 'unknown-breakpoint');
      
      expect(config.inlineCSS).toBeDefined();
      expect(config.preloadCSS).toBeDefined();
      expect(config.deferCSS).toBeDefined();
    });
  });
});