'use client';

import { useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAManager() {
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    // Define global functions
    window.updateApp = () => {
      window.location.reload();
    };

    window.installApp = async () => {
      const deferredPrompt = (window as any).deferredPrompt;
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
          console.log('User accepted PWA install');
        } else {
          console.log('User dismissed PWA install');
        }
        
        (window as any).deferredPrompt = null;
        window.hideInstallBanner();
      }
    };

    window.hideInstallBanner = () => {
      const banner = document.getElementById('pwa-install-banner');
      if (banner) {
        banner.remove();
        localStorage.setItem('pwa-install-dismissed', 'true');
      }
    };
    
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((registration) => {
          console.log('SW registered:', registration);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content available, show update notification
                  showUpdateNotification();
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('SW registration failed:', error);
        });
    }

    // Handle PWA install prompt
    let deferredPrompt: BeforeInstallPromptEvent | null = null;
    
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPrompt = e as BeforeInstallPromptEvent;
      
      // Show install banner after user has browsed a few pages
      setTimeout(() => {
        showInstallBanner(deferredPrompt);
      }, 30000); // Show after 30 seconds
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Handle successful installation
    window.addEventListener('appinstalled', () => {
      console.log('PWA installed successfully');
      
      // Track installation
      if (typeof window !== 'undefined' && 'gtag' in window) {
        gtag('event', 'pwa_install', {
          event_category: 'PWA',
          event_label: 'App Installed'
        });
      }
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const showUpdateNotification = () => {
    // Create update notification
    const notification = document.createElement('div');
    notification.id = 'pwa-update-notification';
    notification.className = 'fixed top-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm';
    notification.innerHTML = `
      <div class="flex items-start gap-3">
        <div class="flex-1">
          <h4 class="font-semibold mb-1">Update Available</h4>
          <p class="text-sm opacity-90">A new version of the app is available.</p>
        </div>
        <button 
          onclick="updateApp()" 
          class="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100"
        >
          Update
        </button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
      notification?.remove();
    }, 10000);
  };

  return null;
}

// Global functions for PWA management
declare global {
  interface Window {
    updateApp: () => void;
    installApp: () => void;
    hideInstallBanner: () => void;
    deferredPrompt?: BeforeInstallPromptEvent;
  }
  function gtag(...args: any[]): void;
}

// Show install banner
function showInstallBanner(deferredPrompt: BeforeInstallPromptEvent | null) {
  if (!deferredPrompt) return;
  
  // Don't show if already dismissed
  if (localStorage.getItem('pwa-install-dismissed') === 'true') return;
  
  // Store for later use
  (window as any).deferredPrompt = deferredPrompt;
  
  const banner = document.createElement('div');
  banner.id = 'pwa-install-banner';
  banner.className = 'fixed bottom-4 left-4 right-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-xl shadow-xl z-50 max-w-md mx-auto';
  banner.innerHTML = `
    <div class="flex items-center gap-3">
      <div class="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
        <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        </svg>
      </div>
      <div class="flex-1 min-w-0">
        <h4 class="font-semibold text-sm mb-1">Install TRPE Global</h4>
        <p class="text-xs opacity-90">Get quick access to properties and work offline</p>
      </div>
      <div class="flex gap-2">
        <button 
          onclick="hideInstallBanner()" 
          class="text-white/70 hover:text-white text-sm px-2 py-1"
        >
          ✕
        </button>
        <button 
          onclick="installApp()" 
          class="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100"
        >
          Install
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(banner);
}
