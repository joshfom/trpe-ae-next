'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCookieConsent } from '@/hooks/use-cookie-consent';
import Link from 'next/link';

const CookieConsentMinimal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { hasConsent, acceptAll } = useCookieConsent();

  useEffect(() => {
    // Show notice if user hasn't made a choice yet
    if (!hasConsent) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [hasConsent]);

  const handleAccept = () => {
    acceptAll();
    setIsVisible(false);
  };

  // Auto-accept after 20 seconds (more relaxed)
  useEffect(() => {
    if (isVisible && !hasConsent) {
      const autoAcceptTimer = setTimeout(() => {
        acceptAll();
        setIsVisible(false);
      }, 20000);

      return () => clearTimeout(autoAcceptTimer);
    }
  }, [isVisible, hasConsent, acceptAll]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-[9999] animate-in slide-in-from-bottom-5 duration-500">
      <div className="bg-background/95 backdrop-blur-md border border-border rounded-lg shadow-lg p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="text-sm text-foreground mb-2">
              <span className="font-medium">🍪 This site uses cookies</span> for analytics to improve your experience.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span>By continuing, you agree.</span>
              <Link href="/cookie-settings" className="text-primary hover:underline">
                Settings
              </Link>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button 
              onClick={handleAccept}
              size="sm"
              className="h-7 px-3 text-xs"
            >
              OK
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="h-7 w-7 p-0"
              aria-label="Dismiss cookie notice"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentMinimal;
