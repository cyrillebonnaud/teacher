## ADDED Requirements

### Requirement: Tests E2E avec screenshots couvrant tous les parcours
Le système SHALL fournir un fichier de test `tests/full-e2e.spec.ts` couvrant les parcours login, dashboard, enfant, séquence, QCM et programmes. Chaque étape clé MUST capturer un screenshot dans `tests/screenshots/`.

#### Scenario: Login parent valide
- **WHEN** le test saisit le code CYRILLE sur /login
- **THEN** screenshot de la page login, login réussi, screenshot du dashboard, URL = /

#### Scenario: Login enfant valide
- **WHEN** le test saisit le code EMILE sur /login
- **THEN** login réussi, redirect vers /children/[id], screenshot de la vue enfant

#### Scenario: Login code invalide
- **WHEN** le test saisit un code invalide
- **THEN** message "Code d'accès invalide" affiché, screenshot de l'erreur

#### Scenario: Dashboard parent avec enfant
- **WHEN** le parent est connecté
- **THEN** screenshot du dashboard montrant la carte Emile (5e)

#### Scenario: Ajout enfant
- **WHEN** le parent ajoute un enfant "TestE2E" en 4e
- **THEN** code d'accès affiché, screenshot du code généré, l'enfant apparaît dans la liste

#### Scenario: Vue enfant
- **WHEN** le parent clique sur un enfant
- **THEN** page /children/[id] affichée avec le nom et le niveau, screenshot

#### Scenario: Funnel création séquence
- **WHEN** le parent parcourt toutes les étapes du funnel (enfant → matière → titre → niveau → options → docs → récap)
- **THEN** screenshot à chaque étape, soumission du formulaire

#### Scenario: Navigation programmes
- **WHEN** le parent accède à /programmes
- **THEN** grille de cartes matières 5e affichée, screenshot

#### Scenario: Recherche programmes
- **WHEN** le parent recherche "proportionnalité"
- **THEN** résultats avec highlights affichés, screenshot

#### Scenario: Vue détaillée programme
- **WHEN** le parent clique sur un programme
- **THEN** contenu formaté affiché, screenshot

#### Scenario: Déconnexion
- **WHEN** le parent clique Déconnexion
- **THEN** redirect vers /login, screenshot
