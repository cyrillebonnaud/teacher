## MODIFIED Requirements

### Requirement: User can generate a QCM at a chosen difficulty level
The system SHALL generate a QCM with 10 multiple-choice questions at the selected difficulty level. The source of questions SHALL be the sequence's uploaded documents if present, OR the sequence's `topic` if no documents exist (séquence libre). If neither is present, the system SHALL show an error.

#### Scenario: Generate level 1 QCM from documents
- **WHEN** user selects level 1 (Facile) on a sequence with uploaded documents
- **THEN** the system generates 10 direct, vocabulary-focused questions from the document text with 4 choices each, a correct answer, and an explanation

#### Scenario: Generate level 3 QCM from documents
- **WHEN** user selects level 3 (Expert)
- **THEN** the system generates 10 analysis/inference questions that require relating multiple concepts, with plausible distractors

#### Scenario: Generate QCM from topic (séquence libre)
- **WHEN** user generates a QCM on a sequence with no documents but with a `topic` defined
- **THEN** the system generates 10 questions based on Claude's knowledge of the topic, adapted to the 5e French school level, with 4 choices each, a correct answer, and an explanation

#### Scenario: No documents and no topic
- **WHEN** user tries to generate a QCM on a sequence with no documents and no topic
- **THEN** the system shows an error asking to upload documents first

#### Scenario: Answer saved immediately
- **WHEN** user selects an answer for question 3
- **THEN** the answer is saved to the database immediately (server action) without waiting for full submission

#### Scenario: Resume after page close
- **WHEN** user closes the page and returns to an in-progress QCM
- **THEN** the previously saved answers are restored and the user can continue
