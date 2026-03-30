## 1. Dépendances et configuration

- [x] 1.1 Ajouter `@supabase/supabase-js` dans `package.json`
- [x] 1.2 Créer `lib/supabase.ts` avec le client Supabase (SUPABASE_URL + SUPABASE_SERVICE_KEY)
- [x] 1.3 Mettre à jour `.env.local` avec les variables Supabase (DATABASE_URL postgres, SUPABASE_URL, SUPABASE_SERVICE_KEY)

## 2. Prisma PostgreSQL

- [x] 2.1 Changer le provider Prisma de `sqlite` à `postgresql` dans `schema.prisma`
- [x] 2.2 Mettre à jour le script `build` dans `package.json` pour enlever le `DATABASE_URL` hardcodé SQLite
- [x] 2.3 Ajouter un script `db:push:prod` dans `package.json` pour pousser le schema vers Supabase

## 3. Upload Supabase Storage

- [x] 3.1 Refactoriser `actions/documents.ts` : remplacer `writeFile` + `mkdir` par upload vers Supabase Storage
- [x] 3.2 Stocker l'URL publique Supabase dans `Document.filePath` au lieu du chemin local

## 4. Claude vision OCR

- [x] 4.1 Ajouter une fonction `claudeVision` dans `lib/claude.ts` pour envoyer un buffer en base64 à Claude
- [x] 4.2 Remplacer `extractWithTesseractAndClaude` dans `actions/documents.ts` par l'appel Claude vision
- [x] 4.3 Gérer le fallback : rawText vide si Claude vision échoue

## 5. Déploiement Vercel

- [ ] 5.1 Installer le CLI Vercel si besoin et lier le projet (`vercel link`)
- [ ] 5.2 Configurer les env vars sur Vercel (DATABASE_URL, SUPABASE_URL, SUPABASE_SERVICE_KEY, ANTHROPIC_API_KEY)
- [ ] 5.3 Pousser le schema Prisma vers Supabase (`DATABASE_URL=<supabase_url> prisma db push`)
- [ ] 5.4 Déployer en production (`vercel --prod`)
