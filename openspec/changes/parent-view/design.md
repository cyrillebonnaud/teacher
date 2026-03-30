## Context

L'app Teacher est une app Next.js 16 / Supabase sans authentification. Toutes les séquences et QCM sont publics. Le modèle de données actuel : `Sequence → Documents, Evaluations`. Pas de notion d'utilisateur.

On ajoute un espace parent avec login par code d'accès, gestion d'enfants, et consultation des programmes officiels. Le public cible : des parents non-techniques qui veulent suivre les révisions de leurs enfants au collège.

## Goals / Non-Goals

**Goals:**
- Authentifier un parent par code d'accès simple (pas de mot de passe, pas d'email)
- Permettre d'ajouter/gérer des enfants (prénom + niveau scolaire)
- Rattacher les séquences à un enfant spécifique
- Offrir une vue par enfant des séquences et résultats QCM
- Naviguer les programmes officiels par niveau et matière avec recherche full-text
- Seed initial : parent "Cyrille" avec code `CYRILLE`

**Non-Goals:**
- Inscription libre / création de compte par le parent (admin-only pour le MVP)
- Partage de séquences entre parents
- Notifications push ou email
- Multi-niveau par enfant (un enfant = un niveau fixe)
- Édition des programmes (consultation seule)

## Decisions

### D1 : Auth par code d'accès + cookie session

**Choix** : Code alphanumérique unique par parent (6+ chars, case-insensitive). Stocké hashé en base. Session via cookie HTTP-only signé (`next/headers`).

**Alternative rejetée** : Supabase Auth — surdimensionné pour un MVP familial sans email/password. Le code d'accès est plus simple pour le public cible.

**Implémentation** :
- Table `parent` avec `access_code_hash` (SHA-256)
- Server Action `loginWithCode(code)` → set cookie `parent_session` (JWT signé avec `PARENT_SESSION_SECRET`)
- Middleware Next.js vérifie le cookie sur toutes les routes sauf `/login`

### D2 : Modèle Child rattaché au Parent

**Choix** : Table `child` avec `parent_id`, `first_name`, `level` (enum : `6e`, `5e`, `4e`, `3e`). La table `sequence` reçoit un `child_id` nullable (rétrocompatibilité avec les séquences existantes).

**Alternative rejetée** : Mettre le niveau sur la séquence uniquement — on perdrait la notion d'enfant et la vue agrégée par enfant.

### D3 : Programmes stockés en base avec full-text search

**Choix** : Table `programme` avec `level`, `subject`, `title`, `content` (texte intégral des programmes officiels). Recherche full-text via `ILIKE` PostgreSQL (suffisant pour le volume — ~30 programmes max). Données seedées via script SQL.

**Alternative rejetée** : Stockage fichier + search engine (Typesense, etc.) — complexité disproportionnée pour ~30 documents statiques.

### D4 : Navigation — onglets Parent Dashboard / Programmes

**Choix** : Après login, layout avec nav : `Mes enfants` (dashboard par défaut) | `Programmes`. Chaque enfant est une carte cliquable menant à `/children/[childId]` (liste séquences + QCM).

### D5 : Seed parent CYRILLE

**Choix** : Script de seed Supabase (ou migration SQL) qui insère le parent "Cyrille" avec code d'accès `CYRILLE`. Le seed est idempotent (upsert sur le code).

## Risks / Trade-offs

- **[Code d'accès brute-forceable]** → Rate limiting sur la route login (5 tentatives/min par IP). Acceptable pour un MVP familial, pas pour une app publique.
- **[Séquences orphelines]** → Les séquences existantes (`child_id = null`) restent accessibles mais n'apparaissent dans aucun dashboard enfant. Migration manuelle si besoin.
- **[Programmes statiques]** → Le contenu des programmes est seedé une fois. Si les programmes changent, il faut re-seeder. Acceptable pour le collège (programmes stables sur 3-5 ans).
- **[ILIKE perf]** → Recherche full-text par `ILIKE '%terme%'` est O(n) mais n ≈ 30 lignes, donc négligeable. Si le volume augmente, migrer vers `tsvector`.
