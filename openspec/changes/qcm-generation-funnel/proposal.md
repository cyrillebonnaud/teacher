## Why

Le flow actuel de création de QCM combine tout dans un seul formulaire (matière, titre, description, niveau, nombre de questions, pièces jointes). C'est dense et peu engageant pour un collégien. Il faut passer en mode funnel step-by-step avec des cards visuelles, réduire les niveaux de difficulté à 3 (facile/moyen/difficile), ajouter des options de jeu (aide, mode expert), et limiter les choix de questions à 10 ou 20.

## What Changes

- **Funnel step-by-step** pour la génération de QCM : matière → titre + description → niveau (étape dédiée avec description) → options + nombre de questions → pièces jointes (optionnel, skip)
- **4 niveaux de difficulté** au lieu de 5 : Facile, Moyen, Difficile, Expert
- **Option "Avec aide"** (niveaux 1-3 uniquement) : un hint masqué par question, coûte -0.5 point si révélé
- **Niveau Expert (4)** : aucune aide disponible, chaque mauvaise réponse coûte -1 point (intégré au niveau)
- **10 ou 20 questions** uniquement (suppression du choix 30)
- **Sélection par cards** (pas de dropdown) pour la matière et les niveaux
- La matière est choisie en premier step du funnel

## Capabilities

### New Capabilities
- `qcm-funnel`: Flow de création de QCM en mode funnel multi-étapes avec cards visuelles
- `qcm-game-options`: Options de jeu (aide avec hints, mode expert avec pénalité)

### Modified Capabilities
- `unified-create-form`: Le formulaire unifié est remplacé par le funnel step-by-step
- `qcm-engine`: Niveaux réduits à 3, scoring modifié par les options aide/expert

## Impact

- `app/sequences/new/page.tsx` — refonte complète en funnel multi-étapes
- `app/sequences/[id]/qcm/` — adaptation aux 3 niveaux et nouvelles options
- `components/qcm-question.tsx` — ajout du bouton hint et logique de pénalité
- `prisma/schema.prisma` — champs `helpMode` et `expertMode` sur Evaluation, niveau limité à 1-3
- `lib/prompts.ts` — adaptation des prompts pour 3 niveaux et génération de hints
- `actions/sequences.ts` et `actions/evaluations.ts` — adaptation des server actions
