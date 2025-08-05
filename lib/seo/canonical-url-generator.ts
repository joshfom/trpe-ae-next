"use server";

export interface CanonicalURLConfig {
  baseUrl: string;
  path: string;
  removeTrailingSlash?: boolean;
  removeQueryParams?: boolean;
  preserveQueryParams?: string[];
  forceHttps?: boolean;
}

export class CanonicalURLGenerator {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || process.env.NEXT_PUBLIC_URL || 'https://trpe.ae';
  }

  /**
   * Generate canonical URL with proper normalization
   */
  generateCanonicalURL(config: Omit<CanonicalURLConfig, 'baseUrl'>): string {
    const fullConfig: CanonicalURLConfig = {
      baseUrl: this.baseUrl,
      removeTrailingSlash: true,
      removeQueryParams: true,
      forceHttps: true,
      ...config
    };

    return this.normalizeURL(fullConfig);
  }

  /**
   * Normalize URL according to SEO best practices
   */
  private normalizeURL(config: CanonicalURLConfig): string {
    let { baseUrl, path } = config;

    // Ensure HTTPS if required
    if (config.forceHttps && baseUrl.startsWith('http://')) {
      baseUrl = baseUrl.replace('http://', 'https://');
    }

    // Clean and normalize path
    path = this.normalizePath(path);

    // Handle query parameters
    const [pathname, queryString] = path.split('?');
    let normalizedPath = pathname;

    if (queryString && !config.removeQueryParams) {
      const preservedParams = this.preserveQueryParams(queryString, config.preserveQueryParams);
      if (preservedParams) {
        normalizedPath += `?${preservedParams}`;
      }
    }

    // Remove trailing slash if configured
    if (config.removeTrailingSlash && normalizedPath.endsWith('/') && normalizedPath !== '/') {
      normalizedPath = normalizedPath.slice(0, -1);
    }

    // Combine base URL and path
    const canonicalUrl = `${baseUrl.replace(/\/$/, '')}${normalizedPath}`;

    return canonicalUrl;
  }

  /**
   * Normalize path component
   */
  private normalizePath(path: string): string {
    // Ensure path starts with /
    if (!path.startsWith('/')) {
      path = '/' + path;
    }

    // Remove double slashes
    path = path.replace(/\/+/g, '/');

    // Decode URI components for consistency, but keep encoded if decoding fails
    try {
      const decoded = decodeURIComponent(path);
      // Only use decoded version if it doesn't contain problematic characters
      if (!decoded.includes('%')) {
        path = decoded;
      }
    } catch (e) {
      // If decoding fails, use original path
    }

    return path;
  }

  /**
   * Preserve specific query parameters
   */
  private preserveQueryParams(queryString: string, preserveParams?: string[]): string {
    if (!preserveParams || preserveParams.length === 0) {
      return '';
    }

    const params = new URLSearchParams(queryString);
    const preservedParams = new URLSearchParams();

    for (const param of preserveParams) {
      const value = params.get(param);
      if (value !== null) {
        preservedParams.set(param, value);
      }
    }

    return preservedParams.toString();
  }

  /**
   * Generate canonical URL for property pages
   */
  generatePropertyCanonicalURL(offeringType: string, slug: string): string {
    return this.generateCanonicalURL({
      path: `/properties/${offeringType}/${slug}`
    });
  }

  /**
   * Generate canonical URL for community pages
   */
  generateCommunityCanonicalURL(slug: string): string {
    return this.generateCanonicalURL({
      path: `/communities/${slug}`
    });
  }

  /**
   * Generate canonical URL for insight pages
   */
  generateInsightCanonicalURL(slug: string): string {
    return this.generateCanonicalURL({
      path: `/insights/${slug}`
    });
  }

  /**
   * Generate canonical URL for listing pages with preserved pagination
   */
  generateListingCanonicalURL(basePath: string, page?: number): string {
    const preserveParams = page && page > 1 ? ['page'] : undefined;
    const path = page && page > 1 ? `${basePath}?page=${page}` : basePath;

    return this.generateCanonicalURL({
      path,
      removeQueryParams: false,
      preserveQueryParams: preserveParams
    });
  }

  /**
   * Validate if URL is a valid canonical URL
   */
  isValidCanonicalURL(url: string): boolean {
    try {
      const parsedUrl = new URL(url);
      
      // Must be HTTPS
      if (parsedUrl.protocol !== 'https:') {
        return false;
      }

      // Must have valid hostname (not empty and not just slashes)
      if (!parsedUrl.hostname || parsedUrl.hostname.length === 0 || parsedUrl.hostname === '/') {
        return false;
      }

      // Path should not have double slashes
      if (parsedUrl.pathname.includes('//')) {
        return false;
      }

      return true;
    } catch (e) {
      return false;
    }
  }
}

// Export singleton instance
export const canonicalURLGenerator = new CanonicalURLGenerator();