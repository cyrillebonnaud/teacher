## REMOVED Requirements

### Requirement: Formulaire unifié sur une seule page
**Reason**: Remplacé par le funnel multi-étapes `qcm-funnel`. Le formulaire unique avec tous les champs sur une page est supprimé au profit d'un parcours guidé step-by-step.
**Migration**: Toute la logique de création est portée dans le nouveau funnel (`qcm-funnel`). Les server actions restent identiques, seule l'interface change.

### Requirement: Sélection de matière par dropdown
**Reason**: Remplacé par des cards visuelles dans l'étape 1 du funnel.
**Migration**: La liste des matières reste la même, seul le composant de sélection change (dropdown → cards grid).
