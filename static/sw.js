// Put cache name and assets in variables
const cache_name = 'robat_cache_v1';
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
    caches.open(cache_name)
      .then(function(cache) {
        // Pass array of files
        return cache.addAll(assets);
      })
  );
});
