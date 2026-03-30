## Context

Teacher est une app Next.js 16 (App Router) avec Prisma sur SQLite. Les documents sont uploadés sur le filesystem local (`public/uploads/`), l'OCR tourne via Tesseract CLI. Pour déployer sur Vercel, il faut :
- Une base de données persistante (Supabase PostgreSQL)
- Un stockage objet persistant (Supabase Storage)
- Supprimer la dépendance à Tesseract (binaire non dispo sur Vercel)

## Goals / Non-Goals

**Goals:**
- Migrer la DB de SQLite vers PostgreSQL (Supabase)
- Migrer les uploads vers Supabase Storage
- Remplacer Tesseract par Claude vision pour les images/PDFs scannés
- Permettre un premier déploiement sur Vercel fonctionnel
- Garder le dev local sur SQLite pour ne pas casser le workflow existant

**Non-Goals:**
- Migration des données existantes (dev.db → Supabase) — MVP, base vide en prod
- Authentification / multi-tenant
- CDN ou optimisation de perf des fichiers

## Decisions

### 1. SQLite en dev, PostgreSQL en prod

Prisma supporte les deux providers. Les scripts npm conservent `DATABASE_URL=file:./prisma/dev.db` pour `dev`, `db:push`, `db:migrate` et `test:e2e`. En prod, Vercel injecte `DATABASE_URL` via les env vars. Le build script ne hardcode plus SQLite.

**Alternatif rejeté** : PostgreSQL partout (local aussi) — trop lourd à setup pour un MVP.

### 2. Supabase Storage pour les uploads

Le fichier est uploadé côté serveur via le SDK `@supabase/supabase-js` avec la `SUPABASE_SERVICE_KEY` (service role, bypasse les RLS). L'URL publique du fichier est stockée dans `Document.filePath`.

**Alternatif rejeté** : Vercel Blob — moins cohérent avec Supabase DB, double fournisseur.

### 3. Claude vision remplace Tesseract

Pour les images et PDFs scannés, le buffer du fichier est envoyé en base64 à l'API Anthropic (content type `image`). Claude retourne le texte extrait. Tesseract n'est plus appelé.

**Condition** : haiku supporte les images JPEG/PNG/WEBP/GIF. Pour les PDFs, on tente d'abord `pdf-parse` (texte natif). Si insuffisant, on convertit la première page en image via... non, Vercel n'a pas `pdftoppm`. **Décision** : pour les PDFs scannés sans texte natif, on envoie directement le PDF en base64 à Claude (Claude Haiku supporte les PDFs en beta via `application/pdf`).

### 4. Schema Prisma conditionnel

Le fichier `schema.prisma` passe en `postgresql`. Les migrations ne sont pas utilisées (on garde `db push` en dev). En prod, le build Vercel exécute `prisma generate` uniquement — la DB Supabase est déjà créée via `prisma db push` lancé manuellement une fois.

**Alternatif rejeté** : `prisma migrate deploy` au build — risqué sans historique de migration propre.

## Risks / Trade-offs

- **PDFs scannés sur Vercel** : Haiku supporte les PDFs via la bêta `files` API, mais le support peut varier. → Mitigation : try/catch, fallback sur rawText vide si Claude échoue.
- **Taille max Supabase Storage free** : 1 Go. → Acceptable pour MVP.
- **SUPABASE_SERVICE_KEY exposée** : côté serveur uniquement (Server Actions), jamais envoyée au client. → OK.
- **Dev local SQLite / prod PostgreSQL** : divergence possible (types, casse). → À surveiller sur les champs JSON (stockés en `String` dans les deux cas).

## Migration Plan

1. Créer un projet Supabase (si pas déjà fait)
2. Créer un bucket Storage `documents` (public ou privé selon besoin)
3. Copier `DATABASE_URL` (connection pooling), `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` dans `.env.local`
4. Lancer `npm run db:push:prod` (nouveau script) ou `DATABASE_URL=<supabase_url> prisma db push` pour créer les tables
5. Commit + `vercel --prod`

**Rollback** : rien à rollback côté code, Supabase reste intact. Remettre l'ancien code SQLite.

## Open Questions

- Faut-il rendre le bucket Supabase Storage public (accès direct aux fichiers) ou générer des signed URLs ? → Pour MVP, URLs publiques suffisent.
