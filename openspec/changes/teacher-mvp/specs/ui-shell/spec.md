## ADDED Requirements

### Requirement: App uses safe-tank graphic charter
The system SHALL use the safe-tank design system: Tailwind 4 inline theme, system fonts, blue #2563eb primary, light theme (#f0f2f5 background), rounded-lg/xl containers.

#### Scenario: Visual consistency
- **WHEN** any page is rendered
- **THEN** it uses the safe-tank color palette, typography, and component patterns (buttons, cards, inputs)

### Requirement: Bottom navigation with two tabs
The system SHALL display a fixed bottom navigation bar with two tabs: "Sequences" and "Chat".

#### Scenario: Navigate between tabs
- **WHEN** user taps the "Chat" tab
- **THEN** the chat page is displayed and the Chat tab is highlighted in blue

#### Scenario: Active tab indicator
- **WHEN** user is on the sequences page
- **THEN** the Sequences tab icon and label are blue (#2563eb) and the Chat tab is gray

### Requirement: Responsive layout
The system SHALL be usable on mobile (320px+), tablet (768px+), and desktop (1024px+) without horizontal scrolling.

#### Scenario: Mobile layout
- **WHEN** viewport is less than 768px
- **THEN** content is single-column, full-width, with bottom nav visible

#### Scenario: Tablet and desktop layout
- **WHEN** viewport is 768px or wider
- **THEN** content has a max-width container centered on screen, bottom nav remains

### Requirement: E2E tests cover all user flows
The system SHALL include Playwright E2E tests covering sequences CRUD, document upload, QCM generation/answer/submit/retry, chat interaction, and navigation. Tests run headless on Chromium with a single worker.

#### Scenario: Tests pass on local dev server
- **WHEN** `npm run test:e2e` is executed
- **THEN** all Playwright tests pass against the local Next.js dev server (auto-started by Playwright config)

#### Scenario: Tests organized by feature
- **WHEN** examining the tests/ directory
- **THEN** test files are organized by feature domain (sequences.spec.ts, documents.spec.ts, qcm.spec.ts, chat.spec.ts)
