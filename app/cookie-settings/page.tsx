'use client';

import React, { useState } from 'react';
import { Cookie, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCookieConsent } from '@/hooks/use-cookie-consent';
import { CookiePreferences } from '@/lib/cookie-manager';

export default function CookieSettingsPage() {
  const { preferences, updatePreferences, revokeConsent, hasConsent } = useCookieConsent();
  const [localPreferences, setLocalPreferences] = useState<CookiePreferences>(
    preferences || { necessary: true, analytics: false }
  );
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updatePreferences(localPreferences);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleRevokeAll = () => {
    revokeConsent();
    setLocalPreferences({ necessary: true, analytics: false });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Cookie className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Cookie Settings</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Manage your cookie preferences for our website. You can enable or disable different types of cookies below.
        </p>
      </div>

      {saved && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <Check className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Your cookie preferences have been saved successfully.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        {/* Current Status */}
        <Card>
          <CardHeader>
            <CardTitle>Current Status</CardTitle>
            <CardDescription>
              {hasConsent 
                ? 'You have configured your cookie preferences.' 
                : 'You have not yet configured your cookie preferences.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Analytics Cookies:</span>
                <span className={localPreferences.analytics ? 'text-green-600' : 'text-red-600'}>
                  {localPreferences.analytics ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Required Cookies:</span>
                <span className="text-green-600">Always Enabled</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Required Cookies */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Required Cookies</CardTitle>
                <CardDescription>
                  These cookies are essential for the website to function properly and cannot be disabled.
                </CardDescription>
              </div>
              <Switch checked={true} disabled className="opacity-50" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Session Cookie</h4>
              <p className="text-sm text-muted-foreground mb-3">
                The session cookie is used to identify you between web requests and maintain your session state.
              </p>
              
              <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Purpose:</span>
                    <span className="ml-2">Session management</span>
                  </div>
                  <div>
                    <span className="font-medium">Duration:</span>
                    <span className="ml-2">Session only</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analytics Cookies */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Analytics Cookies</CardTitle>
                <CardDescription>
                  These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                </CardDescription>
              </div>
              <Switch
                checked={localPreferences.analytics}
                onCheckedChange={(checked) =>
                  setLocalPreferences(prev => ({ ...prev, analytics: checked }))
                }
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Google Analytics</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Google Analytics tracks which pages you visit and how you interact with our site to help us improve user experience.
              </p>
              
              <div className="bg-muted/50 p-4 rounded-lg space-y-3 text-sm">
                <div className="space-y-2">
                  <h5 className="font-medium">Cookie Details:</h5>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="font-medium">_ga Cookie</div>
                      <div className="space-y-1 text-xs">
                        <div><span className="font-medium">Provider:</span> analytics.google.com</div>
                        <div><span className="font-medium">Duration:</span> 2 years</div>
                        <div><span className="font-medium">Type:</span> Identifier for Advertisers</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="font-medium">_gid Cookie</div>
                      <div className="space-y-1 text-xs">
                        <div><span className="font-medium">Duration:</span> 24 hours</div>
                        <div><span className="font-medium">Type:</span> Identifier for Advertisers</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h5 className="font-medium mb-2">Contact Details</h5>
                  <address className="not-italic text-xs">
                    Google Inc.<br />
                    1600 Amphitheatre Parkway<br />
                    Mountain View, CA 94043<br />
                    United States
                  </address>
                  
                  <div className="mt-2">
                    <a 
                      href="https://policies.google.com/privacy" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-xs"
                    >
                      Google Privacy Policy →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={handleSave} className="flex-1">
            Save Preferences
          </Button>
          <Button variant="outline" onClick={handleRevokeAll} className="flex-1">
            Revoke All Optional Cookies
          </Button>
        </div>

        {/* Additional Information */}
        <Card className="border-muted">
          <CardHeader>
            <CardTitle className="text-lg">Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div>
              <h4 className="font-medium text-foreground mb-2">What we collect:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Pages you visit on our website</li>
                <li>How long you spend on each page</li>
                <li>How you arrived at our site</li>
                <li>General location information (country/city level)</li>
                <li>Device and browser information</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground mb-2">What we don&apos;t collect:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Personal information without your consent</li>
                <li>Sensitive personal data</li>
                <li>Data for advertising purposes</li>
                <li>Cross-site tracking data</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground mb-2">Your rights:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Change your preferences at any time</li>
                <li>Withdraw consent for optional cookies</li>
                <li>Request data deletion (contact us)</li>
                <li>Access information about data we collect</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
