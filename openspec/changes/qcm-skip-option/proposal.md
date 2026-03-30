## Why

Quand un élève ne connaît pas la réponse, il est forcé de deviner parmi les 4 choix, ce qui fausse son score et ne l'aide pas à identifier ses lacunes. Un bouton "Je ne sais pas" permet de distinguer une réponse juste d'une devinette, et une ignorance assumée d'une erreur. C'est aussi pédagogiquement plus honnête — mieux vaut admettre ne pas savoir que deviner juste.

## What Changes

- Ajouter un bouton "Je ne sais pas" sous les 4 choix de chaque question
- Compter "Je ne sais pas" comme une réponse fausse dans le score
- Dans les résultats, distinguer visuellement les questions "Je ne sais pas" (afficher l'explication comme pour une erreur)
- Considérer "Je ne sais pas" comme une réponse valide (la question est considérée répondue)

## Capabilities

### New Capabilities
- `qcm-skip-option`: Bouton "Je ne sais pas" sur chaque question QCM

### Modified Capabilities

_(aucune spec existante)_

## Impact

- `components/qcm-question.tsx` : ajout du bouton "Je ne sais pas" après les choix
- `app/sequences/[id]/qcm/[evalId]/qcm-player.tsx` : gestion du skip dans le state answers
- `actions/evaluations.ts` (`submitQcm`) : le score ne change pas car skip ≠ correct
- Aucun changement de schema Prisma (le skip est stocké comme `answerIdx: -1` dans le JSON answers)
