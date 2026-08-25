// Minimal offline cache for a single-file game: everything (game logic,
// sprites, icons) is inlined into index.html as base64, so caching that one
// file (plus this app's icons/manifest) is enough for the whole game to work
// with no network at all.
//
// The document itself (index.html/navigation) is network-first, falling
// back to the cache only when there's genuinely no connectivity. Everything
// else (manifest/icons, rarely if ever changing) stays stale-while-
// revalidate: answered from cache immediately, with a fresh copy fetched in
// the background for next time.
//
// Network-first for the document specifically is a deliberate change from
// an earlier all-stale-while-revalidate version, after a real incident: a
// critical bug fix shipped in index.html, but a player's home-screen PWA
// kept showing the old, broken cached shell no matter how many times they
// relaunched it — over in a plain Safari tab (no PWA, no long-lived service
// worker), the same fix loaded fine immediately. The background
// revalidation a stale-while-revalidate document fetch depends on had
// evidently never once succeeded for that install, with nothing forcing a
// retry — the fix could have been sitting on the server for hours with no
// path back to that PWA's screen. Network-first for the document removes
// that whole failure mode: any time there's connectivity at all, the
// newest index.html is what actually loads, cache is purely the offline
// fallback. index.html's own update-check (see checkForUpdate()) still
// decides *when* to actually reload an already-open tab — this only
// changes what a fresh navigation/launch fetches.
const CACHE_NAME = "knight-wars-v4"; // bumped again — the v3 fetch change caused a fresh white-screen regression and was reverted (see the fetch handler's own note); bumping still purges any existing install's Cache Storage cleanly
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

  if (event.request.mode === "navigate") {
    event.respondWith(
      // REVERTED: tried passing {cache:"reload"} here to force past the
      // browser's own native HTTP cache layer, on the theory that it (not
      // just Cache Storage) was the reason a fresh relaunch of the
      // home-screen icon still showed a stale build. Shipped, and a fresh
      // white screen was reported immediately after — a Request already
      // carrying mode:"navigate" may not accept an overriding cache mode
      // cleanly in every WebKit version, and if fetch() throws
      // *synchronously* rather than rejecting, the .catch() below never
      // even attaches, so event.respondWith() never resolves at all —
      // exactly a blank/white navigation. Reverted rather than risk that
      // twice; the underlying stale-native-cache theory may still be
      // right, but needs a safer way to test it than shipping straight to
      // this exact failure mode again.
      fetch(event.request)
        .then((res) => {
          if (res && res.ok) {
            const resClone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
          }
          return res;
        })
        .catch(() => caches.match(event.request)) // offline — fall back to whatever shell we last cached
    );
    return;
  }

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
