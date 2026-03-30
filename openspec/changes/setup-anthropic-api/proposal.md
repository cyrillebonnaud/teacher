## Why

L'app utilise actuellement un mécanisme de filesystem IPC (`.claude-ipc/`) qui nécessite une session Claude Code ouverte en permanence pour traiter les requêtes IA. C'est fragile, complexe à expliquer, et empêche un déploiement autonome (l'enfant ne peut pas utiliser l'app seul sans que quelqu'un lance `/teacher-ai`). Passer à l'API Anthropic directe rend l'app autonome, déployable, et 4× moins chère avec Haiku.

## What Changes

- **BREAKING** : Remplacer `lib/claude.ts` (filesystem IPC) par un client Anthropic SDK direct
- Ajouter la dépendance `@anthropic-ai/sdk`
- Ajouter `ANTHROPIC_API_KEY` aux variables d'environnement
- Supprimer le mécanisme IPC (`.claude-ipc/`, polling, watcher)
- Adapter les 3 consumers existants : `claudeText`, `claudeJson`, `claudeStream`
- Utiliser `claude-haiku-4-5-20251001` par défaut (suffisant pour QCM/chat niveau 5e)
- Supprimer le skill `/teacher-ai` et la CLI `teacher` (plus nécessaires)

## Capabilities

### New Capabilities
- `anthropic-api-client`: Client Anthropic SDK avec support text, JSON structuré et streaming

### Modified Capabilities

_(aucune spec existante)_

## Impact

- `lib/claude.ts` : réécriture complète (IPC → SDK)
- `app/api/chat/route.ts` : aucun changement (consomme `claudeStream` dont la signature ne change pas)
- `actions/evaluations.ts` : aucun changement (consomme `claudeJson`)
- `package.json` : ajout `@anthropic-ai/sdk`
- `.env.local` : ajout `ANTHROPIC_API_KEY`
- `.claude/skills/teacher-ai/` : suppression
- `cli.js` : suppression
- `.claude-ipc/` : suppression (dirs + `.gitkeep`)
