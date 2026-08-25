# Knight Wars

Un jeu de conquête de territoire sur grille hexagonale, façon Dice Wars — une seule page HTML/CSS/JS, déployée telle quelle sur GitHub Pages, sans backend.

Le jeu lui-même (règles, mécaniques, historique des versions) est expliqué en jeu : bouton **🎓 Conseils**, **📜 Le lore**, et le numéro de version en haut de l'écran (notes de version).

## Idées futures / backlog

Suggestions notées ici pour ne pas les perdre, pas encore implémentées :

- **Éditeur de cartes ergonomique** — permettre de dessiner/ajuster une carte à la main (plutôt que purement procédurale) et de la sauvegarder/partager via un code, comme les parties actuelles.
- **Tutoriel un peu plus complet** pour la toute première partie (au-delà du petit message d'accroche actuel).
- **Détection de trêve généralisée** à tous les modes de combat, avec un compte à rebours visible sur le bouton de fin de tour (actuellement limité au mode "combat déterministe").
- **Skin "mur du Moyen Âge"** pour les frontières de province, à terme — une texture de mur/pierre plutôt qu'un simple trait de couleur.
- **Piste d'écriture pour les textes de fin de partie** : jouer sur le décalage entre le joueur moderne et le personnage médiéval qu'il incarne — pendant la bataille, on reste pleinement dans le ton du seigneur, mais une fois que c'est fini, une touche moderne/anachronique peut percer (un aparté entre *astérisques*, dans le style du "*soupir*"/"sandwich vegan" déjà en place) : il redevient lui-même l'instant d'une phrase avant de replonger. Pas une règle systématique, juste une carte à jouer de temps en temps sur les lignes de victoire/défaite.
- **Voyages en bateau / traversées d'eau** : mécanique de jeu à concevoir — les hexagones gris de fond de carte deviennent de l'eau ; attaquer à travers l'eau (chemin le plus court calculé) coûte de la force par case traversée (1 par case si c'est un lac entièrement fermé, 2 si c'est une zone connectée à l'"océan" extérieur, donc plus dangereuse). L'animation de déplacement sur l'eau devrait aussi être deux fois plus lente que sur terre. Grosse mécanique, à faire avec soin (chemin le plus court sur la grille hexagonale, détection lac/océan par flood-fill, équilibrage).
- **Curseur/scrubber pendant le replay** (glisser pour avancer/reculer à un point précis de la partie) + bouton "Reprendre la partie à partir d'ici" (fork une nouvelle partie jouable depuis ce point précis, en gardant la partie originale intacte pour un futur "Revoir la partie"). Implémenté une première fois — à re-tester/peaufiner si des soucis remontent.
- **Trait du chemin d'attaque en chaîne** : actuellement une ligne droite entre le premier et le dernier village de la chaîne — il faudrait qu'elle passe par le centre de chaque village intermédiaire (plus courte suite de segments), pour que ça se lise comme "l'armée traverse ces villages-là" plutôt qu'une ligne à vol d'oiseau qui semble traverser une autre province.
- **Vibration + son à chaque village supplémentaire** pendant un glisser d'attaque en chaîne (pas seulement au relâchement) — quelque chose de discret et organique, plus la même mélodie que l'attaque mais une quinte plus bas.
- ~~Écran de fin de partie : glisser vers le bas pour révéler la carte~~ — fait : glisser le panneau de fin de partie révèle l'état final du plateau, avec un bouton pour lancer le replay et un bouton pour revenir à l'écran de fin ; l'écran de fin s'ouvre aussi désormais toujours remonté en haut du message.
- ~~Menus (Réglages/Conseils/Le lore) : une seule surface de défilement~~ — fait : Conseils et Le lore ont maintenant le même geste de glisser-pour-fermer que les Réglages (tout le parchemin bouge ensemble, pas un texte qui défile séparément à l'intérieur).
- **Bouton "vitesse x2" du replay** signalé comme ne fonctionnant pas sur iPhone alors que testé correctement en automatisé (Playwright) — pas encore reproduit, creuser avec plus de détails sur le symptôme exact (aucune réaction au tap ? le texte ne change pas ? autre chose ?).
- **Réflexion à avoir sur l'animation des renforts** : d'où viennent les troupes concrètement (un village précis ? plusieurs ?) et comment animer le fait qu'elles se répartissent à certains endroits plutôt que d'autres.
- **Interrupteur silencieux de l'iPhone** signalé comme n'étant pas respecté par les sons du jeu (le son continue même muet) — à investiguer, probable limitation de l'API Web Audio sur iOS plutôt qu'un vrai bug côté jeu.
- **Piste lore/graphisme à creuser** : réfléchir à un nom en univers pour les menus/parchemins (Conseils, Le lore, Réglages...) sur le thème du moine copiste — écriture en noir, rouge d'enlumineur, et or plus rarement.
- **Mode paysage** : quand le téléphone est tourné à l'horizontale, la carte ne doit ni bouger ni se redimensionner (elle garde l'espace maximal comme aujourd'hui) — seuls les chiffres de force sur la carte et les menus/HUD pivotent de 90° (dans le bon sens selon le côté de la rotation) pour rester lisibles, en gardant leur position relative à l'écran. Gros morceau, pas encore attaqué : nécessite `screen.orientation`, une refonte de la couche HUD (wrapper pivoté) et la rotation du texte dessiné sur le canvas — difficile à vérifier entièrement sans un vrai appareil (comportement de `safe-area-inset` sous rotation).

Rien d'urgent — à reprendre quand il y aura du temps.
