// Minimal offline cache for a single-file game: everything (game logic,
// sprites, icons) is inlined into index.html as base64, so caching that one
// file (plus this app's icons/manifest) is enough for the whole game to work
// with no network at all.
//
// Strategy is stale-while-revalidate: every request is answered from the
// cache immediately if we have it (fast, and works offline), while a fresh
// copy is always fetched in the background and stored for *next* time. This
// deliberately does NOT try to hot-swap the already-running page when a
// newer version lands — index.html's own update-check (see checkForUpdate())
// handles that, reloading only at a natural break point (starting a new
// game) instead of yanking the rug out from under an in-progress match.
const CACHE_NAME = "knight-wars-v1";
const APP_SHELL = ["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request)
        .then((res) => {
          if (res && res.ok) {
            const resClone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
          }
          return res;
        })
        .catch(() => cached); // offline and nothing cached yet — nothing more we can do
      return cached || networkFetch;
    })
  );
});
