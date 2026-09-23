// Génère sw.js à partir de sw.template.js, en y injectant une empreinte des
// fichiers réellement mis en cache.
//
// C'est LA correction de fond du hors ligne. Le cache a été coupé en v1.98
// parce que le fichier du worker ne changeait jamais d'une publication à
// l'autre : son numéro était incrémenté à la main, et le hand-bumping ne
// survit pas au contact du réel. Un fichier identique = aucun worker neuf
// aux yeux du navigateur = le correctif n'arrive jamais sur le téléphone.
//
// Ici l'empreinte change dès qu'un octet change dans index.html, le
// manifeste ou une icône. Impossible d'oublier : simulate.js régénère et
// REFUSE de passer si le sw.js commité est périmé (voir sa propre note).
//
// Usage : node build-sw.js          → écrit sw.js
//         node build-sw.js --check  → ne touche à rien, sort 1 si périmé
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const RACINE = __dirname;
// Tout ce que la coquille met en cache. Ajouter un fichier ici suffit : il
// entre dans l'empreinte ET dans la liste précachée, sans rien toucher
// d'autre.
const COQUILLE = ["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png"];
// "./" est la même ressource que index.html côté serveur — on ne l'empreinte
// donc pas deux fois.
const A_EMPREINTER = COQUILLE.filter((f) => f !== "./").map((f) => f.replace("./", ""));

function empreinte() {
  const h = crypto.createHash("sha256");
  for (const f of A_EMPREINTER) {
    const p = path.join(RACINE, f);
    if (!fs.existsSync(p)) throw new Error(`build-sw : fichier introuvable dans la coquille — ${f}`);
    h.update(f);                    // le NOM compte aussi : renommer un fichier change l'empreinte
    h.update(fs.readFileSync(p));
  }
  return h.digest("hex").slice(0, 16);
}

function genere() {
  const gabarit = fs.readFileSync(path.join(RACINE, "sw.template.js"), "utf8");
  if (!gabarit.includes("__EMPREINTE__") || !gabarit.includes("__COQUILLE__")) {
    throw new Error("build-sw : le gabarit a perdu un de ses marqueurs (__EMPREINTE__ / __COQUILLE__)");
  }
  return gabarit
    .replace("// GABARIT — ne pas éditer sw.js directement, il est REGÉNÉRÉ.",
             "// FICHIER GÉNÉRÉ — ne pas éditer à la main, toute modification sera écrasée.")
    .replace("__EMPREINTE__", empreinte())
    .replace("__COQUILLE__", JSON.stringify(COQUILLE));
}

const cible = path.join(RACINE, "sw.js");
const attendu = genere();

if (process.argv.includes("--check")) {
  const actuel = fs.existsSync(cible) ? fs.readFileSync(cible, "utf8") : null;
  if (actuel === attendu) { console.log("sw.js : à jour"); process.exit(0); }
  console.error("sw.js est PÉRIMÉ — lancer `node build-sw.js` et committer le résultat.");
  console.error(actuel === null ? "  (sw.js absent)" : "  (l'empreinte ne correspond plus au contenu de la coquille)");
  process.exit(1);
}

fs.writeFileSync(cible, attendu);
console.log("sw.js régénéré — empreinte", empreinte());
