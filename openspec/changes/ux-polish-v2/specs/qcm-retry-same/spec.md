## ADDED Requirements

### Requirement: Recommencer avec les mêmes questions
L'écran de résultats QCM SHALL afficher un bouton "Recommencer (mêmes questions)" qui permet de rejouer le même QCM.

#### Scenario: Clic sur recommencer mêmes questions
- **WHEN** l'élève clique sur "Recommencer (mêmes questions)"
- **THEN** une nouvelle Evaluation est créée avec les mêmes questions et des réponses vides, et l'élève est redirigé vers ce nouveau QCM

#### Scenario: Pas d'appel API
- **WHEN** le bouton "Recommencer (mêmes questions)" est cliqué
- **THEN** aucun appel à l'API Anthropic n'est effectué (les questions sont copiées depuis l'évaluation existante)
