// Raithu Alert - Service Worker for PWA Offline & Background Rain Notifications
const CACHE_NAME = 'raithu-alert-v4';

self.addEventListener('install', (event) => {
  // Instantly take over without blocking on external assets
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      );
    }).then(() => self.clients.claim())
  );
});

// Pass-through fetch handler required by Chrome for PWA installability
self.addEventListener('fetch', (event) => {
  // Only handle GET requests for navigation/assets
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
        return new Response('Network unavailable', { status: 503, statusText: 'Service Unavailable' });
      });
    })
  );
});

// Handle Background Push Notifications from Web Push / Backend
self.addEventListener('push', (event) => {
  let data = {
    title: 'RAIN ALERT – KADLUR',
    body: 'Precipitation update for Kadlur village fields.',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'kadlur-rain-alert',
    renotify: true
  };

  if (event.data) {
    try {
      const payload = event.data.json();
      data = { ...data, ...payload };
    } catch (e) {
      data.body = event.data.text();
    }
  }

  // OS-supported high-priority notification options
  // Dual-pulse urgent vibration pattern: 500ms buzz, 150ms pause, 500ms buzz, 150ms pause, 800ms buzz
  const options = {
    body: data.body,
    icon: data.icon || '/icon-192.png',
    badge: data.badge || '/icon-192.png',
    tag: data.tag || 'kadlur-rain-alert',
    vibrate: [500, 150, 500, 150, 800],
    requireInteraction: true,
    silent: false,
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
      url: '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle clicking on notification to bring Kadlur dashboard into focus
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
