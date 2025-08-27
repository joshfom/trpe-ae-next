// TRPE Global Service Worker
// Optimized for real estate property browsing

const CACHE_NAME = 'trpe-v1.0.0';
const STATIC_CACHE_NAME = 'trpe-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'trpe-dynamic-v1.0.0';

// Critical resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/luxe',
  '/properties',
  '/offline',
  '/static/js/app.js',
  '/static/css/app.css',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/trpe-logo.webp'
];

// Routes that should work offline
const OFFLINE_PAGES = [
  '/',
  '/luxe',
  '/properties',
  '/luxe/properties',
  '/luxe/advisors',
  '/luxe/journals'
];

// Property-related routes that benefit from caching
const DYNAMIC_ROUTES = [
  '/properties/',
  '/luxe/property/',
  '/luxe/advisors/',
  '/luxe/journals/',
  '/communities/',
  '/our-team/'
];

// API endpoints to cache (for property data)
const API_CACHE_PATTERNS = [
  '/api/properties',
  '/api/luxe/',
  '/api/insights',
  '/api/agents'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker');
  
  event.waitUntil(
    (async () => {
      try {
        const staticCache = await caches.open(STATIC_CACHE_NAME);
        await staticCache.addAll(STATIC_ASSETS);
        console.log('[SW] Static assets cached');
        
        // Skip waiting to activate immediately
        self.skipWaiting();
      } catch (error) {
        console.error('[SW] Cache installation failed:', error);
      }
    })()
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker');
  
  event.waitUntil(
    (async () => {
      try {
        const cacheNames = await caches.keys();
        const deletionPromises = cacheNames
          .filter(cacheName => 
            cacheName.startsWith('trpe-') && 
            ![STATIC_CACHE_NAME, DYNAMIC_CACHE_NAME].includes(cacheName)
          )
          .map(cacheName => caches.delete(cacheName));
        
        await Promise.all(deletionPromises);
        console.log('[SW] Old caches cleaned up');
        
        // Take control of all clients immediately
        self.clients.claim();
      } catch (error) {
        console.error('[SW] Activation failed:', error);
      }
    })()
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // Skip cross-origin requests (except for images)
  if (url.origin !== self.location.origin && !isImageRequest(request)) {
    return;
  }
  
  event.respondWith(handleRequest(request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  try {
    // Strategy 1: Cache First for static assets
    if (isStaticAsset(pathname)) {
      return await cacheFirst(request, STATIC_CACHE_NAME);
    }
    
    // Strategy 2: Stale While Revalidate for property images
    if (isImageRequest(request)) {
      return await staleWhileRevalidate(request, DYNAMIC_CACHE_NAME);
    }
    
    // Strategy 3: Network First for API calls (with fallback)
    if (isApiRequest(pathname)) {
      return await networkFirst(request, DYNAMIC_CACHE_NAME);
    }
    
    // Strategy 4: Stale While Revalidate for property pages
    if (isDynamicRoute(pathname)) {
      return await staleWhileRevalidate(request, DYNAMIC_CACHE_NAME);
    }
    
    // Strategy 5: Network First for main pages (with offline fallback)
    if (isOfflinePage(pathname)) {
      return await networkFirstWithOffline(request, DYNAMIC_CACHE_NAME);
    }
    
    // Default: Network only
    return await fetch(request);
    
  } catch (error) {
    console.error('[SW] Request handling failed:', error);
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      return await cache.match('/offline') || new Response('Offline');
    }
    
    return new Response('Network error', { status: 503 });
  }
}

// Caching Strategies
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  const networkResponse = await fetch(request);
  if (networkResponse.ok) {
    cache.put(request, networkResponse.clone());
  }
  
  return networkResponse;
}

async function networkFirst(request, cacheName, timeout = 3000) {
  const cache = await caches.open(cacheName);
  
  try {
    // Race network request against timeout
    const networkResponse = await Promise.race([
      fetch(request),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Network timeout')), timeout)
      )
    ]);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Fallback to cache
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  // Update cache in background
  const networkResponse = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => {}); // Ignore network errors
  
  // Return cached version immediately if available
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Otherwise wait for network
  return await networkResponse;
}

async function networkFirstWithOffline(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Try cache first
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return await cache.match('/offline') || 
        new Response('You are offline', { 
          status: 200, 
          headers: { 'Content-Type': 'text/html' }
        });
    }
    
    throw error;
  }
}

// Helper functions
function isStaticAsset(pathname) {
  return pathname.startsWith('/_next/static/') ||
         pathname.startsWith('/static/') ||
         pathname.endsWith('.css') ||
         pathname.endsWith('.js') ||
         pathname.endsWith('.woff2') ||
         pathname.endsWith('.woff');
}

function isImageRequest(request) {
  return request.destination === 'image' ||
         request.url.includes('/images/') ||
         /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(request.url);
}

function isApiRequest(pathname) {
  return API_CACHE_PATTERNS.some(pattern => pathname.startsWith(pattern));
}

function isDynamicRoute(pathname) {
  return DYNAMIC_ROUTES.some(route => pathname.startsWith(route));
}

function isOfflinePage(pathname) {
  return OFFLINE_PAGES.includes(pathname) || pathname === '/';
}

// Background sync for form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'contact-form') {
    event.waitUntil(syncContactForms());
  } else if (event.tag === 'property-inquiry') {
    event.waitUntil(syncPropertyInquiries());
  }
});

async function syncContactForms() {
  // Handle offline form submissions
  console.log('[SW] Syncing contact forms');
}

async function syncPropertyInquiries() {
  // Handle offline property inquiries
  console.log('[SW] Syncing property inquiries');
}

// Push notifications for new properties
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: data.tag || 'trpe-notification',
    data: data.url ? { url: data.url } : undefined,
    actions: data.actions || [
      {
        action: 'view',
        title: 'View Property'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'TRPE Global', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'view' && event.notification.data?.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  } else if (event.action !== 'close') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log('[SW] Service worker loaded successfully');
