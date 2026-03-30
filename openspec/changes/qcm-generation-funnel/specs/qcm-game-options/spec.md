## ADDED Requirements

### Requirement: Option "Avec aide" — hints par question
Le système SHALL permettre d'activer l'option "Avec aide" lors de la création du QCM. Quand activée, chaque question générée MUST inclure un hint. Le hint est masqué par défaut et l'utilisateur peut choisir de l'afficher, au coût de -0.5 point sur cette question.

#### Scenario: Activation de l'option aide
- **WHEN** l'utilisateur active le toggle "Avec aide" à l'étape 3 du funnel
- **THEN** l'option est enregistrée et le QCM généré inclura des hints

#### Scenario: Affichage du hint pendant le QCM
- **WHEN** l'utilisateur joue un QCM avec aide activée et clique sur le bouton "Voir l'indice" d'une question
- **THEN** le hint est affiché sous la question et la question est marquée comme "hint utilisé"

#### Scenario: Scoring avec hint utilisé — bonne réponse
- **WHEN** l'utilisateur a utilisé le hint et répond correctement
- **THEN** la question vaut 0.5 point au lieu de 1

#### Scenario: Scoring avec hint utilisé — mauvaise réponse
- **WHEN** l'utilisateur a utilisé le hint et répond incorrectement
- **THEN** la question vaut 0 point (pas de pénalité supplémentaire)

#### Scenario: Hint non utilisé
- **WHEN** l'utilisateur ne clique pas sur "Voir l'indice"
- **THEN** le scoring normal s'applique (1 point bonne réponse, 0 mauvaise réponse)

### Requirement: Option "Mode expert" — pénalité sur mauvaises réponses
Le système SHALL permettre d'activer l'option "Mode expert" lors de la création du QCM. Quand activée, chaque mauvaise réponse coûte -1 point. Le score total peut devenir négatif.

#### Scenario: Activation du mode expert
- **WHEN** l'utilisateur active le toggle "Mode expert" à l'étape 3 du funnel
- **THEN** l'option est enregistrée et le scoring du QCM appliquera des pénalités

#### Scenario: Scoring expert — bonne réponse
- **WHEN** le mode expert est activé et l'utilisateur répond correctement
- **THEN** la question vaut 1 point (inchangé)

#### Scenario: Scoring expert — mauvaise réponse
- **WHEN** le mode expert est activé et l'utilisateur répond incorrectement
- **THEN** la question vaut -1 point

#### Scenario: Score négatif possible
- **WHEN** le mode expert est activé et l'utilisateur a plus de mauvaises réponses que de bonnes
- **THEN** le score total affiché est négatif

### Requirement: Combinaison aide + expert
Les options "Avec aide" et "Mode expert" MUST être cumulables.

#### Scenario: Aide + expert — hint utilisé + mauvaise réponse
- **WHEN** les deux options sont activées, le hint est utilisé et la réponse est mauvaise
- **THEN** la question vaut -1 point (pénalité expert, le coût du hint ne s'ajoute pas sur une mauvaise réponse)

#### Scenario: Aide + expert — hint utilisé + bonne réponse
- **WHEN** les deux options sont activées, le hint est utilisé et la réponse est bonne
- **THEN** la question vaut 0.5 point (1 point - 0.5 pour le hint)
