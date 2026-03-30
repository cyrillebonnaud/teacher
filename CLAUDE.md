# Teacher — Conventions & Commandes

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4 (inline theme, pas de config file)
- Prisma + SQLite (MVP) — migrable vers Postgres/Supabase en V1
- Claude via API Anthropic (`@anthropic-ai/sdk`) — clé API requise dans `.env.local`
- Playwright pour les tests E2E

## Setup initial

```bash
npm install
npm run db:push      # Crée la base SQLite
# Créer .env.local avec ANTHROPIC_API_KEY
npm run dev          # Lance sur http://localhost:6001
```

## Commandes

| Commande | Description |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Build production |
| `npm run db:push` | Applique le schema Prisma sans migration |
| `npm run db:migrate` | Crée une migration nommée |
| `npm run db:generate` | Regenere le client Prisma après changement schema |
| `npm run test:e2e` | Lance les tests Playwright (headless, port 3001) |

## Structure

```
app/               # Pages Next.js (App Router)
  sequences/       # Liste, création, detail, upload, QCM
  chat/            # Chat contextuel
  api/chat/        # Route streaming Claude
actions/           # Server Actions (mutations)
components/        # Composants partagés
lib/               # DB, Claude client, prompts, PDF utils
prisma/            # Schema + base dev.db (gitignore)
tests/             # Tests Playwright par feature
public/uploads/    # Fichiers uploadés (gitignore)
```

## Charte graphique

Inspirée de `safe-tank` :
- Fond : `#f0f2f5` (bg-gray-50)
- Surface : `#ffffff`
- Accent : `#2563eb` (blue-600) — seule couleur interactive
- Police : system fonts (-apple-system, Segoe UI, Roboto)
- Border-radius : `rounded-lg` (normal), `rounded-xl` (cartes), `rounded-2xl` (modales)
- Pas de shadcn/ui, pas d'icon library

## Conventions

- **Server Actions** pour toutes les mutations (sequences, documents, evaluations)
- **API Route** uniquement pour le streaming chat (`/api/chat`)
- **Server Components** pour la data fetching (Prisma direct dans les pages)
- **Client Components** pour l'interactivité (QcmPlayer, ChatClient, etc.)
- JSON stocké en `String` dans SQLite (Prisma) — parser avec `JSON.parse()`
- Les fichiers uploadés vont dans `public/uploads/{sequenceId}/`

## Variables d'environnement

```
DATABASE_URL=file:./dev.db         # Chemin SQLite (relatif à prisma/schema.prisma)
ANTHROPIC_API_KEY=sk-ant-...       # Clé API Anthropic (obligatoire)
CLAUDE_MODEL=claude-haiku-4-5-20251001  # Modèle par défaut (optionnel)
```

## Migration vers V1 (cloud)

1. Changer `prisma/schema.prisma` provider: `sqlite` → `postgresql`
2. Mettre `DATABASE_URL` avec l'URL Supabase
3. Migrer le stockage fichiers vers Supabase Storage
4. Déployer sur Vercel
