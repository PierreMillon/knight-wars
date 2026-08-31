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
const CACHE_NAME = "knight-wars-v6"; // bumped again — see STALL_TIMEOUT_MS/STALL_RESPONSE's own note (indefinite hang on a slow, uncached first navigation)
const APP_SHELL = ["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png"];
// A cold PWA launch (home-screen icon) is exactly the moment the OS may
// still be waking the radio / resolving DNS — reported live as "s'ouvre sur
// un écran noir puis blanc et c'est tout": the network-first fetch below
// previously had NO timeout at all, so a slow-but-not-actually-failing
// network left the navigation promise unsettled indefinitely, and the
// browser shows nothing but blank white while it waits. NAV_TIMEOUT_MS caps
// how long network gets to win outright before falling back to whatever
// shell is already cached — the network fetch keeps running in the
// background regardless, so the cache still gets refreshed for next time
// even when the timeout wins this one.
const NAV_TIMEOUT_MS = 3000;
// Same idea, for when there's no cached shell at all to race against (see
// the navigate handler's own note) — a much longer ceiling, since here
// there's nothing better to fall back to than a manual-retry page, so it's
// worth genuinely waiting out a slow-but-real connection first.
const STALL_TIMEOUT_MS = 8000;
// A tiny inline fallback page — no dependency on anything cacheable, so it
// always exists regardless of what the real fetch is stuck on. Just enough
// to turn "black/blank tab, seemingly frozen" into "a page that explains
// what happened and offers to try again".
const STALL_RESPONSE = () =>
  new Response(
    `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Knight Wars</title>
    <style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#3d5f80;color:#f2ede2;font-family:Georgia,"Iowan Old Style",Palatino,serif;text-align:center;padding:24px;box-sizing:border-box}
    p{max-width:320px;line-height:1.5}
    button{margin-top:16px;padding:10px 20px;border-radius:10px;border:1.5px solid #e8c468;background:linear-gradient(135deg,#fff3c4,#e8c468,#a97e2a);color:#2b1d10;font-weight:700;font-size:15px}</style></head>
    <body><div><p>La connexion est lente et la page n'arrive pas à charger.</p><button onclick="location.reload()">Réessayer</button></div></body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } }
  );

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

  // index.html's own update-check (checkForUpdate()) deliberately asks for
  // cache:"no-store" so it actually learns whether the *server* has a newer
  // build — but a plain fetch() from the page still passes through this
  // same fetch handler, and the stale-while-revalidate branch below used to
  // ignore that intent completely and answer from Cache Storage anyway,
  // which could make the update check compare against its own stale cached
  // response instead of the live server. Bypass this SW entirely for such a
  // request — straight to network, no caching either way.
  if (event.request.cache === "no-store") {
    event.respondWith(fetch(event.request));
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(
      // REVERTED (still true): tried passing {cache:"reload"} here to force
      // past the browser's own native HTTP cache layer, on the theory that
      // it (not just Cache Storage) was the reason a fresh relaunch of the
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
      (async () => {
        const networkPromise = fetch(event.request).then((res) => {
          if (res && res.ok) {
            const resClone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
          }
          return res;
        });
        // Prevent an "unhandled rejection" once the timeout below wins the
        // race and this promise goes on to fail on its own later — this
        // line registers a handler on the ORIGINAL promise without
        // affecting the reference awaited in the race/fallback below.
        networkPromise.catch(() => {});
        const cached = await caches.match(event.request);
        if (!cached) {
          // Nothing to fall back to yet (no cache for this exact request —
          // first-ever visit, or Safari's ITP quietly evicted Cache Storage
          // after 7 days of no interaction, per its documented behavior).
          // This used to just `return networkPromise` unconditionally,
          // "however long it takes" — but a merely SLOW connection (not a
          // failed one, so fetch() never rejects) then left the navigation
          // promise unsettled forever: reported live as "écran noir, même
          // après 20 secondes", on a device showing a weak signal. Race it
          // against a longer STALL_TIMEOUT_MS too, so a stuck-but-not-dead
          // network still resolves to SOMETHING the user can act on
          // (a manual retry) instead of an indefinite blank/black tab.
          const stall = new Promise((resolve) => setTimeout(() => resolve(STALL_RESPONSE()), STALL_TIMEOUT_MS));
          try {
            return await Promise.race([networkPromise, stall]);
          } catch (e) {
            return STALL_RESPONSE(); // network rejected outright with nothing cached to fall back to
          }
        }
        const timeout = new Promise((resolve) => setTimeout(() => resolve(cached), NAV_TIMEOUT_MS));
        try {
          return await Promise.race([networkPromise, timeout]);
        } catch (e) {
          return cached; // network settled (rejected) before the timeout and lost anyway
        }
      })()
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
