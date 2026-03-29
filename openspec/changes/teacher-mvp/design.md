## Context

Projet greenfield — repo vierge `cyrillebonnaud/teacher`. L'app aide un eleve de 5e a reviser en generant des QCM a partir de ses documents de cours uploades. MVP local (localhost), V1 cloud (Vercel + Supabase).

La charte graphique reprend celle de `safe-tank` : Tailwind 4 inline theme, system fonts, blue #2563eb comme seul accent, layout mobile-first avec bottom nav.

## Goals / Non-Goals

**Goals:**
- App fonctionnelle en local avec SQLite, migrable vers Postgres/Supabase en V1
- Upload PDF + photos avec extraction OCR via Claude vision
- QCM gamifies 3 niveaux avec correction automatique
- Chat contextuel par sequence (ephemere)
- Responsive mobile / tablet / desktop

**Non-Goals:**
- Authentification (MVP = single user local)
- Recherche web / sources externes
- Redaction libre / correction de texte ouvert
- Historique de chat persistant
- PWA / mode offline
- Multi-utilisateur

## Decisions

### D1: Next.js 16 App Router + Server Actions
**Choix** : Next.js 16 avec App Router, Server Actions pour les mutations (upload, submit QCM).
**Alternatives** : Remix (moins de momentum), SvelteKit (pas de familiarite), API Routes classiques (plus verbose).
**Rationale** : Meme stack que safe-tank, migration Vercel triviale, Server Actions simplifient le code vs API routes separees.

### D2: Prisma + SQLite (MVP) → Prisma + Postgres (V1)
**Choix** : Prisma ORM avec SQLite provider en local. Le fichier DB vit dans `prisma/dev.db`.
**Alternatives** : Drizzle (plus leger mais moins de tooling), better-sqlite3 raw (pas d'ORM = migration penible), JSON files (trop fragile).
**Rationale** : Prisma gere la migration SQLite → Postgres en changeant juste le provider + DATABASE_URL. Le schema reste identique.

### D3: Claude vision pour l'OCR
**Choix** : Envoyer les documents (PDF pages converties en images, photos brutes) a Claude claude-sonnet-4-6 via l'API vision pour extraire le texte.
**Alternatives** : Tesseract (gratuit mais mauvais sur manuscrit), Google Cloud Vision (payant, setup complexe), pdf-parse seul (ne gere pas les scans/photos).
**Rationale** : Claude vision gere bien les PDF scannes ET l'ecriture manuscrite d'ado. Un seul provider pour OCR + generation + chat simplifie l'archi. Pour les PDF texte natif, on extrait d'abord avec pdf-parse ; si ca echoue (scan), on fallback sur vision.

### D4: Stockage fichiers sur disque local
**Choix** : Les fichiers uploades sont stockes dans `public/uploads/{sequenceId}/{filename}`. Le chemin est enregistre dans la DB.
**Alternatives** : Blob en DB (trop lourd pour SQLite), S3/Supabase Storage (overkill en MVP).
**Rationale** : Simple, consultable directement. En V1 on migre vers Supabase Storage.

### D5: QCM stocke en JSON dans la DB
**Choix** : Le champ `Evaluation.questions` est un JSON contenant le tableau de questions/reponses/explications. Les reponses de l'eleve sont dans `Evaluation.answers` (JSON), sauvegardees a chaque reponse.
**Rationale** : Flexible, pas besoin de tables Question/Answer separees pour le MVP. Le JSON est directement exploitable cote client.

### D6: Chat stateless (pas de persistence DB)
**Choix** : L'historique de chat vit dans le state React (useState). Quand on quitte la page, c'est perdu.
**Alternatives** : Sauvegarder en DB (overhead inutile pour MVP).
**Rationale** : Simplifie enormement le MVP. Le contexte du chat = les documents de la sequence (envoyes dans le system prompt) + la conversation en cours.

### D7: Layout responsive avec breakpoints
**Choix** : Single-column sur mobile (< 768px), layout elargi sur tablet/desktop. Bottom nav sur mobile, sidebar ou top nav au-dessus de md.
**Rationale** : L'usage principal sera mobile (iPad de l'eleve), mais le parent configure sur MacBook. Meme bottom nav partout pour simplifier le MVP — on ne fait pas de sidebar desktop.

### D8: Structure du projet
```
teacher/
├── app/
│   ├── layout.tsx              # Root layout + bottom nav
│   ├── page.tsx                # Redirect → /sequences
│   ├── sequences/
│   │   ├── page.tsx            # Liste des sequences
│   │   ├── new/page.tsx        # Creation sequence
│   │   └── [id]/
│   │       ├── page.tsx        # Detail sequence (docs + evals)
│   │       ├── upload/page.tsx # Upload document
│   │       └── qcm/
│   │           ├── page.tsx    # Selection niveau
│   │           └── [evalId]/page.tsx  # QCM en cours + resultats
│   └── chat/
│       └── page.tsx            # Chat (sequence selectionnee)
├── components/
│   ├── bottom-nav.tsx
│   ├── qcm-question.tsx
│   └── chat-message.tsx
├── lib/
│   ├── claude.ts               # Client Claude API
│   ├── prompts.ts              # System prompts (OCR, QCM, chat)
│   └── pdf.ts                  # PDF text extraction
├── prisma/
│   └── schema.prisma
├── tests/
│   ├── sequences.spec.ts       # CRUD sequences
│   ├── documents.spec.ts       # Upload, OCR, edit
│   ├── qcm.spec.ts             # Generate, answer, submit, retry
│   ├── chat.spec.ts            # Chat flow
│   └── helpers.ts              # Shared utilities (login, create sequence...)
├── playwright.config.ts
├── public/uploads/
└── .env.local                  # ANTHROPIC_API_KEY
```

### D9: Tests E2E Playwright (pattern safe-tank)
**Choix** : Playwright headless, chromium uniquement, 1 worker, tests organises par feature. Auto-start du dev server Next.js sur un port dedie. Helpers partages (pas de fixtures Playwright).
**Alternatives** : Cypress (plus lourd, moins rapide), Testing Library seul (pas de vrai E2E).
**Rationale** : Meme pattern que safe-tank. Tests par feature = facile a maintenir. Single worker = pas de race conditions sur la DB SQLite locale. Les tests couvrent tous les flows utilisateur : creation de sequence, upload, generation QCM, correction, retry, chat.

## Risks / Trade-offs

**[OCR manuscrit imparfait]** → L'ecriture d'un ado de 12 ans sera partiellement reconnue. Mitigation : afficher le texte extrait a l'utilisateur pour verification/edition avant de generer les QCM. Ajouter un champ editable `raw_text` dans la vue document.

**[Cout API Claude]** → Chaque upload + generation + chat consomme des tokens. Mitigation : utiliser claude-sonnet-4-6 (pas Opus) pour le bon ratio qualite/prix. Cacher le texte extrait pour ne pas re-OCR a chaque generation.

**[PDF multi-pages]** → Un cours de 20 pages = 20 images envoyees a Claude vision. Mitigation : limiter a 10 pages par document en MVP, decouper en chunks si necessaire.

**[Qualite des QCM]** → Claude peut generer des questions trop faciles ou ambigues. Mitigation : prompt engineering soigne avec exemples few-shot par niveau de difficulte. Le "try again" permet de regenerer si la qualite est mauvaise.

**[Tests Playwright headless]** → Les tests E2E tournent contre le dev server local. Si le server est lent au demarrage, les tests peuvent flaker. Mitigation : timeout 30s dans la config, `reuseExistingServer: true`.

**[Migration SQLite → Postgres]** → Quelques types incompatibles (DateTime, JSON). Mitigation : Prisma abstrait les differences. Tester la migration sur un dump avant V1.
