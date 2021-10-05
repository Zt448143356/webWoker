var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
  // '/',
  // '/styles/main.css',
  // '/script/main.js'
  '/simple/baidu.png',
  '/simple/cuowu.jpeg'
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
  if (event.request.url.match(/.html$/)) {
    fetch(event.request)
      .catch(function () {
        return caches.match('/aaa/cuowu.jpeg');
      });
  } else {
    event.respondWith(
      caches.match(event.request).then(function (resp) {
        return resp || fetch(event.request).then(function (response) {
          return caches.open(CACHE_NAME).then(function (cache) {
            cache.put(event.request, response.clone());
            return response;
          });
        });
      }).catch(function () {
        return caches.match('/aaa/cuowu.jpeg');
      })
    );
  }
});

self.addEventListener('activate', () => {
  console.log('activate');
});

