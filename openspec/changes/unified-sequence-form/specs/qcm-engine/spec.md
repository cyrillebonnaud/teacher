## MODIFIED Requirements

### Requirement: User can generate a QCM at a chosen difficulty level
The system SHALL generate a QCM with 10 multiple-choice questions at the selected difficulty level (1–5). The source SHALL be the sequence's uploaded documents if text has been extracted, OR the sequence's `topic`/description if no extracted text is available.

#### Scenario: Generate QCM at each of the 5 levels
- **WHEN** user generates a QCM at level 1 (Débutant)
- **THEN** questions focus on basic vocabulary and definitions

- **WHEN** user generates a QCM at level 2 (Facile)
- **THEN** questions are direct factual questions from the course

- **WHEN** user generates a QCM at level 3 (Moyen)
- **THEN** questions require understanding and linking concepts

- **WHEN** user generates a QCM at level 4 (Difficile)
- **THEN** questions require analysis and application to new situations

- **WHEN** user generates a QCM at level 5 (Expert)
- **THEN** questions require synthesis, with subtle traps and advanced reasoning

#### Scenario: Generate QCM from topic (no documents)
- **WHEN** user generates a QCM on a sequence with no documents but with a description/topic
- **THEN** the system generates questions based on Claude's knowledge of the topic, adapted to the 5e school level

#### Scenario: Level selection page shows 5 levels
- **WHEN** user opens the QCM level selection page
- **THEN** 5 level cards are displayed (Débutant, Facile, Moyen, Difficile, Expert)
