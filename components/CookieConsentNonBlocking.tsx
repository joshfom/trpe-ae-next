'use client';

import React, { useState, useEffect } from 'react';
import { X, Cookie, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCookieConsent } from '@/hooks/use-cookie-consent';
import { CookiePreferences } from '@/lib/cookie-manager';

const CookieConsentNonBlocking = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [localPreferences, setLocalPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
  });

  const { hasConsent, preferences, acceptAll, rejectOptional, updatePreferences } = useCookieConsent();

  useEffect(() => {
    // Show notice if user hasn't made a choice yet
    if (!hasConsent) {
      const timer = setTimeout(() => setIsVisible(true), 2000); // Slightly longer delay
      return () => clearTimeout(timer);
    }
  }, [hasConsent]);

  useEffect(() => {
    // Initialize local preferences with current settings
    if (preferences) {
      setLocalPreferences(preferences);
    }
  }, [preferences]);

  const handleAcceptAll = () => {
    acceptAll();
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    rejectOptional();
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    updatePreferences(localPreferences);
    setIsVisible(false);
  };

  // Auto-accept analytics after 10 seconds if no interaction
  useEffect(() => {
    if (isVisible && !hasConsent) {
      const autoAcceptTimer = setTimeout(() => {
        acceptAll();
        setIsVisible(false);
      }, 10000); // Auto-accept after 10 seconds

      return () => clearTimeout(autoAcceptTimer);
    }
  }, [isVisible, hasConsent, acceptAll]);

  if (!isVisible) return null;

  return (
    <>
      {/* Non-blocking Cookie Notice */}
      <div className="fixed bottom-4 right-4 z-[9999] max-w-sm w-full animate-in slide-in-from-bottom-5 duration-500">
        <Card className="shadow-2xl border-border/50 bg-background/95 backdrop-blur-md">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cookie className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">We use cookies</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {!showDetails ? (
              // Simple notice
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  By continuing to use our site, you agree to our use of cookies for analytics to improve your experience.
                </p>
                
                <div className="flex flex-col gap-2">
                  <Button onClick={handleAcceptAll} className="w-full h-8 text-sm">
                    Accept & Continue
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleRejectAll} className="flex-1 h-8 text-xs">
                      Decline
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setShowDetails(true)}
                      className="flex-1 h-8 text-xs"
                    >
                      <Settings className="h-3 w-3 mr-1" />
                      Settings
                    </Button>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  Auto-accepts in 10s • Only basic analytics
                </p>
              </div>
            ) : (
              // Detailed view (same as before but more compact)
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {/* Required Cookies */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Essential</h4>
                      <p className="text-xs text-muted-foreground">
                        Required for site functionality
                      </p>
                    </div>
                    <Switch checked={true} disabled className="opacity-50" />
                  </div>
                </div>

                <Separator />

                {/* Analytics Cookies */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Analytics</h4>
                      <p className="text-xs text-muted-foreground">
                        Help us improve our website
                      </p>
                    </div>
                    <Switch
                      checked={localPreferences.analytics}
                      onCheckedChange={(checked) =>
                        setLocalPreferences(prev => ({ ...prev, analytics: checked }))
                      }
                    />
                  </div>
                  
                  <div className="pl-0 text-xs text-muted-foreground">
                    <p className="mb-1"><strong>Google Analytics:</strong> Page views, user interactions</p>
                    <p><strong>Data:</strong> _ga, _gid cookies (anonymous)</p>
                  </div>
                </div>

                <Separator />

                <div className="flex flex-col gap-2">
                  <Button onClick={handleSavePreferences} className="w-full h-8 text-sm">
                    Save Preferences
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowDetails(false)}
                    className="w-full h-8 text-sm"
                  >
                    Back
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default CookieConsentNonBlocking;
