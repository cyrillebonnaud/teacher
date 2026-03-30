## ADDED Requirements

### Requirement: Affichage question par question
Le QcmPlayer SHALL afficher une seule question à la fois.

#### Scenario: Chargement initial
- **WHEN** l'élève arrive sur le QCM
- **THEN** seule la première question est affichée

### Requirement: Navigation Suivant / Précédent
Le système SHALL afficher des boutons de navigation entre les questions.

#### Scenario: Clic Suivant
- **WHEN** l'élève est sur la question N (pas la dernière)
- **THEN** la question N+1 est affichée

#### Scenario: Clic Précédent
- **WHEN** l'élève est sur la question N (pas la première)
- **THEN** la question N-1 est affichée

#### Scenario: Première question
- **WHEN** l'élève est sur la première question
- **THEN** le bouton Précédent n'est pas affiché

#### Scenario: Dernière question
- **WHEN** l'élève est sur la dernière question
- **THEN** le bouton Suivant est remplacé par Valider (si toutes les questions sont répondues)

### Requirement: Indicateur de progression
Le système SHALL afficher des dots cliquables indiquant la progression.

#### Scenario: Dots de progression
- **WHEN** l'élève est sur la question 3 et a répondu aux questions 1, 2, 5
- **THEN** les dots 1, 2, 5 sont colorés (répondues), le dot 3 est entouré (courante), les autres sont gris

#### Scenario: Navigation via dot
- **WHEN** l'élève clique sur un dot
- **THEN** la question correspondante est affichée

### Requirement: Phase résultats inchangée
La phase résultats SHALL conserver l'affichage scroll existant.

#### Scenario: Après validation
- **WHEN** l'élève valide le QCM
- **THEN** le score et le détail des réponses s'affichent en scroll
