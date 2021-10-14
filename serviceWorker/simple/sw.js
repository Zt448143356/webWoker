let CACHE_NAME = 'my-site-cache-v1';
let urlsToCache = [
  '/simple/baidu.png',
  '/simple/cuowu.jpeg',
  '/hello'
];
let m = true;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  console.log('fetch', event.request.url);

  // 仅使用Cache（Cache only）
  // event.respondWith(caches.match(event.request));

  // 仅使用网络（Network only）
  // event.respondWith(fetch(event.request));

  // 先使用 SW 缓存，没有则使用网络资源
  // event.respondWith(
  //   caches.match(event.request).then(function (response) {
  //     return response || fetch(event.request);
  //   })
  // );

  // 正常模式
  if (event.request.url.match(/.html$/)) {
    event.respondWith(
      fetch(event.request)
        .catch(function () {
          return caches.match('/simple/cuowu.jpeg');
        })
    );
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
        return caches.match('/simple/cuowu.jpeg');
      })
    );
  }
});

self.addEventListener('activate', () => {
  console.log('activate');
});

self.onmessage = (ev) => {
  if (ev.data.edit === 'edit') {
    m = !m;
  } else {
    console.log('m->>>>', m);
  }
};
