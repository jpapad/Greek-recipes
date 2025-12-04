// Enhanced Service Worker with Advanced Caching Strategies

const CACHE_NAME = 'greek-recipes-v2';
const DYNAMIC_CACHE = 'greek-recipes-dynamic-v2';
const RECIPE_CACHE = 'greek-recipes-recipes-v2';
const IMAGE_CACHE = 'greek-recipes-images-v2';

// Static assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/recipes',
  '/regions',
  '/favorites',
  '/offline',
  '/manifest.json',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (
            cacheName !== CACHE_NAME &&
            cacheName !== DYNAMIC_CACHE &&
            cacheName !== RECIPE_CACHE &&
            cacheName !== IMAGE_CACHE
          ) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome extensions and other protocols
  if (!url.protocol.startsWith('http')) return;

  // API requests - Network first, fallback to cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
    return;
  }

  // Recipe pages - Stale while revalidate
  if (url.pathname.startsWith('/recipes/')) {
    event.respondWith(staleWhileRevalidate(request, RECIPE_CACHE));
    return;
  }

  // Images - Cache first
  if (request.destination === 'image') {
    event.respondWith(cacheFirst(request, IMAGE_CACHE));
    return;
  }

  // Static assets - Cache first
  if (
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'font'
  ) {
    event.respondWith(cacheFirst(request, CACHE_NAME));
    return;
  }

  // Everything else - Network first
  event.respondWith(networkFirst(request, DYNAMIC_CACHE));
});

// Cache-first strategy
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('Fetch failed:', error);
    return new Response('Offline', { status: 503 });
  }
}

// Network-first strategy
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      const offlinePage = await cache.match('/offline');
      if (offlinePage) return offlinePage;
    }

    return new Response('Offline', { status: 503 });
  }
}

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  });

  return cached || fetchPromise;
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Background sync:', event.tag);

  if (event.tag === 'sync-favorites') {
    event.waitUntil(syncFavorites());
  }

  if (event.tag === 'sync-reviews') {
    event.waitUntil(syncReviews());
  }
});

async function syncFavorites() {
  // TODO: Implement sync logic for offline favorites
  console.log('Syncing favorites...');
}

async function syncReviews() {
  // TODO: Implement sync logic for offline reviews
  console.log('Syncing reviews...');
}

// Push notifications (optional)
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};
  const title = data.title || 'Greek Recipes';
  const options = {
    body: data.body || 'New recipe available!',
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    data: data.url || '/',
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data || '/')
  );
});

console.log('Enhanced Service Worker loaded');

