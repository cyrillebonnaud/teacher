## ADDED Requirements

### Requirement: Ajouter un enfant
Le système SHALL permettre à un parent connecté d'ajouter un enfant en saisissant son prénom et son niveau scolaire (6e, 5e, 4e, 3e). Un code d'accès unique (6 caractères alphanumériques) MUST être généré automatiquement pour chaque enfant.

#### Scenario: Ajout d'un enfant
- **WHEN** un parent remplit le formulaire avec prénom "Lucas" et niveau "5e"
- **THEN** l'enfant est créé avec un code d'accès généré (ex: `A7K2M9`), et le parent voit l'enfant dans sa liste

#### Scenario: Code d'accès affiché après création
- **WHEN** un enfant vient d'être créé
- **THEN** le système affiche le code d'accès généré pour que le parent puisse le noter/partager

### Requirement: Liste des enfants
Le système SHALL afficher la liste des enfants du parent connecté avec leur prénom, niveau et code d'accès.

#### Scenario: Parent avec enfants
- **WHEN** un parent connecté accède au dashboard
- **THEN** il voit la liste de ses enfants avec prénom, niveau et code d'accès

#### Scenario: Parent sans enfant
- **WHEN** un parent connecté sans enfant accède au dashboard
- **THEN** il voit un message invitant à ajouter un premier enfant

### Requirement: Rattachement séquence à un enfant
Le système SHALL demander pour quel enfant la séquence est créée lors du funnel de création. Le `child_id` MUST être stocké sur la séquence.

#### Scenario: Création de séquence pour un enfant
- **WHEN** un parent crée une séquence et sélectionne l'enfant "Lucas"
- **THEN** la séquence est créée avec `child_id` pointant vers Lucas

#### Scenario: Sélection enfant obligatoire
- **WHEN** un parent tente de créer une séquence sans sélectionner d'enfant
- **THEN** le système empêche la soumission et demande de choisir un enfant
