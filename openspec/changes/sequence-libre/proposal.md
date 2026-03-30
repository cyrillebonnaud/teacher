## Why

Aujourd'hui, créer une séquence utile demande d'abord d'uploader des documents. Un élève qui veut réviser un chapitre dont il n'a pas son cours sous la main ne peut pas démarrer.

L'idée est de permettre la création d'une **séquence libre** : l'élève décrit un sujet en langage naturel ("les régimes alimentaires", "la Révolution française", "les fractions"), et Claude génère directement des QCMs à partir de ses connaissances — sans documents. L'élève peut réviser immédiatement.

## What Changes

- **Nouveau mode de création** : champ de description libre ("De quoi veux-tu réviser ?") en alternative au flux actuel
- **Génération de QCM sans document** : Claude utilise ses connaissances sur le sujet, adaptées au niveau 5e
- **Pas de rupture** : le flux existant (upload de documents) reste intact et complémentaire

## Capabilities

### New Capabilities
- `sequence-libre`: Création d'une séquence à partir d'un sujet décrit en langage naturel, avec génération de QCM depuis les connaissances de Claude (sans document requis)

### Modified Capabilities
- `qcm-engine`: Le QCM peut maintenant être généré sans documents si la séquence a un `topic` défini (séquence libre)

## Impact

- `prisma/schema.prisma` : ajout d'un champ optionnel `topic String?` sur le modèle Sequence
- `app/sequences/new/page.tsx` : ajout d'un champ de description libre et d'un toggle "Séquence libre / Séquence avec documents"
- `actions/sequences.ts` : `createSequence` accepte et persiste le `topic`
- `actions/evaluations.ts` : `generateEvaluation` utilise le `topic` si aucun document n'est présent
- `lib/prompts.ts` : nouveau prompt QCM pour séquence libre (sans texte de document, avec sujet + niveau 5e)
