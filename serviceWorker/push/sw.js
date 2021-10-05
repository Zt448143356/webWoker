
var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
];

self.addEventListener('install', (event) => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  console.log('fetch', event.request.url);
  event.respondWith(
    fetch(event.request)
  );
});

self.addEventListener('activate', () => {
  console.log('activate');
});

self.addEventListener('notificationclick', event => {
  // 消息提醒被点击的事件
  console.log('notificationclick->>>>', event);
});

self.addEventListener('notificationclose', event => {
  // 消息提醒被关闭的事件
  console.log('notificationclose->>>>', event);
});
