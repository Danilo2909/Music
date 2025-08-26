// simple offline cache
self.addEventListener('install', event => {
  event.waitUntil(caches.open('mg-v1').then(c=>c.addAll(['/'])))
})
self.addEventListener('fetch', event => {
  event.respondWith(caches.match(event.request).then(r=>r || fetch(event.request)))
})
