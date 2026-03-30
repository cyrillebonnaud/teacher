## ADDED Requirements

### Requirement: Dashboard parent
Le système SHALL afficher un dashboard après login avec la liste des enfants sous forme de cartes. Chaque carte MUST montrer le prénom, le niveau, et un résumé de progression (nombre de séquences, dernier QCM).

#### Scenario: Dashboard avec enfants
- **WHEN** un parent connecté accède à `/`
- **THEN** il voit une carte par enfant avec prénom, niveau, nombre de séquences et date du dernier QCM

#### Scenario: Clic sur un enfant
- **WHEN** un parent clique sur la carte d'un enfant
- **THEN** il est redirigé vers `/children/[childId]`

### Requirement: Vue détaillée enfant
Le système SHALL afficher sur `/children/[childId]` toutes les séquences de l'enfant avec leurs évaluations. Chaque séquence MUST montrer le nom, la matière, le nombre de QCM passés et le meilleur score.

#### Scenario: Liste des séquences d'un enfant
- **WHEN** un parent accède à `/children/[childId]`
- **THEN** il voit la liste des séquences rattachées à cet enfant avec matière, nom et stats QCM

#### Scenario: Accès au QCM depuis la vue enfant
- **WHEN** un parent clique sur une séquence dans la vue enfant
- **THEN** il est redirigé vers la page détail de la séquence `/sequences/[id]`

#### Scenario: Enfant sans séquence
- **WHEN** un parent accède à la vue d'un enfant qui n'a aucune séquence
- **THEN** il voit un message invitant à créer une première séquence avec un lien vers `/sequences/new`

### Requirement: Navigation globale
Le système SHALL afficher un header avec le nom du parent, une navigation `Mes enfants | Programmes`, et un bouton de déconnexion.

#### Scenario: Navigation entre sections
- **WHEN** un parent clique sur "Programmes" dans le header
- **THEN** il est redirigé vers `/programmes`

#### Scenario: Retour au dashboard
- **WHEN** un parent clique sur "Mes enfants" dans le header
- **THEN** il est redirigé vers `/`
