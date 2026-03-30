## ADDED Requirements

### Requirement: Affichage question par question
Le QcmPlayer SHALL afficher une seule question à la fois. Les autres questions MUST être masquées.

#### Scenario: Chargement initial du QCM
- **WHEN** l'élève arrive sur la page du QCM
- **THEN** seule la première question (index 0) est affichée

#### Scenario: Reprise d'un QCM en cours
- **WHEN** l'élève revient sur un QCM avec des réponses sauvegardées
- **THEN** la première question est affichée avec sa réponse pré-sélectionnée

### Requirement: Navigation Suivant
Le système SHALL afficher un bouton "Suivant" permettant de passer à la question suivante.

#### Scenario: Clic sur Suivant
- **WHEN** l'élève est sur la question N (N < dernière question)
- **THEN** la question N+1 est affichée

#### Scenario: Suivant sur la dernière question
- **WHEN** l'élève est sur la dernière question
- **THEN** le bouton "Suivant" n'est pas affiché (remplacé par Valider si applicable)

### Requirement: Navigation Précédent
Le système SHALL afficher un bouton "Précédent" permettant de revenir à la question précédente.

#### Scenario: Clic sur Précédent
- **WHEN** l'élève est sur la question N (N > 0)
- **THEN** la question N-1 est affichée

#### Scenario: Précédent sur la première question
- **WHEN** l'élève est sur la première question (index 0)
- **THEN** le bouton "Précédent" n'est pas affiché

### Requirement: Indicateur de progression
Le système SHALL afficher un indicateur de progression montrant la position actuelle et l'état de chaque question.

#### Scenario: Affichage de la progression
- **WHEN** l'élève est sur la question 3 et a répondu aux questions 1, 2, 5
- **THEN** l'indicateur affiche "Question 3/10", une barre de progression, et des dots distinguant visuellement les questions répondues des non-répondues

#### Scenario: Navigation via les dots
- **WHEN** l'élève clique sur un dot de progression correspondant à la question N
- **THEN** la question N est affichée

### Requirement: Bouton Valider contextuel
Le bouton "Valider mes réponses" SHALL apparaître uniquement quand toutes les questions ont été répondues.

#### Scenario: Toutes les questions répondues, sur la dernière question
- **WHEN** l'élève est sur la dernière question ET toutes les questions ont une réponse
- **THEN** le bouton "Valider mes réponses" remplace le bouton "Suivant"

#### Scenario: Toutes les questions répondues, pas sur la dernière question
- **WHEN** toutes les questions ont une réponse ET l'élève n'est pas sur la dernière question
- **THEN** le bouton "Suivant" reste affiché ET un bouton "Valider" apparaît dans le footer

#### Scenario: Questions manquantes
- **WHEN** l'élève tente de valider (via un raccourci ou autre) avec des questions non répondues
- **THEN** la navigation se déplace vers la première question non répondue

### Requirement: Sauvegarde progressive des réponses
La sauvegarde des réponses via `saveAnswer` SHALL continuer de fonctionner identiquement en mode funnel.

#### Scenario: Réponse à une question
- **WHEN** l'élève sélectionne un choix sur la question courante
- **THEN** la réponse est sauvegardée immédiatement via `saveAnswer`

### Requirement: Phase résultats inchangée
La phase résultats (après validation) SHALL conserver son affichage actuel avec le scroll de toutes les questions corrigées.

#### Scenario: Affichage des résultats après validation
- **WHEN** l'élève valide le QCM
- **THEN** le score et le détail de toutes les questions corrigées s'affichent en scroll (comportement existant)
