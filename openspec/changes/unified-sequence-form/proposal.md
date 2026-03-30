## Why

Le flow actuel est fragmenté : toggle documents/libre, création de la séquence, puis upload séparé, puis sélection de niveau QCM. L'élève doit naviguer entre 3-4 écrans avant de commencer à réviser.

On unifie tout en un seul formulaire : l'élève décrit ce qu'il veut réviser, ajoute ses documents de cours s'il en a, choisit le niveau de difficulté, et lance. Un seul écran, un seul clic.

## What Changes

- **Formulaire unique** remplaçant le toggle documents/libre et la page de sélection de niveau QCM
- **Description en textarea** : l'élève décrit le sujet ou le chapitre à réviser (remplace le champ "topic" et le champ "name")
- **Upload multiple optionnel** : pièces jointes (photos, PDFs) directement dans le formulaire de création
- **Niveau de difficulté 1–5** : slider ou sélection intégrée au formulaire (remplace les 3 niveaux actuels et la page séparée)
- **Suppression du toggle** "À partir de mes cours" / "Révision libre" — plus nécessaire, tout est optionnel
- Le champ `name` sera auto-généré ou dérivé de la description

## Capabilities

### New Capabilities
- `unified-create-form`: Formulaire unique de création de séquence avec description, pièces jointes optionnelles et niveau de difficulté intégré

### Modified Capabilities
- `qcm-engine`: Passe de 3 niveaux à 5 niveaux de difficulté, le niveau est choisi à la création

## Impact

- `app/sequences/new/page.tsx` : réécriture complète du formulaire
- `app/sequences/new/submit-button.tsx` : adaptation au nouveau flow
- `actions/sequences.ts` : `createSequence` accepte description, fichiers multiples, niveau
- `actions/evaluations.ts` : adapter à 5 niveaux au lieu de 3
- `prisma/schema.prisma` : ajout `description String?` sur Sequence, changement `level Int` max 3→5
- `lib/prompts.ts` : prompts QCM pour 5 niveaux
- `app/sequences/[id]/qcm/page.tsx` : adapter la sélection de niveau à 5
