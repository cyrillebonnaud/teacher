## ADDED Requirements

### Requirement: User can upload PDF documents
The system SHALL accept PDF files (text-native or scanned) up to 10 pages per document.

#### Scenario: Upload a text-native PDF
- **WHEN** user uploads a PDF with selectable text
- **THEN** the system extracts text using pdf-parse, stores the file on disk, and saves the extracted text in the database

#### Scenario: Upload a scanned PDF
- **WHEN** user uploads a PDF that contains only images (scanned document)
- **THEN** the system falls back to Claude vision OCR, converts pages to images, sends them to Claude, and saves the extracted text

#### Scenario: PDF exceeds page limit
- **WHEN** user uploads a PDF with more than 10 pages
- **THEN** the system rejects the upload with a clear error message

### Requirement: User can upload photos of handwritten notes
The system SHALL accept image files (JPEG, PNG) of handwritten notes and extract text via Claude vision.

#### Scenario: Upload a photo of a notebook page
- **WHEN** user uploads a JPEG photo of a handwritten notebook page
- **THEN** the system sends the image to Claude vision for OCR and saves the extracted text (best effort for handwriting)

### Requirement: User can review and edit extracted text
The system SHALL display the extracted text after upload and allow the user to edit it before it is used for QCM generation.

#### Scenario: Review extracted text
- **WHEN** document upload and OCR complete
- **THEN** the extracted text is displayed in an editable text area on the document detail view

#### Scenario: Edit extracted text
- **WHEN** user modifies the extracted text and saves
- **THEN** the updated text is persisted and used for all future QCM generation and chat context

### Requirement: Documents are stored on local disk
The system SHALL store uploaded files in `public/uploads/{sequenceId}/` and record the file path in the database.

#### Scenario: File storage
- **WHEN** a document is uploaded
- **THEN** the file is saved to `public/uploads/{sequenceId}/{filename}` and the path is stored in the Document record
