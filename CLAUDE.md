# Conventions de travail — Knight Wars

## Poser les questions à Pierre

**Toute question posée à Pierre passe par un QCM interactif (AskUserQuestion), jamais par du texte
en prose.** Consigne explicite de sa part : « tout ce que tu me poses [...] doit être écrit sous
forme de quiz interactif ». Cela vaut pour les arbitrages de conception comme pour les
clarifications : s'il y a une question, elle est cliquable.

En pratique : proposer 2 à 4 options réellement distinctes, avec une description qui dit ce que
l'option implique (et pas seulement ce qu'elle est). Mettre la recommandation en premier quand il y
en a une. Une question dont la réponse se lit dans le code ou se tranche par un défaut raisonnable
n'est pas une question : on décide et on le signale.

Pierre est concepteur de jeux vidéo et arbitre, pas développeur — « je fais de l'arbitrage, je suis
concepteur de jeux vidéo, je suis pas développeur ». Les options se formulent en termes de jeu et
d'expérience, jamais en termes d'implémentation.

## Avant tout push

`node simulate.js` doit passer **en local**, sur le fichier exact qui part. Sans exception, même
pour un changement qui ne touche pas la logique de jeu. Le portail vérifie : smoke (27 combinaisons
carte × difficulté), déterminisme, reconstruction d'une sauvegarde, et la courbe de difficulté sur
5 paliers.

## Règles de contenu

- **Toute mécanique nouvelle ou modifiée** obtient sa fiche Astuces dédiée, désormais **en 2
  langues : français et anglais** (règle posée en v2.43 pour 5 langues, réduite à 2 le
  2026-09-21 — voir « Les langues sont gelées » juste en dessous). Les guillemets chinois
  restent 「」 pour tout le texte chinois déjà écrit.
- Chaque version ajoute son entrée de `CHANGELOG`, écrite pour un joueur : ce qui change pour lui,
  pas ce qui change dans le code.
- Le `BACKLOG.md` garde une entrée par version, en français, avec ce qui a été mesuré et les pièges
  rencontrés — c'est la mémoire du projet.

### Les langues sont gelées (arbitrage de Pierre, 2026-09-21)

Les cinq langues (fr/en/zh/es/de) **restent** pour tout ce qui existe : aucun joueur ne perd
ce qu'il lit aujourd'hui. Mais **tout contenu NOUVEAU ne s'écrit qu'en français et en
anglais.** On ne complète plus le chinois, l'espagnol ni l'allemand.

Les trois raisons de l'arbitrage, dans l'ordre où elles ont pesé :

1. **Pierre ne peut relire que deux des cinq.** Le chinois, l'espagnol et l'allemand sont ma
   parole seule — personne ne sait si le ton du chroniqueur tient ni si l'humour absurde
   passe. Pour un jeu dont la personnalité EST sa voix, trois langues invérifiables sont une
   dette, pas de la portée.
2. **Le coût est un coût de flux, pas de poids.** 279 clés × 5 : chaque mécanique nouvelle
   demandait cinq textes avant de pouvoir livrer. Mesuré : les traductions pèsent 66 Ko
   compressés sur 387, soit 17 % — réel, mais jamais ce qui ralentissait le travail.
3. **L'anglais seul a été écarté** parce que Pierre écrit son lore en français, et que la
   blague est la première chose qui meurt en traduction. Sa propre doctrine Oronet dit
   « français ET anglais ».

**Conséquence technique à appliquer au prochain lot qui ajoute du contenu** : `tLang()` retombe
aujourd'hui sur le FRANÇAIS quand une langue manque (`entry[uiLang] || entry.fr`). Un joueur
chinois croisant un texte neuf lirait donc du français. Le repli doit passer par l'anglais
d'abord : `entry[uiLang] || entry.en || entry.fr`. Pas livré seul — il n'a d'effet qu'à partir
du premier texte écrit en 2 langues, et une version dont le changelog n'a rien à dire au joueur
n'a pas lieu d'être.

**Contrepartie assumée** : avec le temps le jeu devient un patchwork, l'ancien contenu en cinq
langues et le nouveau en deux. Pierre l'a choisi en connaissance de cause.

## Git

Développer sur la branche désignée, committer, et **sauvegarder le travail non commité en patch
avant tout `reset --hard`** de resynchronisation post-fusion (leçon de v2.54 : la resynchronisation
efface l'arbre).
