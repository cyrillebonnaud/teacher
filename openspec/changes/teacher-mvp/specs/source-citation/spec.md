## ADDED Requirements

### Requirement: Each correct answer cites its source passage from the course
The system SHALL display the excerpt from the uploaded course document that supports the correct answer, shown on the results screen after submission.

#### Scenario: View source after submission
- **WHEN** user submits a QCM and views results
- **THEN** each question shows a "Source :" label with a 1-2 sentence excerpt from the course document that justifies the correct answer

#### Scenario: Source is generated alongside the question
- **WHEN** Claude generates the QCM
- **THEN** each question object includes a `source` field with the relevant course excerpt (added to the JSON schema)

#### Scenario: Source not found
- **WHEN** Claude cannot identify a specific excerpt for a question
- **THEN** the `source` field is omitted and no source label is shown for that question
