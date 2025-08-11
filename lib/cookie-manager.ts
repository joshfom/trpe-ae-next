export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
}

export interface CookieConsent {
  preferences: CookiePreferences;
  timestamp: string;
  version: string;
}

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

const COOKIE_CONSENT_KEY = 'cookie-consent';
const CONSENT_VERSION = '1.0';

export class CookieManager {
  static getConsent(): CookieConsent | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  static setConsent(preferences: CookiePreferences): void {
    if (typeof window === 'undefined') return;
    
    const consent: CookieConsent = {
      preferences,
      timestamp: new Date().toISOString(),
      version: CONSENT_VERSION,
    };

    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
    
    // Update GTM consent
    this.updateGTMConsent(preferences);
  }

  static hasConsent(): boolean {
    return this.getConsent() !== null;
  }

  static hasAnalyticsConsent(): boolean {
    const consent = this.getConsent();
    return consent?.preferences.analytics ?? false;
  }

  static revokeConsent(): void {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(COOKIE_CONSENT_KEY);
    
    // Revoke GTM consent
    this.updateGTMConsent({ necessary: true, analytics: false });
  }

  private static updateGTMConsent(preferences: CookiePreferences): void {
    if (typeof window === 'undefined') return;
    
    window.dataLayer = window.dataLayer || [];
    
    // Declare gtag function if it doesn't exist
    if (typeof window.gtag === 'undefined') {
      window.gtag = function(...args: any[]) {
        window.dataLayer.push(args);
      };
    }
    
    // Update consent mode
    window.gtag('consent', 'update', {
      analytics_storage: preferences.analytics ? 'granted' : 'denied',
      ad_storage: 'denied', // We don't use ads
      functionality_storage: preferences.necessary ? 'granted' : 'denied',
      personalization_storage: 'denied', // We don't use personalization
      security_storage: 'granted', // Always needed for security
    });

    // Track consent choice for analytics (only if analytics is enabled)
    if (preferences.analytics) {
      window.dataLayer.push({
        event: 'cookie_consent_updated',
        cookie_preferences: preferences,
      });
    }
  }

  static initializeGTMConsent(): void {
    if (typeof window === 'undefined') return;
    
    const consent = this.getConsent();
    
    window.dataLayer = window.dataLayer || [];
    
    // Set default consent mode
    window.dataLayer.push({
      event: 'gtm.init_consent',
      'gtm.start': new Date().getTime(),
      analytics_storage: consent?.preferences.analytics ? 'granted' : 'denied',
      ad_storage: 'denied',
      functionality_storage: 'granted',
      personalization_storage: 'denied',
      security_storage: 'granted',
    });
  }
}

// Initialize consent on load
if (typeof window !== 'undefined') {
  CookieManager.initializeGTMConsent();
}
