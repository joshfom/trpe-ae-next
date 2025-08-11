'use client';

import { useState, useEffect, useCallback } from 'react';
import { CookieManager, CookiePreferences } from '@/lib/cookie-manager';

export function useCookieConsent() {
  const [hasConsent, setHasConsent] = useState<boolean>(false);
  const [preferences, setPreferences] = useState<CookiePreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const consent = CookieManager.getConsent();
    setHasConsent(consent !== null);
    setPreferences(consent?.preferences || null);
    setIsLoading(false);
  }, []);

  const acceptAll = useCallback(() => {
    const newPreferences: CookiePreferences = {
      necessary: true,
      analytics: true,
    };
    CookieManager.setConsent(newPreferences);
    setHasConsent(true);
    setPreferences(newPreferences);
  }, []);

  const rejectOptional = useCallback(() => {
    const newPreferences: CookiePreferences = {
      necessary: true,
      analytics: false,
    };
    CookieManager.setConsent(newPreferences);
    setHasConsent(true);
    setPreferences(newPreferences);
  }, []);

  const updatePreferences = useCallback((newPreferences: CookiePreferences) => {
    CookieManager.setConsent(newPreferences);
    setHasConsent(true);
    setPreferences(newPreferences);
  }, []);

  const revokeConsent = useCallback(() => {
    CookieManager.revokeConsent();
    setHasConsent(false);
    setPreferences(null);
  }, []);

  const hasAnalyticsConsent = preferences?.analytics ?? false;

  return {
    hasConsent,
    preferences,
    isLoading,
    hasAnalyticsConsent,
    acceptAll,
    rejectOptional,
    updatePreferences,
    revokeConsent,
  };
}
