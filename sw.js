// sw.js
const CACHE_NAME = 'teamsync-hub-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/vite.svg',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/react@18/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
  'https://unpkg.com/recharts/umd/Recharts.min.js',
  // Note: The main JS/TS files are loaded via importmap and are not listed here directly.
  // This service worker primarily caches the app shell and external libraries.
];

// Install a service worker
self.addEventListener('install', event => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        // Add all URLs to the cache. Some might fail if they are cross-origin without CORS.
        // We'll catch and log errors individually.
        const promises = urlsToCache.map(function(url) {
          // Create a new request to bypass browser cache during service worker installation
          return cache.add(new Request(url, {cache: 'reload'})).catch(function(error) {
            console.warn('Failed to cache ' + url + ': ' + error);
          });
        });
        return Promise.all(promises);
      })
  );
});

// Cache and return requests
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // Not in cache - fetch from network
        return fetch(event.request);
      }
    )
  );
});

// Update a service worker and clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
