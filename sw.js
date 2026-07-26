const CACHE_NAME = 'toyor-el-fayoumi-v4';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './images/logotoyor.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // تفعيل النسخة الجديدة فوراً بدون انتظار
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache); // إزالة الكاش القديم لتطبيق التعديلات فوراً لدى الزبائن
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // عدم تخزين كاش لشيتات جوجل لإظهار البيانات لحظياً
  if (event.request.url.includes('google.com/spreadsheets')) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
