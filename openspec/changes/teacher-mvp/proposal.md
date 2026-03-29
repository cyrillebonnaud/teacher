## Why

Mon fils est en 5e et a besoin d'un outil pour reviser efficacement ses cours. Aujourd'hui il relit passivement ses documents — l'apprentissage actif (se tester, identifier ses lacunes, poser des questions) est bien plus efficace mais demande un effort de preparation que ni lui ni ses parents n'ont le temps de fournir. Une app qui genere automatiquement des QCM a partir de ses vrais documents de cours resout ce probleme.

MVP local (MacBook) pour valider le concept, puis V1 cloud (Vercel + Supabase) pour un usage mobile autonome.

## What Changes

- **Nouveau projet from scratch** : web app Next.js 16 avec charte graphique inspiree de safe-tank
- **Upload de documents de cours** : PDF (texte natif ou scanne) et photos de cahier, extraction du contenu via Claude vision (OCR)
- **Generation de QCM gamifies** : 3 niveaux de difficulte (facile/moyen/expert), correction automatique au submit, possibilite de rejouer avec des questions differentes
- **Chat contextuel** : conversation avec Claude ancree dans les documents de la sequence active, sans persistance en MVP
- **Stockage local** : SQLite via Prisma pour les sequences, evaluations et documents. Fichiers sur disque.

## Capabilities

### New Capabilities
- `document-ingestion`: Upload et extraction de contenu depuis PDF et photos via Claude vision OCR
- `qcm-engine`: Generation de QCM multi-niveaux a partir du contenu extrait, sauvegarde on-the-fly des reponses, correction automatique, regeneration
- `sequence-management`: CRUD des sequences (nom, matiere, emoji) avec leurs documents et evaluations associes
- `contextual-chat`: Chat avec Claude ancre dans les documents d'une sequence, sans historique persistant
- `ui-shell`: Layout responsive (mobile/tablet/desktop), bottom navigation, charte safe-tank

### Modified Capabilities

_Aucune — projet from scratch._

## Impact

- **Nouveau repo** : github.com/cyrillebonnaud/teacher (vierge)
- **Dependencies** : Next.js 16, React 19, Tailwind 4, Prisma + SQLite, Claude API (@anthropic-ai/sdk)
- **API Claude** : cle API necessaire dans `.env.local` pour OCR (vision) + generation QCM + chat
- **Fichiers locaux** : dossier `uploads/` pour stocker les documents originaux
