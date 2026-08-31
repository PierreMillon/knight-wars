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

[ ] Replay à invente un partie :( (bug de déterminisme du replay, potentiellement important — pas reproduit, besoin d'un exemple concret : seed/lien de partage où ça arrive)

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

Essayer une version avec du brouillard comme aoe I

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

Prévoir le jeu comme basique et hyper accessible. Et ajouter des level de difficulté supplémentaire cachés comme Cthulhu et le pouvoir des 12 (Merlin s'active quand toutes les provinces sont à fond par exemple pour le lore) comme ça y'a deus jeux. Celui qu'on joue comme ça. Et celui des hard tryers qui complètent tout et accèdent à un jeu beaucoup plus technique et exigeant que les noobs pourraient pas réussir du tout. Chtulhu active les attaques longue distanc sans perte. Donc faut retenir chaque spécificités des seigneurs et s'adapter. Y'a des stats qui s'affichent en plus sont désactivables en menu comme au début, pourcentage de la carte conquise, pourcentage de complétion du total max de force par royaume. Le brouillard de découverte. Le mode exploration avec un seigneur choisi de force et un brouillard de découverte et de combat. On perd la vision des forces sur une province perdue mais on garde sa vision géographique. Comme un idle game qui ajoute complexité et boutons au fur et à mesure

Pour le sacrifice aux océans de Chtulhu mettre avant de le débloquer une piste subtile à gagner aléatoirement entre 5 et 10 victoires en gagnât une partie avec un message de fin d'écran du type : « Le Seigneur xxx vous remet un parchemin crypté, persuadé de vous donner un secret crucial sur les mystères de l'océan… » puis quand on débloque Chtulhu alors le lore explique l'histoire et les astuces explique comment on oeut utiliser le pouvoir. Préparer d'autres messages mystères type chasse au trésor. Les mises à jour garde les infos des joueur ou pas. Ça peut faire partie du challenge de tout recommencer à zéro régulièrement mais avec plus d'expérience ? En mode jeu pour les initiés qui donne accès à un lore méga riche.

Quelles phrases manquent actuellement que je les écrivent ?

[x] La pieuvre bonus s'active si on envoie les trois bateaux pleins au niveau difficile seulement.

---

## Idées données en direct (pas dans le paste original ci-dessus)

- [ ] Chaque royaume peut, via un easter egg, débloquer un dieu spécial avec des capacités spéciales. Actives pour le joueur uniquement, sauf en mode le plus dur — ou quand débloqué pour un seigneur, actif qu'on le joue ou qu'il soit adversaire.
- [~] "Bonus de 12" : contour doré vibrant fait (une seule limite pour tout le royaume, physiquement séparé sinon). L'attaque spéciale imparable elle-même reste à construire — UX d'activation pas encore précisée.
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
- [ ] "Super pouvoir des 12" — activation précisée en direct (attaque imparable sur autant de cases que de provinces, icône double-épée, déblocage d'un logo permanent + bonus égalité 12v12 après 3 activations/partie) : reste à construire, prochaine étape.
- [x] Quand le joueur perd (éliminé), écran de fin immédiat — la partie ne continuait pas jusque-là entre les IA survivantes, avec une trêve qui pouvait tomber sur un spectateur déjà éliminé.
- [x] IA : enchaîne les attaques depuis le territoire juste conquis avant d'envisager un autre front ("quand les ennemis peuvent faire des attaques chaînées, ils le font").
- [x] Horloges des stats : retrait du contour noir, remplacé par deux aiguilles de montre (une fixe, une qui suit la progression) qui se rejoignent et disparaissent à 100%.
- [x] Taille de carte découplée du nombre d'adversaires — une taille donnée fait toujours la même taille totale, les places libres deviennent barbares.
- [x] Replay : retrait épées/bateaux, contour doré tenu tant que non lancé (replayPaused), sons de combat réussite/échec ajoutés, pieuvre visible si apparue dans la partie originale.
- [x] Retrait des mentions "s'applique à la prochaine guerre" dans le menu réglages (taille de carte, nombre d'adversaires).
- [ ] "J'ai gagné beaucoup trop facilement en niveau 4" — tuning en cours, la correction du chaînage IA devrait aider ; pas de rééquilibrage dédié fait cette fois (le système de paliers de probabilité exacts reste un chantier séparé, plus large).
- [x] Inversé la position des boutons "Nouvelle partie aléatoire" et "Partager ma victoire" sur l'écran de fin.
- [x] Graphique de fin : chiffres de territoire déplacés en haut du graphique, nombres de soldat (force) ajoutés en dessous — le panneau Force retiré du graphique (tâche #37) revient sous cette forme simple, pas comme bande empilée.
