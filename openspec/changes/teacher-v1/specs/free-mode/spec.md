## ADDED Requirements

### Requirement: User can generate a QCM on any 5e topic without uploading documents
The system SHALL provide a "mode libre" entry point where the student types a free-form topic and gets a QCM generated from the official 5e curriculum.

#### Scenario: Access free mode
- **WHEN** user taps "Mode libre" from the home screen or sequences list
- **THEN** a screen appears with a text field: "Sur quoi veux-tu travailler ?" and a subject selector (optional: Histoire, Géographie, Maths, Français, SVT, Physique-Chimie, EMC)

#### Scenario: Generate QCM from free topic
- **WHEN** user types "Charlemagne" and taps "Générer"
- **THEN** the system maps the topic to Histoire, injects the official programme content for Histoire 5e, and generates a level 1 QCM (default level). The student can change the level before generating.

#### Scenario: Topic outside 5e curriculum
- **WHEN** user types "la Révolution française" (4e programme)
- **THEN** the system shows: "Ce sujet est au programme de 4e, pas de 5e. Tu veux quand même essayer ?" with Yes / No options

#### Scenario: Unrecognized topic
- **WHEN** user types something unrelated to any school subject ("Minecraft", "football")
- **THEN** the system shows: "Je ne connais pas ce sujet au programme de 5e. Essaie une autre formulation, ou uploade ton cours !" — no Claude call is made

#### Scenario: Ambiguous topic resolved by subject selector
- **WHEN** user types "les ressources" without selecting a subject
- **THEN** the system asks: "Dans quelle matière ? Histoire / Géographie / SVT" before generating

### Requirement: Free mode results are saved in a "Sessions libres" system sequence
The system SHALL automatically save all free mode QCMs under a system-managed sequence named "Sessions libres".

#### Scenario: First free mode QCM
- **WHEN** user completes their first free mode QCM
- **THEN** a "Sessions libres" sequence is auto-created (if it doesn't exist) and the Evaluation is saved under it

#### Scenario: Sessions libres appears in the sequence list
- **WHEN** user navigates to the sequences list
- **THEN** "Sessions libres" appears as a pinned or visually distinct entry (system sequence, not deletable)

#### Scenario: Sessions libres cannot be deleted
- **WHEN** user attempts to delete the "Sessions libres" sequence
- **THEN** the delete option is not available — the sequence is system-managed

#### Scenario: Sessions libres shows history of free QCMs
- **WHEN** user opens "Sessions libres"
- **THEN** they see all past free mode evaluations with topic name, date, score, and level

### Requirement: Free mode prompt uses official programme as context
The system SHALL inject the official 5e programme content (from `docs/programmes/`) as the QCM generation context, not the student's uploaded documents.

#### Scenario: Programme content injected
- **WHEN** the topic is mapped to a subject
- **THEN** the corresponding programme markdown file is read server-side and injected into the `buildQcmLibrePrompt()` call as `programmeText`

#### Scenario: No programme file for subject
- **WHEN** the topic maps to a subject with no programme file available
- **THEN** the system falls back to Claude's general knowledge with a disclaimer: questions are based on typical 5e curriculum expectations
