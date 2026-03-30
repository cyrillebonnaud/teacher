## ADDED Requirements

### Requirement: Funnel de création QCM en 4 étapes
Le système SHALL présenter la création de QCM comme un funnel séquentiel de 4 étapes : Matière → Contenu → Options → Documents.

#### Scenario: Navigation complète du funnel
- **WHEN** l'utilisateur accède à la page de création de QCM
- **THEN** l'étape 1 (Matière) est affichée avec des cards visuelles pour chaque matière

#### Scenario: Progression entre étapes
- **WHEN** l'utilisateur a complété une étape et clique "Suivant"
- **THEN** l'étape suivante est affichée avec une animation de transition

#### Scenario: Retour en arrière
- **WHEN** l'utilisateur clique "Retour" sur une étape > 1
- **THEN** l'étape précédente est affichée avec les valeurs déjà saisies préservées

### Requirement: Étape 1 — Sélection de la matière par cards
Le système SHALL afficher les matières disponibles sous forme de cards avec emoji et nom. Les matières sont présentées en grid. L'utilisateur MUST sélectionner une matière pour passer à l'étape suivante.

#### Scenario: Affichage des matières
- **WHEN** l'étape 1 est affichée
- **THEN** les 12 matières sont présentées en cards dans une grid (2 colonnes mobile, 3+ desktop) avec emoji et nom

#### Scenario: Sélection d'une matière
- **WHEN** l'utilisateur clique sur une card matière
- **THEN** la card est visuellement sélectionnée (bordure accent) et le bouton "Suivant" devient actif

### Requirement: Étape 2 — Titre et description
Le système SHALL afficher un champ titre et un champ description (textarea). Le titre est optionnel (auto-généré depuis la description si vide). La description est obligatoire.

#### Scenario: Saisie du contenu
- **WHEN** l'étape 2 est affichée
- **THEN** un champ titre (placeholder "Optionnel — sera généré automatiquement") et un textarea description sont affichés

#### Scenario: Validation de l'étape 2
- **WHEN** l'utilisateur a saisi une description non vide
- **THEN** le bouton "Suivant" est actif

### Requirement: Étape 3 — Niveau, options et nombre de questions
Le système SHALL afficher sur une seule étape : le choix du niveau (3 cards), les options de jeu (toggles), et le nombre de questions (2 cards).

#### Scenario: Affichage de l'étape 3
- **WHEN** l'étape 3 est affichée
- **THEN** 3 sections sont visibles : niveau (Facile/Moyen/Difficile en cards), options (toggles "Avec aide" et "Mode expert"), et nombre de questions (10/20 en cards)

#### Scenario: Sélection par défaut
- **WHEN** l'étape 3 est affichée pour la première fois
- **THEN** le niveau "Moyen" est pré-sélectionné, les options sont désactivées, et 10 questions est sélectionné

### Requirement: Étape 4 — Documents (optionnel)
Le système SHALL afficher une zone d'upload de documents avec un bouton "Skip" permettant de passer directement à la génération.

#### Scenario: Skip des documents
- **WHEN** l'utilisateur clique "Passer" à l'étape 4
- **THEN** la génération du QCM démarre sans documents

#### Scenario: Upload de documents
- **WHEN** l'utilisateur upload un ou plusieurs fichiers à l'étape 4
- **THEN** les fichiers sont listés avec possibilité de les supprimer, et le bouton "Générer le QCM" est visible

### Requirement: Indicateur de progression
Le système SHALL afficher un indicateur de progression montrant l'étape courante parmi les 4 étapes.

#### Scenario: Affichage de la progression
- **WHEN** l'utilisateur est à l'étape N du funnel
- **THEN** un indicateur visuel montre que l'étape N est active et les étapes < N sont complétées
