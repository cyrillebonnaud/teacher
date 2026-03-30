## Why

Les prompts de génération QCM (`buildQcmPrompt` et `buildFreeTopicQcmPrompt`) ne transmettent pas la matière ni le titre de la séquence à Claude. Résultat : les questions générées manquent de contexte disciplinaire — un QCM d'Histoire-Géo peut produire des questions formulées comme un QCM de SVT. Passer la matière et le titre permet à Claude de mieux adapter le vocabulaire, le style et les attentes disciplinaires.

## What Changes

- Passer `subject` (matière) et `title` (nom de la séquence) aux fonctions `buildQcmPrompt` et `buildFreeTopicQcmPrompt`
- Intégrer ces infos dans le prompt système envoyé à Claude
- Adapter `generateQcm` dans `actions/evaluations.ts` pour transmettre ces paramètres

## Capabilities

### New Capabilities
*(aucune)*

### Modified Capabilities
- `qcm-engine`: Les prompts de génération incluent désormais la matière et le titre pour un QCM contextualisé

## Impact

- `lib/prompts.ts` — signature modifiée, prompt enrichi
- `actions/evaluations.ts` — passage des nouveaux paramètres depuis la séquence
