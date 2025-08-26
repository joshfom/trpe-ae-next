'use client';

import React, { useState, useEffect } from 'react';
import { X, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCookieConsent } from '@/hooks/use-cookie-consent';
import Link from 'next/link';

const CookieConsentBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { hasConsent, acceptAll, rejectOptional } = useCookieConsent();

  useEffect(() => {
    // Show banner if user hasn't made a choice yet
    if (!hasConsent) {
      const timer = setTimeout(() => setIsVisible(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [hasConsent]);

  const handleAccept = () => {
    acceptAll();
    setIsVisible(false);
  };

  const handleDecline = () => {
    rejectOptional();
    setIsVisible(false);
  };

  // Auto-accept after 15 seconds
  useEffect(() => {
    if (isVisible && !hasConsent) {
      const autoAcceptTimer = setTimeout(() => {
        acceptAll();
        setIsVisible(false);
      }, 15000);

      return () => clearTimeout(autoAcceptTimer);
    }
  }, [isVisible, hasConsent, acceptAll]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-background/95 backdrop-blur-md border-t border-border shadow-lg animate-in slide-in-from-bottom-5 duration-500">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-foreground">
              <span className="font-medium">🍪 We use cookies</span> to analyze site usage and improve your experience. 
              <Link href="/cookie-settings" className="text-primary hover:underline ml-1">
                Learn more
              </Link>
            </p>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDecline}
              className="h-8 px-3 text-xs"
            >
              Decline
            </Button>
            <Button 
              onClick={handleAccept}
              size="sm"
              className="h-8 px-3 text-xs"
            >
              Accept
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="h-8 w-8 p-0 ml-2"
              aria-label="Close cookie consent banner"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="mt-2">
          <p className="text-xs text-gray-600">
            By continuing to browse, you agree to our use of analytics cookies. Auto-accepts in 15s.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
