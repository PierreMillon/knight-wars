// FICHIER GÉNÉRÉ — ne pas éditer à la main, toute modification sera écrasée.
// Source : sw.template.js · Générateur : build-sw.js · Contrôlé par : simulate.js
//
// Pourquoi ce fichier est généré, et pourquoi c'est LA correction de fond.
// Le cache hors ligne a été coupé en v1.98 après une série d'écrans noirs,
// blancs et roses. La cause n'était pas le principe du cache : c'était que
// le fichier du worker ne changeait JAMAIS entre deux publications (son
// numéro, "knight-wars-v6", était incrémenté à la main). Un fichier
// identique = le navigateur ne voit aucun worker neuf = le correctif
// n'atteint jamais le téléphone. Incident réel, consigné à l'époque : un
// correctif critique publié, et un joueur qui relance son icône et revoit
// la version cassée.
// Pour compenser ça, l'ancien worker était malin au moment de chaque
// navigation — il faisait courir le réseau contre le cache. C'est CETTE
// astuce qui produisait les écrans noirs : une navigation dont la promesse
// ne se résout jamais, c'est une page blanche sans erreur et sans recours.
//
// Ici l'empreinte ci-dessous change dès que le moindre fichier mis en cache
// change, donc la version se règle toute seule, donc le worker n'a plus
// besoin d'être malin. Sur le chemin normal il est MUET : il répond depuis
// le cache, instantanément, sans courir après rien. Un worker qui ne court
// après rien ne peut pas bloquer une navigation.
const EMPREINTE = "f29178301fa195f0";
const CACHE = "knight-wars-" + EMPREINTE;
const COQUILLE = ["./","./index.html","./manifest.json","./icon-192.png","./icon-512.png"];

// Le SEUL endroit où il reste de la logique de temps : quand il n'y a RIEN
// en cache (toute première visite, ou Safari qui a vidé le cache après 7
// jours sans ouvrir l'app — comportement documenté d'ITP, qu'aucun code ne
// peut empêcher). Ce chemin-là ne peut pas être servi depuis le cache par
// définition, donc il faut bien aller au réseau. Sans plafond, un réseau
// LENT (pas coupé : fetch ne rejette donc jamais) laissait la navigation en
// suspens pour toujours — rapporté en son temps : « écran noir, même après
// 20 secondes ». On rend donc quelque chose sur quoi le joueur peut agir.
const PLAFOND_SANS_CACHE_MS = 8000;
const PAGE_DE_SECOURS = () =>
  new Response(
    `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Knight Wars</title>
    <style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#3d5f80;color:#f2ede2;font-family:Georgia,"Iowan Old Style",Palatino,serif;text-align:center;padding:24px;box-sizing:border-box}
    p{max-width:320px;line-height:1.5}
    button{margin-top:16px;padding:10px 20px;border-radius:10px;border:1.5px solid #e8c468;background:linear-gradient(135deg,#fff3c4,#e8c468,#a97e2a);color:#2b1d10;font-weight:700;font-size:15px}</style></head>
    <body><div><p>La connexion est lente et la page n'arrive pas à charger.</p><button onclick="location.reload()">Réessayer</button></div></body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } }
  );

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(COQUILLE)));
  // skipWaiting + claim sont déconseillés en général : un worker neuf peut
  // servir des morceaux d'une version à une page qui tourne sur une autre.
  // Ici le jeu est UN SEUL fichier, tout est embarqué dedans, il n'existe
  // aucun morceau à désaccorder — donc c'est sans danger, et c'est ce qui
  // fait qu'un correctif arrive dès le lancement suivant au lieu d'attendre
  // que tous les onglets soient fermés.
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cles) => Promise.all(cles.filter((c) => c !== CACHE).map((c) => caches.delete(c))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  // La page vérifie elle-même si le serveur a une version plus récente
  // (checkForUpdate(), avec cache:"no-store"). Sans cette sortie, le worker
  // lui répondrait depuis son propre cache et la vérification comparerait
  // la version à elle-même — elle ne trouverait donc jamais rien.
  if (event.request.cache === "no-store") { event.respondWith(fetch(event.request)); return; }

  if (event.request.mode === "navigate") {
    event.respondWith((async () => {
      // Chemin normal : réponse immédiate, aucune course, aucun délai.
      const enCache = (await caches.match("./index.html")) || (await caches.match(event.request));
      if (enCache) return enCache;
      // Rien en cache : voir PLAFOND_SANS_CACHE_MS.
      const reseau = fetch(event.request).then((r) => {
        if (r && r.ok) { const copie = r.clone(); caches.open(CACHE).then((c) => c.put("./index.html", copie)); }
        return r;
      });
      reseau.catch(() => {}); // évite un rejet non géré si le plafond gagne la course
      const plafond = new Promise((ok) => setTimeout(() => ok(PAGE_DE_SECOURS()), PLAFOND_SANS_CACHE_MS));
      try { return await Promise.race([reseau, plafond]); } catch (e) { return PAGE_DE_SECOURS(); }
    })());
    return;
  }

  // Tout le reste (manifeste, icônes) : le cache d'abord, le réseau sinon.
  event.respondWith(
    caches.match(event.request).then((enCache) => {
      if (enCache) return enCache;
      return fetch(event.request).then((r) => {
        if (r && r.ok) { const copie = r.clone(); caches.open(CACHE).then((c) => c.put(event.request, copie)); }
        return r;
      });
    })
  );
});
