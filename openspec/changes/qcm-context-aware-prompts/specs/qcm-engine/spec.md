## MODIFIED Requirements

### Requirement: Génération de QCM contextualisée
Le système SHALL inclure la matière et le titre de la séquence dans le prompt envoyé à Claude lors de la génération de QCM, pour les deux modes (avec documents et sujet libre).

#### Scenario: QCM avec documents — matière et titre transmis
- **WHEN** un QCM est généré à partir de documents uploadés
- **THEN** le prompt envoyé à Claude contient la matière (ex. "Histoire-Géographie") et le titre de la séquence

#### Scenario: QCM sujet libre — matière et titre transmis
- **WHEN** un QCM est généré en mode sujet libre (topic)
- **THEN** le prompt envoyé à Claude contient la matière et le titre de la séquence

#### Scenario: Questions adaptées au domaine
- **WHEN** la matière est "Mathématiques"
- **THEN** les questions générées utilisent le vocabulaire et les formulations propres aux mathématiques
