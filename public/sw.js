// Deliberately conservative — this app's data (wallet balance, requests,
// admin state) must always be fresh, so nothing from the API is ever
// cached here. The service worker's only job is to (a) satisfy PWA
// installability criteria and (b) show a real offline page instead of the
// browser's default dinosaur/error screen when there's no connection.
const CACHE = 'tgl-shell-v1';
const SHELL_ASSETS = ['/offline.html', '/logo.svg', '/icons/icon-192.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL_ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only ever intervene on top-level page navigations — every other
  // request (JS/CSS bundles, the API, fonts) goes straight to the network
  // exactly as if there were no service worker at all.
  if (request.mode !== 'navigate') return;

  event.respondWith(
    fetch(request).catch(() => caches.match('/offline.html'))
  );
});
