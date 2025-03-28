const CACHE_NAME = "photoFolio-cache-v4";
const urlsToCache = [
    "/",
    "/index.html",
    "/styles.css",
    "/manifest.json",
    "/service-worker.js",  
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css",
    "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"
];

// Install event - Cache static assets
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Opened cache and adding assets...");
            return cache.addAll(urlsToCache);
        })
    );
});

// Fetch event - Cache external images dynamically
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).then((fetchResponse) => {
                let requestUrl = event.request.url;

                // Cache only images (JPG, PNG, etc.)
                if (requestUrl.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, fetchResponse.clone());
                        return fetchResponse;
                    });
                }

                return fetchResponse;
            });
        })
    );
});

// Activate event - Cleanup old caches
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log("Deleting old cache:", cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});
