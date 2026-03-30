## 1. Installation SDK

- [x] 1.1 `npm install @anthropic-ai/sdk`
- [x] 1.2 Créer `.env.local` avec `ANTHROPIC_API_KEY` et `CLAUDE_MODEL`

## 2. Réécriture lib/claude.ts

- [x] 2.1 Remplacer le client IPC par un client `Anthropic` SDK avec init depuis env vars
- [x] 2.2 Implémenter `claudeText` via `client.messages.create`
- [x] 2.3 Implémenter `claudeJson` via `client.messages.create` + `JSON.parse`
- [x] 2.4 Implémenter `claudeStream` via `client.messages.stream` retournant un `ReadableStream<Uint8Array>`

## 3. Nettoyage IPC

- [x] 3.1 Supprimer `cli.js` et l'entrée `bin` dans `package.json`
- [x] 3.2 Supprimer `.claude/skills/teacher-ai/`
- [x] 3.3 Supprimer `.claude/settings.json` (permissions IPC)
- [x] 3.4 Supprimer `.claude-ipc/` (dirs + `.gitkeep`) et nettoyer `.gitignore`

## 4. Mise à jour documentation

- [x] 4.1 Mettre à jour `CLAUDE.md` : supprimer les sections IPC/watcher, documenter `ANTHROPIC_API_KEY`

## 5. Vérification

- [x] 5.1 Tester la génération QCM via l'app
- [x] 5.2 Tester le chat streaming
- [x] 5.3 Mettre à jour les tests Playwright si nécessaire
