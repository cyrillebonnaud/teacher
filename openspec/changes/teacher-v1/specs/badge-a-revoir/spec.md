## ADDED Requirements

### Requirement: Sequences badge wrong answers for the next session
The system SHALL mark notions from wrong answers as "À revoir" on the sequence card, visible the next time the student opens the app.

#### Scenario: Badge appears after a QCM with mistakes
- **WHEN** user scores less than 10/10 and leaves the results screen
- **THEN** the sequence card in the list shows an "À revoir" badge with the count of notions to review (e.g. "3 notions à revoir")

#### Scenario: Badge clears after a perfect retry
- **WHEN** user retakes a QCM on the same sequence and scores 10/10
- **THEN** the "À revoir" badge is removed from the sequence card

#### Scenario: Badge persists across sessions
- **WHEN** user closes the app and reopens it the next day
- **THEN** the "À revoir" badge is still visible — it does not expire on a fixed schedule, only cleared by a perfect score

#### Scenario: Notions to review are stored per sequence
- **WHEN** a QCM is submitted with wrong answers
- **THEN** the wrong question texts are saved on the Evaluation (or Sequence) record so the badge count is accurate across app restarts
