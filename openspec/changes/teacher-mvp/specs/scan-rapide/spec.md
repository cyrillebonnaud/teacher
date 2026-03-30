## ADDED Requirements

### Requirement: User can capture multiple photos in one session
The system SHALL provide a "scan rapide" entry point that opens the device camera directly and allows capturing multiple photos before uploading.

#### Scenario: Launch scan rapide from sequence detail
- **WHEN** user taps "Scanner mes cours" on a sequence detail page
- **THEN** the device camera opens immediately (no intermediate screen)

#### Scenario: Capture multiple photos
- **WHEN** user takes a photo
- **THEN** a thumbnail is added to a preview strip at the bottom of the camera view, and the camera stays open for the next capture

#### Scenario: Review and confirm batch
- **WHEN** user taps "Terminer" after capturing photos
- **THEN** a review screen shows all captured photos as thumbnails with the ability to delete individual ones before uploading

#### Scenario: Upload batch
- **WHEN** user confirms the batch on the review screen
- **THEN** all photos are uploaded and processed sequentially — each triggers OCR extraction and is saved as a Document on the sequence. A progress indicator shows "2/5 traités…"

#### Scenario: Single photo fallback
- **WHEN** user taps "Ajouter une photo" (existing flow)
- **THEN** the existing single-file upload flow is used (no change)

### Requirement: Scan rapide is the hero entry point on first use
The system SHALL surface scan rapide prominently when a sequence has no documents yet.

#### Scenario: Empty sequence state
- **WHEN** user opens a sequence with no documents
- **THEN** the empty state shows a large "📸 Scanner mes cours" CTA as the primary action, above the secondary "Ajouter un fichier" option

#### Scenario: Sequence already has documents
- **WHEN** user opens a sequence with existing documents
- **THEN** "Scanner mes cours" appears as a standard action button alongside "Ajouter un fichier"
