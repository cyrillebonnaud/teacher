## Why

Plusieurs frictions UX identifiées après les premiers tests utilisateur : doublons de CTA, fonctions inutilisées (chat), manque de personnalisation (icônes par matière), et navigation QCM peu engageante (scroll vs funnel). Ce change regroupe les corrections UX prioritaires pour rendre l'app plus intuitive.

## What Changes

### Suppressions
- **Supprimer la fonction Chat** : page `/chat`, `ChatClient`, `bottom-nav` lien Chat, route API `/api/chat`
- **Supprimer le bouton "💬 Poser une question"** dans la page séquence
- **Supprimer le bouton "+ Ajouter"** (doublon avec "Uploader un document")

### Modifications page séquence (`/sequences/[id]`)
- **Renommer** "Uploader un document" → "Ajouter un document"
- **Déplacer** le CTA "Générer un QCM" au-dessus de la section "Évaluations"
- **Afficher la description** de la séquence avec un bouton "Modifier"

### Modifications page liste (`/sequences`)
- **Mapper les icônes aux matières** : chaque matière a une icône dédiée (ex: 📐 Maths, 📖 Français)

### Formulaire nouvelle séquence (`/sequences/new`)
- **Ajouter un champ "Titre"** pour nommer la séquence

### QCM résultat (`/sequences/[id]/qcm/[evalId]`)
- **Ajouter un bouton "Recommencer (mêmes questions)"** pour rejouer le même QCM

### QCM player
- **Funnel question par question** : afficher une seule question à la fois avec navigation Précédent/Suivant (cf. change `qcm-funnel-navigation`)

## Capabilities

### New Capabilities
- `subject-icons`: Mapping matière → icône pour la liste des séquences
- `qcm-retry-same`: Bouton recommencer avec les mêmes questions dans les résultats QCM
- `qcm-funnel`: Navigation question par question avec Précédent/Suivant

### Modified Capabilities

_(aucune spec existante)_

## Impact

- `app/chat/` : suppression complète (page, ChatClient, ChatMessage)
- `app/api/chat/route.ts` : suppression
- `components/bottom-nav.tsx` : suppression du lien Chat (ou suppression complète si Chat était le seul autre lien)
- `app/sequences/page.tsx` : icônes par matière
- `app/sequences/[id]/page.tsx` : réorganisation CTAs, ajout description éditable
- `app/sequences/new/page.tsx` : ajout champ titre
- `app/sequences/[id]/qcm/[evalId]/qcm-player.tsx` : bouton retry same + funnel
- `prisma/schema.prisma` : éventuellement aucun changement (le champ `name` existe déjà)
