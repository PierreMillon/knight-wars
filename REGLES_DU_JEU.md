# Règles du jeu — Knight Wars

Document de référence unique pour toutes les mécaniques de jeu, pour éviter les contradictions entre deux discussions (ex : "3×3 apparitions de la pieuvre" un jour, "juste 3" un autre, "4 après un parchemin" un troisième — vécu, d'où ce document).

**Comment l'utiliser** : avant d'annoncer ou de changer une règle, on se réfère à ce document. La Partie 2 est la source de vérité sur ce qui est RÉELLEMENT implémenté dans `index.html` à un instant donné (vérifiée contre le code, pas contre la mémoire d'une conversation). La Partie 3 est un espace de brouillon pour les idées pas encore tranchées — rien dedans n'est en jeu tant que ce n'est pas remonté en Partie 2 avec un changelog/BACKLOG à l'appui.

---

## Partie 1 — L'esprit des règles

- **Le joueur est un mercenaire**, un général de guerre engagé tour à tour par différentes maisons, pas un membre d'une maison. Ce cadre justifie pourquoi certains acquis (les dieux) suivent le JOUEUR au-delà d'une seule maison, pendant que d'autres restent attachés à la maison elle-même (voir Partie 2 §4).
- **Le hasard n'existe qu'aux marges.** Le combat est presque toujours déterministe (la plus grosse force gagne) — le hasard n'intervient qu'à égalité ou à un écart de 1, et toujours via le PRNG à seed fixe du jeu, jamais `Math.random()` nu : une replay doit reproduire un résultat identique, octet pour octet, à chaque relecture. C'est une contrainte de conception non négociable qui prime sur toute nouvelle mécanique : toute nouveauté doit rester rejouable à l'identique.
- **Chaque bonus a un prix.** Rien n'est un pur cadeau : un avantage permanent s'accompagne toujours d'une contrepartie négative permanente, du même ordre de grandeur. Les bonus se CUMULENT entre eux (jamais l'un n'annule l'autre) — l'intérêt du jeu à son sommet est la complexité qui nait de plusieurs bonus/malus actifs à la fois, pas la simplicité.
- **La curiosité plutôt que l'explication.** Le Lore et les indices (parchemins, easter eggs) doivent laisser deviner les mécaniques plutôt que les expliquer frontalement — les paragraphes de déblocage réels restent la seule explication littérale, réservée à qui a déjà débloqué la chose.
- **Progression cosmétique, pas de pay-to-win.** La monnaie "gueux" et les débllocages narratifs (Lore, Salle des trophées) sont des couches de méta-progression optionnelles ; elles n'ouvrent jamais un mode de triche, seulement du contenu et des bonus obtenus par un vrai exploit en partie.

---

## Partie 2 — Les règles (état actuel du code, v2.11)

### 2.1 Combat
- Chaque territoire a une force entre 1 et 12 (`FORCE_CAP`), affichée sur sa "capitale" (voir §2.6 pour la distinction capitale/village — mécanique PAS encore implémentée, voir Partie 3).
- Résolution (`resolveCombat`) : force égale → 1 chance sur 3 pour l'attaquant ; attaquant à exactement 1 en dessous du défenseur → 1 chance sur 5 ; sinon la plus grosse force gagne automatiquement. Toujours tiré via le PRNG à seed fixe (replay-safe).
- Un défenseur vaincu passe à 1 force sous la bannière de l'attaquant ; l'attaquant retombe à 1 force sur sa propre case de départ.
- Attaques en chaîne (glisser sur plusieurs provinces à la suite) : chaque maillon est un appel indépendant, mais partage certaines décisions de bonus (voir §2.3).

### 2.2 Renfort de fin de tour
- Formule de base par royaume : `max(1, round(1.0 + 1.5×partRelative + hexPossédés/20))`, où `partRelative` compare la plus grande zone connexe du royaume à la moyenne des royaumes encore vivants.
- Modificateurs des dieux (Vulcain -1, Cérès +1 — voir §2.4) s'appliquent ENSUITE, et le total final est planché à 0 (jamais négatif).
- Le renfort est distribué province par province (1 point à la fois) parmi les provinces sous leur plafond de force effectif (voir §2.4 pour Cérès).

### 2.3 « Le pouvoir des 12 » (bénédiction de Mars / Merlin)
- Un royaume dont **toutes** ses provinces sont à 12/12 ("`allProvincesCapped`") active un budget de victoires garanties égal à son nombre de provinces, renouvelé à chaque tour où la condition est encore vraie.
- Ce budget se consomme une victoire garantie par attaque terrestre (jamais en mer — voir §2.5), et se draine UNE SEULE FOIS par chaîne d'attaque entière (pas par maillon).
- 3 activations de ce budget en une seule partie (humain uniquement) débloquent un aperçu ("Merlin" apparaît 2s).
- 3 activations RÉPARTIES SUR 3 PARTIES SÉPARÉES débloquent la bénédiction PERMANENTE de Mars (`marsBlessingUnlocked`) : dès lors, un combat à EXACTEMENT 12 contre 12 en attaque terrestre est TOUJOURS gagné par l'attaquant humain, sans consommer aucun budget — une bénédiction passive, distincte de l'usage actif du pouvoir lui-même.
- Visuel : contour doré vibrant autour des provinces d'un royaume avec le pouvoir actif ; épée noire (au lieu de blanche) sur l'attaque qui en bénéficie.

### 2.4 Les 4 dieux spéciaux
Chaque dieu a une condition de déblocage réelle, vérifiée uniquement sur une VRAIE victoire du joueur humain (jamais en trêve, jamais en reprenant un replay) :

| Dieu | Condition (à réaliser en gagnant, avec N'IMPORTE QUELLE maison) | Bonus permanent | Malus permanent |
|---|---|---|---|
| **Vulcain** | Être redescendu à 1 seule province puis quand même gagner | +1 force en défense | -1 renfort par tour |
| **Bellone** | Gagner sans jamais perdre une seule province | +1 force en attaque | -1 force en défense (partout, pas seulement contre l'attaquant du moment) |
| **Cérès** | Ne jamais éliminer un seul rival avant le tout dernier instant, puis les éliminer TOUS d'un coup avec une seule attaque **en chaîne** qui laisse aussi le joueur maître de **100% de la carte** (barbares inclus) | +1 renfort par tour | Plafond de force abaissé à 11 (jamais 12) — plus jamais éligible au pouvoir des 12 (§2.3) |
| **Neptune** | Gagner sur l'attaque finale elle-même portée par la mer | Traversées en mer -1 force (jamais sous 1) | -1 défense **côtière** — uniquement si l'attaque subie vient elle-même de la mer, pas en défense terrestre normale |

Notes importantes :
- **Historique de la condition Cérès** : deux versions plus faciles ont été essayées et rejetées avant celle-ci, l'une après l'autre, en discussion directe — "70% du territoire à un moment" (trivial : toute victoire finit proche de 100%, donc toujours vrai), puis "70% pendant qu'au moins 2 rivaux vivent" (encore jugé pas assez exigeant). La version retenue exige de garder tout le monde vivant jusqu'au bout puis de tout renverser d'un coup, ce qui est un vrai exploit de timing et d'exécution.
- **Double persistance** : chaque dieu débloqué l'est à la fois pour LA MAISON précise jouée à ce moment (`godUnlockedRoyaume[royId][godIdx]` — reste actif pour cette maison pour toujours, qu'elle soit ensuite jouée par vous ou par l'IA) ET pour LE JOUEUR (`godUnlockedPlayer[godIdx]` — reste actif pour vous quelle que soit la maison choisie ensuite). Logique : le joueur est un mercenaire (Partie 1) — la maison garde l'expérience transmise, le mercenaire garde le savoir-faire.
- **Cumulatif, jamais exclusif** : tous les bonus/malus des 4 dieux se cumulent entre eux et avec toutes les autres mécaniques (pouvoir des 12, Cthulhu). Aucun n'en annule un autre.
- Une IA au palier de difficulté le plus dur (Seigneur) ou à Cthulhu bénéficie de tous les bonus des 4 dieux gratuitement, même non gagnés — "elle connaît déjà tous les trucs".

### 2.5 Attaques en mer et rituel du sacrifice océanique
- Une traversée en mer coûte de la force (calculée par route, jusqu'à `MAX_WATER_CROSSING_HOPS` = 3 cases d'eau) ; si le coût dépasse la force disponible, la traversée échoue entièrement (noyade, aucun combat).
- **Cthulhu actif** (voir §2.6) : coût de traversée nul, distance illimitée.
- **Rituel du sacrifice** : envoyer une province à 12/12 force droit dans une mer ouverte, assez loin pour retomber à 1 (pas via un lac, pas enchaîné à la fin d'une autre conquête ce tour) = un "plein bateau" sacrifié. En dessous de ce seuil exact, on perd quand même la force mais ce n'est qu'une "baignade forcée" (pas de rituel compté).
- **Déblocage de la pieuvre (état actuel du code)** : le rituel complet ne compte que joué en difficulté Seigneur. 3 rituels complets DANS UNE MÊME PARTIE déclenchent la révélation visuelle (l'apparition de la pieuvre, 2s). 3 PARTIES SÉPARÉES avec cette révélation débloquent `pieuvreUnlocked` de façon permanente (icône du menu changée, paragraphe de Lore débloqué).
- **Indice "parchemin crypté"** : entre la 5ᵉ et la 10ᵉ victoire totale (seuil aléatoire tiré une fois), un message de fin de partie annonce qu'un seigneur rival remet un parchemin crypté — un indice, pas un débloquage en soi.
- **Déblocage de Cthulhu (état actuel du code)** : une fois l'indice apparu sur une victoire antérieure, un 4ᵉ rituel complet dans une même partie (un de plus que le 3ᵉ qui révèle la pieuvre) débloque `cthulhuUnlocked` immédiatement, la toute première fois.
- ⚠️ Une simplification de cette dernière règle a été discutée ("juste 3 pieuvres sur une partie, au bout de trois c'est Cthulhu") mais **n'est pas encore implémentée** — voir Partie 3.

### 2.6 Paliers de difficulté
- 4 paliers visibles, du plus facile au plus dur : **Page** (0), **Écuyer** (0.35), **Chevalier** (0.91), **Seigneur** (1.3) — la valeur pilote l'agressivité/force de départ de l'IA.
- **Cthulhu** (1.6) est un 5ᵉ palier caché, débloqué par le rituel ci-dessus : IA parfaite/agressivité maximale, traversées en mer gratuites et sans limite de distance pour TOUS (humain et IA).
- Chaque victoire au palier réellement joué (`gameStartDifficulty`, pas le réglage courant) enregistre un trophée de victoire par palier (`difficultyTierWon[]`), affiché dans la Salle des trophées — Cthulhu exclu de ce suivi (redondant avec son propre déblocage).
- ⚠️ **Capitale vs villages** : le joueur a décrit une mécanique où une province est composée de plusieurs villages, un seul affichant le chiffre de force ("la capitale"), et où un chemin d'attaque doit obligatoirement passer par le village le plus proche d'un adversaire plutôt que capitale à capitale — **PAS ENCORE IMPLÉMENTÉE**, le modèle actuel traite chaque hexagone comme un territoire indépendant sans notion de capitale/village. Voir Partie 3.

### 2.7 Salle des trophées (Le Lore)
17 emplacements, tous toujours visibles à pleine opacité (aucun coffre-mystère, idée essayée puis retirée) — seul l'anneau doré distingue un trophée gagné, et chaque image est bornée à sa case carrée (`object-fit: contain`) quel que soit son format d'origine :
- 4 dieux (Vulcain, Bellone et Page ont leur propre sprite ; Cérès/Neptune encore en emoji placeholder)
- Pieuvre, Cthulhu (sprite dédié), Pouvoir des 12
- 4 victoires par palier de difficulté (Page/Écuyer/Chevalier/Seigneur)
- 4 blasons de famille (même condition/art que `#loreRoyaumesJoues`)
- 1 trophée ultime (symbole yin-yang) : vaincre avec les 4 familles, chacune ayant débloqué les 4 dieux — calculé à la volée (`allRoyaumesFullyBlessed()`), pas persisté séparément.
- 1 Graal, la toute dernière case à débloquer : n'apparaît gagnée qu'une fois les 16 autres emplacements acquis (100% de la salle), calculé à la volée lui aussi.

### 2.8 Sauvegarde automatique et résilience
- La partie en cours est sauvegardée en continu (`saveGameState()`) et reconstruite silencieusement au chargement suivant (`resumeSavedGame()`) si l'app a été fermée en plein match.
- Chaque sauvegarde porte un tampon de version (`savedVersion`) — une sauvegarde écrite par une version antérieure du jeu est rejetée d'office (nouvelle partie relancée) plutôt que rejouée à l'aveugle contre des règles qui ont changé depuis.
- Toute erreur imprévue pendant une reconstruction (ou même au tout premier lancement d'une partie neuve) relance automatiquement une partie fraîche plutôt que de laisser un écran bloqué — **aucune manipulation manuelle (réinstallation, vidage de cache) ne devrait plus jamais être nécessaire** pour ce genre de blocage.

---

## Partie 3 — Pistes à discuter (rien n'est en jeu, rien n'est tranché)

- **Simplifier Cthulhu à "3 rituels en une seule partie"** : abandonner le système actuel à deux étages (pieuvre en 3 parties séparées, puis Cthulhu au 4ᵉ rituel après un indice) au profit d'un seul palier — 3 rituels dans une même partie débloquent directement Cthulhu, la pieuvre n'étant alors que le nom du flourish visuel à chaque offrande. Discuté, pas implémenté (voir §2.5).
- **Malus alternatif pour Neptune** : rejeté l'idée que Cthulhu annule le bonus de Neptune (les bonus doivent se cumuler, jamais s'annuler — voir Partie 1). Piste évoquée en remplacement : une priorité de renfort en zone côtière pour Neptune (écho de l'idée "affinité forêt" ci-dessous) — explicitement non tranchée par l'utilisateur.
- **Système de capacités raciales par couleur** (distinct des 4 dieux) : chaque maison aurait un trait passif propre. Pistes évoquées : bleu (perd moins de force dans l'eau, mais perd les combats à force égale sur terre — formulation à reconfirmer), jaune (+20%/-20% de chance aux combats aléatoires selon le soleil réel/l'heure locale du joueur — **attention** : dépend du temps réel, en tension directe avec la contrainte de déterminisme du replay de la Partie 1, à résoudre avant toute implémentation), vert (affinité forêt : les renforts spawnent en priorité sur les hexagones à ≥1 case de l'eau), rouge (non défini). Barbares : chance qu'un hexagone neutre héberge 1 soldat, façon 1/100.
- **IA qui se ligue ou cible le plus faible** : les royaumes IA pourraient parfois former une alliance informelle contre le royaume le plus fort, ou au contraire s'acharner sur le plus faible. Idée jugée positivement (casse la dynamique "toujours seul contre 3") mais non implémentée.
- **5ᵉ palier "toutes les maisons se liguent"** : une fois les 4 dieux débloqués par le joueur (cumul des 4 bonus), un mode où toutes les maisons rivales s'allient sans pitié contre lui pour compenser sa puissance — idée émergente, à discuter avant tout développement.
- **ARG / recherche externe** : un puzzle qui pousserait à chercher un indice HORS du jeu (code source, communautés type Reddit, recherche historique) — à l'état de brainstorm, terminologie et faisabilité non arrêtées.
- **Chinois sur les boutons clés** : traduire au maximum 10 boutons essentiels (jouer/préparer une partie) en chinois — demandé ("Chinois fais"), en cours.
- **Chemin d'attaque par villages/capitale** (voir §2.6) : le chemin d'une attaque devrait obligatoirement passer par le village d'une province le plus proche d'un adversaire, pas capitale à capitale ; les troupes peuvent être stationnées n'importe où sur la province indépendamment de la position du chiffre de force. Demandé, pas encore conçu ni implémenté — nécessite de repenser le modèle territoire/hexagone actuel.
- **Réinitialisation complète de la progression** + choix d'une maison fétiche, avec un bonus cachée pour qui débloque tout avec toutes les maisons — idée "éventuelle", non ferme.
- **Grille de collection façon cartes à collectionner** dans le Lore — en partie déjà réalisée par la Salle des trophées (§2.7), mais l'idée d'origine (cases vides pour tout ce qu'on n'a jamais vu, curiosité/chasse au trésor) pourrait aller plus loin.
- **Graphique de fin de partie (idée d'ambiance, pas encore conçue)** : un écran de fin montrant le joueur/le royaume vainqueur de dos, regardant paisiblement l'horizon — des collines en perspective (écho voulu du fait que le rendu du jeu ressemble déjà à des montagnes vues de haut), le soleil couchant/levant teintant différemment les arbres, le sang et les villes selon la distance. Purement descriptif pour l'instant, à concevoir avant toute implémentation (quel déclencheur, quelle durée, remplace ou complète le winbanner actuel ?).
