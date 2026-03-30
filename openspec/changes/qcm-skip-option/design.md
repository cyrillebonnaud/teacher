## Context

Le QcmQuestion affiche 4 choix (A-D) via `onAnswer(answerIdx: number)` où `answerIdx` est 0-3. Le scoring compare `answers[i] === question.correct`. Le funnel considère une question "répondue" si `answers[i] !== undefined`.

## Goals / Non-Goals

**Goals:**
- Permettre de passer une question sans deviner
- Compter comme répondu dans la progression (pas de blocage)
- Afficher l'explication dans les résultats (comme une erreur)

**Non-Goals:**
- Scoring différent entre skip et erreur (les deux comptent comme faux)
- Statistiques séparées sur les skips

## Decisions

### 1. Convention `answerIdx: -1` pour "Je ne sais pas"

Appeler `onAnswer(-1)` quand l'élève clique sur "Je ne sais pas". -1 ne correspond à aucun choix (0-3), donc `answers[i] === question.correct` est toujours faux → score identique à une mauvaise réponse.

**Pourquoi** : Pas de changement de schema. Le JSON answers stocke déjà des entiers, -1 est une valeur sentinelle naturelle. Pas besoin de changer `submitQcm`.

### 2. Bouton discret sous les choix

Un lien textuel gris "Je ne sais pas" centré sous les 4 boutons de choix, pas un 5e bouton de même taille. Visuellement distinct des vrais choix.

### 3. Distinction visuelle dans les résultats

En mode résultat, si `selectedAnswer === -1` : afficher un badge "Je ne sais pas" gris, et montrer l'explication (comme pour une erreur).

## Risks / Trade-offs

- **[Abus du skip]** L'élève pourrait tout skipper → Mitigation : le score reflète les skips (0 points), c'est auto-correctif
