"use server";

export interface RobotsMetaConfig {
  index: boolean;
  follow: boolean;
  noarchive?: boolean;
  nosnippet?: boolean;
  noimageindex?: boolean;
  maxSnippet?: number;
  maxImagePreview?: 'none' | 'standard' | 'large';
  maxVideoPreview?: number;
  unavailableAfter?: Date;
}

export interface PageRobotsRule {
  pathPattern: string | RegExp;
  config: Partial<RobotsMetaConfig>;
  priority: number;
}

export class RobotsMetaGenerator {
  private defaultConfig: RobotsMetaConfig;
  private pageRules: PageRobotsRule[];

  constructor() {
    this.defaultConfig = {
      index: true,
      follow: true,
      maxImagePreview: 'large',
      maxSnippet: 160
    };

    this.pageRules = this.initializePageRules();
  }

  /**
   * Initialize page-specific robots rules
   */
  private initializePageRules(): PageRobotsRule[] {
    return [
      // Admin pages - no indexing
      {
        pathPattern: /^\/admin/,
        config: { index: false, follow: false },
        priority: 100
      },
      // CRM pages - no indexing
      {
        pathPattern: /^\/crm/,
        config: { index: false, follow: false },
        priority: 100
      },
      // API routes - no indexing
      {
        pathPattern: /^\/api/,
        config: { index: false, follow: false },
        priority: 100
      },
      // Login/Register pages - no indexing
      {
        pathPattern: /^\/(login|register)/,
        config: { index: false, follow: false },
        priority: 90
      },
      // Thank you pages - no indexing but follow
      {
        pathPattern: /\/thank-you/,
        config: { index: false, follow: true },
        priority: 80
      },
      // Search result pages - no indexing but follow
      {
        pathPattern: /\/search/,
        config: { index: false, follow: true },
        priority: 70
      },
      // Property detail pages - full indexing
      {
        pathPattern: /^\/properties\/[^\/]+\/[^\/]+$/,
        config: { 
          index: true, 
          follow: true, 
          maxImagePreview: 'large',
          maxSnippet: 160
        },
        priority: 60
      },
      // Property listing pages - full indexing
      {
        pathPattern: /^\/properties/,
        config: { 
          index: true, 
          follow: true, 
          maxImagePreview: 'large'
        },
        priority: 50
      },
      // Community pages - full indexing
      {
        pathPattern: /^\/communities/,
        config: { 
          index: true, 
          follow: true, 
          maxImagePreview: 'large'
        },
        priority: 50
      },
      // Insight pages - full indexing
      {
        pathPattern: /^\/insights/,
        config: { 
          index: true, 
          follow: true, 
          maxImagePreview: 'large',
          maxSnippet: 200
        },
        priority: 50
      },
      // Static pages - standard indexing
      {
        pathPattern: /^\/(about-us|contact-us|privacy-policy|terms-conditions)/,
        config: { 
          index: true, 
          follow: true 
        },
        priority: 40
      },
      // Home page - full indexing
      {
        pathPattern: /^\/$/,
        config: { 
          index: true, 
          follow: true, 
          maxImagePreview: 'large'
        },
        priority: 30
      }
    ];
  }

  /**
   * Generate robots meta configuration for a specific path
   */
  generateRobotsConfig(path: string, customConfig?: Partial<RobotsMetaConfig>): RobotsMetaConfig {
    // Start with default configuration
    let config = { ...this.defaultConfig };

    // Apply page-specific rules (sorted by priority, highest first)
    const applicableRules = this.pageRules
      .filter(rule => this.matchesPath(path, rule.pathPattern))
      .sort((a, b) => b.priority - a.priority);

    // Apply the highest priority matching rule
    if (applicableRules.length > 0) {
      config = { ...config, ...applicableRules[0].config };
    }

    // Apply custom configuration if provided
    if (customConfig) {
      config = { ...config, ...customConfig };
    }

    return config;
  }

  /**
   * Generate robots meta string
   */
  generateRobotsMetaString(path: string, customConfig?: Partial<RobotsMetaConfig>): string {
    const config = this.generateRobotsConfig(path, customConfig);
    return this.formatRobotsString(config);
  }

  /**
   * Format robots configuration as meta content string
   */
  private formatRobotsString(config: RobotsMetaConfig): string {
    const directives: string[] = [];

    // Index/noindex
    if (!config.index) {
      directives.push('noindex');
    }

    // Follow/nofollow
    if (!config.follow) {
      directives.push('nofollow');
    }

    // Additional directives
    if (config.noarchive) {
      directives.push('noarchive');
    }

    if (config.nosnippet) {
      directives.push('nosnippet');
    }

    if (config.noimageindex) {
      directives.push('noimageindex');
    }

    if (config.maxSnippet !== undefined) {
      directives.push(`max-snippet:${config.maxSnippet}`);
    }

    if (config.maxImagePreview) {
      directives.push(`max-image-preview:${config.maxImagePreview}`);
    }

    if (config.maxVideoPreview !== undefined) {
      directives.push(`max-video-preview:${config.maxVideoPreview}`);
    }

    if (config.unavailableAfter) {
      const dateString = config.unavailableAfter.toISOString().split('T')[0];
      directives.push(`unavailable_after:${dateString}`);
    }

    // If no restrictions, return default
    if (directives.length === 0) {
      return 'index, follow';
    }

    return directives.join(', ');
  }

  /**
   * Check if path matches pattern
   */
  private matchesPath(path: string, pattern: string | RegExp): boolean {
    if (typeof pattern === 'string') {
      return path === pattern;
    }
    return pattern.test(path);
  }

  /**
   * Add custom page rule
   */
  addPageRule(rule: PageRobotsRule): void {
    this.pageRules.push(rule);
    // Re-sort by priority
    this.pageRules.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Remove page rule by pattern
   */
  removePageRule(pattern: string | RegExp): void {
    this.pageRules = this.pageRules.filter(rule => {
      if (typeof pattern === 'string' && typeof rule.pathPattern === 'string') {
        return rule.pathPattern !== pattern;
      }
      if (pattern instanceof RegExp && rule.pathPattern instanceof RegExp) {
        return rule.pathPattern.source !== pattern.source;
      }
      return true;
    });
  }

  /**
   * Get all applicable rules for a path (for debugging)
   */
  getApplicableRules(path: string): PageRobotsRule[] {
    return this.pageRules
      .filter(rule => this.matchesPath(path, rule.pathPattern))
      .sort((a, b) => b.priority - a.priority);
  }

  /**
   * Check if a path should be indexed
   */
  shouldIndex(path: string, customConfig?: Partial<RobotsMetaConfig>): boolean {
    const config = this.generateRobotsConfig(path, customConfig);
    return config.index;
  }

  /**
   * Check if a path should be followed
   */
  shouldFollow(path: string, customConfig?: Partial<RobotsMetaConfig>): boolean {
    const config = this.generateRobotsConfig(path, customConfig);
    return config.follow;
  }
}

// Export singleton instance
export const robotsMetaGenerator = new RobotsMetaGenerator();