## Why

Actuellement, le QCM affiche les 10 questions empilées sur une seule page avec scroll. C'est peu engageant pour un collégien : il voit tout d'un coup, perd le focus, et le scroll sur mobile est laborieux. Un déroulé question par question (funnel) avec navigation Précédent/Suivant améliore la concentration, la gamification et l'expérience mobile.

## What Changes

- Remplacer l'affichage scroll-all par un mode **funnel** : une seule question visible à la fois
- Ajouter une **barre de navigation** Précédent / Suivant en bas de l'écran
- Afficher un **indicateur de progression** (ex: "Question 3/10" + progress bar)
- Conserver la possibilité de naviguer librement entre les questions (pas de verrouillage)
- Adapter le bouton "Valider" : il apparaît sur la dernière question ou remplace "Suivant" quand toutes les questions sont répondues
- Conserver le comportement existant de sauvegarde progressive des réponses (`saveAnswer`)

## Capabilities

### New Capabilities
- `qcm-funnel-view`: Navigation question par question avec Précédent/Suivant, indicateur de progression, et bouton Valider contextuel

### Modified Capabilities

_(aucune spec existante modifiée)_

## Impact

- `app/sequences/[id]/qcm/[evalId]/qcm-player.tsx` : refonte du composant principal (remplacement du scroll par le funnel)
- `components/qcm-question.tsx` : aucun changement structurel nécessaire (réutilisé tel quel)
- Aucun changement backend, API, ou schema Prisma
