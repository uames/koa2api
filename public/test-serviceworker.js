self.addEventListener('install', function(event) {
  console.log("bbbbbbbbbbbbbbbb");
  console.log(event);
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
  console.log("aaaaaaaaaaaaaaaaaaaaaa");
  console.log(event);
  event.respondWith(caches.match(event.request).then(function(response) {
    // caches.match() always resolves
    // but in case of success response will have value

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
