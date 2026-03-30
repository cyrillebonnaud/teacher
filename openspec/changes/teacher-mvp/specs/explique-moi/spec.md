## ADDED Requirements

### Requirement: User can open chat pre-filled from a wrong answer
The system SHALL show an "Explique-moi" button on each incorrectly answered question in the results screen, opening the chat with a pre-filled message.

#### Scenario: Open chat from a wrong answer
- **WHEN** user taps "Explique-moi" on a wrong answer in the results screen
- **THEN** the chat page opens with the sequence pre-selected and the input pre-filled with: "Je n'ai pas compris cette question : [question text]. La bonne réponse était [correct answer]. Peux-tu m'expliquer ?"

#### Scenario: Pre-filled message is editable
- **WHEN** the chat opens with the pre-filled message
- **THEN** the message is in the input field and not yet sent — the student can edit it before sending

#### Scenario: Correct answers have no button
- **WHEN** a question was answered correctly
- **THEN** no "Explique-moi" button is shown for that question
