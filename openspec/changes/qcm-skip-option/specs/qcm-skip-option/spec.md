## ADDED Requirements

### Requirement: Bouton "Je ne sais pas" sur chaque question
Chaque question QCM SHALL afficher un bouton "Je ne sais pas" sous les 4 choix de réponse.

#### Scenario: Affichage du bouton
- **WHEN** une question est affichée en mode réponse (non soumis)
- **THEN** un lien textuel "Je ne sais pas" apparaît centré sous les 4 choix

#### Scenario: Clic sur "Je ne sais pas"
- **WHEN** l'élève clique sur "Je ne sais pas"
- **THEN** `onAnswer(-1)` est appelé et la question est marquée comme répondue dans la progression

#### Scenario: Masquage après soumission
- **WHEN** le QCM est soumis (mode résultat)
- **THEN** le bouton "Je ne sais pas" n'est pas affiché

### Requirement: Scoring inchangé pour les skips
Un skip SHALL compter comme une mauvaise réponse dans le score.

#### Scenario: Score avec skips
- **WHEN** l'élève répond correctement à 7 questions, se trompe sur 2, et skip 1
- **THEN** le score est 7/10

### Requirement: Affichage des skips dans les résultats
Les questions skippées SHALL être distinguées visuellement dans les résultats.

#### Scenario: Question skippée dans le détail des résultats
- **WHEN** le QCM est soumis et une question a été skippée (answer = -1)
- **THEN** un badge "Je ne sais pas" gris est affiché à la place du choix sélectionné, et l'explication est visible

#### Scenario: Question avec mauvaise réponse dans les résultats
- **WHEN** le QCM est soumis et une question a une mauvaise réponse (answer = 0-3, ≠ correct)
- **THEN** le comportement existant est conservé (choix en rouge, explication visible)
