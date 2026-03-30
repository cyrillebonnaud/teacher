## MODIFIED Requirements

### Requirement: Niveaux de difficulté
Le système SHALL proposer 3 niveaux de difficulté pour la génération de QCM :
- **Niveau 1 — Facile** : questions de compréhension directe, vocabulaire simple
- **Niveau 2 — Moyen** : questions nécessitant réflexion, formulations variées
- **Niveau 3 — Difficile** : questions d'analyse, pièges, formulations complexes

#### Scenario: Génération niveau Facile
- **WHEN** l'utilisateur sélectionne le niveau "Facile" et génère un QCM
- **THEN** les questions générées sont des questions de compréhension directe avec un vocabulaire accessible

#### Scenario: Génération niveau Difficile
- **WHEN** l'utilisateur sélectionne le niveau "Difficile" et génère un QCM
- **THEN** les questions générées incluent des pièges, de l'analyse et des formulations complexes

### Requirement: Nombre de questions par QCM
Le système SHALL proposer 2 choix de nombre de questions : 10 ou 20. Le choix 30 est supprimé.

#### Scenario: Sélection de 10 questions
- **WHEN** l'utilisateur choisit 10 questions
- **THEN** le QCM généré contient exactement 10 questions

#### Scenario: Sélection de 20 questions
- **WHEN** l'utilisateur choisit 20 questions
- **THEN** le QCM généré contient exactement 20 questions

### Requirement: Scoring adapté aux options de jeu
Le système SHALL calculer le score en tenant compte des options "avec aide" et "mode expert" si activées. Le score de base reste 1 point par bonne réponse, 0 par mauvaise réponse.

#### Scenario: Scoring standard (aucune option)
- **WHEN** aucune option n'est activée
- **THEN** le scoring est : bonne réponse = 1 pt, mauvaise réponse = 0 pt

#### Scenario: Scoring avec aide activée
- **WHEN** l'option aide est activée et un hint est utilisé sur une question
- **THEN** la bonne réponse vaut 0.5 pt au lieu de 1 pt pour cette question

#### Scenario: Scoring avec mode expert activé
- **WHEN** le mode expert est activé
- **THEN** chaque mauvaise réponse vaut -1 pt et le score peut être négatif

### Requirement: Génération de hints par Claude
Le système SHALL inclure un champ `hint` dans chaque question du JSON généré quand l'option "avec aide" est activée. Le hint MUST être une indication courte (1-2 phrases) qui guide sans donner la réponse.

#### Scenario: Prompt avec aide activée
- **WHEN** un QCM est généré avec l'option aide
- **THEN** le prompt envoyé à Claude demande un hint par question et le JSON retourné inclut un champ `hint` pour chaque question

#### Scenario: Prompt sans aide
- **WHEN** un QCM est généré sans l'option aide
- **THEN** le prompt ne demande pas de hints et le JSON retourné n'inclut pas de champ `hint`
