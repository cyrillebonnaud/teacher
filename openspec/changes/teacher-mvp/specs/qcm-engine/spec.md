## ADDED Requirements

### Requirement: User can generate a QCM at a chosen difficulty level
The system SHALL generate a QCM with 10 multiple-choice questions from the sequence's documents at the selected difficulty level (1=easy, 2=medium, 3=expert).

#### Scenario: Generate level 1 QCM
- **WHEN** user selects level 1 (Facile) on a sequence with uploaded documents
- **THEN** the system generates 10 direct, vocabulary-focused questions with 4 choices each, a correct answer, and an explanation

#### Scenario: Generate level 3 QCM
- **WHEN** user selects level 3 (Expert)
- **THEN** the system generates 10 analysis/inference questions that require relating multiple concepts, with plausible distractors

#### Scenario: No documents uploaded
- **WHEN** user tries to generate a QCM on a sequence with no documents
- **THEN** the system shows an error asking to upload documents first

### Requirement: User answers are saved on the fly
The system SHALL persist each answer as the user selects it, so no progress is lost if the page is closed.

#### Scenario: Answer saved immediately
- **WHEN** user selects an answer for question 3
- **THEN** the answer is saved to the database immediately (server action) without waiting for full submission

#### Scenario: Resume after page close
- **WHEN** user closes the page and returns to an in-progress QCM
- **THEN** the previously saved answers are restored and the user can continue

### Requirement: QCM is corrected on submit
The system SHALL NOT reveal correct answers while the user is answering. Correction happens only when the user submits all answers.

#### Scenario: Submit and see results
- **WHEN** user has answered all 10 questions and clicks "Valider"
- **THEN** the system scores the QCM, marks each question correct/incorrect, shows the correct answer and explanation for wrong answers, and persists the score

#### Scenario: Partial submit not allowed
- **WHEN** user clicks "Valider" with unanswered questions
- **THEN** the system highlights the unanswered questions and does not submit

### Requirement: User can retry with different questions
The system SHALL generate a new set of different questions at the same difficulty level when the user clicks "Recommencer".

#### Scenario: Retry generates different questions
- **WHEN** user clicks "Recommencer" after viewing results
- **THEN** a new QCM is generated at the same level with different questions (Claude is prompted to avoid repeating previous questions)

#### Scenario: Try a harder level
- **WHEN** user clicks the option to try the next level
- **THEN** a new QCM is generated at the next difficulty level

### Requirement: QCM results show score with visual feedback
The system SHALL display the score as X/10 with star rating and per-question feedback.

#### Scenario: Perfect score
- **WHEN** user scores 10/10
- **THEN** the results page shows 10/10 with 5 stars and a congratulatory message

#### Scenario: Mixed results
- **WHEN** user scores 7/10
- **THEN** the results page shows 7/10, marks correct answers green, wrong answers red with the correct answer and explanation displayed
