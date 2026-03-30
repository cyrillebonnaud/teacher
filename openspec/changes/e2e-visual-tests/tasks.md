## 1. Setup

- [x] 1.1 S'assurer que `tests/screenshots/` est dans `.gitignore`
- [x] 1.2 Vérifier la config Playwright (screenshots on failure + manuels)

## 2. Tests E2E

- [x] 2.1 Créer `tests/full-e2e.spec.ts` avec helper login (parent + enfant)
- [x] 2.2 Tests login : parent valide, enfant valide, code invalide, déconnexion — screenshots à chaque étape
- [x] 2.3 Tests dashboard : carte enfant visible, ajout enfant TestE2E, code généré affiché — screenshots
- [x] 2.4 Tests vue enfant : clic sur enfant, page détail, état vide — screenshots
- [x] 2.5 Tests funnel séquence : parcours complet étape par étape — screenshot par step
- [x] 2.6 Tests programmes : grille cartes, recherche full-text, vue détaillée — screenshots
- [x] 2.7 Nettoyage : supprimer l'enfant TestE2E créé pendant les tests (ou ignorer)

## 3. Validation

- [x] 3.1 Lancer `npm run test:e2e` et vérifier que tous les tests passent
- [x] 3.2 Vérifier les screenshots dans `tests/screenshots/`
