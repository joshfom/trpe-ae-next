'use client';

import React, { useState, useEffect } from 'react';
import { X, Cookie, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useCookieConsent } from '@/hooks/use-cookie-consent';
import { CookiePreferences } from '@/lib/cookie-manager';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [localPreferences, setLocalPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
  });

  const { hasConsent, preferences, acceptAll, rejectOptional, updatePreferences } = useCookieConsent();

  useEffect(() => {
    // Show banner if user hasn't made a choice yet
    if (!hasConsent) {
      const timer = setTimeout(() => setIsVisible(true), 1000);
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

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998]" />
      
      {/* Cookie Banner */}
      <div className="fixed bottom-4 right-4 z-[9999] max-w-md w-full">
        <Card className="shadow-2xl border-border/50 bg-background/95 backdrop-blur-md">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cookie className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Cookie Settings</CardTitle>
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
            <CardDescription className="text-sm">
              We use cookies to enhance your browsing experience and analyze our traffic.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {!showDetails ? (
              // Simple view
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  By continuing to use our website, you consent to our use of cookies for analytics and essential functionality.
                </p>
                
                <div className="flex flex-col gap-2">
                  <Button onClick={handleAcceptAll} className="w-full">
                    Accept All Cookies
                  </Button>
                  <Button variant="outline" onClick={handleRejectAll} className="w-full">
                    Reject Optional Cookies
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setShowDetails(true)}
                    className="w-full text-sm"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Customize Settings
                  </Button>
                </div>
              </div>
            ) : (
              // Detailed view
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {/* Required Cookies */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Required Cookies</h4>
                      <p className="text-xs text-muted-foreground">
                        These cookies are required for the website to work.
                      </p>
                    </div>
                    <Switch checked={true} disabled className="opacity-50" />
                  </div>
                  
                  <div className="pl-4 space-y-2 text-xs text-muted-foreground">
                    <div>
                      <p className="font-medium text-foreground">Session cookie</p>
                      <p>The session cookie is used to identify you between web requests.</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Analytics Cookies */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Analytics</h4>
                      <p className="text-xs text-muted-foreground">
                        We use these cookies to measure how you interact with our website.
                      </p>
                    </div>
                    <Switch
                      checked={localPreferences.analytics}
                      onCheckedChange={(checked) =>
                        setLocalPreferences(prev => ({ ...prev, analytics: checked }))
                      }
                    />
                  </div>
                  
                  <div className="pl-4 space-y-3 text-xs text-muted-foreground">
                    <div>
                      <p className="font-medium text-foreground">Google Analytics</p>
                      <p className="mb-2">Google Analytics tracks which pages you visit.</p>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="font-medium">Name:</span>
                          <span>_ga</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Provider:</span>
                          <span>analytics.google.com</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Duration:</span>
                          <span>2 years</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Type:</span>
                          <span>Identifier for Advertisers</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="font-medium">Name:</span>
                          <span>_gid</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Duration:</span>
                          <span>2 years</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Type:</span>
                          <span>Identifier for Advertisers</span>
                        </div>
                      </div>
                    </div>
                    
                    <Separator className="my-2" />
                    
                    <div>
                      <p className="font-medium text-foreground mb-1">Contact details</p>
                      <address className="not-italic">
                        Google Inc.<br />
                        1600 Amphitheatre Parkway<br />
                        Mountain View, CA 94043<br />
                        United States
                      </address>
                      
                      <div className="mt-2">
                        <p className="font-medium text-foreground">Links</p>
                        <a 
                          href="https://policies.google.com/privacy" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Privacy policy
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex flex-col gap-2">
                  <Button onClick={handleSavePreferences} className="w-full">
                    Save Preferences
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowDetails(false)}
                    className="w-full"
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

export default CookieConsent;
