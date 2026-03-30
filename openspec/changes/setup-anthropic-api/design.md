## Context

`lib/claude.ts` implémente un client IPC filesystem : il écrit des requêtes en JSON dans `.claude-ipc/pending/`, puis poll `.claude-ipc/done/` jusqu'à ce qu'un watcher Claude Code (`/teacher-ai`) y écrive la réponse. Les 3 fonctions publiques sont `claudeText`, `claudeJson`, `claudeStream` — consommées par `actions/evaluations.ts` (QCM/OCR) et `app/api/chat/route.ts` (streaming chat).

## Goals / Non-Goals

**Goals:**
- App autonome : `npm run dev` suffit, sans session Claude Code séparée
- Même interface publique (`claudeText`, `claudeJson`, `claudeStream`) pour zéro changement dans les consumers
- Coût minimal via Haiku 4.5

**Non-Goals:**
- Rate limiting ou gestion de quotas (pas nécessaire pour un utilisateur unique)
- Fallback multi-modèle (un seul modèle suffit)
- Migration vers un autre provider IA

## Decisions

### 1. SDK Anthropic officiel (`@anthropic-ai/sdk`)

Utiliser le SDK TypeScript officiel plutôt que des appels `fetch` bruts.

**Pourquoi** : Le SDK gère retry, streaming SSE, types TypeScript, et erreurs de manière idiomatique. C'est la recommandation Anthropic.

### 2. Modèle par défaut : `claude-haiku-4-5-20251001`

**Pourquoi** : ~$0.004/QCM vs $0.016 avec Sonnet. La qualité est identique pour du QCM structuré et du chat niveau 5e. Le modèle est configurable via env var `CLAUDE_MODEL` pour pouvoir switcher.

### 3. Conserver les mêmes signatures de fonctions

```typescript
claudeText(prompt, opts?) → Promise<string>
claudeJson<T>(prompt, schema, opts?) → Promise<T>
claudeStream(prompt, opts?) → ReadableStream<Uint8Array>
```

**Pourquoi** : Aucun changement dans les consumers. La migration est limitée à un seul fichier.

### 4. Variable `ANTHROPIC_API_KEY` dans `.env.local`

**Pourquoi** : Convention Next.js. Pas de préfixe `NEXT_PUBLIC_` car la clé n'est utilisée que côté serveur (Server Actions + API Route).

## Risks / Trade-offs

- **[Coût imprévu]** Un bug de boucle pourrait envoyer beaucoup de requêtes → Mitigation : `maxTokens` explicite sur chaque appel (1024 pour QCM, 2048 pour chat)
- **[Clé API exposée]** La clé ne doit jamais être côté client → Mitigation : uniquement dans `.env.local` (gitignored) et consommée dans Server Actions / API Route, jamais dans un composant client
- **[Downtime API]** L'API Anthropic peut être indisponible → Mitigation : le SDK gère les retry automatiquement (2 retries par défaut)

## Migration Plan

1. `npm install @anthropic-ai/sdk`
2. Réécrire `lib/claude.ts` (IPC → SDK)
3. Ajouter `ANTHROPIC_API_KEY` et `CLAUDE_MODEL` dans `.env.local`
4. Vérifier que les consumers fonctionnent sans changement
5. Supprimer : `cli.js`, `.claude/skills/teacher-ai/`, `.claude-ipc/`, entrées `bin` et `settings.json`
6. Mettre à jour `CLAUDE.md` et `.gitignore`
