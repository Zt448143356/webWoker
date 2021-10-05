
class SimpleEvent {
  constructor() {
    this.listenrs = {};
  }

  once(tag, cb) {
    this.listenrs[tag] || (this.listenrs[tag] = []);
    this.listenrs[tag].push(cb);
  }

  trigger(tag, data) {
    this.listenrs[tag] = this.listenrs[tag] || [];
    let listenr;
    // eslint-disable-next-line no-cond-assign
    while (listenr = this.listenrs[tag].shift()) {
      listenr(data);
    }
  }
}

const simpleEvent = new SimpleEvent();

var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
  // '/',
  // '/styles/main.css',
  // '/script/main.js'
  '/sync/google.jpg',
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
        return resp || fetch(event.request);
      }).catch(function () {
        return caches.match('/aaa/cuowu.jpeg');
      })
    );
  }
});

self.addEventListener('activate', () => {
  console.log('activate');
});

self.onmessage = (event) => {
  console.log('onmessage->>>>>', event.data);
  simpleEvent.trigger('postmessage', event.data);
  event.source.postMessage('sw to psge');
};

self.addEventListener('sync', event => {
  console.log('sync!');
  console.log('tag->>>>>>', event.tag);
  if (event.tag === 'button') {
    var request = new Request(`/hello`, {method: 'GET'});
    event.waitUntil(
      fetch(request).then(function (response) {
        console.log(response);
        return response;
      })
    );
  } else if (event.tag === 'postmessage') {
    let msgPromise = new Promise(function (resolve) {
      // 监听message事件中触发的事件通知
      simpleEvent.once('postmessage', function (data) {
        resolve(data);
      });
    });
    event.waitUntil(
      msgPromise.then(function (data) {
        console.log('sync---->>>>', data);
      })
    );
  }
});
