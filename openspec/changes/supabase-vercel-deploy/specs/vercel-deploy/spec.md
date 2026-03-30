## ADDED Requirements

### Requirement: Prisma provider PostgreSQL en production
Le système SHALL utiliser le provider `postgresql` dans `prisma/schema.prisma`. Les scripts npm `dev`, `db:push`, `db:migrate` et `test:e2e` SHALL continuer à utiliser `DATABASE_URL=file:./prisma/dev.db` pour le développement local. Le script `build` SHALL lire `DATABASE_URL` depuis l'environnement sans le hardcoder.

#### Scenario: Build Vercel
- **WHEN** Vercel exécute `npm run build`
- **THEN** Prisma génère le client avec le provider PostgreSQL
- **AND** `DATABASE_URL` est lue depuis les env vars Vercel (Supabase connection string)

#### Scenario: Dev local
- **WHEN** le développeur lance `npm run dev`
- **THEN** SQLite est utilisé via `DATABASE_URL=file:./prisma/dev.db`

### Requirement: Build command Vercel avec prisma generate
Le système SHALL exécuter `prisma generate && next build` comme build command Vercel. Cela garantit que le client Prisma est généré avec le bon provider avant la compilation Next.js.

#### Scenario: Premier déploiement
- **WHEN** Vercel build est déclenché pour la première fois
- **THEN** `prisma generate` tourne avec succès
- **AND** `next build` compile l'app sans erreur

### Requirement: Variables d'environnement requises
Le déploiement Vercel SHALL exposer les variables suivantes : `DATABASE_URL` (Supabase PostgreSQL connection pooling), `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `ANTHROPIC_API_KEY`.

#### Scenario: Variable manquante au runtime
- **WHEN** une variable d'env requise est absente
- **THEN** l'action serveur concernée lève une erreur explicite (pas un crash silencieux)
