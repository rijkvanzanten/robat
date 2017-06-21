// Put cache name and assets in variables
const cacheName = 'robat_cache_v1';
const assets = [
  '/',
  '/index.js',
  '/style.css',
  '/img/*',
];

/* If all the files are successfully cached, then the service worker will be installed. If any of the files fail to download, then the install step will fail. */

// Handle the install event (install SW)
self.addEventListener('install', function(event) {
  //Perform install steps
  // Check if installation is complete
  event.waitUntil(
    // Open the cache with the cache name
    caches.open(cacheName)
      .then(function(cache) {
        // Pass array of files
        return cache.addAll(assets);
      })
  );
});

/* After a service worker is installed and the user navigates to a different page or refreshes, the service worker will begin to receive fetch events, an example of which is below.*/

// Handle fetch events
self.addEventListener('fetch', function(event) {
  event.respondWith(
    // Look at request and finds cached results
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        // Clone the event
        event.request.clone();

        return fetch(event.request).then(
          function(response) {
            // Check the response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            // Clone the response for browser and the cache
            const responseToCache = response.clone();

            // Cache the request and cloned response
            caches.open(cacheName)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });
            return response;
          }
        );
      })
  );
});

/* Loop through all of the caches in the service worker and deleting any caches that aren't defined in the cache whitelist. */

self.addEventListener('activate', function(event) {
  const whitelist = ['robat_cache_v1'];

  // Check if installation succeeds
  event.waitUntil(
    // Return array of cache keys
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (whitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
