## ADDED Requirements

### Requirement: Login par code d'accès
Le système SHALL permettre à un parent de se connecter en saisissant son code d'accès unique sur la page `/login`. Le code est case-insensitive. Aucun email ni mot de passe n'est requis.

#### Scenario: Login réussi
- **WHEN** un parent saisit un code d'accès valide (ex: `CYRILLE`) sur `/login`
- **THEN** le système crée une session cookie HTTP-only et redirige vers `/`

#### Scenario: Code invalide
- **WHEN** un parent saisit un code d'accès inexistant
- **THEN** le système affiche "Code d'accès invalide" et reste sur `/login`

#### Scenario: Code case-insensitive
- **WHEN** un parent saisit `cyrille` au lieu de `CYRILLE`
- **THEN** le login réussit de la même manière

### Requirement: Session cookie sécurisée
Le système SHALL stocker la session dans un cookie HTTP-only signé (JWT). Le cookie MUST expirer après 30 jours. Le code d'accès MUST être stocké hashé (SHA-256) en base.

#### Scenario: Cookie valide
- **WHEN** un parent avec un cookie session valide accède à une page protégée
- **THEN** le système affiche la page normalement

#### Scenario: Cookie expiré
- **WHEN** un parent avec un cookie expiré accède à une page protégée
- **THEN** le système redirige vers `/login`

### Requirement: Protection des routes par middleware
Le middleware Next.js SHALL protéger toutes les routes sauf `/login`. Les requêtes sans session valide MUST être redirigées vers `/login`.

#### Scenario: Accès non authentifié
- **WHEN** un utilisateur non connecté accède à `/`
- **THEN** le système redirige vers `/login`

#### Scenario: Route login accessible sans session
- **WHEN** un utilisateur non connecté accède à `/login`
- **THEN** la page s'affiche normalement (pas de redirect)

### Requirement: Déconnexion
Le système SHALL fournir un bouton de déconnexion dans le header. La déconnexion MUST supprimer le cookie session.

#### Scenario: Déconnexion
- **WHEN** un parent clique sur "Déconnexion"
- **THEN** le cookie est supprimé et le parent est redirigé vers `/login`

### Requirement: Seed parent CYRILLE
Le système SHALL fournir un seed qui crée le parent "Cyrille" avec le code d'accès `CYRILLE`. Le seed MUST être idempotent.

#### Scenario: Seed initial
- **WHEN** le script de seed est exécuté sur une base vide
- **THEN** le parent "Cyrille" existe avec le code `CYRILLE` fonctionnel

#### Scenario: Seed idempotent
- **WHEN** le script de seed est exécuté alors que le parent "Cyrille" existe déjà
- **THEN** aucune erreur, le parent reste inchangé
