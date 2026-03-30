## Why

Teacher utilise SQLite (fichier local) et stocke les uploads sur le filesystem (`public/uploads/`). Vercel a un filesystem éphémère : la DB et les fichiers disparaissent à chaque redéploiement. Il faut migrer vers Supabase (PostgreSQL + Storage) pour pouvoir déployer sur Vercel.

## What Changes

- **BREAKING** : Prisma provider passe de `sqlite` à `postgresql` — la DB locale `dev.db` n'est plus utilisée en production
- Upload des documents vers Supabase Storage au lieu du filesystem local
- Extraction de texte OCR : suppression de Tesseract (pas dispo sur Vercel), fallback sur Claude vision pour les images/PDFs scannés
- Ajout d'un helper `lib/supabase.ts` pour le client Supabase (Storage)
- Scripts npm : `build`/`start` lisent `DATABASE_URL` depuis l'env au lieu de hardcoder le chemin SQLite
- Déploiement Vercel avec `prisma generate` au build

## Capabilities

### New Capabilities
- `supabase-storage`: Upload et lecture de fichiers via Supabase Storage (remplace le filesystem local)
- `claude-vision-ocr`: Extraction de texte d'images/PDFs scannés via Claude vision API (remplace Tesseract)
- `vercel-deploy`: Configuration Vercel (build command, env vars, prisma generate)

### Modified Capabilities
<!-- Aucune spec existante à modifier -->

## Impact

- `prisma/schema.prisma` : provider sqlite → postgresql
- `actions/documents.ts` : upload Supabase Storage + Claude vision au lieu de writeFile + Tesseract
- `lib/claude.ts` : nouvelle fonction pour envoyer des images en base64 à Claude
- `lib/supabase.ts` : nouveau fichier — client Supabase
- `package.json` : ajout `@supabase/supabase-js`, mise à jour scripts build
- `.env.local` : nouvelles variables `DATABASE_URL` (postgres), `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`
- Dev local : reste sur SQLite via les scripts npm (`DATABASE_URL=file:./prisma/dev.db`)
