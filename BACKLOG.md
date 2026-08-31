# Backlog brut (liste originale de l'utilisateur, verbatim)

Copié tel quel pour suivi. Statut ajouté en préfixe au fur et à mesure :
`[x]` fait, `[ ]` pas fait, `[~]` fait partiellement / à vérifier.

---

[x] Depuis le menu, cliquer sur la zone en haut de map fait retourner à la map.

[x] Ajoute un bouton carte précédente quand on génère aléatoirement trop vite.

[x] Préciser au piano les accord de chaque animation pour éviter les notes trop aiguës (superseded par la refonte gamme-par-royaume : racines en registre médium D4/C#4/C4, chime de renfort déjà baissé d'une octave après un retour "shrill/piercing" — plus de notes aiguës en pratique)

[x] Supprime les options du menu pour régler les stats par … (déjà fait plus tôt — voir changelog v1.4x "Retiré « Nouvelle guerre » et le tri des stats des réglages", vérifié : plus aucune option de tri dans le menu)

[x] Graphique de fin déplace en haut les chiffre de territoire. Ajout en dessous du graphique même chose pour les nombre de soldat

[~] Sur safari la page charge mais après plusieurs dizaines de secondes (probablement déjà amélioré par les correctifs PWA/service-worker faits depuis — pas de Safari réel pour re-tester ici, à confirmer)
Firefox focus direct chargement

[ ] On prévois de regarder une pub de 30 scd pour débloquer pendant 24h le mode très difficile et/ou les grandes maps. Explication dans les astuces.
[ ] Ou bien acheter 2€ pour les retirer à vie.
(nécessite une vraie décision produit + intégration pub/paiement — à trancher avec Pierre avant implémentation, pas fait cette fois)

[x] Au replay, on entoure tout le territoire en dorée o arrête d'entourer les province. Une seule limite pour tout le territoire. (drawRoyaumeOutline, fait plus tôt)

[x] Au replay on laisse mon territoire visible seul tant que je pas clique sur play (fait pour de vrai maintenant : tenu par replayPaused, plus une limite fixe de 1.5s). On retire les bruitages d'ajout de soldats durant replay (fait). On retire les épées du replay (fait — décision inversée une dernière fois, "enlève les épées et bateaux" du replay, plus récente que le "NON" explicite d'avant).

[x] Quand replay fini, on reste sur l'image de fin. Pas de retour au écran de fin. (revealFinalBoard() réutilisé — même état que le swipe sur l'écran de fin)

[~] Au lieu de diviser par feu l'ajout de force par rapport à la taille du royaume on divise par 1,5 maintenant. (la formule actuelle a été retravaillée depuis : `1.0 + 1.5×part_relative + bonus_absolu`, arrondi — le coefficient 1,5 y est déjà, mais pas comme une simple division ; rejouée plusieurs fois en équilibrage, pas retouchée cette fois)

[x] Vitesse du replay ralentit de 30% (déjà fait — REPLAY_STEP_MS = 65, commenté "slowed another 30% per live feedback")

[~] Inconsistance entre même taille de royaumes et des fois 3 renfort des fois 4 ?? (probablement pas un bug : la formule dépend de `avgHexShare` qui change à chaque élimination adverse, et Math.round() peut faire basculer 3↔4 pour une différence d'une case — deux royaumes de même taille au MÊME tour donnent le même chiffre, vérifié dans le code)

[x] Impossible de rejoindre par la mer des provinces proches côtières ??

[x] Replay à invente un partie :( — reproduit et corrigé en direct (v1.73) : le bug réel n'était PAS le mécanisme de replay lui-même (vérifié déterministe, flux RNG identique sur 1577 appels entre une partie réelle et son propre replay), mais l'encodage du lien de partage qui n'avait aucun cas pour un sacrifice à l'océan — un tel coup partait en "attaque" avec origine/destination undefined, cassant tout le reste du replay partagé. Voir la note détaillée dans "Fait en direct" plus bas.

[x] Affichage dans le replay de (nous) après le nom dans les stats et aussi durant la partie.

[x] Ne pas afficher au replay les infos du type « baignade forcée »

Si on appuie sur accéléré les combat ça ajout un son de cloche type glas que je fournirai moi

Sur safari privée tout chargé bien et pas safari normal gros bug d'affichage.

[~] Prépare version anglaise, chinoise et espagnole et allemande avec option dans les menu clair avec un drapeau et la langue pour trouver si on parle pas français. Switcher direct en anglais à la première ouverture sauf si tu sais reconnaître la langue de l'utilisateur. (démarré en petit exprès sur demande directe : "fais l'anglais en premier maintenant juste pour les boutons de jeu utiles au minimum" — toggle FR/EN dans Réglages, juste les boutons d'action du jeu (Fin de bataille, Changer la carte, écran de fin...). Reste à faire : chinois/espagnol/allemand, sélecteur avec drapeau, auto-détection de langue, traduction du lore/des textes de combat.)

[x] Les boutons du replay doivent entrer sur une seul ligne en bas. Part belle a la carte ! (doublon — voir ligne 111 plus bas, déjà fait)

On rajoute option tour immédiat pour aller encore plus vite dans les options. Éventuellement avec un pub plus tard Retien le

[x] Je suis passé par la mer et l'IA a calculé une chemin absurde trop long au lieu du plus court et j'ai tout perdu ! (corrigé — computeWaterRoutes() priorise maintenant le nombre de cases avant le coût en force)

[x] J'ai appuyé par erreur sur le bouton abandonner. On me déplace dans le menu.

On déplace le compteur de gueux bonus à côté des stats en direct. Et on fait que le bouton tour suivant occupe la largeur de l'écran.

Sur ordi, agrandi dynamiquement les cases de jeu pour occupe autant d'écran relativement au téléphone.

[x] Un double clic rapide sur prochaine bataille affiche direct le tour suivant y'a une latence pour l'instant. (double-tap sur « Fin de bataille » déclenche forceInstantSkip, saute la pause de renfort + le rythme de l'IA)

Quand on tue le dernier village pour gagner, on va ajoute une seconde d'animation en plus, tout le territoire gagné est entouré de la limite dorée avec un son que je fournis.

[~] Replay on enlève les bruits de bataille et d'épées. (épées visuelles retirées ; les sons de réussite/échec de combat ont finalement été redemandés et remis en direct plus tard, décision plus récente — voir "Fait en direct")

Firefox replay j'ai repris depuis un moment et ça fait rien quand je clique sur prochaine bataille ça reste figé à la guerre fait rage

[x] Quand les batailles sont trop longues faut ajouter une option de proposer le status quo. Je propose que si on clique sur la tête de morte on ai le choix entre offrir la trêve/paix et se rendre. Si on fait la paix on gagne un gueux par pays restant. (proposePeace() — le clic sur la tête de mort ouvre maintenant Annuler/Proposer la paix/Abandonner)

[x] Chaque pays a un son différent pour les attaques réussis composé d'un accord de deux notes que je préciserai. (superseded : gamme par royaume au lieu d'un accord fixe, décision explicite plus tard)

[x] Le nombres de villages gagné affiche float reste deux fois plus longtemps (OUTCOME_FADE_MS séparé de NUMBER_FADE_MS, propre au cercle+label +N/-N villages)

[x] Plus aucun ennemi ne conteste Millon de Châteauvieux. Gravez ce jour dans la pierre, puis reprenez l'épée - la conquête ne s'arrête jamais. Devient « Plus aucun ennemi ne conteste Millon de Châteauvieux. De joie vous plantez votre épée dans la pierre. Impossible de la retirer, vous en prenez une sur un cadavre défiguré en riant. »

[x] Attaque vitesse augmentée de 20%

[x] Avant les 12vs12, on va ajouter quand il y a égalité 1/3 de chance de gagner. Et à une force de moins 1/5

[x] L'affichage du tuto se positionne en haut à gauche de l'écran. Sinon appuie dessus ça part.

[x] Ajout message d'abandon à faire tourner « L'échec. Vous êtes à peine reconnaissable avec votre barbe mitée et vos lambeaux sales. Vous me faites honte. Je préfère travailler pour un winner qui parie sur des cryptomonnaies. À Dieu l'bouseux » (déjà présent dans SURRENDER_LINES, rotation par seed sur 2 messages)

[x] Phrase suivante des noyés « Du rhum, des femmes ! Et du cidre nom de Zeus ! » puis « glouglouglou… »

[x] Si j'ai deux soldats et que je traverse l'eau pour attaquer un barbare. Pour l'instant ça fonctionne. Mais ça devrait pas. Je perd deux forces phrase « plouf ! » et j'arrive avec 0 dont je devrais pas conquérir. (déjà corrigé — attack() : `from.force - waterCost <= 0` = échec automatique, noyade)

[x] Sinon attaque avec 1 et qu'on perd. Le territoire perdu devient aux barbares. (attack() : si attackingForce===1 et défaite, le territoire d'origine défecte vers les barbares — seulement atteignable via une traversée maritime qui laisse exactement 1 force à l'arrivée)

Réflexion à avoir, quand une Provence a atteint le maximum c'est-à-dire 12 soldats. Es pas une logique de ces 12 soldats puisqu'en fait c'est dégueu. En fait le surplus bah il a envoyé dans les provinces limitrophes ennemi et peut-être que pour un des royaumes il préfère se suicider et ils vont dans l'eau.

[x] Il faut mettre en place le fait que ennemis attaquent par l'eau

[x] Au niveau difficile les ennemis n'attaquent jamais quand il vont perdre la bataille.

[x] Message additionnel à faire tourner pour refuser la trêve « Foutreboule ! Mais que nenni grand lâche de tes morts ! Retourne chez ta mère et laisse les adulte se charcuter en paix, vilain ! (déjà présent dans CONTINUE_SIEGE_QUOTES, rotation par seed)

[x] Si on laisse une Provence avec un soldat seulement à côté d'une province de barbare, au bout de trois ou bien cinq tours entre les deux au hasard, la province, avec un seul soldat se sent délaissé et ses défection et devient barbare (checkLoneDefections(), une fois par tour, seuil aléatoire 3-5 via rngFloat — déterministe pour le replay)

[x] Si j'attaque une Province et qu'elle est connecté par la terre, entre le choix d'attaquer par l'eau si c'est possible et terre c'est toujours la terre quinest privilégié.

[x] Le chemin d'attaque doit passer par le chemin le plus court. (re-signalé en direct : le vrai bug était que computeWaterRoutes() minimisait le coût en force, pas le nombre de cases — corrigé, priorité au nombre de cases d'abord)

[x] Le chemin d'attaque doit passer par les villages d'une province les plus proche. Il suffit de passer par un village collé à un adversaire pour attaquer. On n'attaque pas de capital en capitale, la capitale étant l'endroit où les chiffres des troupes est écrit. Les troupes peuvent être stationnées n'importe où sur une province dans le lore indépendamment de la position du chiffre des troupes.

[x] Le bouton de tête de mort pour abandonner doit disparaître de l'écran de replay. Pas utile

[x] Replay, on enlève le texte et remplace par un symbole approprié le pause/play et le stop/retour a écran de fin de partie précédent. Le bouton reprendre depuis ici est sans icône maintenant. Tous les boutons doivent entrer sur la même ligne en bas alignés.

[x] En mode difficile, par d'exemple les plus forts n'attaquant trop loin au risque de se mettre en faiblesse pour le tour suivant tu vois ?

Réglage niveau par essais. 1 on gagne tout le temps même en faisant des erreurs c'est pour les enfants de 3 ans. 2 il faut réfléchir et l'ordi attaque 1/3 du temps avec les attaques parfaites. 3 l'Ia attaquer 4/5 du temps avec les attaques parfaite 1/5 mouvement/attque/decision neutre. 4 elle attauqe 15/16 du temps parfait et 1/16 neutre. Quand je parle d'attaque ici ça veut dire n'importe quel choix durant le tour à faire. Imaginons que pourrait émerger un suicide dans l'eau volontaire pour créer une faille et ensuite en profiter ? Tout est possible on cherche avec des règles simples des complexités ouf ok ? Le niveau 4 doit être sans pitié prêt à tout pour gagner plus vite ou de manière sûre. Tous les joueurs ont la même envie y'a plus de caractère mous et hésitant. MAIS SI on joue tout parfait alors on peut espérer égalité (50% du temps) ou parfois gagner 30%. Donc il reste 20% (environ à 10% près) de quand même perdre en faisant tout parfait.

[x] Les phrases de noyade : si on en voit moins que le max, « Quitte à sacrifier des hommes, autant en envoyer un plein bateau sire ! Un sacrifice humain comme les barbares, pourquoi pas ? » (ajouté à FORCED_SWIM_LINES, rotation par seed) et quand ils ont envoyé trois bateau plein dans la même partie ça affiche le poulpe que je te donnerai en image. Et quand on débloque trois poulpes sur trois parties différents ça enclenche la nouvelle icône de PWA avec le même poulpe. (déjà fait plus tôt — ritualCountThisMatch/recordOctopusRevealAndCheckUnlock)

[x] Le gueux est toujours active. On enlève option menu. Sur l'icône on laisse que le chiffre qui est à 0 au début puis incrémenté en fonction des règles. Rappelle les moi. Abandonner fais perdre un gueux au fait.

Système de capacités spéciale légères. Les perdent deux fois mon s de force dans l'eau mais perdent chaque combat à force egale sur terre. Les jaunes ont un bonus de +20% de chance de gagner les combat avec hasard quand il fait soleil adaptée au vrai soleil et la zone du joueur et -20% la nuit réelle. Les verts ont une. Affinité avec les forêts soient les zones éloignées au moins d'une case de l'eau, leurs soldats spawnent toujours en priorité en forêt. Et les rouges je sais pas. Et les barbares doivent avoir 1 soldat quelque part sur la map des fois style 1/100.

L'écran blanc PWA est revenu… après que j'ai fermé la fenêtre.

[x] Sur ordi Mac Firefox écran 1680x1050 Catalina version 10.15.8 (Retien ça écris le en privé) mon adversaire a ses troupe qui apparaissent au même village 5 fois de suite c'est pas random assez

[x] Le bouton accéléré bataille a juste ça maintenant. On supprime « la bataille fait rage ».

[x] Le texte d'offrande cans l'eau doit durer deux fois plus longtemps

Écrire 100 phrases à la main drôle si les joueurs continuent de jeter leurs soldats. On randomisé après la phrase sur le rhum et gta VI. Je te donnerai les phrases.

[x] Curseur pour le volume du son qui devient « bruitage » (soundVolumeSlider 0-100, remplace le toggle on/off, persisté)

On ajoute une musique que je te fournirai et un curseur de volume aussi.

[x] On retire le bouton « on abandonne nouvelle guerre » du menu.

[x] Taille police difficulté et taille de carte doivent s'adapter à leurs cadres. Les cadres peuvent s'étirer en largeur pour s'accommoder mais tout reste sur une seule ligne. L'escarmouche devient bras de fer. Le 2 et 3 deviennent « Raid » et « Massacre »

[x] Réduction de moitié de l'espace sur les bords du contenue des menus et de la page de fin de partie (.box padding 22px 24px → 11px 12px, partagé par tous les menus/overlays)

[x] Essayer une version avec du brouillard comme aoe I (v1.76, réglage expérimental désactivé par défaut — voir la note détaillée plus bas)

[x] J'ai traversé avec deux soldats 3 zones déjà pour attaquer une île barbare et malgré les -2 à chaque case j'ai gagné. Corrigé.

[x] Bouton options pour activer les cercles d'animation. Ils passent proportionnel à l'ajout du nombre de soldat en taille. (toggle showReinforcePulse dans Réglages ; rayon du cercle = 20 + min(N,8)×2)

Une île isolée de barbare peut être inateignable. Ça reste dans le lore. Sauf du coup par la tribu qui a moins de pénalité dans l'eau. Et peut-être que débloquer la pieuvre donne au joueur une abilite spéciale. Pour les bleus aucun dégâts dans l'eau. Les autre son va y réfléchir.

[x] Le compteur des 12 offrandes n'est pas réinitialisé par des offre bases inférieur « plouf ». Il faut 3 par partie point. (déjà correct — ritualCountThisMatch n'incrémente que dans la branche isRitual, jamais sur un "plouf" partiel)
J'ai l'impression le 28 août 16:00 que le 2 difficulté est plus dur que le niveau 4

Les adversaires devraient parfois tendance se liguer officieusement contre le plus gros. Ou bien attaquer le plus faible. T'en dis quoi ?

[~] En niveau j'ai un adversaire à 12 qui n'attaque pas une suite de 7 province adversité c'est absurde (l'IA enchaîne maintenant ses attaques depuis le territoire juste conquis au lieu de repartir d'ailleurs à chaque tour — "quand les ennemis peuvent faire des attaques chaînées, ils le font" ; devrait largement corriger le symptôme, à confirmer en jeu réel)

Quand on a 12 dans chaque province on affiche le contour de tout le royaume de sa couleur en doré qui vibre lentement comme s'ils étaient chaud pour le combat. Et ça active une attaque spéciale qui donne une seule attaque non arrêtable peu importe la longueur et l'eau ou pas. Ça tue tout sur le passage

Les ennemis devraient-ils favoriser attaque longue? Plus grand territoire gagné ? Détruire le max de force ennemis en attaquant ? Peut-être un caractère par seigneur puis à difficulté max tous appliqué la meilleur stratégie ?

Pour le replay et peut-être en jeu aussi faudrait que l'animation de conquête changement couleur d'une capture d'une province se fasse village par village rapidement mais pas en meme temps depuis l'endroit où l'attaque a été portée. Comme une vraie conquête bout par bout. Ça serait grave satisfaisant pour le replay. Plus organique.

Lapp PWA fonctionne maintenant. Improbable.

Elle marche plus samedi 29 août PWA juste sur Firefox focus

[~] Prévoir le jeu comme basique et hyper accessible. Et ajouter des level de difficulté supplémentaire cachés comme Cthulhu et le pouvoir des 12 (Merlin s'active quand toutes les provinces sont à fond par exemple pour le lore) comme ça y'a deus jeux. Celui qu'on joue comme ça. Et celui des hard tryers qui complètent tout et accèdent à un jeu beaucoup plus technique et exigeant que les noobs pourraient pas réussir du tout. Chtulhu active les attaques longue distanc sans perte. Donc faut retenir chaque spécificités des seigneurs et s'adapter. Y'a des stats qui s'affichent en plus sont désactivables en menu comme au début, pourcentage de la carte conquise, pourcentage de complétion du total max de force par royaume. Le brouillard de découverte. Le mode exploration avec un seigneur choisi de force et un brouillard de découverte et de combat. On perd la vision des forces sur une province perdue mais on garde sa vision géographique. Comme un idle game qui ajoute complexité et boutons au fur et à mesure
  — Cthulhu lui-même est fait (v1.72) : 5e palier caché (plus dur que Seigneur, 0 mistake IA), attaques par mer gratuites et illimitées en distance (waterCostBetween()/canAffordWaterRoute() renvoient 0/true quand cthulhuActive()), bouton de difficulté caché tant que non débloqué. "Le pouvoir des 12 (Merlin)" fait aussi (v1.75, voir sa propre note). Stats optionnelles faites (v1.73). Brouillard de guerre fait en version de base (v1.76, réglage expérimental, affichage seulement — voir sa propre note ci-dessous). RESTE À FAIRE : le "mode exploration avec un seigneur choisi de force" — un mode de jeu à part entière (pas juste un réglage d'affichage), pas commencé.

[~] Pour le sacrifice aux océans de Chtulhu mettre avant de le débloquer une piste subtile à gagner aléatoirement entre 5 et 10 victoires en gagnât une partie avec un message de fin d'écran du type : « Le Seigneur xxx vous remet un parchemin crypté, persuadé de vous donner un secret crucial sur les mystères de l'océan… » puis quand on débloque Chtulhu alors le lore explique l'histoire et les astuces explique comment on oeut utiliser le pouvoir. Préparer d'autres messages mystères type chasse au trésor. Les mises à jour garde les infos des joueur ou pas. Ça peut faire partie du challenge de tout recommencer à zéro régulièrement mais avec plus d'expérience ? En mode jeu pour les initiés qui donne accès à un lore méga riche.
  — Fait (v1.72), avec un choix de conception explicite pris seul faute de précision dans la demande : le parchemin est un indice qui NE débloque PAS Cthulhu à lui seul (confirmé en direct) — il faut ensuite, dans une partie où l'indice est déjà apparu, faire un 4e sacrifice océan complet (12 force, une case de plus que le 3e qui révèle déjà la pieuvre) en une seule partie, à Seigneur. Réutilise le mécanisme de la pieuvre (ritualCountThisMatch) plutôt que d'inventer un nouveau système. Pas de nouvelle image dessinée pour Cthulhu — réutilise le sprite pieuvre inversé/assombri en CSS/canvas filter, faute d'art fourni. Les "autres messages mystères type chasse au trésor" ne sont pas faits (un seul indice existe pour l'instant).

Quelles phrases manquent actuellement que je les écrivent ?

[x] La pieuvre bonus s'active si on envoie les trois bateaux pleins au niveau difficile seulement.

---

## Idées données en direct (pas dans le paste original ci-dessus)

- [ ] Chaque royaume peut, via un easter egg, débloquer un dieu spécial avec des capacités spéciales. Actives pour le joueur uniquement, sauf en mode le plus dur — ou quand débloqué pour un seigneur, actif qu'on le joue ou qu'il soit adversaire.
- [x] "Bonus de 12" / Merlin (v1.75) : le contour doré pulsant refait maintenant le plein d'un budget d'attaques garanties (autant que de provinces possédées) au début du tour, tant que toutes les provinces sont au max — épée simple → double épée pendant qu'il est utilisé. 3 activations dans la même partie déclenche une révélation (double épée croisée) ; 3 parties séparées avec révélation débloquent en permanence l'icône réglages en double épée + la bénédiction de Mars (12 vs 12 toujours gagné, sans consommer le budget). Désavantage volontairement laissé de côté, comme demandé.
- [x] Contour du royaume au début du replay doit entourer toute la zone d'une seule traite (pas province par province), sauf si les provinces sont physiquement séparées.

## Fait en direct (hors paste original), pour référence

Sound (gamme par royaume), épée/bateau taille + alignement, portée d'attaque mer, bug bateau décalé, icônes difficulté (avec le bon jeu d'images pixel art), horloge stats (fond blanc + formule corrigée), replay masque stats, confirmation abandon stylée, tuto qui reste bloqué + position haut-gauche + clic pour fermer, règle de hasard combat (1/3, 1/5), IA attaque par bateau, bruitage reload carte, bouton carte précédente, boutons replay icônes seules sur une ligne, pieuvre (mécanique + image corrigée), police du titre (Trattatello + repli MedievalSharp), bouton accélérer bataille = épée seule.

- [x] Chemin d'attaque par mer : vrai plus court chemin (priorité au nombre de cases, coût en force en second) — corrige aussi le "trait mega long sans rapport avec mes forces".
- [x] Épées de combat : encore -20% (après le -30% précédent).
- [x] Chiffres de force mal centrés dans leur hexagone (bug de centrage canvas sur les glyphes asymétriques comme "1") — recentrés sur la vraie boîte englobante du texte.
- [x] "Jouer depuis là" en replay pouvait retomber sur une partie gameOver/trêve déjà terminée, donc injouable — réinitialisé au fork.
- [x] Bruitage d'attaque par mer : même son qu'une attaque normale, filtré (passe-bas) + léger écho/réverbération sous-marine.
- [x] Enregistrement du graphique de fin : message de confirmation à l'enregistrement/partage ; retrait du titre du partage iOS (probable cause de l'icône générique dans le menu de partage).
- [x] Abandon : coûte déjà 1 gueux et c'est déjà écrit dans le texte de fin ("Vous perdez un gueux.") — vérifié, déjà en place, rien à faire.
- [ ] Bouton abandonner/gueux "pas visibles avant de choisir un camp" — non reproduit en test (portrait, avec et sans historique de reroll) ; probablement lié à un device/orientation précis, à re-signaler avec un screenshot si ça persiste.
- [x] "Super pouvoir des 12" — construit (v1.75), voir la note détaillée plus haut sur cette même idée.
- [x] Quand le joueur perd (éliminé), écran de fin immédiat — la partie ne continuait pas jusque-là entre les IA survivantes, avec une trêve qui pouvait tomber sur un spectateur déjà éliminé.
- [x] IA : enchaîne les attaques depuis le territoire juste conquis avant d'envisager un autre front ("quand les ennemis peuvent faire des attaques chaînées, ils le font").
- [x] Horloges des stats : retrait du contour noir, remplacé par deux aiguilles de montre (une fixe, une qui suit la progression) qui se rejoignent et disparaissent à 100%.
- [x] Taille de carte découplée du nombre d'adversaires — une taille donnée fait toujours la même taille totale, les places libres deviennent barbares.
- [x] Replay : retrait épées/bateaux, contour doré tenu tant que non lancé (replayPaused), sons de combat réussite/échec ajoutés, pieuvre visible si apparue dans la partie originale.
- [x] Retrait des mentions "s'applique à la prochaine guerre" dans le menu réglages (taille de carte, nombre d'adversaires).
- [ ] "J'ai gagné beaucoup trop facilement en niveau 4" — tuning en cours, la correction du chaînage IA devrait aider ; pas de rééquilibrage dédié fait cette fois (le système de paliers de probabilité exacts reste un chantier séparé, plus large).
- [x] Inversé la position des boutons "Nouvelle partie aléatoire" et "Partager ma victoire" sur l'écran de fin.
- [x] Graphique de fin : chiffres de territoire déplacés en haut du graphique, nombres de soldat (force) ajoutés en dessous — le panneau Force retiré du graphique (tâche #37) revient sous cette forme simple, pas comme bande empilée.
- [x] Niveau de difficulté caché Cthulhu (v1.72/1.73) : 5e palier plus dur que Seigneur (IA parfaite, agressivité max), attaques par mer gratuites/illimitées en distance pour tous. Déblocage : indice aléatoire ("parchemin crypté") entre la 5e et 10e victoire, puis un 4e sacrifice océan complet en une partie (Seigneur) après l'indice. Pas de nouvel art dessiné — réutilise le sprite pieuvre inversé. Voir aussi la note plus haut sur ce paragraphe original pour ce qui reste (stats optionnelles ✅ faites séparément ci-dessous, brouillard de guerre/mode exploration toujours pas faits).
- [x] Chemin plus court par mer : ajouté un critère de départage supplémentaire (rectitude par rapport à la pieuvre — pardon, à la ligne droite entre les deux territoires) quand plusieurs routes font exactement le même nombre de cases ET le même coût — avant, le premier trouvé gagnait arbitrairement, ce qui pouvait lire comme un détour.
- [x] Horloges des stats : les deux aiguilles pointaient à 180° de leur bonne position (le repos de l'élément est à 6h, le camembert commence à midi) — corrigé.
- [x] Stats optionnelles par royaume (% carte conquise, % de la force max théorique) — case à cocher dans les réglages, activée par défaut.
- [x] Bug de partage : un lien de partage contenant un sacrifice à l'océan cassait tout le reste du replay partagé (encodage manquant pour ce type de coup, retombait sur un "attack" avec origine/destination undefined). Corrigé. Vérifié séparément (harnais jetable, pas commité) que le mécanisme replay = seed + liste de coups est lui-même bien déterministe (flux RNG identique entre une partie réelle et son propre replay local, sur 1577 appels) — ce n'était donc pas un problème de fond, juste ce trou précis dans l'encodage de partage.
- [x] Doublé la différence de taille des cercles d'animation de renfort selon le nombre de soldats ajoutés.
- [x] Fenêtre du double-tap "Fin de bataille" pour l'accélération instantanée élargie (400ms → 600ms).
- [x] Son coupé sur Safari après changement de fenêtre/appli et retour — le hack silencieux qui garde la page dans la catégorie audio "playback" (exempte du bouton silencieux physique) ne se relançait qu'une fois ; il se relance maintenant sur visibilitychange/pageshow/focus.
- [x] "Même situation qu'avant" (v1.84) : le son restait coupé malgré le correctif ci-dessus — visibilitychange/pageshow/focus ne sont PAS de vrais gestes utilisateur, et iOS peut rejeter silencieusement un .play() hors d'un vrai geste (l'erreur était avalée par le .catch() existant). Le tout premier toucher réel après le retour relance maintenant aussi la boucle silencieuse (en plus des trois écouteurs existants), ce qui réussit là où les tentatives passives pouvaient échouer.
- [x] "Pouvoir des 12" / Merlin (v1.75) — voir la note détaillée juste au-dessus, dans le paragraphe original sur Cthulhu.
- [x] Brouillard de guerre expérimental (v1.76) — réglage désactivé par défaut. Choix de conception faits en direct (confirmés par questions) : uniquement l'affichage change (l'IA garde tout son fonctionnement interne inchangé, aucun risque de casser son réglage existant) ; seul le CHIFFRE de force est caché, la couleur du propriétaire et la forme géographique restent toujours visibles ; type "brouillard AoE classique" et non ligne de vue stricte — une province devient "explorée" dès qu'elle borde une de tes provinces (ou que tu la possèdes), et reste ensuite affichée pour toujours mais avec son DERNIER chiffre connu (grisé), pas forcément le vrai chiffre actuel, si tu n'es plus à proximité. Portée limitée à l'adjacence par terre pour cette première version (pas de vision par mer). Le "mode exploration avec un seigneur choisi de force" reste un chantier séparé, plus gros (un vrai mode de jeu, pas juste ce réglage d'affichage).
- [x] Brouillard de guerre (v1.77) : ajouté un vrai voile visuel (assombrissement des cases hors de vue) — le chiffre manquant seul avait été signalé comme un "bug d'affichage" avant d'être identifié comme le réglage lui-même, activé par erreur/curiosité.
- [x] Stats optionnelles (% carte, % force) supprimées (v1.77) — se superposaient au titre du jeu en haut de l'écran sur un vrai device (confirmé par capture d'écran). Retrait complet (CSS, case à cocher, calcul, affichage), pas juste masqué.
- [x] Enregistrement/partage du graphique de fin (v1.77) : aperçu de l'image affiché dans un encart avant de choisir "Partager" ou "Fermer" — corrige l'icône générique (pas de vraie miniature) du menu de partage iOS, en gardant l'appel à `navigator.share()` bien synchrone dans le clic du bouton "Partager" pour rester un vrai geste utilisateur aux yeux de Safari.
- [x] IA : ne fait plus d'attaques mathématiquement perdues d'avance (v1.78) — un plancher (`MIN_VIABLE_ADV`) empêche désormais l'IA d'attaquer avec un désavantage pire que -1 (seul cas avec une vraie chance, 1/5), même quand le seuil d'agressivité de la difficulté l'y aurait autorisée.
- [x] IA : utilise maintenant son "pouvoir des 12" actif pour attaquer sans retenue tant que le budget d'attaques garanties n'est pas épuisé (v1.78) — corrige "l'adversaire a 12 partout et n'en profite pas".
- [x] Graphique de fin (v1.78) : les légendes "Territoire"/"Force" disparaissent pendant le survol/scrub tactile pour laisser voir les chiffres en dessous.
- [x] Renommages (v1.78) : difficulté "Page" → "Gueux", taille de carte "Bras de fer" → "Joute".
- [x] Bouton retour (‹) des pages Conseils et Lore mal centré (v1.79) : rendait un ovale ~70×30 au lieu d'un rond 30×30 — conflit de spécificité CSS avec une règle de bouton partagée plus tardive dans la feuille de style, avec exactement la même spécificité ; corrigé en requalifiant les deux sélecteurs avec l'ID de leur overlay parent.
- [x] Les encarts village/province/royaume/pays (page Conseils) occupent maintenant toute la largeur de la page (v1.79) — retrait des marges progressives qui les indentaient en escalier.
- [x] Conseils simplifiés pour un joueur qui découvre le jeu (v1.79) — retrait du ton "historique/dev", ajout d'un paragraphe expliquant "le pouvoir des 12".
- [x] Lore : ajout du chevalier à cheval, du bateau et des épées (v1.79) — le blason et la pieuvre étaient déjà présents.
- [x] Quadrillage léger visible sur les cases d'eau, y compris près des côtes (v1.80) : c'était le contour faible (rgba 0.12) dessiné sur chaque hexagone d'eau — retiré complètement, l'eau est un aplat uni maintenant.
- [x] Glisser-attaque par mer : le tracé pouvait dépasser d'une case ce que la force pouvait réellement atteindre (v1.80) — avec une force de 3, une seule case d'eau consomme déjà toute la force utile (computeWaterTailDecay() atteint son plancher), donc l'extension du tracé s'arrête maintenant dès que le plancher est atteint au lieu de continuer à suivre le doigt pour rien.
- [x] "Le double clic zoom la page désactive le zoom" (v1.81) : le garde-fou anti-zoom existant (fenêtre de 350ms) était plus étroit que la fenêtre de double-tap de "Fin de bataille" (élargie à 600ms plus tôt) — un second tap tombant entre les deux n'était plus défendu ici, et le zoom natif iOS pouvait passer. Fenêtre élargie à 650ms.
- [x] "Petit effet souple plutôt que changement lent brutal de taille des stats" (v1.82) : `.chip.activeTurn` passait de la taille normale à 1.5x avec une simple courbe "ease" — remplacée par une courbe ressort/rebond (cubic-bezier overshoot), durée légèrement raccourcie.
- [x] "Faut un mode accessible en option dans le menu ou les couleurs sont remplacés par hachure horizontales, verticale, diagonale droite et gauche" (v1.83) : nouvelle case dans les réglages ("♿ Mode daltonien"), désactivée par défaut — chaque royaume jouable (les 4, hors barbares/neutre) gagne une hachure fixe en overlay PAR-DESSUS sa couleur habituelle (horizontale, verticale, diagonale "/", diagonale "\", dans l'ordre) via `ctx.createPattern()` sur un petit canvas hors-écran, construit une seule fois à la première activation.
- [x] "L'écran de fin de partie doit laisser un vide en haut pour cliquer sur la carte et si on glisse toute la fenêtre vers le bas ça la fait glisser et disparaître aussi pour afficher la carte" : vérifié déjà entièrement fonctionnel (`enableSwipeToDismiss` sur `#winbannerBox` + tap sur le fond via `revealFinalBoard()`, existant avant cette session) — la boîte de fin est centrée verticalement avec ~100px de vide en haut ET en bas sur un écran de 844px, et taper dans ce vide révèle bien la carte finale. Rien à coder, juste confirmé par test.
- [x] "Le bouton français/anglais est maintenant un interrupteur qui glisse d'une langue à l'autre" (v1.82) : remplacé le bouton à texte unique (qui changeait complètement de libellé au clic) par un vrai interrupteur à glissière — les deux langues restent visibles côte à côte, un curseur doré glisse de l'une à l'autre.
- [x] "Au changement de page impossible de supprimer en cliquant le tuto" (v1.81) : le garde-fou anti-zoom-double-tap (`document.addEventListener("touchend", ...)`) avalait tout SECOND tap survenant vite après N'IMPORTE QUEL tap précédent, même sur un élément totalement différent (ex : fermer les réglages puis toucher la bulle du tuto) — `preventDefault()` sur ce touchend supprime aussi le clic synthétisé par le navigateur, donc le second tap ne déclenchait plus rien du tout. Corrigé en exigeant maintenant que les deux taps soient proches aussi en POSITION (pas seulement en temps) avant de les traiter comme un vrai double-tap au même endroit — un vrai double-tap-zoom natif est toujours au même endroit, deux taps différents ailleurs sur l'écran ne sont plus jamais avalés. Découvert en creusant "le double clic zoom la page" (v1.80) : élargir seulement la fenêtre de temps avait involontairement aggravé ce bug latent.
