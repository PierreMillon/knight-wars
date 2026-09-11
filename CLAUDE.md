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

- **Toute mécanique nouvelle ou modifiée** obtient sa fiche Astuces dédiée, **en 5 langues**
  (fr/en/zh/es/de) — règle posée en v2.43. Les guillemets chinois sont 「」.
- Chaque version ajoute son entrée de `CHANGELOG`, écrite pour un joueur : ce qui change pour lui,
  pas ce qui change dans le code.
- Le `BACKLOG.md` garde une entrée par version, en français, avec ce qui a été mesuré et les pièges
  rencontrés — c'est la mémoire du projet.

## Git

Développer sur la branche désignée, committer, et **sauvegarder le travail non commité en patch
avant tout `reset --hard`** de resynchronisation post-fusion (leçon de v2.54 : la resynchronisation
efface l'arbre).
