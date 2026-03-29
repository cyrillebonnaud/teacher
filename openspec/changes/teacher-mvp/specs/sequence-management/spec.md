## ADDED Requirements

### Requirement: User can create a sequence
The system SHALL allow the user to create a new study sequence with a name, subject, and emoji.

#### Scenario: Create a sequence
- **WHEN** user fills in the name "Moyen Age", subject "Histoire", and selects an emoji
- **THEN** the sequence is persisted in the database and appears in the sequences list

#### Scenario: Name is required
- **WHEN** user submits the form without a name
- **THEN** the form shows a validation error and does not create the sequence

### Requirement: User can view the list of sequences
The system SHALL display all sequences sorted by most recent first, showing name, subject, emoji, and document count.

#### Scenario: Display sequences
- **WHEN** user navigates to the sequences page
- **THEN** all sequences are listed with their name, subject, emoji, and number of uploaded documents

#### Scenario: Empty state
- **WHEN** no sequences exist
- **THEN** a message invites the user to create their first sequence

### Requirement: User can view a sequence detail
The system SHALL display a sequence's documents and past evaluations, with actions to upload documents, generate QCM, or open chat.

#### Scenario: View sequence with documents and evaluations
- **WHEN** user taps a sequence in the list
- **THEN** the detail page shows uploaded documents, past evaluations with scores, and action buttons

### Requirement: User can delete a sequence
The system SHALL allow the user to delete a sequence and all associated documents, evaluations, and files.

#### Scenario: Delete with confirmation
- **WHEN** user taps delete on a sequence
- **THEN** a confirmation dialog appears, and upon confirmation, the sequence and all related data are removed
