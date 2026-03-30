## Why

L'app Teacher est aujourd'hui sans authentification — toutes les séquences sont visibles par tous. Pour qu'un parent puisse suivre la progression de ses enfants et leur proposer des QCM ciblés, il faut un espace parent avec gestion des enfants, une vue par enfant sur les séquences/QCM, et un accès aux programmes officiels par niveau/matière. Le login par code d'accès (sans mot de passe) garde l'expérience simple.

## What Changes

- **Modèle Parent** : nouveau modèle avec prénom et code d'accès unique (6 caractères alpha, généré automatiquement)
- **Modèle Child** : nouveau modèle rattaché à un parent, avec prénom et niveau scolaire (6e→3e) ; les séquences existantes sont rattachées à un enfant
- **Login par code d'accès** : page `/login` — saisie du code parent → session cookie (pas de mot de passe) ; seed initial : parent "CYRILLE" avec code `CYRILLE` (ou dérivé)
- **Dashboard parent** : page `/` après login — liste des enfants avec accès rapide à leurs séquences et QCM
- **Vue enfant** : `/children/[childId]` — séquences et évaluations de l'enfant, progression
- **Navigateur programmes** : `/programmes` — consultation des programmes officiels par niveau (5e) et matière, avec recherche full-text dans le contenu des programmes
- **Association Sequence → Child** : ajout d'un `childId` sur le modèle Sequence ; le funnel de création demande pour quel enfant

## Capabilities

### New Capabilities
- `parent-auth`: Login par code d'accès, session cookie, seed du parent CYRILLE, middleware de protection des routes
- `child-management`: CRUD enfant (prénom, niveau), rattachement au parent connecté
- `parent-dashboard`: Vue d'ensemble par enfant — séquences, derniers QCM, progression
- `programme-browser`: Consultation des programmes officiels par niveau et matière, recherche full-text

### Modified Capabilities
_(aucune capability existante modifiée au niveau spec — les changements sur Sequence sont internes au nouveau modèle)_

## Impact

- **Schema Prisma / Supabase** : 2 nouvelles tables (`parent`, `child`), nouvelle colonne `child_id` sur `sequence`
- **Middleware Next.js** : nouveau `middleware.ts` pour protéger les routes (redirect `/login` si pas de session)
- **Supabase** : migration SQL pour les nouvelles tables + seed du parent CYRILLE
- **Funnel création séquence** : ajout étape sélection enfant
- **Layout** : header avec nom du parent connecté + navigation enfants/programmes
