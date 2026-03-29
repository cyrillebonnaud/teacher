## 1. Project Setup

- [x] 1.1 Initialize Next.js 16 project with TypeScript, Tailwind 4, App Router
- [x] 1.2 Set up Prisma with SQLite provider, create schema (Sequence, Document, Evaluation)
- [x] 1.3 Create globals.css with safe-tank design tokens (colors, fonts, animations)
- [x] 1.4 Create root layout with bottom navigation (Sequences | Chat)
- [x] 1.5 Set up Playwright config (chromium, single worker, auto-start dev server)
- [x] 1.6 Add .env.local template with ANTHROPIC_API_KEY
- [x] 1.7 Create lib/claude.ts (Anthropic SDK client singleton)

## 2. Sequence Management

- [x] 2.1 Create sequences list page with empty state
- [x] 2.2 Create new sequence form (name, subject, emoji picker)
- [x] 2.3 Create sequence detail page (documents + evaluations sections)
- [x] 2.4 Add delete sequence with confirmation modal
- [x] 2.5 Write Playwright tests for sequences CRUD (sequences.spec.ts)

## 3. Document Ingestion

- [x] 3.1 Create upload page with file input (PDF + images, drag & drop)
- [x] 3.2 Implement PDF text extraction with pdf-parse (text-native PDFs)
- [x] 3.3 Implement Claude vision OCR fallback (scanned PDFs + photos)
- [x] 3.4 Create document detail view with editable raw_text textarea
- [x] 3.5 Store uploaded files in public/uploads/{sequenceId}/
- [x] 3.6 Add 10-page limit validation for PDFs
- [x] 3.7 Write Playwright tests for document upload and edit (documents.spec.ts)

## 4. QCM Engine

- [x] 4.1 Create QCM level selection page (3 levels with visual cards)
- [x] 4.2 Implement QCM generation via Claude API (prompt with difficulty levels + few-shot examples)
- [x] 4.3 Create QCM answering UI (question card, 4 choices, progress indicator)
- [x] 4.4 Implement on-the-fly answer saving (server action per answer)
- [x] 4.5 Implement submit + correction page (score, stars, per-question feedback)
- [x] 4.6 Implement "Recommencer" (regenerate different questions at same level)
- [x] 4.7 Implement "Tenter niveau suivant" navigation
- [x] 4.8 Handle resume of in-progress QCM (restore saved answers on page load)
- [x] 4.9 Write Playwright tests for QCM flow (qcm.spec.ts): generate, answer, submit, retry

## 5. Contextual Chat

- [x] 5.1 Create chat page with sequence selector
- [x] 5.2 Implement chat UI (message list, input, typing indicator)
- [x] 5.3 Implement Claude streaming response with sequence documents as system context
- [x] 5.4 Ensure chat state is ephemeral (React state only, no DB persistence)
- [x] 5.5 Write Playwright tests for chat flow (chat.spec.ts)

## 6. Polish & Integration

- [x] 6.1 Responsive layout testing (mobile 320px, tablet 768px, desktop 1024px)
- [x] 6.2 Add loading states and error handling across all pages
- [x] 6.3 Create test helpers (helpers.ts: create sequence, upload doc, etc.)
- [x] 6.4 Run full Playwright suite headless and fix failures until green
- [x] 6.5 Create CLAUDE.md with project conventions and run instructions
- [x] 6.6 Create README.md with setup and usage instructions
