# Changelog

All notable changes to BrightPath Play are documented here.
Entries are in reverse-chronological order (newest first).

---

## [Unreleased] — 2026-04-02

### Added — Autism-Friendly UI Revamp

#### New utility
- `lib/activity-meta.ts` — maps activity IDs to emoji and short labels (`getActivityMeta`).
  - `alphabet-cards` → `{ emoji: "🔤", shortLabel: "Letters" }`
  - `counting-cards` → `{ emoji: "🔢", shortLabel: "Numbers" }`
  - Unknown IDs → `{ emoji: "🎮", shortLabel: "Game" }`

#### Tests
- `__tests__/lib/activity-meta.test.ts` — 12 unit tests covering known IDs, unknown IDs, empty string, field existence, and idempotency.
- Total test count raised from 105 → 117 (all passing).

#### CSS — autism-friendly accessibility layer (bottom of `globals.css`)
- Base font size bumped from 16 px (browser default) to **18 px** for better readability.
- `@keyframes bp-pulse` — soft pulsing glow on the home-screen Play button to draw attention without being overwhelming.
- `@media (prefers-reduced-motion: reduce)` — animation is suppressed for users with motion sensitivity.
- `:focus-visible` global rule — 4 px orange focus ring for keyboard and switch-access users.
- `.play-progress-track` — progress bar height increased to **26 px** for clearer progress perception.
- `.play-last-card-badge` — warm badge shown when the child reaches the final card.
- `.play-complete-banner` + `.play-complete-emoji` — full-width celebration panel on the last card.
- `.play-sound-button-speaking` — green visual state on the Hear button while speech is playing.
- `.kid-picker-card-emoji` — large emoji display in activity picker cards.
- `.kid-picker-card-copy strong` — picker card titles enlarged to 1.5 rem.
- All `.play-nav-button` and `.play-sound-button` minimum height enforced at **64 px**.

#### Home page (`workbook-app.tsx`)
- Play button label changed to `🎮 Play`.
- Open button label changed to `📖 Open`.
- Caregiver callout button changed to `⚙️ Open caregiver area`.
- Activity picker cards now show the activity emoji from `getActivityMeta` above the title.

#### Play page (`play/page.tsx`)
- Back navigation button: `← Back` with clear arrow.
- Home link: `🏠 All games`.
- Next card button: `Next →`.
- All done button (last card): `⭐ All done`.
- Restart link: `↺ Start over`.
- `isLastCard` flag: when true, shows `🎉 Last card!` badge in the status row.
- Completion celebration banner (`play-complete-banner`) with `🌟` emoji, "Amazing work!" heading, and contextual instruction shown above the secondary stack on the last card.

#### Play controls (`play-controls.tsx`)
- Button text changed from `"Hear card"` / `"Playing..."` to `"🔊 Hear it"` / `"🔊 Playing…"`.
- Button gains `play-sound-button-speaking` CSS class while speech synthesis is active.

#### Activity detail page (`activities/[activityId]/page.tsx`)
- Back button: `← All games`.
- All Play buttons: `🎮 Play`.
- Apple set chip: `🍎 Apple set`.
- Mixed set chip: `🎨 Mixed set`.

### Added — Documentation consolidation
- `README.md` fully rewritten: autism-friendly design principles, activity descriptions, project structure, run instructions, environment variables, image credits, and known image limitations.
- `AGENT.md` created: authoritative guide for AI coding agents — core principles, repo layout, testing requirements, feature checklist, image guidance, train mode guidance, style conventions, and documentation maintenance rules.
- `CHANGELOG.md` created (this file): reverse-chronological change log.
- `.github/copilot-instructions.md` updated to defer to `AGENT.md`.

---

## Prior to 2026-04-02

- Initial Next.js prototype with Work / Train operating modes.
- Alphabet Cards activity (26 letters, real photo cards, speech synthesis).
- Counting Cards activity (1–20, apple set and mixed set).
- Caregiver Studio for AI-assisted card proposals via GitHub Copilot SDK.
- Supabase + local JSON fallback persistence.
- 105 Vitest unit tests across `play-config`, `base-catalog`, `catalog-store`, `schema`, and `copilot` modules.
