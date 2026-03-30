## Why

L'app a des tests E2E Playwright mais ils ne couvrent pas les parcours complets et ne vérifient pas le rendu visuel. Il faut des tests exhaustifs de chaque parcours utilisateur (login parent, login enfant, ajout enfant, création séquence, QCM, programmes) avec des screenshots à chaque étape pour validation visuelle headless.

## What Changes

- **Tests E2E complets** : couvrir tous les parcours — login parent/enfant, dashboard, ajout enfant, vue enfant, création séquence (funnel complet), génération QCM, navigation programmes, recherche, déconnexion
- **Screenshots automatiques** : capturer un screenshot à chaque étape clé pour valider visuellement le rendu (headless)
- **Helper de login** : factoriser le login + seed dans un helper réutilisable
- **Nettoyage seed** : garantir un état propre avant chaque suite de tests

## Capabilities

### New Capabilities
- `e2e-test-suite`: Tests E2E Playwright couvrant tous les parcours avec screenshots

### Modified Capabilities

## Impact

- **Tests** : nouveaux fichiers dans `tests/`
- **Config Playwright** : ajustements éventuels pour screenshots
- **CI** : les tests tournent en headless comme aujourd'hui
