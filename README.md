# Teacher 📚

App de révision pour mon fils (5e) — génère des QCM à partir de ses documents de cours.

## Fonctionnalités

- **Séquences** : organise tes cours par séquence (Moyen Âge, Fractions, etc.)
- **Upload** : PDF (natif ou scanné) et photos de cahier — OCR automatique via Claude
- **QCM gamifiés** : 3 niveaux de difficulté, correction automatique, rejouer avec des questions différentes
- **Chat** : pose des questions à Claude, ancré dans tes documents de cours

## Prérequis

- Node.js 20+
- Clé API Claude : [console.anthropic.com](https://console.anthropic.com)

## Installation

```bash
git clone https://github.com/cyrillebonnaud/teacher
cd teacher

cp .env.local.example .env.local
# Édite .env.local et ajoute ANTHROPIC_API_KEY

npm install
npm run db:push
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

## Tests

```bash
npm run test:e2e
```

Tests Playwright, chromium headless, port 3001.

## Roadmap

- **MVP** (ce repo) : local, SQLite, single user
- **V1** : Vercel + Supabase (Postgres + Storage + Auth), multi-device
