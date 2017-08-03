// serviceWorker 所在的目录即为最大的 scope
// 在 scope 下的文件及这些文件及其加载的文件(如index.html在scope下,但加载了第三方图片)都会被 serviceWorker 缓存
// 故而 serviceWorker 文件一定要在 html 文件的同一个目录或者父级目录中, 否则无法缓存 html 文件, 即会导致无法离线访问!
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v2').then(function(cache) {
      return cache.addAll([
        '/html/test-serviceworker.html',
        '/css/test-manifest.css'
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(caches.match(event.request).then(function(response) {
    if (response !== undefined) {
      return response;
    } else {
      return fetch(event.request).then(function (response) {
        // response may be used only once
        // we need to save clone to put one copy in cache
        // and serve second one
        let responseClone = response.clone();

        caches.open('v2').then(function (cache) {
          cache.put(event.request, responseClone);
        });
        return response;
      }).catch(function (err) {
        console.log(err);
        // return caches.match('/sw-test/gallery/myLittleVader.jpg');
      });
    }
  }));
});
