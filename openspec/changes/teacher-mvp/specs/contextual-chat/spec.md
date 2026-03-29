## ADDED Requirements

### Requirement: User can chat with Claude about a sequence
The system SHALL provide a chat interface where the user can ask questions about the active sequence's documents. Claude's context includes all extracted document text from the sequence.

#### Scenario: Ask a question about uploaded content
- **WHEN** user types "Qui etait Charlemagne ?" in the chat and the sequence has a history document mentioning Charlemagne
- **THEN** Claude responds using information from the uploaded documents

#### Scenario: Question outside document scope
- **WHEN** user asks a question not covered by the uploaded documents
- **THEN** Claude indicates it cannot find the answer in the course documents and suggests uploading more material

### Requirement: User must select a sequence before chatting
The system SHALL require the user to select which sequence to chat about before starting a conversation.

#### Scenario: No sequence selected
- **WHEN** user navigates to the chat tab without a selected sequence
- **THEN** the system prompts the user to select a sequence from a list

#### Scenario: Sequence selected
- **WHEN** user selects a sequence
- **THEN** the chat becomes active with the sequence's documents as context

### Requirement: Chat is ephemeral
The chat history SHALL NOT be persisted in the database. It lives only in the browser state for the current session.

#### Scenario: Chat lost on navigation
- **WHEN** user navigates away from the chat page and comes back
- **THEN** the chat history is empty and a new conversation starts

### Requirement: Chat displays a loading state while Claude responds
The system SHALL show a typing indicator while waiting for Claude's response.

#### Scenario: Waiting for response
- **WHEN** user sends a message
- **THEN** a loading indicator is visible until Claude's response arrives and is displayed
