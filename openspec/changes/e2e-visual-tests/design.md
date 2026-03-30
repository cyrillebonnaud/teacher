## Context

L'app utilise Playwright (config dans `playwright.config.ts`, port 6001, headless Chromium). Des tests existent dans `tests/` mais ne couvrent pas les nouveaux parcours parent/enfant et ne capturent pas de screenshots systématiques. Le seed parent CYRILLE et enfant EMILE (5e) existent en base.

## Goals / Non-Goals

**Goals:**
- Un fichier test unique `tests/full-e2e.spec.ts` qui couvre tous les parcours
- Screenshots à chaque étape clé (login, dashboard, ajout enfant, vue enfant, funnel séquence, QCM, programmes)
- Helper login réutilisable avec cookies
- Tests jouables en headless (CI) et localement

**Non-Goals:**
- Tests de performance ou load testing
- Tests de régression visuelle avec comparaison pixel-perfect (juste des captures manuelles)
- Tests de l'API Claude (mocké ou skipé si timeout)

## Decisions

### D1 : Un seul fichier test séquentiel

**Choix** : Un fichier `tests/full-e2e.spec.ts` avec des `test.describe` par parcours, exécutés séquentiellement (les tests dépendent de l'état créé par les précédents).

**Rationale** : Les parcours sont liés (on crée un enfant, puis une séquence pour cet enfant, etc.). La parallélisation n'a pas de sens pour un smoke test complet.

### D2 : Screenshots dans `tests/screenshots/`

**Choix** : `await page.screenshot({ path: 'tests/screenshots/<name>.png', fullPage: true })` à chaque étape. Le dossier est gitignored.

### D3 : Skip QCM generation si timeout

**Choix** : La génération QCM appelle Claude API et peut prendre 10-30s. Le test tente la génération avec un timeout de 60s. Si ça échoue, on skip le test QCM.

## Risks / Trade-offs

- **[Tests fragiles sur timing]** → Utiliser `waitForLoadState('networkidle')` et des sélecteurs textuels robustes plutôt que des classes CSS.
- **[Screenshots volumineux]** → Gitignorés, consultables localement après run.
